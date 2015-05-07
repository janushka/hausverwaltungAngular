'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:EditBookingCtrl
 * @description
 * # EditBookingCtrl
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('EditBookingCtrl', function ($scope, $rootScope, $location, dbService) {
    let point = '.';
    let comma = ',';
    $scope.edit_booking = new BookingEdit($scope.current_booking._id, $scope.current_booking.amount.toString().replace(point, comma), $scope.current_booking.date, $scope.current_booking.remark, $scope.current_booking.category_id, $scope.current_booking.category_name);
    $scope.booking_updated = false;
    $scope.booking_deleted = false;
    $scope.booking_no_change = false;

    $scope.onUpdateBooking = function () {
      var booking = $scope.edit_booking;
      booking.amount = $scope.edit_booking.amount;
      booking.date = $scope.edit_booking.date;
      booking.remark = $scope.edit_booking.remark;
      booking.category_id = $scope.edit_booking.category_name._id;
      booking.category_name = $scope.edit_booking.category_name.name;

      var diffDates = $scope.current_booking.date === booking.date;

      if (booking.amount === $scope.current_booking.amount.toString().replace(point, comma) && diffDates
        && booking.category_name === $scope.current_booking.category_name && booking.remark === $scope.current_booking.remark) {
        $scope.booking_no_change = true;
        $scope.disable_controls_edit_booking = true;
        return;
      }

      dbService.updateBooking(booking).then(function (response) {
        if (response != undefined) {
          dbService.getAllBookings()
            .then(function (bookings) {
              return bookings;
            }).then(function (bookings) {
              $rootScope.bookings = bookings;
              //console.log('Init bookings...\n' + JSON.stringify(bookings));
              dbService.setAllBookings(bookings);
              $scope.disable_controls_edit_booking = true;
              $scope.booking_updated = true;
            })
            .catch(function (error) {
              console.log('Loading bookings failed... ' + error);
            });
        }
      });
    };

    $scope.onDeleteBooking = function () {
      var booking = $scope.edit_booking;

      dbService.deleteBooking(booking).then(function (result) {
        if (result != undefined) {
          dbService.getAllBookings()
            .then(function (bookings) {
              return bookings;
            }).then(function (bookings) {
              $rootScope.bookings = bookings;
              //console.log('Init bookings...\n' + JSON.stringify(bookings));
              dbService.setAllBookings(bookings);
              $scope.disable_controls_edit_booking = true;
              $scope.booking_deleted = true;
            })
            .catch(function (error) {
              console.log('Loading bookings failed... ' + error);
            });
        }
      });
    };

    $scope.onCloseBookingUpdated = function () {
      Ink.requireModules(['Ink.UI.Close_1'], function (Close) {
        new Close();  // That was close
        $location.path('/');
      });
    };

    $scope.onCloseBookingDeleted = function () {
      Ink.requireModules(['Ink.UI.Close_1'], function (Close) {
        new Close();  // That was close
        $location.path('/');
      });
    };

    $scope.onCloseBookingNoChange = function () {
      Ink.requireModules(['Ink.UI.Close_1'], function (Close) {
        $scope.booking_no_change = false;
        $scope.disable_controls_edit_booking = false;

        $scope.edit_booking = new BookingEdit($scope.current_booking._id, $scope.current_booking.amount.toString().replace(point, comma), $scope.current_booking.date, $scope.current_booking.remark, $scope.current_booking.category_id, $scope.current_booking.category_name);
      });
    };
  });


function BookingEdit(id, amount, date, remark, category_id, category_name) {
  this.id = id;
  this.amount = amount;
  this.date = date;
  this.remark = remark;
  this.category_id = category_id;
  this.category_name = {name: category_name};
}
