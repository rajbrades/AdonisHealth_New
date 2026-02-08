import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, req: Request): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    login(loginDto: LoginDto, req: Request): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        email: string;
        id: string;
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
    updateProfile(updateProfileDto: UpdateProfileDto, req: any): Promise<{
        email: string;
        id: string;
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
    changePassword(changePasswordDto: ChangePasswordDto, req: any): Promise<{
        message: string;
    }>;
    private getClientIp;
}
