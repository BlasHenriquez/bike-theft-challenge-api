import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { StatusPolice } from './../../utils/enum/police-officer.enum';
import { Role } from './../../utils/enum/role.enum';

export class CreatePoliceOfficerDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Matches(
    /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/,
    {
      message: 'password too weak',
    },
  )
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  @IsOptional()
  @IsEnum(StatusPolice)
  status: StatusPolice;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  policeDepartment: number[];
}

export class DefaultColumnsResponsePoliceOfficer extends CreatePoliceOfficerDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
