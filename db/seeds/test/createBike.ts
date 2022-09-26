import { Bike } from '../../../src/bikes/entities/bike.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { BikeOwner } from '../../../src/bike-owners/entities/bike-owner.entity';

export default class CreateBikeTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const bikeOwner = await factory(BikeOwner)({
      password: 'Prueba123>',
    }).create();

    const bike = await factory(Bike)({ bikeOwner }).create();

    return { bike, bikeOwner };
  }
}
