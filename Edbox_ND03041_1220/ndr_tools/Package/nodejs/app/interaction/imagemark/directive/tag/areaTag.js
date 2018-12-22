/**
 * Created by px on 2015/6/12.
 */

define(['angularAMD'
], function (angularAMD) {

    angularAMD.directive('areatag', [function () {
        return {
            restrict: 'E',
            templateUrl: 'interaction/imagemark/directive/tag/areaTag.html',
            replace: true,
            scope: {
                tagsData: '=tagsData',
                tagData: '=tagData',
                tagIndex: '@tagIndex',
                onRemoveTag: '&onRemoveTag',
                isCircleOnImage: '=',
            },
            controller: ['$scope', '$timeout', '$element', 'UtilsService', function ($scope, $timeout, $element, UtilsService) {
                //资源文件的限制使用
                $scope.resourceValidParam = {
                    imageType: ['image/jpg', 'image/jpeg', 'image/webp', 'image/gif', 'image/png', 'image/bmp'],
                    imageSize: 1 * 1024 * 1024
                };
                //删除标签
                $scope.removeTag = function (itemOld, index, objX, objY) {
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
                $scope.onInputFocus = function() {
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
                
                //区域标签最小半径
            	var MIN_RADIUS = 87.5;
            	
                //拖动小正方形初始化属性
                $scope.squareOptions = {
                    began: function (e, startPosition) {
                    	blurAllTags();
                        var $circle = angular.element("#circle" + $scope.tagIndex);

                        this.circle = {
                            originX: $circle[0].offsetLeft,
                            originY: $circle[0].offsetTop,
                            input: {
                                originW: $scope.tagData.width,
                                originH: $scope.tagData.height
                            },
                            originRadius: $scope.tagData.radius
                        };

                        this.$circle = $circle;
                        this.square = {
                            originP: startPosition
                        };
                    },
                    canMove: function (curPostion) {
                        var distance = this.onlymove === 'x' ? curPostion.addX : curPostion.addY;

                        var originXOrY = this.onlymove === 'x' ? this.square.originP.x : this.square.originP.y;
                        var curXOrY = this.onlymove === 'x' ? curPostion.x : curPostion.y;
                        if ((originXOrY - this.circle.originRadius ) * ( curXOrY - this.circle.originRadius ) < 0) {
                            return false;
                        }

                        //如果移动的是圆心左边的点
                        if ((this.onlymove === 'x' && this.circle.originRadius > curPostion.x) || 
                        		(this.onlymove === 'y' && this.circle.originRadius > curPostion.y)) {
                            distance = -distance;
                        }
                        var circle = this.circle;
                        var radius = circle.originRadius + distance;
                        if (radius < MIN_RADIUS) return false;

                    },
                    moved: function (e, curPostion) {
                        var distance = this.onlymove === 'x' ? curPostion.addX : curPostion.addY;
                        if ((this.onlymove === 'x' && this.circle.originRadius > curPostion.x) ||
                            (this.onlymove === 'y' && this.circle.originRadius > curPostion.y)) {
                            distance = -distance;
                        }

                        var circle = this.circle;
                        $scope.$apply(function () {
                            $scope.tagData.isAreaChanging = true;
                            $scope.tagData.x = distance > 0 ? circle.originX - distance : circle.originX - distance;
                            $scope.tagData.y = distance > 0 ? circle.originY - distance : circle.originY - distance;
                            $scope.tagData.radius = circle.originRadius + distance;
                        });
                    },
                    ended: function (e, curPosition) {
                        $scope.$apply(function () {
                            $scope.tagData.isAreaChanging = false;
                            focusCurrentTag();
                        });

                        var p = {
                            x: this.$circle[0].offsetLeft,
                            y: this.$circle[0].offsetTop,
                            target: this.$circle,
                            radius: this.$circle.width() / 2
                        };

                        if (isCanMoveEnd(p, $scope.tagData, $scope.tagsData) === false) {
                            this.$circle.css({
                                left: this.circle.originX,
                                top: this.circle.originY,

                            });
                            var circle = this.circle;
                            $scope.$apply(function () {
                                $scope.tagData.x = circle.originX;
                                $scope.tagData.y = circle.originY;
                                $scope.tagData.radius = circle.originRadius;
                                $scope.tagData.width = circle.input.originW;
                                $scope.tagData.height = circle.input.originH;
                            });
                        }
                        
                        delete this.$circle;
                    },
                    isMoveCircle: true,
                    positionByExternal: true,
                };

                $scope.circleOptions = {
                    beganStart: function (e) {
                    	blurAllTags();
                        var $circle = angular.element("#circle" + $scope.tagIndex);
                        this.$circle = $circle;
                    },
                    began: function (e, startPosition) {
                        this.startPosition = startPosition;
                    },
                    moved: function (e, curPostion) {
                        $scope.$apply(function () {
                            $scope.circleOptions.isMoving = true
                        });
                    },
                    ended: function (e, curPosition) {
                        $scope.$apply(function () {
                            $scope.circleOptions.isMoving = false;
                            focusCurrentTag();
                        });

                        curPosition.target = this.$circle;
                        curPosition.radius = curPosition.target.width() / 2;
                        if (isCanMoveEnd(curPosition, $scope.tagData, $scope.tagsData) === false) {
                            this.$circle.css({
                                left: this.startPosition.x,
                                top: this.startPosition.y
                            });
                        } else {
                            $scope.$apply(function () {
                                $scope.tagData.x = curPosition.x;
                                $scope.tagData.y = curPosition.y;
                            });
                        }
                        
                        delete this.$circle;
                    },
                    
                    isMoving: false,
                    isMoveCircle: true
                };

                var STAGE_CTRL = angular.element(".imgmark");
                function isCanMoveEnd(p, cTag, tagArr) {
                    var width = STAGE_CTRL.width(), height = STAGE_CTRL.height();
                    //判断圆是否超出最外层容器wrapper
                    if (p.x < 0 || p.x > width - 2 * p.radius) {
                        return false;
                    }
                    if (p.y < 0 || p.y > height - 2 * p.radius) {
                        return false;
                    }
                    //判断圆是否超出最外层容器wrapper ---- end

                    //判断圆是否在背景图片内
                    if ($scope.isCircleOnImage(p) === false) {
                        return false;
                    }
                    //判断点到多边形各边的距离是否小于半径
                    for (var i = 0, l = tagArr.length; i < l; i++) {
                        if (cTag !== tagArr[i]) {
                            var pa = {
                                    x: p.x + p.radius,
                                    y: p.y + p.radius
                                },
                                pb = {
                                    x: tagArr[i].x + tagArr[i].radius,
                                    y: tagArr[i].y + tagArr[i].radius
                                }
                            if (UtilsService.calTwoPointDistance(pa, pb) < p.radius + tagArr[i].radius) {
                                return false;
                            }
                        }
                    }
                    
                    return true;
                }
            }]
        };
    }])
});