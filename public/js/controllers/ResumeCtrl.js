(function () {
    'use strict';
    angular.module('jg').controller('ResumeCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.resume = [];
        $scope.skillGroups = [];
        $scope.skillGroupCount = 4;

        var divideSkills = function () {
            var i,
                groups = $scope.skillGroups,
                skills = $scope.resume.skills;

            // create groups
            for (i = 0; i < $scope.skillGroupCount; i = i + 1) {
                groups.push([]);
            }

            // dole out the skills
            for (i = 0; i < skills.length; i = i + 1) {
                groups[i % $scope.skillGroupCount].push(skills[i]);
            }
        };

        $http({
            method: 'GET',
            url: '/resume.json'
        }).
        success(function (data) {
            $scope.resume = data;

            divideSkills();
        })
        .error(function (data) {
            console.error('whoops');
        });


    }]);
}());