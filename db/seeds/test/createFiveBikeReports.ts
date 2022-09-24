import { PoliceOfficer } from '../../../src/police-officers/entities/police-officer.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { PoliceDepartment } from '../../../src/police-departments/entities/police-department.entity';
import { Bike } from '../../../src/bikes/entities/bike.entity';
import { BikeReport } from '../../../src/bike-reports/entities/bike-report.entity';
import { BikeOwner } from '../../../src/bike-owners/entities/bike-owner.entity';
import { StatusReport } from '../../../src/utils/enum/reports-status.enum';

export default class CreateFiveBikeReportTest implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const reports = [];
    for (let i = 0; i < 5; i++) {
      const policeDepartment = await factory(PoliceDepartment)().create();
      const bikeOwner = await factory(BikeOwner)().create();
      const bike = await factory(Bike)({ bikeOwner }).create();

      const police = await factory(PoliceOfficer)({
        password: 'Prueba123>',
        policeDepartment,
      }).create();

      reports.push(
        await factory(BikeReport)({
          bike,
          policeOfficers: police,
          status: StatusReport.INVESTIGATING,
        }).create(),
      );
    }

    return { reports };
  }
}
