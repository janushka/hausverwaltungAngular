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
  });
