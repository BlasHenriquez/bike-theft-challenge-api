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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthBikeOwnerGuard } from './../auth-bike-owner/guards/jwt-auth-bike-owner.guards';
import { Roles } from './../auth-police-officer/decorators/roles.decorator';
import { JwtAuthPoliceGuard } from './../auth-police-officer/guards/jwt-auth-police.guards';
import { RolesGuard } from './../auth-police-officer/guards/roles.guard';
import { Role } from './../utils/enum/role.enum';
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
  @Roles(Role.DIRECTOR)
  @UseGuards(JwtAuthPoliceGuard, RolesGuard)
  @Get()
  findAll() {
    return this.bikeOwnersService.findAll();
  }

  @UseGuards(JwtAuthBikeOwnerGuard)
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBikeOwner,
  })
  @Get(':bikeOwnerId')
  findOne(@Param('bikeOwnerId', ParseIntPipe) bikeOwnerId: number) {
    return this.bikeOwnersService.findOne({ bikeOwnerId });
  }

  @UseGuards(JwtAuthBikeOwnerGuard)
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

  @UseGuards(JwtAuthBikeOwnerGuard)
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBikeOwner,
  })
  @Delete(':bikeOwnerId')
  remove(@Param('bikeOwnerId', ParseIntPipe) bikeOwnerId: number) {
    return this.bikeOwnersService.remove({ bikeOwnerId });
  }
}
