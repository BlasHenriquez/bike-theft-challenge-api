import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayloadTokenBikeOwner } from './../auth-bike-owner/models/token-bike-owner.model';
import { JwtAuthPoliceGuard } from './../auth-police-officer/guards/jwt-auth-police.guards';
import { BikeReportsService } from './bike-reports.service';
import {
  CreateBikeReportDto,
  DefaultColumnsResponseBikeReport,
} from './dto/create-bike-report.dto';
import { UpdateBikeReportDto } from './dto/update-bike-report.dto';
import { Roles } from './../auth-police-officer/decorators/roles.decorator';
import { Role } from './../utils/enum/role.enum';
import { RolesGuard } from './../auth-police-officer/guards/roles.guard';
import { JwtAuthBikeOwnerGuard } from './../auth-bike-owner/guards/jwt-auth-bike-owner.guards';

@ApiTags('Bike Reports')
@Controller('bike-reports')
export class BikeReportsController {
  constructor(private readonly bikeReportsService: BikeReportsService) {}

  @ApiOperation({ summary: 'Create a bike report' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponseBikeReport,
  })
  @UseGuards(JwtAuthBikeOwnerGuard)
  @Post('bike/:bikeId')
  create(
    @Body() createBikeReportDto: CreateBikeReportDto,
    @Param('bikeId', ParseIntPipe) bikeId: number,
    @Request() req: { user: PayloadTokenBikeOwner },
  ) {
    return this.bikeReportsService.create({
      createBikeReportDto,
      bikeId,
      bikeOwnerId: req.user.id,
    });
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponseBikeReport,
  })
  @Roles(Role.DIRECTOR)
  @UseGuards(JwtAuthPoliceGuard, RolesGuard)
  @Get()
  findAll() {
    return this.bikeReportsService.findAll();
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBikeReport,
  })
  @UseGuards(JwtAuthBikeOwnerGuard)
  @Get(':bikeReportId/owner')
  findOneByBikeOwner(
    @Param('bikeReportId', ParseIntPipe) bikeReportId: number,
    @Request() req: { user: PayloadTokenBikeOwner },
  ) {
    return this.bikeReportsService.findOneByBikeOwner({
      bikeReportId,
      bikeOwnerId: req.user.id,
    });
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBikeReport,
  })
  @UseGuards(JwtAuthPoliceGuard)
  @Get(':bikeReportId')
  findOne(@Param('bikeReportId', ParseIntPipe) bikeReportId: number) {
    return this.bikeReportsService.findOne({ bikeReportId });
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBikeReport,
  })
  @UseGuards(JwtAuthBikeOwnerGuard)
  @Put(':bikeReportId')
  update(
    @Param('bikeReportId', ParseIntPipe) bikeReportId: number,
    @Body() updateBikeReportDto: UpdateBikeReportDto,
    @Request() req: { user: PayloadTokenBikeOwner },
  ) {
    return this.bikeReportsService.update({
      bikeReportId,
      updateBikeReportDto,
      userId: req.user.id,
    });
  }

  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponseBikeReport,
  })
  @Roles(Role.POLICE)
  @UseGuards(JwtAuthPoliceGuard, RolesGuard)
  @Put(':bikeReportId/resolved')
  updateStatus(
    @Param('bikeReportId', ParseIntPipe) bikeReportId: number,
    @Request() req: { user: PayloadTokenBikeOwner },
  ) {
    return this.bikeReportsService.updateStatus({
      bikeReportId,
      policeId: req.user.id,
    });
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponseBikeReport,
  })
  @Roles(Role.DIRECTOR)
  @UseGuards(JwtAuthPoliceGuard, RolesGuard)
  @Delete(':bikeReportId')
  remove(@Param('bikeReportId', ParseIntPipe) bikeReportId: number) {
    return this.bikeReportsService.remove({ bikeReportId });
  }
}
