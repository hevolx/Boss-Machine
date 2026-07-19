const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');

describe('/api/ideas routes', function() {
  let fakeDb = require('../server/db.js');

  describe('GET /api/ideas', function() {

    it('returns an array', function() {
      return request(app)
        .get('/api/ideas')
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an.instanceOf(Array);
        });
    });

    it('returns an array of all ideas', function() {
      return request(app)
        .get('/api/ideas')
        .expect(200)
        .then((response) => {
          let length = fakeDb.getAllFromDatabase('ideas').length;
          expect(response.body.length).to.be.equal(length);
          response.body.forEach((idea) => {
            expect(idea).to.have.ownProperty('id');
            expect(idea).to.have.ownProperty('name');
            expect(idea).to.have.ownProperty('description');
            expect(idea).to.have.ownProperty('weeklyRevenue');
            expect(idea).to.have.ownProperty('numWeeks');
          });
        });
    });

  });

  describe('GET /ideas/:ideaId', function() {

    it('returns a single idea object', function() {
      return request(app)
        .get(`/api/ideas/1`)
        .expect(200)
        .then(response => response.body)
        .then((idea) => {
          expect(idea).to.be.an.instanceOf(Object);
          expect(idea).to.not.be.an.instanceOf(Array);
        });
    });

    it('returns a full idea object with correct properties', function() {
      return request(app)
      .get(`/api/ideas/1`)
      .expect(200)
      .then((response) => response.body)
      .then((idea) => {
        expect(idea).to.have.ownProperty('id');
        expect(idea).to.have.ownProperty('name');
        expect(idea).to.have.ownProperty('description');
        expect(idea).to.have.ownProperty('weeklyRevenue');
        expect(idea).to.have.ownProperty('numWeeks');
      });
    });

    it('returned idea has the correct id', function() {
      return request(app)
        .get(`/api/ideas/1`)
        .expect(200)
        .then((response) => response.body)
        .then((idea) => {
          expect(idea.id).to.equal('1');
        });
    });

    it('called with a non-numeric ID returns a 404 error', function() {
      return request(app)
        .get('/api/ideas/notAnId')
        .expect(404);
    });

    it('called with an invalid ID returns a 404 error', function() {
      return request(app)
        .get('/api/ideas/450')
        .expect(404);
    });

  });

  describe('PUT /api/ideas/:ideaId', function() {

    it('updates the correct idea and returns it', function() {
      let initialIdea;
      let updatedIdeaInfo;
      return request(app)
        .get('/api/ideas/1')
        .then((response) => {
          initialIdea = response.body
        })
        .then(() => {
          updatedIdeaInfo = Object.assign({}, initialIdea, {name: 'Test'});
          return request(app)
            .put('/api/ideas/1')
            .send(updatedIdeaInfo);
        })
        .then((response) => {
          expect(response.body).to.be.deep.equal(updatedIdeaInfo);
        });
    });

    it('updates the correct idea and persists to the database', function() {
      let initialIdea;
      let updatedIdeaInfo;
      return request(app)
        .get('/api/ideas/1')
        .then((response) => {
          initialIdea = response.body
        })
        .then(() => {
          updatedIdeaInfo = Object.assign({}, initialIdea, {name: 'Persistence Test'});
          return request(app)
            .put('/api/ideas/1')
            .send(updatedIdeaInfo);
        })
        .then(() => {
          return request(app)
            .get('/api/ideas/1');
        })
        .then((response) => response.body)
        .then((ideaFromDatabase) => {
          expect(ideaFromDatabase.name).to.equal('Persistence Test');
        });
    });

    it('called with a non-numeric ID returns a 404 error', function() {
      return request(app)
        .put('/api/ideas/notAnId')
        .expect(404);
    });

    it('called with an invalid ID returns a 404 error', function() {
      return request(app)
        .put('/api/ideas/450')
        .expect(404);
    });

    it('called with an invalid ID does not change the database array', function() {
      let initialIdeasArray;
      return request(app)
        .get('/api/ideas')
        .then((response) => {
          initialIdeasArray = response.body;
        })
        .then(() => {
          return request(app)
            .put('/api/ideas/notAnId')
            .send({key: 'value'});
        })
        .then(() => {
          return request(app).get('/api/ideas');
        })
        .then((response) => response.body)
        .then((postRequestIdeasArray) => {
          expect(initialIdeasArray).to.be.deep.equal(postRequestIdeasArray);
        });
    });


  });

  describe('POST /api/ideas', function() {

    it('should add a new idea if all supplied information is correct', function() {
      let initialIdeasArray;
      let newIdeaObject = {
        name: 'Test',
        description: '',
        weeklyRevenue: 200000,
        numWeeks: 10,
      }
      return request(app)
        .get('/api/ideas')
        .then((response) => {
          initialIdeasArray = response.body;
        })
        .then(() => {
          return request(app)
            .post('/api/ideas')
            .send(newIdeaObject)
            .expect(201);
        })
        .then((response) => response.body)
        .then((createdIdea) => {
          newIdeaObject.id = createdIdea.id;
          expect(newIdeaObject).to.be.deep.equal(createdIdea);
        });
    });

  });

  describe('DELETE /api/ideas', function() {

    it('deletes the correct idea by id', function() {
      let initialIdeasArray;
      return request(app)
        .get('/api/ideas')
        .then((response) => {
          initialIdeasArray = response.body;
        })
        .then(() => {
          return request(app)
            .delete('/api/ideas/1')
            .expect(204);
        })
        .then(() => {
          return request(app)
            .get('/api/ideas');
        })
        .then((response) => response.body)
        .then((afterDeleteIdeasArray) => {
          expect(afterDeleteIdeasArray).to.not.be.deep.equal(initialIdeasArray);
          let shouldBeDeletedIdea = afterDeleteIdeasArray.find(el => el.id === '1');
          expect(shouldBeDeletedIdea).to.be.undefined;
        });
    });

    it('called with a non-numeric ID returns a 404 error', function() {
      return request(app)
        .delete('/api/ideas/notAnId')
        .expect(404);
    });

    it('called with an invalid ID returns a 404 error', function() {
      return request(app)
        .delete('/api/ideas/450')
        .expect(404);
    });

  });

});
