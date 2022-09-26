import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceDepartment } from '../../../src/police-departments/entities/police-department.entity';

export default class CreatePoliceDepartmentTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeDepartment = await factory(PoliceDepartment)().create();

    return { policeDepartment };
  }
}
