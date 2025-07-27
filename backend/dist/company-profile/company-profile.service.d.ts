import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
export declare class CompanyProfileService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createOrUpdateProfile(userId: number, dto: Partial<CreateCompanyProfileDto>): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        companyName: string | null;
        industry: string | null;
        website: string | null;
        userId: number;
    }>;
}
