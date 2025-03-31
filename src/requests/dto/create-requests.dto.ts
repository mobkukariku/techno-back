import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateRequestsDto {
  @ApiProperty({ description: 'Requester name' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  name: string;

  @ApiProperty({ description: 'Requester email', example: 'example@mail.com' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsEmail({}, { message: 'Write your email correctly' })
  email: string;

  @ApiProperty({ description: 'Request message' })
  @IsNotEmpty({ message: 'Message cannot be empty' })
  @IsString({ message: 'Message must be a string' })
  message: string;

  @ApiProperty({ description: 'Request direction' })
  @IsNotEmpty({ message: 'Direction cannot be empty' })
  @IsString({ message: 'Direction must be a string' }) // Since Prisma Direction is a string
  direction: string;
}
