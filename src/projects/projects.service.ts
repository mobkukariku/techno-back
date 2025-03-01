import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectsDto } from './dto/create-projects.dto';
import { UpdateProjectsDto } from './dto/update-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getAllProjects(params: {
    search?: string;
    departmentId?: string;
    sort?: string;
    limit?: number;
    page?: number;
  }) {
    const { search, departmentId, sort, limit = 3, page = 1 } = params;

    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;

    return this.prisma.projects.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},

          departmentId ? { departmentId: departmentId } : {},
        ],
      },
      orderBy: { createdAt: sort === 'newest' ? 'desc' : 'asc' },
      skip,
      take: limit,
      include: {
        images: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async getProjectById(id: string) {
    return this.prisma.projects.findUnique({
      where: {
        id,
      },
    });
  }

  async createProject(dto: CreateProjectsDto, imageUrls: string[]) {
    const { title, description, departmentId } = dto;

    return this.prisma.projects.create({
      data: {
        title,
        description,
        departmentId,
        images: {
          create: imageUrls.map((url) => ({ imageUrl: url })),
        },
      },
      include: { images: true },
    });
  }

  async updateProject(id: string, dto: UpdateProjectsDto) {
    const { title, description, departmentId } = dto;

    const existingProject = await this.prisma.projects.findUnique({
      where: {
        id,
      },
    });

    if (!existingProject) {
      throw new Error('Project not found');
    }

    return this.prisma.projects.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        departmentId,
      },
    });
  }

  async deleteProject(id: string) {
    return this.prisma.projects.delete({
      where: {
        id,
      },
    });
  }
}
