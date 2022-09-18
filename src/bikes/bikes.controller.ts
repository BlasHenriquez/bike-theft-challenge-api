import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BikesService } from './bikes.service';
import {
  CreateBikeDto,
  DefaultColumnsResponseBike,
} from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

@ApiTags('Bikes')
@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @ApiOperation({ summary: 'Create a bike' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponseBike,
  })
  @Post()
  create(@Body() createBikeDto: CreateBikeDto) {
    return this.bikesService.create(createBikeDto);
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponseBike,
  })
  @Get()
  findAll() {
    return this.bikesService.findAll();
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBike,
  })
  @Get(':bikeId')
  findOne(@Param('bikeId', ParseIntPipe) bikeId: number) {
    return this.bikesService.findOne({ bikeId });
  }

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

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBike,
  })
  @Delete(':bikeId')
  remove(@Param('bikeId', ParseIntPipe) bikeId: number) {
    return this.bikesService.remove({ bikeId });
  }
}
