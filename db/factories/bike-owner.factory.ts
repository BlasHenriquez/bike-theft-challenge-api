import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { BikeOwner } from '../../src/bike-owners/entities/bike-owner.entity';

define(BikeOwner, (_, context: Partial<BikeOwner>) => {
  const bikeOwner = new BikeOwner();

  bikeOwner.email = context?.email || faker.internet.email();
  bikeOwner.password = context?.password || faker.internet.password();
  bikeOwner.firstName = context?.firstName || faker.name.firstName();
  bikeOwner.lastName = context?.lastName || faker.name.lastName();

  return bikeOwner;
});
