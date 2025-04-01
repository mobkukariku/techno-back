import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobRoleDto {
  @ApiProperty({
    description: 'Name of the job role',
    example: 'Software Developer',
    minLength: 2,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
