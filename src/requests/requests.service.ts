import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestsDto, CreateProjectPartnershipDto, CreateJobApplicationDto, CreateJobRoleDto, UpdateJobRoleDto } from './dto';
import { FileStorageService, FileResponse } from '../file-storage/file-storage.service';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    private prisma: PrismaService,
    private fileStorageService: FileStorageService
  ) {}

  async createRequest(dto: CreateRequestsDto) {
    const { name, email, message, direction } = dto;

    return this.prisma.requests.create({
      data: {
        name,
        email,
        message,
        direction: { connect: { id: direction } },
      },
    });
  }

  async getAllRequests() {
    return this.prisma.requests.findMany();
  }

  async createPartnershipRequest(
    dto: CreateProjectPartnershipDto,
    attachments: Express.Multer.File[]
  ) {
    try {
      const { title, description, senderName, email } = dto;

      const uploadedFiles = await Promise.all(
        attachments.map(file => this.fileStorageService.uploadFile(file, 'partnership-attachments'))
      );

      const attachmentData = uploadedFiles.map((result: FileResponse) => ({
        path: result.secure_url,
        originalName: result.original_filename,
        mimeType: result.format ? `${result.resource_type}/${result.format}` : 'application/octet-stream',
        size: result.bytes,
        publicId: result.public_id
      }));

      return this.prisma.$transaction(async (tx) => {
        const partnership = await tx.projectPartnershipRequest.create({
          data: {
            title,
            description,
            senderName,
            email,
            referralSource: null,
            organizationInterest: null
          }
        });

        if (attachmentData.length > 0) {
          await tx.partnershipAttachment.createMany({
            data: attachmentData.map(attachment => ({
              ...attachment,
              requestId: partnership.id
            }))
          });
        }

        const attachments = attachmentData.length > 0 
          ? await tx.partnershipAttachment.findMany({
              where: { requestId: partnership.id }
            }) 
          : [];

        return {
          ...partnership,
          attachments
        };
      });
    } catch (error) {
      console.error('Partnership request error:', error);
      throw new BadRequestException('Failed to create partnership request: ' + error.message);
    }
  }

  async createJobApplication(
    dto: CreateJobApplicationDto,
    cv: Express.Multer.File,
    coverLetter: Express.Multer.File | null
  ) {
    try {
      const { fullName, email, telegramUsername, jobRoleId, referralSource, projectInterests, skills, organizationInterest } = dto;
      
      const cvUpload = await this.fileStorageService.uploadFile(
        cv, 
        'job-applications/cv'
      ) as FileResponse;
      
      this.logger.log(`CV uploaded successfully. Accessible at: ${cvUpload.secure_url}`);
      
      let coverLetterUpload: FileResponse | null = null;
      if (coverLetter) {
        coverLetterUpload = await this.fileStorageService.uploadFile(
          coverLetter, 
          'job-applications/cover-letters'
        );
        this.logger.log(`Cover letter uploaded successfully. Accessible at: ${coverLetterUpload.secure_url}`);
      }

      return this.prisma.jobApplicationRequest.create({
        data: {
          fullName,
          email,
          telegramUsername,
          jobRoleId: jobRoleId || null,
          referralSource,
          projectInterests,
          skills,
          organizationInterest,
          cvPath: cvUpload.secure_url,
          cvOriginalName: cvUpload.original_filename,
          cvSize: cvUpload.bytes,
          cvPublicId: cvUpload.public_id,
          coverLetterPath: coverLetterUpload?.secure_url || null,
          coverLetterOriginalName: coverLetterUpload?.original_filename || null,
          coverLetterSize: coverLetterUpload?.bytes || null,
          coverLetterPublicId: coverLetterUpload?.public_id || null,
        },
        include: {
          jobRole: true
        }
      });
    } catch (error) {
      console.error('Job application error:', error);
      throw new BadRequestException('Failed to create job application: ' + error.message);
    }
  }

  async getAllPartnershipRequests() {
    try {
      return this.prisma.projectPartnershipRequest.findMany({
        include: {
          attachments: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Get partnerships error:', error);
      throw new NotFoundException('Failed to fetch partnership requests');
    }
  }

  async getAllJobApplications() {
    try {
      return this.prisma.jobApplicationRequest.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Get job applications error:', error);
      throw new NotFoundException('Failed to fetch job applications');
    }
  }

  async createJobRole(dto: CreateJobRoleDto) {
    try {
      const { name } = dto;

      return this.prisma.jobRole.create({
        data: {
          name
        }
      });
    } catch (error) {
      console.error('Create job role error:', error);
      if (error.code === 'P2002') {
        throw new BadRequestException('Job role with this name already exists');
      }
      throw new BadRequestException('Failed to create job role: ' + error.message);
    }
  }

  async getAllJobRoles() {
    try {
      return this.prisma.jobRole.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          name: 'asc'
        }
      });
    } catch (error) {
      console.error('Get job roles error:', error);
      throw new NotFoundException('Failed to fetch job roles');
    }
  }

  async getJobRoleById(id: string) {
    try {
      const jobRole = await this.prisma.jobRole.findUnique({
        where: { id }
      });
      
      if (!jobRole) {
        throw new NotFoundException(`Job role with ID ${id} not found`);
      }
      
      return jobRole;
    } catch (error) {
      console.error('Get job role error:', error);
      throw new NotFoundException('Failed to fetch job role: ' + error.message);
    }
  }

  async deleteJobRole(id: string) {
    try {
      const jobRole = await this.prisma.jobRole.findUnique({
        where: { id }
      });
      
      if (!jobRole) {
        throw new NotFoundException(`Job role with ID ${id} not found`);
      }

      const applicationsCount = await this.prisma.jobApplicationRequest.count({
        where: { jobRoleId: id }
      });

      if (applicationsCount > 0) {
        return this.prisma.jobRole.update({
          where: { id },
          data: { isActive: false }
        });
      } else {
        return this.prisma.jobRole.delete({
          where: { id }
        });
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Delete job role error:', error);
      throw new BadRequestException('Failed to delete job role: ' + error.message);
    }
  }

  async updateJobRole(id: string, dto: UpdateJobRoleDto) {
    try {
      const { name, isActive } = dto;
      
      const jobRole = await this.prisma.jobRole.findUnique({
        where: { id }
      });
      
      if (!jobRole) {
        throw new NotFoundException(`Job role with ID ${id} not found`);
      }
      
      return this.prisma.jobRole.update({
        where: { id },
        data: {
          name,
          isActive
        }
      });
    } catch (error) {
      console.error('Update job role error:', error);
      throw new BadRequestException('Failed to update job role: ' + error.message);
    }
  }
}
