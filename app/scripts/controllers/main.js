'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:MainController
 * @description
 * # MainController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('MainController', function ($scope, localStorageService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var store = Rhaboo.persistent('BOOKINGS');

    var bookingsInStore = [];

    var keys = localStorageService.keys();
    var counter = keys.length;

    /*for (var i = 0; i < counter; i++) {
      var temp = localStorageService.get(keys[i]);
      bookingsInStore.push(localStorageService.get(keys[i]));
    }*/

    //bookingsInStore =

    //$scope.rowBookingCollection = bookingsInStore || [];
    $scope.rowBookingCollection = store.bookings || [];

    $scope.displayedBookingCollection = [].concat($scope.rowBookingCollection);

  });
