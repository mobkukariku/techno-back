import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() dto: CreateWorkExperieceDto) {
    return this.workexperienceService.update(id, dto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.workexperienceService.delete(id);
  }
}
