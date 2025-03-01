import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProjectsDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsUUID()
  @IsString({ each: true })
  @IsOptional()
  departmentId?: string;

  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
