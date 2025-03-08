import { IsEnum, IsString } from 'class-validator';
import { ContactType } from '@prisma/client';

export class UpdateContactDto {
  @IsEnum(ContactType, { each: true })
  type?: ContactType;

  @IsString()
  value?: string;
}
