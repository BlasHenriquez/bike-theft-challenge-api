import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearDatabase, initTestApp } from '../helpers';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import {
  createBikeReport,
  deleteBikeReport,
  getBikeReport,
  getBikeReportByOwner,
  getBikeReports,
  updatBikeReport,
  updatBikeReportToResolved,
} from './api';
import { Connection } from 'typeorm';
import { bikeReport, fakebikeReport, incompletebikeReport } from './mock';
import CreatePoliceOfficerTest from '../../db/seeds/test/createPoliceOfficer';
import CreateBikeTest from '../../db/seeds/test/createBike';
import { loginPoliceOfficer } from './../../test/authPolice/api';
import { loginBikeOwner } from './../authBikeOwners/api';
import { StatusReport } from '../../src/utils/enum/reports-status.enum';
import CreatePoliceOfficerBusyTest from '../../db/seeds/test/createPoliceOfficerBusy';
import CreateDirectorPolice from '../../db/seeds/test/createDirectorPolice';
import CreateBikeOwnerTest from '../../db/seeds/test/createBikeOwner';
import CreateFiveBikeReportTest from '../../db/seeds/test/createFiveBikeReports';
import CreateBikeReportInvestigatingTest from '../../db/seeds/test/createBikeReportInvestigating';
import { StatusPolice } from '../../src/utils/enum/police-officer.enum';

