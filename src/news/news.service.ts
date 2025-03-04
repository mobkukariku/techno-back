import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../auth/auth-request.interface';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async getAllNews(params: {
    search?: string;
    tags?: string[];
    sort?: string;
    limit?: number;
    page?: number;
  }) {
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
        tags: tags?.length ? { some: { tagId: { in: tags } } } : undefined,
      },
      orderBy: { createdAt: sort === 'newest' ? 'desc' : 'asc' },
      skip,
      take: limit,
      include: {
        tags: { include: { tag: true } },
      },
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
    const { title, content, tagIds, imageURL } = dto;
    const authorId = request.user?.id;
    const tagIdArray = Array.isArray(tagIds) ? tagIds : tagIds ? [tagIds] : [];

    const existingTags = await this.prisma.tags.findMany({
      where: { id: { in: tagIdArray } },
      select: { id: true },
    });

    const validTagIds = existingTags.map((tag) => tag.id);

    return this.prisma.news.create({
      data: {
        title,
        content,
        imageURL,
        author: { connect: { id: authorId } },
        tags: validTagIds.length
          ? {
              create: validTagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        tags: { include: { tag: true } },
      },
    });
  }

  async updateNews(id: string, dto: UpdateNewsDto) {
    const { title, content, tagIds, imageURL } = dto;

    const existingNews = await this.prisma.news.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!existingNews) {
      throw new NotFoundException('News not found');
    }

    return this.prisma.news.update({
      where: { id },
      data: {
        title,
        content,
        imageURL,
        tags: {
          deleteMany: {}, // Удаляем старые теги
          create: tagIds?.map((tagTitles) => ({
            tag: { connect: { name: tagTitles } },
          })),
        },
      },
      include: {
        tags: { include: { tag: true } },
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

  async getLastNews(exceptId: string) {
    return this.prisma.news.findMany({
      where: {
        id: { not: exceptId },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  }
}
