import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createBike = (
  app: INestApplication,
  bikeOwnerId: any,
  bike: any,
  token: string,
) =>
  request(app.getHttpServer())
    .post(`/bikes/bike-owner/${bikeOwnerId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(bike);

export const getBikes = (app: INestApplication, token: string) =>
  request(app.getHttpServer())
    .get(`/bikes`)
    .set('Authorization', `Bearer ${token}`);

export const getSearcherBikes = (
  app: INestApplication,
  token: string,
  license?: string,
  description?: string,
) =>
  request(app.getHttpServer())
    .get(`/bikes/searcher?license=${license}&description=${description}`)
    .set('Authorization', `Bearer ${token}`);

export const getBike = (app: INestApplication, bikeId: any) =>
  request(app.getHttpServer()).get(`/bikes/${bikeId}`);

export const updateBike = (
  app: INestApplication,
  bikeId: any,
  bike: any,
  token: string,
) =>
  request(app.getHttpServer())
    .put(`/bikes/${bikeId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(bike);

export const deleteBike = (app: INestApplication, bikeId: any, token: string) =>
  request(app.getHttpServer())
    .delete(`/bikes/${bikeId}`)
    .set('Authorization', `Bearer ${token}`);
