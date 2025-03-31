import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ description: 'Skill name', example: 'JavaScript' })
  @IsString()
  name: string;
}
