(function () {
  'use strict';

  angular
    .module('projects')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Projects',
      state: 'projects',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'projects', {
      title: 'List Projects',
      state: 'projects.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'projects', {
      title: 'Create Project',
      state: 'projects.create',
      roles: ['admin']
    });
  }
})();
