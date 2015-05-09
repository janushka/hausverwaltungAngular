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
          dbService.getAllCategories()
            .then(function (categories) {
              return categories;
            }).then(function (categories) {
              $rootScope.categories = categories;
              //console.log('Init categories...\n' + JSON.stringify(categories));
              dbService.setAllCategories(categories);
            })
            .catch(function (error) {
              console.log('Loading categories failed... ' + error);
            });
          dbService.getAllBookings()
            .then(function (bookings) {
              return bookings;
            }).then(function (bookings) {
              $rootScope.bookings = bookings;
              //console.log('Init bookings...\n' + JSON.stringify(bookings));
              dbService.setAllBookings(bookings);
              $scope.edit_category = new CategoryEdit($scope.current_category._id, category.name, category.description);
              Flash.create('success', '<strong>Bestätigung:</strong> Kategorie erfolgreich gespeichert.');
            })
            .catch(function (error) {
              console.log('Loading bookings failed... ' + error);
            });
        }
      });
    };

    $scope.onDeleteCategory = function () {
      var category = $scope.edit_category;

      if (dbService.isCategoryAssignedToBooking(category)) {
        Flash.create('danger', '<strong>Fehler:</strong> Abhängige Buchungen zuerst, dann diese Kategorie löschen.');
        return;
      }

      dbService.deleteCategory(category).then(function (result) {
        if (result != undefined) {
          dbService.getAllCategories()
            .then(function (categories) {
              return categories;
            }).then(function (categories) {
              $rootScope.categories = categories;
              dbService.setAllCategories(categories);
              $scope.edit_category = new CategoryEdit(null, '', '');
              $scope.disable_controls_edit_category = true;
              Flash.create('success', '<strong>Bestätigung:</strong> Kategorie erfolgreich gelöscht.');
            })
            .catch(function (error) {
              console.log('Loading bookings failed... ' + error);
            });
        }
      });
    };
  });

function CategoryEdit(id, name, description) {
  this.id = id;
  this.name = name;
  this.description = description;
}
