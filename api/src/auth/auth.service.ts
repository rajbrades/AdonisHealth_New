import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService, AuditAction } from '../audit/audit.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordValidator } from './password.validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly BCRYPT_ROUNDS = 10;
  private readonly MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);
  private readonly LOCKOUT_DURATION_MINUTES = parseInt(process.env.LOCKOUT_DURATION_MINUTES || '30', 10);
  private readonly PASSWORD_EXPIRATION_DAYS = parseInt(process.env.PASSWORD_EXPIRATION_DAYS || '90', 10);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) { }

  /**
   * Register a new patient user with HIPAA-compliant audit logging
   */
  async register(registerDto: RegisterDto, ipAddress?: string) {
    const { email, password, firstName, lastName, dob, gender } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate password strength
    PasswordValidator.validate(password);

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, this.BCRYPT_ROUNDS);

    // Create user and profile in transaction
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'PATIENT',
        passwordChangedAt: new Date(), // Track password creation time
        patientProfile: {
          create: {
            firstName,
            lastName,
            dob: new Date(dob),
            gender,
            goals: {
              create: [
                ...(registerDto.goals || []).map(g => ({
                  type: 'SHORT_TERM',
                  description: g,
                  status: 'ACTIVE'
                })),
                ...(registerDto.symptoms || []).map(s => ({
                  type: 'SYMPTOM',
                  description: s,
                  status: 'ACTIVE'
                }))
              ]
            }
          },
        },
      },
    });

    // Audit log: User registration
    await this.auditService.log(
      user.id,
      AuditAction.REGISTER,
      `user:${user.id}`,
      ipAddress,
      { email, role: user.role },
    );

    // Auto-login after registration
    return this.login({ email, password }, ipAddress);
  }

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Login with account lockout protection and audit logging
   */
  async login(loginDto: LoginDto, ipAddress?: string) {
    const { email, password } = loginDto;

    // Check for account lockout
    await this.checkAccountLockout(email);

    // Validate credentials
    const user = await this.validateUser(email, password);

    if (!user) {
      // Log failed login attempt
      await this.logFailedLoginAttempt(email, ipAddress);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password expiration
    const passwordExpired = this.checkPasswordExpiration(user.passwordChangedAt);
    if (passwordExpired) {
      // Audit log: Password expired login attempt
      await this.auditService.log(
        user.id,
        AuditAction.LOGIN,
        `user:${user.id}`,
        ipAddress,
        { email: user.email, passwordExpired: true },
      );

      throw new UnauthorizedException(
        'Your password has expired. Please change your password to continue.',
      );
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // Audit log: Successful login
    await this.auditService.log(
      user.id,
      AuditAction.LOGIN,
      `user:${user.id}`,
      ipAddress,
      { email: user.email, role: user.role },
    );

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }

  /**
   * Logout with audit logging
   */
  async logout(userId: string, ipAddress?: string) {
    await this.auditService.log(
      userId,
      AuditAction.LOGOUT,
      `user:${userId}`,
      ipAddress,
    );

    return { message: 'Logged out successfully' };
  }

  /**
   * Change password with validation and audit logging
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    ipAddress?: string,
  ) {
    // Get user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Validate new password
    PasswordValidator.validate(newPassword);

    // Check if new password is same as old
    if (currentPassword === newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, this.BCRYPT_ROUNDS);

    // Update password and track change timestamp
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    });

    // Audit log: Password change
    await this.auditService.log(
      userId,
      AuditAction.PASSWORD_CHANGE,
      `user:${userId}`,
      ipAddress,
    );

    return { message: 'Password changed successfully' };
  }

  /**
   * Check if password has expired based on PASSWORD_EXPIRATION_DAYS
   */
  private checkPasswordExpiration(passwordChangedAt: Date | null): boolean {
    // If no passwordChangedAt is set, consider it expired (forces password update)
    if (!passwordChangedAt) {
      return true;
    }

    const expirationDate = new Date(passwordChangedAt);
    expirationDate.setDate(expirationDate.getDate() + this.PASSWORD_EXPIRATION_DAYS);

    return new Date() > expirationDate;
  }

  /**
   * Check if account is locked due to failed login attempts
   */
  private async checkAccountLockout(email: string): Promise<void> {
    const lockoutStart = new Date(Date.now() - this.LOCKOUT_DURATION_MINUTES * 60 * 1000);
    const recentFailedAttempts = await this.auditService.getFailedLoginAttempts(email, lockoutStart);

    if (recentFailedAttempts.length >= this.MAX_LOGIN_ATTEMPTS) {
      const oldestAttempt = recentFailedAttempts[recentFailedAttempts.length - 1];
      const unlockTime = new Date(oldestAttempt.timestamp.getTime() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000);
      const minutesRemaining = Math.ceil((unlockTime.getTime() - Date.now()) / 60000);

      throw new UnauthorizedException(
        `Account is locked due to too many failed login attempts. Please try again in ${minutesRemaining} minutes.`
      );
    }
  }

  /**
   * Log failed login attempt for security monitoring
   */
  private async logFailedLoginAttempt(email: string, ipAddress?: string): Promise<void> {
    // Create a temporary audit log entry without userId (since login failed)
    // We'll use a system user ID for failed attempts
    const systemUserId = 'system';

    await this.auditService.log(
      systemUserId,
      AuditAction.LOGIN_FAILED,
      `login:${email}`,
      ipAddress,
      { email, timestamp: new Date().toISOString() },
    );
  }

  /**
   * Get user profile with role-specific data
   */
  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        patientProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dob: true,
            gender: true,
            phone: true,
            address: true,
            shippingAddress: true,
          },
        },
        providerProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
        conciergeProfile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Update patient profile information
   */
  async updateProfile(
    userId: string,
    updateData: { phone?: string; address?: string; shippingAddress?: string },
    ipAddress?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.patientProfile) {
      throw new BadRequestException('Patient profile not found');
    }

    // Update patient profile
    const updatedProfile = await this.prisma.patientProfile.update({
      where: { id: user.patientProfile.id },
      data: {
        ...(updateData.phone !== undefined && { phone: updateData.phone }),
        ...(updateData.address !== undefined && { address: updateData.address }),
        ...(updateData.shippingAddress !== undefined && { shippingAddress: updateData.shippingAddress }),
      },
    });

    // Audit log: Profile update
    await this.auditService.log(
      userId,
      AuditAction.EDIT_PATIENT_PROFILE,
      `profile:${user.patientProfile.id}`,
      ipAddress,
      { updatedFields: Object.keys(updateData) },
    );

    return this.getUserProfile(userId);
  }
}
