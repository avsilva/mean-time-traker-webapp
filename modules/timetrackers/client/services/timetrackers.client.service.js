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

//Timetrackers aggregate service used to communicate Timetrackers REST endpoints
(function () {
  'use strict';

  angular
    .module('timetrackers')
    .factory('TimetrackersAggService', TimetrackersAggService);

  TimetrackersAggService.$inject = ['$resource'];

  function TimetrackersAggService($resource) {

    return $resource('api/sumtimetrackers/', {
      timetrackerId: '@_id'
    }, {
      sum: { method:'GET', params:{}, isArray: true },
      update: {
        method: 'PUT'
      }
    });
  }
})();
