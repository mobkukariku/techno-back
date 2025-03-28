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
    const profile = await this.prisma.memberProfile.findUnique({
      where: { userId: id },
    });

    let imageURL = profile?.imageURL;

    if (file) {
      if (profile?.imageURL) {
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

    return this.prisma.$transaction(async (prisma) => {
      // Обновляем имя в `User`, если оно передано
      if (updateProfileDto.name) {
        await prisma.user.update({
          where: { id },
          data: { name: updateProfileDto.name },
        });
      }

      if (!profile) {
        // Если профиля нет, создаем его
        return prisma.memberProfile.create({
          data: {
            userId: id,
            imageURL,
            position: updateProfileDto.position,
            description: updateProfileDto.description,
          },
        });
      }

      // Если профиль уже есть, обновляем его
      return prisma.memberProfile.update({
        where: { userId: id },
        data: {
          imageURL,
          position: updateProfileDto.position,
          description: updateProfileDto.description,
        },
      });
    });
  }
}
