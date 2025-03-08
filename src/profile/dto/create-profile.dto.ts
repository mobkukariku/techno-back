import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { MemberRole } from '@prisma/client';

export class CreateProfileDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsUrl()
  @IsOptional()
  @IsNotEmpty()
  imageURL?: string;

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
