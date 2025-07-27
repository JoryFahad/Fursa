import { Request } from 'express';
import { InternshipService } from './internship.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
export declare class InternshipController {
    private readonly internshipService;
    constructor(internshipService: InternshipService);
    createInternship(createInternshipDto: CreateInternshipDto, req: Request): Promise<{
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
    updateInternship(id: string, dto: UpdateInternshipDto, req: Request): Promise<any>;
    deleteInternship(id: string, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllPublicInternships(status?: 'open' | 'closed' | 'all', page?: number, limit?: number): Promise<{
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
    getCompanyInternshipById(id: string): Promise<{
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
    closeInternship(id: string, req: Request): Promise<{
        id: number;
        isOpen: boolean;
        message: string;
    }>;
}
