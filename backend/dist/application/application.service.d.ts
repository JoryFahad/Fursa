import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto, ApplicationStatus } from './dto/create-application.dto';
export declare class ApplicationService {
    private prisma;
    constructor(prisma: PrismaService);
    apply(studentUserId: number, dto: CreateApplicationDto): Promise<{
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
    getApplicantsForInternship(companyUserId: number, internshipId: number, page?: number, limit?: number, status?: ApplicationStatus): Promise<{
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
    updateApplicationStatus(companyUserId: number, applicationId: number, status: ApplicationStatus): Promise<{
        id: number;
        updatedAt: Date;
        status: import("generated/prisma").$Enums.ApplicationStatus;
        internshipId: number;
        studentId: number;
        resumePath: string | null;
        coverLetterPath: string | null;
        appliedAt: Date;
    }>;
    getCompanyInternships(companyUserId: number): Promise<({
        applications: {
            id: number;
            updatedAt: Date;
            status: import("generated/prisma").$Enums.ApplicationStatus;
            internshipId: number;
            studentId: number;
            resumePath: string | null;
            coverLetterPath: string | null;
            appliedAt: Date;
        }[];
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
    })[]>;
    getStudentApplications(studentUserId: number, page?: number, limit?: number, status?: ApplicationStatus): Promise<{
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
    getApplicationWithApplicant(applicationId: number, companyUserId: number): Promise<{
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
    getApplicationById(applicationId: number, user: any): Promise<{
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
    getAllCompanyApplications(companyUserId: number, page?: number, limit?: number, status?: ApplicationStatus, sort?: 'newest' | 'oldest'): Promise<{
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
    getAllCompanyInternships(userId: number, page?: number, limit?: number): Promise<{
        items: {
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
        }[];
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
    }>;
}
