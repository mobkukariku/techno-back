import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({ example: 'New Feature Released', description: 'News title' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    example: 'We have just released a new update...',
    description: 'News content',
  })
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @ApiProperty({
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '660e8400-e29b-41d4-a716-446655440111',
    ],
    description: 'Array of tag IDs',
  })
  @IsUUID('4', { each: true, message: 'Each tag ID must be a valid UUID' })
  tagIds: string[] | string;
  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid image URL' })
  imageURL?: string;

  @ApiProperty({
    example: '750e8400-e29b-41d4-a716-446655440222',
    description: 'Author ID',
  })
  @IsString({ message: 'Author ID must be a string' })
  @IsNotEmpty({ message: 'Author ID cannot be empty' })
  authorId: string;
}
