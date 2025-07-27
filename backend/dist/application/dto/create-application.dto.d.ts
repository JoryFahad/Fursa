export declare enum ApplicationStatus {
    SUBMITTED = "SUBMITTED",
    IN_REVIEW = "IN_REVIEW",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}
export declare class CreateApplicationDto {
    internshipId: number;
    resumePath?: string;
    coverLetterPath?: string;
    status?: ApplicationStatus;
}
