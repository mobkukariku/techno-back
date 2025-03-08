import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../auth/auth-request.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
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

  async getAllUsersMembers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        memberProfile: {
          select: {
            imageURL: true,
            position: true,
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
            skills: true,
            description: true,
          },
        },
        contacts: true,
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
            skills: true,
            description: true,
          },
        },
        contacts: true,
      },
    });
  }
}
