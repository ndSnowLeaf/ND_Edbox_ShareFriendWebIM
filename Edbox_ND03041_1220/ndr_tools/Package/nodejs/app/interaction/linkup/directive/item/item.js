/**
 * Created by px on 2015/6/9.
 */
define(['angularAMD'
], function (angularAMD) {
    angularAMD .directive('matchItem', [ function () {
        return {
            restrict:'E',
            templateUrl:'interaction/linkup/directive/item/item.html',
            scope: {
            	itemsData:'=itemsData',
            	itemNew:'=itemData',
            	indexNew:'@itemIndex',
            	moduleSubtype:'@',
            	delData:'=',
            	remoteHandler:'=?'
            },
            controller:['$rootScope', '$scope','$timeout',function($rootScope, $scope,$timeout){
            	$scope.imageSize = 120;
            	//资源文件的限制使用
                $scope.resourceValidParam = {
                	imageType:['image/jpg', 'image/jpeg', 'image/webp', 'image/gif', 'image/png', 'image/bmp'], 
                    imageSize:1*1024*1024
                };

                var newData = null;
                if($scope.moduleSubtype=='image2text'){
                    newData = {
                        source:{
                            item_type:"image",
                            href:""
                        },
                        target:{
                            item_type:"text",
                            text:""
                        }
                    }
                }else if($scope.moduleSubtype=='image2image'){
                    newData = {
                        source:{
                            item_type:"image",
                            href:""
                        },
                        target:{
                            item_type:"image",
                            href:""
                        }
                    }
                }else{
                    newData = {
                        source:{
                            item_type:"text",
                            text:""
                        },
                        target:{
                            item_type:"text",
                            text:""
                        }
                    }
                }
                var watchChange=function(newValue,oldValue){
//                	console.log("change data ",newValue,oldValue,$scope.remoteHandler);
                	if(newValue!=oldValue){                		
                		if($scope.remoteHandler){
	                    	$scope.remoteHandler.changeData();
	                    }
                	}
                };
                $scope.$watch("itemNew.source.text",watchChange);
                $scope.$watch("itemNew.source.href",watchChange);
                $scope.$watch("itemNew.target.text",watchChange);
                $scope.$watch("itemNew.target.href",watchChange);
                
                
                if(!$scope.itemNew || !$scope.itemNew.source){
                    angular.copy(newData,$scope.itemsData[$scope.indexNew]);
                }
                $scope.delMatchItem = function(itemOld,index){
                    //至少要有3个。少于三个时的删除，只清空选项的内容，不删除选项
                    if($scope.itemsData.length<=3){
                         angular.copy(newData,itemOld);
                    }else{
                        $scope.itemsData.splice(index,1);
                        $scope.delData.data = angular.copy(itemOld);
                    }
                    if($scope.remoteHandler){
                    	$scope.remoteHandler.changeData();
                    }
                }
                $scope.clickText = function(data,thisObj){
                    data.isEditText=true
                    $timeout(function(){
                        $(thisObj.target).prev().prev().find("textarea").focus();
                    },100)
                };
                $scope.editorText = function(data,thisObj){
                    data.isEditText=true
                    $timeout(function(){
                        $(thisObj.target).closest(".itemcon").find("textarea").focus();
                    },100)
                };
                
                var startTime;
                $scope.onMousedown = function(event) {
                	startTime = new Date().getTime();
                	$(event.target).attr("cancelClick", false);
                };

                $scope.onMouseup = function(event, href) {
                	var interval = new Date().getTime() - startTime;
                	if(interval >= 300) {
                		$(event.target).attr("cancelClick", true);
                		
                		var moduleScope = $rootScope.moduleScope;
                		moduleScope.imagePreviewHref = href.replace("?size=" + $scope.imageSize, "?");
                		moduleScope.isImagePreview = true;
                		
                		return false;
                	}
                };
            }]
        };
    }])

});