describe('[Feature] bikeReport - /bike-reports', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initTestApp();
    await app.init();
    const connection = app.get(Connection);
    await connection.synchronize(true);
    await useSeeding();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Create bike report investigating [POST /bike/:bikeId]', async () => {
    const { bike, bikeOwner } = await runSeeder(CreateBikeTest);
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });

    const accessToken = bodyToken.accessToken;
    const { statusCode, body: bodyCreated } = await createBikeReport(
      app,
      bike.id,
      accessToken,
      bikeReport,
    );

    expect(statusCode).toEqual(HttpStatus.CREATED);
    expect(new Date(bodyCreated.dateTheft).getTime()).toBe(
      new Date(bikeReport.dateTheft).getTime(),
    );
    expect(bodyCreated.addressTheft).toBe(bikeReport.addressTheft);
    expect(bodyCreated.descriptionTheft).toBe(bikeReport.descriptionTheft);
    expect(bodyCreated.status).toBe(StatusReport.INVESTIGATING);
    expect(bodyCreated.bike.id).toBe(bike.id);
    expect(bodyCreated.policeOfficers.id).toBe(policeOfficer.id);
    expect(bodyCreated.bike.bikeOwner.id).toBe(bikeOwner.id);
  });

  it('Create bike report pending[POST /bike/:bikeIdbike/:bikeId]', async () => {
    const { bike, bikeOwner } = await runSeeder(CreateBikeTest);
    await runSeeder(CreatePoliceOfficerBusyTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode, body: bodyCreated } = await createBikeReport(
      app,
      bike.id,
      accessToken,
      bikeReport,
    );

    expect(statusCode).toEqual(HttpStatus.CREATED);
    expect(new Date(bodyCreated.dateTheft).getTime()).toBe(
      new Date(bikeReport.dateTheft).getTime(),
    );
    expect(bodyCreated.addressTheft).toBe(bikeReport.addressTheft);
    expect(bodyCreated.descriptionTheft).toBe(bikeReport.descriptionTheft);
    expect(bodyCreated.status).toBe(StatusReport.PENDING);
    expect(bodyCreated.bike.id).toBe(bike.id);
    expect(bodyCreated.bike.bikeOwner.id).toBe(bikeOwner.id);
  });

  it('Create bike report without police because is director[POST /bike/:bikeId]', async () => {
    const { bike, bikeOwner } = await runSeeder(CreateBikeTest);
    await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyCreated } = await createBikeReport(
      app,
      bike.id,
      accessToken,
      bikeReport,
    );

    expect(statusCode).toEqual(HttpStatus.CREATED);
    expect(new Date(bodyCreated.dateTheft).getTime()).toBe(
      new Date(bikeReport.dateTheft).getTime(),
    );
    expect(bodyCreated.addressTheft).toBe(bikeReport.addressTheft);
    expect(bodyCreated.descriptionTheft).toBe(bikeReport.descriptionTheft);
    expect(bodyCreated.status).toBe(StatusReport.PENDING);
    expect(bodyCreated.bike.id).toBe(bike.id);
    expect(bodyCreated.policeOfficers).toBe(undefined);
    expect(bodyCreated.bike.bikeOwner.id).toBe(bikeOwner.id);
  });

  it('Create bike report without police because there are not in database [POST /bike/:bikeId]', async () => {
    const { bike, bikeOwner } = await runSeeder(CreateBikeTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyCreated } = await createBikeReport(
      app,
      bike.id,
      accessToken,
      bikeReport,
    );

    expect(statusCode).toEqual(HttpStatus.CREATED);
    expect(new Date(bodyCreated.dateTheft).getTime()).toBe(
      new Date(bikeReport.dateTheft).getTime(),
    );
    expect(bodyCreated.addressTheft).toBe(bikeReport.addressTheft);
    expect(bodyCreated.descriptionTheft).toBe(bikeReport.descriptionTheft);
    expect(bodyCreated.status).toBe(StatusReport.PENDING);
    expect(bodyCreated.bike.id).toBe(bike.id);
    expect(bodyCreated.policeOfficers).toBe(undefined);
    expect(bodyCreated.bike.bikeOwner.id).toBe(bikeOwner.id);
  });

  it('Create bike report pending[POST /bike/:bikeId] fails because report has fake column', async () => {
    const { bike, bikeOwner } = await runSeeder(CreateBikeTest);
    await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await createBikeReport(
      app,
      bike.id,
      accessToken,
      fakebikeReport,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Create bike report pending[POST /bike/:bikeId] fails because report is incomplete', async () => {
    const { bike, bikeOwner } = await runSeeder(CreateBikeTest);
    await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await createBikeReport(
      app,
      bike.id,
      accessToken,
      incompletebikeReport,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Create bike report [POST /bike/:bikeId] fails because bike owner token is not owner of bike', async () => {
    const { bike } = await runSeeder(CreateBikeTest);
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await createBikeReport(
      app,
      bike.id,
      accessToken,
      bikeReport,
    );

    expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('Create bike report [POST /bike/:bikeId] fails because bike id not exist', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeTest);
    await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await createBikeReport(
      app,
      0,
      accessToken,
      bikeReport,
    );

    expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('Create bike report [POST /bike/:bikeId] fails because bike id is string', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeTest);
    await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await createBikeReport(
      app,
      'fake',
      accessToken,
      bikeReport,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Get bike reports [GET /]', async () => {
    const { reports } = await runSeeder(CreateFiveBikeReportTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body } = await getBikeReports(app, accessToken);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(5);
    expect(new Date(body[0].dateTheft).getTime()).toBe(
      new Date(reports[0].dateTheft).getTime(),
    );
    expect(body[0].addressTheft).toBe(reports[0].addressTheft);
    expect(body[0].descriptionTheft).toBe(reports[0].descriptionTheft);
    expect(body[0].status).toBe(StatusReport.INVESTIGATING);
    expect(body[0].bike.id).toBe(reports[0].bike.id);
    expect(body[0].policeOfficers.id).toBe(reports[0].policeOfficers.id);
  });

  it('Get bike report [GET /] returns empty', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body } = await getBikeReports(app, accessToken);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(0);
  });

  it('Get bike report [GET /] fails because police is not director', async () => {
    await runSeeder(CreateFiveBikeReportTest);
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getBikeReports(app, accessToken);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get one bike report by police officer [GET /]', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { report, bike, bikeOwner } = await runSeeder(
      CreateBikeReportInvestigatingTest,
    );

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyOne } = await getBikeReport(
      app,
      report.id,
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(new Date(bodyOne.dateTheft).getTime()).toBe(
      new Date(report.dateTheft).getTime(),
    );
    expect(bodyOne.addressTheft).toBe(report.addressTheft);
    expect(bodyOne.descriptionTheft).toBe(report.descriptionTheft);
    expect(bodyOne.status).toBe(StatusReport.PENDING);
    expect(bodyOne.bike.id).toBe(bike.id);
    expect(bodyOne.bike.bikeOwner.id).toBe(bikeOwner.id);
  });

  it('Get one bike report by bike owner [GET /]', async () => {
    const { report, bike, bikeOwner } = await runSeeder(
      CreateBikeReportInvestigatingTest,
    );

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyOne } = await getBikeReportByOwner(
      app,
      report.id,
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(new Date(bodyOne.dateTheft).getTime()).toBe(
      new Date(report.dateTheft).getTime(),
    );
    expect(bodyOne.addressTheft).toBe(report.addressTheft);
    expect(bodyOne.descriptionTheft).toBe(report.descriptionTheft);
    expect(bodyOne.status).toBe(StatusReport.PENDING);
    expect(bodyOne.bike.id).toBe(bike.id);
    expect(bodyOne.bike.bikeOwner.id).toBe(bikeOwner.id);
  });

  it('Get one bike report by bike owner [GET /] fails because id is not from bikeOwner', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);
    const { report } = await runSeeder(CreateBikeReportInvestigatingTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getBikeReportByOwner(
      app,
      report.id,
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('Get one bike report by bike owner [GET /] fails because id doesnt exist', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeReportInvestigatingTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getBikeReportByOwner(app, 0, accessToken);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('Get one bike report by bike owner [GET /] fails because id is not a number', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeReportInvestigatingTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getBikeReportByOwner(
      app,
      'fake-id',
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Get one bike report [GET /] fails because token is not police officer', async () => {
    await runSeeder(CreatePoliceOfficerTest);
    const { report, bikeOwner } = await runSeeder(
      CreateBikeReportInvestigatingTest,
    );

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getBikeReport(app, report.id, accessToken);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get one bike report [GET /bike-reports/:bikeReportId] fails because id does not exist', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    await runSeeder(CreateBikeReportInvestigatingTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getBikeReport(app, 0, accessToken);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('Get one bike report [GET /bike-reports/:bikeReportId] fails because id is not a number', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    await runSeeder(CreateBikeReportInvestigatingTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getBikeReport(app, 'fake-id', accessToken);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Update one bike report [PUT /:bikeReportId] only one column', async () => {
    await runSeeder(CreatePoliceOfficerTest);
    const { report, bikeOwner } = await runSeeder(
      CreateBikeReportInvestigatingTest,
    );

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyUpdate } = await updatBikeReport(
      app,
      report.id,
      accessToken,
      {
        descriptionTheft: 'fake-description',
      },
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.descriptionTheft).toBe('fake-description');
  });

  it('Update one bike report [PUT /:bikeReportId] multiple one column', async () => {
    await runSeeder(CreatePoliceOfficerTest);
    const { report, bikeOwner } = await runSeeder(
      CreateBikeReportInvestigatingTest,
    );

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyUpdate } = await updatBikeReport(
      app,
      report.id,
      accessToken,
      {
        descriptionTheft: 'fake-description',
        addressTheft: 'Calle Pablo Luna',
      },
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.descriptionTheft).toBe('fake-description');
    expect(bodyUpdate.addressTheft).toBe('Calle Pablo Luna');
  });

  it('Update one bike report [PUT /:bikeReportId]fails because column is fake', async () => {
    await runSeeder(CreatePoliceOfficerTest);
    const { report, bikeOwner } = await runSeeder(
      CreateBikeReportInvestigatingTest,
    );

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await updatBikeReport(app, report.id, accessToken, {
      fake: 'fake-column',
    });

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update one bike report [PUT /:bikeReportId] fails because id does not exist', async () => {
    await runSeeder(CreatePoliceOfficerTest);
    const { bikeOwner } = await runSeeder(CreateBikeReportInvestigatingTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await updatBikeReport(app, 0, accessToken, {
      descriptionTheft: 'fake-description',
      addressTheft: 'Calle Pablo Luna',
    });

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Update one bike report [PUT /:bikeReportId] fails because id is not a number', async () => {
    await runSeeder(CreatePoliceOfficerTest);
    const { bikeOwner } = await runSeeder(CreateBikeReportInvestigatingTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await updatBikeReport(app, 'fake-id', accessToken, {
      descriptionTheft: 'fake-description',
      addressTheft: 'Calle Pablo Luna',
    });

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update one bike report to resolved [PUT /:bikeReportId/resolved] ', async () => {
    const { report, police } = await runSeeder(
      CreateBikeReportInvestigatingTest,
    );

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: police.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyUpdate } = await updatBikeReportToResolved(
      app,
      report.id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.status).toBe(StatusReport.RESOLVED);
    expect(bodyUpdate.policeOfficers.status).toBe(StatusPolice.FREE);
  });

  it('Update one bike report to resolved [PUT /:bikeReportId/resolved] fails because police is not in the case ', async () => {
    const { report } = await runSeeder(CreateBikeReportInvestigatingTest);
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await updatBikeReportToResolved(
      app,
      report.id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('Delete one bike report [DELETE /:bikeReportId]', async () => {
    const { reports } = await runSeeder(CreateFiveBikeReportTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyDelete } = await deleteBikeReport(
      app,
      reports[0].id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyDelete.descriptionTheft).toEqual(reports[0].descriptionTheft);
  });

  it('Delete one bike report [DELETE /:bikeReportId] fails because police is not director', async () => {
    const { reports } = await runSeeder(CreateFiveBikeReportTest);
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await deleteBikeReport(
      app,
      reports[0].id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Delete one bike report [DELETE /:bikeReportId] fails because id does not exist', async () => {
    await runSeeder(CreateFiveBikeReportTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await deleteBikeReport(app, 0, accessToken);

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Delete one bike report [DELETE /:bikeReportId] fails because id is not a number', async () => {
    await runSeeder(CreateFiveBikeReportTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await deleteBikeReport(app, 'fake-id', accessToken);

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });
});
