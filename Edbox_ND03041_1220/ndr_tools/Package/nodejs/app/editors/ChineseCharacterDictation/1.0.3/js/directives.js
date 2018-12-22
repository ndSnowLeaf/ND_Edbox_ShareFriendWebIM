define(['jquery', 'angular', './templates.js', './ngModule.js',
    './directives/chapter-selector.js',
    './directives/word-card-view.js',
    './directives/word-card-new.js'
], function (jquery, angular, templates) {
    var LaModule = angular.module('LaModule');

    //时间控件
    LaModule.directive('timeBox', ['$stage', function ($stage) {
        return {
            restrict: 'AE',
            template: templates['time-box.html'],
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
            require: "?ngModel",
            restrict: 'A',
            link: function ($scope, element, attr, ngModel) {
                var placeholder = $filter('translate')('dictation.title.placeholder'),
                    maxLength = attr['maxlength'];
                element.attr('placeholder', placeholder);

                var runBlinding = function (viewValue) {
                    if (!!maxLength) {
                        var parent = element.parent(), CSSBlinding = 'border_red_blinding';
                        if (viewValue.length >= maxLength) {
                            if (!parent.hasClass(CSSBlinding)) {
                                parent.addClass(CSSBlinding);
                            } else {
                                parent.removeClass(CSSBlinding);
                                setTimeout(function () {
                                    parent.addClass(CSSBlinding);
                                }, 50);
                            }
                        } else if (parent.hasClass(CSSBlinding)) {
                            parent.removeClass(CSSBlinding);
                        }
                    }
                };
                element.on('input', function () {
                    runBlinding(element.val());
                });

                /**
                 * isAuto 是否是系统自动赋值
                 * @param isAuto
                 */
                var onChange = function (isAuto) {
                    var viewValue = ngModel.$viewValue;
                    if (!!viewValue && viewValue.length > 50) {
                        element.attr('style', 'height:100%; margin-top:3px;');
                    } else {
                        element.attr('style', '');
                    }

                    !isAuto && runBlinding(viewValue);
                };
                ngModel.$viewChangeListeners.push(function () {
                    onChange(false);
                });
                //刚进入编辑界面时，不会触发上面注入监听器的方法
                $timeout(function () {
                    onChange(true);
                }, 200);
            }
        };
    }]);

    //确认弹窗
    LaModule.directive('confirmPopup', [function () {
        return {
            restrict: 'AE',
            template: templates['confirm-popup.html'],
            replace: true,
            scope: {
                message: '=',
                btnOkName: '=',
                btnCancelName: '=',
                btnOkHandle: '=',
                btnCancelHandle: '='
            },
            controller: function ($scope) {
                $scope.ok = function () {
                    $scope.btnOkHandle && $scope.btnOkHandle();
                };

                $scope.cancel = function () {
                    $scope.btnCancelHandle && $scope.btnCancelHandle();
                };
            }
        };
    }]);

    //确认弹窗New
    LaModule.directive('confirmPopupMain', [function () {
        return {
            restrict: 'AE',
            template: templates['confirm-popup-main.html'],
            replace: true,
            scope: {
                messageDynamic: '=',
                messageStatic: '=',
                btnOkName: '=',
                btnCancelName: '=',
                btnOkHandle: '=',
                btnCancelHandle: '='
            },
            controller: function ($scope) {
                $scope.ok = function () {
                    $scope.btnOkHandle && $scope.btnOkHandle();
                };

                $scope.cancel = function () {
                    $scope.btnCancelHandle && $scope.btnCancelHandle();
                };
            }
        };
    }]);

    //加载视图
    LaModule.directive('ndLoader', [function () {
        return {
            restrict: 'AE',
            template: templates['nd-loader.html'],
            replace: true,
            scope: {
                message: '='
            }
        };
    }]);
});

