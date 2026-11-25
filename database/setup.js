require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function setup() {
  const url = new URL(process.env.DATABASE_URL);
  url.pathname = '/postgres';
  const admin = new Client({ connectionString: url.toString() });
  await admin.connect();
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', ['sweety']);
  if (!exists.rows.length) await admin.query('CREATE DATABASE sweety');
  await admin.end();

  const appUrl = new URL(process.env.DATABASE_URL);
  appUrl.pathname = '/sweety';
  const app = new Client({ connectionString: appUrl.toString() });
  await app.connect();
  await app.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  await app.end();
  console.log('Database created and schema applied.');
}

setup().catch(error => {
  console.error(error.message);
  process.exit(1);
});
