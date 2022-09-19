import { faker } from '@faker-js/faker';
import { StatusPolice } from '../../src/utils/enum/police-officer.enum';
import { Role } from '../../src/utils/enum/role.enum';

export const policeOfficer = {
  email: faker.internet.email(),
  password: 'Prueba123>',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  role: Role.POLICE,
  status: StatusPolice.FREE,
};

export const policeOfficerWeakPassword = {
  email: faker.internet.email(),
  password: 'Prueba',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  role: Role.POLICE,
  status: StatusPolice.FREE,
};

export const fakePoliceOfficer = {
  email: faker.internet.email(),
  password: 'Prueba123.',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  fake: 'fake-column',
};

export const incompletePoliceOfficer = {
  email: faker.internet.email(),
  password: 'Prueba123.',
};
