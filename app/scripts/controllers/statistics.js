'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:StatisticsController
 * @description
 * # StatisticsController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('StatisticsController', function ($scope) {
    $scope.radioDisabled = true;
    $scope.inputDisabled = false;
    $scope.updateButton = false;

    $scope.disableControls = function () {
      $scope.radioDisabled = !$scope.radioDisabled;
      $scope.inputDisabled = !$scope.inputDisabled;
      $scope.updateButton = !$scope.updateButton;
    };

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
