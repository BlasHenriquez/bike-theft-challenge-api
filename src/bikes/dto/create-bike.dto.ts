import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BikesTypes, ColorsBikes } from '../../utils/enum/bikes.enum';

export class CreateBikeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  license: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ColorsBikes)
  color: ColorsBikes;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(BikesTypes)
  type: BikesTypes;
}
