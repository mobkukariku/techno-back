import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProjectsDto {
  @ApiPropertyOptional({ description: 'Project title' })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({ description: 'Department ID', format: 'uuid' })
  @IsUUID()
  @IsString({ each: true })
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Project images' })
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
