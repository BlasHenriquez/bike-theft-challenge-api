import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearDatabase, initTestApp } from './../../test/helpers';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import CreateBikeOwnerTest from '../../db/seeds/test/createBikeOwner';
import { loginBikeOwner, loginPolice } from './api';
import CreatePoliceOfficerTest from '../../db/seeds/test/createPoliceOfficer';

describe('[Feature] Auth - /auth', () => {
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

  it('Login bike owner [POST /login]', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });

    expect(statusCode).toEqual(HttpStatus.OK);
  });

  it('Login bike owner [POST /login] fails, because password is incorrect', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);
    const { statusCode, body } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'wrongPassword',
    });

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body.message).toBe('not allow');
  });

  it('Login bike owner [POST /login] fails, because user is police officer', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { statusCode, body } = await loginBikeOwner(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body.message).toBe('not allow');
  });

  it('Login police officer[POST /login]', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await loginPolice(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });

    expect(statusCode).toEqual(HttpStatus.OK);
  });

  it('Login police officer [POST /login] fails, because password is incorrect', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { statusCode, body } = await loginPolice(app, {
      email: policeOfficer.email,
      password: 'wrongPassword',
    });

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body.message).toBe('not allow');
  });

  it('Login police officer [POST /login] fails, because user is bike owner', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { statusCode, body } = await loginPolice(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(body.message).toBe('not allow');
  });
});
