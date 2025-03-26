import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MemberRole } from '@prisma/client';

export class UpdateDepartmentMemberDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '750e8400-e29b-41d4-a716-446655440000', description: 'Department ID' })
  @IsString()
  departmentId: string;

  @ApiPropertyOptional({ enum: MemberRole, example: MemberRole.head, description: 'Updated role in department' })
  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole;
}
