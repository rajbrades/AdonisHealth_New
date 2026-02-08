import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateRegimenDto {
    @IsOptional()
    @IsString()
    dosage?: string;

    @IsOptional()
    @IsString()
    frequency?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    reason?: string; // Reason for the change (for change log)
}

export class DiscontinueRegimenDto {
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsString()
    reason?: string; // Reason for discontinuing
}
