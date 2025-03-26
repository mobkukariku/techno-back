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
  async create(dto: CreateDepartmentDto) {
    const department = await this.prisma.department.create({
      data: {
        name: dto.name,
        headId: dto.headId,
        parentDepartmentId: dto.parentDepartmentId,
      },
    });

    if (dto.headId) {
      await this.prisma.departmentMember.create({
        data: {
          userId: dto.headId,
          departmentId: department.id,
          role: 'head',
        },
      });
    }

    return department;
  }

  findAll() {
    return this.prisma.department.findMany();
  }

  findOne(id: string) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        head: true,
        parentDepartment: true,
        subDepartments: true,
        members: {
          include: { User: true },
        },
      },
    });
  }
  async update(id: string, dto: UpdateDepartmentDto) {
    if (dto.parentDepartmentId) {
      const isCyclic = await this.checkForCyclicHierarchy(
        id,
        dto.parentDepartmentId,
      );
      if (isCyclic) {
        throw new Error('Cyclic hierarchy detected');
      }
    }

    const updatedDepartment = await this.prisma.department.update({
      where: { id },
      data: dto,
    });

    if (dto.headId) {
      await this.prisma.departmentMember.upsert({
        where: {
          userId_departmentId: { userId: dto.headId, departmentId: id },
        },
        update: { role: 'head' },
        create: { userId: dto.headId, departmentId: id, role: 'head' },
      });
    }

    return updatedDepartment;
  }

  async remove(id: string) {
    await this.prisma.department.updateMany({
      where: { parentDepartmentId: id },
      data: { parentDepartmentId: null },
    });

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

  private async checkForCyclicHierarchy(
    departmentId: string,
    newParentId: string,
  ): Promise<boolean> {
    let currentParentId: string | null = newParentId;

    while (currentParentId !== null) {
      if (currentParentId === departmentId) {
        return true;
      }

      const parent = await this.prisma.department.findUnique({
        where: { id: currentParentId },
        select: { parentDepartmentId: true },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      currentParentId = parent?.parentDepartmentId ?? null;
    }

    return false;
  }
}
