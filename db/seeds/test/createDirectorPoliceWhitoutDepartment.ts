import { Role } from '../../../src/utils/enum/role.enum';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../../src/police-officers/entities/police-officer.entity';

export default class CreateDirectorWhitoutDepartmentPolice implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeDirector = await factory(PoliceOfficer)({
      password: 'Prueba123>',
      role: Role.DIRECTOR,
    }).create();

    return { policeDirector };
  }
}
