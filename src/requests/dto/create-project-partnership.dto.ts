import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProjectPartnershipDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 2000)
  description: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  senderName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
