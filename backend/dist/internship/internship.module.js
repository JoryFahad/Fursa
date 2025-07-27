"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternshipModule = void 0;
const common_1 = require("@nestjs/common");
const internship_controller_1 = require("./internship.controller");
const internship_service_1 = require("./internship.service");
const prisma_module_1 = require("../prisma/prisma.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let InternshipModule = class InternshipModule {
};
exports.InternshipModule = InternshipModule;
exports.InternshipModule = InternshipModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') || '15m' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [internship_controller_1.InternshipController],
        providers: [internship_service_1.InternshipService],
        exports: [internship_service_1.InternshipService],
    })
], InternshipModule);
//# sourceMappingURL=internship.module.js.map