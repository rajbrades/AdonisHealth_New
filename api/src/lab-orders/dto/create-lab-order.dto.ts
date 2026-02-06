import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateLabOrderDto {
  @IsString()
  patientId: string;

  @IsString()
  panelName: string;

  @IsOptional()
  @IsString()
  panelCodes?: string; // JSON array of test codes

  @IsOptional()
  @IsString()
  labProvider?: string; // EVEXIA, QUEST, LABCORP

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  patientPay?: boolean;

  @IsOptional()
  @IsString()
  drawSiteAddress?: string;

  @IsOptional()
  @IsDateString()
  scheduledDrawDate?: string;

  @IsOptional()
  @IsString()
  orderingProviderId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
