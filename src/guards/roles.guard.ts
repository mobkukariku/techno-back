import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { Role } from '@prisma/client';

interface User {
  id: string;
  email: string;
  role: string;
}

const roleHierarchy: Record<Role, Role[]> = {
  [Role.admin]: [Role.admin, Role.manager, Role.member],
  [Role.manager]: [Role.manager, Role.member],
  [Role.member]: [Role.member],
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
      ]) || []; // Если null или undefined, то подставляем пустой массив

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }

    const userRoles = Array.isArray(roleHierarchy[user.role])
      ? (roleHierarchy[user.role] as string[])
      : [];

    if (!requiredRoles.some((role) => userRoles.includes(role))) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}
