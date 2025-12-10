const { sequelize } = require("..");
const { DataTypes } = require("sequelize");
const Player = require("./Player");

const Game = sequelize.define(
  "Game",
  {
    player_1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "players",
        key: "id",
      },
    },

    player_2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "players",
        key: "id",
      },
    },

    winner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "players",
        key: "id",
      },
    },

    status: {
      type: DataTypes.ENUM(["PENDING", "FINISHED"]),
      allowNull: true,
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "games",
    timestamps: true,
  },
);

Game.belongsTo(Player, {
  as: "player1",
  foreignKey: "player_1",
});

Game.belongsTo(Player, {
  as: "player2",
  foreignKey: "player_2",
});

Game.sync();
module.exports = Game;
