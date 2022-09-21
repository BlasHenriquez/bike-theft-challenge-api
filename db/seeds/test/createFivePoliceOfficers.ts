import { PoliceOfficer } from '../../../src/police-officers/entities/police-officer.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceDepartment } from '../../../src/police-departments/entities/police-department.entity';

export default class CreateFivePoliceOfficersTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeOfficers = [];
    for (let i = 0; i < 5; i++) {
      const policeDepartment = await factory(PoliceDepartment)().createMany(2);

      policeOfficers.push(
        await factory(PoliceOfficer)({
          password: 'Prueba123>',
          policeDepartment,
        }).create(),
      );
    }

    return { policeOfficers };
  }
}
