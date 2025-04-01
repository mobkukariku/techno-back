import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateJobRoleDto {
  @ApiPropertyOptional({
    description: 'Name of the job role',
    example: 'Senior Software Developer'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Whether the job role is active',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
