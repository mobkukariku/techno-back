import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contacts.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    return this.prisma.contact.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        value: dto.value,
      },
    });
  }

  async getById(userId: string) {
    return this.prisma.contact.findMany({
      where: {
        userId: userId,
      },
    });
  }
}
