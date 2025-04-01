import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { CloudinaryResponse, CloudinaryResourceType } from './cloudinary-response.interface';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: CloudinaryResourceType = 'auto'
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const fileExt = path.extname(file.originalname).toLowerCase();
      const baseFilename = path.basename(file.originalname, fileExt);
      
      const uploadOptions: any = {
        folder,
        resource_type: resourceType,
        public_id: `${baseFilename}`,
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        access_mode: 'public',
      };
      
      if (resourceType === 'raw') {
        if (fileExt === '.pdf') {
          uploadOptions.type = 'upload';
        } 
        else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
          uploadOptions.resource_type = 'image';
          uploadOptions.format = fileExt.replace('.', '');
        }
        else {
          uploadOptions.type = 'upload';
          uploadOptions.flags = 'attachment';
        }
      } else if (resourceType === 'image') {
        uploadOptions.format = fileExt.replace('.', '');
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        }
      );

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }
}
