'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:NewBookingController
 * @description
 * # NewBookingController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('NewBookingController', function ($scope, localStorageService) {
    var store = Rhaboo.persistent('BOOKINGS');
    store.write('bookingCounter', store.bookingCounter ? store.bookingCounter : 0);
    store.write('bookings', []);

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.submitBooking = function () {
      $scope.newBooking = {
        amount: $scope.amount,
        date: $scope.date,
        category: $scope.category,
        remark: $scope.remark
      };
    };

    $scope.$watch('newBooking', function (newValue, oldValue) {
      //localStorageService.set('booking' + ++counter, $scope.newBooking);
      if (newValue !== oldValue) {
        //var tempNewBooking = $scope.newBooking;
        // Only increment the counter if the value changed
        //console.log('Variable newBooking has changed. It\'s new value: ' + JSON.stringify($scope.newBooking));
        //$scope.counter = $scope.counter + 1;
        //localStorageService.set('booking' + $scope.counter ,JSON.stringify($scope.newBooking));
        var nextBookingNumber = store.bookingCounter + 1;

        var booking = {};
        booking.amout = $scope.newBooking.amount;
        booking.date = $scope.newBooking.date;
        booking.remark = $scope.newBooking.remark;
        booking.category = $scope.newBooking.category;

        var tim = "TIM";

        store.bookings.write(nextBookingNumber, booking);
      }
    }, true);
  });
