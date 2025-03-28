import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { MemberRole } from '@prisma/client';

export class CreateProfileDto {
  @ApiProperty({
    example: '750e8400-e29b-41d4-a716-446655440000',
    description: 'User ID',
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Profile image URL',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid image URL' })
  imageURL?: string;

  @ApiPropertyOptional({
    example: MemberRole.head,
    description: 'User position',
  })
  @IsOptional()
  @IsEnum(MemberRole, { message: 'Invalid role' })
  position?: MemberRole;

  @ApiPropertyOptional({
    example: 'Experienced software developer',
    description: 'Profile description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
