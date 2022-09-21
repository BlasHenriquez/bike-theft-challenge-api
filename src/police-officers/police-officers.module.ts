import { Module } from '@nestjs/common';
import { PoliceOfficersService } from './police-officers.service';
import { PoliceOfficersController } from './police-officers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoliceOfficer } from './entities/police-officer.entity';
import { PoliceDepartmentsModule } from '../../src/police-departments/police-departments.module';

@Module({
  imports: [TypeOrmModule.forFeature([PoliceOfficer]), PoliceDepartmentsModule],
  controllers: [PoliceOfficersController],
  providers: [PoliceOfficersService],
  exports: [PoliceOfficersService],
})
export class PoliceOfficersModule {}
