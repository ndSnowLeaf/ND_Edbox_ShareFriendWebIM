/**
 * Created by px on 2015/6/15.
 */
define(['angularAMD','uuid','angular.drag.drop'
], function (angularAMD,uuid) {
    angularAMD
        .directive('tableOptions', [ function () {
            return {
                restrict: 'E',
                templateUrl: 'interaction/table/directive/options/options.html',
                scope: {itemsData: '=',pageSize:'@'},
                replace:true ,
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
                    };
                    
                    //资源文件的限制使用
                    $scope.resourceValidParam = {
                        imageType:['image/jpg', 'image/jpeg', 'image/webp', 'image/gif', 'image/png', 'image/bmp'], 
                        imageSize:1*1024*1024, 
                    };


                    $scope.getStrLeng = getLength;
                    function getLength(str){
                        var realLength = 0;
                        if(str === undefined){
                            return realLength;
                        }
                        var len = str.length;
                        var charCode = -1;
                        for(var i = 0; i < len; i++){
                            charCode = str.charCodeAt(i);
                            if (charCode >= 0 && charCode <= 128) {
                                realLength += 1.25;
                            }else{
                                // 如果是中文则长度加3
                                realLength+=2;
                            }
                        }
                        return realLength;
                    }
                }]
            };
        }])
});