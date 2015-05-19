'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:EditcategoryCtrl
 * @description
 * # EditcategoryCtrl
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('EditCategoryCtrl', function ($scope, $rootScope, $location, dbService, Flash) {
    $scope.edit_category = new CategoryEdit($scope.current_category._id, $scope.current_category.name, $scope.current_category.description);

    $scope.onUpdateCategory = function () {
      var category = $scope.edit_category;

      dbService.updateCategory(category).then(function (response) {
        if (response != undefined) {
          if (response.error && response.status == 409 && response.name == 'conflict') {
            Flash.create('danger', '<strong>Fehler:</strong> Kategorie konnte nicht gespeichert werden.');
          } else {
            $scope.edit_category = new CategoryEdit($scope.current_category._id, category.name, category.description);
            Flash.create('success', '<strong>Bestätigung:</strong> Kategorie erfolgreich gespeichert.');
          }
        }
      });
    };

    $scope.onDeleteCategory = function () {
      var category = $scope.edit_category;

      if (dbService.isCategoryAssignedToBooking(category)) {
        Flash.create('danger', '<strong>Fehler:</strong> Abhängige Buchungen zuerst, dann diese Kategorie löschen.');
        return;
      }

      dbService.deleteCategory(category).then(function (response) {
        if (response != undefined) {
          if (response.error && response.status == 409 && response.name == 'conflict') {
            Flash.create('danger', '<strong>Fehler:</strong> Kategorie konnte nicht gelöscht werden.');
          } else {
            $scope.edit_category = new CategoryEdit(null, '', '');
            $scope.disable_controls_edit_category = true;
            Flash.create('success', '<strong>Bestätigung:</strong> Kategorie erfolgreich gelöscht.');
          }
        }
      });
    };
  });

function CategoryEdit(id, name, description) {
  this.id = id;
  this.name = name;
  this.description = description;
}
