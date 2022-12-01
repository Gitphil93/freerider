const express = require('express');
const { authorization, adminAuthorization, superAdminAuthorization } = require('./middleware/jwtvalidator');

const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const addMinutes = require('./helpers/addMinutes');



const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;
const SECRET = process.env.ACCESS_TOKEN_SECRET;


const port = process.env.PORT;

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE,
    multipleStatements: false //blockar hackers från att ställa mer än 1 fråga. Tex kan ej fråga efter en användare och all info om den. 
});

const whitelist = ['http://localhost:3000'];


//middleware
app.use(cors({ credentials: true, origin: whitelist }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));



// 2. Check if user already exists in DB
// 3. Hash password & Register USER
// 4. Assign ROLE to USER
// 5. Get ROLES for USER
// 6. Set accessToken cookie and return data

//admin
// app.post("/api/admin", async (req, res) => {
//     const adminAccount = {
//         role: "admin",
//         email: "admin1337@gmail.com",
//         password: await hashPassword("Admin1")


//     }
// })


//Skyddar routes, man kan inte logga in via URL'en. Hämtas från Frontend 'loggedIn'

app.get('/api/loggedIn', (request, response) => {
    console.log('----/API/LOGGEDIN-----');
    const token = request.cookies.token;

    let resObj = {
        loggedIn: false
    }

    try {
        const data = jwt.verify(token, SECRET);

        console.log(data);

        if (data) {
            resObj.loggedIn = true;
            resObj.data = data; //allt som vi har i token skickas tillbaka till frontend 
        }
    } catch (error) {
        resObj.errorMessage = 'Token expired';
    }

    response.json(resObj);
});


//Denna funktionen gör att vi kan logga in när användare är reggat. 
app.post("/api/login", async (req, res) => {
    console.log(req.body);
    //1. check for empty data
    const email = req.body.email;
    const password = req.body.password;

    console.log(email)
    try {
        //Blockar SQL injection / hämtar endast vald användare med email
        let sql = "SELECT * FROM Users WHERE email=?"
        let query = mysql.format(sql, [email]);
        console.log(query);
        db.query(query, //Hämta all info från användare med våran email
            (err, result) => {
                if (err) {
                    res.status(404).json(err)
                    console.log("error getting user from db", err)
                    return
                } else { 
                    if (result.length > 0) {
                            const compare = bcrypt.compareSync(password, result[0].password);
                            console.log(compare);
                            if (!compare) {
                                res.status(404).json ({message: "fel lösenord"})
                                console.log("compared")
                                return
                            }

                        let sql2 = "SELECT rolename FROM UsersWithRoles INNER JOIN Roles ON Roles.roleId=UsersWithRoles.roleId WHERE userId=?"
                        let query2 = mysql.format(sql2, [result[0].userId])
                        db.query(query2, (err2, result2) => {
                            console.log(result2)
                            if (err2) {
                                res.status(404).json(err2)
                                console.log("error getting user roles from db", err2)
                                return
                            }
                            //Hämtar den usern / rollen som du loggar in med
                            let roles = [];
                            result2.forEach(role => {
                                roles.push(role.rolename)
                            });

                            let token = jwt.sign({  //Här skapar vi JWT token
                                email: email,
                                roles: roles //spottar ut arrayen roles ovan med roller man loggar in med
                            },
                                process.env.ACCESS_TOKEN_SECRET,
                                {
                                    expiresIn: '10m'
                                }

                            );


                            return res.cookie('token', token, {
                                httpOnly: true,
                                secure: true,
                                sameSite: 'strict',
                                expires: addMinutes(10)
                            })
                                .status(200).json({
                                    email: result[0].email,  //Detta gör att man inte skickar med lösenord till konsolen när man loggar in
                                    roles: roles,

                                }) //result från ovan skickas till frontend
                            console.log("Logged in"); // här skickar vi med cookie/JWT token! raden ovan
                        })
                    } else {
                        res.status(400).json({ message: 'Användaren hittades inte' })
                    }
                }
            })

    } catch (err) {
        console.log("error", err)
    }
});

