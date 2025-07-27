import { InternshipService } from '../internship/internship.service';
import { ApplicationService } from './application.service';
export declare class StudentApplicationsController {
    private readonly internshipService;
    private readonly applicationService;
    constructor(internshipService: InternshipService, applicationService: ApplicationService);
    getStudentApplicationDetails(applicationId: string, req: any): Promise<{
        application: {
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
        };
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
    }>;
}
