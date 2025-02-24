import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { AuthRequest } from '../auth/auth-request.interface';
import { AuthGuard, RolesGuard } from '../guards';
import { Roles } from '../decorators/roles.decorator';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getAllNews(
    @Query('search') search?: string,
    @Query('tags') tags?: string,
    @Query('sort') sort?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.newsService.getAllNews({
      search: search,
      tags: tags ? tags.split(',') : undefined,
      sort,
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
    });
  }

  @Get(':id')
  async getNewsById(@Req() request: AuthRequest) {
    return this.newsService.getNewsById(request.params.id);
  }

  @Post()
  @Roles('manager')
  @UseGuards(AuthGuard, RolesGuard)
  async createNews(@Req() request: AuthRequest, @Body() dto: CreateNewsDto) {
    return this.newsService.createNews(request, dto);
  }
}
