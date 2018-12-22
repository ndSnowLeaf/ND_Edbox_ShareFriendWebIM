define([
    'jquery', 'angular', './utils.js', './ngModule.js'
], function (jquery, angular, Utils) {
    var LaModule = angular.module('LaModule');
    LaModule.controller('LaController', Controller);
    Controller.$inject = ['$scope', '$stage', '$filter', '$q', '$timeout', 'editor', 'module', 'stage', 'DataService'];

    var WORD_AMOUNT_MAX = 30; //最大字词数量
    function Controller($scope, $stage, $filter, $q, $timeout, editor, module, stage, DataService) {
        $stage.setStage(stage);

        var PromisesWhenSaving = [];

        /**
         * 检查是否已选中一本教材
         * @param isAutoDisappear
         * @returns {boolean}
         */
        function checkBookSelected(isAutoDisappear) {
            if (!Utils.getCurrentBookId()) { //未选择教材case
                $scope.noBookTipShow = true;
                $scope.noBookTipMessage = $filter('translate')('dictation.warning.book.unselect');

                if (isAutoDisappear) {
                    $timeout(function () {
                        $scope.noBookTipShow = false;
                    }, 3000);
                }

                return true;
            }

            return false;
        }

        /**
         * 页面加载Loading视图的切换功能
         * @param isShow
         * @param loadingMsg
         * @private
         */
        function togglePageLoading(isShow, loadingMsg) {
            if (loadingMsg != undefined) {
                $scope.pageLoadingMessage = loadingMsg;
            }

            $scope.isPageLoading = isShow || false;
        }

        /**
         * 读取指定章节生字词列表
         * @param chapter_id 章节ID
         * @param chapter_name 章节名称
         * @param callback 回调函数
         * @private
         */
        function getChapterWords(chapter_id, chapter_name, callback) {
            //显示Loading
            togglePageLoading(true, $filter('translate')('dictation.message.chapter.words.loading'));

            //查询当前章节下的字卡
            DataService.getWordsByChapterId(chapter_id).then(function (data) {
                callback && callback(data);

                togglePageLoading(false);
            }, function () {
                togglePageLoading(false);
            });

            //TODO 查询章节下的词语、成语
        }

        var Logic = {
            /**
             * 初始化
             */
            init: function () {
                //初始化数据模型
                $scope.defaultTitle = $filter('translate')('dictation.default.title'); //默认标题
                $scope.WORD_AMOUNT_MAX = WORD_AMOUNT_MAX; //最大字词数量
                var $model = {
                    time: {
                        type: 'sequence',
                        limit: 0
                    },
                    words: []
                };
                $scope.model = $model;

                //声明界面操作逻辑
                Logic.__defineScope();

                //加载初始数据
                Logic.__loadData();
            },
            /**
             * 保存颗粒
             * @returns {*}
             */
            save: function () {
                var result = Logic.validate();
                if (!result) {
                    $scope.InteractionModeManager.switchToViewMode(true);

                    if (Utils.isNotEmptyArray(PromisesWhenSaving)) {
                        var defer = $.Deferred();
                        $q.all(PromisesWhenSaving).then(function () {
                            PromisesWhenSaving = [];
                            var result = Logic.write2Module();
                            defer.resolve(result);
                        });

                        return defer.promise();
                    } else {
                        return Logic.write2Module();
                    }
                }

                return result;
            },
            /**
             * 数据模型有效性验证
             * @returns {*}
             */
            validate: function () {
                //题目标题
                if (!$scope.model.title) {
                    return $filter('translate')('dictation.warning.empty.title') || 'dictation.warning.empty.title';
                }

                //字词数量不为空
                if (!$scope.model.words || $scope.model.words.length === 0) {
                    return $filter('translate')('dictation.warning.empty.words') || 'dictation.warning.empty.words';
                } else if ($scope.model.words.length > WORD_AMOUNT_MAX) {
                    $scope.InteractionModeManager.switchToDeleteMode(true);

                    return $filter('translate')('dictation.warning.maximum') || 'dictation.warning.maximum';
                }

                return null;
            },
            /**
             * 数据模型写入颗粒数据
             */
            write2Module: function () {
                var questions = [], $model = $scope.model;
                angular.forEach($model.words, function (item, index) {
                    var question = {
                        SubQuestionId: 'SQ' + index,
                        SubQuestionType: 'ChineseCharacterDictation',
                        SubQuestionData: {
                            word: item.word,
                            pinyin: item.pinyin,
                            audio: item.audio,
                            definition: Utils.encodeHTML(item.definition || '')
                        }
                    };

                    questions.push(question);
                });

                module.setPropertyValue("QuestionId", stage.coursewareobjectId);
                module.setPropertyValue("ChapterName", $model.chapter_name);
                module.setPropertyValue("MainStem", $model.title);
                module.setPropertyValue("TimerType", $model.time.type);
                module.setPropertyValue("TimeLimit", $model.time.limit);
                module.setPropertyValue("Questions", questions);
            },
            /**
             * 从颗粒数据读取数据模型
             */
            readFromModule: function () {
                var $model = $scope.model;

                $model.chapter_name = module.getPropertyValue("ChapterName");
                $model.title = module.getPropertyValue("MainStem");
                $model.time.type = module.getPropertyValue("TimerType");
                $model.time.limit = module.getPropertyValue("TimeLimit");

                var questions = module.getPropertyValue('Questions');
                angular.forEach(questions, function (item) {
                    var word = item.SubQuestionData;
                    word.text = word.word.join('');
                    word.definition = Utils.decodeHTML(word.definition);
                    $model.words.push(word);
                });
            },
            /**
             * 加载初始数据
             * @private
             */
            __loadData: function () {
                var questions = module.getPropertyValue('Questions');
                if (!questions) { //新建
                    //检查是否已选中一本教材
                    if (checkBookSelected(false)) return;

                    var $model = $scope.model;
                    var context = Utils.getContext();
                    $model.title = $scope.defaultTitle;
                    $model.chapter_name = context.chapter_name;

                    //查询当前章节下的字词
                    getChapterWords(context.chapter_id, context.chapter_name, function (words) {
                        //当本章节下的词汇数超过 30个时，不拉取词汇资源，而是提示用户进行二次选择。
                        if (Utils.isNotEmptyArray(words) && words.length > WORD_AMOUNT_MAX) {
                            $scope.AddModeHandle.gotoSelectWords(words, $model.chapter_name);
                        } else {
                            $model.words = words;
                        }

                        /*
                         //预下载发音资源
                         var promise = DataService.preDownloadAudio(words);
                         PromisesWhenSaving.push(promise);
                         */
                    });
                } else { //编辑
                    this.readFromModule();
                }
            },
            /**
             * 声明界面操作逻辑
             *   1. 本页面的交互模式管理定义（见InteractionModeManager）：VIEW:查看模式、ADD:添加模式、DELETE:删除模式
             *   2. 交互模式的对应操作集定义：ViewModeHandle、AddModeHandle、DeleteModeHandle
             *   3. 生字词列表操作集定义（见WordListManipulation）
             *   4. 重复字词覆盖弹窗操作集（见ReplaceConfirmPopup）
             *
             * @private
             */
            __defineScope: function () {
                var $model = $scope.model;

                //交互模式管理
                var InteractionModeManager = {
                    //模式定义：查看模式(VIEW), 添加模式(ADD),删除模式(DELETE)
                    define: function () {
                        $scope.INTERACTIVE_MODE = {VIEW: 0, ADD: 1, DELETE: 2};
                    },
                    isViewMode: function () {
                        return $scope.interactiveMode === $scope.INTERACTIVE_MODE.VIEW;
                    },
                    switchToViewMode: function (needCheck) { //切换到查看模式
                        if (!needCheck) {
                            $scope.interactiveMode = $scope.INTERACTIVE_MODE.VIEW;
                        } else {
                            if (!InteractionModeManager.isViewMode()) {
                                Utils.safeApply($scope, function () {
                                    InteractionModeManager.switchToViewMode();
                                });
                            }
                        }
                    },
                    switchToAddMode: function () { //切换到添加模式
                        $scope.interactiveMode = $scope.INTERACTIVE_MODE.ADD;
                    },
                    switchToDeleteMode: function (needCheck) { //切换到删除模式
                        if (!needCheck) {
                            $scope.interactiveMode = $scope.INTERACTIVE_MODE.DELETE;
                        } else {
                            if ($scope.interactiveMode != $scope.INTERACTIVE_MODE.DELETE) {
                                Utils.safeApply($scope, function () {
                                    InteractionModeManager.switchToDeleteMode();
                                });
                            }
                        }
                    }
                };
                InteractionModeManager.define();
                InteractionModeManager.switchToViewMode();
                $scope.InteractionModeManager = InteractionModeManager;

                //生字词列表操作集
                var WordListManipulation = {
                    //检查重复性（按字面内容，不区分多音字）
                    duplicationCheck: function (word) {
                        if (!this.isNotEmpty()) {
                            return false;
                        }

                        var result = false;
                        $.each($model.words, function (index, item) {
                            if (item.text === word.text) {
                                result = true;

                                return false;
                            }
                        });

                        return result;
                    },
                    //获取wordArray在生字词列表中重复的字词文本
                    getDuplicatedWordText: function (wordArray) {
                        if (!this.isNotEmpty() || !Utils.isNotEmptyArray(wordArray)) {
                            return null;
                        }

                        var result = [], self = this;
                        angular.forEach(wordArray, function (item) {
                            if (self.duplicationCheck(item)) {
                                result.push(item.text);
                            }
                        });

                        return result;
                    },
                    /**
                     * 添加生字词
                     * @param word 生字词
                     * @param isReplace 是否替换覆盖
                     */
                    add: function (word, isReplace) {
                        /*
                         //预下载发音资源
                         var promise = DataService.preDownloadAudio(word);
                         PromisesWhenSaving.push(promise);
                         */

                        var newWord = angular.copy(word);
                        if (!isReplace) {
                            $model.words.push(newWord);
                        } else {
                            var isMatched = false; //是否是重复字词
                            $.each($model.words, function (index, item) {
                                if (item.text === word.text) {
                                    isMatched = true;
                                    $model.words[index] = newWord;

                                    return false;
                                }
                            });
                            if (!isMatched) { //非重复字词
                                $model.words.push(newWord);
                            }
                        }
                    },
                    /**
                     * 移除生字词
                     * @param index 索引
                     * @param number 个数， 默认为1
                     */
                    remove: function (index, number) {
                        $model.words.splice(index, number || 1);
                    },
                    /**
                     * 选择
                     * @param index
                     */
                    select: function (index) {
                        $scope.wordSelected = $scope.model.words[index];
                    },
                    //反选
                    unSelect: function () {
                        $scope.wordSelected = null;
                    },
                    //数量是否超过最大限制
                    isOutOfLimit: function () {
                        return $model.words.length > WORD_AMOUNT_MAX;
                    },
                    //是否为空
                    isNotEmpty: function () {
                        return Utils.isNotEmptyArray($model.words);
                    }
                };

                function gotoViewMode() {
                    //添加后字词数量超过WORD_AMOUNT_MAX，直接切换到删除模式
                    if (WordListManipulation.isOutOfLimit()) {
                        DeleteModeHandle.enter();
                    } else {
                        InteractionModeManager.switchToViewMode();
                    }
                }

                //查看模式操作集
                var ViewModeHandle = $scope.ViewModeHandle = {
                    isAddDisable: false,
                    //查看字词
                    view: function (event) {
                        if (WordListManipulation.isNotEmpty()) {
                            var $target = $(event.target),
                                index = $target.closest('li').attr('ng-index');
                            if (index != null && index != undefined) {
                                if ($target.hasClass('list_bd_delete')) {
                                    WordListManipulation.remove(index);
                                } else if (InteractionModeManager.isViewMode() && $target.closest('div.list_bd_txt_box')[0]) {
                                    WordListManipulation.select(index);
                                    $scope.showWordCardFlag = true;
                                }
                            }
                        }
                    },
                    //关闭查看窗口
                    exit: function () {
                        WordListManipulation.unSelect();
                    }
                };

                //添加模式操作集
                var AddModeHandle = $scope.AddModeHandle = {
                    wordAmountSearched: 0,
                    wordAmountSelected: 0,
                    //直接进入字词选择模式
                    gotoSelectWords: function (words, chapter_name) {
                        var handleSelf = AddModeHandle;
                        handleSelf.chapter_name = chapter_name;
                        handleSelf.wordsSearched = words;
                        handleSelf.wordAmountSearched = words.length;
                        handleSelf.wordAmountSelected = 0;

                        InteractionModeManager.switchToAddMode();
                    },
                    //添加字词 - 入口
                    enter: function () {
                        if (!$scope.isPageLoading && !ViewModeHandle.isAddDisable) {
                            $scope.addWordToolPopFlag = true;
                        }
                    },
                    //退出添加
                    exit: function () {
                        $scope.addWordToolPopFlag = false;
                    },
                    //添加方式 - 创建字词
                    create: function () {
                        $scope.addWordToolPopFlag = false;
                        $scope.addWordPanelFlag = true;
                    },
                    quitCreate: function () {
                        $scope.addWordPanelFlag = false;
                    },
                    //添加方式 - 生字表字词
                    search: function (switchToViewMode) {
                        //检查是否已选中一本教材
                        if (checkBookSelected(true))  return;

                        switchToViewMode && InteractionModeManager.switchToViewMode();
                        stage.trigger('ChapterSelector', {value: true});
                        $scope.addWordToolPopFlag = false;
                    },
                    //选择章节回调处理
                    selectChapterCallback: function (chapter_id, chapter_name) {
                        var handleSelf = AddModeHandle;
                        handleSelf.chapter_name = chapter_name;
                        handleSelf.wordAmountSelected = 0;
                        handleSelf.wordAmountSearched = 0;
                        getChapterWords(chapter_id, chapter_name, function (words) {
                            handleSelf.wordsSearched = words;
                            handleSelf.wordAmountSearched = words.length;
                            if (handleSelf.wordAmountSearched <= WORD_AMOUNT_MAX) {
                                Utils.setObjectProperty(handleSelf.wordsSearched, 'selected', true);
                                handleSelf.wordAmountSelected = handleSelf.wordsSearched.length;
                            }

                            InteractionModeManager.switchToAddMode();
                        });
                    },
                    //选中字词
                    select: function (event) {
                        var $target = $(event.target),
                            index = $target.closest('li').attr('ng-index'),
                            handleSelf = AddModeHandle;
                        if (index != null && index != undefined) {
                            if ($target.hasClass('list_bd_select') || $target.closest('.list_bd_txt_box')[0]) {
                                var word = handleSelf.wordsSearched[index];
                                word.selected = !word.selected || false;

                                if (word.selected) {
                                    handleSelf.wordAmountSelected++;
                                } else {
                                    handleSelf.wordAmountSelected--;
                                }
                            }
                        }
                    },
                    //添加方式 - 创建字词回调
                    addWordCallback: function (word) {
                        $scope.addWordPanelFlag = false;
                        if (WordListManipulation.duplicationCheck(word)) {
                            var popup = ReplaceConfirmPopup;
                            popup.setAddingWord(word);
                            popup.setMessage(word.text);
                            popup.isVisible = true;
                        } else {
                            WordListManipulation.add(word);
                            gotoViewMode();
                        }
                    },
                    //确认添加
                    confirmAdd: function () {
                        if ((AddModeHandle.wordAmountSelected || 0) > 0) {
                            var wordsSelected = Utils.pushToArray(AddModeHandle.wordsSearched, [], 'selected');
                            var result = WordListManipulation.getDuplicatedWordText(wordsSelected);
                            if (Utils.isNotEmptyArray(result)) {
                                var popup = ReplaceConfirmPopup;
                                popup.setAddingWord(wordsSelected);
                                popup.setMessage(result.join('，'));
                                popup.isVisible = true;
                            } else {
                                angular.forEach(wordsSelected, function (item) {
                                    WordListManipulation.add(item, false);
                                });

                                gotoViewMode();
                            }
                        } else {
                            InteractionModeManager.switchToViewMode();
                        }
                    }
                };

                //删除模式操作集
                var DeleteModeHandle = $scope.DeleteModeHandle = {
                    isExitable: true,  //是否可退出删除模式
                    //删除字词
                    enter: function () {
                        if (WordListManipulation.isNotEmpty()) {
                            InteractionModeManager.switchToDeleteMode();
                        }
                    },
                    //退出删除
                    exit: function () {
                        if (DeleteModeHandle.isExitable) {
                            InteractionModeManager.switchToViewMode();
                        }
                    }
                };

                //重复字词覆盖弹窗操作集
                var ReplaceConfirmPopup = $scope.ReplaceConfirmPopup = {
                    isVisible: false,
                    wordsRepeat: '',
                    tipText: $filter('translate')('dictation.message.replace.confirm'),
                    okName: $filter('translate')('dictation.btn.yes'),
                    cancelName: $filter('translate')('dictation.btn.no'),
                    ok: function () {
                        var wordAdding = ReplaceConfirmPopup.wordAdding;
                        if (Utils.isNotEmptyArray(wordAdding)) {
                            angular.forEach(wordAdding, function (item) {
                                WordListManipulation.add(item, true);
                            });
                        } else {
                            WordListManipulation.add(wordAdding, true);
                        }
                        ReplaceConfirmPopup.isVisible = false;
                        gotoViewMode();
                    },
                    cancel: function () {
                        var popupSelf = ReplaceConfirmPopup;
                        if (Utils.isNotEmptyArray(popupSelf.wordAdding)) {
                            angular.forEach(popupSelf.wordAdding, function (item) {
                                if (!WordListManipulation.duplicationCheck(item)) {
                                    WordListManipulation.add(item, false);
                                }
                            });

                            gotoViewMode();
                        }
                        popupSelf.isVisible = false;
                    },
                    setMessage: function (message) {
                        this.wordsRepeat = message;
                    },
                    setAddingWord: function (word) {
                        this.wordAdding = word;
                    }
                };


                //Register Watches
                var wordAmountDisplayTemplate = "<span class=\"ChineseCd_txt_light\">${amount}</span>";
                var getWordAmountDisplay = function (amount) {
                    return wordAmountDisplayTemplate.replace('${amount}', amount);
                };
                $scope.$watch('AddModeHandle.wordAmountSelected', function (newValue) {
                    $scope.wordAmountSelectedDisplay = getWordAmountDisplay(newValue || 0);
                });
                $scope.$watch('model.words.length', function (newValue) {
                    var value = newValue || 0;
                    $scope.wordsAmountDisplay = getWordAmountDisplay(value);
                    ViewModeHandle.isAddDisable = (value >= WORD_AMOUNT_MAX);
                    DeleteModeHandle.isExitable = (value <= WORD_AMOUNT_MAX);
                });
            }
        };

        //初始化
        Logic.init();

        /**
         * 保存颗粒
         * @returns {*}
         */
        editor.save = function () {
            var result = Logic.save();

            return !result ? true : result;
        };
    }
});	