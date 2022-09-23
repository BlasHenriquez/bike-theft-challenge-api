import { DefaultEntity } from './../../utils/entities/default.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StatusReport } from './../../utils/enum/reports-status.enum';
import { Bike } from './../../bikes/entities/bike.entity';
import { PoliceOfficer } from './../../police-officers/entities/police-officer.entity';

@Entity('bike_reports')
export class BikeReport extends DefaultEntity {
  @ApiProperty({ type: 'Date' })
  @Column({ name: 'date_theft' })
  dateTheft: Date;

  @ApiProperty({ type: 'string' })
  @Column({ name: 'address_theft' })
  addressTheft: string;

  @ApiProperty({ type: 'string' })
  @Column({ name: 'description_theft' })
  descriptionTheft: string;

  @ApiProperty({ type: 'enum', enum: StatusReport })
  @Column({
    type: 'enum',
    enum: StatusReport,
  })
  status: StatusReport;

  @ApiProperty({ type: 'number' })
  @OneToOne(() => Bike, (bike) => bike.bikeReport, {
    cascade: true,
  })
  @JoinColumn({ name: 'bike_id' })
  bike: Bike;

  @ApiProperty({ type: 'number' })
  @ManyToOne(
    () => PoliceOfficer,
    (policeOfficers) => policeOfficers.bikeReport,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'police_officer_id' })
  policeOfficers: PoliceOfficer;
}
