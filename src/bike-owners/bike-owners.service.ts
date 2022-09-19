import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBikeOwnerDto } from './dto/create-bike-owner.dto';
import { UpdateBikeOwnerDto } from './dto/update-bike-owner.dto';
import { BikeOwner } from './entities/bike-owner.entity';

@Injectable()
export class BikeOwnersService {
  constructor(
    @InjectRepository(BikeOwner)
    private bikeOwnerRepository: Repository<BikeOwner>,
  ) {}

  async create(createBikeOwnerDto: CreateBikeOwnerDto) {
    const bikeOwner = await this.bikeOwnerRepository.findOne({
      email: createBikeOwnerDto.email,
    });

    if (bikeOwner) {
      throw new ConflictException(
        `This email ${createBikeOwnerDto.email} already exist`,
      );
    }

    const createdBikeOwner = await this.bikeOwnerRepository.create(
      createBikeOwnerDto,
    );
    const saveBikeOwner = await this.bikeOwnerRepository.save(createdBikeOwner);
    delete saveBikeOwner.password;
    return saveBikeOwner;
  }

  async findAll() {
    return await this.bikeOwnerRepository.find();
  }

  async findOne({ bikeOwnerId }: { bikeOwnerId: number }) {
    const bikeOwner = await this.bikeOwnerRepository.findOne(bikeOwnerId);

    if (!bikeOwner) {
      throw new NotFoundException(`Bike owner ${bikeOwnerId} was not found`);
    }

    return bikeOwner;
  }

  async update({
    bikeOwnerId,
    updateBikeOwnerDto,
  }: {
    bikeOwnerId: number;
    updateBikeOwnerDto: UpdateBikeOwnerDto;
  }) {
    const bikeOwner = await this.bikeOwnerRepository.preload({
      id: bikeOwnerId,
      ...updateBikeOwnerDto,
    });
    if (!bikeOwner) {
      throw new NotFoundException(
        `Bike owner with id ${bikeOwnerId} does not exist`,
      );
    }
    return this.bikeOwnerRepository.save(bikeOwner);
  }

  async remove({ bikeOwnerId }: { bikeOwnerId: number }) {
    const bike = await this.findOne({ bikeOwnerId });

    return this.bikeOwnerRepository.remove(bike);
  }
}
