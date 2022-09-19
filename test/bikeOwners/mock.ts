import { faker } from '@faker-js/faker';

export const bikeOwner = {
  email: faker.internet.email(),
  password: 'Prueba123>',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};
export const bikeOwnerWeakPassword = {
  email: faker.internet.email(),
  password: 'Prueba',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};

export const fakeBikeOwner = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  fake: 'fake-column',
};

export const incompleteBikeOwner = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};
