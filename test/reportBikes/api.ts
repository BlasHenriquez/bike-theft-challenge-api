import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createBikeReport = (
  app: INestApplication,
  bikeId: any,
  token: string,
  bikeReport: any,
) =>
  request(app.getHttpServer())
    .post(`/bike-reports/bike/${bikeId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(bikeReport);

export const getBikeReports = (app: INestApplication, token: string) =>
  request(app.getHttpServer())
    .get(`/bike-reports`)
    .set('Authorization', `Bearer ${token}`);

export const getBikeReport = (
  app: INestApplication,
  bikeReportId: any,
  token: string,
) =>
  request(app.getHttpServer())
    .get(`/bike-reports/${bikeReportId}`)
    .set('Authorization', `Bearer ${token}`);

export const getBikeReportByOwner = (
  app: INestApplication,
  bikeReportId: any,
  token: string,
) =>
  request(app.getHttpServer())
    .get(`/bike-reports/${bikeReportId}/owner`)
    .set('Authorization', `Bearer ${token}`);

export const updatBikeReport = (
  app: INestApplication,
  bikeReportId: any,
  token: string,
  bikeReport: any,
) =>
  request(app.getHttpServer())
    .put(`/bike-reports/${bikeReportId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(bikeReport);

export const updatBikeReportToResolved = (
  app: INestApplication,
  bikeReportId: any,
  token: string,
) =>
  request(app.getHttpServer())
    .put(`/bike-reports/${bikeReportId}/resolved`)
    .set('Authorization', `Bearer ${token}`);

export const deleteBikeReport = (
  app: INestApplication,
  BikeReportId: any,
  token: string,
) =>
  request(app.getHttpServer())
    .delete(`/bike-reports/${BikeReportId}`)
    .set('Authorization', `Bearer ${token}`);
