import { PartialType } from '@nestjs/swagger';
import { CreateBikeOwnerDto } from './create-bike-owner.dto';

export class UpdateBikeOwnerDto extends PartialType(CreateBikeOwnerDto) {}
