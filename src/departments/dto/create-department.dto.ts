import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @ApiPropertyOptional({ example: 'IT Department', description: 'Название департамента' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID руководителя' })
  @IsOptional()
  @IsUUID()
  headId?: string;

  @ApiPropertyOptional({ example: '650e8400-e29b-41d4-a716-446655440000', description: 'UUID родительского департамента' })
  @IsOptional()
  @IsUUID()
  parentDepartmentId?: string;
}
