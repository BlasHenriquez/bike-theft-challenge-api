import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../../config';
import { PayloadTokenPolice } from '../models/token-Police.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-police') {
  constructor(
    @Inject(config.KEY)
    configService: ConfigType<typeof config>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.jwtPoliceSecret,
    });
  }

  validate(payload: PayloadTokenPolice) {
    return payload;
  }
}
