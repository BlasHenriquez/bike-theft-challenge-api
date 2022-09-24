import { PoliceDepartment } from '../../src/police-departments/entities/police-department.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../src/police-officers/entities/police-officer.entity';
import { Bike } from '../../src/bikes/entities/bike.entity';
import { BikeReport } from '../../src/bike-reports/entities/bike-report.entity';

export default class CreateBikeReports implements Seeder {
  public async run(factory: Factory): Promise<any> {
    for (let i = 0; i < 20; i++) {
      const policeDepartment = await factory(PoliceDepartment)().create();
      const police = await factory(PoliceOfficer)().create();
      const bike = await factory(Bike)().create();

      await factory(PoliceOfficer)({
        password: 'Prueba123>',
        policeDepartment,
      }).create();

      await factory(BikeReport)({
        bike,
        policeOfficers: police,
      }).create();
    }
  }
}
