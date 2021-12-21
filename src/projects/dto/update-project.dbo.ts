import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dbo';

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['key'] as const),
) {}
