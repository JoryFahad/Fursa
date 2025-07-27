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
exports.InternshipService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InternshipService = class InternshipService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInternship(userId, dto) {
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        const internship = await this.prisma.internship.create({
            data: {
                companyId: company.id,
                title: dto.title,
                description: dto.description,
                location: dto.location,
                isRemote: dto.isRemote,
                duration: dto.duration,
                applicationDeadline: new Date(dto.applicationDeadline),
                createdAt: new Date(),
                isOpen: true,
            },
        });
        return internship;
    }
    async updateInternship(userId, internshipId, dto) {
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        const internship = await this.prisma.internship.findUnique({
            where: { id: internshipId },
        });
        if (!internship)
            throw new common_1.NotFoundException('Internship not found');
        if (internship.companyId !== company.id)
            throw new common_1.ForbiddenException('You can only edit your own internships');
        const updated = await this.prisma.internship.update({
            where: { id: internshipId },
            data: {
                ...dto,
                applicationDeadline: dto.applicationDeadline
                    ? new Date(dto.applicationDeadline)
                    : undefined,
                isOpen: dto.hasOwnProperty('isOpen')
                    ? dto.isOpen
                    : internship.isOpen,
            },
        });
        return updated;
    }
    async deleteInternship(userId, internshipId) {
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        const internship = await this.prisma.internship.findUnique({
            where: { id: internshipId },
        });
        if (!internship)
            throw new common_1.NotFoundException('Internship not found');
        if (internship.companyId !== company.id)
            throw new common_1.ForbiddenException('You can only delete your own internships');
        await this.prisma.internship.update({
            where: { id: internshipId },
            data: { isDeleted: true },
        });
        return { message: 'Internship soft deleted successfully' };
    }
    async getAllCompanyInternships(userId, page = 1, limit = 10, status = 'all') {
        console.log('Service getAllCompanyInternships called with:', {
            userId,
            page,
            limit,
            status,
        });
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        console.log('Company found:', company);
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        const whereClause = { companyId: company.id, isDeleted: false };
        if (status === 'open') {
            whereClause.isOpen = true;
            whereClause.applicationDeadline = { gte: new Date() };
        }
        else if (status === 'closed') {
            whereClause.OR = [
                { isOpen: false },
                { applicationDeadline: { lt: new Date() } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.internship.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.internship.count({
                where: whereClause,
            }),
        ]);
        const itemsWithStatus = items.map((item) => ({
            ...item,
            isOpen: item.isOpen && new Date(item.applicationDeadline) > new Date(),
        }));
        console.log('Query results:', { items: itemsWithStatus.length, total });
        return {
            items: itemsWithStatus,
            total,
            page,
            limit,
            hasNextPage: page * limit < total,
        };
    }
    async getLatestCompanyInternships(userId, limit = 4) {
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        return this.prisma.internship.findMany({
            where: { companyId: company.id, isDeleted: false },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getAllCompanyApplications(userId) {
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        return this.prisma.application.findMany({
            where: {
                internship: { companyId: company.id, isDeleted: false },
            },
            include: {
                internship: true,
                student: { include: { user: true } },
            },
            orderBy: { appliedAt: 'desc' },
        });
    }
    async getCompanyApplicationDetail(userId, applicationId) {
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                internship: true,
                student: { include: { user: true } },
            },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (application.internship.companyId !== company.id)
            throw new common_1.ForbiddenException('You can only view applications for your own internships');
        if (application.internship.isDeleted)
            throw new common_1.NotFoundException('Internship not found');
        return application;
    }
    async getAllAvailableInternships(status = 'all', page = 1, limit = 10) {
        const where = { isDeleted: false };
        if (status === 'open') {
            where.isOpen = true;
            where.applicationDeadline = { gte: new Date() };
        }
        else if (status === 'closed') {
            where.OR = [
                { isOpen: false },
                { applicationDeadline: { lt: new Date() } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.internship.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    company: {
                        select: {
                            id: true,
                            companyName: true,
                            industry: true,
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.internship.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            hasNextPage: page * limit < total,
        };
    }
    async getCompanyInternships(options) {
        const { latest, page, limit, status } = options;
        const where = { isDeleted: false };
        if (status === 'open') {
            where.applicationDeadline = { gte: new Date() };
        }
        let take = undefined;
        let skip = undefined;
        if (latest) {
            take = 4;
        }
        else if (page && limit) {
            take = limit;
            skip = (page - 1) * limit;
        }
        return this.prisma.internship.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take,
            skip,
        });
    }
    async getCompanyInternshipById(id) {
        const internship = await this.prisma.internship.findUnique({
            where: { id },
            include: {
                company: {
                    select: {
                        id: true,
                        companyName: true,
                        industry: true,
                        website: true,
                    },
                },
            },
        });
        if (!internship || internship.isDeleted)
            throw new common_1.NotFoundException('Internship not found');
        const internshipWithStatus = {
            ...internship,
            isOpen: internship.isOpen && new Date(internship.applicationDeadline) > new Date(),
        };
        return internshipWithStatus;
    }
    async closeInternship(userId, internshipId) {
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        const internship = await this.prisma.internship.findUnique({
            where: { id: internshipId },
        });
        if (!internship)
            throw new common_1.NotFoundException('Internship not found');
        if (internship.companyId !== company.id)
            throw new common_1.ForbiddenException('You can only close your own internships');
        const updated = await this.prisma.internship.update({
            where: { id: internshipId },
            data: { isOpen: false },
        });
        return {
            id: updated.id,
            isOpen: updated.isOpen,
            message: 'Internship applications closed.',
        };
    }
};
exports.InternshipService = InternshipService;
exports.InternshipService = InternshipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InternshipService);
//# sourceMappingURL=internship.service.js.map