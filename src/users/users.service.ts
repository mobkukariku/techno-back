import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../auth/auth-request.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(search?: string) {
    return this.prisma.user.findMany({
      where: search
        ? {
            OR: [
              { id: search },
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        departmentMemberships: {
          select: {
            departmentId: true,
            role: true,
          },
        },
      },
    });
  }

  async getAllUsersMembers(search?: string) {
    return this.prisma.user.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              {
                memberProfile: {
                  position: { contains: search, mode: 'insensitive' },
                },
              },
            ],
          }
        : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        memberProfile: {
          select: {
            imageURL: true,
            position: true,
            skills: true,
          },
        },
      },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        memberProfile: {
          select: {
            imageURL: true,
            position: true,
            description: true,
          },
        },
      },
    });
  }

  async getMe(request: AuthRequest) {
    const id = request.user?.id;

    if (!id) {
      throw new Error('User ID is missing in request');
    }

    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        memberProfile: {
          select: {
            imageURL: true,
            position: true,
            description: true,
          },
        },
      },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        role: dto.role,
        isActive: dto.isActive,
      },
    });
  }
}
