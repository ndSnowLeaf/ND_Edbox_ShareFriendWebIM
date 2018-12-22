/**
 * Created by lxq on 2015/7/29.
 */
define(['angularAMD',
], function (angularAMD) {
    angularAMD .directive('classificationItem', [ function () {
        return {
            restrict:'E',
			replace: true,
            templateUrl:'interaction/classified/directive/classification-item/classification-item.html',
            scope: {itemData:'=itemData', itemsData:'=itemsData'},
            controller:['$scope','$rootScope','$timeout','$filter','CharsetService',function($scope,$rootScope,$timeout,$filter,CharsetService){
            	$scope.CARD_TYPE = {
                	IMAGE: "image",
                	TEXT: "text"
                };
				$scope.PLACE_HOLDER = $filter('translate')('classified.class_name_placeholder');
				$scope.OPTION_PLACE_HOLDER = $filter('translate')('classified.option_text_placeholder');
            	$scope.CARD_MAX_SIZE = 6;
            	$scope.CARD_TEXT_MAXLEN = 15;
            	$scope.wordTipStyle = { float: 'right' };

            	if(!$.isArray($scope.itemData.items)) $scope.itemData.items = [];

				$scope.getTextBytes = function(text) {
					return CharsetService.getTextBytes(text);
				};
				$scope.itemNameLength = $scope.getTextBytes($scope.itemData.name);
				$scope.$watch('itemData.name', function() {
					$scope.itemNameLength = $scope.getTextBytes($scope.itemData.name);
				});

				//删除当前分类
				$scope.removeCategory = function() {
					$rootScope.moduleScope.openDelCategoryPopBox($scope.itemData);
				};

				//新增选项
            	$scope.addItemCard = function(card_type, $event) {
            		if(!$scope.itemData.items || $scope.itemData.items.length < $scope.CARD_MAX_SIZE) {
            			$scope.itemData.items.push({type:card_type, content:''});

            			//自动激活输入框或图片选择器
            			$timeout(function(){
							if(card_type === $scope.CARD_TYPE.IMAGE) {
								$($event.target).parents(".list_box").find("li .list_text:last").blur();
								$($event.target).parents(".list_box").find("li .list_img:last").click();
							} else {
								$($event.target).parents(".list_box").find("li .list_text:last").focus();
							}
                        }, 100);
            		}
                };

				//删除当前选项
				$scope.removeCard = function(index) {
					$scope.itemData.items.splice(index, 1);
				};

				//图片选择窗口关闭事件
				$scope.afterAddAssets = function(card, index) {
					if(!card.content) {
						$scope.itemData.items.splice(index, 1);
					}
				};

                //资源文件的限制使用
                $scope.resourceValidParam = {
                	imageType:['image/jpg', 'image/jpeg', 'image/webp', 'image/gif', 'image/png', 'image/bmp'], 
                    imageSize:1*1024*1024
                };
            }]
        };
    }])

});