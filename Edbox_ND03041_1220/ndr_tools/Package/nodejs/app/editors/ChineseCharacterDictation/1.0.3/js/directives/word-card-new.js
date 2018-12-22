define(['jquery', 'angular', '../templates.js', '../utils.js', '../ngModule.js'],
    function (jquery, angular, templates, Utils) {
        var LaModule = angular.module('LaModule');

        //创建字词
        LaModule.directive('wordCardNew', ['$filter', 'DataService', function ($filter, DataService) {
            return {
                restrict: 'AE',
                template: templates['word_card_new.html'],
                replace: false,
                scope: {
                    save: '=',
                    quit: '='
                },
                link: function ($scope, $element, attrs) {
                    var $audio = $element.find('audio:first'), audio = $audio[0],
                        inputCtrl = $element.find('.ChineseCharacterDictation_add_txt_input input'),
                        definitionCtrl = $element.find('.ChineseCharacterDictation_add_txt_textarea textarea')[0],
                        inputWordTip = $filter('translate')('dictation.message.word.input'),
                        chineseCharacterTip = $filter('translate')('dictation.warning.chinese.word'),
                        placeholder = $filter('translate')('dictation.placeholder.words.max');

                    inputCtrl.attr('placeholder', placeholder);
                    $scope.wordAdding = {}; //待加入的生字词

                    function autoFocusOn(ctrl, delay) {
                        window.setTimeout(function () {
                            ctrl.focus();
                        }, delay || 300);
                    }

                    autoFocusOn(inputCtrl); //字词输入框自动获取焦点

                    //交互模式管理
                    var InteractionModeManager = {
                        //模式定义：未匹配模式(UNMATCHED), 多音字选择模式(SELECT),匹配成功模式(MATCHED)
                        define: function () {
                            $scope.INTERACTIVE_MODE = {UNMATCHED: 0, SELECT: 1, MATCHED: 2};
                        },
                        switchToUnmatchedMode: function () { //切换到未匹配模式
                            $scope.interactiveMode = $scope.INTERACTIVE_MODE.UNMATCHED;
                        },
                        switchToSelectMode: function () { //切换到多音字选择模式
                            $scope.interactiveMode = $scope.INTERACTIVE_MODE.SELECT;
                        },
                        switchToMatchedMode: function () { //切换到匹配成功模式
                            $scope.interactiveMode = $scope.INTERACTIVE_MODE.MATCHED;
                        }
                    };
                    InteractionModeManager.define();
                    InteractionModeManager.switchToUnmatchedMode();


                    //未匹配模式 操作集
                    var nonChineseCharReg = /[^\u4e00-\u9fa5]+/g; //非汉字正则表达式
                    var UnmatchedModeHandle = $scope.UnmatchedModeHandle = {
                        message: inputWordTip,
                        isMatching: false,
                        setMessage: function (message) {
                            this.message = message;
                        },
                        //输入内容发生变化
                        onTextChange: function () {
                            UnmatchedModeHandle.message = inputWordTip;

                            var text = $scope.wordAdding.text;
                            if (text != null && text != undefined && text.match(nonChineseCharReg) != null) {
                                $scope.wordAdding.text = text.replace(nonChineseCharReg, '');

                                if (!$scope.wordAdding.text) {
                                    UnmatchedModeHandle.message = chineseCharacterTip;
                                }
                            }
                        },
                        onKeyup: function (event) {
                            if (event.which === 13) { //回车
                                UnmatchedModeHandle.match();
                                event.target.blur();
                            }
                        },
                        //匹配发音及释义
                        match: function () {
                            if (!!$scope.wordAdding.text) {
                                var handleSelf = UnmatchedModeHandle;
                                handleSelf.isMatching = true;
                                inputCtrl.attr('readonly', true);
                                DataService.searchWord($scope.wordAdding.text).then(function (result) {
                                    handleSelf.isMatching = false;
                                    var word = result;
                                    if (Utils.isNotEmptyArray(result)) {
                                        if (result.length > 1) { //多音字
                                            SelectModeHandle.setMessage($filter('translate')('dictation.tip.heteronym', {word: $scope.wordAdding.text}));
                                            SelectModeHandle.setWords(result);
                                            SelectModeHandle.enter();

                                            return;
                                        } else {
                                            word = result[0];
                                        }
                                    }

                                    matchedWord(word);
                                    inputCtrl.removeAttr('readonly').focus(); //失败后自动定位文本输入框
                                }, function () {
                                    handleSelf.isMatching = false;
                                    handleSelf.setMessage($filter('translate')('dictation.warning.pinyin.unmatched'));
                                    inputCtrl.removeAttr('readonly').focus(); //失败后自动定位文本输入框
                                });
                            }
                        }
                    };

                    //多音字选择模式 操作集
                    var SelectModeHandle = $scope.SelectModeHandle = {
                        enter: function () {
                            InteractionModeManager.switchToSelectMode();
                        },
                        setMessage: function (message) {
                            this.message = message;
                        },
                        setWords: function (words) {
                            this.words = words;
                        },
                        getSelected: function () {
                            return this.wordSelected;
                        },
                        unSelect: function () {
                            this.wordSelected = null;
                        },
                        //匹配多音字-选择
                        select: function (event) {
                            var li = $(event.target).closest('li'),
                                index = li.attr('ng-index');

                            if (index != null && index != undefined) {
                                var self = SelectModeHandle;

                                if (self.wordSelected) {
                                    self.wordSelected.selected = false;
                                }
                                self.wordSelected = self.words[index];
                                self.wordSelected.selected = true;
                            }
                        },
                        //确定选择一个多音字
                        confirm: function () {
                            var wordSelected = SelectModeHandle.getSelected();
                            if (wordSelected) {
                                matchedWord(wordSelected);
                            }
                        }
                    };

                    //匹配成功模式 操作集
                    var audioLoadingMsg = $filter('translate')('dictation.message.audio.loading'); //发音资源载入提示信息
                    var MatchedModeHandle = $scope.MatchedModeHandle = {
                        isMatched: null,
                        isEditing: false,  //编辑释义标识
                        doEdit: function () {
                            MatchedModeHandle.isEditing = true;
                            autoFocusOn(definitionCtrl);
                        },
                        enter: function (word) {
                            var self = MatchedModeHandle;
                            if (word) {
                                if (!word.definition) { //未匹配释义
                                    self.setMessage($filter('translate')('dictation.warning.definition.unmatched'));
                                }

                                $scope.wordAdding = angular.copy(word);
                                self.loadAudio();
                                self.isMatched = true;
                            }

                            InteractionModeManager.switchToMatchedMode();
                        },
                        setMessage: function (message) {
                            this.message = message;
                        },
                        //载入字词发音
                        loadAudio: function () {
                            if (!!$scope.wordAdding.audio) {
                                var self = MatchedModeHandle;
                                if (!self.message) {
                                    self.setMessage(audioLoadingMsg);
                                }

                                $audio.on('canplay', function () {
                                    $scope.$apply(function () {
                                        if (self.message === audioLoadingMsg) {
                                            self.setMessage('');
                                        }

                                        self.isCanPlay = true;
                                    });
                                }).on('play', function () {
                                    $scope.$apply(function () {
                                        self.isPlaying = true;
                                    });
                                }).on('pause', function () {
                                    $scope.$apply(function () {
                                        self.isPlaying = false;
                                    });
                                });

                                audio.src = $scope.wordAdding.audio;
                            }
                        },
                        //播放发音
                        play: function () {
                            var self = $scope.MatchedModeHandle;
                            if (self.isCanPlay) {
                                if (self.isPlaying) {
                                    audio.pause();
                                    audio.currentTime = 0;
                                }

                                audio.play();
                            }
                        },
                        //保存并关闭
                        save: function () {
                            invokeSaveQuit();
                        }
                    };

                    //退出保存确认弹窗
                    $scope.QuitConfirmPopup = {
                        isVisible: false,
                        message: $filter('translate')('dictation.message.save.confirm'),
                        okName: $filter('translate')('dictation.btn.save.yes'),
                        cancelName: $filter('translate')('dictation.btn.save.no'),
                        ok: function () {
                            invokeSaveQuit();
                        },
                        cancel: function () {
                            invokeQuit();
                        }
                    };

                    //退出
                    $scope.exit = function () {
                        if (MatchedModeHandle.isMatched) {
                            $scope.QuitConfirmPopup.isVisible = true;
                        } else {
                            invokeQuit();
                        }
                    };

                    //匹配成功
                    function matchedWord(word) {
                        if (!word.pinyin) { //未匹配拼音
                            UnmatchedModeHandle.setMessage($filter('translate')('dictation.warning.pinyin.unmatched'));
                        } else if (!word.audio) { //未匹配发音
                            UnmatchedModeHandle.setMessage($filter('translate')('dictation.warning.pronounce.unmatched'));
                        } else {
                            MatchedModeHandle.enter(word);
                        }
                    }

                    //退出
                    function invokeQuit() {
                        $scope.quit && $scope.quit();
                    }

                    //保存并退出
                    function invokeSaveQuit() {
                        $scope.save && $scope.save(angular.extend({}, $scope.wordAdding));
                    }
                }
            };
        }]);
    });

