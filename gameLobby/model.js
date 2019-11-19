const Sequelize = require("sequelize");
const sequelize = require("../db");

const User = require("../user/model");

const Game = sequelize.define(
  "game",
  {
    name: {
      type: Sequelize.STRING
      // allowNull: false
    }
  },
  {
    tableName: "games"
  }
);

User.belongsTo(Game);

module.exports = Game;
