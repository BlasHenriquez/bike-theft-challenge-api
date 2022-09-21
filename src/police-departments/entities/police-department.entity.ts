import { DefaultEntity } from '../../utils/entities/default.entity';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('police_departments')
export class PoliceDepartment extends DefaultEntity {
  @ApiProperty({ type: 'string' })
  @Column({ unique: true })
  name: string;
}
