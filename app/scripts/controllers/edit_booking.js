'use strict';

/**
 * @ngdoc function
 * @name hausverwaltungAngularApp.controller:EditBookingCtrl
 * @description
 * # EditBookingCtrl
 * Controller of the hausverwaltungAngularApp
 */
angular.module('hausverwaltungAngularApp')
    .controller('EditBookingCtrl', function ($scope, $rootScope, $location, dbService) {
        $scope.edit_booking = new Booking($scope.current_booking._id, $scope.current_booking.amount, $scope.current_booking.date, $scope.current_booking.remark, $scope.current_booking.category_id, $scope.current_booking.category_name);

        $scope.onUpdateBooking = function () {
            var booking = $scope.edit_booking;
            booking.category_name = $scope.edit_booking.category_name.name;
            dbService.updateBooking(booking).then(function (response) {
                if (response != undefined) {
                    dbService.getAllBookings()
                        .then(function (bookings) {
                            return bookings;
                        }).then(function (bookings) {
                            $rootScope.bookings = bookings;
                            //console.log('Init bookings...\n' + JSON.stringify(bookings));
                            dbService.setAllBookings(bookings);
                            $location.path('/');
                        })
                        .catch(function (error) {
                            console.log('Loading bookings failed... ' + error);
                        });
                }
            });
        }
    });

function Booking(id, amount, date, remark, category_id, category_name) {
    let point = '.';
    let comma = ',';

    this.id = id;
    this.amount = amount.toString().replace(point, comma);
    this.date = date;
    this.remark = remark;
    this.category_id = category_id;
    this.category_name = {name: category_name};
}