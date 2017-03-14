'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Item = mongoose.model('Item'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  item;

/**
 * Item routes tests
 */
describe('Item CRUD tests', function () {

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

    // Save a user to the test db and create new Item
    user.save(function () {
      item = {
        name: 'Item name'
      };

      done();
    });
  });

  it('should be able to save a Item if logged in', function (done) {
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

        // Save a new Item
        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Handle Item save error
            if (itemSaveErr) {
              return done(itemSaveErr);
            }

            // Get a list of Items
            agent.get('/api/items')
              .end(function (itemsGetErr, itemsGetRes) {
                // Handle Items save error
                if (itemsGetErr) {
                  return done(itemsGetErr);
                }

                // Get Items list
                var items = itemsGetRes.body;

                // Set assertions
                (items[0].user._id).should.equal(userId);
                (items[0].name).should.match('Item name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Item if not logged in', function (done) {
    agent.post('/api/items')
      .send(item)
      .expect(403)
      .end(function (itemSaveErr, itemSaveRes) {
        // Call the assertion callback
        done(itemSaveErr);
      });
  });

  it('should not be able to save an Item if no name is provided', function (done) {
    // Invalidate name field
    item.name = '';

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

        // Save a new Item
        agent.post('/api/items')
          .send(item)
          .expect(400)
          .end(function (itemSaveErr, itemSaveRes) {
            // Set message assertion
            (itemSaveRes.body.message).should.match('Please fill Item name');

            // Handle Item save error
            done(itemSaveErr);
          });
      });
  });

  it('should be able to update an Item if signed in', function (done) {
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

        // Save a new Item
        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Handle Item save error
            if (itemSaveErr) {
              return done(itemSaveErr);
            }

            // Update Item name
            item.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Item
            agent.put('/api/items/' + itemSaveRes.body._id)
              .send(item)
              .expect(200)
              .end(function (itemUpdateErr, itemUpdateRes) {
                // Handle Item update error
                if (itemUpdateErr) {
                  return done(itemUpdateErr);
                }

                // Set assertions
                (itemUpdateRes.body._id).should.equal(itemSaveRes.body._id);
                (itemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Items if not signed in', function (done) {
    // Create new Item model instance
    var itemObj = new Item(item);

    // Save the item
    itemObj.save(function () {
      // Request Items
      request(app).get('/api/items')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Item if not signed in', function (done) {
    // Create new Item model instance
    var itemObj = new Item(item);

    // Save the Item
    itemObj.save(function () {
      request(app).get('/api/items/' + itemObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', item.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Item with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/items/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Item is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Item which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Item
    request(app).get('/api/items/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Item with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Item if signed in', function (done) {
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

        // Save a new Item
        agent.post('/api/items')
          .send(item)
          .expect(200)
          .end(function (itemSaveErr, itemSaveRes) {
            // Handle Item save error
            if (itemSaveErr) {
              return done(itemSaveErr);
            }

            // Delete an existing Item
            agent.delete('/api/items/' + itemSaveRes.body._id)
              .send(item)
              .expect(200)
              .end(function (itemDeleteErr, itemDeleteRes) {
                // Handle item error error
                if (itemDeleteErr) {
                  return done(itemDeleteErr);
                }

                // Set assertions
                (itemDeleteRes.body._id).should.equal(itemSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Item if not signed in', function (done) {
    // Set Item user
    item.user = user;

    // Create new Item model instance
    var itemObj = new Item(item);

    // Save the Item
    itemObj.save(function () {
      // Try deleting Item
      request(app).delete('/api/items/' + itemObj._id)
        .expect(403)
        .end(function (itemDeleteErr, itemDeleteRes) {
          // Set message assertion
          (itemDeleteRes.body.message).should.match('User is not authorized');

          // Handle Item error error
          done(itemDeleteErr);
        });

    });
  });

  it('should be able to get a single Item that has an orphaned user reference', function (done) {
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

          // Save a new Item
          agent.post('/api/items')
            .send(item)
            .expect(200)
            .end(function (itemSaveErr, itemSaveRes) {
              // Handle Item save error
              if (itemSaveErr) {
                return done(itemSaveErr);
              }

              // Set assertions on new Item
              (itemSaveRes.body.name).should.equal(item.name);
              should.exist(itemSaveRes.body.user);
              should.equal(itemSaveRes.body.user._id, orphanId);

              // force the Item to have an orphaned user reference
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

                    // Get the Item
                    agent.get('/api/items/' + itemSaveRes.body._id)
                      .expect(200)
                      .end(function (itemInfoErr, itemInfoRes) {
                        // Handle Item error
                        if (itemInfoErr) {
                          return done(itemInfoErr);
                        }

                        // Set assertions
                        (itemInfoRes.body._id).should.equal(itemSaveRes.body._id);
                        (itemInfoRes.body.name).should.equal(item.name);
                        should.equal(itemInfoRes.body.user, undefined);

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
      Item.remove().exec(done);
    });
  });
});
