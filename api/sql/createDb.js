const mysql = require('mysql');

require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  insecureAuth: true,
});

db.connect(async (err, connection) => {
  if (err) {
    console.log(err)
    process.exit(1);
  }
  console.log('Connected!');
  db.query(
    `CREATE DATABASE IF NOT EXISTS ${DB_DATABASE}`,
    async (err, result) => {
      if (err) {
        process.exit(1);
      }
      console.log('Database created');
      process.exit(0);
    }
  );
});
