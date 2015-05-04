'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:NewBookingController
 * @description
 * # NewBookingController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('NewBookingCtrl', function ($scope, $rootScope, $location, dbService) {
    $scope.booking = {};
    $scope.new_booking = {};

    $scope.onCreateBooking = function () {
      var booking = new BookingNew($scope.new_booking.amount, $scope.new_booking.date, $scope.new_booking.remark, $scope.new_booking.category._id, $scope.new_booking.category.name);

      dbService.createBooking(booking).then(function (response) {
        if (response != undefined) {
          dbService.getAllBookings()
            .then(function (bookings) {
              return bookings;
            }).then(function (bookings) {
              $rootScope.bookings = bookings;
              //console.log('Init bookings...\n' + JSON.stringify(bookings));
              dbService.setAllBookings(bookings);
              $location.path('/');
            })
            .catch(function (error) {
              console.log('Loading bookings failed... ' + error);
            });
        }
      });
    };

    if ($scope.categories.length != 0) {
      $scope.categories_collection_empty = false;
      $scope.categorySelected = 'Kategorie ändern';
    } else {
      $scope.categories_collection_empty = true;
      //$scope.changeCategoryDisabled = 'Kategorie ändern';
    };

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
    };

    $scope.toNewCategory = function () {
      $location.path('/new_category');
    };

    $scope.setCurrentCategory = function () {
      console.log('Set current category!');
      $rootScope.current_category = $scope.new_booking.category;
      $location.path('/edit_category');
    };
  });

function BookingNew(amount, date, remark, category_id, category_name) {
// No need to set an ID since it will be automatically assigned
  if (amount != undefined) {
    this.amount = amount;
  }
  if (date != undefined) {
    this.date = date;
  }
  if (remark != undefined) {
    this.remark = remark;
  }
  if (category_id != undefined) {
    this.category_id = category_id;
  }
  if (category_name != undefined) {
    this.category_name = category_name;
  }

  this.type = 'booking';
}
