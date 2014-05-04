(function () {
    'use strict';

    // create the app
    angular.module('jg', [
        'ngRoute'
    ])

    // set up routing
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/index.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
}());