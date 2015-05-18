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
    'angularMoment',
    'flash'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/booking_list.html',
        controller: 'BookingListCtrl',
        resolve: {
          'dbServiceBookings': function (dbService) {
            //console.log('In Config part... \n');
            if (dbService.getBookings() != undefined) {
              return;
            }
            return dbService.getAllBookings();
          },
          'dbServiceCategories': function (dbService) {
            //console.log('In Config part... \n');
            if (dbService.getCategories() != undefined) {
              return;
            }
            return dbService.getAllCategories();
          }
        }
      })
      .when('/new_booking', {
        templateUrl: 'views/new_booking.html',
        controller: 'NewBookingCtrl'
      })
      .when('/edit_booking', {
        templateUrl: 'views/edit_booking.html',
        controller: 'EditBookingCtrl'
      })
      .when('/new_category', {
        templateUrl: 'views/new_category.html',
        controller: 'NewCategoryCtrl'
      })
      .when('/edit_category', {
        templateUrl: 'views/edit_category.html',
        controller: 'EditCategoryCtrl'
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
    dbService.initDb();
    dbService.createDesignDocs();
    //dbService.shouldBookFixedExpenses(false);
    dbService.getAllBookings()
      .then(function (bookings) {
        return bookings;
      }).then(function (bookings) {
        $rootScope.bookings = bookings;
        //console.log('Init bookings...\n' + JSON.stringify(bookings));
        dbService.setAllBookings(bookings);
        dbService.initObjects();
      })
      .catch(function (error) {
        console.log('Loading bookings failed... ' + error);
      });
    dbService.getAllCategories()
      .then(function (categories) {
        return categories;
      }).then(function (categories) {
        $rootScope.categories = categories;
        //console.log('Init categories...\n' + JSON.stringify(categories));
        dbService.setAllCategories(categories);

        $rootScope.amounts = dbService.getAmounts();
        $rootScope.total_amount = dbService.getTotalAmount();
      })
      .catch(function (error) {
        console.log('Loading categories failed... ' + error);
      });
  }
);
