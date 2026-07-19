const express = require('express');
const apiRouter = express.Router();
const { getAllFromDatabase, getFromDatabaseById, updateInstanceInDatabase, addToDatabase, deleteFromDatabasebyId } = require('./db');

const minions = getAllFromDatabase('minions');
const ideas = getAllFromDatabase('ideas');

// #region "/api/minions"
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
    req.body.id = req.params.id;
    let updatedMinionInfo = updateInstanceInDatabase('minions', req.body);
    if (updatedMinionInfo) {
      res.status(200).send(updatedMinionInfo);
      next();
    } else {
      res.status(400).send();
    }
  } else {
    res.status(404).send();
  }
});

// Create an minion
apiRouter.post('/minions', (req, res, next) => {
  const receivedMinion = addToDatabase('minions', req.body);
  if (receivedMinion) {
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
    res.status(204).send(deleteMinion);
    next();
  } else {
    res.status(404).send();
  }
});
// #endregion

// #region "/api/ideas"
// Get all ideas
apiRouter.get('/ideas', (req, res, next) => {
  res.status(200).send(ideas);
  next();
});

// Get a single idea
apiRouter.get('/ideas/:id', (req, res, next) => {
  const foundIdea = getFromDatabaseById('ideas', req.params.id);
  if (foundIdea) {
    res.status(200).send(foundIdea);
    next();
  } else {
    res.status(404).send();
  }
});
//#endregion

module.exports = apiRouter;
