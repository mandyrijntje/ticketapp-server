const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("../auth/middleware");
const User = require("./model");
const Ticket = require("../ticket/model");
const Event = require("../event/model");
const { toJWT, toData } = require("../auth/jwt");

const router = express.Router();

//create a user
router.post("/users", async (request, response, next) => {
  try {
    const userCredentials = {
      email: request.body.email,
      username: request.body.username,
      password: bcrypt.hashSync(request.body.password, 10)
    };
    if (!userCredentials.email || !userCredentials.password) {
      response.status(400).send({
        message: "Please supply a valid email and password"
      });
    } else {
      const createUser = await User.create(userCredentials);
      const jwt = toJWT({ userId: createUser.id });
      response.send({
        jwt,
        id: createUser.id,
        username: createUser.username
      });
    }
  } catch (error) {
    next(error);
  }
});

//get all users
router.get("/users", async (request, response, next) => {
  try {
    const showUsers = await User.findAll({ include: [Event][Ticket] });
    console.log(showUsers);
    response.send(showUsers);
  } catch (error) {
    next(error);
  }
});

//get one user
router.get("/users/:userId", (request, response, next) => {
  User.findByPk(request.params.userId, { include: [Event][Ticket] })
    .then(user => {
      if (!user) {
        response.status(404).end();
      } else {
        response.send(user);
      }
    })
    .catch(next);
});

// Get all user's tickets
router.get("/users/:userId/ticket", (request, response, next) => {
  Ticket.findAll({ where: { userId: request.params.userId } })
    .then(ticket => {
      response.json(ticket);
    })
    .catch(next);
});

// Delete all user's tickets
router.delete("/users/:userId/tasks", auth, (request, response, next) => {
  Ticket.destroy({
    where: {
      userId: request.params.userId
    }
  })
    .then(() => {
      response.status(204).end();
    })
    .catch(next);
});

module.exports = router;
