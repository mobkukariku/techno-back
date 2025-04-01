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
} from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { CreateProjectPartnershipDto, CreateJobApplicationDto, CreateJobRoleDto, UpdateJobRoleDto } from "./dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
} from "@nestjs/swagger";

@ApiTags("requests")
@Controller("requests")
export class RequestsController {
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
          description: "Optional project-related documents or images",
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
      required: ["fullName", "email", "telegramUsername", "cv"],
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
        cv: {
          type: "string",
          format: "binary",
          description: "CV/Resume document (required)",
        },
        coverLetter: {
          type: "string",
          format: "binary",
          description: "Cover letter document (optional)",
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
    if (!files.cv || files.cv.length === 0) {
      throw new BadRequestException("CV file is required");
    }
    return this.requestsService.createJobApplication(
      dto,
      files.cv[0],
      files.coverLetter?.[0] || null
    );
  }

  @Post("job-roles")
  @ApiOperation({ summary: "Create a new job role" })
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
  @ApiOperation({ summary: "Get all active job roles" })
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
  @ApiOperation({ summary: "Delete a job role" })
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
  @ApiOperation({ summary: "Update a job role" })
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
