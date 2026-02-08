"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const password_validator_1 = require("./password.validator");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    auditService;
    BCRYPT_ROUNDS = 10;
    MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);
    LOCKOUT_DURATION_MINUTES = parseInt(process.env.LOCKOUT_DURATION_MINUTES || '30', 10);
    PASSWORD_EXPIRATION_DAYS = parseInt(process.env.PASSWORD_EXPIRATION_DAYS || '90', 10);
    constructor(prisma, jwtService, auditService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.auditService = auditService;
    }
    async register(registerDto, ipAddress) {
        const { email, password, firstName, lastName, dob, gender } = registerDto;
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        password_validator_1.PasswordValidator.validate(password);
        const hashedPassword = await bcrypt.hash(password, this.BCRYPT_ROUNDS);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'PATIENT',
                passwordChangedAt: new Date(),
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
        await this.auditService.log(user.id, audit_service_1.AuditAction.REGISTER, `user:${user.id}`, ipAddress, { email, role: user.role });
        return this.login({ email, password }, ipAddress);
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto, ipAddress) {
        const { email, password } = loginDto;
        await this.checkAccountLockout(email);
        const user = await this.validateUser(email, password);
        if (!user) {
            await this.logFailedLoginAttempt(email, ipAddress);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordExpired = this.checkPasswordExpiration(user.passwordChangedAt);
        if (passwordExpired) {
            await this.auditService.log(user.id, audit_service_1.AuditAction.LOGIN, `user:${user.id}`, ipAddress, { email: user.email, passwordExpired: true });
            throw new common_1.UnauthorizedException('Your password has expired. Please change your password to continue.');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload);
        await this.auditService.log(user.id, audit_service_1.AuditAction.LOGIN, `user:${user.id}`, ipAddress, { email: user.email, role: user.role });
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        };
    }
    async logout(userId, ipAddress) {
        await this.auditService.log(userId, audit_service_1.AuditAction.LOGOUT, `user:${userId}`, ipAddress);
        return { message: 'Logged out successfully' };
    }
    async changePassword(userId, currentPassword, newPassword, ipAddress) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        password_validator_1.PasswordValidator.validate(newPassword);
        if (currentPassword === newPassword) {
            throw new common_1.BadRequestException('New password must be different from current password');
        }
        const hashedPassword = await bcrypt.hash(newPassword, this.BCRYPT_ROUNDS);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                passwordChangedAt: new Date(),
            },
        });
        await this.auditService.log(userId, audit_service_1.AuditAction.PASSWORD_CHANGE, `user:${userId}`, ipAddress);
        return { message: 'Password changed successfully' };
    }
    checkPasswordExpiration(passwordChangedAt) {
        if (!passwordChangedAt) {
            return true;
        }
        const expirationDate = new Date(passwordChangedAt);
        expirationDate.setDate(expirationDate.getDate() + this.PASSWORD_EXPIRATION_DAYS);
        return new Date() > expirationDate;
    }
    async checkAccountLockout(email) {
        const lockoutStart = new Date(Date.now() - this.LOCKOUT_DURATION_MINUTES * 60 * 1000);
        const recentFailedAttempts = await this.auditService.getFailedLoginAttempts(email, lockoutStart);
        if (recentFailedAttempts.length >= this.MAX_LOGIN_ATTEMPTS) {
            const oldestAttempt = recentFailedAttempts[recentFailedAttempts.length - 1];
            const unlockTime = new Date(oldestAttempt.timestamp.getTime() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000);
            const minutesRemaining = Math.ceil((unlockTime.getTime() - Date.now()) / 60000);
            throw new common_1.UnauthorizedException(`Account is locked due to too many failed login attempts. Please try again in ${minutesRemaining} minutes.`);
        }
    }
    async logFailedLoginAttempt(email, ipAddress) {
        const systemUserId = 'system';
        await this.auditService.log(systemUserId, audit_service_1.AuditAction.LOGIN_FAILED, `login:${email}`, ipAddress, { email, timestamp: new Date().toISOString() });
    }
    async getUserProfile(userId) {
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
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async updateProfile(userId, updateData, ipAddress) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { patientProfile: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.patientProfile) {
            throw new common_1.BadRequestException('Patient profile not found');
        }
        const updatedProfile = await this.prisma.patientProfile.update({
            where: { id: user.patientProfile.id },
            data: {
                ...(updateData.phone !== undefined && { phone: updateData.phone }),
                ...(updateData.address !== undefined && { address: updateData.address }),
                ...(updateData.shippingAddress !== undefined && { shippingAddress: updateData.shippingAddress }),
                ...(updateData.weight !== undefined && {
                    weight: updateData.weight,
                    weightUpdatedAt: new Date()
                }),
            },
        });
        await this.auditService.log(userId, audit_service_1.AuditAction.EDIT_PATIENT_PROFILE, `profile:${user.patientProfile.id}`, ipAddress, { updatedFields: Object.keys(updateData) });
        return this.getUserProfile(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map