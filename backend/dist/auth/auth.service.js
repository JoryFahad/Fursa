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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_validation_service_1 = require("./email-validation.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    emailValidationService;
    constructor(prisma, jwtService, emailValidationService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailValidationService = emailValidationService;
    }
    async register(dto) {
        await this.emailValidationService.comprehensiveEmailValidation(dto.email);
        const userExists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (userExists)
            throw new common_1.BadRequestException('Email already in use');
        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash: hash,
                role: dto.role,
                ...(dto.role === 'student'
                    ? { studentProfile: { create: {} } }
                    : dto.role === 'company'
                        ? { companyProfile: { create: {} } }
                        : {}),
            },
            include: {
                studentProfile: true,
                companyProfile: true,
            },
        });
        return { message: 'User registered successfully', userId: user.id };
    }
    async login(dto) {
        console.log('AuthService.login called with:', dto);
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                studentProfile: true,
                companyProfile: true,
            },
        });
        console.log('User found for login:', user);
        if (!user) {
            console.log('No user found, throwing UnauthorizedException');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            console.log('Invalid password, throwing UnauthorizedException');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        }, { expiresIn: '15m' });
        const refreshToken = await this.jwtService.signAsync({
            sub: user.id,
        }, { expiresIn: '7d' });
        const hashedRT = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRT },
        });
        const { passwordHash, refreshToken: _, ...safeUser } = user;
        let name = null;
        if (user.role === 'company' &&
            user.companyProfile &&
            user.companyProfile.companyName) {
            name = user.companyProfile.companyName;
        }
        else if (user.role === 'student' &&
            user.studentProfile &&
            user.studentProfile.fullName) {
            name = user.studentProfile.fullName;
        }
        console.log('Login successful, returning tokens and user info');
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: safeUser,
            name,
        };
    }
    async refreshTokens(userId, refreshToken) {
        console.log('AuthService.refreshTokens called with:', {
            userId,
            refreshToken,
        });
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        console.log('User found for refresh:', user);
        if (!user || !user.refreshToken)
            throw new common_1.ForbiddenException('Access Denied');
        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isValid) {
            console.log('Invalid refresh token, throwing ForbiddenException');
            throw new common_1.ForbiddenException('Invalid refresh token');
        }
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        }, { expiresIn: '15m' });
        const newRefreshToken = await this.jwtService.signAsync({ sub: user.id }, { expiresIn: '7d' });
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: await bcrypt.hash(newRefreshToken, 10),
            },
        });
        console.log('Refresh successful, returning new tokens');
        return {
            access_token: accessToken,
            refresh_token: newRefreshToken,
            user: { id: user.id, email: user.email, role: user.role },
        };
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return { message: 'User loged out successfully' };
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const valid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Old password is incorrect');
        if (oldPassword === newPassword)
            throw new common_1.BadRequestException('New password must be different from old password');
        const newHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newHash },
        });
        return { message: 'Password changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_validation_service_1.EmailValidationService])
], AuthService);
//# sourceMappingURL=auth.service.js.map