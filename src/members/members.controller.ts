import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateDepartmentMemberDto } from './dto/create-members.dto';
import { UpdateDepartmentMemberDto } from './dto/update-members.dto';
import { AuthGuard, RolesGuard } from '../guards';
import { Roles } from '../decorators/roles.decorator';

@Controller('department-members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post('add-member')
  async addMember(@Body() dto: CreateDepartmentMemberDto) {
    await this.membersService.addMember(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post('update-role')
  async updateRole(@Body() dto: UpdateDepartmentMemberDto) {
    return this.membersService.updateMemberRole(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('remove')
  async removeMember(@Body() dto: { userId: string; departmentId: string }) {
    return this.membersService.removeMember(dto.userId, dto.departmentId);
  }
}
