import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  headId?: string;

  @IsOptional()
  @IsUUID()
  parentDepartmentId?: string;
}
