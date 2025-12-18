const HTTPError = require("../helpers/custom-error");
const jwtVerify = require("../utils/jwtVerifiy");

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;
  const payload = jwtVerify(token);
  if (payload) {
    socket.playerid = payload.id;
    next();
  } else next(new HTTPError(401, "Not allowed to access here!"));
};

module.exports = socketAuth;
