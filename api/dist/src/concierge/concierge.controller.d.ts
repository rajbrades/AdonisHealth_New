import { ConciergeService } from './concierge.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
export declare class ConciergeController {
    private readonly conciergeService;
    constructor(conciergeService: ConciergeService);
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
    getTrends(id: string): Promise<({
        metrics: {
            id: string;
            notes: string | null;
            checkInId: string;
            category: string;
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
