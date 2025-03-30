import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, ConfigService],
})
export class ProfileModule {}
