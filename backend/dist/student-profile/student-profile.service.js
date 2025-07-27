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
exports.StudentProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StudentProfileService = class StudentProfileService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateProfile(userId, dto) {
        const student = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });
        if (!student)
            throw new common_1.ForbiddenException('No student profile found');
        const updated = await this.prisma.studentProfile.update({
            where: { userId },
            data: { ...dto },
        });
        return {
            message: 'Student profile updated successfully',
            profile: updated,
        };
    }
    async createProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true },
        });
        if (!user) {
            throw new common_1.ForbiddenException('User not found');
        }
        if (user.role !== 'student') {
            throw new common_1.ForbiddenException('Only students can create student profiles');
        }
        if (!user.studentProfile) {
            const created = await this.prisma.studentProfile.create({
                data: {
                    userId,
                    ...dto,
                },
            });
            return {
                message: 'Student profile created successfully',
                profile: created,
            };
        }
        const updated = await this.prisma.studentProfile.update({
            where: { userId },
            data: { ...dto },
        });
        return {
            message: 'Student profile updated successfully',
            profile: updated,
        };
    }
};
exports.StudentProfileService = StudentProfileService;
exports.StudentProfileService = StudentProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentProfileService);
//# sourceMappingURL=student-profile.service.js.map