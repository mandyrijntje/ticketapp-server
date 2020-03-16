const db = require("../db");
const Sequelize = require("sequelize");

const Event = db.define("event", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  description: Sequelize.TEXT
});

module.exports = Event;
