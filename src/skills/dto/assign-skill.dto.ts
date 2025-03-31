import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignSkillDto {
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Skill ID', example: '987e6543-e21b-45c3-b678-123456789abc' })
  @IsString()
  skillId: string;
}
