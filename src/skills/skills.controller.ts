import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { AssignSkillDto } from './dto/assign-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.skillsService.findByUser(userId);
  }

  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }

  @Post('assign')
  assignSkill(
    @Body('userId') userId: string,
    @Body('skillName') skillName: string,
  ) {
    return this.skillsService.assignSkillToProfile(userId, skillName);
  }

  @Delete('remove')
  removeSkill(@Body() dto: AssignSkillDto) {
    return this.skillsService.removeSkillFromProfile(dto);
  }
}
