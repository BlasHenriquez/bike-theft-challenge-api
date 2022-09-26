import { INestApplication } from '@nestjs/common';
import { BikeOwner } from '../../src/bike-owners/entities/bike-owner.entity';
import * as request from 'supertest';

export const loginBikeOwner = async (
  app: INestApplication,
  user: Partial<BikeOwner>,
) => request(app.getHttpServer()).post('/auth-bike-owner/login').send(user);
