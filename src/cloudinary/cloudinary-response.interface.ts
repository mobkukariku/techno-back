import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export type CloudinaryResourceType = 'image' | 'video' | 'raw' | 'auto';

export interface CloudinaryResponse extends UploadApiResponse {}
