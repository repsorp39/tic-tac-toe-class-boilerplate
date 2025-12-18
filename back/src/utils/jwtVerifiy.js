const jwt = require('jsonwebtoken');

function jwtVerify(token) {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return null;
    else return decoded;
  });
}

module.exports = jwtVerify;