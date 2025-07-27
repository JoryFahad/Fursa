import { PrismaService } from '../prisma/prisma.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
export declare class InternshipService {
    private prisma;
    constructor(prisma: PrismaService);
    createInternship(userId: number, dto: CreateInternshipDto): Promise<{
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
    }>;
    updateInternship(userId: number, internshipId: number, dto: UpdateInternshipDto): Promise<{
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
    }>;
    deleteInternship(userId: number, internshipId: number): Promise<{
        message: string;
    }>;
    getAllCompanyInternships(userId: number, page?: number, limit?: number, status?: string): Promise<{
        items: {
            isOpen: boolean;
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
        }[];
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
    }>;
    getLatestCompanyInternships(userId: number, limit?: number): Promise<{
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
    }[]>;
    getAllCompanyApplications(userId: number): Promise<({
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
    })[]>;
    getCompanyApplicationDetail(userId: number, applicationId: number): Promise<{
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
    getAllAvailableInternships(status?: 'open' | 'closed' | 'all', page?: number, limit?: number): Promise<{
        items: ({
            company: {
                id: number;
                companyName: string | null;
                industry: string | null;
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
        })[];
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
    }>;
    getCompanyInternships(options: {
        latest?: boolean;
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
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
    }[]>;
    getCompanyInternshipById(id: number): Promise<{
        isOpen: boolean;
        company: {
            id: number;
            companyName: string | null;
            industry: string | null;
            website: string | null;
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
    }>;
    closeInternship(userId: number, internshipId: number): Promise<{
        id: number;
        isOpen: boolean;
        message: string;
    }>;
}
