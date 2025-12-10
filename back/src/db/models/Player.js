const { sequelize } = require("..");
const { DataTypes } = require("sequelize");

const Player = sequelize.define(
  "Player",
  {
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pseudo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    is_online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "players",
    timestamps: true,
  },
);

Player.sync();

module.exports = Player;
