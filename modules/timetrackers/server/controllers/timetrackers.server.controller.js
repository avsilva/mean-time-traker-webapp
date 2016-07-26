'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
  mongoose = require('mongoose'),
  Timetracker = mongoose.model('Timetracker'),
  Project = mongoose.model('Project'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');



/**
* Create a Timetracker
*/
exports.create = function(req, res) {
  var timetracker = new Timetracker(req.body);
  timetracker.user = req.user;
  //timetracker.project = req.project;

  timetracker.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //workaround to deal with angular 1.3.20 date format nightmare
      timetracker.start_date = '';
      res.jsonp(timetracker);
    }
  });
};

/**
* Show the current Timetracker
*/
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var timetracker = req.timetracker ? req.timetracker.toJSON() : {};

  //timetracker.start_date = new Date(timetracker.start_date);
  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  timetracker.isCurrentUserOwner = req.user && timetracker.user && timetracker.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(timetracker);
};

/**
* Update a Timetracker
*/
exports.update = function(req, res) {

  var timetracker = req.timetracker ;
  timetracker = _.extend(timetracker , req.body);

  timetracker.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      //timetracker.start_date = new Date(timetracker.start_date);
      //workaround to deal with angular 1.3.20 date format nightmare
      timetracker.start_date = '';
      res.jsonp(timetracker);
    }
  });
};

/**
* Delete an Timetracker
*/
exports.delete = function(req, res) {
  var timetracker = req.timetracker ;

  timetracker.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timetracker);
    }
  });
};

/**
* List of Timetrackers
*/
exports.list = function(req, res) {

  var pageNumber = req.query.pageNumber, perPage = req.query.perPage, userId = req.query.userId, projectId = req.query.projectId, filter = {};

  console.log(projectId);

  if (userId !== undefined){
    filter.user = { '_id': userId };
  }

  if (projectId !== undefined){
    filter.projectid = { '_id': projectId };
  }

  Timetracker
  .find(filter)
  .sort('-start_date')
  .skip((pageNumber-1)*perPage)
  .limit(parseInt(perPage))
  .populate('user', 'displayName')
  .populate('projectid', 'name')
  .exec(function(err, timetrackers) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Timetracker.count(filter).exec(function(err, count) {
        res.jsonp({
          'TotalCount': count,
          'Array': timetrackers
        });
      });
      //res.jsonp(timetrackers);
    }
  });
};


/**
* Sum Timetrackers by project
*/
exports.sum = function(req, res) {

  //var Projects = mongoose.model('Projects');

  Timetracker.aggregate([
    { $group : { _id : '$projectid', sumQuantity: { $sum: '$hours' } } },
    { $lookup: { from: 'Project', localField: '_id', foreignField: '_id', as: 'timeproject' } }
  ])
  .exec(function(err, result) {
    Project.populate(result, { path: '_id' }, function(err, populatedResults) {
      res.jsonp(populatedResults);
    });
    //res.jsonp(result);
  });

  /*Timetracker.aggregate()
  //.match({project : 'CIMLT'})
  .group({ _id: '$projectid' , sumQuantity : { $sum: '$hours' } })
  .lookup({ from: 'Projects', localField: '$projectid', foreignField: '_id', as: 'timeproject'})
  //.group({ _id: '' , sumQuantity : { $sum: "$hours" } })
  .exec(function(err, result) {
    res.jsonp(result);
  }
);*/
};

/**
* Timetracker middleware
*/
exports.timetrackerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Timetracker is invalid'
    });
  }

  Timetracker.findById(id)
  .populate('user', 'displayName')
  .populate('projectid', 'name')
  .exec(function (err, timetracker) {
    if (err) {
      return next(err);
    } else if (!timetracker) {
      return res.status(404).send({
        message: 'No Timetracker with that identifier has been found'
      });
    }
    req.timetracker = timetracker;
    next();
  });
};
