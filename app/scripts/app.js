'use strict';

/**
 * @ngdoc overview
 * @name hausverwaltungAngularApp
 * @description
 * # hausverwaltungAngularApp
 *
 * Main module of the application.
 */
angular
  .module('hausverwaltungAngularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'smart-table'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/new_booking', {
        templateUrl: 'views/newBooking.html',
        controller: 'NewBookingController'
      })
      .when('/about', {
        templateUrl: 'views/newCategory.html',
        controller: 'NewCategoryController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
