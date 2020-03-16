const express = require("express");

const Event = require("./model");

const { Router } = express;

const router = Router();

// get all events
router.get("/events", async (request, response, next) => {
  try {
    const events = await Event.findAll();
    response.send(events);
  } catch (error) {
    next(error);
  }
});

// post an event
router.post("/events", async (request, response, next) => {
  try {
    const { name, location } = request.body;

    // create an entity object
    // that describes what I want to make
    const entity = { name, location };

    // add a row to the database using a promise
    const event = await Event.create(entity);
    response.send(event);
  } catch (error) {
    next(error);
  }
});

// get one event
router.get(
  // path with an id parameter
  async (request, response, next) => {
    try {
      const { id } = request.params;
      const event = await Event.findByPk(id);
      response.send(event);
    } catch (error) {
      next(error);
    }
  }
);

//update an event
router.put("/events/:id", async (request, response, next) => {
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

router.delete("/events/:id", async (req, res, next) => {
  try {
    const eventToDelete = await Event.destroy({ where: { id: req.body.id } });
    res.json(eventToDelete);
  } catch (error) {
    next(error);
  }
});
router.get("/events/user/:id", async (req, res, next) => {
  try {
    const eventsByUser = await Event.findAll({
      where: { userId: req.params.id }
    });
    res.json(eventsByUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
