import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearDatabase, initTestApp } from '../helpers';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import {
  createPoliceOfficer,
  getPoliceOfficers,
  getPoliceOfficer,
  updatPoliceOfficer,
  deletPoliceOfficer,
} from './api';
import { Connection } from 'typeorm';
import {
  policeOfficer,
  policeOfficerWeakPassword,
  fakePoliceOfficer,
  incompletePoliceOfficer,
} from './mock';
import CreatePoliceOfficerTest from '../../db/seeds/test/createPoliceOfficer';
import CreateFivePoliceOfficersTest from '../../db/seeds/test/createFivePoliceOfficers';

describe('[Feature] policeOfficer - /police-officers', () => {
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

  it('Create police officer [POST /]', async () => {
    const { statusCode, body } = await createPoliceOfficer(app, policeOfficer);

    expect(statusCode).toEqual(HttpStatus.CREATED);
    expect(body.email).toBe(policeOfficer.email);
    expect(body.firstName).toBe(policeOfficer.firstName);
    expect(body.lastName).toBe(policeOfficer.lastName);
    expect(body.role).toBe(policeOfficer.role);
    expect(body.status).toBe(policeOfficer.status);
  });

  it('Create police officer [POST /] fails because repeat email', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    delete policeOfficer.id;
    delete policeOfficer.createdAt;
    delete policeOfficer.updatedAt;

    const policeOfficerWithRepeatEmail = {
      ...policeOfficer,
      password: 'Prueba123>',
      firstName: 'fake-repeat',
      lastName: 'fake',
    };
    const { statusCode } = await createPoliceOfficer(
      app,
      policeOfficerWithRepeatEmail,
    );

    expect(statusCode).toEqual(HttpStatus.CONFLICT);
  });

  it('Create police officer [POST /] fails because password is weak', async () => {
    const { statusCode } = await createPoliceOfficer(
      app,
      policeOfficerWeakPassword,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Create police officer [POST /] fails because send datas with fake column', async () => {
    const { statusCode } = await createPoliceOfficer(app, fakePoliceOfficer);

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Create police officer [POST /] fails because send datas is incomplete', async () => {
    const { statusCode } = await createPoliceOfficer(
      app,
      incompletePoliceOfficer,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Get police officer [GET /]', async () => {
    const { policeOfficers } = await runSeeder(CreateFivePoliceOfficersTest);

    const { statusCode, body } = await getPoliceOfficers(app);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(5);
    expect(body[0].email).toBe(policeOfficers[0].email);
    expect(body[0].firstName).toBe(policeOfficers[0].firstName);
    expect(body[0].lastName).toBe(policeOfficers[0].lastName);
    expect(body[0].role).toBe(policeOfficers[0].role);
    expect(body[0].status).toBe(policeOfficers[0].status);
  });

  it('Get police officer [GET /] returns empty', async () => {
    const { statusCode, body } = await getPoliceOfficers(app);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(0);
  });

  it('Get one police officer [GET /police-officers/:policeOfficerId]', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { statusCode, body } = await getPoliceOfficer(app, policeOfficer.id);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.email).toBe(policeOfficer.email);
    expect(body.firstName).toBe(policeOfficer.firstName);
    expect(body.lastName).toBe(policeOfficer.lastName);
    expect(body.role).toBe(policeOfficer.role);
    expect(body.status).toBe(policeOfficer.status);
  });

  it('Get one police officer [GET /police-officers/:policeOfficerId] fails because id does not exist', async () => {
    await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await getPoliceOfficer(app, 0);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('Get one police officer [GET /police-officers/:policeOfficerId] fails because params is not a number', async () => {
    await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await getPoliceOfficer(app, 'fake-id');

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Update one police offer [PUT /:policeOfficerId] only one column', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { statusCode, body: bodyUpdate } = await updatPoliceOfficer(
      app,
      policeOfficer.id,
      {
        firstName: 'test update',
      },
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.firstName).toBe('test update');
  });

  it('Update one police offer [PUT /:policeOfficerId] multiple column', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { statusCode, body: bodyUpdate } = await updatPoliceOfficer(
      app,
      policeOfficer.id,
      {
        firstName: 'test update',
        lastName: 'test',
      },
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.firstName).toBe('test update');
    expect(bodyUpdate.lastName).toBe('test');
  });

  it('Update one police offer [PUT /:policeOfficerId] fails because id does not exist', async () => {
    await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await updatPoliceOfficer(app, 0, {
      firstName: 'test update',
      lastName: 'tes',
    });

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Update one police offer [PUT /:policeOfficerId] fails because column is fake', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await updatPoliceOfficer(app, policeOfficer.id, {
      fake: 'fake-column',
    });

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update one police office [PUT /:policeOfficerId] fails because params is not a number', async () => {
    await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await updatPoliceOfficer(app, 'fake', {
      fake: 'fake-id',
    });

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Delete one police office [DELETE /:policeOfficerId]', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { statusCode, body: bodyDelete } = await deletPoliceOfficer(
      app,
      policeOfficer.id,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyDelete.email).toEqual(policeOfficer.email);
  });

  it('Delete one police officer [DELETE /:policeOfficerId] fails because id does not exist', async () => {
    await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await deletPoliceOfficer(app, 0);

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Delete one police officer [DELETE /:policeOfficerId] fails because param is not a number', async () => {
    await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await deletPoliceOfficer(app, 'fake-id');

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });
});
