import { Bike } from '../../../src/bikes/entities/bike.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateBikeTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const bike = await factory(Bike)().create();

    return { bike };
  }
}
