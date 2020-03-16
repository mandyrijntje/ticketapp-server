const { Router } = require("express");
const bcrypt = require("bcrypt");
const { toJWT } = require("./jwt");
const User = require("../user/model");
const auth = require("./middleware");

const router = new Router();

router.post("/login", (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;
  if (!email || !password) {
    response.status(400).send("Please enter a valid e-mail and password");
  } else {
    User.findOne({ where: { email: request.body.email } })
      .then(user => {
        if (!user) {
          response
            .status(400)
            .send({ message: "User with that email doesn't exist" });
        } else if (bcrypt.compareSync(request.body.password, user.password)) {
          response.send({
            jwt: toJWT({ userId: user.id })
          });
        } else {
          response.status(400).send({
            message: "password is incorrect"
          });
        }
      })
      .catch(error => {
        console.error(error);
        response.status(500).send({ message: "Something went wrong" });
      });
  }
});

router.get("/test-endpoint", auth, (request, response, next) => {
  response.send({
    message: `This is the test endpoint, ${request.user.email}`
  });
});

module.exports = router;
