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
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const create_application_dto_1 = require("./dto/create-application.dto");
let ApplicationService = class ApplicationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async apply(studentUserId, dto) {
        console.log('🔍 [SERVICE] ApplicationService.apply called');
        console.log('📊 Input parameters:', {
            studentUserId,
            dto: JSON.stringify(dto, null, 2)
        });
        try {
            console.log('👤 Looking up student profile for userId:', studentUserId);
            const student = await this.prisma.studentProfile.findUnique({
                where: { userId: studentUserId },
            });
            if (!student) {
                console.log('❌ Student profile not found for userId:', studentUserId);
                throw new common_1.NotFoundException('Student profile not found');
            }
            console.log('✅ Student profile found:', {
                studentId: student.id,
                userId: student.userId,
                fullName: student.fullName,
                university: student.university
            });
            console.log('🔍 Checking for existing application...');
            const existing = await this.prisma.application.findUnique({
                where: {
                    internshipId_studentId: {
                        internshipId: dto.internshipId,
                        studentId: student.id,
                    },
                },
            });
            if (existing) {
                console.log('❌ Application already exists:', {
                    existingApplicationId: existing.id,
                    status: existing.status,
                    appliedAt: existing.appliedAt
                });
                throw new common_1.BadRequestException('Already applied to this internship');
            }
            console.log('✅ No existing application found, proceeding with creation');
            const applicationData = {
                internshipId: dto.internshipId,
                studentId: student.id,
                resumePath: dto.resumePath || null,
                coverLetterPath: dto.coverLetterPath || null,
                status: dto.status || create_application_dto_1.ApplicationStatus.SUBMITTED,
                appliedAt: new Date(),
            };
            console.log('💾 Creating application with data:', JSON.stringify(applicationData, null, 2));
            const application = await this.prisma.application.create({
                data: applicationData,
                include: {
                    student: {
                        include: { user: true }
                    },
                    internship: {
                        include: { company: true }
                    }
                }
            });
            console.log('🎉 Application created successfully!');
            console.log('📋 Created application details:', {
                id: application.id,
                internshipId: application.internshipId,
                studentId: application.studentId,
                status: application.status,
                resumePath: application.resumePath,
                coverLetterPath: application.coverLetterPath,
                appliedAt: application.appliedAt,
                internshipTitle: application.internship?.title,
                companyName: application.internship?.company?.companyName,
                studentName: application.student?.fullName,
                studentEmail: application.student?.user?.email
            });
            return application;
        }
        catch (error) {
            console.log('💥 [SERVICE ERROR] Failed to create application:');
            console.log('❌ Error details:', {
                name: error.name,
                message: error.message,
                code: error.code,
                meta: error.meta
            });
            throw error;
        }
    }
    async getApplicantsForInternship(companyUserId, internshipId, page = 1, limit = 10, status) {
        console.log('getApplicantsForInternship called with companyUserId:', companyUserId);
        const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId: companyUserId },
        });
        console.log('Company profile found:', company);
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        const internship = await this.prisma.internship.findUnique({
            where: { id: internshipId },
        });
        if (!internship)
            throw new common_1.NotFoundException('Internship not found');
        if (internship.companyId !== company.id)
            throw new common_1.ForbiddenException('You can only view applicants for your own internships');
        const where = { internshipId };
        if (status)
            where.status = status;
        const [items, total] = await Promise.all([
            this.prisma.application.findMany({
                where,
                include: {
                    student: {
                        include: { user: true }
                    }
                },
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                orderBy: { appliedAt: 'desc' },
            }),
            this.prisma.application.count({ where }),
        ]);
        return {
            items,
            total,
            page: pageNum,
            limit: limitNum,
            hasNextPage: pageNum * limitNum < total,
        };
    }
    async updateApplicationStatus(companyUserId, applicationId, status) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: { internship: true },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId: companyUserId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        if (application.internship.companyId !== company.id)
            throw new common_1.ForbiddenException('You can only update status for your own internships');
        return this.prisma.application.update({
            where: { id: applicationId },
            data: { status },
        });
    }
    async getCompanyInternships(companyUserId) {
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId: companyUserId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        return this.prisma.internship.findMany({
            where: { companyId: company.id },
            include: {
                applications: true,
            },
        });
    }
    async getStudentApplications(studentUserId, page = 1, limit = 10, status) {
        console.log('🔍 [SERVICE] getStudentApplications called');
        console.log('📊 Input parameters:', {
            studentUserId,
            page,
            limit,
            status,
        });
        try {
            console.log('👤 Looking up student profile for userId:', studentUserId);
            const student = await this.prisma.studentProfile.findUnique({
                where: { userId: studentUserId },
            });
            if (!student) {
                console.log('❌ Student profile not found for userId:', studentUserId);
                throw new common_1.NotFoundException('Student profile not found');
            }
            console.log('✅ Student profile found:', {
                studentId: student.id,
                userId: student.userId,
                fullName: student.fullName,
                university: student.university,
            });
            const where = { studentId: student.id };
            if (status) {
                where.status = status;
                console.log('🔍 Filtering by status:', status);
            }
            const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
            const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
            console.log('📖 Querying applications with:', {
                where,
                pageNum,
                limitNum,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
            });
            const [items, total] = await Promise.all([
                this.prisma.application.findMany({
                    where,
                    include: {
                        internship: {
                            include: { company: true }
                        }
                    },
                    skip: (pageNum - 1) * limitNum,
                    take: limitNum,
                    orderBy: { appliedAt: 'desc' },
                }),
                this.prisma.application.count({ where }),
            ]);
            console.log('📊 Database query results:', {
                totalApplications: total,
                retrievedApplications: items.length,
                applicationIds: items.map(app => app.id),
                applicationDetails: items.map(app => ({
                    id: app.id,
                    internshipId: app.internshipId,
                    internshipTitle: app.internship?.title,
                    companyName: app.internship?.company?.companyName,
                    status: app.status,
                    appliedAt: app.appliedAt,
                })),
            });
            const result = {
                items,
                total,
                page: pageNum,
                limit: limitNum,
                hasNextPage: pageNum * limitNum < total,
            };
            console.log('✅ Service returning result:', {
                totalItems: result.total,
                itemsCount: result.items.length,
                page: result.page,
                limit: result.limit,
                hasNextPage: result.hasNextPage,
            });
            return result;
        }
        catch (error) {
            console.log('💥 [SERVICE ERROR] getStudentApplications failed:');
            console.log('❌ Error details:', {
                name: error.name,
                message: error.message,
                code: error.code,
                meta: error.meta,
            });
            throw error;
        }
    }
    async getApplicationWithApplicant(applicationId, companyUserId) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                student: {
                    include: { user: true }
                },
                internship: true,
            },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId: companyUserId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        if (application.internship.companyId !== company.id)
            throw new common_1.ForbiddenException('You can only view applications for your own internships');
        return application;
    }
    async getApplicationById(applicationId, user) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                student: {
                    include: { user: true }
                },
                internship: true,
            },
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (user.role === 'student' && application.student.userId === user.id) {
            return application;
        }
        if (user.role === 'company') {
            const company = await this.prisma.companyProfile.findUnique({
                where: { userId: user.id },
            });
            if (!company)
                throw new common_1.ForbiddenException('Company profile not found');
            if (application.internship.companyId === company.id) {
                return application;
            }
        }
        throw new common_1.ForbiddenException('You do not have access to this application');
    }
    async getAllCompanyApplications(companyUserId, page = 1, limit = 10, status, sort = 'newest') {
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId: companyUserId },
        });
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        const internships = await this.prisma.internship.findMany({
            where: { companyId: company.id },
            select: { id: true },
        });
        const internshipIds = internships.map((i) => i.id);
        if (internshipIds.length === 0) {
            return { items: [], total: 0, page, limit, hasNextPage: false };
        }
        const where = { internshipId: { in: internshipIds } };
        if (status)
            where.status = status;
        const orderBy = {
            appliedAt: sort === 'oldest' ? 'asc' : 'desc',
        };
        const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        const [items, total] = await Promise.all([
            this.prisma.application.findMany({
                where,
                include: {
                    student: {
                        include: { user: true }
                    },
                    internship: true
                },
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                orderBy,
            }),
            this.prisma.application.count({ where }),
        ]);
        return {
            items,
            total,
            page: pageNum,
            limit: limitNum,
            hasNextPage: pageNum * limitNum < total,
        };
    }
    async getAllCompanyInternships(userId, page = 1, limit = 10) {
        console.log('Service getAllCompanyInternships called with:', { userId, page, limit });
        const company = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        console.log('Company found:', company);
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        const [items, total] = await this.prisma.$transaction([
            this.prisma.internship.findMany({
                where: { companyId: company.id, isDeleted: false },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.internship.count({
                where: { companyId: company.id, isDeleted: false },
            }),
        ]);
        console.log('Query results:', { items: items.length, total });
        return {
            items,
            total,
            page,
            limit,
            hasNextPage: page * limit < total,
        };
    }
};
exports.ApplicationService = ApplicationService;
exports.ApplicationService = ApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationService);
//# sourceMappingURL=application.service.js.map