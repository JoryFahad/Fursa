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
exports.CompanyProfileController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const company_profile_service_1 = require("./company-profile.service");
const create_company_profile_dto_1 = require("./dto/create-company-profile.dto");
const update_company_profile_dto_1 = require("./dto/update-company-profile.dto");
let CompanyProfileController = class CompanyProfileController {
    companyProfileService;
    constructor(companyProfileService) {
        this.companyProfileService = companyProfileService;
    }
    async createProfile(createCompanyProfileDto, req) {
        const user = req.user;
        console.log('Create company profile request user:', user);
        console.log('Create company profile DTO:', createCompanyProfileDto);
        if (!user || !user.id) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        if (user.role !== 'company') {
            throw new common_1.ForbiddenException('Only company users can create a company profile');
        }
        const profile = await this.companyProfileService.createOrUpdateProfile(user.id, createCompanyProfileDto);
        console.log('Created company profile:', profile);
        return profile;
    }
    async updateProfile(updateCompanyProfileDto, req) {
        const user = req.user;
        console.log('Update company profile request user:', user);
        console.log('Update company profile DTO:', updateCompanyProfileDto);
        if (!user || !user.id) {
            throw new common_1.UnauthorizedException('Invalid or missing user');
        }
        if (user.role !== 'company') {
            throw new common_1.ForbiddenException('Only company users can update a company profile');
        }
        const profile = await this.companyProfileService.createOrUpdateProfile(user.id, updateCompanyProfileDto);
        console.log('Updated company profile:', profile);
        return profile;
    }
};
exports.CompanyProfileController = CompanyProfileController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Create company profile' }),
    (0, swagger_1.ApiBody)({ type: create_company_profile_dto_1.CreateCompanyProfileDto }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Profile created.',
        type: create_company_profile_dto_1.CreateCompanyProfileDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_profile_dto_1.CreateCompanyProfileDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyProfileController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Update company profile' }),
    (0, swagger_1.ApiBody)({ type: update_company_profile_dto_1.UpdateCompanyProfileDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Profile updated.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 10 },
                        companyName: { type: 'string', example: 'Acme Corp' },
                        industry: { type: 'string', example: 'Software' },
                        website: { type: 'string', example: 'https://acme.com' },
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
                        companyName: 'Acme Corp',
                        industry: 'Software',
                        website: 'https://acme.com',
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
    __metadata("design:paramtypes", [update_company_profile_dto_1.UpdateCompanyProfileDto, Object]),
    __metadata("design:returntype", Promise)
], CompanyProfileController.prototype, "updateProfile", null);
exports.CompanyProfileController = CompanyProfileController = __decorate([
    (0, swagger_1.ApiTags)('company-profile'),
    (0, common_1.Controller)('companies/profile'),
    __metadata("design:paramtypes", [company_profile_service_1.CompanyProfileService])
], CompanyProfileController);
//# sourceMappingURL=company-profile.controller.js.map