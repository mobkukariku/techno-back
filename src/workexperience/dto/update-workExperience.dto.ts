import { PartialType } from '@nestjs/swagger';
import { CreateWorkExperieceDto } from './create-workExperiece.dto';

export class UpdateWorkExperienceDto extends PartialType(
  CreateWorkExperieceDto,
) {}
