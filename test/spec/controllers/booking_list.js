'use strict';

describe('Controller: BookingListCtrl', function () {

  // load the controller's module
  beforeEach(module('hausverwaltungAngularApp'));

  var BookingListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BookingListCtrl = $controller('BookingListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
