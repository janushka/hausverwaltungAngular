'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:BookingListCtrl
 * @description
 * # BookingListCtrl
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('BookingListCtrl', function ($scope, $rootScope, $location) {
    $scope.rowBookingCollection = $scope.bookings;
    $scope.displayedBookingCollection = [].concat($scope.rowBookingCollection);

    $scope.setCurrentBooking = function (booking) {
      var tempBooking = booking;
      $rootScope.current_booking = booking;
      $location.path('/edit_booking');
    };

    $scope.setMonthlyBookings = function () {

    }
  });
