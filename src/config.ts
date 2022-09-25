import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    env: { production: process.env.NODE_ENV === 'production' },
    database: {
      port: process.env.PORT,
      url: process.env.DATABASE_URL,
    },
    postgres: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      name: process.env.POSTGRES_NAME,
      password: process.env.POSTGRES_PASSWORD,
      user: process.env.POSTGRES_USER,
      sync: process.env.DATABASE_SYNC === 'true',
    },
    jwt: {
      jwtSecret: process.env.JWT_SECRET,
      jwtPoliceSecret: process.env.JWT_POLICE_SECRET,
      accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
    },
  };
});
