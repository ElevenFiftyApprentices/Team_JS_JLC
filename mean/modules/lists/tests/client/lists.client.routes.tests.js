(function () {
  'use strict';

  describe('Lists Route Tests', function () {
    // Initialize global variables
    var $scope,
      ListsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ListsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ListsService = _ListsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('lists');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/lists');
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
          ListsController,
          mockList;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('lists.view');
          $templateCache.put('modules/lists/client/views/view-list.client.view.html', '');

          // create mock List
          mockList = new ListsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'List Name'
          });

          // Initialize Controller
          ListsController = $controller('ListsController as vm', {
            $scope: $scope,
            listResolve: mockList
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:listId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.listResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            listId: 1
          })).toEqual('/lists/1');
        }));

        it('should attach an List to the controller scope', function () {
          expect($scope.vm.list._id).toBe(mockList._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/lists/client/views/view-list.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ListsController,
          mockList;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('lists.create');
          $templateCache.put('modules/lists/client/views/form-list.client.view.html', '');

          // create mock List
          mockList = new ListsService();

          // Initialize Controller
          ListsController = $controller('ListsController as vm', {
            $scope: $scope,
            listResolve: mockList
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.listResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/lists/create');
        }));

        it('should attach an List to the controller scope', function () {
          expect($scope.vm.list._id).toBe(mockList._id);
          expect($scope.vm.list._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/lists/client/views/form-list.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ListsController,
          mockList;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('lists.edit');
          $templateCache.put('modules/lists/client/views/form-list.client.view.html', '');

          // create mock List
          mockList = new ListsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'List Name'
          });

          // Initialize Controller
          ListsController = $controller('ListsController as vm', {
            $scope: $scope,
            listResolve: mockList
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:listId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.listResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            listId: 1
          })).toEqual('/lists/1/edit');
        }));

        it('should attach an List to the controller scope', function () {
          expect($scope.vm.list._id).toBe(mockList._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/lists/client/views/form-list.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
