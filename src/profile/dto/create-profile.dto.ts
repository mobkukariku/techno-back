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

export class CreateProfileDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsInt()
  @IsOptional()
  certificates?: number;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsEnum(MemberRole)
  @IsOptional()
  position?: MemberRole;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
