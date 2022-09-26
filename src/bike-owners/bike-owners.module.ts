import { Module } from '@nestjs/common';
import { BikeOwnersService } from './bike-owners.service';
import { BikeOwnersController } from './bike-owners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeOwner } from './entities/bike-owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BikeOwner])],
  controllers: [BikeOwnersController],
  providers: [BikeOwnersService],
  exports: [BikeOwnersService],
})
export class BikeOwnersModule {}
