import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DirectionsController],
  providers: [DirectionsService, PrismaService],
})
export class DirectionsModule {}
