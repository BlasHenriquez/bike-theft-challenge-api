import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BikeOwnersService } from '../../src/bike-owners/bike-owners.service';
import { Repository } from 'typeorm';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { Bike } from './entities/bike.entity';

@Injectable()
export class BikesService {
  constructor(
    @InjectRepository(Bike)
    private readonly bikeRepository: Repository<Bike>,
    private readonly bikeOwnersService: BikeOwnersService,
  ) {}
  async create({
    bikeOwnerId,
    createBikeDto,
  }: {
    bikeOwnerId: number;
    createBikeDto: CreateBikeDto;
  }) {
    const bike = await this.bikeRepository.findOne({
      license: createBikeDto.license,
    });
    const findBikeOwner = await this.bikeOwnersService.findOne({
      bikeOwnerId,
    });

    if (bike) {
      throw new ConflictException(
        `This license ${createBikeDto.license} already exist`,
      );
    }
    const bikeCreated = this.bikeRepository.create({
      ...createBikeDto,
      bikeOwner: { id: findBikeOwner.id },
    });

    return this.bikeRepository.save(bikeCreated);
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
