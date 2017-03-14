(function () {
  'use strict';

  // Lists controller
  angular
    .module('lists')
    .controller('ListsController', ListsController);

  ListsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'listResolve'];

  function ListsController ($scope, $state, $window, Authentication, list) {
    var vm = this;

    vm.authentication = Authentication;
    vm.list = list;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing List
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.list.$remove($state.go('lists.list'));
      }
    }

    // Save List
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.listForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.list._id) {
        vm.list.$update(successCallback, errorCallback);
      } else {
        vm.list.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('lists.view', {
          listId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
