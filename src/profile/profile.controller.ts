import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AuthGuard, RolesGuard } from '../guards';
import { Roles } from '../decorators/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateProfileDto) {
    return this.profileService.createProfile(dto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }
}
