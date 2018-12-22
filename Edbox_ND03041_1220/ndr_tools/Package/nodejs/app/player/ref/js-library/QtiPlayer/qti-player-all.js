//version=1.0
(function(window,document,$){
/**
 * 简易模块化加载器
 * Created by ylf on 2016/7/5.
 */


var require, define;
(function () {
    var defined = {}, defineWaiting = {};

    var callDeps = function (key) {
        if (key) {
            key = key.toLowerCase();
        }
        if (defineWaiting[key]) {
            var df = defineWaiting[key];
            delete defineWaiting[key];
            var args = [];
            for (var i = 0; i < df.deps.length; i++) {
                var depName = df.deps[i];
                args[i] = callDeps(depName);
            }
            var ret = df.callback.apply(df.callback, args);
            defined[key] = ret;
        }

        return defined[key];
    };

    define = function (key, deps, callback) {
        if (key) {
            key = key.toLowerCase();
        }
        if (!(deps instanceof Array)) {
            callback = deps;
            deps = [];
        }
        if (defineWaiting[key]) {
            throw  new Error('the key already has been  used');
        }
        defineWaiting[key] = {
            'deps': deps,
            'callback': callback,
            'module': null
        };
    };

    require = function (key) {
        return callDeps(key);
    };

})();

// qti model
define('model/ajax', ['model/logger', 'model/event'], function (_logger, _event) {

    var _ajax = {
        _logger: _logger,
        _event: _event
    };

    if (window.XDomainRequest) {
        _logger.debug('_ajax:使用XDomainRequest加载数据');
        //支持ie特有的支持xml跨与访问的方式
        _ajax._getUrl = function (url, callback,errorCallback) {
            var that = this;
            var request = new XDomainRequest();
            request.open('GET', url);
            request.onload = function () {
                callback(this.responseText);
            };
            request.onprogress = function () {

            };
            request.ontimeout = function (ex) {
                _logger.error('_ajax:XDomainRequest加载超时');
                errorCallback && errorCallback(ex);
            };
            request.onerror = function (ex) {
                _logger.error('_ajax:XDomainRequest加载失败');
                errorCallback && errorCallback(ex);
                that._event.trigger('load', 'error', url);
            };
            request.send();
        };
    } else {
        //默认使用jquery的xml访问
        _logger.debug('_ajax:使用jquery ajax加载数据');
        _ajax._getUrl = function (url, callback,errorCallback) {
            var that = this;
            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'text',
                cache: false
            }).done(function (xmlText) {
                callback(xmlText);
            }).fail(function (ex) {
                errorCallback && errorCallback(ex);
                _logger.error('_ajax:jquery ajax加载失败');
                that._event.trigger('load', 'error', url);
            });
        };
    }

    return _ajax;

});

define('model/convertComposite', ['model/logger'], function (_logger) {

    var OptionalTypeRegex = /^<[^<>]*?questiontype=(["'])([a-zA-Z]*)\1[^<>]*?>/i;
    var OptionalMustChoiceRegex = /^<[^<>]*?mustchoices=(["'])(\d*)\1[^<>]*?>/i;

    var CompositeConvert = {
        parseXmlComposite: function (itemModel, prompt) {

            var title = prompt.replace(/<(div|span)[^<>]*?class="_qp-model"[^<>]*?><\/\1>/ig, function () {
                return '';
            }).trim();
            var newTitle = title;

            //判断是否选做题
            var r = newTitle.match(OptionalTypeRegex);
            if (r && r.length == 3) {
                if (r[2].toLowerCase() === 'optionalchoice') {
                    itemModel.composite.isComposite = true;
                    itemModel.composite.isOptional = true;
                }
                //替换掉头尾div
                newTitle = newTitle.replace(r[0], '');
                newTitle = newTitle.replace(/<\/div>$/i, '').trim();

                var mustChoice = newTitle.match(OptionalMustChoiceRegex);
                if (mustChoice && mustChoice.length == 3) {
                    itemModel.composite.mustChoices = parseInt(mustChoice[2]) || 0;

                    //替换掉头尾div
                    newTitle = newTitle.replace(mustChoice[0], '');
                    newTitle = newTitle.replace(/<\/div>$/i, '');
                }
                return prompt.replace(title, newTitle);
            }
            return prompt;

        },
        parseJsonComposite: function (itemModel, compositeTitle) {
            itemModel.composite.isOptional = true;
            itemModel.composite.isComposite = true;
            var mustChoice = compositeTitle.trim().match(OptionalMustChoiceRegex);
            if (mustChoice && mustChoice.length == 3) {
                itemModel.composite.mustChoices = parseInt(mustChoice[2]) || 0;

                //替换掉头尾div
                compositeTitle = compositeTitle.replace(mustChoice[0], '');
                compositeTitle = compositeTitle.replace(/<\/div>$/i, '');
            }
            return compositeTitle;
        }
    }

    return CompositeConvert;
});
// qti model
define('model/convertTextToMultiple', ['model/logger', 'model/utils'], function (_logger, _utils) {

    var convertTextToMultiple = function (assessmentItemModel) {
        var isTextEntry = true;
        var prompt = '';
        var firstModelId = '';
        var modelMap = assessmentItemModel.modelMap;
        //将选择题转换为复合题中的结构
        for (var modelKey in modelMap) {
            if (!firstModelId) {
                firstModelId = modelKey;
            }

            var model = modelMap[modelKey];
            if (model.modelType !== 'textEntryInteraction') {
                isTextEntry = false;
                break;
            }
        }
        if (isTextEntry) {
            prompt = assessmentItemModel.prompt.replace(/<(div|span) class="_qp-model"[\s\S]*?><\/(div|span)>/g, function (modelHtml) {
                var modelId = _utils.getValue(modelHtml, /data-model-id="([\s\S]*?)"/);
                var model = modelMap[modelId];
                return '<textEntry textentryid="" keyboard="' + model.keyboard + '"  style="' + model.style + '" width="' + model.width + '" expectedLength="' + model.expectedLength + '" \/>';
            });

            var multipleModel = {
                modelId: firstModelId,
                modelType: 'textEntryMultipleInteraction',
                prompt: prompt,
                questionType: '',
                style: ''
            };

            var correctAnswer = [];
            for (var key in assessmentItemModel.correctAnswer) {
                var answer = assessmentItemModel.correctAnswer[key].value;
                correctAnswer.push(answer[0]);
            }
            assessmentItemModel.correctAnswer = {};
            assessmentItemModel.correctAnswer[firstModelId] = {
                value: correctAnswer,
                identifier: firstModelId,
                cardinality: 'ordered',
                baseType: 'pair'
            };

            assessmentItemModel.modelMap = {};
            assessmentItemModel.modelMap[firstModelId] = multipleModel;
            assessmentItemModel.prompt = '<div class="_qp-model" data-model-id="' + firstModelId + '" ></div>';
        }
    };
    return convertTextToMultiple;
});

// qti model
define('model/event', ['model/logger'], function (logger) {

    //空方法
    var _emptyFunc = function () {
    };

    //创建事件管理对象
    var _event = {
        _logger: logger,
        _eventHandler: {
            load: {
                error: _emptyFunc
            }
        },
        trigger: function (group, type, para) {
            this._logger.debug('model trigger event:' + group + '-' + type);
            this._eventHandler[group][type](para);
        },
        bind: function (group, type, callback) {
            if (this._eventHandler[group] && this._eventHandler[group][type] && $.type(callback) === 'function') {
                this._logger.debug('model bind event:' + group + '-' + type);
                this._eventHandler[group][type] = callback;
            }
        }
    };

    return _event;

});

define('model/exception', ['model/logger', 'model/event'], function (_logger, _event) {


    'use strict';

    var exception = {
        create: function (message, throwable, code) {
            throwable.message = message + '： ' + throwable.message;
            throwable.code = code || 0;
            throwable.type = 'qtiplayerException';
            return throwable;
        }
    };

    return exception;
});
// qti model
//define('model/ie8shim', function () {


//兼容代码
if (typeof Array.prototype.forEach === typeof  undefined) {
    Array.prototype.forEach = function (callback) {
        for (var i = 0; i < this.length; i++) {
            var item = this[i];
            callback.apply(this, [item, i, this]);
        }
    };
}
if (typeof String.prototype.trim === typeof  undefined) {
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };
}

if (typeof Array.prototype.clear === typeof  undefined) {
//array 方法增强
    Array.prototype.clear = function () {
        while (this.length) {
            this.pop();
        }
    };
}
if (typeof Array.prototype.pushArray === typeof  undefined) {
    Array.prototype.pushArray = function () {
        var toPush = this.concat.apply([], arguments);
        for (var i = 0, len = toPush.length; i < len; ++i) {
            this.push(toPush[i]);
        }
    };
}

if (typeof Array.prototype.indexOf === typeof  undefined) {
    Array.prototype.indexOf = function (item) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == item) {
                return i;
            }
        }
        return -1;
    };
}


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

//});
// qti model
define('model/logger', function () {
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
        _log: function (method, args) {
            try {
                this._console[method].apply(this._console, args);
            } catch (e) {
                var that = this;
                this._log = function (method, args) {
                    if (args.length <= 1) {
                        that._console[method](args[0]);
                    } else {
                        that._console[method](args);
                    }
                };
                this._log(method, args);
            }
        },
        debug: function (msg) {
            if (this._level >= 3) {
                this._log('log', arguments);
            }
        },
        info: function (msg) {
            if (this._level >= 2) {
                this._log('info', arguments);
            }
        },
        warn: function (msg) {
            if (this._level >= 1) {
                this._log('warn', arguments);
            }
        },
        error: function (msg) {
            if (this._level >= 0) {
                this._log('error', arguments);
            }
        }
    };
    return _logger;
});

//绑定全局变量
if (!window.QtiPlayer) {
    window.QtiPlayer = {};
}
// qti model
define('model/qtiModel', ['model/logger', 'model/event', 'model/utils', 'model/ajax'], function (_logger, _event, _utils, _ajax) {

    var jsonParser = require('model/json/jsonParser');
    var xmlParser = require('model/xml/xmlParser');
    var convertTextToMultiple = require('model/convertTextToMultiple');

    var _QtiPlayer = window.QtiPlayer;


    //全局api
    _QtiPlayer.getLogger = function () {
        return _logger;
    };

    _QtiPlayer.getUtils = function () {
        return _utils;
    };

    _QtiPlayer.setLoggerLevel = function (level) {
        return _logger.setLevel(level);
    };

    var loadComplete = function (text, option, callback, url) {
        text = $.trim(text);
        var assessmentItemModel;
        var prefix = text.substring(0, 1);
        if (prefix === '{' || prefix === '[') {
            assessmentItemModel = jsonParser.parse(text, option, url);
        } else {
            assessmentItemModel = xmlParser.parse(text, option, url);
        }

        //将普通填空题转换为复合中的结构
        if (option.unifyTextEntry === true) {
            convertTextToMultiple(assessmentItemModel);
        }
        //处理复合题逻辑
        convertComposite(assessmentItemModel);

        if (callback) {
            callback(assessmentItemModel);
        }
    }

    var convertComposite = function (itemModel) {
        var model;
        var isComposite = 0;
        var modelType;
        var modelCount = 0;
        for (var modelId in itemModel.modelMap) {
            modelCount++;
            model = itemModel.modelMap[modelId];
            if (model.modelType !== 'textEntryInteraction' && model.modelType !== 'inlineChoiceInteraction') {
                isComposite++;
                if (modelType && modelType !== model.modelType) {
                    isComposite++;
                }
                modelType = model.modelType;
            }
        }

        if (isComposite > 1 || (isComposite === 1 && itemModel.prompt.trim().indexOf('<div class="_qp-model"') !== 0)) {
            itemModel.composite.isComposite = true;
        }
        itemModel.composite.count = modelCount;
    }

    _QtiPlayer.load = function (url, option, callback, errorCallback) {
        // json对象转json字符串
        try {
            if (url && url instanceof Object) {
                url = $.trim(JSON.stringify(url));
            }

            var prefix = url.substring(0, 1);
            if (prefix === '{' || prefix === '[') {// json字符串
                loadComplete(url, option, callback, null);
            } else {// url字符串
                _logger.debug('_ajax:加载' + url);
                _ajax._getUrl(url, function (text) {
                    try {
                        loadComplete(text, option, callback, url);
                    } catch (ex) {
                        _logger.error('load解析数据:', url, ex);
                        errorCallback && errorCallback(ex);
                    }
                }, function (ex) {
                    _logger.error('load加载数据:', url, ex);
                    errorCallback && errorCallback(ex);
                });
            }
        } catch (ex) {
            _logger.error('load解析数据:', url, ex);
            errorCallback && errorCallback(ex);
        }
    };

    _QtiPlayer.loadOnError = function (callback) {
        _event.bind('load', 'error', callback);
    };
});

//初始化qtiplayer-model
//require('model/modelParser');
// qti model
define('model/utils', function () {
    //工具类
    var _utils = {
        _encodeLeftRegex: /</g,
        _decodeLeftRegex: /&lt;/g,
        _encodeRightRegex: />/g,
        _decodeRightRegex: /&gt;/g,
        _encodeAndRegex: /&/g,
        _decodeAndRegex: /&amp;/g,
        _decodeBlankRegex: /&nbsp;/g,
        xmlEncode: function (value) {
            value = value.replace(this._encodeAndRegex, '&amp;');
            value = value.replace(this._encodeLeftRegex, '&lt;');
            value = value.replace(this._encodeRightRegex, '&gt;');
            return value;
        },
        xmlDecode: function (value) {
            value = value.replace(this._decodeBlankRegex, ' ');
            value = value.replace(this._decodeLeftRegex, '<');
            value = value.replace(this._decodeRightRegex, '>');
            value = value.replace(this._decodeAndRegex, '&');
            return value;
        },
        stringToBoolean: function (v) {
            var result = false;
            if (v && v === 'true') {
                result = true;
            }
            return result;
        },
        getValue: function (xml, v, index) {
            var result = '';
            var arr = xml.match(v);
            if (typeof  index === 'number' && arr && arr.length > index) {
                result = arr[index]
            } else if (arr && arr.length === 2) {
                result = arr[1];
            }
            return result;
        },
        getValues: function (xml, r, v) {
            var values = [];
            var value;
            var arr = xml.match(r);
            if (arr) {
                for (var i = 0; i < arr.length; i++) {
                    value = this.getValue(arr[i], v);
                    if (value) {
                        values.push(value);
                    }
                }
            }
            return values;
        },
        getIntValue: function (xml, v) {
            var result = 0;
            var arr = xml.match(v);
            if (arr && arr.length === 2) {
                result = parseInt(arr[1]);
            }
            return result;
        },
        getBasePath: function (path) {
            if (typeof path == typeof  undefined) {
                throw new Error('path not defined');
            }
            var hashIndex = path.lastIndexOf('#');
            if (hashIndex == -1) {
                hashIndex = path.length;
            }
            var queryIndex = path.indexOf('?');
            if (queryIndex == -1) {
                queryIndex = path.length;
            }
            var slashIndex = path.lastIndexOf('/', Math.min(queryIndex, hashIndex));
            return slashIndex >= 0 ? path.substring(0, slashIndex) : '';
        },
        template: function (tpl, attrs) {
            var templateRegExp = /\$\{(.+?)(?:\:(.+?))?\}/g;
            return tpl.replace(templateRegExp, function ($0, $1, $2) {
                if (attrs[$1] !== undefined) {
                    return attrs[$1];
                }
                return $0;
            });
        },
        getUuid: function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },
        //获取地址后缀,入json,xml
        getPathSuffix: function (path) {
            path = path.toLowerCase();
            var hashIndex = path.indexOf('#');
            if (hashIndex == -1) {
                hashIndex = path.length;
            }
            var queryIndex = path.indexOf('?');
            if (queryIndex == -1) {
                queryIndex = path.length;
            }
            var slashIndex = Math.min(queryIndex, hashIndex);
            var reUrl = slashIndex >= 0 ? path.substring(0, slashIndex) : '';

            var dotIndex = reUrl.indexOf('.');
            return dotIndex >= 0 ? reUrl.substring(dotIndex + 1) : '';
        }
    };

    return _utils;

});

/**
 * Created by ylf on 2017/6/13 0013.
 */

define('model/json/feedback', ['model/utils', 'model/logger'], function (_utils, _logger) {

    var feedbackParser = {
        _subjectiveRegex: /class="subjectivebase_text"/i,
        _subjectiveBaseAssetRegex: /<div[^<>]*?class="asset"[^<>]*?><\/div>/g,
        _subjectiveBaseAssetPosterRegex: /data-poster="([\s\S]*?)"/,
        _subjectiveBaseAssetSrcRegex: /data-src="([\s\S]*?)"/,
        _subjectiveBaseAssetTypeRegex: /data-type="([\s\S]*?)"/,
        _subjectiveBaseTextRegex: /<div class="subjectivebase_text">([\s\S]*?)<\/div>\s*?<div class="subjectivebase_asset"/,
        _widthRegex: /width="([\s\S]+)"/,
        _heightRegex: /height="([\s\S]+)"/,
        parse: function (content, itemModel) {
            //是否是主观题提示内容
            if (this._subjectiveRegex.test(content)) {
                var assets = [];
                var text = '';

                var assetsResult = content.match(this._subjectiveBaseAssetRegex);
                if (assetsResult) {
                    for (var i = 0; i < assetsResult.length; i++) {
                        var asset = assetsResult[i];
                        assets.push({
                            poster: _utils.getValue(asset, this._subjectiveBaseAssetPosterRegex),
                            src: _utils.getValue(asset, this._subjectiveBaseAssetSrcRegex),
                            type: _utils.getValue(asset, this._subjectiveBaseAssetTypeRegex),
                            width: _utils.getIntValue(asset, this._widthRegex),
                            height: _utils.getIntValue(asset, this._heightRegex)
                        });
                    }
                }
                text = _utils.getValue(content, this._subjectiveBaseTextRegex);
                itemModel.contentData = {
                    asset: assets,
                    text: text
                }
            }
        }
    };

    var convert = {
        /**
         * 返回解析后的提示、解析数据结构
         * @param feedbacks
         * @returns {
                  string:{
                            content: content,
                            identifier: identifier,
                            modelId: modelId,
                            showHide: feedback.show_hide
                        }
                }
         */
        parse: function (feedbacks) {
            var parsedFeedback = {},
                feedback,
                content,
                identifier,
                modelId;

            for (var i = 0; i < feedbacks.length; i++) {
                feedback = feedbacks[i];
                modelId = 'RESPONSE_' + (feedback.sequence || 1) + "-1";
                content = feedback.content;
                identifier = feedback.identifier;

                var item = {
                    content: content,
                    identifier: identifier,
                    modelId: modelId,
                    showHide: feedback.show_hide
                };
                //提示、解析内容二次解析（主观题用）
                feedbackParser.parse(content, item);
                if (!parsedFeedback[identifier]) {
                    parsedFeedback[identifier] = {};
                }
                parsedFeedback[identifier][modelId] = item;
            }
            return parsedFeedback;
        }
    }

    return convert;

})
/**
 * Created by ylf on 2017/6/13 0013.
 */

define('model/json/inlinechoice', ['model/utils', 'model/logger'], function (_utils, _logger) {

    var regex = /<inlinechoiceinteraction(?:.*?)responseidentifier="([\s\S]*?)"(?:.*?)shuffle=(["'])([^"']*?)\2><\/inlinechoiceinteraction>/ig;
    var convert = {
        parse: function (item, result) {
            var inlineChoice;
            for (var i = 0; i < item.children.length; i++) {
                inlineChoice = [];
                var choice = item.children[i];
                for (var j = 0; j < choice.choices.length; j++) {
                    var playerChoice = {
                        content: choice.choices[j].text,
                        identifier: choice.choices[j].identifier
                    };
                    inlineChoice.push(playerChoice);
                }
                result.modelMap[choice.response_identifier] = {
                    inlineChoice: inlineChoice,
                    modelId: choice.response_identifier,
                    modelType: 'inlineChoiceInteraction',
                    questionType: 'inlinechoice',
                    shuffle: false
                };
            }


        },
        filter: function (prompt) {
            var prompt = prompt.replace(regex, function ($1, responseidentifier, $3, shuffle) {
                return '<span class="_qp-model" data-model-id="' + responseidentifier + '" style=""></span>';
            });
            return prompt;
        }
    }

    return convert;

})
//create by
define('model/json/jsonConvert', ['model/utils', 'model/logger'], function (_utils, _logger) {

    var FeedbackParser = require('model/json/feedback');
    var QuestionTypeParser = require('model/json/questionType');
    var ResponseParser = require('model/json/response');
    var TextentryParser = require('model/json/textentry');
    var MultipleTextentryParser = require('model/json/multipleTextentry');
    var InlinechoiceParser = require('model/json/inlinechoice');
    var ConvertComposite = require('model/convertComposite');

    var modelMap = {
        subjectivebase: {
            _subjectiveBaseAssetRegex: /<div[^<>]*?class="asset"[^<>]*?><\/div>/g,
            _subjectiveBaseAssetPosterRegex: /data-poster="([\s\S]*?)"/,
            _subjectiveBaseAssetSrcRegex: /data-src="([\s\S]*?)"/,
            _subjectiveBaseAssetTypeRegex: /data-type="([\s\S]*?)"/,
            _subjectiveBaseTextRegex: /<div class="subjectivebase_text">([\s\S]*?)<\/div>\s*?<div class="subjectivebase_asset"/,
            _widthRegex: /width="([\s\S]+)"/,
            _heightRegex: /height="([\s\S]+)"/,
            parse: function (resModel, itemModel) {
                var that = this;
                var assets = [];
                var text = '';
                var prompt = resModel.prompt;
                var assetsResult = prompt.match(that._subjectiveBaseAssetRegex);
                if (assetsResult) {
                    for (var i = 0; i < assetsResult.length; i++) {
                        var asset = assetsResult[i];
                        assets.push({
                            poster: _utils.getValue(asset, that._subjectiveBaseAssetPosterRegex),
                            src: _utils.getValue(asset, that._subjectiveBaseAssetSrcRegex),
                            type: _utils.getValue(asset, that._subjectiveBaseAssetTypeRegex),
                            width: _utils.getIntValue(asset, that._widthRegex),
                            height: _utils.getIntValue(asset, that._heightRegex)
                        });
                    }
                }
                text = _utils.getValue(prompt, that._subjectiveBaseTextRegex);

                itemModel.text = text;
                itemModel.asset = assets;
            }
        },
        rubricBlock: {
            _subjectiveBaseAssetRegex: /<div[^<>]*?class="asset"[^<>]*?><\/div>/g,
            _subjectiveBaseAssetPosterRegex: /data-poster="([\s\S]*?)"/,
            _subjectiveBaseAssetSrcRegex: /data-src="([\s\S]*?)"/,
            _subjectiveBaseAssetTypeRegex: /data-type="([\s\S]*?)"/,
            _responseTextRegex: /<div class="response_text">([\s\S]*?)<\/div>\s*?<div class="subjectivebase_asset"/,
            _widthRegex: /width="([\s\S]+)"/,
            _heightRegex: /height="([\s\S]+)"/,
            parse: function (prompt, itemModel) {
                //该模型为对应的问答题的参考答案
                var that = this;
                var rubricBlock;
                var view = 'scorer';

                var subjectiveBase = that._responseTextRegex.test(prompt);
                if (subjectiveBase) {
                    var assets = [];
                    var text = '';

                    var assetsResult = prompt.match(that._subjectiveBaseAssetRegex);
                    if (assetsResult) {
                        for (var i = 0; i < assetsResult.length; i++) {
                            var asset = assetsResult[i];
                            assets.push({
                                poster: _utils.getValue(asset, that._subjectiveBaseAssetPosterRegex),
                                src: _utils.getValue(asset, that._subjectiveBaseAssetSrcRegex),
                                type: _utils.getValue(asset, that._subjectiveBaseAssetTypeRegex),
                                width: _utils.getIntValue(asset, that._widthRegex),
                                height: _utils.getIntValue(asset, that._heightRegex)
                            });
                        }
                    }
                    text = _utils.getValue(prompt, that._responseTextRegex);

                    rubricBlock = {
                        view: view,
                        text: text,
                        asset: assets
                    };
                } else {
                    rubricBlock = {
                        prompt: prompt,
                        view: view
                    };
                }
                itemModel.rubricBlock = rubricBlock;
            }
        },
        drawing: {
            parse: function (resModel, itemModel) {
                _logger.debug(resModel);
                itemModel.asset = [];
                if (resModel.prompt_object.assets) {
                    var assets = resModel.prompt_object.assets;
                    itemModel.asset = assets;
                }
                if (resModel.prompt_object.asset_titles) {
                    var assetsTitle = resModel.prompt_object.asset_titles;
                    itemModel.assetTitle = assetsTitle;
                }
                itemModel.content = resModel.prompt_object.content;
                itemModel.object = resModel.object;
                itemModel.paperType = resModel.papertype;
                itemModel.title = TextentryParser.filterTextentry(resModel.prompt_object.title, true);
                itemModel.titleType = resModel.titletype;
            }
        },
        handwrite: {
            parse: function (resModel, itemModel) {
                itemModel.object = resModel.object;
                itemModel.object.width = itemModel.object.width ? parseInt(itemModel.object.width) : 0;
                itemModel.object.height = itemModel.object.height ? parseInt(itemModel.object.height) : 0;
            }
        },
        graphicgapmatch: {
            parse: function (resModel, itemModel) {
                //object &gapImg & associableHotspot
                itemModel.object = {};
                itemModel.object = resModel.object;
                itemModel.object.param = [];
                //兼容旧数据
                if (resModel.object.params['blankImage']) {
                    itemModel.object.data = resModel.object.params['blankImage'];
                    var keys = ['rows', 'columns', 'blankImage', 'originalImage'];
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var value = resModel.object.params[key];
                        itemModel.object.param.push({
                            name: key,
                            value: value,
                            valueType: 'DATA'
                        });
                    }
                }
                else {
                    itemModel.object.param = resModel.object.params;
                    for (var j = 0; j < resModel.object.params.length; j++) {
                        var param = resModel.object.params[j];
                        if (param.name === "blankImage") {
                            itemModel.object.data = param.value;
                        }
                    }
                }

                itemModel.object.width = itemModel.object.width ? parseInt(itemModel.object.width) : 0;
                itemModel.object.height = itemModel.object.height ? parseInt(itemModel.object.height) : 0;
                itemModel.gapImg = resModel.gap_imgs;
                if (itemModel.gapImg) {
                    for (var i = 0; i < itemModel.gapImg.length; i++) {
                        var obj = itemModel.gapImg[i];
                        if (typeof obj.matchMax == 'undefined') {
                            obj.matchMax = 1;
                        }
                        //兼容text数据
                        if (typeof obj.text != 'undefined') {
                            obj.identifier = obj.text;
                        }
                    }
                }
                itemModel.associableHotspot = resModel.associable_hotspots;
                if (itemModel.associableHotspot) {
                    for (var i = 0; i < itemModel.associableHotspot.length; i++) {
                        var obj = itemModel.associableHotspot[i];
                        if (typeof obj.matchMax == 'undefined') {
                            obj.matchMax = 1;
                        }
                    }
                }
            }
        },
        match: {
            parse: function (resModel, itemModel) {
                var groups = {};
                var groupsArray = [];
                for (var i = 0; i < resModel.choices.length; i++) {
                    var choice = resModel.choices[i];
                    var playerChoice = {
                        content: choice.text,
                        fixed: choice.fixed,
                        matchMax: choice.match_max,
                        identifier: choice.identifier
                    };
                    var groupId = choice.group_id;
                    if (!groups[groupId]) {
                        var array = [];
                        groups[groupId] = array;
                        groupsArray.push(array);
                    }
                    groups[groupId].push(playerChoice);
                }
                itemModel.simpleMatchSet = groupsArray;
            }
        },
        cloze: {
            parse: function (resModel, itemModel) {
                var choices = resModel.choices,
                    options,
                    optionsLen,
                    option,
                    choicesLen = choices.length,
                    i,
                    j;

                itemModel.choices = [];

                for (j = 0; j < choicesLen; j++) {
                    options = choices[j];
                    optionsLen = options.length;
                    var newOption = [];
                    for (i = 0; i < optionsLen; i++) {
                        option = options[i];
                        for (var key in option) {
                            if (option.hasOwnProperty(key)) {
                                newOption.push({identifier: key, content: option[key]});
                            }
                        }
                    }
                    itemModel.choices.push(newOption);
                }
            }
        }
    };
    var addModel = function (model, result) {
        var item = {
            layout: model.layout || '',
            modelId: model.response_identifier,
            modelType: QuestionTypeParser.parse(model.type),
            prompt: TextentryParser.filterTextentry(model.prompt),
            questionType: model.type,
            shuffle: model.shuffle,
            style: ''
        };

        if (model.type != 'drawing' && model.type != 'textentrymultiple') {
            TextentryParser.parse(model, result)
        }

        if (model.type != 'match') {
            item.maxChoices = model.max_choices;
            item.minChoices = model.min_choices || 0;
        } else {
            item.maxAssociations = model.max_choices;
            item.minAssociations = model.min_choices || 0;
        }

        var choices = model.choices;
        if (choices && choices.length > 0 && model.type != 'match' && model.type !== 'cloze') {
            item.simpleChoice = [];
            for (var i = 0; i < model.choices.length; i++) {
                var choice = model.choices[i];
                item.simpleChoice.push({
                    content: choice.text,
                    fixed: choice.fixed,
                    identifier: choice.identifier
                });
            }
        }

        if (modelMap[model.type]) {
            modelMap[model.type].parse(model, item);
        }
        _logger.debug(item);
        return item;
    };

//检查是否使用mathjax
    var jsonAdapter = {
        convert: function (assessment) {
            _logger.debug(assessment);
            var result = {
                answerFeedback: {},
                correctAnswer: {},
                hasMath: false,
                hintFeedback: {},
                modelMap: {},
                prompt: '',
                composite: {
                    isComposite: false,//是否复合题·
                    isOptional: false,//是否选做题
                    mustChoices: 0//选做最低题数
                }
            };  


            var responses = assessment.responses;

            //反馈
            var feedbacks = FeedbackParser.parse(assessment.feedbacks);
            result.hintFeedback = feedbacks['showHint'] || {};
            result.answerFeedback = feedbacks['showAnswer'] || {};

            //正确答案
            result.correctAnswer = ResponseParser.parse(responses);

            //具体题型
            var prompt = '';
            for (var i = 0; i < assessment.items.length; i++) {
                var item = assessment.items[i];
                var modelId = item.response_identifier;

                if (item.type === 'optionalChoice') {
                    prompt = ConvertComposite.parseJsonComposite(result, item.prompt);

                } else if (item.type == 'data' || item.type == 'textentry') {
                    //填空题
                    prompt = prompt + ' ' + TextentryParser.filterTextentry(item.prompt);
                    TextentryParser.parse(item, result);
                } else if (item.type == 'textentrymultiple') {
                    //复合填空题
                    prompt = prompt + ' <div class="_qp-model" data-model-id="' + modelId + '" ></div>';
                    MultipleTextentryParser.parse(item, result);
                } else if (item.type === 'inlinechoice') {
                    //内连下拉选择题
                    prompt = prompt + InlinechoiceParser.filter(item.prompt);
                    InlinechoiceParser.parse(item, result);
                } else {
                    //其他题型
                    prompt = prompt + ' <div class="_qp-model" data-model-id="' + modelId + '" ></div>';
                    result.modelMap[modelId] = addModel(item, result);
                }
                //eLearing的特殊字符支持
                if (result.modelMap[modelId]) {
                    result.modelMap[modelId].full_score = item.full_score || 0;
                    result.modelMap[modelId].user_score = item.user_score || 0;
                }
            }


            //参考答案
            for (var i = 0; i < responses.length; i++) {
                var response = responses[i];
                var modelId = response.identifier;
                var questionModel = result.modelMap[modelId];

                if (questionModel && (questionModel.questionType === 'subjectivebase' || questionModel.questionType == 'extendedtext')) {
                    modelMap.rubricBlock.parse(response.corrects[0], questionModel);
                }
            }

            result.prompt = prompt;
            //判断是否有公式
            result.hasMath = JSON.stringify(result).indexOf("<latex") != -1;

            _logger.debug(result);
            return result;
        }
    };

    return jsonAdapter;
})
;

// qti model
define('model/json/jsonParser', ['model/logger', 'model/utils', 'model/json/jsonConvert'], function (_logger, _utils, _jsonConvert) {

    //json数据解析
    var _json = {
        _logger: _logger,
        _refPathRegex: /\$\{ref-path\}/g,//习题资源包所在路径
        _refBaseRegex: /\$\{ref-base\}/g,//相对于item.json的统计路径
        _imgFilterRegex: /<img([^<>]*?)><\/img>/g,
        _txtEntryHasEndRegex: /<textentryinteraction([^<>]*?)><\/textentryinteraction>/g,
        _txtEntryRegex: /<textentryinteraction([^<>]*?)>/g,
        _convert: null,
        parseJson: function (jsonText, option, url) {
            var that = this;
            var refPath = '';
            var basePath = '';
            if (option && option.refPath) {
                refPath = option.refPath;
            }

            if (option && ( option.basePath || option.refBase)) {
                basePath = option.basePath || option.refBase;
            }

            //替换refPath表达式
            jsonText = jsonText.replace(that._refPathRegex, refPath);
            //替换basePath表达式
            jsonText = url ? jsonText.replace(that._refBaseRegex, _utils.getBasePath(url)) : jsonText.replace(that._refBaseRegex, basePath);


            //图片标签转换
            jsonText = jsonText.replace(that._imgFilterRegex, function ($0, $1) {
                var result = '<img' + $1 + '/>';
                return result;
            });
            //替换填空标签
            jsonText = jsonText.replace(that._txtEntryHasEndRegex, function ($0, $1) {
                return '<textentryinteraction' + $1 + '/>';
            });

            //替换填空标签
            jsonText = jsonText.replace(that._txtEntryRegex, function ($0, $1) {
                if ($1[$1.length - 1] === '/') {
                    return '<textentryinteraction' + $1 + '>';
                } else {
                    return '<textentryinteraction' + $1 + '/>';
                }
            });
            //解析数据
            var itemModel = JSON.parse(jsonText);

            //json数据适配
            var assessmentItemModel = that._convert(itemModel);

            var correctAnswer;
            var model;
            for (var mId in assessmentItemModel.modelMap) {
                model = assessmentItemModel.modelMap[mId];
                if (model.modelType === 'textEntryInteraction' || model.modelType === 'textEntryMultipleInteraction') {
                    //编辑在保存正确的答案的字符串时，会对&<>这个3个符号做2次转义
                    correctAnswer = assessmentItemModel.correctAnswer[mId];
                    if (correctAnswer && correctAnswer.value.length > 0) {
                        for (var index = 0; index < correctAnswer.value.length; index++) {
                            value = correctAnswer.value[index];
                            //针对&<>三个符号进行decode
                            var value = _utils.xmlDecode(value);
                            correctAnswer.value[index] = value;
                        }
                    }
                }
            }
            return assessmentItemModel;
        },
        parse: function (text, option, url) {
            var that = this;
            that._convert = _jsonConvert.convert;
            if (!that._convert) {
                throw '_json:convert未加载';
            }
            //解析数据
            return that.parseJson(text, option, url);
        }
    };

    return _json;

});

/**
 * Created by ylf on 2017/6/13 0013.
 */

define('model/json/multipleTextentry', ['model/utils', 'model/logger'], function (_utils, _logger) {

    var number = /^-?[0-9]+\.?[0-9]*$/;


    var filterMultTextentryInteraction = function (text, correctAnswer) {
        if (!text) return '';
        var i = 0;
        return text.replace(/<textentryinteraction[^>]*?responseidentifier="([^\"]+)"[^>]*?\/>/gm, function (text, identifier, otherMsg) {
            var keyboard = '';
            if (correctAnswer && correctAnswer.value && correctAnswer.value[i] && correctAnswer.value[i] !== 'undefined') {
                if (number.test(correctAnswer.value[i])) {
                    keyboard = "number";
                }
            }
            i++;
            return "<textEntry textentryid=\"" + identifier + "\" keyboard=\"" + keyboard + "\" \/>";
        });
    };

    var convert = {
        parse: function (item, result) {
            var modelId = item.response_identifier;
            result.modelMap[modelId] = {
                modelId: modelId,
                modelType: "textEntryMultipleInteraction",
                questionType: '',
                prompt: filterMultTextentryInteraction(item.prompt, result.correctAnswer[modelId]),
                style: ''
            };
        }
    }

    return convert;

})
/**
 * Created by ylf on 2017/6/13 0013.
 * 返回数据类型
 */

define('model/json/questionType', ['model/utils', 'model/logger'], function (_utils, _logger) {

    var questionTypeToModelType = {
        parse: function (questionType) {
            var types = {
                'choice': 'choiceInteraction',
                'multiplechoice': 'choiceInteraction',
                'vote': 'choiceInteraction_vote',
                "judge": "choiceInteraction",
                "order": "orderInteraction",
                "match": "matchInteraction",
                "extendedtext": "extendedTextInteraction",
                "graphicgapmatch": "graphicGapMatchInteraction",
                "textentry": "textEntryInteraction",
                "textentrymultiple": "textEntryMultipleInteraction",
                "drawing": "drawingInteraction_drawing",
                "handwrite": "drawingInteraction_handwrite",
                "subjectivebase": "extendedTextInteraction",
                "inlinechoice": "inlineChoiceInteraction",
                "cloze": "cloze",
                "optionalChoice": "optionalChoice"
            };
            return types[questionType] || questionType;
        }
    };

    return questionTypeToModelType;

})
/**
 * Created by ylf on 2017/6/13 0013.
 * 答案内容解析
 */

define('model/json/response', [], function () {


    var convert = {
        parse: function (responses) {
            var correctAnswer = {},
                response,
                modelId,
                i

            for (i = 0; i < responses.length; i++) {
                response = responses[i];
                modelId = response.identifier;
                var item = {
                    baseType: response.base_type,
                    cardinality: response.cardinality,
                    identifier: response.identifier,
                    value: response.corrects
                };
                correctAnswer[modelId] = item;
            }
            return correctAnswer;
        }
    }

    return convert;

})
/**
 * Created by ylf on 2017/6/13 0013.
 */

define('model/json/textentry', ['model/utils', 'model/logger'], function (_utils, _logger) {

    var number = /^-?[0-9]+\.?[0-9]*$/;

    var textentryRegex = /<textentryinteraction[^>]*?responseidentifier="([^\"]+)"[^>]*?\/>/gm;


    // 解析填空标签
    var filterTextentryInteraction = function (text) {
        if (!text) return '';
        var ids = [];
        var text = text.replace(textentryRegex, function (text, identifier) {
            ids.push(identifier);
        });
        return ids;
    };

    var convert = {

        /**
         * 解析填空题标签
         * @param item
         * @param result
         */
        parse: function (item, result) {
            var ids = filterTextentryInteraction(item.prompt);
            var correctAnswer = result.correctAnswer;
            for (var j = 0; j < ids.length; j++) {
                var keyboard = "text";
                var modelId = ids[j];
                if (correctAnswer && correctAnswer[modelId] && correctAnswer[modelId].value) {
                    if (number.test(correctAnswer[modelId].value[0])) {
                        keyboard = "number";
                    }
                }
                result.modelMap[modelId] = {
                    modelId: modelId,
                    modelType: "textEntryInteraction",
                    questionType: '',
                    keyboard: keyboard,
                    width: 0,
                    expectedLength: 0,
                    style: ''
                };
            }
        },
        filterTextentry: function (prompt, useTextEntry) {
            if (!prompt) return '';
            return prompt.replace(textentryRegex, function (text, identifier) {
                return useTextEntry ? "<textEntry\/>" : '<span class="_qp-model" data-model-id="' + identifier + '" ></span>';
            });
        }
    }

    return convert;

})
// qti model
define('model/xml/choiceInteraction', ['model/utils'], function (_utils) {

    var choiceInteraction = {
        _choiceInteractionRegex: /<choiceInteraction[^/]*?>[\s\S]*?<\/choiceInteraction>/g,
        _choiceInteractionAttrRegex: /<choiceInteraction([\s\S]*?)>/,
        _responseIdentifierRegex: /responseIdentifier="([\s\S]*?)"/,
        _styleRegex: /style="([\s\S]*?)"/,
        _shuffleRegex: /shuffle="([\s\S]*?)"/,
        _maxChoicesRegex: /maxChoices="(\d+)"/,
        _minChoicesRegex: /minChoices="(\d+)"/,
        _promptRegex: /<prompt>([\s\S]*?)<\/prompt>/,
        _simpleChoiceRegex: /<simpleChoice[\s\S]*?<\/simpleChoice>/g,
        _simpleChoiceValueRegex: /<simpleChoice[\s\S]*?>([\s\S]*?)<\/simpleChoice>/,
        _identifierRegex: /identifier="([\s\S]*?)"/,
        _fixedRegex: /fixed="([\s\S]*?)"/,
        _questionTypeRegex: /questionType="([\s\S]*?)"/,
        _layoutRegex: /layout="([\s\S]*?)"/,
        parse: function (xml, itemModel) {
            var that = this;
            var result = '';
            result = xml.replace(that._choiceInteractionRegex, function (modelXml) {
                var choiceInteractionAttr = _utils.getValue(modelXml, that._choiceInteractionAttrRegex);
                var modelId = _utils.getValue(choiceInteractionAttr, that._responseIdentifierRegex);
                if (modelId) {
                    var modelType = 'choiceInteraction';
                    var questionType = _utils.getValue(choiceInteractionAttr, that._questionTypeRegex);
                    if (questionType === 'vote') {
                        modelType = modelType + '_' + questionType;
                    }
                    var style = _utils.getValue(choiceInteractionAttr, that._styleRegex);
                    var shuffle = _utils.stringToBoolean(_utils.getValue(choiceInteractionAttr, that._shuffleRegex));
                    var maxChoices = _utils.getIntValue(choiceInteractionAttr, that._maxChoicesRegex);
                    var minChoices = _utils.getIntValue(choiceInteractionAttr, that._minChoicesRegex);
                    var layout = _utils.getValue(choiceInteractionAttr, that._layoutRegex);
                    var prompt = _utils.getValue(modelXml, that._promptRegex);
                    var simpleChoiceXmlArr = modelXml.match(that._simpleChoiceRegex);
                    var simpleChoice = [];
                    var simpleChoiceXml;
                    var identifier;
                    var fixed;
                    var content;
                    if (simpleChoiceXmlArr) {
                        for (var index = 0; index < simpleChoiceXmlArr.length; index++) {
                            simpleChoiceXml = simpleChoiceXmlArr[index];
                            identifier = _utils.getValue(simpleChoiceXml, that._identifierRegex);
                            fixed = _utils.stringToBoolean(_utils.getValue(simpleChoiceXml, that._fixedRegex));
                            content = _utils.getValue(simpleChoiceXml, that._simpleChoiceValueRegex);
                            simpleChoice.push({
                                identifier: identifier,
                                fixed: fixed,
                                content: content
                            });
                        }
                    }
                    var model = {
                        modelId: modelId,
                        modelType: modelType,
                        questionType: questionType,
                        style: style,
                        layout: layout,
                        prompt: prompt,
                        shuffle: shuffle,
                        maxChoices: maxChoices,
                        minChoices: minChoices,
                        simpleChoice: simpleChoice
                    };
                    itemModel.modelMap[modelId] = model;
                }
                return '<div class="_qp-model" data-model-id="' + modelId + '" style="' + style + '"></div>';
            });
            return result;
        }
    };

    return choiceInteraction;

});

// qti model
define('model/xml/correctAnswerParser', ['model/utils'], function (_utils) {

    var correctAnswerParser = {
        _correctAnswerRegex: /<responseDeclaration[^/]*?>[\s\S]*?<\/responseDeclaration>/g,
        _identifierRegex: /identifier="([\s\S]*?)"/,
        _cardinalityRegex: /cardinality="([\s\S]*?)"/,
        _baseTypeRegex: /baseType="([\s\S]*?)"/,
        _answerRegex: /<value>[\s\S]*?<\/value>/g,
        _answerValueRegex: /<value>([\s\S]*?)<\/value>/,
        parse: function (xml, itemModel) {
            var modelId;
            var correctAnswerXml;
            var cardinality;
            var baseType;
            var values;
            //解析正确答案
            var correctAnswerXmlArr = xml.match(this._correctAnswerRegex);
            if (correctAnswerXmlArr) {
                for (var index = 0; index < correctAnswerXmlArr.length; index++) {
                    correctAnswerXml = correctAnswerXmlArr[index];
                    modelId = _utils.getValue(correctAnswerXml, this._identifierRegex);
                    if (modelId) {
                        values = _utils.getValues(correctAnswerXml, this._answerRegex, this._answerValueRegex);
                        cardinality = _utils.getValue(correctAnswerXml, this._cardinalityRegex);
                        baseType = _utils.getValue(correctAnswerXml, this._baseTypeRegex);
                        itemModel.correctAnswer[modelId] = {
                            identifier: modelId,
                            cardinality: cardinality,
                            baseType: baseType,
                            value: values
                        };
                    }
                }
            }
        }
    }

    return correctAnswerParser;

});

// qti model
define('model/xml/drawingInteraction', ['model/utils'], function (_utils) {

    var drawingInteraction = {
        _drawingInteractionRegex: /<drawingInteraction[^/]*?>[\s\S]*?<\/drawingInteraction>/g,
        _drawingInteractionAttrRegex: /<drawingInteraction([\s\S]*?)>/,
        _responseIdentifierRegex: /responseIdentifier="([\s\S]*?)"/,
        _styleRegex: /style="([\s\S]*?)"/,
        _questionTypeRegex: /questionType="([\s\S]*?)"/,
        _titleTypeRegex: /titletype="([\s\S]*?)"/,
        _paperTypeRegex: /papertype="([\s\S]*?)"/,
        _titleRegex: /<div class="drawingInteraction_title">([\s\S]*)<\/div>\s*?<div class="drawingInteraction_content">/,
        _contentRegex: /<div class="drawingInteraction_content">([\s\S]*)<\/div>\s*?<div class="drawingInteraction_asset">/,
        _assetRegex: /<div class="drawingInteraction_asset">([\s\S]*)<\/div>\s*?<\/prompt>/,
        _assetValueRegex: /<div class="asset">([\s\S]*?)<\/div>\s*?<div class="asset">/,
        _assetTitleRegex: /<div class="drawingInteraction_asset_title">([\s\S]*)<\/div>\s*?<\/prompt>/,
        _assetTitleValueRegex: /<div class="asset_title">([\s\S]*?)<\/div>\s*?<div class="asset_title">/,
        _emptyAssetRegex: /<div class="asset"\/>/g,
        _emptyAssetTitleRegex: /<div class="asset_title"\/>/g,
        _objectRegex: /(<object[\s\S]*?<\/object>)/,
        _dataRegex: /data="([\s\S]*?)"/,
        _typeRegex: /type="([\s\S]*?)"/,
        _widthRegex: /width="(\d+)"/,
        _heightRegex: /height="(\d+)"/,
        _promptRegex: /<prompt>([\s\S]*?)<\/prompt>/,
        parse: function (xml, itemModel) {
            var that = this;
            var result = '';
            result = xml.replace(that._drawingInteractionRegex, function (modelXml) {
                var drawingInteractionAttr = _utils.getValue(modelXml, that._drawingInteractionAttrRegex);
                var modelId = _utils.getValue(drawingInteractionAttr, that._responseIdentifierRegex);
                if (modelId) {
                    var model;
                    var questionType = _utils.getValue(drawingInteractionAttr, that._questionTypeRegex);
                    if (questionType === '') {
                        questionType = 'drawing';
                    }
                    var modelType = 'drawingInteraction_' + questionType;
                    var style = _utils.getValue(drawingInteractionAttr, that._styleRegex);
                    if (modelType === 'drawingInteraction_handwrite') {
                        //特殊题目
                        var prompt = _utils.getValue(modelXml, that._promptRegex);
                        model = {
                            modelId: modelId,
                            modelType: modelType,
                            questionType: questionType,
                            style: style,
                            prompt: prompt
                        };
                    } else {
                        var titleType = _utils.getValue(drawingInteractionAttr, that._titleTypeRegex);
                        var title = '';
                        if (titleType === '1') {
                            //固定命题
                            title = _utils.getValue(modelXml, that._titleRegex);
                        }
                        var paperType = _utils.getValue(drawingInteractionAttr, that._paperTypeRegex);
                        var content = _utils.getValue(modelXml, that._contentRegex);
                        var asset = [];
                        //获取asset
                        var assetXml = _utils.getValue(modelXml, that._assetRegex);
                        assetXml = assetXml.replace(that._emptyAssetRegex, '<div class="asset"></div>');
                        assetXml += '<div class="asset">';
                        var hasAsset = true;
                        while (hasAsset) {
                            hasAsset = false;
                            assetXml = assetXml.replace(that._assetValueRegex, function ($0, $1) {
                                hasAsset = true;
                                asset.push($1);
                                return '<div class="asset">';
                            });
                        }
                        //获取asset_title
                        var assetTitleXml = _utils.getValue(modelXml, that._assetTitleRegex);
                        assetTitleXml = assetTitleXml.replace(that._emptyAssetTitleRegex, '<div class="asset_title"></div>');
                        assetTitleXml += '<div class="asset_title">';
                        var hasAssetTitle = true;
                        var assetTitle=[];
                        while (hasAssetTitle) {
                            hasAssetTitle = false;
                            assetTitleXml = assetTitleXml.replace(that._assetTitleValueRegex, function ($0, $1) {
                                hasAssetTitle = true;
                                assetTitle.push($1);
                                return '<div class="asset_title">';
                            });
                        }

                        model = {
                            modelId: modelId,
                            modelType: modelType,
                            questionType: questionType,
                            style: style,
                            titleType: titleType,
                            paperType: paperType,
                            title: title,
                            content: content,
                            asset: asset,
                            assetTitle:assetTitle
                        };
                    }
                    var object = {};
                    var objectXml = _utils.getValue(modelXml, that._objectRegex);
                    object.type = _utils.getValue(objectXml, that._typeRegex);
                    object.data = _utils.getValue(objectXml, that._dataRegex);
                    object.width = _utils.getIntValue(objectXml, that._widthRegex);
                    object.height = _utils.getIntValue(objectXml, that._heightRegex);
                    model.object = object;
                    itemModel.modelMap[modelId] = model;
                }
                return '<div class="_qp-model" data-model-id="' + modelId + '" style="' + style + '"></div>';
            });
            return result;
        }
    };

    return drawingInteraction;

});

// qti model
define('model/xml/extendedTextInteraction', ['model/utils'], function (_utils) {

    var extendedTextInteraction = {
        _extendedTextInteractionRegex: /<extendedTextInteraction[^/]*?>[\s\S]*?<\/extendedTextInteraction>/g,
        _extendedTextInteractionAttrRegex: /<extendedTextInteraction([\s\S]*?)>/,
        _styleRegex: /style="([\s\S]*?)"/,
        _responseIdentifierRegex: /responseIdentifier="([\s\S]*?)"/,
        _promptRegex: /<prompt>([\s\S]*?)<\/prompt>/,
        _questionTypeRegex: /questionType="([\s\S]*?)"/,
        _subjectiveBaseAssetRegex: /<div[^<>]*?class="asset"[^<>]*?><\/div>/g,
        _subjectiveBaseAssetPosterRegex: /data-poster="([\s\S]*?)"/,
        _subjectiveBaseAssetSrcRegex: /data-src="([\s\S]*?)"/,
        _subjectiveBaseAssetTypeRegex: /data-type="([\s\S]*?)"/,
        _subjectiveBaseTextRegex: /<div class="subjectivebase_text">([\s\S]*?)<\/div>\s*?<div class="subjectivebase_asset"/,
        _widthRegex: /width="([\s\S]+)"/,
        _heightRegex: /height="([\s\S]+)"/,
        parse: function (xml, itemModel) {
            var that = this;
            var result = '';
            result = xml.replace(that._extendedTextInteractionRegex, function (modelXml) {
                var extendedTextInteractionAttr = _utils.getValue(modelXml, that._extendedTextInteractionAttrRegex);
                var modelId = _utils.getValue(extendedTextInteractionAttr, that._responseIdentifierRegex);
                if (modelId) {
                    var questionType = _utils.getValue(extendedTextInteractionAttr, that._questionTypeRegex);
                    var modelType = 'extendedTextInteraction';
                    var style = _utils.getValue(extendedTextInteractionAttr, that._styleRegex);
                    var prompt = _utils.getValue(modelXml, that._promptRegex);
                    var model;
                    //特殊题型处理
                    if (questionType === 'subjectivebase') {
                        var assets = [];
                        var text = '';

                        var assetsResult = prompt.match(that._subjectiveBaseAssetRegex);
                        if (assetsResult) {
                            for (var i = 0; i < assetsResult.length; i++) {
                                var asset = assetsResult[i];
                                assets.push({
                                    poster: _utils.getValue(asset, that._subjectiveBaseAssetPosterRegex),
                                    src: _utils.getValue(asset, that._subjectiveBaseAssetSrcRegex),
                                    type: _utils.getValue(asset, that._subjectiveBaseAssetTypeRegex),
                                    width: _utils.getIntValue(asset, that._widthRegex),
                                    height: _utils.getIntValue(asset, that._heightRegex)
                                });
                            }
                        }
                        text = _utils.getValue(prompt, that._subjectiveBaseTextRegex);

                        model = {
                            text: text,
                            asset: assets,
                            modelId: modelId,
                            modelType: modelType,
                            questionType: questionType,
                            style: style,
                            rubricBlock: {
                                text: '',
                                asset: [],
                                view: 'scorer'
                            }
                        }
                    } else {
                        model = {
                            modelId: modelId,
                            modelType: modelType,
                            questionType: questionType,
                            style: style,
                            prompt: prompt,
                            rubricBlock: {
                                prompt: '',
                                view: 'scorer'
                            }
                        };
                    }

                    itemModel.modelMap[modelId] = model;
                }
                return '<div class="_qp-model" data-model-id="' + modelId + '" style="' + style + '"></div>';
            });
            return result;
        }
    };

    return extendedTextInteraction;

});

// qti model
define('model/xml/feedbackParser', ['model/utils'], function (_utils) {

    var feedbackParser = {
        _feedbackRegex: /<modalFeedback[^/]*?>[\s\S]*?<\/modalFeedback>/g,
        _showHideRegex: /showHide="([\s\S]*?)"/,
        _sequenceRegex: /sequence="([\s\S]*?)"/,
        _identifierRegex: /identifier="([\s\S]*?)"/,
        _contentRegex: /<modalFeedback[\s\S]*?>([\s\S]*?)<\/modalFeedback>/,
        _subjectiveRegex: /class="subjectivebase_text"/i,
        _subjectiveBaseAssetRegex: /<div[^<>]*?class="asset"[^<>]*?><\/div>/g,
        _subjectiveBaseAssetPosterRegex: /data-poster="([\s\S]*?)"/,
        _subjectiveBaseAssetSrcRegex: /data-src="([\s\S]*?)"/,
        _subjectiveBaseAssetTypeRegex: /data-type="([\s\S]*?)"/,
        _subjectiveBaseTextRegex: /<div class="subjectivebase_text">([\s\S]*?)<\/div>\s*?<div class="subjectivebase_asset"/,
        _widthRegex: /width="([\s\S]+)"/,
        _heightRegex: /height="([\s\S]+)"/,
        parse: function (xml, itemModel) {
            var modelId;
            var feedbackXml;
            var identifier;
            var sequence;
            var content;
            var showHide;
            var feedbackXmlArr = xml.match(this._feedbackRegex);
            if (feedbackXmlArr) {
                for (var index = 0; index < feedbackXmlArr.length; index++) {
                    feedbackXml = feedbackXmlArr[index];
                    sequence = _utils.getValue(feedbackXml, this._sequenceRegex);
                    if (sequence) {
                        modelId = 'RESPONSE_' + sequence + '-1';
                        identifier = _utils.getValue(feedbackXml, this._identifierRegex);
                        showHide = _utils.getValue(feedbackXml, this._showHideRegex);
                        content = _utils.getValue(feedbackXml, this._contentRegex);
                        var feedback = {
                            modelId: modelId,
                            showHide: showHide,
                            identifier: identifier,
                            content: content
                        };
                        //是否是主观题提示内容
                        if (this._subjectiveRegex.test(content)) {
                            var assets = [];
                            var text = '';

                            var assetsResult = content.match(this._subjectiveBaseAssetRegex);
                            if (assetsResult) {
                                for (var i = 0; i < assetsResult.length; i++) {
                                    var asset = assetsResult[i];
                                    assets.push({
                                        poster: _utils.getValue(asset, this._subjectiveBaseAssetPosterRegex),
                                        src: _utils.getValue(asset, this._subjectiveBaseAssetSrcRegex),
                                        type: _utils.getValue(asset, this._subjectiveBaseAssetTypeRegex),
                                        width: _utils.getIntValue(asset, this._widthRegex),
                                        height: _utils.getIntValue(asset, this._heightRegex)
                                    });
                                }
                            }
                            text = _utils.getValue(content, this._subjectiveBaseTextRegex);
                            feedback.contentData = {
                                asset: assets,
                                text: text
                            }
                        }

                        if (identifier === 'showHint') {
                            itemModel.hintFeedback[modelId] = feedback;
                        } else {
                            itemModel.answerFeedback[modelId] = feedback;
                        }
                    }
                }
            }
        }
    };

    return feedbackParser;

});

// qti model
define('model/xml/gapMatchInteraction', ['model/utils'], function (_utils) {

    var gapMatchInteraction = {
        _gapMatchInteractionRegex: /<gapMatchInteraction[^/]*?>[\s\S]*?<\/gapMatchInteraction>/g,
        _gapMatchInteractionAttrRegex: /<gapMatchInteraction([\s\S]*?)>/,
        _responseIdentifierRegex: /responseIdentifier="([\s\S]*?)"/,
        _styleRegex: /style="([\s\S]*?)"/,
        _promptRegex: /<prompt>([\s\S]*?)<\/prompt>/,
        _shuffleRegex: /shuffle="([\s\S]*?)"/,
        _gapTextRegex: /<gapText[\s\S]*?<\/gapText>/g,
        _gapTextValueRegex: /<gapText[\s\S]*?>([\s\S]*?)<\/gapText>/,
        _identifierRegex: /identifier="([\s\S]*?)"/,
        _matchMaxRegex: /matchMax="([\s\S]*?)"/,
        _fixedRegex: /fixed="([\s\S]*?)"/,
        _tableContentRegex: /(<div class="gapMatchInteraction_table_content">[\s\S]*<\/div>)/,
        _questionTypeRegex: /questionType="([\s\S]*?)"/,
        parse: function (xml, itemModel) {
            var that = this;
            var result = '';
            result = xml.replace(that._gapMatchInteractionRegex, function (modelXml) {
                var gapMatchInteractionAttr = _utils.getValue(modelXml, that._gapMatchInteractionAttrRegex);
                var modelId = _utils.getValue(gapMatchInteractionAttr, that._responseIdentifierRegex);
                if (modelId) {
                    var modelType = 'gapMatchInteraction';
                    var questionType = _utils.getValue(gapMatchInteractionAttr, that._questionTypeRegex);
                    var style = _utils.getValue(gapMatchInteractionAttr, that._styleRegex);
                    var shuffle = _utils.stringToBoolean(_utils.getValue(gapMatchInteractionAttr, that._shuffleRegex));
                    var prompt = _utils.getValue(modelXml, that._promptRegex);
                    var gapText = [];
                    var gapTextXmlArr = modelXml.match(that._gapTextRegex);
                    if (gapTextXmlArr) {
                        var gapTextXml;
                        var gapTextObj;
                        for (var index = 0; index < gapTextXmlArr.length; index++) {
                            gapTextXml = gapTextXmlArr[index];
                            gapTextObj = {};
                            gapTextObj.identifier = _utils.getValue(gapTextXml, that._identifierRegex);
                            gapTextObj.matchMax = _utils.getValue(gapTextXml, that._matchMaxRegex);
                            gapTextObj.content = _utils.getValue(gapTextXml, that._gapTextValueRegex);
                            gapText.push(gapTextObj);
                        }
                    }
                    var tableContent = _utils.getValue(modelXml, that._tableContentRegex);
                    var model = {
                        modelId: modelId,
                        modelType: modelType,
                        questionType: questionType,
                        style: style,
                        prompt: prompt,
                        shuffle: shuffle,
                        gapText: gapText,
                        tableMatchContent: tableContent
                    };
                    itemModel.modelMap[modelId] = model;
                }
                return '<div class="_qp-model" data-model-id="' + modelId + '" style="' + style + '"></div>';
            });
            return result;
        }
    };

    return gapMatchInteraction;

});

// qti model
define('model/xml/graphicGapMatchInteraction', ['model/utils'], function (_utils) {

    var graphicGapMatchInteraction = {
        _graphicGapMatchInteractionRegex: /<graphicGapMatchInteraction[^/]*?>[\s\S]*?<\/graphicGapMatchInteraction>/g,
        _graphicGapMatchInteractionAttrRegex: /<graphicGapMatchInteraction([\s\S]*?)>/,
        _responseIdentifierRegex: /responseIdentifier="([\s\S]*?)"/,
        _styleRegex: /style="([\s\S]*?)"/,
        _promptRegex: /<prompt>([\s\S]*?)<\/prompt>/,
        _objectRegex: /(<object[\s\S]*?<\/object>)/,
        _paramRegex: /<param[\s\S]*?><\/param>/g,
        _nameRegex: /name="([\s\S]*?)"/,
        _valueRegex: /value="([\s\S]*?)"/,
        _valueTypeRegex: /valuetype="([\s\S]*?)"/,
        _gapImgRegex: /<gapImg[\s\S]*?<\/gapImg>/g,
        _identifierRegex: /identifier="([\s\S]*?)"/,
        _matchMaxRegex: /matchMax="([\s\S]*?)"/,
        _dataRegex: /data="([\s\S]*?)"/,
        _typeRegex: /type="([\s\S]*?)"/,
        _widthRegex: /width="(\d+)"/,
        _heightRegex: /height="(\d+)"/,
        _associableHotspotRegex: /<associableHotspot[\s\S]*?><\/associableHotspot>/g,
        _shapeRegex: /shape="([\s\S]*?)"/,
        _coordsRegex: /coords="([\s\S]*?)"/,
        _questionTypeRegex: /questionType="([\s\S]*?)"/,
        parse: function (xml, itemModel) {
            var that = this;
            var result = '';
            result = xml.replace(that._graphicGapMatchInteractionRegex, function (modelXml) {
                var graphicGapMatchInteractionAttr = _utils.getValue(modelXml, that._graphicGapMatchInteractionAttrRegex);
                var modelId = _utils.getValue(graphicGapMatchInteractionAttr, that._responseIdentifierRegex);
                if (modelId) {
                    var modelType = 'graphicGapMatchInteraction';
                    var questionType = _utils.getValue(graphicGapMatchInteractionAttr, that._questionTypeRegex);
                    var style = _utils.getValue(graphicGapMatchInteractionAttr, that._styleRegex);
                    var prompt = _utils.getValue(modelXml, that._promptRegex);
                    var object = {};
                    var objectXml = _utils.getValue(modelXml, that._objectRegex);
                    object.data = _utils.getValue(objectXml, that._dataRegex);
                    object.type = _utils.getValue(objectXml, that._typeRegex);
                    object.width = _utils.getIntValue(objectXml, that._widthRegex);
                    object.height = _utils.getIntValue(objectXml, that._heightRegex);
                    object.param = [];
                    var paramXmlArr = objectXml.match(that._paramRegex);
                    if (paramXmlArr) {
                        var paramXml;
                        var param;
                        for (var index = 0; index < paramXmlArr.length; index++) {
                            paramXml = paramXmlArr[index];
                            param = {};
                            param.name = _utils.getValue(paramXml, that._nameRegex);
                            param.value = _utils.getValue(paramXml, that._valueRegex);
                            param.valueType = _utils.getValue(paramXml, that._valueTypeRegex);
                            object.param.push(param);
                        }
                    }
                    var gapImg = [];
                    var gapImgXmlArr = modelXml.match(that._gapImgRegex);
                    if (gapImgXmlArr) {
                        var gapImgXml;
                        var gapImgObj;
                        for (var index = 0; index < gapImgXmlArr.length; index++) {
                            gapImgXml = gapImgXmlArr[index];
                            gapImgObj = {};
                            gapImgObj.identifier = _utils.getValue(gapImgXml, that._identifierRegex);
                            gapImgObj.matchMax = _utils.getValue(gapImgXml, that._matchMaxRegex);
                            gapImgObj.data = _utils.getValue(gapImgXml, that._dataRegex);
                            gapImgObj.type = _utils.getValue(gapImgXml, that._typeRegex);
                            gapImgObj.width = _utils.getIntValue(gapImgXml, that._widthRegex);
                            gapImgObj.height = _utils.getIntValue(gapImgXml, that._heightRegex);
                            gapImg.push(gapImgObj);
                        }
                    }
                    var associableHotspot = [];
                    var associableHotspotXmlArr = modelXml.match(that._associableHotspotRegex);
                    if (associableHotspotXmlArr) {
                        var associableHotspotXml;
                        var associableHotspotObj;
                        for (var index = 0; index < associableHotspotXmlArr.length; index++) {
                            associableHotspotXml = associableHotspotXmlArr[index];
                            associableHotspotObj = {};
                            associableHotspotObj.identifier = _utils.getValue(associableHotspotXml, that._identifierRegex);
                            associableHotspotObj.matchMax = _utils.getValue(associableHotspotXml, that._matchMaxRegex);
                            associableHotspotObj.shape = _utils.getValue(associableHotspotXml, that._shapeRegex);
                            associableHotspotObj.coords = _utils.getValue(associableHotspotXml, that._coordsRegex);
                            associableHotspot.push(associableHotspotObj);
                        }
                    }
                    var model = {
                        modelId: modelId,
                        modelType: modelType,
                        questionType: questionType,
                        style: style,
                        prompt: prompt,
                        object: object,
                        gapImg: gapImg,
                        associableHotspot: associableHotspot
                    };
                    itemModel.modelMap[modelId] = model;
                }
                return '<div class="_qp-model" data-model-id="' + modelId + '" style="' + style + '"></div>';
            });
            return result;
        }
    };

    return graphicGapMatchInteraction;

});

// qti model
define('model/xml/inlineChoiceInteraction', ['model/utils'], function (_utils) {

    var inlineChoiceInteraction = {
        _inlineChoiceInteractionRegex: /<inlineChoiceInteraction[^/]*?>[\s\S]*?<\/inlineChoiceInteraction>/g,
        _inlineChoiceInteractionAttrRegex: /<inlineChoiceInteraction([\s\S]*?)>/,
        _responseIdentifierRegex: /responseIdentifier="([\s\S]*?)"/,
        _styleRegex: /style="([\s\S]*?)"/,
        _shuffleRegex: /shuffle="([\s\S]*?)"/,
        _inlineChoiceRegex: /<inlineChoice [\s\S]*?<\/inlineChoice>/g,
        _inlineChoiceValueRegex: /<inlineChoice [\s\S]*?>([\s\S]*?)<\/inlineChoice>/,
        _identifierRegex: /identifier="([\s\S]*?)"/,
        _questionTypeRegex: /questionType="([\s\S]*?)"/,
        parse: function (xml, itemModel) {
            var that = this;
            var result = '';
            result = xml.replace(that._inlineChoiceInteractionRegex, function (modelXml) {
                var inlineChoiceInteractionAttr = _utils.getValue(modelXml, that._inlineChoiceInteractionAttrRegex);
                var modelId = _utils.getValue(inlineChoiceInteractionAttr, that._responseIdentifierRegex);
                if (modelId) {
                    var modelType = 'inlineChoiceInteraction';
                    var questionType = _utils.getValue(inlineChoiceInteractionAttr, that._questionTypeRegex);
                    var style = _utils.getValue(inlineChoiceInteractionAttr, that._styleRegex);
                    var shuffle = _utils.stringToBoolean(_utils.getValue(inlineChoiceInteractionAttr, that._shuffleRegex));
                    var inlineChoice = [];
                    var inlineChoiceXmlArr = modelXml.match(that._inlineChoiceRegex);
                    if (inlineChoiceXmlArr) {
                        var inlineChoiceXml;
                        var identifier;
                        var content;
                        for (var index = 0; index < inlineChoiceXmlArr.length; index++) {
                            inlineChoiceXml = inlineChoiceXmlArr[index];
                            identifier = _utils.getValue(inlineChoiceXml, that._identifierRegex);
                            content = _utils.getValue(inlineChoiceXml, that._inlineChoiceValueRegex);
                            inlineChoice.push({
                                identifier: identifier,
                                content: content
                            });
                        }
                    }
                    var model = {
                        modelId: modelId,
                        modelType: modelType,
                        questionType: questionType,
                        shuffle: shuffle,
                        style: style,
                        inlineChoice: inlineChoice
                    };
                    itemModel.modelMap[modelId] = model;
                }
                return '<span class="_qp-model" data-model-id="' + modelId + '" style="' + style + '"></span>';
            });
            return result;
        }
    };

    return inlineChoiceInteraction;

});

// qti model
define('model/xml/matchInteraction', ['model/utils'], function (_utils) {

    var matchInteraction = {
        _matchInteractionRegex: /<matchInteraction[^/]*?>[\s\S]*?<\/matchInteraction>/g,
        _matchInteractionAttrRegex: /<matchInteraction([\s\S]*?)>/,
        _responseIdentifierRegex: /responseIdentifier="([\s\S]*?)"/,
        _styleRegex: /style="([\s\S]*?)"/,
        _shuffleRegex: /shuffle="([\s\S]*?)"/,
        _maxAssociationsRegex: /maxAssociations="(\d+)"/,
        _minAssociationsRegex: /minAssociations="(\d+)"/,
        _promptRegex: /<prompt>([\s\S]*?)<\/prompt>/,
        _simpleMatchSetRegex: /<simpleMatchSet[\s\S]*?<\/simpleMatchSet>/g,
        _simpleMatchSetValueRegex: /<simpleMatchSet[\s\S]*?>([\s\S]*?)<\/simpleMatchSet>/,
        _simpleAssociableChoiceRegex: /<simpleAssociableChoice[\s\S]*?<\/simpleAssociableChoice>/g,
        _simpleAssociableChoiceValueRegex: /<simpleAssociableChoice[\s\S]*?>([\s\S]*?)<\/simpleAssociableChoice>/,
        _identifierRegex: /identifier="([\s\S]*?)"/,
        _fixedRegex: /fixed="([\s\S]*?)"/,
        _matchMaxRegex: /matchMax="(\d+)"/,
        _questionTypeRegex: /questionType="([\s\S]*?)"/,
        parse: function (xml, itemModel) {
            var that = this;
            var result = '';
            result = xml.replace(that._matchInteractionRegex, function (modelXml) {
                var matchInteractionAttr = _utils.getValue(modelXml, that._matchInteractionAttrRegex);
                var modelId = _utils.getValue(matchInteractionAttr, that._responseIdentifierRegex);
                if (modelId) {
                    var modelType = 'matchInteraction';
                    var questionType = _utils.getValue(matchInteractionAttr, that._questionTypeRegex);
                    var style = _utils.getValue(matchInteractionAttr, that._styleRegex);
                    var shuffle = _utils.stringToBoolean(_utils.getValue(matchInteractionAttr, that._shuffleRegex));
                    var maxAssociations = _utils.getIntValue(matchInteractionAttr, that._maxAssociationsRegex);
                    var minAssociations = _utils.getIntValue(matchInteractionAttr, that._minAssociationsRegex);
                    var prompt = _utils.getValue(modelXml, that._promptRegex);
                    var simpleMatchSetXmlArr = modelXml.match(that._simpleMatchSetRegex);
                    var simpleMatchSetXml;
                    var simpleMatchSet = [];
                    var simpleAssociableChoiceXmlArr;
                    var simpleAssociableChoiceXml;
                    var simpleAssociableChoice;
                    var identifier;
                    var fixed;
                    var content;
                    var matchMax;
                    if (simpleMatchSetXmlArr) {
                        for (var index = 0; index < simpleMatchSetXmlArr.length; index++) {
                            simpleMatchSetXml = simpleMatchSetXmlArr[index];
                            simpleAssociableChoiceXmlArr = simpleMatchSetXml.match(that._simpleAssociableChoiceRegex);
                            if (simpleAssociableChoiceXmlArr) {
                                simpleAssociableChoice = [];
                                for (var cIndex = 0; cIndex < simpleAssociableChoiceXmlArr.length; cIndex++) {
                                    simpleAssociableChoiceXml = simpleAssociableChoiceXmlArr[cIndex];
                                    identifier = _utils.getValue(simpleAssociableChoiceXml, that._identifierRegex);
                                    fixed = _utils.stringToBoolean(_utils.getValue(simpleAssociableChoiceXml, that._fixedRegex));
                                    matchMax = _utils.getIntValue(simpleAssociableChoiceXml, that._matchMaxRegex);
                                    content = _utils.getValue(simpleAssociableChoiceXml, that._simpleAssociableChoiceValueRegex);
                                    simpleAssociableChoice.push({
                                        identifier: identifier,
                                        fixed: fixed,
                                        matchMax: matchMax,
                                        content: content
                                    });
                                }
                                simpleMatchSet.push(simpleAssociableChoice);
                            }
                        }
                    }
                    var model = {
                        modelId: modelId,
                        modelType: modelType,
                        questionType: questionType,
                        style: style,
                        prompt: prompt,
                        shuffle: shuffle,
                        maxAssociations: maxAssociations,
                        minAssociations: minAssociations,
                        simpleMatchSet: simpleMatchSet
                    };
                    itemModel.modelMap[modelId] = model;
                }
                return '<div class="_qp-model" data-model-id="' + modelId + '" style="' + style + '"></div>';
            });
            return result;
        }
    };

    return matchInteraction;

});

// qti model
define('model/xml/orderInteraction', ['model/utils'], function (_utils) {

    var orderInteraction = {
        _orderInteractionRegex: /<orderInteraction[^/]*?>[\s\S]*?<\/orderInteraction>/g,
        _orderInteractionAttrRegex: /<orderInteraction([\s\S]*?)>/,
        _responseIdentifierRegex: /responseIdentifier="([\s\S]*?)"/,
        _styleRegex: /style="([\s\S]*?)"/,
        _shuffleRegex: /shuffle="([\s\S]*?)"/,
        _maxChoicesRegex: /maxChoices="(\d+)"/,
        _minChoicesRegex: /minChoices="(\d+)"/,
        _promptRegex: /<prompt>([\s\S]*?)<\/prompt>/,
        _simpleChoiceRegex: /<simpleChoice[\s\S]*?<\/simpleChoice>/g,
        _simpleChoiceValueRegex: /<simpleChoice[\s\S]*?>([\s\S]*?)<\/simpleChoice>/,
        _identifierRegex: /identifier="([\s\S]*?)"/,
        _fixedRegex: /fixed="([\s\S]*?)"/,
        _questionTypeRegex: /questionType="([\s\S]*?)"/,
        parse: function (xml, itemModel) {
            var that = this;
            var result = '';
            result = xml.replace(that._orderInteractionRegex, function (modelXml) {
                var orderInteractionAttr = _utils.getValue(modelXml, that._orderInteractionAttrRegex);
                var modelId = _utils.getValue(orderInteractionAttr, that._responseIdentifierRegex);
                if (modelId) {
                    var modelType = 'orderInteraction';
                    var questionType = _utils.getValue(orderInteractionAttr, that._questionTypeRegex);
                    var shuffle = _utils.stringToBoolean(_utils.getValue(orderInteractionAttr, that._shuffleRegex));
                    var style = _utils.getValue(orderInteractionAttr, that._styleRegex);
                    var maxChoices = _utils.getIntValue(orderInteractionAttr, that._maxChoicesRegex);
                    var minChoices = _utils.getIntValue(orderInteractionAttr, that._minChoicesRegex);
                    var prompt = _utils.getValue(modelXml, that._promptRegex);
                    var simpleChoiceXmlArr = modelXml.match(that._simpleChoiceRegex);
                    var simpleChoice = [];
                    var simpleChoiceXml;
                    var identifier;
                    var fixed;
                    var content;
                    if (simpleChoiceXmlArr) {
                        for (var index = 0; index < simpleChoiceXmlArr.length; index++) {
                            simpleChoiceXml = simpleChoiceXmlArr[index];
                            identifier = _utils.getValue(simpleChoiceXml, that._identifierRegex);
                            fixed = _utils.stringToBoolean(_utils.getValue(simpleChoiceXml, that._fixedRegex));
                            content = _utils.getValue(simpleChoiceXml, that._simpleChoiceValueRegex);
                            simpleChoice.push({
                                identifier: identifier,
                                fixed: fixed,
                                content: content
                            });
                        }
                    }
                    var model = {
                        modelId: modelId,
                        modelType: modelType,
                        questionType: questionType,
                        style: style,
                        prompt: prompt,
                        shuffle: shuffle,
                        maxChoices: maxChoices,
                        minChoices: minChoices,
                        simpleChoice: simpleChoice
                    };
                    itemModel.modelMap[modelId] = model;
                }
                return '<div class="_qp-model" data-model-id="' + modelId + '" style="' + style + '"></div>';
            });
            return result;
        }
    };

    return orderInteraction;

});

// qti model
define('model/xml/rubricBlock', ['model/utils'], function (_utils) {

    var rubricBlock = {
        _rubricBlockRegex: /<rubricBlock[^/]*?>[\s\S]*?<\/rubricBlock>/g,
        _idRegex: /id="([\s\S]*?)"/,
        _viewRegex: /view="([\s\S]*?)"/,
        _promptRegex: /<rubricBlock[\s\S]*?>([\s\S]*?)<\/rubricBlock>/,
        _subjectiveBaseAssetRegex: /<div[^<>]*?class="asset"[^<>]*?><\/div>/g,
        _subjectiveBaseAssetPosterRegex: /data-poster="([\s\S]*?)"/,
        _subjectiveBaseAssetSrcRegex: /data-src="([\s\S]*?)"/,
        _subjectiveBaseAssetTypeRegex: /data-type="([\s\S]*?)"/,
        _responseTextRegex: /<div class="response_text">([\s\S]*?)<\/div>\s*?<div class="subjectivebase_asset"/,
        _widthRegex: /width="([\s\S]+)"/,
        _heightRegex: /height="([\s\S]+)"/,
        parse: function (xml, itemModel) {
            //该模型为对应的问答题的参考答案
            var that = this;
            var result = '';
            result = xml.replace(that._rubricBlockRegex, function (modelXml) {
                var id = _utils.getValue(modelXml, that._idRegex);
                if (id) {
                    var prompt = _utils.getValue(modelXml, that._promptRegex);
                    var view = _utils.getValue(modelXml, that._viewRegex);
                    var rubricBlock;

                    var subjectiveBase = that._responseTextRegex.test(prompt);
                    if (subjectiveBase) {
                        var assets = [];
                        var text = '';

                        var assetsResult = prompt.match(that._subjectiveBaseAssetRegex);
                        if (assetsResult) {
                            for (var i = 0; i < assetsResult.length; i++) {
                                var asset = assetsResult[i];
                                assets.push({
                                    poster: _utils.getValue(asset, that._subjectiveBaseAssetPosterRegex),
                                    src: _utils.getValue(asset, that._subjectiveBaseAssetSrcRegex),
                                    type: _utils.getValue(asset, that._subjectiveBaseAssetTypeRegex),
                                    width: _utils.getIntValue(asset, that._widthRegex),
                                    height: _utils.getIntValue(asset, that._heightRegex)
                                });
                            }
                        }
                        text = _utils.getValue(prompt, that._responseTextRegex);

                        rubricBlock = {
                            view: view,
                            text: text,
                            asset: assets
                        }
                    } else {
                        rubricBlock = {
                            prompt: prompt,
                            view: view
                        };
                    }

                    itemModel.rubricBlockMap[id] = rubricBlock;
                }
                return '';
            });
            return result;
        }
    };

    return rubricBlock;

});

// qti model
define('model/xml/textEntryInteraction', ['model/utils'], function (_utils) {

    var textEntryInteraction = {
        _textEntryInteractionRegex: /<textEntryInteraction[\s\S]*?\/>/g,
        _responseIdentifierRegex: /responseIdentifier="([\s\S]*?)"/,
        _expectedLengthRegex: /expectedLength="(\d+)"/,
        _keyboardRegex: /keyboard="([\s\S]*?)"/,
        _styleRegex: /style="([\s\S]*?)"/,
        _questionTypeRegex: /questionType="([\s\S]*?)"/,
        _widthRegex: /width="(\d+)"/,
        parse: function (xml, itemModel) {
            var that = this;
            var result = '';
            result = xml.replace(that._textEntryInteractionRegex, function (modelXml) {
                var modelId = _utils.getValue(modelXml, that._responseIdentifierRegex);
                if (modelId) {
                    var modelType = 'textEntryInteraction';
                    var questionType = _utils.getValue(modelXml, that._questionTypeRegex);
                    var expectedLength = _utils.getIntValue(modelXml, that._expectedLengthRegex);
                    var style = _utils.getValue(modelXml, that._styleRegex);
                    var keyboard = _utils.getValue(modelXml, that._keyboardRegex);
                    var width = _utils.getIntValue(modelXml, that._widthRegex);
                    if (!keyboard) {
                        keyboard = 'text';
                    }
                    var model = {
                        modelId: modelId,
                        modelType: modelType,
                        questionType: questionType,
                        style: style,
                        expectedLength: expectedLength,
                        keyboard: keyboard,
                        width: width
                    };
                    itemModel.modelMap[modelId] = model;
                }
                return '<span class="_qp-model" data-model-id="' + modelId + '" style="' + style + '"></span>';
            });
            return result;
        }
    };

    return textEntryInteraction;

});

// qti model
define('model/xml/textEntryMultipleInteraction', ['model/utils'], function (_utils) {

    var textEntryMultipleInteraction = {
        _textEntryMultipleInteractionRegex: /<textEntryMultipleInteraction[^/]*?>[\s\S]*?<\/textEntryMultipleInteraction>/g,
        _textEntryMultipleInteractionAttrRegex: /<textEntryMultipleInteraction([\s\S]*?)>/,
        _responseIdentifierRegex: /responseIdentifier="([\s\S]*?)"/,
        _styleRegex: /style="([\s\S]*?)"/,
        _promptRegex: /<prompt>([\s\S]*?)<\/prompt>/,
        _questionTypeRegex: /questionType="([\s\S]*?)"/,
        parse: function (xml, itemModel) {
            var that = this;
            var result = '';
            result = xml.replace(that._textEntryMultipleInteractionRegex, function (modelXml) {
                var textEntryMultipleInteractionAttr = _utils.getValue(modelXml, that._textEntryMultipleInteractionAttrRegex);
                var modelId = _utils.getValue(textEntryMultipleInteractionAttr, that._responseIdentifierRegex);
                if (modelId) {
                    var modelType = 'textEntryMultipleInteraction';
                    var questionType = _utils.getValue(textEntryMultipleInteractionAttr, that._questionTypeRegex);
                    var prompt = _utils.getValue(modelXml, that._promptRegex);
                    var style = _utils.getValue(textEntryMultipleInteractionAttr, that._styleRegex);
                    var model = {
                        modelId: modelId,
                        modelType: modelType,
                        questionType: questionType,
                        prompt: prompt,
                        style: style
                    };
                    itemModel.modelMap[modelId] = model;
                }
                return '<div class="_qp-model" data-model-id="' + modelId + '" style="' + style + '"></div>';
            });
            return result;
        }
    };

    return textEntryMultipleInteraction;

});

// qti model
define('model/xml/xmlParser', ['model/logger', 'model/utils', 'model/event'], function (logger, utils, _event) {

    var _utils = utils;
    var choiceInteraction = require('model/xml/choiceInteraction');
    var correctAnswerParser = require('model/xml/correctAnswerParser');
    var drawingInteraction = require('model/xml/drawingInteraction');
    var extendedTextInteraction = require('model/xml/extendedTextInteraction');
    var feedbackParser = require('model/xml/feedbackParser');
    var gapMatchInteraction = require('model/xml/gapMatchInteraction');
    var graphicGapMatchInteraction = require('model/xml/graphicGapMatchInteraction');
    var inlineChoiceInteraction = require('model/xml/inlineChoiceInteraction');
    var matchInteraction = require('model/xml/matchInteraction');
    var orderInteraction = require('model/xml/orderInteraction');
    var rubricBlock = require('model/xml/rubricBlock');
    var textEntryInteraction = require('model/xml/textEntryInteraction');
    var textEntryMultipleInteraction = require('model/xml/textEntryMultipleInteraction');
    var ConvertComposite = require('model/convertComposite');

    var _xml = {
        _event: _event,
        _logger: logger,
        _refPathRegex: /\$\{ref-path\}/g,
        _refBaseRegex: /\$\{ref-base\}/g,
        _mathLeftDecodeRegex: /&lt;latex( class="math-tex")?&gt;/g,
        _mathRightDecodeRegex: /&lt;\/latex&gt;/g,
        _mathRegex: /<latex( class="math-tex")?>[\s\S]*?<\/latex>/g,
        _imgFilterRegex: /<img([^<>]*?)><\/img>/g,
        _textEntryInteractionFilterRegex: /<textEntryInteraction([^<>]*?)><\/textEntryInteraction>/g,
        _modelFeedbackFilterRegex: /<modalFeedback([^<>]*?)\/>/g,
        _textEntryFilterRegex: /<textEntry([^<>]*?)><\/textEntry>/g,
        _paramFilterRegex: /<param([^<>]*?)\/>/g,
        _associableHotspotFilterRegex: /<associableHotspot([^<>]*?)\/>/g,
        _objectFilterRegex: /<object([^<>]*?)\/>/g,
        correctAnswerParser: correctAnswerParser,
        feedbackParser: feedbackParser,
        modelParser: {
            _itemBodyRegex: /<itemBody[\s\S]*?>([\s\S]*?)<\/itemBody>/,
            _parserMap: {
                textEntryInteraction: textEntryInteraction,
                inlineChoiceInteraction: inlineChoiceInteraction,
                textEntryMultipleInteraction: textEntryMultipleInteraction,
                choiceInteraction: choiceInteraction,
                orderInteraction: orderInteraction,
                matchInteraction: matchInteraction,
                graphicGapMatchInteraction: graphicGapMatchInteraction,
                gapMatchInteraction: gapMatchInteraction,
                extendedTextInteraction: extendedTextInteraction,
                rubricBlock: rubricBlock,
                drawingInteraction: drawingInteraction
            },
            parse: function (xml, itemModel) {
                var result = _utils.getValue(xml, this._itemBodyRegex);
                var parser;
                itemModel.rubricBlockMap = {};
                //解析所有模型
                for (var modelId in this._parserMap) {
                    parser = this._parserMap[modelId];
                    result = parser.parse(result, itemModel);
                }
                //将问答题的参考答案模型合并到问答题的模型
                var model;
                var rubricBlock;
                for (var modelId in itemModel.rubricBlockMap) {
                    model = itemModel.modelMap[modelId];
                    if (model) {
                        rubricBlock = itemModel.rubricBlockMap[modelId];
                        model.rubricBlock = rubricBlock;
                    }
                }
                delete itemModel.rubricBlockMap;
                return result;
            }
        }
    };

    _xml.parseXml = function (xmlText, option, url) {
        var that = this;
        var refPath = '';
        if (option && option.refPath) {
            refPath = option.refPath;
        }
        //替换refPath表达式
        xmlText = xmlText.replace(that._refPathRegex, refPath);
        xmlText = xmlText.replace(that._refBaseRegex, _utils.getBasePath(url));
        //图片标签转换
        xmlText = xmlText.replace(that._imgFilterRegex, function ($0, $1) {
            var result = '<img' + $1 + '/>';
            return result;
        });
        //填空题特殊标签转换
        xmlText = xmlText.replace(that._textEntryInteractionFilterRegex, function ($0, $1) {
            var result = '<textEntryInteraction' + $1 + '/>';
            return result;
        });
        xmlText = xmlText.replace(that._textEntryFilterRegex, function ($0, $1) {
            var result = '<textEntry' + $1 + '/>';
            return result;
        });
        //拼图题和手写作文题特殊标签转换
        xmlText = xmlText.replace(that._associableHotspotFilterRegex, function ($0, $1) {
            var result = '<associableHotspot' + $1 + '></associableHotspot>';
            return result;
        });
        xmlText = xmlText.replace(that._paramFilterRegex, function ($0, $1) {
            var result = '<param' + $1 + '></param>';
            return result;
        });
        xmlText = xmlText.replace(that._objectFilterRegex, function ($0, $1) {
            var result = '<object' + $1 + '></object>';
            return result;
        });
        //反馈空标签转换
        xmlText = xmlText.replace(that._modelFeedbackFilterRegex, function ($0, $1) {
            var result = '<modalFeedback' + $1 + '></modalFeedback>';
            return result;
        });
        //数学表达式标签解码
        xmlText = xmlText.replace(that._mathLeftDecodeRegex, '<latex class="math-tex">');
        xmlText = xmlText.replace(that._mathRightDecodeRegex, '</latex>');
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
            modelMap: {},
            composite: {
                isComposite: false,//是否复合题·
                isOptional: false,//是否选做题
                mustChoices: 0//选做最低题数
            }
        };
        var filterXml = xmlText;
        //解析正确答案
        that.correctAnswerParser.parse(filterXml, assessmentItemModel);
        //解析Feedback
        that.feedbackParser.parse(filterXml, assessmentItemModel);
        //解析itemBody
        var prompt = that.modelParser.parse(filterXml, assessmentItemModel);
        //保存html模板
        prompt = ConvertComposite.parseXmlComposite(assessmentItemModel, prompt);
        assessmentItemModel.prompt = prompt;
        //针对填空题的正确答案数据中的&<>3个符号decode编码处理
        var model;
        var correctAnswer;
        var value;
        var decodeAndRegex = /&amp;/g;
        for (var mId in assessmentItemModel.modelMap) {
            model = assessmentItemModel.modelMap[mId];
            if (model.modelType === 'textEntryInteraction' || model.modelType === 'textEntryMultipleInteraction') {
                //编辑在保存正确的答案的字符串时，会对&<>这个3个符号做2次转义
                correctAnswer = assessmentItemModel.correctAnswer[mId];
                if (correctAnswer && correctAnswer.value.length > 0) {
                    for (var index = 0; index < correctAnswer.value.length; index++) {
                        value = correctAnswer.value[index];
                        //第一次针对&符号进行decode
                        value = value.replace(decodeAndRegex, '&');
                        //第二次针对&<>三个符号进行decode
                        value = _utils.xmlDecode(value);
                        correctAnswer.value[index] = value;
                    }
                }
            }
        }

        return assessmentItemModel;
    };

    _xml.parse = function (text, option, url) {
        var that = this;
        return that.parseXml(text, option, url);
    };

    return _xml;

});

define('player/assessment/assessmentItem', ['model/logger', 'player/utils/imageLoader', 'player/utils/extendUtils'], function (_logger, _imageLoader, _utils) {

    var ModelItem = require('player/model/modelItem');
    var QtiState = require('player/assessment/assessmentItem/qtiState');
    var Parser = require('player/assessment/assessmentItem/Parser');
    var AnswerAreaExtra = require('player/assessment/assessmentItem/AnswerAreaExtra');
    var State = require('player/assessment/assessmentItem/state');

    var Statistics = require('player/assessment/assessmentItem/statistics');
    var ELearningSupportType = require('player/assessment/assessmentItem/elearning/supportType');
    var ELearningScore = require('player/assessment/assessmentItem/elearning/score');

    var API = {
        Parser: ['render', 'setTitleExtras'],//界面渲染,设置title附加内容
        QtiState: ['getState', 'setState'],//Qti标准的答案模型设置和获取
        State: ['getScore', 'getAnswer|clone', 'setAnswer', 'getAnswerState', 'setAnswerState', 'checkTextAnswerValue'],//json模型管理
        Statistics: ['setStat'],//统计信息管理
        AnswerAreaExtra: ['setExtrasAnswer', 'showDefaultExtras', 'appendToExtras', 'cleanExtras'],//题目下发扩展内容管理
        ELearningScore: ['setFullScore', 'getFullScore', 'setUserScore', 'getUserScore']//eLearning 分数相关逻辑支持
    }

    var makeFunction = function (assessmentItem, module, apis) {
        apis.forEach(function (api) {
            var apiArgs = api.split('|');
            var apiName = apiArgs[0];
            var clone = apiArgs[1] || false;

            if (assessmentItem[apiName]) {
                throw new Error('assessmentItem already has the same method : ' + api);
            }
            assessmentItem[apiName] = function () {
                var args = Array.prototype.slice.apply(arguments, [0]);
                var result = module[apiName].apply(module, args);
                if (result && clone) {
                    result = $.extend(true, {}, result);
                }
                return result;
            }
        });
    }

    //定义AssessmentItem,负责题目的展示和数据存储
    var AssessmentItem = {
        _sequenceNumber: null,// 题目的序号
        _event: null,
        _media: null,
        _itemModel: null,
        _modelItem: null,
        _logger: _logger,
        _imageLoader: _imageLoader,
        create: function (assessmentItemModel, event, media) {
            var instance = $.extend({}, this);
            instance._event = event;
            instance._modelItem = {};
            instance._itemModel = assessmentItemModel;
            instance._media = media;
            var model;
            for (var modelId in instance._itemModel.modelMap) {
                model = instance._itemModel.modelMap[modelId];
                //实例化modelItem
                var modelItem = ModelItem.create(instance, model, event);
                //保存到assessmentItem
                instance._modelItem[modelItem._model.modelId] = modelItem;
            }

            this._logger.debug("_assessmentTest:解析xml后得到的assessmentItem对象", instance);

            //引入相关模块
            instance.parser = Parser.create(instance);
            instance.state = State.create(instance);
            instance.qtiState = QtiState.create(instance);
            instance.answerAreaExtra = AnswerAreaExtra.create(instance);
            instance.eLearningScore = ELearningScore.create(instance);
            instance.statistics = Statistics.create(instance);

            //扩展模块API
            makeFunction(instance, instance.parser, API.Parser);
            makeFunction(instance, instance.state, API.State);
            makeFunction(instance, instance.qtiState, API.QtiState);
            makeFunction(instance, instance.answerAreaExtra, API.AnswerAreaExtra);
            makeFunction(instance, instance.eLearningScore, API.ELearningScore);
            makeFunction(instance, instance.statistics, API.Statistics);

            return instance;
        },
        getMedia: function () {
            return this._media;
        },
        getEffectiveIds: function () {
            return this.state.getEffectiveIds();
        },
        triggerEvent: function (group, type, para) {
            this._event.trigger(group, type, para)
        },
        getTipDialog: function () {
            return this.parser.tipDialog;
        },
        //获取模型
        getItemModel: function (clone) {
            if (clone !== false) {
                return $.extend(true, {}, this._itemModel);
            } else {
                return this._itemModel;
            }
        },
        getModelItem: function () {
            return this._modelItem;
        },
        setOption: function (option) {
            this._option = option;
        },
        getOption: function () {
            return this._option;
        },
        isComposite: function () {
            return this._itemModel.composite.isComposite;
        },
        //render方法
        modelEach: function ($view, callback) {
            var that = this;
            var $qpModel = $view.find('._qti-player-body ._qp-model');
            $qpModel.each(function () {
                var $this = $(this);
                var modelId = $this.data('model-id');
                var modelItem = that._modelItem[modelId];
                callback.apply(that, [$this, modelItem, modelId]);
            });
        },
        //锁定
        setLock: function ($view, lockArea) {
            this.modelEach($view, function ($modelView, modelItem) {
                if (modelItem.setLock) {
                    modelItem.setLock($modelView, lockArea);
                }
            });
            this._event.trigger('render', 'renderChanged', this._option);
        },
        showAnswer: function ($view) {
            this.modelEach($view, function ($modelView, modelItem) {
                if (modelItem.showAnswer) {
                    modelItem.showAnswer($modelView);
                }
            });
            this._event.trigger('render', 'renderChanged', this._option);
        },
        showCheckedAnswer: function ($view) {
            this.modelEach($view, function ($modelView, modelItem) {
                if (modelItem.showCheckedAnswer) {
                    modelItem.showCheckedAnswer($modelView);
                }
            });
            this._event.trigger('render', 'renderChanged', this._option);
        },
        showCorrectAnswer: function ($view) {
            this.modelEach($view, function ($modelView, modelItem) {
                if (modelItem.showCorrectAnswer) {
                    modelItem.showCorrectAnswer($modelView);
                }
            });
            this._event.trigger('render', 'renderChanged', this._option);
        },
        showStatisAnswer: function ($view) {
            this.modelEach($view, function ($modelView, modelItem) {
                if (modelItem.showStatisAnswer) {
                    modelItem.showStatisAnswer($modelView);
                }
            });
            this._event.trigger('render', 'renderChanged', this._option);
        },
        showEffectiveQuestion: function ($view) {
            var ids = this.getEffectiveIds();
            if (ids && ids.length > 0) {
                this.modelEach($view, function ($modelView, modelItem, modelId) {
                    if (ids.indexOf(modelId) < 0) {
                        $modelView.hide();
                    }
                });
                this._event.trigger('render', 'renderChanged', this._option);
            }
        },
        reset: function ($view) {
            this.modelEach($view, function ($modelView, modelItem) {
                if (modelItem.reset) {
                    modelItem.reset($modelView);
                }
            });
            this._event.trigger('render', 'renderChanged', this._option);
        },
        setAnswerAreaVisible: function ($view, visible) {
            this.modelEach($view, function ($modelView, modelItem) {
                if (modelItem.setAnswerAreaVisible) {
                    modelItem.setAnswerAreaVisible($modelView, visible);
                }
            });
            this._event.trigger('render', 'renderChanged', this._option);
        },
        // 设置题目的序号
        setSequenceNumber: function (num) {
            this._sequenceNumber = num;
        },
        getSequenceNumber: function () {
            return this._sequenceNumber;
        },
        getSupportType: function () {
            //TODO:这个接口要扩展
            //深度拷贝
            var outPut = [];
            for (var i = 0; i < ELearningSupportType.length; i++) {
                outPut.push(ELearningSupportType[i])
            }
            return outPut;
        },
        //显示用户答案
        showUsrAndCorrectAnswer: function ($view) {
            this.modelEach($view, function ($modelView, modelItem) {
                var questionType = modelItem._model.questionType;
                var isSupportThisInterface = (questionType === "choice" || questionType === "multiplechoice");
                if (isSupportThisInterface) {
                    // 该接口只是多项选择 与 单项选择支持
                    if (modelItem.showUsrAndCorrectAnswer) {
                        modelItem.showUsrAndCorrectAnswer($modelView);
                    }
                } else {
                    _logger.warn("只有单项选择和多项选择才支持showUsrAndCorrectAnswer接口");
                }
            });
            this._event.trigger('render', 'renderChanged', this._option);
        },
        //在指定区域添加自定义内容
        //destroy方法
        destroy: function () {
            var modelItem;
            for (var modelId in this._modelItem) {
                modelItem = this._modelItem[modelId];
                if (modelItem.destroy && $.type(modelItem.destroy) === 'function') {
                    modelItem.destroy();
                }
            }
            this._media.destroy();
        }
    };

    return AssessmentItem;
});

define('player/assessment/assessmentTest', ['model/logger', 'player/utils/extendUtils'], function (_logger, _utils) {

    var AssessmentItem = require('player/assessment/assessmentItem');

    //创建AssessmentTest
    //暂时,AssessmentTest中只有一个AssessmentItem
    var AssessmentTest = {
        _assessmentItem: null,
        _sequenceNumber: null,// 由于现在player和题目的对应关系是1对1的（复合题也算一道题目），该player对应的题目的序号
        _option: null,
        _event: null,
        _media: null,
        _logger: _logger,
        create: function (option, event, media) {
            var instance = $.extend({}, this);
            instance._event = event;
            instance._option = option;
            instance._media = media;
            instance._sequenceNumber = option.sequenceNumber || null;
            return instance;
        },
        //递归解析$itemBody对象
        loadAssessmentItem: function (assessmentItemModel) {
            this._assessmentItem = AssessmentItem.create(assessmentItemModel, this._event, this._media);
            if (this._sequenceNumber) {
                this._assessmentItem.setSequenceNumber(this._sequenceNumber)
            }
        },
        getAssessmentItem: function () {
            return this._assessmentItem;
        },
        render: function ($view, option, callback) {
            this._sequenceNumber = option.sequenceNumber || null;
            if (this._sequenceNumber) {
                this._assessmentItem.setSequenceNumber(this._sequenceNumber)
            }
            if (this._assessmentItem) {
                this._assessmentItem.render($view, option, callback);

            } else {
                this._logger.warn('_assessmentTest:render失败,请先加载数据');
            }
        }
    };
    return AssessmentTest;
});

define('player/config/extrasOption', function () {

    var ExtrasOption = {
        showHint: true,
        showUserAnswer: true,
        showCorrectAnswer: true,
        showAnalyse: true
    };


    return ExtrasOption;
});

define('player/config/lang', function () {

    var zh = {
        "mathjax_loading": "正在努力解析中...",
        "confirm": "确定",
        "prompt": "提示",
        "drawing_source_material": "素材",
        "drawing_stem": "题干",
        "drawing_view_material": "查看素材",
        "drawing_view_topics": "查看题目",
        "drawing_continue_write": "继续书写",
        "gapmath_title": "将以下选项进行归类",
        "inline_choice_choose": "请选择",
        "vote_sigleitem": "单项投票",
        "vote_mutipleitem": "不定项投票",
        "vote_tip": "总共有${x}个投票项，投票时请注意查看，避免遗漏。",
        "choice_screenshot_title": "请选择正确的答案",
        "text_title": "请完成下面的填空",
        "extras_user_answer": "您的答案",
        "extras_correct_answer": "正确答案",
        "analyse": "解析",
        "single_choise": "单选题",
        "multiple_choise": "多选题",
        "blank_filling": "填空题",
        "connection": "连线题",
        "sort": "排序题",
        "question": "问答题",
        "voting": "投票题",
        "true_or_false": "判断题",
        "puzzle": "拼图题",
        "complex": "复合题",
        "error": "程序异常，当前习题无法播放",
        "cloze": "完型填空",
        "cloze_index": "第${n}题",
        "optional_choices": "选做题",
        "optional_choices_count": "${total}选${choose}",
        "optional_choices_tip": "选择作答本题",
        "no_title_tip": "无题目信息",
        "not_support_tip": "当前QtiPlayer不支持该题型",
        //TODO:以下未翻译
        "reference_answer": "参考答案",
        "optional_utmost_tip": "本选做题为${total}选${must}，请不要选择超过${must}个题目",
        "cancel": "取消",
        "got_it": "我知道了",
        "media_preview": "预览",
        "media_max": "最大化",
        "media_min": "向下还原",
        "media_close": "关闭"
    };

    var hk = {
        "mathjax_loading": "正在努力解析中...",
        "confirm": "確定",
        "prompt": "提示",
        "drawing_source_material": "素材",
        "drawing_stem": "題幹",
        "drawing_view_material": "查看素材",
        "drawing_view_topics": "查看題目",
        "drawing_continue_write": "繼續書寫",
        "gapmath_title": "將以下選項進行歸類",
        "inline_choice_choose": "請選擇",
        "vote_sigleitem": "單項投票",
        "vote_mutipleitem": "不定項投票",
        "vote_tip": "總共有${x}個投票項，投票時請注意查看，避免遺漏。",
        "choice_screenshot_title": "請選擇正確的答案",
        "text_title": "請完成下麵的填空",
        "extras_user_answer": "您的答案",
        "extras_correct_answer": "正確答案",
        "analyse": "解析",
        "single_choise": "單選題",
        "multiple_choise": "多選題",
        "blank_filling": "填空題",
        "connection": "連線題",
        "sort": "排序題",
        "question": "問答題",
        "voting": "投票題",
        "true_or_false": "判斷題",
        "puzzle": "拚圖題",
        "complex": "複合題",
        "error": "程序異常，當前習題無法播放",
        "cloze": "完型填空",
        "cloze_index": "第${n}題",
        "optional_choices": "選做題",
        "optional_choices_count": "${total}選${choose}",
        "optional_choices_tip": "選擇作答本題",
        "no_title_tip": "無題目信息",
        "not_support_tip": "當前QtiPlayer不支持該題型"
    };


    var ja = {
        "mathjax_loading": "解析中...",
        "confirm": "OK",
        "prompt": "ヒント",
        "drawing_source_material": "素材",
        "drawing_stem": "問題テキスト",
        "drawing_view_material": "素材をみる",
        "drawing_view_topics": "問題をみる",
        "drawing_continue_write": "書き続ける",
        "gapmath_title": "以下の選択肢を分類してください",
        "inline_choice_choose": "ご選択を",
        "vote_sigleitem": "単一選択肢投票",
        "vote_mutipleitem": "複数選択肢投票",
        "vote_tip": "合計${x}投票選択肢，投票の時に、見逃さないようにしてください。",
        "choice_screenshot_title": "正しい回答を選択してください",
        "text_title": "以下の穴埋めを完成してください",
        "extras_user_answer": "ご解答",
        "extras_correct_answer": "正解",
        "analyse": "解析",
        "single_choise": "単一選択問題",
        "multiple_choise": "複数選択問題",
        "blank_filling": "穴埋め問題",
        "connection": "リンク問題",
        "sort": "並べ替え問題",
        "question": "記述問題",
        "voting": "投票問題",
        "true_or_false": "正誤問題",
        "puzzle": "ジグソーパズル問題",
        "complex": "複合問題",
        "error": "程序异常，当前习题无法播放"//TODO:翻译
    };


    var en = {
        "mathjax_loading": "Loading...",
        "confirm": "Confirm",
        "prompt": "Hint",
        "drawing_source_material": "References",
        "drawing_stem": "Question",
        "drawing_view_material": "View References",
        "drawing_view_topics": "View Topic",
        "drawing_continue_write": "Continue writing",
        "gapmath_title": "Sorting up the following options",
        "inline_choice_choose": "Please select",
        "vote_sigleitem": "Single vote allowed",
        "vote_mutipleitem": "Multiple votes allowed",
        "vote_tip": "There is a total of ${x} voting options. Please be careful and check.",
        "choice_screenshot_title": "Please choose the correct answer",
        "text_title": "Please fill in the blanks",
        "extras_user_answer": "Your answer",
        "extras_correct_answer": "Correct answer",
        "analyse": "Explanation",
        "single_choise": "Single Choice",
        "multiple_choise": "Multiple Choices",
        "blank_filling": "Fill in the Blank",
        "connection": "Matching",
        "sort": "Drag to Right Order",
        "question": "Question and Answer",
        "voting": "Vote",
        "true_or_false": "True or False",
        "puzzle": "Puzzle",
        "complex": "Complex",
        "media_img_still_loading": "Still loading image",
        "media_img_tip": "Click to view",
        "media_video_fullscreen": "Full Screen",
        "media_video_exit_fullscreen": "Exit",
        "media_video_not_support_fullscreen": "Full screen playback not supported",
        "error": "程序异常，当前习题无法播放"//TODO:翻译
    };

    var lang = {
        'zh': zh,
        'zh_cn': zh,
        'zh_hk': hk,
        'hk': hk,
        'ja': ja,
        'ja_jp': ja,
        'en': en,
        'en_us': en,
        'es_ec': {
            "mathjax_loading": "正在努力解析中...",
            "confirm": "Confirmar",
            "prompt": "Sugerencia",
            "drawing_source_material": "Materiales",
            "drawing_stem": "Tema",
            "drawing_view_material": "Consultar Materiales",
            "drawing_view_topics": "Consultar Ejercicios",
            "drawing_continue_write": "Sigue escribiendo",
            "gapmath_title": "Clasificar siguientes opciones",
            "inline_choice_choose": "请选择",
            "vote_sigleitem": "单项投票",
            "vote_mutipleitem": "不定项投票",
            "vote_tip_pre": "总共有",
            "vote_tip_end": "个投票项，投票时请注意查看，避免遗漏。",
            "choice_screenshot_title": "请选择正确的答案",
            "text_title": "请完成下面的填空",
            "extras_correct_answer": "正确答案",
            "analyse": "解析"
        }
    };

    return lang;
});

define('player/config/option', function () {

    var Option = {
        refPath: '',
        refBase: '',//basePath 目前这两个参数都要支持
        unifyTextEntry: false,//统一填空题结构
        lang: 'zh',
        skin: 'wood', //皮肤
        platForm: '', //接入平台
        showNum: false,
        screenshotLayout: false,
        showTitleArea: true,
        hideAnswerArea: false,
        showAnswerArea: true,
        showSubSequence: false,
        showHint: true,
        showStat: false, //显示统计信息
        showLock: false,//锁定作答区域
        showAnswer: false,
        showCheckedAnswer: false,
        showCorrectAnswer: false,
        showStatisAnswer: false,
        showMedia: true,
        lockMedia: false,//禁用多媒体
        modelId: [],
        randomSeed: [],
        event: true,
        expectWidth: 0,
        expectHeight: 0,
        thumbnailEnable: true,
        //showTitleExtras: false,//显示标题补充信息
        showQuestionName: false,//显示题目类型
        showCompositeSeparate: false,//显示复合题分割
        graphicGapMatchImageLoaderEnable: true,//是否在拼图题中启用图片加载队列
        showCompositeChildNum: true,//默认显示复合题小题序号
        sequenceNumber: ''//题目序号
    };


    return Option;
});

define('player/config/platForm', function () {

    //接入平台
    var platForm = {
        pptshell: 'qp-player-pptshell',
        statis: 'qp-statis'//pc新统计模块
    };


    return platForm;
});

// qti model
define('player/config/skin', function () {

    var skin = {
        //木纹
        wood: 'nqti-player-skin-wood',
        elearning: 'nqti-player-skin-elearning'
    };

    return skin;
});

define('player/elearning/player', ['model/logger', 'player/utils/extendUtils'], function (_logger, _utils) {
    var _QtiPlayer = window.QtiPlayer;
    //api
    var Player = {
        importMedia: function () {
            if (this._option.swfHost) {
                return require('player/media/eMedia');
            } else {
                return require('player/media/media');
            }
        },
        // 获取支持的题目类型
        getSupportType: function () {
            return this._assessmentTest.getAssessmentItem().getSupportType();
        },
        // 获取该题型的具体类型
        getModelQuestionType: function () {
            var modelType = {};
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            if (assessmentItem) {
                var itemModel = assessmentItem.getItemModel(false);
                var model;
                for (var modelId in itemModel.modelMap) {
                    model = itemModel.modelMap[modelId];
                    modelType[modelId] = model.questionType;
                }
            }
            return modelType;
        },
        mediaPlay: function (mediaType, index) {
            if (this._option.swfHost && arguments.length === 0) {
                this._media.mediaPlay();
            } else {
                this._media.mediaPlay(mediaType, index);
            }
        },
        mediaPause: function (mediaType, index) {
            if (this._option.swfHost && arguments.length === 0) {
                this._media.mediaPause();
            } else {
                this._media.mediaPause(mediaType, index);
            }
        },
        mediaPauseAll: function () {
            if (this._option.swfHost) {
                this._media.mediaPauseAll();
            } else {
                this._media.mediaPauseAll(this._getView());
            }
        },
        mediaSkip: function (mediaType, index, seeked) {
            if (this._option.swfHost) {
                this._media.mediaSkip();
            } else {
                this._media.mediaSkip(mediaType, index, seeked);
            }
        },
        mediaVolumeChange: function (mediaType, index, volume, display) {
            if (!this._option.swfHost) {
                this._media.mediaVolumeChange(mediaType, index, volume, display);
            }
        },
        _mediaOnFullScreenChange: function (callback) {
            this._media.mediaOnFullScreenChange(callback);
        },
        mediaOnFullScreenChange: function (callback) {
            this._media.mediaOnFullScreenChange(callback);
        },
        mediaOnFullScreen: function (callback) {
            this._media.mediaOnFullScreen(callback);
        },
        mediaOnFullScreenExit: function (callback) {
            this._media.mediaOnFullScreenExit(callback);
        },
        showUsrAndCorrectAnswer: function () {
            _QtiPlayer.resetMedia();
            _QtiPlayer.closeCustomKeyBoard();
            this._assessmentTest.getAssessmentItem().showUsrAndCorrectAnswer(this._getView());
        },
        // 存储extraAnswer,为HTML字符串
        // extra格式为：{modelId:'RESOPNSE-1-1',extraHtml: '<div>这是图片信息</div>'}
        setExtrasAnswer: function (extra, isAppended) {
            this._assessmentTest.getAssessmentItem().setExtrasAnswer(this._getParentView(), extra, isAppended, this._option);
        },
        // 清空extraAnswer内容
        cleanExtrasAnswer: function (modelId) {
            this._assessmentTest.getAssessmentItem().cleanExtras(this._getView(), modelId);
        },
        // 获取满分值
        getFullScore: function (modelId) {
            return this._assessmentTest.getAssessmentItem().getFullScore(modelId);
        },
        // 设置满分值
        setFullScore: function (retrieveData) {
            this._assessmentTest.getAssessmentItem().setFullScore(retrieveData);
        },
        // 获取用户得分
        getUserScore: function (modelId) {
            return this._assessmentTest.getAssessmentItem().getUserScore(modelId);
        },
        // 设置用户得分
        setUserScore: function (retrieveData) {
            this._assessmentTest.getAssessmentItem().setUserScore(retrieveData);
        },
        _getParentView: function () {
            return this._$parentView;
        }
    };
    return Player;
});

/**
 * Created by ylf on 2015/5/28.
 */

define('player/cls/baseInteraction', function () {
    var Class = require('player/cls/class');
    var utils = require('player/utils/extendUtils');
    var lang = require('player/config/lang');

    var classUtilsObject = function () {
    };

    classUtilsObject.prototype.base = function () {
        var base = this.Type.Base;
        if (!base.Base) {
            base.apply(this, arguments);
        } else {
            this.base = MakeBase(base);
            base.apply(this, arguments);
            delete this.base;
        }

        function MakeBase(type) {
            var Base = type.Base;
            if (!Base.Base) return Base;
            return function () {
                this.base = MakeBase(Base);
                Base.apply(this, arguments);
            };
        }
    };

    var BaseInteraction = Class(classUtilsObject, (function () {
        var member = {
            //constructor
            Create: function (modelItem) {
                this.base();
                if (lang == null || lang == undefined) {
                    lang = {};
                }
                var model = modelItem.getModel();
                this.name = model.modelType;
                this.interactionId = utils.Rd.getRandom(this.name);

                this.modalItem = modelItem;
                this.modalModel = model;
            },
            setOption: function (option) {
                this.option = option;
            },
            /**
             * dom是否还存在
             * @returns {boolean}
             */
            isDomExist: function () {
                return $('[data-key="' + this.interactionId + '"]').length > 0;
            },
            getLangText: function (key, str) {
                return lang[key] != null && lang[key] != undefined ? lang[key] : str;
            },
            /**
             * 获取选项随机数组
             * @param len
             * @returns {Array}
             */
            getAnswerRandom: function (len, start) {
                return lang.Rd.getAnswerRandom((len - 1), start, this.option.randomSeed);
            },
            /**
             * 是否锁定
             * @returns {boolean|showLock|*|qtiplayer.showLock|_option.showLock|member.option.showLock}
             */
            isLock: function () {
                return this.option.showLock;
            },
            //common api end

            //modalItem api start
            getAnswer: function () {
                return this.modalItem.getAnswer();
            },
            getCorrectAnswer: function () {
                return this.modalItem.getCorrectAnswer();
            },
            setAnswer: function (arry) {
                return this.modalItem.setAnswer(arry);
            },
            getLogger: function () {
                return this.modalItem.getLogger();
            },
            /**
             * 是否随机排列
             * @returns {*}
             */
            getShuffle: function () {
                return !!this.modalItem.getModel().shuffle;
            }

            //modalItem api end
        };

        return member;
    })());
    return BaseInteraction;
});

/**
 * Created by ylf on 2015/5/28.
 */
define('player/cls/class', function () {

    var Class = function (baseClass, member) {

        function prototype_() {
        };
        prototype_.prototype = baseClass.prototype;
        var aPrototype = new prototype_();
        for (var m in member) {
            if (m != "Create") {
                aPrototype[m] = member[m];
            }
        }
        if (member.toString() != Object.prototype.toString()) {
            aPrototype.toString = member.toString;
        }
        if (member.toLocaleString() != Object.prototype.toLocaleString()) {
            aPrototype.toLocaleString = member.toLocaleString;
        }
        if (member.valueOf() != Object.prototype.valueOf()) {
            aPrototype.valueOf = member.valueOf;
        }

        var aType = null;
        if (member.Create) {
            aType = member.Create;
        } else {
            aType = function () {
                this.base.apply(this, [baseClass, member]);
            };
        }

        aType.prototype = aPrototype;
        aType.Base = baseClass;
        aType.prototype.Type = aType;
        return aType;
    };



    return Class;
});
/**
 * Created by Administrator on 2016/9/27.
 */
define('player/hw/instanceHwApi', ['model/logger', 'player/utils/extendUtils', 'player/hw/NativeHwApi'], function (_logger, _utils, NativeHwApi) {

    var DigitalKeyboard = _utils.DigitalKeyboard;

    //更新右侧按钮
    var updateHwRight = function ($hwBtnRight, isEnd) {
        if (isEnd) {
            $hwBtnRight.removeClass('nqti-btn-back');
            $hwBtnRight.addClass('nqti-btn-clear');
        } else {
            $hwBtnRight.removeClass('nqti-btn-clear');
            $hwBtnRight.addClass('nqti-btn-back');
        }
    };

    var HwApi = {
        /**
         * 是否启用手写
         * @param option {hwEnable:false,scrollDom:'',hwSendDataCallback:func,}
         */
        hwEnable: function () {
            var option = this.getOption();
            //锁定状态不能输入
            //显示答案区域或者显示用户答案时，才有输入框
            if (option.hwEnable) {
                if ((option.showAnswerArea || option.showAnswer) && !option.showLock && !option.showCheckedAnswer && !option.showStatisAnswer && !option.showCorrectAnswer) {
                    return true;
                }
            }
            return false;
        },
        hwGetBox: function () {
            if (!this.hwEnable()) {
                return {};
            }
            var that = this;
            var $inputs = this._getView().find('._qp-text-normal');
            var correctAnswer = this.getAssessmentModel().correctAnswer;
            var inputArea = {};
            inputArea.box = [];

            $inputs.each(function () {
                var $input = $(this);
                var index = parseInt($input.attr('data-index'));
                var modelId = $input.closest('._qp-model').attr('data-model-id');
                var offset = $input.offset();
                var answer = '';
                if (correctAnswer && correctAnswer[modelId] && correctAnswer[modelId].value) {
                    answer = correctAnswer[modelId].value[index];
                }
                var width = $input.outerWidth();
                var height = $input.height();


                //宽高小于0，表示是隐藏状态，隐藏时不进行手写操作
                if (width > 0 && height > 0) {
                    var area = {
                        id: that.getId() + '|' + modelId + '|' + index,
                        left: offset.left,
                        top: offset.top,
                        width: width,
                        height: height,
                        answer: answer
                    };
                    inputArea.box.push(area);
                }
            });

            //设置滚动的内容
            if (this.getOption().scrollDom) {
                var $scrollDom = $(this.getOption().scrollDom);
                var offset = $scrollDom.offset();
                inputArea.scrollDomLeft = offset.left;
                inputArea.scrollDomTop = offset.top;
                inputArea.scrollDomWidth = $scrollDom.width();
                inputArea.scrollDomHeight = $scrollDom.height();
                inputArea.scrollDomScrollLeft = $scrollDom.scrollLeft();
                inputArea.scrollDomScrollTop = $scrollDom.scrollTop();
            } else {
                inputArea.scrollDomLeft = 0;
                inputArea.scrollDomTop = 0;
                inputArea.scrollDomWidth = 0;
                inputArea.scrollDomHeight = 0;
                inputArea.scrollDomScrollLeft = 0;
                inputArea.scrollDomScrollTop = 0;
            }

            //记录按钮宽高
            var $hwBtn = this._getView().find('.nqti-txt-hw-btn-left');
            inputArea.btnWidth = $hwBtn.width();
            inputArea.btnHeight = $hwBtn.width();

            return inputArea;
        },
        hwBindScrollEvent: function (scrollStart, scrollEnd) {
            if (this.getOption().scrollDom) {
                _utils.Dom.bindScrollState(this.getOption().scrollDom, scrollStart, scrollEnd);
            }
        },
        hwDestroyNativeHwBox: function () {
            //移除事件
            if (this.getOption().scrollDom) {
                _utils.Dom.bindScrollState(this.getOption().scrollDom);
            }
        },
        hwAppendAnswer: function (modelId, index, appendAnswer) {
            this._hwRenderAnswer(modelId, index, appendAnswer, true);
        },
        hwReplaceAnswer: function (modelId, index, answer) {
            this._hwRenderAnswer(modelId, index, answer, false);
        },
        hwBackOrClear: function (modelId, index) {
            var $input = this._getView().find('[data-model-id="' + modelId + '"] ._qp-text-normal').eq(index);
            var isEnd = false;
            if ($input.hasClass('qp-digital-container')) {
                isEnd = DigitalKeyboard.isCursorLast($input.get(0));
            } else {
                var cursor = _utils.Dom.getTxtCursorPos($input[0]);
                isEnd = cursor === $input.val().length;
            }
            if (isEnd) {
                this._hwClearAnswer(modelId, index);
            } else {
                this._hwBackspaceInput(modelId, index);
            }
        },

        /**
         * 变更输入模式
         * @param modelId
         * @param index
         * @param mode hw 手写板 kb：键盘 kbdisable:不可用
         * @param isShowAlternate 是否通知native光标变化
         */
        hwInputModeChange: function (modelId, index, mode, isShowAlternate) {
            var that = this;
            var $hwLeftBtn = this._getView().find('[data-model-id="' + modelId + '"] [data-index="' + index + '"] .nqti-txt-hw-btn-left');
            if (mode === 'hw') {
                $hwLeftBtn.removeClass('nqti-btn-kb');
                $hwLeftBtn.removeClass('nqti-btn-kb-disable');
                $hwLeftBtn.addClass('nqti-btn-hw');
                //主动通知原生层光标位置变化
                // setTimeout(function () {
                if (isShowAlternate) {
                    that.hwUpdateCallCursorChange(modelId, index);
                }
                // }, 1000);

            } else if (mode === 'kbdisable') {
                $hwLeftBtn.removeClass('nqti-btn-kb');
                $hwLeftBtn.removeClass('nqti-btn-hw');
                $hwLeftBtn.addClass('nqti-btn-kb-disable');
            } else {
                $hwLeftBtn.removeClass('nqti-btn-hw');
                $hwLeftBtn.removeClass('nqti-btn-kb-disable');
                $hwLeftBtn.addClass('nqti-btn-kb');
            }
        },
        hwBindCursorChange: function () {
            if (this.hwEnable()) {
                this._normalInputCursorChange();
                this._digitalInputCursorChange();
            }
        },
        _callCursorChange: function ($input, cursor) {
            var input = $input.get(0),
                isDigital = $input.hasClass('qp-digital-container'),
                index = $input.data('index'),
                modelId = $input.closest('._qp-model').attr('data-model-id'),
                id = this._getHwrId($input);

            //TODO:判断当前模式
            var $hwLeftBtn = this._getView().find('[data-model-id="' + modelId + '"] [data-index="' + index + '"] .nqti-txt-hw-btn-left');

            if (!$hwLeftBtn.hasClass('nqti-btn-hw')) {
                return;
            }

            //通知native更新光标坐标位置变更
            if (isDigital) {
                var offset = $input.offset(),
                    cursorData = DigitalKeyboard.getCursorPosAndPreChar(input),
                    childrenOffset = $input.children().offset();
                if (cursorData) {
                    NativeHwApi.showAlternate(
                        id,
                        cursorData.preChar,
                        cursorData.left + (childrenOffset.left - offset.left ),
                        cursorData.top,
                        cursorData.height);
                }
            } else {
                var $parent = $input.parent(),
                    $split = $parent.find('[data-index="' + index + '"].nqti-txt-hw-visible-container'),
                    $splitPre = $split.find('._qp_txt_split_pre'),
                    $splitSuffix = $split.find('._qp_txt_split_suffix'),
                    val = $input.val(),
                    start = val.substr(0, cursor),
                    scrollLeft = $input.scrollLeft(),
                    scrollWidth = $input[0].scrollWidth,
                    pOffset = $input.offset(),
                    width = $input.outerWidth(),
                    cursorLeft = 0,
                    end = val.substr(cursor, val.length);

                $splitPre.text(start);
                if (scrollWidth >= ( width + 1)) {
                    $split.width($input.outerWidth());
                    var paddingleft = parseInt($input.css('paddingLeft'));
                    var left = (-scrollLeft + paddingleft);
                    $splitPre.css({position: 'absolute', left: left + 'px', width: 'initial'});
                    cursorLeft = $splitPre.outerWidth() + left;
                } else {
                    $splitPre.css({position: 'initial'});
                    $split.width($input.outerWidth());
                    $splitSuffix.text(end);
                    $splitPre.width($input.width());
                    var cursorOffset = $splitSuffix.offset();
                    cursorLeft = cursorOffset.left - pOffset.left;
                }
                if (cursorLeft < 0) {
                    cursorLeft = -1;
                }
                NativeHwApi.showAlternate(
                    id,
                    cursor > 0 ? val.substr(cursor - 1, 1) : '',
                    cursorLeft,
                    0,
                    $input.height(),
                    scrollWidth >= ( width + 5)
                );
            }

        },
        _normalInputCursorChange: function () {
            var that = this,
                $normalInputs = this._getView().find('input._qp-text-normal');

            $normalInputs.on('focus', function () {
                var lastCursor = -1;
                var $input = $(this),
                    input = $input.get(0),
                    index = $input.data('index'),
                    $parent = $input.parent(),
                    $hwBtnRight = $parent.find('[data-index="' + index + '"].nqti-txt-hw-btn-container .nqti-txt-hw-btn-right'),
                    lastVal = null;

                if (input._timer) {
                    clearInterval(input._timer);
                }

                input._timer = setInterval(function () {
                    var cursor = _utils.Dom.getTxtCursorPos(input),
                        val = $input.val(),
                        id = that._getHwrId($input),
                        isEnd = cursor === val.length;

                    updateHwRight($hwBtnRight, isEnd);

                    //通知native更新光标坐标位置变更
                    if (cursor !== lastCursor) {
                        that._callCursorChange($input, cursor);
                    }

                    //通知native更新答案和光标位置
                    if (cursor !== lastCursor || lastVal !== val) {
                        NativeHwApi.answerChange(id, val, cursor);
                    }
                    lastCursor = cursor;
                    lastVal = val;

                }, 500);
            });
            $normalInputs.on('blur', function () {
                var $input = $(this);
                clearInterval($input.get(0)._timer);
                var index = $input.data('index');
                var $hwBtnRight = $input.parent().find('[data-index="' + index + '"].nqti-txt-hw-btn-container .nqti-txt-hw-btn-right');
                updateHwRight($hwBtnRight, true);
            });
        },
        hwUpdateCallCursorChange: function (modelId, index) {
            var that = this;
            var $input = this._getView().find('[data-model-id="' + modelId + '"] ._qp-text-normal').eq(index);
            if ($input.hasClass('qp-digital-container')) {
                var cursor = DigitalKeyboard.getCursorIndex($input.get(0));
                if (cursor >= 0) {
                    that._callCursorChange($input, cursor);
                }
            } else {
                if ($input.is(':focus')) {
                    var cursor = _utils.Dom.getTxtCursorPos($input[0]);
                    that._callCursorChange($input, cursor);
                }
            }
        },
        _digitalInputCursorChange: function () {
            var that = this,
                $digitalInputs = this._getView().find('._qp-text-normal.qp-digital-container');

            for (var i = 0; i < $digitalInputs.length; i++) {
                var $digitalInput = $($digitalInputs[i]);
                var $hwBtnRight = $digitalInput.parent().find('[data-index="' + $digitalInput.data('index') + '"].nqti-txt-hw-btn-container .nqti-txt-hw-btn-right');
                (function ($digitalInput, $hwBtnRight) {
                    var lastVal = '',
                        digitalInput = $digitalInput.get(0);

                    DigitalKeyboard.setCursorCallback(digitalInput, function () {
                        var cursorData = DigitalKeyboard.getCursorPosAndPreChar(digitalInput),
                            id = that._getHwrId($digitalInput),
                            inputVal = DigitalKeyboard.getText4Dom(digitalInput);

                        //光标变化，更新右侧按钮
                        updateHwRight($hwBtnRight, DigitalKeyboard.isCursorLast(digitalInput));

                        //通知native更新光标坐标位置变更
                        that._callCursorChange($digitalInput);

                        //通知native更新答案和光标位置
                        if (cursorData || lastVal !== inputVal) {
                            var cursor = DigitalKeyboard.getCursorIndex(digitalInput);
                            if (cursor >= 0) {
                                NativeHwApi.answerChange(id, inputVal, cursor);
                            }
                        }
                        lastVal = inputVal;
                    });

                    //焦点变化更新右侧按钮
                    DigitalKeyboard.setFocusCallback4DOM(digitalInput, function () {
                    }, function () {
                        updateHwRight($hwBtnRight, true);
                    });
                })($digitalInput, $hwBtnRight)
            }
        },
        hwSetNativeData: function (data) {
            //中转一层，调用全局方法
            window.QtiPlayer.hwSetNativeData(data);
        },
        hwReplacePreCursor: function (modelId, index, answer, oldChar) {
            var currentAnswer = this.getAnswer()[modelId];
            var $input = this._getView().find('[data-model-id="' + modelId + '"] ._qp-text-normal').eq(index);

            if ($input.hasClass('qp-digital-container')) {
                DigitalKeyboard.replaceCursorPreChar($input.get(0), answer);
            } else {
                // DigitalKeyboard.clearAllFocus();
                var curPos = _utils.Dom.getTxtCursorPos($input.get(0));
                var newAnswer = '';
                //追加到指定光标下
                var oldAnswer = (currentAnswer.value.length > 0 ? currentAnswer.value[index] : '');
                //光标在行首不处理
                if (curPos > 0) {
                    var start = oldAnswer.substr(0, curPos - 1);
                    // if (oldChar !== oldAnswer.substr(curPos - 1, 1)) {
                    //     return
                    // }
                    var end = oldAnswer.substr(curPos, oldAnswer.length);
                    newAnswer = start + answer + end;
                    currentAnswer.value[index] = newAnswer;
                    //答案回填
                    this._assessmentTest._assessmentItem._modelItem[modelId].setAnswer(currentAnswer.value);
                    //渲染界面
                    $input.val(newAnswer);
                    $input.trigger('input');
                    //定位到光标
                    _utils.Dom.toTxtCursorIndex(curPos, $input.get(0));
                }
            }
        },
        hwFocus: function (modelId, index) {
            var $input = this._getView().find('[data-model-id="' + modelId + '"] ._qp-text-normal').eq(index);
            var isDigital = $input.hasClass('qp-digital-container');
            var curPos = -1;
            if (!isDigital) {
                curPos = _utils.Dom.getTxtCursorPos($input.get(0));
            }

            $('input').blur();
            if (isDigital) {
                DigitalInput.InputManager.getInstance().openKeyBoard($input.attr('digital_id'));
                DigitalInput.InputManager.getInstance().appendText4DOM('', $input[0], true);
            } else {
                DigitalKeyboard.clearAllFocus();
                $input.trigger('click');
                $input.trigger('focus');
                if (curPos > -1) {
                    _utils.Dom.toTxtCursorIndex(curPos, $input.get(0));
                }
            }
        },
        _hwRenderAnswer: function (modelId, index, answer, append) {
            var currentAnswer = this.getAnswer()[modelId];

            var $input = this._getView().find('[data-model-id="' + modelId + '"] ._qp-text-normal').eq(index);
            var isDigital = $input.hasClass('qp-digital-container');
            //TODO:这个地方做一次强制判断，如果当前没有焦点，则触发全部失去焦点
            if (!$input.is(':focus')) {
                //所有都强制失去焦点
                $('input').blur();


            }
            if (isDigital) {

                //数字键盘根据光标回退，回退后会触发填空题已经注册的回调更新答案
                if (append) {
                    DigitalKeyboard.appendText4DOM(answer, $input.get(0), true);
                } else {
                    if (answer === '') {
                        DigitalKeyboard.clearText($input.get(0), true);
                    } else {
                        DigitalKeyboard.setText4DOM(answer, $input.get(0));
                    }
                }
            } else {
                DigitalKeyboard.clearAllFocus();
                var newAnswer = answer;
                if (append) {
                    var curPos = _utils.Dom.getTxtCursorPos($input[0]);
                    //追加到指定光标下
                    var oldAnswer = (currentAnswer.value.length > 0 ? currentAnswer.value[index] : '');
                    if (curPos >= 0) {
                        var start = oldAnswer.substr(0, curPos);
                        var end = oldAnswer.substr(curPos, oldAnswer.length);
                        newAnswer = start + answer + end;
                    } else {
                        newAnswer = oldAnswer + answer;
                    }
                    currentAnswer.value[index] = newAnswer;
                } else {
                    currentAnswer.value[index] = newAnswer;
                }
                //答案回填
                this._assessmentTest._assessmentItem._modelItem[modelId].setAnswer(currentAnswer.value);
                //渲染界面
                $input.val(newAnswer);
                $input.trigger('input');
                //定位到光标
                if (append && curPos >= 0) {
                    _utils.Dom.toTxtCursorIndex(curPos + answer.length, $input[0]);
                }
            }

            if (!$input.is(':focus')) {
                var val;
                //处理非普通input没有光标时，取最后位置为光标位置
                if (!isDigital) {
                    val = $input.val();
                    this._callCursorChange($input, val.length);
                    NativeHwApi.answerChange(this._getHwrId($input), val, val.length);
                }
            }
        },
        _hwClearAnswer: function (modelId, index) {
            this._hwRenderAnswer(modelId, index, '', false);
        },
        _hwBackspaceInput: function (modelId, index) {
            var currentAnswer = this.getAnswer()[modelId];
            var oldAnswer = (currentAnswer.value.length > 0 ? currentAnswer.value[index] : '');
            var $input = this._getView().find('[data-model-id="' + modelId + '"] ._qp-text-normal').eq(index);
            var newAnswer = oldAnswer;
            if ($input.hasClass('qp-digital-container')) {
                //数字键盘根据光标回退，回退后悔触发填空题已经注册的回调更新答案
                if (DigitalKeyboard.isCursorLast($input.get(0))) {
                    DigitalKeyboard.clearText($input.get(0));
                } else {
                    DigitalKeyboard.deleteText($input.get(0));
                }
            } else {
                var curPos = _utils.Dom.getTxtCursorPos($input[0]);
                if (curPos === 0) {
                    //do nothing 光标在字符串最前面,什么都不做
                } else {
                    var start = oldAnswer.substr(0, curPos - 1);
                    var end = oldAnswer.substr(curPos, oldAnswer.length);
                    newAnswer = start + end;
                }
                currentAnswer.value[index] = newAnswer;
                //答案回填
                //this.setAnswer(currentAnswer);
                this._assessmentTest._assessmentItem._modelItem[modelId].setAnswer(currentAnswer.value);
                //渲染界面
                $input.val(newAnswer);
                $input.trigger('input');
                //定位到光标
                if (curPos > 0) {
                    _utils.Dom.toTxtCursorIndex(curPos - 1, $input[0]);
                } else {
                    _utils.Dom.toTxtCursorIndex(0, $input[0]);
                }
            }

        },
        _getHwrId: function ($input) {
            var index = parseInt($input.attr('data-index'));
            var modelId = $input.closest('._qp-model').attr('data-model-id');
            return this.getId() + '|' + modelId + '|' + index;
        }
    };

    return HwApi;
});

/**
 * Created by Administrator on 2016/9/27.
 */
define('player/hw/NativeHwApi', ['model/logger', 'player/utils/extendUtils'], function (_logger, _utils) {


    var NativeHwApi = {
        _instance: {},

        callNativeMethod: function (data) {
            var callBack;
            for (var key in window.QtiPlayer._instance) {
                var instance = window.QtiPlayer._instance[key];
                if (instance) {
                    callBack = instance.getOption().hwSendDataCallback;
                    if (callBack) {
                        break;
                    }
                }
            }
            if (!callBack) {
                _logger.debug('_hwCallNative', 'hwSendDataCallback  is undefined');
                return;
            }
            callBack(JSON.stringify(data));
        },
        /**
         * 答案和光标变更回调
         * @param id
         * @param currentAnswer 当前答案
         * @param cursor 光标位置
         */
        answerChange: function (id, currentAnswer, cursor) {
            var isMath = /^\\\(.*\\\)$/.test(currentAnswer);

            var data = {
                op: 'answerChange',
                data: {
                    id: id,
                    currentAnswer: currentAnswer,
                    cursor: cursor,
                    isMath: isMath
                }
            };
            this.callNativeMethod(data);
        },
        /**
         * 光标以及光标前一个字符
         * @param id
         * @param char 光标前一个字符
         * @param left 光标位置
         * @param top 光标位置
         * @param height 光标高度
         */
        showAlternate: function (id, char, left, top, height, isScroll) {
            var data = {
                op: 'show_alternate',
                data: {
                    id: id,
                    alternate_char: char,
                    left: left,
                    top: top,
                    height: height,
                    isScroll: isScroll || false
                }
            };
            this.callNativeMethod(data);
        },
        /**
         * 设置输入框位置信息
         * @param box
         */
        renderComplete: function (box) {
            var data = {
                op: 'renderComplete',
                data: box
            };
            this.callNativeMethod(data);
        },
        /**
         * 滚动事件
         * @param state start/end
         */
        scroll: function (state) {
            var data = {
                op: 'scroll',
                data: {
                    status: state
                }
            };
            this.callNativeMethod(data);
        }
    };

    return NativeHwApi;
});

/**
 * Created by Administrator on 2016/9/27.
 */
define('player/hw/qtiHwApi', ['model/logger', 'player/utils/extendUtils', 'player/hw/NativeHwApi'], function (_logger, _utils, NativeHwApi) {


    var DigitalKeyboard = _utils.DigitalKeyboard;

    var autoMathTimeOutId = 0;
    var lastBox = undefined;//上次的输入框信息
    var $body = $(document.body);
    var windowBind = false;

    var HwApi = {
        _instance: {},
        createPlayer: function (option) {
            var that = this;
            var player = this._createPlayer(option);

            //保存新建的实例，用于手写部分功能
            this._instance[player.getId()] = player;

            player.bindEvent('render', 'rendered', function () {
                //绑定光标变化，更新右侧按钮
                if (player.hwEnable()) {
                    that.hwSetNativeBox();
                    player.hwBindCursorChange();

                    //绑定滚动事件
                    player.hwBindScrollEvent(function () {
                        that._lockAutoMath();
                        NativeHwApi.scroll('start');
                    }, function () {
                        that.hwSetNativeBox();
                        that._unLockAutoMath();
                        NativeHwApi.scroll('end');
                    });
                }
            });
            player.bindEvent('render', 'renderChanged', function () {
                that.hwSetNativeBox();
            });
            player.bindEvent('render', 'destroy', function () {
                that.destroy(player.getId());
                that.hwSetNativeBox();
            });
            player.mediaOnFullScreenChange(function (isFull) {
                if (isFull) {
                    that._lockHwArea();
                } else {
                    that._unLockHwArea();
                }
            });
            //定时计算大小宽高变化信息
            that._autoMathBoxSize();

            //绑定document.body的滚动事件
            if (!windowBind) {
                _utils.Dom.bindScrollState(window, function () {
                    NativeHwApi.scroll('start');
                }, function () {
                    that.hwSetNativeBox();
                    NativeHwApi.scroll('end');
                });
                windowBind = true;
            }
            return player;
        },
        _instanceEach: function (callback) {
            for (var key in this._instance) {
                var instance = this._instance[key];
                callback.apply(instance, [key]);
            }
        },
        _isLockAutoMath: function () {
            return this._lockAuto;
        },
        _lockAutoMath: function () {
            this._lockAuto = true;
        },
        _unLockAutoMath: function () {
            this._lockAuto = false;
        },
        _lockHwArea: function () {
            this.__isLockHwArea = true;
            this.hwSetNativeBox();
        },
        _unLockHwArea: function () {
            this.__isLockHwArea = false;
            this.hwSetNativeBox();
        },
        _isLockHwArea: function () {
            return this.__isLockHwArea;
        },

        _autoMathBoxSize: function () {
            clearTimeout(autoMathTimeOutId);
            var that = this;
            autoMathTimeOutId = setTimeout(function () {
                if (lastBox && !that._isLockAutoMath()) {
                    that.hwSetNativeBox();
                }
                that._autoMathBoxSize();
            }, 1000);
        },
        hwSetNativeBox: function () {
            var currentBox = this._hwGetBox();
            if (_isBoxSame(lastBox, currentBox)) {
                return;
            }
            //更新native信息后，设置lastBox为最新，防止定时器内重复调用
            lastBox = currentBox;

            NativeHwApi.renderComplete(currentBox);

        },
        /**
         *
         * @param data  {"data":{"answer":"O.6","id":"487b053d-7165-4915-8286-746b81091402|RESPONSE_1-1|0"},"op":"appendAnswer"}

         */
        hwSetNativeData: function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            var param = data.data;
            var op = data.op;
            if (op === 'closeKeyboard') {
                DigitalKeyboard.closeKeyBoard(false);
                return;
            }
            var ids = param.id.split('|');
            if (ids.length !== 3) {
                _logger.warn('qti handwrite', ' id error', data);
                return;
            }
            _logger.debug('qtihw hwSetNativeData ', data);
            var modelId = ids[1];
            var index = parseInt(ids[2]);
            var instance = this._instance[ids[0]];
            if (instance) {
                if (op === 'clearOrBack') {
                    instance.hwBackOrClear(modelId, index);
                } else if (op === 'appendAnswer') {
                    instance.hwAppendAnswer(modelId, index, param.answer);
                } else if (op === 'inputModeChange') {
                    instance.hwInputModeChange(modelId, index, param.mode, param.isShowAlternate);
                } else if (op === 'destroy') {
                    this.destroy(ids);
                } else if (op === 'focus') {
                    DigitalKeyboard.closeKeyBoard(false);
                    instance.hwFocus(modelId, index);
                } else if (op === 'replaceCursorPreChar') {
                    instance.hwReplacePreCursor(modelId, index, param.preCursorChar, param.oldChar);
                } else if (op === 'replaceAnswer') {
                    instance.hwReplaceAnswer(modelId, index, param.answer);
                }
            }
        },
        destroy: function (id) {
            if (typeof id !== typeof undefined) {
                var instance = this._instance[id];
                if (instance) {
                    instance.hwDestroyNativeHwBox();
                }
                delete this._instance[id];
            } else {
                this._instanceEach(function () {
                    this.hwDestroyNativeHwBox();
                });
                this._instance = {};
            }
            //移除定时任务
            if ($.isEmptyObject(this._instance)) {
                clearTimeout(autoMathTimeOutId);
                _utils.Dom.upBindScrollState(window);
                windowBind = false;
            }
        },
        _hwGetBox: function () {
            var bodyScrollTop = $body.scrollTop();
            var bodyScrollLeft = $body.scrollLeft();
            var box = {};
            box.bodyScrollTop = bodyScrollTop;
            box.bodyScrollLeft = bodyScrollLeft;
            box.totalBox = [];
            if (!this._isLockHwArea()) {
                this._instanceEach(function () {
                    var instanceBox = this.hwGetBox();
                    if (!$.isEmptyObject(instanceBox)) {
                        box.totalBox.push(instanceBox);
                    }

                });
            }
            return box;
        }
    };

    var _isBoxSame = function (lastBox, currentBox) {
        if (!lastBox) {
            return false;
        }
        var flag = false;
        //实例总数不一致
        if (lastBox.totalBox.length !== currentBox.totalBox.length) {
            flag = true;
        } else if (lastBox.bodyScrollTop !== currentBox.bodyScrollTop || lastBox.bodyScrollLeft !== currentBox.bodyScrollLeft) {
            flag = true;
        } else {
            for (var i = 0; i < currentBox.totalBox.length; i++) {
                var instanceBox = currentBox.totalBox[i];
                var lastInstanceBox = lastBox.totalBox[i];

                //不包含实例内容
                if (currentBox.totalBox.length === 0) {
                    continue;
                }

                if (!instanceBox.box || !lastInstanceBox.box) {
                    flag = true;
                    break;
                }

                //空格个数不相等
                if (instanceBox.box.length != lastInstanceBox.box.length) {
                    flag = true;
                    break;
                }

                //实例内是否一致
                for (var i = 0; i < instanceBox.box.length; i++) {
                    var lb = lastInstanceBox.box[i];
                    var cb = instanceBox.box[i];

                    //输入框已经被清除或变更
                    if (!cb || !lb) {
                        flag = true;
                        break;
                    }
                    //位置信息和宽高信息偏差
                    if (Math.abs(lb.left - cb.left) >= 2
                        || Math.abs(lb.top - cb.top) >= 2
                        || Math.abs(lb.width - cb.width) >= 2
                        || Math.abs(lb.height - cb.height) >= 2
                        || lb.id !== cb.id
                    ) {
                        flag = true;
                        break;
                    }
                }
            }

        }
        return !flag;
    }
    return HwApi;
});

define('player/media/defaultMediaPlayer', function () {

    var _emptyFunc = function () {
    };

    var mediaPlayer = {
        _$medias: null,
        _eventHandler: null,
        create: function () {
            var instance = $.extend({}, this);
            instance._eventHandler = {
                play: _emptyFunc,
                pause: _emptyFunc,
                ended: _emptyFunc,
                timeupdate: _emptyFunc,
                seeked: _emptyFunc,
                volumeChange: _emptyFunc,
                fullScreenChange: _emptyFunc
            };
            instance._$medias = {};
            return instance;
        },
        render: function ($view, option) {
        },
        renderImg: function () {
            //TODO:
        },
        eventHandle: function ($view, option) {
            var that = this;
            //多媒体事件处理
            var mediaHandler = function (index) {
                var $media = $(this);
                var mediaType = $media[0].tagName;
                var mediaId = mediaType + '-' + index;
                //记录
                that._$medias[mediaId] = $media;
                //
                var mediaTarget = {
                    mediaId: mediaId,
                    index: index,
                    mediaType: mediaType
                };
                //绑定事件
                var eventTypes = ['play', 'pause', 'ended', 'timeupdate', 'seeked'];
                $(eventTypes).each(function (i, eventType) {
                    if (eventType === 'seeked') {
                        mediaTarget.seeked = $media[0].currentTime;
                    } else {
                        delete mediaTarget.seeked;
                    }
                    $media.bind(eventType, function () {
                        that._eventHandler[eventType](mediaTarget);
                    });
                });
            };
            $view.find('audio').each(mediaHandler);
            $view.find('video').each(mediaHandler);
        },
        mediaOnStart: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.play = callback;
            }
        },
        mediaOnPause: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.pause = callback;
            }
        },
        mediaOnEnded: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.ended = callback;
            }
        },
        mediaOnTimeupdate: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.timeupdate = callback;
            }
        },
        mediaOnVolumeChange: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.volumeChange = callback;
            }
        },
        mediaOnSeeked: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.seeked = callback;
            }
        },
        _getMedia: function (mediaType, index) {
            var mediaId = mediaType + '-' + index;
            var $media = this._$medias[mediaId];
            return $media;
        },
        mediaPlay: function (mediaType, index) {
            var $media = this._getMedia(mediaType, index);
            if ($media) {
                $media.trigger('play');
            }
        },
        mediaPause: function (mediaType, index) {
            var $media = this._getMedia(mediaType, index);
            if ($media) {
                $media.trigger('pause');
            }
        },
        mediaPauseAll: function (obj) {

        },
        mediaSkip: function (mediaType, index, seeked) {
            var $media = this._getMedia(mediaType, index);
            if ($media) {
                $media[0].currentTime = seeked;
                $media.trigger('pause');
            }
        },
        mediaVolumeChange: function (mediaType, index, volume, diaplay) {
            //TODO:
        },
        mediaOnFullScreenChange: function (callback) {
            //TODO:
        },
        destroy: function () {
            //TODO:
        },
        setLock:function(lock,view){
            //TODO:
        }
    };

    return mediaPlayer;
});

/**
 * Created by LinMingDao on 2016/9/1.
 * eLearning媒体播放器Adapter
 */
define('player/media/eLearningMediaPlayer', function () {

    if (!window.Video) {
        throw new Error("未加载elearning媒体播放器资源，请手动加载");
    }

    var _emptyFunc = function () {
    };

    // elearning 播放器 impl
    window.ELMediaPlayer = {
        _players: [],//
        _eventHandler: {
            play: _emptyFunc,
            pause: _emptyFunc,
            ended: _emptyFunc,
            timeupdate: _emptyFunc,
            seeked: _emptyFunc,
            volumeChange: _emptyFunc,
            fullScreenChange: _emptyFunc,
            fullScreen: _emptyFunc,
            fullScreenExit: _emptyFunc
        },
        _getMedia: function (mediaType, index) {
            var that = this;
            var mediaId = mediaType + '-' + index;
            for (var key in this._$medias) {
                if (that._getKeyMedia(key) === mediaId) {
                    var $media = this._$medias[key];
                    return $media;
                }
            }
            return null;
        },
        render: function ($view, option) {
            var that = this;
            that._players.length = 0;
            var $media = $view.find("._mediaMark");
            for (var i = 0; i < $media.length; ++i) {
                // 解析media资源url
                var mediaUrl = $($media[i]).attr("media_src");
                var config = {
                    video: {
                        swfHost: option.swfHost || "http://static.auxo.test.huayu.nd/auxo/addins/flowplayer/v1.0.0/",
                        url: mediaUrl,
                        autoPlay: false
                    }
                };
                var player = new window.Video.Player($media[i], config);
                if (player.addEventListener) {
                    // 注册回调事件
                    player.addEventListener("onStart", function () {
                        console.log('onStart...');
                        // 暂停所有其他视频
                        for (var i = 0; i < that._players.length; ++i) {
                            if (this != that._players[i]) {
                                that._players[i].pause();
                            }
                        }
                        that._eventHandler.play();
                    });
                    player.addEventListener("onPause", function () {
                        console.log('onPause...');
                        that._eventHandler.pause();
                    });
                    player.addEventListener("onFullscreen", function () {
                        console.log('onFullscreen...');
                        that._eventHandler.fullScreenChange(true);
                        that._eventHandler.fullScreen();
                    });
                    player.addEventListener("onFullscreenExit", function () {
                        console.log('onFullscreenExit...');
                        that._eventHandler.fullScreenChange(false);
                        that._eventHandler.fullScreenExit();
                    });
                    player.addEventListener("onFinish", function () {
                        console.log('onFinish...');
                        that._eventHandler.ended();
                    });
                    player.addEventListener("onSeek", function () {
                        console.log('onSeek...');
                        that._eventHandler.seeked();
                    });

                    player.addEventListener("onResume", function () {
                        // 暂停所有其他视频
                        console.log('onResume');
                        for (var i = 0; i < that._players.length; ++i) {
                            if (this != that._players[i]) {
                                that._players[i].pause();
                            }
                        }
                    });
                }
                // 缓存播放器实例
                this._players.push(player);
            }
        },
        mediaOnStart: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.play = callback;
            }
        },
        mediaOnPause: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.pause = callback;
            }
        },
        mediaOnEnded: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.ended = callback;
            }
        },
        mediaOnTimeupdate: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.timeupdate = callback;
            }
        },
        mediaOnSeeked: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.seeked = callback;
            }
        },
        mediaOnVolumeChange: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.volumeChange = callback;
            }
        },
        getMedia: function () {
        },
        mediaPlay: function () {
            var that = this;
            for (var i = 0; i < that._players.length; ++i) {
                that._players[i].replay();
            }
        },
        mediaPause: function () {
            var that = this;
            for (var i = 0; i < that._players.length; ++i) {
                that._players[i].pause();
            }
        },
        mediaPauseAll: function () {
        },
        mediaSkip: function () {
        },
        mediaVolumeChange: function () {
        },
        mediaOnFullScreenChange: function (callback) {// ok
            if (typeof callback === 'function') {
                this._eventHandler.fullScreenChange = callback;
            }
        },
        mediaOnFullScreen: function (callback) {// ok
            if ($.type(callback) === 'function') {
                this._eventHandler.fullScreen = callback;
            }
        },
        mediaOnFullScreenExit: function (callback) {// ok
            if (typeof callback === 'function') {
                this._eventHandler.fullScreenExit = callback;
            }
        },
        destroy: function () {
            var that = this;
            this._fullChangeEvent.remove(this._eventHandler.fullScreenChange);
            for (var i = 0; i < that._players.length; ++i) {
                that._players[i].close();
            }
            that._players = null;
        }
    };

    var eMediaPlayer = {
        _mediaImpl: window.ELMediaPlayer,
        _eventHandler: null,
        _fullChangeEvent: {
            onFullScreenChange: [],
            trigger: function (isFull) {
                this.onFullScreenChange.forEach(function (callback) {
                    if (callback) {
                        callback(isFull);
                    }
                })
            },
            push: function (callback) {
                this.onFullScreenChange.push(callback);
            },
            remove: function (callback) {
                var len = this.onFullScreenChange.length;
                for (var i = 0; i < len; i++) {
                    if (callback === this.onFullScreenChange[i]) {
                        this.onFullScreenChange.splice(i, 1);
                        i--;
                        len--;
                    }
                }
            }
        },
        create: function () {
            var instance = $.extend({}, this);
            instance._eventHandler = {
                play: _emptyFunc,
                pause: _emptyFunc,
                ended: _emptyFunc,
                timeupdate: _emptyFunc,
                seeked: _emptyFunc,
                volumeChange: _emptyFunc,
                fullScreenChange: _emptyFunc
            };
            return instance;
        },
        render: function ($view, option) {
            option.onPlay = this._eventHandler.play;
            option.onPause = this._eventHandler.pause;
            option.onEnd = this._eventHandler.ended;
            option.onSeek = this._eventHandler.seeked;
            option.onVolumeChange = this._eventHandler.volumeChange;
            option.onTimeUpdate = this._eventHandler.timeupdate;
            option.onFullScreenChange = this._eventHandler.fullScreenChange;
            this._mediaImpl.render($view, option);
        },
        renderImg: function () {// eLearning无此接口，留空不实现
        },
        mediaOnStart: function (callback) {// ok
            if ($.type(callback) === 'function') {
                this._mediaImpl.mediaOnStart(callback);
            }
        },
        mediaOnPause: function (callback) {// ok
            if ($.type(callback) === 'function') {
                this._mediaImpl.mediaOnPause(callback);
            }
        },
        mediaOnEnded: function (callback) {// ok
            if ($.type(callback) === 'function') {
                //this._eventHandler.ended = callback;
                this._mediaImpl.mediaOnEnded(callback);
            }
        },
        mediaOnTimeupdate: function (callback) {// eLearning无该api
            if ($.type(callback) === 'function') {
                this._eventHandler.timeupdate = callback;
            }
        },
        mediaOnVolumeChange: function (callback) {// eLearning无该api
            if ($.type(callback) === 'function') {
                this._eventHandler.volumeChange = callback;
            }
        },
        mediaOnSeeked: function (callback) {// ok
            if ($.type(callback) === 'function') {
                this._mediaImpl.mediaOnSeeked(callback);
            }
        },
        mediaPlay: function () {// ok
            this._mediaImpl.mediaPlay();
        },
        mediaPause: function () {// ok
            this._mediaImpl.mediaPause();
        },
        mediaPauseAll: function () {// ok
            this._mediaImpl.mediaPauseAll();
        },
        mediaSkip: function () {// has
            this._mediaImpl.seek();
        },
        mediaVolumeChange: function () {// has
            this._mediaImpl.setVolume();
        },
        mediaOnFullScreenChange: function (callback) {// ok
            if ($.type(callback) === 'function') {
                this._mediaImpl.mediaOnFullScreenChange(callback);
                this._fullChangeEvent.push(this._eventHandler.fullScreenChange);
            }
        },
        mediaOnFullScreen: function (callback) {
            if ($.type(callback) === 'function') {
                this._mediaImpl.mediaOnFullScreen(callback);
            }
        },
        mediaOnFullScreenExit: function (callback) {
            if ($.type(callback) === 'function') {
                this._mediaImpl.mediaOnFullScreenExit(callback);
            }
        },
        destroy: function () {
            this._fullChangeEvent.remove(this._eventHandler.fullScreenChange);
            this._mediaImpl.destroy();
        },
        setLock: function () {
        }
    };

    return eMediaPlayer;
});
define('player/media/eMedia', function () {
    var eLearningMediaPlayer = require('player/media/eLearningMediaPlayer');
    var ndMediaPlayer = require('player/media/ndMediaPlayer');
    var Media = require('player/media/mediaApi');

    //扩展media对象api
    var extendMedia = function (media) {
        var methods = [
            'create', 'render', 'renderImg', 'mediaOnStart', 'mediaOnPause',
            'mediaOnEnded', 'mediaOnTimeupdate', 'mediaOnSeeked', 'mediaOnVolumeChange',
            'mediaPlay', 'mediaPause', 'mediaSkip', 'mediaVolumeChange', 'mediaOnFullScreenChange', 'mediaPauseAll', 'setLock'
        ];
        var method;
        var isComplete = true;
        for (var index = 0; index < methods.length; index++) {
            method = methods[index];
            if (!media[method] || $.type(media[method]) !== 'function') {
                isComplete = false;
                break;
            }
        }
        if (isComplete) {
            $.extend(Media, media);
        } else {
            throw 'QtiPlayer.extendMedia输入错误,请确认输入的对象是否有实现所有的api';
        }
    };

    extendMedia(eLearningMediaPlayer);

    if (ndMediaPlayer.isValid()) {
        Media.renderImg = (function () {
            var that = ndMediaPlayer;
            return function () {
                var args = Array.prototype.slice.apply(arguments, [0]);
                return ndMediaPlayer.renderImg.apply(that, args);
            }
        })();
    }
    return Media;
});

define('player/media/lowVersionMediaPlayer', [], function () {

    var _emptyFunc = function () {
    };

    var mediaPlayer = {
        _fullChangeEvent: {
            onFullScreenChange: [],
            trigger: function (isFull) {
                this.onFullScreenChange.forEach(function (callback) {
                    if (callback) {
                        callback(isFull);
                    }
                })
            },
            push: function (callback) {
                this.onFullScreenChange.push(callback);
            },
            remove: function (callback) {
                var len = this.onFullScreenChange.length;
                for (var i = 0; i < len; i++) {
                    if (callback === this.onFullScreenChange[i]) {
                        this.onFullScreenChange.splice(i, 1);
                        i--;
                        len--;
                    }
                }
            }
        },
        _mediaImpl: window.NDMediaPlayer,
        _eventHandler: null,
        create: function () {
            var instance = $.extend({}, this);
            instance._eventHandler = {
                play: _emptyFunc,
                pause: _emptyFunc,
                ended: _emptyFunc,
                timeupdate: _emptyFunc,
                seeked: _emptyFunc,
                volumeChange: _emptyFunc,
                fullScreenChange: _emptyFunc
            };
            return instance;
        },
        render: function ($view, option) {
            option.onPlay = this._eventHandler.play;
            option.onPause = this._eventHandler.pause;
            option.onEnd = this._eventHandler.ended;
            option.onSeek = this._eventHandler.seeked;
            option.onVolumeChange = this._eventHandler.volumeChange;
            option.onTimeUpdate = this._eventHandler.timeupdate;
            option.onFullScreenChange = this._eventHandler.fullScreenChange;
            $view.find('audio').removeAttr('height');
            $view.find('audio').removeAttr('width');
            $view.find('audio').removeAttr('poster');
            $view.find('video,audio').mediaelementplayer({});
        },
        renderImg: function ($img, option) {
            // do nothing
        },
        mediaOnStart: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.play = callback;
            }
        },
        mediaOnPause: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.pause = callback;
            }
        },
        mediaOnEnded: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.ended = callback;
            }
        },
        mediaOnTimeupdate: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.timeupdate = callback;
            }
        },
        mediaOnVolumeChange: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.volumeChange = callback;
            }
        },
        mediaOnSeeked: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.seeked = callback;
            }
        },
        mediaPlay: function (mediaType, index) {
            this._mediaImpl.mediaPlay(mediaType, index);
        },
        mediaPause: function (mediaType, index) {
            this._mediaImpl.mediaPause(mediaType, index);
        },
        mediaPauseAll: function (obj) {
            this._mediaImpl.mediaPauseAll(obj);
        },
        mediaSkip: function (mediaType, index, seeked) {
            this._mediaImpl.mediaSkip(mediaType, index, seeked);
        },
        mediaVolumeChange: function (mediaType, index, volume, diaplay) {
            this._mediaImpl.mediaVolumeChange(mediaType, index, volume, diaplay);
        },
        mediaOnFullScreenChange: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.fullScreenChange = callback;
                this._fullChangeEvent.push(this._eventHandler.fullScreenChange);
            }
        },
        destroy: function () {
            this._fullChangeEvent.remove(this._eventHandler.fullScreenChange);
        },
        setLock:function(lock,view){
            //TODO:
        }
    };


    return mediaPlayer;
});

define('player/media/media', function () {

    var lowVersionMediaPlayer = require('player/media/lowVersionMediaPlayer');
    var defaultMediaPlayer = require('player/media/defaultMediaPlayer');
    var ndMediaPlayer = require('player/media/ndMediaPlayer');
    var Media = require('player/media/mediaApi');

    //扩展media对象api
    var extendMedia = function (media) {
        var methods = [
            'create', 'render', 'renderImg', 'mediaOnStart', 'mediaOnPause',
            'mediaOnEnded', 'mediaOnTimeupdate', 'mediaOnSeeked', 'mediaOnVolumeChange',
            'mediaPlay', 'mediaPause', 'mediaSkip', 'mediaVolumeChange', 'mediaOnFullScreenChange', 'mediaPauseAll', 'setLock'
        ];
        var method;
        var isComplete = true;
        for (var index = 0; index < methods.length; index++) {
            method = methods[index];
            if (!media[method] || $.type(media[method]) !== 'function') {
                isComplete = false;
                break;
            }
        }
        if (isComplete) {
            $.extend(Media, media);
        } else {
            throw 'QtiPlayer.extendMedia输入错误,请确认输入的对象是否有实现所有的api';
        }
    };

    // qti内置的媒体播放器
    if (typeof Audio == typeof undefined) {
        extendMedia(lowVersionMediaPlayer);
        //扩充渲染img接口
        if (ndMediaPlayer.isValid()) {
            Media.renderImg = (function () {
                var that = ndMediaPlayer;
                return function () {
                    var args = Array.prototype.slice.apply(arguments, [0]);
                    return ndMediaPlayer.renderImg.apply(that, args);
                }
            })();
        }
    } else if (ndMediaPlayer.isValid()) {
        extendMedia(ndMediaPlayer);
    } else {
        extendMedia(defaultMediaPlayer);
    }


    return Media;
});

define('player/media/mediaApi', function () {

    var Media = {
        create: function () {
        },
        render: function ($view, option) {
        },
        renderImg: function ($view) {
        },
        mediaOnStart: function (callback) {
        },
        mediaOnPause: function (callback) {
        },
        mediaOnEnded: function (callback) {
        },
        mediaOnTimeupdate: function (callback) {
        },
        mediaOnVolumeChange: function (callback) {
        },
        mediaOnSeeked: function (callback) {
        },
        mediaPlay: function (mediaType, index) {
        },
        mediaPause: function (mediaType, index) {
        },
        mediaPauseAll: function () {
        },
        mediaSkip: function (mediaType, index, seeked) {
        },
        mediaVolumeChange: function (mediaType, index, volume, diaplay) {
        },
        mediaOnFullScreenChange: function (callback) {
        },
        destroy: function () {
        },
        setLock: function (lock, view) {
        }
    };
    return Media;
});

define('player/media/ndMediaPlayer', function () {

    var isAvi = !!window.AviMediaPlayer;
    var mediaImpl = window.AviMediaPlayer || window.NDMediaPlayer;

    var _emptyFunc = function () {
    };

    var mediaPlayer = {
        _fullChangeEvent: {
            onFullScreenChange: [],
            trigger: function (isFull) {
                this.onFullScreenChange.forEach(function (callback) {
                    if (callback) {
                        callback(isFull);
                    }
                })
            },
            push: function (callback) {
                this.onFullScreenChange.push(callback);
            },
            remove: function (callback) {
                var len = this.onFullScreenChange.length;
                for (var i = 0; i < len; i++) {
                    if (callback === this.onFullScreenChange[i]) {
                        this.onFullScreenChange.splice(i, 1);
                        i--;
                        len--;
                    }
                }
            }
        },
        isValid: function () {
            return !!mediaImpl;
        },
        getMediaImpl: function () {
            return mediaImpl;
        },
        _mediaImpl: mediaImpl,
        _eventHandler: null,
        create: function () {
            var instance = $.extend({}, this);
            instance._eventHandler = {
                play: _emptyFunc,
                pause: _emptyFunc,
                ended: _emptyFunc,
                timeupdate: _emptyFunc,
                seeked: _emptyFunc,
                volumeChange: _emptyFunc,
                fullScreenChange: _emptyFunc
            };
            return instance;
        },
        render: function ($view, option) {
            var that = this;
            option.onPlay = this._eventHandler.play;
            option.onPause = this._eventHandler.pause;
            option.onEnd = this._eventHandler.ended;
            option.onSeek = this._eventHandler.seeked;
            option.onVolumeChange = this._eventHandler.volumeChange;
            option.onTimeUpdate = this._eventHandler.timeupdate;
            option.onFullScreenChange = this._eventHandler.fullScreenChange;
            if (option && typeof Audio == typeof undefined) {
                //ie8不渲染video\audio
                if (!option.video) {
                    option.video = {};
                }
                option.video.render = false;
                if (!option.audio) {
                    option.audio = {}
                }
                option.audio.render = false;
            }
            option.lock = option.lockMedia;
            option.onFullScreenChange = function (isFull) {
                that._fullChangeEvent.trigger(isFull);
            };
            this._mediaImpl.render($view, option);
        },
        renderImg: function ($img, option, lang, lock) {
            var that = this;

            var defaultOption = {
                video: {
                    render: false
                },
                audio: {
                    render: false
                },
                img: {
                    render: true,
                    renderUI: true,
                    renderImmediately: true
                },
                lang: lang,
                lock: lock
            };

            defaultOption.onFullScreenChange = function (isFull) {
                that._fullChangeEvent.trigger(isFull);
            };

            $.extend(defaultOption.img, option);
            if (isAvi) {
                this._mediaImpl.render($img, defaultOption);
            } else {
                this._mediaImpl.renderMediaEle($img, defaultOption);
            }

        },
        mediaOnStart: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.play = callback;
            }
        },
        mediaOnPause: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.pause = callback;
            }
        },
        mediaOnEnded: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.ended = callback;
            }
        },
        mediaOnTimeupdate: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.timeupdate = callback;
            }
        },
        mediaOnVolumeChange: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.volumeChange = callback;
            }
        },
        mediaOnSeeked: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.seeked = callback;
            }
        },
        mediaPlay: function (mediaType, index) {
            if (isAvi) {
                this._mediaImpl.play(mediaType + '-' + index);
            } else {
                this._mediaImpl.mediaPlay(mediaType, index);
            }
        },
        mediaPause: function (mediaType, index) {
            if (isAvi) {
                this._mediaImpl.pause(mediaType + '-' + index);
            } else {
                this._mediaImpl.mediaPause(mediaType, index);
            }
        },
        mediaPauseAll: function (obj) {
            if (isAvi) {
                this._mediaImpl.pauseAll(obj);
            } else {
                this._mediaImpl.mediaPauseAll(obj);
            }
        },
        mediaSkip: function (mediaType, index, seeked) {
            if (isAvi) {
                this._mediaImpl.seek(mediaType + '-' + index, seeked);
            } else {
                this._mediaImpl.mediaSkip(mediaType, index, seeked);
            }
        },
        mediaVolumeChange: function (mediaType, index, volume, diaplay) {
            if (isAvi) {
                this._mediaImpl.changeVolume(mediaType + '-' + index, volume);
            } else {
                this._mediaImpl.mediaVolumeChange(mediaType, index, volume, diaplay);
            }
        },
        mediaOnFullScreenChange: function (callback) {
            if ($.type(callback) === 'function') {
                this._eventHandler.fullScreenChange = callback;
                this._fullChangeEvent.push(this._eventHandler.fullScreenChange);
            }
        },
        destroy: function () {
            this._fullChangeEvent.remove(this._eventHandler.fullScreenChange);
        },
        setLock: function (lock, view) {
            this._mediaImpl.setLock(lock, view);
        }
    };


    return mediaPlayer;
});

define('player/model/modelHandlerFactory', ['model/logger'], function (_logger) {

    var modelHandlerFactory = {
        _modelHandler: {},
        _logger: _logger,
        //值否支持该模型
        isSupport: function (modelName) {
            var result = false;
            if (this._modelHandler[modelName]) {
                result = true;
            }
            return result;
        },
        //注册modelHandler,每个model对应一种特定的AssessmentItem类型
        register: function (modelHandler) {
            if (modelHandler.getName && modelHandler.create) {
                this._logger.debug('_modelHandlerFactory:regiser modelHandler:' + modelHandler.getName());
                this._modelHandler[modelHandler.getName()] = modelHandler;
            }
        },
        //获取model
        getModelHandler: function (modelName) {
            return this._modelHandler[modelName];
        }
    };
    return modelHandlerFactory;
});

define('player/model/modelItem', ['model/logger', 'player/model/modelHandlerFactory'], function (_logger, _modelHandlerFactory) {


    var Optional = require('player/assessment/assessmentItem/Optional');

    //定义ModelItem，负责每model的展示和数据存储
    var ModelItem = {
        _logger: _logger,
        _modelHandlerFactory: _modelHandlerFactory,
        _event: null,
        _assessmentItem: null,
        _model: null,
        _option: null,
        create: function (assessmentItem, model, event) {
            var instance = $.extend({}, this);
            //属性赋值
            instance._model = model;
            instance._assessmentItem = assessmentItem;
            instance._event = event;
            //创建渲染方法
            var modelHandler = this._modelHandlerFactory.getModelHandler(instance._model.modelType);
            if (modelHandler) {
                modelHandler.create(instance);
            } else {
                this._logger.error('model:' + instance._model.modelType + '不存在');
            }
            return instance;
        },
        setOption: function (option) {
            this._option = option;
        },
        getOption: function () {
            return this._option;
        },
        triggerOptionClick: function (index, val) {
            //index:每个modalitem内部答案的索引，默认0
            var param = {
                identifier: this._model.modelId,
                index: index,
                val: val
            };
            this._event.trigger('assessmentItem', 'optionClick', param);
        },
        hasNum: function () {
            return true;
        },
        hasHint: function () {
            return true;
        },
        hasTitle: function () {
            return true;
        },
        isBlock: function () {
            return true;
        },
        getName: function () {
            return '';
        },
        getClassName: function () {
            return '';
        },
        getLogger: function () {
            return this._logger;
        },
        getModel: function () {
            return $.extend(true, {}, this._model);
        },
        createOptionalHtml: function (option) {
            return Optional.getOptionalHtml(option);
        },
        getAnswer: function () {
            var answer = this._assessmentItem.state.getAnswer(false)[this._model.modelId].value;
            var newAnswer = [];
            newAnswer.pushArray(answer);
            return newAnswer;
        },
        getStat: function () {
            return this._assessmentItem.statistics.getStat(this._model.modelId) || {};
        },
        getCorrectAnswer: function () {
            var answer = [];
            var correctAnswer = this._assessmentItem.getItemModel(false).correctAnswer[this._model.modelId];
            if (correctAnswer) {
                answer.pushArray(correctAnswer.value);
            }
            return answer;
        },
        setAnswer: function (answer, reset) {
            this._assessmentItem.setAnswer(answer, this._model.modelId, reset);
        },
        checkTextAnswer: function (correctValue, currentValue) {
            return this._assessmentItem.checkTextAnswerValue(this._model.modelId, correctValue, currentValue);
        },
        bindEvent: function ($view, option) {
            var that = this;
            this.eventHandle($view, option);
            Optional.eventHandler($view, this._assessmentItem);
        },
        showAnswer: function ($view) {
            this._option.showAnswer = true;
            this._option.showCorrectAnswer = false;
            this._option.showCheckedAnswer = false;
            this._option.showStatisAnswer = false;
            if (this.renderReset) {
                this.renderReset($view);
            }
            if (this.renderAnswer) {
                this.renderAnswer($view);
            }

            var checked = this._assessmentItem.state.getAnswer(false)[this._model.modelId].checked || false;
            Optional.renderAnswer($view, checked);

            this.selfRenderLock($view);
        },
        showCheckedAnswer: function ($view) {
            this._option.showCorrectAnswer = false;
            this._option.showAnswer = false;
            this._option.showCheckedAnswer = true;
            this._option.showStatisAnswer = false;
            if (this.renderReset) {
                this.renderReset($view);
            }
            if (this.renderCheckedAnswer) {
                this.renderCheckedAnswer($view);
            }

            var checked = this._assessmentItem.state.getAnswer(false)[this._model.modelId].checked || false;
            Optional.renderAnswer($view, checked);

            this.selfRenderLock($view);
        },
        showUsrAndCorrectAnswer: function ($view) {
            this._option.showCorrectAnswer = true;
            this._option.showAnswer = true;
            this._option.showCheckedAnswer = false;
            this._option.showStatisAnswer = false;
            if (this.renderReset) {
                this.renderReset($view);
            }
            if (this.renderUsrAndCorrectAnswer) {
                this.renderUsrAndCorrectAnswer($view);
            }

            this.selfRenderLock($view);
        },
        showCorrectAnswer: function ($view) {
            this._option.showCorrectAnswer = true;
            this._option.showAnswer = false;
            this._option.showCheckedAnswer = false;
            this._option.showStatisAnswer = false;
            if (this.renderReset) {
                this.renderReset($view);
            }
            if (this.renderCorrectAnswer) {
                this.renderCorrectAnswer($view);
            }

            this.selfRenderLock($view);
        },
        showStatisAnswer: function ($view) {
            this._option.showAnswer = false;
            this._option.showCorrectAnswer = false;
            this._option.showCheckedAnswer = false;
            this._option.showStatisAnswer = true;
            if (this.renderReset) {
                this.renderReset($view);
            }
            if (this.renderStatisAnswer) {
                this.renderStatisAnswer($view);
            }
            this.selfRenderLock($view);
        },
        reset: function ($view) {
            this._option.showCorrectAnswer = false;
            this._option.showAnswer = false;
            this._option.showCheckedAnswer = false;
            this._option.showStatisAnswer = false;

            //重置当前用户答案
            this.setAnswer([], true);

            if (this.renderReset) {
                //排序题默认有答案，重置后也需要有答案
                var answer = this.renderReset($view);
                if (answer) {
                    this.setAnswer(answer);
                }
            }

            this.setLock($view, false);
        },
        setAnswerAreaVisible: function ($view, visible) {
            this._option.hideAnswerArea = !visible;
            if (this.renderAnswerAreaVisible) {
                this.renderAnswerAreaVisible($view, visible);
            }
        },
        setLock: function ($view, lock) {
            this._option.showLock = lock;
            this.selfRenderLock($view);
        },
        selfRenderLock: function ($view) {
            if (this.renderLock) {
                this.renderLock($view);
            }
            Optional.setLock($view, this.isLock());
        },
        isLock: function () {
            return this._option.showLock || this._option.showCorrectAnswer || this._option.showCheckedAnswer;
        }
    };
    return ModelItem;
});

// qti model
define('player/utils/area', function () {


    var area = {
        getRectIntersectArea: function (rect1, rect2) {
            var m = 0;
            //左上角
            if (rect1.l > rect2.l && rect1.l < rect2.r && rect1.t > rect2.t && rect1.t < rect2.b) {
                m = (rect2.r - rect1.l) * (rect2.b - rect1.t);
            }
            //右上角
            if (rect1.r > rect2.l && rect1.r < rect2.r && rect1.t > rect2.t && rect1.t < rect2.b) {
                var s = (rect1.r - rect2.l) * (rect2.b - rect1.t);
                if (s > m) {
                    m = s;
                }
            }
            //左下角
            if (rect1.l > rect2.l && rect1.l < rect2.r && rect1.b > rect2.t && rect1.b < rect2.b) {
                var s = (rect2.r - rect1.l) * (rect1.b - rect2.t);
                if (s > m) {
                    m = s;
                }
            }
            //右下角
            if (rect1.r > rect2.l && rect1.r < rect2.r && rect1.b > rect2.t && rect1.b < rect2.b) {
                var s = (rect1.r - rect2.l) * (rect1.b - rect2.t);
                if (s > m) {
                    m = s;
                }
            }
            //四个点都不相交
            if (rect1.l < rect2.l && rect1.r > rect2.r && rect1.t > rect2.t && rect1.b < rect2.b) {
                var s = (rect2.r - rect2.l) * (rect1.b - rect1.t);
                if (s > m) {
                    m = s;
                }
            }
            return m;
        },
        getInteractRect: function (l, t, h, w, targetRects) {
            var that = this;
            var rects,
                max = 0,
                matchCount = 0,
                matchIndex;

            targetRects.forEach(function (rect, i) {

                //计算面积
                var m = that.getRectIntersectArea({
                    l: l,
                    t: t,
                    r: l + w,
                    b: t + h
                }, rect);
                var cm = that.getRectIntersectArea(rect, {
                    l: l,
                    t: t,
                    r: l + w,
                    b: t + h
                });

                if (cm > m) {
                    m = cm;
                }

                if (m > 0) {
                    matchCount++;
                }

                if (m > max) {
                    max = m;
                    matchIndex = i;
                }
            });

            //匹配区域超过1个且匹配度不高，按最高匹配
            if (matchCount > 1) {
                rects = targetRects[matchIndex];
            } else if (max >= ((w * h * 2) / 5)) {
                rects = targetRects[matchIndex];
            }
            return rects;
        },
        //点到线的距离
        pointToLine: function (x1, y1, x2, y2, x0, y0) {
            var space = 0;
            var a, b, c;
            a = this.lineSpace(x1, y1, x2, y2);// 线段的长度
            b = this.lineSpace(x1, y1, x0, y0);// (x1,y1)到点的距离
            c = this.lineSpace(x2, y2, x0, y0);// (x2,y2)到点的距离
            if (c <= 0.000001 || b <= 0.000001) {
                space = 0;
                return space;
            }
            if (a <= 0.000001) {
                space = b;
                return space;
            }
            if (c * c >= a * a + b * b) {
                space = b;
                return space;
            }
            if (b * b >= a * a + c * c) {
                space = c;
                return space;
            }
            var p = (a + b + c) / 2;// 半周长
            var s = Math.sqrt(p * (p - a) * (p - b) * (p - c));// 海伦公式求面积
            space = 2 * s / a;// 返回点到线的距离（利用三角形面积公式求高）
            return space;
        },
        // 计算两点之间的距离
        lineSpace: function (x1, y1, x2, y2) {
            var lineLength = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            return lineLength;
        }
    };
    return area;

});

// qti model
define('player/utils/browser', function () {

    var userAgent = window.navigator.userAgent.toLowerCase();

    // Figure out what browser is being used
    jQuery.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };

    var browser = {
        Android: function () {
            return navigator.userAgent.match(/Android/i) ? true : false;
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i) ? true : false;
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i) ? true : false;
        },
        any: function () {
            return (this.Android() || this.BlackBerry() || this.iOS() || this.Windows());
        },
        Mobile: function () {
            return (this.Android() || this.BlackBerry() || this.iOS() || this.Windows());
        },
        IEVersion: function () {
            var engine = 999999;
            if (window.navigator.appName == "Microsoft Internet Explorer" || window.navigator.appVersion.indexOf('MSIE') > 0) {
                // This is an IE browser. What mode is the engine in?
                if (document.documentMode) {
                    // IE8
                    engine = document.documentMode;
                }
                else // IE 5-7
                {
                    engine = 5; // Assume quirks mode unless proven otherwise
                    if (document.compatMode) {
                        if (document.compatMode == "CSS1Compat")
                            engine = 7; // standards mode
                    }
                }
                // the engine variable now contains the document compatibility mode.
            } else {
                var isIE11 = (/Trident\/7\./).test(navigator.userAgent);
                if (isIE11) {
                    engine = 11;
                }
            }
            return engine;
        },
        isIE:function(){
            return this.IEVersion() != 999999;
        }
    };


    return browser;

});

// qti model
define('player/utils/checkOption', ['player/config/skin', 'player/config/platform'], function (_skin, _platform) {

    var checkOption = function (option) {
        if (option && $.type(option) === 'object') {
            option = $.extend({}, option);
            //删除null,undefined项
            for (var name in option) {
                if (option[name] === null || option[name] === undefined) {
                    delete option[name];
                }
            }
            //用户输入answer相关渲染参数处理
            //处理逻辑:1、用户输入的答案渲染参数只能有一个为true，如果有多个true，按照以下顺序，保留第一个为true，其他赋值为false;
            //2、如果用户输入的参数全为false，或则没有输入任何参数，则hideAnswerArea为true，其他都为false
            var answerOptions = ['showAnswerArea', 'showAnswer', 'showCheckedAnswer', 'showCorrectAnswer', 'showStatisAnswer', 'hideAnswerArea'];
            var optionName;
            //判断是否有答案渲染项配置,如果没有定义答案渲染项
            var hasAnswerOption = false;
            for (var index = 0; index < answerOptions.length; index++) {
                optionName = answerOptions[index];
                if (option[optionName] !== undefined) {
                    //有答案渲染选项
                    hasAnswerOption = true;
                    break;
                }
            }
            if (hasAnswerOption) {
                //如果有答案渲染配置，判断是否有为true的答案渲染选项,保证只有一个渲染项为true
                var hasTrueAnswerOption = false;
                for (var index = 0; index < answerOptions.length; index++) {
                    optionName = answerOptions[index];
                    if (option[optionName] && hasTrueAnswerOption === false) {
                        hasTrueAnswerOption = true;
                        option[optionName] = true;
                    } else {
                        option[optionName] = false;
                    }
                }
                //如果有答案渲染项，但是所有渲染都为false，则隐藏答案渲染
                if (hasTrueAnswerOption === false) {
                    option.hideAnswerArea = true;
                }
            }
            //处理复合小题单独渲染参数
            if (option.modelId && $.type(option.modelId) !== 'array') {
                option.modelId = [];
            }
            //处理随机渲染参数
            if (option.randomSeed && $.type(option.randomSeed) !== 'array') {
                option.randomSeed = [];
            }

            if (option.platForm) {
                var platForm = _platform[option.platForm];
                option.platForm = platForm || '';
            }
            if (option.lang && $.type(option.lang) === 'string') {
                option.lang = option.lang.toLowerCase();
            }

            //重置主题和平台
            if (!option.skin && option.theme) {
                option.skin = option.theme;
            }
            if (option.skin) {
                //增加是否是elearning参数的判断
                option.isElearningSkin = (option.skin === 'elearning');
                var skinCls = _skin[option.skin];
                option.skin = skinCls || _skin.wood;
            }else{
                option.skin = _skin.wood;
            }


        } else {
            option = {};
        }
        return option;
    };

    return checkOption;

});

// qti model
define('player/utils/digitalKeyboard', function () {


    var digitalKeyboard = {
        able: function () {
            return typeof DigitalInput !== typeof undefined && DigitalInput.InputManager && DigitalInput.InputManager.getInstance;
        },
        getInstance: function () {
            if (this.able()) {
                return DigitalInput.InputManager.getInstance();
            }
        },
        /**
         * 关闭键盘
         * @param isBlur true 将失去焦点
         */
        closeKeyBoard: function (isBlur) {
            if (this.able() && this.getInstance().closeKeyBoard) {
                this.getInstance().closeKeyBoard(isBlur);
            }
        },
        /**
         * 光标是否在最后
         * @param el
         */
        isCursorLast: function (el) {
            if (this.able()) {
                return this.getInstance().isCursorLast(el);
            }
        },
        /**
         * 光标位置变化回调
         * @param el
         * @param callback
         */
        setCursorCallback: function (el, callback) {
            if (this.able()) {
                this.getInstance().setCursorCallback(el, callback);
            }
        },
        /**
         * 注册焦点变更监听
         * @param el
         * @param onFocus 获取焦点
         * @param onBlur 失去焦点
         */
        setFocusCallback4DOM: function (el, onFocus, onBlur) {
            if (this.able()) {
                this.getInstance().setFocusCallback4DOM(el, onFocus, onBlur);
            }
        },
        /**
         * 附加文本到光标后（没有光标则附加到最后）
         * @param answer 答案
         * @param el
         * @param focus 附加后是否获取到光标
         */
        appendText4DOM: function (answer, el, focus) {
            if (this.able()) {
                this.getInstance().appendText4DOM(answer, el, focus);
            }
        },
        /**
         * 清除文本
         * @param el
         * @param focus 是否获取焦点
         */
        clearText: function (el, focus) {
            if (this.able()) {
                this.getInstance().clearText(el, focus);
            }
        },
        /**
         * 设置文本内容
         * @param answer
         * @param el
         */
        setText4DOM: function (answer, el) {
            if (this.able()) {
                this.getInstance().setText4DOM(answer, el);
            }
        },
        /**
         * 如有焦点，则在光标出删除一单位，如无，则删除最后一个单位，并获得焦点
         * @param el
         */
        deleteText: function (el) {
            if (this.able()) {
                this.getInstance().deleteText(el);
            }
        },
        /**
         * 清除所有焦点
         */
        clearAllFocus: function () {
            if (this.able()) {
                this.getInstance().clearAllFocus();
            }
        },
        /**
         * 注册答案变更事件
         * @param el
         * @param onAnswerChange
         */
        register: function (el, onAnswerChange) {
            if (this.able()) {
                this.getInstance().register(el, onAnswerChange);
            }
        },
        /**
         * 获取答案内容
         * @param el
         * @returns {*|string}
         */
        getText4Dom: function (el) {
            if (this.able()) {
                return this.getInstance().getText4Dom(el);
            }
        },
        /**
         * 设置文本框是否可用
         * @param el
         * @param disabled true 不可用
         * @returns {*}
         */
        setDisabled4DOM: function (el, disabled) {
            if (this.able()) {
                this.getInstance().setDisabled4DOM(el, disabled);
            }
        },
        /**
         * 销毁某个实例
         * @param el
         */
        unRegister4Id: function (id) {
            if (this.able() && this.getInstance().unRegister4Id) {
                try {
                    this.getInstance().unRegister4Id(id);
                } catch (ex) {

                }
            }
        },
        /**
         * 获取光标的相关信息
         * @param el
         * @return {preChar:'',left:'',top:'',height:''}
         */
        getCursorPosAndPreChar: function (el) {
            if (this.able()) {
                return this.getInstance().getCursorPosAndPreChar(el);
            }
        },
        /**
         * 替换光标前的字符
         * @param el
         * @param char 用于替换的字符
         */
        replaceCursorPreChar: function (el, char) {
            if (this.able()) {
                this.getInstance().replaceCursorPreChar(el, char);
            }
        },
        /**
         * 获取光标索引 -1代表没有光标（既没有交点） 0~...
         * @param el
         * @return {*}
         */
        getCursorIndex: function (el) {
            if (this.able()) {
                return this.getInstance().getCursorIndex(el);
            }
        }
    };
    return digitalKeyboard;

});

// qti model
define('player/utils/dom', function () {


    var dom = {
        getParentElement: function ($el, className) {
            //$el = $el.parent();
            while (!$el.hasClass(className) && $el[0].nodeName.toLocaleLowerCase() != "body") {
                $el = $el.parent();
            }
            return $el;
        },
        toCenter: function (obj) {
            var screenHeight = 0;
            if (window.innerHeight)
                screenHeight = window.innerHeight;
            else if ((document.body) && (document.body.clientHeight))
                screenHeight = document.body.clientHeight;
            if (document.documentElement && document.documentElement.clientHeight) {
                screenHeight = document.documentElement.clientHeight;
            }
            var scrolltop = $(document).scrollTop();//获取当前窗口距离页面顶部高度
            var objTop = (screenHeight - obj.height()) / 2 + scrolltop;
            if (objTop < 0) {
                objTop = 50;
            }
            $(obj).css("top", objTop + "px");
            $(obj).css("position", "absolute");
            $(obj).show();
        },
        addListener: function (target, type, handler) {
            if (target.addEventListener) {
                target.addEventListener(type, handler, false);
            } else if (target.attachEvent) {
                target.attachEvent("on" + type, handler);
            } else {
                target["on" + type] = handler;
            }
        },
        allowNumKeyCodes: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 110, 109, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 108, 190, 8, 37, 38, 40, 39, 46, 189],
        allowNumKeyDown: function () {
            var eventKeyCode = event.keyCode;
            if (event.shiftKey) {
                eventKeyCode = 0;
            }
            var input = event.srcElement || event.target;
            var txtVal = input.value;
            var result = false;
            for (var i = 0; i < this.allowNumKeyCodes.length; i++) {
                var keyCode = this.allowNumKeyCodes[i];
                if (eventKeyCode === keyCode) {
                    if (eventKeyCode == 109 || eventKeyCode == 189) {//负号
                        if (txtVal.length == 0) {
                            input.value = '';
                            result = true;
                        } else {
                            result = !(txtVal.toString().indexOf('-') > -1);
                        }
                    } else if (eventKeyCode == 190 || eventKeyCode == 110) {//小数点
                        if (txtVal.length == 0) {
                            input.value = '';
                        }
                        result = !(txtVal.toString().indexOf('.') > -1);
                    } else {
                        result = true;
                    }
                    break;
                }
            }
            input.setAttribute("key-result", result + "|" + eventKeyCode + "|" + event.ctrlKey);
            return result;
        },
        allowNumInput: function () {
            var input = event.srcElement || event.target;
            var keydown = input.getAttribute("key-result");
            var inputResults = keydown != null ? keydown.split('|') : [];
            if (inputResults.length < 3) {//黏贴
                if (input.value == '') {
                    input.value = '';
                }
                return false;
            }
            if (input.value.length > 0) {
                return;
            }
            var keyResult = inputResults[0],
                eventKeyCode = inputResults[1],
                ctrl = inputResults[2],
                inputPreVal = input.getAttribute("pre-v") || '';

            if (keyResult == "true" || ctrl == "true") {
                if (inputPreVal != "" && input.value == "" && eventKeyCode != 37 && eventKeyCode != 39 && eventKeyCode != 8 && eventKeyCode != 46 && eventKeyCode != 38 && eventKeyCode != 40 && !(ctrl && eventKeyCode == 88)) {
                    input.value = inputPreVal;
                } else if (ctrl && eventKeyCode == 86) {
                    input.value = input.value;
                }
                input.setAttribute("pre-v", input.value);
            } else {
                input.value = inputPreVal;
            }
            input.setAttribute('key-result', '');
            return false;
        },
        getCursorPos: function ($dom) {
            var el = $dom.get(0);
            var pos = 0;
            if ('selectionStart' in el) {
                pos = el.selectionStart;
            } else if ('selection' in document) {
                el.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -el.value.length);
                pos = Sel.text.length - SelLength;
            }
            return pos;
        },
        //兼容ie11和ff的方法
        getSelectedText: function () {
            var selText = "";
            if (window.getSelection) {  // all browsers, except IE before version 9
                var sel = document.activeElement;
                if (sel &&
                    (sel.tagName.toLowerCase() == "textarea" ||
                    (sel.tagName.toLowerCase() == "input" &&
                    ((sel.getAttribute("type").toLowerCase() == "text") || sel.getAttribute("type").toLowerCase() == "number")))) {
                    var text = sel.value;
                    selText = text.substring(
                        sel.selectionStart,
                        sel.selectionEnd
                    );
                }
                else {
                    var selRange = window.getSelection();
                    selText = selRange.toString();
                }
            } else {
                if (document.getSelection) {  // all browsers, except IE before version 9
                    range = document.getSelection();
                    selText = range.toString();
                } else if (document.selection.createRange) { // IE below version 9
                    var range = document.selection.createRange();
                    selText = range.text;
                }
            }
            return selText;
        },
        inputNumberKeydown: function ($input, e) {
            var val = $input.val();
            var eventKeyCode = e.keyCode;
            var result = true;
            var cursorPos = this.getCursorPos($input);
            var selectText = this.getSelectedText();
            var selectTextLength = selectText.length;

            if (eventKeyCode == 109 || eventKeyCode == 189) {//负号
                if (val.length == 0) {
                    $input.val('');
                    result = true;
                } else {
                    result = (val.toString().indexOf('-') <= -1)
                        || selectText.indexOf('-') >= 0;
                }
            } else if (eventKeyCode == 190 || eventKeyCode == 110) {//小数点
                if (val.length == 0) {
                    $input.val('')
                }

                var index = val.toString().indexOf('.');
                result = (index <= -1) || selectText.indexOf('.') >= 0;
            } else {
                result = true;
            }
            if (!result) {
                return false;
            }


            //allow first letter
            if ((val === '' || this.getCursorPos($input) === 0)
                && (e.keyCode === 189 || e.keyCode === 109 )
                && val.indexOf('-') < 0
                || (val.substring(0, 1) === '-'
                && cursorPos === 0
                && selectTextLength > 0
                && (e.keyCode === 189 || e.keyCode === 109 ))
            ) {
                return;
            }
            var index = val.indexOf('.');

            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
                    // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }
            //不允许在-号前输入字符
            if (val.substring(0, 1) === '-'
                && this.getCursorPos($input) === 0 && selectTextLength <= 0
                && (e.keyCode !== 189 || e.keyCode !== 109)) {
                e.preventDefault();
                return false;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
                return false;
            }
        },
        getTxtCursorPos: function (oTxt) {
            var cursurPos = -1;
            if (typeof oTxt.selectionStart !== typeof undefined) {//非IE浏览器
                cursurPos = oTxt.selectionStart;
            } else if (document.selection) {
                var range = oTxt.createTextRange();
                range.moveStart("character", -oTxt.value.length);
                cursurPos = range.text.length;
            }
            return cursurPos;
        },
        toTxtCursorIndex: function (index, dom) {
            if (dom.setSelectionRange) { // 标准浏览器
                dom.setSelectionRange(index, index)
            }
        },
        bindScrollState: function (dom, startCallback, endCallback) {
            var scrollStart = false;
            var lastScrollTop = 0;
            var lastScrollLeft = 0;

            $(dom).off('scroll.hw');

            var _setScrollState = function () {
                setTimeout(function () {
                    var scrollTop = $(dom).scrollTop();
                    var scrollLeft = $(dom).scrollLeft();

                    if (lastScrollTop === scrollTop && lastScrollLeft === scrollLeft) {
                        // Scroll End
                        scrollStart = false;
                        endCallback && endCallback();
                    } else {
                        _setScrollState();
                    }

                    lastScrollTop = scrollTop;
                    lastScrollLeft = scrollLeft;
                }, 350);
            };

            $(dom).on('scroll.hw', function () {
                if (!scrollStart) {
                    //scroll start
                    startCallback && startCallback();
                    _setScrollState();
                }
                scrollStart = true;
            });
        },
        upBindScrollState: function (dom) {
            $(dom).off('scroll.hw');
        }
    }
    return dom;

});

// qti model
define('player/utils/extendUtils', ['model/utils', 'player/config/lang', 'player/utils/checkOption', 'player/config/platForm'],
    function (_utils, _lang, _checkOption, _platForm) {

        var random = require('player/utils/random');
        var img = require('player/utils/img');
        var svg = require('player/utils/svg');
        var area = require('player/utils/area');
        var dom = require('player/utils/dom');
        var browser = require('player/utils/browser');
        var digitalKeyboard = require('player/utils/digitalKeyboard');
        var ndMediaPlayer = require('player/media/ndMediaPlayer');


        _utils.getPlatForm = function () {
            return _platForm;
        };

        //获取国际化参数值
        _utils.getLangText = function (key, option) {
            var lang = _lang[option.lang] ? _lang[option.lang] : _lang['zh'];
            var result = lang[key];
            if (result === null || result === undefined || result === '') {
                result = '';
            }
            return result;
        };

        _utils.checkOption = _checkOption;

        //扩展
        _utils.Svg = svg;

        _utils.Img = img;

        _utils.Rd = random;

        _utils.Area = area;

        _utils.Dom = dom;

        _utils.Broswer = browser;

        _utils.DigitalKeyboard = digitalKeyboard;

        _utils.NDMedia = ndMediaPlayer.getMediaImpl();

        _utils.Fn = {
            makeExtend: function (obj, subObj, ignore) {
                for (var key in subObj) {
                    obj[key] = function () {
                        var args = Array.prototype.slice.apply(arguments, [0]);
                        subObj.apply(obj, args);
                    }
                }
            }
        }
        return _utils;

    });

define('player/utils/imageLoader', ['model/logger', 'player/utils/extendUtils'], function (_logger, _utils) {

    var Media = require('player/media/media');
    var ndMediaPlayer = require('player/media/ndMediaPlayer');
    var _emptyFunc = function () {
    };

    //图片加载器
    var ImageLoader = {
        _waitingQueue: null,
        _loadQueue: null,
        _loadingIconData: null, //加载时显示图片
        _imageLoaderPool: null,
        _emptyIconData: null,
        _errorIconData: null, //加载错误显示图片
        _imageRegex: /<img([\s\S]*?)\/>/g,
        _srcRegex: /src="([\s\S]*?)"/,
        _widthRegex: /width="([\s\S]*?)"/,
        _heightRegex: /height="([\s\S]*?)"/,
        _dataClassRegex: /data-class="([\s\S]*?)"/,
        _dataWidthRegex: /data-width="([\s\S]*?)"/,
        _dataHeightRegex: /data-height="([\s\S]*?)"/,
        _lazyLoadRegex: /data-lazy-load="(true|false)"/,
        _renderMediaImgRegex: /data-media-img-render=(["'])([\s\S]*?)\1/, //默认使用多媒体渲染图片 {render:'true',renderUi:'false'} |true|false
        _loadingImageStart: false,
        _imageIndex: 0,
        _imageLoaderMaxNum: 6,
        create: function () {
            var instance = $.extend({}, this);
            instance._waitingQueue = [];
            instance._loadQueue = [];
            instance._emptyIconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=';
            instance._errorIconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADKUlEQVRIS6WVX0hTcRTHv2eba//UVuhLVBD5FAhRIJVNLZAoFAOF/hDOUIqiMiRRJIQso6QgJYTqYWXoQ1YK+hJhcyhUEBTRQ+JT9JKG+W+bTHdP5+76b7rNW56ny73nnM/5nnN+v0vQaQwYkGVPi7h/8I8SoOgJFT99xnmWHJCxSbyFFb5GfTM+PZG6AJwNJ5Lsz0F0VEvKPeOK/4zTi/G1IPoALttZGOmhACxafg6Kjgvk9XvWDeD9lu3YYOyU5HujkrHyEbNcQgPBH4kgCRVEBptjq5Pq66ViI5SwlstgBAhhKFwPb+B2ooEnBrhsu2EydEpLdiB1E5B7XAN4XwMTY/JAw6KimAb8X+KpiAvgXTAjzdEsGs4hPAcUVYAv3YvkoZYqoOsxYDSpO9WKkelK+oZQLEh8gMueDxO1S9BmzAnAXQMuq9cAngbA07gA+C0KT8rA3+oGjO1BqjPZ1gaDoSASpCooKANXNkt2AjVfXVKgfleUbkwFSukTJlZCYirgXEupHKpWSWaNBKjD3XcEfP2ZBrjpBgZ7tWFHjAMy8vPU729bE8Au61bZmhcgQ9aisyK3QkYmuKlH3R5QdSHw/bMADEv5FLwXqSXkDf5cDolSIGtJyLPVSpU35HGhPClQAGlbwA/eqBMAXckHRiUPLQOAZW1RB6//riSVVJpFAw6aM2Eyv5S3O6OksvinOMGNnVK1AGqKgUlZU2nXChvCXKiYfKGvqwCRtUy33ZeqLq7aBhVgsYJrn2gzaCwHZgKxAKraFkwGqmTgs1EK5LY8LHvXIQm0KzmWueu0t55bcV2EMIIwnaD+6XeLAM5CCuwOj7yYP6or4lUFyRuBY6Xah96nwJRcpKtbpH1nvEJo2k2DmIo0kV320zDhkUTYYpamnoPCcvDlZSe5W9qlnuSYxn7Z7QrqC3YQZ1u3IcnYLoM9EFf3PwPUqpUBhPkUca6jAQaulurNcQHzWwRXkebi65It+hO/RVqfQnKF3CE+ZP8lnukJpjbfV5lD1HWt51/FIwJwDEmGjDUB/+PAyrC0yJot2+CSySf9T464MSTngNmnR+e6uH8BvXgVNfoEydIAAAAASUVORK5CYII=';
            instance._loadingIconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAvCAYAAACsaemzAAAHnklEQVRoQ9WZa2xTZRjHn3N6ejnttq7bgDEYhTHNGLDB5CIk4ETAEOWabCRqjPgJ1Eg0ihATQ2KMaCKaIeoHgQ/GKAYhYQQCARMkwrhs2QXGBiwwUMdtjN26de3p8f+ctlvXtYOtXS1vc3Ju7Tnv7/0/t/etQEHt8uXLL4qi+B0uZwXfi+dzVVWvC4KwRQjs5IULF/QJCQm/4cYqvu69qcYzh9ZLfw89Hk95P6DS0lJzdnb2ESi0kL/UIsjkFCQfWPxxcR+NqkI21aH1UVGUW2GBPCSoteJo5aEoS31jEF9QKjCsahdNVe6SCJ0eE8gEoPhsrFCy2k25kQGxXiLpyAkN3TjWkSIYfZYcW3+LApBAOoxIZvcxmtB1jIyeFnKJCXTLtIQa5WXkEiwBLjryqkYMJJBCeW0llNu5myTYLtsw66WQga5Ziqki6SNyC+aYRcaIgNi0xvScpcIHG8jgadNg+pqKc4lO27bRdXkV7igjL49v2IbtQwyU3/415bXv0PwmuInkpqvmtVSW/FlMYPwZMgIgkWa3fkpTOveQB2qEArouL6e/bF9pQSMWLWKTm+z4nZ59uCWk47OZVSa+RzWJ7+C+JxY8WoUQgUICyZ5mWvDgXUp3lpFHYLNjP2I9FGqRptDJlB3UJmUNG0jwKevB81TVQyLe4b3GPjowJUQE5LVZkWyuOvhRCQLEOS3ScYS7b5gJZd6mu4aCYYVt7rRbdVKz6x+647pBbe771IP0kCAmU4p+HI01TCaLzjoAKmIgP5SE2snqbvDmISGRWvXZ1IP9UE2Ngz6r0eRsoKtd5+lOzw1yAYQ76tWetBRuldIoW55Fk+WZpEcS96sVFSCvc3irBX/zggytSmBVujztdKnzFDV0VWggfpMLdkAGEPGxm6bTzMQlZBaTeo0wrA9t3bpVXLx4sSU1NfUQV9t9xWn0aznueIv7NlW0H6Wmnmu+jPboipHBMo05NDdpBZlQoXhwHhaourra5nK5Us1m848Aem6kgNjM7rlu0fm2Q/TA/W9YVcKHSZWeMs+hgoSlCBoGAHWFLk4rKyufxqzPajKZvgRQ4UgAsTLNrr/pTNsBeui+MwwYv8GLML2llGOep00fQlbbly5dWoAZn06SpE8A9PxgQDzK3iquv9/4r4UKsV4za6IzrQeGqUz/Qouj3sLkVyhLl0JTlNsD50MAehU/aQbMpkcBcVi957qphVe32qO9ySDKlIRoZJPGUpIulXSCHrjeBMugDgSAM637fT4TeSXBz86SC2gplJqm3B8IVFdX9zF8qFKv17+PNYVFwQpxp9yqi651lVOd4zR1Kq1ah/0asUtjcgFnNVOaPhMvm4H8kU0S7NyFHFPefkT7LT8nOk1FCJdpuXU1LdLxtEXpm7FyhCsuLt6JKeyhUEAivu6CEtUdJ+iK4xz/NGzHvOaG2hsgdtM0mm4ppJvOWqpsP96rWHSACMPpofnybHrNPMOb0fxrCljtMWO1Zx8U2hkM1Io1BQUwVYCpd5wNWYKE6yDD2aQxyDcd1O3pjKI63jcqgJhjyqd1ljn9gaqqqsYbjcZDINyi0+k+CDa5WiS/6o4/hgTjh2Qor5FFy9T6ho8VYqA3goGwuDgPEPsBtA5AH/qBLovpykXXDYmduQfhMXr2Hx2jGwxoDSLbbpjcWoTtTQyEYkM9q+qU0raDUsuwEmB0Oj3YU8ICIcJtBMQ2AK0KBPrFcVE51VUmcVCIxxYWqLa29hsotMHtdq8IBNrTUaacc9ZIuhjNQIc6aCGBeD3bYrH8CoVeDgV0HkBc6cZjCwdkBRCvZxfA5FYGK/TEASFkT0JBehwKZAT7EJvcEwdUU1MzH8m0FCYnA2j1E68QitIiQPyEqYMCH1oTCLRbCwrVcRsUuFKYa5rRv1JAUt0M//kcQI5AIGR2dZ+jQq1wXhHjNcox0DOmHFqDQlhbkuZaDiF7F6qDNwcCETlQJXejwo7nZsI0xYyFE622U5RGAUn1hFYZQCH40Es4LoJPveWfx8QzTGC9yMfo/0Ghvr6+Acf8BzGvsK9vbGw8nJaWth7Hdl9FObTlnNiOAMbfu+IJQW60tLTsYoWcuGjw9eMWbuwE6VVMx0X+dmz79/hv477BxBwQ4OTKlSs78Ett4AUEhbsICqMCHgUm/BMb5w08IvpZ39HR8cKsWbOa/N0VysvL12EutBFQ47Al4oYhnpUJHGdY0Z+dnZ3LAOToBWKVjh49OgrVwhjkoLGAmwCwTGwTEP3GY58OwFR8LwnHJp/NxoV+APp57969r2MJoffvjsF8RNi+fbspJycnAbApAGVgVjET+4mAHQe4DJyPxmYFoRl7fSxJ4UNf5Obmbg5857CdHqNisNvt5oyMDBtWW0cDcgzCvR17O0BZWd4Y1obzETFlFAIbpk6d+kNUgAZToqioSFdYWChDXSsgU6FmusFgYDPOxDFDZwJyNLY0bFZsxqGaMgJCD9rqvLy8wyMO9Aiz6zVlQNpkWWZYNuXxbMqsLraxAOfIa8V1MwMHPxP+cxNAS/Pz8+v/b6BBeUtKSozp6emW5ORk/uMgnVUFcBZgJwFsEs4nsjrIld82NDR8j/XEfinmP8t8qmxgb+JWAAAAAElFTkSuQmCC';
            instance._imageLoaderPool = [];
            var poolNum = 0;
            while (poolNum < instance._imageLoaderMaxNum) {
                instance._imageLoaderPool.push(new Image());
                poolNum++;
            }
            return instance;
        },
        _getImageLoader: function () {
            return this._imageLoaderPool.shift();
        },
        _returnImageLoader: function (imageLoader) {
            imageLoader.onerror = _emptyFunc;
            imageLoader.onload = _emptyFunc;
            imageLoader.src = this._emptyIconData;
            this._imageLoaderPool.push(imageLoader);
        },
        parseImage: function ($view, html, option) {
            var that = this;
            var resultHtml = html.replace(that._imageRegex, function (imageInfo) {
                var src = _utils.getValue(imageInfo, that._srcRegex);
                var result = '';
                if (src !== '') {
                    var lazyLoad = _utils.getValue(imageInfo, that._lazyLoadRegex);
                    if (lazyLoad === 'false') {
                        result = imageInfo;
                    } else {
                        var imageId = 'qp-loading-image-' + that._imageIndex;
                        var clazz = _utils.getValue(imageInfo, that._dataClassRegex);

                        var width = parseInt(_utils.getValue(imageInfo, that._dataWidthRegex));
                        if (!width) {
                            width = parseInt(_utils.getValue(imageInfo, that._widthRegex));
                            if (!width) {
                                width = 0;
                            }
                        }
                        var height = parseInt(_utils.getValue(imageInfo, that._dataHeightRegex));
                        if (!height) {
                            height = parseInt(_utils.getValue(imageInfo, that._heightRegex));
                            if (!height) {
                                height = 0;
                            }
                        }

                        var renderImgOption = _utils.getValue(imageInfo, that._renderMediaImgRegex, 2);
                        if (!option.thumbnailEnable) {
                            renderImgOption = false;
                        }
                        result = '<img class="' + imageId + ' ' + clazz + '" '
                            + 'data-src="' + src + '" '
                            + 'data-media-img-render=\'' + renderImgOption + '\' '
                            + 'data-lang="' + option.lang + '" '
                            + 'data-lockmedia="' + option.lockMedia + '" '
                            + 'src="' + that._loadingIconData + '" />';

                        that._imageIndex++;
                        that._waitingQueue.push({
                            $view: $view,
                            imageId: imageId,
                            src: src,
                            width: width,
                            height: height
                        });
                    }
                }
                return result;
            });
            return resultHtml;
        },
        _renderMediaImg: function ($img, width, height) {
            //超过大小的使用media插件渲染
            var that = this;
            var minHeight = 180;
            var minWidth = 260;
            //默认使用多媒体组件渲染图片
            var renderOption = $img.data('media-img-render');
            var lang = $img.data('lang');
            var lockMedia = $img.data('lockmedia');
            var renderMediaImg = !(renderOption === false);
            if (typeof renderOption === 'object') {
                minWidth = renderOption.minWidth;
                minHeight = renderOption.minHeight;
            }

            if ($img[0] && renderMediaImg && $img[0].parentNode) {
                var mediaImpl = ndMediaPlayer.getMediaImpl()
                if (mediaImpl && typeof  mediaImpl.ImageViewer != typeof undefined && mediaImpl.ImageViewer || (width > minWidth || height > minHeight)) {
                    Media.renderImg($img[0], typeof renderOption === 'object' ? renderOption : {}, lang, lockMedia);
                    return true;
                }
            }

            return false;
        },
        _loadImage: function () {
            var that = this;
            //执行图片加载
            var imageHandler = function (targetImageInfo, imageLoader) {
                imageLoader.onerror = function () {
                    //加载错误
                    //返回图片加载对象
                    //显示默认错误图片
                    that._returnImageLoader(imageLoader);
                    targetImageInfo.$image[0].src = that._errorIconData;
                };
                imageLoader.onload = function () {
                    //图片加载成功，开始往目标位置渲染图片
                    //图片实际高宽
                    var imageWidth = this.width;
                    var imageHeight = this.height;
                    //目标显示高宽
                    var targetWidth = targetImageInfo.width;
                    var targetHeight = targetImageInfo.height;
                    //先将目标位置图片改为透明图片
                    if (targetImageInfo.$image.length > 0) {
                        targetImageInfo.$image[0].src = that._emptyIconData;
                        var newWidth = 0;
                        var newHeight = 0;
                        //调整目标位置图片的额实际高宽
                        if (targetWidth && targetHeight) {
                            newWidth = targetWidth;
                            newHeight = targetHeight;
                            //如果有目标显示高宽
                            if (imageWidth > targetWidth || imageHeight > targetHeight) {
                                //如果图片实际高宽大于目标高宽，则根据比例缩小
                                var wc = imageWidth / targetWidth;
                                var hc = imageHeight / targetHeight;
                                if (wc > hc) {
                                    newHeight = parseInt(imageHeight / wc);
                                    newWidth = targetWidth;
                                } else {
                                    newHeight = targetHeight;
                                    newWidth = parseInt(imageWidth / hc);
                                }
                                targetImageInfo.$image.attr('width', newWidth);
                                targetImageInfo.$image.attr('height', newHeight);
                            }
                            //目标位置加载图片
                            targetImageInfo.$image[0].src = targetImageInfo.src;
                        } else {
                            //目标位置加载图片
                            targetImageInfo.$image[0].src = targetImageInfo.src;
                            newWidth = imageWidth;
                            newHeight = imageHeight;
                            //没有显示指定期望宽高的直接使用多媒体渲染
                            if (targetWidth) {
                                targetImageInfo.$image.attr('width', targetWidth);
                            }
                            if (targetHeight) {
                                targetImageInfo.$image.attr('height', targetHeight);
                            }
                        }
                        that._renderMediaImg(targetImageInfo.$image, newWidth, newHeight);
                    }
                    //返回图片加载对象
                    that._returnImageLoader(imageLoader);
                };
                imageLoader.src = targetImageInfo.src;
            };
            var loadingImageHandler = function () {
                //触发加载图片
                var imageInfo = that._loadQueue.shift();
                var imageLoader;
                while (imageInfo) {
                    //有等待加载的图片
                    imageLoader = that._imageLoaderPool.shift();
                    if (imageLoader) {
                        //有空闲图片加载对象,则开始加载
                        imageHandler(imageInfo, imageLoader);
                        //获取下一个等待加载的图片
                        imageInfo = that._loadQueue.shift();
                    } else {
                        //没有空闲图片加载对象，待加载图片放会加载队列
                        that._loadQueue.unshift(imageInfo);
                        //结束本次加载
                        imageInfo = null;
                    }
                }
                //判断是否还有图片未加载
                if (that._loadQueue.length > 0) {
                    //图片未加载完，触发下次加载
                    setTimeout(loadingImageHandler, 500);
                } else {
                    that._loadingImageStart = false;
                }
            };
            //player是多示例，共用一个ImageLoader示例，多次运行加载图片任务，保证只有一个定时加载任务执行
            if (that._loadingImageStart === false && that._loadQueue.length > 0) {
                that._loadingImageStart = true;
                loadingImageHandler();
            }
        },
        load: function () {
            var that = this;
            var imageInfo;
            var waitingQueueTemp = that._waitingQueue;
            that._waitingQueue = [];
            //初始化等待加载队列中的图片数据
            for (var index = 0; index < waitingQueueTemp.length; index++) {
                imageInfo = waitingQueueTemp[index];
                imageInfo.$image = imageInfo.$view.find('.' + imageInfo.imageId);
                if (imageInfo.$image.length === 1) {
                    //带加载图片对象存在，将图片移动到加载队列
                    this._loadQueue.push(imageInfo);
                }
            }
            //触发加载图片
            that._loadImage();
        }
    };

    //实例化图片加载器,全局单例
    var _imageLoader = ImageLoader.create();
    return _imageLoader;
});

// qti model
define('player/utils/img', function () {


    var img = {
        PreLoadingImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFFQjM3Q0UzNDAxRDExRTFCMDY2RjdDNTdFQjYzRUM1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjFFQjM3Q0U0NDAxRDExRTFCMDY2RjdDNTdFQjYzRUM1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MUVCMzdDRTE0MDFEMTFFMUIwNjZGN0M1N0VCNjNFQzUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MUVCMzdDRTI0MDFEMTFFMUIwNjZGN0M1N0VCNjNFQzUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4pDOh4AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAABhJREFUeNpiYBgFo2AUjIJRMApoBwACDAAGaAABg+4RpgAAAABJRU5ErkJggg==",

        resizeImage: function (imgElement, url, maxWidth, maxHeight) {
            var $imgElement = $(imgElement);
            var dataLoad = $imgElement.attr("data-load");
            if ('true' != dataLoad) {
                var callback = function () {

                    //imgElement.src = url;
                    var scale = 1,
                        w = img.width,
                        h = img.height;
                    if (img.width > maxWidth) {
                        w = maxWidth;
                        h = img.height * (w / img.width);
                    }
                    if (h > maxHeight) {
                        h = maxHeight;
                        w = img.width * (h / img.height);
                    }
                    $imgElement.attr("src", url);
                    $imgElement.attr("width", w + "px");
                    $imgElement.attr("height", h + "px");
                    $imgElement.attr("data-load", true);
                };

                var img = new Image();
                img.src = url;
                if (img.complete) {
                    callback(img.width, img.height);
                } else {
                    img.onload = function () {
                        callback(img.width, img.height);
                        img.onload = null;
                    };
                }
            }

        },
        resize: function (oWidth, oHeight, maxW, maxH, minW, minH) {
            var w = oWidth, h = oHeight, scale = 1;

            if (minW && w < minW) {
                scale = (minW / w).toFixed(3);
                h = parseInt(scale * h);
                w = minW;
            }

            if (minH && h < minH) {
                scale = (minH / h).toFixed(3);
                w = parseInt(scale * w);
                h = minH;
            }

            if (oWidth > maxW) {
                scale = (maxW / oWidth).toFixed(3);
                h = parseInt(scale * oHeight);
                w = maxW;

            }
            if (h > maxH) {
                scale = (maxH / oHeight).toFixed(3);
                w = parseInt(scale * oWidth);
                h = maxH;
            }


            return {w: w, h: h, scale: scale};
        }
    };
    return img;

});

define('player/utils/playerEvent', ['model/logger'], function (_logger) {

    var _emptyFunc = function (obj) {
        _logger.debug('empty func invoke:');
        _logger.debug(obj);
    };

    var playerEvent = {
        _logger: _logger,
        _eventHandler: null,
        create: function () {
            var instance = $.extend({}, this);
            instance._eventHandler = {
                //答案事件
                answer: {
                    change: _emptyFunc
                },
                //图片事件
                image: {
                    click: _emptyFunc
                },
                //公式解析
                latex: {
                    onEnded: _emptyFunc
                },
                assessmentItem: {
                    optionClick: _emptyFunc
                },
                render: {
                    rendered: _emptyFunc,
                    renderChanged: _emptyFunc,
                    destroy: _emptyFunc,
                    resize: _emptyFunc
                },
                on: {
                    error: _emptyFunc
                }
            };
            return instance;
        },
        trigger: function (group, type, para) {
            this._logger.debug('player trigger event:' + group + '-' + type);
            this._eventHandler[group][type](para);
        },
        bind: function (group, type, callback) {
            if (this._eventHandler[group] && this._eventHandler[group][type] && $.type(callback) === 'function') {
                this._logger.debug('player bind event:' + group + '-' + type);
                this._eventHandler[group][type] = callback;
            }
        }
    };
    return playerEvent;
});

// qti model
define('player/utils/random', function () {


    var getRandomRange = function (n, m) {
        var c = m - n + 1;
        return Math.floor(Math.random() * c + n);
    }
    var getRandomArry = function (end, start) {
        var length = end + 1;
        if (typeof start != 'undefined' && start > 0) {
            length = end - start + 1;
        }


        var getRandomPri = function (randomEnd, arry) {
            var s = 0;
            if (typeof start != 'undefined' && start > 0) {
                s = start;
            }
            var rd = getRandomRange(s, randomEnd);
            var contain = false;
            for (var j = 0; j < arry.length; j++) {
                if (rd == arry[j]) {
                    contain = true;
                    break;
                }
            }
            if (contain) {
                getRandomPri(randomEnd, arry);
            } else {
                arry.push(rd);
            }
        };

        var arry = [];//随机索引
        for (var i = 0; i < length; i++) {
            getRandomPri(end, arry);
        }
        return arry;
    };

    var random = {
        getRandom: function (name) {
            var random = (Math.random() * 10 + new Date().getMilliseconds()).toString().replace(".", "");
            if (name) {
                return name + random;
            }
            return random;
        },
        getRandomRange: getRandomRange,
        //获取随机长度数组
        getRandomArray: function (length) {
            var order = [];
            var random = [];
            for (var i = 0; i < length; i++) {
                order[i] = i;
            }
            while (order.length) {
                var seed = Math.random();
                random.push(order.splice(Math.floor(seed * order.length), 1)[0]);
            }
            return random;
        },

        //数组乱序
        shuffleArray: function (array, randomSeed) {
            var result = array;
            if (randomSeed && randomSeed.length > 0) {
                result = [];
                var index;
                var value;
                for (var i = 0; i < randomSeed.length; i++) {
                    index = randomSeed[i];
                    value = array[index];
                    if (value) {
                        result.push(value);
                    }
                }
                for (var i = 0; i < array.length; i++) {
                    value = array[i];
                    if (result.indexOf(value) === -1) {
                        result.push(value);
                    }
                }
            } else {
                var j;
                var temp;
                for (var i = result.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    temp = result[i];
                    result[i] = result[j];
                    result[j] = temp;
                }
            }
            return result;
        },
        getAnswerRandom: function (end, start, answerRandom) {

            if (!start) {
                start = 0;
            }
            if (!answerRandom || !(answerRandom instanceof Array) || answerRandom.length <= 0) {
                return getRandomArry(end, start);
            } else {
                var arry = answerRandom;
                var resultArry = [];
                for (var i = 0; i < arry.length; i++) {
                    var ar = parseInt(arry[i]);
                    if (ar > end) {
                        continue;
                    }
                    if (typeof start != 'undefined' && ar < start) {
                        continue;
                    }
                    resultArry.push(ar);
                }
                if ((end + 1) > resultArry.length) {
                    for (var j = start; j < (end + 1); j++) {
                        var contain = false;
                        for (var k = 0; k < resultArry.length; k++) {
                            if (resultArry[k] == j) {
                                contain = true;
                                break;
                            }
                        }
                        if (!contain) {
                            resultArry.push(j);
                        }
                    }
                }
                return resultArry;
            }
        }
    };


    return random;

});

// qti model
define('player/utils/svg', function () {


    var svg = {
        twConstants: {
            DIALECT_SVG: 'svg',
            DIALECT_VML: 'vml',
            NS_SVG: 'http://www.w3.org/2000/svg',
            NS_XLINK: 'http://www.w3.org/1999/xlink'
        },
        getSVGDocument: function (svg) {
            if (!svg) return null;
            var result = null;
            var isIE = false;
            if (isIE) {
                if (svg.tagName.toLowerCase() == "embed") {
                    try {
                        result = svg.getSVGDocument();
                    } catch (e) {
                        alert(e + " may be svg embed not init");
                    }
                }
            } else {
                result = svg.ownerDocument;
            }
            return result;
        },
        getSVGRoot: function (svg, doc) {
            if (!svg) return null;
            if (svg.tagName.toLowerCase() == "embed") {
                if (doc) {
                    return doc.documentElement;
                } else {
                    return this.getSVGDocument(svg).documentElement;
                }
            } else if (svg.tagName.toLowerCase() == "svg") {
                return svg;
            }
            return null;
        },
        addLine: function (svgdoc, svgRoot, id, x1, y1, x2, y2, className, style) {
            var line = svgdoc.createElementNS(this.twConstants.NS_SVG, 'line');
            line.setAttribute("id", id);
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.setAttribute("style", style);
            line.setAttribute("class", className);
            svgRoot.appendChild(line);
            return line;
        },
        addImgLine: function (svgdoc, svgRoot, id, x1, y1, x2, y2, className, style, iscorrect, showForeignObject) {
            var line = svgdoc.createElementNS(this.twConstants.NS_SVG, 'line');
            line.setAttribute("id", id);
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.setAttribute("style", style);
            line.setAttribute("class", className);
            svgRoot.appendChild(line);

            if (showForeignObject) {
                var foreignObject = svgdoc.createElementNS(this.twConstants.NS_SVG, 'foreignObject');
                foreignObject.setAttribute("x", (parseInt(x1) + parseInt(x2)) / 2 - 19);
                foreignObject.setAttribute("y", (parseInt(y1) + parseInt(y2)) / 2 - 20);
                foreignObject.setAttribute("id", "foreignObject_" + id);
                foreignObject.setAttribute("height", "39px");
                foreignObject.setAttribute("width", "38px");
                var div = svgdoc.createElement('div');
                if (iscorrect) {
                    div.setAttribute("class", "qp-correct-answer");
                } else {
                    div.setAttribute("class", "qp-wrong-answer");
                }
                foreignObject.appendChild(div);
                svgRoot.appendChild(foreignObject);
            }
        }
    }
    return svg;

});

define('player/assessment/assessmentItem/AnswerAreaExtra', ['model/logger', 'player/utils/imageLoader', 'player/utils/extendUtils'], function (_logger, _imageLoader, _utils) {


    var ELearningMediaParser = require('player/assessment/assessmentItem/elearning/mediaParser');

    var AnswerAreaExtra = {
        mContext: null,
        answerExtras: null,
        create: function (context) {
            var ins = $.extend({}, this);
            ins.mContext = context;
            ins.answerExtras = {};
            var modelMap = context.getItemModel(false).modelMap;

            for (var modelId in modelMap) {
                //初始化答案
                ins.answerExtras[modelId] = {};
            }
            return ins;
        },
        //支持拍照上传图片到指定小题后面设置数据方法
        setExtrasAnswer: function ($view, extra, isAppended, option) {
            var refPath = option.refPath;
            var result = true;
            var modelId = extra.modelId;
            var extraHtml = extra.extraHtml;
            if (modelId !== undefined) {
                if (modelId in this.answerExtras) {
                    this.answerExtras[modelId] = extraHtml;
                }
            }
            // 处理extraHtml中的audio\video标签,refPath值进行替换
            extraHtml = ELearningMediaParser.parseMedia2Div(extraHtml, refPath);
            var appendView = $(extraHtml);
            var appendToModelId = modelId;
            var cleanModelId = modelId;

            //清空原有的内容
            if (!isAppended) {
                this.cleanExtras($view, cleanModelId);
            }

            //渲染到小题后面
            this.appendToExtras($view, appendView, appendToModelId);

            return result;
        },
        _createExtrasHtml: function (modelItem, modelId, extrasOption) {
            var that = this,
                mContext = that.mContext,
                itemModel = mContext.getItemModel(false),
                html = '',
                userAnswerHtml = modelItem.getAnswer().join(','),
                option = mContext.getOption(),
                correctAnswerHtml = modelItem.getCorrectAnswer().join(','),
                model = itemModel.modelMap[modelId];

            var hintFeedbackContent = itemModel.hintFeedback[modelId] ? itemModel.hintFeedback[modelId].content : '';
            var answerFeedbackContent = itemModel.answerFeedback[modelId] ? itemModel.answerFeedback[modelId].content : '';


            var ar = [];
            ar.push('<div class="nqti-module-extras-default">');
            if (extrasOption.showUserAnswer || extrasOption.showCorrectAnswer) {
                var extrasUserAnswer = _utils.getLangText('extras_user_answer', option);
                var extrasCorrectAnswer = _utils.getLangText('extras_correct_answer', option);
                ar.push('    <div class="nqti-extras-answer"> ');
                if (extrasOption.showUserAnswer) {
                    var checked = mContext.state.getAnswer()[modelId].state === 'PASSED' ? 'nqti-correct' : 'nqti-wrong';
                    ar.push('        <span class="nqti-answer-user ' + checked + '">【' + extrasUserAnswer + '】' + userAnswerHtml + '</span> ');
                }
                if (extrasOption.showCorrectAnswer && correctAnswerHtml.length > 0) {
                    ar.push('        <span class="nqti-answer-correct">【' + extrasCorrectAnswer + '】' + correctAnswerHtml + '</span>  ');
                }
                ar.push('    </div> ');
            }

            if (extrasOption.showCorrectAnswer && model.rubricBlock && model.rubricBlock.prompt) {
                ar.push('    <div class="nqti-extras-rubricblock">  ');
                ar.push('        <span>【' + _utils.getLangText('reference_answer', option) + '】</span> ');
                ar.push('        <span>' + model.rubricBlock.prompt + '</span>');
                ar.push('    </div>');
            }

            if (extrasOption.showHint) {
                ar.push('    <div class="nqti-extras-hint">  ');
                ar.push('        <span>【' + _utils.getLangText('prompt', option) + '】</span> ');
                ar.push('        <span>' + hintFeedbackContent + '</span>');
                ar.push('    </div>');
            }
            if (extrasOption.showAnalyse) {
                ar.push('    <div class="nqti-extras-analyse">');
                ar.push('        <span>【' + _utils.getLangText('analyse', option) + '】</span>');
                ar.push('        <span>' + answerFeedbackContent + '</span>');
                ar.push('    </div>');
            }
            ar.push('</div>');

            html = ar.join('');
            return html;
        },
        showDefaultExtras: function ($view, extrasOption) {
            var that = this;
            that.mContext.modelEach($view, function ($modelView, modelItem, modelId) {
                var html = that._createExtrasHtml(modelItem, modelId, extrasOption);
                $modelView.find('._qti-module-extras').html(html);
                var newOption = $.extend(true, that.mContext.getOption(), {img: {render: true}});
                that.mContext.getMedia().render($modelView, newOption);
            });
            if (typeof  MathJax != typeof undefined) {
                MathJax.Hub.Queue(['Typeset', MathJax.Hub, $view[0]]);
            }
        },
        //在指定区域添加自定义内容
        appendToExtras: function ($view, appendView, appendToModelId) {
            var that = this;
            that.mContext.modelEach($view, function ($modelView, modelItem, modelId) {
                if (appendToModelId && typeof appendToModelId != typeof undefined) {
                    if (appendToModelId === modelId) {
                        $modelView.find('._qti-module-extras').append(appendView);
                        var newOption = $.extend(true, that.mContext.getOption(), {img: {render: true}});
                        that.mContext.getMedia().render($modelView, newOption);
                    }
                } else {
                    $modelView.find('._qti-module-extras').append(appendView);
                    that.mContext.getMedia().render($modelView, that.mContext.getOption());
                }
            });
            if (typeof  MathJax != typeof undefined) {
                MathJax.Hub.Queue(['Typeset', MathJax.Hub, $view[0]]);
            }
        },
        //清空指定区域内容
        cleanExtras: function ($view, cleanModelId) {
            this.mContext.modelEach($view, function ($modelView, modelItem, modelId) {
                if (cleanModelId && cleanModelId != typeof undefined) {
                    if (cleanModelId === modelId) {
                        $modelView.find('._qti-module-extras').html('');
                    }
                }
            });
        }
    };

    return AnswerAreaExtra;
});

define('player/assessment/assessmentItem/Composite', ['model/logger', 'player/utils/imageLoader', 'player/utils/extendUtils'], function (_logger, _imageLoader, _utils) {


    var HTML = {
        compositeTitle: '<div class="nqti-composite-title _qti-composite-title">            ' +
        '    <div class="nqti-composite-title-content _qti-composite-title-content">' +
        '       <div class="nqti-composite-title-inside _qti-composite-title-inside">' +
        '            ${title}    ' +
        '       </div>                                    ' +
        '    </div>                                    ' +
        '    <div class="nqti-composite-title-bar">    ' +
        '        <div class="nqti-bar _qti-composite-bar">                ' +
        '            <div class="nqti-icon nqti-up"></div>     ' +
        '        </div>                                ' +
        '        <div class="nqti-line" ></div>        ' +
        '    </div>                                    ' +
        '</div>                                        ',
        compositeBody: ' <div class="nqti-composite-body _qti-composite-body">',
        compositeContainer: '<div class="nqti-composite-container ${showNumClass}">'
        + '<div class="nqti-composite-listnum"><span class="text">${num}</span></div>'
        + '${itemBodyHtml}</div>'
    };


    var Composite = {
        mContext: null,
        create: function (context) {
            var ins = $.extend({}, this);
            ins.mContext = context;
            return ins;
        },
        parseCompositeContainer: function (html, option) {
            var num = this.mContext.getSequenceNumber() || '1';//默认取1

            //是否显示小题序号
            var showNumClass = '';
            if (option.showNum) {
                //显示大题序号
                showNumClass = num.length >= 3 ? 'nqti-composite-show-num-l' : 'nqti-composite-show-num-s';
            }

            return _utils.template(HTML.compositeContainer, {showNumClass: showNumClass, num: num, itemBodyHtml: html});
        },
        parseCompositeTitle: function (html, option, titleExtra) {

            var regex = /^([\w\W]*?)<div class="_qp-model/;
            var title = '';
            var titleResult = regex.exec(html);
            if (titleResult && titleResult.length > 1) {
                title = titleResult[1];
            }
            var questionName = _utils.getLangText('complex', option);
            var model = this.mContext.getItemModel(false);

            if (model.composite.isOptional) {
                if (option.showQuestionName) {
                    questionName = _utils.getLangText('optional_choices', option);
                    questionName += ' ' + _utils.template(_utils.getLangText('optional_choices_count', option), {total: model.composite.count, choose: model.composite.mustChoices});
                } else {
                    questionName = _utils.template(_utils.getLangText('optional_choices_count', option), {total: model.composite.count, choose: model.composite.mustChoices});
                }
            }
            title = titleExtra.parseExtrasTitleHtml(title, 'composite', questionName, option);


            if (option.showCompositeSeparate) {
                title = _utils.template(HTML.compositeTitle, {title: title});
                title += HTML.compositeBody;
            }
            html = html.replace(titleResult[1], title) + '</div>';
            return html;
        },
        compositeSeparateEventHandler: function ($view) {
            var $title = $view.find('._qti-composite-title');
            var $titleContent = $view.find('._qti-composite-title-content');
            var $titleInside = $view.find('._qti-composite-title-inside');
            var $separateBar = $view.find('._qti-composite-bar');
            var $compositeBody = $view.find('._qti-composite-body');
            var titleInsideHeight = $titleInside.height();

            var lineHeight = parseInt($titleContent.css('lineHeight'));
            var fontSize = parseInt($titleContent.css('fontSize'));
            var twoLineHeight;
            if (lineHeight <= 1 || lineHeight < fontSize) {
                twoLineHeight = 2 * fontSize + 10;
            } else {
                twoLineHeight = 2 * lineHeight
            }

            if (isNaN(twoLineHeight)) {
                twoLineHeight = 30;
            }
            var paddingTop = parseInt($titleContent.css('paddingTop')) || 0;
            var paddingBottom = parseInt($titleContent.css('paddingBottom')) || 0;
            twoLineHeight = twoLineHeight + paddingTop + paddingBottom;

            var separate = function (toggle) {
                var barHeight = $separateBar.height();
                var viewHeight = $view.height();
                viewHeight = viewHeight - barHeight;
                titleInsideHeight = $titleInside.height();
                titleInsideHeight = titleInsideHeight + paddingTop + paddingBottom;


                if (toggle) {
                    if (!$title.hasClass('nqti-down')) {
                        $title.addClass('nqti-down');
                        //题干小于两行直接显示题干高度
                        if (twoLineHeight < titleInsideHeight) {
                            $titleContent.css('height', twoLineHeight + 'px');
                        } else {
                            $titleContent.css('height', titleInsideHeight + 'px');
                        }
                    } else {
                        $title.removeClass('nqti-down');
                        //题干不超过窗口一半，直接显示题干高度
                        if (titleInsideHeight > viewHeight / 2) {
                            $titleContent.css('height', viewHeight / 2 + 'px');
                        } else {
                            $titleContent.css('height', titleInsideHeight + 'px');
                        }
                    }
                } else {
                    if ($title.hasClass('nqti-down')) {
                        if (twoLineHeight < titleInsideHeight) {
                            $titleContent.css('height', twoLineHeight + 'px');
                        } else {
                            $titleContent.css('height', titleInsideHeight + 'px');
                        }
                    } else {
                        if (titleInsideHeight > viewHeight / 2) {
                            $titleContent.css('height', (viewHeight / 2 ) + 'px');
                        } else {
                            $titleContent.css('height', titleInsideHeight + 'px');
                        }
                    }
                }
                if (twoLineHeight < titleInsideHeight) {
                    $separateBar.show();
                } else {
                    $separateBar.hide();
                }
                $compositeBody.css('height', viewHeight + barHeight - $title.height() + 'px');
            };

            separate(false);

            $titleInside.resize(function () {
                separate(false);
            });

            $(window).resize(function () {
                separate(false);
            });

            $separateBar.on('qpTap', function () {
                separate(true);
            });
        }
    };

    return Composite;
});

define('player/assessment/assessmentItem/hint', ['model/logger', 'player/utils/imageLoader', 'player/utils/extendUtils'], function (_logger, _imageLoader, _utils) {


    //提示相关逻辑事件处理
    var Hint = {
        mContext: null,
        create: function (context) {
            var ins = $.extend({}, this);
            ins.mContext = context;
            return ins;
        },
        parserHintHtml: function (modelId, option) {
            var that = this,
                hintFeedback = that.mContext.getItemModel(false).hintFeedback[modelId],
                hintHtml = '';
            if (hintFeedback && hintFeedback.showHide === 'show' && hintFeedback.content !== '') {
                var tipTxt = _utils.getLangText('prompt', option);
                var confirm = _utils.getLangText('confirm', option);

                hintHtml = ''
                    + '<div class="nqti-com-pop-content nqti-hide-dom _hint-pop-content-body" data-model-id="' + modelId + '">'
                    + '    <div class="nqti-com-pop-box com-pop-hint-box _hint-pop-content-box">'
                    + '        <p class="nqti-com-pop-hd">'
                    + '            <span class="nqti-pop-dec nqti-dec-1"></span>'
                    + '            <span class="nqti-pop-dec nqti-dec-2"></span>'
                    + '        </p>'
                    + '        <div class="nqti-com-pop-bd scrollbar-style-wood-mix  _hint-pop-bd">'
                    + '            <div class="nqti-com-remind-text">'
                    + '                <span class="nqti-text-size _hint-pop-content"></span>'
                    + '            </div>'
                    + '        </div>'
                    + '        <div class="nqti-com-pop-bt">'
                    + '            <a class="nqti-hint-btn _hint-confirm-btn" href="javascript:;">'
                    + '                <span class="nqti-tip-icon-text">' + confirm + '</span>'
                    + '            </a>'
                    + '        </div>'
                    + '    </div>'
                    + '</div>'
                    + '<a class="nqti-hint-btn _hint-pop-btn " href="javascript:;" data-model-id="' + modelId + '">'
                    + '    <span class="nqti-tip-icon"></span>'
                    + '    <span class="nqti-tip-icon-text">' + tipTxt + '</span>'
                    + '</a>';
                hintHtml = '<div class="nqti-hint-box _hint-pop-container ' + (option.showHint ? '' : 'nqti-hide-dom') + '">'
                    + hintHtml
                    + '</div>';
            }
            return hintHtml;
        },
        hintEventHandle: function ($view) {
            var that = this,
                $hintEnter = $view.find('._hint-pop-btn'),//提示按钮
                $hintTipWrapper = $view.find('._hint-pop-content-body'), //提示弹出框
                $hintContent = $view.find('._hint-pop-content');

            if ($hintEnter.length > 0 && $hintTipWrapper.length > 0) {
                var $hintCloseBtn = $view.find('._hint-confirm-btn');
                //关闭提示窗口方法
                var closeHintTip = function () {
                    //隐藏遮罩和提示内容
                    $hintTipWrapper.addClass('nqti-hide-dom');
                    //还原滚动能力
                    $(document.body).removeClass('nqti-viewer-over-hidden');
                };
                //提示按钮点击事件
                $hintEnter.bind('click', function () {
                    if ($hintContent.html() === '') {
                        var modelId = $hintEnter.attr('data-model-id');
                        var hintFeedback = that.mContext.getItemModel(false).hintFeedback[modelId];
                        $hintContent.html(hintFeedback.content || '');
                        if (that.mContext.getItemModel(false).hasMath && typeof MathJax !== 'undefined') {
                            MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
                        }
                        var newOption;
                        if (that.mContext.getOption().showMedia) {
                            newOption = $.extend(true, that.mContext.getOption(), {img: {render: true}});
                        } else {
                            newOption = $.extend(true, that.mContext.getOption(), {img: {render: true}, audio: {render: false}, video: {render: false}});
                        }
                        that.mContext.getMedia().render($hintContent, newOption);
                    }
                    //显示遮罩和提示内容
                    $hintTipWrapper.removeClass('nqti-hide-dom');
                    //移除滚动能力
                    $(document.body).addClass('nqti-viewer-over-hidden');
                    $hintTipWrapper.css('height', ($hintTipWrapper.height() + 1) + 'px');
                });

                //提示框左右空白背景点击事件
                $hintTipWrapper.bind('click', function (e) {
                    var $target = $(e.target);
                    var $tip = $target.closest('._hint-pop-content-box');
                    if ($tip.length === 0) {
                        closeHintTip();
                    }
                });
                //关闭按钮事件
                $hintCloseBtn.bind('click', closeHintTip);
            }
        }
    };

    return Hint;
});

define('player/assessment/assessmentItem/optional', ['model/logger', 'player/utils/imageLoader', 'player/utils/extendUtils'], function (_logger, _imageLoader, _utils) {


    var HTML = {
        optional: '<div class="nqti-module-whether-choose">'
        + '             <span class="nqti-label-checkbox js_checkbox ">'
        + '                 <i class="lc-input"></i>'
        + '                 <span class="lc-text">${text}</span>'
        + '             </span>'
        + '         </div>'
    };


    var Optional = {
        getOptionalHtml: function (option) {
            var text = _utils.getLangText('optional_choices_tip', option);
            return _utils.template(HTML.optional, {text: text})
        },
        eventHandler: function ($view, mContext, callback) {
            $view.find('.js_checkbox').on('click', function () {
                var $modelBody = $(this).closest('._qp-model');
                var currentModelId = $modelBody.attr('data-model-id');
                var $this = $(this).closest('.js_checkbox');
                if ($this.hasClass('js_disabled')) {
                    return;
                }
                var lastChecked = $this.hasClass('ui-btn-active');

                if (lastChecked === true) {
                    $this.removeClass('ui-btn-active');
                    mContext.state.setModelChecked(currentModelId, false);
                } else {
                    var composite = mContext.getItemModel(false).composite || {};
                    var mustChoices = composite.mustChoices || 0;
                    var answer = mContext.getAnswer();
                    var checkedCount = 0;
                    var totalCount = 0;
                    for (var modelId in answer) {
                        if (answer.hasOwnProperty(modelId)) {
                            if (answer[modelId].checked === true) {
                                checkedCount++;
                            }
                            totalCount++;
                        }
                    }
                    if (checkedCount >= mustChoices) {
                        //超出上限了
                        var tip = _utils.template(_utils.getLangText('optional_utmost_tip', mContext.getOption()), {total: totalCount, must: mustChoices});
                        mContext.getTipDialog().show({
                            msg: tip,
                            buttons: [{
                                text: _utils.getLangText('got_it', mContext.getOption()), handle: function () {
                                    mContext.getTipDialog().hide();
                                }
                            }]
                        });
                    } else {
                        $this.addClass('ui-btn-active');
                        mContext.state.setModelChecked(currentModelId, true)
                    }
                }
                callback && callback(currentModelId, lastChecked)
            })
        },
        renderAnswer: function ($view, checked) {
            var $input = $view.find('.js_checkbox');
            if (checked) {
                $input.addClass('ui-btn-active');
            } else {
                $input.removeClass('ui-btn-active');
            }
        },
        setLock: function ($view, lock) {
            if (lock) {
                $view.find('.js_checkbox').addClass('js_disabled');//TODO:
            } else {
                $view.find('.js_checkbox').removeClass('js_disabled');//TODO:
            }
        },
        renderLock: function ($view, lock) {
            this.setLock($view, lock);
        }
    };

    return Optional;
});

define('player/assessment/assessmentItem/parser', ['model/logger', 'player/utils/imageLoader', 'player/utils/extendUtils'], function (_logger, _imageLoader, _utils) {

    var ImageLoader = require('player/utils/imageLoader');

    var ELearningSupportType = require('player/assessment/assessmentItem/elearning/supportType');
    var Composite = require('player/assessment/assessmentItem/Composite');
    var Hint = require('player/assessment/assessmentItem/hint');
    var TitleExtra = require('player/assessment/assessmentItem/titleExtra');
    var ELearningMediaParser = require('player/assessment/assessmentItem/elearning/mediaParser');
    var Tip = require('player/assessment/assessmentItem/tip');

    var HTML = {
        ListNum: '<div class="nqti-module-listnum">' +
            '             <span class="nqti-listnum-text">${num}</span>' +
            '             <span class="nqti-listnum-dot">、</span>' +
            '        </div>',
        NormalTitle: '<div class="nqti-module-title">' +
            '             <div class="nqti-title-text">${title}</div>' +
            '           </div>',
        ColzeTitle: '<div class="nqti-module-title">${title}</div>',
        Body: '<div class="_qti-player ${bodyCls}">' +
            '    <div class="_qti-player-body nqti-player-body nqti-scrollbar-style-gray ">' +
            '${bodyHtml}' +
            '        <div class="nqti-player-loading ${qpPlayerLatexLoadingClass}">' +
            '            <span>${matjaxLoading}<span class="nqti-loading-dotting"></span></span>' +
            '        </div>' +
            '${tip}' +
            '    </div>' +
            '</div>'
    };


    var ModelRegex = /<(div|span) class="_qp-model"[\s\S]*?><\/(div|span)>/g;
    var ModelPTagRegex = /<p[^<>]*?(class=(["'])([^<>"']*?)\1)?[^<>]*?>/g;
    var ModelClassRegex = /class=(["'])([^<>"']*?)\1/;
    var ModelIdRegex = /data-model-id="([\s\S]*?)"/;
    var ModelNumRegex = /_(\d*?)-/;

    //用于配合进行统计信息处理统计（目前确认可移除）
    var Render = {
        mContext: null,
        hint: null,
        composite: null,
        titleExtra: null,
        create: function (context) {
            var ins = $.extend({}, this);
            ins.mContext = context;
            ins.hint = Hint.create(context);
            ins.composite = Composite.create(context);
            ins.titleExtra = TitleExtra.create(context);
            ins.tipDialog = Tip.create(context);
            return ins;
        },
        render: function ($view, option, callback) {
            var that = this,
                mContext = that.mContext,
                modelItem = mContext.getModelItem(),
                itemModel = mContext.getItemModel(false)

            mContext.setOption(option);

            //设置渲染参数
            for (var modelId in modelItem) {
                model = modelItem[modelId];
                model.setOption(option);
            }

            //判断是否有数学公式
            var qpPlayerLatexLoadingClass = '';
            if (itemModel.hasMath && typeof MathJax !== 'undefined') {
                qpPlayerLatexLoadingClass = 'nqti-player-run-loading';
            }


            //简单的复合题(只有顺序填空题或则文本选择题)增加尾部hint提示信息渲染
            var isSimpleModel = true,
                isTextEntry = true,
                firstModelId,
                model //题目类型

            for (var modelId in modelItem) {
                if (!firstModelId) {
                    firstModelId = modelId;
                }
                model = modelItem[modelId];
                if (model._model.modelType !== 'textEntryInteraction') {
                    isTextEntry = false;
                }
                if (model._model.modelType !== 'textEntryInteraction' && model._model.modelType !== 'inlineChoiceInteraction') {
                    isSimpleModel = false;
                }
            }
            var prompt = that._parseBaseTitle(itemModel.prompt);
            var itemBodyHtml = prompt;

            if (mContext.isComposite()) {
                itemBodyHtml = that.composite.parseCompositeTitle(prompt, option, that.titleExtra);
            }
            if (isTextEntry && firstModelId) {
                itemBodyHtml = that.titleExtra.parseExtrasTitleHtml(itemBodyHtml, firstModelId, modelItem[firstModelId].getName(), option);
            }
            //生成所有的model html片段
            itemBodyHtml = that._parseHtml(itemBodyHtml, option, $view);

            //图片资源分析
            itemBodyHtml = ImageLoader.parseImage($view, itemBodyHtml, option);

            if (isSimpleModel) {
                //简单的复合题，显示提示，取第一个提示信息
                var mId = '';
                for (var modelId in itemModel.hintFeedback) {
                    mId = modelId;
                    break;
                }
                if (mId !== '') {
                    var hintHtml = that.hint.parserHintHtml(mId, option);
                    itemBodyHtml += hintHtml;
                }
            }

            // 是否渲染复合题大题号
            if (mContext.isComposite()) {
                itemBodyHtml = that.composite.parseCompositeContainer(itemBodyHtml, option);
            }

            //包一层最外层容器
            itemBodyHtml = _utils.template(HTML.Body, {
                bodyCls: option.skin + ' ' + option.platForm, //body皮肤类名
                bodyHtml: itemBodyHtml,
                matjaxLoading: _utils.getLangText('mathjax_loading', option),
                qpPlayerLatexLoadingClass: qpPlayerLatexLoadingClass,
                tip: that.tipDialog.getHtml(option)
            });

            $view.html(itemBodyHtml);

            //多媒体渲染
            if (option.showMedia) {
                //默认不渲染图片
                option.img = {
                    render: false
                }
                mContext.getMedia().render($view, option);
            } else {
                $view.find('audio,video').each(function () {
                    var $this = $(this);
                    var poster = $this.attr('poster');
                    if (poster) {
                        //有图片链接
                        $this.before('<img src="' + poster + '" alt=""/>');
                    }
                    $this.remove();
                });
            }
            //总体事件处理方法
            var $qpTextModule = $view.find('._qti-player-body');
            var $qpModel = $qpTextModule.find('._qp-model');
            $qpModel.each(function () {
                var $this = $(this);
                var modelId = $this.data('model-id');
                $this.addClass('nqti-module-body');

                if (mContext.isComposite()) {
                    // 若是复合题，显示小题序号，但不显示大题序号。复合题大题序号在render 方法内已经处理（nqti-player-body）
                    if (option.showCompositeChildNum) {
                        $this.addClass('nqti-module-show-num-s');
                    }
                } else {
                    // 若是单题型，则判断是否显示大标题序号
                    if (option.showNum) {
                        var num = mContext.getSequenceNumber() || '1';
                        var numCls = num.length >= 3 ? 'nqti-module-show-num-l' : 'nqti-module-show-num-s';
                        $this.addClass(numCls);
                    }
                }

                var item = modelItem[modelId];
                var className = item.getClassName(option);
                $this.addClass(className);
                //动态渲染
                if (item.render) {
                    item.render($this, option);
                }
            });

            var eventHandle = function () {
                //遍历所有的model,逐个处理事件
                $qpModel.each(function () {
                    var $this = $(this);
                    var modelId = $this.data('model-id');
                    var item = modelItem[modelId];
                    //交互事件处理,如果锁定就不处理交互
                    //modelType为手写题、连线题、拼图题、表格题的继续使用旧的showLock控制方式
                    var model = item.getModel();
                    item.bindEvent($this, option);
                    //提示点击事件处理
                    that.hint.hintEventHandle($this, option);
                    //渲染是否锁定
                    if (option.showLock) {
                        item.setLock($this, option.showLock);
                    }

                    //渲染答案
                    if (option.showAnswer) {
                        item.showAnswer($this);
                    } else if (option.showCheckedAnswer) {
                        item.showCheckedAnswer($this);
                    } else if (option.showCorrectAnswer) {
                        item.showCorrectAnswer($this);
                    } else if (option.showStatisAnswer) {
                        item.showStatisAnswer($this);
                    }
                });
                //简单的复合题hint提示处理
                if (isSimpleModel) {
                    that.hint.hintEventHandle($qpTextModule, option);
                }
                that.tipDialog.bindEventHandle($view);
                //图片点击事件处理
                $view.find('img').bind('qpTap', function () {
                    var $this = $(this);
                    var url = $this.data('src');
                    if (!url) {
                        url = $this.attr('src');
                    }
                    that.mContext.triggerEvent('image', 'click', {
                        url: url
                    });
                });
                //图片加载
                ImageLoader.load();

                that.composite.compositeSeparateEventHandler($view);

                //是否锁定多媒体
                mContext.getMedia().setLock(option.lockMedia, $view);

            };
            eventHandle();
            //解析数据公式
            if (itemModel.hasMath && typeof MathJax !== 'undefined') {
                MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
                MathJax.Hub.Queue(['End', function () {
                    //异步渲染异常处理
                    try {
                        //渲染完成回调
                        if (callback) {
                            callback();
                        }
                    } catch (e) {
                        _logger.error('callback异步渲染异常处理');
                        _logger.error(e);
                    }
                    $qpTextModule.removeClass('nqti-player-run-loading');
                    //触发公式解析回调
                    mContext.triggerEvent('latex', 'onEnded');
                    mContext.triggerEvent('render', 'rendered', mContext.getOption());
                }]);
            } else {
                try {
                    if (callback) {
                        callback();
                    }
                } catch (e) {
                    _logger.error('callback渲染异常处理');
                    _logger.error(e);
                }
                //触发公式解析回调
                mContext.triggerEvent('latex', 'onEnded');
                mContext.triggerEvent('render', 'rendered', option);
            }
        },
        _parseBaseTitle: function (html) {
            var result = html.replace(ModelPTagRegex, function (ptag, quotationMarks, cls) {
                if (!ptag.match(ModelClassRegex)) {
                    return ptag.replace('<p', '<p class="nqti-player-base-title" ')
                } else {
                    return ptag.replace(ModelClassRegex, function (clsMatch, quotationMarks, cls) {
                        return clsMatch.replace(cls, 'nqti-player-base-title ' + cls);
                    })
                }
            })

            return result;
        },
        _parseHtml: function (html, option, $view) {
            var that = this,
                mContext = that.mContext,
                isSupport = true,
                models = mContext.getModelItem();

            var result = html.replace(ModelRegex, function (modelHtml) {
                var modelResult = '';
                var modelId = _utils.getValue(modelHtml, ModelIdRegex);
                //没有指定渲染参数,或则渲染参数中包含该小题的modelId
                if (option.modelId.length === 0 || option.modelId.indexOf(modelId) > -1) {
                    //渲染该小题
                    var modelItem = models[modelId];
                    var modelType = modelItem.getModel().modelType;
                    if (modelItem.init) {
                        modelItem.init(option);
                    }
                    if (option.isElearningSkin) {
                        isSupport = ELearningSupportType.indexOf(modelType) !== -1;
                    }
                    var numHtml = ''; // 题号
                    var answerHtml = ''; // 答案
                    var titleHtml = ''; // 标题
                    var hintHtml = ''; // 提示
                    var extrasHtml = '';
                    var optionalHtml = '';

                    //单题型 还是 复合题
                    // 是否渲染题号（这个是渲染单题型 和 复合题小题的 题号）
                    var num = '';
                    if (mContext.isComposite()) {
                        if (option.showCompositeChildNum) {
                            num = _utils.getValue(modelId, ModelNumRegex);
                        }
                    } else {
                        if (option.showNum) {
                            num = mContext.getSequenceNumber() || _utils.getValue(modelId, ModelNumRegex);
                        }
                    }

                    numHtml = _utils.template(HTML.ListNum, {
                        num: num
                    });

                    //是否渲染标题
                    if (option.showTitleArea && modelItem.hasTitle()) {
                        titleHtml = modelItem.createTitleHtml(option);
                        if (titleHtml.trim() === '') {
                            titleHtml = _utils.getLangText('no_title_tip', option);
                        }
                        //渲染附加内容
                        if (modelType !== 'textEntryInteraction') {
                            titleHtml = that.titleExtra.parseExtrasTitleHtml(titleHtml, modelItem.getModel().modelId, modelItem.getName(), option);
                        }
                        if (modelType === 'cloze') {
                            titleHtml = '<div class="nqti-module-title">' + titleHtml + '</div>';
                        } else {
                            titleHtml = '<div class="nqti-module-title">' +
                                '<div class="nqti-title-text">' + titleHtml + '</div>' +
                                '</div>';
                        }
                    }

                    if (isSupport) {
                        //是否渲染答案
                        if (option.hideAnswerArea === false || modelItem.isBlock() === false) {
                            var tag = 'div';
                            if (modelItem.isBlock() === false) {
                                tag = 'span';
                            }
                            answerHtml = modelItem.createAnswerHtml(option);
                            answerHtml = '<' + tag + ' class="nqti-module-content">' +
                                answerHtml +
                                '</' + tag + '>';
                        }
                        //是否渲染提示
                        if (modelItem.hasHint()) {
                            hintHtml = that.hint.parserHintHtml(modelId, option);
                        }
                        if (modelType !== 'textEntryInteraction') {
                            extrasHtml = '<div class="nqti-module-extras _qti-module-extras"></div>';
                        }
                    }
                    var itemModels = mContext.getItemModel(false)
                    if (itemModels.composite.isComposite === true && itemModels.composite.isOptional === true) {
                        optionalHtml = modelItem.createOptionalHtml(option);
                    }

                    //组合片段
                    var centerHtml = titleHtml + hintHtml + optionalHtml + answerHtml + extrasHtml;
                    var notSupportTip = _utils.getLangText('not_support_tip', option);
                    centerHtml += isSupport ? "" : ("<p style='color: #e02222;font-size: 18px;margin-top: 5px;text-align: left'>" + notSupportTip + "</p>");

                    if (modelItem.hasNum()) {
                        //该题支持小题编号
                        modelResult += numHtml + centerHtml;
                    } else {
                        modelResult += centerHtml;
                    }
                    //解析内嵌题
                    modelResult = that._parseHtml(modelResult, option);
                    var modelHtmlArr = modelHtml.split('><');
                    modelResult = modelHtmlArr[0] + '>' + modelResult + '<' + modelHtmlArr[1];
                }
                return modelResult;
            });

            // 表明使用elearning媒体播放器
            if (option.swfHost && window.Video) {
                // 兼容elearing播放器替换video\audio标签为div进行渲染
                result = ELearningMediaParser.parseMedia2Div(result)
            }

            return result;
        },
        setTitleExtras: function (extras) {
            this.titleExtra.setTitleExtras(extras);
        }
    };


    return Render;
});
define('player/assessment/assessmentItem/qtistate', ['model/logger', 'player/utils/extendUtils'], function (_logger, _utils) {

    var StateParser = {
        responseVariableRegex: /<responseVariable[^/]*?>[\s\S]*?<\/responseVariable>/g,
        identifierRegex: /identifier="([\s\S]*?)"/,
        baseTypeRegex: /baseType="([\s\S]*?)"/,
        cardinalityRegex: /cardinality="([\s\S]*?)"/,
        stateRegex: /state="([\s\S]*?)"/,
        candidateResponseRegex: /<candidateResponse[^/]*?>([\s\S]*?)<\/candidateResponse>/,
        valueRegex: /<value>([\s\S]*?)<\/value>/g
    }

    var QtiState = {
        mContext: null,
        create: function (context) {
            var ins = $.extend({}, this);
            ins.mContext = context;
            return ins;
        },
        //qti标准
        getState: function () {
            this.mContext.state.checkOptionalState();

            var that = this,
                state = that.mContext.state,
                itemModel = that.mContext.getItemModel(false),
                userAnswer = state.getAnswer();

            var state = ''
                + '<assessmentResult xmlns="http://edu.nd.com.cn/xsd/assessmentResult" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://edu.nd.com.cn/xsd/assessmentResult http://nd-schema.dev.web.nd/xsd/assessmentResult.xsd">'
                + '    <itemResult>'
                + '        <outcomeVariable identifier="completionStatus">'
                + '            <value>' + state.getState() + '</value>'
                + '        </outcomeVariable>'
                + '        <outcomeVariable identifier="SCORE">'
                + '            <value>' + state.getScore() + '</value>'
                + '        </outcomeVariable>'
                + '        <responseVariable identifier="duration">'
                + '            <candidateResponse><value>0</value></candidateResponse>'
                + '        </responseVariable>'
                + '        <responseVariable identifier="numAttempts">'
                + '            <candidateResponse><value>0</value></candidateResponse>'
                + '        </responseVariable>';
            var correctAnswer;
            var currentAnswer;
            for (var modelId in userAnswer) {
                correctAnswer = itemModel.correctAnswer[modelId];
                if (correctAnswer) {
                    currentAnswer = userAnswer[modelId];
                    state += '<responseVariable baseType="' + correctAnswer.baseType
                        + '" cardinality="' + correctAnswer.cardinality
                        + '" identifier="' + correctAnswer.identifier
                        + '" state="' + currentAnswer.state
                        + '">'
                        + '<correctResponse>';
                    $(correctAnswer.value).each(function (i, v) {
                        v = _utils.xmlEncode(v);
                        state += '<value>' + v + '</value>';
                    });
                    state += '</correctResponse>'
                        + '<candidateResponse>';
                    $(currentAnswer.value).each(function (i, v) {
                        v = _utils.xmlEncode(v);
                        state += '<value>' + v + '</value>';
                    });
                    state += '</candidateResponse>'
                        + '</responseVariable>';
                }
            }
            state += '</itemResult>'
                + '</assessmentResult>';
            return state;
        },
        //qti标准
        setState: function (state) {
            var result = true;
            var responseVariableArray = state.match(StateParser.responseVariableRegex);
            var responseVariable;
            var baseType;
            var cardinality;
            var identifier;
            var candidateResponse;
            var state;
            var newAnswer = {};
            var modelAnawer;
            var value;
            for (var index = 0; index < responseVariableArray.length; index++) {
                responseVariable = responseVariableArray[index];
                baseType = _utils.getValue(responseVariable, StateParser.baseTypeRegex);
                cardinality = _utils.getValue(responseVariable, StateParser.cardinalityRegex);
                identifier = _utils.getValue(responseVariable, StateParser.identifierRegex);
                if (baseType !== '' && cardinality !== '' && identifier !== '') {
                    state = _utils.getValue(responseVariable, StateParser.stateRegex);
                    modelAnawer = {
                        state: state,
                        value: []
                    };
                    //该标签存储了题目信息
                    candidateResponse = _utils.getValue(responseVariable, StateParser.candidateResponseRegex);
                    if (candidateResponse !== '') {
                        candidateResponse.replace(StateParser.valueRegex, function ($0, $1) {
                            value = _utils.xmlDecode($1);
                            modelAnawer.value.push(value);
                            return $0;
                        });
                    }
                    newAnswer[identifier] = modelAnawer;
                }
            }
            //保存答案
            result = this.mContext.state.setAnswer(newAnswer);
            return result;
        }
    };

    return QtiState;
});

define('player/assessment/assessmentItem/state', ['model/logger'], function (_logger) {


    var ModelLatexRegex = /<latex(?: class="math-tex")?>([\s\S]*?)<\/latex>/g;

    var State = {
        answer: null,//用户答案
        state: 'INCOMPLETE',//全局状态
        score: 0,//分数 0/1
        mContext: null,
        create: function (context) {
            var ins = $.extend({}, this);
            ins.mContext = context;
            ins.answer = {};
            var model,
                modelMap = context.getItemModel(false).modelMap;

            for (var modelId in modelMap) {
                model = modelMap[modelId];
                //初始化答案
                ins.answer[modelId] = {
                    state: 'INCOMPLETE',
                    value: [],
                    checked: false//是否选做
                };
            }
            return ins;
        },
        getState: function () {
            return this.state;
        },
        getScore: function () {
            return this.score;
        },
        getEffectiveIds: function () {
            var currentAnswer;
            var composite = this.mContext.getItemModel(false).composite;
            var ids = [];
            if (composite && composite.isOptional) {
                var mustChoices = composite.mustChoices;
                //检查选中的答案
                for (var modelId in this.answer) {
                    if (this.answer.hasOwnProperty(modelId)) {
                        currentAnswer = this.answer[modelId];

                        if (mustChoices > 0) {
                            if (currentAnswer.checked) {
                                mustChoices--;
                                ids.push(modelId);
                            }
                        }
                    }
                }

                //选中答案不够，按顺序取最前面题型
                if (mustChoices > 0) {
                    for (var modelId in this.answer) {
                        if (this.answer.hasOwnProperty(modelId)) {
                            if (mustChoices <= 0) {
                                break;
                            }
                            currentAnswer = this.answer[modelId];
                            if (!currentAnswer.checked) {
                                ids.push(modelId);
                                mustChoices--;
                            }
                        }
                    }
                }
            } else {
                for (var modelId in this.answer) {
                    if (this.answer.hasOwnProperty(modelId)) {
                        ids.push(modelId);
                    }
                }
            }
            return ids;
        },
        //获取答案
        getAnswer: function () {
            return this.answer;
        },
        //设置答案
        setAnswer: function (answer, modelId, reset) {
            if (arguments.length >= 2) {
                return this._setAnswerByModelId(answer, modelId, reset);
            }
            var result = true;
            //构造空答案
            var newAnswer = {};
            for (var modelId in this.answer) {
                newAnswer[modelId] = {
                    checked: false,//是否选做
                    state: 'INCOMPLETE',
                    value: []
                };
            }
            var modelAnswer;
            var state;
            for (var modelId in newAnswer) {
                modelAnswer = answer[modelId];
                if (modelAnswer && modelAnswer.value) {
                    state = modelAnswer.state;
                    if (!state) {
                        state = '';
                    }
                    newAnswer[modelId].checked = modelAnswer.checked;
                    newAnswer[modelId].state = state;
                    newAnswer[modelId].value.pushArray(modelAnswer.value);
                }
            }
            this.answer = newAnswer;
            //检测状态变化
            checkAnswer.call(this);
            return result;
        },
        setModelChecked: function (modelId, checked) {
            var last = this.answer[modelId].checked;
            this.answer[modelId].checked = checked;
            if (last !== checked) {
                var answerTemp = $.extend(true, {}, this.answer);
                this.mContext.triggerEvent('answer', 'change', answerTemp);
            }
        },
        checkOptionalState: function () {
            if (this.mContext.getItemModel(false).composite.isOptional) {
                checkAnswer.apply(this);
            }
        },
        _setAnswerByModelId: function (answer, modelId, reset) {
            var currentAnswer = this.answer[modelId].value;
            //判断答案是否变化
            var isChange = false;
            var isEmpty = true;
            if (answer) {
                answer.forEach(function (an) {
                    if (an !== '') {
                        isEmpty = false;
                    }
                })
            }
            if (currentAnswer.length === 0 && isEmpty) {
                isChange = false;
            } else if (currentAnswer.length !== answer.length) {
                isChange = true;
            } else {
                $(currentAnswer).each(function (i, v) {
                    if (v !== answer[i]) {
                        isChange = true;
                        return false;
                    }
                });
            }
            //设置新答案
            currentAnswer.clear();
            if (answer) {
                currentAnswer.pushArray(answer);
            }
            //触发答案变化事件
            if (isChange) {
                //判断答案是否正确
                checkModelAnswer.apply(this, [modelId, reset]);
                var answerTemp = $.extend(true, {}, this.answer);
                this.mContext.triggerEvent('answer', 'change', answerTemp);
            }
        },
        //获取js版结果模型
        getAnswerState: function () {
            var that = this;
            var correctAnswer,
                currentAnswer,
                responseVariable,
                itemModel = that.mContext.getItemModel(false);

            //选做题，需要根据实际的做题、选择情况，重新计算作答结构
            if (itemModel.composite.isOptional) {
                checkAnswer.apply(this);
            }

            var result = {
                completionStatus: that.state,
                score: that.score,
                duration: 0,
                numAttempts: 0,
                responseVariable: []
            };

            for (var modelId in that.answer) {
                correctAnswer = itemModel.correctAnswer[modelId];
                currentAnswer = that.answer[modelId];
                if (correctAnswer) {
                    responseVariable = {
                        baseType: correctAnswer.baseType,
                        cardinality: correctAnswer.cardinality,
                        identifier: correctAnswer.identifier,
                        state: currentAnswer.state,
                        correctResponse: [],
                        candidateResponse: []
                    };
                    $(correctAnswer.value).each(function (i, v) {
                        responseVariable.correctResponse.push(v);
                    });
                    $(currentAnswer.value).each(function (i, v) {
                        responseVariable.candidateResponse.push(v);
                    });
                    result.responseVariable.push(responseVariable);
                } else {
                    responseVariable = {
                        baseType: '',
                        cardinality: '',
                        identifier: modelId,
                        state: currentAnswer.state,
                        correctResponse: [],
                        candidateResponse: []
                    };
                    $(currentAnswer.value).each(function (i, v) {
                        responseVariable.candidateResponse.push(v);
                    });
                    result.responseVariable.push(responseVariable);
                }
            }
            return result;
        },
        setAnswerState: function (answerState) {
            var result = false;
            var newAnswer = {};
            var responseVariable = answerState.responseVariable;
            if (responseVariable) {
                var answer;
                var currentAnswer;
                for (var index = 0; index < responseVariable.length; index++) {
                    currentAnswer = responseVariable[index];
                    answer = {
                        state: currentAnswer.state,
                        value: currentAnswer.candidateResponse
                    };
                    newAnswer[currentAnswer.identifier] = answer;
                }
                //保存答案
                result = this.setAnswer(newAnswer);
            }
            return result;
        },
        //检查填空题是否正确
        checkTextAnswerValue: function (modelId, correctValue, currentValue) {
            //检查填空是否正确
            var correctAnswer = this.mContext.getItemModel(false).correctAnswer[modelId];
            if (correctAnswer && correctAnswer.value.length > 0) {
                return checkAnswerValue(correctAnswer.baseType, correctValue, currentValue);
            }
            return false;
        }
    };

    //统一处理不同编码的相同符号
    var unifySpecialCharacters = function (str) {
        //×＋＝°±＜＞％℃㏄㎝㏑㎞℉㎎㎏㎜㏒¼¾½∧
        return str.replace(/℃/g, '°C').replace(/㏄/g, 'cc')
            .replace(/㎝/g, 'cm').replace(/㏑/g, 'ln')
            .replace(/㎞/g, 'km').replace(/℉/g, '°F')
            .replace(/㎎/g, 'mg').replace(/㎏/g, 'kg')
            .replace(/㎜/g, 'mm').replace(/㏒/g, 'log')
            .replace(/＋/g, '+').replace(/＝/g, '=')
            .replace(/＜/g, '<').replace(/＞/g, '>')
            .replace(/％/g, '%');
    }

    /**
     * 比对单个答案是否正确
     * @param valueType multipleString
     * @param correctValue 正确答案
     * @param currentValue 用户答案
     * @returns {boolean}
     */
    var checkAnswerValue = function (valueType, correctValue, currentValue) {
        //答案比对时，去除latex标签
        correctValue = correctValue.replace(ModelLatexRegex, function ($1, $2) {
            return $2;
        });
        currentValue = unifySpecialCharacters(currentValue);
        var result = false;
        if (valueType === 'multipleString') {
            //这一项可以有多个答案
            var valueArray = correctValue.split('|');
            for (var index = 0; index < valueArray.length; index++) {
                if (unifySpecialCharacters(valueArray[index].trim()) == currentValue) {
                    result = true;
                    break;
                }
            }
        } else {
            //这一项只有一个答案
            if (unifySpecialCharacters(correctValue) == currentValue) {
                result = true;
            }
        }
        return result;
    }


    var checkOptionalAnswer = function (result) {
        var currentAnswer;

        var mustChoices = this.mContext.getItemModel(false).composite.mustChoices;
        result.isCorrect = true;
        result.isIncomplete = true;

        //检查选中的答案
        for (var modelId in this.answer) {
            currentAnswer = this.answer[modelId];
            if (currentAnswer.state !== 'INCOMPLETE') {
                result.isIncomplete = false;
            }
            if (mustChoices > 0) {
                if (currentAnswer.checked) {
                    //如果没有小题state值(旧版结果模型没有),则重新计算小题状态值
                    if (currentAnswer.state === '') {
                        checkModelAnswer.apply(this, [modelId]);
                    }
                    if (currentAnswer.state !== 'PASSED') {
                        result.isCorrect = false;
                    }
                    mustChoices--;
                }
            }
        }

        //选中答案不够，按顺序取最前面题型
        if (mustChoices > 0) {
            for (var modelId in this.answer) {
                if (mustChoices <= 0) {
                    break;
                }
                currentAnswer = this.answer[modelId];
                if (!currentAnswer.checked) {
                    //如果没有小题state值(旧版结果模型没有),则重新计算小题状态值
                    if (currentAnswer.state === '') {
                        checkModelAnswer.apply(this, [modelId]);
                    }
                    if (currentAnswer.state !== 'PASSED') {
                        result.isCorrect = false;
                    }
                    if (currentAnswer.state !== 'INCOMPLETE') {
                        result.isIncomplete = false;
                    }
                    mustChoices--;
                }
            }
        }
    }

    var checkNormalAnswer = function (result) {
        var currentAnswer;
        result.isCorrect = true;
        result.isIncomplete = true;
        for (var modelId in this.answer) {
            currentAnswer = this.answer[modelId];

            //如果没有小题state值(旧版结果模型没有),则重新计算小题状态值
            if (currentAnswer.state === '') {
                checkModelAnswer.apply(this, [modelId]);
            }
            if (currentAnswer.state !== 'PASSED') {
                result.isCorrect = false;
            }
            if (currentAnswer.state !== 'INCOMPLETE') {
                result.isIncomplete = false;
            }

        }

    }

    var checkAnswer = function () {
        var result = {
            isCorrect: false,
            isIncomplete: false
        };
        var isOptional = this.mContext.getItemModel(false).composite.isOptional;
        if (isOptional) {
            checkOptionalAnswer.apply(this, [result]);
        } else {
            checkNormalAnswer.apply(this, [result]);
        }

        if (result.isCorrect) {
            //答案全部正确
            this.score = 1;
            this.state = 'PASSED';
        } else {
            //答案全部未作答
            this.score = 0;
            if (result.isIncomplete) {
                this.state = 'INCOMPLETE';
            } else {
                this.state = 'FAILED';
            }
        }
    }

    var checkModelAnswer = function (modelId, reset) {
        //触发该方法，说明用户有操作过该题目
        var itemModel = this.mContext.getItemModel(false),
            correctAnswer = itemModel.correctAnswer[modelId],
            currentAnswer = this.answer[modelId];

        //重置答案
        if (reset) {
            currentAnswer.state = 'INCOMPLETE';
            this.score = 0;
            this.state = 'INCOMPLETE';
            return;
        }

        if (correctAnswer && correctAnswer.value.length > 0) {
            //有正确答案
            if (currentAnswer.value.length > 0) {
                //有正确答案,有用户答案
                var modelResult = true;
                if (currentAnswer.value.length !== correctAnswer.value.length) {
                    //用户答案的长度和正确答案的长度不一致，答题错误
                    modelResult = false;
                } else {
                    if (correctAnswer.cardinality === 'single') {
                        //只有一个答案项
                        modelResult = checkAnswerValue(correctAnswer.baseType, correctAnswer.value[0], currentAnswer.value[0]);
                    } else {
                        //多个答案项
                        if (correctAnswer.cardinality === 'ordered') {
                            //顺序必须一致
                            for (var cIndex = 0; cIndex < correctAnswer.value.length; cIndex++) {
                                modelResult = checkAnswerValue(correctAnswer.baseType, correctAnswer.value[cIndex], currentAnswer.value[cIndex]);
                                if (modelResult === false) {
                                    //该位置上正确答案和用户答案不一致，答题错误
                                    break;
                                }
                            }
                        } else {
                            //顺序可以不一致
                            var tempAnswer = [];
                            tempAnswer.pushArray(currentAnswer.value);
                            //继续判断答案，部分题型答案的顺序会和正确答案不一致，但是内容一致
                            var currentResult;
                            for (var cIndex = 0; cIndex < correctAnswer.value.length; cIndex++) {
                                currentResult = false;
                                var errorCount = 0;
                                while (errorCount < tempAnswer.length) {
                                    var temp = tempAnswer.shift();
                                    currentResult = checkAnswerValue(correctAnswer.baseType, correctAnswer.value[cIndex], temp);
                                    if (currentResult) {
                                        break;
                                    } else {
                                        tempAnswer.push(temp);
                                        errorCount++;
                                    }
                                }
                                if (currentResult === false) {
                                    //该正确答案在用户答案中不存在，答题错误
                                    modelResult = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (modelResult) {
                    //该小题答题正确
                    currentAnswer.state = 'PASSED';
                    //触发检测复合题答题是否正确
                    checkAnswer.call(this);
                } else {
                    //该小题答题错误
                    currentAnswer.state = 'FAILED';
                    this.score = 0;
                    this.state = 'FAILED';
                }
            } else {
                //有正确答案,但是没有用户答案,该小题答题错误，复合题答题错误
                currentAnswer.state = 'FAILED';
                this.score = 0;
                this.state = 'FAILED';
            }
        } else {
            //没正确答案,该小题答题正确
            var answerValue = currentAnswer.value.filter(function (val) {
                return val !== '';
            })
            if (answerValue.length > 0) {
                currentAnswer.state = 'PASSED';
            } else {
                currentAnswer.state = 'FAILED';
            }
            //客观题没有正确答案时，直接返回错误
            var modelItem = this.mContext.getModelItem();
            for (var modelId in modelItem) {
                var model = modelItem[modelId];
                var modelType = model._model.modelType;
                if (modelType !== 'choiceInteraction_vote'
                    && modelType !== 'extendedTextInteraction'
                    && modelType !== 'drawingInteraction_drawing'
                    && modelType !== 'drawingInteraction_handwrite') {
                    currentAnswer.state = 'FAILED';
                }
            }

            if (this.mContext.getOption().isElearningSkin) {
                currentAnswer.state = 'FAILED';
            }

            //触发检测复合题答题是否正确
            checkAnswer.call(this);
        }
    }

    return State;
});

define('player/assessment/assessmentItem/statistics', ['model/logger', 'player/utils/imageLoader', 'player/utils/extendUtils'], function (_logger, _imageLoader, _utils) {


    //用于配合进行统计信息处理统计（目前确认可移除）
    var Statistics = {
        API: ['setStat'],
        stat: null,//用户答案
        mContext: null,
        create: function (context) {
            var ins = $.extend({}, this);
            ins.mContext = context;
            ins.stat = {};
            var model,
                modelMap = context.getItemModel(false).modelMap;

            for (var modelId in modelMap) {
                model = modelMap[modelId];
                //初始化答案
                ins.stat[modelId] = {};
            }
            return ins;
        },
        //设置统计信息 {'RESPONSE_1-1': {'A': '5人','B': '10人'}};
        setStat: function (stat) {
            var result = true;
            //构造空答案
            var newStat = {};
            for (var modelId in this.stat) {
                newStat[modelId] = {};
            }
            for (var modelId in newStat) {
                newStat[modelId] = stat[modelId];
            }
            this.stat = newStat;
            return result;
        },
        getStat: function (modelId) {
            return this.stat[modelId] || {}
        }
    };


    return Statistics;
});

define('player/assessment/assessmentItem/tip', ['model/logger', 'player/utils/imageLoader', 'player/utils/extendUtils'], function (_logger, _imageLoader, _utils) {

    var HTML = '<div class="nqti-com-pop-content js_common_pop nqti-hide-dom" >               '
        + '    <i class="opacity_black_bg"></i>                                         '
        + '    <div class="nqti-com-pop-box com-pop-hint-box">                          '
        + '        <!-- 答对添加类名com-pop-right答错添加类名com-pop-wrong 提交提示文字?饫锾砑永嗝鹀om-pop-submit 提示弹窗添加类名com-pop-hint-box -->'
        + '        <p class="nqti-com-pop-hd">                                          '
        + '            <span class="nqti-pop-dec nqti-dec-1"></span>                    '
        + '            <span class="nqti-com-pop-title"><em class="js_title">${prompt}</em></span>'
        + '            <span class="nqti-pop-dec nqti-dec-2"></span>                    '
        + '        </p>                                                                 '
        + '        <div class="nqti-com-pop-bd nqti-scrollbar-style-gray">              '
        + '            <div class="nqti-com-remind-text">                               '
        + '                <span class="nqti-text-size js_msg">提示文字</span>                 '
        + '            </div>                                                           '
        + '        </div>                                                               '
        + '        <div class="nqti-com-pop-bt js_btn_container">                                        '
        + '            <a class="nqti-hint-btn js_cancel_btn" href="javascript:;">                    '
        + '                <span class="nqti-tip-icon-text js_cancel">${cancel}</span>                 '
        + '            </a>                                                             '
        + '            <a class="nqti-hint-btn js_confirm_btn" href="javascript:;">                    '
        + '                <span class="nqti-tip-icon-text js_confirm">${confirm}</span>                 '
        + '            </a>                                                             '
        + '		</div>                                                                   '
        + '    </div>                                                                   '
        + '</div>                                                                       ';

    var BTN_HTML = '<a class="nqti-hint-btn " href="javascript:;">                    '
        + '                <span class="nqti-tip-icon-text ">${text}</span>                 '
        + '            </a>';

    //提示相关逻辑事件处理
    var Tip = {
        mContext: null,
        $view: null,
        create: function (context) {
            var ins = $.extend({}, this);
            ins.mContext = context;
            return ins;
        },
        getHtml: function (option) {
            return _utils.template(HTML, {
                prompt: _utils.getLangText('prompt', option),
                cancel: _utils.getLangText('cancel', option),
                confirm: _utils.getLangText('confirm', option)
            });
        },
        bindEventHandle: function ($view) {
            this.$view = $view.find('.js_common_pop');
        },
        /**
         *
         * @param data {
                            msg:'',
                            title:'',
                            buttons:[{text:'',hanlde:function}]
                            }
         */
        show: function (data) {
            if (data.msg) {
                this.$view.find('.js_msg').html(data.msg);
            }
            if (data.title) {
                this.$view.find('.js_title').html(data.title);
            }

            if (data.buttons) {
                var $btnContainer = this.$view.find('.js_btn_container');
                $btnContainer.html('');
                data.buttons.forEach(function (btn) {
                    var $btn = $(_utils.template(BTN_HTML, {text: btn.text}));
                    $btnContainer.append($btn);
                    $btn.on('click', function () {
                        if (btn.handle) {
                            btn.handle();
                        }
                    });
                });
            }
            this.$view.removeClass('nqti-hide-dom');
        },
        hide: function () {
            this.$view.addClass('nqti-hide-dom');
        }
    };

    return Tip;
});

define('player/assessment/assessmentItem/titleExtra', ['model/logger'], function (_logger) {


    var TitleExtra = {
        mContext: null,
        titleExtras: {},
        create: function (context) {
            var ins = $.extend({}, this);
            ins.mContext = context;
            ins.titleExtras = {};
            var modelMap = context.getItemModel(false).modelMap;

            for (var modelId in modelMap) {
                //初始化答案
                ins.titleExtras[modelId] = {};
            }
            return ins;
        },
        //设置题目title信息 {'Resopnse-1-1':{prefix:'',suffix:''},'composite':{...}}
        setTitleExtras: function (extras) {
            var result = true;
            //构造空答案
            var titleExtras = {};
            for (var modelId in this.titleExtras) {
                titleExtras[modelId] = {};
            }
            titleExtras['composite'] = {};
            for (var modelId in titleExtras) {
                titleExtras[modelId] = extras[modelId];
            }
            this.titleExtras = titleExtras;
            return result;
        },
        parseExtrasTitleHtml: function (titleHtml, modelId, modelName, option) {
            var titleExtras = this.titleExtras[modelId] || {};
            var prefix = '<span class="_qti-title-prefix">';
            if (typeof titleExtras.prefix != typeof undefined && titleExtras.prefix.length > 0) {
                prefix += titleExtras.prefix;
            }

            var titleCls = option.showQuestionName || (this.mContext.getItemModel(false).composite.isOptional && modelId === 'composite') ? '' : 'nqti-hide-dom';

            // if () {
            prefix += ' <span class="_qti-title-prefix-qtype ' + titleCls + '">(' + modelName + ')</span>';
            // }
            prefix += '</span>';

            var suffix = '';
            if (typeof titleExtras.suffix != typeof undefined && titleExtras.suffix.length > 0) {
                suffix = '<span class="_qti-title-suffix">' + titleExtras.suffix + '</span>';
            }

            titleHtml = titleHtml.trim();
            if (prefix !== '') {
                if (/^(<(div|p)(.*?)>(\s*?))+/.test(titleHtml)) {
                    titleHtml = titleHtml.replace(/^(<(div|p)(.*?)>(\s*?))+/, function ($0) {
                        return $0 + prefix;
                    });
                } else {
                    titleHtml = prefix + titleHtml;
                }
            }
            if (suffix !== '') {
                if (/(<\/(div|p)[^<>]*?>(\s*?))+$/.test(titleHtml)) {
                    titleHtml = titleHtml.replace(/(<\/(div|p)[^<>]*?>(\s*?))+$/, function ($0) {
                        return suffix + $0;
                    });
                } else {
                    titleHtml = titleHtml + suffix;
                }
            }
            return titleHtml;
        }
    };

    return TitleExtra;
});

define('player/assessment/assessmentItem/elearning/mediaParser', ['model/logger'], function (_logger) {


    var MediaRegex = {
        VideoTagRegex: /<video(([\s\S])*?)<\/video>/g,
        AudioTagRegex: /<audio(([\s\S])*?)<\/audio>/g,
        MediaSrcAttrRegex: /src="([^"]*)"/,
        ImgTagRegex: /<img(.*?)>/g,
        RefPathRegex: /\$\{ref-path\}/g,
        PosterAttrRegex: /poster="([^"]*)"/,
        HeightAttrRegex: /height="([^"]*)"/,
        WidthAttrRegex: /width="([^"]*)"/
    }

    var RefPathRegex = /\$\{ref-path\}/g;

    var VideoMinSize = {
        height: 300,
        width: 300
    }
    var AudioMinSize = {
        height: 200,
        width: 200
    }

    var MediaClass = "_mediaMark";// elearning播放器渲染audio标签class


    var parseImgRefPathPlaceholder = function (htmlFragment, refPath) {
        return htmlFragment.replace(RefPathRegex, refPath);
    }
    var parseVideoTag2Div = function (htmlFragment) {
        return htmlFragment.replace(MediaRegex.VideoTagRegex, function (word) {
            var videoSrc = word.match(MediaRegex.MediaSrcAttrRegex);
            var videoHeight = word.match(MediaRegex.HeightAttrRegex);
            var videoWidth = word.match(MediaRegex.WidthAttrRegex);
            var videoPoster = word.match(MediaRegex.PosterAttrRegex);

            // 检测video src属性
            if (videoSrc) {
                videoSrc = videoSrc[1];
                if (videoSrc === '') {
                    _logger.warn('没有指定视频来源...');
                }
            } else {
                videoSrc = '';
                _logger.warn('没有指定视频来源...');
            }

            // 检测video poster属性
            if (videoPoster) {
                videoPoster = videoPoster[1];
            } else {
                videoPoster = '';
            }

            // 检测video height属性
            if (videoHeight) {
                videoHeight = parseFloat(videoHeight[1]);
                if (window.isNaN(videoHeight)) {
                    videoHeight = VideoMinSize.height;
                }
            } else {
                videoHeight = VideoMinSize.height;
            }
            if (videoHeight < VideoMinSize.height) {
                videoHeight = VideoMinSize.height;
            }

            // 检测video width属性
            if (videoWidth) {
                videoWidth = parseFloat(videoWidth[1]);
                if (window.isNaN(videoWidth)) {
                    videoWidth = VideoMinSize.width;
                }
            } else {
                videoWidth = VideoMinSize.width;
            }
            if (videoWidth < VideoMinSize.width) {
                videoWidth = VideoMinSize.width;
            }

            return '<div poster_src="' + videoPoster + '" style="margin-bottom:5px;width:' + videoWidth + 'px;height:' + videoHeight + 'px;" media_src="' + videoSrc + '" class="' + MediaClass + '"></div>';
        });
    }
    var parseAudioTag2Div = function (htmlFragment) {
        return htmlFragment.replace(MediaRegex.AudioTagRegex, function (word) {
            var audioSrc = word.match(MediaRegex.MediaSrcAttrRegex);
            var audioHeight = word.match(MediaRegex.HeightAttrRegex);
            var audioWidth = word.match(MediaRegex.WidthAttrRegex);
            var audioPoster = word.match(MediaRegex.PosterAttrRegex);

            // 检测audio src属性
            if (audioSrc) {
                audioSrc = audioSrc[1];
                if (audioSrc === '') {
                    _logger.warn('没有指定音频来源...');
                }
            } else {
                // audio没有配置音频来源信息
                audioSrc = '';
                _logger.warn('没有指定音频来源...');
            }

            // 检测audio poster属性
            if (audioPoster) {
                audioPoster = audioPoster[1];
            } else {
                audioPoster = '';
            }

            // 检测audio height属性
            if (audioHeight) {
                // 获取正则表达式的子表达式匹配文本信息
                audioHeight = parseFloat(audioHeight[1]);
                if (window.isNaN(audioHeight)) {
                    audioHeight = AudioMinSize.height;
                }
            } else {
                audioHeight = AudioMinSize.height;
            }
            if (audioHeight < AudioMinSize.height) {
                audioHeight = AudioMinSize.height;
            }

            // 检测audio width属性
            if (audioWidth) {
                audioWidth = parseFloat(audioWidth[1]);
                if (window.isNaN(audioWidth)) {
                    audioWidth = AudioMinSize.width;
                }
            } else {// json串无配置height属性,使用qtiPlayer的默认值
                audioWidth = AudioMinSize.width;
            }
            if (audioWidth < AudioMinSize.width) {
                audioWidth = AudioMinSize.width;
            }

            return '<div poster_src="' + audioPoster + '" style="margin-bottom:5px;width:' + audioWidth + 'px;height:' + audioHeight + 'px;" media_src="' + audioSrc + '" class="' + MediaClass + '"></div>';
        });
    }

    var MediaParser = {
        parseMedia2Div: function (htmlFragment, refPath) {
            if (refPath) {
                htmlFragment = parseImgRefPathPlaceholder(htmlFragment, refPath);
            }
            htmlFragment = parseVideoTag2Div(htmlFragment);
            htmlFragment = parseAudioTag2Div(htmlFragment);
            return htmlFragment;
        }
    };

    return MediaParser;
});

define('player/assessment/assessmentItem/elearning/score', ['model/logger'], function (_logger) {

    var Score = {
        mContext: null,
        fullScoreMap: null,//由外部json传入初始化每道题型的满分值键值对
        userScoreMap: null,//有外部json传入初始化每道题的用户得分值键值对
        create: function (mContext) {
            var instance = $.extend({}, this);
            instance.mContext = mContext;
            //初始化满分值键值对
            instance.fullScoreMap = {
                totalFullScore: 0//每道题的满分总分
            };
            //初始化用户得分值键值对
            instance.userScoreMap = {
                totalUserScore: 0//用户获得的总分
            };
            var model;
            var itemModel = mContext.getItemModel(false);
            for (var modelId in itemModel.modelMap) {
                model = itemModel.modelMap[modelId];
                //初始化每道题型的满分值
                instance.fullScoreMap[modelId] = model.full_score || 0;
                //初始化每道题的用户得分值
                instance.userScoreMap[modelId] = model.user_score || 0;
            }
            return instance;
        },
        /**
         * 设置某道题的满分值
         * @param retrieveData {modelId:'',fullScore:1}
         */
        setFullScore: function (retrieveData) {
            var modelId = retrieveData.modelId;
            var fullScore = retrieveData.fullScore || 0;
            if (this.fullScoreMap && this.fullScoreMap[modelId] !== undefined) {
                this.fullScoreMap[modelId] = fullScore;
                //重新计算总分值
                this._calTotalScore();
            }
        },
        /**
         * 获取某道题的满分值
         * @param modelId，不传获取总分
         * @returns number
         */
        getFullScore: function (modelId) {
            if (arguments.length == 0 || !modelId) {// 获取所有题目的满分值
                //重新计算总分值
                var totalScore = this._calTotalScore();
                return totalScore.totalFullScore;
            } else {// 获取某道题的满分值
                if (this.fullScoreMap && this.fullScoreMap[modelId] !== undefined) {
                    return this.fullScoreMap[modelId];
                }
            }
        },
        /**
         * 设置某道题的用户得分值
         * @param retrieveData {modelId:'',userScore:1}
         */
        setUserScore: function (retrieveData) {
            var modelId = retrieveData.modelId;
            var userScore = retrieveData.userScore || 0;
            if (this.userScoreMap && this.userScoreMap[modelId] !== undefined) {
                this.userScoreMap[modelId] = userScore;
                //重新计算总分值
                this._calTotalScore();
            }
        },
        /**
         * 获取某道题的用户得分值
         * @param modelId 不传获取总分
         * @returns {*}
         */
        getUserScore: function (modelId) {
            if (arguments.length == 1 && modelId) {// 获取用户某道题的得分
                if (this.userScoreMap && this.userScoreMap[modelId] !== undefined) {
                    return this.userScoreMap[modelId];
                }
            } else {// 获取用户所有题目的总分
                //重新计算总分值
                this._calTotalScore();
                return this.userScoreMap.totalUserScore;
            }
        },
        /**
         * 计算qtiPlayer实例 用户获得的总分 以及 所有题目的满分值
         * @returns {{totalUserScore: number, totalFullScore: number}}
         * @private
         */
        _calTotalScore: function () {
            var totalUserScore = 0;
            var totalFullScore = 0;
            var itemModel = this.mContext.getItemModel(false);
            for (var modelId in itemModel.modelMap) {
                var model = itemModel.modelMap[modelId];
                totalUserScore += parseFloat(model.user_score);
                totalFullScore += parseFloat(model.full_score);
            }
            return {
                totalUserScore: totalUserScore,
                totalFullScore: totalFullScore
            };
        }
    };

    return Score;
});

define('player/assessment/assessmentItem/elearning/supportType', ['model/logger'], function () {
    return ["choiceInteraction", "textEntryMultipleInteraction", "extendedTextInteraction"];
});

define('player/player', ['model/logger', 'player/utils/extendUtils'], function (_logger, _utils) {
    var _QtiPlayer = window.QtiPlayer;

    var Media;
    var AssessmentTest = require('player/assessment/assessmentTest');
    var PlayerEvent = require('player/utils/playerEvent');
    var ExtrasOption = require('player/config/extrasOption');
    var Option = require('player/config/option');
    var Exception = require('model/exception');

    //api
    var Player = {
        _event: null,
        _media: null,
        _assessmentTest: null,
        _createOption: null,
        _option: null,
        _uuid: null,//渲染容器的标识
        _$parentView: null,//题目渲染的父节点
        _create: function (option) {
            var instance = $.extend({}, this);
            //校验并纠正输入的渲染参数
            option = _utils.checkOption(option);
            //实例化配置
            var defaultOption = $.extend({}, Option, option);
            //初始化属性
            instance._createOption = $.extend(true, {}, defaultOption);
            instance._option = defaultOption;
            //实例化事件管理对象
            var event = PlayerEvent.create();
            //实例化多媒体对象
            var media;
            Media = instance.importMedia();
            media = Media.create();
            //实例化assessmentTest对象
            var assessmentTest = AssessmentTest.create(defaultOption, event, media);
            instance._event = event;
            instance._media = media;
            instance._assessmentTest = assessmentTest;
            instance._uuid = _utils.getUuid();
            return instance;
        },
        //引入多媒体
        importMedia: function () {
            return require('player/media/media');
        },
        create: function (option) {
            return this._create(option);
        },
        setOption: function (option) {
            $.extend(this._option, option);
        },
        getOption: function () {
            return this._option;
        },
        load: function (url, callback) {
            var that = this;
            _QtiPlayer.load(url, that._option, function (assessmentItemModel) {
                that._assessmentTest.loadAssessmentItem(assessmentItemModel);
                if (callback) {
                    callback();
                }
            }, function (ex) {
                var e = Exception.create('load', ex);
                that._event.trigger('on', 'error', e);
            });
        },
        loadModel: function (assessmentModel) {
            this._assessmentTest.loadAssessmentItem(assessmentModel);
        },
        _render: function (obj, option, callback) {
            var $view = null;
            try {
                var type = $.type(obj);
                if (type === 'string') {
                    $view = $('#' + obj);
                } else if (type === 'object') {
                    if (obj instanceof jQuery) {
                        $view = obj;
                    } else {
                        $view = $(obj);
                    }
                }

                this._$parentView = $view;
                //设置一个唯一标识
                $view.attr('data-qti-id', this._uuid);

                //深度克隆一个新对象
                var newOption = $.extend(true, {}, option);
                //校验并纠正输入的渲染参数
                newOption = _utils.checkOption(newOption);
                //补充默认配置
                this._option = $.extend({}, this._createOption, newOption);
                //处理extend时数组会合并的问题
                if (newOption.randomSeed && $.type(newOption.randomSeed) === 'array' && newOption.randomSeed.length > 0) {
                    this._option.randomSeed = newOption.randomSeed;
                }
                this._assessmentTest.render($view, this._option, callback);
            } catch (ex) {
                var e = Exception.create('render', ex);
                _logger.error('render异常', e);
                this._event.trigger('on', 'error', e);
                if ($view) {
                    var text = _utils.getLangText('error', option);
                    $view.html('<p style="color: #e02222;font-size: 18px;margin-top: 5px;text-align: left">' + text + '</p>');
                }
            }
        },
        render: function (obj, option, callback) {
            this._render(obj, option, callback);
        },
        _destroy: function () {
            this._event.trigger('render', 'destroy', this._option);
            this._reRenderInit();
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            if (assessmentItem) {
                assessmentItem.destroy();
            }
        },
        destroy: function () {
            this._destroy();
        },
        getModelType: function () {
            var modelType = {};
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            if (assessmentItem) {
                var itemModel = assessmentItem.getItemModel(false);
                var model;
                for (var modelId in itemModel.modelMap) {
                    model = itemModel.modelMap[modelId];
                    modelType[modelId] = model.modelType;
                }
            }
            return modelType;
        },
        isMultipleModel: function () {
            var result = false;
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            if (assessmentItem) {
                var itemModel = assessmentItem.getItemModel(false);
                var num = 0;
                for (var modelId in itemModel.modelMap) {
                    num++;
                }
                if (num > 1) {
                    result = true;
                }
            }
            return result;
        },
        getScore: function () {
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            return assessmentItem ? assessmentItem.getScore() : 0;
        },
        getAnswerState: function () {
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            return assessmentItem ? assessmentItem.getAnswerState() : {};
        },
        setAnswerState: function (answerState) {
            var result = false;
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            if (assessmentItem) {
                result = assessmentItem.setAnswerState(answerState);
            }
            return result;
        },
        getAnswer: function () {
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            return assessmentItem ? assessmentItem.getAnswer() : {};
        },
        answerOnChange: function (callback) {
            this._event.bind('answer', 'change', callback);
        },
        latexOnEnded: function (callback) {
            this._event.bind('latex', 'onEnded', callback);
        },
        answerOnClick: function (callback) {
            this._event.bind('assessmentItem', 'optionClick', callback);
        },
        getAssessmentModel: function () {
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            return assessmentItem ? assessmentItem.getItemModel() : {};
        },
        setAnswer: function (answer) {
            var result = false;
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            if (assessmentItem) {
                result = assessmentItem.setAnswer(answer);
                this._event.trigger('answer', 'change', assessmentItem.getAnswer());
            }
            return result;
        },
        setStat: function (stat) {
            var result = false;
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            if (assessmentItem) {
                result = assessmentItem.setStat(stat);
            }
            return result;
        },
        setTitleExtras: function (stat) {
            var result = false;
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            if (assessmentItem) {
                result = assessmentItem.setTitleExtras(stat);
            }
            return result;
        },
        getState: function () {
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            return assessmentItem ? assessmentItem.getState() : '';
        },
        setState: function (state) {
            var result = false;
            var assessmentItem = this._assessmentTest.getAssessmentItem();
            if (assessmentItem) {
                result = assessmentItem.setState(state);
                this._event.trigger('answer', 'change', assessmentItem.getAnswer());
            }
            return result;
        },
        mediaOnStart: function (callback) {
            this._media.mediaOnStart(callback);
        },
        mediaOnPause: function (callback) {
            this._media.mediaOnPause(callback);
        },
        mediaOnEnded: function (callback) {
            this._media.mediaOnEnded(callback);
        },
        mediaOnTimeupdate: function (callback) {
            this._media.mediaOnTimeupdate(callback);
        },
        mediaOnVolumeChange: function (callback) {
            this._media.mediaOnVolumeChange(callback);
        },
        mediaOnSeeked: function (callback) {
            this._media.mediaOnSeeked(callback);
        },
        mediaPlay: function (mediaType, index) {
            this._media.mediaPlay(mediaType, index);
        },
        mediaPause: function (mediaType, index) {
            this._media.mediaPause(mediaType, index);
        },
        mediaPauseAll: function () {
            this._media.mediaPauseAll(this._getView());
        },
        mediaSkip: function (mediaType, index, seeked) {
            this._media.mediaSkip(mediaType, index, seeked);
        },
        mediaVolumeChange: function (mediaType, index, volume, display) {
            this._media.mediaVolumeChange(mediaType, index, volume, display);
        },
        _mediaOnFullScreenChange: function (callback) {
            this._media.mediaOnFullScreenChange(callback);
        },
        mediaOnFullScreenChange: function (callback) {
            this._mediaOnFullScreenChange(callback);
        },
        loadOnError: function (callback) {
            _QtiPlayer.loadOnError(callback);
        },
        imageOnClick: function (callback) {
            this._event.bind('image', 'click', callback);
        },
        //显示题目
        showQuestion: function (obj, identifiers) {
            var type = $.type(obj);
            var $view = null;
            if (type === 'string') {
                $view = $('#' + obj);
            } else if (type === 'object') {
                if (obj instanceof jQuery) {
                    $view = obj;
                } else {
                    $view = $(obj);
                }
            }

            if ($.type(identifiers) !== 'array') {
                identifiers = [];
            }

            if (identifiers.length === 0) {
                $view.find('._qp-model').show();
            } else {
                $view.find('._qp-model').each(function () {
                    var $model = $(this);
                    var hasIdentifier = false;
                    identifiers.forEach(function (identifier) {
                        if ($model.attr('data-model-id') === identifier) {
                            hasIdentifier = true;
                        }
                    });
                    if (hasIdentifier) {
                        $model.show();
                    } else {
                        $model.hide();
                    }
                });
            }
            this._reRenderInit();
        },
        /**
         *
         * @param data {showSubSequence:false//是否显示序号}
         */
        showAnswer: function () {
            this._reRenderInit();
            this._assessmentTest.getAssessmentItem().showAnswer(this._getView());
        },
        showCheckedAnswer: function () {
            this._reRenderInit();
            this._assessmentTest.getAssessmentItem().showCheckedAnswer(this._getView());
        },
        showEffectiveQuestion: function () {
            this._reRenderInit();
            this._assessmentTest.getAssessmentItem().showEffectiveQuestion(this._getView());
        },
        showCorrectAnswer: function (data) {
            this._reRenderInit();
            if (data && typeof data.showSubSequence !== typeof undefined) {
                this._option.showSubSequence = data.showSubSequence;
                this._assessmentTest._option.showSubSequence = data.showSubSequence;
            }
            this._assessmentTest.getAssessmentItem().showCorrectAnswer(this._getView(), data);
        },
        showStatisAnswer: function () {
            this._reRenderInit();
            this._assessmentTest.getAssessmentItem().showStatisAnswer(this._getView());
        },
        showDefaultExtras: function (extrasOption) {
            extrasOption = $.extend(true, ExtrasOption, extrasOption);
            this._assessmentTest.getAssessmentItem().showDefaultExtras(this._getView(), extrasOption);
        },
        appendToExtras: function (appendView, appendModelId) {
            this._assessmentTest.getAssessmentItem().appendToExtras(this._getView(), appendView, appendModelId);
        },
        reset: function () {
            this._reRenderInit();
            this._assessmentTest.getAssessmentItem().reset(this._getView());
            this.setAnswerAreaVisible(true);
        },
        setLock: function (lockArea, lockMedia) {
            this._reRenderInit();
            this._option.showLock = lockArea;
            this._assessmentTest._option.showLock = lockArea;
            this._assessmentTest.getAssessmentItem().setLock(this._getView(), lockArea);

            if (typeof lockMedia !== typeof  undefined) {
                this.lockMedia(lockMedia, this._getView());
            }
        },
        setHintVisible: function (visible) {
            this._reRenderInit();
            var $view = this._getView();
            this._option.showHint = visible;
            this._assessmentTest._option.showHint = visible;
            if (visible) {
                $view.find('._hint-pop-container').removeClass('nqti-hide-dom');
                $view.find('._hint-pop-btn').removeClass('nqti-hide-dom');
            } else {
                $view.find('._hint-pop-container').addClass('nqti-hide-dom');
                $view.find('._hint-pop-btn').addClass('nqti-hide-dom');
            }
        },
        setQuestionNameVisible: function (visible) {
            this._reRenderInit();
            var $view = this._getView();
            this._option.showQuestionName = visible;
            this._assessmentTest._option.showQuestionName = visible;
            if (visible) {
                $view.find('._qti-title-prefix-qtype').removeClass('nqti-hide-dom');
            } else {
                $view.find('._qti-title-prefix-qtype').addClass('nqti-hide-dom');
            }
        },
        setAnswerAreaVisible: function (visible) {
            this._reRenderInit();
            var $view = this._getView();
            if (visible) {
                $view.find('.nqti-module-content').removeClass('nqti-hide-dom');
            } else {
                $view.find('.nqti-module-content').addClass('nqti-hide-dom');
            }
            this._assessmentTest.getAssessmentItem().setAnswerAreaVisible($view, visible);
        },
        lockMedia: function (lock, view) {
            this._media.setLock(lock, view);
        },
        _getView: function () {
            return $('[data-qti-id="' + this._uuid + '"]');
        },
        getId: function () {
            return this._uuid;
        },
        //重新渲染界面内容
        _reRenderInit: function () {
            _QtiPlayer.resetMedia();
            _QtiPlayer.closeCustomKeyBoard();
        },
        bindEvent: function (group, key, callback) {
            this._event.bind(group, key, callback);
        },
        on: function (key, callback) {
            this._event.bind('on', key, callback);
        }
    };


    var instanceHwApi = require('player/hw/instanceHwApi');
    var elearningPlayer = require('player/elearning/player');

    $.extend(Player, instanceHwApi);
    $.extend(Player, elearningPlayer);

    return Player;
});

//qti主入口
define('player/qtiPlayer', ['model/qtiModel'], function () {
    var _QtiPlayer = window.QtiPlayer;
    if (!_QtiPlayer) {
        throw '请先加载qti-model';
    }

    var Player = require('player/player');
    var modelHandlerFactory = require('player/model/modelHandlerFactory');
    var baseInteraction = require('player/cls/baseInteraction');
    var Class = require('player/cls/class');
    var _utils = require('player/utils/extendUtils');
    var ndMediaPlayer = require('player/media/ndMediaPlayer');
    var DigitalKeyboard = _utils.DigitalKeyboard;

    //全局api
    //获取qtiplayer实例
    _QtiPlayer.createPlayer = function (option) {
        return _QtiPlayer._createPlayer(option);
    };

    _QtiPlayer._createPlayer = function (option) {
        var player = Player.create(option);
        return player;
    };
    //注册modelHandler
    _QtiPlayer.registerModelHandler = function (modelHandler) {
        modelHandlerFactory.register(modelHandler);
    };

    _QtiPlayer.BaseInteraction = baseInteraction;
    _QtiPlayer.Class = Class;

    //扩展键盘,关闭自定义的键盘
    _QtiPlayer.closeCustomKeyBoard = function () {
        //关闭DigitalInput数字键盘
        DigitalKeyboard.closeKeyBoard(true);
    };

    _QtiPlayer.resetMedia = function () {
        var mediaImpl = ndMediaPlayer.getMediaImpl();
        if (mediaImpl && mediaImpl.reset) {
            mediaImpl.reset();
        }
    };



    _QtiPlayer.destroy = function () {

    };

    var QtiHwApi = require('player/hw/qtiHwApi');
    $.extend(_QtiPlayer, QtiHwApi);

});

//qti主入口初始化
require('player/qtiPlayer');
(function ($) {

    $.support.touch = 'ontouchend' in document;
    $.support.mobile = navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i) ? true : false;
    var vEventHandler = {};
    if ($.support.touch && $.support.mobile) {
        //拥有触屏事件
        vEventHandler.mouseDown = 'touchstart';
        vEventHandler.mouseUp = 'touchend';
        vEventHandler.mouseWheel = 'touchmove';
        vEventHandler.getEventX = function (event) {
            return event.originalEvent.changedTouches[0].clientX;
        };
        vEventHandler.getEventY = function (event) {
            return event.originalEvent.changedTouches[0].clientY;
        };
    } else {
        //没有触屏幕事件
        vEventHandler.mouseDown = 'mousedown';
        vEventHandler.mouseUp = 'mouseup';
        vEventHandler.mouseWheel = 'mousewheel';
        vEventHandler.getEventX = function (event) {
            return event.clientX;
        };
        vEventHandler.getEventY = function (event) {
            return event.clientY;
        };
    }
    //解决fixed布局，touch事件无效bug http://stackoverflow.com/questions/8809706/ios-5-safari-bug-with-html-touch-events-on-positionfixed-div
    $.support.fixed = function () {
        var bodys = document.getElementsByTagName("body");
        if (bodys && bodys.length > 0) {
            $(bodys[0]).on("touchstart", function () {
            });
        }
        $.support.fixed = true;
    };
    $.support.fixed();
    //点击事件
    $.event.special.qpTap = {
        setup: function () {
            var $that = $(this);
            var alwaysUseTap = $that.data('alwaysUseTap');
            //$that.unbind('click');
            if ($.support.touch && $.support.mobile || alwaysUseTap === true) {
                if ($.support.fixed !== true) {
                    $.support.fixed();
                }
                var vMouseDown = vEventHandler.mouseDown;
                var vMouseUp = vEventHandler.mouseUp;
                //$that.unbind(vMouseUp).unbind(vMouseDown);
                var _start = 0;
                var _startX = 0;
                var _startY = 0;
                $that.bind(vMouseDown, function (event) {
                    if (event.which !== 0 || event.which !== 1) {
                        _start = new Date().getTime();
                        _startX = vEventHandler.getEventX(event);
                        _startY = vEventHandler.getEventY(event);
                    }
                });
                $that.bind(vMouseUp, function (event) {
                    if (event.which !== 0 || event.which !== 1) {
                        var end = new Date().getTime();
                        var endX = vEventHandler.getEventX(event);
                        var endY = vEventHandler.getEventY(event);
                        var holdTime = end - _start;
                        var dx = Math.abs(endX - _startX);
                        var dy = Math.abs(endY - _startY);
                        if (holdTime <= 850 && dx < 6 && dy < 6) {
                            //触发tap事件
                            event = $.event.fix(event);
                            event.type = 'qpTap';
                            $that.triggerHandler(event);
                        }
                    }
                });
            } else {
                $that.bind('click', function (event) {
                    //触发tap事件
                    event = $.event.fix(event);
                    event.type = 'qpTap';
                    $that.triggerHandler(event);
                });
            }
        },
        teardown: function () {
            var vMouseDown = vEventHandler.mouseDown;
            var vMouseUp = vEventHandler.mouseUp;
            var $that = $(this);
            $that.unbind(vMouseUp).unbind(vMouseDown);
        }
    };
    $.fn.qpTap = function (callback) {
        return this.bind('qpTap', callback);
    };
    //滚动事件
    $.event.special.qpMouseWheel = {
        setup: function () {
            var $that = $(this);
            if ($.support.touch && $.support.mobile) {
                var _startY = 0;
                $that.unbind('touchstart').unbind('touchmove');
                $that.bind('touchstart', function (event) {
                    _startY = event.originalEvent.changedTouches[0].pageY;
                });
                $that.bind('touchmove', function (event) {
                    var currentY = event.originalEvent.changedTouches[0].pageY;
                    if (currentY !== _startY) {
                        event = $.event.fix(event);
                        event.type = 'qpMouseWheel';
                        event.deltaY = currentY - _startY;
                        //触发qpMouseWheel事件
                        $that.trigger(event);
                        _startY = currentY;
                    }
                });
            } else {
                $that.unbind('mousewheel');
                $that.bind('mousewheel', function (event) {
                    event = $.event.fix(event);
                    event.type = 'qpMouseWheel';
                    event.deltaY = event.originalEvent.deltaY;
                    //触发qpMouseWheel事件
                    $that.trigger(event);
                });
            }
        },
        teardown: function () {
            var $that = $(this);
            if ($.support.touch && $.support.mobile) {
                $that.unbind('touchstart').unbind('touchmove');
            } else {
                $that.unbind('mousewheel');
            }
        }
    };
    $.fn.qpMouseWheel = function (callback) {
        return this.bind('qpMouseWheel', callback);
    };
    $.fn.qpStopMouseWheel = function () {
        this.bind(vEventHandler.mouseWheel, function (event) {
            event.preventDefault();
        });
    };

    $.fn.qpActive = function (activeCls) {
        var that = this;
        this.on('mousedown touchstart', function () {
            that.addClass(activeCls || 'ui_btn_active');
        }).on('mouseup mouseleave touchcancel touchend', function () {
            that.removeClass(activeCls || 'ui_btn_active');
        });
        return this;
    };
})(jQuery);

/**
 * ccy 拖动
 * @date 2015.06.16
 * @param $
 */
(function ($) {
  'use strict';

  var Draggable,
  	//__bind用处，当对象相互调用传递方法：如 将a对象的f方法传递给b对象当属性 b={bf:a.f} ; b.bf()的this是b
	//如果 a.f = __bind(a.f,a) ;  b={bf:a.f} ;b.bf()的this是a ;
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

    var getScale = function ($dom) {
        if ($dom && $dom.length > 0) {
            var offWidth = $dom[0].offsetWidth;
            return (offWidth > 0 ? ($dom[0].getBoundingClientRect().width / offWidth) : 1) || 1;
        }
        return 1;
    };

  Draggable = (function() {



    function Draggable($container, options) {

      this.click = __bind(this.click, this);
      this.moved = __bind(this.moved, this);
      this.ended = __bind(this.ended, this);
      this.began = __bind(this.began, this);
      this.coordinate = __bind(this.coordinate, this);
      this.off = __bind(this.off, this);
      this.on = __bind(this.on, this);
      this.toggle = __bind(this.toggle, this);
      this.bind = __bind(this.bind, this);
      this.$container = $container;
      this.getElements = __bind(this.getElements, this);
      this.resetElements = __bind(this.getElements, this);
      this.options = $.extend({},Draggable.DEFAULTS,options);
      this.$elements =  this.$container.find( this.options.selector );
      if(  this.$elements.length === 0 ) return ;

	  this.elementOpts = {
	    		  count : this.$elements.length,
	    		  width : this.$elements.eq(0).width(),
	    		  height: this.$elements.eq(0).height()
	  };

      this.toggle();


    }

    Draggable.DEFAULTS = {
    		"z-index":999,
    		opacity: "0.8",
    		version:"0.01",
    		selector:' [data-toggle="draggable"]'
    };

    Draggable.prototype.getElements = function() {
    	return this.$container.find( this.options.selector );
    };
    //重置拖动元素
    Draggable.prototype.resetElements = function() {
    	delete this.$elements ;
    	this.$elements = this.getElements() ;
    	return this.$elements;
    };

    //处理鼠标移动，鼠标键松开事件
    Draggable.prototype.bind = function(method) {
      if (method == null) {
        method = 'on';
      }
      this.$container[method]('mousemove touchmove', this.moved);
      return this.$container[method]('mouseup mouseleave touchend touchcancel', this.ended);
    };

    Draggable.prototype.toggle = function(method) {
      if (method == null) {
        method = 'on';
      }

      this.$container[method]('mousedown touchstart',this.options.selector, this.began);
      return this.$container[method]('click', this.options.selector, this.click);
    };

    Draggable.prototype.on = function() {
      return this.toggle('on');
    };

    Draggable.prototype.off = function() {
      return this.toggle('off');
    };

    Draggable.prototype.coordinate = function(event) {
      switch (event.type) {
        case 'touchstart':
        case 'touchmove':
        case 'touchend':
        case 'touchcancel':
          return event.originalEvent.touches[0];
        default:
          return event;
      }
    };
    //鼠标点击开始
    Draggable.prototype.began = function(event) {
        this.bodyRect = {
            height: $(document.body).height(),
            width: $(document.body).width()
        };
      var _ref;
      if( this.$container.data("disabled")==="disabled" ||  this.$container.data("disabled")==="true" ){
    	return ;
      }
      if (this.$target) {
        return;
      }
        if (!this.scale) {
            this.scale = getScale(this.$container);
        }
      //event.preventDefault();
      //event.stopPropagation();
      //绑定鼠标移动，鼠标松开事件
      this.bind('on');
      this.$target = $(event.target).closest( '[data-toggle="draggable"]');


  	  if( !this.containerOpts || this.containerOpts.width !==  this.$container.width() ){
		  this.containerOpts = {
	    		  width : this.$container.width(),
	      		  height: this.$container.height()
	      };
      }

      //计算行列数
  	  if( this.$elements.length>1 ){

	  	  var fPosition = this.$elements.first().position() ;
	  	  var sPosition = this.$elements.eq(1).position() ;
	  	  var lPosition = this.$elements.last().position() ;

	  	  var spaceWidth= sPosition.left-fPosition.left - this.elementOpts.width;
	  	  this.elementOpts.columns = 	 Math.floor( ( this.containerOpts.width -this.elementOpts.width-spaceWidth/2)/(sPosition.left-fPosition.left)+1 );
	  	  this.elementOpts.rows =  Math.ceil( this.elementOpts.count / this.elementOpts.columns );
	  	  //console.log( spaceWidth+"|"+this.containerOpts.width +"|"+ this.elementOpts.columns  +"||"+ this.elementOpts.rows )
  	  }else {
  		//0个元素 0列0行，1同
  		this.elementOpts = {
  				columns:this.$elements.length,
  				rows:this.$elements.length
  		};
  	  }
      //console.log("||--拖动点击前的位置--"+this.$target.position().left+"|"+this.$target.position().top);
      //设置拖动对象样式前要先占位 修复拖动时，添加了新元素导致的换行问题
      var position=this.$target.position();
      this.$target.css({
        "position" : "absolute"
      });
      this.$placeHolder = $(this.$target[0].outerHTML).css({visibility: "hidden","position" : ""});
      this.$target.after(this.$placeHolder);
      this.resetElements();
      this.$target.css({
        "position" : "absolute",
        left:position.left/this.scale,
        top:position.top/this.scale,
        opacity:this.options.opacity
      });

  	  if ( (/^(?:a|\d)/).test(this.$target.css("z-index")) ) {
  		this.$target[0].style["z-index"] = "999";
      }
      this.$target.addClass('on');

      this.origin = {
        x: this.coordinate(event).pageX - this.$target.position().left ,
        y: this.coordinate(event).pageY - this.$target.position().top
      };

      return (_ref = this.options) != null ? typeof _ref.began === "function" ? _ref.began(event) : void 0 : void 0;
    };

    //鼠标拖动
    Draggable.prototype.moved = function(event) {
        var coor=this.coordinate(event);
        if (event.type === 'touchmove' &&
            (Math.abs(coor.clientY - this.bodyRect.height) <= 15 ||
                Math.abs(coor.clientX - this.bodyRect.width) <= 15 ||
                coor.clientX <= 15 ||
                coor.clientY <= 15
            )) {
            //console.log(this.coordinate(event), this.bodyRect);
            this.ended(event);
            return;
        }
      //console.log(" Draggable.prototype.moved ...............")
      var _ref;
      if (this.$target == null) {
        return;
      }
      event.preventDefault();
      //event.stopPropagation();
      this.$target.css({
        left: (this.coordinate(event).pageX - this.origin.x)/this.scale,
        top: (this.coordinate(event).pageY - this.origin.y)/this.scale
      });

      //计算拖动元素需插入的位置，当交互面积最大，且是矩形元素的四分一面积以上的时候做插入
      var maxIndex = -1 , maxArea = -1  ;
      var $target = this.$target ;
      var tarPos = this.$target.position() ;
        if (this.elementOpts.width == 0) {
            this.elementOpts.width = this.$elements.eq(0).width()
        }
      var eleWidth = this.elementOpts.width;
      var eleHeight = this.elementOpts.height;
      var overArea = eleWidth * eleHeight / 4 ;
      var placeHolderIndex = this.$placeHolder.index() ;

      this.$elements = this.getElements();
	  this.$elements.each(function(i){
		  if($target.index() === i ) {
			  return ;
	      }
		  var tempPos = $(this).position();

		  if( Math.abs( tarPos.left - tempPos.left ) > eleWidth || Math.abs( tarPos.top - tempPos.top ) > eleHeight ) return ;
		  //console.log("width****"+tarPos.left +"||"+ tempPos.left + "||" + eleWidth )
		 // console.log( "height***"+tarPos.top +"||"+tempPos.top + "||" + eleHeight )
		  var tempW = tarPos.left - tempPos.left ;
		  var tempH = tarPos.top - tempPos.top ;

		  tempW = tempW <= 0 ? tempW + eleWidth :  tempW = eleWidth - tempW ;
		  tempH = tempH <= 0 ? tempH + eleHeight : eleHeight - tempH ;

		  var tempA = tempW * tempH ;
		  //console.log( "area---" + tempW + "|| "+tempH+"|"+ maxArea +"||"+overArea+"||" +tempA )
		  if( maxArea < tempA  && overArea <= tempA ){
			  maxArea = tempA ;
			  maxIndex = i ;

		  }

	  });

	  if( maxIndex !== -1 ) {
		  if( this.$placeHolder.index() !== maxIndex ){
			  var $tempEle = this.$elements.eq(maxIndex) ;
			  var isAfter = this.$placeHolder.index() < $tempEle.index() ? true : false ;
			  if(isAfter){
				  this.$elements.eq(maxIndex).after(this.$placeHolder) ;
			  }else {
				  this.$elements.eq(maxIndex).before(this.$placeHolder) ;
			  }
			  this.$elements = this.$container.find( this.options.selector );
		  }
	  }
	  //计算拖动元素需插入的位置 end

      //当前拖拽的对象
      this.dragged = this.$target;
      return (_ref = this.options) != null ? typeof _ref.moved === "function" ? _ref.moved(event) : void 0 : void 0;
    };

    Draggable.prototype.ended = function(event) {
        var _ref;
        if (this.$target == null) {
          return;
        }

        //event.preventDefault();
        //event.stopPropagation();
        this.bind('off');
        this.$placeHolder.before( this.$target) ;
        this.$target.removeClass('on');

        this.$target.attr("style",this.$placeHolder.attr("style")) ;
        this.$placeHolder.remove();
        this.$target.css({"visibility":""});

        delete this.$target;
        delete this.$placeHolder ;
        delete this.origin;
        this.$elements =  this.resetElements();


        return (_ref = this.options) != null ? typeof _ref.ended === "function" ? _ref.ended(event) : void 0 : void 0;
    };

    Draggable.prototype.click = function(event) {
      if (!this.dragged) {
        return;
      }
      //event.preventDefault();
      //event.stopPropagation();
      return delete this.dragged;
    };


    return Draggable;

  })();


  function Plugin(option) {

	option = option || {} ;
    return this.each(function () {
      var $this   = $(this) ;
      if(typeof option  === "string"){
    	  $this.data('disabled',option) ;
    	  return ;
      }
  	  //console.log($this.css("z-index"));


      var data    = $this.data('my.draggable') ;
      var options = $.extend({}, $this.data(), typeof option == 'object' && option)
      //插件缓存
      if (!data){
    	  data = new Draggable($this) ;
    	  $this.data('my.draggable', data);
      }

    });
  }

  $.fn.draggabled             = Plugin ;
  $.fn.draggabled.Constructor = Draggable  ;

})(jQuery);

/**
 * ccy 排序拖动
 * @date 2015.06.16
 * @param $
 * @depend jquery,query.draggable.js
 */
(function ($) {
  'use strict';

  var Dragsort,
  	//__bind用处，当对象相互调用传递方法：如 将a对象的f方法传递给b对象当属性 b={bf:a.f} ; b.bf()的this是b
	//如果 a.f = __bind(a.f,a) ;  b={bf:a.f} ;b.bf()的this是a ;
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

  Dragsort = (function() {

    function Dragsort($container, options) {
    	//将当前this存放入各个方法中
        this.draggingMoved = __bind(this.draggingMoved, this);
        this.draggingEnded = __bind(this.draggingEnded, this);
        this.draggingBegan = __bind(this.draggingBegan, this);
        this.draggable = __bind(this.draggable, this);
        this.$ = __bind(this.$, this);
        //end

        this.options = $.extend({}, Dragsort.DEFAULTS, options);
        this.$container = $container ;
        this.$elements = this.$(this.options.draggable.selector) ;
        this.$elements.each(function(){
        	var $ele = $(this) ;
        	if(!$ele.attr("data-toggle")){
        		$ele.attr("data-toggle","draggable");
        	}
        });
        this.options.tagName = this.$elements.length>0? this.$elements.get(0).tagName.toLowerCase() :"div" ;
        //this.ordinalize(this.$('> *'));
        if (this.options.draggable !== false) {
          this.draggable();
        }
        return this;

    }

    Dragsort.DEFAULTS = {
    	base: 60,
	    gutter: 20,
	    columns: 12,
	    draggable: {
	        zIndex: 999,
	        selector: '> *'
	    },
	    placeHolderTemplate:""

    };

    Dragsort.prototype.$ = function(selector) {
        return this.$container.find(selector);
    };

    Dragsort.prototype.draggable = function(method) {
        if (this._draggable == null) {
          this._draggable = new  $.fn.draggabled.Constructor(
        	  this.$container,
	          {
	        	  id  	  : this.options.id,
	        	  selector: this.options.draggable.selector,
	           // began: this.draggingBegan,
	            ended: this.draggingEnded
	           // moved: this.draggingMoved
	          }
          );
        }
        if (method != null) {
          // return this._draggable[method]();
        }
    };



    Dragsort.prototype.draggingBegan = function(event) {

    };

    Dragsort.prototype.draggingEnded = function(event) {
      var  _ref, _update;

      return (_ref = this.options) != null ? ( _update = this.options.update) != null ? typeof _update === "function" ? _update(event) : void 0 : void 0 : void 0;
    };

    Dragsort.prototype.draggingMoved = function(event) {

    };
    return Dragsort;

  })();


  function Plugin(option) {
	option = option || {} ;
    return this.each(function () {
      var $this   = $(this) ;

      if(typeof option  === "string"){
    	  $this.data('disabled',option) ;
    	  return ;
      }
      if(option.disabled){
    	  $this.data('disabled',option.disabled) ;
    	  return
      };
      if(!$this.attr("id")){
    	  $this.attr("id","dragsort");
      }
      //console.log( $this.attr("id"))
      option.id = $this.attr("id") ;

      //position非relative , absolute, fixed ,则默认取 relative
  	  if (!(/^(?:r|a|f)/).test($this.css("position"))) {
  		this.style.position = "relative";
	  }
      var data    = $this.data('my.dragsort') ;
      var options = $.extend({}, $this.data(), typeof option == 'object' && option)
      //插件缓存
      if (!data){
    	  data = new Dragsort($this,options) ;
    	  $this.data('my.dragsort', data);
      }

    });
  }

  $.fn.dragsort             = Plugin ;
  $.fn.dragsort.Constructor = Dragsort  ;

})(jQuery);


// choiceInteraction
(function (window, $) {
    var _utils = window.QtiPlayer.getUtils();
    //创建
    var _modelHandler = {
        _name: 'choiceInteraction',
        //获取model名称
        getName: function () {
            return this._name;
        },
        //创建渲染的方法
        create: function (modelItem) {
            //获取模型数据
            var _model = modelItem.getModel();

            /**
             * 渲染答案
             * @param answer 用户答案
             * @param correctAnswer 正确答案
             * @param $option 选项dom
             * @param showChecked 是否显示作答反馈
             * @param selected 是否选中态，默认true
             */
            var _renderAnswer = function (answer, correctAnswer, $option, showChecked, selected) {
                if (answer) {
                    //渲染作答
                    $option.each(function () {
                        var $this = $(this);
                        for (var index = 0; index < answer.length; index++) {
                            if ($this.attr('identifier') === answer[index]) {
                                //默认选中
                                if (selected !== false) {
                                    $this.addClass('nqti-option-on');
                                }
                                //显示用户反馈
                                if (showChecked) {
                                    if (correctAnswer.indexOf(answer[index]) > -1) {
                                        $this.addClass('nqti-option-right');
                                    } else {
                                        $this.addClass('nqti-option-wrong');
                                    }
                                }
                                break;
                            }
                        }
                    });
                }
            };

            //返回题目类型名称
            modelItem.getName = function () {
                var simpleChoice = _model.simpleChoice;
                if (simpleChoice.length === 2) {
                    var option1 = simpleChoice[0].identifier.toLowerCase();
                    var option2 = simpleChoice[1].identifier.toLowerCase();
                    if (option1 === 'yes' && option2 === 'no') {
                        return _utils.getLangText('true_or_false', this.getOption());
                    }
                }
                return _model.maxChoices === 1 ? _utils.getLangText('single_choise', this.getOption()) : _utils.getLangText('multiple_choise', this.getOption());
            };
            modelItem.getClassName = function (option) {
                var name = 'nqti-base-choice';
                if (option.screenshotLayout && _model.maxChoices === 1) {
                    name = 'nqti-player-srcm-body';
                }
                return name;
            };
            //返回标题片段
            modelItem.createTitleHtml = function () {
                return _model.prompt;
            };
            //普通类答案渲染
            modelItem._createCommonAnswerHtml = function (isJudgment, option) {
                var result = '';
                var simpleChoice = _model.simpleChoice;
                if (isJudgment) {
                    //判断
                    result += '<ul class="nqti-base-judment-list">';
                } else if (_model.maxChoices === 1) {
                    //单选
                    result += '<ul class="nqti-base-choice-list">';
                } else {
                    //多选
                    result += '<ul class="nqti-base-choice-multiple">';
                }
                var object;
                for (var i = 0; i < simpleChoice.length; i++) {
                    object = simpleChoice[i];
                    result += '<li class="nqti-option _qp-option" data-index="' + i + '" identifier="' + object.identifier + '">';
                    if (isJudgment || _model.maxChoices === 1) {
                        result += '<i class="nqti-option-radio-icon"></i>';
                    } else {
                        result += '<i class="nqti-option-checkbox-icon"></i>';
                    }
                    result += '<span class="nqti-check">';
                    if (isJudgment === false) {
                        result += '<span class="size">' + object.identifier + '</span>';
                    }
                    result += '</span>'
                        + '<div class="nqti-content"><span class="size">' + object.content + '</span></div>'
                        + '</li>';
                }
                result += '</ul>';
                return result;
            };
            //截图类答案渲染(单选、判断)
            modelItem._createScreenshotAnswerHtml = function (isJudgment, option) {
                var result = '';
                var tipText = _utils.getLangText('choice_screenshot_title', option);
                var simpleChoice = _model.simpleChoice;
                result += '<div class="nqti-srcm-layout-options">'
                    + '<div class="nqti-com-layout-title-answer">'
                    + '<div class="nqti-txt">' + tipText + ' :</div>';
                var object;
                var optionId;
                result += '<div class="nqti-srcm-options-box">';
                for (var i = 0; i < simpleChoice.length; i++) {
                    object = simpleChoice[i];
                    optionId = object.identifier;
                    if (isJudgment) {
                        optionId = object.content;
                    }
                    result += '<label class="nqti-com-btn-radio _qp-option" data-index="' + i + '" identifier="' + object.identifier + '">'
                        + '<i class="nqti-option-radio-icon"></i><span class="nqti-txt">' + optionId + '</span>'
                        + '</label>';
                }
                result += '</div></div></div>';
                return result;
            };
            //返回答案片段
            modelItem.createAnswerHtml = function (option) {
                var simpleChoice = _model.simpleChoice;
                //是否判断题
                var isJudgment = false;
                if (simpleChoice.length === 2) {
                    var option1 = simpleChoice[0].identifier.toLowerCase();
                    var option2 = simpleChoice[1].identifier.toLowerCase();
                    if (option1 === 'yes' && option2 === 'no') {
                        isJudgment = true;
                    }
                }
                var result = '';
                if (option.screenshotLayout) {
                    if (isJudgment || _model.maxChoices === 1) {
                        //判断或则单选
                        result = this._createScreenshotAnswerHtml(isJudgment, option);
                    } else {
                        //多选，普通模式渲染
                        result = this._createCommonAnswerHtml(isJudgment, option);
                    }
                } else {
                    result = this._createCommonAnswerHtml(isJudgment, option);
                }
                return result;
            };
            //动态渲染
            modelItem.render = function ($view, option) {
                var that = this;

                var $option = $view.find('._qp-option');
                //填空点击回调
                $option.bind('qpTap', function () {
                    var val = $(this).attr('identifier');
                    var index = $(this).data('index');
                    that.triggerOptionClick(index, val);
                });
            };
            //交互事件处理
            modelItem.eventHandle = function ($view, option) {
                var that = this;
                var $option = $view.find('._qp-option');
                var getAnswer = function () {
                    var answer = [];
                    $option.each(function () {
                        var $this = $(this);
                        if ($this.hasClass('nqti-option-on')) {
                            answer.push($this.attr('identifier'));
                        }
                    });
                    return answer;
                };
                $option.each(function () {
                    var $this = $(this);
                    $this.bind('qpTap', function () {
                        if (that.isLock()) {
                            return;
                        }
                        if (_model.maxChoices === 1) {
                            //单选
                            if ($this.hasClass('nqti-option-on') === false) {
                                $option.each(function () {
                                    $(this).removeClass('nqti-option-on');
                                });
                                $this.addClass('nqti-option-on');
                            }
                        } else {
                            //多选
                            if ($this.hasClass('nqti-option-on')) {
                                $this.removeClass('nqti-option-on');
                            } else {
                                $this.addClass('nqti-option-on');
                            }
                        }
                        that.setAnswer(getAnswer());
                    });
                });
            };

            modelItem.renderReset = function ($view) {
                //do nothing
                var $options = $view.find('._qp-option');
                $options.each(function () {
                    var $this = $(this);
                    $this.removeClass('nqti-option-on');
                    $this.removeClass('nqti-option-right');
                    $this.removeClass('nqti-option-wrong');
                });
            };


            modelItem.renderAnswer = function ($view) {
                _renderAnswer(this.getAnswer(), this.getCorrectAnswer(), $view.find('._qp-option'), false);
            };

            modelItem.renderCheckedAnswer = function ($view) {
                _renderAnswer(this.getAnswer(), this.getCorrectAnswer(), $view.find('._qp-option'), true);
            };

            modelItem.renderCorrectAnswer = function ($view) {
                _renderAnswer(this.getCorrectAnswer(), this.getCorrectAnswer(), $view.find('._qp-option'), true);
            };

            modelItem.renderUsrAndCorrectAnswer = function ($view) {
                this.renderAnswer($view);
                _renderAnswer(this.getCorrectAnswer(), this.getCorrectAnswer(), $view.find('._qp-option'), true, false);
            };

            modelItem.renderLock = function ($view) {

            };
        }
    };
    //注册
    var _QtiPlayer = window.QtiPlayer;
    _QtiPlayer.registerModelHandler(_modelHandler);
})(window, jQuery);


// cloze
(function (window, $) {
    var _utils = window.QtiPlayer.getUtils();
    var randomIndex = 1;

    var HTML = {
        blank: ' <span class="nqti-base-choicecloze-space js_blank ${actived} " id="${id}">'
        + '         <span class="space-num "><em class="num-em js_choose_index">${num}</em></span>'
        + '         <span class="space-word nqti-hide-dom"><em class="word-em color-default">${text}</em></span>'
        + '      </span>',
        title: '<div class="nqti-base-choicecloze-article scrollbar_style_wood_light">${content}</div>',
        content: '                              '
        + '     <!-- 显示题号与选择结果 -->                                                '
        + '     <div class="nqti-base-choicecloze-choose-side js_choose_side">                            '
        + '                                                                                '
        + '         <div class="nqti-base-choicecloze-choose-num">                         '
        + '             <span class="nqti-base-choicecloze-choose-num-bothside"></span>    '
        + '             <div class="nqti-base-choicecloze-choose-num-body">                '
        + '                 <span class="num-t js_index">${index}</span>      '
        + '             </div>                                                             '
        + '         </div>                                                                 '
        + '         <div class="nqti-base-choicecloze-choose-ques">                        '
        + '             <span class="ques-t">(</span>                                      '
        + '             <em class="ques-em js_answer">${answer}</em>                                         '
        + '             <span class="ques-t">)</span>                                      '
        + '         </div>                                                                 '
        + '         <div class="nqti-base-choicecloze-choose-switch">                      '
        + '             <a href="javascript:;" class="switch-btn left js_switch js_switch_left ${leftdisabled} "></a>                '
        + '             <a href="javascript:;" class="switch-btn right js_switch js_switch_right ${rightdisabled} "></a>'
        + '         </div>'
        + '     </div> '
        + '     <div class="nqti-base-choicecloze-choose-option"> '
        + '        <ul class="nqti-base-choicecloze-option-list js_choose_option">${option}</ul>'
        + '     </div>',
        option: '<li class="nqti-base-choicecloze-option-item js_option">                              '
        + '    <a href="javascript:;" class="nqti-base-choicecloze-option-btn ${checked}">        '
        + '        <span class="option-btn-num" indentifier="${identifier}">${identifier}.</span>                              '
        + '        <span class="option-btn-txt">${content}</span>'
        + '    </a>                                                                    '
        + '</li>                                                                       '
    };


    var getOptionHtml = function (options, answer) {
        var option,
            optionHtml = '';

        for (i = 0; i < options.length; i++) {
            option = options[i];
            optionHtml += _utils.template(HTML.option, {
                checked: answer === option.identifier ? 'ui-btn-active' : '',
                content: option.content,
                identifier: option.identifier
            })
        }

        return optionHtml;
    }

    var getAnswerHtml = function ($view, model, answerIdentifier, index, option) {
        var result,
            $side = null,
            optionHtml = getOptionHtml(model.choices[index - 1], answerIdentifier),
            indexText = _utils.getLangText('cloze_index', option),
            indexText = _utils.template(indexText, {n: '<em class="num-em js_current_index">' + index + '</em>'}),
            leftDisabled = index === 1 ? 'click_disabled' : '',
            rightDisabled = index === model.choices.length ? 'click_disabled' : '';

        if ($view) {
            $side = $view.find('.js_choose_side');
        }

        if ($side && $side.length > 0) {
            $view.find('.js_choose_option').html(optionHtml);
            $view.find('.js_index').html(indexText);
            $view.find('.js_answer').html(answerIdentifier);
            var $left = $view.find('.js_switch_left');
            var $right = $view.find('.js_switch_right');
            $left.removeClass('click_disabled');
            $right.removeClass('click_disabled');
            $left.addClass(leftDisabled);
            $right.addClass(rightDisabled);

        } else {
            result = _utils.template(HTML.content, {
                option: optionHtml,
                answer: answerIdentifier,
                index: indexText,
                leftdisabled: leftDisabled,
                rightdisabled: rightDisabled
            });
        }
        return result;
    }

    /**
     *
     * @param model
     * @param answerIdentifier 答案
     * @param index 答案索引
     * @returns {string}
     */
    var getAnswerText = function (model, answerIdentifier, index) {
        var itemChoices = model.choices[index],
            len = itemChoices.length,
            i;
        for (i = 0; i < len; i++) {
            var item = itemChoices[i];
            if (item.identifier === answerIdentifier) {
                return item.content;
            }
        }
        return '';
    };


    var ANCHOR_KEY = 'qti_colze_blank_${identifier}_${index}';

    var _modelHandler = {
        _name: 'cloze',
        //获取modal名称
        getName: function () {
            return this._name;
        },

        //创建渲染的方法
        create: function (modelItem) {

            var _model = modelItem.getModel();

            //返回题目类型名称
            modelItem.getName = function () {
                return _utils.getLangText('cloze', this.getOption());
            };
            modelItem.getClassName = function () {
                return 'nqti-base-choicecloze';
            };
            //创建model html片段
            modelItem.createTitleHtml = function () {
                randomIndex++;
                var prompt = _model.prompt;
                var eachCount = _model.choices[0].length;
                prompt = prompt.replace(/<blank>(\d+)<\/blank>/g, function (item, index) {
                    index = parseInt(index);
                    var subIndex = index % eachCount;
                    if (subIndex === 0) {
                        subIndex = eachCount;
                    }
                    subIndex--;
                    var text = _model.choices[index - 1][subIndex].content;
                    return _utils.template(HTML.blank, {
                        id: _utils.template(ANCHOR_KEY, {identifier: randomIndex, index: index}),
                        num: index,
                        text: text,
                        actived: index == 1 ? 'ui-btn-active' : ''//默认激活第一个
                    });
                });
                return _utils.template(HTML.title, {content: prompt});
            };
            modelItem.createAnswerHtml = function (option) {
                return '<div class="nqti-base-choicecloze-choose">' + getAnswerHtml(null, _model, '', 1, this.getOption()) + '</div>';
            };

            modelItem.render = function ($view, option) {
                var that = this,
                    $blanks = $view.find('.js_blank'),
                    answer = '';

                //位置点击回调
                $blanks.on('qpTap', function () {
                    var $this = $(this),
                        index = $blanks.index($this),
                        answer = that.getCorrectAnswer()[index];
                    that.triggerOptionClick(index);
                });
            };

            modelItem.renderReset = function ($view) {
                var $blanks = $view.find('.js_blank');
                var $contentIns = $view.find('.nqti-base-choicecloze-choose');
                $blanks.removeClass('ui-btn-active');
                $blanks.find('.space-num').removeClass('nqti-hide-dom');
                $blanks.find('.space-word').addClass('nqti-hide-dom');
                $contentIns.html(getAnswerHtml($view, _model, '', 1, this.getOption()));

                if (!this.getOption().hideAnswerArea) {
                    $blanks.eq(0).addClass('ui-btn-active');
                }
            };

            modelItem._renderAnswer = function ($view, answer, checked) {
                var userAnswer = answer,
                    correctAnswer = this.getCorrectAnswer(),
                    eachAnswer = '',
                    $blank,
                    $spaceWord,
                    $word,
                    $num,
                    $blanks = $view.find('.js_blank');

                //渲染每个填空位置
                $blanks.each(function (index, element) {
                    eachAnswer = userAnswer[index];
                    $blank = $(element);
                    $word = $blank.find('.word-em');
                    $spaceWord = $blank.find('.space-word');
                    $num = $blank.find('.space-num');
                    $num.removeClass('nqti-hide-dom');
                    $spaceWord.removeClass('nqti-hide-dom');
                    $word.removeClass('color-correct color-error color-default');

                    if (eachAnswer) {
                        $num.addClass('nqti-hide-dom');
                        $word.html(getAnswerText(_model, eachAnswer, index));
                        $word.removeClass('color-default color-correct color-error');
                        //显示作答反馈
                        if (checked) {
                            if (userAnswer[index] === correctAnswer[index]) {
                                $word.addClass('color-correct');
                            } else {
                                $word.addClass('color-error');
                            }
                        } else {
                            $word.addClass('color-default');
                        }
                    } else {
                        $spaceWord.addClass('nqti-hide-dom');
                    }
                });

                $blanks.removeClass('ui-btn-active');

                var $contentIns = $view.find('.nqti-base-choicecloze-choose');
                var contentHtml = getAnswerHtml($view, _model, userAnswer[0], 1, this.getOption());
                $contentIns.html(contentHtml);

                if (!this.getOption().hideAnswerArea) {
                    var index = parseInt($view.find('.js_current_index').text());
                    $blanks.eq(index - 1).addClass('ui-btn-active');
                }
                //重置为页面顶部
                //$view.find('.nqti-base-choicecloze-article').scrollTop(0);
            }

            modelItem.renderAnswer = function ($view) {
                this._renderAnswer($view, this._getAnswerChecked(), false);
            };

            modelItem.renderCheckedAnswer = function ($view) {
                this._renderAnswer($view, this._getAnswerChecked(), true);
            };

            modelItem.renderCorrectAnswer = function ($view) {
                this._renderAnswer($view, this.getCorrectAnswer(), true);
            };

            modelItem._getAnswerChecked = function () {
                var answer = this.getAnswer(),
                    correctAnswer = this.getCorrectAnswer();
                if (!answer || answer.length < correctAnswer.length) {
                    answer = [];
                    for (var i = 0; i < correctAnswer.length; i++) {
                        answer.push('');
                    }
                }
                return answer;
            }

            modelItem.renderAnswerAreaVisible = function ($view, visible) {
                var $blanks = $view.find('.js_blank');
                $blanks.removeClass('ui-btn-active');
                if (!this.getOption().hideAnswerArea && visible) {
                    var index = parseInt($view.find('.js_current_index').text());
                    $blanks.eq(index - 1).addClass('ui-btn-active');
                }
            }

            modelItem.eventHandle = function ($view, option) {
                var that = this;
                var $blanks = $view.find('.js_blank');
                var $contentIns = $view.find('.nqti-base-choicecloze-choose');

                if (!_utils.Broswer.Mobile()) {
                    $view.find('.js_switch_left').qpActive();
                    $view.find('.js_switch_right').qpActive();
                }
                var optionClick = function ($this) {
                    if (that.isLock()) {
                        return;
                    }
                    var identifier = $this.find('.option-btn-num').attr('indentifier'),
                        text = $this.find('.option-btn-txt').text(),
                        index = parseInt($view.find('.js_current_index').text()),
                        answer = that._getAnswerChecked(),
                        $blank = $blanks.eq(index - 1),
                        $blankWord = $blank.find('.word-em');

                    $view.find('.js_answer').html(identifier);
                    $blank.find('.space-num').addClass('nqti-hide-dom');
                    $blank.find('.space-word').removeClass('nqti-hide-dom');
                    $blankWord.addClass('color-default').html(text);
                    $view.find('.nqti-base-choicecloze-option-btn').removeClass('ui-btn-active');
                    $this.find('.nqti-base-choicecloze-option-btn').addClass('ui-btn-active');
                    answer[index - 1] = identifier;
                    that.setAnswer(answer);
                }

                var switchClick = function ($this) {
                    if ($this.hasClass('click_disabled')) {
                        return;
                    }

                    var allAnswer = that._getAnswerChecked();
                    if (that.getOption().showCorrectAnswer) {
                        allAnswer = that.getCorrectAnswer();
                    }

                    var currentIndex = parseInt($view.find('.js_current_index').text()),
                        isLeft = $this.hasClass('left'),
                        index = isLeft ? currentIndex - 1 : currentIndex + 1,
                        answer = allAnswer[index - 1] || '',
                        contentHtml = getAnswerHtml($view, _model, answer, index, that.getOption()),
                        $blank = $blanks.eq(index - 1);

                    var offset = $blank.offset(),
                        blankHeight = $blank.height(),
                        articleOffset = $view.find('.nqti-base-choicecloze-article').offset(),
                        articleHeight = $view.find('.nqti-base-choicecloze-article').height();

                    if ((offset.top - articleOffset.top < 0)
                        || offset.top - articleOffset.top > articleHeight - blankHeight) {
                        window.location.hash = "#" + _utils.template(ANCHOR_KEY, {identifier: randomIndex, index: index});
                    }

                    $blanks.removeClass('ui-btn-active');
                    $blank.addClass('ui-btn-active');
                    //更新整个作答区域
                    $contentIns.html(contentHtml);
                };

                //作答区域点击事件
                $contentIns.on('qpTap', function (e) {
                    var $this = $(e.target);
                    var $trigger = $this.closest('.nqti-base-choicecloze-option-btn');
                    if ($trigger && $trigger.length > 0) {
                        optionClick($trigger.parent());
                        return;
                    }
                    $trigger = $this.closest('.js_switch');
                    if ($trigger && $trigger.length > 0) {
                        switchClick($trigger);
                        return;
                    }
                });


                //标题填空位置
                $blanks.on('qpTap', function () {
                    var $this = $(this),
                        index = $blanks.index($this),
                        answer = that._getAnswerChecked()[index] || '';


                    if (that.getOption().showCorrectAnswer) {
                        answer = that.getCorrectAnswer()[index];
                    }
                    var contentHtml = getAnswerHtml($view, _model, answer, index + 1, that.getOption());

                    //更新整个作答区域
                    $contentIns.html(contentHtml);
                    $blanks.removeClass('ui-btn-active');
                    if (!that.getOption().hideAnswerArea) {
                        $this.addClass('ui-btn-active');
                    }
                });
            };
        }
    };
    //注册
    var _QtiPlayer = window.QtiPlayer;
    _QtiPlayer.registerModelHandler(_modelHandler);
})(window, jQuery);


// choiceInteraction_vote
(function (window, $) {

    var _utils = window.QtiPlayer.getUtils();
    //创建
    var _modelHandler = {
        _name: 'choiceInteraction_vote',
        //获取model名称
        getName: function () {
            return this._name;
        },
        //创建渲染的方法
        create: function (modelItem) {
            //获取数据模型
            var _model = modelItem.getModel();

            //选项单字文本标识
            var _singleText = true;
            //非单字文本，且投票项超过8个
            var _tooManyOptions = false;
            //正则
            var imageRegex = /<img[\s\S]*?\/>/g;
            var imageSrcRegex = /src="([\s\S]*?)"/;
            var contentTextRegex = /<p[\s\S]*?>([\s\S]*)<\/p>/;
            //特殊字符判断&<>
            var specifiedCharacterRegex = /^&(gt|lt|amp);$/i;

            //选项数据处理
            var simpleChoice = _model.simpleChoice;
            var choice;
            var choiceText;
            for (var index = 0; index < simpleChoice.length; index++) {
                choice = simpleChoice[index];
                //编号处理
                choice.identifier = choice.identifier.replace('ndvote_', '');
                //图片内容处理,只取最后一个img的内容，其他img的内容全部清空。清空图片后剩下的都是文字内容
                var image = '';
                choice.content = choice.content.replace(imageRegex, function (imageHtml) {
                    //设置图片期望高宽属性
                    var imageSrc = _utils.getValue(imageHtml, imageSrcRegex);
                    image = '<img data-media-img-render="false" src="' + imageSrc + '" alt=""/>';
                    return '';
                });
                choice.image = image;
                //提取图片后判断是否还有文字
                //替换掉html的空格编码
                choiceText = _utils.getValue(choice.content, contentTextRegex).trim();
                choice.content = choiceText;
                //判断是否单字文本
                if (choice.image !== '' || (choiceText.length !== 1 && !specifiedCharacterRegex.test(choiceText))) {
                    _singleText = false;
                }
                //判断是否是空文本
                if (choiceText === '') {
                    choice.content = '';
                }
            }
            //判断是否有太多的选项
            if (_singleText === false && simpleChoice.length > 8) {
                _tooManyOptions = true;
            }
            //返回题目类型名称
            modelItem.getName = function () {
                return _utils.getLangText('voting', this.getOption());
            };
            modelItem.getClassName = function () {
                return 'nqti-vote';
            };
            //该model没有提示
            modelItem.hasHint = function () {
                return false;
            };
            //返回标题片段
            modelItem.createTitleHtml = function (option) {
                var sigleitem = _utils.getLangText('vote_sigleitem', option);
                var mutipleitem = _utils.getLangText('vote_mutipleitem', option);
                //标题处理，增加单项投票和不定项投票提示
                var prefix = '<div>(' + sigleitem + ')</div>';
                if (_model.maxChoices !== 1) {
                    prefix = '<div>(' + mutipleitem + ')</div>';
                }
                return prefix + _model.prompt;
            };
            //返回答案片段
            modelItem.createAnswerHtml = function (option) {
                var optionHtml = '';
                var simpleChoice = _model.simpleChoice;
                var tip = _utils.template(_utils.getLangText('vote_tip', option), {x: simpleChoice.length});
                var choice;
                //选项布局类型
                //是否增加选项过多提示
                if (_tooManyOptions) {
                    optionHtml += '<div class="nqti-base-vote-hint">'
                        + '<span class="nqti-base-vote-txt">'
                        + tip
                        + '</span></div>';
                }
                var ulClass = 'nqti-fixed';
                //单字文本去除nqti-fixed样式
                if (_singleText) {
                    ulClass = '';
                }
                optionHtml += '<ul class="nqti-base-vote-list ' + ulClass + '">';
                var liHtml;
                for (var index = 0; index < simpleChoice.length; index++) {
                    choice = simpleChoice[index];
                    if (_singleText) {
                        liHtml = '<span class="nqti-base-vote-list-txt">' + choice.content + '</span>';
                    } else {
                        if (choice.image.length > 0) {
                            //有图片
                            liHtml = choice.image;
                            if (choice.content.length > 0) {
                                liHtml += '<p class="nqti-base-vote-list-desc">'
                                    + '<i class="opacity_black_bg" style="display: none;"></i>'
                                    + '<sapn class="nqti-base-vote-list-desc-txt">'
                                    + choice.content
                                    + '</span>'
                                    + '</p>';
                            }
                        } else {
                            liHtml = '<p class="nqti-base-vote-list-txt">' + choice.content + '</p>';
                        }
                    }
                    var iconText = choice.identifier;
                    //获取统计信息
                    if (option.showStat) {
                        var stat = this.getStat();
                        if (typeof stat[iconText] !== typeof undefined && stat[iconText] !== '') {
                            iconText = iconText + '(' + stat[iconText] + ')';
                        }
                    }
                    optionHtml += '<li class="nqti-base-vote-list-cell _qp-option" data-identifier="' + choice.identifier + '">'
                        + '<div class="nqti-base-vote-list-box">'
                        + '<div class="nqti-base-vote-list-views">'
                        + liHtml
                        + '<i class="nqti-checked-icon"></i>'
                        + '</div>'
                        + '<p class="nqti-base-vote-list-index">'
                        + iconText
                        + '</p>'
                        + '</div>'
                        + '</li>';
                }
                optionHtml += '</ul>';
                return optionHtml;
            };
            //动态渲染
            modelItem.render = function ($view, option) {
                var that = this;
            };
            //交互事件处理
            modelItem.eventHandle = function ($view, option) {
                var that = this;
                var $option = $view.find('._qp-option');
                $option.each(function () {
                    var $that = $(this);
                    $that.bind('qpTap', function () {
                        if (that.isLock()) {
                            return;
                        }
                        var optionChecked = $that.data('identifier');
                        if ($that.hasClass('nqti-checked')) {
                            $that.removeClass('nqti-checked');
                        } else {
                            $that.addClass('nqti-checked');
                            if (_model.maxChoices === 1) {
                                //单选,清除其他选中
                                $option.each(function () {
                                    var $this = $(this);
                                    var option = $this.data('identifier');
                                    if (option != optionChecked) {
                                        $this.removeClass('nqti-checked');
                                    }
                                });
                            }
                        }
                        //保存当前答案
                        var answer = [];
                        $option.each(function () {
                            var $this = $(this);
                            if ($this.hasClass('nqti-checked')) {
                                answer.push($this.data('identifier').toString());
                            }
                        });
                        that.setAnswer(answer);
                    });
                });
            };

            modelItem.renderReset = function ($view) {
                $view.find('._qp-option').each(function () {
                    var $this = $(this);
                    $this.removeClass('nqti-checked');
                });
            };


            modelItem.renderAnswer = function ($view) {
                var answer = this.getAnswer();
                $view.find('._qp-option').each(function () {
                    var $this = $(this);
                    for (var index = 0; index < answer.length; index++) {
                        if ($this.data('identifier') == answer[index]) {
                            $this.addClass('nqti-checked');
                            break;
                        }
                    }
                });
            };

            modelItem.renderCheckedAnswer = function ($view) {
                this.renderAnswer($view)
            };

            modelItem.renderCorrectAnswer = function ($view) {
            };

            modelItem.renderLock = function ($view) {

            };
        }
    };
    //注册
    var _QtiPlayer = window.QtiPlayer;
    _QtiPlayer.registerModelHandler(_modelHandler);
})(window, jQuery);


// drawingInteraction_handwrite
(function (window, $) {
    var _utils=QtiPlayer.getUtils();
    //创建
    var _modelHandler = {
        _name: 'drawingInteraction_handwrite',
        //获取model名称
        getName: function () {
            return this._name;
        },
        //创建渲染的方法
        create: function (modelItem) {
            var _model = modelItem.getModel();
            var _canvasWidth = _model.object.width - 4;
            var _canvasHeight = _model.object.height - 8;
            var _canvasId = 'cvs';

            //返回题目类型名称
            modelItem.getName = function () {
                return '手写题';
            };

            //该model没有小题编号
            modelItem.hasNum = function () {
                return false;
            };
            modelItem.createTitleHtml = function () {
                return '<div class="qp-model-header">' + _model.prompt + '</div>';
            }
            modelItem.createAnswerHtml = function (option) {
                var html = '';
                var bg = _model.object.data;
                var style = '';
                var cavsBoxClass = '';
                if (bg.length > 0) {
                    style = 'background-image: url(\'' + bg + '\');'
                }else{
                    cavsBoxClass = ' qp-hw-cavs-nobg';
                }

                html += '      <div class="qp-hw-drawing-content qp-hw-bar-visible"  ">                                                                                                                       ';
                html += '      <div style="position: relative" class="qp-hw-drawing-box '+cavsBoxClass+'" >                                                                                                                       ';
                html += '        <div  class="qp-hw-writing_edit" >                                                                                                                          ';
                html += '          <a href="javascript:void(0)" class="qp-hw-writing_botton qp-hw-classlink"  style="display: none" id="btn_back">                                                                  ';
                html += '              <ins class="qp-hw-icon_back"></ins>                                                                                                                ';
                html += '          </a>                                                                                                                                                ';
                html += '          <a href="javascript:void(0)" class="qp-hw-writing_botton qp-hw-classlink qp-on" id="write">                                                                     ';
                html += '              <ins class="qp-hw-icon_writing"></ins>                                                                                                             ';
                html += '          </a>                                                                                                                                                ';
                html += '              <a href="javascript:void(0)" class="qp-hw-writing_botton qp-hw-botton_clear" id="clear">                                                              ';
                html += '                  <ins class="qp-hw-icon_clear"></ins>                                                                                                           ';
                html += '              </a>                                                                                                                                            ';
                html += '              <a href="javascript:void(0)"  class="qp-hw-writing_botton qp-hw-botton_allclear qp-hw-classlink" id="clearall">                                          ';
                html += '                  <ins class="qp-hw-icon_allclear"></ins>                                                                                                        ';
                html += '              </a>                                                                                                                                            ';
                html += '        </div>                                                                                                   ';
                html += '          <canvas class="qp-hw-cavs " id="' + _canvasId + '" style="' + style + '">               ';
                html += '              Fallback content, in case the browser does not support Canvas.                                                                                  ';
                html += '          </canvas>                                                                                                                                           ';
                html += '      </div>                                                                                                                                                  ';
                html += '      </div>                                                                                                                                                  ';
                return html;
            }
            modelItem.render = function ($view, option) {
                var that = this;
                //画板
                var $canvas = $view.find(".qp-hw-drawing-content canvas");
                //工具栏
                var $writingBar = $view.find('.qp-hw-writing_edit');
                //移动端不显示编辑按钮
                if (_utils.Broswer.any()) {
                    $writingBar.hide();
                    $view.find('.qp-hw-bar-visible').removeClass('qp-hw-bar-visible');
                }

                //初始化画板大小
                $canvas.css({
                    width: _canvasWidth,
                    height: _canvasHeight
                });
                if ($canvas.length > 0 && $canvas[0]) {
                    $canvas[0].width = _canvasWidth;
                    $canvas[0].height = _canvasHeight;
                }
                $view.find('.qp-hw-drawing-box').css({
                    width: _canvasWidth
                });

                //渲染答案
                if (option.showAnswer || option.showCorrectAnswer|| option.showCheckedAnswer) {
                    var answers = option.showCorrectAnswer ? that.getCorrectAnswer() : that.getAnswer();
                    if (answers && answers.length > 0 && answers[0]) {
                        var answers = answers[0].split('|$*-*$|')[1];
                        var ctx = $canvas[0].getContext("2d");
                        var image = new Image();
                        image.onload = function () {
                            ctx.drawImage(image, 0, 0);
                        };
                        image.src = answers;
                    }
                }

            }
            modelItem.eventHandle = function ($view, option) {
                if (option.hideAnswerArea) {
                    return;
                }
                //qti-player内部已经略过该题型，eventHandle默认就会执行
                if (option.showLock) {
                    return;
                }
                var that = this;
                //画板
                var $canvas = $view.find(".qp-hw-drawing-content canvas");

                if($canvas.length==0){
                    return;
                }

                var lock = false,
                    lastX = -1,
                    lastY = -1,
                    isEraser = false,
                    cxt = $canvas[0].getContext('2d');
                cxt.lineJoin = "round";//指定两条线段的连接方式


                var getMousePos = function (evt) {
                    var rect = $canvas[0].getBoundingClientRect();
                    var point = {};
                    switch (evt.type) {
                        case 'touchstart':
                        case 'touchmove':
                        case 'touchend':
                        case 'touchcancel':
                            point = {
                                x: evt.originalEvent.targetTouches[0].clientX - rect.left,
                                y: evt.originalEvent.targetTouches[0].clientY - rect.top
                            };
                            break;
                        default :
                            point = {
                                x: evt.clientX - rect.left,
                                y: evt.clientY - rect.top
                            };
                            break;

                    }

                    return point;
                };

                //清除函数
                var clearLine = function (coordinate) {
                    //获取坐标
                    var x = coordinate.x;
                    var y = coordinate.y;
                    //清除
                    cxt.clearRect(x - 15, y - 15, 30, 30);
                };


                var drawPoint = function (coordinate) {
                    //console.log(coordinate);
                    var x = coordinate.x;
                    var y = coordinate.y;
                    cxt.beginPath();//准备绘制一条路径
                    if (lastX === -1) {
                        cxt.moveTo(x - 1, y);
                    } else {
                        cxt.moveTo(lastX, lastY);
                    }
                    cxt.lineTo(x, y);//将当前点与指定的点用一条笔直的路径连接起来
                    cxt.closePath();//关闭当前路径
                    cxt.stroke();//绘制当前路径
                    //将但前坐标作为下一线的起点
                    lastX = x;
                    lastY = y;
                };

                var clear = function () {
                    cxt.clearRect(0, 0, _canvasWidth, _canvasHeight);//清除画布，左上角为起点
                    that.setAnswer(getAnswer());
                };

                var getAnswer = function () {
                    var answer = [];

                    var arry = {
                        img: {
                            width: _canvasWidth,
                            height: _canvasHeight
                        }
                    };
                    answer.push(JSON.stringify(arry) + "|$*-*$|" + $canvas[0].toDataURL());
                    return answer;
                };

                var event = (function () {
                    //if (ModuleUtil.IsMobile.any() && ( 'ontouchend' in document)) {
                        return {
                            move: 'touchmove mousemove',
                            down: 'touchstart mousedown',
                            up: 'touchend touchcancel mouseup mouseleave'
                        };
                    //} else {
                    //    return {
                    //        move: 'mousemove',
                    //        down: 'mousedown',
                    //        up: 'mouseup'
                    //    };
                    //}
                })();


                $canvas.on(event.move, function (e) {
                    //t.lock为true则执行
                    if (lock) {
                        e.preventDefault();
                        e.stopPropagation();
                        var point = getMousePos(e);
                        if (isEraser) {
                            clearLine(point);
                        } else {
                            drawPoint(point);//绘制路线
                        }
                    }
                });
                $canvas.on(event.down, function (e) {
                    $("input").blur();
                    e.preventDefault();
                    e.stopPropagation();
                    var point = getMousePos(e);
                    if (isEraser) {
                        clearLine(point);
                    } else {
                        drawPoint(point);//绘制路线
                    }
                    lock = true;

                });
                $canvas.on(event.up, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    lock = false;
                    that.setAnswer(getAnswer());
                    lastX = -1;
                    lastY = -1;
                });
                $canvas.on('click',function(e){
                    $("input").blur();
                });
                $view.on(event.move, function (ev) {
                    if (lock) {
                        e.preventDefault();
                        e.stopPropagation();
                        var oEvent = ev.originalEvent || event;
                        if (oEvent.target.id != _canvasId) {
                            lock = false;
                            that.setAnswer(getAnswer());
                        }
                    }
                });
                var $clear= $view.find('#clear');
                var $write= $view.find('#write');
                var $clearall= $view.find('#clearall');
                $clear.on("click", function () {
                    isEraser = true;
                    $clear.addClass('qp-on');
                    $write.removeClass('qp-on');
                });
                $write.on("click", function () {
                    isEraser = false;
                    $write.addClass('qp-on');
                    $clear.removeClass('qp-on');
                });
                $clearall.on("click", function () {
                    clear();
                });
            }

        }
    };
    //注册
    var _QtiPlayer = window.QtiPlayer;
    _QtiPlayer.registerModelHandler(_modelHandler);
})
(window, jQuery);

// choiceInteraction
(function (window, $) {
    var _utils = window.QtiPlayer.getUtils();
    //创建
    var _modelHandler = {
        _name: 'extendedTextInteraction',
        //获取modal名称
        getName: function () {
            return this._name;
        },
        //创建渲染的方法
        create: function (modelItem) {
            var _model = modelItem.getModel();

            //返回题目类型名称
            modelItem.getName = function () {
                return _utils.getLangText('question', this.getOption());
            };

            modelItem.getClassName = function () {
                return 'nqti-base-essayQuestion';
            };
            modelItem.createTitleHtml = function () {
                return _model.prompt;
            };
            modelItem.createAnswerHtml = function (option) {
                var result = '';
                //if(option.showCorrectAnswer) {
                //参考答案
                var rubricBlock = _model.rubricBlock;
                if (rubricBlock && rubricBlock.prompt) {
                    result += '<div class="_nqti-answer nqti-hide-dom">' + rubricBlock.prompt + '</div>';
                }
                //} else {
                result += '<div class="nqti-base-essayQuestion-wrap _nqti-textarea">'
                    + '<textarea class="nqti-base-essay-area nqti-scrollbar-style-gray _essay-area"></textarea>'
                    + '</div>';
                //}
                return result;
            };
            modelItem.render = function ($view, option) {
                var that = this;

            };
            modelItem.eventHandle = function ($view, option) {
                var that = this;
                var _$textarea = $view.find('._essay-area');
                _$textarea.bind('input propertychange', function (e) {
                    var answer = [];
                    answer.push(_$textarea.val());
                    if (e.type === 'propertychange') {
                        if (e.originalEvent.propertyName === 'value') {
                            that.setAnswer(answer);
                        }
                    } else {
                        that.setAnswer(answer);
                    }
                });
            };

            modelItem.__unbind = function ($view) {
                //var _$textarea = $view.find('._essay-area');
                //_$textarea.unbind('input propertychange ');
            };

            modelItem.renderReset = function ($view) {
                //this.__unbind($view);
                $view.find('._nqti-answer').addClass('nqti-hide-dom');
                $view.find('._nqti-textarea').removeClass('nqti-hide-dom');
                var $textarea = $view.find('._essay-area');
                $textarea.text('');
                $textarea.val('');
            };


            modelItem.renderAnswer = function ($view) {
                this.__unbind($view);
                var $textarea = $view.find('._essay-area');
                var answer = this.getAnswer();
                var currentAnswer = '';
                if (answer.length > 0) {
                    currentAnswer = answer[0];
                }
                //使用text兼容ie8
                $textarea.text(currentAnswer);
            };

            modelItem.renderCheckedAnswer = function ($view) {
                this.__unbind($view);
                this.renderAnswer($view);
                var $textarea = $view.find('._essay-area');
                $textarea.attr('readonly', 'readonly');
            };

            modelItem.renderCorrectAnswer = function ($view) {
                this.__unbind($view);
                $view.find('._nqti-answer').removeClass('nqti-hide-dom');
                $view.find('._nqti-textarea').addClass('nqti-hide-dom');
            };

            modelItem.renderLock = function ($view) {
                var $textarea = $view.find('._essay-area');
                if (this.isLock()) {
                    $textarea.attr('readonly', 'readonly');
                } else {
                    $textarea.removeAttr('readonly');
                }
            };
        }
    };

    //注册
    var _QtiPlayer = window.QtiPlayer;
    _QtiPlayer.registerModelHandler(_modelHandler);
})(window, jQuery);


(function (window, $) {
    //创建

    var _utils = window.QtiPlayer.getUtils();
    var _logger = window.QtiPlayer.getLogger();


    var HTML = {
        TR: '<tr>${content}</tr>',
        TD: '<td id="${id}" width="${width}" height="${height}" class="_nqti-js-td">${content}</td>',
        SIDE_ITEM: '<li  class="on ${cls}"><span  class="nqti-base-puzzle-img-con ${orientation} _nqti-js-img"  id="${id}"><img   data-lazy-load="${lazyloader}"  data-media-img-render="false"  ${width} src="${src}"/></span></li>',
        QUS_BODY: '<div class="nqti-base-puzzle-wrap clearfix _nqti-js-wrap" style="${c-height}">' +
        '               <div class="nqti-base-puzzle-module" style="${c-width}">' +
        '                   <table class="nqti-base-puzzle-table" style="${width};${height}"><tbody>${tbody}</tbody></table>' +
        '               </div>' +
        '               <div class="nqti-base-side-puzzle _nqti-js-side"> ' +
        '                   <ul class="nqti-base-puzzle-list nqti-scrollbar-style-gray _nqti-js-side-ul">${list}</ul>' +
        '               </div> ' +
        '          </div>'
    };
    var _maxSvgWidth = 600;
    var _maxSvgHeight = 500;
    var _minSvgWidth = 100;
    var _minSvgHeight = 100;

    //跟样式比例耦合
    var _tdBorderWidth = 2;
    var _tableBorderWidth = 5;
    var _sideWidthPerHeight = 7.25 / 5.25;

    var gapUtil = {
        winSize: function () {
            var winWidth = 0;
            var winHeight = 0;
            if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                winWidth = document.documentElement.clientWidth;
                winHeight = document.documentElement.clientHeight;
            }
            return {
                'width': winWidth,
                'height': winHeight
            };
        },
        qtiMaxSize: function ($view) {
            var parent = $view.closest('._qti-player').parent();
            var width = parent.width();
            var maxW = 0, maxH = 0;
            //按可视区域大小缩放
            if (width > 0) {
                var scale = width / 1080;
                maxW = _maxSvgWidth * scale;
                maxH = _maxSvgHeight * scale;
                if (maxW < 300) {
                    maxW = 300;
                }
                if (maxH < 300) {
                    maxH = 300;
                }
            }
            return {
                maxW: maxW,
                maxH: maxH
            };
        },
        mathMaxSize: function () {
            var winSize = this.winSize();
            var scale = 1;
            var maxW = 0, maxH = 0;
            if (winSize.width / winSize.height > 1280 / 800) {
                scale = winSize.height / 800;
            } else {
                scale = winSize.width / 1280;
            }
            maxW = parseInt(_maxSvgWidth * scale);
            maxH = parseInt(_maxSvgHeight * scale);
            if (maxH < _minSvgHeight) {
                maxH = _minSvgHeight;
            }
            if (maxW < _minSvgWidth) {
                maxW = _minSvgWidth;
            }
            return {
                maxW: maxW,
                maxH: maxH
            };
        },
        getOffsetInt: function ($dom) {
            var offset = $dom.offset();
            if (!offset) {
                return;
            }
            return {left: parseInt(offset.left), top: parseInt(offset.top)};
        },
        getScale: function ($dom) {
            if ($dom && $dom.length > 0) {
                var offWidth = $dom[0].offsetWidth;
                return (offWidth > 0 ? ($dom[0].getBoundingClientRect().width / offWidth) : 1) || 1;
            }
            return 1;
        },
        getTableData: function (model) {
            var maxW = 0, maxH = 0;
            var rows = 0, cols = 0;
            var oneWidth = model.gapImg[0].width, oneHeight = model.gapImg[0].height;
            var matrix = {};
            for (var j = 0; j < model.associableHotspot.length; j++) {
                var spot = model.associableHotspot[j];
                var vcoords = spot.coords.split(",");
                if (parseInt(vcoords[3]) > maxH) {
                    maxH = parseInt(vcoords[3]);
                }
                if (parseInt(vcoords[2]) > maxW) {
                    maxW = parseInt(vcoords[2]);
                }
                var tbPos = spot.identifier.split('_');
                var row = parseInt(tbPos[1]);
                var col = parseInt(tbPos[2]);
                if (col > cols) {
                    cols = col;
                }
                if (!matrix[row]) {
                    matrix[row] = [];
                    rows++;
                }
                matrix[row][col - 1] = spot;
            }
            return {
                matrix: matrix,
                width: maxW,
                height: maxH,
                rows: rows,
                cols: cols,
                oneWidth: oneWidth,
                oneHeight: oneHeight
            };
        },
        getAreaSize: function (maxW, maxH, expectWidth, expectHeight, columns, rows, oneWidth, oneHeight, maxSvgWidth, maxSvgHeight) {
            //不超过最大限制
            var resize = _utils.Img.resize(maxW, maxH, maxSvgWidth, maxSvgHeight, _minSvgWidth, _minSvgHeight);
            var maxScale = resize.scale;
            maxW = resize.w;
            maxH = resize.h;

            //外部设置了期望宽高，进行重置
            if (expectWidth || expectHeight) {
                expectWidth = expectWidth - (columns * _tdBorderWidth + _tdBorderWidth);
                expectHeight = expectHeight - (rows * _tdBorderWidth + _tdBorderWidth);
                //超过原始宽高则不缩放，图片会变模糊
                if (expectWidth < maxW || expectHeight < maxH) {
                    var relativeWidth = true;
                    if (expectWidth < maxW && expectHeight < maxH) {
                        relativeWidth = expectWidth / maxW < expectHeight / maxH;
                    } else if (expectWidth < maxW) {
                        relativeWidth = true;
                    } else if (expectHeight < maxH) {
                        relativeWidth = false;
                    }
                    if (relativeWidth) {
                        resize.w = expectWidth;
                        resize.scale = (expectWidth / maxW).toFixed(3);
                        resize.h = parseInt(resize.scale * maxH);
                    } else {
                        resize.h = expectHeight;
                        resize.scale = (expectHeight / maxH).toFixed(3);
                        resize.w = parseInt(resize.scale * maxW);
                    }
                    //计算真实缩放值
                    resize.scale = resize.scale * maxScale;
                }
            }
            //整数处理
            var moRows = resize.h % rows;
            var moCols = resize.w % columns;
            if (expectWidth && expectHeight) {
                if (moCols > 0) {
                    resize.w = (resize.w - (columns - moCols));
                }
                if (moRows > 0) {
                    resize.h = (resize.h - (rows - moRows ));
                }
            } else {
                if (moCols > 0) {
                    resize.w = (resize.w + (columns - moCols));
                }
                if (moRows > 0) {
                    resize.h = (resize.h + (rows - moRows ));
                }
                //如果单项的高宽比大于总体高宽比，高度统一加1像素防止抖动
                if (oneHeight / oneWidth > (resize.h / rows) / (resize.w / columns)) {
                    resize.h += rows;
                }
            }

            //计算完整表格宽高
            resize.w += (columns) * _tdBorderWidth + _tdBorderWidth;
            resize.h += (rows) * _tdBorderWidth + _tdBorderWidth;
            return resize;
        },
        getRects: function (cOffset, $rects) {
            var rects = [];
            var scale = this.getScale($($rects[0]));
            $rects.each(function () {
                var $this = $(this);
                var width = $this.width();
                var height = $this.height();
                var id = $this.attr('id');
                var offset = gapUtil.getOffsetInt($this);
                offset.left = offset.left - cOffset.left;
                offset.top = offset.top - cOffset.top;

                rects.push({
                    l: offset.left,
                    t: offset.top,
                    r: offset.left + width * scale,
                    b: offset.top + height * scale,
                    w: width * scale,
                    h: height * scale,
                    id: id
                });
            });
            return rects;
        },
        initFill: function (rects, answers) {
            if (!rects) {
                return;
            }
            rects.forEach(function (rect) {
                //初始化答案
                var f = '';
                answers.forEach(function (answer) {
                    var answerArry = answer.split(" ");
                    if (answerArry[1] === rect.id) {
                        f = answerArry[0];
                    }
                });
                rect.f = f;
            });
        },
        //取消绑定
        removeFill: function (rects, tId) {
            if (!rects) {
                return;
            }
            rects.forEach(function (rect) {
                if (rect.f === tId) {
                    rect.f = "";
                }
            });
        },
        //取消绑定
        removeAllFill: function (rects) {
            if (!rects) {
                return;
            }
            rects.forEach(function (rect) {
                rect.f = "";
            });
        },
        //绑定
        addFill: function (rects, id, tId) {
            if (!rects) {
                return;
            }
            this.removeFill(rects, tId);
            rects.forEach(function (rect) {
                if (rect.id === id) {
                    rect.f = tId;
                }
            });
        },
        getEventPoint: function (e, absOffset) {
            var point = {}, x, y;
            var isTouch = e.originalEvent && (e.originalEvent.targetTouches || e.originalEvent.changedTouches);
            if (isTouch) {
                var event = (e.originalEvent.targetTouches && e.originalEvent.targetTouches.length > 0) ? e.originalEvent.targetTouches : e.originalEvent.changedTouches;
                x = event[0].pageX - absOffset.left;
                y = event[0].pageY - absOffset.top;
                point = {x: x, y: y, touch: true};
            } else {
                var event = e.originalEvent || e;
                x = event.pageX - absOffset.left;
                y = event.pageY - absOffset.top;
                point = {x: x, y: y, touch: false};
            }
            return point;
        },
        coordinate: function (e) {
            switch (e.type) {
                case 'touchstart':
                case 'touchmove':
                case 'touchend':
                case 'touchcancel':
                    var event = (e.originalEvent.targetTouches && e.originalEvent.targetTouches.length > 0) ? e.originalEvent.targetTouches : e.originalEvent.changedTouches;
                    return event[0];
                default:
                    return e;
            }
        },
        /**
         * 判断拖动元素和目标区域是否有交集并绑定
         */
        intersectRect: function (rects, l, t, h, w, tId) {
            if (!rects) {
                return;
            }
            var that = this;
            var result = false;
            var max = 0, matchCount = 0, matchIndex;
            var area = (w * h * 2) / 5;
            var matchRect;
            rects.forEach(function (rect, i) {
                if (result || ( rect.f && rect.f != tId)) {
                    return;
                }
                //计算面积
                var m = _utils.Area.getRectIntersectArea({l: l, t: t, r: l + w, b: t + h}, rect);
                var cm = _utils.Area.getRectIntersectArea(rect, {l: l, t: t, r: l + w, b: t + h});

                if (cm > m) {
                    m = cm;
                }
                if (m > 0) {
                    matchCount++;
                }
                if (m > max) {
                    max = m;
                    matchIndex = i;
                }
                if (m > area) {
                    result = true;
                    matchRect = rect;
                }
            });

            //匹配区域超过1个且匹配度不高，按最高匹配
            if (!result && matchCount > 1) {
                result = true;
                matchRect = rects[matchIndex];
            }
            return matchRect;
        },
        renderAnswer: function ($view, $gapImgs, answers) {
            //显示答案
            $gapImgs.each(function (i) {
                    var $this = $(this),
                        id = $this.attr("id"),
                        targetId = '',
                        target = false;
                    if (answers) {
                        answers.forEach(function (answer) {
                            var answerArry = answer.split(" ");
                            if (answerArry[0] === id) {
                                targetId = answerArry[1];
                                target = true;
                            }
                        });
                    }
                    if (target) {
                        var $parent = $this.parent();
                        $this.attr('data-parent-style', $parent.attr('style'));
                        $this.attr('data-parent-class', $parent.attr('class'));
                        $parent.remove();
                        $view.find('#' + targetId).append($this);
                    }
                }
            );
        }
    }


    var _modelHandler = {
        _name: 'graphicGapMatchInteraction',
        //获取modal名称
        getName: function () {
            return this._name;
        },
        //创建渲染的方法
        create: function (modelItem) {
            var _model = modelItem.getModel();

            //返回题目类型名称
            modelItem.getName = function () {
                return _utils.getLangText('puzzle', this.getOption());
            };

            modelItem.getClassName = function () {
                return 'nqti-base-puzzle';
            };

            modelItem.createTitleHtml = function () {
                //统计模式，不需要渲染题干，这样处理主要是为了防止题干内多媒体资源较多时，造成资源加载阻塞。
                if (this.getOption().platForm === _utils.getPlatForm().statis) {
                    return '';
                }
                return _model.prompt;
            };

            modelItem.createAnswerHtml = function (option) {
                var that = this;
                //计算最大宽高值
                var data = gapUtil.getTableData(_model);

                //不超过最大限制
                var resize = gapUtil.getAreaSize(data.width, data.height, option.expectWidth, option.expectHeight, data.cols, data.rows, data.oneWidth, data.oneHeight, _maxSvgWidth, _maxSvgHeight);

                var tBody = '';
                for (var row in data.matrix) {
                    var td = '';
                    data.matrix[row].forEach(function (spot) {
                        td += _utils.template(HTML.TD, {id: spot.identifier, content: '', width: (100 / data.matrix[row].length) + '%', height: (100 / data.rows) + '%'});
                    });
                    tBody += _utils.template(HTML.TR, {content: td});
                }

                _model.gapImg = _utils.Rd.shuffleArray(_model.gapImg, option.randomSeed);
                var imgHtml = '';

                for (var i = 0; i < _model.gapImg.length; i++) {
                    var gapImg = _model.gapImg[i];

                    var orientation = gapImg.width / gapImg.height <= _sideWidthPerHeight ? '_horizontal' : '';
                    var liOrientation = gapImg.width / gapImg.height > _sideWidthPerHeight ? '_autoh' : '';
                    imgHtml += _utils.template(HTML.SIDE_ITEM, {
                        src: gapImg.data,
                        width: '',
                        id: gapImg.identifier,
                        orientation: orientation,
                        cls: liOrientation,
                        lazyloader: (option.graphicGapMatchImageLoaderEnable ? true : false)
                    });
                }

                var tableBorderWidth = _utils.getPlatForm().statis === option.platForm ? 0 : _tableBorderWidth;

                var html = _utils.template(HTML.QUS_BODY, {
                    list: imgHtml, tbody: tBody, width: 'width:' + resize.w + 'px', height: 'height:' + resize.h + 'px',
                    'c-width': 'width:' + ( resize.w + tableBorderWidth * 2) + 'px', 'c-height': 'height:' + (resize.h + tableBorderWidth * 2) + 'px'
                });

                return html;
            }


            modelItem.render = function ($view, option) {
                var that = this;
                //选项
                var $side = $view.find('._nqti-js-side');

                var platStatis = _utils.getPlatForm().statis === option.platForm;

                if (platStatis) {
                    $view.closest('._qti-player').addClass('nqti-base-puzzle-stati');
                }

                var $table = $view.find('.nqti-base-puzzle-table');
                var $wrap = $view.find('._nqti-js-wrap');
                var $puzzleModule = $view.find('.nqti-base-puzzle-module');

                //默认隐藏
                $side.hide();

                var resizeTable = function () {
                    var option = that.getOption();
                    var max = gapUtil.qtiMaxSize($view);
                    if (!option.expectWidth && !option.expectHeight) {
                        var tableBorderWidth = _utils.getPlatForm().statis === option.platForm ? 0 : _tableBorderWidth;
                        if (max.maxW) {
                            var data = gapUtil.getTableData(_model);
                            var resize = gapUtil.getAreaSize(data.width, data.height, option.expectWidth, option.expectHeight, data.cols,
                                data.rows, data.oneWidth, data.oneHeight, max.maxW, max.maxH);


                            $table.css({width: resize.w + 'px', height: resize.h + 'px'});
                            $wrap.css('height', (resize.h + tableBorderWidth * 2) + 'px');
                            $puzzleModule.css('width', (resize.w + tableBorderWidth * 2) + 'px');
                        }
                    }
                    //有宽高时，显示内容
                    if (max.maxW && !option.showCorrectAnswer && !platStatis) {
                        $side.show();
                    }
                    //重新计算，如果高度不超过最大高度直接自适应高度
                    var height = $view.find('._nqti-js-side-ul li').height();
                    if (_model.gapImg[0].height < height) {
                        $view.find('._nqti-js-side-ul li').css('height', 'auto');
                    }
                };

                resizeTable();
                $view.find('.nqti-module-content').resize(function () {
                    resizeTable();
                });
            };

            modelItem.eventHandle = function ($view, option) {
                var that = this;
                //做题区域容器
                var $container = $view.find('._nqti-js-wrap');
                //svg块
                var $rects = $view.find("._nqti-js-td");
                //
                var $ul = $view.find('._nqti-js-side-ul');
                //gapimg的offset和css的left的相差值
                var cOffset = $container.offset();
                //填写区域的块坐标
                that.__rects = [];

                /**
                 * 初始化目标矩形坐标位置
                 */
                that.__rects = gapUtil.getRects(cOffset, $rects);


                var resizeCoor = function () {
                    cOffset = gapUtil.getOffsetInt($container);
                    var newRects = gapUtil.getRects(cOffset, $rects);

                    newRects.forEach(function (rect, i) {
                        rect.f = that.__rects[i].f;
                    });
                    that.__rects = newRects;
                };


                var getAnswer = function () {
                    var answer = [];
                    that.__rects.forEach(function (rect) {
                        if (rect.f) {
                            answer.push(rect.f + " " + rect.id);
                        }
                    });
                    _logger.debug(answer);
                    return answer;
                };

                var initDrawEvent = function () {
                    var lastPoint = null,
                        $target,
                        targetCssText,
                        absPoint,
                        scale = 1;

                    var lastActiveTarget;
                    var moveNum = 0, rect;
                    var width, height, id;
                    var supportTouch = ('ontouchend' in document);

                    var downEvent = function (e) {
                        var _$target = $(e.target).closest('._nqti-js-img');
                        //防止多点触控造成的bug
                        if (!_$target || !_$target[0] || _$target.hasClass('_move')) {
                            return;
                        }
                        scale = gapUtil.getScale($container);
                        moveNum = 0;
                        e.preventDefault();
                        width = _$target.find('img').width();
                        height = _$target.find('img').height();
                        id = _$target.attr('id');

                        //获取原始位置
                        var tOffset = _$target.find('img').offset();
                        $target = _$target.clone();
                        $container.append($target);
                        if (_$target.parent()[0].tagName === 'LI') {
                            $target.attr('data-parent-style', _$target.parent().attr('style'));
                            $target.attr('data-parent-class', _$target.parent().attr('class'));
                            _$target.parent().addClass('_old');
                        } else {
                            _$target.addClass('_old');
                        }
                        var currentAbsOffset = gapUtil.getOffsetInt($container);
                        //重新计算坐标
                        if (!cOffset || currentAbsOffset.left !== cOffset.left || currentAbsOffset.top !== cOffset.top) {
                            resizeCoor();
                        }
                        cOffset = currentAbsOffset;

                        lastPoint = gapUtil.getEventPoint(e, cOffset);

                        absPoint = {
                            x: lastPoint.x - tOffset.left + cOffset.left,
                            y: lastPoint.y - tOffset.top + cOffset.top
                        };

                        $target.addClass('_move');
                        $target.css({'width': width + 'px', 'height': height + 'px', 'left': (lastPoint.x - absPoint.x) / scale + 'px', 'top': (lastPoint.y - absPoint.y) / scale + 'px'});
                        targetCssText = $target[0].style.cssText.replace('left', '').replace('top', '');
                    };

                    var moveEvent = function (e) {
                        if (!lastPoint) {
                            return;
                        }
                        //pc端重新计算坐标，移动端考虑的效率问题不实时获取坐标
                        if (!supportTouch) {
                            var currentAbsOffset = gapUtil.getOffsetInt($container);
                            //重新计算坐标
                            if (!cOffset || currentAbsOffset.left !== cOffset.left || currentAbsOffset.top !== cOffset.top) {
                                resizeCoor();
                                cOffset = currentAbsOffset;//重新获取
                            }
                        }
                        lastPoint = gapUtil.getEventPoint(e, cOffset);
                        e.preventDefault();
                        e.stopPropagation();
                        if (moveNum % 3 === 0) {
                            rect = gapUtil.intersectRect(that.__rects, lastPoint.x - absPoint.x, lastPoint.y - absPoint.y, height * scale, width * scale, id);
                            if (rect) {
                                if (lastActiveTarget)
                                    lastActiveTarget.removeClass('td-move');
                                lastActiveTarget = $view.find('#' + rect.id);
                                lastActiveTarget.addClass('td-move');
                            } else {
                                if (lastActiveTarget)
                                    lastActiveTarget.removeClass('td-move');
                            }
                        }
                        moveNum++;
                        $target[0].style.cssText = targetCssText + ";" + "left:" + (lastPoint.x - absPoint.x) / scale + "px;" + "top:" + (lastPoint.y - absPoint.y) / scale + "px;";
                    };

                    var stopEvent = function (e) {
                        if (!lastPoint || !absPoint) {
                            return;
                        }
                        if (moveNum === 0) {
                            rect = gapUtil.intersectRect(that.__rects, lastPoint.x - absPoint.x, lastPoint.y - absPoint.y, height * scale, width * scale, id);
                        }
                        $view.find('._old').remove();
                        if (rect) {
                            //相交  定位到目标中心
                            gapUtil.addFill(that.__rects, rect.id, id);
                            $view.find('#' + rect.id).append($target);
                            $target.removeClass('_move').attr('style', '');
                        } else {
                            gapUtil.removeFill(that.__rects, id);
                            var $li = $('<li style="' + $target.attr('data-parent-style') + '" class="' + $target.attr('data-parent-class') + '"></li>');
                            $target.removeClass('_move').attr('style', '');
                            $li.append($target);
                            $ul.append($li);
                        }
                        //移除旧元素
                        $rects.removeClass('td-move');
                        if (lastPoint != null) {
                            that.setAnswer(getAnswer());
                        }
                        lastPoint = null;
                        absPoint = null;
                        rect = null;
                    };

                    var _event = (function (e) {
                        var _downTrigger = false;
                        var bodyRect = null;
                        var __event = function (e) {
                            if (that.isLock()) {
                                return;
                            }
                            if (e.type !== 'touchmove' && e.type !== 'mousemove') {
                                _logger.debug(e.type);
                            }
                            switch (e.type) {
                                case 'touchstart':
                                case 'mousedown':
                                    if (_downTrigger) {
                                        return;
                                    }
                                    _downTrigger = true;
                                    downEvent(e);
                                    bodyRect = {
                                        height: $(document.body).height(),
                                        width: $(document.body).width()
                                    };
                                    break;
                                case 'touchmove':
                                case 'mousemove':
                                    if (!_downTrigger) {
                                        return;
                                    }
                                    moveEvent(e);
                                    var point = gapUtil.coordinate(e);

                                    if (e.type === 'touchmove' &&
                                        (Math.abs(point.clientY - bodyRect.height) <= 15
                                        || Math.abs(point.clientX - bodyRect.width) <= 15
                                        || point.clientX <= 12
                                        || point.clientY <= 12)) {
                                        _downTrigger = false;
                                        stopEvent(e);
                                        return;
                                    }
                                    break;
                                case 'touchend':
                                case 'touchcancel':
                                case 'mouseup':
                                case 'mouseleave':
                                    _downTrigger = false;
                                    stopEvent(e);
                                    break;

                            }
                        };
                        return __event;
                    })();

                    if (_utils.Broswer.any()) {
                        $container.on('touchstart touchmove touchend touchcancel ', _event);
                    } else {
                        $container.on('touchstart touchmove touchend touchcancel mousedown mousemove mouseup mouseleave', _event);
                    }
                };

                initDrawEvent();
                $container.resize(function () {
                    cOffset = gapUtil.getOffsetInt($container);
                    resizeCoor();
                });
            };

            modelItem.renderReset = function ($view, option) {
                //svg块
                var $gapImgs = $view.find("._nqti-js-td ._nqti-js-img");
                var $ul = $view.find('._nqti-js-side-ul');
                var $side = $view.find('._nqti-js-side');
                var platStatis = _utils.getPlatForm().statis === this.getOption().platForm;
                if (platStatis) {
                    $side.hide();
                } else {
                    $side.show();
                }

                $gapImgs.each(function () {
                    var $this = $(this);
                    var $li = $('<li style="' + $this.attr('data-parent-style') + '" class="' + $this.attr('data-parent-class') + '"></li>');
                    $this.removeClass('_move').attr('style', '');
                    $li.append($this);
                    $ul.append($li);
                });
                gapUtil.removeAllFill(this.__rects);
            };

            modelItem.renderAnswer = function ($view) {
                var answers = this.getAnswer();
                gapUtil.initFill(this.__rects, answers);
                var $gapImgs = $view.find('._nqti-js-img');
                gapUtil.renderAnswer($view, $gapImgs, answers);
            };

            modelItem.renderCheckedAnswer = function ($view) {
                this.renderAnswer($view);
            };

            modelItem.renderCorrectAnswer = function ($view) {
                var answers = this.getCorrectAnswer();
                gapUtil.initFill(this.__rects, answers);
                var $side = $view.find('._nqti-js-side');
                var $gapImgs = $view.find('._nqti-js-img');
                $side.hide();
                gapUtil.renderAnswer($view, $gapImgs, answers);
            };

            modelItem.destroy = function () {

            }
        }
    };
    //注册
    var _QtiPlayer = window.QtiPlayer;
    _QtiPlayer.registerModelHandler(_modelHandler);

})(window, jQuery);


// inlineChoiceInteraction
(function (window, $) {
    //创建
    var _utils = window.QtiPlayer.getUtils();
    var _modelHandler = {
        _name: 'inlineChoiceInteraction',
        //获取model名称
        getName: function () {
            return this._name;
        },
        //创建渲染的方法
        create: function (modelItem) {
            var _model = modelItem.getModel();

            //返回题目类型名称
            modelItem.getName = function () {
                return '文本选择题';
            };
            //该model没有小题编号
            modelItem.hasNum = function () {
                return false;
            };
            //该model没有提示
            modelItem.hasHint = function () {
                return false;
            };
            modelItem.createTitleHtml = function () {
                return '';
            };
            modelItem.createAnswerHtml = function (option) {
                var result = '';
                var choose=_utils.getLangText('inline_choice_choose', option);
                var choice;
                var choiceArr = _model.inlineChoice;
                result += '<span class="qp-model-content"><select class="qp-inline-choice">'
                            + '<option>--' + choose + '--</option>';
                for (var i = 0; i < choiceArr.length; i++) {
                    choice = choiceArr[i];
                    result += '<option value="' + choice.identifier + '">' + choice.content + '</option>';
                }
                result += '</select></span>';
                return result;
            };
            modelItem.render = function ($view, option) {
                var that = this;
                var $select = $view.find('.qp-inline-choice');
                //初始化答案
                var answer = null;
                if (option.showAnswer || option.showCheckedAnswer) {
                    //显示当前用户答案
                    answer = that.getAnswer();
                } else if (option.showCorrectAnswer) {
                    //显示正确答案
                    answer = that.getCorrectAnswer();
                }
                if (answer && answer.length > 0) {
                    $select.val(answer[0]);
                }
                //锁定
                if (option.showLock) {
                    $select.attr('disabled', 'disabled');
                }
            };
            modelItem.eventHandle = function ($view, option) {
                var that = this;
                var $select = $view.find('.qp-inline-choice');
                $select.change(function () {
                    var answer = [];
                    answer.push($select.val());
                    that.setAnswer(answer);
                });
            };
        }
    };
    //注册
    var _QtiPlayer = window.QtiPlayer;
    _QtiPlayer.registerModelHandler(_modelHandler);
})(window, jQuery);


// matchInteraction
(function (window, $) {

    var _utils = window.QtiPlayer.getUtils();
    var _logger = window.QtiPlayer.getLogger();

    var EXTEND_WIDTH = 5;
    var LINE_WIDTH_PC = 8;
    var LINE_WIDTH_MOBIEL = 15;

    var _imgRegex = {
        _imageRegex: /<img([\s\S]*?)\/>/g,
        _srcRegex: /src="([\s\S]*?)"/,
        _widthRegex: /width="([\s\S]*?)"/,
        _heightRegex: /height="([\s\S]*?)"/
    }


    var HTML = {
        SORT_ITEM: ' <li identifier="${identifier}" class="nqti-base-connectLine-sort-list _nqti-js-sort-list">' +
        '               <span class="nqti-base-connectLine-sort-text"><span class="nqti-base-connectLine-sort-text-word">${index}</span></span>' +
        '           </li>',
        PIC_TEXT: '<li id="${id}" matchMax="${max}" class="nqti-base-connectLine-list nqti-base-connectLine-pic-text ${jscls}">' +
        '               <div class="nqti-base-connectLine-list-img">${img}</div>' +
        '               <span class="nqti-base-connectLine-list-btm"><i class="opacity_black_bg" style="display: none;"></i><span class="nqti-base-connectLine-list-btm-word">${text}</span></span>' +
        '           </li>',
        PIC: '<li id="${id}" matchMax="${max}"  class="nqti-base-connectLine-list nqti-base-connectLine-only-pic ${jscls}"><div class="nqti-base-connectLine-list-img">${img}</div></li>',
        TEXT: '<li id="${id}" matchMax="${max}"  class="nqti-base-connectLine-list nqti-base-connectLine-only-text ${jscls}">' +
        '<span class="nqti-base-connectLine-only-text-word">${text}</span>' +
        '</li>',
        ITEM_BODY: '<ul class="nqti-base-connectLine-list-ul">${content}</ul>',
        QUS_BODY: '<div class="nqti-base-connectLine-content ">' +
        '               <div class="nqti-base-connectLine-container clearfix">' +
        '                   <ul class="nqti-base-connectLine-sort-num-ul _nqti-js-sort">${sort}</ul>' +
        '                   ${item}' +
        '               </div>' +
        '               <svg class="nqti-base-connectLine-svg _nqti-js-svg" xmlns="http://www.w3.org/2000/svg" version="1.1"><defs></defs></svg> ' +
        '          </div>'
    };


    var matchUtil = {
        getScale: function ($dom) {
            if ($dom && $dom.length > 0) {
                var offWidth = $dom[0].offsetWidth;
                return (offWidth > 0 ? ($dom[0].getBoundingClientRect().width / offWidth) : 1) || 1;
            }
            return 1;
        },
        getFill: function ($item) {
            var fill = $item.attr('fill');
            if (fill !== undefined && fill != '') {
                return fill.split(',');
            }
            return [];
        },
        _removeFill: function ($item, fillId) {
            var fill = this.getFill($item);
            var index = fill.indexOf(fillId);
            if (index >= 0) {
                fill.splice(index, 1);
                $item.attr('fill', fill.join(','));
            }
        },
        removeFill: function ($view, id, fillId) {
            var item1 = $view.find('#' + id);
            var item2 = $view.find('#' + fillId);
            this._removeFill(item1, fillId);
            this._removeFill(item2, id);
            this.updateItemLineStyle(item1);
            this.updateItemLineStyle(item2);
        },
        removeAllFill: function ($view) {
            var $boxs = $view.find('._nqti-js-resbox,._nqti-js-targetbox');
            $boxs.attr('fill', '');
            $view.find('._nqti-js-svg line').remove();
            $boxs.removeClass('error');
            $boxs.removeClass('correct');
            $boxs.removeClass('on');
        },
        _addFill: function ($item, fillId) {
            var fill = this.getFill($item);
            var index = fill.indexOf(fillId);
            if (index < 0) {
                fill.push(fillId);
                $item.attr('fill', fill.join(','));
            }
        },
        addFill: function ($view, id, fillId) {
            var item1 = $view.find('#' + id);
            var item2 = $view.find('#' + fillId);
            console.log('match', id, fillId);
            this._addFill(item1, fillId);
            this._addFill(item2, id);
            this.updateItemLineStyle(item1);
            this.updateItemLineStyle(item2);
        },
        hasFill: function ($item, fillId) {
            var fill = this.getFill($item);
            var index = fill.indexOf(fillId);
            return index >= 0;
        },
        canFill: function ($item) {
            var fill = this.getFill($item);
            if (fill.length >= parseInt($item.attr('matchMax'))) {
                return false;
            }
            return true;
        },
        getRect: function ($box, res, scale) {
            var w = $box.width() * scale,
                h = $box.height() * scale,
                offset = $box.offset();
            var right = offset.left + w;
            if (res) {
                right = offset.left + w + EXTEND_WIDTH;
            }
            return {
                l: offset.left,
                t: offset.top,
                r: right,
                b: offset.top + h,
                w: w,
                h: h,
                id: $box.attr('id'),
                matchMax: parseInt($box.attr('matchMax'))
            };
        },
        getLinePos: function ($view, absOffset, id, fillId) {
            var scale = this.getScale($view);
            var resRect = this.getRect($view.find('#' + id), true, scale);
            var tRect = this.getRect($view.find('#' + fillId), false, scale);
            var pos = {};
            pos.y1 = (resRect.h) / 2 + resRect.t - absOffset.top;
            pos.x1 = resRect.r - absOffset.left - EXTEND_WIDTH;
            pos.x2 = tRect.l - absOffset.left;
            pos.y2 = tRect.t - absOffset.top + (tRect.h / 2);
            return pos;
        },
        getAnswer: function ($view) {
            var answer = [];
            var that = this;
            $view.find('._nqti-js-resbox').each(function () {
                var fill = that.getFill($(this));
                var id = $(this).attr('id');
                for (var i = 0; i < fill.length; i++) {
                    if (fill[i] != '') {
                        answer.push(id + ' ' + fill[i]);
                    }
                }
            });
            return answer;
        },
        isAnswerItemRight: function (correct, item) {
            var flag = false;
            for (var i = 0; i < correct.length; i++) {
                var answer = correct[i];
                if (answer === item) {
                    flag = true;
                    break;
                }
            }
            return flag;
        },
        getEventPoint: function (e, absOffset) {
            var point = {}, x, y;
            var isTouch = e.originalEvent && (e.originalEvent.targetTouches || e.originalEvent.changedTouches);
            if (isTouch) {
                var event = (e.originalEvent.targetTouches && e.originalEvent.targetTouches.length > 0) ? e.originalEvent.targetTouches : e.originalEvent.changedTouches;
                x = event[0].pageX - absOffset.left;
                y = event[0].pageY - absOffset.top;
                point = {x: x, y: y, touch: true};
            } else {
                var event = e.originalEvent || e;
                x = event.pageX - absOffset.left;
                y = event.pageY - absOffset.top;
                point = {x: x, y: y, touch: false};
            }
            return point;
        },
        coordinate: function (e) {
            switch (e.type) {
                case 'touchstart':
                case 'touchmove':
                case 'touchend':
                case 'touchcancel':
                    var event = (e.originalEvent.targetTouches && e.originalEvent.targetTouches.length > 0) ? e.originalEvent.targetTouches : e.originalEvent.changedTouches;
                    return event[0];
                default:
                    return e;
            }
        },
        updateItemLineStyle: function ($item) {
            var fill = this.getFill($item);
            if (fill.length <= 0) {
                $item.removeClass('on');
            } else {
                $item.addClass('on');
            }
        },
        isRes: function ($item) {
            return $item.hasClass('_nqti-js-resbox');
        },
        _intersectedRect: function (x, y, rects, absOffset) {
            x = x + absOffset.left;
            y = y + absOffset.top;

            var intersected = false;
            var inRect;
            for (var i = 0; i < rects.length; i++) {
                var rect = rects[i];
                if (x > rect.l && x < rect.r && y > rect.t && y < rect.b) {
                    intersected = true;
                    inRect = rect;
                    break;
                }
            }
            return inRect;
        },
        intersectedRect: function ($view, pos, absOffset, resBoxRects) {
            var rect = this._intersectedRect(pos.x, pos.y, resBoxRects, absOffset);
            if (rect == null) {
                return null;
            }
            return this.getFill($view.find('#' + rect.id)).length >= rect.matchMax ? null : rect;
        },
        renderAnswer: function ($view, answers, option, correctAnswers) {
            //数字图标
            var $qpNumber = $view.find('._nqti-js-sort');
            //每个选项的容器
            var $boxs = $view.find('._nqti-js-resbox,._nqti-js-targetbox');

            var $svg = $view.find('._nqti-js-svg');
            var svgdoc = _utils.Svg.getSVGDocument($svg[0]);
            var svgRoot = _utils.Svg.getSVGRoot($svg[0]);
            var scale = matchUtil.getScale($view);
            //初始化答案属性
            answers.forEach(function (answer) {
                var answerArry = answer.split(" ");
                if (answerArry.length === 2) {
                    matchUtil.addFill($view, answerArry[0], answerArry[1]);
                }
            });

            // if (option.showCheckedAnswer) {
            // //确认接入平台
            // var pptshell = _utils.getPlatForm().pptshell === option.platForm;
            // //隐藏左侧数字
            // if (!pptshell) {
            //     $qpNumber.hide();
            // }
            // //隐藏没有选中的项
            // $boxs.each(function () {
            //     var $box = $(this);
            //     var fill = $box.attr('fill');
            //     //是否有选中
            //     if (fill === undefined || fill.length <= 0) {
            //         if (!pptshell) {
            //             $box.hide();
            //         }
            //     }
            // })
            // }

            var hide = false;
            for (var i = 0; i < answers.length; i++) {
                var answer = answers[i];
                var answerArry = answer.split(' ');
                if (answerArry.length !== 2) {
                    continue;
                }
                var id = answerArry[0], tid = answerArry[1];
                var pos = matchUtil.getLinePos($view, $svg.offset(), id, tid);
                if (pos) {
                    var line;
                    if (option.showCheckedAnswer) {
                        var fill = $view.find('#' + id).attr('fill');
                        var iscorrect = matchUtil.isAnswerItemRight(correctAnswers, id + ' ' + fill);
                        line = _utils.Svg.addLine(svgdoc, svgRoot, '', pos.x1 / scale, pos.y1 / scale, pos.x2 / scale, pos.y2 / scale, iscorrect ? 'nqti-base-connectLine-normal nqti-base-connectLine-correct' : 'nqti-base-connectLine-normal nqti-base-connectLine-error', '');
                        var $qpItemContainer = $view.find('#' + id + ' ,#' + tid);
                        if (iscorrect) {
                            $qpItemContainer.addClass('correct');
                        } else {
                            $qpItemContainer.addClass('error');
                        }
                    }
                    else {
                        if (option.showCorrectAnswer) {
                            $view.find('#' + id + ',#' + tid).addClass('correct');
                            line = _utils.Svg.addLine(svgdoc, svgRoot, '', pos.x1 / scale, pos.y1 / scale, pos.x2 / scale, pos.y2 / scale, 'nqti-base-connectLine-normal nqti-base-connectLine-correct', '');
                        } else {
                            $view.find('#' + id + ',#' + tid).addClass('on');
                            line = _utils.Svg.addLine(svgdoc, svgRoot, '', pos.x1 / scale, pos.y1 / scale, pos.x2 / scale, pos.y2 / scale, 'nqti-base-connectLine-normal', '');
                        }
                    }
                    $(line).attr('rid', id);
                    $(line).attr('tid', tid);
                    if (pos.x1 <= 5 || pos.x2 <= 5) {
                        hide = true;
                    }
                }
            }
            if (hide === true) {
                $view.find('line').hide();
            } else {
                $view.find('line').show();
            }


        }
    };

//创建
    var _modelHandler = {
        _name: 'matchInteraction',
        //获取model名称
        getName: function () {
            return this._name;
        },
        //创建渲染的方法
        create: function (modelItem) {

            var _model = modelItem.getModel();

            //返回题目类型名称
            modelItem.getName = function () {
                return _utils.getLangText('connection', this.getOption());
            };
            modelItem.getClassName = function () {
                return 'nqti-connectLine';
            };
            modelItem.init = function () {
            }
            modelItem.createTitleHtml = function () {
                return _model.prompt;
            }
            modelItem.createAnswerHtml = function (option) {
                //如果图片有宽高属性，直接加载，防止resize事件触发
                var resizeImg = function (html) {
                    var resultHtml = html.replace(_imgRegex._imageRegex, function (imageInfo, $1) {
                        var result = imageInfo;
                        //使用框架图片加载服务
                        result = result.replace(/\<img/, '<img data-media-img-render="false"').replace(/width=/, '').replace(/height=/, '');
                        return result;
                    });
                    return resultHtml
                };

                var getImage = function (str) {
                    var images = str.match(_imgRegex._imageRegex);
                    if (images.length > 0) {
                        return images[0];
                    }
                    return '';
                };
                var getText = function (str) {
                    return str.replace(_imgRegex._imageRegex, function (imageInfo) {
                        return '';
                    });
                };

                var createItem = function (simpleMatchSet, res) {
                    var html = '';
                    var len = simpleMatchSet.length;
                    var randomArry = _utils.Rd.getAnswerRandom((len - 1), 0, option.randomSeed);

                    var jscls = res ? '_nqti-js-resbox' : '_nqti-js-targetbox';
                    for (var i = 0; i < simpleMatchSet.length; i++) {
                        var simpleAC = simpleMatchSet[i];

                        if (_model.shuffle && !res) {
                            simpleAC = simpleMatchSet[randomArry[i]];
                        }

                        var content = resizeImg(simpleAC.content.trim());
                        if (/^<img([^<>]*?)\/>$/.test(content)) {
                            html += _utils.template(HTML.PIC, {id: simpleAC.identifier, max: simpleAC.matchMax, img: content, jscls: jscls})
                        } else if (/<img([^<>]*?)\/>/.test(content)) {
                            html += _utils.template(HTML.PIC_TEXT, {
                                id: simpleAC.identifier,
                                max: simpleAC.matchMax,
                                img: getImage(content),
                                text: getText(content),
                                jscls: jscls
                            })
                        } else {
                            html += _utils.template(HTML.TEXT, {id: simpleAC.identifier, max: simpleAC.matchMax, text: content, jscls: jscls})
                        }
                    }
                    html = _utils.template(HTML.ITEM_BODY, {content: html});
                    return html;
                };
                var item = createItem(_model.simpleMatchSet[0], true);
                item += createItem(_model.simpleMatchSet[1], false);
                var sort = '';
                _model.simpleMatchSet[0].forEach(function (item, i) {
                    sort += _utils.template(HTML.SORT_ITEM, {index: i + 1, identifier: item.identifier});
                });

                var html = _utils.template(HTML.QUS_BODY, {item: item, sort: sort});
                return html;
            }
            modelItem.render = function ($view, option) {
                var that = this;
                var qpNums = $view.find('._nqti-js-sort-list');
                //点击序号回调，统计部分用到
                $view.find('._nqti-js-svg').on('click', function (e) {
                    var point = {
                        x: e.pageX,
                        y: e.pageY
                    };
                    var answers = that.getCorrectAnswer();
                    qpNums.each(function () {
                        var $qpNum = $(this);
                        var offset = $qpNum.offset();
                        var numWidth = $qpNum.width();
                        var numHeight = $qpNum.height();
                        var index = parseInt($qpNum.text()) - 1;
                        var identifier = $qpNum.attr('identifier');
                        if (point.x >= (offset.left - 20) && point.x <= (offset.left + numWidth + 20) && point.y >= (offset.top - 20) && point.y <= (offset.top + numHeight + 20)) {
                            var val;
                            for (var i = 0; i < answers.length; i++) {
                                var answer = answers[i];
                                var answerArry = answer.split(' ');
                                if (answerArry.length !== 2) {
                                    continue;
                                }
                                var id = answerArry[0];
                                if (id == identifier) {
                                    val = answer;
                                    break;
                                }
                            }
                            that.triggerOptionClick(index, val);
                        }
                    });
                });
            };

            modelItem.eventHandle = function ($view, option) {
                var that = this;
                var $resBoxs = $view.find('._nqti-js-resbox');
                var $targetBoxs = $view.find('._nqti-js-targetbox');
                var $svg = $view.find('._nqti-js-svg');
                var svg = $svg[0];
                var svgdoc = _utils.Svg.getSVGDocument(svg);
                var svgRoot = _utils.Svg.getSVGRoot(svg);
                var resBoxRects = [];
                var targetBoxsRects = [];
                var scale = matchUtil.getScale($view);

                /**
                 * 初始化坐标数据
                 */
                var initDataCoor = function () {
                    if (!($targetBoxs && $resBoxs)) {
                        return;
                    }
                    resBoxRects = [];
                    targetBoxsRects = [];
                    $resBoxs.each(function () {
                        var rect = matchUtil.getRect($(this), true, scale);
                        resBoxRects.push(rect);
                    });
                    $targetBoxs.each(function () {
                        targetBoxsRects.push(matchUtil.getRect($(this), false, scale));
                    });
                };

                /**
                 * 初始化画图事件
                 */
                var initDrawEvent = function () {
                    var $line = null,
                        isTargetRect = null;

                    //获取触发的矩形区域和起点
                    var getLinePoint = function (lastPoint, absOffset) {
                        var downRect = {};
                        isTargetRect = false;
                        var rect = matchUtil.intersectedRect($view, lastPoint, absOffset, resBoxRects);
                        if (!rect) {
                            isTargetRect = true;
                            rect = matchUtil.intersectedRect($view, lastPoint, absOffset, targetBoxsRects);
                        }
                        downRect.rect = rect;
                        if (!rect) {
                            lastPoint = null;
                            return downRect;
                        }

                        downRect.y1 = (rect.b - rect.t) / 2 + rect.t - absOffset.top;
                        if (isTargetRect) {
                            downRect.x1 = rect.r - absOffset.left - rect.w;
                        } else {
                            downRect.x1 = rect.r - absOffset.left - EXTEND_WIDTH;
                        }
                        return downRect;
                    };

                    var downEvent = function (e, lastPoint, absOffset) {
                        //重新计算坐标
                        var downRect = getLinePoint(lastPoint, absOffset);
                        if (!downRect.rect) {
                            return;
                        }
                        var line = _utils.Svg.addLine(svgdoc, svgRoot, '', downRect.x1 / scale, downRect.y1 / scale, lastPoint.x / scale, lastPoint.y / scale, 'nqti-base-connectLine-normal', '');
                        $line = $(line);
                        $line.attr('rid', downRect.rect.id);
                    };

                    var moveEvent = function (e, lastPoint) {
                        if ($line != null) {
                            e.preventDefault();
                            $line.attr('x2', lastPoint.x / scale);
                            $line.attr('y2', lastPoint.y / scale);
                        }
                    };

                    //动态高亮连线，返回当前点所在的直线
                    var hoverLine = function (point, lineWidth) {
                        var $lines = $view.find('.nqti-base-connectLine-normal');
                        $lines.attr('class', 'nqti-base-connectLine-normal');
                        var $line = null;
                        var width = 100;
                        $lines.each(function () {
                            var x1 = this.x1.baseVal.value, y1 = this.y1.baseVal.value, x2 = this.x2.baseVal.value, y2 = this.y2.baseVal.value;
                            var pwidth = _utils.Area.pointToLine(x1, y1, x2, y2, point.x / scale, point.y / scale);
                            if (pwidth <= width) {
                                width = pwidth;
                                $line = $(this);
                            }
                        });
                        if ($line) {
                            if (width <= lineWidth) {
                                $line.attr('class', 'nqti-base-connectLine-normal nqti-base-connectLine-hover')
                            } else {
                                $line = null;
                            }
                        }
                        return $line;
                    };

                    var stopEvent = function (e, lastPoint, absOffset) {
                        if ($line != null) {
                            var id = $line.attr('rid');

                            var tRect = matchUtil.intersectedRect($view, lastPoint, absOffset, isTargetRect ? resBoxRects : targetBoxsRects);
                            if (!tRect || matchUtil.hasFill($view, id, tRect.id)) {
                                $line.remove();
                            } else {
                                if (isTargetRect) {
                                    $line.attr('x2', (tRect.r - absOffset.left - EXTEND_WIDTH) / scale);
                                } else {
                                    $line.attr('x2', (tRect.l - absOffset.left) / scale);
                                }
                                $line.attr('y2', (tRect.t - absOffset.top + ((tRect.b - tRect.t) / 2)) / scale);
                                //绑定答案
                                matchUtil.addFill($view, id, tRect.id);
                                $line.attr('tid', tRect.id);
                            }
                            that.setAnswer(matchUtil.getAnswer($view));
                        }
                        $line = null;
                    };

                    var $lastTarget;

                    var click = function (e) {
                        var pos = matchUtil.getEventPoint(e, $svg.offset());
                        var $line = hoverLine(pos, pos.touch ? LINE_WIDTH_MOBIEL : LINE_WIDTH_PC);
                        if ($line) {
                            $line.remove();
                            matchUtil.removeFill($view, $line.attr('rid'), $line.attr('tid'));
                            that.setAnswer(matchUtil.getAnswer($view));
                        } else {
                            var rect = matchUtil.intersectedRect($view, pos, $svg.offset(), resBoxRects);
                            if (!rect) {
                                rect = matchUtil.intersectedRect($view, pos, $svg.offset(), targetBoxsRects);
                            }
                            if (rect) {
                                var $box = $view.find('#' + rect.id);

                                var res = $box.hasClass('_nqti-js-resbox');
                                if (!matchUtil.canFill($box)) {
                                    return;
                                }
                                if ($lastTarget && matchUtil.canFill($lastTarget)) {

                                    var lastIsRes = matchUtil.isRes($lastTarget);
                                    var boxId = $box.attr('id');
                                    var lastBoxId = $lastTarget.attr('id');

                                    if ($lastTarget[0] == $box[0]) {
                                        //和上一个相同，直接移除
                                        $lastTarget = null;
                                        $box.removeClass('on');
                                    } else if (res === lastIsRes) {
                                        //在同一侧，移除上一个的样式
                                        $lastTarget.removeClass('on');
                                        $lastTarget = $box;
                                        $lastTarget.addClass('on');
                                    } else if (!matchUtil.hasFill($lastTarget, boxId)) {

                                        var pos = {};
                                        if (lastIsRes) {
                                            pos = matchUtil.getLinePos($view, $svg.offset(), lastBoxId, boxId);
                                        } else {
                                            pos = matchUtil.getLinePos($view, $svg.offset(), boxId, lastBoxId);
                                        }
                                        var line = _utils.Svg.addLine(svgdoc, svgRoot, '', pos.x1 / scale, pos.y1 / scale, pos.x2 / scale, pos.y2 / scale, 'nqti-base-connectLine-normal', '');
                                        $(line).attr('tid', boxId);
                                        $(line).attr('rid', lastBoxId);
                                        matchUtil.addFill($view, boxId, lastBoxId);
                                        that.setAnswer(matchUtil.getAnswer($view));
                                        $lastTarget.addClass('on');
                                        $box.addClass('on');
                                        $lastTarget = null;
                                    }
                                } else {
                                    $box.addClass('on');
                                    $lastTarget = $box;
                                }
                            }
                        }
                    };


                    var _event = (function (e) {
                        var _downTrigger = false;
                        var _lastPoint = null;
                        var _startPos = null;
                        var _endPos = null;
                        var _startTime;
                        var _absOffset = null;
                        var bodyRect = null;
                        var __event = function (e) {
                            if (that.isLock()) {
                                return;
                            }
                            if (e.type !== 'touchmove' && e.type !== 'mousemove') {
                                _logger.debug(e.type);
                                //_logger.debug(e.type);
                            }
                            switch (e.type) {
                                case 'touchstart':
                                case 'mousedown':
                                    //防止多点触控异常
                                    if (_downTrigger) {
                                        return;
                                    }
                                    _downTrigger = true;
                                    var currentAbsOffset = $svg.offset();
                                    //重新计算坐标
                                    if (!_absOffset || currentAbsOffset.left !== _absOffset.left || currentAbsOffset.top !== _absOffset.top) {
                                        initDataCoor();
                                    }
                                    _absOffset = currentAbsOffset;//获取offset的差额
                                    _lastPoint = matchUtil.getEventPoint(e, _absOffset);
                                    _startPos = _lastPoint;
                                    _startTime = new Date().getTime();
                                    _lastPoint.x = _lastPoint.x;
                                    _lastPoint.y = _lastPoint.y;
                                    downEvent(e, _lastPoint, _absOffset);
                                    bodyRect = {
                                        height: $(document.body).height(),
                                        width: $(document.body).width()
                                    };
                                    break;
                                case 'touchmove':
                                case 'mousemove':
                                    if (!_downTrigger) {
                                        if (e.type === 'mousemove') {
                                            hoverLine(matchUtil.getEventPoint(e, $svg.offset()), LINE_WIDTH_PC);
                                        }
                                        return;
                                    }
                                    _lastPoint = matchUtil.getEventPoint(e, _absOffset);
                                    _lastPoint.x = _lastPoint.x;
                                    _lastPoint.y = _lastPoint.y;
                                    _endPos = _lastPoint;

                                    var point = matchUtil.coordinate(e);

                                    if (e.type === 'touchmove' &&
                                        (Math.abs(point.clientY - bodyRect.height) <= 15
                                        || Math.abs(point.clientX - bodyRect.width) <= 15
                                        || point.clientX <= 12
                                        || point.clientY <= 12)) {
                                        stopEvent(e, _lastPoint, _absOffset);
                                        _downTrigger = false;
                                        _lastPoint = null;
                                        return;
                                    }
                                    moveEvent(e, _lastPoint);
                                    break;
                                case 'touchend':
                                case 'touchcancel':
                                case 'mouseup':
                                case 'mouseleave':
                                    _lastPoint = matchUtil.getEventPoint(e, $svg.offset());
                                    _endPos = _lastPoint;
                                    stopEvent(e, _lastPoint, _absOffset);
                                    _downTrigger = false;
                                    _lastPoint = null;

                                    if (_endPos && e.type === 'mouseup') {
                                        var _holdTime = new Date().getTime() - _startTime;
                                        var dx = Math.abs(_endPos.x - _startPos.x);
                                        var dy = Math.abs(_endPos.y - _startPos.y);
                                        if (_holdTime > 800 || dx >= 5 || dy >= 5) {
                                            return;
                                        }
                                        click(e);
                                    }
                                    break;
                                case 'qpTap':
                                    //case 'click':
                                    if (_endPos && e.type === 'click') {
                                        var _holdTime = new Date().getTime() - _startTime;
                                        var dx = Math.abs(_endPos.x - _startPos.x);
                                        var dy = Math.abs(_endPos.y - _startPos.y);
                                        if (_holdTime > 800 || dx >= 5 || dy >= 5) {
                                            return;
                                        }
                                    }
                                    click(e);
                                    break;
                            }
                        };
                        return __event;
                    })();

                    if (_utils.Broswer.any()) {
                        $svg.on('qpTap touchstart touchmove touchend touchcancel ', _event);
                    } else {
                        $svg.on('click touchstart touchmove touchend touchcancel mousedown mousemove mouseup mouseleave ', _event);
                    }

                };

                initDataCoor();
                initDrawEvent();

            };


            modelItem.renderReset = function ($view, removeResize) {
                var $qpNumber = $view.find('._nqti-js-sort');
                var $boxs = $view.find('._nqti-js-resbox,._nqti-js-targetbox');
                if (removeResize !== false) {
                    $view.find('._nqti-js-resbox,._nqti-js-targetbox,.nqti-base-connectLine-content').off('resize');
                }
                //显示放在后面，防止触发resize事件
                $qpNumber.show();
                $boxs.show();
                matchUtil.removeAllFill($view);
            };

            modelItem.renderAnswer = function ($view) {
                var that = this;
                var answers = this.getAnswer();
                var correctAnswers = this.getCorrectAnswer();
                var option = that.getOption();
                $view.find('._nqti-js-resbox,._nqti-js-targetbox,.nqti-base-connectLine-content').off('resize');
                var showAnswer = function () {
                    that.renderReset($view, false);
                    matchUtil.renderAnswer($view, answers, option, correctAnswers);
                };

                //列高度变化，或者整体高度变化触发显示答案
                $view.find('._nqti-js-resbox,._nqti-js-targetbox,.nqti-base-connectLine-content').resize(function () {
                    showAnswer();
                });
                showAnswer();
            };

            modelItem.renderCheckedAnswer = function ($view) {
                this.renderAnswer($view);
            };

            modelItem.renderCorrectAnswer = function ($view) {
                var that = this;
                var answers = this.getCorrectAnswer();
                var option = that.getOption();
                $view.find('._nqti-js-resbox,._nqti-js-targetbox,.nqti-base-connectLine-content').off('resize');
                var showAnswer = function () {
                    that.renderReset($view, false);
                    matchUtil.renderAnswer($view, answers, option, answers);
                };

                //列高度变化，或者整体高度变化触发显示答案
                $view.find('._nqti-js-resbox,._nqti-js-targetbox,.nqti-base-connectLine-content').resize(function () {
                    showAnswer();
                });
                showAnswer();
            };

            modelItem.destroy = function () {

            }
        }
    };

    //注册
    var _QtiPlayer = window.QtiPlayer;
    _QtiPlayer.registerModelHandler(_modelHandler);

})
(window, jQuery);


// choiceInteraction
(function (window, $) {
    var _utils = window.QtiPlayer.getUtils();


    var HTML = {
        PIC_TEXT: '<li data-id="${identifier}" class="nqti-base-sequence-list nqti-base-sequence-pic-text">' +
        '               ${img}' +
        '               <span class="nqti-base-sequence-list-btm-text">' +
        '                   <i class="opacity_black_bg" style="display: none;"></i>' +
        '                   <span class="nqti-base-sequence-list-btm-word">${text}</span>' +
        '               </span>' +
        '           </li>',
        PIC: '<li data-id="${identifier}" class="nqti-base-sequence-list nqti-base-sequence-only-pic">${img}</li>',
        TEXT: '<li data-id="${identifier}" class="nqti-base-sequence-list nqti-base-sequence-only-text">' +
        '<span class="nqti-base-sequence-only-text-word">${text}</span>' +
        '</li>',
        ITEM_BODY: '<ul class="nqti-base-sequence-list-ul clearfix _nqti-js-sequence-ul ">${content}</ul>'
    };


    var _modelHandler = {
        _name: 'orderInteraction',
        //获取modal名称
        getName: function () {
            return this._name;
        },

        //创建渲染的方法
        create: function (modelItem) {
            var _model = modelItem.getModel();
            //选项数据处理,将排序项的中的图片分离出来
            var simpleChoice = _model.simpleChoice;
            var choice;
            var imageRegex = /<img[\s\S]*?\/>/g;
            for (var index = 0; index < simpleChoice.length; index++) {
                choice = simpleChoice[index];
                //图片内容处理
                var image = '';
                choice.content = choice.content.replace(imageRegex, function (imageHtml) {
                    //设置图片期望高宽属性
                    var attr = imageHtml.substring(4, imageHtml.length - 2);

                    image = '<img data-class="qp-order-image" data-media-img-render=\'{"renderUI":false,"minWidth":205,"minHeight":165}\'  ' + attr + ' />'.replace(/width=/, '').replace(/height=/, '');
                    var media = _utils.NDMedia;
                    if (typeof media != typeof undefined && media.ImageViewer) {
                        image = '<img data-class="qp-order-image" data-media-img-render=\'false\'  ' + attr + ' />'.replace(/width=/, '').replace(/height=/, '');
                    }
                    return '';
                });
                choice.image = image;
            }

            var getAnswer = function ($paixuList) {
                var answer = [];
                $paixuList.children('li').each(function () {
                    answer.push($(this).data('id'));
                });
                return answer;
            };

            var getRandomSimpleChoice = function (_model, correctAnswer, randomSeed) {
                var simpleChoice = [];
                simpleChoice.pushArray(_model.simpleChoice);
                //答题模式
                if (_model.shuffle) {
                    //乱序
                    simpleChoice = _utils.Rd.shuffleArray(simpleChoice, randomSeed);
                    //排除正确答案
                    var same = true;
                    for (var i = 0; i < simpleChoice.length; i++) {
                        if (simpleChoice[i].identifier != correctAnswer[i]) {
                            same = false;
                            break;
                        }
                    }
                    if (same) {
                        //如果乱序后还是正确答案，则取出第一个选项，插入到组后
                        var firstChoice = simpleChoice.shift();
                        simpleChoice.push(firstChoice);
                    }
                }
                return simpleChoice;
            };

            //返回题目类型名称
            modelItem.getName = function () {
                return _utils.getLangText('sort', this.getOption());
            };
            modelItem.getClassName = function () {
                return 'nqti-sequence';
            };
            //创建model html片段
            modelItem.createTitleHtml = function () {
                return _model.prompt;
            };
            modelItem.createAnswerHtml = function (option) {
                var that = this;
                var result;

                var simpleChoice = getRandomSimpleChoice(_model, that.getCorrectAnswer(), option.randomSeed);
                //渲染选项
                var choice;
                var itemHtml = '';
                for (var index = 0; index < simpleChoice.length; index++) {
                    choice = simpleChoice[index];
                    if (choice.image === '') {
                        itemHtml += _utils.template(HTML.TEXT, {text: choice.content, identifier: choice.identifier});
                    } else if (choice.content && choice.content.trim() !== '') {
                        itemHtml += _utils.template(HTML.PIC_TEXT, {img: choice.image, text: choice.content, identifier: choice.identifier});
                    } else {
                        itemHtml += _utils.template(HTML.PIC, {img: choice.image, identifier: choice.identifier});
                    }
                }
                result = _utils.template(HTML.ITEM_BODY, {content: itemHtml});
                return result;
            };
            modelItem.render = function ($view, option) {

            };

            modelItem.renderReset = function ($view) {
                var simpleChoice = getRandomSimpleChoice(_model, this.getCorrectAnswer(), this.getOption().randomSeed);
                var $paixuList = $view.find('._nqti-js-sequence-ul');
                simpleChoice.forEach(function (choice) {
                    $paixuList.find('[data-id="' + choice.identifier + '"]').appendTo($paixuList);
                });
                return getAnswer($paixuList);
            };

            modelItem.renderAnswer = function ($view) {
                var $paixuList = $view.find('._nqti-js-sequence-ul');
                var answers = this.getAnswer();
                answers.forEach(function (answer) {
                    $paixuList.find('[data-id="' + answer + '"]').appendTo($paixuList);
                });
                this.setAnswer(getAnswer($paixuList));
            };

            modelItem.renderCheckedAnswer = function ($view) {
                this.renderAnswer($view);
            };

            modelItem.renderCorrectAnswer = function ($view) {
                var $paixuList = $view.find('._nqti-js-sequence-ul');
                var correctAnswer = this.getCorrectAnswer();
                correctAnswer.forEach(function (answer) {
                    $paixuList.find('[data-id="' + answer + '"]').appendTo($paixuList);
                });
            };

            modelItem.renderLock = function ($view) {
                //重置内部option值
                var $paixuList = $view.find('._nqti-js-sequence-ul');
                if (this.isLock()) {
                    $paixuList.dragsort("disabled");
                } else {
                    $paixuList.dragsort("enable");
                }
            };

            modelItem.eventHandle = function ($view, option) {
                var that = this;
                var $paixuList = $view.find('._nqti-js-sequence-ul');
                //
                //初始化答案
                if (option.showAnswerArea || option.showStatisAnswer) {
                    that.setAnswer(getAnswer($paixuList));
                }
                //拖动事件
                $paixuList.dragsort({
                    draggable: {
                        zIndex: 999,
                        selector: 'li'
                    },
                    update: function () {
                        that.setAnswer(getAnswer($paixuList));
                    }
                });
                var $imgs = $view.find('.nqti-base-sequence-list>img');
                //jquery-event参数
                $imgs.data('alwaysUseTap', true);
                $imgs.on('qpTap', function (e) {
                    var $img = $(this);
                    if (that.isLock()) {
                        return;
                    }
                    var src = $img.attr('src');
                    var media = _utils.NDMedia;
                    if (typeof media != typeof undefined && media.ImageViewer) {
                        if (!that.__imageviewer) {
                            that.__imageviewer = media.ImageViewer.create({
                                    src: src,
                                    lang: option.lang,
                                    env: _utils.Broswer.Mobile() ? 'mobile' : 'pc'
                                }
                            );
                        } else {
                            that.__imageviewer.updateSrc(src);
                        }
                        that.__imageviewer.open();
                    }
                });
            };

            modelItem.destroy = function () {
                if (this.__imageviewer) {
                    this.__imageviewer.destroy();
                    this.__imageviewer = null;
                }
            }
        }
    };
    //注册
    var _QtiPlayer = window.QtiPlayer;
    _QtiPlayer.registerModelHandler(_modelHandler);
})(window, jQuery);


/*!
 *  修复内存泄漏问题，修改为使用普通数组代替$([])  modify by ylf 2015/11/20
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery resize event
//
// *Version: 1.1, Last updated: 3/14/2010*
//
// Project Home - http://benalman.com/projects/jquery-resize-plugin/
// GitHub       - http://github.com/cowboy/jquery-resize/
// Source       - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.js
// (Minified)   - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.min.js (1.0kb)
//
// About: License
//
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
//
// About: Examples
//
// This working example, complete with fully commented code, illustrates a few
// ways in which this plugin can be used.
//
// resize event - http://benalman.com/code/projects/jquery-resize/examples/resize/
//
// About: Support and Testing
//
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
//
// jQuery Versions - 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-resize/unit/
//
// About: Release History
//
// 1.1 - (3/14/2010) Fixed a minor bug that was causing the event to trigger
//       immediately after bind in some circumstances. Also changed $.fn.data
//       to $.data to improve performance.
// 1.0 - (2/10/2010) Initial release

(function ($, window, undefined) {
    '$:nomunge'; // Used by YUI compressor.

    // A jQuery object containing all non-window elements to which the resize
    // event is bound.
    var elems = [],

    // Extend $.resize if it already exists, otherwise create it.
        jq_resize = $.resize = $.extend($.resize, {}),

        timeout_id,
    // Reused strings.
        str_setTimeout = 'setTimeout',
        str_resize = 'resize',
        str_data = str_resize + '-special-event',
        str_delay = 'delay',
        str_resize_key = 'data-resize',
        str_throttle = 'throttleWindow',
        time_count = 0;

    // Property: jQuery.resize.delay
    //
    // The numeric interval (in milliseconds) at which the resize event polling
    // loop executes. Defaults to 250.

    jq_resize[str_delay] = 250;

    // Property: jQuery.resize.throttleWindow
    //
    // Throttle the native window object resize event to fire no more than once
    // every <jQuery.resize.delay> milliseconds. Defaults to true.
    //
    // Because the window object has its own resize event, it doesn't need to be
    // provided by this plugin, and its execution can be left entirely up to the
    // browser. However, since certain browsers fire the resize event continuously
    // while others do not, enabling this will throttle the window resize event,
    // making event behavior consistent across all elements in all browsers.
    //
    // While setting this property to false will disable window object resize
    // event throttling, please note that this property must be changed before any
    // window object resize event callbacks are bound.

    jq_resize[str_throttle] = true;

    // Event: resize event
    //
    // Fired when an element's width or height changes. Because browsers only
    // provide this event for the window element, for other elements a polling
    // loop is initialized, running every <jQuery.resize.delay> milliseconds
    // to see if elements' dimensions have changed. You may bind with either
    // .resize( fn ) or .bind( "resize", fn ), and unbind with .unbind( "resize" ).
    //
    // Usage:
    //
    // > jQuery('selector').bind( 'resize', function(e) {
    // >   // element's width or height has changed!
    // >   ...
    // > });
    //
    // Additional Notes:
    //
    // * The polling loop is not created until at least one callback is actually
    //   bound to the 'resize' event, and this single polling loop is shared
    //   across all elements.
    //
    // Double firing issue in jQuery 1.3.2:
    //
    // While this plugin works in jQuery 1.3.2, if an element's event callbacks
    // are manually triggered via .trigger( 'resize' ) or .resize() those
    // callbacks may double-fire, due to limitations in the jQuery 1.3.2 special
    // events system. This is not an issue when using jQuery 1.4+.
    //
    // > // While this works in jQuery 1.4+
    // > $(elem).css({ width: new_w, height: new_h }).resize();
    // >
    // > // In jQuery 1.3.2, you need to do this:
    // > var elem = $(elem);
    // > elem.css({ width: new_w, height: new_h });
    // > elem.data( 'resize-special-event', { width: elem.width(), height: elem.height() } );
    // > elem.resize();
    var getRandomId = function (name) {
        return name + (Math.random() * 10 + new Date().getMilliseconds()).toString().replace(".", "")
    };

    var removeItem = function (arry, item) {
        for (var i = 0; i < arry.length; i++) {
            var temp = arry[i];
            if (!isNaN(item)) {
                temp = i;
            }
            if (temp[0] == item[0]) {
                for (var j = i; j < arry.length; j++) {
                    arry[j] = arry[j + 1];
                }
                arry.length = arry.length - 1;
            }
        }
    }
    $.event.special[str_resize] = {

        // Called only when the first 'resize' event callback is bound per element.
        setup: function () {
            // Since window has its own native 'resize' event, return false so that
            // jQuery will bind the event using DOM methods. Since only 'window'
            // objects have a .setTimeout method, this should be a sufficient test.
            // Unless, of course, we're throttling the 'resize' event for window.
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var elem = $(this);
            elem.attr(str_resize_key, getRandomId(str_resize_key));
            // Add this element to the list of internal elements to monitor.
            elems.push(elem);

            // Initialize data store on the element.
            elem.data(str_data, {w: elem.width(), h: elem.height()});

            // If this is the first element added, start the polling loop.
            if (elems.length === 1) {
                loopy();
            }
        },

        // Called only when the last 'resize' event callback is unbound per element.
        teardown: function () {
            // Since window has its own native 'resize' event, return false so that
            // jQuery will unbind the event using DOM methods. Since only 'window'
            // objects have a .setTimeout method, this should be a sufficient test.
            // Unless, of course, we're throttling the 'resize' event for window.
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }


            var elem = $(this);

            // Remove this element from the list of internal elements to monitor.
            removeItem(elems, elem);
            // Remove any data stored on the element.
            elem.removeData(str_data);

            // If this is the last element removed, stop the polling loop.
            if (!elems.length) {
                clearTimeout(timeout_id);
            }
        },

        // Called every time a 'resize' event callback is bound per element (new in
        // jQuery 1.4).
        add: function (handleObj) {
            // Since window has its own native 'resize' event, return false so that
            // jQuery doesn't modify the event object. Unless, of course, we're
            // throttling the 'resize' event for window.
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var old_handler;

            // The new_handler function is executed every time the event is triggered.
            // This is used to update the internal element data store with the width
            // and height when the event is triggered manually, to avoid double-firing
            // of the event callback. See the "Double firing issue in jQuery 1.3.2"
            // comments above for more information.

            function new_handler(e, w, h) {
                var elem = $(this),
                    data = elem.data(str_data);

                // If called from the polling loop, w and h will be passed in as
                // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
                // those values will need to be computed.
                if (data) {
                    data.w = w !== undefined ? w : elem.width();
                    data.h = h !== undefined ? h : elem.height();
                    old_handler.apply(this, arguments);
                }
            };

            // This may seem a little complicated, but it normalizes the special event
            // .add method between jQuery 1.4/1.4.1 and 1.4.2+
            if ($.isFunction(handleObj)) {
                // 1.4, 1.4.1
                old_handler = handleObj;
                return new_handler;
            } else {
                // 1.4.2+
                old_handler = handleObj.handler;
                handleObj.handler = new_handler;
            }
        }

    };

    function loopy() {
        // Start the polling loop, asynchronously.
        timeout_id = window[str_setTimeout](function () {
            time_count++;
            // Iterate over all elements to which the 'resize' event is bound.
            elems.forEach(function (elem) {
                var width = elem.width(),
                    height = elem.height(),
                    data = elem.data(str_data);

                // If element size has changed since the last time, update the element
                // data store and trigger the 'resize' event.
                if (width !== data.w || height !== data.h) {
                    elem.trigger(str_resize, [data.w = width, data.h = height]);
                }

                if (time_count % 50 === 0) {
                    if (elem.get(0) !== window && $('[' + str_resize_key + '="' + elem.attr(str_resize_key) + '"]').length === 0) {
                        removeItem(elems, elem);
                        elem.removeData(str_data);
                        elem.unbind(str_resize);
                    }
                }

            });
            if (!elems.length) {
                clearTimeout(timeout_id);
            } else {
                // Loop.
                loopy();
            }

        }, jq_resize[str_delay]);


    };


})(jQuery, this);
/*!
 Non-Sucking Autogrow 1.1.1
 license: MIT
 author: Roman Pushkin
 https://github.com/ro31337/jquery.ns-autogrow
 modify by ylf 2016/6/29
 */
(function () {
    var getVerticalScrollbarWidth;

    (function ($, window) {
        return $.fn.qtiAutogrow = function (options) {
            if (options == null) {
                options = {};
            }
            if (options.horizontal == null) {
                options.horizontal = true;
            }
            if (options.vertical == null) {
                options.vertical = true;
            }
            if (options.debugx == null) {
                options.debugx = -10000;
            }
            if (options.debugy == null) {
                options.debugy = -10000;
            }
            if (options.debugcolor == null) {
                options.debugcolor = 'yellow';
            }
            if (options.flickering == null) {
                options.flickering = true;
            }
            if (options.postGrowCallback == null) {
                options.postGrowCallback = function () {
                };
            }
            if (options.verticalScrollbarWidth == null) {
                options.verticalScrollbarWidth = getVerticalScrollbarWidth();
            }
            if (options.horizontal === false && options.vertical === false) {
                return;
            }
            return this.filter('input,textarea').each(function () {
                var $e, $shadow, heightPadding, minHeight, minWidth, update, maxWidth;
                $e = $(this);
                if ($e.data('autogrow-enabled')) {
                    return;
                }
                $e.data('autogrow-enabled');
                minHeight = parseInt($e.attr('data-minHeight')) || $e.height();
                minWidth = parseInt($e.attr('data-minWidth')) || $e.outerWidth();
                heightPadding = $e.css('lineHeight') * 1 || 0;
                $e.hasVerticalScrollBar = function () {
                    return $e[0].clientHeight < $e[0].scrollHeight;
                };
                maxWidth = parseInt($e.css('max-width'));
                $shadow = $('<div class="' + options.shadow + '"></div>').css({
                    position: 'fixed',
                    display: 'inline-block',
                    //visibility: 'hidden',
                    'background-color': options.debugcolor,
                    top: options.debugy,
                    left: options.debugx,
                    'max-width': $e.css('max-width'),
                    'padding': $e.css('padding'),
                    'boxSizing': $e.css('boxSizing'),
                    fontSize: $e.css('fontSize'),
                    fontFamily: $e.css('fontFamily'),
                    fontWeight: $e.css('fontWeight'),
                    lineHeight: $e.css('lineHeight'),
                    resize: 'none',
                    'word-wrap': 'break-word',
                    'word-break': 'break-all'
                }).appendTo($e.parent());
                if (options.horizontal === false) {
                    $shadow.css({
                        'width': $e.width()
                    });
                }
                update = (function (_this) {
                    return function (event) {
                        if ((!minWidth || isNaN(minWidth))) {
                            if (typeof  options.minWidth === 'object') {
                                if (!options.minWidth instanceof jQuery) {
                                    options.minWidth = $(options.minWidth);
                                }
                                minWidth = options.minWidth.outerWidth();
                            } else {
                                minWidth = $e.outerWidth();
                            }

                        }
                        if ((!maxWidth || isNaN(maxWidth)) && typeof  options.maxWidth === 'string') {
                            //maxWidth = minWidth * 3;
                            var maxWidth = $shadow.closest(options.maxWidth).outerWidth() - 30;
                            $shadow.css({'max-width': maxWidth + 'px'})
                        }
                        var height, val, width;
                        val = _this.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n /g, '<br/>&nbsp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\n$/, '<br/>&nbsp;').replace(/\n/g, '<br/>').replace(/ {2,}/g, function (space) {
                            return Array(space.length - 1).join('&nbsp;') + ' ';
                        });

                        $shadow.html(val);
                        if (options.vertical === true) {
                            minHeight = parseInt($e.attr('data-minheight')) || $e.height();
                            height = Math.max($shadow.height() + heightPadding, minHeight);
                            $e.height(height);
                        }
                        if (options.horizontal === true) {
                            minWidth = parseInt($e.attr('data-minwidth')) || minWidth;
                            //width = Math.max($shadow.outerWidth(), minWidth);
                            width = Math.max($shadow.outerWidth(), minWidth);
                            //排除为0的情况
                            if (width) {
                                $e.outerWidth(width);
                            }
                        }
                        return options.postGrowCallback($e);
                    };
                })(this);
                $e.on('input', update);
                $e.resize(update);
                //$(window).resize(update);
                return update();
            });
        };
    })(window.jQuery, window);

    getVerticalScrollbarWidth = function () {
        var inner, outer, w1, w2;
        inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";
        outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);
        document.body.appendChild(outer);
        w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        w2 = inner.offsetWidth;
        if (w1 === w2) {
            w2 = outer.clientWidth;
        }
        document.body.removeChild(outer);
        return w1 - w2;
    };

}).call(this);

(function (window, $) {

    //var isApp = false;
    var isApp = (typeof AndroidInterface != "undefined");
    if (!isApp) {
        return;
    }

    var _logger = window.QtiPlayer.getLogger();
    var _QtiPlayer = window.QtiPlayer;
    if (!_QtiPlayer.HandwriteInteraction) {
        _QtiPlayer.HandwriteInteraction = {
            clipBoardId: {},
            instances: {},
            createListener: [],
            deleteListener: [],
            removeItem: function (arry, obj) {
                for (var i = 0; i < arry.length; i++) {
                    var temp = arry[i];
                    if (!isNaN(obj)) {
                        temp = i;
                    }
                    if (temp == obj) {
                        for (var j = i; j < arry.length; j++) {
                            arry[j] = arry[j + 1];
                        }
                        arry.length = arry.length - 1;
                    }
                }
            },
            clearCache: function () {
                for (var key in _QtiPlayer.HandwriteInteraction.instances) {
                    var instance = _QtiPlayer.HandwriteInteraction.instances[key];
                    if (instance != null && !instance.isDomExist()) {
                        instance._fullScreenCallBack(false);
                        delete _QtiPlayer.HandwriteInteraction.instances[key];
                    }
                }
            },
            clearInstance: function (instance) {
                for (var key in _QtiPlayer.HandwriteInteraction.instances) {
                    if (_QtiPlayer.HandwriteInteraction.instances[key] == instance) {
                        instance._fullScreenCallBack(false);
                        delete _QtiPlayer.HandwriteInteraction.instances[key];
                    }
                }
            },
            updateAnswer: function (callback) {
                for (var key in _QtiPlayer.HandwriteInteraction.instances) {
                    var instance = _QtiPlayer.HandwriteInteraction.instances[key];
                    if (instance != null && !instance.isDomExist()) {
                        instance._fullScreenCallBack(false);
                        delete _QtiPlayer.HandwriteInteraction.instances[key];
                        continue;
                    }
                    instance.updateAnswer(callback);
                }
            },
            registerListener: function (fn, type) {
                if (type.create) {
                    this.removeItem(this.createListener, fn);
                    this.createListener.push(fn);
                } else if (type.remove) {
                    this.removeItem(this.deleteListener, fn);
                    this.deleteListener.push(fn);
                }
            },
            removeListener: function (fn) {
                this.removeItem(this.createListener, fn);
                this.removeItem(this.deleteListener, fn);
            },
            excCreateListener: function (id, res) {
                for (var i = 0; i < this.createListener.length; i++) {
                    var obj = this.createListener[i];
                    obj && obj(id, res);
                }
            },
            excRemoveListener: function (id, res) {
                for (var i = 0; i < this.deleteListener.length; i++) {
                    var obj = this.deleteListener[i];
                    obj && obj(id, res);
                }
            }
        }
    }

    //var bridgeListener = {};
    var registerNativeListener = function (key, callback) {
        if (typeof Bridge != 'undefined' && Bridge.registerListener) {
            Bridge.registerListener(key, callback);
        }
    };

    //window.QtiPlayer.HandwriteInteraction.writingCallback = {}
    registerNativeListener("HandwriteInteraction.Writing", function (obj) {
        for (var key in _QtiPlayer.HandwriteInteraction.instances) {
            var instance = _QtiPlayer.HandwriteInteraction.instances[key];
            if (instance != null && !instance.isDomExist()) {
                instance._fullScreenCallBack(false);
                delete _QtiPlayer.HandwriteInteraction.instances[key];
                continue;
            }
            instance.writing(obj && obj.id);
        }
    });

    registerNativeListener("HandwriteInteraction.updateAnswer", function (obj) {
        for (var key in _QtiPlayer.HandwriteInteraction.instances) {
            var instance = _QtiPlayer.HandwriteInteraction.instances[key];
            if (instance != null && !instance.isDomExist()) {
                instance._fullScreenCallBack(false);
                delete _QtiPlayer.HandwriteInteraction.instances[key];
                continue;
            }
            instance.updateAnswerComplete(obj && obj.id, obj && obj.base64);
        }
    });

    //创建
    var _modelHandler = {
        _name: 'drawingInteraction_handwrite',
        //获取model名称
        getName: function () {
            return this._name;
        },
        //创建渲染的方法
        create: function (modelItem) {
            _QtiPlayer.HandwriteInteraction.clearCache();

            var interaction = null;
            modelItem.init = function () {
                interaction = new DrawingHandwriteInteraction(modelItem);
                _QtiPlayer.HandwriteInteraction.instances[interaction.interactionId] = interaction;
            }
            //该model没有小题编号
            modelItem.hasNum = function () {
                return false;
            };
            modelItem.createTitleHtml = function () {
                return interaction.createTitleHtml();
            }
            modelItem.createAnswerHtml = function (option) {
                interaction.setOption(option);
                return interaction.createHtml();
            }
            modelItem.render = function ($view, option) {
                interaction.setOption(option);
            }
            modelItem.eventHandle = function ($view, option) {
                interaction.eventHandle($view);
            }
            modelItem.destroy = function () {
                QtiPlayer.HandwriteInteraction.clearInstance(interaction);
                interaction = null;
            }
        }
    };
    //注册

    _QtiPlayer.registerModelHandler(_modelHandler);


    var DrawingHandwriteInteraction = window.QtiPlayer.Class(window.QtiPlayer.BaseInteraction, (function () {

            var callNative = function (eventName, data) {
                if ((typeof Bridge != "undefined") && Bridge && Bridge.callNative) {
                    return Bridge.callNative('com.nd.pad.icr.ui.IcrJsBridge', eventName, data);
                }
                return false;
            };


            var nativeRemoveClipBoard = function (id) {
                var res = callNative('removeClipboard', {
                    id: id
                });
                //res = {success: true};
                if (res && res.success) {
                    delete  _QtiPlayer.HandwriteInteraction.clipBoardId[id];
                }
                _QtiPlayer.HandwriteInteraction.excRemoveListener(id, res);
                return res;
            }

            var nativeCreateClipBoard = function (id, l, t, r, b, bgurl) {
                var res = callNative('addClipboard', {
                    id: id,
                    left: l,
                    top: t,
                    right: r,
                    bottom: b,
                    bgUrl: bgurl
                });
                //res = {success: true};
                if (res && res.success) {
                    _QtiPlayer.HandwriteInteraction.clipBoardId[id] = id;
                }
                _QtiPlayer.HandwriteInteraction.excCreateListener(id, res);
                return res;
            }

            var nativeGetClipBoardBase64 = function (id) {
                return callNative('getClipboardContent', {
                    id: id
                });
                //return {
                //    success: true,
                //    content: 'iVBORw0KGgoAAAANSUhEUgAAAFoAAAA9CAMAAAAah47SAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFqGZGd1IZ+s1IVEA/sGgn9Zxm3pEuaEw+zEUm+diDyXk2yV1I9Z5b8pEr838xUTcutl4517CQ9L4qvjAm+cVi3JBV22Qs28Kt74ZL6Khq1I03u3Ncu39qjTYFpGAs7rtv7LE+1HQdZ3MQ3Y5JnEgV8Y8556NffWps+cgvnjkBoY+R3n5D7rM91pV1+9Qo9ahd5Yo38Mta7K5p4nQEbDwP6rQu5bmbwl8S9J9H5GcD1WIX45sn8mcK6pRQ0JoOs10C6pkE7L2K5lkCrz8F4YcRtSsC0mUD3JNr1cPA56FC0UoB+tQ/0qeT2rGZvlAG48/F44kn3cG0AAAANn1FggsBXJE/dsb00/fXcONyAEoAjdmFRGUSidH0ISk4/8Dr2ZeteA41el+CbwBA/pSUvLyrnxdsd59J3lVPWa0mpIhnRlxgHEFt+QojhYMa1AoH/ycf1qFks6psnnMQ3MBK+beHlh4QYi8fw1cm67eh/+pB3byHxhVwuQkA/OoqnAEAujdJBl/IDVeazaw//vNoE3oBsZco4X9eI6ojpF0P2lCK/v7F3q129HwjtZtU6qkH/t0I9Nmq364Z/vUB+d3C6ZIcs4EONhoVoCYC8gECczwphioOzRmSagcDySwDMAUJ9rpVfjEd++DW48cqwjYF+7kdxWYphVcR/t4X/oYD0IE55aESwLCH8LcR0HUcjj4fXAMBUiAT8sV9xZps99V64ZIDDAAC+Nhl8c1xwXUL+ssW9XoCslUbyoMW/v/e2I5C+6pCzo9Skk4x+9WJ1FcF/vjq7K9Ny3Qv0HgB5nYX//SN95w4sGkv/Mtx9cJD5rFg+8QD/dxV/ORq/OKfZhoN1jwCu3xBol85//q4xGcC/p8P/bgC/tl14oYC8IYG130I/vCueygP//3N/88ISgUH9b5q/cNX//71/I8a+6kD/JIE/rMp/Z4A/LZG36JU95QmfxoG/uiF/8VI/s1a/t59//Sc/qkZ/////KAZ+ZoX9pQO/Kwu/ZcK+qQk/ZYC9ZAE/bc6V6sj6QAAAFN0Uk5T6+zQx+575aHVYJ6n7OzA+2N+2/uWr7lHhKn5kXb/zoLE3v7E/NjHfv7/T//+Sv////5u///7Lf///v///5r///9Q/P////9eBvz//yQ5/w7/GABAiNhEAAALaElEQVRYw7WYZ1iaWRbHfaZtkpm0SZuYmGIbjT1qLNgRFJBiPmzf6cmkTya990QTjYlGo8beo7GOvcTeI4qCighYiaiAgCBSlL1gMhEmjuzu7N9HP1wOv/fc0+711dqvuXx2blyJ1dxcS3PT9ealw6W27v8HtHuH+bSAUJq57w9HY20pjAcve/GUrf8b2ttrr7u3WqAzhFWCB12tpZ+oP9N9JVpztNknmR2ln29RRXsmz1YxWjmlu1Vt99qWlprv8tUQvS8jrZOrHlXsR5Oi2bGxZLdNKrYrg4w6uajhz701Q++i8Hpf9vIou1RW92CYQpFwEuOj8kBPZtGDl11GHXs1QmMhzCrB0IB9ZrDqNr90JcPJ+ntUy6ZJxOgdqm3t2KUR2reCOctqa+BkuqhFUK/7cI+zWkVihDJGmz1HQ/T+HQVCEFVZwUeqAfT+LGHmiaGaG9B5hW0y0/n9aLS7avXsgboJhbMFrnvUMBYA/Zlap2+DiUEGKGTVDbq7Y5XojRQmRbXSthu7lpS47lAvHPv3oN3DjeF0uKoXKz8gEKx2AvQHlGSCEcVNxfE9O4zLTyN81NAW9TMJFmrxNzDthupvU7Hcm0wo4hNQG7V2MicGXj5ATap2gk9zFZ+wRq05ALrewkxlzUvcyZetV42bLV8gKJITUFqfKyrtwSizSeXJ3qtZrZ0iL5XvOJ95PfN6VHXNA2/F46gOLC8ZKMcW+YQCPcuqHW1VQ+/fJGM1dDqplIheLUCfUZlOztIiFk9tqJhltLYJ+mUiIy090L8cjszNTm33YwxOEX7z4o3aP3k9M/P4s8UUpyJTnmyTWs1QZa2tsrGJZC00GfSvyI1s/LFqzsZY8tDO2S/erXxsPwS8HrJ/l28fD56VhD+m2uMbLTGZsrFZYcdurf3bMdZUqqtOo9PmxXXli5OzZKFc2jv26tqXwOuXo3q/mnjIrUQ8Hmdxbfka4rPCoQVuQQW7fbQUlfaRcTg0BdG8e1H2vfVELLk4tFO06m1YWwcU6PqB1jdHGNoBbyWW81i4ReXoboo/jymHwVat2u690OjYPUiP8hQ2zmPR3pzHWBLJc08ruYEX2I2vM6e2V4keyufs9cFi0VtleFPahJwnMXiX6y/wDeftziOR6MUzZAupLiWF3eC0Zt9itEw0bw0x5SAMDXFjo11v0AOjHA4CwRHbip8LAfpdFtEG+IaUxpQ6krvqePJCOjY2sosDnd5mc+eYXCKbFY+XlYWG0sScuGnBWzQ3jkMrA5rrE0rkPNHbwfQFx4rdmN7oSNquPvm2IRvTK9n5FoEG7m8slej5+fF58axMzliE5sslIuncHEADr0ULXnsZSIrYlZXpjR6rfjtUN3uYVLPb8/PtA9d4gcyskbEW0Aqy5Lfo8TmpEi1f7YP12Wsg4Rez2ezKdI/d75nX3phmgB7Nn+5ncew3Orey5OpoQAaFrYZmVHEQrVWM/tH29nZ2ZTPS531HARppCdB5+Vwut6iqlcFQQ/cOPXnyJKH+da8ams9gMdraiotH29lsSw+v958y2xzYAXm1QNP5bW18HgC8Q/MFeacTMzIST+cNCBahJ3h8fn//9HR/vpLtsHmpA2x3IBvBzhNwgWkRn8+okojm36B5bYiCq1dReNRVN0he/69oOYvF7+9UovPbEdWWcOxS6H3WfcnCipMCYNrf1iBBmUJmx5VoeRwk6CIuCYlMykKVBjfwZAr0XJ8EgkJN4KeBK9O1DRkd1DqvJY9dHxfdf9xNJp8U9E8X22aG3U00MhUr0SxcphEmxjIvr5UEg5h7NkwA9LiUY5p499SpYAhgcxHM4LW6dkuf6M42d+78TTfZLq+FiwjK/u67b26Z46QAPYGjG8FIgpmE+hlB2RVIEE6uqOtZSKL/tSvXjF1MW7jFQvrRGzdt0Eui9e78/S9/vXO8rFswGqR/4Kuvor67m+k5Lp6VVGRmxfTOJFARMzO9DphkT4hQOi4NTdS/8n19wgbj4GIBgnrkzzP//Ne6JdE7DibcO3PoToVdLYt8oB5M/vvfBEPmxSJIRgbM/nGAZUjHvYDHqJisTJxQOkezDbvy/cyFCwkbyHFcWurNH+79cGRp9Kqf8zrmD/odrzuJN/46AX7v6zMHyjM8pcJQOh3JrywICXk0XGBCqMO4ecqkc54usGMWJgXU73+EWhXTjtzooRw+arYk2uz4w2GKrp8usttow31cyKOCH6OuNwG0Z5MnElVsQhke7jAZRXnUFdAV6LATxxwzQ0KsTyRZWdQduXE3pOao75JorK6fY+BxP926btsNl4MehYRGRR2ooPYJcXR60oQ5jjY3ScOhjJALXheUnPjpmFtIqWUEzCoOc/Nm2fObH/7OnW/7nYMHD/npkqrx0Kj7NKb15ajrJdZ9IhzdDdZs5OBgYuJgjRcm0d2yJqSTdNcTx0j0UIdjEa75DZijN7799qjX710nd9zxO+QXBjvZ6Xr5ct19ExAQsnXfrMSuiZokxN2Li7uHK61DUsmgQiatS0gRzfd+dIw4USFgk47cuHFj7e/eVLE7dA8dTyrntpScjboPdLmETpOCusa4QWMkKCYTNVEHozZlKeqa1kSO+AkoIpwtyHcg37y5Fr3MJXgFFHm+toVr5Xo96nJU1HmytVTR6FlN1LqkuuZmByQIh52yGyfhrvAIIKh2Swu3G+OqY7bM/RoNDR/p6Z/u5+Jdz16/bteEmR9XzpBGDJUKQyJh8AK4XbtihoARAi/BIJFQbW5LW3fuCCwcvQx6XQ60fFC/sorFqKI3kcnWYunC5Os/WQ6nNjVR6Zjqrk7lATbeJ2yuqICYdvIrs4nEZ+Eje5ZBYz+MJjna2VVUZOGaHR2dngONL8zrroDq7u7qgMdDAoZyqIIPpGOBOFxWib9/iR0s50/L/8PxYU6MU3NoRrALUEVWliMcyMG6GVfVdubChQuP8+wtQcjhdXC4o11WRYXCKmPMKem35PegvywcmQonOT2nDD96lJaYmGh7K+DFLwuqfiPtylu3btkmJpamPRqmSJ2SzkbHFn6pEfrp09iR6LNQMo3ZMQyUZn6RQOgEKiKgUCgCgYAyN09LA9ThDoqYXP6M+BRIQzQxPjf3aWxs7EiuTap/Cd2TNj//fBycKnOTC5oTi0M9m0pepdrY5MY+fbo2sibyXKxm6JFTd+Pj4weJOSMjAH8usqamp6fnFVB3t+Lvq56amsjIc7m5IyMjOcR48GHN3UiNvP5TYWzYBDF+cHBqaursMx19BfGXFwr9cLjnxYvDDx92Kx5Rrv8MGEw9y67pqbEZyy7UII07BwuJxJz4BXR0WMur8nSEfVvXwMDAUJ5tsUVXbdtoXBXCsjHlWYH5s+ipQYDuiYwmFuo4L4dGl2EKY89FZi+gc8Jul2enVyJGu4CGGjtul1yqHW1vQIC7XQqxaeItumdtYW6z03KNvo7kiNGxyc0lEhXoKeLU4Ku36AeXjHW6u/LeorNzcojKgIAk2vgHOsWsWwbtm3QFisH4K5IPshQdnaOfko5oaAPx6B0YuvDLgDIgLPvK9JTywZFokGiiTWqqK90x/NoK7+VijV5x5RrMY6wvwyXsVGpqanZ8tr6/awW7vT3g0qXHjy8FsLUbs+wwUGOdwcFBQD0V5hLU1wy7du1TrAZvFrw2x8SQPMqYw4/Srl4sKr70YkE/Az1USNmYD2+dPp1ofjVtuGPOgxSz4VMzDd897dv+6QqShwNtkknpGDa/ePs2t0Wg/AGTGfy23L598aKCSmHO0RwcV2xz9/1PXsZ5o7d4bdLbBXED90na/KJWVHQjWJubm3dbvctwpxca+1++5/P1Qa9fv9XQUM/AxETb0tJSW1v7Ez09w607169H+3r/Qa8QfX2wvlu2+GKx3pp+49/X8mWb50u+rQAAAABJRU5ErkJggg=='
                //};
            }


            //类成员
            var member = {

                /**
                 * 构造函数，并声明全局变量
                 * @param modalItem
                 * @param $view
                 * @param option
                 * @constructor
                 */
                Create: function (modalItem, $view, option) {
                    this.base(modalItem, $view, option);
                    this.canvasWidth = 0;
                    this.canvasHeight = 0;
                    this._fullScreen = false;
                    this.canvasNativeHeight = 0;
                    this.canvasId = this.interactionId + "-canvas";
                    this.nativeCanvasId = this.interactionId + "native";
                    this.contentOffset = {};
                    this.answerCount = 0;//答案计数器，用来更新答案来进行回调

                    this._fullScreenChangeHandler = this.proxy( this._fullScreenChangeHandler);
                    this._fullScreenCallBack(true);
                },
                proxy: function (fn) {
                    var thisobj = this;
                    return function () {
                        return fn.apply(thisobj, arguments);
                    };
                },
                createTitleHtml: function () {
                    return '<div class="qp-model-header">' + this.modalModel.prompt + '</div>';
                },
                /**
                 * 渲染数据
                 */
                createHtml: function () {
                    var _self = this;
                    _self.refPath = "";
                    _self.setResultXml = "";

                    var createHtml = function () {
                        var html = '';
                        var bg = _self.modalModel.object.data;
                        var style = '';
                        var cavsClass = '';
                        if (bg.length > 0) {
                            style = 'background-image: url(\'' + bg + '\');'
                        } else {
                            //无背景时，手写题在老师端显示空白背景和学生端同步
                            cavsClass = 'qp-hw-cavs-nobg-hd-pad';
                        }
                        html += '      <div class="qp-hw-drawing-content" style="visibility: hidden;" >                                                                                                                       ';
                        html += '      <div style="position: relative" class="qp-hw-drawing-box" >                                                                                                                       ';
                        html += '        <div  class="qp-hw-writing_edit" style="display: none">                                                                                                                          ';
                        html += '          <a href="javascript:void(0)" class="qp-hw-writing_botton qp-hw-classlink" style="display:none;" id="btn_back">                                                                  ';
                        html += '              <ins class="qp-hw-icon_back"></ins>                                                                                                                ';
                        html += '          </a>                                                                                                                                                ';
                        html += '          <a href="javascript:void(0)" class="qp-hw-writing_botton qp-hw-classlink" id="write">                                                                     ';
                        html += '              <ins class="qp-hw-icon_writing"></ins>                                                                                                             ';
                        html += '          </a>                                                                                                                                                ';
                        html += '              <a href="javascript:void(0)" class="qp-hw-writing_botton qp-hw-botton_clear" id="clear">                                                              ';
                        html += '                  <ins class="qp-hw-icon_clear"></ins>                                                                                                           ';
                        html += '              </a>                                                                                                                                            ';
                        html += '              <a href="javascript:void(0)"  class="qp-hw-writing_botton qp-hw-botton_allclear qp-hw-classlink" id="clearall">                                          ';
                        html += '                  <ins class="qp-hw-icon_allclear"></ins>                                                                                                        ';
                        html += '              </a>                                                                                                                                            ';
                        html += '        </div>                                                                                                   ';
                        html += '          <canvas class="' + cavsClass + ' qp-hw-cavs" id="' + _self.canvasId + '" style="' + style + '">               ';
                        html += '              Fallback content, in case the browser does not support Canvas.                                                                                  ';
                        html += '          </canvas>                                                                                                                                           ';
                        html += '      </div>                                                                                                                                                  ';
                        html += '      </div>                                                                                                                                                  ';
                        return html;
                    };
                    var init = function () {
                        return createHtml();
                    };
                    return init();
                },
                _fullScreenCallBack: function (on) {
                    on = on ? 'on' : 'off';
                    $(document)[on]('webkitfullscreenchange', this._fullScreenChangeHandler);
                },
                _fullScreenChangeHandler: function () {
                    var that = this;
                    that._fullScreenTrigger = true;
                    that._fullScreen = !that._fullScreen;
                    clearTimeout(that._fullscreenTimeoutid);
                    that._fullscreenTimeoutid = setTimeout(function () {
                        that._fullScreenTrigger = false;
                    }, 1000);
                },
                eventHandle: function ($view) {
                    var _self = this;
                    $view.attr("data-key", _self.interactionId);
                    var resizeWh = function () {
                        _self.canvasWidth = _self.modalModel.object.width;
                        _self.canvasHeight = _self.modalModel.object.height;
                        _self.canvasNativeHeight = _self.modalModel.object.height;
                        var $canvas = $view.find(".qp-hw-drawing-content canvas");
                        $canvas.css({
                            width: _self.canvasWidth,
                            height: _self.canvasHeight
                        });
                        try {
                            if ($canvas && $canvas.length > 0 && $canvas[0]) {
                                $canvas[0].width = _self.canvasWidth;
                                $canvas[0].height = _self.canvasHeight;
                            }
                        } catch (e) {
                            _logger.debug("手写题渲染异常");
                            _logger.debug($canvas);
                        }

                        $view.find('.qp-hw-drawing-box').css({
                            width: _self.canvasWidth + 3
                            //height: resize.h + 10
                        });
                    };

                    var imageLoad = function (src, callback) {
                        var img = new Image();
                        img.crossOrigin = "anonymous";
                        img.src = src;
                        if (img.complete) {
                            callback(img, true);
                        } else {
                            img.onload = function () {
                                callback(img, true);
                                img.onload = null;
                            };
                        }
                        img.onerror = function () {
                            callback(img, false);
                            img.onerror = null;
                        }
                    };


                    var imgLoadComplete = function (completeCallback) {
                        var $imgs = $view.find("img");
                        if ($imgs.length <= 0) {
                            completeCallback();
                            return;
                        } else {
                            var loadSize = 0;
                            $.each($imgs, function (index) {
                                imageLoad($($imgs[index]).attr("src"), function (img, succeed) {
                                    loadSize++;
                                    _logger.debug("loadSize:" + loadSize);
                                    if (loadSize == $imgs.length) {
                                        completeCallback();
                                    }
                                });
                            });
                        }
                    }

                    var bindEvent = function () {
                        resizeWh();
                        imgLoadComplete(function () {
                            //判断是否被移除
                            if ($view.find(".qp-hw-drawing-content").length == 0) {
                                return;
                            }
                            var offset = $view.find(".qp-hw-drawing-content").offset();
                            _self.contentOffset = offset;
                            var res = nativeCreateClipBoard(_self.nativeCanvasId, offset.left, offset.top, offset.left + _self.canvasWidth, offset.top + _self.canvasNativeHeight, _self.modalModel.object.data);
                            if (res && res.success) {
                                $view.find(".qp-hw-drawing-content").css("visibility", "hidden");
                                $view.resize(function () {

                                    //全屏导致的重绘，不进行处理
                                    if (_self._fullScreenTrigger || _self._fullScreen || document.webkitIsFullScreen) {
                                        _logger.debug('-------------fullscreent:');
                                        return;
                                    }
                                    _logger.debug("drawing-resize:"+document.webkitIsFullScreen);
                                    var $drawContent = $view.find(".qp-hw-drawing-content");
                                    if ($drawContent && $drawContent.length > 0) {
                                        var offset = $drawContent.offset();

                                        if (Math.abs(offset.left - _self.contentOffset.left) > 10 || Math.abs(offset.top - _self.contentOffset.top) > 10) {
                                            _logger.debug("drawing-resize-do");
                                            _self.contentOffset = offset;
                                            var removeRes = nativeRemoveClipBoard(_self.nativeCanvasId);
                                            if (removeRes && removeRes.success) {
                                                _self.nativeCanvasId += "1";
                                                nativeCreateClipBoard(_self.nativeCanvasId, offset.left, offset.top, offset.left + _self.canvasWidth, offset.top + _self.canvasNativeHeight, _self.modalModel.object.data);
                                            }
                                        }
                                    }
                                });
                            } else {
                                //教师端
                                $view.find(".qp-hw-drawing-content").css("visibility", "visible");
                            }
                        });

                    };


                    var setAnswer = function (answers) {
                        if (!answers || answers[0] == undefined || answers[0] == null)
                            return;
                        var rect = JSON.parse(answers[0].split('|$*-*$|')[0]);
                        var base64 = answers[0].split('|$*-*$|')[1];
                        var bg = _self.modalModel.object.data;
                        var style = 'width:' + rect.width + 'px;height:' + rect.height + 'px;border: 1px solid rgb(136, 136, 136);' + (bg.length > 0 ? 'background-image: url(\'' + bg + '\');' : '');
                        var answer = '<img style="' + style + '" src="' + base64 + '">';
                        $view.find('.qp-hw-drawing-box').attr("style", "");
                        $view.find('.qp-hw-drawing-box').html(answer);
                        $view.find(".qp-hw-drawing-content").css("visibility", "visible");
                    };

                    var initEvent = function () {
                        bindEvent();
                        //_self.setAnswer(getAnswer());
                        if (_self.option.showAnswer) {
                            setAnswer(_self.getAnswer());
                        }
                    };

                    initEvent();
                },
                getCurrentAnswer: function () {
                    var _self = this;
                    var imgBase64 = "";

                    var res = nativeGetClipBoardBase64(_self.nativeCanvasId);
                    var arry = {
                        width: _self.canvasWidth,
                        height: _self.canvasNativeHeight
                    };
                    if (res && res.success && res.content && res.content.length > 0) {
                        if (res.content.substr(0, 5) != "data:") {
                            res.content = 'data:image/png;base64,' + res.content;
                        }
                        imgBase64 = res.content;
                    }
                    var answer = [];

                    answer.push(JSON.stringify(arry) + "|$*-*$|" + imgBase64);
                    return answer;
                },
                updateAnswer: function (callback) {
                    var _self = this;
                    _self.setAnswer(_self.getCurrentAnswer());
                    this.updateAnswerCallback = callback;
                },
                writing: function (id) {
                    var _self = this;
                    if (_self.nativeCanvasId == id) {
                        _self.answerCount++;
                        _self.setAnswer([_self.answerCount]);
                    }
                },
                updateAnswerComplete: function (id, base64) {
                    var _self = this;
                    if (_self.nativeCanvasId == id) {
                        var arry = {
                            width: _self.canvasWidth,
                            height: _self.canvasNativeHeight
                        };
                        if (base64 && base64.length > 0 && base64.substr(0, 5) != "data:") {
                            base64 = 'data:image/png;base64,' + base64;
                        }
                        var answer = [];

                        answer.push(JSON.stringify(arry) + "|$*-*$|" + base64);
                        _self.setAnswer(answer);

                        _self.updateAnswerCallback && _self.updateAnswerCallback();
                    }
                }
            };
            return member;
        })()
    );
})
(window, jQuery);


// textEntryInteraction
(function (window, $) {
    var _QtiPlayer = window.QtiPlayer;
    var _utils = _QtiPlayer.getUtils();

    var DigitalKeyboard = _utils.DigitalKeyboard;

    var HTML = {
        CONTENT: '',
        DIGITAL: '<span data-index="0" class="nqti-base-fill-cell span-to-div _qp-text-input qp-digital-container _qp-text-normal ${hide}"  id="${digitalId}"></span>',
        Normal: '<input Keyboard-Offset-Y="65" data-index="0" step="${step}" class="nqti-base-fill-cell ${cls} _qp-text-input _qp-text-normal ${hide}" data-type="${type}" ${maxLengthAttr} type="${type}">'
    };

    var p = [];
    p.push('<span class="nqti-base-fill _qp-base-fill ${hw}">');
    //correctAnswer
    p.push('    <span data-num="${num}" class="nqti-base-fill-cell nqti-correct _qp-text-input _qp-text-showcorrectanswer ${correctAnswerHide} ">');
    p.push('        <span class="nqti-base-fill-index _qp-text-showcorrectanswer-num ${indexHide}">${num}</span>${correctAnswer}');
    p.push('    </span>');
    //checkAnswer
    p.push('    <span data-num="${num}" class="nqti-base-fill-cell  _qp-text-input _qp-text-showcheckedanswer fill-cell-min-width ${checkAnswerHide}"></span>');
    //statisAnswer
    p.push('    <span class="nqti-base-fill-cell _qp-text-input _qp-text-showstatisanswer ${statisAnswerHide}">');
    p.push('        <span class="nqti-base-fill-index">${num}</span>');
    p.push('    </span>');
    //otherAnswer
    p.push('    ${otherAnswer}');
    p.push('    <input style="position: absolute;left: -10000px;top: -10000px;" class="nqti-base-fill-cell _qp-text-hidden "  type="text">');

    p.push('    <span class="nqti-txt-hw-btn-container" data-index="0">');
    p.push('        <span class="nqti-txt-hw-btn nqti-txt-hw-btn-left nqti-btn-hw"></span>');
    p.push('        <span class="nqti-txt-hw-btn nqti-txt-hw-btn-right nqti-btn-clear"></span>');
    p.push('    </span>');
    p.push('    <span class="nqti-txt-hw-visible-container" data-index="0">');
    p.push('        <span class="_qp_txt_split_pre"></span><span class="_qp_txt_split_suffix"></span>');
    p.push('    </span>');
    p.push('</span>');

    HTML.CONTENT = p.join('');

    //创建
    var _modelHandler = {
        _name: 'textEntryInteraction',
        //获取model名称
        getName: function () {
            return this._name;
        },
        create: function (modelItem) {
            //创建渲染方法
            var _model = modelItem.getModel();
            var digitalInputId = '';

            //返回题目类型名称
            modelItem.getName = function () {
                return _utils.getLangText('blank_filling', this.getOption());
            };
            //该model没有小题编号
            modelItem.hasNum = function () {
                return false;
            };
            //该model没有提示
            modelItem.hasHint = function () {
                return false;
            };
            modelItem.hasTitle = function () {
                return false;
            };
            modelItem.getClassName = function () {
                return '';
            };
            modelItem.isBlock = function () {
                return false;
            };
            //创建html对象的方法
            modelItem.createTitleHtml = function () {
                return '';
            };
            modelItem.createAnswerHtml = function (option) {
                var that = this;
                var maxLengthAttr = '';
                if (_model.expectedLength > 0) {
                    maxLengthAttr = ' maxlength="' + _model.expectedLength + '" ';
                } else {
                    maxLengthAttr = ' maxlength="150" ';
                }
                var modelId = _model.modelId;
                var num = modelId.substring(modelId.lastIndexOf('-') + 1);

                //显示正确答案
                var answer = that.getCorrectAnswer();
                var correctAnswer = '';
                if (answer.length > 0) {
                    correctAnswer = answer[0];
                }
                var showNormal = !option.showCorrectAnswer && !option.hideAnswerArea && !option.showStatisAnswer ? '' : 'nqti-hide-dom';

                var type = _model.keyboard;
                var normalHtml = '';
                if (DigitalKeyboard.able() && type === 'number') {
                    digitalInputId = _utils.Rd.getRandom();
                    normalHtml = _utils.template(HTML.DIGITAL, {hide: showNormal, digitalId: digitalInputId});
                } else {

                    var cls = '';
                    if (type === 'number') {
                        cls = 'input-number';
                    }
                    var step = 'any';
                    normalHtml = _utils.template(HTML.Normal, {step: step, cls: cls, hide: showNormal, type: type, maxLengthAttr: maxLengthAttr});
                }

                var result = _utils.template(HTML.CONTENT, {
                    num: num,
                    indexHide: option.showSubSequence && option.showCorrectAnswer ? '' : 'nqti-hide-dom',
                    correctAnswerHide: option.showCorrectAnswer ? '' : 'nqti-hide-dom',
                    checkAnswerHide: option.showCheckedAnswer ? '' : 'nqti-hide-dom',
                    statisAnswerHide: option.showStatisAnswer ? '' : 'nqti-hide-dom',
                    otherAnswer: normalHtml,
                    correctAnswer: correctAnswer,
                    hw: ''
                });
                return result;
            };

            modelItem.hwEnable = function () {
                var option = this.getOption();
                if (option.hwEnable) {
                    if ((option.showAnswerArea || option.showAnswer) && !option.showLock && !option.showCheckedAnswer && !option.showStatisAnswer && !option.showCorrectAnswer) {
                        return true;
                    }
                }
                return false;
            };

            modelItem.updateHwEnable = function ($view) {
                var $hw = $view.find('._qp-base-fill');
                if (this.hwEnable()) {
                    $hw.addClass('nqti-apphw');
                } else {
                    $hw.removeClass('nqti-apphw');
                }
            }

            modelItem.render = function ($view, option) {
                var that = this;
                //填空点击回调
                $view.find('._qp-base-fill').bind('qpTap', function () {
                    var correctAnswer = that.getCorrectAnswer();
                    that.triggerOptionClick(0, correctAnswer[0]);
                });

                that.__digitalReset = false;
                //获取实际输入的文本框
                var $input = $view.find('._qp-text-input._qp-text-normal');
                if ($input.length <= 0) {
                    return;
                }
                var $hwContainer = $view.find('.nqti-txt-hw-btn-container');
                //是否数字键盘
                var isDigital = $input.hasClass('qp-digital-container');

                if ($input.attr('type') !== 'number') {
                    $input.qtiAutogrow({
                        maxWidth: '._qti-player',
                        shadow: 'nqti-base-fill-cell',
                        vertical: false,
                        horizontal: true,
                        postGrowCallback: function (ele) {
                            //解决pad上无法触发父节点重绘的问题
                            ele.closest('._qp-model').css('-webkit-box-shadow', '0 0 1px rgba(0, 0, 0, 0)');
                            setTimeout(function () {
                                ele.closest('._qp-model').css('-webkit-box-shadow', '');
                            }, 50);
                            //实时更新手写容器宽高
                            $hwContainer.width(ele.outerWidth());
                            $hwContainer.height(ele.outerHeight());
                        }
                        //, debugx: 00
                        //, debugy: 100
                    });
                }
                if (isDigital) {
                    var inputHidden = $view.find('._qp-text-hidden');
                    $input.on('resize', function () {
                        $hwContainer.width($input.outerWidth());
                        $hwContainer.height(inputHidden.outerHeight());
                    })
                }

                if (option.showAnswerArea) {
                    if (_model.width) {
                        var width = _model.width * 18;
                        width = width < 60 ? 60 : width;
                        $input.css('width', width + 'px');
                    }
                }
                if (isDigital) {
                    //注册数字键盘
                    DigitalKeyboard.register($input.get(0), function () {
                        $hwContainer.width($input.outerWidth());
                        //重置不能变更原作答内容
                        if (that.__digitalReset) {
                            that.__digitalReset = false;
                            return;
                        }
                        //实时更新回调答案
                        var newValue = DigitalKeyboard.getText4Dom($input.get(0));
                        var answer = [];
                        answer.push(newValue.toString());
                        that.setAnswer(answer);
                        //解决pad上无法触发父节点重绘的问题
                        $input.closest('._qp-model').css('-webkit-box-shadow', '0 0 1px rgba(0, 0, 0, 0)');
                        setTimeout(function () {
                            $input.closest('._qp-model').css('-webkit-box-shadow', '');
                        }, 50);
                    });
                }
            };
            //创建事件处理方法
            modelItem.eventHandle = function ($view, option) {
                var that = this;
                var _$input = $view.find('._qp-text-input._qp-text-normal');
                var isDigital = _$input.hasClass('qp-digital-container');

                if (isDigital) {
                    return;
                }
                var _timer = null;
                var _lastValue = '';
                //保存当前答案
                var saveAnswer = function (newValue) {
                    var answer = [];
                    answer.push(newValue);
                    that.setAnswer(answer);
                };


                var interval = function () {
                    //更新答案
                    var newValue = _$input.val().trim();
                    if (newValue !== _lastValue) {
                        //输入内容有变化
                        _lastValue = newValue;
                        saveAnswer(newValue);
                    }
                }

                //获取焦点时定时检测输入输入框变化
                _$input.bind('focus', function () {
                    _timer = setInterval(interval, 500);
                });

                //输入结束后保存答案
                _$input.bind('blur', function () {
                    //清空定时器
                    clearInterval(_timer);
                    _timer = null;
                    //保存作答
                    var newValue = _$input.val().trim();

                    //兼容ie8
                    if (_$input.attr('data-type') === 'number' && _utils.Broswer.IEVersion() === 8) {
                        if (newValue === '-' || newValue === '.') {
                            newValue = '';
                        }
                    }
                    _$input.val(newValue);
                    _lastValue = newValue;
                    saveAnswer(newValue);
                });

                //ie下，通过规则去限制输入内容
                if (_utils.Broswer.isIE() && _$input.attr('data-type') === 'number') {
                    _$input.keydown(function (e) {
                        return _utils.Dom.inputNumberKeydown(_$input, e);
                    });
                }
            };

            modelItem.renderReset = function ($view) {
                var $input = $view.find('._qp-text-input._qp-text-normal');
                $input.removeClass('nqti-error');
                $input.removeClass('nqti-correct');
                var isDigital = $input.hasClass('qp-digital-container');
                if (isDigital) {
                    this.__digitalReset = true;
                    DigitalKeyboard.setText4DOM('', $input.get(0));
                } else {
                    $input.val('');
                    $input.trigger('input');
                }
                $view.find('._qp-text-showcorrectanswer').addClass('nqti-hide-dom');
                $view.find('._qp-text-showcorrectanswer-num').addClass('nqti-hide-dom');
                $view.find('._qp-text-showstatisanswer').addClass('nqti-hide-dom');
                $view.find('._qp-text-normal').removeClass('nqti-hide-dom');
                var $checkedAnswer = $view.find('._qp-text-showcheckedanswer');
                $checkedAnswer.addClass('nqti-hide-dom');
                $checkedAnswer.removeClass('nqti-error');
                $checkedAnswer.removeClass('nqti-correct');
                $checkedAnswer.addClass('fill-cell-min-width');

                this.updateHwEnable($view);
            };

            modelItem.renderAnswer = function ($view) {
                //获取实际输入的文本框
                var $input = $view.find('._qp-text-input._qp-text-normal');
                //是否数字键盘
                var isDigital = $input.hasClass('qp-digital-container');
                var answer = this.getAnswer();
                if (answer.length > 0) {
                    if (isDigital) {
                        DigitalKeyboard.setText4DOM(answer[0], $input.get(0));
                    } else {
                        $input.val(answer[0]);
                        $input.trigger('input');
                    }
                }
                this.updateHwEnable($view);
            };

            modelItem.renderCheckedAnswer = function ($view) {
                var that = this;
                //获取实际输入的文本框
                var $answer = $view.find('._qp-text-showcheckedanswer');
                $answer.removeClass('nqti-hide-dom');
                $view.find('._qp-text-normal').addClass('nqti-hide-dom');

                var answer = this.getAnswer();
                var correctAnswer = this.getCorrectAnswer();
                answer = answer.length > 0 ? answer[0] : '';
                $answer.html(answer !== '' ? answer : '&nbsp;');

                var checkedClass = this.checkTextAnswer(correctAnswer[0], answer) ? 'nqti-correct' : 'nqti-error';
                $answer.addClass(checkedClass);
                //渲染公式
                if (typeof  MathJax != typeof undefined) {
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, $view[0]]);
                }

                this.__resizeCheckWidth($view);
                $answer.resize(function () {
                    that.__resizeCheckWidth($view);
                });
                this.updateHwEnable($view);
            };

            modelItem.__resizeCheckWidth = function ($view) {
                var inputWidth = $view.find('._qp-text-hidden')[0].clientWidth;
                var $answer = $view.find('._qp-text-showcheckedanswer');
                if ($answer.width() < (inputWidth + 5)) {
                    $answer.addClass('fill-cell-min-width');
                } else {
                    $answer.removeClass('fill-cell-min-width');
                }
            };

            modelItem.__unbindResize = function ($view) {
                var $answer = $view.find('._qp-text-showcheckedanswer');
                $answer.off('resize');
            };

            modelItem.renderStatisAnswer = function ($view) {
                $view.find('._qp-text-showstatisanswer').removeClass('nqti-hide-dom');
                $view.find('._qp-text-normal').addClass('nqti-hide-dom');
                this.updateHwEnable($view);
            };

            modelItem.renderCorrectAnswer = function ($view) {
                $view.find('._qp-text-showcorrectanswer').removeClass('nqti-hide-dom');
                if (this.getOption().showSubSequence) {
                    $view.find('._qp-text-showcorrectanswer-num').removeClass('nqti-hide-dom');
                }
                $view.find('._qp-text-normal').addClass('nqti-hide-dom');
                this.updateHwEnable($view);
            };

            modelItem.renderLock = function ($view) {
                var $input = $view.find('._qp-text-input._qp-text-normal');
                //是否数字键盘
                var isDigital = $input.hasClass('qp-digital-container');

                if (this.isLock()) {
                    if (isDigital) {
                        DigitalKeyboard.setDisabled4DOM($input.get(0), true);
                    } else {
                        $input.attr('disabled', 'disabled');
                    }
                } else {
                    if (isDigital) {
                        DigitalKeyboard.setDisabled4DOM($input.get(0), false);
                    } else {
                        $input.removeAttr('disabled');
                    }
                }
                this.updateHwEnable($view);
            };


            modelItem.destroy = function () {
                if (digitalInputId) {
                    _utils.DigitalKeyboard.unRegister4Id(digitalInputId);
                }
            }
        }
    };
    //注册
    _QtiPlayer.registerModelHandler(_modelHandler);
})(window, jQuery);


// textEntryMultipleInteraction
(function (window, $) {
    var _QtiPlayer = window.QtiPlayer;
    var _utils = _QtiPlayer.getUtils();
    var DigitalKeyboard = _utils.DigitalKeyboard;

    var HTML = {
        CONTENT: '',
        DIGITAL: '<span data-index="${index}" class="_qp-text-input nqti-base-fill-cell span-to-div qp-digital-container  _qp-text-normal ${hide}" id="${digitalId}"></span>',
        Normal: '<input Keyboard-Offset-Y="65" data-index="${index}" step="${step}" class="nqti-base-fill-cell  ${cls} _qp-text-input  _qp-text-normal ${hide} "  data-type="${type}" ${maxLengthAttr} type="${type}">',
        CONTAINER: ''
    };


    var p = [];
    //correctAnswer
    p.push('<span data-index="${index}" class="nqti-base-fill-cell nqti-correct _qp-text-input _qp-text-showcorrectanswer ${correctAnswerHide}">');
    p.push('    <span class="nqti-base-fill-index _qp-text-showcorrectanswer-num ${indexHide}">${num}</span>${correctAnswer}');
    p.push('</span>');
    //checkAnswer
    p.push('<span data-index="${index}" class="nqti-base-fill-cell  _qp-text-input _qp-text-showcheckedanswer fill-cell-min-width ${checkAnswerHide}"></span>');
    //statisAnswer
    p.push('<span data-index="${index}" class="nqti-base-fill-cell _qp-text-input _qp-text-showstatisanswer ${statisAnswerHide}">');
    p.push('    <span class="nqti-base-fill-index">${num}</span>');
    p.push('</span>');
    p.push('<span class="nqti-txt-hw-container">');
    p.push('    ${otherAnswer}');
    p.push('    <span class="nqti-txt-hw-btn-container" data-index="${index}">');
    p.push('        <span class="nqti-txt-hw-btn nqti-txt-hw-btn-left nqti-btn-hw"></span>');
    p.push('        <span class="nqti-txt-hw-btn nqti-txt-hw-btn-right nqti-btn-clear"></span>');
    p.push('    </span>');
    p.push('    <span class="nqti-txt-hw-visible-container" data-index="${index}">');
    p.push('        <span class="_qp_txt_split_pre"></span><span class="_qp_txt_split_suffix"></span>');
    p.push('    </span>');
    p.push('</span>');

    HTML.CONTENT = p.join('');

    var p = [];
    //correctAnswer
    p.push('<div class="nqti-base-fill _qp-base-fill ${hw}">');
    p.push('    ${content}');
    p.push('    <input style="position: absolute;left: -10000px;top: -10000px;" class="nqti-base-fill-cell _qp-text-hidden "  type="text">');
    p.push('</div>');
    HTML.CONTAINER = p.join('');
    //创建
    var _modelHandler = {
        _name: 'textEntryMultipleInteraction',
        //获取model名称
        getName: function () {
            return this._name;
        },
        create: function (modelItem) {

            var digitalInputId = [];

            var _model = modelItem.getModel();
            _model.textEntry = [];
            var _initAnswer = [];
            var _textEntryRegex = /<textEntry[\s\S]*?\/>/g;
            var keyboardRegex = /keyboard="([\s\S]*?)"/;
            var widthRegex = /width="(\d+)"/;
            var textEntrys = _model.prompt.match(_textEntryRegex);
            var expectedLengthRegex = /expectedLength="(\d+)"/;
            var expectedLength;
            var keyboard;
            var width;
            for (var i = 0; i < textEntrys.length; i++) {
                expectedLength = _utils.getIntValue(textEntrys[i], expectedLengthRegex);
                keyboard = _utils.getValue(textEntrys[i], keyboardRegex);
                width = _utils.getIntValue(textEntrys[i], widthRegex);
                if (!keyboard) {
                    keyboard = 'text';
                }
                _model.textEntry.push({
                    expectedLength: expectedLength,
                    keyboard: keyboard,
                    width: width
                });
                _initAnswer.push('');
            }


            var saveAnswer = function (that, index, newValue) {
                var answer = that.getAnswer();
                if (answer.length === 0) {
                    answer = _initAnswer;
                }
                answer[index] = newValue;
                that.setAnswer(answer);
            };

            //返回题目类型名称
            modelItem.getName = function () {
                return _utils.getLangText('blank_filling', this.getOption());
            };

            modelItem.createTitleHtml = function (option) {
                return _utils.getLangText('text_title', option);
            };
            modelItem.createAnswerHtml = function (option) {
                var that = this;
                var textEntry = _model.textEntry;
                var prompt = _model.prompt;
                var index = 0;
                prompt = prompt.replace(_textEntryRegex, function (m) {
                    var num = index + 1;
                    var object = textEntry[index];
                    var maxLengthAttr = '';
                    if (object.expectedLength > 0) {
                        maxLengthAttr = ' maxlength="' + object.expectedLength + '" ';
                    } else {
                        maxLengthAttr = ' maxlength="150" ';
                    }
                    //显示填空区域

                    //显示正确答案
                    var answer = that.getCorrectAnswer();
                    var correctAnswer = '';
                    if (answer.length > 0) {
                        correctAnswer = answer[index];
                    }

                    //其他模式显示
                    var showNormal = !option.showCorrectAnswer && !option.hideAnswerArea && !option.showStatisAnswer ? '' : 'nqti-hide-dom';

                    var type = object.keyboard;
                    var normalHtml = '';
                    if (DigitalKeyboard.able() && type === 'number') {
                        var did = _utils.Rd.getRandom();
                        digitalInputId.push(did);
                        normalHtml = _utils.template(HTML.DIGITAL, {hide: showNormal, digitalId: _utils.Rd.getRandom(), index: index});
                    } else {

                        var cls = '';
                        if (type === 'number') {
                            cls = 'input-number';
                        }

                        var step = 'any';
                        normalHtml = _utils.template(HTML.Normal, {step: step, cls: cls, hide: showNormal, type: type, maxLengthAttr: maxLengthAttr, index: index});
                    }

                    var result = _utils.template(HTML.CONTENT, {
                        index: index,
                        num: num,
                        indexHide: option.showSubSequence && option.showCorrectAnswer ? '' : 'nqti-hide-dom',
                        correctAnswerHide: option.showCorrectAnswer ? '' : 'nqti-hide-dom',
                        checkAnswerHide: option.showCheckedAnswer ? '' : 'nqti-hide-dom',
                        statisAnswerHide: option.showStatisAnswer ? '' : 'nqti-hide-dom',
                        otherAnswer: normalHtml,
                        correctAnswer: correctAnswer
                    });

                    index++;
                    return result;
                });
                var result = _utils.template(HTML.CONTAINER, {content: prompt, hw: ''});
                return result;
            };

            modelItem.hwEnable = function () {
                var option = this.getOption();
                if (option.hwEnable) {
                    if ((option.showAnswerArea || option.showAnswer) && !option.showLock && !option.showCheckedAnswer && !option.showStatisAnswer && !option.showCorrectAnswer) {
                        return true;
                    }
                }
                return false;
            };

            modelItem.updateHwEnable = function ($view) {
                var $hw = $view.find('._qp-base-fill');
                if (this.hwEnable()) {
                    $hw.addClass('nqti-apphw');
                } else {
                    $hw.removeClass('nqti-apphw');
                }
            }

            modelItem.render = function ($view, option) {
                var that = this;
                that.__digitalResetCount = 0;

                var $input = $view.find('._qp-text-input._qp-text-normal');
                $input.each(function () {
                    var $this = $(this);
                    var index = $this.data('index');
                    if (option.showAnswerArea) {
                        if (_model.textEntry[index].width) {
                            var width = _model.textEntry[index].width * 18;
                            width = width < 60 ? 60 : width;
                            $this.css('width', width + 'px');
                        }
                    }


                    if ($this.hasClass('qp-digital-container')) {

                        var $hwContainer = $view.find('[data-index="' + index + '"].nqti-txt-hw-btn-container');
                        //初始化手写键盘
                        DigitalKeyboard.register($this.get(0), function () {
                            $hwContainer.width($this.outerWidth());
                            if (that.__digitalResetCount > 0) {
                                that.__digitalResetCount--;
                                return;
                            }
                            //实时更新回调答案
                            var newValue = DigitalKeyboard.getText4Dom($this.get(0));
                            var index = $this.data('index');
                            saveAnswer(that, index, newValue.toString());

                        });

                    }
                });

                //填空点击回调
                $view.find('._qp-base-fill').bind('qpTap', function (e) {
                    var $target = $(e.target).closest('._qp-text-input');
                    if ($target && $target.length > 0) {
                        var index = $target.data('index');
                        var correctAnswer = that.getCorrectAnswer();
                        that.triggerOptionClick(index, correctAnswer[index]);
                    }
                });
            };

            modelItem.eventHandle = function ($view, option) {
                var that = this;
                var _$input = $view.find('._qp-text-input._qp-text-normal');
                var _state = {};
                //初始化状态数据
                _$input.each(function () {
                    var $this = $(this);
                    var index = $this.data('index');
                    _state[index] = {
                        timer: null,
                        lastValue: ''
                    };
                    var $hwContainer = $view.find('[data-index="' + index + '"].nqti-txt-hw-btn-container');
                    if ($this.hasClass('qp-digital-container')) {
                        var inputHidden = $view.find('._qp-text-hidden');
                        $this.on('resize', function () {
                            $hwContainer.width($this.outerWidth());
                            $hwContainer.height(inputHidden.outerHeight());
                        })
                    } else if ($this.attr('type') == 'text') {
                        $this.qtiAutogrow({
                            maxWidth: '._qti-player',
                            shadow: 'nqti-base-fill-cell',
                            vertical: false,
                            horizontal: true,
                            postGrowCallback: function (ele) {
                                //解决pad上无法触发父节点重绘的问题
                                ele.closest('._qp-model').css('-webkit-box-shadow', '0 0 1px rgba(0, 0, 0, 0)');
                                setTimeout(function () {
                                    ele.closest('._qp-model').css('-webkit-box-shadow', '');
                                }, 50);
                                var $hwContainer = ele.parent().find('.nqti-txt-hw-btn-container')
                                $hwContainer.width(ele.outerWidth());
                                $hwContainer.height(ele.outerHeight());
                            }
                        });
                    }
                });

                _$input.each(function () {
                    var $this = $(this);
                    if (!$this.hasClass('qp-digital-container')) {
                        //获取焦点时定时检测输入输入框变化
                        $this.bind('focus', function () {
                            //定时检测输入输入框变化
                            var $this = $(this);
                            var index = $this.data('index');
                            var _thisState = _state[index];
                            _thisState.timer = setInterval(function () {
                                var newValue = $this.val().trim();
                                if (newValue !== _thisState.lastValue) {
                                    //输入内容有变化
                                    _thisState.lastValue = newValue;
                                    saveAnswer(that, index, newValue);
                                }
                            }, 500);
                        });
                        //输入结束后保存答案
                        $this.bind('blur', function () {
                            var $this = $(this);
                            var index = $this.data('index');
                            //清除定时器
                            var _thisState = _state[index];
                            clearInterval(_thisState.timer);
                            _thisState.timer = null;
                            //保存作答
                            var newValue = $this.val().trim();
                            if ($this.attr('data-type') === 'number' && _utils.Broswer.IEVersion() === 8) {
                                if (newValue === '-' || newValue === '.') {
                                    newValue = '';
                                }
                            }
                            $this.val(newValue);
                            _thisState.lastValue = newValue;
                            saveAnswer(that, index, newValue);
                        });

                        if (_utils.Broswer.isIE() && $this.attr('data-type') === 'number') {

                            $this.keydown(function (e) {
                                return _utils.Dom.inputNumberKeydown($this, e);
                            });
                        }
                    }
                });
            };

            modelItem.renderReset = function ($view) {
                var that = this;
                var $input = $view.find('._qp-text-input._qp-text-normal');
                $input.removeClass('nqti-error');
                $input.removeClass('nqti-correct');
                that.__digitalResetCount = 0;
                $input.each(function () {
                    var $this = $(this);
                    var isDigital = $this.hasClass('qp-digital-container');
                    if (isDigital) {
                        that.__digitalResetCount++;
                        DigitalKeyboard.setText4DOM('', $this.get(0));
                    } else {
                        $this.val('');
                        $this.trigger('input');
                    }
                });
                $view.find('._qp-text-showcorrectanswer').addClass('nqti-hide-dom');
                $view.find('._qp-text-showcorrectanswer-num').addClass('nqti-hide-dom');
                $view.find('._qp-text-showstatisanswer').addClass('nqti-hide-dom');
                $view.find('._qp-text-normal').removeClass('nqti-hide-dom');
                var $checkedAnswer = $view.find('._qp-text-showcheckedanswer');
                $checkedAnswer.addClass('nqti-hide-dom');
                $checkedAnswer.removeClass('nqti-error');
                $checkedAnswer.removeClass('nqti-correct');
                $checkedAnswer.addClass('fill-cell-min-width');
                this.updateHwEnable($view);
            };

            modelItem.renderAnswer = function ($view) {
                //获取实际输入的文本框
                var $input = $view.find('._qp-text-input._qp-text-normal');
                //是否数字键盘
                var answer = this.getAnswer();
                if (answer.length > 0 && answer.length === $input.length) {
                    $input.each(function () {
                        var $this = $(this);
                        var index = $this.data('index');

                        if ($this.hasClass('qp-digital-container')) {
                            DigitalKeyboard.setText4DOM(answer[index], $this.get(0));
                        } else {
                            $this.val(answer[index]);
                            $this.trigger('input');
                        }
                    });
                }
                this.updateHwEnable($view);
            };

            modelItem.renderCheckedAnswer = function ($view) {
                var that = this;
                var $answer = $view.find('._qp-text-showcheckedanswer');
                $answer.removeClass('nqti-hide-dom');
                $view.find('._qp-text-normal').addClass('nqti-hide-dom');

                var answer = this.getAnswer();
                var correctAnswer = this.getCorrectAnswer();
                //if (answer.length > 0 && answer.length === $answer.length) {
                $answer.each(function () {
                    var $this = $(this);
                    var index = $this.data('index');
                    var thisAnswer = answer[index] && answer[index] !== '' ? answer[index] : '';
                    $this.html(thisAnswer !== '' ? thisAnswer : '&nbsp;');
                    //答案反馈样式
                    var checkedClass = that.checkTextAnswer(correctAnswer[index], thisAnswer) ? 'nqti-correct' : 'nqti-error';
                    $this.addClass(checkedClass);
                    //渲染公式
                    if (typeof  MathJax != typeof undefined) {
                        MathJax.Hub.Queue(['Typeset', MathJax.Hub, $this[0]]);
                    }
                });
                //}

                this.__resizeCheckWidth($view);
                $answer.resize(function () {
                    that.__resizeCheckWidth($view);
                });
                this.updateHwEnable($view);
            };

            modelItem.__resizeCheckWidth = function ($view) {
                var inputWidth = $view.find('._qp-text-hidden')[0].clientWidth;
                var $answer = $view.find('._qp-text-showcheckedanswer');
                $answer.each(function () {
                    var $this = $(this);
                    if ($this.width() < inputWidth + 5) {
                        $this.addClass('fill-cell-min-width');
                    } else {
                        $this.removeClass('fill-cell-min-width');
                    }
                });
            };

            modelItem.__unbindResize = function ($view) {
                var $answer = $view.find('._qp-text-showcheckedanswer');
                $answer.off('resize');
            };


            modelItem.renderStatisAnswer = function ($view) {
                $view.find('._qp-text-showstatisanswer').removeClass('nqti-hide-dom');
                $view.find('._qp-text-normal').addClass('nqti-hide-dom');
                this.updateHwEnable($view);
            };

            modelItem.renderCorrectAnswer = function ($view) {
                $view.find('._qp-text-showcorrectanswer').removeClass('nqti-hide-dom');
                if (this.getOption().showSubSequence) {
                    $view.find('._qp-text-showcorrectanswer-num').removeClass('nqti-hide-dom');
                }
                $view.find('._qp-text-normal').addClass('nqti-hide-dom');
                //var correctAnswer = this.getCorrectAnswer();
                //$view.find('._qp-text-showcorrectanswer').each(function () {
                //    var $this = $(this);
                //    var index = $this.data('index');
                //    //答案反馈样式
                //    $this.addClass('nqti-correct');
                //});
                this.updateHwEnable($view);
            };

            modelItem.renderLock = function ($view) {
                var $input = $view.find('._qp-text-input._qp-text-normal');
                //是否数字键盘
                if (this.isLock()) {
                    $input.each(function () {
                        var $this = $(this);
                        var isDigital = $this.hasClass('qp-digital-container');
                        if (isDigital) {
                            DigitalKeyboard.setDisabled4DOM($this.get(0), true);
                        } else {
                            $this.attr('disabled', 'disabled');
                        }
                    })

                } else {
                    $input.each(function () {
                        var $this = $(this);
                        var isDigital = $this.hasClass('qp-digital-container');
                        if (isDigital) {
                            DigitalKeyboard.setDisabled4DOM($this.get(0), false);
                        } else {
                            $this.removeAttr('disabled');
                        }
                    });
                }
                this.updateHwEnable($view);
            };

            modelItem.destroy = function () {
                if (digitalInputId.length > 0) {
                    for (var i = 0; i < digitalInputId.length; i++) {
                        var id = digitalInputId[i];
                        _utils.DigitalKeyboard.unRegister4Id(id);
                    }
                }
            }
        }
    };

    //注册
    _QtiPlayer.registerModelHandler(_modelHandler);
})(window, jQuery);


 })(window,document,jQuery)