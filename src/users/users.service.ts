import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../auth/auth-request.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({});
  }
  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getMe(request: AuthRequest) {
    console.log('User in request:', request.user);
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
      },
    });
  }
}
