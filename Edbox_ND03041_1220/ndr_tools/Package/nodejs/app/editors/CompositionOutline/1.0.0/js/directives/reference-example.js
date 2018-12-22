define([
    'jquery',
    'angular',
    '../LaModule.js',
    'text!../../templates/referenceExample.html',
    'js-library!MinderMap'
], function (jquery, angular, LaModule, referenceExampleTpl) {
    LaModule.directive('referenceExample', ['$filter', '$timeout', 'DataService', function ($filter, $timeout, DataService) {
        return {
            restrict: 'AE',
            scope: {
                isShowReferenceExample: '=',
                compositionStyle: '=',
                outlineLevel: '=',
                isShowOutlineCase: '=',
                isShowCompositionCase: '=',
                isShowSpinner: '=',
                toggleSpinner: '=?'
            },
            template: referenceExampleTpl,
            replace: true,
            link: function (scope, element, attrs) {
                var form2Text = {
                    "narration": $filter('translate')('narration'),
                    "argumentation": $filter('translate')('argumentation'),
                    "expositoryWriting": $filter('translate')('expository_writing')
                };
                var compositionStyle2Form = {
                    "1": "narration",
                    "2": "argumentation",
                    "3": "expositoryWriting"
                };

                var $outlineCaseContainer = element.find('._outline_case'),
                    $compositionCaseContainer = element.find('._composition_case'),
                    $compositionForm = element.find('._composition_form');

                // 缓存当前思维导图显示的——作文文体 + 提纲的级别
                var currentForm,
                    currentLevel = "level_" + scope.outlineLevel;
                if(scope.compositionStyle === 0){// 文体不限的情况
                    currentForm = "narration";
                }else {
                    currentForm = compositionStyle2Form[scope.compositionStyle];
                }

                // 渲染提供范例思维导图
                function renderMinderMap() {
                    if (scope.minderMap) {
                        scope.minderMap.destroy();
                    }

                    // 获取思维导图配置
                    scope.minderMap = window.MinderMap.create(DataService.getOutlineExampleMinderMapOption());
                    scope.minderMap.setData(DataService.getDefaultOutlineExampleMinderMapData(currentForm, currentLevel));
                    scope.minderMap.render($outlineCaseContainer);
                    scope.minderMap.changePosition(['left']);
                }

                // 渲染作文范例
                function renderCompositionExample() {
                    $compositionCaseContainer.html("");
                    var caseData = DataService.getSystemCompositionExample(currentForm);
                    jquery('<p class="title">' + caseData.title + '</p>').appendTo($compositionCaseContainer);
                    for (var i = 0; i < caseData.paragraph.length; ++i) {
                        jquery('<p class="para">' + caseData.paragraph[i] + '</p>').appendTo($compositionCaseContainer);
                    }
                    $compositionCaseContainer.scrollTop(0);
                }

                scope.toggleSpinner = function (event) {
                    scope.isShowSpinner = !scope.isShowSpinner;
                    if (typeof event !== 'undefined') {
                        var $taget = jquery(event.target);
                        var mark = $taget.attr('_mark');

                        $compositionForm.text($taget.text());
                        currentForm = mark;

                        if (scope.isShowOutlineCase) {
                            // 当前参考范例弹窗处于查看【提纲范例】状态
                            renderMinderMap();
                        } else if (scope.isShowCompositionCase) {
                            // 当前面板处于查看【作文范例】状态
                            renderCompositionExample();
                        }
                    }
                };

                // 渲染默认的思维导图
                renderMinderMap();

                // 渲染默认的作文范例
                renderCompositionExample();

                scope.$on('resetMinderMapData', function (event, data) {
                    currentLevel = data.level;
                    $compositionForm.text(form2Text[data.compositionStyle]);
                    if (data.compositionStyle !== "noLimits") {
                        currentForm = data.compositionStyle;
                    }
                    // 当参考范例的弹框显示的时候才重新刷【思维导图】的数据
                    if (scope.isShowReferenceExample && scope.isShowOutlineCase) {
                        renderMinderMap();
                    }
                    // 当参考范例的弹框显示的时候才重新刷【作文范例】的数据
                    if (scope.isShowReferenceExample && scope.isShowCompositionCase) {
                        renderCompositionExample();
                    }
                });

                // 当显示【提纲范例】的时候才重新渲染思维导图数据
                scope.$on('showOutlineCase', function () {
                    $timeout(function () {
                        // 当显示参考范例弹窗的时候才重新渲染思维导图数据
                        if (scope.isShowReferenceExample && scope.isShowOutlineCase) {
                            renderMinderMap();
                        }
                    }, 0);
                });

                // 当显示【作文范例】的时候才重新渲染思维导图数据
                scope.$on('showCompositionCase', function () {
                    $timeout(function () {
                        // 当显示参考范例弹窗的时候才重新渲染思维导图数据
                        if (scope.isShowReferenceExample && scope.isShowCompositionCase) {
                            renderCompositionExample();
                        }
                    }, 0);
                });

                // 接收显示参考范例弹窗的广播
                scope.$on('showReferenceExample', function () {
                    // 检测提纲范例是否显示，显示才重新渲染思维导图数据
                    $timeout(function () {
                        if (scope.isShowOutlineCase) {
                            renderMinderMap();
                        } else if (scope.isShowCompositionCase) {
                            renderCompositionExample();
                        }
                    }, 0);
                });

                element.on('click', function (event) {
                    // 阻止事件冒泡到document而触发隐藏【参考范例】的弹窗消息
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    } else {
                        event.cancelBubble = true;
                    }
                    var $taget = jquery(event.target);
                    var mark = $taget.attr('_mark');
                    if (mark === 'outline_case' || mark === 'composition_case') {
                        scope.$emit(mark);
                    }
                });
            }
        }
    }]);
});
