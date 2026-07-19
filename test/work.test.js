const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');

xdescribe('BONUS: /api/minions/:minionId/work routes', function() {

  let fakeDb = require('../server/db.js').db;

    describe('GET /api/minions/:minionId/work', function() {

      it('returns an array', function() {
        return request(app)
          .get('/api/minions/2/work')
          .expect(200)
          .then((response) => {
            expect(response.body).to.be.an.instanceOf(Array);
          });
      });

      it('returns an array of all all work for the specified minion', function() {
        return request(app)
          .get('/api/minions/2/work')
          .then((response) => response.body)
          .then((minionTwoWork) => {
            minionTwoWork.forEach((work) => {
              expect(work).to.have.property('minionId', '2');
            });
          });
      });

      it('called with a non-numeric minion ID returns a 404 error', function() {
        return request(app)
          .get('/api/minions/notAnId/work')
          .expect(404);
      });

      it('called with an invalid ID minion returns a 404 error', function() {
        return request(app)
          .get('/api/minions/450/work')
          .expect(404);
      });

    });

    describe('PUT /api/minions/:minionId/work/:workId', function() {

      it('updates the correct work and returns it', function() {
        let initialWork;
        let updatedWorkInfo;
        return request(app)
          .get('/api/minions/2/work')
          .then(response => response.body)
          .then((workArray) => {
            initialWork = workArray[0];
          })
          .then(() => {
            updatedWorkInfo = Object.assign({}, initialWork, {hours: 45});
            return request(app)
              .put(`/api/minions/2/work/${initialWork.id}`)
              .send(updatedWorkInfo);
          })
          .then((response) => {
            expect(response.body).to.be.deep.equal(updatedWorkInfo);
          });
      });

      it('updates the correct work item and persists to the database', function() {
        let initialWork;
        let updatedWorkInfo;
        return request(app)
          .get('/api/minions/2/work')
          .then((response) => response.body)
          .then((workArray) => {
            initialWork = workArray[0];
          })
          .then(() => {
            updatedWorkInfo = Object.assign({}, initialWork, {title: 'Persistence Test'});
            return request(app)
              .put(`/api/minions/2/work/${initialWork.id}`)
              .send(updatedWorkInfo);
          })
          .then(() => {
            return request(app)
              .get(`/api/minions/2/work`);
          })
          .then((response) => response.body)
          .then((postUpdateWorkArray) => {
            let updatedWorkObject = postUpdateWorkArray.find((work) => work.id === initialWork.id);
            expect(updatedWorkObject).to.have.property('title', 'Persistence Test');
          })
      });

      it('called with a non-numeric minion ID returns a 404 error', function() {
        return request(app)
          .put('/api/minions/notAnId')
          .expect(404);
      });

      it('called with an invalid minion ID returns a 404 error', function() {
        return request(app)
          .put('/api/minions/450')
          .expect(404);
      });

      it('called with a non-numeric work ID returns a 404 error', function() {
        return request(app)
          .put('/api/minions/notAnId/work/notAnId')
          .expect(404);
      });

      it('called with an invalid work ID returns a 404 error', function() {
        return request(app)
          .put('/api/minions/450/work/450')
          .expect(404);
      });

      it('called with an invalid ID does not change the database array', function() {
        let initialMinionsWorkArray;
        return request(app)
          .get('/api/minions/2/work')
          .then((response) => {
            initialMinionsWorkArray = response.body;
          })
          .then(() => {
            return request(app)
              .put('/api/minions/2/work/notAnId')
              .send({key: 'value'});
          })
          .then(() => {
            return request(app).get('/api/minions/2/work');
          })
          .then((response) => response.body)
          .then((postRequestWorkArray) => {
            expect(initialMinionsWorkArray).to.be.deep.equal(postRequestWorkArray);
          });
      });

      it('returns a 400 if a work ID with the wrong :minionId is requested', function() {
        let initialWork;
        let updatedWorkInfo;
        return request(app)
          .get('/api/minions/2/work')
          .then((response) => response.body)
          .then((workArray) => {
            initialWork = workArray[0];
          })
          .then(() => {
            updatedWorkInfo = Object.assign({}, initialWork, {minionId: 45});
            return request(app)
              .put('/api/minions/2/work/1')
              .send(updatedWorkInfo)
              .expect(400);
          });
      });


    });

    describe('POST /api/minions/:minionId/work', function() {

      it('should add a new work item if all supplied information is correct', function() {
        let newWorkObject = {
          title: 'Test',
          description: '',
          hours: 20,
          minionId: '2',
        };
        return request(app)
          .post('/api/minions/2/work')
          .send(newWorkObject)
          .expect(201)
          .then(res => res.body)
          .then(createdWork => {
            newWorkObject.id = createdWork.id;
            expect(newWorkObject).to.be.deep.equal(createdWork);
          })
      });

    });

    describe('DELETE /api/minions/:minionId/work/:workId', function() {

      it('deletes the correct work by id', function() {
        let initialWorkArray;
        return request(app)
          .get('/api/minions/2/work')
          .then((response) => {
            initialWorkArray = response.body;
          })
          .then(() => {
            return request(app)
              .delete('/api/minions/2/work/2')
              .expect(204);
          })
          .then(() => {
            return request(app)
              .get('/api/minions/2/work');
          })
          .then((response) => response.body)
          .then((afterDeleteWorkArray) => {
            expect(afterDeleteWorkArray).to.not.be.deep.equal(initialWorkArray);
            let shouldBeDeletedWork = afterDeleteWorkArray.find((el) => el.id === '2');
            expect(shouldBeDeletedWork).to.be.undefined;
          });

      });

      it('called with a non-numeric minion ID returns a 404 error', function() {
        return request(app)
          .delete('/api/minions/notAnId')
          .expect(404);
      });

      it('called with an invalid minion ID returns a 404 error', function() {
        return request(app)
          .delete('/api/minions/450')
          .expect(404);
      });

      it('called with a non-numeric work ID returns a 404 error', function() {
        return request(app)
          .delete('/api/minions/notAnId/work/notAnId')
          .expect(404);
      });

      it('called with an invalid work ID returns a 404 error', function() {
        return request(app)
          .delete('/api/minions/450/work/450')
          .expect(404);
      });

    });

});
