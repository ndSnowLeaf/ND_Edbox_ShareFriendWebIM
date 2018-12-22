define(['jquery', 'angular', '../templates.js', '../ngModule.js'],
    function (jquery, angular, templates) {
        var LaModule = angular.module('LaModule');

        //字词查看
        LaModule.directive('wordCardView', ['$filter', function ($filter) {
            return {
                restrict: 'AE',
                template: templates['word_card_view.html'],
                replace: true,
                scope: {
                    word: '=',
                    close: '='
                },
                controller: function ($scope, $element) {
                    var $audio = $element.find('audio:first'), audio = $audio[0];
                    var audioLoadingMsg = $filter('translate')('dictation.message.audio.loading'),
                        definitionCtrl = $element.find('.ChineseCharacterDictation_add_txt_textarea textarea')[0],
                        definitionViewer = $element.find('.ChineseCharacterDictation_add_txt_show')[0],
                        btnEdit = $element.find('a.ChineseCd_txt_edit')[0];

                    $scope.definition = null;
                    function reset() {
                        $scope.isEditing = false;
                        $scope.isPlaying = false;
                        $scope.isCanPlay = false;

                        audio.pause();
                        $audio.off('canplay play pause');
                    }

                    reset();

                    $scope.onPanelClick = function ($event) {
                        if ($scope.isEditing) {
                            var target = $event.target;
                            if (target != btnEdit && target != definitionCtrl) {
                                $scope.word.definition = $scope.definition;
                                $scope.isEditing = false;
                            }
                        }
                    };

                    $scope.doEdit = function () {
                        $scope.isEditing = true;
                        window.setTimeout(function () {
                            definitionCtrl.focus();
                        }, 300);
                    };

                    $scope.play = function () {
                        if ($scope.isCanPlay) {
                            if ($scope.isPlaying) {
                                audio.pause();
                                audio.currentTime = 0;
                            }
                            audio.play();
                        }
                    };
                    /**
                     * 退出
                     * @param isSyncDef 是否同步编辑过的释义
                     */
                    $scope.exit = function (isSyncDef) {
                        if (isSyncDef) {
                            $scope.word.definition = $scope.definition
                        }

                        reset();
                        $scope.close && $scope.close();
                    };

                    $scope.$watch('word', function (newValue) {
                        definitionViewer && (definitionViewer.scrollTop = 0);
                        if (!!newValue) {
                            $scope.definition = $scope.word.definition;
                            if (!!$scope.word.audio) {
                                $audio.on('canplay', function () {
                                    $scope.$apply(function () {
                                        $scope.tipMessage = '';
                                        $scope.isCanPlay = true;
                                    });
                                }).on('play', function () {
                                    $scope.$apply(function () {
                                        $scope.isPlaying = true;
                                    });
                                }).on('pause', function () {
                                    $scope.$apply(function () {
                                        $scope.isPlaying = false;
                                    });
                                });

                                $scope.tipMessage = audioLoadingMsg;
                                audio.src = $scope.word.audio;
                            }
                        }
                    });
                }
            };
        }]);
    });

