const express = require("express");
const auth = require("../auth/middleware");
const Ticket = require("./model");
const Comment = require("../comment/model");

const { Router } = express;
const router = Router();

// get all tickets
router.get("/ticket", (request, response, next) => {
  const limit = Math.min(request.query.limit || 100, 150);
  const offset = request.query.offset || 0;
  try {
    Ticket.findAndCountAll({
      limit,
      offset
    }).then(result => {
      response.send({ tickets: result.rows, total: result.count });
      // console.log(result.count);
    });
  } catch (error) {
    next(error);
  }
});

// Get all comments for a ticket
router.get("/ticket/:ticketId/comment", (request, response, next) => {
  Comment.findAll({ where: { ticketId: request.params.ticketId } })
    .then(comment => {
      response.json(comment);
    })
    .catch(next);
});

// post a comment for a specific ticket
router.post(
  "/ticket/:ticketId/comment",
  auth,
  async (request, response, next) => {
    Ticket.findByPk(request.params.ticketId)
      .then(ticket => {
        if (!ticket) {
          response.status(404).end();
        } else {
          Comment.create({
            ...request.body,
            ticketId: request.body.ticketId
          }).then(comment => {
            response.json(comment);
          });
        }
      })
      .catch(next);
  }
);

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
