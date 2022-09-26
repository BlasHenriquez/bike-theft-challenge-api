import { HttpStatus, INestApplication } from '@nestjs/common';
import { clearDatabase, initTestApp } from '../../test/helpers';
import { runSeeder, useSeeding } from 'typeorm-seeding';

import { Connection } from 'typeorm';
import {
  bikeOwner,
  bikeOwnerWeakPassword,
  fakeBikeOwner,
  incompleteBikeOwner,
} from './mock';
import CreateFiveBikeOwnersTest from '../../db/seeds/test/createFiveBikeOwners';
import CreateBikeOwnerTest from '../../db/seeds/test/createBikeOwner';
import {
  createBikeOwner,
  deleteBikeOwner,
  getBikeOwner,
  getBikeOwners,
  updateBikeOwner,
} from './api';

import CreateDirectorPolice from '../../db/seeds/test/createDirectorPolice';
import { loginBikeOwner } from '../../test/authBikeOwners/api';
import { loginPoliceOfficer } from '../../test/authPolice/api';
import CreatePoliceOfficerTest from '../../db/seeds/test/createPoliceOfficer';

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

  it('Create bike owner [POST /] fails because repeat email', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    delete bikeOwner.id;
    delete bikeOwner.createdAt;
    delete bikeOwner.updatedAt;

    const bikeOwnerWithRepeatEmail = {
      ...bikeOwner,
      password: 'Prueba123>',
      firstName: 'fake-repeat',
      lastName: 'fake',
    };
    const { statusCode } = await createBikeOwner(app, bikeOwnerWithRepeatEmail);

    expect(statusCode).toEqual(HttpStatus.CONFLICT);
  });

  it('Create bike owner [POST /] fails because password is weak', async () => {
    const { statusCode } = await createBikeOwner(app, bikeOwnerWeakPassword);

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Create bike owner [POST /] fails because send datas with fake column', async () => {
    const { statusCode } = await createBikeOwner(app, fakeBikeOwner);

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Create bike owner [POST /] fails because send datas is incomplete', async () => {
    const { statusCode } = await createBikeOwner(app, incompleteBikeOwner);

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Get bike owners [GET /]', async () => {
    const { bikeOwners } = await runSeeder(CreateFiveBikeOwnersTest);

    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body } = await getBikeOwners(app, accessToken);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(5);
    expect(body[0].email).toBe(bikeOwners[0].email);
    expect(body[0].firstName).toBe(bikeOwners[0].firstName);
    expect(body[0].lastName).toBe(bikeOwners[0].lastName);
  });

  it('Get bike owners [GET /] fails because police is not director', async () => {
    const { policeOfficer } = await runSeeder(CreatePoliceOfficerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeOfficer.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getBikeOwners(app, accessToken);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get bike owners [GET /] fails because is not police.', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getBikeOwners(app, accessToken);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get bike owners [GET /] returns empty', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body } = await getBikeOwners(app, accessToken);

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.length).toBe(0);
  });

  it('Get one bike owner [GET /:bikeOwnerId]', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body } = await getBikeOwner(
      app,
      bikeOwner.id,
      accessToken,
    );

    expect(statusCode).toBe(HttpStatus.OK);
    expect(body.email).toBe(bikeOwner.email);
    expect(body.firstName).toBe(bikeOwner.firstName);
    expect(body.lastName).toBe(bikeOwner.lastName);
  });

  it('Get one bike owner [GET /:bikeOwnerId] fails because is not bike owner', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await getBikeOwner(app, bikeOwner.id, accessToken);

    expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('Get one bike owner [GET /:bikeOwnerId] fails because id does not exist', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await getBikeOwner(app, 0, accessToken);

    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('Get one bike owner [GET /:bikeOwnerId] fails because params is not a number', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await getBikeOwner(app, 'fake-id', accessToken);

    expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Update one owner [PUT /:bikeOwnerId]  one column', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyUpdate } = await updateBikeOwner(
      app,
      bikeOwner.id,
      {
        firstName: 'test update',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.firstName).toBe('test update');
  });

  it('Update one owner [PUT /:bikeOwnerId] fails because is not bike owner', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await updateBikeOwner(
      app,
      bikeOwner.id,
      {
        firstName: 'test update',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Update one owner [PUT /:bikeOwnerId] multiple column', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyUpdate } = await updateBikeOwner(
      app,
      bikeOwner.id,
      {
        firstName: 'test update',
        lastName: 'test',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyUpdate.firstName).toBe('test update');
    expect(bodyUpdate.lastName).toBe('test');
  });

  it('Update one owner [PUT /:bikeOwnerId] fails because id does not exist', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;
    await runSeeder(CreateBikeOwnerTest);

    const { statusCode } = await updateBikeOwner(
      app,
      0,
      {
        firstName: 'test update',
        lastName: 'tes',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Update one owner [PUT /:bikeOwnerId] fails because column is fake', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await updateBikeOwner(
      app,
      bikeOwner.id,
      {
        fake: 'fake-column',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Update one owner [PUT /:bikeOwnerId] fails because params is not a number', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await updateBikeOwner(
      app,
      'fake',
      {
        fake: 'fake-id',
      },
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('Delete one owner [DELETE /:bikeOwnerId]', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode, body: bodyDelete } = await deleteBikeOwner(
      app,
      bikeOwner.id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(bodyDelete.email).toEqual(bikeOwner.email);
  });

  it('Delete one owner [DELETE /:bikeOwnerId] fails because is not bike owner', async () => {
    const { policeDirector } = await runSeeder(CreateDirectorPolice);
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginPoliceOfficer(app, {
      email: policeDirector.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await deleteBikeOwner(
      app,
      bikeOwner.id,
      accessToken,
    );

    expect(statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('Delete one owner [DELETE /:bikeOwnerId] fails because id does not exist', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await deleteBikeOwner(app, 0, accessToken);

    expect(statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('Delete one owner [DELETE /:bikeOwnerId] fails because param is not a number', async () => {
    const { bikeOwner } = await runSeeder(CreateBikeOwnerTest);

    const { body: bodyToken } = await loginBikeOwner(app, {
      email: bikeOwner.email,
      password: 'Prueba123>',
    });
    const accessToken = bodyToken.accessToken;

    const { statusCode } = await deleteBikeOwner(app, 'fake-id', accessToken);

    expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });
});
