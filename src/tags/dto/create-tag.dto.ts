import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Tag name', example: 'Technology', minLength: 1, maxLength: 50 })
  @IsString()
  @Length(1, 50)
  name: string;
}
