import { HttpStatus, INestApplication } from '@nestjs/common';
import CreateBikeTest from '../../db/seeds/test/createBike';
import { clearDatabase, initTestApp } from '../../test/helpers';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import { createBike, deleteBike, getBike, getBikes, updateBike } from './api';
import { Connection } from 'typeorm';
import { bike, fakeBike, incompleteBike } from './mock';
import CreateFiveBikesTest from '../../db/seeds/test/createFiveBikes';

describe('[Feature] bike - /bikes', () => {
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

  it('Create bike [POST /]', async () => {
    const { statusCode } = await createBike(app, bike);

    expect(statusCode).toEqual(HttpStatus.CREATED);
  });

  it('Create bike [POST /] because send datas with fake column', async () => {
    const { statusCode } = await createBike(app, fakeBike);

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Create bike [POST /] because send datas is incomplete', async () => {
    const { statusCode } = await createBike(app, incompleteBike);

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Get bikes [GET /]', async () => {
    const { bikes } = await runSeeder(CreateFiveBikesTest);

    const { statusCode, body } = await getBikes(app);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(5);
    expect(body[0].license).toBe(bikes[0].license);
    expect(body[0].description).toBe(bikes[0].description);
    expect(body[0].color).toBe(bikes[0].color);
    expect(body[0].type).toBe(bikes[0].type);
    expect(new Date(body[0].date).getTime()).toBe(
      new Date(bikes[0].date).getTime(),
    );
  });

  it('Get bikes [GET /] returns empty', async () => {
    const { statusCode, body } = await getBikes(app);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(0);
  });

  it('Get one bike [GET /bikes/:bikeId]', async () => {
    const { bike } = await runSeeder(CreateBikeTest);

    const { statusCode, body } = await getBike(app, bike.id);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.license).toBe(bike.license);
    expect(body.description).toBe(bike.description);
    expect(body.color).toBe(bike.color);
    expect(body.type).toBe(bike.type);
    expect(new Date(body.date).getTime()).toBe(new Date(bike.date).getTime());
  });

  it('Get one bike [GET /bikes/:bikeId] fails because id does not exist', async () => {
    await runSeeder(CreateBikeTest);

    const { statusCode } = await getBike(app, 0);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('Get one bike [GET /bikes/:bikeId] fails because params is not a number', async () => {
    await runSeeder(CreateBikeTest);

    const { statusCode } = await getBike(app, 'fake-id');

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Update one [PUT /:bikeId] only one column', async () => {
    const { bike } = await runSeeder(CreateBikeTest);

    const { statusCode, body: bodyUpdate } = await updateBike(app, bike.id, {
      description: 'test update',
    });

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.description).toBe('test update');
  });

  it('Update one [PUT /:bikeId] multiple column', async () => {
    const { bike } = await runSeeder(CreateBikeTest);

    const { statusCode, body: bodyUpdate } = await updateBike(app, bike.id, {
      description: 'test update',
      color: 'WHITE',
      type: 'HYBRID_BIKES',
    });

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.description).toBe('test update');
    expect(bodyUpdate.color).toBe('WHITE');
    expect(bodyUpdate.type).toBe('HYBRID_BIKES');
  });

  it('Update one [PUT /:bikeId] fails because id does not exist', async () => {
    await runSeeder(CreateBikeTest);

    const { statusCode } = await updateBike(app, 0, {
      description: 'test update',
      color: 'WHITE',
      type: 'HYBRID_BIKES',
    });

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Update one [PUT /:bikeId] fails because column is fake', async () => {
    const { bike } = await runSeeder(CreateBikeTest);

    const { statusCode } = await updateBike(app, bike.id, {
      fake: 'fake-column',
    });

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update one [PUT /:bikeId] fails because params is not a number', async () => {
    await runSeeder(CreateBikeTest);

    const { statusCode } = await updateBike(app, 'fake', {
      fake: 'fake-id',
    });

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Delete one [DELETE /:bikeId]', async () => {
    const { bike } = await runSeeder(CreateBikeTest);

    const { statusCode, body: bodyDelete } = await deleteBike(app, bike.id);

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyDelete.license).toEqual(bike.license);
  });

  it('Delete one [DELETE /:bikeId] fails because id does not exist', async () => {
    await runSeeder(CreateBikeTest);

    const { statusCode } = await deleteBike(app, 0);

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Delete one [DELETE /:bikeId] fails because param is not a number', async () => {
    await runSeeder(CreateBikeTest);

    const { statusCode } = await deleteBike(app, 'fake-id');

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });
});
