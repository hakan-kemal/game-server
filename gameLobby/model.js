const Sequelize = require("sequelize");
const sequelize = require("../db");

const Game = sequelize.define(
  "game",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    tableName: "games"
  }
);

module.exports = Game;
