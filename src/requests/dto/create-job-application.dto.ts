import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobApplicationDto {
  @ApiProperty({ 
    description: 'Full name of the applicant',
    example: 'Jane Smith',
    minLength: 2,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  fullName: string;

  @ApiProperty({ 
    description: 'Email address of the applicant',
    example: 'jane.smith@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Telegram username (must start with @)',
    example: '@janesmith',
    pattern: '^@[a-zA-Z0-9_]{5,32}$'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^@[a-zA-Z0-9_]{5,32}$/, {
    message: 'Telegram username must be in format @username',
  })
  telegramUsername: string;
  
  @ApiPropertyOptional({
    description: 'Job role the applicant is applying for',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsUUID()
  jobRoleId?: string;
}
