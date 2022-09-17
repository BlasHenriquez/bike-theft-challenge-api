import { Module } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { BikesController } from './bikes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from './entities/bike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bike])],
  controllers: [BikesController],
  providers: [BikesService],
  exports: [BikesService],
})
export class BikesModule {}
