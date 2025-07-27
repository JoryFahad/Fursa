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
exports.StudentProfileController = void 0;
const common_1 = require("@nestjs/common");
const student_profile_service_1 = require("./student-profile.service");
const create_student_profile_dto_1 = require("./dto/create-student-profile.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/jwt.guard");
let StudentProfileController = class StudentProfileController {
    studentService;
    constructor(studentService) {
        this.studentService = studentService;
    }
    async createProfile(dto, req) {
        const user = req.user;
        if (!user || !user.id) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        if (user.role !== 'student') {
            throw new common_1.ForbiddenException('Only students can create profiles');
        }
        const userId = user.id;
        const result = await this.studentService.createProfile(userId, dto);
        return { message: result.message, fullName: result.profile.fullName };
    }
    async updateProfile(dto, req) {
        const user = req.user;
        if (!user || !user.id) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        if (user.role !== 'student') {
            throw new common_1.ForbiddenException('Only students can update profiles');
        }
        const userId = user.id;
        const result = await this.studentService.updateProfile(userId, dto);
        return result.profile;
    }
};
exports.StudentProfileController = StudentProfileController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create student profile' }),
    (0, swagger_1.ApiBody)({ type: create_student_profile_dto_1.CreateStudentProfileDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Profile created.' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Profile created.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 10 },
                        fullName: { type: 'string', example: 'John Doe' },
                        university: { type: 'string', example: 'ABC University' },
                        major: { type: 'string', example: 'Computer Science' },
                        graduationYear: { type: 'integer', example: 2025 },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-06-21T12:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-06-21T12:00:00.000Z',
                        },
                    },
                    example: {
                        id: 1,
                        userId: 10,
                        fullName: 'John Doe',
                        university: 'ABC University',
                        major: 'Computer Science',
                        graduationYear: 2025,
                        createdAt: '2024-06-21T12:00:00.000Z',
                        updatedAt: '2024-06-21T12:00:00.000Z',
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_profile_dto_1.CreateStudentProfileDto, Object]),
    __metadata("design:returntype", Promise)
], StudentProfileController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update student profile' }),
    (0, swagger_1.ApiBody)({ type: create_student_profile_dto_1.CreateStudentProfileDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Profile updated.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 10 },
                        fullName: { type: 'string', example: 'John Doe' },
                        university: { type: 'string', example: 'ABC University' },
                        major: { type: 'string', example: 'Computer Science' },
                        graduationYear: { type: 'integer', example: 2025 },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-06-21T12:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-06-21T12:00:00.000Z',
                        },
                    },
                    example: {
                        id: 1,
                        userId: 10,
                        fullName: 'John Doe',
                        university: 'ABC University',
                        major: 'Computer Science',
                        graduationYear: 2025,
                        createdAt: '2024-06-21T12:00:00.000Z',
                        updatedAt: '2024-06-21T12:00:00.000Z',
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_profile_dto_1.CreateStudentProfileDto, Object]),
    __metadata("design:returntype", Promise)
], StudentProfileController.prototype, "updateProfile", null);
exports.StudentProfileController = StudentProfileController = __decorate([
    (0, common_1.Controller)('students/profile'),
    __metadata("design:paramtypes", [student_profile_service_1.StudentProfileService])
], StudentProfileController);
//# sourceMappingURL=student-profile.controller.js.map