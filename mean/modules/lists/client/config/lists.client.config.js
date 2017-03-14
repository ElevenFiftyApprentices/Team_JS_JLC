(function () {
  'use strict';

  angular
    .module('lists')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Lists',
      state: 'lists',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'lists', {
      title: 'Show Lists',
      state: 'lists.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'lists', {
      title: 'Create List',
      state: 'lists.create',
      roles: ['user']
    });
  }
}());
