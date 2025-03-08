import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WorkexperienceService } from './workexperience.service';
import { CreateWorkExperieceDto } from './dto/create-workExperiece.dto';
import { AuthGuard } from '../guards';

@Controller('work-experience')
export class WorkexperienceController {
  constructor(private readonly workexperienceService: WorkexperienceService) {}

  @Get('/:id')
  async getByUserId(@Param('id') userId: string) {
    return this.workexperienceService.getByUserId(userId);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateWorkExperieceDto) {
    return this.workexperienceService.create(dto);
  }
}
