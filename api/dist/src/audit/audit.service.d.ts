import { PrismaService } from '../prisma/prisma.service';
export declare enum AuditAction {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    LOGIN_FAILED = "LOGIN_FAILED",
    REGISTER = "REGISTER",
    PASSWORD_CHANGE = "PASSWORD_CHANGE",
    PASSWORD_RESET = "PASSWORD_RESET",
    VIEW_PATIENT_PROFILE = "VIEW_PATIENT_PROFILE",
    EDIT_PATIENT_PROFILE = "EDIT_PATIENT_PROFILE",
    VIEW_LAB = "VIEW_LAB",
    UPLOAD_LAB = "UPLOAD_LAB",
    EDIT_LAB = "EDIT_LAB",
    DELETE_LAB = "DELETE_LAB",
    VIEW_NOTE = "VIEW_NOTE",
    CREATE_NOTE = "CREATE_NOTE",
    EDIT_NOTE = "EDIT_NOTE",
    DELETE_NOTE = "DELETE_NOTE",
    FINALIZE_NOTE = "FINALIZE_NOTE",
    CREATE_QUOTE = "CREATE_QUOTE",
    APPROVE_QUOTE = "APPROVE_QUOTE",
    CREATE_ORDER = "CREATE_ORDER",
    VIEW_ORDER = "VIEW_ORDER",
    VIEW_CHECKIN = "VIEW_CHECKIN",
    CREATE_CHECKIN = "CREATE_CHECKIN",
    EDIT_CHECKIN = "EDIT_CHECKIN",
    VIEW_AUDIT_LOG = "VIEW_AUDIT_LOG",
    EXPORT_DATA = "EXPORT_DATA",
    SYSTEM_CONFIG_CHANGE = "SYSTEM_CONFIG_CHANGE"
}
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(userId: string, action: AuditAction, resource: string, ipAddress?: string, metadata?: Record<string, any>): Promise<void>;
    logAccess(userId: string, action: string, resource: string, ipAddress?: string): Promise<void>;
    getUserAuditLogs(userId: string, limit?: number): Promise<({
        user: {
            email: string;
            role: string;
        };
    } & {
        id: string;
        userId: string;
        metadata: string | null;
        action: string;
        resource: string;
        ipAddress: string | null;
        timestamp: Date;
    })[]>;
    getResourceAuditLogs(resource: string, limit?: number): Promise<({
        user: {
            email: string;
            role: string;
        };
    } & {
        id: string;
        userId: string;
        metadata: string | null;
        action: string;
        resource: string;
        ipAddress: string | null;
        timestamp: Date;
    })[]>;
    getAuditLogsByAction(action: AuditAction, limit?: number): Promise<({
        user: {
            email: string;
            role: string;
        };
    } & {
        id: string;
        userId: string;
        metadata: string | null;
        action: string;
        resource: string;
        ipAddress: string | null;
        timestamp: Date;
    })[]>;
    getAuditLogsByDateRange(startDate: Date, endDate: Date): Promise<({
        user: {
            email: string;
            role: string;
        };
    } & {
        id: string;
        userId: string;
        metadata: string | null;
        action: string;
        resource: string;
        ipAddress: string | null;
        timestamp: Date;
    })[]>;
    getFailedLoginAttempts(email: string, since: Date): Promise<{
        id: string;
        userId: string;
        metadata: string | null;
        action: string;
        resource: string;
        ipAddress: string | null;
        timestamp: Date;
    }[]>;
}
