(function () {
  'use strict';

  // Timetrackers controller
  angular
    .module('timetrackers')
    .controller('TimetrackersController', TimetrackersController);

  TimetrackersController.$inject = ['$scope', '$state', 'Authentication', 'timetrackerResolve', '$filter', 'ProjectsService'];

  function TimetrackersController ($scope, $state, Authentication, timetracker, $filter, ProjectsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.timetracker = timetracker;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.timetracker.start_date = new Date(vm.timetracker.start_date);

    /*$scope.projects = ProjectsService.query({_id: vm.timetracker.project });
    $scope.projects.$promise.then(function (result) {
        $scope.projects = result;
        vm.timetracker.project = $filter('filter')($scope.projects, {_id: vm.timetracker.project})[0];
        console.log(vm.timetracker);
    });*/

    vm.projects = ProjectsService.query();
    /*vm.projects.$promise.then(function (result) {
        vm.projects = result;

        if (vm.timetracker.project != undefined){

            //vm.timetracker.project = $filter('filter')(vm.projects, {_id: vm.timetracker.project})[0];
            vm.timetracker.projectame = $filter('filter')(vm.projects, {_id: vm.timetracker.project.name})[0];
            console.log(vm.timetracker);
        }

    });*/

    //console.log(vm.timetracker);

    // Remove existing Timetracker
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.timetracker.$remove($state.go('timetrackers.list'));
      }
    }

    // Save Timetracker
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.timetrackerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.timetracker._id) {
        //console.log(vm.timetracker.start_date);
        //vm.timetracker.start_date = new Date('2014-04-04');
        //console.log(vm.timetracker.start_date);
        //vm.timetracker.project = angular.fromJson(vm.timetracker.project);
        vm.timetracker.$update(successCallback, errorCallback);
      } else {

        //vm.timetracker.project = angular.fromJson(vm.timetracker.project);
        console.log(vm.timetracker);
        vm.timetracker.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log('success');
        $state.go('timetrackers.view', {
          timetrackerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
