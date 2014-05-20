(function () {
    'use strict';
    angular.module('jg').controller('HeaderCtrl', ['$scope', '$location', function ($scope, $location) {

        var Link = function (config) {
            this.text = config.text;
            this.href = config.href;
            this.disabled = config.disabled;
        };

        Link.prototype.isActive = function () {
            return this.href === $location.path();
        };

        $scope.links = [
            
            new Link({
                text: 'Home',
                href: '/'
            }),

            new Link({
                text: 'Resume',
                href: '/resume'
            }),

            new Link({
                text: 'Portfolio',
                href: '/portfolio'
            }),
            
            new Link({
                text: 'The Lab',
                href: '/lab'
            }),

            new Link({
                text: 'Music',
                href: '/music'
            }),

            new Link({
                text: 'Contact Info',
                href: '/contact'
            })
        ];
    }]);
}());