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
    name:{
      type: String,
      default: ''
    },
    // isChecked:{
    //   type: Boolean,
    //   default: false
    // },
  },
  items: {
    type: [],
    default: []
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
  },
  color: {
    type: String,
    default: '',
    required: 'Please choose font hex color for shopping list',
    trim: true
  }
});

mongoose.model('List', ListSchema);
