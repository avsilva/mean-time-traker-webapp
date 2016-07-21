'use strict';

/**
* Module dependencies.
*/
var path = require('path'),
  mongoose = require('mongoose'),
  Timetracker = mongoose.model('Timetracker'),
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

  var pageNumber = req.query.pageNumber;
  var perPage = req.query.perPage;
  var userId = req.query.userId;

  Timetracker
  .find({ 'user': { '_id': userId } })
  .sort('-start_date')
  .skip((pageNumber-1)*perPage)
  .limit(parseInt(perPage))
  .populate('user', 'displayName')
  .exec(function(err, timetrackers) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Timetracker.count({ 'user': { '_id': userId } }).exec(function(err, count) {
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

  /*Timetracker.aggregate([
    {$group : {_id : "$project", sumQuantity: { $sum: "$hours" } }}
  ])*/

  Timetracker.aggregate()
  //.match({project : 'CIMLT'})
  .group({ _id: '$project' , sumQuantity : { $sum: '$hours' } })
  //.group({ _id: '' , sumQuantity : { $sum: "$hours" } })
  .exec(function(err, result) {
    res.jsonp(result);
  }
  );
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

  Timetracker.findById(id).populate('user', 'displayName').exec(function (err, timetracker) {
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
