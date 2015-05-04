'use strict';

describe('Controller: EditcategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('hausverwaltungAngularApp'));

  var EditcategoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditcategoryCtrl = $controller('EditcategoryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
