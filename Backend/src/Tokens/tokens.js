const jwt = require('jsonwebtoken');

function generateAccessToken(email) {
    require('dotenv').config();
    return jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '180000s' });
}

function authenticateToken(req , res  , next ) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, '6795844b56e775086c520f238c9a6c569abc620faae59aeccb7447b2a8de323d5e854e467556b8212d0552e78601b9d4998187e51fef80880053b11615bb4170', (err, user) => {
    if (err) return res.sendStatus(403)
    req.body.user = user
    next()
  })
}

module.exports = { generateAccessToken, authenticateToken };
