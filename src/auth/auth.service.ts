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
    return await bcrypt.compare(password, hashedPassword);
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        id: dto.id,
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
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

    const token = this.jwtService.sign({ userId: user.id });

    return { message: 'User is Created', token };
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

    const token = this.jwtService.sign({ userId: user.id });

    return { message: 'Login successfull', token };
  }
}
