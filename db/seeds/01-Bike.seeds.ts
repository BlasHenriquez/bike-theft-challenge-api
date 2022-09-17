import { Bike } from '../../src/bikes/entities/bike.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateBikes implements Seeder {
  public async run(factory: Factory): Promise<any> {
    for (let i = 0; i < 20; i++) {
      await factory(Bike)().create();
    }
  }
}
