import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards';
import { RolesGuard } from '../guards';
import { Roles } from '../decorators/roles.decorator';
import { AuthRequest } from '../auth/auth-request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/read')
  async getAllUsersForRead() {
    return this.usersService.getAllUsersMembers();
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getMe(@Req() request: AuthRequest) {
    return this.usersService.getMe(request);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
