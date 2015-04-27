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
        'smart-table',
        'pouchdb'
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
            .when('/new_category', {
                templateUrl: 'views/new_category.html',
                controller: 'NewCategoryCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
