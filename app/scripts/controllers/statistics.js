'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:StatisticsController
 * @description
 * # StatisticsController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('StatisticsController', function ($scope, dbService, lodash) {
    var point = '.';
    var comma = ',';
    var total_amount;
    var amounts = {};
    var amounts_values = [];
    var amounts_map = new Map();

    $scope.radioDisabled = true;
    $scope.inputDisabled = false;
    $scope.updateButton = false;

    $scope.disableControls = function () {
      $scope.radioDisabled = !$scope.radioDisabled;
      $scope.inputDisabled = !$scope.inputDisabled;
      $scope.updateButton = !$scope.updateButton;
    };

    $scope.onLoadAmountDay = function () {
      var b_date = moment(new Date()).startOf('day').toDate().getTime();
      var e_date = moment(new Date()).add(2, 'days').startOf('day').toDate().getTime();
      dbService.getBookingsByDate(b_date, e_date);
    }
  });
