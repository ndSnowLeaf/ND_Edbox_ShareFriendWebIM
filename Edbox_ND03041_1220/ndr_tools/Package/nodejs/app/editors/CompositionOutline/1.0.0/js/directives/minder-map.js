define([
    'jquery',
    'angular',
    '../LaModule.js',
    'text!../../templates/minderMap.html',
    'js-library!MinderMap'
], function (jquery, angular, LaModule, minderMapTpl) {
    LaModule.directive('minderMap', ['$filter', 'DataService', function ($filter, DataService) {
        return {
            restrict: 'AE',
            template: minderMapTpl,
            replace: true,
            scope: {
                compositionStyle: '=',
                outlineLevel: "="
            },
            link: function (scope, element, attrs) {
                var compositionStyle2Form = {
                    "0": "noLimits",
                    "1": "narration",
                    "2": "argumentation",
                    "3": "expositoryWriting"
                };

                var $undoBtn = element.find('._undo_btn'),
                    $redoBtn = element.find('._redo_btn'),
                    $progressBar = element.find('._progress_bar'),
                    $progressPercent = $progressBar.find('._progress_percent'),
                    $progressMinusBtn = $progressBar.find('._progress_minus_btn'),
                    $progressPlusBtn = $progressBar.find('._progress_plus_btn'),
                    $slideBar = $progressBar.find('._slide_bar').css({'cursor': 'pointer'}),
                    $slideBlock = $slideBar.find('._slide_block').css({"pointer-events": "none"}),
                    $additionalView = element.find('._minderMap');

                var isMove = false,
                    isClick = false,
                    currentScaleVal = 100,
                    persent = 50,
                    MIN_SCALE_VAL = 10,
                    MAX_SCALE_VAL = 250,
                    STEP_VAL = 10,
                    SLIDE_W = $slideBar.width(),
                    PER_PIXEL = SLIDE_W / (MAX_SCALE_VAL - MIN_SCALE_VAL);

                // 缓存当前思维导图显示的——作文文体 + 提纲的级别
                var currentForm = compositionStyle2Form[scope.compositionStyle],
                    currentLevel = "level_" + scope.outlineLevel;

                function renderMinderMap(oldData) {
                    if (scope.minderMap) {
                        scope.minderMap.destroy();
                    }
                    // 获取思维导图的渲染节点数据
                    scope.minderMap = window.MinderMap.create(DataService.getMinderMapOption());

                    scope.minderMap.on('change', function (type) {
                        var usrMinderMapData = DataService.getUserMinderMapData();
                        if (usrMinderMapData && usrMinderMapData.compositionStyle === currentForm
                            && usrMinderMapData.outlineLevel === currentLevel) {
                            DataService.updateUserMinderMapData(scope.minderMap.getData());
                        }
                        if (scope.minderMap.hasRedo()) {
                            $redoBtn.removeClass('click_disabled');
                        } else {
                            $redoBtn.addClass('click_disabled');
                        }
                        if (scope.minderMap.hasUndo()) {
                            $undoBtn.removeClass('click_disabled');
                        } else {
                            $undoBtn.addClass('click_disabled');
                        }
                    });

                    if (oldData) {
                        scope.minderMap.setData(oldData);
                    } else {
                        scope.minderMap.setData(DataService.getDefaultMinderMapData(currentForm, currentLevel));
                    }

                    scope.minderMap.on('scale', function (type) {
                        if (isMove) {
                            currentScaleVal = type.toFixed(2) * 100;
                        }
                        // 滑块的初始位置
                        if (!isMove && !isClick) {
                            currentScaleVal = type.toFixed(2) * 100;
                            $progressPercent.text(currentScaleVal + '%');
                            $slideBlock.css({'left': currentScaleVal / MAX_SCALE_VAL * 100 + '%'});
                        }
                    });
                    scope.minderMap.render($additionalView);
                    scope.minderMap.matchParent();
                    scope.minderMap.changePosition(['left']);


                    // 创建新的思维导图实例后发送消息通知控制器
                    scope.$emit('CreatedMinderMapInstance', {
                        minderMapInstance: scope.minderMap
                    });
                }

                renderMinderMap();

                $undoBtn.on('click', function () {
                    if ($undoBtn.hasClass('click_disabled')) {
                        return;
                    }
                    scope.minderMap.undo();
                });
                $redoBtn.on('click', function () {
                    if ($redoBtn.hasClass('click_disabled')) {
                        return;
                    }
                    scope.minderMap.redo();
                });

                scope.$on('resetMinderMapData', function (event, data) {
                    currentForm = data.compositionStyle;
                    currentLevel = data.level;

                    renderMinderMap(data.data);
                });

                // 事件处理
                element.find('._toolBar').bind('click', function (event) {
                    var $taget = jquery(event.target);
                    var tagetIdentify = $taget.attr('_mark');
                    switch (tagetIdentify) {
                        case 'rootLeftBtn':
                            scope.minderMap.focusRoot();
                            scope.minderMap.changePosition(['left', 'top']);
                            break;
                        case 'matchParentBtn':
                            scope.minderMap.matchParent();
                            scope.minderMap.changePosition(['left', 'top']);
                            break;
                    }
                });

                // 处理滑动条的缩放逻辑
                $progressMinusBtn.on('click', function (event) {
                    isClick = true;
                    currentScaleVal -= STEP_VAL;
                    if (currentScaleVal < MIN_SCALE_VAL) {
                        currentScaleVal = MIN_SCALE_VAL;
                    }
                    scope.minderMap.scale(currentScaleVal / 100);
                    $progressPercent.text(currentScaleVal + '%');
                    if (currentScaleVal === MIN_SCALE_VAL) {
                        $slideBlock.css({'left': 0 + '%'});
                    } else {
                        $slideBlock.css({'left': currentScaleVal / (MAX_SCALE_VAL - MIN_SCALE_VAL) * 100 + '%'});
                    }
                    isClick = false;
                });
                $progressPlusBtn.on('click', function (event) {
                    isClick = true;
                    currentScaleVal += STEP_VAL;
                    if (currentScaleVal > MAX_SCALE_VAL) {
                        currentScaleVal = MAX_SCALE_VAL;
                    }
                    scope.minderMap.scale(currentScaleVal / 100);
                    $progressPercent.text(currentScaleVal + '%');
                    if (currentScaleVal === MAX_SCALE_VAL) {
                        $slideBlock.css({'left': 100 + '%'});
                    } else {
                        $slideBlock.css({'left': currentScaleVal / MAX_SCALE_VAL * 100 + '%'});
                    }
                    isClick = false;
                });
                $slideBar.on('mousemove', function (event) {
                    if (!isMove) {
                        return;
                    }
                    persent = parseInt(event.offsetX / PER_PIXEL) + 10;
                    $slideBlock.css({'left': event.offsetX / SLIDE_W * 100 + '%'});
                    $progressPercent.text(persent + '%');
                    scope.minderMap.scale(persent / 100);
                }).on('mousedown', function (event) {
                    $slideBar.addClass('ui_btn_act');
                    isMove = true;
                    persent = parseInt(event.offsetX / PER_PIXEL) + 10;
                    $slideBlock.css({'left': event.offsetX / SLIDE_W * 100 + '%'});
                    $progressPercent.text(persent + '%');
                    scope.minderMap.scale(persent / 100);
                });
                $(document).on('mouseup', function (event) {
                    isMove = false;
                    $slideBar.removeClass('ui_btn_act');
                });
            }
        }
    }]);
});
