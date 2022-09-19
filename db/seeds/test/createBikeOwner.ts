import { BikeOwner } from '../../../src/bike-owners/entities/bike-owner.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateBikeOwnerTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const bikeOwner = await factory(BikeOwner)().create();

    return { bikeOwner };
  }
}
