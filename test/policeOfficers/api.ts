import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createPoliceOfficer = (
  app: INestApplication,
  policeOfficer: any,
  token: string,
) =>
  request(app.getHttpServer())
    .post(`/police-officers`)
    .set('Authorization', `Bearer ${token}`)
    .send(policeOfficer);

export const getPoliceOfficers = (app: INestApplication, token: string) =>
  request(app.getHttpServer())
    .get(`/police-officers`)
    .set('Authorization', `Bearer ${token}`);

export const getPoliceOfficer = (
  app: INestApplication,
  policeOfficerId: any,
  token: string,
) =>
  request(app.getHttpServer())
    .get(`/police-officers/${policeOfficerId}`)
    .set('Authorization', `Bearer ${token}`);

export const updatPoliceOfficer = (
  app: INestApplication,
  policeOfficerId: any,
  policeOfficer: any,
  token: string,
) =>
  request(app.getHttpServer())
    .put(`/police-officers/${policeOfficerId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(policeOfficer);

export const deletPoliceOfficer = (
  app: INestApplication,
  policeOfficerId: any,
  token: string,
) =>
  request(app.getHttpServer())
    .delete(`/police-officers/${policeOfficerId}`)
    .set('Authorization', `Bearer ${token}`);
