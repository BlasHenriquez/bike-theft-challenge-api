import { DefaultEntity } from '../../utils/entities/default.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PoliceOfficer } from './../../police-officers/entities/police-officer.entity';

@Entity('police_departments')
export class PoliceDepartment extends DefaultEntity {
  @ApiProperty({ type: 'string' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ type: 'number' })
  @ManyToMany(
    () => PoliceOfficer,
    (policeOfficer) => policeOfficer.policeDepartment,
  )
  @JoinTable({ name: 'police_departmets_police_officers' })
  policeOfficer: PoliceOfficer[];
}
