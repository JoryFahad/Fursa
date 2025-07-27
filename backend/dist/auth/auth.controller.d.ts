import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterAuthDto): Promise<{
        message: string;
        userId: number;
    }>;
    login(dto: LoginAuthDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            studentProfile: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                fullName: string | null;
                university: string | null;
                major: string | null;
                graduationYear: number | null;
                userId: number;
            } | null;
            companyProfile: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                companyName: string | null;
                industry: string | null;
                website: string | null;
                userId: number;
            } | null;
            email: string;
            role: import("generated/prisma").$Enums.Role;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
        name: string | null;
    }>;
    refresh(body: {
        userId: number;
        refresh_token: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            email: string;
            role: import("generated/prisma").$Enums.Role;
        };
    }>;
    logout(req: Request): Promise<{
        message: string;
    }>;
    changePassword(dto: ChangePasswordDto, req: Request): Promise<{
        message: string;
    }>;
}
