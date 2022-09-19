import { Module } from '@nestjs/common';
import { PoliceOfficersService } from './police-officers.service';
import { PoliceOfficersController } from './police-officers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoliceOfficer } from './entities/police-officer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoliceOfficer])],
  controllers: [PoliceOfficersController],
  providers: [PoliceOfficersService],
  exports: [PoliceOfficersService],
})
export class PoliceOfficersModule {}
