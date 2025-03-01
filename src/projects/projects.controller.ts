import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthRequest } from '../auth/auth-request.interface';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard, RolesGuard } from '../guards';
import { CreateProjectsDto } from './dto/create-projects.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { multerConfig } from './projects.multer';
import { UpdateProjectsDto } from './dto/update-projects.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects(
    @Query('search') search?: string,
    @Query('directionId') directionId?: string,
    @Query('sort') sort?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.projectsService.getAllProjects({
      search: search,
      departmentId: directionId,
      sort,
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
    });
  }

  @Get(':id')
  async getProjectById(@Req() request: AuthRequest) {
    return this.projectsService.getProjectById(request.params.id);
  }

  @Post()
  @Roles('manager')
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], multerConfig),
  )
  async createProject(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() dto: CreateProjectsDto,
  ) {
    const imageUrls =
      files?.images?.map(
        (file) => `http://localhost:4000/images/projects/${file.filename}`,
      ) || [];

    return this.projectsService.createProject(dto, imageUrls);
  }

  @Patch(':id')
  @Roles('manager')
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateProject(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: Partial<UpdateProjectsDto>,
  ) {
    // const imageURL = file ? `images/projects/${file.filename}` : undefined;

    return this.projectsService.updateProject(id, {
      ...dto,
    });
  }
}
