const express = require('express');
const apiRouter = express.Router();
const { getAllFromDatabase, getFromDatabaseById, updateInstanceInDatabase } = require('./db');

const minions = getAllFromDatabase('minions');

// Get all minions
apiRouter.get('/minions', (req, res, next) => {
  res.status(200).send(minions);
  next();
})

// Get a single minion
apiRouter.get('/minions/:id', (req, res, next) => {
  const foundMinion = getFromDatabaseById('minions', req.params.id);

  if (foundMinion) {
    res.status(200).send(foundMinion);
    next();
  } else {
    res.status(404).send();
  }
})

// Update an minion
apiRouter.put('/minions/:id', (req, res, next) => {
  const initialMinion = getFromDatabaseById('minions', req.params.id);
  if (initialMinion) {
    let updatedMinionInfo = updateInstanceInDatabase('minions', req.body);
    res.status(201).send(updatedMinionInfo);
    next();
  } else {
    res.status(404).send();
  }
});

module.exports = apiRouter;
