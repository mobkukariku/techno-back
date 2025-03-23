import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string, role: string) {
    return this.jwtService.sign({ userId, role }, { expiresIn: '7d' });
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        id: dto.id,
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        role: dto.role,
        headOfDepartments: dto.headOfDepartments
          ? {
              createMany: {
                data: dto.headOfDepartments.map((departmentId) => ({
                  id: departmentId,
                  headId: dto.id,
                })),
              },
            }
          : undefined,
        departmentMemberships: dto.departmentId
          ? {
              create: {
                departmentId: dto.departmentId,
              },
            }
          : undefined,
      },
    });

    const token = this.generateToken(user.id, user.role);

    return { message: 'User created', token, userId: user.id, role: user.role };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.comparePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.role);

    return {
      message: 'Login successful',
      token,
      userId: user.id,
      role: user.role,
    };
  }
}
