import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async createProfile(dto: CreateProfileDto) {
    return this.prisma.memberProfile.create({
      data: {
        userId: dto.userId,
        imageURL: dto.imageURL,
        skills: { set: dto.skills },
        position: dto.position,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.memberProfile.findMany();
  }

  async findOne(id: string) {
    return this.prisma.memberProfile.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    return this.prisma.memberProfile.update({
      where: { id },
      data: { ...updateProfileDto },
    });
  }
}
