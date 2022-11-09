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
  database: DB_DATABASE,
  port: DB_PORT,
  multipleStatements: true
});

// CREATE TABLES

db.connect(async (err, connection) => {
  console.log('RUNNING CREATE TABLE SCRIPT');

  let dropAllTables = `DROP TABLE IF EXISTS UsersWithRoles; DROP TABLE IF EXISTS Roles; DROP TABLE IF EXISTS Users;`;

  let createUsersTable = `CREATE TABLE Users (
    userId int NOT NULL AUTO_INCREMENT, 
    email varchar(45) NOT NULL, 
    password varchar(100) NOT NULL, 
    PRIMARY KEY (userId)) 
    ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `;
  let createRolesTable = `CREATE TABLE Roles (
    roleId int NOT NULL AUTO_INCREMENT,
    rolename varchar(45) NOT NULL,
    PRIMARY KEY (roleId)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

  let createUsersWithRoleTable = `CREATE TABLE UsersWithRoles (
    userId int NOT NULL,
    roleId int NOT NULL,
    CONSTRAINT FK_Role FOREIGN KEY (roleId) REFERENCES Roles(roleId),
    CONSTRAINT FK_User FOREIGN KEY (userId) REFERENCES Users(userId)
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

  db.query(dropAllTables, async (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log('ALL TABLES DROPPED!');

    db.query(createUsersTable, async (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log('TABLE CREATED!');
      db.query(createRolesTable, async (err) => {
        if (err) {
          console.log(err);
          process.exit(1);
        }
        console.log('TABLE CREATED!');
        db.query(createUsersWithRoleTable, async (err) => {
          if (err) {
            console.log(err);
            process.exit(1);
          }
          console.log('TABLE CREATED!');
          process.exit(0);
        });
      });
    });
  });
});
