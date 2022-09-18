import { Bike } from '../../../src/bikes/entities/bike.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateFiveBikesTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const bikes = [];
    for (let i = 0; i < 5; i++) {
      bikes.push(await factory(Bike)().create());
    }

    return { bikes };
  }
}
