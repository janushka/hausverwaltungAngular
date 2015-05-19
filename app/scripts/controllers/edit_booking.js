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
      booking.date = $scope.edit_booking.date;
      booking.remark = $scope.edit_booking.remark;
      booking.category_id = $scope.edit_booking.category_name._id;
      booking.category_name = $scope.edit_booking.category_name.name;

      dbService.updateBooking(booking).then(function (response) {
        if (response != undefined) {
          if (response.error && response.status == 409 && response.name == 'conflict') {
            Flash.create('danger', '<strong>Fehler:</strong> Buchung konnte nicht gespeichert werden.');
          } else {
            $scope.edit_booking = new BookingEdit($scope.current_booking._id, booking.amount, booking.date, booking.remark, booking.category_id, booking.category_name);
            Flash.create('success', '<strong>Bestätigung:</strong> Buchung erfolgreich gespeichert.');
          }
        }
      });
    };

    $scope.onDeleteBooking = function () {
      var booking = $scope.edit_booking;

      dbService.deleteBooking(booking).then(function (response) {
        if (response != undefined) {
          if (response.error && response.status == 409 && response.name == 'conflict') {
            Flash.create('danger', '<strong>Fehler:</strong> Buchung konnte nicht gelöscht werden.');
          } else {
            $scope.edit_booking = new BookingEdit(null, '', new Date(), '', '', '');
            $scope.disable_controls_edit_booking = true;
            Flash.create('success', '<strong>Bestätigung:</strong> Buchung erfolgreich gelöscht.');
          }
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
