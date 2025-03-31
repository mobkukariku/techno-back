import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRequestsDto {
  @ApiPropertyOptional({ description: 'Requester name' })
  @IsOptional()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Requester email',
    example: 'example@mail.com',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsEmail({}, { message: 'Write your email correctly' })
  email?: string;

  @ApiPropertyOptional({ description: 'Request message' })
  @IsOptional()
  @IsNotEmpty({ message: 'Message cannot be empty' })
  @IsString({ message: 'Message must be a string' })
  message?: string;

  @ApiPropertyOptional({ description: 'Request direction' })
  @IsOptional()
  @IsNotEmpty({ message: 'Direction cannot be empty' })
  @IsString({ message: 'Direction must be a string' }) // Since Prisma Direction is a string
  direction?: string;
}
