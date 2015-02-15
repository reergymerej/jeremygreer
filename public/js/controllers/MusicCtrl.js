(function () {
  'use strict';

  angular.module('jg').controller('MusicCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.songs = [];

    $http.get('/music').
      success(function (songs) {
        $scope.songs = songs;
      }).
      error(function (data, status) {
        console.error(data, status);
      });
  }]);
}());