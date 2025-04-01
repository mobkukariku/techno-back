import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestsDto, CreateProjectPartnershipDto, CreateJobApplicationDto } from './dto';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

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

      const attachmentPaths = attachments.map(file => ({
        path: file.path,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
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

        if (attachments.length > 0) {
          await (tx as any).partnershipAttachment.createMany({
            data: attachmentPaths.map(attachment => ({
              ...attachment,
              requestId: partnership.id
            }))
          });
        }

        return {
          ...partnership,
          attachments: attachments.length > 0 
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

      return (this.prisma as any).jobApplicationRequest.create({
        data: {
          fullName,
          email,
          telegramUsername,
          cvPath: cv.path,
          cvOriginalName: cv.originalname,
          cvSize: cv.size,
          coverLetterPath: coverLetter?.path || null,
          coverLetterOriginalName: coverLetter?.originalname || null,
          coverLetterSize: coverLetter?.size || null,
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
