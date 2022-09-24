import { faker } from '@faker-js/faker';
import { BikeReport } from '../../src/bike-reports/entities/bike-report.entity';
import { StatusReport } from '../../src/utils/enum/reports-status.enum';
import { define } from 'typeorm-seeding';

define(BikeReport, (_, context: Partial<BikeReport>) => {
  const bikeReport = new BikeReport();

  bikeReport.dateTheft = context?.dateTheft || faker.date.past();
  bikeReport.addressTheft =
    context?.addressTheft || faker.address.streetAddress();
  bikeReport.descriptionTheft =
    context?.descriptionTheft || faker.lorem.sentences();
  bikeReport.status = context?.status || StatusReport.PENDING;

  bikeReport.bike = context?.bike;
  bikeReport.policeOfficers = context?.policeOfficers;

  return bikeReport;
});
