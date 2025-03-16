import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkExperieceDto } from './dto/create-workExperiece.dto';
import { UpdateWorkExperienceDto } from './dto/update-workExperience.dto';

@Injectable()
export class WorkexperienceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkExperieceDto) {
    return this.prisma.workExperience.create({
      data: {
        userId: dto.userId,
        company: dto.company,
        position: dto.position,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
    });
  }

  async getByUserId(userId: string) {
    return this.prisma.workExperience.findMany({
      where: { userId: userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async update(id: string, dto: UpdateWorkExperienceDto) {
    const existingRecord = await this.prisma.workExperience.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new Error(`Запись с ID ${id} не найдена`);
    }

    return this.prisma.workExperience.update({
      where: { id },
      data: { ...dto },
    });
  }

  async delete(id: string) {
    const existingRecord = await this.prisma.workExperience.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Опыт работы с ID ${id} не найден`);
    }

    return this.prisma.workExperience.delete({
      where: { id },
    });
  }
}
