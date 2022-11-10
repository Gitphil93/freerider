// let jwt = require('jsonwebtoken');
// require('dotenv').config();
// let checkToken = (req, res, next) => {
//   let token = req.cookies.token; 
  
// // Verifierar att ingen mixtrat med JWT
//   if (token) {
//      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, decoded) => {
//       console.log(decoded)
//       if (err) {
//         return res.json({
//           success: false,
//           message: 'Token is not valid'
//         });
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     return res.json({
//       success: false,
//       message: 'Authentication token is not supplied'
//     });
//   }
// };

// module.export = {
//     checkToken: checkToken
// }

const jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
  if (!req.cookies.token) {
    console.log("Unauthorized, no token");
    return res.status(401).json({message: "Unauthorized, no token"});
  }
  
  const token = req.cookies.token;

  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  if (!data) {
    console.log("Unauthorized, token not valid");
    res.status(403).json({ message: "Unauthorized, token not valid" });
  }

  req.email = data.email;
  req.token = data.token;
  req.roles = data.roles;

  next();
}

const adminAuthorization = (req, res, next) => {
  if (!req.cookies.token) { 
    console.log("Unauthorized, no token");
    return res.status(401).json({message: "Unauthorized, no token"});
  }
  
  const token = req.cookies.token;

  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  if (!data) {
    console.log("Unauthorized, token not valid");
    res.status(403).json({ message: "Unauthorized, token not valid" });
  }

  if (!data.roles.includes("Admin")) {
    console.log("Unauthorized, not admin");
    res.status(403).json({ message: "Unauthorized, not admin" });
  }

  req.email = data.email;
  req.token = data.token;
  req.roles = data.roles;

  next();
}

const superAdminAuthorization = (req, res, next) => {
  if (!req.cookies.token) {
    console.log("Unauthorized, no token");
    return res.status(401).json({message: "Unauthorized, no token"});
  }
  
  const token = req.cookies.token;

  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  if (!data) {
    console.log("Unauthorized, token not valid");
    return res.status(403).json({ message: "Unauthorized, token not valid" });
  }

  if (!data.roles.includes("SuperAdmin")) {
    console.log("Unauthorized, not super admin");
    return res.status(403).json({ message: "Unauthorized not high enough clearence level" });
  }

  req.email = data.email;
  req.token = data.token;
  req.roles = data.roles;

  next();
}

module.exports = {
  authorization,
  adminAuthorization,
  superAdminAuthorization
}