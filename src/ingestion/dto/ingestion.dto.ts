import {
  IsString,
  IsNumber,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';

export class IngestDto {
  @IsIn(['METER', 'VEHICLE'])
  type: 'METER' | 'VEHICLE';

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsString()
  meterId?: string;

  @IsOptional()
  @IsNumber()
  kwhDeliveredDc?: number;

  @IsOptional()
  @IsNumber()
  kwhConsumedAc?: number;

  @IsOptional()
  @IsNumber()
  batteryTemp?: number;

  @IsOptional()
  @IsNumber()
  soc?: number;

  @IsOptional()
  @IsNumber()
  voltage?: number;

  @IsDateString()
  timestamp: string;
}