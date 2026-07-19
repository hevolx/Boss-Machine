const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');

describe('checkMillionDollarIdea middleware', function() {

  const checkMillionDollarIdea = require('../server/checkMillionDollarIdea');

  let req;
  let response;
  let status;
  let sent;
  let nextCallback;
  let nextCalled;

  beforeEach(() => {
    status = null;
    sent = null;
    req = {
      body: {},
    }
    response = {
      send: function(...args) {
        sent = args;
      },
      status: function(statusCode) {
        status = statusCode;
        return this;
      },
      // Codecademy doesn't teach this method but it is in the Express docs.
      sendStatus: function(status) {
        this.status(status).send();
      }
    }
    nextCalled = false;
    nextCallback = () => {
      nextCalled = true;
    }
  });


  it('is a function takes three arguments', function() {
    expect(checkMillionDollarIdea).to.be.an.instanceOf(Function);
    expect(checkMillionDollarIdea.length).to.equal(3);
  });


  it('sends a 400 error if the total yield is less than one million dollars', function() {
    req.body = {
      numWeeks: 4,
      weeklyRevenue: 2,
    }
    checkMillionDollarIdea(req, response, nextCallback);
    expect(status).to.equal(400);
    expect(nextCalled).to.be.false;
  });

  it('calls next for ideas that will yield at least one million dollars', function() {
    req.body.numWeeks = '1000000';
    req.body.weeklyRevenue = '1';
    checkMillionDollarIdea(req, response, nextCallback);
    expect(status).to.equal(null);
    expect(nextCalled).to.be.true;
  });

  it('sends a 400 error if numWeeks or weeklyRevenue is not supplied', function() {
    checkMillionDollarIdea(req, response, nextCallback);
    expect(status).to.equal(400);
    expect(nextCalled).to.be.false;
  });

  it('sends a 400 error if numWeeks or weeklyRevenue is an invalid string', function() {
    req.body = {
      numWeeks: 'invalid',
      weeklyRevenue: 4,
    }
    checkMillionDollarIdea(req, response, nextCallback);
    expect(nextCalled).to.be.false;
    expect(status).to.equal(400);

    nextCalled = false;
    status = null;
    req.body = {
      numWeeks: 3,
      weeklyRevenue: 'invalid',
    }
    checkMillionDollarIdea(req, response, nextCallback);
    expect(nextCalled).to.be.false;
    expect(status).to.equal(400);
  });

  it('is used in a POST /api/ideas route to reject insufficiently profitable ideas', function() {
    return request(app)
      .post('/api/ideas')
      .send({
        name: 'Test',
        description: 'Test',
        numWeeks: 4,
        weeklyRevenue: 4,
      })
      .expect(400);
  });

});
