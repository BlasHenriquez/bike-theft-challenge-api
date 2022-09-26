import { PoliceDepartment } from '../../../src/police-departments/entities/police-department.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../../src/police-officers/entities/police-officer.entity';
import { BikeReport } from '../../../src/bike-reports/entities/bike-report.entity';
import { Bike } from '../../../src/bikes/entities/bike.entity';

export default class CreateBikeReportInvestigatingTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeDepartment = await factory(PoliceDepartment)().create();
    await factory(PoliceOfficer)().create();
    const bike = await factory(Bike)().create();

    await factory(PoliceOfficer)({
      password: 'Prueba123>',
      policeDepartment,
    }).create();

    const report = await factory(BikeReport)({
      bike,
    }).create();

    return { report };
  }
}
