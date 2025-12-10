const Player = require("../db/models/Player");
const Game = require("../db/models/Game");
const { Op } = require("sequelize");

class PlayerController {
  async getPlayer(req, res, next) {
    try {
      const player = await Player.findByPk(req.playerid, {
        raw: true,
        attributes: ["id", "email", "pseudo", "createdAt"],
      });
      return res.json({ player });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const playedGames = await Game.count({
        where: {
          [Op.or]: [{ player_1: req.playerid }, { player_2: req.playerid }],
        },
      });

      const wonGames = await Game.count({
        where: {
          winner_id: req.playerid,
        },
        raw: true,
      });

      const lostGames = await Game.count({
        where: {
          [Op.or]: [{ player_1: req.playerid }, { player_2: req.playerid }],
          winner_id: { [Op.ne]: req.playerid },
        },
        raw: true,
      });

      const responses = {
        win: wonGames,
        lost: lostGames,
        played: playedGames,
      };

      res.json(responses);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    const state = req.params.state;

    try {
      let results = null;

      switch (state) {
        case "played":
          results = await Game.findAll({
            where: {
              [Op.or]: [{ player_1: req.playerid }, { player_2: req.playerid }],
            },
            include: [
              { model: Player, as: "player1" },
              { model: Player, as: "player2" },
            ],
            raw: true,
          });
          break;
        case "win":
          results = await Game.findAll({
            where: {
              [Op.or]: [{ player_1: req.playerid }, { player_2: req.playerid }],
              winner_id: req.playerid,
              status: "FINISHED",
            },
            include: [
              { model: Player, as: "player1" },
              { model: Player, as: "player2" },
            ],
            raw: true,
          });
          break;
        case "lost":
          results = await Game.findAll({
            where: {
              [Op.or]: [{ player_1: req.playerid }, { player_2: req.playerid }],
              winner_id: { [Op.ne]: req.playerid },
              status: "FINISHED",
            },
            raw: true,
            include: [
              { model: Player, as: "player1" },
              { model: Player, as: "player2" },
            ],
          });
      }
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  async getOnlinePlayer(req, res, next) {
    try {
      const { rows: players, count: total } = await Player.findAndCountAll({
        where: { is_online: true, id: { [Op.ne]: req.playerid } },
        raw: true,
      });

      res.json({ players, total });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlayerController();
