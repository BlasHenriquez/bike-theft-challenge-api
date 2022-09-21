import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, ManyToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { StatusPolice } from './../../utils/enum/police-officer.enum';
import { Role } from './../../utils/enum/role.enum';
import { DefaultEntity } from './../../utils/entities/default.entity';
import { PoliceDepartment } from './../../police-departments/entities/police-department.entity';

@Entity('police_officers')
export class PoliceOfficer extends DefaultEntity {
  @ApiProperty({ type: 'string' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ type: 'string' })
  @Column()
  password: string;

  @ApiProperty({ type: 'string' })
  @Column({ name: 'first_name' })
  firstName: string;

  @ApiProperty({ type: 'string' })
  @Column({ name: 'last_name' })
  lastName: string;

  @ApiProperty({ type: 'enum', enum: Role })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.POLICE,
  })
  role: Role;

  @ApiProperty({ type: 'enum', enum: StatusPolice })
  @Column({
    type: 'enum',
    enum: StatusPolice,
    default: StatusPolice.FREE,
  })
  status: StatusPolice;

  @ApiProperty({ type: 'number' })
  @ManyToMany(
    () => PoliceDepartment,
    (policeDepartment) => policeDepartment.policeOfficer,
  )
  policeDepartment: PoliceDepartment[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
