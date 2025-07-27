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
exports.StudentApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/jwt.guard");
const internship_service_1 = require("../internship/internship.service");
const application_service_1 = require("./application.service");
let StudentApplicationsController = class StudentApplicationsController {
    internshipService;
    applicationService;
    constructor(internshipService, applicationService) {
        this.internshipService = internshipService;
        this.applicationService = applicationService;
    }
    async getStudentApplicationDetails(applicationId, req) {
        const user = req.user;
        console.log('StudentApplicationsController: Called with applicationId:', applicationId, 'by user:', user);
        try {
            const application = await this.applicationService.getApplicationById(Number(applicationId), user);
            if (!application || application.student.userId !== user.id) {
                console.log('StudentApplicationsController: Request rejected - not found or not owned by user');
                throw new common_1.NotFoundException('Application not found or not yours');
            }
            const internship = application.internship;
            console.log('StudentApplicationsController: Request accepted - returning application and internship');
            return { application, internship };
        }
        catch (error) {
            console.log('StudentApplicationsController: Request rejected -', error.message);
            throw error;
        }
    }
};
exports.StudentApplicationsController = StudentApplicationsController;
__decorate([
    (0, common_1.Get)(':applicationId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Get details of a student application and its internship',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Returns the application and related internship details.',
        schema: {
            type: 'object',
            properties: {
                application: { type: 'object' },
                internship: { type: 'object' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('applicationId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentApplicationsController.prototype, "getStudentApplicationDetails", null);
exports.StudentApplicationsController = StudentApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('student-applications'),
    (0, common_1.Controller)('students/applications'),
    __metadata("design:paramtypes", [internship_service_1.InternshipService,
        application_service_1.ApplicationService])
], StudentApplicationsController);
//# sourceMappingURL=student-applications.controller.js.map