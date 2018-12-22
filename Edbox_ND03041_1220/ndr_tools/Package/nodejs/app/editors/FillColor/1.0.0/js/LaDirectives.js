define([
    'angular',
    './LaModule.js',
    'text!./../templates/nd-loader-tpl.html',
    'text!./../templates/time-box-tpl.html',
    './directives/picture-selector.js',
    // './directives/tm.pagination.js'
], function (angular, LaModule, ndLoaderTpl, timeBoxTpl) {
    //正在加载提示
    LaModule.directive('ndLoader', [function () {
        return {
            restrict: 'AE',
            template: ndLoaderTpl,
            replace: true,
            scope: {
                message: '='
            }
        };
    }]);

    //时间控件
    LaModule.directive('timeBox', ['$stage', function ($stage) {
        return {
            restrict: 'AE',
            template: timeBoxTpl,
            replace: true,
            scope: {
                model: '='
            },
            controller: function ($scope) {
                var $model = $scope.model;

                function update(limit) {
                    var minutes = Math.floor(limit / 60), seconds = limit % 60;
                    $scope.minutes = (minutes > 9 ? minutes : '0' + minutes);
                    $scope.seconds = (seconds > 9 ? seconds : '0' + seconds);
                }

                update($model.limit || 0);

                $stage.getStage().on('Timer', function (data) {
                    $scope.$apply(function () {
                        if (data.type === 'type') {
                            $model.type = data.value;
                        } else if (data.type === 'limit') {
                            $model.limit = data.value;

                            update($model.limit || 0);
                        }
                    });
                });
            }
        };
    }]);

    //文本编辑控件
    LaModule.directive('titleBox', ['$filter', '$timeout', function ($filter, $timeout) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function ($scope, element, attr, ngModel) {
                var placeholder = $filter('translate')('color.title.placeholder'),
                    maxLength = attr['maxlength'];
                element.attr('placeholder', placeholder);

                var CSSBlinding = 'border_red_blinding', TriggerBlindingLen = 50;
                var blindingShow = function (viewValue) {
                    if (!!maxLength) {
                        var parent = element.parent();
                        if (viewValue.length >= maxLength) {
                            if (!parent.hasClass(CSSBlinding)) {
                                parent.addClass(CSSBlinding);
                            } else {
                                parent.removeClass(CSSBlinding);
                                $timeout(function () {
                                    parent.addClass(CSSBlinding);
                                }, 50);
                            }
                        } else if (parent.hasClass(CSSBlinding)) {
                            parent.removeClass(CSSBlinding);
                        }
                    }
                };
                element.on('input', function () {
                    blindingShow(element.val());
                });

                /**
                 * isAuto 是否是系统自动赋值
                 * @param isAuto
                 */
                function onTitleChange(isAuto) {
                    var viewValue = ngModel.$viewValue;
                    if (!!viewValue && viewValue.length > TriggerBlindingLen) {
                        element.attr('style', 'height:100%; margin-top:3px;');
                    } else {
                        element.attr('style', '');
                    }

                    !isAuto && blindingShow(viewValue);
                }

                //注册数据模型变化监听器
                ngModel.$viewChangeListeners.push(function () {
                    onTitleChange(false);
                });

                //初次进入编辑界面时，不会触发上面注入监听器的方法
                $timeout(function () {
                    onTitleChange(true);
                }, 200);
            }
        };
    }]);
});

