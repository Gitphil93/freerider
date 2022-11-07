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

// CREATE ROLES
//hårdkoda in hashade lösenord.
const pwdHashed = bcrypt.hashSync("password", 10)

db.connect(async (err, connection) => {
    console.log('RUNNING CREATE MOCK DATA SCRIPT');
    
    var userRoles = 'INSERT INTO Roles(roleId, rolename) VALUES(1000, "User"); INSERT INTO Roles(roleId, rolename) VALUES(2000, "Admin"); INSERT INTO Roles(roleId, rolename) VALUES(3000, "SuperAdmin");'
    
    //Detta är som att klicka på blixten i mySql, med detta kan vi skapa våra roller
    db.query(userRoles, async (err) => {
        if (err) {
          process.exit(1);
        }
        console.log('ROLES CREATED!');
    })

    var Users = `INSERT INTO Users (UserId, Email, Password) VALUES (null, "user@email.com", "${pwdHashed}"); 
    INSERT INTO Users (UserId, Email, Password) VALUES (null, "admin@email.com", "${pwdHashed}");
    INSERT INTO Users (UserId, Email, Password) VALUES (null, "superadmin@email.com", "${pwdHashed}");`

    db.query(Users, async (err) => {
        if (err) {
          process.exit(1);
        }
        console.log('USERS CREATED!');
    })


    //Här har vi användare id 1 som vanlig user på 1000
    //admin id 2 på 1000 & 2000 (så att man kan vara vanlig user + admin)
    //Big boss / super admin id 3 på 1000, 2000 & 3000 så att man kan vara user, admin och superadmin / big boss. 
    var UsersWithRoles = `INSERT INTO UsersWithRoles (UserId, RoleId) VALUES (1, 1000);
    INSERT INTO UsersWithRoles (UserId, RoleId) VALUES (2, 1000);
    INSERT INTO UsersWithRoles (UserId, RoleId) VALUES (2, 2000);
    INSERT INTO UsersWithRoles (UserId, RoleId) VALUES (3, 1000);
    INSERT INTO UsersWithRoles (UserId, RoleId) VALUES (3, 2000);
    INSERT INTO UsersWithRoles (UserId, RoleId) VALUES (3, 3000);`

})



