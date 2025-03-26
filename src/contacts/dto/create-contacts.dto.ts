import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ContactType } from '@prisma/client';

export class CreateContactDto {

  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: ContactType, example: ContactType.PHONE, description: 'Type of contact' })
  @IsEnum(ContactType)
  @IsNotEmpty()
  type: ContactType;

  @ApiProperty({ example: '+77001234567', description: 'Contact value' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
