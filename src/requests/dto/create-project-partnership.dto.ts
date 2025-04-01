import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
