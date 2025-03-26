import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'User ID' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Write your email correctly' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({ example: 'securePass123', description: 'User password' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiPropertyOptional({ example: 'ADMIN', description: 'User role' })
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({
    example: ['650e8400-e29b-41d4-a716-446655440000'],
    description: 'List of department IDs where user is head',
  })
  @IsUUID('4', { each: true })
  @IsOptional()
  headOfDepartments?: string[];

  @ApiPropertyOptional({ example: '750e8400-e29b-41d4-a716-446655440000', description: 'User department ID' })
  @IsUUID()
  @IsOptional()
  departmentId?: string;
}
