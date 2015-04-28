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
        'pouchdb',
        'ngLodash',
        'angularMoment'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/booking_list.html',
                controller: 'BookingListCtrl',
                resolve: {'dbServiceData': function(dbService) {
                    return dbService.getAllBookings();
                }}
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
    })
    .config(function (dbServiceProvider) {
        dbServiceProvider.setDbName('Hausverwaltung');
        dbServiceProvider.shouldSetDummyData(false);
    })
    .run(function (dbService, $rootScope) {
        $rootScope.wert = 'Janne';

        dbService.initDb();
        dbService.createDesignDocs();
        dbService.getAllBookings()
            .then(function (bookings) {
                $rootScope.bookings = bookings;
                console.log('Retrieving bookings...\n' + JSON.stringify(bookings));
            })
            .catch(function (error) {
                console.log('Retrieving bookings failed... ' + error);
            });
    }
);
