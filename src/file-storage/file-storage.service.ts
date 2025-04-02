import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export type FileResourceType = 'image' | 'video' | 'raw' | 'auto';

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
  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  constructor() {
    this.ensureDirectoryExists(this.baseUploadDir);
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory: ${dirPath}`, error);
      throw new BadRequestException(`Failed to create directory: ${error.message}`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: FileResourceType = 'auto'
  ): Promise<FileResponse> {
    try {
      this.logger.debug(`Uploading file: ${file.originalname}, size: ${file.size}, mimetype: ${file.mimetype}`);
      
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
        resource_type: resourceType
      };
    } catch (error) {
      this.logger.error(`File upload error: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(publicId: string): Promise<any> {
    try {
      const filePath = path.join(this.baseUploadDir, publicId);
      await fs.unlink(filePath);
      return { result: 'ok' };
    } catch (error) {
      console.error('File deletion error:', error);
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }
}
