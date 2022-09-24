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
import { ApiTags } from '@nestjs/swagger';
import { PayloadTokenBikeOwner } from './../auth-bike-owner/models/token-bike-owner.model';
import { JwtAuthPoliceGuard } from './../auth-police-officer/guards/jwt-auth-police.guards';
import { JwtAuthBikeOwnerGuard } from './../auth-bike-owner/guards/jwt-auth-bike-owner.guards';
import { BikeReportsService } from './bike-reports.service';
import { CreateBikeReportDto } from './dto/create-bike-report.dto';
import { UpdateBikeReportDto } from './dto/update-bike-report.dto';
import { Roles } from './../auth-police-officer/decorators/roles.decorator';
import { Role } from './../utils/enum/role.enum';
import { RolesGuard } from './../auth-police-officer/guards/roles.guard';

@ApiTags('Bike Reports')
@Controller('bike-reports')
export class BikeReportsController {
  constructor(private readonly bikeReportsService: BikeReportsService) {}

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

  @Roles(Role.DIRECTOR)
  @UseGuards(JwtAuthPoliceGuard, RolesGuard)
  @Get()
  findAll() {
    return this.bikeReportsService.findAll();
  }

  @UseGuards(JwtAuthPoliceGuard)
  @Get(':bikeReportId')
  findOne(@Param('bikeReportId', ParseIntPipe) bikeReportId: number) {
    return this.bikeReportsService.findOne({ bikeReportId });
  }

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

  @Roles(Role.DIRECTOR)
  @UseGuards(JwtAuthPoliceGuard, RolesGuard)
  @Delete(':bikeReportId')
  remove(@Param('bikeReportId', ParseIntPipe) bikeReportId: number) {
    return this.bikeReportsService.remove({ bikeReportId });
  }
}
