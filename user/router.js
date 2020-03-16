const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./model");
const Event = require("../event/model");
const { toJWT, toData } = require("../auth/jwt");

const router = express.Router();

router.post("/users", async (req, res, next) => {
  try {
    const userCredentials = {
      email: req.body.email,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    if (!userCredentials.email || !userCredentials.password) {
      res.status(400).send({
        message: "Please supply a valid email and password"
      });
    } else {
      const createUser = await User.create(userCredentials);
      const jwt = toJWT({ userId: createUser.id });
      res.send({
        jwt,
        id: createUser.id,
        username: createUser.username
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const showUsers = await User.findAll({ include: [Event] });
    console.log(showUsers);
    res.send(showUsers);
  } catch (error) {
    next(error);
  }
});

router.get("/users/:userId", (req, res, next) => {
  User.findByPk(req.params.userId, { include: [Event] })
    .then(user => {
      if (!user) {
        res.status(404).end();
      } else {
        res.send(user);
      }
    })
    .catch(next);
});

module.exports = router;
