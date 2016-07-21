(function () {
  'use strict';

  angular
    .module('timetrackers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Timetrackers',
      state: 'timetrackers',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown chart item
    Menus.addSubMenuItem('topbar', 'timetrackers', {
      title: 'List Timetrackers',
      state: 'timetrackers.chart',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'timetrackers', {
      title: 'Create Timetracker',
      state: 'timetrackers.create',
      roles: ['user']
    });
  }
})();
