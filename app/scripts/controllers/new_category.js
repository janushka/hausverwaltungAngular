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
          dbService.getAllCategories()
            .then(function (categories) {
              return categories;
            })
            .then(function (categories) {
              //console.log('Init categories...\n' + JSON.stringify(categories));
              $rootScope.categories = categories;
              dbService.setAllCategories(categories);
              dbService.setAllCategories(categories);
              $rootScope.amounts = dbService.getAmounts();
              $rootScope.total_amount = dbService.getTotalAmount();
              Flash.create('success', '<strong>Bestätigung:</strong> Kategorie erfolgreich gespeichert.');
            })
            .catch(function (error) {
              console.log('Loading categories failed... ' + error);
            });
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
