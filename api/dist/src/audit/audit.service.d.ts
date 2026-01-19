import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    logAccess(userId: string, action: string, resource: string, ipAddress?: string): Promise<{
        id: string;
        userId: string;
        action: string;
        resource: string;
        ipAddress: string | null;
        timestamp: Date;
    }>;
}
