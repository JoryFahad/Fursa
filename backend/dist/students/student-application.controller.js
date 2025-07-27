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
exports.StudentApplicationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const application_service_1 = require("../application/application.service");
const file_upload_service_1 = require("../file-upload/file-upload.service");
const create_application_dto_1 = require("../application/dto/create-application.dto");
let StudentApplicationController = class StudentApplicationController {
    applicationService;
    fileUploadService;
    constructor(applicationService, fileUploadService) {
        this.applicationService = applicationService;
        this.fileUploadService = fileUploadService;
    }
    async getMyApplications(req, page = 1, limit = 10, status) {
        const user = req.user;
        if (!user || !user.id) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        return this.applicationService.getStudentApplications(user.id, pageNum, limitNum, status);
    }
    async downloadMyApplicationFile(applicationId, type, req, res) {
        const user = req.user;
        if (!user || !user.id) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        const application = await this.applicationService.getApplicationById(parseInt(applicationId, 10), user);
        const filePath = type === 'resume' ? application.resumePath : application.coverLetterPath;
        if (!filePath) {
            throw new common_1.UnauthorizedException(`No ${type} file found for this application`);
        }
        const fileStream = await this.fileUploadService.getFileStream(filePath);
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${type}-${applicationId}.pdf"`,
        });
        return new common_1.StreamableFile(fileStream);
    }
};
exports.StudentApplicationController = StudentApplicationController;
__decorate([
    (0, common_1.Get)('applications'),
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
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], StudentApplicationController.prototype, "getMyApplications", null);
__decorate([
    (0, common_1.Get)('applications/:id/file'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('student'),
    (0, swagger_1.ApiOperation)({
        summary: 'Download student application file (resume or cover letter)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: true,
        enum: ['resume', 'cover-letter'],
        description: 'Type of file to download',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], StudentApplicationController.prototype, "downloadMyApplicationFile", null);
exports.StudentApplicationController = StudentApplicationController = __decorate([
    (0, swagger_1.ApiTags)('student-applications'),
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [application_service_1.ApplicationService,
        file_upload_service_1.FileUploadService])
], StudentApplicationController);
//# sourceMappingURL=student-application.controller.js.map