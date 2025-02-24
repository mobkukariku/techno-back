import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

}
