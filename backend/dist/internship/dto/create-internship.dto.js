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
exports.CreateInternshipDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateInternshipDto {
    title;
    description;
    location;
    isRemote;
    duration;
    applicationDeadline;
}
exports.CreateInternshipDto = CreateInternshipDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Frontend Developer Intern', maxLength: 255 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Work on UI components and collaborate with the frontend team.',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Remote' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInternshipDto.prototype, "isRemote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3 months' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-01T00:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInternshipDto.prototype, "applicationDeadline", void 0);
//# sourceMappingURL=create-internship.dto.js.map