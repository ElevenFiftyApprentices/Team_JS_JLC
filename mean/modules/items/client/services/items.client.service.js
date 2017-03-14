// Items service used to communicate Items REST endpoints
(function () {
  'use strict';

  angular
    .module('items')
    .factory('ItemsService', ItemsService);

  ItemsService.$inject = ['$resource'];

  function ItemsService($resource) {
    return $resource('api/items/:itemId', {
      itemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
