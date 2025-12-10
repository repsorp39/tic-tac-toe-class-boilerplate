const HTTPError = require("../helpers/custom-error");
const logEvents = require("../utils/log-event");

async function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;
  const message = err.message;
  console.error(err);
  logEvents(err);
  res.status(status).json({ message });
}

async function notFoundHandler(req, res, next) {
  throw new HTTPError(404, "Route does not exist.");
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
