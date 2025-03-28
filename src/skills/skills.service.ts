import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { AssignSkillDto } from './dto/assign-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: {
        ...dto,
      },
    });
  }

  async findAll() {
    return this.prisma.skill.findMany();
  }
  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async findByUser(userId: string) {
    const skills = await this.prisma.memberProfileSkill.findMany({
      where: {
        profile: {
          userId: userId,
        },
      },
      select: {
        skill: true,
      },
    });
    return skills.map((s) => s.skill);
  }

  async remove(id: string) {
    return this.prisma.skill.delete({
      where: { id },
    });
  }

  async assignSkillToProfile(userId: string, skillName: string) {
    const profile = await this.prisma.memberProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }
    let skill = await this.prisma.skill.findFirst({
      where: { name: skillName },
    });

    if (!skill) {
      skill = await this.prisma.skill.create({
        data: {
          name: skillName,
        },
      });
    }

    return this.prisma.memberProfileSkill.create({
      data: {
        profileId: profile.id,
        skillId: skill.id,
      },
    });
  }

  async removeSkillFromProfile(dto: AssignSkillDto) {
    return this.prisma.memberProfileSkill.delete({
      where: {
        profileId_skillId: {
          profileId: dto.userId,
          skillId: dto.skillId,
        },
      },
    });
  }
}
