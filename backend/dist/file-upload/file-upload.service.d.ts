import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
export declare class FileUploadService {
    private readonly configService;
    private s3;
    private bucket;
    constructor(configService: ConfigService);
    uploadFile(file: {
        originalname: string;
        buffer: Buffer;
        mimetype: string;
    }, userId?: number, internshipId?: number, type?: string): Promise<string>;
    getFileAsBase64(key: string): Promise<string | null>;
    streamFile(key: string, res: any): Promise<void>;
    getFileStream(key: string): Promise<Readable>;
}
