import { faker } from '@faker-js/faker';
import { PoliceOfficer } from '../../src/police-officers/entities/police-officer.entity';
import { StatusPolice } from '../../src/utils/enum/police-officer.enum';
import { Role } from '../../src/utils/enum/role.enum';
import { define } from 'typeorm-seeding';

define(PoliceOfficer, (_, context: Partial<PoliceOfficer>) => {
  const policeOfficer = new PoliceOfficer();

  policeOfficer.email = context?.email || faker.internet.email();
  policeOfficer.password = context?.password || faker.internet.password();
  policeOfficer.firstName = context?.firstName || faker.name.firstName();
  policeOfficer.lastName = context?.lastName || faker.name.lastName();
  policeOfficer.status = context?.status || StatusPolice.FREE;
  policeOfficer.role = context?.role || Role.POLICE;

  return policeOfficer;
});
