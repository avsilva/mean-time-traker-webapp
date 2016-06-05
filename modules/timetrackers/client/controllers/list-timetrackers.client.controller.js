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
    vm.pageChanged = pageChanged;
    vm.pageSize = 10;
    vm.currentPage = 1;
    vm.totalTimeTrackers = 0;
    //var projects = ProjectsService.query();

    /*var appendProject = function appendProject(p) {
			// You could substitue use of filter here with underscore etc.
			p.project = $filter('filter')(projects, {_id: p.project})[0];
		};*/

    getPageData();

    function getPageData(){
      vm.timetrackers = TimetrackersService.query({ 'perPage': vm.pageSize, 'pageNumber': vm.currentPage });
      vm.timetrackers.$promise.then(function (result) {
        vm.timetrackers = result.Array;
        vm.totalTimeTrackers = result.TotalCount;
        //timetrackers.forEach(appendProject);
      });
    }

    // Change page
    function pageChanged(){
      getPageData();
    }

    //dateStringToObject(vm.timetrackers);
  }



})();
