import * as bcrypt from 'bcrypt';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Bike } from '../../../src/bikes/entities/bike.entity';

@Entity('bike_owners')
export class BikeOwner extends DefaultEntity {
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

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @ApiProperty({ type: 'number' })
  @OneToMany(() => Bike, (bike) => bike.bikeOwner, {
    cascade: true,
  })
  bikes: Bike[];
}
