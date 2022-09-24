import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthBikeOwnerGuard } from './../auth-bike-owner/guards/jwt-auth-bike-owner.guards';
import { JwtAuthPoliceGuard } from './../auth-police-officer/guards/jwt-auth-police.guards';
import { BikesService } from './bikes.service';
import {
  CreateBikeDto,
  DefaultColumnsResponseBike,
} from './dto/create-bike.dto';
import { QueryBikesDto } from './dto/query.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

@ApiTags('Bikes')
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @UseGuards(JwtAuthBikeOwnerGuard)
  @ApiOperation({ summary: 'Create a bike' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponseBike,
  })
  @Post('bike-owner/:bikeOwnerId')
  create(
    @Body() createBikeDto: CreateBikeDto,
    @Param('bikeOwnerId', ParseIntPipe) bikeOwnerId: number,
  ) {
    return this.bikesService.create({ bikeOwnerId, createBikeDto });
  }

  @UseGuards(JwtAuthPoliceGuard)
  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponseBike,
  })
  @Get()
  findAll() {
    return this.bikesService.findAll();
  }

  @UseGuards(JwtAuthPoliceGuard)
  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponseBike,
  })
  @Get('searcher')
  searcher(@Query() queryParams: QueryBikesDto) {
    return this.bikesService.searcher(queryParams);
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBike,
  })
  @Get(':bikeId')
  findOne(@Param('bikeId', ParseIntPipe) bikeId: number) {
    return this.bikesService.findOne({ bikeId });
  }
  @UseGuards(JwtAuthBikeOwnerGuard)
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBike,
  })
  @Put(':bikeId')
  update(
    @Param('bikeId', ParseIntPipe) bikeId: number,
    @Body() updateBikeDto: UpdateBikeDto,
  ) {
    return this.bikesService.update({ bikeId, updateBikeDto });
  }

  @UseGuards(JwtAuthBikeOwnerGuard)
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBike,
  })
  @Delete(':bikeId')
  remove(@Param('bikeId', ParseIntPipe) bikeId: number) {
    return this.bikesService.remove({ bikeId });
  }
}
