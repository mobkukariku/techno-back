import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setAuthCookies(res: Response, token: string, role: string) {
    const isDev = process.env.NODE_ENV !== 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: !isDev, // Secure=true только для HTTPS
      sameSite: isDev ? 'lax' : 'none', // "none" требует HTTPS, но для локалки оставляем "lax"
    });

    res.cookie('role', role, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? 'lax' : 'none',
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
