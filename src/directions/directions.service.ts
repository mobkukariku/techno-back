import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DirectionsService {
  constructor(private prisma: PrismaService) {}

  async getAllDirections(){
    return this.prisma.direction.findMany();
  }
}
