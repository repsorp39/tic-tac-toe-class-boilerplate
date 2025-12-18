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
      `${payload.players.fromPlayer.id}-${payload.players.fromPlayer.id}`
    );
    socket.broadcast.emit("game-begin", payload);
  });

  //when a user left
  socket.on("disconnect", () => {
    console.log(`Player with the id ${socket.playerid} is disconnected!`);
    GameController.handlePlayerDisconnection(playerId);
  });

  socket.on("connect_error", (err) => console.log(err));
}

module.exports = socketManager;
