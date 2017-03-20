'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Shoppinglist Schema
 */
var ShoppinglistSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please provide shopping list name',
    trim: true
  },
  color: {
    type: String,
    required: 'Please provide shopping list color',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  note: {
    type: String,
    default: '',
    ref: 'note'
  },
  items: {
    type: Array,
    default: []
  }

});

/*
  change update date to now, keep created date as initial date
*/
ShoppinglistSchema.pre('save', function(next) {
  var now = new Date();
  this.updated = now;
  if(!this.created) {
    this.created = now;
  }
  next();
});

mongoose.model('Shoppinglist', ShoppinglistSchema);