import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from '../prisma/prisma.service';

export type DepartmentNode = {
  id: string;
  name: string | null;
  parentDepartmentId: string | null;
  head: { id: string; name: string } | null;
  subDepartments: DepartmentNode[];
  members: { id: string; name: string }[]; // Изменил тип members
};

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}
  create(dto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: {
        name: dto.name,
        headId: dto.headId,
        parentDepartmentId: dto.parentDepartmentId,
      },
    });
  }

  findAll() {
    return this.prisma.department.findMany();
  }

  findOne(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.department.delete({
      where: { id },
    });
  }

  async getDepartmentHierarchy(): Promise<DepartmentNode[]> {
    const departments = await this.prisma.department.findMany({
      select: {
        id: true,
        name: true,
        parentDepartmentId: true,
        head: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          select: {
            User: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const departmentMap = new Map<string, DepartmentNode>();

    departments.forEach((dept) => {
      departmentMap.set(dept.id, {
        id: dept.id,
        name: dept.name,
        parentDepartmentId: dept.parentDepartmentId,
        head: dept.head ? { id: dept.head.id, name: dept.head.name } : null,
        subDepartments: [],
        members: dept.members.map((m) => ({
          id: m.User.id,
          name: m.User.name,
        })),
      });
    });

    const rootDepartments: DepartmentNode[] = [];

    departments.forEach((dept) => {
      if (dept.parentDepartmentId) {
        const parent = departmentMap.get(dept.parentDepartmentId);
        if (parent) {
          parent.subDepartments.push(departmentMap.get(dept.id)!);
        }
      } else {
        rootDepartments.push(departmentMap.get(dept.id)!);
      }
    });

    return rootDepartments;
  }
}
