'use strict';

describe('Controller: EditBookingCtrl', function () {

  // load the controller's module
  beforeEach(module('hausverwaltungAngularApp'));

  var EditBookingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditBookingCtrl = $controller('EditBookingCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
