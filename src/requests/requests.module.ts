import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
  imports: [
    FileStorageModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService],
})
export class RequestsModule {}
