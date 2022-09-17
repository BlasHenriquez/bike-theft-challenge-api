import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BikesTypes, ColorsBikes } from '../../utils/enum/bikes.enum';
import { DefaultEntity } from '../../utils/entities/default.entity';

@Entity('bikes')
export class Bike extends DefaultEntity {
  @ApiProperty({ type: 'string' })
  @Column({ unique: true })
  license: string;

  @ApiProperty({ type: 'string' })
  @Column()
  description: string;

  @ApiProperty({ type: 'enum', enum: ColorsBikes })
  @Column({
    type: 'enum',
    enum: ColorsBikes,
  })
  color: ColorsBikes;

  @ApiProperty({ type: 'date' })
  @Column()
  date: Date;

  @ApiProperty({ type: 'enum', enum: BikesTypes })
  @Column({
    type: 'enum',
    enum: BikesTypes,
  })
  type: BikesTypes;
}
