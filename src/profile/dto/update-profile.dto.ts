import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MemberRole } from '@prisma/client';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'User name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Unique user identifier', format: 'uuid' })
  @IsString()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'User role', enum: MemberRole })
  @IsOptional()
  @IsEnum(MemberRole)
  position?: MemberRole;

  @ApiPropertyOptional({ description: 'Profile description' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}