import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthPoliceOfficerService } from '../auth-police-officer.service';

@Injectable()
export class LocalPoliceStrategy extends PassportStrategy(
  Strategy,
  'local-police',
) {
  constructor(private authPoliceOfficerService: AuthPoliceOfficerService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const bikeOwner = await this.authPoliceOfficerService.validatePoliceOfficer(
      email,
      password,
    );
    if (!bikeOwner) {
      throw new UnauthorizedException('not allow');
    }

    return bikeOwner;
  }
}
