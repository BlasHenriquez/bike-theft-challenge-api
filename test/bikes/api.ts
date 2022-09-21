import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createBike = (
  app: INestApplication,
  bikeOwnerId: any,
  bike: any,
) =>
  request(app.getHttpServer())
    .post(`/bikes/bike-owner/${bikeOwnerId}`)
    .send(bike);

export const getBikes = (app: INestApplication) =>
  request(app.getHttpServer()).get(`/bikes`);

export const getBike = (app: INestApplication, bikeId: any) =>
  request(app.getHttpServer()).get(`/bikes/${bikeId}`);

export const updateBike = (app: INestApplication, bikeId: any, bike: any) =>
  request(app.getHttpServer()).put(`/bikes/${bikeId}`).send(bike);

export const deleteBike = (app: INestApplication, bikeId: any) =>
  request(app.getHttpServer()).delete(`/bikes/${bikeId}`);
