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
exports.EmailValidationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const util_1 = require("util");
const dns = require("dns");
let EmailValidationService = class EmailValidationService {
    configService;
    resolveMx = (0, util_1.promisify)(dns.resolveMx);
    constructor(configService) {
        this.configService = configService;
    }
    async validateEmailWithMX(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new common_1.BadRequestException('Invalid email format');
        }
        const domain = email.split('@')[1];
        if (!domain) {
            throw new common_1.BadRequestException('Invalid email domain');
        }
        try {
            const mxRecords = await this.resolveMx(domain);
            if (!mxRecords || mxRecords.length === 0) {
                throw new common_1.BadRequestException(`Email domain '${domain}' does not have valid mail servers (no MX records found)`);
            }
            console.log(`MX records found for ${domain}:`, mxRecords);
            return true;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
                throw new common_1.BadRequestException(`Email domain '${domain}' does not exist or has no mail servers`);
            }
            console.error('DNS resolution error:', error);
            throw new common_1.BadRequestException(`Unable to verify email domain '${domain}'. Please check the email address.`);
        }
    }
    async validateMultipleEmails(emails) {
        const validationPromises = emails.map(async (email) => {
            await this.validateEmailWithMX(email);
            return email;
        });
        try {
            return await Promise.all(validationPromises);
        }
        catch (error) {
            throw error;
        }
    }
    isDisposableEmail(email) {
        const domain = email.split('@')[1]?.toLowerCase();
        const disposableDomains = [
            '10minutemail.com',
            'tempmail.org',
            'guerrillamail.com',
            'mailinator.com',
            'yopmail.com',
            'temp-mail.org',
            'throwaway.email',
            'getnada.com',
            'maildrop.cc',
            'sharklasers.com'
        ];
        return disposableDomains.includes(domain);
    }
    async comprehensiveEmailValidation(email, allowDisposable) {
        const allowDisposableEmails = allowDisposable ??
            this.configService.get('ALLOW_DISPOSABLE_EMAILS', false);
        if (!allowDisposableEmails && this.isDisposableEmail(email)) {
            throw new common_1.BadRequestException('Disposable email addresses are not allowed. Please use a permanent email address.');
        }
        return await this.validateEmailWithMX(email);
    }
};
exports.EmailValidationService = EmailValidationService;
exports.EmailValidationService = EmailValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailValidationService);
//# sourceMappingURL=email-validation.service.js.map