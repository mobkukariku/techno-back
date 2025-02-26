import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateRequestsDto {
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsEmail({}, { message: 'Write your email correctly' })
  email: string;

  @IsNotEmpty({ message: 'Message cannot be empty' })
  @IsString({ message: 'Message must be a string' })
  message: string;

  @IsNotEmpty({ message: 'Direction cannot be empty' })
  @IsString({ message: 'Direction must be a string' }) // Так как Prisma Direction — это строка
  direction: string;
}
