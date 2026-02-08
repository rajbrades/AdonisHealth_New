import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private auditService;
    private readonly BCRYPT_ROUNDS;
    private readonly MAX_LOGIN_ATTEMPTS;
    private readonly LOCKOUT_DURATION_MINUTES;
    private readonly PASSWORD_EXPIRATION_DAYS;
    constructor(prisma: PrismaService, jwtService: JwtService, auditService: AuditService);
    register(registerDto: RegisterDto, ipAddress?: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto, ipAddress?: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    logout(userId: string, ipAddress?: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string, ipAddress?: string): Promise<{
        message: string;
    }>;
    private checkPasswordExpiration;
    private checkAccountLockout;
    private logFailedLoginAttempt;
    getUserProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: string;
        createdAt: Date;
        patientProfile: {
            id: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
        } | null;
        providerProfile: {
            id: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
        } | null;
        conciergeProfile: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    }>;
    updateProfile(userId: string, updateData: {
        phone?: string;
        address?: string;
        shippingAddress?: string;
    }, ipAddress?: string): Promise<{
        id: string;
        email: string;
        role: string;
        createdAt: Date;
        patientProfile: {
            id: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string | null;
            address: string | null;
            shippingAddress: string | null;
        } | null;
        providerProfile: {
            id: string;
            firstName: string;
            lastName: string;
            specialty: string | null;
        } | null;
        conciergeProfile: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    }>;
}
