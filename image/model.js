const Sequelize = require("sequelize");
const db = require("../db.js");

const Image = db.define("image", {
  url: Sequelize.STRING,
  title: Sequelize.STRING
});

module.exports = Image;
