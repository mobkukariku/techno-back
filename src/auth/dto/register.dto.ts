import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
  IsEnum,
  Matches,
} from 'class-validator';

export enum UserRole {
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export class RegisterDto {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Write your email correctly' })
  email: string;

  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  imageURL?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either "user" or "admin"' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'Position must be a string' })
  position?: string;

  @IsOptional()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'Phone number must be a valid international format (+1234567890)',
  })
  phoneNumber?: string;
}
