/**
 * Created by tinler on 2016/01/05.
 */

define(['angularAMD'
], function (angularAMD) {
    angularAMD.directive('tag', [function () {
        return {
            restrict: 'E',
            templateUrl: 'interaction/imagemark/directive/tag/tag.html',
            replace: true,
            scope: {
                tagsData: '=tagsData',
                tagData: '=tagData',
                imageItem: '=imageItem',
                tagIndex: '@tagIndex',
                onRemoveTag: '&onRemoveTag',
                redrawLine: '=redrawLine',
                isPointOnImage: '='
            },
            controller: ['$scope', '$timeout', '$element', function ($scope, $timeout, $element) {
                //资源文件的限制使用
                $scope.resourceValidParam = {
                    imageType: ['image/jpg', 'image/jpeg', 'image/webp', 'image/gif', 'image/png', 'image/bmp'],
                    imageSize: 1 * 1024 * 1024
                };
                //删除标签
                $scope.removeTag = function () {
                    $scope.onRemoveTag();
                };
                //设置图片
                $scope.addTagAssets = function (asset_type) {
                	blurAllTags();
                	$scope.tagData.isFocus = true;
                    $scope.tagData.isEditing = true;
                    $scope.tagData.type = asset_type;
                };
                //点击输入文件事件
                $scope.clickText = function (event) {
                	blurAllTags();
                	$scope.tagData.isFocus = true;
                    $scope.tagData.isEditing = true;
                    $scope.tagData.type = "text";
                    $timeout(function () {
                        $("#tag" + $scope.tagIndex).focus();
                    }, 100)
                };
                $scope.onInputFocus = function () {
                	blurAllTags();
                	$scope.tagData.isFocus = true;
                    $scope.tagData.isEditing = true;
                };
                //文本编辑框失去焦点时，若无输入，恢复素材选择状态
                $scope.onInputBlur = function (event) {
                	$scope.tagData.isFocus = false;
                    $scope.tagData.isEditing = false;
                    if (!$scope.tagData.value) {
                        if(!!event.target.innerHTML) {
							$scope.tagData.value = event.target.innerHTML;
						} else {
							$scope.tagData.type = '';
						}
                    }
                };
                function blurAllTags() {
                	angular.forEach($scope.tagsData, function(tag) {
                		tag.isFocus = false;
                	});
                }
                function focusCurrentTag(blurOtherTag) {
                	blurOtherTag && blurAllTags();
                	$scope.tagData.isFocus = true;
                }

                //样式中定的标签的宽高值 .exam_wood .com_layout .imgmark .imgbox
                var TAG_WIDTH = 133.76835, TAG_HEIGHT = 107.66721;
                var STAGE_CTRL = angular.element(".imgmark");
                
                //拖动标签初始化属性
                $scope.inputOptions = {
                    began: function () {
                    	blurAllTags();
                        $range = angular.element("#imgboxContral" + $scope.tagIndex);
                        this.range = {
                            originX: $range[0].offsetLeft,
                            originY: $range[0].offsetTop
                        };
                        
                        this.moveRange = {
                            x: {min: 0, max: STAGE_CTRL.width() - TAG_WIDTH },
                            y: {min: 0, max: STAGE_CTRL.height() - TAG_HEIGHT }
                        }
                    },
                    moved: function (e, curPostion) {
                        $scope.$apply(function () {
                            $scope.inputOptions.isMoving = true
                        });

                        $scope.tagData.rec_x = curPostion.x;
                        $scope.tagData.rec_y = curPostion.y;

                        $scope.redrawLine($scope.tagData, $scope);
                    },
                    ended: function () {
                        $scope.$apply(function () {
                            $scope.inputOptions.isMoving = false;
                            focusCurrentTag();
                        });
                    },
                    isMoving: false,
                    isMoveCircle: false,
                    moveRange: {
                    	x: {min: 0, max: STAGE_CTRL.width() - TAG_WIDTH },
                        y: {min: 0, max: STAGE_CTRL.height() - TAG_HEIGHT }
                    }
                };

                //拖动小圆圈初始化属性
                $scope.circleOptions = {
                    began: function () {
                    	blurAllTags();
                        $range = angular.element("#imgboxContral" + $scope.tagIndex);
                        this.range = {
                            originX: $range[0].offsetLeft,
                            originY: $range[0].offsetTop
                        };
                    },
                    canMove: function (position) {
                        if ($scope.isPointOnImage) {
                            return $scope.isPointOnImage(position, $scope.tagData);
                        }

                        return true;
                    },
                    moved: function (e, curPostion) {
                        var p = {
                            x: this.range.originX + curPostion.addX,
                            y: this.range.originY + curPostion.addY
                        }

                        $scope.tagData.x = curPostion.x;
                        $scope.tagData.y = curPostion.y;
                        $range = angular.element("#imgboxContral" + $scope.tagIndex);
                        if (this.rectangleMoveRange) {
                            var xMax = this.rectangleMoveRange.x.max - $range.width();
                            var yMax = this.rectangleMoveRange.y.max - $range.height();
                            if (p.x < this.rectangleMoveRange.x.min || p.x > xMax || p.y < this.rectangleMoveRange.y.min || p.y > yMax) {

                                $scope.redrawLine($scope.tagData, $scope);

                                return;
                            }
                        }
                        $scope.tagData.rec_x = p.x;
                        $scope.tagData.rec_y = p.y;
                        $range.css({left: $scope.tagData.rec_x, top: $scope.tagData.rec_y});

                        $scope.redrawLine($scope.tagData, $scope);
                        focusCurrentTag();
                    },
                    tag: $scope.tagData,
                    isMoveCircle: true,
                    range: {
                        originX: $scope.tagData.rec_x,
                        originY: $scope.tagData.rec_y
                    },
                    circle: {
                        originX: $scope.tagData.x,
                        originY: $scope.tagData.y
                    },
                    moveRange: {x: {min: 0}, y: {min: 0}},
                    rectangleMoveRange: $scope.inputOptions.moveRange
                };
            }]
        };
    }])
});