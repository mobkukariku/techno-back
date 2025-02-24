import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
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
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
