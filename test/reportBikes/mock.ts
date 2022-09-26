import { faker } from '@faker-js/faker';

export const bikeReport = {
  dateTheft: faker.date.past(),
  addressTheft: faker.address.streetAddress(),
  descriptionTheft: faker.lorem.sentences(),
};

export const fakebikeReport = {
  dateTheft: faker.date.past(),
  addressTheft: faker.address.streetAddress(),
  descriptionTheft: faker.lorem.sentences(),
  fake: 'fake-column',
};

export const incompletebikeReport = {
  dateTheft: faker.date.past(),
  descriptionTheft: faker.lorem.sentences(),
  password: 'Prueba123.',
};
