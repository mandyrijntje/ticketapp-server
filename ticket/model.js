const db = require("../db");
const Event = require ("../event/model")
const User = require ("../user/model")
const Sequelize = require("sequelize");

const Ticket = db.define("ticket", {
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  sold: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

Ticket.belongsTo(Event)
Ticket.belongsTo(User)

User.hasMany(Ticket)
Event.hasMany(Ticket)

module.exports = Ticket;
