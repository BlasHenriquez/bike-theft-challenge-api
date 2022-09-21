import { Bike } from '../../../src/bikes/entities/bike.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { BikeOwner } from '../../../src/bike-owners/entities/bike-owner.entity';

export default class CreateFiveBikesTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const bikes = [];
    for (let i = 0; i < 5; i++) {
      const bikeOwner = await factory(BikeOwner)().create();
      bikes.push(await factory(Bike)({ bikeOwner }).create());
    }

    return { bikes };
  }
}
