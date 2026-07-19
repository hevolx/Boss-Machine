const express = require('express');
const apiRouter = express.Router();
const { getAllFromDatabase, getFromDatabaseById } = require('./db');

const minions = getAllFromDatabase('minions');

apiRouter.get('/minions', (req, res, next) => {
  res.status(200).send(minions);
  next();
})

apiRouter.get('/minions/:id', (req, res, next) => {
  const foundMinion = getFromDatabaseById('minions', req.params.id);

  if (foundMinion) {
    res.status(200).send(foundMinion);
    next();
  } else {
    res.status(404).send();
  }
})

module.exports = apiRouter;
