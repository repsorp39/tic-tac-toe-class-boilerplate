const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { createServer } = require("http");

const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/error-handler");
const router = require("./routes/index");

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//routes
app.use("/", router);

app.use(notFoundHandler);
//error handling
app.use(errorHandler);

module.exports = createServer(app);
