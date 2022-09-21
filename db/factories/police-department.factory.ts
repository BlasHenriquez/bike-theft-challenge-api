import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { PoliceDepartment } from '../../src/police-departments/entities/police-department.entity';

define(PoliceDepartment, (_, context: Partial<PoliceDepartment>) => {
  const policeDepartment = new PoliceDepartment();

  policeDepartment.name = context?.name || faker.name.firstName();

  return policeDepartment;
});
