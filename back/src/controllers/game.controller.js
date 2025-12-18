const Player = require("../db/models/Player");
const Game = require("../db/models/Game");

class GameController {
  async handlePlayerConnexion(playerid) {
    await Player.update({ is_online: true }, { where: { id: playerid } });
  }

  async handlePlayerDisconnection(playerid) {
    await Player.update({ is_online: false }, { where: { id: playerid } });
  }

  async handleGameHandshake({ fromPlayer, toPlayer }) {
    await Game.create({
      player_1: fromPlayer.id,
      player_2: toPlayer.id,
      status: "PENDING",
    });
  }

  handleGameParty() {}

  handleGameClosed() {}
}

module.exports = new GameController();
