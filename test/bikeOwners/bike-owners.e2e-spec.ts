import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearDatabase, initTestApp } from '../../test/helpers';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import {
  createBikeOwner,
  getBikeOwners,
  getBikeOwner,
  updateBikeOwner,
  deleteBikeOwner,
} from './api';
import { Connection } from 'typeorm';
import { bikeOwner, fakeBikeOwner, incompleteBikeOwner } from './mock';
import CreateFiveBikeOwnersTest from '../../db/seeds/test/createFiveBikeOwners';
import CreateBikeOwnerTest from '../../db/seeds/test/createBikeOwner';

describe('[Feature] bikeOwners - /bike-owners', () => {
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

  it('Create bike owner [POST /]', async () => {
    const { statusCode, body } = await createBikeOwner(app, bikeOwner);

    expect(statusCode).toEqual(HttpStatus.CREATED);
    expect(body.email).toBe(bikeOwner.email);
    expect(body.firstName).toBe(bikeOwner.firstName);
    expect(body.lastName).toBe(bikeOwner.lastName);
  });

  it('Create bike [POST /] fails because repeat email', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    delete bikeOwner.id;
    delete bikeOwner.createdAt;
    delete bikeOwner.updatedAt;

    const bikeOwnerWithRepeatEmail = {
      ...bikeOwner,
      firstName: 'fake-repeat',
      lastName: 'fake',
    };
    const { statusCode } = await createBikeOwner(app, bikeOwnerWithRepeatEmail);

    expect(statusCode).toEqual(HttpStatus.CONFLICT);
  });

  it('Create bike owner [POST /] fails because send datas with fake column', async () => {
    const { statusCode } = await createBikeOwner(app, fakeBikeOwner);

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Create bike owner [POST /] fails because send datas is incomplete', async () => {
    const { statusCode } = await createBikeOwner(app, incompleteBikeOwner);

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Get bikes owner [GET /]', async () => {
    const { bikeOwners } = await runSeeder(CreateFiveBikeOwnersTest);

    const { statusCode, body } = await getBikeOwners(app);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(5);
    expect(body[0].license).toBe(bikeOwners[0].license);
    expect(body[0].description).toBe(bikeOwners[0].description);
    expect(body[0].color).toBe(bikeOwners[0].color);
    expect(body[0].type).toBe(bikeOwners[0].type);
    expect(new Date(body[0].date).getTime()).toBe(
      new Date(bikeOwners[0].date).getTime(),
    );
  });

  it('Get bikes owner [GET /] returns empty', async () => {
    const { statusCode, body } = await getBikeOwners(app);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(0);
  });

  it('Get one bike owner [GET /bikes/:bikeOwnerId]', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { statusCode, body } = await getBikeOwner(app, bikeOwner.id);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.license).toBe(bikeOwner.license);
    expect(body.description).toBe(bikeOwner.description);
    expect(body.color).toBe(bikeOwner.color);
    expect(body.type).toBe(bikeOwner.type);
    expect(new Date(body.date).getTime()).toBe(
      new Date(bikeOwner.date).getTime(),
    );
  });

  it('Get one bike owner [GET /bikes/:bikeOwnerId] fails because id does not exist', async () => {
    await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await getBikeOwner(app, 0);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('Get one bike owner [GET /bikes/:bikeOwnerId] fails because params is not a number', async () => {
    await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await getBikeOwner(app, 'fake-id');

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Update one owner [PUT /:bikeOwnerId] only one column', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { statusCode, body: bodyUpdate } = await updateBikeOwner(
      app,
      bikeOwner.id,
      {
        firstName: 'test update',
      },
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.firstName).toBe('test update');
  });

  it('Update one owner [PUT /:bikeOwnerId] multiple column', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { statusCode, body: bodyUpdate } = await updateBikeOwner(
      app,
      bikeOwner.id,
      {
        firstName: 'test update',
        lastName: 'test',
      },
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.firstName).toBe('test update');
    expect(bodyUpdate.lastName).toBe('test');
  });

  it('Update one owner [PUT /:bikeOwnerId] fails because id does not exist', async () => {
    await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await updateBikeOwner(app, 0, {
      firstName: 'test update',
      lastName: 'tes',
    });

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Update one owner [PUT /:bikeOwnerId] fails because column is fake', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await updateBikeOwner(app, bikeOwner.id, {
      fake: 'fake-column',
    });

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update one owner [PUT /:bikeOwnerId] fails because params is not a number', async () => {
    await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await updateBikeOwner(app, 'fake', {
      fake: 'fake-id',
    });

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Delete one owner [DELETE /:bikeOwnerId]', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { statusCode, body: bodyDelete } = await deleteBikeOwner(
      app,
      bikeOwner.id,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyDelete.email).toEqual(bikeOwner.email);
  });

  it('Delete one owner [DELETE /:bikeOwnerId] fails because id does not exist', async () => {
    await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await deleteBikeOwner(app, 0);

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Delete one owner [DELETE /:bikeOwnerId] fails because param is not a number', async () => {
    await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await deleteBikeOwner(app, 'fake-id');

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });
});
