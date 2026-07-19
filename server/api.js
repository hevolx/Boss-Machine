const express = require('express');
const apiRouter = express.Router();
const { getAllFromDatabase, getFromDatabaseById, updateInstanceInDatabase, addToDatabase, deleteFromDatabasebyId } = require('./db');

const minions = getAllFromDatabase('minions');

// Get all minions
apiRouter.get('/minions', (req, res, next) => {
  res.status(200).send(minions);
  next();
});

// Get a single minion
apiRouter.get('/minions/:id', (req, res, next) => {
  const foundMinion = getFromDatabaseById('minions', req.params.id);

  if (foundMinion) {
    res.status(200).send(foundMinion);
    next();
  } else {
    res.status(404).send();
  }
});

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

// Create an minion
apiRouter.post('/minions', (req, res, next) => {
  const receivedMinion = addToDatabase('minions', req.body);
  if (receivedMinion) {
    minions.push(receivedMinion);
    res.status(201).send(receivedMinion);
    next();
  } else {
    res.status(400).send();
  }
});

// Delete an minion
apiRouter.delete('/minions/:id', (req, res, next) => {
  const deleteMinion = deleteFromDatabasebyId('minions', req.params.id);
  if (deleteMinion) {
    let deletedMinion = minions.splice(deleteMinion, 1);
    res.status(204).send(deletedMinion);
    next();
  } else {
    res.status(404).send();
  }
});

module.exports = apiRouter;
