import { Module } from '@nestjs/common';
import { PoliceDepartmentsService } from './police-departments.service';
import { PoliceDepartmentsController } from './police-departments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoliceDepartment } from './entities/police-department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoliceDepartment])],
  controllers: [PoliceDepartmentsController],
  providers: [PoliceDepartmentsService],
  exports: [PoliceDepartmentsService],
})
export class PoliceDepartmentsModule {}
