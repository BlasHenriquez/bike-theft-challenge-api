import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createBikeOwner = (app: INestApplication, bikeOwner: any) =>
  request(app.getHttpServer()).post(`/bike-owners`).send(bikeOwner);

export const getBikeOwners = (app: INestApplication, token: string) =>
  request(app.getHttpServer())
    .get(`/bike-owners`)
    .set('Authorization', `Bearer ${token}`);

export const getBikeOwner = (
  app: INestApplication,
  bikeOwnerId: any,
  token: string,
) =>
  request(app.getHttpServer())
    .get(`/bike-owners/${bikeOwnerId}`)
    .set('Authorization', `Bearer ${token}`);

export const updateBikeOwner = (
  app: INestApplication,
  bikeOwnerId: any,
  bikeOwner: any,
  token: string,
) =>
  request(app.getHttpServer())
    .put(`/bike-owners/${bikeOwnerId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(bikeOwner);

export const deleteBikeOwner = (
  app: INestApplication,
  bikeOwnerId: any,
  token: string,
) =>
  request(app.getHttpServer())
    .delete(`/bike-owners/${bikeOwnerId}`)
    .set('Authorization', `Bearer ${token}`);
