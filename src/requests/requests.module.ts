import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService],
})
export class RequestsModule {}
