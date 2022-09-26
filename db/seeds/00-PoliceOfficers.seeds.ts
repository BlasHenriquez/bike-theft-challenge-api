import { PoliceDepartment } from '../../src/police-departments/entities/police-department.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../src/police-officers/entities/police-officer.entity';

export default class CreatePoliceOfficers implements Seeder {
  public async run(factory: Factory): Promise<any> {
    for (let i = 0; i < 20; i++) {
      const policeDepartment = await factory(PoliceDepartment)().createMany(2);
      await factory(PoliceOfficer)({
        password: 'Prueba123>',
        policeDepartment,
      }).create();
    }
  }
}
