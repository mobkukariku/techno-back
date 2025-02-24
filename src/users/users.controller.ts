import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards';
import { RolesGuard } from '../guards';
import { Roles } from '../decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
