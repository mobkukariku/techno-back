import { Module } from '@nestjs/common';
import { WorkexperienceService } from './workexperience.service';
import { WorkexperienceController } from './workexperience.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WorkexperienceController],
  providers: [WorkexperienceService, PrismaService],
})
export class WorkexperienceModule {}
