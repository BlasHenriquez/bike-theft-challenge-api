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
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Post()
  create(@Body() createBikeDto: CreateBikeDto) {
    return this.bikesService.create(createBikeDto);
  }

  @Get()
  findAll() {
    return this.bikesService.findAll();
  }

  @Get(':bikeId')
  findOne(@Param('bikeId', ParseIntPipe) bikeId: number) {
    return this.bikesService.findOne({ bikeId });
  }

  @Put(':bikeId')
  update(
    @Param('bikeId', ParseIntPipe) bikeId: number,
    @Body() updateBikeDto: UpdateBikeDto,
  ) {
    return this.bikesService.update({ bikeId, updateBikeDto });
  }

  @Delete(':bikeId')
  remove(@Param('bikeId', ParseIntPipe) bikeId: number) {
    return this.bikesService.remove({ bikeId });
  }
}
