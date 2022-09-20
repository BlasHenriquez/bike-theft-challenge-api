import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePoliceOfficerDto } from './dto/create-police-officer.dto';
import { UpdatePoliceOfficerDto } from './dto/update-police-officer.dto';
import { PoliceOfficer } from './entities/police-officer.entity';

@Injectable()
export class PoliceOfficersService {
  constructor(
    @InjectRepository(PoliceOfficer)
    private policeOfficerRepository: Repository<PoliceOfficer>,
  ) {}

  async create(createPoliceOfficerDto: CreatePoliceOfficerDto) {
    const policeOfficer = await this.policeOfficerRepository.findOne({
      email: createPoliceOfficerDto.email,
    });

    if (policeOfficer) {
      throw new ConflictException(
        `This email ${createPoliceOfficerDto.email} already exist`,
      );
    }

    const createdPoliceOfficer = await this.policeOfficerRepository.create(
      createPoliceOfficerDto,
    );
    const savePoliceOfficer = await this.policeOfficerRepository.save(
      createdPoliceOfficer,
    );
    delete savePoliceOfficer.password;
    return savePoliceOfficer;
  }

  async findAll() {
    return await this.policeOfficerRepository.find();
  }

  async findPoliceByEmailAndGetPassword(email: string) {
    return await this.policeOfficerRepository.findOne({
      select: ['id', 'password', 'role'],
      where: { email },
    });
  }

  async findOne({ policeOfficerId }: { policeOfficerId: number }) {
    const policeOfficer = await this.policeOfficerRepository.findOne(
      policeOfficerId,
    );

    if (!policeOfficer) {
      throw new NotFoundException(
        `Police officer ${policeOfficerId} was not found`,
      );
    }

    return policeOfficer;
  }

  async update({
    policeOfficerId,
    updatePoliceOfficerDto,
  }: {
    policeOfficerId: number;
    updatePoliceOfficerDto: UpdatePoliceOfficerDto;
  }) {
    const policeOfficer = await this.policeOfficerRepository.preload({
      id: policeOfficerId,
      ...updatePoliceOfficerDto,
    });
    if (!policeOfficer) {
      throw new NotFoundException(
        `Police officer with id ${policeOfficerId} does not exist`,
      );
    }
    return this.policeOfficerRepository.save(policeOfficer);
  }

  async remove({ policeOfficerId }: { policeOfficerId: number }) {
    const policeOfficer = await this.findOne({ policeOfficerId });

    return this.policeOfficerRepository.remove(policeOfficer);
  }
}
