import { INestApplication } from '@nestjs/common';
import { BikeOwner } from '../../src/bike-owners/entities/bike-owner.entity';
import * as request from 'supertest';

export const loginBikeOwner = async (
  app: INestApplication,
  user: Partial<BikeOwner>,
) => request(app.getHttpServer()).post('/auth/login-bike-owner').send(user);

export const loginPolice = async (
  app: INestApplication,
  user: Partial<BikeOwner>,
) => request(app.getHttpServer()).post('/auth/login-police-officer').send(user);
