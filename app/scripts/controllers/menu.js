'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('MenuCtrl', function ($scope, $location, dbService, Flash) {
    //$scope.fixed_expenses_exist = false;

    $scope.isActive = function (viewLocation) {
      var active = (viewLocation === $location.path());
      return active;
    };

    $scope.bookFixedExpenses = function () {
      dbService.bookFixedDepenses('Fixkosten');

      var b_date = moment(later.schedule(later.parse.text('on the first day of the month')).prev()).startOf('day').toDate().getTime();
      var e_date = moment(later.schedule(later.parse.text('on the first day of the month')).prev()).startOf('day').toDate().getTime();

      dbService.getBookingsFixed(b_date, e_date)
        .then(function (bookings) {
          return bookings;
        }).then(function (bookings) {
          if (bookings.length == 0) {
            console.log('Keine Fixkosten!');

          } else {
            console.log('Fixkosten sind da!');
          }
          //dbService.setAllBookings(bookings);
          //$rootScope.amounts = dbService.getAmounts();
          //$rootScope.total_amount = dbService.getTotalAmount();
        })
        .catch(function (error) {
          console.log('Loading bookings failed... ' + error);
        });
    }
  });
