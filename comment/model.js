const db = require("../db");
const Ticket = require ("../ticket/model")
const User = require ("../user/model")
const Sequelize = require("sequelize");

const Comment = db.define("comment", {
  comment: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

Comment.belongsTo(Ticket)
Comment.belongsTo(User)

User.hasMany(Comment)
Ticket.hasMany(Comment)

module.exports = Comment;
