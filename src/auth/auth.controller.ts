import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setAuthCookies(res: Response, token: string, role: string) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Должно быть всегда true для SameSite=None
      sameSite: 'none', // Требует Secure=true
    });

    res.cookie('role', role, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, role } = await this.authService.register(dto);
    this.setAuthCookies(res, token, role);
    return { message: 'Registration successful' };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, role } = await this.authService.login(dto);
    this.setAuthCookies(res, token, role);
    return { message: 'Login successful' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('role');
    return { message: 'Logout successful' };
  }
}
