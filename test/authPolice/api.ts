import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PoliceOfficer } from '../../src/police-officers/entities/police-officer.entity';

export const loginPoliceOfficer = async (
  app: INestApplication,
  user: Partial<PoliceOfficer>,
) => request(app.getHttpServer()).post('/auth-police-officer/login').send(user);
