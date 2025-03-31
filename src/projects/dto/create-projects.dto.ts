import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProjectsDto {
  @ApiPropertyOptional({ description: 'Unique project identifier', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ description: 'Project title' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({ description: 'Project description' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ description: 'Department ID', format: 'uuid' })
  @IsUUID()
  @IsString({ each: true })
  departmentId: string;

  @ApiPropertyOptional({ description: 'Project images' })
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
