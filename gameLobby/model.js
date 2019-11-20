const Sequelize = require("sequelize");
const sequelize = require("../db");

const User = require("../user/model");

const Game = sequelize.define(
  "game",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "games"
  }
);

User.belongsTo(Game);
Game.hasMany(User);

module.exports = Game;
