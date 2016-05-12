(function () {
  'use strict';

  angular
    .module('timetrackers')
    .controller('TimetrackersListController', TimetrackersListController);

  TimetrackersListController.$inject = ['TimetrackersService', 'ProjectsService', '$filter'];

  /*function dateStringToObject (data) {
      for(var i=0; i < data.length; i++ ){
        data[i].start_date = new Date(data[i].start_date);
        }

      return data;
    }*/

  function TimetrackersListController(TimetrackersService, ProjectsService, $filter) {
    var vm = this;
    //var projects = ProjectsService.query();

    /*var appendProject = function appendProject(p) {
			// You could substitue use of filter here with underscore etc.
			p.project = $filter('filter')(projects, {_id: p.project})[0];
		};*/

    vm.timetrackers = TimetrackersService.query();
    /*vm.timetrackers.$promise.then(function (result) {
      var timetrackers = result;
        timetrackers.forEach(appendProject);
    });*/

    //dateStringToObject(vm.timetrackers);
  }
})();
