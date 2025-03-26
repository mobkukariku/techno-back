import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { MemberRole } from '@prisma/client';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: '750e8400-e29b-41d4-a716-446655440000',
    description: 'User ID',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    example: MemberRole.member,
    description: 'Updated position',
  })
  @IsOptional()
  @IsEnum(MemberRole, { message: 'Invalid role' })
  position?: MemberRole;

  @ApiPropertyOptional({
    example: 'Updated description',
    description: 'New profile description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
