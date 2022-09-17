import { faker } from '@faker-js/faker';
import { Bike } from '../../src/bikes/entities/bike.entity';
import { define } from 'typeorm-seeding';
import { BikesTypes, ColorsBikes } from '../../src/utils/enum/bikes.enum';

define(Bike, (_, context: Partial<Bike>) => {
  const bike = new Bike();

  bike.license = context?.license || faker.vehicle.vrm();
  bike.description = context?.description || faker.lorem.text();
  bike.color = context?.color || ColorsBikes.BLACK;
  bike.date = context?.date || faker.date.past();
  bike.type = context?.type || BikesTypes.FOLDING_BIKES;

  return bike;
});
