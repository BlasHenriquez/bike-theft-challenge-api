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
