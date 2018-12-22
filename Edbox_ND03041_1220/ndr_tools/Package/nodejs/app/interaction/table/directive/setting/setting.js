/**
 * Created by px on 2015/6/15.
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD
    .directive('tableSetting', [ function () {
            return {
                restrict: 'E',
                templateUrl: 'interaction/table/directive/setting/setting.html',
                scope: {horizontalItems: '=',verticalItems:'=',tableItems:'=',dragItems:'='},
                controller: ['$scope', function ($scope) {

                    $scope.delItem = function (items) {
                       items.pop();
                        var hl = $scope.horizontalItems.length;
                        var vl = $scope.verticalItems.length;
                        _.remove($scope.tableItems, function(item) {
                            var del=item.horizontal_index>=hl || item.vertical_index>=vl;
                            if(del){
                                $scope.dragItems.push(item);
                            }
                            return del ;
                        });
                    }
                    $scope.addItem = function (items) {
                        items.push("");
                    }
                }]
            };
        }])
});