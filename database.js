const { Pool } = require('pg');

const { DATABASE_USER, DATABASE_PASS, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } = process.env;

const databaseUrl = `postgres://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

const database = new Pool({
  connectionString: process.env.DATABASE_URL || databaseUrl,
});

database.connect(err => {
  if (err) {
    console.error(`Error connecting to database:\n  ${err}`);
  } else {
    console.log(`Successfully connected to database!`);
  }
});

export { database };
