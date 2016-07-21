(function () {
  'use strict';

  // Projects controller
  angular
  .module('projects')
  .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$scope', '$state', 'Authentication', 'projectResolve', 'Admin'];

  function ProjectsController ($scope, $state, Authentication, project, Admin) {
    var vm = this;

    vm.authentication = Authentication;
    vm.project = project;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.project_users_model = [];
    vm.project_users_data = [];

    if (vm.project._id) {
      vm.project.contributors.forEach(function(currentValue,index,arr){
        vm.project_users_model.push({ '_id': currentValue });
      });
    }

    vm.project_users_settings = {
      smartButtonMaxItems: 3,
      displayProp: 'displayName',
      idProp: '_id',
      externalIdProp: '_id'
    };

    Admin.query(function (data) {
      vm.users = data;
      vm.project_users_data = data;
    });

    // Remove existing Project
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.project.$remove($state.go('projects.list'));
      }
    }

    // Save Project
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.projectForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.project._id) {
        vm.project.contributors = vm.project_users_model;
        vm.project.$update(successCallback, errorCallback);
      } else {
        vm.project.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('projects.view', {
          projectId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
