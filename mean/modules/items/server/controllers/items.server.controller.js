'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Item = mongoose.model('Item'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Item
 */
exports.create = function(req, res) {
  var item = new Item(req.body);
  item.user = req.user;

  item.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(item);
    }
  });
};

/**
 * Show the current Item
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var item = req.item ? req.item.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  item.isCurrentUserOwner = req.user && item.user && item.user._id.toString() === req.user._id.toString();

  res.jsonp(item);
};

/**
 * Update a Item
 */
exports.update = function(req, res) {
  var item = req.item;

  item = _.extend(item, req.body);

  item.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * Delete an Item
 */
exports.delete = function(req, res) {
  var item = req.item;

  item.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * List of Items
 */
exports.list = function(req, res) {
  Item.find().sort('-created').populate('user', 'displayName').exec(function(err, items) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(items);
    }
  });
};

/**
 * Item middleware
 */
exports.itemByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Item is invalid'
    });
  }

  Item.findById(id).populate('user', 'displayName').exec(function (err, item) {
    if (err) {
      return next(err);
    } else if (!item) {
      return res.status(404).send({
        message: 'No Item with that identifier has been found'
      });
    }
    req.item = item;
    next();
  });
};
