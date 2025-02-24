import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest } from '../auth/auth-request.interface';
import { Role } from '@prisma/client';

export interface RequestUser {
  id: string;
  email: string;
  role: Role;
}



interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = request.cookies?.token as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Нет токена, доступ запрещён');
    }

    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);

      if (!decoded.userId) {
        throw new UnauthorizedException('Некорректный токен: отсутствует ID');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true },
      });

      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }
      (request as Request & { user: RequestUser }).user = user;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Невалидный токен');
    }
  }
}
