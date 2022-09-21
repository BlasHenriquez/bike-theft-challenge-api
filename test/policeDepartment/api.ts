import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createPoliceDepartment = (
  app: INestApplication,
  policeDepartments: any,
) =>
  request(app.getHttpServer())
    .post(`/police-departments`)
    .send(policeDepartments);

export const getPoliceDepartments = (app: INestApplication) =>
  request(app.getHttpServer()).get(`/police-departments`);

export const getPoliceDepartment = (
  app: INestApplication,
  policeDepartmentId: any,
) =>
  request(app.getHttpServer()).get(`/police-departments/${policeDepartmentId}`);

export const updatPoliceDepartment = (
  app: INestApplication,
  policeDepartmentId: any,
  policeDepartments: any,
) =>
  request(app.getHttpServer())
    .put(`/police-departments/${policeDepartmentId}`)
    .send(policeDepartments);

export const deletPoliceDepartment = (
  app: INestApplication,
  policeDepartmentId: any,
) =>
  request(app.getHttpServer()).delete(
    `/police-departments/${policeDepartmentId}`,
  );
