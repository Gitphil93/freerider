let jwt = require('jsonwebtoken');
require('dotenv').config();
let checkToken = (req, res, next) => {
  let token = req.cookies.token; 
  
// Verifierar att ingen mixtrat med JWT
  if (token) {
     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, decoded) => {
      console.log(decoded)
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Authentication token is not supplied'
    });
  }
};

module.export = {
    checkToken: checkToken
}