'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:StatisticsController
 * @description
 * # StatisticsController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('StatisticsController', function ($scope, $rootScope, dbService, lodash) {
    var point = '.';
    var comma = ',';
    var total_amount;
    var amounts = {};
    var amounts_values = [];
    var amounts_map = new Map();

    $scope.statistics_begin_date = new Date();
    $scope.statistics_end_date = new Date();

    $scope.statistics = {};
    $scope.statistics.time_range = 'week_bookings';

    $scope.radioDisabled = true;
    $scope.inputDisabled = false;
    $scope.updateButton = false;

    $scope.disableControls = function () {
      $scope.radioDisabled = !$scope.radioDisabled;
      $scope.inputDisabled = !$scope.inputDisabled;
      $scope.updateButton = !$scope.updateButton;
    };

    $scope.$watchGroup(['statistics_begin_date', 'statistics_end_date'],
      function (newValues, oldValues) {
        if (moment(newValues[0]) !== null && moment(newValues[1]) !== null) {
          if (moment(newValues[0]).isBefore(newValues[1]) || moment(newValues[0]).isSame(newValues[1])) {
            console.log('Is really before!');
            $scope.statistics_range_is_invalid = false;
            return;
          }
        }
        $scope.statistics_range_is_invalid = true;
      });

    $scope.$watchGroup(['radioDisabled', 'statistics.time_range'],
      function (newValues, oldValues) {
        if (newValues[0]) {
          switch (newValues[1]) {
            case 'day_bookings':
              $scope.onLoadAmountDay();
              break;
            case 'week_bookings':
              $scope.onLoadAmountWeek();
              break;
            case 'month_bookings':
              $scope.onLoadAmountMonth();
              break;
            case 'year_bookings':
              $scope.onLoadAmountYear();
              break;
            case 'all_bookings':
              $scope.onLoadAmountAll();
              break;
          }
        }
      });

    $scope.onLoadAmountDay = function () {
      var b_date = moment(new Date()).startOf('day').toDate().getTime();

      dbService.getBookingsByDate(b_date, b_date)
        .then(function (bookings) {
          return bookings;
        }).then(function (bookings) {
          dbService.setAllBookings(bookings);
          $rootScope.amounts = dbService.getAmounts();
          $rootScope.total_amount = dbService.getTotalAmount();
        })
        .catch(function (error) {
          console.log('Loading bookings failed... ' + error);
        });
    };

    $scope.onLoadAmountWeek = function () {
      var b_date = moment(new Date()).startOf('week').toDate().getTime();
      var e_date = moment(new Date()).startOf('day').toDate().getTime();

      dbService.getBookingsByDate(b_date, e_date)
        .then(function (bookings) {
          return bookings;
        }).then(function (bookings) {
          dbService.setAllBookings(bookings);
          $rootScope.amounts = dbService.getAmounts();
          $rootScope.total_amount = dbService.getTotalAmount();
        })
        .catch(function (error) {
          console.log('Loading bookings failed... ' + error);
        });
    };

    $scope.onLoadAmountMonth = function () {
      var b_date = moment(new Date()).startOf('month').toDate().getTime();
      var e_date = moment(new Date()).startOf('day').toDate().getTime();

      dbService.getBookingsByDate(b_date, e_date)
        .then(function (bookings) {
          return bookings;
        }).then(function (bookings) {
          dbService.setAllBookings(bookings);
          $rootScope.amounts = dbService.getAmounts();
          $rootScope.total_amount = dbService.getTotalAmount();
        })
        .catch(function (error) {
          console.log('Loading bookings failed... ' + error);
        });
    };

    $scope.onLoadAmountYear = function () {
      var b_date = moment(new Date()).startOf('year').toDate().getTime();
      var e_date = moment(new Date()).startOf('day').toDate().getTime();

      dbService.getBookingsByDate(b_date, e_date)
        .then(function (bookings) {
          return bookings;
        }).then(function (bookings) {
          dbService.setAllBookings(bookings);
          $rootScope.amounts = dbService.getAmounts();
          $rootScope.total_amount = dbService.getTotalAmount();
        })
        .catch(function (error) {
          console.log('Loading bookings failed... ' + error);
        });
    };

    $scope.onLoadAmountAll = function () {
      dbService.getAllBookings()
        .then(function (bookings) {
          return bookings;
        }).then(function (bookings) {
          dbService.setAllBookings(bookings);
          $rootScope.amounts = dbService.getAmounts();
          $rootScope.total_amount = dbService.getTotalAmount();
        })
        .catch(function (error) {
          console.log('Loading bookings failed... ' + error);
        });
    };

    $scope.onLoadAmountRange = function (b, e) {
      var b_date = moment($scope.statistics_begin_date).startOf('day').toDate().getTime();
      var e_date = moment($scope.statistics_end_date).startOf('day').toDate().getTime();

      dbService.getBookingsByDate(b_date, e_date)
        .then(function (bookings) {
          return bookings;
        }).then(function (bookings) {
          dbService.setAllBookings(bookings);
          $rootScope.amounts = dbService.getAmounts();
          $rootScope.total_amount = dbService.getTotalAmount();
        })
        .catch(function (error) {
          console.log('Loading bookings failed... ' + error);
        });
    };
  });
