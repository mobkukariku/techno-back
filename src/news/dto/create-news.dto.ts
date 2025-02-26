import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateNewsDto {
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Content cannot be empty' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @IsArray()
  @IsUUID()
  @IsString({ each: true })
  tagIds: string[];

  @IsUrl()
  @IsOptional()
  @IsNotEmpty()
  imageURL?: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;
}
