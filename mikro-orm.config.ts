import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const config: Options = {
  driver: PostgreSqlDriver,

  dbName: process.env.DATABASE_NAME || 'appointment_db',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,

  entitiesTs: ['./src/**/*.entity.ts'],
  entities: ['./dist/**/*.entity.js'],

  debug: true,
};

export default config;