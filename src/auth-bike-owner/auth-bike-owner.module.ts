import { Module } from '@nestjs/common';
import { AuthBikeOwnerService } from './auth-bike-owner.service';
import { AuthBikeOwnerController } from './auth-bike-owner.controller';
import { BikeOwnersModule } from './../bike-owners/bike-owners.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from './../config';
import { ConfigType } from '@nestjs/config';
import { LocalBikeOwnerStrategy } from './strategies/local-bike-owner.strategy';
import { JwtAuthBikeOwnerGuard } from './guards/jwt-auth-bike-owner.guards';
import { JwtStrategy } from './strategies/jwt-bike-owner.strategy';

@Module({
  imports: [
    BikeOwnersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwt.jwtSecret,
          signOptions: {
            expiresIn: configService.jwt.accessTokenExpiration,
          },
        };
      },
    }),
  ],
  controllers: [AuthBikeOwnerController],
  providers: [
    AuthBikeOwnerService,
    JwtStrategy,
    LocalBikeOwnerStrategy,
    JwtAuthBikeOwnerGuard,
  ],
})
export class AuthBikeOwnerModule {}
