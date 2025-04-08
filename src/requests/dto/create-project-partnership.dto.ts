import { IsEmail, IsNotEmpty, IsString, Length, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationInterest } from './create-job-application.dto';

export class CreateProjectPartnershipDto {
  @ApiProperty({ 
    description: 'Title of the partnership project',
    example: 'Innovative Tech Collaboration',
    minLength: 3,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty({ 
    description: 'Detailed description of the partnership project',
    example: 'We are looking to collaborate on a new technology project that will...',
    minLength: 10,
    maxLength: 2000
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 2000)
  description: string;

  @ApiProperty({ 
    description: 'Full name of the sender',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  senderName: string;

  @ApiProperty({ 
    description: 'Email address of the sender',
    example: 'john.doe@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'How did you hear about us?',
    example: 'LinkedIn',
    maxLength: 200
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  referralSource: string;

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
