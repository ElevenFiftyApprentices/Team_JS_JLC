(function () {
  'use strict';

  describe('Items Route Tests', function () {
    // Initialize global variables
    var $scope,
      ItemsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ItemsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ItemsService = _ItemsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('items');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/items');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ItemsController,
          mockItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('items.view');
          $templateCache.put('modules/items/client/views/view-item.client.view.html', '');

          // create mock Item
          mockItem = new ItemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Item Name'
          });

          // Initialize Controller
          ItemsController = $controller('ItemsController as vm', {
            $scope: $scope,
            itemResolve: mockItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:itemId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.itemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            itemId: 1
          })).toEqual('/items/1');
        }));

        it('should attach an Item to the controller scope', function () {
          expect($scope.vm.item._id).toBe(mockItem._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/items/client/views/view-item.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ItemsController,
          mockItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('items.create');
          $templateCache.put('modules/items/client/views/form-item.client.view.html', '');

          // create mock Item
          mockItem = new ItemsService();

          // Initialize Controller
          ItemsController = $controller('ItemsController as vm', {
            $scope: $scope,
            itemResolve: mockItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.itemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/items/create');
        }));

        it('should attach an Item to the controller scope', function () {
          expect($scope.vm.item._id).toBe(mockItem._id);
          expect($scope.vm.item._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/items/client/views/form-item.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ItemsController,
          mockItem;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('items.edit');
          $templateCache.put('modules/items/client/views/form-item.client.view.html', '');

          // create mock Item
          mockItem = new ItemsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Item Name'
          });

          // Initialize Controller
          ItemsController = $controller('ItemsController as vm', {
            $scope: $scope,
            itemResolve: mockItem
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:itemId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.itemResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            itemId: 1
          })).toEqual('/items/1/edit');
        }));

        it('should attach an Item to the controller scope', function () {
          expect($scope.vm.item._id).toBe(mockItem._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/items/client/views/form-item.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
