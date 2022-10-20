const express = require('express');

const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

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
  });

  const whitelist = ['http://localhost:3000'];

  app.use(cors({credentials: true, origin: whitelist}));


  // 1. Check for empty data
// 2. Check if user already exists in DB
// 3. Hash password & Register USER
// 4. Assign ROLE to USER
// 5. Get ROLES for USER
// 6. Set accessToken cookie and return data


app.post("/api/createuser", (req, res) => {
    console.log(req.body);
   return res.sendStatus(200);

}
);



app.listen(port, (err) => {
if (err) {
    console.log("error listen to port", err);
} else { 
    console.log("listening to port 4000");
    }
})

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