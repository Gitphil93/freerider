const express = require('express');

const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const addMinutes = require('./helpers/addMinutes');

app.use(express.json());

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;


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



//Denna funktionen gör att vi kan logga in när användare är reggat. 
app.post("/api/login", async (req, res) => {
    console.log(req.body);
    //1. check for empty data
    const email = req.body.email;
    const password = req.body.password;

    //Skapa Admin, lägg in rollerna i cookien


    console.log(email, password)
    try {
        let sql = "SELECT * FROM Users WHERE email=?";  //Blockar SQL injection / hämtar endast vald användare med email
        let query = mysql.format(sql, [email]); 
        db.query(query, //Hämta all info från användare med våran email
        (err, result) => {
            if (err) {
                res.status(404).json(err)
                console.log("error getting user from db", err)
                return
            } else {
                let token = jwt.sign({  //Här skapar vi JWT token
                    email: email
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
                .status(200).json(result) //result från ovan skickas till frontend
                console.log("Logged in"); // här skickar vi med cookie/JWT token! raden ovan
            }
        })

    } catch(err){
        console.log("error", err)
    }
});

//denna funktionen gör att vi kan skapa användare för att sen logga in. 
app.post("/api/createuser", async (req, res) => {
    console.log(req.body);
    //1. check for empty data
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password) 
    if (!email ||!password) {
       return res.sendStatus(400)
    }
    
    new Promise ((resolve, reject)=> {
        db.query(`SELECT * FROM Users WHERE email="${email}"`, //Hämta all info från användare med våran email
    (err, result) => {
        if (err) {
            reject.status(404).json(err)
            console.log("error getting user from db", err)
            return
        } else {
            res.status(200).json(result[0]) //result från ovan skickas till frontend

            console.log("Logged in");
        }
    })
    }
    
    
    );

    try {
      const hashedPassword = await bcrypt.hash(password, 10)
        db.query(`INSERT INTO Users (email, password) VALUES ("${email}", "${hashedPassword}")`,
            (err, result) => {
                if (err) {
                    res.sendStatus(404)
                    return
                }
                res.sendStatus(200)
                console.log("created user");
            })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(404)
    }
});



app.listen(port, (err) => {
    if (err) {
        console.log("error listen to port", err);
    } else {
        console.log("listening to port 4000");
    }
})


//Test bara denna gör ingenting just nu
app.get('/api/test', async (req, res) => {
    return res.status(200).json({
        'test': 'testar',
        'recept': [{
            name: 'bulle',
            vetInte: '1234'
        }
        ]
    })
})