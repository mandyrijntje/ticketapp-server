const db = require("../db");
const Event = require ("../event/model")
const User = require ("../user/model")
const Sequelize = require("sequelize");

const Ticket = db.define("ticket", {
  picture: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  }
});

Ticket.belongsTo(Event)
Ticket.belongsTo(User)

User.hasMany(Ticket)
Event.hasMany(Ticket)

module.exports = Ticket;
