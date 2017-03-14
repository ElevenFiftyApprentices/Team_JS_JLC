'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  List = mongoose.model('List'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a List
 */
exports.create = function(req, res) {
  var list = new List(req.body);
  list.user = req.user;

  list.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(list);
    }
  });
};

/**
 * Show the current List
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var list = req.list ? req.list.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  list.isCurrentUserOwner = req.user && list.user && list.user._id.toString() === req.user._id.toString();

  res.jsonp(list);
};

/**
 * Update a List
 */
exports.update = function(req, res) {
  var list = req.list;

  list = _.extend(list, req.body);

  list.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(list);
    }
  });
};

/**
 * Delete an List
 */
exports.delete = function(req, res) {
  var list = req.list;

  list.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(list);
    }
  });
};

/**
 * List of Lists
 */
exports.list = function(req, res) {
  List.find().sort('-created').populate('user', 'displayName').exec(function(err, lists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lists);
    }
  });
};

/**
 * List middleware
 */
exports.listByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'List is invalid'
    });
  }

  List.findById(id).populate('user', 'displayName').exec(function (err, list) {
    if (err) {
      return next(err);
    } else if (!list) {
      return res.status(404).send({
        message: 'No List with that identifier has been found'
      });
    }
    req.list = list;
    next();
  });
};
