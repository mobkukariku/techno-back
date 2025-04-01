import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateProjectPartnershipDto, CreateJobApplicationDto } from './dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('partnership')
  async getAllPartnershipRequests() {
    return this.requestsService.getAllPartnershipRequests();
  }

  @Get('job-application')
  async getAllJobApplications() {
    return this.requestsService.getAllJobApplications();
  }

  @Post('partnership')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'attachments', maxCount: 5 },
    ], {
      storage: diskStorage({
        destination: './uploads/partnership',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|jpg|jpeg|png)$/)) {
          return cb(new Error('Only document and image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async createPartnershipRequest(
    @Body() dto: CreateProjectPartnershipDto,
    @UploadedFiles() files: { attachments?: Express.Multer.File[] }
  ) {
    return this.requestsService.createPartnershipRequest(dto, files?.attachments || []);
  }

  @Post('job-application')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cv', maxCount: 1 },
      { name: 'coverLetter', maxCount: 1 },
    ], {
      storage: diskStorage({
        destination: './uploads/job-applications',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          return cb(new Error('Only PDF and Word documents are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 3 * 1024 * 1024, // 3MB
      },
    }),
  )
  async createJobApplication(
    @Body() dto: CreateJobApplicationDto,
    @UploadedFiles() files: { cv?: Express.Multer.File[], coverLetter?: Express.Multer.File[] }
  ) {
    if (!files.cv || files.cv.length === 0) {
      throw new BadRequestException('CV file is required');
    }
    return this.requestsService.createJobApplication(
      dto, 
      files.cv[0], 
      files.coverLetter?.[0] || null
    );
  }
}
