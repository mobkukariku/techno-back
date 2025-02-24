import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../auth/auth-request.interface';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async getAllNews(
    params: {
      search?: string;
      tags?: string[];
      sort?: string;
      limit?: number;
      page?: number;
    } = {},
  ) {
    const { search, tags, sort, limit = 10, page = 1 } = params;

    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;

    return this.prisma.news.findMany({
      where: {
        OR: search
          ? [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
        tags: tags ? { hasSome: tags } : undefined,
      },
      orderBy: {
        createdAt: sort === 'newest' ? 'desc' : 'asc',
      },
      skip,
      take: limit,
    });
  }

  async getNewsById(id: string) {
    return this.prisma.news.findUnique({
      where: {
        id,
      },
    });
  }
  async createNews(request: AuthRequest, dto: CreateNewsDto) {
    const { title, content, tags = [], imageURL } = dto;
    const authorId = request.user?.id;

    const news = await this.prisma.news.create({
      data: {
        title,
        content,
        tags: {
          set: Array.isArray(tags) ? tags : [tags],
        },
        imageURL,
        authorId,
      },
    });

    return news;
  }

  async updateNews(id: string, dto: UpdateNewsDto) {
    const { title, content, tags, imageURL } = dto;

    const existingNews = await this.prisma.news.findUnique({
      where: { id: id },
    });

    if (!existingNews) {
      throw new NotFoundException('News not found');
    }

    return this.prisma.news.update({
      where: { id: id },
      data: {
        title,
        content,
        tags: tags ? { set: Array.isArray(tags) ? tags : [tags] } : undefined,
        imageURL, // Обновляем только если передано новое изображение
      },
    });
  }

  async deleteNews(id: string) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }

    return this.prisma.news.delete({
      where: { id },
    });
  }
}
