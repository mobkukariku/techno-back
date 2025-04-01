import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';

const partnershipDir = './uploads/partnership';
const jobApplicationsDir = './uploads/job-applications';

if (!existsSync(partnershipDir)) {
  mkdirSync(partnershipDir, { recursive: true });
}

if (!existsSync(jobApplicationsDir)) {
  mkdirSync(jobApplicationsDir, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}_${file.originalname}`);
        },
      }),
    }),
  ],
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService],
})
export class RequestsModule {}
