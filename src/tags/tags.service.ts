import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.tags.findMany();
  }

  async createTag(dto: CreateTagDto) {
    return this.prisma.tags.create({
      data: {
        ...dto,
      },
    });
  }
}