//Ta bort users i superAdmin mode
app.post('/api/deleteUser', superAdminAuthorization, async (req, res) => {
    let userId = req.body.userId; 
    console.log(userId);
    let sql = 'DELETE FROM UsersWithRoles WHERE userId=?'  // tar bort userns roll 
    const query = mysql.format(sql, [userId])

    db.query(query, (err, result) => {
        if (err) {
            res.status(404).json(err)
            console.log("Error, cant delete users role", err)
            return;
        } else {
            let sql2 = 'DELETE FROM Users WHERE userId=?'  // tar bort usern helt
            const query2 = mysql.format(sql2, [userId])

            db.query(query2, (err2, result2) => {
                if (err2) {
                    res.status(404).json(err2)
                    console.log("Error, cant delete users role", err2)
                    return;
                } else { res.status(200).json({message: 'DELETED USER'})

                }
            })
        }
    })
})



//denna funktionen gör att vi kan skapa användare för att sen logga in. 
app.post("/api/createuser", async (req, res) => {
    
    try {
        console.log(req.body);
    //1. check for empty data
    const email = req.body.email;
    const password = req.body.password;


    if (!email || !password) {
        return res.sendStatus(400)
    }  

   const myUser = await new Promise((resolve, reject) => {
        let sql = `SELECT * FROM Users WHERE email=?`
        let query = mysql.format(sql, [email]);
        db.query(query, //Hämta all info från användare med våran email
            (err, result) => {
                if (err) {
                    console.log("error getting user from db", err)
                   return reject(err)
                   
                    
                } else {
                                 
                    return resolve(result[0]) 
                    //result från ovan skickas till frontend

                
                }
            })
    }


    );
       console.log(myUser)
        if (myUser?.email) {
            
            return res.sendStatus(400);
        }
        const hashedPassword = await bcrypt.hash(password, 10)
      const userId = await new Promise((resolve, reject) => {
            const sql = `INSERT INTO Users (email, password) VALUES (?, ?)`;
            const query = mysql.format(sql, [email, hashedPassword]);
            db.query(query,
            (err, result) => {
                if (err) {
                    
                    return reject(err)
                }
                console.log("created user");
               return resolve(result.insertId)
                
            })

        })

        await new Promise((resolve, reject) => {
            const sql = 'INSERT INTO UsersWithRoles (userId, roleId) VALUES (?, ?)';
            const query = mysql.format(sql, [userId, 1000]);
            db.query(query, (err, result) => {
              if (err) {
                return reject(err);
              }
              return resolve(result);
            });
          });

          /* await new Promise((resolve, reject) => {
            const sql = 'INSERT INTO UsersWithRoles (userId, roleId) VALUES (?, ?)';
            const query = mysql.format(sql, [userId, 2000]);
            db.query(query, (err, result) => {
              if (err) {
                return reject(err);
              }
              return resolve(result);
            });
          });
          await new Promise((resolve, reject) => {
            const sql = 'INSERT INTO UsersWithRoles (userId, roleId) VALUES (?, ?)';
            const query = mysql.format(sql, [userId, 3000]);
            db.query(query, (err, result) => {
              if (err) {
                return reject(err);
              }
              return resolve(result);
            });
          }); */
        return res.sendStatus(200);
        
    } catch (err) {
        console.log(err)
        res.sendStatus(404)
    }
});

app.get('/api/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'logged out' });
    res.end();
})



app.listen(port, (err) => {
    if (err) {
        console.log("error listen to port", err);
    } else {
        console.log("listening to port 4000");
    }
})





//hämta alla användare superadmin

app.get('/api/getAllUsers', superAdminAuthorization, async (req, res) => {
    let query = 'SELECT * FROM Users'
    db.query(query, async (err, result) => {
        if (err) {
            console.log(err);
            return
        }
        console.log('ALL USERS');
        res.status(200).json(result);
    })
})