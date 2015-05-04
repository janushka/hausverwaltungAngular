'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:ContentController
 * @description
 * # ContentController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('ContentController', function ($scope, localStorageService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    /*$scope.newBooking = {};
    var keys = localStorageService.keys();
    $scope.counter = keys.length;

    $scope.newCategory = {};*/

    var store = Rhaboo.persistent('BOOKINGS');
    //store.write('bookingCounter', store.bookingCounter ? store.bookingCounter : 0);
    //store.write('bookings', []);

    $scope.newBooking = {};


    //$scope.currentBookings = store.bookings;
  });
