define([
    'jquery',
    'angular',
    '../LaModule.js',
    'text!../../templates/checkList.html'
], function (jquery, angular, LaModule, checkListTpl) {
    var $thumbnail,//拖拽的浮动缩略图
        $thumbnailText,
        $itemDragging,//缓存当前正在被拖拽的item
        $regionDraggable,// 可拖拽区域
        isUnderDragging = false,//标志是否处于拖动排序状态
        beforeDragItemIdx = -1,//记录最开始时的条目在数组中的下标
        afterDragItemIdx = -1,//记录排序后的条目在数组中的下标
        currentMouseY = -1,//当前鼠标移动的位置
        lastMouseY = -1;//上一次鼠标移动的位置

    var scopeCache;

    // document绑定松开鼠标的状态重置逻辑
    $(document).on('mouseup', function () {
        isUnderDragging = false;
        if ($thumbnail) {
            $thumbnail.removeClass('move');
        }
        if ($itemDragging) {
            $itemDragging.css({'opacity': '1', "pointer-events": "auto"});
        }
        $itemDragging = null;
        if (beforeDragItemIdx !== -1 && afterDragItemIdx !== -1) {
            if (beforeDragItemIdx !== afterDragItemIdx) {
                // 发送排序消息
                scopeCache.$emit('sortItem', {
                    beforeSortIdx: beforeDragItemIdx,
                    afterSortIdx: afterDragItemIdx
                });
            }
        }
        beforeDragItemIdx = afterDragItemIdx = -1;
    });

    // 控制点击其他地方是否隐藏【参考范例】弹框
    $(document).on('click', function (event) {
        var $taget = jquery(event.target);
        var mark = $taget.attr('_mark');
        var isHideRefExample = true;
        if (mark === "radio_region_narration"
            || mark === "radio_region_argumentation"
            || mark === "radio_region_expositoryWriting"
            || mark === "radio_region_no_limits"
            || mark === "radio_region_level1_outline"
            || mark === "radio_region_level2_outline") {
            isHideRefExample = false;
        }
        scopeCache.$emit('hideCheckList', {
            isHideRefExample: isHideRefExample
        });
    });

    // 实现li的拖动排序指令
    LaModule.directive('dragSort', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('mousedown', function (event) {
                    if (isItemOnFocus) {
                        return;
                    }
                    var $taget = jquery(event.target);
                    if ($taget[0].nodeName === 'INPUT') {
                        return;
                    }
                    beforeDragItemIdx = $taget.attr('_itemIdx');
                    isUnderDragging = true;
                    $itemDragging = element;
                    element.css({'opacity': '0', "pointer-events": "none"});
                    $thumbnailText.text(element.text());
                    $thumbnail.addClass('move');
                });
                element.on('mousemove', function (event) {
                    if (!isUnderDragging) {
                        return;
                    }
                    var $taget = jquery(event.target);
                    afterDragItemIdx = $taget.attr('_itemIdx');
                    if (!$itemDragging || $itemDragging === element) {
                        return;
                    }
                    if (lastMouseY < currentMouseY) {
                        $itemDragging.insertAfter(element);
                    }
                    if (lastMouseY > currentMouseY) {
                        $itemDragging.insertBefore(element);
                    }
                    lastMouseY = currentMouseY;
                });
            }
        }
    }]);

    /**
     * 该指令的作用是处理input输入框失去焦点的逻辑
     */
    var isItemOnFocus = false;
    LaModule.directive('loseFocus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.nextAll().on('mousedown', function (event) {
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    } else {
                        event.cancelBubble = true;
                    }
                });
                element.on('focus',function() {
                    isItemOnFocus = true;
                }).on('blur', function () {
                    // 发送重置消息
                    scope.$emit('saveEditItem', {
                        itemIdx: attrs.itemidx,
                        saveText: element.val().trim()
                    });
                    isItemOnFocus = false;
                });
                // var $SiblingP = element.prev();
                // var currentItemText = '', lastItemText = '';
                // element.on('focus', function () {
                //     lastItemText = $SiblingP.text().trim();
                //     isItemOnFocus = true;
                // }).on('blur', function () {
                //     // 发送重置消息
                //     scope.$emit('saveEditItem', {
                //         itemIdx: attrs.itemidx,
                //         saveText: currentItemText
                //     });
                //     if (currentItemText === '' && lastItemText !== '') {
                //         element.val(lastItemText);
                //         $SiblingP.text(lastItemText);
                //     }
                //     isItemOnFocus = false;
                // }).on('input', function (event) {
                //     currentItemText = element.val().trim();
                //     currentItemText = currentItemText.length > 100 ? currentItemText.substring(0, 100) : currentItemText;
                //     $SiblingP.text(currentItemText);
                // }).on('keyup', function () {
                //     var text = element.val().trim();
                //     text = text.length > 100 ? text.substring(0, 100) : text;
                //     element.val(text);
                // });
            }
        };
    }]);

    /**
     * 检查清单指令
     */
    LaModule.directive('checkList', ['$filter', '$timeout', function ($filter, $timeout) {
        return {
            restrict: 'AE',
            scope: {
                checkListItems: '=',
                reserveCheckListItems: '='
            },
            template: checkListTpl,
            replace: true,
            link: function (scope, element, attrs) {
                scopeCache = scope;
                // dom对象以及事件的初始化
                if (!$thumbnail) {
                    $thumbnail = element.find('._float_thumbnail');
                    $thumbnailText = $thumbnail.find('._thumbnail_text');
                    $thumbnail.css({"pointer-events": "none"});
                }
                if (!$regionDraggable) {
                    $regionDraggable = element.find('._region_draggable');
                    $regionDraggable.on('mousedown', function (event) {
                        if (!isUnderDragging) {
                            return;
                        }
                        currentMouseY = (event.pageY - $regionDraggable.offset().top).toFixed(2);
                        $thumbnail.css({
                            'top': currentMouseY + 'px'
                        });
                    }).on('mousemove', function (event) {
                        if (isUnderDragging) {
                            currentMouseY = (event.pageY - $regionDraggable.offset().top).toFixed(2);
                            $thumbnail.css({
                                'top': currentMouseY + 'px'
                            });
                        }
                    });
                }

                /**
                 * 广播监听
                 */
                scope.$on('editItemCallBack', function (event, data) {
                    // 设置为获取焦点
                    $timeout(function () {
                        var $ipt = jquery((element.find('input'))[data.itemIdx]);
                        var text = $ipt.val().trim();
                        $ipt.val('').focus().val(text);
                    }, 0);
                });

                /**
                 * 处理指令内部的事件
                 * @type {Number}
                 */
                var downIdx = -1,
                    upIdx = -1;
                element.bind('click', function (event) {
                    // 阻止事件冒泡到document而触发隐藏【检查清单】的弹窗消息
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    } else {
                        event.cancelBubble = true;
                    }

                    var $taget = jquery(event.target);
                    var mark = $taget.attr('_mark');
                    var itemIdx = -1;
                    switch (mark) {
                        case 'editItemBtn':
                            console.log('editItem');
                            itemIdx = $taget.attr('_itemIdx');
                            if (isNaN(itemIdx)) {
                                return;
                            }
                            scope.$emit('editItem', {
                                itemIdx: itemIdx
                            });
                            break;
                        case 'deleteItemBtn':
                            console.log('deleteItem');
                            itemIdx = $taget.attr('_itemIdx');
                            scope.$emit('deleteItem', {
                                itemIdx: itemIdx
                            });
                            break;
                        case 'addItemBtn':
                            console.log('addItem');
                            itemIdx = $taget.attr('_itemIdx');
                            scope.$emit('addItem');
                            break;
                        case 'reserveBtn':
                            scope.$emit('toggleReserveCheckList');
                            break;
                    }
                });
            }
        }
    }]);
});
