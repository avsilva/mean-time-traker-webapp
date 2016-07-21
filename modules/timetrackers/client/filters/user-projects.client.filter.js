(function () {
  'use strict';

  angular
    .module('timetrackers')
    .filter('userProjects', userProjects);

  userProjects.$inject = ['Authentication'];

  function userProjects(Authentication) {
    return function (input) {
      // User projects directive logic
      // ...
      var user_id = Authentication.user._id;

      var log = [];
      angular.forEach(input, function(value, key) {
        if (value.contributors.indexOf(user_id) !== -1){
          this.push(value);
        }
      }, log);
      return log;
    };
  }
})();
