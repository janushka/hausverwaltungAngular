'use strict';

describe('Controller: ContentController', function () {

  // load the controller's module
  beforeEach(module('hausverwaltungAngularApp'));

  var ContentController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContentController = $controller('ContentController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
