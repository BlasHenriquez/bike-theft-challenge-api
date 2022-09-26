import { Injectable } from '@nestjs/common';
import { BikeOwnersService } from './../bike-owners/bike-owners.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PayloadTokenBikeOwner } from './models/token-bike-owner.model';

@Injectable()
export class AuthBikeOwnerService {
  constructor(
    private bikeOwnersService: BikeOwnersService,
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

  async loginBikeOwner(user: PayloadTokenBikeOwner) {
    const { accessToken } = this.jwtToken(user);

    return {
      accessToken,
    };
  }

  jwtToken(user: PayloadTokenBikeOwner) {
    const payload: PayloadTokenBikeOwner = { id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
