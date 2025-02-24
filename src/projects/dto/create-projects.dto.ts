import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateProjectsDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsUUID()
  @IsString({ each: true })
  departmentId: string;

  @IsUrl()
  @IsNotEmpty()
  imageURL: string;
}
