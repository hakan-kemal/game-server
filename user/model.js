const Sequelize = require("sequelize");
const sequelize = require("../db");

// const Room = require('../room/model');

const User = sequelize.define(
  "user",
  {
    userName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    points: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false,
    tableName: "users"
  }
);

// User.belongsTo(Room)
// Room.hasMany(User)

module.exports = User;
