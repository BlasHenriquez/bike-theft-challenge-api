import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearDatabase, initTestApp } from '../helpers';
import { runSeeder, useSeeding } from 'typeorm-seeding';
import {
  createPoliceDepartment,
  getPoliceDepartments,
  getPoliceDepartment,
  updatPoliceDepartment,
  deletPoliceDepartment,
} from './api';
import { Connection } from 'typeorm';
import { policeDepartment, fakePoliceDepartment } from './mock';
import CreatePoliceDepartment from '../../db/seeds/test/createPoliceDepartment';
import CreateFivePoliceDepartmentsTest from '../../db/seeds/test/createFivePoliceDepartments';

describe('[Feature] policeDepartment - /police-departments', () => {
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

  it('Create police department [POST /]', async () => {
    const { statusCode, body } = await createPoliceDepartment(
      app,
      policeDepartment,
    );

    expect(statusCode).toEqual(HttpStatus.CREATED);
    expect(body.name).toBe(policeDepartment.name);
  });

  it('Create police department [POST /] fails because repeat name', async () => {
    const { policeDepartment } = await runSeeder(CreatePoliceDepartment);

    delete policeDepartment.id;
    delete policeDepartment.createdAt;
    delete policeDepartment.updatedAt;

    const policeDepartmentWithRepeatName = {
      ...policeDepartment,
      name: policeDepartment.name,
    };
    const { statusCode } = await createPoliceDepartment(
      app,
      policeDepartmentWithRepeatName,
    );

    expect(statusCode).toEqual(HttpStatus.CONFLICT);
  });

  it('Create police department [POST /] fails because send fake column', async () => {
    const { statusCode } = await createPoliceDepartment(
      app,
      fakePoliceDepartment,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Get police department [GET /]', async () => {
    const { policeDepartments } = await runSeeder(
      CreateFivePoliceDepartmentsTest,
    );

    const { statusCode, body } = await getPoliceDepartments(app);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(5);
    expect(body[0].name).toBe(policeDepartments[0].name);
  });

  it('Get police department [GET /] returns empty', async () => {
    const { statusCode, body } = await getPoliceDepartments(app);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(0);
  });

  it('Get one police department [GET /police-departments/:policeDepartmentId]', async () => {
    const { policeDepartment } = await runSeeder(CreatePoliceDepartment);

    const { statusCode, body } = await getPoliceDepartment(
      app,
      policeDepartment.id,
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.name).toBe(policeDepartment.name);
  });

  it('Get one police department [GET /police-departments/:policeDepartmentId] fails because id does not exist', async () => {
    await runSeeder(CreatePoliceDepartment);

    const { statusCode } = await getPoliceDepartment(app, 0);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('Get one police department [GET /police-departments/:policeDepartmentId] fails because params is not a number', async () => {
    await runSeeder(CreatePoliceDepartment);

    const { statusCode } = await getPoliceDepartment(app, 'fake-id');

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Update one police department [PUT /:policeDepartmentId]', async () => {
    const { policeDepartment } = await runSeeder(CreatePoliceDepartment);

    const { statusCode, body: bodyUpdate } = await updatPoliceDepartment(
      app,
      policeDepartment.id,
      {
        name: 'test update',
      },
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.name).toBe('test update');
  });

  it('Update one police department [PUT /:policeDepartmentId] fails because id does not exist', async () => {
    await runSeeder(CreatePoliceDepartment);

    const { statusCode } = await updatPoliceDepartment(app, 0, {
      name: 'fake-name',
    });

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Update one police deparment [PUT /:policeDepartmentId] fails because column is fake', async () => {
    const { policeDepartment } = await runSeeder(CreatePoliceDepartment);

    const { statusCode } = await updatPoliceDepartment(
      app,
      policeDepartment.id,
      {
        fake: 'fake-column',
      },
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update one police department [PUT /:policeDepartmentId] fails because params is not a number', async () => {
    await runSeeder(CreatePoliceDepartment);

    const { statusCode } = await updatPoliceDepartment(app, 'fake', {
      name: 'fake-name',
    });

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Delete one police department [DELETE /:policeDepartmentId]', async () => {
    const { policeDepartment } = await runSeeder(CreatePoliceDepartment);

    const { statusCode, body: bodyDelete } = await deletPoliceDepartment(
      app,
      policeDepartment.id,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyDelete.name).toEqual(policeDepartment.name);
  });

  it('Delete one police department [DELETE /:policeDepartmentId] fails because id does not exist', async () => {
    await runSeeder(CreatePoliceDepartment);

    const { statusCode } = await deletPoliceDepartment(app, 0);

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Delete one police department [DELETE /:policeDepartmentId] fails because param is not a number', async () => {
    await runSeeder(CreatePoliceDepartment);

    const { statusCode } = await deletPoliceDepartment(app, 'fake-id');

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });
});
