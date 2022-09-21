import { PartialType } from '@nestjs/swagger';
import { CreatePoliceDepartmentDto } from './create-police-department.dto';

export class UpdatePoliceDepartmentDto extends PartialType(
  CreatePoliceDepartmentDto,
) {}
