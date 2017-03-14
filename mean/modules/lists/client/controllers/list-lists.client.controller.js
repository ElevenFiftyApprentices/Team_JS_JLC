(function () {
  'use strict';

  angular
    .module('lists')
    .controller('ListsListController', ListsListController);

  ListsListController.$inject = ['ListsService'];

  function ListsListController(ListsService) {
    var vm = this;

    vm.lists = ListsService.query();
  }
}());
