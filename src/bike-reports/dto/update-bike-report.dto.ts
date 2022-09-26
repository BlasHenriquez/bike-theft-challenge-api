import { PartialType } from '@nestjs/swagger';
import { CreateBikeReportDto } from './create-bike-report.dto';

export class UpdateBikeReportDto extends PartialType(CreateBikeReportDto) {}
