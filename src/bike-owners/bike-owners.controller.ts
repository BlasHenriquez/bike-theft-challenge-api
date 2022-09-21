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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../src/auth/decorators/public.decorator';
import { BikeOwnersService } from './bike-owners.service';
import {
  CreateBikeOwnerDto,
  DefaultColumnsResponseBikeOwner,
} from './dto/create-bike-owner.dto';
import { UpdateBikeOwnerDto } from './dto/update-bike-owner.dto';

@ApiTags('bike owners')
@Controller('bike-owners')
export class BikeOwnersController {
  constructor(private readonly bikeOwnersService: BikeOwnersService) {}

  @Public()
  @ApiOperation({ summary: 'Create a bike owner' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponseBikeOwner,
  })
  @Post()
  create(@Body() createBikeOwnerDto: CreateBikeOwnerDto) {
    return this.bikeOwnersService.create(createBikeOwnerDto);
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponseBikeOwner,
  })
  @Get()
  findAll() {
    return this.bikeOwnersService.findAll();
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBikeOwner,
  })
  @Get(':bikeOwnerId')
  findOne(@Param('bikeOwnerId', ParseIntPipe) bikeOwnerId: number) {
    return this.bikeOwnersService.findOne({ bikeOwnerId });
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBikeOwner,
  })
  @Put(':bikeOwnerId')
  update(
    @Param('bikeOwnerId', ParseIntPipe) bikeOwnerId: number,
    @Body() updateBikeOwnerDto: UpdateBikeOwnerDto,
  ) {
    return this.bikeOwnersService.update({ bikeOwnerId, updateBikeOwnerDto });
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBikeOwner,
  })
  @Delete(':bikeOwnerId')
  remove(@Param('bikeOwnerId', ParseIntPipe) bikeOwnerId: number) {
    return this.bikeOwnersService.remove({ bikeOwnerId });
  }
}
