import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Write your email correctly' })
  email: string;

  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString({ message: 'Role must be a string' })
  @IsOptional()
  role?: string;

  @IsUUID('4', { each: true })
  @IsOptional()
  headOfDepartments?: string[];

  @IsUUID()
  @IsOptional()
  departmentId?: string;
}
