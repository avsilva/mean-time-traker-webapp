//Timetrackers service used to communicate Timetrackers REST endpoints
(function () {
  'use strict';

  angular
    .module('timetrackers')
    .factory('TimetrackersService', TimetrackersService);

  TimetrackersService.$inject = ['$resource'];

  function TimetrackersService($resource) {

    return $resource('api/timetrackers/:timetrackerId', {
      timetrackerId: '@_id'
    }, {
      query: { method:'GET', params:{}, isArray: false },
      update: {
        method: 'PUT'
      }
    });
  }
})();
