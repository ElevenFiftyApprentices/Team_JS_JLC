(function () {
  'use strict';

  angular
    .module('shoppinglists')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Shopping Lists',
      state: 'shoppinglists',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'shoppinglists', {
      title: 'Saved Shopping Lists',
      state: 'shoppinglists.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'shoppinglists', {
      title: 'Make New Shopping List',
      state: 'shoppinglists.create',
      roles: ['user']
    });
  }
}());
