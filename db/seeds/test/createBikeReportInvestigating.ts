import { PoliceDepartment } from '../../../src/police-departments/entities/police-department.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../../src/police-officers/entities/police-officer.entity';
import { BikeReport } from '../../../src/bike-reports/entities/bike-report.entity';
import { Bike } from '../../../src/bikes/entities/bike.entity';
import { BikeOwner } from '../../../src/bike-owners/entities/bike-owner.entity';

export default class CreateBikeReportInvestigatingTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const policeDepartment = await factory(PoliceDepartment)().create();
    const bikeOwner = await factory(BikeOwner)({
      password: 'Prueba123>',
    }).create();
    const bike = await factory(Bike)({ bikeOwner }).create();

    const police = await factory(PoliceOfficer)({
      password: 'Prueba123>',
      policeDepartment,
    }).create();

    const report = await factory(BikeReport)({
      bike,
      policeOfficers: police,
    }).create();

    return { report, bike, bikeOwner, police };
  }
}
