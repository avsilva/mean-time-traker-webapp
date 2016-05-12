'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Timetrackers Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/timetrackers',
      permissions: '*'
    }, {
      resources: '/api/timetrackers/:timetrackerId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/timetrackers',
      permissions: ['get', 'post']
    }, {
      resources: '/api/timetrackers/:timetrackerId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/timetrackers',
      permissions: ['get']
    }, {
      resources: '/api/timetrackers/:timetrackerId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Timetrackers Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Timetracker is being processed and the current user created it then allow any manipulation
  if (req.timetracker && req.user && req.timetracker.user && req.timetracker.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
