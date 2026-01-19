import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async logAccess(userId: string, action: string, resource: string, ipAddress?: string) {
        return this.prisma.auditLog.create({
            data: {
                userId,
                action,
                resource,
                ipAddress,
            },
        });
    }
}
