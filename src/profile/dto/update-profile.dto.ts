import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MemberRole } from '@prisma/client';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  userId?: string;


  @IsOptional()
  @IsOptional()
  @IsEnum(MemberRole)
  position?: MemberRole;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
