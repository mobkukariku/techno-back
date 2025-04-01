import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestsDto, CreateProjectPartnershipDto, CreateJobApplicationDto } from './dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryResponse, CloudinaryResourceType } from '../cloudinary/cloudinary-response.interface';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService
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
        attachments.map(file => {
          let resourceType: CloudinaryResourceType = 'auto';
          
          if (file.mimetype.startsWith('image/')) {
            resourceType = 'image';
          } else if (file.mimetype === 'application/pdf' || 
                    file.mimetype.includes('word') || 
                    file.mimetype.includes('excel') || 
                    file.mimetype.includes('powerpoint')) {
            resourceType = 'raw';
          }
          
          return this.cloudinaryService.uploadFile(file, 'partnership-attachments', resourceType);
        })
      );

      const attachmentData = uploadedFiles.map((result: CloudinaryResponse) => ({
        path: result.secure_url,
        originalName: result.original_filename,
        mimeType: result.format ? `image/${result.format}` : 'application/octet-stream',
        size: result.bytes,
        publicId: result.public_id
      }));

      return this.prisma.$transaction(async (tx) => {
        const partnership = await (tx as any).projectPartnershipRequest.create({
          data: {
            title,
            description,
            senderName,
            email,
          }
        });

        if (attachmentData.length > 0) {
          await (tx as any).partnershipAttachment.createMany({
            data: attachmentData.map(attachment => ({
              ...attachment,
              requestId: partnership.id
            }))
          });
        }

        return {
          ...partnership,
          attachments: attachmentData.length > 0 
            ? await (tx as any).partnershipAttachment.findMany({
                where: { requestId: partnership.id }
              }) 
            : []
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
      const { fullName, email, telegramUsername } = dto;
      
      const cvUpload = await this.cloudinaryService.uploadFile(
        cv, 
        'job-applications/cv', 
        'raw'
      ) as CloudinaryResponse;
      
      let coverLetterUpload: CloudinaryResponse | null = null;
      if (coverLetter) {
        coverLetterUpload = await this.cloudinaryService.uploadFile(
          coverLetter, 
          'job-applications/cover-letters', 
          'raw'
        );
      }

      return (this.prisma as any).jobApplicationRequest.create({
        data: {
          fullName,
          email,
          telegramUsername,
          cvPath: cvUpload.secure_url,
          cvOriginalName: cvUpload.original_filename,
          cvSize: cvUpload.bytes,
          cvPublicId: cvUpload.public_id,
          coverLetterPath: coverLetterUpload?.secure_url || null,
          coverLetterOriginalName: coverLetterUpload?.original_filename || null,
          coverLetterSize: coverLetterUpload?.bytes || null,
          coverLetterPublicId: coverLetterUpload?.public_id || null,
        }
      });
    } catch (error) {
      console.error('Job application error:', error);
      throw new BadRequestException('Failed to create job application: ' + error.message);
    }
  }

  async getAllPartnershipRequests() {
    try {
      return (this.prisma as any).projectPartnershipRequest.findMany({
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
      return (this.prisma as any).jobApplicationRequest.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Get job applications error:', error);
      throw new NotFoundException('Failed to fetch job applications');
    }
  }
}
