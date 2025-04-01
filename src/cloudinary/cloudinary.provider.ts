import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const cloudinaryUrl = configService.get('CLOUDINARY_URL');
    
    if (!cloudinaryUrl) {
      console.warn('CLOUDINARY_URL not found in environment variables');
      return cloudinary.config({
        cloud_name: '',
        api_key: '',
        api_secret: '',
        secure: true
      });
    }
    
    return cloudinary.config({
      secure: true
    });
  },
};
