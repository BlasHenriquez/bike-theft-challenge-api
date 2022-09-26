import { PoliceDepartment } from '../../src/police-departments/entities/police-department.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceOfficer } from '../../src/police-officers/entities/police-officer.entity';
import { Bike } from '../../src/bikes/entities/bike.entity';
import { BikeReport } from '../../src/bike-reports/entities/bike-report.entity';
import { BikeOwner } from '../../src/bike-owners/entities/bike-owner.entity';
import { StatusPolice } from '../../src/utils/enum/police-officer.enum';

export default class CreateBikeReports implements Seeder {
  public async run(factory: Factory): Promise<any> {
    for (let i = 0; i < 20; i++) {
      const policeDepartment = await factory(PoliceDepartment)().create();
      const police = await factory(PoliceOfficer)({
        status: StatusPolice.BUSY,
      }).create();
      const bikeOwner = await factory(BikeOwner)().create();
      const bike = await factory(Bike)({ bikeOwner }).create();

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
