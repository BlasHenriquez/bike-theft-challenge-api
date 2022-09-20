import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../../src/police-officers/entities/police-officer.entity';

export default class CreatePoliceOfficerTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeOfficer = await factory(PoliceOfficer)({
      password: 'Prueba123>',
    }).create();

    return { policeOfficer };
  }
}
