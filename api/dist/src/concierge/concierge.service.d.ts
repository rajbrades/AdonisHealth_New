import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
export declare class ConciergeService {
    private prisma;
    constructor(prisma: PrismaService);
    createCheckIn(dto: CreateCheckInDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        patientId: string;
        date: Date;
        advisorNotes: string | null;
    }>;
    getPatientTrends(patientId: string): Promise<({
        metrics: {
            id: string;
            category: string;
            notes: string | null;
            checkInId: string;
            score: number;
        }[];
        adherence: {
            id: string;
            notes: string | null;
            checkInId: string;
            regimenId: string;
            adherent: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        patientId: string;
        date: Date;
        advisorNotes: string | null;
    })[]>;
}
