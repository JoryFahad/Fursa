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
exports.InternshipController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const internship_service_1 = require("./internship.service");
const create_internship_dto_1 = require("./dto/create-internship.dto");
const update_internship_dto_1 = require("./dto/update-internship.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
function getUserFromRequest(req) {
    const user = req.user;
    if (user && user.id && !user.sub) {
        user.sub = user.id;
    }
    return user;
}
let InternshipController = class InternshipController {
    internshipService;
    constructor(internshipService) {
        this.internshipService = internshipService;
    }
    async createInternship(createInternshipDto, req) {
        const user = getUserFromRequest(req);
        if (!user?.sub) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        if (user.role !== 'company') {
            throw new common_1.ForbiddenException('Only company users can create internships');
        }
        return this.internshipService.createInternship(user.sub, createInternshipDto);
    }
    async updateInternship(id, dto, req) {
        const user = getUserFromRequest(req);
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        if (user.role !== 'company') {
            throw new common_1.ForbiddenException('Only company users can edit internships');
        }
        return this.internshipService.updateInternship(user.sub, parseInt(id, 10), dto);
    }
    async deleteInternship(id, req) {
        const user = getUserFromRequest(req);
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        if (user.role !== 'company') {
            throw new common_1.ForbiddenException('Only company users can delete internships');
        }
        await this.internshipService.deleteInternship(user.sub, parseInt(id, 10));
        return { success: true, message: 'Internship soft deleted.' };
    }
    async getAllPublicInternships(status = 'all', page = 1, limit = 10) {
        const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        return this.internshipService.getAllAvailableInternships(status, pageNum, limitNum);
    }
    async getCompanyInternshipById(id) {
        return this.internshipService.getCompanyInternshipById(Number(id));
    }
    async closeInternship(id, req) {
        const user = getUserFromRequest(req);
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        return this.internshipService.closeInternship(user.sub, parseInt(id, 10));
    }
};
exports.InternshipController = InternshipController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('company'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new internship',
        description: 'Allows companies to post new internship opportunities',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Internship details',
        type: create_internship_dto_1.CreateInternshipDto,
        examples: {
            frontend: {
                summary: 'Frontend Developer Internship',
                value: {
                    title: 'Frontend Developer Intern',
                    description: 'Work on UI components and collaborate with the frontend team.',
                    location: 'Remote',
                    isRemote: true,
                    duration: '3 months',
                    applicationDeadline: '2025-07-01T00:00:00.000Z',
                    requirements: 'Knowledge of React, TypeScript, and modern CSS',
                    stipend: 15000,
                },
            },
            backend: {
                summary: 'Backend Developer Internship',
                value: {
                    title: 'Backend Developer Intern',
                    description: 'Develop REST APIs and work with databases',
                    location: 'San Francisco, CA',
                    isRemote: false,
                    duration: '6 months',
                    applicationDeadline: '2025-06-15T00:00:00.000Z',
                    requirements: 'Knowledge of Node.js, databases, and API design',
                    stipend: 20000,
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Internship created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 1 },
                title: { type: 'string', example: 'Frontend Developer Intern' },
                description: { type: 'string' },
                location: { type: 'string' },
                isRemote: { type: 'boolean' },
                duration: { type: 'string' },
                requirements: { type: 'string' },
                stipend: { type: 'number' },
                applicationDeadline: { type: 'string', format: 'date-time' },
                isOpen: { type: 'boolean', example: true },
                isDeleted: { type: 'boolean', example: false },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_internship_dto_1.CreateInternshipDto, Object]),
    __metadata("design:returntype", Promise)
], InternshipController.prototype, "createInternship", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('company'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing internship (company only)' }),
    (0, swagger_1.ApiBody)({ type: update_internship_dto_1.UpdateInternshipDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Internship updated successfully.',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Internship',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_internship_dto_1.UpdateInternshipDto, Object]),
    __metadata("design:returntype", Promise)
], InternshipController.prototype, "updateInternship", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('company'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete an internship (company only)' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Internship soft deleted successfully.',
        schema: { example: { success: true, message: 'Internship soft deleted.' } },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InternshipController.prototype, "deleteInternship", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all available internships for students (public endpoint)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: ['open', 'closed', 'all'],
        description: 'Filter by internship status (open/closed/all). Default: all',
        example: 'open',
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
    (0, swagger_1.ApiOkResponse)({
        description: 'Paginated list of internships with status information.',
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
                                    id: { type: 'integer', example: 1 },
                                    title: { type: 'string', example: 'Frontend Developer Intern' },
                                    description: { type: 'string', example: 'Work on React projects' },
                                    location: { type: 'string', example: 'Remote' },
                                    isRemote: { type: 'boolean', example: true },
                                    duration: { type: 'string', example: '3 months' },
                                    applicationDeadline: { type: 'string', format: 'date-time' },
                                    isOpen: { type: 'boolean', example: true, description: 'Whether applications are open' },
                                    isDeleted: { type: 'boolean', example: false },
                                    createdAt: { type: 'string', format: 'date-time' },
                                    updatedAt: { type: 'string', format: 'date-time' },
                                    company: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            companyName: { type: 'string', example: 'Tech Corp' },
                                            industry: { type: 'string', example: 'Technology' },
                                        },
                                    },
                                },
                            },
                        },
                        total: { type: 'integer', example: 25 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        hasNextPage: { type: 'boolean', example: true },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InternshipController.prototype, "getAllPublicInternships", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single internship by ID with company information' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Single internship details with company information.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 10 },
                        title: { type: 'string', example: 'Frontend Developer Intern' },
                        description: { type: 'string', example: 'Work on React projects and collaborate with the frontend team.' },
                        requirements: { type: 'string', example: 'Knowledge of React, TypeScript, and modern CSS' },
                        location: { type: 'string', example: 'Riyadh, Saudi Arabia' },
                        isRemote: { type: 'boolean', example: false },
                        duration: { type: 'string', example: '3 months' },
                        applicationDeadline: { type: 'string', format: 'date-time', example: '2025-07-01T00:00:00.000Z' },
                        isOpen: { type: 'boolean', example: true, description: 'Whether applications are currently open (calculated dynamically)' },
                        isDeleted: { type: 'boolean', example: false },
                        createdAt: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2025-01-15T00:00:00.000Z' },
                        companyId: { type: 'integer', example: 5 },
                        company: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 5 },
                                companyName: { type: 'string', example: 'Tech Innovations Ltd' },
                                industry: { type: 'string', example: 'Software Development' },
                                website: { type: 'string', example: 'https://techinnov.com' },
                            },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InternshipController.prototype, "getCompanyInternshipById", null);
__decorate([
    (0, common_1.Patch)(':id/close'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('company'),
    (0, swagger_1.ApiOperation)({ summary: 'Close applications for a specific internship (company only)' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Internship applications closed.',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 1 },
                isOpen: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Internship applications closed.' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InternshipController.prototype, "closeInternship", null);
exports.InternshipController = InternshipController = __decorate([
    (0, swagger_1.ApiTags)('Internships'),
    (0, common_1.Controller)('companies/internships'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [internship_service_1.InternshipService])
], InternshipController);
//# sourceMappingURL=internship.controller.js.map