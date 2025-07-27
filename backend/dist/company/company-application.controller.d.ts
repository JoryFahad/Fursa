import { StreamableFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationService } from '../application/application.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ApplicationStatus } from '../application/dto/create-application.dto';
export declare class CompanyApplicationController {
    private applicationService;
    private fileUploadService;
    constructor(applicationService: ApplicationService, fileUploadService: FileUploadService);
    getApplicantsForInternship(internshipId: string, req: Request, page?: number, limit?: number, status?: ApplicationStatus): Promise<{
        items: ({
            student: {
                user: {
                    email: string;
                    role: import("generated/prisma").$Enums.Role;
                    id: number;
                    passwordHash: string;
                    createdAt: Date;
                    updatedAt: Date;
                    refreshToken: string | null;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                fullName: string | null;
                university: string | null;
                major: string | null;
                graduationYear: number | null;
                userId: number;
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
    getAllCompanyApplications(req: Request, page?: number, limit?: number, status?: ApplicationStatus, sort?: 'newest' | 'oldest'): Promise<{
        items: ({
            internship: {
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
            student: {
                user: {
                    email: string;
                    role: import("generated/prisma").$Enums.Role;
                    id: number;
                    passwordHash: string;
                    createdAt: Date;
                    updatedAt: Date;
                    refreshToken: string | null;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                fullName: string | null;
                university: string | null;
                major: string | null;
                graduationYear: number | null;
                userId: number;
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
    getApplicationDetail(id: string, req: Request): Promise<{
        internship: {
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
        student: {
            user: {
                email: string;
                role: import("generated/prisma").$Enums.Role;
                id: number;
                passwordHash: string;
                createdAt: Date;
                updatedAt: Date;
                refreshToken: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            fullName: string | null;
            university: string | null;
            major: string | null;
            graduationYear: number | null;
            userId: number;
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
    }>;
    downloadApplicationFile(applicationId: string, type: 'resume' | 'cover-letter', req: Request, res: Response): Promise<StreamableFile>;
}
