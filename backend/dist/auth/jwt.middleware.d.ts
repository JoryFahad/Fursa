import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class JwtDecodeMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
