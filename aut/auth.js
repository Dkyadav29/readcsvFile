const jwt = require("jsonwebtoken");
const cookie = require('cookies')
 

const secretKey = "jfksdfjdshfjksdhfjksdhfkjsdhfjkdj";
// Create JWT token
const auth = function authenticateToken(req, res, next) {
    // const token = req.header('Authorization');
    
    const token = req.cookie.token;
    if (!token) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ msg: 'Forbidden' });
      }
  
      req.user = user;
      next();
    });
  }


  module.exports ={auth}