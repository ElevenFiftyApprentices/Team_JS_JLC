// Lists service used to communicate Lists REST endpoints
(function () {
  'use strict';

  angular
    .module('lists')
    .factory('ListsService', ListsService);

  ListsService.$inject = ['$resource'];

  function ListsService($resource) {
    return $resource('api/lists/:listId', {
      listId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
