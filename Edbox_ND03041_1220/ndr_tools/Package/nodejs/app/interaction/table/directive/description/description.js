/**
 * Created by px on 2015/6/12.
 */

define(['angularAMD',
    'components/site-directive/jq-media/jq.media',
    'components/site-directive/event-load/event-load'
], function (angularAMD) {
    angularAMD.directive('description', ['$stateParams', 'ngDialog', '$timeout', function ($stateParams, ngDialog, $timeout) {
        return {
            restrict: 'EA',
            templateUrl: 'interaction/table/directive/description/description.html',
            scope: {
                description: '=descriptionData',
                defaultTitleSetting: '=',
                imageSize: '@',
                audioSize: '@',
                videoSize: '@'
            },
            replace: true,
            controller: function ($scope) {
                $scope.deleteDescription = function () {
                    $scope.description.asset_type = '';
                    $scope.description.asset = '';
                    $scope.description.other = {};
                };
				
                var jqMedia = function(mediaType) {
					$timeout(function () {
						if (mediaType === 'video') {
							angular.element("#my_media_video").videoplayer();
						} else if (mediaType === 'audio') {
							angular.element("#my_media_audio").audioplayer();
						}
					}, 800);
				};
				$scope.$watch('description.asset_type', function(newVal, oldVal) {
					if(!!newVal) {
						var asset_type = $scope.description.asset_type;
						if (asset_type === 'image') {
							$scope.imageLoadedFlag = false;
						} else {
							jqMedia(asset_type);
						}
					}
				});
				
                //图片已加载标识
                $scope.imageLoadedFlag = false;
                $scope.addAssets = function (asset_type) {
                    $scope.description.asset_type = asset_type;
                };

                $scope.imageLoad = function () {
                    if (!$scope.imageLoadedFlag) {
                        $scope.imageLoadedFlag = true;
                        $('.insert_mvp .insert_pic_box .piccon').css('height', 'auto');
                    }
                };

                //资源文件的限制使用
                $scope.resourceValidParam = {
                    imageType: ['image/jpg', 'image/jpeg', 'image/webp', 'image/gif', 'image/png', 'image/bmp'],
                    imageSize: 1 * 1024 * 1024,
                    videoType: 'video/mp4',
                    videoSize: 5 * 1024 * 1024,
                    audioType: ['audio/mp3', 'audio/mpeg'],
                    audioSize: 1 * 1024 * 1024
                };

                $scope.onFocusTitle = function(event) {
                    if($scope.description.text == $scope.defaultTitleSetting.title) {
                        setTimeout(function() {
                            event.target.select();
                        }, 100);
                    }
                };

                $scope.onBlurTitle = function(event) {
                    if(!$scope.defaultTitleSetting.titleTarget) {
                        $scope.defaultTitleSetting.titleTarget = event.target;
                    }

                    if(!$scope.description.text) {
                        $scope.defaultTitleSetting.isCleared = true;
                        $scope.description.text = $scope.defaultTitleSetting.title;
                    } else {
                        $scope.defaultTitleSetting.isCleared = false;
                    }
                };
            }
        };
    }])

});