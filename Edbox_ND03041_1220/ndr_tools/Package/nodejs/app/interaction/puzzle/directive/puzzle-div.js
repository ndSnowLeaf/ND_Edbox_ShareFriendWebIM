/**
 * Created by Administrator on 2015/12/3.
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD.directive('puzzleDiv', [function () {
        return {
            restrict: 'E',
            templateUrl: 'interaction/puzzle/directive/puzzle-div.html',
            link: function (scope, element) {
                AddonThree2DPuzzle_create().initViewPrepareLessons(scope);
            }
        };
    }]);
});
