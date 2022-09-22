import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthBikeOwnerService } from '../auth-bike-owner.service';

@Injectable()
export class LocalBikeOwnerStrategy extends PassportStrategy(
  Strategy,
  'local-bike-owner',
) {
  constructor(private authBikeOwnerService: AuthBikeOwnerService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const bikeOwner = await this.authBikeOwnerService.validateBikeOwner(
      email,
      password,
    );
    if (!bikeOwner) {
      throw new UnauthorizedException('not allow');
    }

    return bikeOwner;
  }
}
