const jwt = require("jsonwebtoken");
const HTTPError = require("../helpers/custom-error");
const jwtVerify = require("../utils/jwtVerifiy");

async function authPlayer(req, res, next) {
  try {
    let token = req.headers["authorization"] || req.headers["Authorization"];

    if (!token || !token.startsWith("Bearer ")) {
      throw new HTTPError(401, "Bearer token is required.");
    }

    token = token.split(" ")[1];

    const decodedData = jwtVerify(token);
    if(!decodedData){
      throw new HTTPError(401, "Token invalid or expired.");
    }
    req.playerid = decodedData.id;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authPlayer;
