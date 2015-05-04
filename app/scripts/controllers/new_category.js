'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:NewcategoryCtrl
 * @description
 * # NewcategoryCtrl
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('NewCategoryCtrl', function ($scope, $rootScope, $location, dbService) {
    $scope.category = {};
    $scope.new_category = {};

    $scope.onCreateCategory = function () {
      var category = new CategoryNew($scope.new_category.name, $scope.new_category.description);

      dbService.createCategory(category).then(function (response) {
        if (response != undefined) {
          dbService.getAllCategories()
            .then(function (categories) {
              return categories;
            }).then(function (categories) {
              $rootScope.categories = categories;
              //console.log('Init categories...\n' + JSON.stringify(categories));
              dbService.setAllCategories(categories);
              $location.path('/new_booking');
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
