import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService, AuditAction } from '../audit/audit.service';
import { CreateRegimenDto } from './dto/create-regimen.dto';
import { UpdateRegimenDto, DiscontinueRegimenDto } from './dto/update-regimen.dto';

@Injectable()
export class RegimenService {
    constructor(
        private prisma: PrismaService,
        private auditService: AuditService,
    ) { }

    /**
     * Create a new regimen (medication or supplement)
     */
    async create(userId: string, createDto: CreateRegimenDto) {
        // Get patient profile
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { patientProfile: true },
        });

        if (!user?.patientProfile) {
            throw new NotFoundException('Patient profile not found');
        }

        const patientId = user.patientProfile.id;

        // Create regimen and initial change log in transaction
        const regimen = await this.prisma.activeRegimen.create({
            data: {
                patientId,
                name: createDto.name,
                dosage: createDto.dosage,
                frequency: createDto.frequency,
                type: createDto.type,
                notes: createDto.notes,
                startDate: createDto.startDate ? new Date(createDto.startDate) : new Date(),
                active: true,
                source: 'EXTERNAL', // Patient-reported
                changeHistory: {
                    create: {
                        changeType: 'CREATED',
                        changedBy: 'PATIENT',
                        userId: userId,
                        reason: createDto.reason || `Added new ${createDto.type === 'RX' ? 'medication' : 'supplement'}`,
                        notes: `Initial creation: ${createDto.name}`,
                    },
                },
            },
            include: {
                changeHistory: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        // Audit log
        await this.auditService.log(
            userId,
            AuditAction.EDIT_PATIENT_PROFILE,
            `patient:${patientId}`,
            undefined,
            { action: 'add_regimen', name: createDto.name, type: createDto.type },
        );

        return regimen;
    }

    /**
     * Get all regimens for a patient
     */
    async findAll(userId: string, activeOnly = false) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { patientProfile: true },
        });

        if (!user?.patientProfile) {
            throw new NotFoundException('Patient profile not found');
        }

        const where: any = { patientId: user.patientProfile.id };
        if (activeOnly) {
            where.active = true;
        }

        return this.prisma.activeRegimen.findMany({
            where,
            include: {
                changeHistory: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // Just the most recent change
                },
            },
            orderBy: [
                { active: 'desc' }, // Active first
                { startDate: 'desc' }, // Then by start date
            ],
        });
    }

    /**
     * Get a single regimen by ID
     */
    async findOne(userId: string, regimenId: string) {
        const regimen = await this.prisma.activeRegimen.findUnique({
            where: { id: regimenId },
            include: {
                patient: {
                    include: { user: true },
                },
            },
        });

        if (!regimen) {
            throw new NotFoundException('Regimen not found');
        }

        // Verify ownership
        if (regimen.patient.user.id !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return regimen;
    }

    /**
     * Update a regimen
     */
    async update(userId: string, regimenId: string, updateDto: UpdateRegimenDto) {
        // Verify ownership
        const existing = await this.findOne(userId, regimenId);

        // Track what changed
        const changes: Array<{ field: string; oldValue: string; newValue: string }> = [];

        if (updateDto.dosage && updateDto.dosage !== existing.dosage) {
            changes.push({
                field: 'dosage',
                oldValue: existing.dosage || '',
                newValue: updateDto.dosage,
            });
        }

        if (updateDto.frequency && updateDto.frequency !== existing.frequency) {
            changes.push({
                field: 'frequency',
                oldValue: existing.frequency || '',
                newValue: updateDto.frequency,
            });
        }

        if (updateDto.notes && updateDto.notes !== existing.notes) {
            changes.push({
                field: 'notes',
                oldValue: existing.notes || '',
                newValue: updateDto.notes,
            });
        }

        if (changes.length === 0) {
            return existing; // No changes
        }

        // Update regimen and create change logs
        const updated = await this.prisma.activeRegimen.update({
            where: { id: regimenId },
            data: {
                dosage: updateDto.dosage || existing.dosage,
                frequency: updateDto.frequency || existing.frequency,
                notes: updateDto.notes || existing.notes,
                changeHistory: {
                    create: changes.map((change) => ({
                        changeType: 'MODIFIED',
                        fieldChanged: change.field,
                        oldValue: change.oldValue,
                        newValue: change.newValue,
                        changedBy: 'PATIENT',
                        userId: userId,
                        reason: updateDto.reason || `Updated ${change.field}`,
                    })),
                },
            },
            include: {
                changeHistory: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        // Audit log
        await this.auditService.log(
            userId,
            AuditAction.EDIT_PATIENT_PROFILE,
            `patient:${existing.patientId}`,
            undefined,
            { action: 'update_regimen', name: existing.name, changes: changes.map((c) => c.field) },
        );

        return updated;
    }

    /**
     * Discontinue a regimen
     */
    async discontinue(userId: string, regimenId: string, discontinueDto: DiscontinueRegimenDto) {
        // Verify ownership
        const existing = await this.findOne(userId, regimenId);

        if (!existing.active) {
            throw new ForbiddenException('Regimen is already discontinued');
        }

        const endDate = discontinueDto.endDate ? new Date(discontinueDto.endDate) : new Date();

        const updated = await this.prisma.activeRegimen.update({
            where: { id: regimenId },
            data: {
                active: false,
                endDate,
                changeHistory: {
                    create: {
                        changeType: 'DISCONTINUED',
                        changedBy: 'PATIENT',
                        userId: userId,
                        reason: discontinueDto.reason || 'Discontinued by patient',
                        notes: `Discontinued on ${endDate.toISOString()}`,
                    },
                },
            },
            include: {
                changeHistory: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        // Audit log
        await this.auditService.log(
            userId,
            AuditAction.EDIT_PATIENT_PROFILE,
            `patient:${existing.patientId}`,
            undefined,
            { action: 'discontinue_regimen', name: existing.name, type: existing.type },
        );

        return updated;
    }

    /**
     * Get change history for a regimen
     */
    async getHistory(userId: string, regimenId: string) {
        // Verify ownership
        await this.findOne(userId, regimenId);

        return this.prisma.regimenChangeLog.findMany({
            where: { regimenId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
