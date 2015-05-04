'use strict';

/**
 * @ngdoc directive
 * @name hausverwaltungAngularApp.directive:changeCategoryLink
 * @description
 * # changeCategoryLink
 */
angular.module('hausverwaltungAngularApp')
    .directive('changeCategory', function () {
        return {
            restrict: 'E',
            transclude: true,
            template: 'categorySelected'
        };
    });
