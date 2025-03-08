import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkExperieceDto } from './dto/create-workExperiece.dto';

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
}
