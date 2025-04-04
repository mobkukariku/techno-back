export type FileResourceType = 'image' | 'document' | 'spreadsheet';

export interface FileResponse {
  secure_url: string;
  public_id: string;
  original_filename: string;
  bytes: number;
  format: string;
  resource_type: FileResourceType;
}
