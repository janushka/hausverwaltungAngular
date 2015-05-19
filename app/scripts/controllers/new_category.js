'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:NewcategoryCtrl
 * @description
 * # NewcategoryCtrl
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('NewCategoryCtrl', function ($scope, $rootScope, $location, dbService, Flash) {
    $scope.category = {};
    $scope.new_category = {};

    $scope.disable_controls_new_category = true;

    $scope.onCreateCategory = function () {
      var category = new CategoryNew($scope.new_category.name, $scope.new_category.description);

      dbService.createCategory(category).then(function (response) {
        if (response != undefined) {
          if (response.error && response.status == 409 && response.name == 'conflict') {
            Flash.create('danger', '<strong>Fehler:</strong> Kategorie exiistiert bereits.');
          } else {
            $scope.new_category = new CategoryNew('', '');
            Flash.create('success', '<strong>Bestätigung:</strong> Kategorie erfolgreich gespeichert.');
          }
        }
      });
    }
  });

function CategoryNew(name, description) {
// No need to set an ID since it will be automatically assigned
  if (name != undefined) {
    this.name = name;
  }
  if (description != undefined) {
    this.description = description;
  }
  this.type = 'category';
}
