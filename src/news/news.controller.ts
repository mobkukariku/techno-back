import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { AuthRequest } from '../auth/auth-request.interface';
import { AuthGuard, RolesGuard } from '../guards';
import { Roles } from '../decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './news.multer';

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
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createNews(
    @Req() request: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateNewsDto,
  ) {
    const imageURL = file ? `I/O/${file.filename}` : null;

    return this.newsService.createNews(request, {
      ...dto,
      imageURL: imageURL as string,
    });
  }

  @Patch(':id')
  @Roles('manager')
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateNews(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: Partial<CreateNewsDto>,
  ) {
    const imageURL = file ? `I/O/${file.filename}` : undefined;

    return this.newsService.updateNews(id, {
      ...dto,
      imageURL,
    });
  }

  @Delete(':id')
  @Roles('manager')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteNews(@Param('id') id: string) {
    return this.newsService.deleteNews(id);
  }
}
