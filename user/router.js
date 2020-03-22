const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("../auth/middleware");
const User = require("./model");
const Ticket = require("../ticket/model");
const Event = require("../event/model");
const Comment = require("../comment/model");
const { toJWT, toData } = require("../auth/jwt");

const router = express.Router();

//create a user
router.post("/users", async (request, response, next) => {
  try {
    const userCredentials = {
      email: request.body.email,
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
        email: createUser.email
      });
    }
  } catch (error) {
    next(error);
  }
});

//get all users
router.get("/users", async (request, response, next) => {
  try {
    const showUsers = await User.findAll({
      include: [
        {
          model: Event
        },
        {
          model: Ticket
        },
        {
          model: Comment
        }
      ]
    });
    response.send(showUsers);
  } catch (error) {
    next(error);
  }
});

//get one user
router.get("/users/:userId", (request, response, next) => {
  User.findByPk(request.params.userId, {
    include: [
      {
        model: Event
      },
      {
        model: Ticket
      },
      {
        model: Comment
      }
    ]
  })
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

// Get all user's events
router.get("/users/:userId/event", (request, response, next) => {
  Event.findAll({ where: { userId: request.params.userId } })
    .then(event => {
      response.json(event);
    })
    .catch(next);
});

// get one event for a specific user
router.get("/users/:userId/event/:id", (request, response, next) => {
  Event.findOne({
    where: {
      id: request.params.id,
      userId: request.params.userId
    }
  })
    .then(event => {
      if (event) {
        response.json(event);
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});

// get all tickets for one user's one event
router.get(
  "/users/:userId/event/:eventId/ticket",
  (request, response, next) => {
    Ticket.findAll({
      where: {
        eventId: request.params.eventId,
        userId: request.params.userId
      }
    })
      .then(ticket => {
        if (ticket) {
          response.json(ticket);
        } else {
          response.status(404).end();
        }
      })
      .catch(next);
  }
);

// get one ticket for one user's one event
router.get(
  "/users/:userId/event/:eventId/ticket/:ticketId",
  (request, response, next) => {
    Ticket.findOne({
      where: {
        eventId: request.params.eventId,
        ticketId: request.params.ticketId,
        userId: request.params.userId
      }
    })
      .then(ticket => {
        if (ticket) {
          response.json(ticket);
        } else {
          response.status(404).end();
        }
      })
      .catch(next);
  }
);

// // Create a new event for a user
// router.post("/event", auth, async (request, response, next) => {
//   try {
//     const {
//       name,
//       description,
//       picture,
//       startDate,
//       endDate,
//       userId
//     } = request.body;
//     const entity = { name, description, picture, startDate, endDate };
//     const user = await User.findByPk(userId);
//     if (!user) {
//       response.status(404).end();
//     } else {
//       Event.create({
//         ...entity,
//         userId: request.body.userId
//       });
//       response.send(event);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// post an event for user
router.post("/users/:userId/event", auth, async (request, response, next) => {
  try {
    const {
      name,
      description,
      picture,
      startDate,
      endDate,
      userId
    } = request.body;
    const entity = { name, description, picture, startDate, endDate };
    const event = await Event.create({
      ...entity,
      userId: userId
    });
    response.send(event);
  } catch (error) {
    next(error);
  }
});

// post an ticket for user
router.post("/users/:userId/ticket", auth, async (request, response, next) => {
  try {
    const { price, description, picture, eventId, userId } = request.body;
    const entity = { price, description, picture };
    const ticket = await Ticket.create({
      ...entity,
      userId: userId,
      eventId: eventId
    });
    response.send(ticket);
  } catch (error) {
    next(error);
  }
});

//create a user
// router.post("/users", async (request, response, next) => {
//   try {
//     const userCredentials = {
//       email: request.body.email,
//       password: bcrypt.hashSync(request.body.password, 10)
//     };
//     if (!userCredentials.email || !userCredentials.password) {
//       response.status(400).send({
//         message: "Please supply a valid email and password"
//       });
//     } else {
//       const createUser = await User.create(userCredentials);
//       const jwt = toJWT({ userId: createUser.id });
//       response.send({
//         jwt,
//         id: createUser.id,
//         email: createUser.email
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// Delete all user's tickets
router.delete("/users/:userId/ticket", auth, (request, response, next) => {
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

// Delete all user's events
router.delete("/users/:userId/event", auth, (request, response, next) => {
  Event.destroy({
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
