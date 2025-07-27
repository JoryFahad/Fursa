import { Request } from 'express';
import { StudentProfileService } from './student-profile.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
export declare class StudentProfileController {
    private studentService;
    constructor(studentService: StudentProfileService);
    createProfile(dto: CreateStudentProfileDto, req: Request): Promise<{
        message: string;
        fullName: string | null;
    }>;
    updateProfile(dto: CreateStudentProfileDto, req: Request): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string | null;
        university: string | null;
        major: string | null;
        graduationYear: number | null;
        userId: number;
    }>;
}
