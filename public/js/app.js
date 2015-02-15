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
      .when('/portfolio', {
        templateUrl: '/partials/portfolio.html'
      })
      .when('/lab', {
        templateUrl: '/partials/lab.html'
      })
      .when('/music', {
        templateUrl: '/partials/music.html'
      })
      .when('/contact', {
        templateUrl: '/partials/contact.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
}());