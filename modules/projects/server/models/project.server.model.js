'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Project name',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  contract_value : {
    type: Number,
    default: ''
  },
  /*contributors : {
    type: [{
      type: Schema.ObjectId,
      ref: 'User'
    }]
  },*/
  contributors : {
    type: [{
      type: Schema.ObjectId,
      ref: 'User'
    }]
  }
});

mongoose.model('Project', ProjectSchema);
