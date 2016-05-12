'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Timetracker Schema
 */
var TimetrackerSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  start_date: {
    type: Date,
    default: '',
    required: 'Please fill Timetracker start date',
    trim: true
  },
  hours: {
    type: Number,
    required: 'Please fill Timetracker hours',
    trim: true
  },
  /*project: {
    type: Schema.ObjectId,
    ref: 'Project'
  },*/
  project: {
    type: Object,
    required: 'Please fill Timetracker project',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Timetracker', TimetrackerSchema);
