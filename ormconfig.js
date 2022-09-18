module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities: ['dist/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  seeds:
    process.env.NODE_ENV === 'test'
      ? ['db/seeds/test/*seeds.ts']
      : ['dist/db/seeds/*seeds.js'],
      factories:
      process.env.NODE_ENV === 'test'
        ? ['db/factories/*.ts']
        : ['dist/db/factories/*.js'],
  cli: {
    migrationsDir: 'db/migrations',
  },
  ssl: false,
};
