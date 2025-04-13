import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { CreateProjectPartnershipDto, CreateJobApplicationDto, CreateJobRoleDto, UpdateJobRoleDto } from "./dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
} from "@nestjs/swagger";

@ApiTags("requests")
@Controller("requests")
export class RequestsController {
  private readonly logger = new Logger(RequestsController.name);

  constructor(private readonly requestsService: RequestsService) {}

  @Get("partnership")
  @ApiResponse({
    status: 200,
    description: "List of partnership requests retrieved successfully",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string" },
          senderName: { type: "string" },
          email: { type: "string", format: "email" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          attachments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                path: { type: "string" },
                originalName: { type: "string" },
                mimeType: { type: "string" },
                size: { type: "number" },
                publicId: { type: "string", nullable: true },
                requestId: { type: "string" }
              },
            },
          },
        },
      },
    },
  })
  async getAllPartnershipRequests() {
    return this.requestsService.getAllPartnershipRequests();
  }

  @Get("job-application")
  @ApiResponse({
    status: 200,
    description: "List of job applications retrieved successfully",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          telegramUsername: { type: "string" },
          jobRoleId: { type: "string", format: "uuid", nullable: true },
          jobRole: { 
            type: "object", 
            nullable: true,
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              isActive: { type: "boolean" }
            }
          },
          referralSource: { type: "string" },
          projectInterests: { type: "string" },
          skills: { type: "string" },
          organizationInterest: { type: "string" },
          cvPath: { type: "string" },
          cvOriginalName: { type: "string" },
          cvSize: { type: "number" },
          cvPublicId: { type: "string", nullable: true },
          coverLetterPath: { type: "string", nullable: true },
          coverLetterOriginalName: { type: "string", nullable: true },
          coverLetterSize: { type: "number", nullable: true },
          coverLetterPublicId: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  })
  async getAllJobApplications() {
    return this.requestsService.getAllJobApplications();
  }

  @Post("partnership")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["title", "description", "senderName", "email"],
      properties: {
        title: {
          type: "string",
          example: "Partnership Project Title",
          description: "Title of the partnership project",
        },
        description: {
          type: "string",
          example: "Detailed description of the partnership project...",
          description: "Detailed description of the partnership project",
        },
        senderName: {
          type: "string",
          example: "John Doe",
          description: "Name of the sender",
        },
        email: {
          type: "string",
          example: "john.doe@example.com",
          description: "Email of the sender",
        },
        attachments: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
          description: "Optional project-related documents or images (jpg, jpeg, png, webp, pdf, docx, doc, xlsx, xls)",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Partnership request created successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        title: { type: "string" },
        description: { type: "string" },
        senderName: { type: "string" },
        email: { type: "string", format: "email" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        attachments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              path: { type: "string" },
              originalName: { type: "string" },
              mimeType: { type: "string" },
              size: { type: "number" },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Invalid input or file upload failed" })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "attachments", maxCount: 5 }])
  )
  async createPartnershipRequest(
    @Body() dto: CreateProjectPartnershipDto,
    @UploadedFiles() files: { attachments?: Express.Multer.File[] }
  ) {
    return this.requestsService.createPartnershipRequest(
      dto,
      files?.attachments || []
    );
  }

  @Post("job-application")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["fullName", "email", "telegramUsername", "cv", "referralSource", "projectInterests", "skills", "organizationInterest"],
      properties: {
        fullName: {
          type: "string",
          example: "Jane Smith",
          description: "Full name of the applicant",
        },
        email: {
          type: "string",
          example: "jane.smith@example.com",
          description: "Email address of the applicant",
        },
        telegramUsername: {
          type: "string",
          example: "@janesmith",
          description: "Telegram username (must start with @)",
        },
        jobRoleId: {
          type: "string",
          format: "uuid",
          example: "550e8400-e29b-41d4-a716-446655440000",
          description: "ID of the job role the applicant is applying for (optional)",
        },
        referralSource: {
          type: "string",
          example: "LinkedIn",
          description: "How did you hear about us?",
        },
        projectInterests: {
          type: "string",
          example: "Frontend development, Mobile applications",
          description: "What projects would you be interested in working on?",
        },
        skills: {
          type: "string",
          example: "JavaScript, React, TypeScript, Node.js",
          description: "What skills do you have?",
        },
        organizationInterest: {
          type: "string",
          enum: ["Technopark", "Enactus", "HultPrize"],
          example: "Technopark",
          description: "Which organizations are you interested in?",
        },
        cv: {
          type: "string",
          format: "binary",
          description: "CV/Resume document (required, formats: pdf, docx, doc)",
        },
        coverLetter: {
          type: "string",
          format: "binary",
          description: "Cover letter document (optional, formats: pdf, docx, doc)",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Job application submitted successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        fullName: { type: "string" },
        email: { type: "string", format: "email" },
        telegramUsername: { type: "string" },
        jobRoleId: { type: "string", format: "uuid", nullable: true },
        jobRole: { 
          type: "object", 
          nullable: true,
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string", nullable: true }
          }
        },
        referralSource: { type: "string" },
        projectInterests: { type: "string" },
        skills: { type: "string" },
        organizationInterest: { 
          type: "string",
          enum: ["Technopark", "Enactus", "HultPrize"] 
        },
        cvPath: { type: "string" },
        cvOriginalName: { type: "string" },
        cvSize: { type: "number" },
        coverLetterPath: { type: "string", nullable: true },
        coverLetterOriginalName: { type: "string", nullable: true },
        coverLetterSize: { type: "number", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Invalid input or CV file missing" })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "cv", maxCount: 1 },
      { name: "coverLetter", maxCount: 1 },
    ])
  )
  async createJobApplication(
    @Body() dto: CreateJobApplicationDto,
    @UploadedFiles()
    files: { cv?: Express.Multer.File[]; coverLetter?: Express.Multer.File[] }
  ) {
    this.logger.debug(`Received job application: ${JSON.stringify(dto)}`);
    this.logger.debug(`Received files: ${files ? Object.keys(files).join(', ') : 'none'}`);
    
    if (!files) {
      throw new BadRequestException("No files were uploaded. Please ensure you're sending files as form-data with correct field names.");
    }
    
    if (!files.cv || files.cv.length === 0) {
      throw new BadRequestException("CV file is required. Please upload a CV file with field name 'cv'.");
    }
    
    return this.requestsService.createJobApplication(
      dto,
      files.cv[0],
      files.coverLetter?.[0] || null
    );
  }

  @Post("job-roles")
  @ApiBody({
    type: CreateJobRoleDto,
    description: "Job role creation data",
  })
  @ApiResponse({
    status: 201,
    description: "Job role created successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string" },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Invalid input or job role already exists" })
  async createJobRole(@Body() dto: CreateJobRoleDto) {
    return this.requestsService.createJobRole(dto);
  }

  @Get("job-roles")
  @ApiResponse({
    status: 200,
    description: "List of active job roles retrieved successfully",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  })
  async getAllJobRoles() {
    return this.requestsService.getAllJobRoles();
  }

  @Delete("job-roles/:id")
  @ApiParam({ name: "id", type: "string", format: "uuid", description: "Job role ID" })
  @ApiResponse({
    status: 200,
    description: "Job role deleted successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string" },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Job role not found" })
  async deleteJobRole(@Param("id") id: string) {
    return this.requestsService.deleteJobRole(id);
  }

  @Patch("job-roles/:id")
  @ApiParam({ name: "id", type: "string", format: "uuid", description: "Job role ID" })
  @ApiBody({
    type: UpdateJobRoleDto,
    description: "Job role update data",
  })
  @ApiResponse({
    status: 200,
    description: "Job role updated successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string" },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Job role not found" })
  @ApiBadRequestResponse({ description: "Invalid input" })
  async updateJobRole(@Param("id") id: string, @Body() dto: UpdateJobRoleDto) {
    return this.requestsService.updateJobRole(id, dto);
  }
}
