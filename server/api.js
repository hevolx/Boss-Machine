const express = require('express');
const apiRouter = express.Router();
const { getAllFromDatabase, getFromDatabaseById, updateInstanceInDatabase, addToDatabase, deleteFromDatabasebyId } = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');
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

// Update an idea
apiRouter.put('/ideas/:id', (req, res, next) => {
  const initialIdea = getFromDatabaseById('ideas', req.params.id);
  if (initialIdea) {
    req.body.id = req.params.id;
    let updatedIdeaInfo;
    try {
      updatedIdeaInfo = updateInstanceInDatabase('ideas', req.body);
    } catch (e) {
      return res.status(400).send();
    }
    if (updatedIdeaInfo) {
      res.status(200).send(updatedIdeaInfo);
      next();
    } else {
      res.status(400).send();
    }
  } else {
    res.status(404).send();
  }
});

// Create an idea
apiRouter.post('/ideas', checkMillionDollarIdea, (req, res, next) => {
  const receivedIdea = addToDatabase('ideas', req.body);
  if (receivedIdea) {
    res.status(201).send(receivedIdea);
    next();
  } else {
    res.status(400).send();
  }
});

// Delete an idea
apiRouter.delete('/ideas/:id', (req, res, next) => {
  const didDeleteIdea = deleteFromDatabasebyId('ideas', req.params.id);
  if (didDeleteIdea) {
    return res.sendStatus(204);
  }
  return res.status(404).send();
});
//#endregion

module.exports = apiRouter;
