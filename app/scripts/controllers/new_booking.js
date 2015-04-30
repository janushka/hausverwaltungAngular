'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:NewBookingController
 * @description
 * # NewBookingController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
    .controller('NewBookingCtrl', function ($scope, $rootScope, $location) {

        if ($scope.categories.length != 0) {
            $scope.categories_collection_empty = false;
            $scope.categorySelected = 'Kategorie ändern';
        } else {
            $scope.categories_collection_empty = true;
            //$scope.changeCategoryDisabled = 'Kategorie ändern';
        }

        $scope.onChangeCategory = function () {
            if ($scope.new_booking.category == null) {
                $scope.categorySelected = 'Kategorie ändern';
                $scope.categoryEnabled = false;
            }
            else {
                console.log('The selected category is: ' + $scope.new_booking.category.name);
                $scope.categorySelected = '<a >Kategorie ändern</a>';
                $scope.categoryEnabled = true;
            }
        }

        $scope.toNewCategory = function () {
            $location.path('/new_category');
        };

        $scope.setCurrentCategory = function () {
            console.log('Set current category!');
            $rootScope.current_category = $scope.new_booking.category;
            $location.path('/edit_category');
        };
    });
