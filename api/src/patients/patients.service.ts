import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.patientProfile.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                },
                clinicalNotes: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                labResults: {
                    orderBy: { testDate: 'desc' },
                    take: 1,
                },
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.patientProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    }
                },
                labResults: true,
                clinicalNotes: true,
                orders: true,
                goals: true,
                regimen: true,
                wearableData: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            },
        });
    }
}
