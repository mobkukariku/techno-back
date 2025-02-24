import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectsDto } from './dto/create-projects.dto';
import { UpdateProjectsDto } from './dto/update-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getAllProjects() {
    return this.prisma.projects.findMany();
  }

  async getProjectById(id: string) {
    return this.prisma.projects.findUnique({
      where: {
        id,
      },
    });
  }

  async createProject(dto: CreateProjectsDto) {
    const { title, description, departmentId, imageURL } = dto;

    return this.prisma.projects.create({
      data: {
        title,
        description,
        departmentId,
        imageUrl: imageURL,
      },
    });
  }

  async updateProject(id: string, dto: UpdateProjectsDto) {
    const { title, description, departmentId, imageURL: imageUrl } = dto;

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
        imageUrl,
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
