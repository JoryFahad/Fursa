"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const student_profile_module_1 = require("./student-profile/student-profile.module");
const passport_1 = require("@nestjs/passport");
const company_profile_module_1 = require("./company-profile/company-profile.module");
const internship_module_1 = require("./internship/internship.module");
const application_module_1 = require("./application/application.module");
const company_module_1 = require("./company/company.module");
const students_module_1 = require("./students/students.module");
const admin_module_1 = require("./admin/admin.module");
const throttler_1 = require("@nestjs/throttler");
const file_upload_module_1 = require("./file-upload/file-upload.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            prisma_module_1.PrismaModule,
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 5,
                    },
                ],
            }),
            auth_module_1.AuthModule,
            student_profile_module_1.StudentProfileModule,
            company_profile_module_1.CompanyProfileModule,
            internship_module_1.InternshipModule,
            application_module_1.ApplicationModule,
            company_module_1.CompanyModule,
            students_module_1.StudentsModule,
            admin_module_1.AdminModule,
            file_upload_module_1.FileUploadModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map