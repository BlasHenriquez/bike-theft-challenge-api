import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../src/police-officers/entities/police-officer.entity';

export default class CreatePoliceOfficers implements Seeder {
  public async run(factory: Factory): Promise<any> {
    for (let i = 0; i < 20; i++) {
      await factory(PoliceOfficer)({ password: 'Prueba123>' }).create();
    }
  }
}
