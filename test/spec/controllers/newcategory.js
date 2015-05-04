'use strict';

describe('Controller: NewcategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('hausverwaltungAngularApp'));

  var NewCategoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewCategoryCtrl = $controller('NewCategoryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
