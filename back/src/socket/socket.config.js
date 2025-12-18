const { Server } = require("socket.io");
const socketManager = require("./socket-manager");
const socketAuth = require("../middlewares/socket-auth");

const initSocket = (app) => {
  const io = new Server(app, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "HEAD", "OPTIONS", "PUT"],
    },
  });

  io.use(socketAuth);
  io.on("connection", socketManager);
};
module.exports = initSocket;
