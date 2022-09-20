import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BikeOwnersModule } from './../bike-owners/bike-owners.module';
import { PoliceOfficersModule } from './../police-officers/police-officers.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from './../config';
import { ConfigType } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthPoliceTokenStrategy } from './strategies/jwt-auth-police.strategy';

@Module({
  imports: [
    BikeOwnersModule,
    PoliceOfficersModule,
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
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAuthPoliceTokenStrategy],
})
export class AuthModule {}
