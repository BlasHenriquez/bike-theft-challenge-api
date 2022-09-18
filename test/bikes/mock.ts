import { faker } from '@faker-js/faker';
import { BikesTypes, ColorsBikes } from '../../src/utils/enum/bikes.enum';

export const bike = {
  license: faker.vehicle.vrm(),
  description: faker.lorem.text(),
  color: ColorsBikes.BLACK,
  date: faker.date.past(),
  type: BikesTypes.FOLDING_BIKES,
};

export const fakeBike = {
  license: faker.name.firstName(),
  description: faker.lorem.text(),
  color: ColorsBikes.BLACK,
  date: faker.date.past(),
  type: BikesTypes.FOLDING_BIKES,
  fake: 'fake-column',
};

export const incompleteBike = {
  license: faker.name.firstName(),
  description: faker.lorem.text(),
  color: ColorsBikes.BLACK,
};
