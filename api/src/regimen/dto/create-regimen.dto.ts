import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateRegimenDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    dosage?: string;

    @IsOptional()
    @IsString()
    frequency?: string;

    @IsEnum(['RX', 'SUPPLEMENT'])
    type: 'RX' | 'SUPPLEMENT';

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsString()
    reason?: string; // Reason for adding (for change log)
}
