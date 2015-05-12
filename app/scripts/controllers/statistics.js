'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:StatisticsController
 * @description
 * # StatisticsController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('StatisticsController', function ($scope, lodash) {
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

    $scope.onLoadAmounts = function () {
      var bookings = $scope.bookings;
      var categories = $scope.categories;
      amounts_values = [];
      amounts_map.clear();

      if (bookings.length == 0) {
        categories.forEach(function (element, index, array) {
          amounts_map.set(element['name'], 0);
          total_amount = 0;
        });
      } else {
        categories.forEach(function (celement, cindex, carray) {
          bookings.forEach(function (belement, bindex, barray) {
            if (celement['name'] === belement['category_name']) {
              var amount = amounts_map.get(celement['name']) === undefined ? 0 : amounts_map.get(celement['name']);
              amounts_map.set(celement['name'], amount + belement.amount);
            } else {
              amounts_map.set(celement['name'], 0);
            }
          });
        });

        for (var value of amounts_map.values()) {
          console.log(value);
          amounts_values.push(value);
        }

        total_amount = lodash.reduce(lodash.values(amounts_values), function (sum, n) {
          return sum + n;
        });
      }

      for (var entry of amounts_map.entries()) {
        console.log(entry[0] + " = " + entry[1]);
        amounts[entry[0]] = entry[1];
      }

      $scope.amounts = amounts;
      $scope.total_amount = total_amount.toString().replace(point, comma);
    }
  });
