import { Response } from 'express';
export declare class GoogleDriveService {
    private driveClient;
    constructor();
    uploadFile({ fileBuffer, filename, folderId, mimeType, }: {
        fileBuffer: Buffer;
        filename: string;
        folderId: string;
        mimeType: string;
    }): Promise<{
        fileId: string;
        webViewLink: string;
    }>;
    streamFile(fileId: string, res: Response): Promise<void>;
}
