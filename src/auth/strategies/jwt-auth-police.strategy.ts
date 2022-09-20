import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthPoliceTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-auth-police-guard',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const policeOfficer = await this.authService.validatePoliceOfficer(
      email,
      password,
    );
    if (!policeOfficer) {
      throw new UnauthorizedException('not allow');
    }

    return policeOfficer;
  }
}
