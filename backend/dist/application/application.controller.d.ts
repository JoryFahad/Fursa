import { StreamableFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationService } from './application.service';
import { CreateApplicationDto, ApplicationStatus } from './dto/create-application.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { User } from '../types/express';
export declare class ApplicationController {
    private applicationService;
    private fileUploadService;
    constructor(applicationService: ApplicationService, fileUploadService: FileUploadService);
    applyToInternship(files: {
        resume?: {
            originalname: string;
            buffer: Buffer;
            mimetype: string;
        }[];
        coverLetter?: {
            originalname: string;
            buffer: Buffer;
            mimetype: string;
        }[];
    }, dto: CreateApplicationDto, user: User): Promise<{
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
    getStudentApplications(req: Request, page?: number, limit?: number, status?: ApplicationStatus): Promise<{
        items: {
            application: {
                id: number;
                status: import("generated/prisma").$Enums.ApplicationStatus;
                resumePath: string | null;
                coverLetterPath: string | null;
                appliedAt: Date;
                updatedAt: Date;
            };
            internship: {
                companyName: string | null;
                company: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    companyName: string | null;
                    industry: string | null;
                    website: string | null;
                    userId: number;
                };
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
        }[];
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
    }>;
    getStudentApplicationDetails(applicationId: string, req: Request): Promise<{
        application: {
            id: number;
            status: import("generated/prisma").$Enums.ApplicationStatus;
            resumePath: string | null;
            coverLetterPath: string | null;
            appliedAt: Date;
            updatedAt: Date;
        };
        student: {
            id: number;
            fullName: string;
            university: string;
            major: string;
            graduationYear: string | number;
            email: string;
        };
        internship: {
            id: number;
            title: string;
            description: string;
            location: string;
            isRemote: boolean;
            duration: string;
            applicationDeadline: Date;
        };
    }>;
    updateStatus(applicationId: string, status: ApplicationStatus, req: Request): Promise<{
        id: number;
        updatedAt: Date;
        status: import("generated/prisma").$Enums.ApplicationStatus;
        internshipId: number;
        studentId: number;
        resumePath: string | null;
        coverLetterPath: string | null;
        appliedAt: Date;
    }>;
    getApplicants(internshipId: string, req: Request, page?: number, limit?: number, status?: ApplicationStatus): Promise<{
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
    downloadFile(fileId: string, req: Request, res?: Response): Promise<void>;
    getCompanyApplication(id: string, req: Request, fileType?: 'resume' | 'coverLetter'): Promise<({
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
    }) | StreamableFile>;
    downloadStudentApplicationFile(applicationId: string, fileType: 'resume' | 'cover-letter', req: Request): Promise<StreamableFile>;
}
