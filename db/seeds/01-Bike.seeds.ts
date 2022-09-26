import { Factory, Seeder } from 'typeorm-seeding';
import { Bike } from '../../src/bikes/entities/bike.entity';
import { BikeOwner } from '../../src/bike-owners/entities/bike-owner.entity';

export default class CreateBikes implements Seeder {
  public async run(factory: Factory): Promise<any> {
    for (let i = 0; i < 20; i++) {
      const bikeOwner = await factory(BikeOwner)().create();

      await factory(Bike)({ bikeOwner }).create();
    }
  }
}
