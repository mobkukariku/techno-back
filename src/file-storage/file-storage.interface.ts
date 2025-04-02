export type FileResourceType = 'image' | 'video' | 'raw' | 'auto';

export interface FileResponse {
  secure_url: string;
  public_id: string;
  original_filename: string;
  bytes: number;
  format: string;
  resource_type: FileResourceType;
}
