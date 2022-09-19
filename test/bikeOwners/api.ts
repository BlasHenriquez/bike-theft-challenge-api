import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createBikeOwner = (app: INestApplication, bikeOwner: any) =>
  request(app.getHttpServer()).post(`/bike-owners`).send(bikeOwner);

export const getBikeOwners = (app: INestApplication) =>
  request(app.getHttpServer()).get(`/bike-owners`);

export const getBikeOwner = (app: INestApplication, bikeOwnerId: any) =>
  request(app.getHttpServer()).get(`/bike-owners/${bikeOwnerId}`);

export const updateBikeOwner = (
  app: INestApplication,
  bikeOwnerId: any,
  bikeOwner: any,
) =>
  request(app.getHttpServer())
    .put(`/bike-owners/${bikeOwnerId}`)
    .send(bikeOwner);

export const deleteBikeOwner = (app: INestApplication, bikeOwnerId: any) =>
  request(app.getHttpServer()).delete(`/bike-owners/${bikeOwnerId}`);
