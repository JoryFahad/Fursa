import { PrismaService } from '../prisma/prisma.service';
import { EmailValidationService } from './email-validation.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    private emailValidationService;
    constructor(prisma: PrismaService, jwtService: JwtService, emailValidationService: EmailValidationService);
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
    refreshTokens(userId: number, refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            email: string;
            role: import("generated/prisma").$Enums.Role;
        };
    }>;
    logout(userId: number): Promise<{
        message: string;
    }>;
    changePassword(userId: number, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
