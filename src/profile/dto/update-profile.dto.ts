import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MemberRole } from '@prisma/client';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsInt()
  @IsOptional()
  certificates?: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsEnum(MemberRole)
  position?: MemberRole;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
