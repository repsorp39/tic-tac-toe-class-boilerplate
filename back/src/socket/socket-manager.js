const GameController = require("../controllers/game.controller");

async function socketManager(socket) {
  //when a player connect to the website
  console.log(`Player with the id ${socket.playerid} is connected!`);
  const playerId = socket.playerid;
  await GameController.handlePlayerConnexion(playerId);

  //when an user request a game with a player
  socket.on("game-request", (players) => {
    socket.broadcast.emit("can-accept-request", players);
  });

  //when the requester invitation is accepted by the other player
  socket.on("request-accepted", async (players) => {
    await GameController.handleGameHandshake(players);
    socket.broadcast.emit("handshake-done", players);
  });

  //after defining the max game numbers and the symbol of each players
  socket.on("game-begin", (payload) => {
    socket.join(
      `${payload.players?.fromPlayer?.id}-${payload.players?.toPlayer?.id}`
    );
    console.log(payload);

    socket.broadcast.emit("game-begin", payload);
  });

  socket?.on("ready", ({ fromPlayer, toPlayer }) => {
    socket.join(`${fromPlayer.id}-${toPlayer.id}`);
  });

  socket?.on("board-update", (payload) => {
    const socketRoom = Array.from(socket.rooms).at(-1);
    console.log(payload);
    socket.to(socketRoom).emit("board-update", payload);
  });

  socket?.on("pursuit-party", () => {
    const socketRoom = Array.from(socket.rooms).at(-1);
    socket.to(socketRoom).emit("pursuit-party");
  });

  //when a user left
  socket.on("disconnect", () => {
    console.log(`Player with the id ${socket.playerid} is disconnected!`);
    GameController.handlePlayerDisconnection(playerId);
  });

  socket.on("connect_error", (err) => console.log(err));
}

module.exports = socketManager;
