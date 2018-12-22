define(['angularAMD'
], function (angularAMD) {
    angularAMD.directive('markTypeGuide', [function () {
        return {
            restrict: 'E',
            templateUrl: 'interaction/imagemark/directive/mark-type-guide/mark-type-guide.html',
            scope: false,
            controller: ['$scope', function ($scope) {
            }]
        };
    }])
});