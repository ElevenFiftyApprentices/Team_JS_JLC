(function () {
  'use strict';

  // Items controller
  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'itemResolve'];

  function ItemsController ($scope, $state, $window, Authentication, item) {
    var vm = this;

    vm.authentication = Authentication;
    vm.item = item;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Item
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.item.$remove($state.go('items.list'));
      }
    }

    // Save Item
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itemForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.item._id) {
        vm.item.$update(successCallback, errorCallback);
      } else {
        vm.item.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('items.view', {
          itemId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
