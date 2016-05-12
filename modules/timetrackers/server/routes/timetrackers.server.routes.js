'use strict';

/**
 * Module dependencies
 */
var timetrackersPolicy = require('../policies/timetrackers.server.policy'),
  timetrackers = require('../controllers/timetrackers.server.controller');

module.exports = function(app) {
  // Timetrackers Routes
  app.route('/api/timetrackers').all(timetrackersPolicy.isAllowed)
    .get(timetrackers.list)
    .post(timetrackers.create);

  app.route('/api/timetrackers/:timetrackerId').all(timetrackersPolicy.isAllowed)
    .get(timetrackers.read)
    .put(timetrackers.update)
    .delete(timetrackers.delete);

  // Finish by binding the Timetracker middleware
  app.param('timetrackerId', timetrackers.timetrackerByID);
};
