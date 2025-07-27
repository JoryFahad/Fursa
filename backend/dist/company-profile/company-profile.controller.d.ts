import { Request } from 'express';
import { CompanyProfileService } from './company-profile.service';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
export declare class CompanyProfileController {
    private companyProfileService;
    constructor(companyProfileService: CompanyProfileService);
    createProfile(createCompanyProfileDto: CreateCompanyProfileDto, req: Request): Promise<CreateCompanyProfileDto>;
    updateProfile(updateCompanyProfileDto: UpdateCompanyProfileDto, req: Request): Promise<any>;
}
