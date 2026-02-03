import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum AuditAction {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  REGISTER = 'REGISTER',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',

  // PHI Access
  VIEW_PATIENT_PROFILE = 'VIEW_PATIENT_PROFILE',
  EDIT_PATIENT_PROFILE = 'EDIT_PATIENT_PROFILE',
  VIEW_LAB = 'VIEW_LAB',
  UPLOAD_LAB = 'UPLOAD_LAB',
  EDIT_LAB = 'EDIT_LAB',
  DELETE_LAB = 'DELETE_LAB',
  
  // Clinical Notes
  VIEW_NOTE = 'VIEW_NOTE',
  CREATE_NOTE = 'CREATE_NOTE',
  EDIT_NOTE = 'EDIT_NOTE',
  DELETE_NOTE = 'DELETE_NOTE',
  FINALIZE_NOTE = 'FINALIZE_NOTE',

  // Orders & Quotes
  CREATE_QUOTE = 'CREATE_QUOTE',
  APPROVE_QUOTE = 'APPROVE_QUOTE',
  CREATE_ORDER = 'CREATE_ORDER',
  VIEW_ORDER = 'VIEW_ORDER',

  // Check-ins
  VIEW_CHECKIN = 'VIEW_CHECKIN',
  CREATE_CHECKIN = 'CREATE_CHECKIN',
  EDIT_CHECKIN = 'EDIT_CHECKIN',

  // Administrative
  VIEW_AUDIT_LOG = 'VIEW_AUDIT_LOG',
  EXPORT_DATA = 'EXPORT_DATA',
  SYSTEM_CONFIG_CHANGE = 'SYSTEM_CONFIG_CHANGE',
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log an audit event for HIPAA compliance
   * @param userId - ID of the user performing the action
   * @param action - Type of action (from AuditAction enum)
   * @param resource - Resource identifier (e.g., "/labs/123", "patient:456")
   * @param ipAddress - IP address of the request (optional)
   * @param metadata - Additional context (optional, stored as JSON string)
   */
  async log(
    userId: string,
    action: AuditAction,
    resource: string,
    ipAddress?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
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
    } catch (error) {
      // Log to console but don't throw - audit logging should not break the application
      console.error('Failed to create audit log:', error);
    }
  }

  /**
   * Legacy method for backward compatibility
   */
  async logAccess(userId: string, action: string, resource: string, ipAddress?: string) {
    return this.log(userId, action as AuditAction, resource, ipAddress);
  }

  /**
   * Get audit logs for a specific user (for compliance review)
   */
  async getUserAuditLogs(userId: string, limit = 100) {
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

  /**
   * Get audit logs for a specific resource (e.g., all access to a patient's labs)
   */
  async getResourceAuditLogs(resource: string, limit = 100) {
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

  /**
   * Get audit logs by action type (e.g., all failed login attempts)
   */
  async getAuditLogsByAction(action: AuditAction, limit = 100) {
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

  /**
   * Get audit logs within a date range (for compliance reporting)
   */
  async getAuditLogsByDateRange(startDate: Date, endDate: Date) {
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

  /**
   * Get failed login attempts for security monitoring
   */
  async getFailedLoginAttempts(email: string, since: Date) {
    // Note: We need to store email in metadata for failed attempts
    // since we don't have a userId yet
    const logs = await this.prisma.auditLog.findMany({
      where: {
        action: AuditAction.LOGIN_FAILED,
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'desc' },
    });

    // Filter by email in metadata
    return logs.filter((log) => {
      if (log.metadata) {
        try {
          const metadata = JSON.parse(log.metadata as string);
          return metadata.email === email;
        } catch {
          return false;
        }
      }
      return false;
    });
  }
}
