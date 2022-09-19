import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PoliceOfficersService } from './police-officers.service';
import {
  CreatePoliceOfficerDto,
  DefaultColumnsResponsePoliceOfficer,
} from './dto/create-police-officer.dto';
import { UpdatePoliceOfficerDto } from './dto/update-police-officer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Police officers')
@Controller('police-officers')
export class PoliceOfficersController {
  constructor(private readonly policeOfficersService: PoliceOfficersService) {}

  @ApiOperation({ summary: 'Create a police officer' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponsePoliceOfficer,
  })
  @Post()
  create(@Body() createPoliceOfficerDto: CreatePoliceOfficerDto) {
    return this.policeOfficersService.create(createPoliceOfficerDto);
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponsePoliceOfficer,
  })
  @Get()
  findAll() {
    return this.policeOfficersService.findAll();
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponsePoliceOfficer,
  })
  @Get(':policeOfficerId')
  findOne(@Param('policeOfficerId', ParseIntPipe) policeOfficerId: number) {
    return this.policeOfficersService.findOne({ policeOfficerId });
  }

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

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponsePoliceOfficer,
  })
  @Delete(':policeOfficerId')
  remove(@Param('policeOfficerId', ParseIntPipe) policeOfficerId: number) {
    return this.policeOfficersService.remove({ policeOfficerId });
  }
}
