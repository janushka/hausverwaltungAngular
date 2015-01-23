'use strict';

describe('Controller: NewBookingController', function () {

  // load the controller's module
  beforeEach(module('hausverwaltungAngularApp'));

  var NewBookingController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewBookingController = $controller('NewBookingController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
