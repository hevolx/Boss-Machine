const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app');

describe('/api/meetings routes', function() {
  let fakeDb = require('../server/db.js');

  describe('GET /api/meetings', function() {

    it('returns an array', function() {
      return request(app)
        .get('/api/meetings')
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an.instanceOf(Array);
        });
    });

    it('returns an array of all meetings', function() {
      return request(app)
        .get('/api/meetings')
        .expect(200)
        .then((response) => {
          let length = fakeDb.getAllFromDatabase('meetings').length;
          expect(response.body.length).to.be.equal(length);
          response.body.forEach((minion) => {
            expect(minion).to.have.ownProperty('time');
            expect(minion).to.have.ownProperty('date');
            expect(minion).to.have.ownProperty('day');
            expect(minion).to.have.ownProperty('note');
          });
        });
    });

  });

  describe('POST /api/meetings', function() {

    it('should create a new meetings and return it', function() {
      return request(app)
        .post('/api/meetings')
        .expect(201)
        .then((response) => response.body)
        .then((createdMeeting) => {
          expect(createdMeeting).to.have.ownProperty('time');
          expect(createdMeeting).to.have.ownProperty('date');
          expect(createdMeeting).to.have.ownProperty('day');
          expect(createdMeeting).to.have.ownProperty('note');
        });
    });

    it('should persist the created meeting to the database', function() {
      let initialMeetingsArray;
      let newlyCreatedMeeting;
      return request(app)
        .get('/api/meetings')
        .then((response) => {
          initialMeetingsArray = response.body;
        })
        .then(() => {
          return request(app)
            .post('/api/meetings')
            .expect(201);
        })
        .then((response) => response.body)
        .then((createdMeeting) => {
          newlyCreatedMeeting = createdMeeting;
          return request(app)
            .get('/api/meetings')
        })
        .then((response) => response.body)
        .then((newMeetingsArray) => {
          expect(newMeetingsArray.length).to.equal(initialMeetingsArray.length + 1);
          let createdMeetingFound = newMeetingsArray.some((meeting) => {
            return meeting.id === newlyCreatedMeeting.id;
          });
          expect(createdMeetingFound).to.be.true;
        });
    });

  });

  describe('DELETE /api/meetings route', function() {

    it('deletes all meetings', function() {
      let initialMeetingsArray;
      return request(app)
        .get('/api/meetings')
        .then((response) => {
          initialMeetingsArray = response.body;
        })
        .then(() => {
          return request(app)
            .delete('/api/meetings')
            .expect(204);
        })
        .then(() => {
          return request(app)
            .get('/api/meetings');
        })
        .then((response) => response.body)
        .then((afterDeleteIdeasArray) => {
          expect(afterDeleteIdeasArray).to.be.an.instanceOf(Array);
          expect(afterDeleteIdeasArray).to.have.property('length', 0);
        });

    });

  });

});
