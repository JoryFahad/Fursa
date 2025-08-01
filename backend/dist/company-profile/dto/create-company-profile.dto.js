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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanyProfileDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCompanyProfileDto {
    companyName;
    industry;
    website;
}
exports.CreateCompanyProfileDto = CreateCompanyProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Acme Corp', maxLength: 100 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Software', maxLength: 100 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://acme.com', maxLength: 200 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    (0, class_validator_1.IsUrl)({}, { message: 'website must be a valid URL' }),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "website", void 0);
//# sourceMappingURL=create-company-profile.dto.js.map