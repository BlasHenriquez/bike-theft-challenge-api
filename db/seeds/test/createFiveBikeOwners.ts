import { Factory, Seeder } from 'typeorm-seeding';
import { BikeOwner } from '../../../src/bike-owners/entities/bike-owner.entity';

export default class CreateFiveBikeOwnersTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const bikeOwners = [];
    for (let i = 0; i < 5; i++) {
      bikeOwners.push(
        await factory(BikeOwner)({ password: 'Prueba123>' }).create(),
      );
    }

    return { bikeOwners };
  }
}
