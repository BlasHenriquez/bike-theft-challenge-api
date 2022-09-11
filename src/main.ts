import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const enableCors = configService.get<boolean>('ENABLE_CORS');
  const port = configService.get<number>('DATABASE_PORT');

  if (enableCors) {
    app.enableCors();
  }
  await app.listen(port);
}
bootstrap();
