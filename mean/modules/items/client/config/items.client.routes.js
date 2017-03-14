(function () {
  'use strict';

  angular
    .module('items')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('items', {
        abstract: true,
        url: '/items',
        template: '<ui-view/>'
      })
      .state('items.list', {
        url: '',
        templateUrl: 'modules/items/client/views/list-items.client.view.html',
        controller: 'ItemsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Items List'
        }
      })
      .state('items.create', {
        url: '/create',
        templateUrl: 'modules/items/client/views/form-item.client.view.html',
        controller: 'ItemsController',
        controllerAs: 'vm',
        resolve: {
          itemResolve: newItem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Items Create'
        }
      })
      .state('items.edit', {
        url: '/:itemId/edit',
        templateUrl: 'modules/items/client/views/form-item.client.view.html',
        controller: 'ItemsController',
        controllerAs: 'vm',
        resolve: {
          itemResolve: getItem
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Item {{ itemResolve.name }}'
        }
      })
      .state('items.view', {
        url: '/:itemId',
        templateUrl: 'modules/items/client/views/view-item.client.view.html',
        controller: 'ItemsController',
        controllerAs: 'vm',
        resolve: {
          itemResolve: getItem
        },
        data: {
          pageTitle: 'Item {{ itemResolve.name }}'
        }
      });
  }

  getItem.$inject = ['$stateParams', 'ItemsService'];

  function getItem($stateParams, ItemsService) {
    return ItemsService.get({
      itemId: $stateParams.itemId
    }).$promise;
  }

  newItem.$inject = ['ItemsService'];

  function newItem(ItemsService) {
    return new ItemsService();
  }
}());
