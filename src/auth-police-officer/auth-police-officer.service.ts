import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PoliceOfficersService } from './../police-officers/police-officers.service';
import { PayloadTokenPolice } from './models/token-Police.model';

@Injectable()
export class AuthPoliceOfficerService {
  constructor(
    private policeOfficersService: PoliceOfficersService,
    private jwtService: JwtService,
  ) {}
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

  async loginPoliceOfficer(user: PayloadTokenPolice) {
    const { accessToken } = this.jwtToken(user);

    return {
      accessToken,
      user,
    };
  }

  jwtToken(user: PayloadTokenPolice) {
    const payload: PayloadTokenPolice = { role: user.role, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
