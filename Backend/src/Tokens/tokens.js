const jwt = require('jsonwebtoken');

function generateAccessToken(email) {
    require('dotenv').config();
    return jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '180000s' });
}

function authenticateToken(req , res  , next ) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  require('dotenv').config();
  jwt.verify(token, process.env.TOKEN_SECRET , (err, user) => {
    if (err) {
      return res.sendStatus(403)
    }
    next()
  })
}

module.exports = { generateAccessToken, authenticateToken };
