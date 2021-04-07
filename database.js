// const { Pool } = require('pg');
import { PostgresStore } from 'bgio-postgres';

const { DATABASE_USER, DATABASE_PASS, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } = process.env;

const databaseUrl = `postgres://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

const database = new PostgresStore(process.env.DATABASE_URL || databaseUrl, {
  ssl: true,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

export { database };
