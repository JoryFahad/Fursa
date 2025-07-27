import { StreamableFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationService } from '../application/application.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ApplicationStatus } from '../application/dto/create-application.dto';
export declare class StudentApplicationController {
    private applicationService;
    private fileUploadService;
    constructor(applicationService: ApplicationService, fileUploadService: FileUploadService);
    getMyApplications(req: Request, page?: number, limit?: number, status?: ApplicationStatus): Promise<{
        items: ({
            internship: {
                company: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    companyName: string | null;
                    industry: string | null;
                    website: string | null;
                    userId: number;
                };
            } & {
                description: string;
                title: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                location: string;
                isRemote: boolean;
                duration: string;
                applicationDeadline: Date;
                companyId: number;
                isDeleted: boolean;
                isOpen: boolean;
            };
        } & {
            id: number;
            updatedAt: Date;
            status: import("generated/prisma").$Enums.ApplicationStatus;
            internshipId: number;
            studentId: number;
            resumePath: string | null;
            coverLetterPath: string | null;
            appliedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
    }>;
    downloadMyApplicationFile(applicationId: string, type: 'resume' | 'cover-letter', req: Request, res: Response): Promise<StreamableFile>;
}
