import { PoliceDepartment } from '../../../src/police-departments/entities/police-department.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../../src/police-officers/entities/police-officer.entity';
import { StatusPolice } from '../../../src/utils/enum/police-officer.enum';

export default class CreatePoliceOfficerBusyTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeDepartment = await factory(PoliceDepartment)().createMany(2);

    const policeOfficerBusy = await factory(PoliceOfficer)({
      password: 'Prueba123>',
      status: StatusPolice.BUSY,
      policeDepartment,
    }).create();

    return { policeOfficerBusy };
  }
}
