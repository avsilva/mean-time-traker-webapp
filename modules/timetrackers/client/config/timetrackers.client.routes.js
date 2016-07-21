(function () {
  'use strict';

  angular
    .module('timetrackers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('timetrackers', {
        abstract: true,
        url: '/timetrackers',
        template: '<ui-view/>'
      })
      /*.state('timetrackers.list', {
        url: '',
        templateUrl: 'modules/timetrackers/client/views/list-timetrackers.client.view.html',
        controller: 'TimetrackersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Timetrackers List'
        }
      })*/
      .state('timetrackers.chart', {
        url: '',
        templateUrl: 'modules/timetrackers/client/views/chart-timetrackers.client.view.html',
        controller: 'TimetrackersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Timetrackers Chart'
        }
      })
      .state('timetrackers.create', {
        url: '/create',
        templateUrl: 'modules/timetrackers/client/views/form-timetracker.client.view.html',
        controller: 'TimetrackersController',
        controllerAs: 'vm',
        resolve: {
          timetrackerResolve: newTimetracker
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Timetrackers Create'
        }
      })
      .state('timetrackers.edit', {
        url: '/:timetrackerId/edit',
        templateUrl: 'modules/timetrackers/client/views/form-timetracker.client.view.html',
        controller: 'TimetrackersController',
        controllerAs: 'vm',
        resolve: {
          timetrackerResolve: getTimetracker
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Timetracker {{ timetrackerResolve.name }}'
        }
      })
      .state('timetrackers.view', {
        url: '/:timetrackerId',
        templateUrl: 'modules/timetrackers/client/views/view-timetracker.client.view.html',
        controller: 'TimetrackersController',
        controllerAs: 'vm',
        resolve: {
          timetrackerResolve: getTimetracker
        },
        data:{
          pageTitle: 'Timetracker {{ timetrackerResolve.name }}'
        }
      });
  }

  getTimetracker.$inject = ['$stateParams', 'TimetrackersService'];

  function getTimetracker($stateParams, TimetrackersService) {
    return TimetrackersService.get({
      timetrackerId: $stateParams.timetrackerId
    }).$promise;
  }

  newTimetracker.$inject = ['TimetrackersService'];

  function newTimetracker(TimetrackersService) {
    return new TimetrackersService();
  }
})();
