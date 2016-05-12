(function () {
  'use strict';

  describe('Timetrackers Route Tests', function () {
    // Initialize global variables
    var $scope,
      TimetrackersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TimetrackersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TimetrackersService = _TimetrackersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('timetrackers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/timetrackers');
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
          TimetrackersController,
          mockTimetracker;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('timetrackers.view');
          $templateCache.put('modules/timetrackers/client/views/view-timetracker.client.view.html', '');

          // create mock Timetracker
          mockTimetracker = new TimetrackersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Timetracker Name'
          });

          //Initialize Controller
          TimetrackersController = $controller('TimetrackersController as vm', {
            $scope: $scope,
            timetrackerResolve: mockTimetracker
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:timetrackerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.timetrackerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            timetrackerId: 1
          })).toEqual('/timetrackers/1');
        }));

        it('should attach an Timetracker to the controller scope', function () {
          expect($scope.vm.timetracker._id).toBe(mockTimetracker._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/timetrackers/client/views/view-timetracker.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TimetrackersController,
          mockTimetracker;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('timetrackers.create');
          $templateCache.put('modules/timetrackers/client/views/form-timetracker.client.view.html', '');

          // create mock Timetracker
          mockTimetracker = new TimetrackersService();

          //Initialize Controller
          TimetrackersController = $controller('TimetrackersController as vm', {
            $scope: $scope,
            timetrackerResolve: mockTimetracker
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.timetrackerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/timetrackers/create');
        }));

        it('should attach an Timetracker to the controller scope', function () {
          expect($scope.vm.timetracker._id).toBe(mockTimetracker._id);
          expect($scope.vm.timetracker._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/timetrackers/client/views/form-timetracker.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TimetrackersController,
          mockTimetracker;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('timetrackers.edit');
          $templateCache.put('modules/timetrackers/client/views/form-timetracker.client.view.html', '');

          // create mock Timetracker
          mockTimetracker = new TimetrackersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Timetracker Name'
          });

          //Initialize Controller
          TimetrackersController = $controller('TimetrackersController as vm', {
            $scope: $scope,
            timetrackerResolve: mockTimetracker
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:timetrackerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.timetrackerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            timetrackerId: 1
          })).toEqual('/timetrackers/1/edit');
        }));

        it('should attach an Timetracker to the controller scope', function () {
          expect($scope.vm.timetracker._id).toBe(mockTimetracker._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/timetrackers/client/views/form-timetracker.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
