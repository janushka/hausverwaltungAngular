'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:NewBookingController
 * @description
 * # NewBookingController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('NewBookingCtrl', function ($scope, $rootScope, $location, dbService, Flash) {
    $scope.booking = {};
    $scope.new_booking = {};
    $scope.categorySelected = 'Kategorie ändern';
    $scope.booking_created = false;

    $scope.onCreateBooking = function () {
      var message = '<strong>Well done!</strong> You successfully read this important alert message.';
      Flash.create('success', message);

      /*var booking = new BookingNew($scope.new_booking.amount, $scope.new_booking.date, $scope.new_booking.remark, $scope.new_booking.category._id, $scope.new_booking.category.name);


      dbService.createBooking(booking).then(function (response) {
        if (response != undefined) {
          dbService.getAllBookings()
            .then(function (bookings) {
              return bookings;
            }).then(function (bookings) {
              $rootScope.bookings = bookings;
              //console.log('Init bookings...\n' + JSON.stringify(bookings));
              dbService.setAllBookings(bookings);
              $scope.disable_controls_new_booking = true;
              $scope.booking_created = true;
              //$location.path('/');
            })
            .catch(function (error) {
              console.log('Loading bookings failed... ' + error);
            });
        }
      });*/
    };

    if ($scope.categories.length != 0) {
      $scope.categories_collection_empty = false;
      $scope.disable_controls_new_booking = false;
      //$scope.categorySelected = 'Kategorie ändern';
    } else {
      $scope.categories_collection_empty = true;
      $scope.disable_controls_new_booking = true;
      //$scope.categorySelected = 'Kategorie ändern';
    }
    ;

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

    $scope.onCloseNoCategories = function () {
      Ink.requireModules(['Ink.UI.Close_1'], function (Close) {
        new Close();  // That was close
      });
    };

    $scope.onCloseBookingCreated = function () {
      Ink.requireModules(['Ink.UI.Close_1'], function (Close) {
        new Close();  // That was close
        $location.path('/');
      });
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
