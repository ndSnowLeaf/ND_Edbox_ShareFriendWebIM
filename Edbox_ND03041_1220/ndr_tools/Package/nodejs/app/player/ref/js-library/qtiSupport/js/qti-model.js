// qti model
(function (window, $) {
    //绑定全局变量
    if (!window.QtiPlayerOldStyle) {
        window.QtiPlayerOldStyle = {};
    }
    var _QtiPlayer = window.QtiPlayerOldStyle;
    //处理日志对象，兼容低版本ie
    var method;
    var noop = function () {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var _console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];
        // Only stub undefined methods.
        if (!_console[method]) {
            _console[method] = noop;
        }
    }

    //logger
    //----创建日志处理对象
    //logger level值(debug:3, info:2, warn:1, error: 0, close: -1)
    var _logger = {
        _level: 0,
        _console: _console,
        setLevel: function (level) {
            switch (level) {
                case 'debug':
                    this._level = 3;
                    break;
                case 'info':
                    this._level = 2;
                    break;
                case 'warn':
                    this._level = 1;
                    break;
                case 'error':
                    this._level = 0;
                    break;
                default:
                    this._level = -1;
            }
        },
        debug: function (msg) {
            if (this._level >= 3) {
                this._console.log(msg);
            }
        },
        info: function (msg) {
            if (this._level >= 2) {
                this._console.info(msg);
            }
        },
        warn: function (msg) {
            if (this._level >= 1) {
                this._console.warn(msg);
            }
        },
        error: function (msg) {
            if (this._level >= 0) {
                this._console.error(msg);
            }
        }
    };

    //工具类
    var _utils = {
        stringToBoolean: function (v) {
            var result = false;
            if (v && v === 'true') {
                result = true;
            }
            return result;
        }
    };

    var _xml = {
        _cache: {},
        _cacheQueue: [],
        _logger: _logger,
        _modelName: {
            choiceInteraction: true,
            orderInteraction: true,
            textEntryMultipleInteraction: true,
            matchInteraction: true,
            extendedTextInteraction: true,
            graphicGapMatchInteraction: true,
            rubricBlock: true,
            gapMatchInteraction: true,
            drawingInteraction: true
        },
        _blankRegex: /&nbsp;/g,
        _refPathRegex: /\$\{ref-path\}/g,
        _textEntryInteractionFilterRegex: /<textEntryInteraction([\s\S]*?)>\s*?<\/textEntryInteraction>/g,
        _textEntryInteractionRegex: /<textEntryInteraction([\s\S])*?\/>/g,
        _mathRegex: /\\\([\s\S]*?\\\)/igm
    };
    //--扩展出jq的_xml方法，兼容IE浏览器无innerHTML的问题
    //获取JQ的XML对象中的内部的所有元素，类似innerHTML
    $.prototype._xml = function () {
        if (this.length <= 0)
            return null;
        var _this = this[0];
        var _xmlinnerHTMLSTR = '';
        if (window.DOMParser) { // Standard
            var oSerializer = new XMLSerializer();
            _xmlinnerHTMLSTR = oSerializer.serializeToString(_this);
        } else { // IE
            _xmlinnerHTMLSTR = _this.xml;
        }
        var myregexp = /^\s*<[\s\S]*?>([\s\S]*)<[\s\S]*?>\s*$/;
        var _xmlinnerHTML = _xmlinnerHTMLSTR.match(myregexp);
        if (_xmlinnerHTML && _xmlinnerHTML.length >= 2)
            return _xmlinnerHTML[1];
    };
    if (window.XDomainRequest) {
        _logger.debug('_xml:使用XDomainRequest加载xml');
        //支持ie特有的支持xml跨与访问的方式
        _xml._getUrl = function (url, option, callback) {
            var that = this;
            var request = new XDomainRequest();
            request.open('GET', url);
            request.onload = function () {
                callback(this.responseText);
            };
            request.onprogress = function () {

            };
            request.ontimeout = function () {
                _logger.error('_xml:XDomainRequest加载超时');
            };
            request.onerror = function () {
                _logger.error('_xml:XDomainRequest加载失败');
            };
            request.send();
        };
    } else {
        //默认使用jquery的xml访问
        _logger.debug('_xml:使用jquery ajax加载xml');
        _xml._getUrl = function (url, option, callback) {
            if (option.async === undefined) {
                option.async = true;
            }
            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'text',
                cache: false,
                async: option.async
            }).done(function (xmlText) {
                callback(xmlText);
            }).fail(function () {
                _logger.error('_xml:jquery ajax加载失败');
            });
        };
    }
    _xml.load = function (url, option, callback) {
        var that = this;
        var refPath = '';
        if (option.refPath) {
            refPath = option.refPath;
        }
        that._logger.debug('_xml:加载' + url);
        var key = encodeURIComponent(url);
        var assessmentItemModel = that._cache[key];
        if (assessmentItemModel) {
            var modelCopy = $.extend(true, {}, assessmentItemModel);
            callback(modelCopy);
        } else {
            that._getUrl(url, option, function (xmlText) {
                xmlText = xmlText.replace(that._refPathRegex, refPath);
                xmlText = xmlText.replace(that._blankRegex, '');
                //填空题特殊标签转换
                xmlText = xmlText.replace(that._textEntryInteractionFilterRegex, function ($0, $1) {
                    var result = '<textEntryInteraction' + $1 + '/>';
                    return result;
                });
                var xmlDoc = $.parseXML(xmlText);
                var $xml = $(xmlDoc);
                var $assessmentItem = $xml.children('assessmentItem');
                //判断是否含有数学公式
                var hasMath = false;
                if (xmlText.match(that._mathRegex)) {
                    hasMath = true;
                }
                //将$xml解析成assessmentItemModel
                var assessmentItemModel = {
                    hasMath: hasMath,
                    prompt: '',
                    correctAnswer: {},
                    hintFeedback: {},
                    answerFeedback: {},
                    model: []
                };
                var $itemBody = $assessmentItem.children('itemBody');
                //判断xml是否是单独的顺序填空题结构
                if (xmlText.match(that._textEntryInteractionRegex)) {
                    //解析成textEntryMultipleInteraction结构
                    //获取正确答案
                    var modelId = 'RESPONSE_1-1';
                    var correctAnswer = {
                        identifier: modelId,
                        cardinality: 'ordered',
                        baseType: '',
                        value: []
                    };
                    //将所有的答案合并成一个答案
                    $assessmentItem.children('responseDeclaration')
                            .each(function () {
                                var $this = $(this);
                                if (!correctAnswer.baseType) {
                                    correctAnswer.baseType = $this.attr('baseType');
                                }
                                $this.find('value').each(function () {
                                    correctAnswer.value.push($(this).text());
                                });
                            });
                    assessmentItemModel.correctAnswer[modelId] = correctAnswer;
                    //
                    var itemBodyXml = $itemBody._xml();
                    itemBodyXml = itemBodyXml.replace(that._textEntryInteractionRegex, '<textEntry />');
                    var model = {
                        modelId: modelId,
                        modelType: 'textEntryMultipleInteraction',
                        prompt: itemBodyXml
                    };
                    assessmentItemModel.model.push(model);
                } else {
                    //解析promp合model
                    $itemBody.children().each(function () {
                        var $this = $(this);
                        if (that._modelName[this.nodeName]) {
                            that._logger.debug('itemBody find model:' + this.nodeName);
                            var model = {
                                modelType: this.nodeName,
                                prompt: ''
                            };
                            model.modelId = $this.attr('responseIdentifier');
                            if (!model.modelId) {
                                model.modelId = '' + new Date().getTime();
                            }
                            if (model.modelType === 'choiceInteraction' || model.modelType === 'orderInteraction') {
                                model.prompt = $this.children('prompt')._xml();
                                model.shuffle = _utils.stringToBoolean($this.attr('shuffle'));
                                model.maxChoices = parseInt($this.attr('maxChoices'));
                                model.minChoices = parseInt($this.attr('minChoices'));
                                model.simpleChoice = [];
                                $this.children('simpleChoice').each(function () {
                                    var $simpleChoice = $(this);
                                    var simpleChoice = {
                                        identifier: $simpleChoice.attr('identifier'),
                                        fixed: _utils.stringToBoolean($simpleChoice.attr('fixed')),
                                        content: $simpleChoice._xml()
                                    };
                                    model.simpleChoice.push(simpleChoice);
                                });
                            } else if (model.modelType === 'matchInteraction') {
                                model.prompt = $this.children('prompt')._xml();
                                model.shuffle = _utils.stringToBoolean($this.attr('shuffle'));
                                model.maxAssociations = parseInt($this.attr('maxAssociations'));
                                model.minAssociations = parseInt($this.attr('minAssociations'));
                                model.simpleMatchSet = [];
                                $this.children('simpleMatchSet').each(function () {
                                    var $simpleMatchSet = $(this);
                                    var simpleMatchSet = [];
                                    $simpleMatchSet.children('simpleAssociableChoice').each(function () {
                                        var $simpleAssociableChoice = $(this);
                                        var simpleAssociableChoice = {
                                            identifier: $simpleAssociableChoice.attr('identifier'),
                                            fixed: _utils.stringToBoolean($simpleAssociableChoice.attr('fixed')),
                                            matchMax: parseInt($simpleAssociableChoice.attr('matchMax')),
                                            content: $simpleAssociableChoice._xml()
                                        };
                                        simpleMatchSet.push(simpleAssociableChoice);
                                    });
                                    model.simpleMatchSet.push(simpleMatchSet);
                                });
                            } else if (model.modelType === 'graphicGapMatchInteraction') {
                                model.prompt = $this.children('prompt')._xml();
                                var $object = $this.children('object');
                                model.object = {
                                    data: $object.attr('data'),
                                    type: $object.attr('type'),
                                    width: parseInt($object.attr('width')),
                                    height: parseInt($object.attr('height')),
                                    param: []
                                };
                                $object.children('param').each(function () {
                                    var $param = $(this);
                                    var param = {
                                        name: $param.attr('name'),
                                        value: $param.attr('value'),
                                        valueType: $param.attr('valuetype')
                                    };
                                    model.object.param.push(param);
                                });
                                //
                                model.gapImg = [];
                                $this.children('gapImg').each(function () {
                                    var $gapImg = $(this);
                                    var $child = $gapImg.children('object');
                                    var gapImg = {
                                        identifier: $gapImg.attr('identifier'),
                                        matchMax: parseInt($gapImg.attr('matchMax')),
                                        data: $child.attr('data'),
                                        type: $child.attr('type'),
                                        width: parseInt($child.attr('width')),
                                        height: parseInt($child.attr('height'))
                                    };
                                    model.gapImg.push(gapImg);
                                });
                                //
                                model.associableHotspot = [];
                                $this.children('associableHotspot').each(function () {
                                    var $associableHotspot = $(this);
                                    var associableHotspot = {
                                        identifier: $associableHotspot.attr('identifier'),
                                        shape: $associableHotspot.attr('shape'),
                                        coords: $associableHotspot.attr('coords'),
                                        matchMax: parseInt($associableHotspot.attr('matchMax'))
                                    };
                                    model.associableHotspot.push(associableHotspot);
                                });
                            } else if (model.modelType === 'rubricBlock') {
                                model.id = $this.attr('id');
                                model.view = $this.attr('view');
                                model.prompt = $this._xml();
                            } else if (model.modelType === 'gapMatchInteraction') {
                                model.prompt = $this.children('prompt')._xml();
                                model.shuffle = _utils.stringToBoolean($this.attr('shuffle'));
                                model.gapText = [];
                                $this.children('gapText').each(function () {
                                    var $gapText = $(this);
                                    var gapText = {
                                        identifier: $gapText.attr('identifier'),
                                        matchMax: parseInt($gapText.attr('matchMax')),
                                        content: $gapText._xml()
                                    };
                                    model.gapText.push(gapText);
                                });
                                model.tableMatchContent = $this.children('.gapMatchInteraction_table_content')._xml();
                            } else if (model.modelType === 'drawingInteraction') {
                                var $prompt = $this.children('prompt');
                                model.titleType = $this.attr('titletype');
                                model.paperType = $this.attr('papertype');
                                model.title = $prompt.children('.drawingInteraction_title')._xml();
                                if (!model.title) {
                                    model.title = '';
                                }
                                model.content = $prompt.children('.drawingInteraction_content')._xml();
                                model.asset = [];
                                var $asset = $prompt.children('.drawingInteraction_asset');
                                $asset.children('.asset').each(function () {
                                    var asset = $(this)._xml();
                                    if (!asset) {
                                        asset = '';
                                    }
                                    model.asset.push(asset);
                                });
                                var $object = $this.children('object');
                                model.object = {
                                    type: $object.attr('type'),
                                    data: $object.attr('data'),
                                    width: parseInt($object.attr('width')),
                                    height: parseInt($object.attr('height'))
                                };
                            } else if (model.modelType === 'extendedTextInteraction' || model.modelType === 'textEntryMultipleInteraction') {
                                model.prompt = $this.children('prompt')._xml();
                            }
                            assessmentItemModel.model.push(model);
                        } else {
                            //非model 节点
                            that._logger.debug('itemBody find dom:' + this.nodeName);
                            assessmentItemModel.prompt = $this.clone().wrap('<' + this.nodeName + '>').parent()._xml();
                        }
                    });
                    //解析正确答案
                    $assessmentItem.children('responseDeclaration')
                            .each(function () {
                                var $this = $(this);
                                var modelId = $this.attr('identifier');
                                var correctAnswer = {
                                    identifier: $this.attr('identifier'),
                                    cardinality: $this.attr('cardinality'),
                                    baseType: $this.attr('baseType'),
                                    value: []
                                };
                                $this.find('value').each(function () {
                                    correctAnswer.value.push($(this).text());
                                });
                                assessmentItemModel.correctAnswer[modelId] = correctAnswer;
                            });
                }
                //解析Feedback
                $assessmentItem.children('modalFeedback')
                        .each(function () {
                            var $this = $(this);
                            var modelId = $this.attr('sequence');
                            //xml特定关联结构，注意
                            modelId = 'RESPONSE_' + modelId + '-1';
                            var content = $this._xml();
                            if (!content) {
                                content = '';
                            }
                            var feedback = {
                                showHide: $this.attr('showHide'),
                                identifier: $this.attr('identifier'),
                                content: content
                            };
                            //
                            switch (feedback.identifier) {
                                case 'showHint':
                                    assessmentItemModel.hintFeedback[modelId] = feedback;
                                    break;
                                case 'showAnswer':
                                    assessmentItemModel.answerFeedback[modelId] = feedback;
                                    break;
                            }
                        });
                //缓存处理
                that._cache[key] = assessmentItemModel;
                that._cacheQueue.push(key);
                if (that._cacheQueue.length > 10) {
                    var oldKey = that._cacheQueue.shift();
                    delete that._cache[oldKey];
                }
                var modelCopy = $.extend(true, {}, assessmentItemModel);
                callback(modelCopy);
            });
        }
    };

    //全局api
    _QtiPlayer.getLogger = function () {
        return _logger;
    };

    _QtiPlayer.setLoggerLevel = function (level) {
        return _logger.setLevel(level);
    };

    _QtiPlayer.load = function (url, option, callback) {
        _xml.load(url, option, callback);
    };
}(window, jQuery));
