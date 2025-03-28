import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAll() {
    return this.tagsService.getAll();
  }

  @Post()
  async create(@Body() dto: CreateTagDto) {
    return this.tagsService.createTag(dto);
  }
}
