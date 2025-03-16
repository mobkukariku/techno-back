import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async createProfile(dto: CreateProfileDto) {
    return this.prisma.memberProfile.create({
      data: {
        userId: dto.userId,
        imageURL: dto.imageURL,
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
      where: { userId: id },
    });
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    // Проверяем, есть ли профиль с таким userId
    const profile = await this.prisma.memberProfile.findUnique({
      where: { userId: id },
    });

    if (!profile) {
      throw new NotFoundException(`Профиль с userId=${id} не найден.`);
    }

    let imageURL = profile.imageURL;

    if (file) {
      if (profile.imageURL) {
        const oldImagePath = path.join(
          'images/profiles',
          path.basename(profile.imageURL),
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageURL = `http://localhost:4000/images/profiles/${file.filename}`;
    }
    return this.prisma.memberProfile.update({
      where: { userId: id }, // 🔥 Тут тоже userId
      data: {
        ...updateProfileDto,
        imageURL,
      },
    });
  }

}
