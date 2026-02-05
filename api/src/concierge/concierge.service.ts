import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';

@Injectable()
export class ConciergeService {
    constructor(private prisma: PrismaService) { }

    async createCheckIn(dto: CreateCheckInDto) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Create the CheckIn
            const checkIn = await tx.checkIn.create({
                data: {
                    patientId: dto.patientId,
                    type: dto.type,
                    date: dto.date ? new Date(dto.date) : new Date(),
                    notes: dto.notes,
                },
            });

            // 2. Create Metrics
            if (dto.pillars && dto.pillars.length > 0) {
                await tx.pillarMetric.createMany({
                    data: dto.pillars.map((p) => ({
                        checkInId: checkIn.id,
                        category: p.category,
                        score: p.score,
                        notes: p.notes,
                    })),
                });
            }

            // 3. Create Adherence Records
            if (dto.adherence && dto.adherence.length > 0) {
                await tx.regimenAdherence.createMany({
                    data: dto.adherence.map((a) => ({
                        checkInId: checkIn.id,
                        regimenId: a.regimenId,
                        adherent: a.adherent,
                        notes: a.notes,
                    })),
                });
            }

            return checkIn;
        });
    }

    async getPatientTrends(patientId: string) {
        return this.prisma.checkIn.findMany({
            where: { patientId },
            include: {
                metrics: true,
                adherence: true,
            },
            orderBy: { date: 'asc' },
        });
    }

    async getPatientTimeline(patientId: string) {
        // 1. Fetch all event types concurrently
        const [notes, labs, checkIns, appointments] = await Promise.all([
            this.prisma.clinicalNote.findMany({
                where: { patientId },
                include: { provider: true, concierge: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.labPanel.findMany({
                where: { patientId },
                orderBy: { collectionDate: 'desc' },
            }),
            this.prisma.checkIn.findMany({
                where: { patientId },
                include: { metrics: true },
                orderBy: { date: 'desc' },
            }),
            this.prisma.appointment.findMany({
                where: { patientId },
                orderBy: { scheduledAt: 'desc' },
            }),
        ]);

        // 2. Normalize to TimelineEvent interface
        const events = [
            ...notes.map(n => ({
                id: n.id,
                type: 'NOTE' as const,
                date: n.createdAt,
                title: n.assessment || 'Clinical Note',
                subtitle: n.plan,
                metadata: {
                    author: n.provider ? `Dr. ${n.provider.lastName}` : 'Concierge',
                    status: n.status
                }
            })),
            ...labs.map(l => ({
                id: l.id,
                type: 'LAB' as const,
                date: l.collectionDate,
                title: l.panelName,
                subtitle: l.status,
                metadata: {
                    provider: l.provider,
                    status: l.status
                }
            })),
            ...checkIns.map(c => ({
                id: c.id,
                type: 'CHECK_IN' as const,
                date: c.date,
                title: `${c.type} Check-In`,
                subtitle: c.notes,
                metadata: {
                    metrics: c.metrics
                }
            })),
            ...appointments.map(a => ({
                id: a.id,
                type: 'APPOINTMENT' as const,
                date: a.scheduledAt,
                title: a.type,
                subtitle: a.status,
                metadata: {
                    status: a.status
                }
            }))
        ];

        // 3. Sort by date descending
        return events.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
}
