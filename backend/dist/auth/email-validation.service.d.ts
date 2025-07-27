import { ConfigService } from '@nestjs/config';
export declare class EmailValidationService {
    private configService;
    private resolveMx;
    constructor(configService: ConfigService);
    validateEmailWithMX(email: string): Promise<boolean>;
    validateMultipleEmails(emails: string[]): Promise<string[]>;
    isDisposableEmail(email: string): boolean;
    comprehensiveEmailValidation(email: string, allowDisposable?: boolean): Promise<boolean>;
}
