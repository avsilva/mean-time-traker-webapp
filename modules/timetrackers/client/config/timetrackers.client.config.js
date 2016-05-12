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
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'timetrackers', {
      title: 'List Timetrackers',
      state: 'timetrackers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'timetrackers', {
      title: 'Create Timetracker',
      state: 'timetrackers.create',
      roles: ['user']
    });
  }
})();
