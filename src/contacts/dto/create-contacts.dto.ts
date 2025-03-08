import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ContactType } from '@prisma/client';

export class CreateContactDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ContactType)
  @IsNotEmpty()
  type: ContactType;

  @IsString()
  @IsNotEmpty()
  value: string;
}
