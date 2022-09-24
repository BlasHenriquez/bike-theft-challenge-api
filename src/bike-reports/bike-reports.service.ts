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
import { MailService } from './../mail/mail.service';
import { BikeOwner } from './../bike-owners/entities/bike-owner.entity';

@Injectable()
export class BikeReportsService {
  constructor(
    @InjectRepository(BikeReport)
    private readonly bikeReportRepository: Repository<BikeReport>,
    private readonly bikesService: BikesService,
    private readonly bikeOwnersService: BikeOwnersService,
    private readonly policeOfficersService: PoliceOfficersService,
    private readonly mailService: MailService,
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
      const bikeOwner = await this.bikeOwnersService.findOne({ bikeOwnerId });
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

        const bikeReport = await queryRunner.manager.save(
          BikeReport,
          reportComplete,
        );
        this.senEmailStatus(bikeOwner, bikeReport.status);
        await queryRunner.commitTransaction();

        return bikeReport;
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
      this.senEmailStatus(bikeOwner, createdReport.status);
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
      order: { id: 'ASC' },
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

  async findOneByBikeOwner({
    bikeReportId,
    bikeOwnerId,
  }: {
    bikeReportId: number;
    bikeOwnerId: number;
  }) {
    const bikeReport = await this.bikeReportRepository.findOne(bikeReportId, {
      relations: ['bike'],
      where: {
        bike: {
          bikeOwner: {
            id: bikeOwnerId,
          },
        },
      },
    });

    if (!bikeReport) {
      throw new NotFoundException(`Bike owner ${bikeReportId} was not found`);
    }

    return bikeReport;
  }

  private async findOnePendingBikeReport() {
    return await this.bikeReportRepository
      .createQueryBuilder('bikeReports')
      .leftJoinAndSelect('bikeReports.policeOfficers', 'policeOfficers')
      .leftJoinAndSelect('bikeReports.bike', 'bike')
      .where('bikeReports.status = :status', { status: StatusReport.PENDING })
      .getOne();
  }

  private async automaticallyAsigns(
    pendingReport: BikeReport,
    policeOfficer: PoliceOfficer,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const bikeReport = await this.bikeReportRepository.preload({
        id: pendingReport.id,
        status: StatusReport.INVESTIGATING,
        policeOfficers: policeOfficer,
      });

      if (!pendingReport) {
        throw new ConflictException(
          `Bike report with id ${bikeReport.id} does not exist`,
        );
      }

      if (!policeOfficer) {
        throw new ConflictException(`There not police available right now`);
      }

      const newAsignReport = await queryRunner.manager.save(bikeReport);
      this.senEmailStatus(newAsignReport.bike.bikeOwner, newAsignReport.status);
      await queryRunner.manager.update(
        PoliceOfficer,
        { id: bikeReport.policeOfficers.id },
        { status: StatusPolice.BUSY },
      );

      await queryRunner.commitTransaction();
      return newAsignReport;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Could not create mark resolved' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
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
      const resolvedReport = await this.bikeReportRepository.save(bikeReport);
      const pendingReport = await this.findOnePendingBikeReport();
      const policeOfficer = await this.policeOfficersService.findOneFree();

      if (pendingReport && policeOfficer) {
        this.automaticallyAsigns(pendingReport, policeOfficer);
      }

      this.senEmailStatus(resolvedReport.bike.bikeOwner, resolvedReport.status);

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

  private async senEmailStatus(bikeOwner: BikeOwner, status: StatusReport) {
    await this.mailService.sendChangeStatus({
      to: bikeOwner.email,
      subject: 'Bike report have been created',
      from: 'blasdelcristo_95@hotmail.com',
      text: `Hello World from NestJS Sendgrid`,
      html: `<h1>Hello ${bikeOwner.firstName},</h1> 
      <p>you have changes in your report sucessfully with the next status: ${status}</p>`,
    });
  }
}
