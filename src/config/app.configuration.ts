import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  enableCors: process.env.ENABLE_CORS === 'true',
  appUrl: process.env.APP_URL,
}));
