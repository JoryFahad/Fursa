import { ConfigService } from '@nestjs/config';
export interface JwtPayload {
    sub: number;
    email: string;
    role: 'student' | 'company';
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        id: number;
        email: string;
        role: "student" | "company";
    }>;
}
export {};
