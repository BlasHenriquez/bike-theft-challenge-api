import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthBikeOwnerGuard extends AuthGuard('local-bike-owner') {}
