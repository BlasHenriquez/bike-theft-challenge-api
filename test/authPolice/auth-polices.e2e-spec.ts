import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearDatabase, initTestApp } from '../helpers';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import CreateBikeOwnerTest from '../../db/seeds/test/createBikeOwner';
import CreatePoliceOfficerTest from '../../db/seeds/test/createPoliceOfficer';
import { loginPoliceOfficer } from './api';

describe('[Feature] Auth police - /auth-police-officer', () => {
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

  it('Login police officer [POST /login]', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });

    expect(statusCode).toEqual(HttpStatus.OK);
  });

  it('Login police officer [POST /login] fails, because password is incorrect', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { statusCode, body } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'wrongPassword',
    });

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body.message).toBe('not allow');
  });

  it('Login police officer [POST /login] fails, because user is bike owner', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { statusCode, body } = await loginPoliceOfficer(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body.message).toBe('not allow');
  });
});
