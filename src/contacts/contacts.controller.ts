import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contacts.dto';
import { UpdateContactDto } from './dto/update-contacts.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('/:id')
  async getById(@Param('id') userId: string) {
    return this.contactsService.getById(userId);
  }

  @Post()
  async create(@Body() dto: CreateContactDto) {
    return this.contactsService.create(dto);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactsService.update(id, dto);
  }
}
