"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsModule = void 0;
const common_1 = require("@nestjs/common");
const student_application_controller_1 = require("./student-application.controller");
const application_module_1 = require("../application/application.module");
const file_upload_module_1 = require("../file-upload/file-upload.module");
const jwt_1 = require("@nestjs/jwt");
let StudentsModule = class StudentsModule {
};
exports.StudentsModule = StudentsModule;
exports.StudentsModule = StudentsModule = __decorate([
    (0, common_1.Module)({
        imports: [application_module_1.ApplicationModule, file_upload_module_1.FileUploadModule, jwt_1.JwtModule],
        controllers: [student_application_controller_1.StudentApplicationController],
    })
], StudentsModule);
//# sourceMappingURL=students.module.js.map