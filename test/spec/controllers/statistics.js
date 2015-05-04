'use strict';

describe('Controller: StatisticsController', function () {

  // load the controller's module
  beforeEach(module('hausverwaltungAngularApp'));

  var StatisticsController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StatisticsController = $controller('StatisticsController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
