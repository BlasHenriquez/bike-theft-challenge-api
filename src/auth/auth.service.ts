import { Injectable } from '@nestjs/common';
import { BikeOwnersService } from './../bike-owners/bike-owners.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PoliceOfficersService } from './../police-officers/police-officers.service';
import { PayloadToken } from './models/token.model';

@Injectable()
export class AuthService {
  constructor(
    private bikeOwnersService: BikeOwnersService,
    private policeOfficersService: PoliceOfficersService,
    private jwtService: JwtService,
  ) {}

  async validateBikeOwner(email: string, password: string) {
    const bikeOwner: {
      password: string;
      id: number;
    } = await this.bikeOwnersService.findBikeOwnerByEmailAndGetPassword(email);

    if (bikeOwner) {
      const isMatch = await bcrypt.compare(password, bikeOwner.password);

      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rta } = bikeOwner;
        return rta;
      }
    }
    return null;
  }

  async validatePoliceOfficer(email: string, password: string) {
    const policeOfficer: {
      password: string;
      id: number;
      role: string;
    } = await this.policeOfficersService.findPoliceByEmailAndGetPassword(email);

    if (policeOfficer) {
      const isMatch = await bcrypt.compare(password, policeOfficer.password);

      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rta } = policeOfficer;
        return rta;
      }
    }
    return null;
  }

  async loginBikeOwner(user: PayloadToken) {
    const { accessToken } = this.jwtToken(user);

    return {
      accessToken,
    };
  }

  async loginPoliceOfficer(user: PayloadToken) {
    const { accessToken } = this.jwtToken(user);

    return {
      accessToken,
    };
  }

  jwtToken(user: PayloadToken) {
    const payload: PayloadToken = { role: user.role, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
