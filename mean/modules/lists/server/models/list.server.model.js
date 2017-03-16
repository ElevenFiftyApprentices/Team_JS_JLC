'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * List Schema
 */
var ListSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please choose a name for your shopping list',
    trim: true
  },
  item: {
    type: String,
    default: '',
    required: 'Please choose some items for your shopping list',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  },
  // Id: {
  //   type: Number,
  //   default:
  // },
  // UserId: {
  //   type: Number,
  //   default:
  // },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('List', ListSchema);
