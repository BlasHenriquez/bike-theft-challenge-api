import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtAuthPoliceGuard extends AuthGuard(
  'jwt-auth-police-guard',
) {}
