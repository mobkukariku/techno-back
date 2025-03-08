import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MemberRole } from '@prisma/client';

export class UpdateDepartmentMemberDto {
  @IsString()
  userId: string;

  @IsString()
  departmentId: string;

  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole;
}
