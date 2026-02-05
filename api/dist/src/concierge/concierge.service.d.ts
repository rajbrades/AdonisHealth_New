import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
export declare class ConciergeService {
    private prisma;
    constructor(prisma: PrismaService);
    createCheckIn(dto: CreateCheckInDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        date: Date;
        type: string;
        notes: string | null;
        advisorNotes: string | null;
    }>;
    getPatientTrends(patientId: string): Promise<({
        metrics: {
            id: string;
            category: string;
            notes: string | null;
            score: number;
            checkInId: string;
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
        patientId: string;
        date: Date;
        type: string;
        notes: string | null;
        advisorNotes: string | null;
    })[]>;
    getPatientTimeline(patientId: string): Promise<({
        id: string;
        type: "NOTE";
        date: Date;
        title: string;
        subtitle: string | null;
        metadata: {
            author: string;
            status: string;
        };
    } | {
        id: string;
        type: "LAB";
        date: Date;
        title: string;
        subtitle: string;
        metadata: {
            provider: string;
            status: string;
        };
    } | {
        id: string;
        type: "CHECK_IN";
        date: Date;
        title: string;
        subtitle: string | null;
        metadata: {
            metrics: {
                id: string;
                category: string;
                notes: string | null;
                score: number;
                checkInId: string;
            }[];
        };
    } | {
        id: string;
        type: "APPOINTMENT";
        date: Date;
        title: string;
        subtitle: string;
        metadata: {
            status: string;
        };
    })[]>;
}
