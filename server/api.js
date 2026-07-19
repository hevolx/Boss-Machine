const express = require('express');
const apiRouter = express.Router();
const { getAllFromDatabase, getFromDatabaseById } = require('./db');

const minions = getAllFromDatabase('minions');

apiRouter.get('/minions', (req, res, next) => {
  res.status(200).send(minions);
  next();
})

module.exports = apiRouter;
