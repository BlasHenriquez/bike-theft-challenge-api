import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryBikesDto {
  @ApiProperty()
  @IsOptional()
  readonly license?: string;

  @ApiProperty()
  @IsOptional()
  readonly description?: string;

  @ApiProperty()
  @IsOptional()
  readonly color?: string;

  @ApiProperty()
  @IsOptional()
  readonly type?: number;

  @ApiProperty()
  @IsOptional()
  readonly date?: boolean;
}
