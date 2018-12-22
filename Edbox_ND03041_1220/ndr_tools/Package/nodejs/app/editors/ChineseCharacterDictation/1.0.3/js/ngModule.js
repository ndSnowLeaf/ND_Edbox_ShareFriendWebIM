define(['jquery', 'angular', './utils.js'], function (jquery, angular, Utils) {
    var module = angular.module('LaModule', []);

    module.service('DataService', ['$http', '$q', '$stage', function ($http, $q, $stage) {
        var NDR_HOST = 'http://esp-lifecycle.web.sdp.101.com/v0.6',              //资源平台服务地址
            CS_HOST = 'http://cs.101.com/v0.1/static',                            //内容服务地址
            LOCAL_HOST = window.location.origin || (window.location.protocol + '//' + window.location.host),  //本地服务地址
            API_CONFIG = {
                //通过教材ID获取当前教材下的章节列表
                getChaptersByBookId: NDR_HOST + '/teachingmaterials/{book_id}/chapters/0/subitems',

                //检索成语
                searchIdiom: NDR_HOST + '/coursewareobjects/actions/query?limit=(0,100)&words={key}&coverage=App/932fb6a9-2ed1-4efb-85fe-99f97850748c/OWNER&category=$RA0516',

                //查询所有字卡
                searchWordCard: NDR_HOST + '/coursewareobjects/actions/query?limit=(0,100)&words={key}&coverage=RSD/workspace/ASSEMBLE&category=$RT0303',

                //查询指定章节（by 章节ID）下的字卡列表（$RT0303）
                getWordsByChapterId: NDR_HOST + '/coursewareobjects/actions/query?limit=(0,500)&words=&coverage=RSD/workspace/ASSEMBLE&category=$RT0303&reverse=true&relation=chapters/{chapter_id}/ASSOCIATE',

                //获取字卡的详细信息
                getWordCardDetail: CS_HOST + '/edu/RSD/workspace/coursewareobjects/{identifier}.pkg/resources/relations.json',

                //电子语音合成
                getSpell2AudioBySpeechSynthesis: LOCAL_HOST + '/v3.0/speechSynthesis?text={text}&file_path=' + encodeURIComponent(Utils.getCoursewareFilePath()),

                //资源预下载
                preDownloadAssets: LOCAL_HOST + '/v3.0/assets/cs/download'
            };

        return {
            /**
             * 通过教材ID获取当前教材下的章节列表
             * @param book_id 教材ID
             * @returns 章节树（章->节->小节） [item - {identifier, title, description, parent, teaching_material, children[item]}]
             */
            getChaptersByBookId: function (book_id) {
                var deferred = $q.defer(),
                    url = API_CONFIG.getChaptersByBookId.replace('{book_id}', book_id);

                this.__$httpGet(url).success(function (data) {
                    if (Utils.isNotEmptyArray(data.items)) {
                        var chapterTree = [], chapterMap = {}, unClassified = [], bookId = book_id;
                        $.each(data.items, function (index, item) {
                            chapterMap[item.identifier] = item;
                            item.children = [];

                            if (item.parent === bookId) {
                                chapterTree.push(item);
                            } else {
                                if (chapterMap.hasOwnProperty(item.parent)) {
                                    chapterMap[item.parent].children.push(item);
                                } else {
                                    unClassified.push(item);
                                }
                            }
                        });

                        if (unClassified.length > 0) {
                            $.each(unClassified, function (index, item) {
                                if (chapterMap.hasOwnProperty(item.parent)) {
                                    chapterMap[item.parent].children.push(item);
                                }
                            });
                        }

                        deferred.resolve(chapterTree);
                    } else {
                        deferred.resolve();
                    }
                }).error(function () {
                    deferred.reject();
                });

                return deferred.promise;
            },
            /**
             * 根据文本查询字词
             * @param text
             */
            searchWord: function (text) {
                var deferred = $q.defer();
                if (!!text) {
                    switch (text.length) {
                        case 4: //成语
                            this.searchIdiom(text).then(function (idiom) {
                                deferred.resolve(idiom);
                            }, function () {
                                deferred.reject();
                            });

                            break;
                        case 1: //单字
                            this.searchWordCard(text).then(function (word) {
                                deferred.resolve(word);
                            }, function () {
                                deferred.reject();
                            });

                            break;
                        default: //词语
                            deferred.reject();
                    }
                } else {
                    deferred.reject();
                }

                return deferred.promise;
            },
            /**
             * 通过文本查询成语
             * @param key 成语
             * @returns {*}
             */
            searchIdiom: function (key) {
                var deferred = $q.defer(), self = this,
                    url = API_CONFIG.searchIdiom.replace('{key}', key);

                this.__$httpGet(url).success(function (data) {
                    if (Utils.isNotEmptyArray(data.items)) {
                        var item = data.items[0],
                            idiom = {
                                identifier: item.identifier,
                                text: key,
                                word: key.split('')
                            },
                            unResolved = true;
                        if (item.custom_properties && item.custom_properties.original) {
                            var original = {};
                            try {
                                original = JSON.parse(item.custom_properties.original);
                            } catch (e) {
                            }

                            if (Utils.isNotEmptyArray(original.spells)) {
                                var spellObj = original.spells[0];

                                //拼音(数组)
                                idiom.pinyin = (spellObj.spell || '').replace(/\s{2,}/g, ' ').split(' ');

                                //释义
                                if (Utils.isNotEmptyArray(spellObj.explains)) {
                                    idiom.definition = spellObj.explains[0].title;
                                }

                                //有拼音，因为资源平台上没有成语的发音，所以需使用语音合成逐字朗读
                                if (!!idiom.pinyin) {
                                    unResolved = false;

                                    self.getSpell2AudioBySpeechSynthesis(key).then(function (audioUrl) {
                                        idiom.audio = audioUrl;

                                        deferred.resolve(idiom);
                                    }, function () {
                                        deferred.resolve(idiom);
                                    });
                                }
                            }
                        }

                        unResolved && deferred.resolve(idiom);
                    } else {
                        deferred.reject();
                    }
                }).error(function () {
                    deferred.reject();
                });

                return deferred.promise;
            },
            /**
             * 通过文本查询字卡
             * @param key 字
             * @returns {*}
             */
            searchWordCard: function (key) {
                var deferred = $q.defer(), self = this,
                    url = API_CONFIG.searchWordCard.replace('{key}', key);

                this.__$httpGet(url).success(function (data) {
                    if (Utils.isNotEmptyArray(data.items)) {
                        var detailDeferredList = [], itemArray = [];
                        angular.forEach(data.items, function (item) {
                            var wordCard = {
                                identifier: item.identifier,
                                text: item.title.substr(0, 1),   //字
                                word: [item.title.substr(0, 1)], //字
                                pinyin: [item.title.substr(2)]   //拼音
                            };
                            itemArray.push(wordCard);

                            var defer = $q.defer();
                            detailDeferredList.push(defer.promise);

                            //获取发音和释义
                            self.getWordCardDetail(wordCard.identifier, wordCard.text).then(function (detail) {
                                //发音（拼音配音）
                                wordCard.audio = detail.audioUrl;

                                //释义
                                wordCard.definition = detail.definition;

                                defer.resolve();
                            }, function () {
                                defer.resolve();
                            });
                        });

                        $q.all(detailDeferredList).then(function () {
                            deferred.resolve(itemArray);
                        });
                    } else {
                        deferred.reject();
                    }
                }).error(function () {
                    deferred.reject();
                });

                return deferred.promise;
            },
            /**
             * 通过章节ID获取章节下生字词列表
             *   目前只有生字卡有关联章节、成语未关联，词语尚无资源
             * @param chapter_id 章节ID
             */
            getWordsByChapterId: function (chapter_id) {
                var deferred = $q.defer(), self = this,
                    url = API_CONFIG.getWordsByChapterId.replace('{chapter_id}', chapter_id);

                this.__$httpGet(url).success(function (data) {
                    if (Utils.isNotEmptyArray(data.items)) {
                        var words = [], deferredList = [];
                        angular.forEach(data.items, function (item) {
                            var word = {
                                identifier: item.identifier,
                                text: item.title.substr(0, 1),   //字
                                word: [item.title.substr(0, 1)], //字
                                pinyin: [item.title.substr(2)]   //拼音
                            };
                            words.push(word);

                            var defer = $.Deferred();
                            deferredList.push(defer);

                            //获取生字词的详细信息：发音、释义等
                            self.getWordCardDetail(word.identifier, word.text).then(function (detail) {
                                //拼音
                                //word.pinyin = [detail.pinyin || word.pinyin];

                                //发音（拼音配音）
                                word.audio = detail.audioUrl || '';

                                //释义
                                word.definition = detail.definition || '';

                                defer.resolve();
                            }, function () {
                                defer.resolve();
                            });
                        });

                        $.when.apply(this, deferredList).done(function () {
                            //过滤掉没有拼音和发音的生字词
                            var result = [];
                            angular.forEach(words, function (item) {
                                item.pinyin && item.audio && result.push(item);
                            });

                            deferred.resolve(result);
                        });
                    } else {
                        deferred.reject();
                    }
                }).error(function () {
                    deferred.reject();
                });

                return deferred.promise;
            },
            /**
             * 通过字卡ID获取字卡详细信息
             * @param identifier 字卡ID
             * @param text 字
             * @returns {*}
             */
            getWordCardDetail: function (identifier, text) {
                var deferred = $q.defer(), self = this,
                    url = API_CONFIG.getWordCardDetail.replace('{identifier}', identifier);

                this.__$httpGet(url).success(function (data) {
                    var detail = {};
                    if (data.spellAssets && Utils.isNotEmptyArray(data.spellAssets)) {
                        var spellAssets0 = data.spellAssets[0];

                        //获取拼音、发音（拼音配音）
                        var dubbingAsset = spellAssets0.dubbingAsset;
                        if (dubbingAsset && dubbingAsset.target) {
                            var target = dubbingAsset.target;

                            detail.pinyin = target.title;
                            if (target.location) {
                                var audioUrl = target.location;
                                detail.audioUrl = audioUrl.replace('${ref-path}', CS_HOST);
                            }
                        }

                        //获取释义
                        var spellEntrywordAssets = spellAssets0.spellEntrywordAssets;
                        if (spellEntrywordAssets && $.isArray(spellEntrywordAssets)) {
                            detail.definition = '';

                            var YX002 = 'YX002', connector = '；', ending = '。';
                            $.each(spellEntrywordAssets, function (index, item) {
                                if (item.label === YX002 && item.target && item.target.title) {
                                    detail.definition = detail.definition + item.target.title + connector;
                                }
                            });
                            detail.definition = detail.definition.substr(0, detail.definition.length - connector.length) + ending;
                        }
                    }

                    //若资源平台无拼音配音，则使用语音合成逐字朗读
                    if (!detail.audioUrl) {
                        self.getSpell2AudioBySpeechSynthesis(text).then(function (audioUrl) {
                            detail.audioUrl = audioUrl;

                            deferred.resolve(detail);
                        }, function () {
                            deferred.resolve(detail);
                        });
                    } else {
                        deferred.resolve(detail);
                    }
                }).error(function () {
                    deferred.reject();
                });

                return deferred.promise;
            },
            /**
             * 语音合成
             * @param text 待合成的文本
             */
            getSpell2AudioBySpeechSynthesis: function (text) {
                var deferred = $q.defer(),
                    url = API_CONFIG.getSpell2AudioBySpeechSynthesis.replace('{text}', encodeURIComponent(text));

                this.__$httpGet(url).success(function (data) {
                    if (data && data.audioUrl) {
                        deferred.resolve($stage.getStage().repository.getResourceUrl(data.audioUrl));
                    } else {
                        deferred.resolve('');
                    }
                }).error(function () {
                    deferred.reject();
                });

                return deferred.promise;
            },
            /**
             * 字词发音资源预下载
             * @param words
             * @returns {*}
             */
            preDownloadAudio: function (words) {
                var assets = [];
                if (!angular.isArray(words)) words = [words];
                angular.forEach(words, function (item) {
                    if (item.audio && item.audio.indexOf(CS_HOST) > -1) {
                        assets.push(item.audio.replace(CS_HOST + '/', ''));
                    }
                });

                var deferred = $q.defer();
                if (Utils.isNotEmptyArray(assets)) {
                    $http({
                        url: API_CONFIG.preDownloadAssets,
                        method: 'POST',
                        data: {
                            file_path: Utils.getCoursewareFilePath(),
                            assets: assets
                        }
                    }).success(function () {
                        deferred.resolve();
                    }).error(function () {
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            },
            /**
             * HTTP GET请求
             * @param url 请求url
             * @returns {*}
             * @private
             */
            __$httpGet: function (url) {
                return $http({url: url, method: 'GET'});
            }
        }
    }]);
});

