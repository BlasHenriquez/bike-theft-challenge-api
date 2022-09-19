import { BikeOwner } from '../../src/bike-owners/entities/bike-owner.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateBikeOwners implements Seeder {
  public async run(factory: Factory): Promise<any> {
    for (let i = 0; i < 20; i++) {
      await factory(BikeOwner)().create();
    }
  }
}
