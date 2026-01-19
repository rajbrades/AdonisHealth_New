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
}
