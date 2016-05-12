'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Timetracker = mongoose.model('Timetracker'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, timetracker;

/**
 * Timetracker routes tests
 */
describe('Timetracker CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Timetracker
    user.save(function () {
      timetracker = {
        name: 'Timetracker name'
      };

      done();
    });
  });

  it('should be able to save a Timetracker if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Timetracker
        agent.post('/api/timetrackers')
          .send(timetracker)
          .expect(200)
          .end(function (timetrackerSaveErr, timetrackerSaveRes) {
            // Handle Timetracker save error
            if (timetrackerSaveErr) {
              return done(timetrackerSaveErr);
            }

            // Get a list of Timetrackers
            agent.get('/api/timetrackers')
              .end(function (timetrackersGetErr, timetrackersGetRes) {
                // Handle Timetracker save error
                if (timetrackersGetErr) {
                  return done(timetrackersGetErr);
                }

                // Get Timetrackers list
                var timetrackers = timetrackersGetRes.body;

                // Set assertions
                (timetrackers[0].user._id).should.equal(userId);
                (timetrackers[0].name).should.match('Timetracker name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Timetracker if not logged in', function (done) {
    agent.post('/api/timetrackers')
      .send(timetracker)
      .expect(403)
      .end(function (timetrackerSaveErr, timetrackerSaveRes) {
        // Call the assertion callback
        done(timetrackerSaveErr);
      });
  });

  it('should not be able to save an Timetracker if no name is provided', function (done) {
    // Invalidate name field
    timetracker.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Timetracker
        agent.post('/api/timetrackers')
          .send(timetracker)
          .expect(400)
          .end(function (timetrackerSaveErr, timetrackerSaveRes) {
            // Set message assertion
            (timetrackerSaveRes.body.message).should.match('Please fill Timetracker name');

            // Handle Timetracker save error
            done(timetrackerSaveErr);
          });
      });
  });

  it('should be able to update an Timetracker if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Timetracker
        agent.post('/api/timetrackers')
          .send(timetracker)
          .expect(200)
          .end(function (timetrackerSaveErr, timetrackerSaveRes) {
            // Handle Timetracker save error
            if (timetrackerSaveErr) {
              return done(timetrackerSaveErr);
            }

            // Update Timetracker name
            timetracker.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Timetracker
            agent.put('/api/timetrackers/' + timetrackerSaveRes.body._id)
              .send(timetracker)
              .expect(200)
              .end(function (timetrackerUpdateErr, timetrackerUpdateRes) {
                // Handle Timetracker update error
                if (timetrackerUpdateErr) {
                  return done(timetrackerUpdateErr);
                }

                // Set assertions
                (timetrackerUpdateRes.body._id).should.equal(timetrackerSaveRes.body._id);
                (timetrackerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Timetrackers if not signed in', function (done) {
    // Create new Timetracker model instance
    var timetrackerObj = new Timetracker(timetracker);

    // Save the timetracker
    timetrackerObj.save(function () {
      // Request Timetrackers
      request(app).get('/api/timetrackers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Timetracker if not signed in', function (done) {
    // Create new Timetracker model instance
    var timetrackerObj = new Timetracker(timetracker);

    // Save the Timetracker
    timetrackerObj.save(function () {
      request(app).get('/api/timetrackers/' + timetrackerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', timetracker.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Timetracker with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/timetrackers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Timetracker is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Timetracker which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Timetracker
    request(app).get('/api/timetrackers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Timetracker with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Timetracker if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Timetracker
        agent.post('/api/timetrackers')
          .send(timetracker)
          .expect(200)
          .end(function (timetrackerSaveErr, timetrackerSaveRes) {
            // Handle Timetracker save error
            if (timetrackerSaveErr) {
              return done(timetrackerSaveErr);
            }

            // Delete an existing Timetracker
            agent.delete('/api/timetrackers/' + timetrackerSaveRes.body._id)
              .send(timetracker)
              .expect(200)
              .end(function (timetrackerDeleteErr, timetrackerDeleteRes) {
                // Handle timetracker error error
                if (timetrackerDeleteErr) {
                  return done(timetrackerDeleteErr);
                }

                // Set assertions
                (timetrackerDeleteRes.body._id).should.equal(timetrackerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Timetracker if not signed in', function (done) {
    // Set Timetracker user
    timetracker.user = user;

    // Create new Timetracker model instance
    var timetrackerObj = new Timetracker(timetracker);

    // Save the Timetracker
    timetrackerObj.save(function () {
      // Try deleting Timetracker
      request(app).delete('/api/timetrackers/' + timetrackerObj._id)
        .expect(403)
        .end(function (timetrackerDeleteErr, timetrackerDeleteRes) {
          // Set message assertion
          (timetrackerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Timetracker error error
          done(timetrackerDeleteErr);
        });

    });
  });

  it('should be able to get a single Timetracker that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Timetracker
          agent.post('/api/timetrackers')
            .send(timetracker)
            .expect(200)
            .end(function (timetrackerSaveErr, timetrackerSaveRes) {
              // Handle Timetracker save error
              if (timetrackerSaveErr) {
                return done(timetrackerSaveErr);
              }

              // Set assertions on new Timetracker
              (timetrackerSaveRes.body.name).should.equal(timetracker.name);
              should.exist(timetrackerSaveRes.body.user);
              should.equal(timetrackerSaveRes.body.user._id, orphanId);

              // force the Timetracker to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Timetracker
                    agent.get('/api/timetrackers/' + timetrackerSaveRes.body._id)
                      .expect(200)
                      .end(function (timetrackerInfoErr, timetrackerInfoRes) {
                        // Handle Timetracker error
                        if (timetrackerInfoErr) {
                          return done(timetrackerInfoErr);
                        }

                        // Set assertions
                        (timetrackerInfoRes.body._id).should.equal(timetrackerSaveRes.body._id);
                        (timetrackerInfoRes.body.name).should.equal(timetracker.name);
                        should.equal(timetrackerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Timetracker.remove().exec(done);
    });
  });
});
