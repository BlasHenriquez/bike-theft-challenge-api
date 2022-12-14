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
  policeOfficerDirector,
} from './mock';
import CreatePoliceOfficerTest from '../../db/seeds/test/createPoliceOfficer';
import CreateFivePoliceOfficersTest from '../../db/seeds/test/createFivePoliceOfficers';
import CreateFivePoliceDepartmentsTest from '../../db/seeds/test/createFivePoliceDepartments';
import CreatePoliceDepartmentTest from '../../db/seeds/test/createPoliceDepartment';
import CreateDirectorPolice from '../../db/seeds/test/createDirectorPolice';
import { loginPoliceOfficer } from '../../test/authPolice/api';
import CreateBikeOwnerTest from '../../db/seeds/test/createBikeOwner';
import { loginBikeOwner } from '../../test/authBikeOwners/api';

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
    const { policeDepartments } = await runSeeder(
      CreateFivePoliceDepartmentsTest,
    );
    const policeOfficerWithDepartments = {
      ...policeOfficer,
      policeDepartment: policeDepartments,
    };
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode, body } = await createPoliceOfficer(
      app,
      policeOfficerWithDepartments,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.CREATED);
    expect(body.email).toBe(policeOfficer.email);
    expect(body.firstName).toBe(policeOfficer.firstName);
    expect(body.lastName).toBe(policeOfficer.lastName);
    expect(body.role).toBe(policeOfficer.role);
    expect(body.status).toBe(policeOfficer.status);
  });

  it('Create police officer director[POST /]', async () => {
    const { policeDepartment } = await runSeeder(CreatePoliceDepartmentTest);
    const policeOfficerWithDepartments = {
      ...policeOfficerDirector,
      policeDepartment: [policeDepartment],
    };
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode, body } = await createPoliceOfficer(
      app,
      policeOfficerWithDepartments,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.CREATED);
    expect(body.email).toBe(policeOfficerDirector.email);
    expect(body.firstName).toBe(policeOfficerDirector.firstName);
    expect(body.lastName).toBe(policeOfficerDirector.lastName);
    expect(body.role).toBe(policeOfficerDirector.role);
    expect(body.status).toBe(policeOfficerDirector.status);
  });

  it('Create police officer director[POST /] have more than one department', async () => {
    const { policeDepartments } = await runSeeder(
      CreateFivePoliceDepartmentsTest,
    );
    const policeOfficerWithDepartments = {
      ...policeOfficerDirector,
      policeDepartment: policeDepartments,
    };
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await createPoliceOfficer(
      app,
      policeOfficerWithDepartments,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.CONFLICT);
  });

  it('Create police officer [POST /] fails because police is not director', async () => {
    const { policeDepartments } = await runSeeder(
      CreateFivePoliceDepartmentsTest,
    );
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const policeOfficerWithDepartments = {
      ...policeOfficer,
      policeDepartment: policeDepartments,
    };

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await createPoliceOfficer(
      app,
      policeOfficerWithDepartments,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Create police officer [POST /] fails because is not police', async () => {
    const { policeDepartments } = await runSeeder(
      CreateFivePoliceDepartmentsTest,
    );
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const policeOfficerWithDepartments = {
      ...policeOfficer,
      policeDepartment: policeDepartments,
    };
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await createPoliceOfficer(
      app,
      policeOfficerWithDepartments,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Create police officer [POST /] fails beacuse police doesnt have a department', async () => {
    const policeOfficerWithEmptyDepartments = {
      ...policeOfficer,
      policeDepartment: [],
    };
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await createPoliceOfficer(
      app,
      policeOfficerWithEmptyDepartments,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.PRECONDITION_FAILED);
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
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await createPoliceOfficer(
      app,
      policeOfficerWithRepeatEmail,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.CONFLICT);
  });

  it('Create police officer [POST /] fails because password is weak', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await createPoliceOfficer(
      app,
      policeOfficerWeakPassword,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Create police officer [POST /] fails because send datas with fake column', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await createPoliceOfficer(
      app,
      fakePoliceOfficer,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Create police officer [POST /] fails because send datas is incomplete', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await createPoliceOfficer(
      app,
      incompletePoliceOfficer,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Get police officer [GET /]', async () => {
    const { policeOfficers } = await runSeeder(CreateFivePoliceOfficersTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body } = await getPoliceOfficers(app, accessToken);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(6);
    expect(body[0].email).toBe(policeOfficers[0].email);
    expect(body[0].firstName).toBe(policeOfficers[0].firstName);
    expect(body[0].lastName).toBe(policeOfficers[0].lastName);
    expect(body[0].role).toBe(policeOfficers[0].role);
    expect(body[0].status).toBe(policeOfficers[0].status);
  });

  it('Get police officer [GET /] returns empty', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode, body } = await getPoliceOfficers(app, accessToken);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(1);
  });

  it('Get police officer [GET /] fails because police is not director', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getPoliceOfficers(app, accessToken);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get police officer [GET /] fails because is not police', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getPoliceOfficers(app, accessToken);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get one police officer [GET :policeOfficerId]', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body } = await getPoliceOfficer(
      app,
      policeDirector.id,
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.email).toBe(policeDirector.email);
    expect(body.firstName).toBe(policeDirector.firstName);
    expect(body.lastName).toBe(policeDirector.lastName);
    expect(body.role).toBe(policeDirector.role);
    expect(body.status).toBe(policeDirector.status);
  });

  it('Get one police officer [GET :policeOfficerId] fails because police is not director', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getPoliceOfficer(
      app,
      policeOfficer.id,
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get one police officer [GET :policeOfficerId] fails because is not police', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getPoliceOfficer(
      app,
      policeOfficer.id,
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get one police officer [GET :policeOfficerId] fails because id does not exist', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await getPoliceOfficer(app, 0, accessToken);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('Get one police officer [GET :policeOfficerId] fails because params is not a number', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreatePoliceOfficerTest);

    const { statusCode } = await getPoliceOfficer(app, 'fake-id', accessToken);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Update one police offer [PUT /:policeOfficerId] only one column', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode, body: bodyUpdate } = await updatPoliceOfficer(
      app,
      policeOfficer.id,
      {
        firstName: 'test update',
        policeDepartment: policeOfficer.policeDepartment,
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.firstName).toBe('test update');
  });

  it('Update one police offer [PUT /:policeOfficerId] multiple column', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode, body: bodyUpdate } = await updatPoliceOfficer(
      app,
      policeOfficer.id,
      {
        firstName: 'test update',
        lastName: 'test',
        policeDepartment: policeOfficer.policeDepartment,
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.firstName).toBe('test update');
    expect(bodyUpdate.lastName).toBe('test');
  });

  it('Update one police offer [PUT /:policeOfficerId] multiple column fails because police is not director', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await updatPoliceOfficer(
      app,
      policeOfficer.id,
      {
        firstName: 'test update',
        lastName: 'test',
        policeDepartment: policeOfficer.policeDepartment,
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Update one police offer [PUT /:policeOfficerId] multiple column fails because is not police', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    const { statusCode } = await updatPoliceOfficer(
      app,
      policeOfficer.id,
      {
        firstName: 'test update',
        lastName: 'test',
        policeDepartment: policeOfficer.policeDepartment,
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Update one police offer [PUT /:policeOfficerId] fails because id does not exist', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await updatPoliceOfficer(
      app,
      0,
      {
        firstName: 'test update',
        lastName: 'tes',
        policeDepartment: policeOfficer.policeDepartment,
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Update one police offer [PUT /:policeOfficerId] fails because column is fake', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await updatPoliceOfficer(
      app,
      policeOfficer.id,
      {
        fake: 'fake-column',
        policeDepartment: policeOfficer.policeDepartment,
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update one police office [PUT /:policeOfficerId] fails because params is not a number', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await updatPoliceOfficer(
      app,
      'fake',
      {
        fake: 'fake-id',
        policeDepartment: policeOfficer.policeDepartment,
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Delete one police office [DELETE /:policeOfficerId]', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyDelete } = await deletPoliceOfficer(
      app,
      policeOfficer.id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyDelete.email).toEqual(policeOfficer.email);
  });

  it('Delete one police office [DELETE /:policeOfficerId] fails because police is not director', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await deletPoliceOfficer(
      app,
      policeOfficer.id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Delete one police office [DELETE /:policeOfficerId] fails because is not police', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await deletPoliceOfficer(
      app,
      policeOfficer.id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Delete one police officer [DELETE /:policeOfficerId] fails because id does not exist', async () => {
    await runSeeder(CreatePoliceOfficerTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await deletPoliceOfficer(app, 0, accessToken);

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Delete one police officer [DELETE /:policeOfficerId] fails because param is not a number', async () => {
    await runSeeder(CreatePoliceOfficerTest);
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await deletPoliceOfficer(
      app,
      'fake-id',
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });
});
