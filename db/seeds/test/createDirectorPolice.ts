import { Role } from '../../../src/utils/enum/role.enum';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../../src/police-officers/entities/police-officer.entity';
import { PoliceDepartment } from '../../../src/police-departments/entities/police-department.entity';

export default class CreateDirectorPolice implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeDepartment = await factory(PoliceDepartment)().create();

    const policeDirector = await factory(PoliceOfficer)({
      password: 'Prueba123>',
      role: Role.DIRECTOR,
      policeDepartment,
    }).create();

    return { policeDirector };
  }
}
