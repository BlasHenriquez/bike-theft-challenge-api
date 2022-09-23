import { Module } from '@nestjs/common';
import { BikeReportsService } from './bike-reports.service';
import { BikeReportsController } from './bike-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeReport } from './entities/bike-report.entity';
import { BikesModule } from './../bikes/bikes.module';
import { BikeOwnersModule } from './../bike-owners/bike-owners.module';
import { PoliceOfficersModule } from './../police-officers/police-officers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BikeReport]),
    BikesModule,
    BikeOwnersModule,
    PoliceOfficersModule,
  ],
  controllers: [BikeReportsController],
  providers: [BikeReportsService],
  exports: [BikeReportsService],
})
export class BikeReportsModule {}
