import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
export declare class StudentProfileService {
    private prisma;
    constructor(prisma: PrismaService);
    updateProfile(userId: number, dto: CreateStudentProfileDto): Promise<{
        message: string;
        profile: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            fullName: string | null;
            university: string | null;
            major: string | null;
            graduationYear: number | null;
            userId: number;
        };
    }>;
    createProfile(userId: number, dto: CreateStudentProfileDto): Promise<{
        message: string;
        profile: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            fullName: string | null;
            university: string | null;
            major: string | null;
            graduationYear: number | null;
            userId: number;
        };
    }>;
}
