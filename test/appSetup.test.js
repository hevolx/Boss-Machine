const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');

describe('app.js setup', function() {

  describe('body-parsing middleware', function() {

    it('parses JSON request bodies into req.body', function() {
      app.post('/test-body-parsing', (req, res) => {
        res.json(req.body);
      });

      return request(app)
        .post('/test-body-parsing')
        .send({ foo: 'bar' })
        .expect(200)
        .then((response) => {
          expect(response.body).to.deep.equal({ foo: 'bar' });
        });
    });

  });

  describe('CORS middleware', function() {

    it('sets the Access-Control-Allow-Origin header on responses', function() {
      app.get('/test-cors', (req, res) => {
        res.sendStatus(200);
      });

      return request(app)
        .get('/test-cors')
        .then((response) => {
          expect(response.headers).to.have.property('access-control-allow-origin', '*');
        });
    });

  });

  describe('apiRouter mounting', function() {

    it('mounts the apiRouter at /api', function() {
      const apiRouter = require('../server/api');
      apiRouter.get('/test-mount', (req, res) => {
        res.sendStatus(200);
      });

      return request(app)
        .get('/api/test-mount')
        .expect(200);
    });

  });

});
