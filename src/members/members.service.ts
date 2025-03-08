import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentMemberDto } from './dto/create-members.dto';
import { UpdateDepartmentMemberDto } from './dto/update-members.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async addMember(dto: CreateDepartmentMemberDto) {
    const newMember = await this.prisma.departmentMember.create({
      data: {
        departmentId: dto.departmentId,
        userId: dto.userId,
        role: dto.role,
      },
    });

    if (dto.role === 'head') {
      await this.prisma.department.update({
        where: { id: dto.departmentId },
        data: { headId: dto.userId },
      });
    }

    return newMember;
  }

  async updateMemberRole(dto: UpdateDepartmentMemberDto) {
    const updatedMember = await this.prisma.departmentMember.update({
      where: {
        userId_departmentId: {
          userId: dto.userId,
          departmentId: dto.departmentId,
        },
      },
      data: { role: dto.role },
    });

    if (dto.role === 'head') {
      await this.prisma.department.update({
        where: { id: dto.departmentId },
        data: { headId: dto.userId },
      });
    } else {
      const hasOtherHead = await this.prisma.departmentMember.findFirst({
        where: { departmentId: dto.departmentId, role: 'head' },
      });

      if (!hasOtherHead) {
        await this.prisma.department.update({
          where: { id: dto.departmentId },
          data: { headId: null },
        });
      }
    }

    return updatedMember;
  }

  async removeMember(userId: string, departmentId: string) {
    const member = await this.prisma.departmentMember.findUnique({
      where: { userId_departmentId: { userId, departmentId } },
    });

    await this.prisma.departmentMember.delete({
      where: { userId_departmentId: { userId, departmentId } },
    });

    if (member?.role === 'head') {
      const hasOtherHead = await this.prisma.departmentMember.findFirst({
        where: { departmentId, role: 'head' },
      });

      if (!hasOtherHead) {
        await this.prisma.department.update({
          where: { id: departmentId },
          data: { headId: null },
        });
      }
    }
  }
}
