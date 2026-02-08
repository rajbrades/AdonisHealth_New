"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegimenService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let RegimenService = class RegimenService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async create(userId, createDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { patientProfile: true },
        });
        if (!user?.patientProfile) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const patientId = user.patientProfile.id;
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
                source: 'EXTERNAL',
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
        await this.auditService.log(userId, audit_service_1.AuditAction.EDIT_PATIENT_PROFILE, `patient:${patientId}`, undefined, { action: 'add_regimen', name: createDto.name, type: createDto.type });
        return regimen;
    }
    async findAll(userId, activeOnly = false) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { patientProfile: true },
        });
        if (!user?.patientProfile) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const where = { patientId: user.patientProfile.id };
        if (activeOnly) {
            where.active = true;
        }
        return this.prisma.activeRegimen.findMany({
            where,
            include: {
                changeHistory: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: [
                { active: 'desc' },
                { startDate: 'desc' },
            ],
        });
    }
    async findOne(userId, regimenId) {
        const regimen = await this.prisma.activeRegimen.findUnique({
            where: { id: regimenId },
            include: {
                patient: {
                    include: { user: true },
                },
            },
        });
        if (!regimen) {
            throw new common_1.NotFoundException('Regimen not found');
        }
        if (regimen.patient.user.id !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return regimen;
    }
    async update(userId, regimenId, updateDto) {
        const existing = await this.findOne(userId, regimenId);
        const changes = [];
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
            return existing;
        }
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
        await this.auditService.log(userId, audit_service_1.AuditAction.EDIT_PATIENT_PROFILE, `patient:${existing.patientId}`, undefined, { action: 'update_regimen', name: existing.name, changes: changes.map((c) => c.field) });
        return updated;
    }
    async discontinue(userId, regimenId, discontinueDto) {
        const existing = await this.findOne(userId, regimenId);
        if (!existing.active) {
            throw new common_1.ForbiddenException('Regimen is already discontinued');
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
        await this.auditService.log(userId, audit_service_1.AuditAction.EDIT_PATIENT_PROFILE, `patient:${existing.patientId}`, undefined, { action: 'discontinue_regimen', name: existing.name, type: existing.type });
        return updated;
    }
    async getHistory(userId, regimenId) {
        await this.findOne(userId, regimenId);
        return this.prisma.regimenChangeLog.findMany({
            where: { regimenId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.RegimenService = RegimenService;
exports.RegimenService = RegimenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], RegimenService);
//# sourceMappingURL=regimen.service.js.map