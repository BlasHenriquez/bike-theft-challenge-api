import { PartialType } from '@nestjs/swagger';
import { CreatePoliceOfficerDto } from './create-police-officer.dto';

export class UpdatePoliceOfficerDto extends PartialType(
  CreatePoliceOfficerDto,
) {}
