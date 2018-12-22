define([
    'jquery',
    'angular',
    '../LaModule.js',
    'text!../../templates/reserveCheckList.html'
], function (jquery, angular, LaModule, reserveCheckListTpl) {
    LaModule.directive('reserveCheckList', ['$filter', function ($filter) {
        return {
            restrict: 'AE',
            template: reserveCheckListTpl,
            scope: {
                reserveCheckListItems: '='
            },
            replace: true,
            link: function (scope, element, attrs) {
                element.bind('click', function (event) {
                    // 阻止事件冒泡到document而触发隐藏【检查清单】的弹窗消息
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    } else {
                        event.cancelBubble = true;
                    }

                    var $taget = jquery(event.target);
                    var mark = $taget.attr('_mark');
                    switch (mark) {
                        case 'recoverItemBtn':
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            } else {
                                event.cancelBubble = true;
                            }
                            var itemIdx = $taget.attr('_itemIdx');
                            scope.$emit('recoverItem', {
                                itemIdx: itemIdx
                            });
                            break;
                        case 'closeReserveCheckListBtn':
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            } else {
                                event.cancelBubble = true;
                            }
                            scope.$emit('closeReserveCheckList');
                            break;
                    }
                });
            }
        }
    }]);
});
