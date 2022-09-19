import { PoliceOfficer } from '../../../src/police-officers/entities/police-officer.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateFivePoliceOfficersTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeOfficers = [];
    for (let i = 0; i < 5; i++) {
      policeOfficers.push(
        await factory(PoliceOfficer)({ password: 'Prueba123>' }).create(),
      );
    }

    return { policeOfficers };
  }
}
