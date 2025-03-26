import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MemberRole } from '@prisma/client';

export class CreateDepartmentMemberDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '750e8400-e29b-41d4-a716-446655440000', description: 'Department ID' })
  @IsString()
  departmentId: string;

  @ApiPropertyOptional({ enum: MemberRole, example: MemberRole.head, description: 'User role in department' })
  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole;
}
