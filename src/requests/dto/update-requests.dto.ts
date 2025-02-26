import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Direction } from '@prisma/client';

export class UpdateRequestsDto {
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  name?: string;

  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsOptional()
  @IsEmail({}, { message: 'Write your email correctly' })
  email?: string;

  @IsNotEmpty({ message: 'Message cannot be empty' })
  @IsOptional()
  @IsString({ message: 'Message must be a string' })
  message?: string;

  @IsNotEmpty({ message: 'Direction cannot be empty' })
  @IsString({ message: 'Direction must be a string' }) // Так как Prisma Direction — это строка
  direction: string;
}
