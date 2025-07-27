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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const application_service_1 = require("./application.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_service_1 = require("../file-upload/file-upload.service");
let ApplicationController = class ApplicationController {
    applicationService;
    fileUploadService;
    constructor(applicationService, fileUploadService) {
        this.applicationService = applicationService;
        this.fileUploadService = fileUploadService;
    }
    async applyToInternship(files, dto, user) {
        console.log('🚀 [APPLICATION START] ===================================');
        console.log('[POST /applications] API hit');
        console.log('📋 Request Body:', JSON.stringify(dto, null, 2));
        console.log('📎 Files received:', {
            hasResume: !!(files?.resume && files?.resume[0]),
            hasCoverLetter: !!(files?.coverLetter && files?.coverLetter[0]),
            resumeDetails: files?.resume?.[0]
                ? {
                    name: files.resume[0].originalname,
                    size: files.resume[0].buffer.length,
                    type: files.resume[0].mimetype,
                }
                : null,
            coverLetterDetails: files?.coverLetter?.[0]
                ? {
                    name: files.coverLetter[0].originalname,
                    size: files.coverLetter[0].buffer.length,
                    type: files.coverLetter[0].mimetype,
                }
                : null,
        });
        console.log('👤 User from token:', {
            id: user?.id,
            email: user?.email,
            role: user?.role,
            sub: user?.sub,
        });
        if (!user || !user.id) {
            console.log('❌ Authentication failed: Invalid or missing user');
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        if (typeof dto.internshipId === 'string') {
            console.log('🔄 Converting internshipId from string to number:', dto.internshipId);
            dto.internshipId = parseInt(dto.internshipId, 10);
        }
        console.log('🎯 Target internship ID:', dto.internshipId);
        try {
            if (files?.resume && files.resume[0]) {
                console.log('📄 Uploading resume file...');
                const resumeKey = await this.fileUploadService.uploadFile(files.resume[0], user.id, dto.internshipId, 'resume');
                dto.resumePath = resumeKey;
                console.log('✅ Resume uploaded successfully:', resumeKey);
            }
            if (files?.coverLetter && files.coverLetter[0]) {
                console.log('📄 Uploading cover letter file...');
                const coverLetterKey = await this.fileUploadService.uploadFile(files.coverLetter[0], user.id, dto.internshipId, 'coverLetter');
                dto.coverLetterPath = coverLetterKey;
                console.log('✅ Cover letter uploaded successfully:', coverLetterKey);
            }
            console.log('💾 Calling ApplicationService.apply with:', {
                userId: user.id,
                dto: JSON.stringify(dto, null, 2),
            });
            const result = await this.applicationService.apply(user.id, dto);
            console.log('🎉 [APPLICATION SUCCESS] Application created successfully!');
            console.log('📋 Final result:', JSON.stringify(result, null, 2));
            console.log('🏁 [APPLICATION END] =====================================');
            return result;
        }
        catch (error) {
            console.log('💥 [APPLICATION ERROR] Failed to submit application:');
            console.log('❌ Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
            console.log('🏁 [APPLICATION END] =====================================');
            throw error;
        }
    }
    async getStudentApplications(req, page = 1, limit = 10, status) {
        console.log('📖 [GET /students/applications] ========================');
        console.log('📋 Query parameters:', { page, limit, status });
        const user = req.user;
        console.log('👤 User from token:', {
            id: user?.id,
            email: user?.email,
            role: user?.role,
            sub: user?.sub,
        });
        if (!user || !user.id) {
            console.log('❌ Authentication failed: Invalid or missing user');
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        console.log('🔍 Calling ApplicationService.getStudentApplications with:', {
            userId: user.id,
            pageNum,
            limitNum,
            status,
        });
        try {
            const result = await this.applicationService.getStudentApplications(user.id, pageNum, limitNum, status);
            console.log('📊 Raw service result:', {
                totalItems: result.total,
                itemsCount: result.items.length,
                page: result.page,
                limit: result.limit,
                hasNextPage: result.hasNextPage,
            });
            const response = {
                ...result,
                items: result.items.map((app) => ({
                    application: {
                        id: app.id,
                        status: app.status,
                        resumePath: app.resumePath,
                        coverLetterPath: app.coverLetterPath,
                        appliedAt: app.appliedAt,
                        updatedAt: app.updatedAt,
                    },
                    internship: {
                        ...app.internship,
                        companyName: app.internship.company?.companyName || null,
                    },
                })),
            };
            console.log('✅ Final response prepared:', {
                totalItems: response.total,
                responseItemsCount: response.items.length,
                firstApplication: response.items[0] ? {
                    applicationId: response.items[0].application.id,
                    internshipTitle: response.items[0].internship.title,
                    companyName: response.items[0].internship.companyName,
                    status: response.items[0].application.status,
                } : 'No applications found',
            });
            console.log('🏁 [GET /students/applications] END ==================');
            return response;
        }
        catch (error) {
            console.log('💥 [GET APPLICATIONS ERROR]:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
            console.log('🏁 [GET /students/applications] END ==================');
            throw error;
        }
    }
    async getStudentApplicationDetails(applicationId, req) {
        const user = req.user;
        const application = await this.applicationService.getApplicationById(Number(applicationId), user);
        if (!application || application.student.userId !== user.id) {
            throw new common_1.NotFoundException('Application not found or not yours');
        }
        return {
            application: {
                id: application.id,
                status: application.status,
                resumePath: application.resumePath,
                coverLetterPath: application.coverLetterPath,
                appliedAt: application.appliedAt,
                updatedAt: application.updatedAt,
            },
            student: {
                id: application.student.id,
                fullName: application.student.fullName || 'Unknown Student',
                university: application.student.university || 'University not specified',
                major: application.student.major || 'Not specified',
                graduationYear: application.student.graduationYear || 'Not specified',
                email: application.student.user.email || 'Not provided',
            },
            internship: {
                id: application.internship.id,
                title: application.internship.title,
                description: application.internship.description,
                location: application.internship.location,
                isRemote: application.internship.isRemote,
                duration: application.internship.duration,
                applicationDeadline: application.internship.applicationDeadline,
            },
        };
    }
    async updateStatus(applicationId, status, req) {
        const user = req.user;
        if (!user || !user.id) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        return this.applicationService.updateApplicationStatus(user.id, parseInt(applicationId, 10), status);
    }
    async getApplicants(internshipId, req, page = 1, limit = 10, status) {
        console.log('--- /companies/internships/:internshipId/applications called ---');
        console.log('Headers:', req.headers);
        console.log('User:', req.user);
        const user = req.user;
        if (!user || !user.id) {
            console.log('No user or user.id found, throwing UnauthorizedException');
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        return this.applicationService.getApplicantsForInternship(user.id, parseInt(internshipId, 10), page, limit, status);
    }
    async getAllCompanyApplications(req, page = 1, limit = 10, status, sort = 'newest') {
        console.log('--- /companies/applications called ---');
        console.log('Headers:', req.headers);
        console.log('User:', req.user);
        const user = req.user;
        if (!user || !user.id) {
            console.log('No user or user.id found, throwing UnauthorizedException');
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        return this.applicationService.getAllCompanyApplications(user.id, page, limit, status, sort);
    }
    async downloadFile(fileId, req, res) {
        const user = req.user;
        if (!user || !user.id) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        if (user.role !== 'company') {
            throw new common_1.ForbiddenException('Only company users can access this endpoint');
        }
        return this.fileUploadService.streamFile(fileId, res);
    }
    async getCompanyApplication(id, req, fileType) {
        const user = req.user;
        if (!user || !user.id) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        if (user.role !== 'company') {
            throw new common_1.ForbiddenException('Only company users can access this endpoint');
        }
        const app = await this.applicationService.getApplicationWithApplicant(Number(id), user.id);
        if (fileType === 'resume' && app.resumePath) {
            const fileStream = await this.fileUploadService.getFileStream(app.resumePath);
            return new common_1.StreamableFile(fileStream);
        }
        if (fileType === 'coverLetter' && app.coverLetterPath) {
            const fileStream = await this.fileUploadService.getFileStream(app.coverLetterPath);
            return new common_1.StreamableFile(fileStream);
        }
        return app;
    }
    async downloadStudentApplicationFile(applicationId, fileType, req) {
        const user = req.user;
        if (!user || !user.id) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        const application = await this.applicationService.getApplicationById(Number(applicationId), user);
        if (!application || application.student.userId !== user.id) {
            throw new common_1.ForbiddenException('You do not have access to this file');
        }
        let fileKey;
        if (fileType === 'resume' && application.resumePath)
            fileKey = application.resumePath || undefined;
        if (fileType === 'cover-letter' && application.coverLetterPath)
            fileKey = application.coverLetterPath || undefined;
        if (!fileKey) {
            throw new common_1.NotFoundException('Requested file not found');
        }
        const fileStream = await this.fileUploadService.getFileStream(fileKey);
        return new common_1.StreamableFile(fileStream);
    }
};
exports.ApplicationController = ApplicationController;
__decorate([
    (0, common_1.Post)('applications'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('student'),
    (0, swagger_1.ApiOperation)({
        summary: 'Apply to internship (student only, resume and cover letter optional)',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Application submitted successfully.' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data', 'application/json'),
    (0, swagger_1.ApiBody)({
        description: `Apply to an internship. Upload files as multipart/form-data only.\n\n- Fields: internshipId (number), resume (file, optional), coverLetter (file, optional)`,
        schema: {
            type: 'object',
            properties: {
                internshipId: { type: 'integer', example: 1 },
                resume: { type: 'string', format: 'binary', description: 'Resume file (optional, multipart/form-data only)' },
                coverLetter: { type: 'string', format: 'binary', description: 'Cover letter file (optional, multipart/form-data only)' },
            },
            required: ['internshipId'],
            examples: {
                multipart: {
                    summary: 'Multipart form-data',
                    value: { internshipId: 1, resume: '(file)', coverLetter: '(file)' },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'resume', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 },
    ])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_application_dto_1.CreateApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "applyToInternship", null);
__decorate([
    (0, common_1.Get)('students/applications'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('student'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all applications for the logged-in student, including internship details',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Number of items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: create_application_dto_1.ApplicationStatus,
        description: 'Filter by application status',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Paginated list of student applications, each with full application and internship info.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    application: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            status: { type: 'string', example: 'SUBMITTED' },
                                            resumePath: {
                                                type: 'string',
                                                example: 'uploads/resume.pdf',
                                            },
                                            coverLetterPath: {
                                                type: 'string',
                                                example: 'uploads/coverletter.pdf',
                                            },
                                            appliedAt: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2025-06-21T10:00:00.000Z',
                                            },
                                            updatedAt: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2025-06-21T10:00:00.000Z',
                                            },
                                        },
                                    },
                                    internship: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 2 },
                                            title: {
                                                type: 'string',
                                                example: 'Frontend Developer Intern',
                                            },
                                            description: {
                                                type: 'string',
                                                example: 'Work on UI components...',
                                            },
                                            location: { type: 'string', example: 'Remote' },
                                            isRemote: { type: 'boolean', example: true },
                                            duration: { type: 'string', example: '3 months' },
                                            applicationDeadline: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2025-07-01T00:00:00.000Z',
                                            },
                                            companyName: { type: 'string', example: 'Acme Corp' },
                                        },
                                    },
                                },
                            },
                        },
                        total: { type: 'integer', example: 100 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        hasNextPage: { type: 'boolean', example: true },
                    },
                    example: {
                        items: [
                            {
                                application: {
                                    id: 1,
                                    status: 'SUBMITTED',
                                    resumePath: 'uploads/resume.pdf',
                                    coverLetterPath: 'uploads/coverletter.pdf',
                                    appliedAt: '2025-06-21T10:00:00.000Z',
                                    updatedAt: '2025-06-21T10:00:00.000Z',
                                },
                                internship: {
                                    id: 2,
                                    title: 'Frontend Developer Intern',
                                    description: 'Work on UI components...',
                                    location: 'Remote',
                                    isRemote: true,
                                    duration: '3 months',
                                    applicationDeadline: '2025-07-01T00:00:00.000Z',
                                    companyName: 'Acme Corp',
                                },
                            },
                        ],
                        total: 1,
                        page: 1,
                        limit: 10,
                        hasNextPage: false,
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "getStudentApplications", null);
__decorate([
    (0, common_1.Get)('students/applications/:applicationId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('student'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get details for a specific application and its internship (student only)',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Returns the application and related internship details.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        application: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 1 },
                                status: { type: 'string', example: 'SUBMITTED' },
                                resumePath: { type: 'string', example: 'uploads/resume.pdf' },
                                coverLetterPath: { type: 'string', example: 'uploads/coverletter.pdf' },
                                appliedAt: { type: 'string', format: 'date-time' },
                                updatedAt: { type: 'string', format: 'date-time' },
                            },
                        },
                        student: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 1 },
                                fullName: { type: 'string', example: 'John Doe' },
                                university: { type: 'string', example: 'King Saud University' },
                                major: { type: 'string', example: 'Computer Science' },
                                graduationYear: { type: 'integer', example: 2025 },
                                email: { type: 'string', example: 'john@example.com' },
                            },
                        },
                        internship: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 2 },
                                title: { type: 'string', example: 'Frontend Developer Intern' },
                                description: { type: 'string', example: 'Work on UI components...' },
                                location: { type: 'string', example: 'Remote' },
                                isRemote: { type: 'boolean', example: true },
                                duration: { type: 'string', example: '3 months' },
                                applicationDeadline: { type: 'string', format: 'date-time' },
                            },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('applicationId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "getStudentApplicationDetails", null);
__decorate([
    (0, common_1.Patch)('applications/:applicationId/status'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('company'),
    (0, swagger_1.ApiOperation)({ summary: 'Update application status (company only)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            properties: {
                status: {
                    type: 'string',
                    enum: ['SUBMITTED', 'IN_REVIEW', 'ACCEPTED', 'REJECTED'],
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Application status updated.' }),
    __param(0, (0, common_1.Param)('applicationId')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('companies/internships/:internshipId/applications'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('company'),
    (0, swagger_1.ApiOperation)({
        summary: 'View all applicants for internship (company only)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Number of items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: create_application_dto_1.ApplicationStatus,
        description: 'Filter by application status',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of applicants for internship.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object' } },
                        total: { type: 'integer', example: 100 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        hasNextPage: { type: 'boolean', example: true },
                    },
                    example: {
                        items: [
                            {
                                id: 1,
                                internshipId: 2,
                                studentId: 3,
                                resumePath: 'uploads/resume.pdf',
                                coverLetterPath: 'uploads/coverletter.pdf',
                                status: 'SUBMITTED',
                                appliedAt: '2025-06-21T10:00:00.000Z',
                                updatedAt: '2025-06-21T10:00:00.000Z',
                                student: {
                                    id: 3,
                                    fullName: 'John Doe',
                                    university: 'ABC University',
                                },
                            },
                        ],
                        total: 1,
                        page: 1,
                        limit: 10,
                        hasNextPage: false,
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('internshipId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "getApplicants", null);
__decorate([
    (0, common_1.Get)('companies/applications'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('company'),
    (0, swagger_1.ApiOperation)({
        summary: 'View all applications for all company internships (company only)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Number of items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: create_application_dto_1.ApplicationStatus,
        description: 'Filter by application status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sort',
        required: false,
        type: String,
        enum: ['newest', 'oldest'],
        example: 'newest',
        description: 'Sort by application time: newest or oldest',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Paginated list of all applications for company internships.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        items: { type: 'array', items: { type: 'object' } },
                        total: { type: 'integer', example: 100 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        hasNextPage: { type: 'boolean', example: true },
                    },
                    example: {
                        items: [
                            {
                                id: 1,
                                internshipId: 2,
                                studentId: 3,
                                resumePath: 'uploads/resume.pdf',
                                coverLetterPath: 'uploads/coverletter.pdf',
                                status: 'SUBMITTED',
                                appliedAt: '2025-06-21T10:00:00.000Z',
                                updatedAt: '2025-06-21T10:00:00.000Z',
                                student: {
                                    id: 3,
                                    fullName: 'John Doe',
                                    university: 'ABC University',
                                },
                                internship: {
                                    id: 2,
                                    title: 'Frontend Developer Intern',
                                    location: 'Remote',
                                },
                            },
                        ],
                        total: 1,
                        page: 1,
                        limit: 10,
                        hasNextPage: false,
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "getAllCompanyApplications", null);
__decorate([
    (0, common_1.Get)('companies/applications/files/:fileId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('company'),
    (0, swagger_1.ApiOperation)({ summary: 'Download resume or cover letter (company only)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'File download.' }),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Get)('companies/applications/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('company'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific application and its internship/applicant info (company only)',
        description: `\nFetch a specific application by ID. This endpoint returns all application details, including:\n- \`resumePath\` and \`coverLetterPath\`: the storage keys/paths for the files in S3/MinIO.\n- To download a file directly, add the query param \`?file=resume\` or \`?file=coverLetter\` to stream the file as a real file in the response.\n- If no \`file\` param is provided, the application info is returned as JSON.\n    `
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)('file')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "getCompanyApplication", null);
__decorate([
    (0, common_1.Get)('students/applications/:applicationId/file'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('student'),
    (0, swagger_1.ApiOperation)({
        summary: 'Download resume or cover letter for a specific application (student only)',
        description: 'Student can download their own uploaded resume or cover letter for a specific application.'
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'File download.' }),
    __param(0, (0, common_1.Param)('applicationId')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "downloadStudentApplicationFile", null);
exports.ApplicationController = ApplicationController = __decorate([
    (0, swagger_1.ApiTags)('applications'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [application_service_1.ApplicationService,
        file_upload_service_1.FileUploadService])
], ApplicationController);
//# sourceMappingURL=application.controller.js.map