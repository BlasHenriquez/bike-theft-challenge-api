import { Module } from '@nestjs/common';
import { AuthPoliceOfficerService } from './auth-police-officer.service';
import { AuthPoliceOfficerController } from './auth-police-officer.controller';
import config from './../config';
import { ConfigType } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PoliceOfficersModule } from './../police-officers/police-officers.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalPoliceStrategy } from './strategies/local-police.strategy';
import { JwtAuthPoliceGuard } from './guards/jwt-auth-police.guards';
import { JwtStrategy } from './strategies/jwt-police.strategy';

@Module({
  imports: [
    PoliceOfficersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwt.jwtPoliceSecret,
          signOptions: {
            expiresIn: configService.jwt.accessTokenExpiration,
          },
        };
      },
    }),
  ],
  controllers: [AuthPoliceOfficerController],
  providers: [
    AuthPoliceOfficerService,
    JwtStrategy,
    LocalPoliceStrategy,
    JwtAuthPoliceGuard,
  ],
})
export class AuthPoliceOfficerModule {}
