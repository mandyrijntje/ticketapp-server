const express = require("express");
const auth = require("../auth/middleware");
const Event = require("./model");
const Ticket = require("../ticket/model");
const { Op } = require("sequelize");

const { Router } = express;

const router = Router();

// get all events
router.get("/event", (request, response, next) => {
  const limit = Math.min(request.query.limit || 9, 20);
  const offset = request.query.offset || 0;
  try {
    Event.findAndCountAll({
      where: {
        startDate: {
          [Op.gte]: new Date()
        }
      },
      limit,
      offset
    }).then(result => {
      console.log(result);
      return response.send({ events: result.rows, total: result.count });
    });
  } catch (error) {
    next(error);
  }
});

// // post an event
// router.post("/event", auth, async (request, response, next) => {
//   try {
//     const { name, description, picture, startDate, endDate } = request.body;
//     const entity = { name, description, picture, startDate, endDate };
//     const event = await Event.create(entity);
//     response.send(event);
//   } catch (error) {
//     next(error);
//   }
// });

// get one event
router.get("/event/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const event = await Event.findByPk(id, { include: [{ model: Ticket }] });
    response.send(event);
  } catch (error) {
    next(error);
  }
});

//update an event
router.put("/event/:id", auth, async (request, response, next) => {
  try {
    const { id } = request.params;
    const event = await event.findByPk(id);
    const updated = await event.update(request.body);
    response.send(updated);
  } catch (error) {
    next(error);
  }
});

// delete an event
router.delete("/event/:id", auth, async (request, response, next) => {
  try {
    const eventToDelete = await Event.destroy({
      where: { id: request.params.id }
    });
    response.json(eventToDelete);
  } catch (error) {
    next(error);
  }
});

// post a ticket for a specific event
router.post("/event/:eventId/ticket", auth, async (request, response, next) => {
  Event.findByPk(request.params.eventId)
    .then(event => {
      if (!event) {
        response.status(404).end();
      } else {
        Ticket.create({
          ...request.body,
          eventId: request.body.eventId
        }).then(ticket => {
          response.json(ticket);
        });
      }
    })
    .catch(next);
});

// post an ticket for user
router.post(
  "/users/:userId/event/:eventId/ticket",
  auth,
  async (request, response, next) => {
    try {
      const { price, description, picture, eventId, userId } = request.body;
      const entity = { price, description, picture };
      const event = await Event.create({
        ...entity,
        userId: userId,
        eventId: eventId
      });
      response.send(event);
    } catch (error) {
      next(error);
    }
  }
);

// get all tickets for a specific event
router.get("/event/:eventId/ticket", (request, response, next) => {
  // const limit = Math.min(request.query.limit || 9, 20);
  // const offset = request.query.offset || 0;
  Ticket.findAll({
    // limit,
    // offset,
    where: { eventId: request.params.eventId }
  })
    .then(ticket => {
      response.json(ticket);
    })
    .catch(next);
});

// get one ticket for a specific event
router.get("/event/:eventId/ticket/:ticketId", (request, response, next) => {
  Ticket.findOne({
    where: {
      ticketId: request.params.ticketId,
      eventId: request.params.eventId
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
});

module.exports = router;
