import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestsDto } from './dto/create-requests.dto';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async createRequest(dto: CreateRequestsDto) {
    const { name, email, message, direction } = dto;

    return this.prisma.requests.create({
      data: {
        name,
        email,
        message,
        direction,
      },
    });
  }

  async getAllRequests() {
    return this.prisma.requests.findMany();
  }
}
