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
import CreatePoliceDepartmentTest from '../../db/seeds/test/createPoliceDepartment';
import CreateFivePoliceDepartmentsTest from '../../db/seeds/test/createFivePoliceDepartments';
import CreateDirectorPolice from '../../db/seeds/test/createDirectorPolice';
import { loginPoliceOfficer } from '../../test/authPolice/api';
import CreateDirectorWhitoutDepartmentPolice from '../../db/seeds/test/createDirectorPoliceWhitoutDepartment';
import CreatePoliceOfficerTest from '../../db/seeds/test/createPoliceOfficer';
import CreateBikeOwnerTest from '../../db/seeds/test/createBikeOwner';
import { loginBikeOwner } from '../../test/authBikeOwners/api';

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
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode, body } = await createPoliceDepartment(
      app,
      policeDepartment,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.CREATED);
    expect(body.name).toBe(policeDepartment.name);
  });

  it('Create police department [POST /] fails because police is not director', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await createPoliceDepartment(
      app,
      policeDepartment,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Create police department [POST /] fails because is not police', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await createPoliceDepartment(
      app,
      policeDepartment,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Create police department [POST /] fails because repeat name', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

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
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.CONFLICT);
  });

  it('Create police department [POST /] fails because send fake column', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await createPoliceDepartment(
      app,
      fakePoliceDepartment,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Get police department [GET /]', async () => {
    const { policeDirector } = await runSeeder(
      CreateDirectorWhitoutDepartmentPolice,
    );

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { policeDepartments } = await runSeeder(
      CreateFivePoliceDepartmentsTest,
    );

    const { statusCode, body } = await getPoliceDepartments(app, accessToken);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(5);
    expect(body[0].name).toBe(policeDepartments[0].name);
  });

  it('Get police department [GET /] fails because police is not director', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    await runSeeder(CreateFivePoliceDepartmentsTest);

    const { statusCode } = await getPoliceDepartments(app, accessToken);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get police department [GET /] fails because is not police', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreateFivePoliceDepartmentsTest);

    const { statusCode } = await getPoliceDepartments(app, accessToken);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get police department [GET /] returns empty', async () => {
    const { policeDirector } = await runSeeder(
      CreateDirectorWhitoutDepartmentPolice,
    );

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode, body } = await getPoliceDepartments(app, accessToken);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(0);
  });

  it('Get one police department [GET /:policeDepartmentId]', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode, body } = await getPoliceDepartment(
      app,
      policeDepartment.id,
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.name).toBe(policeDepartment.name);
  });

  it('Get one police department [GET /:policeDepartmentId] fails because police is not director', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await getPoliceDepartment(
      app,
      policeDepartment.id,
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get one police department [GET /:policeDepartmentId] fails because is not police', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await getPoliceDepartment(
      app,
      policeDepartment.id,
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get one police department [GET /:policeDepartmentId] fails because id does not exist', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await getPoliceDepartment(app, 0, accessToken);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('Get one police department [GET /:policeDepartmentId] fails because params is not a number', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await getPoliceDepartment(
      app,
      'fake-id',
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Update one police department [PUT /:policeDepartmentId]', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode, body: bodyUpdate } = await updatPoliceDepartment(
      app,
      policeDepartment.id,
      {
        name: 'test update',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.name).toBe('test update');
  });

  it('Update one police department [PUT /:policeDepartmentId] fails because police is not director', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await updatPoliceDepartment(
      app,
      policeDepartment.id,
      {
        name: 'test update',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Update one police department [PUT /:policeDepartmentId] fails because is not police', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await updatPoliceDepartment(
      app,
      policeDepartment.id,
      {
        name: 'test update',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Update one police department [PUT /:policeDepartmentId] fails because id does not exist', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await updatPoliceDepartment(
      app,
      0,
      {
        name: 'fake-name',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Update one police deparment [PUT /:policeDepartmentId] fails because column is fake', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await updatPoliceDepartment(
      app,
      policeDepartment.id,
      {
        fake: 'fake-column',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update one police department [PUT /:policeDepartmentId] fails because params is not a number', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await updatPoliceDepartment(
      app,
      'fake',
      {
        name: 'fake-name',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Delete one police department [DELETE /:policeDepartmentId]', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode, body: bodyDelete } = await deletPoliceDepartment(
      app,
      policeDepartment.id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyDelete.name).toEqual(policeDepartment.name);
  });

  it('Delete one police department [DELETE /:policeDepartmentId] fails because police is not director', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await deletPoliceDepartment(
      app,
      policeDepartment.id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Delete one police department [DELETE /:policeDepartmentId] fails because is not police', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await deletPoliceDepartment(
      app,
      policeDepartment.id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Delete one police department [DELETE /:policeDepartmentId] fails because id does not exist', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await deletPoliceDepartment(app, 0, accessToken);

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Delete one police department [DELETE /:policeDepartmentId] fails because param is not a number', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreatePoliceDepartmentTest);

    const { statusCode } = await deletPoliceDepartment(
      app,
      'fake-id',
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });
});
