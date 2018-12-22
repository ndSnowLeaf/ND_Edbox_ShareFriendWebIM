define([
    'jquery',
    'angular',
    '../LaModule.js',
    'text!../../templates/referenceClubtunes.html'
], function (jquery, angular, LaModule, referenceClubtunesTpl) {

    var referenceClubtunesScope;

    LaModule.directive('getFocus', ['$timeout', function ($timeout) {
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
                element.bind('blur', function () {
                    for (var i = 0; i < referenceClubtunesScope.assets.items.length; ++i) {
                        if (parseInt(attrs.itemidx) !== i &&
                            (referenceClubtunesScope.assets.items[i].title + referenceClubtunesScope.assets.items[i].titleIdx === element.val().trim())) {
                            // 发送重名消息
                            scope.$emit('tabNameDuplication', {
                                itemIdx: attrs.itemidx
                            });
                            return;
                        }
                    }

                    // 发送重置消息
                    scope.$emit('saveEditTab', {
                        itemIdx: attrs.itemidx,
                        saveText: element.val().trim()
                    });
                });

                scope.$on("tabNameDuplicationCb", function (event, data) {
                    if (data.itemIdx === attrs.itemidx) {
                        element.focus();
                    }
                });
            }
        };
    }]);

    /**
     * 参考素材tab指令
     */
    LaModule.directive('referenceClubtunes', ['$filter', '$timeout', function ($filter, $timeout) {
        return {
            restrict: 'AE',
            scope: {
                assets: '=',
                isShowTabUpLimitPrompt: "=",
                isShowDeleteTabPrompt: "=",
                isShowTabNameDuplicationPrompt: "="
            },
            template: referenceClubtunesTpl,
            replace: true,
            link: function (scope, element, attrs) {
                referenceClubtunesScope = scope;
                /**
                 * 广播监听
                 */
                scope.$on('editTabCallBack', function (event, data) {
                    // 设置为获取焦点
                    $timeout(function () {
                        var $ipt = jquery((element.find('input'))[data.itemIdx]);
                        var text = $ipt.val().trim();
                        $ipt.val('').focus().val(text);
                    }, 0);
                });

                element.on('click', function (event) {
                    var $taget = jquery(event.target);
                    var mark = $taget.attr('_mark');
                    switch (mark) {
                        case 'add_tab_btn':
                            if (scope.assets.items.length < 20) {
                                scope.$emit('addNewAssetsTab');
                            } else {
                                //alert("目前最多支持20条素材");
                                scope.isShowTabUpLimitPrompt = true;
                            }
                            break;
                        case 'pre_tab_btn':
                            scope.$emit('preTab');
                            break;
                        case 'next_tab_btn':
                            scope.$emit('nextTab');
                            break;
                        case 'tab_label':
                            scope.$emit('switchTab', {
                                itemIdx: $taget.attr('_itemIdx')
                            });
                            break;
                        case 'delete_tab_btn':
                            scope.$emit('deleteTab', {
                                itemIdx: $taget.attr('_itemIdx')
                            });
                            break;
                        case 'edit_tab_btn':
                            scope.$emit('editTab', {
                                itemIdx: $taget.attr('_itemIdx')
                            });
                            break;
                    }
                })
            }
        }
    }]);
});
