"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyProfileModule = void 0;
const common_1 = require("@nestjs/common");
const company_profile_controller_1 = require("./company-profile.controller");
const company_profile_service_1 = require("./company-profile.service");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
let CompanyProfileModule = class CompanyProfileModule {
};
exports.CompanyProfileModule = CompanyProfileModule;
exports.CompanyProfileModule = CompanyProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [company_profile_controller_1.CompanyProfileController],
        providers: [company_profile_service_1.CompanyProfileService],
    })
], CompanyProfileModule);
//# sourceMappingURL=company-profile.module.js.map