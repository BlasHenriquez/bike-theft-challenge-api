import {
  Injectable,
  ConflictException,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PoliceDepartmentsService } from '../../src/police-departments/police-departments.service';
import { Role } from './../utils/enum/role.enum';
import { Repository } from 'typeorm';
import { CreatePoliceOfficerDto } from './dto/create-police-officer.dto';
import { UpdatePoliceOfficerDto } from './dto/update-police-officer.dto';
import { PoliceOfficer } from './entities/police-officer.entity';
import { Common } from '../../src/utils/common/common';
import { StatusPolice } from './../utils/enum/police-officer.enum';

@Injectable()
export class PoliceOfficersService {
  constructor(
    @InjectRepository(PoliceOfficer)
    private policeOfficerRepository: Repository<PoliceOfficer>,
    private readonly policeDepartmentsService: PoliceDepartmentsService,
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

    if (
      createPoliceOfficerDto.policeDepartment.length > Common.FIRST_VALUE &&
      createPoliceOfficerDto.role === Role.DIRECTOR
    ) {
      throw new ConflictException(
        `Police officer director only can be created in a department`,
      );
    }

    if (createPoliceOfficerDto.policeDepartment.length === Common.MIN_VALUE) {
      throw new PreconditionFailedException(
        `Police officer ${createPoliceOfficerDto.email} must be in a department`,
      );
    }

    const departments = await this.policeDepartmentsService.findByIds({
      departments: createPoliceOfficerDto.policeDepartment,
    });
    const createdPoliceOfficer = await this.policeOfficerRepository.create({
      ...createPoliceOfficerDto,
      policeDepartment: departments,
    });
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

  async findOneFree() {
    const status = StatusPolice.FREE;
    const policeOfficer = await this.policeOfficerRepository
      .createQueryBuilder('police')
      .where(`police.status = :status`, { status })
      .getOne();

    return policeOfficer;
  }

  async update({
    policeOfficerId,
    updatePoliceOfficerDto,
  }: {
    policeOfficerId: number;
    updatePoliceOfficerDto: UpdatePoliceOfficerDto;
  }) {
    if (
      updatePoliceOfficerDto.policeDepartment.length <= Common.FIRST_VALUE &&
      updatePoliceOfficerDto.role === Role.DIRECTOR
    ) {
      throw new ConflictException(
        `Police officer director with id ${policeOfficerId} only can be in a department`,
      );
    }
    if (updatePoliceOfficerDto.policeDepartment.length === Common.MIN_VALUE) {
      throw new PreconditionFailedException(
        `Police officer ${updatePoliceOfficerDto.email} must be in a department`,
      );
    }
    const departments = await this.policeDepartmentsService.findByIds({
      departments: updatePoliceOfficerDto.policeDepartment,
    });

    const policeOfficer = await this.policeOfficerRepository.preload({
      id: policeOfficerId,
      ...updatePoliceOfficerDto,
      policeDepartment: departments,
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
