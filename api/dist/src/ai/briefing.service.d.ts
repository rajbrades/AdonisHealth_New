import { PrismaService } from '../prisma/prisma.service';
export declare class BriefingService {
    private prisma;
    private anthropic;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateBriefingForAppointment(appointmentId: string): Promise<any>;
}
