import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MemberRole } from '@prisma/client';

export class CreateDepartmentMemberDto {
  @IsString()
  userId: string;

  @IsString()
  departmentId: string;

  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole;
}
