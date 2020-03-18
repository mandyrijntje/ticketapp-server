const db = require("../db");
const Sequelize = require("sequelize");
const User = require ("../user/model")

const Event = db.define("event", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  picture: {
    type: Sequelize.STRING,
    allowNull: false
  },
  startDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  }
},{
  timestamps: false,
  tableName: "events"
});

Event.belongsTo(User)

User.hasMany(Event)

module.exports = Event;
