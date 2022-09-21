import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceDepartment } from '../../../src/police-departments/entities/police-department.entity';

export default class CreateFivePoliceDepartmentsTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeDepartments = [];
    for (let i = 0; i < 5; i++) {
      policeDepartments.push(await factory(PoliceDepartment)().create());
    }

    return { policeDepartments };
  }
}
