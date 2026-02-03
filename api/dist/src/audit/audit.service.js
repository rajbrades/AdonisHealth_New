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
exports.AuditService = exports.AuditAction = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
var AuditAction;
(function (AuditAction) {
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["LOGIN_FAILED"] = "LOGIN_FAILED";
    AuditAction["REGISTER"] = "REGISTER";
    AuditAction["PASSWORD_CHANGE"] = "PASSWORD_CHANGE";
    AuditAction["PASSWORD_RESET"] = "PASSWORD_RESET";
    AuditAction["VIEW_PATIENT_PROFILE"] = "VIEW_PATIENT_PROFILE";
    AuditAction["EDIT_PATIENT_PROFILE"] = "EDIT_PATIENT_PROFILE";
    AuditAction["VIEW_LAB"] = "VIEW_LAB";
    AuditAction["UPLOAD_LAB"] = "UPLOAD_LAB";
    AuditAction["EDIT_LAB"] = "EDIT_LAB";
    AuditAction["DELETE_LAB"] = "DELETE_LAB";
    AuditAction["VIEW_NOTE"] = "VIEW_NOTE";
    AuditAction["CREATE_NOTE"] = "CREATE_NOTE";
    AuditAction["EDIT_NOTE"] = "EDIT_NOTE";
    AuditAction["DELETE_NOTE"] = "DELETE_NOTE";
    AuditAction["FINALIZE_NOTE"] = "FINALIZE_NOTE";
    AuditAction["CREATE_QUOTE"] = "CREATE_QUOTE";
    AuditAction["APPROVE_QUOTE"] = "APPROVE_QUOTE";
    AuditAction["CREATE_ORDER"] = "CREATE_ORDER";
    AuditAction["VIEW_ORDER"] = "VIEW_ORDER";
    AuditAction["VIEW_CHECKIN"] = "VIEW_CHECKIN";
    AuditAction["CREATE_CHECKIN"] = "CREATE_CHECKIN";
    AuditAction["EDIT_CHECKIN"] = "EDIT_CHECKIN";
    AuditAction["VIEW_AUDIT_LOG"] = "VIEW_AUDIT_LOG";
    AuditAction["EXPORT_DATA"] = "EXPORT_DATA";
    AuditAction["SYSTEM_CONFIG_CHANGE"] = "SYSTEM_CONFIG_CHANGE";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
let AuditService = class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(userId, action, resource, ipAddress, metadata) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId,
                    action,
                    resource,
                    ipAddress: ipAddress || 'unknown',
                    metadata: metadata ? JSON.stringify(metadata) : undefined,
                },
            });
        }
        catch (error) {
            console.error('Failed to create audit log:', error);
        }
    }
    async logAccess(userId, action, resource, ipAddress) {
        return this.log(userId, action, resource, ipAddress);
    }
    async getUserAuditLogs(userId, limit = 100) {
        return this.prisma.auditLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async getResourceAuditLogs(resource, limit = 100) {
        return this.prisma.auditLog.findMany({
            where: { resource },
            orderBy: { timestamp: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async getAuditLogsByAction(action, limit = 100) {
        return this.prisma.auditLog.findMany({
            where: { action },
            orderBy: { timestamp: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async getAuditLogsByDateRange(startDate, endDate) {
        return this.prisma.auditLog.findMany({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async getFailedLoginAttempts(email, since) {
        const logs = await this.prisma.auditLog.findMany({
            where: {
                action: AuditAction.LOGIN_FAILED,
                timestamp: { gte: since },
            },
            orderBy: { timestamp: 'desc' },
        });
        return logs.filter((log) => {
            if (log.metadata) {
                try {
                    const metadata = JSON.parse(log.metadata);
                    return metadata.email === email;
                }
                catch {
                    return false;
                }
            }
            return false;
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map