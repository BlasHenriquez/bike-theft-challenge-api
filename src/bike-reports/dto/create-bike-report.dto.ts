import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateBikeReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  dateTheft: Date;

  @ApiProperty()
  @IsNotEmpty()
  addressTheft: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  descriptionTheft: string;
}

export class DefaultColumnsResponseBikeReport extends CreateBikeReportDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
