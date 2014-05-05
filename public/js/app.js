(function () {
    'use strict';

    // create the app
    angular.module('jg', [
        'ngRoute'/*,
        'ngResource'*/
    ])

    // set up routing
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/index.html'
            })
            .when('/resume', {
                templateUrl: '/partials/resume.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
}());