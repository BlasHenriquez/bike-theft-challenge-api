import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceDepartment } from '../../src/police-departments/entities/police-department.entity';

export default class CreateDepartment implements Seeder {
  public async run(factory: Factory): Promise<any> {
    for (let i = 0; i < 20; i++) {
      await factory(PoliceDepartment)().create();
    }
  }
}
