import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkExperieceDto {
  @ApiPropertyOptional({
    description: 'Unique work experience identifier',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ description: 'User ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ description: 'Position held at the company' })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiPropertyOptional({ description: 'Start date of employment', type: Date })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End date of employment', type: Date })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Job description' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
