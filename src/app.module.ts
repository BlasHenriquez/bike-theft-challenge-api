import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { enviroments } from './enviroments';
import { BikesModule } from './bikes/bikes.module';
import { BikeOwnersModule } from './bike-owners/bike-owners.module';
import { PoliceOfficersModule } from './police-officers/police-officers.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true, //when true, stops validation on the first error, otherwise returns all the errors found. Defaults to true.
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          type: 'postgres',
          host: configService.postgres.host,
          port: configService.postgres.port,
          database: configService.postgres.name,
          username: configService.postgres.user,
          password: configService.postgres.password,
          autoLoadEntities: true,
          keepConnectionAlive: true,
        };
      },
    }),
    BikesModule,
    BikeOwnersModule,
    PoliceOfficersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
