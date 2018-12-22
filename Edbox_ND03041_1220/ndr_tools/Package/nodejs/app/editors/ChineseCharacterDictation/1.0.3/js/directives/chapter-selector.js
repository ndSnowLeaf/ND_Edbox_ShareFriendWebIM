define(['jquery', 'angular', '../templates.js', '../utils.js', '../ngModule.js'],
    function (jquery, angular, templates, Utils) {
        var LaModule = angular.module('LaModule');

        //章节选择面板
        LaModule.directive('chapterSelector', ['$stage', '$filter', 'DataService', function ($stage, $filter, DataService) {
            return {
                restrict: 'AE',
                template: templates['chapter-selector.html'],
                replace: true,
                scope: {
                    afterSelectChapter: '='
                },
                link: function ($scope, $element, attrs) {
                    var isLoaded = false,                 //章节数据加载标识
                        itemQueue = [null, null, null],    //选中章节队列
                        $model = {
                            isVisible: false,    //章节选择器可见标识
                            loadingMessage: $filter('translate')('dictation.message.chapters.loading'), //章节数据加载中提示信息
                            isLoading: false,    //章节数据加载中标识
                            currentLevel: 1,      //章节层次（chapter:1, section:2, littleSection:3）
                            currentItem: null,   //当前选中的章节
                            isDisabled: true,    //开始添加按钮可用状态
                            chapterTree: [[], [], []], //章、节、小节
                            chapterTreeStyle: {left: 0}
                        };
                    $scope.model = $model;

                    $scope.$watch('model.currentLevel', function () {
                        $model.chapterTreeStyle.left = (-($model.currentLevel - 1) * 100) + '%';
                    });

                    $stage.getStage().on('ChapterSelector', function (data) {
                        if (!!data.value) {
                            $model.isVisible = true;
                            if (!isLoaded) {
                                isLoaded = true;

                                $model.loadingMessage = $filter('translate')('dictation.message.chapters.loading');
                                $model.isLoading = true;

                                //获取当前教材下的章节数据
                                DataService.getChaptersByBookId(Utils.getCurrentBookId()).then(function (data) {
                                    $model.chapterTree[0] = data;

                                    $model.isLoading = false;
                                }, function () {
                                    $model.isLoading = false;
                                });
                            }
                        } else {
                            $model.isVisible = false;
                        }
                    });

                    //选择章节
                    $scope.selectChapter = function (event, chapterLevel) {
                        var li = $(event.target).closest('li'),
                            index = li.attr('ng-index');
                        if (index != null && index != undefined) {
                            li.parent().find('li').removeClass('on');
                            li.addClass('on');

                            var item = $model.chapterTree[chapterLevel - 1][index];
                            $model.currentItem = item;
                            switch (chapterLevel) {
                                case 1:
                                case 2:
                                    if (Utils.isNotEmptyArray(item.children)) {
                                        $model.chapterTree[chapterLevel] = item.children;
                                        $model.currentLevel = chapterLevel + 1;
                                        $model.isDisabled = true;
                                    } else {
                                        $model.isDisabled = false;
                                    }

                                    if (itemQueue[chapterLevel - 1] != item) {
                                        if (chapterLevel === 1) {
                                            $element.find('.ChineseCd_tabs_area_ul_list._list_2 li,.ChineseCd_tabs_area_ul_list._list_3 li').removeClass('on');
                                        } else {
                                            $element.find('.ChineseCd_tabs_area_ul_list._list_3 li').removeClass('on');
                                        }
                                    } else if (!!itemQueue[chapterLevel]) {
                                        $model.currentItem = itemQueue[chapterLevel];
                                        if (chapterLevel === 2 || !Utils.isNotEmptyArray($model.currentItem.children)) {
                                            $model.isDisabled = false;
                                        }
                                    }
                                    break;
                                case 3:
                                    $model.isDisabled = false;

                                    break;
                                default:
                            }
                            itemQueue[chapterLevel - 1] = item;

                            return item;
                        }
                    };

                    //上一步（小节 -> 节 -> 章）
                    var prevStep = function () {
                        if ($model.currentLevel > 1) {
                            --$model.currentLevel;
                            $model.currentItem = itemQueue[$model.currentLevel - 1];
                            $model.isDisabled = true;
                        }
                    };
                    $scope.prevStep = prevStep;

                    //开始添加
                    $scope.beginAdd = function () {
                        if (!$model.isDisabled) {
                            $scope.afterSelectChapter && $scope.afterSelectChapter($model.currentItem.identifier, $model.currentItem.title);
                            $model.isVisible = false;
                        }
                    };

                    //点击顶部的章节小节页签
                    $scope.onClickTab = function (event) {
                        var $target = $(event.target), $tab = $target.closest(".ChineseCd_tabs_progress");

                        if ($tab[0]) {
                            var tabLevel = $tab.data("tab-level");
                            if (tabLevel != undefined && tabLevel != null) {
                                var currentLevel = $model.currentLevel;
                                if (currentLevel > tabLevel) {
                                    for (var i = tabLevel; i < currentLevel; i++) {
                                        prevStep();
                                    }
                                } else if (currentLevel < tabLevel) {
                                    for (var i = currentLevel; i < tabLevel; i++) {
                                        var item = itemQueue[$model.currentLevel - 1];
                                        if (item != null) {
                                            if (Utils.isNotEmptyArray(item.children)) {
                                                $model.currentItem = item;
                                                $model.chapterTree[$model.currentLevel] = item.children;
                                                $model.currentLevel = $model.currentLevel + 1;

                                                var currentItem = itemQueue[$model.currentLevel - 1];
                                                if (currentItem != null) {
                                                    $model.currentItem = currentItem;
                                                    $model.isDisabled = Utils.isNotEmptyArray(currentItem.children);
                                                } else {
                                                    $model.isDisabled = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };

                    //退出章节选择
                    $scope.exit = function () {
                        $model.isVisible = false;
                    };
                }
            };
        }]);
    });

