(function () {
  'use strict';

  angular
    .module('lists')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('lists', {
        abstract: true,
        url: '/lists',
        template: '<ui-view/>'
      })
      .state('lists.list', {
        url: '',
        templateUrl: 'modules/lists/client/views/list-lists.client.view.html',
        controller: 'ListsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Lists List'
        }
      })
      .state('lists.create', {
        url: '/create',
        templateUrl: 'modules/lists/client/views/form-list.client.view.html',
        controller: 'ListsController',
        controllerAs: 'vm',
        resolve: {
          listResolve: newList
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Lists Create'
        }
      })
      .state('lists.edit', {
        url: '/:listId/edit',
        templateUrl: 'modules/lists/client/views/form-list.client.view.html',
        controller: 'ListsController',
        controllerAs: 'vm',
        resolve: {
          listResolve: getList
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit List {{ listResolve.name }}'
        }
      })
      .state('lists.view', {
        url: '/:listId',
        templateUrl: 'modules/lists/client/views/view-list.client.view.html',
        controller: 'ListsController',
        controllerAs: 'vm',
        resolve: {
          listResolve: getList
        },
        data: {
          pageTitle: 'List {{ listResolve.name }}'
        }
      });
  }

  getList.$inject = ['$stateParams', 'ListsService'];

  function getList($stateParams, ListsService) {
    return ListsService.get({
      listId: $stateParams.listId
    }).$promise;
  }

  newList.$inject = ['ListsService'];

  function newList(ListsService) {
    return new ListsService();
  }
}());
