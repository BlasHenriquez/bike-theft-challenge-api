import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../../config';
import { PayloadTokenBikeOwner } from '../models/token-bike-owner.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-bike-owner') {
  constructor(
    @Inject(config.KEY)
    configService: ConfigType<typeof config>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.jwtSecret,
    });
  }

  validate(payload: PayloadTokenBikeOwner) {
    return payload;
  }
}
