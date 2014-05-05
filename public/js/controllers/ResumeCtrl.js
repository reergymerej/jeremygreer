(function () {
    'use strict';
    angular.module('jg').controller('ResumeCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.resume = [];

        $http({
            method: 'GET',
            url: '/resume.json'
        }).
        success(function (data) {
            $scope.resume = data;
        })
        .error(function (data) {
            console.error('whoops');
        });
    }]);
}());