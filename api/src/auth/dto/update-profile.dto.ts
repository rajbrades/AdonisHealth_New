import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    shippingAddress?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    weight?: number; // Weight in pounds
}
