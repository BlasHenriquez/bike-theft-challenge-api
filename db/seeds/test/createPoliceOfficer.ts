import { PoliceDepartment } from '../../../src/police-departments/entities/police-department.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../../src/police-officers/entities/police-officer.entity';

export default class CreatePoliceOfficerTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeDepartment = await factory(PoliceDepartment)().createMany(2);

    const policeOfficer = await factory(PoliceOfficer)({
      password: 'Prueba123>',
      policeDepartment,
    }).create();

    return { policeOfficer };
  }
}
