const express = require("express");

const { Router } = express;

const router = Router();

// get all comments
router.get("/comment", (request, response, next) => {
  const limit = Math.min(request.query.limit || 500, 2000);
  const offset = request.query.offset || 0;
  try {
    Comment.findAndCountAll({
      limit,
      offset
    }).then(result => {
      // console.log(result);
      return response.send({ comments: result.rows, total: result.count });
    });
  } catch (error) {
    next(error);
  }
});
