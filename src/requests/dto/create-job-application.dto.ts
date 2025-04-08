import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length, Matches, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrganizationInterest {
  TECHNOPARK = 'Technopark',
  ENACTUS = 'Enactus',
  HULTPRIZE = 'HultPrize'
}

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

  @ApiProperty({ 
    description: 'How the applicant heard about the organization',
    example: 'LinkedIn',
    maxLength: 200
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  referralSource: string;

  @ApiProperty({ 
    description: 'Projects the applicant is interested in working on',
    example: 'Frontend development, Mobile applications',
    maxLength: 500
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  projectInterests: string;

  @ApiProperty({ 
    description: 'Skills that the applicant possesses',
    example: 'JavaScript, React, TypeScript, Node.js',
    maxLength: 500
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  skills: string;

  @ApiProperty({ 
    description: 'Which organizations are you interested in?',
    enum: OrganizationInterest,
    example: OrganizationInterest.TECHNOPARK,
    enumName: 'OrganizationInterest'
  })
  @IsNotEmpty()
  @IsEnum(OrganizationInterest)
  organizationInterest: OrganizationInterest;
}
