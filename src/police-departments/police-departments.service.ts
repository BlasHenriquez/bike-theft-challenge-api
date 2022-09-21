import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePoliceDepartmentDto } from './dto/create-police-department.dto';
import { UpdatePoliceDepartmentDto } from './dto/update-police-department.dto';
import { PoliceDepartment } from './entities/police-department.entity';

@Injectable()
export class PoliceDepartmentsService {
  constructor(
    @InjectRepository(PoliceDepartment)
    private policeDepartmentRepository: Repository<PoliceDepartment>,
  ) {}

  async create(createPoliceDepartmentDto: CreatePoliceDepartmentDto) {
    const department = await this.policeDepartmentRepository.findOne({
      name: createPoliceDepartmentDto.name,
    });

    if (department) {
      throw new ConflictException(
        `This name ${createPoliceDepartmentDto.name} already exist`,
      );
    }

    const createdDepartment = await this.policeDepartmentRepository.create(
      createPoliceDepartmentDto,
    );

    const saveDepartment = await this.policeDepartmentRepository.save(
      createdDepartment,
    );
    return saveDepartment;
  }

  async findAll() {
    return await this.policeDepartmentRepository.find();
  }

  async findOne({ departmentId }: { departmentId: number }) {
    const department = await this.policeDepartmentRepository.findOne(
      departmentId,
    );

    if (!department) {
      throw new NotFoundException(`Department ${departmentId} was not found`);
    }

    return department;
  }

  async update({
    departmentId,
    updatePoliceDepartmentDto,
  }: {
    departmentId: number;
    updatePoliceDepartmentDto: UpdatePoliceDepartmentDto;
  }) {
    const department = await this.policeDepartmentRepository.preload({
      id: departmentId,
      ...updatePoliceDepartmentDto,
    });
    if (!department) {
      throw new NotFoundException(
        `Department with id ${departmentId} does not exist`,
      );
    }
    return this.policeDepartmentRepository.save(department);
  }

  async remove({ departmentId }: { departmentId: number }) {
    const bike = await this.findOne({ departmentId });

    return this.policeDepartmentRepository.remove(bike);
  }
}
