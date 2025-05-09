import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export type FileResourceType = 'image' | 'document' | 'spreadsheet';

export interface FileResponse {
  secure_url: string;
  public_id: string;
  original_filename: string;
  bytes: number;
  format: string;
  resource_type: FileResourceType;
}

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly baseUploadDir = 'uploads';
  private readonly baseUrl = process.env.BASE_URL || 'https://sdutechnopark.kz';
  
  private readonly allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  private readonly allowedDocumentTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
  private readonly allowedSpreadsheetTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
  
  private readonly extensionToMimeType = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel'
  };

  constructor() {
    this.ensureDirectoryExists(this.baseUploadDir);
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory: ${dirPath}`, error);
      throw new BadRequestException(`Failed to create directory: ${error}`);
    }
  }

  private validateFileType(file: Express.Multer.File): FileResourceType {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();
    
    if (!Object.keys(this.extensionToMimeType).includes(fileExt)) {
      throw new BadRequestException(`Unsupported file type: ${fileExt}. Allowed types: jpg, jpeg, png, webp, pdf, docx, doc, xlsx, xls`);
    }
    
    if (this.allowedImageTypes.includes(mimeType)) {
      return 'image';
    } else if (this.allowedDocumentTypes.includes(mimeType)) {
      return 'document';
    } else if (this.allowedSpreadsheetTypes.includes(mimeType)) {
      return 'spreadsheet';
    }
    
    throw new BadRequestException(`Unsupported MIME type: ${mimeType}. Allowed types: images, PDFs, Word documents, and Excel spreadsheets`);
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<FileResponse> {
    try {
      this.logger.debug(
        `Uploading file: ${file.originalname}, size: ${file.size}, mimetype: ${file.mimetype}`,
      );
      
      const resourceType = this.validateFileType(file);

      const fileExt = path.extname(file.originalname).toLowerCase();
      const baseFilename = path.basename(file.originalname, fileExt);
      const uniqueFilename = `${baseFilename}-${uuidv4()}${fileExt}`;

      const dirPath = path.join(this.baseUploadDir, folder);
      await this.ensureDirectoryExists(dirPath);

      const filePath = path.join(dirPath, uniqueFilename);
      const relativePath = path.join(folder, uniqueFilename);

      await fs.writeFile(filePath, file.buffer);

      const fileUrl = `${this.baseUrl}/uploads/${relativePath.replace(/\\/g, '/')}`;

      this.logger.debug(`File uploaded successfully to: ${filePath}`);
      this.logger.debug(`File accessible at URL: ${fileUrl}`);

      return {
        secure_url: fileUrl,
        public_id: relativePath.replace(/\\/g, '/'),
        original_filename: baseFilename,
        bytes: file.size,
        format: fileExt.replace('.', ''),
        resource_type: resourceType,
      };
    } catch (error) {
      this.logger.error(`File upload error: ${error}`, error);
      throw new BadRequestException(`Failed to upload file: ${error}`);
    }
  }

  async deleteFile(publicId: string): Promise<any> {
    try {
      const filePath = path.join(this.baseUploadDir, publicId);
      await fs.unlink(filePath);
      return { result: 'ok' };
    } catch (error) {
      console.error('File deletion error:', error);
      throw new BadRequestException(`Failed to delete file: ${error}`);
    }
  }
}
