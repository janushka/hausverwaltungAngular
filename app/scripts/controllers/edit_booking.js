'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:EditBookingCtrl
 * @description
 * # EditBookingCtrl
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('EditBookingCtrl', function ($scope, $rootScope, $location, dbService, Flash) {
    let point = '.';
    let comma = ',';
    $scope.edit_booking = new BookingEdit($scope.current_booking._id, $scope.current_booking.amount.toString().replace(point, comma), moment($scope.current_booking.date, "DD-MM-YYYY").toDate(), $scope.current_booking.remark, $scope.current_booking.category_id, $scope.current_booking.category_name);
    $scope.booking_updated = false;
    $scope.booking_deleted = false;
    $scope.booking_no_change = false;

    $scope.onUpdateBooking = function () {
      if (!$scope.form.$dirty) {
        Flash.create('warning', '<strong>Warnung:</strong> Keine Änderungen festgestellt. Speichern abgebrochen!');
        return;
      }

      var booking = $scope.edit_booking;
      booking.amount = $scope.edit_booking.amount;
      //booking.date = moment($scope.edit_booking.date).startOf('day').toDate();
      booking.date = $scope.edit_booking.date;
      booking.remark = $scope.edit_booking.remark;
      booking.category_id = $scope.edit_booking.category_name._id;
      booking.category_name = $scope.edit_booking.category_name.name;

      /*var diffDates = $scope.current_booking.date === booking.date;

       if (booking.amount === $scope.current_booking.amount.toString().replace(point, comma) && diffDates
       && booking.category_name === $scope.current_booking.category_name && booking.remark === $scope.current_booking.remark) {
       $scope.booking_no_change = true;
       $scope.disable_controls_edit_booking = true;
       return;
       }*/

      dbService.updateBooking(booking).then(function (response) {
        if (response != undefined) {
          dbService.getAllBookings()
            .then(function (bookings) {
              return bookings;
            }).then(function (bookings) {
              $rootScope.bookings = bookings;
              //console.log('Init bookings...\n' + JSON.stringify(bookings));
              dbService.setAllBookings(bookings);
              $scope.edit_booking = new BookingEdit($scope.current_booking._id, booking.amount, booking.date, booking.remark, booking.category_id, booking.category_name);
              Flash.create('success', '<strong>Bestätigung:</strong> Buchung erfolgreich geändert.');
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
              $scope.edit_booking = new BookingEdit(null, '', new Date(), '', '', '');
              $scope.disable_controls_edit_booking = true;
              Flash.create('success', '<strong>Bestätigung:</strong> Buchung erfolgreich gelöscht.');
            })
            .catch(function (error) {
              console.log('Loading bookings failed... ' + error);
            });
        }
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
