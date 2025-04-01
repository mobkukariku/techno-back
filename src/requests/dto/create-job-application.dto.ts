import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateJobApplicationDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^@[a-zA-Z0-9_]{5,32}$/, {
    message: 'Telegram username must be in format @username',
  })
  telegramUsername: string;
}
