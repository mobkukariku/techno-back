import { PartialType } from '@nestjs/swagger';
import { CreateContactDto } from './create-contacts.dto';

export class UpdateContactDto extends PartialType(CreateContactDto) {}
