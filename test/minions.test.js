const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');

describe('/api/minions routes', function() {
  let fakeDb = require('../server/db.js');

  describe('GET /api/minions', function() {

    it('returns an array', function() {
      return request(app)
        .get('/api/minions')
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an.instanceOf(Array);
        });
    });

    it('returns an array of all minions', function() {
      return request(app)
        .get('/api/minions')
        .expect(200)
        .then((response) => {
          let length = fakeDb.getAllFromDatabase('minions').length;
          expect(response.body.length).to.be.equal(length);
          response.body.forEach((minion) => {
            expect(minion).to.have.ownProperty('id');
            expect(minion).to.have.ownProperty('name');
            expect(minion).to.have.ownProperty('title');
            expect(minion).to.have.ownProperty('weaknesses');
            expect(minion).to.have.ownProperty('salary');
          });
        });
    });

  });

  describe('GET /minions/:minionId', function() {

      it('returns a single minion object', function() {
        return request(app)
          .get(`/api/minions/1`)
          .expect(200)
          .then((response) => {
            const minion = response.body;
            expect(minion).to.be.an.instanceOf(Object);
            expect(minion).to.not.be.an.instanceOf(Array);
          });
      });

      it('returns a full minion object', function() {
        return request(app)
        .get(`/api/minions/1`)
        .expect(200)
        .then((response) => {
          let minion = response.body;
          expect(minion).to.have.ownProperty('id');
          expect(minion).to.have.ownProperty('name');
          expect(minion).to.have.ownProperty('title');
          expect(minion).to.have.ownProperty('weaknesses');
          expect(minion).to.have.ownProperty('salary');
        });
      });

      it('returned minion has the correct id', function() {
        return request(app)
          .get(`/api/minions/1`)
          .expect(200)
          .then((response) => {
            let minion = response.body;
            expect(minion.id).to.be.an.equal('1');
          });
      });

    it('called with a non-numeric ID returns a 404 error', function() {
      return request(app)
        .get('/api/minions/notAnId')
        .expect(404);
    });

    it('called with an invalid ID returns a 404 error', function() {
      return request(app)
        .get('/api/minions/450')
        .expect(404);
    });

  });

  describe('PUT /api/minions/:minionId', function() {

    it('updates the correct minion and returns it', function() {
      let initialMinion;
      let updatedMinionInfo;
      return request(app)
        .get('/api/minions/1')
        .then((response) => {
          initialMinion = response.body
        })
        .then(() => {
          updatedMinionInfo = Object.assign({}, initialMinion, {name: 'Test'});
          return request(app)
            .put('/api/minions/1')
            .send(updatedMinionInfo);
        })
        .then((response) => {
          expect(response.body).to.be.deep.equal(updatedMinionInfo);
        });
    });

    it('updates the correct minion and persists to the database', function() {
      let initialMinion;
      let updatedMinionInfo;
      return request(app)
        .get('/api/minions/1')
        .then((response) => {
          initialMinion = response.body
        })
        .then(() => {
          updatedMinionInfo = Object.assign({}, initialMinion, {name: 'Persistence Test'});
          return request(app)
            .put('/api/minions/1')
            .send(updatedMinionInfo);
        })
        .then(() => {
          return request(app)
            .get('/api/minions/1');
        })
        .then((response) => response.body)
        .then(minionFromDatabase => {
          expect(minionFromDatabase.name).to.equal('Persistence Test');
        });
    });

    it('called with a non-numeric ID returns a 404 error', function() {
      return request(app)
        .put('/api/minions/notAnId')
        .expect(404);
    });

    it('called with an invalid ID returns a 404 error', function() {
      return request(app)
        .put('/api/minions/450')
        .expect(404);
    });

    it('called with an invalid ID does not change the database array', function() {
      let initialMinionsArray;
      return request(app)
        .get('/api/minions')
        .then((response) => {
          initialMinionsArray = response.body;
        })
        .then(() => {
          return request(app)
            .put('/api/minions/notAnId')
            .send({key: 'value'});
        })
        .then(() => {
          return request(app).get('/api/minions');
        })
        .then((afterPutResponse) => {
          let postRequestMinionsArray = afterPutResponse.body;
          expect(initialMinionsArray).to.be.deep.equal(postRequestMinionsArray);
        });
    });

  });

  describe('POST /api/minions', function() {

    it('should add a new minion if all supplied information is correct', function() {
      let initialMinionsArray;
      let newMinionObject = {
        name: 'Test',
        title: '',
        salary: 0,
        weaknesses: '',
      }
      return request(app)
        .get('/api/minions')
        .then((response) => {
          initialMinionsArray = response.body;
        })
        .then(() => {
          return request(app)
            .post('/api/minions')
            .send(newMinionObject)
            .expect(201);
        })
        .then((response) => response.body)
        .then((createdMinion) => {
          newMinionObject.id = createdMinion.id;
          expect(newMinionObject).to.be.deep.equal(createdMinion);
        });
    });

  });

  describe('DELETE /api/minions', function() {

    it('deletes the correct minion by id', function() {
      let initialMinionsArray;
      return request(app)
        .get('/api/minions')
        .then((response) => {
          initialMinionsArray = response.body;
        })
        .then(() => {
          return request(app)
            .delete('/api/minions/1')
            .expect(204);
        })
        .then(() => {
          return request(app)
            .get('/api/minions');
        })
        .then((response) => response.body)
        .then((afterDeleteMinionsArray) => {
          expect(afterDeleteMinionsArray).to.not.be.deep.equal(initialMinionsArray);
          let shouldBeDeletedMinion = afterDeleteMinionsArray.find(el => el.id === '1');
          expect(shouldBeDeletedMinion).to.be.undefined;
        });

    });

    it('called with a non-numeric ID returns a 404 error', function() {
      return request(app)
        .delete('/api/minions/notAnId')
        .expect(404);
    });

    it('called with an invalid ID returns a 404 error', function() {
      return request(app)
        .delete('/api/minions/450')
        .expect(404);
    });

  });

});
