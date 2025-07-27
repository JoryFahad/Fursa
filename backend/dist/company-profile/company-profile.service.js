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
var CompanyProfileService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CompanyProfileService = CompanyProfileService_1 = class CompanyProfileService {
    prisma;
    logger = new common_1.Logger(CompanyProfileService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrUpdateProfile(userId, dto) {
        this.logger.log(`Attempting to create or update company profile for userId: ${userId}`);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'company') {
            this.logger.warn(`User not found or not a company: userId=${userId}`);
            throw new common_1.NotFoundException('Company user not found');
        }
        const profile = await this.prisma.companyProfile.upsert({
            where: { userId },
            update: {
                ...(dto.companyName !== undefined && { companyName: dto.companyName }),
                ...(dto.industry !== undefined && { industry: dto.industry }),
                ...(dto.website !== undefined && { website: dto.website }),
            },
            create: {
                userId,
                companyName: dto.companyName,
                industry: dto.industry,
                website: dto.website,
            },
        });
        this.logger.log(`Company profile ${profile.id ? 'updated' : 'created'} for userId: ${userId}`);
        return profile;
    }
};
exports.CompanyProfileService = CompanyProfileService;
exports.CompanyProfileService = CompanyProfileService = CompanyProfileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyProfileService);
//# sourceMappingURL=company-profile.service.js.map