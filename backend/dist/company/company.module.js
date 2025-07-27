"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModule = void 0;
const common_1 = require("@nestjs/common");
const company_controller_1 = require("./company.controller");
const company_application_controller_1 = require("./company-application.controller");
const internship_module_1 = require("../internship/internship.module");
const application_module_1 = require("../application/application.module");
const file_upload_module_1 = require("../file-upload/file-upload.module");
const jwt_1 = require("@nestjs/jwt");
let CompanyModule = class CompanyModule {
};
exports.CompanyModule = CompanyModule;
exports.CompanyModule = CompanyModule = __decorate([
    (0, common_1.Module)({
        imports: [internship_module_1.InternshipModule, application_module_1.ApplicationModule, file_upload_module_1.FileUploadModule, jwt_1.JwtModule],
        controllers: [company_controller_1.CompanyController, company_application_controller_1.CompanyApplicationController],
    })
], CompanyModule);
//# sourceMappingURL=company.module.js.map