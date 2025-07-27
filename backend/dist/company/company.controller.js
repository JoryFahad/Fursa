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
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const internship_service_1 = require("../internship/internship.service");
function getUserFromRequest(req) {
    const user = req.user;
    if (user && user.id && !user.sub) {
        user.sub = user.id;
    }
    return user;
}
let CompanyController = class CompanyController {
    internshipService;
    constructor(internshipService) {
        this.internshipService = internshipService;
    }
    async getMyInternships(page = 1, limit = 10, status = 'all', req) {
        console.log('--- /companies/my-internships called ---');
        const user = getUserFromRequest(req);
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        console.log('User ID:', user.sub, 'Page:', page, 'Limit:', limit, 'Status:', status);
        const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        const statusFilter = typeof status === 'string' ? status : 'all';
        const result = await this.internshipService.getAllCompanyInternships(user.sub, pageNum, limitNum, statusFilter);
        console.log('Controller result:', result);
        return result;
    }
};
exports.CompanyController = CompanyController;
__decorate([
    (0, common_1.Get)('my-internships'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('company'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all internships for the logged-in company',
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
        enum: ['open', 'closed', 'all'],
        description: 'Filter by internship status (open/closed/all). Default: all',
        example: 'all',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Paginated list of company internships.',
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
                                    title: {
                                        type: 'string',
                                        example: 'Frontend Developer Intern',
                                    },
                                    description: {
                                        type: 'string',
                                        example: 'Work on React projects',
                                    },
                                    requirements: {
                                        type: 'string',
                                        example: 'Knowledge of JavaScript',
                                    },
                                    stipend: { type: 'number', example: 15000 },
                                    duration: { type: 'integer', example: 3 },
                                    location: { type: 'string', example: 'Remote' },
                                    type: { type: 'string', example: 'REMOTE' },
                                    startDate: {
                                        type: 'string',
                                        format: 'date',
                                        example: '2025-01-01',
                                    },
                                    endDate: {
                                        type: 'string',
                                        format: 'date',
                                        example: '2025-04-01',
                                    },
                                    applicationDeadline: {
                                        type: 'string',
                                        format: 'date',
                                        example: '2024-12-25',
                                    },
                                    isActive: { type: 'boolean', example: true },
                                    isDeleted: { type: 'boolean', example: false },
                                    createdAt: { type: 'string', format: 'date-time' },
                                    updatedAt: { type: 'string', format: 'date-time' },
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
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "getMyInternships", null);
exports.CompanyController = CompanyController = __decorate([
    (0, swagger_1.ApiTags)('companies'),
    (0, common_1.Controller)('companies'),
    __metadata("design:paramtypes", [internship_service_1.InternshipService])
], CompanyController);
//# sourceMappingURL=company.controller.js.map