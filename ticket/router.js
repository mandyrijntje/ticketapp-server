const express = require("express");
const auth = require("../auth/middleware");
const Ticket = require("./model");

const { Router } = express;

const router = Router();

// post a ticket for a specific event
router.post("/ticket", auth, async (request, response, next) => {
  Event.findByPk(request.body.eventId)
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

// get one ticket for a specific event
router.get("/ticket/:ticketId", (request, response, next) => {
  Ticket.findOne({
    where: {
      ticketId: request.params.ticketId
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

//update a ticket for a specific event
router.put("/ticket/:ticketId", auth, (request, response, next) => {
  Ticket.findOne({
    where: {
      ticketId: request.params.ticketId
    }
  })
    .then(ticket => {
      if (ticket) {
        ticket.update(request.body).then(ticket => response.json(ticket));
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});

//delete a ticket for a specific event
router.delete("/ticket/:ticketId", auth, (request, response, next) => {
  Ticket.destroy({
    where: {
      ticketId: request.params.ticketId
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        response.status(204).end();
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});

module.exports = router;
