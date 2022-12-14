import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

const HTTP_STATUS_TOKEN_EXPIRED = 498;

@Injectable()
export class JwtAuthBikeOwnerGuard extends AuthGuard('jwt-bike-owner') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info instanceof jwt.TokenExpiredError) {
      throw new HttpException('Token expired', HTTP_STATUS_TOKEN_EXPIRED);
    }

    if (err || !user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized user',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
