import { AppService } from './app.service';
import { Request } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getProtected(req: Request): Promise<any>;
}
