import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { Bike } from './entities/bike.entity';

@Injectable()
export class BikesService {
  constructor(
    @InjectRepository(Bike)
    private readonly bikeRepository: Repository<Bike>,
  ) {}
  async create(createBikeDto: CreateBikeDto) {
    const bike = this.bikeRepository.create(createBikeDto);

    return this.bikeRepository.save(bike);
  }

  async findAll() {
    return await this.bikeRepository.find();
  }

  async findOne({ bikeId }: { bikeId: number }) {
    const bike = await this.bikeRepository.findOne(bikeId);

    if (!bike) {
      throw new NotFoundException(`Bike ${bikeId} was not found`);
    }

    return bike;
  }

  async update({
    bikeId,
    updateBikeDto,
  }: {
    bikeId: number;
    updateBikeDto: UpdateBikeDto;
  }) {
    const bike = await this.bikeRepository.preload({
      id: bikeId,
      ...updateBikeDto,
    });
    if (!bike) {
      throw new NotFoundException(`Bike with id ${bikeId} does not exist`);
    }
    return this.bikeRepository.save(bike);
  }

  async remove({ bikeId }: { bikeId: number }) {
    const bike = await this.findOne({ bikeId });

    return this.bikeRepository.remove(bike);
  }
}
