import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfiguration from './config/app.configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: ConfigType<typeof appConfiguration> = app.get(
    appConfiguration.KEY,
  );
  const port = appConfig.port;

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
}
bootstrap();
