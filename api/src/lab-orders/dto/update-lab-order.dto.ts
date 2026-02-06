import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateLabOrderDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  drawSiteAddress?: string;

  @IsOptional()
  @IsDateString()
  scheduledDrawDate?: string;

  @IsOptional()
  @IsDateString()
  actualDrawDate?: string;

  @IsOptional()
  @IsString()
  labPanelId?: string; // Link to results

  @IsOptional()
  @IsString()
  evexiaOrderId?: string;

  @IsOptional()
  @IsString()
  evexiaStatus?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLabOrderStatusDto {
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
