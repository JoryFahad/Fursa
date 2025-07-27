import { Request } from 'express';
import { InternshipService } from '../internship/internship.service';
export declare class CompanyController {
    private internshipService;
    constructor(internshipService: InternshipService);
    getMyInternships(page: number | undefined, limit: number | undefined, status: string | undefined, req: Request): Promise<{
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
}
