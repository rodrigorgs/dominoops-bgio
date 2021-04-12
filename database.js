// const { Pool } = require('pg');
import { PostgresStore } from 'bgio-postgres';
import { Sequelize } from 'sequelize';

const { DATABASE_USER, DATABASE_PASS, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } = process.env;

let databaseUrl = undefined;
if (process.env.DATABASE_URL) {
  databaseUrl = process.env.DATABASE_URL;
} else if (DATABASE_HOST) {
  databaseUrl = `postgres://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
} else {
  databaseUrl = `postgres://${process.env.USER}:@localhost/`
}

const sequelizeOptions = {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  }
};
const postgresStoreOptions = {
  ssl: true,
  ...sequelizeOptions
};

export async function connectToDatabase() {
  const sequelize = new Sequelize(databaseUrl, sequelizeOptions);

  console.log(`Will try to connect to database at ${databaseUrl}`);
  return sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
    return sequelize.close()
      .then(() => {
        console.log('will create PostgresStore');
        return Promise.resolve(new PostgresStore(databaseUrl, postgresStoreOptions));
      });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    console.error('Will continue without using the database.');
    return Promise.resolve(undefined);
  });
}
