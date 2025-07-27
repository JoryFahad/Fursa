import { FileUploadService } from './file-upload.service';
export declare class FileUploadController {
    private readonly fileUploadService;
    constructor(fileUploadService: FileUploadService);
    uploadFile(file: {
        originalname: string;
        buffer: Buffer;
        mimetype: string;
    }, req: any): Promise<{
        key: string;
    }>;
}
