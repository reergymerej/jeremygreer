(function () {
    'use strict';

    angular.module('jg').controller('ContactCtrl', ['$scope', function ($scope) {
        var isHuman = function () {
            return true;
        };

        var contactInfo = {
            address: 'Cumming, GA 30040',
            phone: '(956) 678-0513',
            email: 'jeremy.greer.atl@gmail.com'
        };

        $scope.contactInfo = undefined;

        $scope.submitForm = function () {
            if (isHuman()) {
                $scope.contactInfo = contactInfo;
                $('#phone').tooltip({});
            }
        };

    }]);
}());