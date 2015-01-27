'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:MainController
 * @description
 * # MainController
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
  .controller('MainController', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.rowCollection = [
      {date: '24.01.2015', remark: 'PHP Magazin 02.2015', category: 'Programming', amount: 9.80},
      {date: '15.01.2015', remark: 'NAD CD-Player', category: 'HiFi', amount: 315},
      {date: '13.12.2014', remark: 'Moscot Brille', category: 'Gesundheit', amount: 572},
      {date: '16.01.2015', remark: 'Sandvquist Tasche', category: 'Kleidungen', amount: 169},
      {date: '20.01.2015', remark: 'Brooks Laufschuhe', category: 'Kleidungen', amount: 103.95}
    ];
  });
