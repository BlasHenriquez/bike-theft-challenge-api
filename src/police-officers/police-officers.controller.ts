import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PoliceOfficersService } from './police-officers.service';
import {
  CreatePoliceOfficerDto,
  DefaultColumnsResponsePoliceOfficer,
} from './dto/create-police-officer.dto';
import { UpdatePoliceOfficerDto } from './dto/update-police-officer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from './../auth-police-officer/decorators/roles.decorator';
import { Role } from './../utils/enum/role.enum';
import { JwtAuthPoliceGuard } from './../auth-police-officer/guards/jwt-auth-police.guards';
import { RolesGuard } from './../auth-police-officer/guards/roles.guard';

@UseGuards(JwtAuthPoliceGuard, RolesGuard)
@ApiTags('Police officers')
@Controller('police-officers')
export class PoliceOfficersController {
  constructor(private readonly policeOfficersService: PoliceOfficersService) {}

  @Roles(Role.DIRECTOR)
  @ApiOperation({ summary: 'Create a police officer' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponsePoliceOfficer,
  })
  @Post()
  create(@Body() createPoliceOfficerDto: CreatePoliceOfficerDto) {
    return this.policeOfficersService.create(createPoliceOfficerDto);
  }

  @Roles(Role.DIRECTOR)
  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponsePoliceOfficer,
  })
  @Get()
  findAll() {
    return this.policeOfficersService.findAll();
  }

  @Roles(Role.DIRECTOR)
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponsePoliceOfficer,
  })
  @Get(':policeOfficerId')
  findOne(@Param('policeOfficerId', ParseIntPipe) policeOfficerId: number) {
    return this.policeOfficersService.findOne({ policeOfficerId });
  }

  @Roles(Role.DIRECTOR)
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponsePoliceOfficer,
  })
  @Put(':policeOfficerId')
  update(
    @Param('policeOfficerId', ParseIntPipe) policeOfficerId: number,
    @Body() updatePoliceOfficerDto: UpdatePoliceOfficerDto,
  ) {
    return this.policeOfficersService.update({
      policeOfficerId,
      updatePoliceOfficerDto,
    });
  }

  @Roles(Role.DIRECTOR)
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponsePoliceOfficer,
  })
  @Delete(':policeOfficerId')
  remove(@Param('policeOfficerId', ParseIntPipe) policeOfficerId: number) {
    return this.policeOfficersService.remove({ policeOfficerId });
  }
}
