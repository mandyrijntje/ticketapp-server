const express = require("express");

const Event = require("./model");
const Ticket = require("../ticket/model");

const { Router } = express;

const router = Router();

// get all events
router.get("/event", async (request, response, next) => {
  try {
    const events = await Event.findAll({ include: [{ model: Ticket }] });
    response.send(events);
  } catch (error) {
    next(error);
  }
});

// post an event
router.post("/event", async (request, response, next) => {
  try {
    const { name, description, picture, startDate, endDate } = request.body;
    const entity = { name, description, picture, startDate, endDate };
    const event = await Event.create(entity);
    response.send(event);
  } catch (error) {
    next(error);
  }
});

// get one event
router.get(async (request, response, next) => {
  try {
    const { id } = request.params;
    const event = await Event.findByPk(id, { include: [{ model: Ticket }] });
    response.send(event);
  } catch (error) {
    next(error);
  }
});

//update an event
router.put("/event/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const event = await event.findByPk(id);
    console.log("request.body test:", request.body);
    console.log("event test:", event.dataValues);
    const updated = await event.update(request.body);
    response.send(updated);
  } catch (error) {
    next(error);
  }
});

// get all events
router.delete("/event/:id", async (request, response, next) => {
  try {
    const eventToDelete = await Event.destroy({
      where: { id: request.body.id }
    });
    response.json(eventToDelete);
  } catch (error) {
    next(error);
  }
});

// get all events
router.get("/event/user/:id", async (request, response, next) => {
  try {
    const eventsByUser = await Event.findAll({
      where: { userId: req.params.id }
    });
    response.json(eventsByUser);
  } catch (error) {
    next(error);
  }
});

// get all tickets for a specific event
router.get("event/:id/ticket", async (request, response, next) => {
  try {
    const ticket = await Ticket.findAll({
      where: { eventId: request.params.id }
    });
    response.send(ticket);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
