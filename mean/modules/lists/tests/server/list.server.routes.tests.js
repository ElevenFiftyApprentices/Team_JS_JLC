'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  List = mongoose.model('List'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  list;

/**
 * List routes tests
 */
describe('List CRUD tests', function () {

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

    // Save a user to the test db and create new List
    user.save(function () {
      list = {
        name: 'List name'
      };

      done();
    });
  });

  it('should be able to save a List if logged in', function (done) {
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

        // Save a new List
        agent.post('/api/lists')
          .send(list)
          .expect(200)
          .end(function (listSaveErr, listSaveRes) {
            // Handle List save error
            if (listSaveErr) {
              return done(listSaveErr);
            }

            // Get a list of Lists
            agent.get('/api/lists')
              .end(function (listsGetErr, listsGetRes) {
                // Handle Lists save error
                if (listsGetErr) {
                  return done(listsGetErr);
                }

                // Get Lists list
                var lists = listsGetRes.body;

                // Set assertions
                (lists[0].user._id).should.equal(userId);
                (lists[0].name).should.match('List name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an List if not logged in', function (done) {
    agent.post('/api/lists')
      .send(list)
      .expect(403)
      .end(function (listSaveErr, listSaveRes) {
        // Call the assertion callback
        done(listSaveErr);
      });
  });

  it('should not be able to save an List if no name is provided', function (done) {
    // Invalidate name field
    list.name = '';

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

        // Save a new List
        agent.post('/api/lists')
          .send(list)
          .expect(400)
          .end(function (listSaveErr, listSaveRes) {
            // Set message assertion
            (listSaveRes.body.message).should.match('Please fill List name');

            // Handle List save error
            done(listSaveErr);
          });
      });
  });

  it('should be able to update an List if signed in', function (done) {
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

        // Save a new List
        agent.post('/api/lists')
          .send(list)
          .expect(200)
          .end(function (listSaveErr, listSaveRes) {
            // Handle List save error
            if (listSaveErr) {
              return done(listSaveErr);
            }

            // Update List name
            list.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing List
            agent.put('/api/lists/' + listSaveRes.body._id)
              .send(list)
              .expect(200)
              .end(function (listUpdateErr, listUpdateRes) {
                // Handle List update error
                if (listUpdateErr) {
                  return done(listUpdateErr);
                }

                // Set assertions
                (listUpdateRes.body._id).should.equal(listSaveRes.body._id);
                (listUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Lists if not signed in', function (done) {
    // Create new List model instance
    var listObj = new List(list);

    // Save the list
    listObj.save(function () {
      // Request Lists
      request(app).get('/api/lists')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single List if not signed in', function (done) {
    // Create new List model instance
    var listObj = new List(list);

    // Save the List
    listObj.save(function () {
      request(app).get('/api/lists/' + listObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', list.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single List with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/lists/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'List is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single List which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent List
    request(app).get('/api/lists/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No List with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an List if signed in', function (done) {
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

        // Save a new List
        agent.post('/api/lists')
          .send(list)
          .expect(200)
          .end(function (listSaveErr, listSaveRes) {
            // Handle List save error
            if (listSaveErr) {
              return done(listSaveErr);
            }

            // Delete an existing List
            agent.delete('/api/lists/' + listSaveRes.body._id)
              .send(list)
              .expect(200)
              .end(function (listDeleteErr, listDeleteRes) {
                // Handle list error error
                if (listDeleteErr) {
                  return done(listDeleteErr);
                }

                // Set assertions
                (listDeleteRes.body._id).should.equal(listSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an List if not signed in', function (done) {
    // Set List user
    list.user = user;

    // Create new List model instance
    var listObj = new List(list);

    // Save the List
    listObj.save(function () {
      // Try deleting List
      request(app).delete('/api/lists/' + listObj._id)
        .expect(403)
        .end(function (listDeleteErr, listDeleteRes) {
          // Set message assertion
          (listDeleteRes.body.message).should.match('User is not authorized');

          // Handle List error error
          done(listDeleteErr);
        });

    });
  });

  it('should be able to get a single List that has an orphaned user reference', function (done) {
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

          // Save a new List
          agent.post('/api/lists')
            .send(list)
            .expect(200)
            .end(function (listSaveErr, listSaveRes) {
              // Handle List save error
              if (listSaveErr) {
                return done(listSaveErr);
              }

              // Set assertions on new List
              (listSaveRes.body.name).should.equal(list.name);
              should.exist(listSaveRes.body.user);
              should.equal(listSaveRes.body.user._id, orphanId);

              // force the List to have an orphaned user reference
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

                    // Get the List
                    agent.get('/api/lists/' + listSaveRes.body._id)
                      .expect(200)
                      .end(function (listInfoErr, listInfoRes) {
                        // Handle List error
                        if (listInfoErr) {
                          return done(listInfoErr);
                        }

                        // Set assertions
                        (listInfoRes.body._id).should.equal(listSaveRes.body._id);
                        (listInfoRes.body.name).should.equal(list.name);
                        should.equal(listInfoRes.body.user, undefined);

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
      List.remove().exec(done);
    });
  });
});
