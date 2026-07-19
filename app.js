const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = app;

// Add middleware for handling CORS requests from index.html
app.use(cors());

// create application/json parser
app.use(bodyParser.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
app.use('/api', apiRouter);

// Add middware for parsing request bodies here:
apiRouter.get('/', (req, res, next) => {
  res.send(req.body);
  next();
});



