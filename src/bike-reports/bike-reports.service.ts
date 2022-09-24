import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BikeOwnersService } from './../bike-owners/bike-owners.service';
import { BikesService } from './../bikes/bikes.service';
import { PoliceOfficer } from './../police-officers/entities/police-officer.entity';
import { PoliceOfficersService } from './../police-officers/police-officers.service';
import { StatusPolice } from './../utils/enum/police-officer.enum';
import { StatusReport } from './../utils/enum/reports-status.enum';
import { Connection, Repository } from 'typeorm';
import { CreateBikeReportDto } from './dto/create-bike-report.dto';
import { UpdateBikeReportDto } from './dto/update-bike-report.dto';
import { BikeReport } from './entities/bike-report.entity';
import { Role } from './../utils/enum/role.enum';

@Injectable()
export class BikeReportsService {
  constructor(
    @InjectRepository(BikeReport)
    private readonly bikeReportRepository: Repository<BikeReport>,
    private readonly bikesService: BikesService,
    private readonly bikeOwnersService: BikeOwnersService,
    private readonly policeOfficersService: PoliceOfficersService,
    private readonly connection: Connection,
  ) {}

  async create({
    createBikeReportDto,
    bikeId,
    bikeOwnerId,
  }: {
    createBikeReportDto: CreateBikeReportDto;
    bikeId: number;
    bikeOwnerId: number;
  }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const report = this.bikeReportRepository.create(createBikeReportDto);
      const bike = await this.bikesService.findOne({ bikeId });
      await this.bikeOwnersService.findOne({ bikeOwnerId });
      const policeOfficer = await this.policeOfficersService.findOneFree();

      if (bike.bikeOwner.id !== bikeOwnerId) {
        throw new Error(` This user ${bikeOwnerId} can not make it`);
      }

      if (
        policeOfficer &&
        policeOfficer.status === StatusPolice.FREE &&
        policeOfficer.role === Role.POLICE
      ) {
        await queryRunner.manager.update(
          PoliceOfficer,
          { id: policeOfficer.id },
          { status: StatusPolice.BUSY },
        );
        const reportComplete = {
          ...report,
          status: StatusReport.INVESTIGATING,
          bike,
          policeOfficers: policeOfficer,
        };

        const test = await queryRunner.manager.save(BikeReport, reportComplete);
        await queryRunner.commitTransaction();
        return test;
      }

      const reportWithoutPolice = {
        ...report,
        status: StatusReport.PENDING,
        bike,
      };

      const createdReport = await queryRunner.manager.save(
        BikeReport,
        reportWithoutPolice,
      );

      await queryRunner.commitTransaction();
      return createdReport;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Could not create your report' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.bikeReportRepository.find({
      relations: ['bike', 'policeOfficers'],
    });
  }

  async findOne({ bikeReportId }: { bikeReportId: number }) {
    const bikeReport = await this.bikeReportRepository.findOne(bikeReportId, {
      relations: ['bike', 'policeOfficers'],
    });

    if (!bikeReport) {
      throw new NotFoundException(`Bike owner ${bikeReportId} was not found`);
    }

    return bikeReport;
  }

  async update({
    bikeReportId,
    updateBikeReportDto,
    userId,
  }: {
    bikeReportId: number;
    updateBikeReportDto: UpdateBikeReportDto;
    userId: number;
  }) {
    const bikeReport = await this.bikeReportRepository.preload({
      id: bikeReportId,
      ...updateBikeReportDto,
    });
    if (!bikeReport) {
      throw new NotFoundException(
        `Report with id ${bikeReportId} does not exist`,
      );
    }

    if (bikeReport.bike.bikeOwner.id !== userId) {
      throw new NotFoundException(
        `Bike owner with id ${userId} can not update this report`,
      );
    }

    return this.bikeReportRepository.save(bikeReport);
  }

  async updateStatus({
    bikeReportId,
    policeId,
  }: {
    bikeReportId: number;
    policeId: number;
  }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const bikeReport = await this.bikeReportRepository.preload({
        id: bikeReportId,
        status: StatusReport.RESOLVED,
      });

      if (bikeReport.policeOfficers.id !== policeId) {
        throw new ConflictException(
          `This bike report is not assigned to police with ${policeId}`,
        );
      }
      await queryRunner.manager.update(
        PoliceOfficer,
        { id: bikeReport.policeOfficers.id },
        { status: StatusPolice.FREE },
      );
      if (!bikeReport) {
        throw new ConflictException(
          `Bike report with id ${bikeReportId} does not exist`,
        );
      }
      console.log(bikeReport.policeOfficers.id, policeId);

      const resolvedReport = await this.bikeReportRepository.save(bikeReport);
      await queryRunner.commitTransaction();
      return resolvedReport;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Could not create mark resolved' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove({ bikeReportId }: { bikeReportId: number }) {
    const bikeReport = await this.findOne({ bikeReportId });

    return this.bikeReportRepository.remove(bikeReport);
  }
}
