import { IsString } from 'class-validator';

export class AssignSkillDto {
  @IsString()
  userId: string;

  @IsString()
  skillId: string;
}
