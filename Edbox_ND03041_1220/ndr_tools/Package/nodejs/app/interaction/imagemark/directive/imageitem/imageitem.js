/**
 * Created by px on 2015/6/12.
 */

define(['angularAMD', 'components/site-directive/event-load/event-load',
], function (angularAMD) {
    angularAMD.directive('imageitem', ['$stateParams', 'ngDialog', function ($stateParams, ngDialog) {

        return {
            restrict: 'EA',
            templateUrl: 'interaction/imagemark/directive/imageitem/imageitem.html',
            scope: {
                tags: '=tags',
                tagIndex: '@tagIndex',
                imageItem: '=imageItem',
                markType: "=markType",
                validMarkHandler: '=validMarkHandler'
            },
            controller: ['$scope', '$filter', '$timeout', 'UtilsService', function ($scope, $filter, $timeout, UtilsService) {
                //资源文件的限制使用
                $scope.resourceValidParam = {
                    imageType: ['image/jpg', 'image/jpeg', 'image/webp', 'image/gif', 'image/png', 'image/bmp'],
                    imageSize: 1 * 1024 * 1024
                };

                //标签形式定义
                $scope.MARK_TYPE = $scope.$parent.MARK_TYPE;

                //最大标签数
                $scope.TAG_MAX_SIZE = 15;

                //默认半径
                $scope.AREA_RADIUS = 87.5;

                //虚拟标签, 为了计算默认圆点、编辑框的宽高度
                $scope.virtualTag = {};

                //载入图片标识
                $scope.isImageLoading = true;

                //未加载过图片标识、缩放比例、insertImgDiv、side_editwrap
                var unLoadedImage = true, scalePercent, insertImgDiv, imgmarkCtrl;

                //side_editwrap元素的宽高、点线标签的圆点宽高、点线标签的矩形宽高（默认）
                var CONTAINER_WIDTH = 1131,
                    CONTAINER_HEIGHT = 416,
                    CIRCLE_WIDTH = 17,
                    CIRCLE_HEIGHT = 17,
                    RANGE_WIDTH = 133.76835,
                    RANGE_HEIGHT = 107.66721;

                //用于计算点线标签的连线长度：圆点圆角间距、矩形圆角间距、默认圆点到矩形的水平|垂直方向的间距
                var CIRCLE_RADIUS_GAP = 8,
                    RECT_RADIUS_GAP = 3,
                    DEF_GAP = 20;

                function getScalePercent() {
                    return UtilsService.getScalePercent(angular.element(".scalable_layout"));
                }

                //计算点线标签的矩形左上顶点(left, top)
                function calcPosition(tag, quadrantIndex) {
                    //矩形的左上角坐标
                    var rec_x, rec_y;

                    switch (quadrantIndex) {
                        case 1: //第一象限: 矩形排列在圆点的左上方
                            rec_x = Math.max(0, tag.x - DEF_GAP - RANGE_WIDTH);
                            rec_y = Math.max(0, tag.y - DEF_GAP - RANGE_HEIGHT);

                            //当矩形可能与圆点重叠时，两者以第四象限排列
                            if (rec_x + RANGE_WIDTH >= tag.x || rec_y + RANGE_HEIGHT >= tag.y) {
                                calcPosition(tag, 4);

                                return;
                            }
                            break;
                        case 2: //第二象限: 矩形排列在圆点的右上方
                            rec_x = Math.min(CONTAINER_WIDTH - RANGE_WIDTH, tag.x + DEF_GAP + CIRCLE_WIDTH);
                            rec_y = Math.max(0, tag.y - DEF_GAP - RANGE_HEIGHT);

                            //当矩形可能与圆点重叠时，两者以第三象限排列
                            if (rec_x <= tag.x || rec_y + RANGE_HEIGHT >= tag.y) {
                                calcPosition(tag, 3);

                                return;
                            }
                            break;
                        case 3: //第三象限: 矩形排列在圆点的左下方
                            rec_x = Math.max(0, tag.x - DEF_GAP - RANGE_WIDTH);
                            rec_y = Math.min(CONTAINER_HEIGHT - RANGE_HEIGHT, tag.y + DEF_GAP + CIRCLE_HEIGHT);

                            //当矩形可能与圆点重叠时，两者以第二象限排列
                            if (rec_x + RANGE_WIDTH >= tag.x || rec_y <= tag.y) {
                                calcPosition(tag, 2);

                                return;
                            }
                            break;
                        default: //第四象限: 矩形排列在圆点的右下方
                            rec_x = Math.min(CONTAINER_WIDTH - RANGE_WIDTH, tag.x + DEF_GAP + CIRCLE_WIDTH);
                            rec_y = Math.min(CONTAINER_HEIGHT - RANGE_HEIGHT, tag.y + DEF_GAP + CIRCLE_HEIGHT);

                            //当矩形可能与圆点重叠时，两者以第一象限排列
                            if (rec_x <= tag.x || rec_y <= tag.y + CIRCLE_HEIGHT) {
                                calcPosition(tag, 1);

                                return;
                            }
                    }

                    tag.rec_x = rec_x;
                    tag.rec_y = rec_y;
                    calcLinkLine(tag);
                }

                //检查所有标签是否有效，即是否都在背景图片上
                $scope.validMarkHandler.run = function () {
                    if ($scope.markType === $scope.MARK_TYPE.LINE) {
                        var size = $scope.tags.length;
                        for (var i = 0; i < size; i++) {
                            if (!$scope.isPointOnImage($scope.tags[i])) {
                                return false;
                            }
                        }
                    } else if ($scope.markType === $scope.MARK_TYPE.AREA) {
                        var size = $scope.tags.length;
                        for (var i = 0; i < size; i++) {
                            if (!$scope.isCircleOnImage($scope.tags[i])) {
                                return false;
                            }
                        }
                    }

                    return true;
                };

                //选择背景图片的回调函数
                $scope.addAssets = function (asset_type) {
                    $scope.imageItem.asset_type = asset_type;
                    $scope.isImageLoading = true;
                };

                //图片加载后事件
                $scope.imageLoad = function () {
                    insertImgDiv = angular.element("#insertImgDiv");
                    if (unLoadedImage) {
                        unLoadedImage = false;

//                        //计算点线标签的圆点宽高
//                        var circle = $(".side_editwrap .circle:first");
//                        CIRCLE_WIDTH = circle.outerWidth();
//                        CIRCLE_HEIGHT = circle.outerHeight();
//                        CIRCLE_RADIUS_GAP = Math.sqrt(Math.pow(CIRCLE_WIDTH / 2, 2) * 2) - CIRCLE_WIDTH / 2; //假设50%
//
//                        //计算点线标签的矩形宽高
//                        var range = $(".side_editwrap .rectangle:first");
//                        RANGE_WIDTH = range.outerWidth();
//                        RANGE_HEIGHT = range.outerHeight();

                        //通过三角点拖动改变大小的反写
                        if ($scope.imageItem.other && $scope.imageItem.other['style']) {
                            if(insertImgDiv[0].style.width != 'auto' && insertImgDiv[0].style.height != 'auto') {
                                insertImgDiv.find('img').attr({width: insertImgDiv.width(), height: insertImgDiv.height()});
                            }
                        }

						UtilsService.safeApply($scope, function() {
							if ($scope.markType === $scope.MARK_TYPE.AREA) {
                                angular.forEach($scope.tags, function (tag) {
                                    tag.isEditor = true;
                                });
                            } else {
                                angular.forEach($scope.tags, function (tag) {
                                    tag.isEditor = true;

                                    //计算圆点与矩形间的连线
                                    calcLinkLine(tag);
                                });
                            }
						});
                    }

                    if ($scope.isImageLoading) {
                        $scope.isImageLoading = false;

                        imgmarkCtrl = angular.element(".imgmark .imgbig");
                        //CONTAINER_WIDTH = imgmarkCtrl.width();
                        //CONTAINER_HEIGHT = imgmarkCtrl.height();

                        execCalcBoxRect();
                    }
                };

                $scope.confirmPopupMessage = ""; //确认弹窗 消息文本
                var confirmPopupType, tagIndex;  //confirmPopupType[1: 切换标签模式; 2: 删除背景图片; 3: 移除标签]
                $scope.changeTagMode = function () {
                    if ($scope.tags && $scope.tags.length > 0) {
                        confirmPopupType = 1;
                        if ($scope.markType === $scope.MARK_TYPE.LINE) {
                            $scope.confirmPopupMessage = $filter('translate')('imagemark.marktype_line_tip');
                        } else {
                            $scope.confirmPopupMessage = $filter('translate')('imagemark.marktype_area_tip');
                        }

                        $scope.showConfirmPopup = true;
                    } else {
                        confirmChangeTagMode();
                    }
                };
                //确认切换标签模式
                function confirmChangeTagMode() {
                    $scope.tags = []; //清空所有标签
                    if ($scope.markType === $scope.MARK_TYPE.LINE) {
                        $scope.markType = $scope.MARK_TYPE.AREA;
                    } else {
                        $scope.markType = $scope.MARK_TYPE.LINE;
                    }
                };
                //移除背景图片
                $scope.removeBackground = function () {
                    confirmPopupType = 2;
                    $scope.confirmPopupMessage = $filter('translate')('imagemark.remove_background_confirm');
                    $scope.showConfirmPopup = true;
                };
                //移除标签
                $scope.removeTag = function ($index) {
                    confirmPopupType = 3;
                    tagIndex = $index;
                    $scope.confirmPopupMessage = $filter('translate')('imagemark.remove_tag_confirm');
                    $scope.showConfirmPopup = true;
                };
                /**
                 * 确认弹窗 确定按钮事件
                 * confirmPopupType[1: 切换标签模式; 2: 删除背景图片; 3: 移除标签]
                 */
                $scope.confirmPopup = function () {
                    switch (confirmPopupType) {
                        case 1:
                            confirmChangeTagMode();
                            break;
                        case 2:
                            $scope.imageItem.asset_type = '';
                            $scope.imageItem.asset = '';
                            $scope.imageItem.other = {};

                            $scope.tags = []; //清空所有标签
                            $scope.showEdit = false;
                            $scope.showConfirmRemoveBg = false;
                            break;
                        case 3:
                            $scope.tags.splice(tagIndex, 1);
                            break;
                        default:
                    }

                    $scope.showConfirmPopup = false;
                };
                function blurAllTags() {
                    angular.forEach($scope.tags, function(tag) {
                        tag.isFocus = false;
                    });
                }

                //双击背景图片事件
                var timer = null;
                $scope.ondblClick = function () {
                    timer && $timeout.cancel(timer);
                    $scope.showEdit = !$scope.showEdit;
                };

                //新增区域选择标签
                $scope.addAreaTag = function (event) {
                    if (!$scope.showEdit) {
                        timer && $timeout.cancel(timer);
                        timer = $timeout(function () {
                            if ($scope.tags.length < $scope.TAG_MAX_SIZE) {
                                var scalePercent = getScalePercent();
                                var containerOffset = imgmarkCtrl.offset();
                                var tag = {
                                    serial_num: '',
                                    value: '',
                                    x: (event.clientX - containerOffset.left - $scope.AREA_RADIUS) / scalePercent,
                                    y: (event.clientY - containerOffset.top - $scope.AREA_RADIUS) / scalePercent,
                                    area_circle_x: event.offsetX + insertImgDiv[0].offsetLeft,
                                    area_circle_y: event.offsetY + insertImgDiv[0].offsetTop,
                                    radius: $scope.AREA_RADIUS,
                                    image_src: '',
                                };

                                $scope.tags.push(tag);
                            }
                        }, 300);
                    }
                };

                //新增标签
                $scope.addTag = function (event) {
                    if ($scope.markType === $scope.MARK_TYPE.AREA) return;

                    timer && $timeout.cancel(timer);
                    timer = $timeout(function () {
                        if ($scope.tags.length < $scope.TAG_MAX_SIZE) {
                            var scalePercent = getScalePercent();
                            var containerOffset = imgmarkCtrl.offset();
                            var tag = {
                                serial_num: '',
                                value: '',
                                x: (event.clientX - containerOffset.left - CIRCLE_WIDTH / 2) / scalePercent,
                                y: (event.clientY - containerOffset.top - CIRCLE_HEIGHT / 2) / scalePercent,
                                isFocus: true
                            };

                            if (!checkTagCircleCross(tag)) {
                                var quadrantIndex = UtilsService.getQuadrantIndex(tag, CONTAINER_WIDTH, CONTAINER_HEIGHT);

                                calcPosition(tag, quadrantIndex);

                                blurAllTags();
                                $scope.tags.push(tag);
                            }
                        }
                    }, 300);
                };

                var startPoint, endPoint;
                $scope.mousedown = function (e) {
                    if ($scope.markType === $scope.MARK_TYPE.LINE) return;

                    e.preventDefault();
                    e.stopPropagation();
                    var scalePercent = getScalePercent();
                    var containerOffset = imgmarkCtrl.offset();
                    startPoint = {
                        x: ( e.clientX - containerOffset.left ) / scalePercent,
                        y: ( e.clientY - containerOffset.top ) / scalePercent
                    }
                }

                $scope.mouseup = function (e) {
                    if ($scope.markType === $scope.MARK_TYPE.LINE) return;

                    var scalePercent = getScalePercent();
                    var containerOffset = imgmarkCtrl.offset();
                    endPoint = {
                        x: ( e.clientX - containerOffset.left ) / scalePercent,
                        y: ( e.clientY - containerOffset.top  ) / scalePercent
                    }

                    var circlePoint = {
                        x: (startPoint.x + endPoint.x) / 2,
                        y: (startPoint.y + endPoint.y) / 2,
                        radius: UtilsService.calTwoPointDistance(startPoint, endPoint) / 2
                    }
                    if (circlePoint.radius < $scope.AREA_RADIUS && Math.abs(circlePoint.radius) > 20) {
                        circlePoint.radius = $scope.AREA_RADIUS;
                    }
                    if (circlePoint.radius >= $scope.AREA_RADIUS && $scope.tags.length < $scope.TAG_MAX_SIZE) {

                        var tag = {
                            serial_num: '',
                            value: '',
                            x: circlePoint.x - circlePoint.radius,
                            y: circlePoint.y - circlePoint.radius,
                            area_circle_x: circlePoint.x,
                            area_circle_y: circlePoint.y,
                            radius: circlePoint.radius,
                            image_src: '',
                            isFocus: true
                        };

                        blurAllTags();
                        $scope.tags.push(tag);

                    }
                    startPoint = {};
                    endPoint = {};
                }

                //重新计算连线
                $scope.redrawLine = function (tag, scope) {
                    UtilsService.safeApply(scope, function() {
                        calcLinkLine(tag);
                    });
                };

                //判断一个点是否在背景图片上
                $scope.isPointOnImage = function (point, tag) {
                    if (point.x < 0 || point.x > CONTAINER_WIDTH - CIRCLE_WIDTH ||
                        point.y < 0 || point.y > CONTAINER_HEIGHT - CIRCLE_HEIGHT) {
                        return false;
                    }

                    var points = getPointsByMatrix();

                    //Step3. 判断点是否在背景图片上(4个角点组成的多边形内)
                    var isPointInsidePoly = UtilsService.isPointInsidePoly(
                        {x: point.x + CIRCLE_WIDTH / 2, y: point.y + CIRCLE_HEIGHT / 2},
                        [points.leftTop, points.rightTop, points.rightBottom, points.leftBottom, points.leftTop]
                    );

                    if (isPointInsidePoly && tag) {
                        return !checkTagCircleCross(point, tag);
                    }

                    return isPointInsidePoly;
                };

                //判断圆是否在背景图片内  ，需满足两个条件 ： 1， 判断圆心点是否在背景图片上 ； 2 ，圆心与矩形四条边的距离都必须要小于半径
                $scope.isCircleOnImage = function (circle) {
                    //获取四个顶点
                    var points = getPointsByMatrix();

                    //获取半径
                    var radius = circle.radius || circle.target.width() / 2;
                    //判断圆心点是否在背景图片上(4个角点组成的多边形内)
                    if (!UtilsService.isPointInsidePoly({
                            x: circle.x + radius,
                            y: circle.y + radius
                        }, [points.leftTop, points.rightTop, points.rightBottom, points.leftBottom, points.leftTop])) {
                        return false;
                    }
                    //圆心与矩形四条边的距离都必须小于半径
                    var arr = [points.leftTop, points.rightTop, points.rightBottom, points.leftBottom];
                    for (var i = 0, l = arr.length; i < l; i++) {
                        arr[i].y = -arr[i].y;
                    }
                    for (var i = -1, l = arr.length, j = l - 1; ++i < l; j = i) {

                        var p = {x: circle.x + radius, y: circle.y + radius};

                        var distance = UtilsService.calPointToLineDistance(p, UtilsService.getEquation(arr[i], arr[j]));
                        if (radius >= distance) {
                            return false;
                        }
                    }

                    return true;
                };

                //画连接线, RECT_RADIUS_GAP 因为圆角产生的间隙
                function calcLinkLine(tag) {
                    //需要计算line.left, top, width, rorate
                    var rangeWidth = RANGE_WIDTH, rangeHeight = RANGE_HEIGHT;

                    if (tag.x > tag.rec_x) {
                        if (tag.y > tag.rec_y) { //左上角
                            tag.line_x = tag.x + CIRCLE_RADIUS_GAP;
                            tag.line_y = tag.y + CIRCLE_RADIUS_GAP;

                            var stopPoint = {
                                x: tag.rec_x + rangeWidth - RECT_RADIUS_GAP,
                                y: tag.rec_y + rangeHeight - RECT_RADIUS_GAP
                            };
                            tag.line_width = Math.sqrt(Math.pow(tag.line_x - stopPoint.x, 2) + Math.pow(tag.line_y - stopPoint.y, 2));
                            tag.line_rorate = UtilsService.getAngle(tag.line_x, tag.line_y, stopPoint.x, stopPoint.y);
                        } else { //左下角
                            tag.line_x = tag.x + CIRCLE_RADIUS_GAP;
                            tag.line_y = tag.y + CIRCLE_HEIGHT - CIRCLE_RADIUS_GAP;

                            var stopPoint = {
                                x: tag.rec_x + rangeWidth - RECT_RADIUS_GAP,
                                y: tag.rec_y + RECT_RADIUS_GAP
                            };
                            tag.line_width = Math.sqrt(Math.pow(tag.line_x - stopPoint.x, 2) + Math.pow(tag.line_y - stopPoint.y, 2));
                            tag.line_rorate = UtilsService.getAngle(tag.line_x, tag.line_y, stopPoint.x, stopPoint.y);
                        }
                    } else {
                        if (tag.y > tag.rec_y) { //右上角
                            tag.line_x = tag.x + CIRCLE_WIDTH - CIRCLE_RADIUS_GAP;
                            tag.line_y = tag.y + CIRCLE_RADIUS_GAP;

                            var stopPoint = {
                                x: tag.rec_x + RECT_RADIUS_GAP,
                                y: tag.rec_y + rangeHeight - RECT_RADIUS_GAP
                            };
                            tag.line_width = Math.sqrt(Math.pow(tag.line_x - stopPoint.x, 2) + Math.pow(tag.line_y - stopPoint.y, 2));
                            tag.line_rorate = UtilsService.getAngle(tag.line_x, tag.line_y, stopPoint.x, stopPoint.y);
                        } else { //右下角
                            tag.line_x = tag.x + CIRCLE_WIDTH - CIRCLE_RADIUS_GAP;
                            tag.line_y = tag.y + CIRCLE_HEIGHT - CIRCLE_RADIUS_GAP;

                            var stopPoint = {x: tag.rec_x + RECT_RADIUS_GAP, y: tag.rec_y + RECT_RADIUS_GAP};
                            tag.line_width = Math.sqrt(Math.pow(tag.line_x - stopPoint.x, 2) + Math.pow(tag.line_y - stopPoint.y, 2));
                            tag.line_rorate = UtilsService.getAngle(tag.line_x, tag.line_y, stopPoint.x, stopPoint.y);
                        }
                    }
                }

                //计算背景图片的四角点与中心点坐标
                var originBoxRect;

                function execCalcBoxRect() {
                    var img = insertImgDiv.find("img");
                    var width = img.width(), height = img.height();
                    originBoxRect = {
                        left: (CONTAINER_WIDTH - width) / 2,
                        top: (CONTAINER_HEIGHT - height) / 2,
                        width: width,
                        height: height
                    };
                    originBoxRect.right = originBoxRect.left + width;
                    originBoxRect.bottom = originBoxRect.top + height;

                    //矩形中心点(原点)
                    originBoxRect.origin = {
                        x: originBoxRect.left + width / 2,
                        y: originBoxRect.top + height / 2
                    };
                }

                //检查背景图片的四角点与中心点坐标 是否发生了变动
                function checkBoxRect() {
                    var width = insertImgDiv.width();
                    var height = insertImgDiv.height();

                    //中心点不变, 分别重新计算left, right, top, bottom
                    if (width != originBoxRect.width) {
                        var diff = (width - originBoxRect.width) / 2;

                        originBoxRect.left -= diff;
                        originBoxRect.right += diff;

                        originBoxRect.width = width;
                    }

                    if (height != originBoxRect.height) {
                        var diff = (height - originBoxRect.height) / 2;
                        originBoxRect.top -= diff;
                        originBoxRect.bottom += diff;

                        originBoxRect.height = height;
                    }
                }

                //判断当前标签圆点是否与其他标签圆点重叠
                function checkTagCircleCross(point, tag) {
                    if ($scope.tags.length > 0) {
                        var tagCircleRect = {
                            left: point.x, right: point.x + CIRCLE_WIDTH,
                            top: point.y, bottom: point.y + CIRCLE_HEIGHT
                        };

                        for (var i = 0; i < $scope.tags.length; i++) {
                            var indexTag = $scope.tags[i];
                            if (!tag || tag != indexTag) {
                                var isCross = UtilsService.checkRectsCross(tagCircleRect,
                                    {
                                        left: indexTag.x, right: indexTag.x + CIRCLE_WIDTH,
                                        top: indexTag.y, bottom: indexTag.y + CIRCLE_HEIGHT
                                    });

                                if (isCross) return true;
                            }
                        }
                    }

                    return false;
                }

                //获取缩放 ， 旋转 ， 位移 后的矩形四个顶点
                function getPointsByMatrix() {
                    //Step1. 背景图片是否被拖大或拉小（通过三个角：左上角、右上角、右下角）
                    checkBoxRect();

                    //Step2. 计算matrix转换后的背景图片的四个角的点坐标
                    var matrix = UtilsService.getElementMatrix(insertImgDiv);

                    var boxLTP = UtilsService.translateMatrixPoint(matrix, {
                        x: originBoxRect.left - originBoxRect.origin.x,
                        y: originBoxRect.top - originBoxRect.origin.y
                    });
                    boxLTP.x += originBoxRect.origin.x;
                    boxLTP.y += originBoxRect.origin.y;

                    var boxRTP = UtilsService.translateMatrixPoint(matrix, {
                        x: originBoxRect.right - originBoxRect.origin.x,
                        y: originBoxRect.top - originBoxRect.origin.y
                    });
                    boxRTP.x += originBoxRect.origin.x;
                    boxRTP.y += originBoxRect.origin.y;

                    var boxRBP = UtilsService.translateMatrixPoint(matrix, {
                        x: originBoxRect.right - originBoxRect.origin.x,
                        y: originBoxRect.bottom - originBoxRect.origin.y
                    });
                    boxRBP.x += originBoxRect.origin.x;
                    boxRBP.y += originBoxRect.origin.y;

                    var boxLBP = UtilsService.translateMatrixPoint(matrix, {
                        x: originBoxRect.left - originBoxRect.origin.x,
                        y: originBoxRect.bottom - originBoxRect.origin.y
                    });
                    boxLBP.x += originBoxRect.origin.x;
                    boxLBP.y += originBoxRect.origin.y;

                    return {
                        leftTop: boxLTP,
                        rightTop: boxRTP,
                        rightBottom: boxRBP,
                        leftBottom: boxLBP
                    }
                }

            }]
        };
    }])
});