/**
 * Created by px on 2015/6/15.
 */
define(['angularAMD','uuid'
], function (angularAMD,uuid) {
    angularAMD
        .directive('compareOptions', [ function () {
            return {
                restrict: 'E',
                templateUrl: 'compare/directive/options/options.html',
                scope: {itemsData: '=',pageSize:'@'},
                controller: ['$scope', function ($scope) {
                    if(!$scope.pageSize){
                        $scope.pageSize = 5;
                    }else{
                        $scope.pageSize = parseInt($scope.pageSize);
                    }
                    $scope.pageIndex=0;
                    $scope.delItem = function (index) {
                        $scope.itemsData.splice(index,1);
                        if( $scope.pageIndex>0){
                            $scope.pageIndex= $scope.pageIndex-1;
                        }
                    }
                    $scope.addItem = function () {
                        $scope.itemsData.push(angular.extend({
                            content_type: "text",
                            content:"",
                            horizontal_index:"",
                            vertical_index:"",
                            other:'style="width:300px;"',
                            id:uuid.v4()
                        }));
                        if( $scope.itemsData.length>$scope.pageSize){
                            $scope.pageIndex= $scope.pageIndex+1;
                        }


                    }
                    $scope.addImage=function(opt){
                        opt.content_type='image';
                    }
                }]
            };
        }])
});
