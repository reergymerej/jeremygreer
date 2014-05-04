(function () {
    'use strict';
    angular.module('jg').controller('HeaderCtrl', ['$scope', function ($scope) {
        $scope.links = [
            {
                text: 'Resume',
                href: '/resume'
            },
            // {
            //     text: 'Portfolio',
            //     href: '/portfolio'
            // },
            {
                text: 'The Lab',
                href: '/lab'
            },
            {
                text: 'Contact Info',
                href: '/contact'
            }
        ];
    }]);
}());