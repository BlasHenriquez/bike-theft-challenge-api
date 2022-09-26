import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createPoliceDepartment = (
  app: INestApplication,
  policeDepartments: any,
  token: string,
) =>
  request(app.getHttpServer())
    .post(`/police-departments`)
    .set('Authorization', `Bearer ${token}`)
    .send(policeDepartments);

export const getPoliceDepartments = (app: INestApplication, token: string) =>
  request(app.getHttpServer())
    .get(`/police-departments`)
    .set('Authorization', `Bearer ${token}`);

export const getPoliceDepartment = (
  app: INestApplication,
  policeDepartmentId: any,
  token: string,
) =>
  request(app.getHttpServer())
    .get(`/police-departments/${policeDepartmentId}`)
    .set('Authorization', `Bearer ${token}`);

export const updatPoliceDepartment = (
  app: INestApplication,
  policeDepartmentId: any,
  policeDepartments: any,
  token: string,
) =>
  request(app.getHttpServer())
    .put(`/police-departments/${policeDepartmentId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(policeDepartments);

export const deletPoliceDepartment = (
  app: INestApplication,
  policeDepartmentId: any,
  token: string,
) =>
  request(app.getHttpServer())
    .delete(`/police-departments/${policeDepartmentId}`)
    .set('Authorization', `Bearer ${token}`);
