import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createPoliceOfficer = (
  app: INestApplication,
  policeOfficer: any,
) => request(app.getHttpServer()).post(`/police-officers`).send(policeOfficer);

export const getPoliceOfficers = (app: INestApplication) =>
  request(app.getHttpServer()).get(`/police-officers`);

export const getPoliceOfficer = (app: INestApplication, policeOfficerId: any) =>
  request(app.getHttpServer()).get(`/police-officers/${policeOfficerId}`);

export const updatPoliceOfficer = (
  app: INestApplication,
  policeOfficerId: any,
  policeOfficer: any,
) =>
  request(app.getHttpServer())
    .put(`/police-officers/${policeOfficerId}`)
    .send(policeOfficer);

export const deletPoliceOfficer = (
  app: INestApplication,
  policeOfficerId: any,
) => request(app.getHttpServer()).delete(`/police-officers/${policeOfficerId}`);
