/**
 * Created by px on 2015/6/12.
 */

define(['angularAMD'
], function (angularAMD) {
    angularAMD.directive('multimediaSelection', ['$stateParams','$filter', function ($stateParams, $filter) {
        return {
            restrict:'EA',
            templateUrl:'interaction/guessword/directive/multimedia-selection/multimedia-selection.html',
            scope:{
            	multimediaItem:'=multimediaItem',editable:'=isEditable'
            },
            controller:function($scope){
                if(!!$scope.multimediaItem && $scope.multimediaItem.item_path) {
                    $scope.ngItemHref = $filter('filterRefPath')($scope.multimediaItem.item_path);
                }

                $scope.deleteMultimediaItem = function(){
                    $scope.multimediaItem.item_type = '';
                    $scope.multimediaItem.item_path = '';
                    $scope.multimediaItem.item_url = '';
                    $scope.multimediaItem.other = {};
                };
                
                $scope.addAssets = function(asset_type){
                	$scope.multimediaItem.asset_type = asset_type;
                	$scope.multimediaItem.asset = $scope.multimediaItem.item_path;
                    $scope.multimediaItem.item_type = (asset_type == 'image' ? 'picture' : asset_type);
                    $scope.multimediaItem.item_url = $scope.multimediaItem.item_path;
                    $scope.ngItemHref = $filter('filterRefPath')($scope.multimediaItem.item_path);

                    if(asset_type=='video' || asset_type=='audio'){
                        $scope.multimediaItem.other = {
                            controls:'controls',
                            preload:'false',
                            style:"height:100%; width:100%;"
                        };
                    }
                };
                
                //资源文件的限制使用
                $scope.resourceValidParam = {
                	imageType:['image/jpg', 'image/jpeg', 'image/webp', 'image/gif', 'image/png', 'image/bmp'], 
                    imageSize:1*1024*1024, 
                    videoType:'video/mp4', 
                    videoSize:5*1024*1024, 
                    audioType:['audio/mp3', 'audio/mpeg'],  
                    audioSize:1*1024*1024
                };
            }
        };
    }])

});