const jwt = require("jsonwebtoken");
const HTTPError = require("../helpers/custom-error");

async function authPlayer(req, res, next) {
  try {
    let token = req.headers["authorization"] || req.headers["Authorization"];

    if (!token || !token.startsWith("Bearer ")) {
      throw new HTTPError(401, "Bearer token is required.");
    }

    token = token.split(" ")[1];

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) throw new HTTPError(403, "Invalid or expired token");
        else return decoded;
      },
    );

    req.playerid = decodedData.id;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authPlayer;
