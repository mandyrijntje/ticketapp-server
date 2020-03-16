const User = require("../user/model");
const { toData } = require("./jwt");

function auth(request, response, next) {
  const auth =
    request.headers.authorization && request.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      User.findByPk(data.userId)
        .then(user => {
          if (!user) return next("User doesn't exist");
          request.user = user;
          next();
        })
        .catch(next);
    } catch (error) {
      response.status(400).send({
        message: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    response.status(401).send({
      message: "Please submit valid credentials"
    });
  }
}

module.exports = auth;
