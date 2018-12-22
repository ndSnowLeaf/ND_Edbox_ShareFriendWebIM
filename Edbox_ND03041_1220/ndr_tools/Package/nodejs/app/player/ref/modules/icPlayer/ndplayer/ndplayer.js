/**ndplayer version :11.7.3**/
(function(window,$){ var __applicationContext={exports:{}};(function(module){ 'use strict';
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback, thisArg) {

        var T, k;

        if (this === null) {
            throw new TypeError(' this is null or not defined');
        }

        // 1. Let O be the result of calling toObject() passing the
        // |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get() internal
        // method of O with the argument "length".
        // 3. Let len be toUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If isCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let
        // T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //    This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty
            //    internal method of O with argument Pk.
            //    This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal
                // method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as
                // the this value and argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}

if (!Array.prototype.each) {

    Array.prototype.each = function (callback, thisArg) {

        var T, k;

        if (this === null) {
            throw new TypeError(' this is null or not defined');
        }

        // 1. Let O be the result of calling toObject() passing the
        // |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get() internal
        // method of O with the argument "length".
        // 3. Let len be toUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If isCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let
        // T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //    This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty
            //    internal method of O with argument Pk.
            //    This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal
                // method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as
                // the this value and argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun/*, thisArg*/) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}
//定义容器管理
var definitions = {},
    caches = {},
    automatics = [];

var defineClass = function (config, className) {
    var classUtils = require('core.utils.class');
    return classUtils.create(config, className);
};

var createByDef = function (key) {
    var def = definitions[key];
    if (def) {
        delete definitions[key];
        var module = {
            'exports': {}
        };
        def.call(window, module.exports, module, require, $);
        var obj = (module.type === 'class') ? defineClass(module.exports, key) : module.exports;
        caches[key] = obj;
        return obj;
    } else {
        console.debug('no definition:' + key);
    }
};

var require = function (key) {
    if (key) {
        key = key.toLowerCase();
        var obj = caches[key];
        //已经执行过从缓存里取
        if (obj) {
            return obj;
        } else {
            return createByDef(key);
        }
    }
};

module.exports = {
    'define': function (key, fn, type) {
        if (key in definitions) {
            throw new Error("player 11.7.3: " + 'duplicate definition:' + key);
        }
        definitions[key] = fn;
        if (type === "automatic") {
            automatics.push(key);
        }
    },
    'require': require,
    'initialize': function () {
        automatics.forEach(function (key) {
            require(key).run();
        });
    }
}; })(__applicationContext);__applicationContext=__applicationContext.exports;
__applicationContext.define('core.bridge.courseplayer', function (exports,module,require,$) {
var ErrorData = {
    PLAYERERROR: {
        eventName: '',
        msg: 'There isn\'t a method named invokeMthod inside pptShell'
    }
}
module.exports = {
    invokeMethod: function (eventName, eventData) {
        if (typeof (CoursePlayer) !== 'undefined' && CoursePlayer.invokeMethodPPT) {
            return CoursePlayer.invokeMethodPPT(eventName, eventData);
        } else {
            ErrorData.PLAYERERROR.eventName = eventName;
            return ErrorData;
        }
    },
    drawMethod: function (eventName, eventData) {
        if (typeof (CoursePlayer) !== 'undefined' && CoursePlayer.drawMethod)
            return result = JSON.parse(CoursePlayer.drawMethod(eventName, eventData));
        else {
            ErrorData.PLAYERERROR.eventName = eventName;
            return ErrorData;
        }
    },
    close: function () {
        if (typeof (CoursePlayer) !== 'undefined' && CoursePlayer.close) CoursePlayer.close();
    }
}

}, '');
__applicationContext.define('core.bridge.pptshell', function (exports,module,require,$) {
'use strict';
var coursePlayer = require('core.bridge.courseplayer');
var getDrawSetting = function (fn) {
    var _color = '#000000',
        _width = 1;
    if (typeof (fn) === 'function') {
        var _setting = fn();
        _color = _setting.color || _color;
        _width = _setting.width || _width;
    }
    return {
        'color': _color,
        'width': _width
    };
};
module.exports = {
    "paint": {
        /**
         * 获取paint颜色与大小
         * @return {Object} {"color" :"#FF0000","width" :2}
         */
        "getPaintSetting": function () {
            var param = {};
            param.request_query = "draw_setting";
            var setting = {};
            var result = coursePlayer.drawMethod("drawsetting", JSON.stringify({}));
            //do api
            setting.color = result.color || "#ff0000";
            setting.width = result.width || 2;
            return setting;
        },

        /**
         * 画线
         * @param  {Object} start     起始点，格式如下：{"x":12,"y":34.5}
         * @param  {Object} end       结束点，格式如下：{"x":12,"y":34.5}
         * @param  {String} color     16进制的颜色值 如：#ff0000
         * @param  {number} lineWidth 笔尖大小的int值，如：20
         * @return {[void]}           [description]
         */
        "drawLine": function (start, end, color, lineWidth) {
            var _setting = getDrawSetting();
            var _start = start || {
                    "x": 0,
                    "y": 0
                },
                _end = end || {
                    "x": 0,
                    "y": 0
                };

            var param = {};
            param.request_shape = 'line';
            param.shape = {
                "color": color || _setting.color,
                "width": lineWidth || _setting.width,
                "start": _start,
                "end": _end
            };
            //do
            coursePlayer.drawMethod("drawLine", JSON.stringify(param));
        },
        /**
         * 画圆
         * @param  {Object} centre    圆心
         * @param  {[type]} radius    半径
         * @param  {[type]} sAngle    开始角（弧度）
         * @param  {[type]} eAngle    结束角（弧度）
         * @param  {[type]} color     颜色 不传，会用默认的
         * @param  {[type]} lineWidth 大小 不传，会用默认的
         * @param  {Boolean} isFill 是否启用填充
         * @return {[type]}           [description]
         */
        "drawCircle": function (centre, radius, sAngle, eAngle, counterclockwise, color, lineWidth, isFill) {
            var _setting = getDrawSetting();
            var _start, _end, _start_angle, _sweep_angle;

            _start = {
                "x": centre.x - radius,
                "y": centre.y - radius
            };
            _end = {
                "x": centre.x + radius,
                "y": centre.y + radius
            };
            _start_angle = sAngle;
            _sweep_angle = counterclockwise ? -eAngle : eAngle;
            var param = {};
            param.request_shape = 'arc';
            param.shape = {
                "color": color || _setting.color,
                "width": lineWidth || _setting.width,
                "start": _start,
                "end": _end,
                "isFill": isFill,
                "start_angle": _start_angle,
                "sweep_angle": _sweep_angle
            };
            coursePlayer.drawMethod("drawCircle", JSON.stringify(param));
        }
    },
    "tool": {
        "close": function () {
            coursePlayer.close();
        }
    }
};

}, '');
__applicationContext.define('core.common.createmodel', function (exports,module,require,$) {
'use strict';
var urlUtil = require('core.utils.url');
var modelCreator = require('core.model.modelCreator');
var jsonParser = require('core.model.parser.simpleJsonParser');

var propTypeMapping = {
    'file': 'url',
    'ppt': 'url',
    'courseware': 'url',
    'coursewareobject': 'url',
    'question': 'url',
    'flash': 'url',
    'audio': 'url',
    'image': 'url',
    'video': 'url',
    'jsonfile': 'load',
    'json': 'json',
    'html': 'html',
    'ref-module': 'default',
    'string': 'default',
    'list': 'list',
    'boolean': 'boolean'
};

var propParser = {
    'url': function (item, baseUrl, refPathParser) {
        return urlUtil.resolve(baseUrl, item.value);
    },
    'load': function (item, baseUrl, refPathParser) {
        if (item.value) {
            var url = propParser.url(item, baseUrl, refPathParser);
            return modelCreator.create({
                url: url,
                parser: jsonParser,
                textParsers: refPathParser,
                isCache: false
            });
        }
    },
    'json': function (item, baseUrl, refPathParser) {
        return ($.isPlainObject(item.value)) ? item.value : jsonParser.parse(item.text);
    },
    'html': function (item, baseUrl, refPathParser) {
        return item.text || item.value;
    },
    'boolean': function (item, baseUrl, refPathParser) {
        return item.value.toLowerCase() === 'true';
    },
    'list': function (item, baseUrl, refPathParser) {
        var value = [];
        item.value.forEach(function (itemProps) {
            var itemValue = {};
            itemProps.forEach(function (itemPropValue) {
                var propValue = createProperty(itemPropValue, baseUrl, refPathParser);
                itemValue[propValue.name] = propValue.value;
            });
            value.push(itemValue);
        });
        return value;
    },
    'default': function (item, baseUrl, refPathParser) {
        return item.value;
    }
};

var createProperty = function (item, baseUrl, refPathParser) {
    var parser = propTypeMapping[$.trim(item.type).toLowerCase()] || 'default';
    var value = propParser[parser](item, baseUrl, refPathParser) || '';
    value = parser === 'boolean' ? value != '' : value;

    if ($.isFunction(value.promise)) {
        return value.then(function (result) {
            return {
                'name': item.name,
                'value': result.model
            };
        });
    } else {
        return {
            'name': item.name,
            'value': value
        };
    }
};

//根据属性值创建model对象
module.exports = function (properties, baseUrl, refPathParser) {
    var p = [],
        model = {};
    properties.forEach(function (item) {
        p.push(createProperty(item, baseUrl, refPathParser));
    });
    return $.when.apply($, p).then(function () {
        for (var i = 0, len = arguments.length; i < len; i++) {
            var item = arguments[i];
            model[item.name] = item.value;
        }
        return model;
    });
};
}, '');
__applicationContext.define('core.common.defaultwaitdialog', function (exports,module,require,$) {
'use strict';
var defaultWaitDialog = {
    show: function () {
    },
    hide: function () {
    }
};

module.exports = defaultWaitDialog;

}, '');
__applicationContext.define('core.common.i18nloader', function (exports,module,require,$) {
'use strict';
var modelCreator = require('core.model.modelCreator');
var stringUtil = require('core.utils.string');
var parser = require('core.model.parser.simpleJsonParser');
var logger = require('core.utils.log');
var urlTemplate = "${base}resources/locations/${location}/lang.json";
var defaultLang, currentLocation, locationCfg = {};


var _load = function(baseUrl, location, callback) {
    modelCreator.create({
        url: stringUtil.applyTemplate(urlTemplate, {
            base: baseUrl,
            location: location
        }),
        parser: parser
    }).done(function(result) {
        callback(result.model);
    }).fail(function() {
        if (location !== defaultLang) {
            _load(baseUrl, locationCfg[location], callback);
        } else {
            callback({});
            logger.log("load '" + location + "' error");
        }
    });
};
var _loadPlayerI18n = function(callback) {
    modelCreator.create({
        url: icCreatePlayer.ref_path_tool + '/tool.json',
        parser: parser
    }).done(function(result) {
        callback(result.model);
    }).fail(function() {
        callback({});
        logger.log("load '" + icCreatePlayer.ref_path_tool + '/tool.json' + "' error");
    });
};
module.exports = {
    'load': function(baseUrl) {
        var deferred = $.Deferred();
        _load(baseUrl, currentLocation, function(result) {
            deferred.resolve(result);
        });
        return deferred.promise();
    },
    'loadPlayer': function() {
        var deferred = $.Deferred();
        _loadPlayerI18n(function(result) {
            deferred.resolve(result);
        });
        return deferred.promise();
    },
    'setLocation': function(location) {
        location = location || {};
        defaultLang = location.default_lang;
        currentLocation = location.current || defaultLang;
        var currentLang = (currentLocation && currentLocation.split("_")[0]) || defaultLang;
        locationCfg[currentLocation] = currentLang;
        locationCfg[currentLang] = defaultLang;
    }
};
}, '');
__applicationContext.define('core.common.ispointinpath', function (exports,module,require,$) {
'use strict';
var rotate = require('core.utils.transform');
var isPointInPath = "isPointInPath";


//player内正常模式判断是否选中
var normalMode = function (tool, e) {
    var event = $.event.fix(e);
    var _w = tool.element.width(),
        _h = tool.element.height(),
        _pageX = event.pageX === undefined ? event.originalEvent.touches[0].pageX : event.pageX,
        _pageY = event.pageY === undefined ? event.originalEvent.touches[0].pageY : event.pageY;
    var _A = rotate.getRotateDeg(tool.element[0]); //这里取返就是为了算相对位置直接取旋转前的X,Y，
    var finalXY = rotate.getRotateXY(_pageX, _pageY, _A, tool.element[0]);
    var _finalX = finalXY.x,
        _finalY = finalXY.y;
    if (_finalX >= 0 && _finalX <= _w && _finalY >= 0 && _finalY <= _h) {
        return true;
    } else {
        return false;
    }
};

//presenter自身判断是否要选中
var selfMode = function (tool, event) {
    if (tool.mainModule.getPresenter().__interface && typeof (tool.mainModule.getPresenter().__interface.isPointInPath) === 'function') {
        return tool.mainModule.runInterface(isPointInPath, [event]);
    } else {
        return false;
    }
};
module.exports = {
    /**
     判断坐标是否在当前路径
    */
    'resolve': function (tool, event) {
        if (tool === null) return tool;
        var option = tool.toolConfig;
        if (tool.mainModule.getPresenter().__interface && typeof (tool.mainModule.getPresenter().__interface.isPointInPath) === 'function') {
            return selfMode(tool, event);
        } else {
            return normalMode(tool, event);
        }

    },
    /**
     * tool位置处理
     * @param  {[type]} arr   需要处理的队列
     * @param  {[type]} index1 需要更换的位置
     * @param  {[type]} type  放在队列的开始还是末尾
     * @return {[type]}       返回修改后的队列
     */
    'swapItems': function (arr, index1, type) {
        var newArry = [];
        newArry[0] = arr[index1];
        arr.splice(index1, 1);
        if (type === 'first')
            newArry = newArry.concat(arr);
        else
            newArry = arr.concat(newArry);
        return newArry;
    },
    /**
     * 把tool直接换到最后
     * @param  {[type]} toolList [description]
     * @param  {[type]} listType [description]
     * @param  {[type]} index1   [description]
     * @param  {[type]} index2   [description]
     * @return {[type]}          [description]
     */
    'swapTool': function (toolList, listType, tool) {
        for (var i = 0; i < toolList.list[listType].length; i++) {
            if (toolList.list[listType][i].unqiueId === tool.unqiueId) {
                toolList.list[listType] = this.swapItems(toolList.list[listType], i, 'last');
            }
        }
        return toolList;
    },
    'adjust': function (toolList, event, tool, opType) {
        if (!toolList) return;
        var _self = this,
            _finalToolList = toolList,
            _allFlase = true,
            sequence = {
                'top': toolList.list.top,
                'bottom': toolList.list.bottom
            };
        for (var listType in sequence) {
            for (var i = 0; i < sequence[listType].length; i++) {
                var flag;
                if (sequence[listType][i].getElement(true).css('display') === 'none' && opType !== 'FIRETOOL')
                    continue;
                if (typeof (tool) !== 'undefined') {
                    flag = (sequence[listType][i].unqiueId === tool.unqiueId);
                } else {
                    flag = _self.resolve(sequence[listType][i], event);
                }
                if (flag) {
                    _allFlase = false;
                    _finalToolList.list[listType] = this.swapItems(sequence[listType], i, 'first');
                    _finalToolList.active = listType;
                    break;
                }
            }
            if (!_allFlase) break;
        }
        return {
            'allFlase': _allFlase,
            'toolList': _finalToolList
        };
    }
};
}, '');
__applicationContext.define('core.common.paint', function (exports,module,require,$) {
'use strict';
var DrawingBoard = require('core.utils.drawingboard.board');
module.type = 'class';
module.exports = {
    constructor: function($el, option) {
        var defaultOption = {
            control: false,
            fillTolerance: 500,
            webStorage: 'false',
            droppable: true,
            hideBoard: true
        };
        var defaultOption = $.extend({}, defaultOption, option);
        this.board = new DrawingBoard($el, defaultOption);
        this.canvasEl = this.board.canvas;
        this.boardEL = this.board.dom.$canvasWrapper;
        this.boardEL.css("pointer-events", "none");
        if (defaultOption.hideBoard)
            this.hide();

    },
    draw: function(fn) {
        if (typeof(fn) === 'function') {
            fn(this.canvasEl);
            this.board.saveHistory();
            this.show();
        }

    },
    /**
     * 画线
     * @param  {Object} start     起始点，格式如下：{"x":12,"y":34.5}
     * @param  {Object} end       结束点，格式如下：{"x":12,"y":34.5}
     * @param  {String} color     16进制的颜色值 如：#ff0000
     * @param  {number} lineWidth 笔尖大小的int值，如：20
     * @return {[void]}           [description]
     */
    drawLine: function(start, end, color, lineWidth) {
        var _p = $(this.canvasEl).offset();
        if (this.canvasEl.getContext) {
            var ctx = this.canvasEl.getContext("2d");
            ctx.save();
            if (lineWidth)
                ctx.lineWidth = lineWidth;
            if (color)
                ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(start.x - _p.left, start.y - _p.top);
            ctx.lineTo(end.x - _p.left, end.y - _p.top);
            ctx.closePath();
            ctx.stroke();
            this.board.saveHistory();
            this.show();
        }

    },
    /**
     * 画圆       
     * @param  {Object} centre {"x":1,"y":1}   圆心
     * @param  {[type]} radius    半径
     * @param  {[type]} sAngle    开始角（弧度）
     * @param  {[type]} eAngle    结束角（弧度）
     * @param  {[type]} color     颜色
     * @param  {[type]} lineWidth 大小
     * @param  {Boolean} isFill 是否启用填充
     * @return {[type]}           [description]
     */

    drawCircle: function(centre, radius, sAngle, eAngle, counterclockwise, color, lineWidth, isFill) {
        if (this.canvasEl.getContext) {
            var ctx = this.canvasEl.getContext('2d');
            ctx.save();
            if (lineWidth)
                ctx.lineWidth = lineWidth;
            if (color)
                ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.arc(centre.x, centre.y, radius, sAngle, eAngle, false);


            if (color)
                ctx.fillStyle = color;
            if (isFill)
                ctx.fill();
            else
                ctx.stroke();
            ctx.closePath();
            this.board.saveHistory();
            this.show();
        }
    },
    /**
     * 重做
     * @return {[void]} [description]
     */
    redo: function() {
        this.board.goForthInHistory();
    },
    /**
     * 撤消
     * @return {[void]} [description]
     */
    undo: function() {
        this.board.goBackInHistory();
    },
    /**
     * 重置
     * @return {void} [description]
     */
    reset: function() {
        this.board.reset({
            background: true
        });
    },
    /**
     * 获取paint颜色与大小
     * @return {Object} {"color" :"#FF0000","width" :2}
     */
    getPaintSetting: function() {
        return {
            "width": this.board.ctx.lineWidth || 1,
            "color": this.board.color || "#000000"
        };
    },
    /**
     * 设置颜色
     * @param {string} color [颜色值]
     */
    setColor: function(color) {
        this.board.setColor(color);
        this.board.ev.trigger('color:changed', color);
    },
    /**
     * 设置画笔模式
     * @param {string} mode pencil(画笔),eraser（橡皮檫）,filler（填冲）
     */
    setMode: function(mode) {
        this.board.setMode(mode);
        this.board.ev.trigger('mode:changed', mode);
    },
    /**
     * 设置画笔大小
     * @param {int} size 画笔大小
     */
    setSize: function(size) {
        this.board.ctx.lineWidth = size;
        this.board.ev.trigger('size:changed', size);
    },
    /**
     * 显示画板
     * @return {[type]} [description]
     */
    show: function() {
        //this.boardEL.show();
        this.boardEL.css('visibility', '');
    },
    /**
     * 隐藏画板
     * @return {[type]} [description]
     */
    hide: function() {
        this.boardEL.css('visibility', 'hidden');
    }
};
}, 'class');
__applicationContext.define('core.common.playerconfig', function (exports,module,require,$) {
'use strict';
var modelCreator = require('core.model.modelCreator');
var parser = require('core.model.parser.simpleJsonParser');
var jsLibLoader = require('core.loader.jsLibLoaderCreator').create();
var domUtil = require('core.utils.dom');

var loadScript = function (model, refPathParser) {
    //初始化加载的jsLib
    var loadScripts = [];
    model.script = (model.script || []).filter(function (jsLib) {
        //默认设置成自动加载
        if (typeof jsLib.autoLoad == 'undefined') {
            jsLib.autoLoad = true;
        }
        //兼容false和'false'的写法
        if (jsLib.autoLoad.toString().toLowerCase() === 'false') {
            //不自动加载继续保存
            return jsLib;
        } else {
            //自动加载的加载完删除
            loadScripts.push(jsLib);
        }
    });
    return jsLibLoader.load(refPathParser, loadScripts);
};

var loadCombineScript = function (model, refPathParser) {
    var autoDeffer = $.Deferred();
    var notautoDeffer = $.Deferred();
    var script = model.mScript
    icCreatePlayer.jsLibConfig = {}
    if (!$.isEmptyObject(script.autoload)) {
        modelCreator.create({
            url: script.autoload.href,
            textParsers: refPathParser,
            parser: parser
        }).then(function (result) {
            icCreatePlayer.jsLibConfig.auto = result
            autoDeffer.resolve()
        }).fail(function () {
            autoDeffer.reject()
        })
    } else {
        autoDeffer.reject()
    }
    if (!$.isEmptyObject(script.notautoload)) {
        modelCreator.create({
            url: script.notautoload.href,
            textParsers: refPathParser,
            parser: parser
        }).then(function (result) {
            icCreatePlayer.jsLibConfig.notauto = result
            notautoDeffer.resolve()
        }).fail(function () {
            notautoDeffer.reject()
        })
    } else {
        notautoDeffer.reject()
    }
    return $.when.apply($, [autoDeffer.promise(), notautoDeffer.promise()]).then(function () {
        var loadScripts = []
        icCreatePlayer.jsLibConfig.allLib = $.extend(true,{}, icCreatePlayer.jsLibConfig.auto,icCreatePlayer.jsLibConfig.notauto)
        $.each(icCreatePlayer.jsLibConfig.auto.model, function (key, value) {
            loadScripts.push(value)
        })
        return jsLibLoader.load(refPathParser, loadScripts)
    }).fail(function () {
        return $.Deferred().reject(new Error("player 11.7.3: " + 'get auto and notauto package fail'));
    })
};
//缺省定制播放器配置，用于无定制播放器时兼容
var playerConfig = {
    "presenters": {},
    "commons": {},
    "script": [],
    "css": ""
};


module.exports = {
    //获取定制播放器
    'create': function (url, refPathParser) {
        if (url) {
            return modelCreator.create({
                url: url.replace(/\/*$/, "/config.json"),
                ignoreError: true,
                textParsers: refPathParser,
                parser: parser
            }).then(function (result) {
                playerConfig = result.model;
                if (playerConfig.cssText) {
                    domUtil.addStyleContent(playerConfig.cssText);
                }
                //兼容是否合并加载script的package文件
                if (playerConfig.mScript) {
                    return loadCombineScript(playerConfig, refPathParser)
                } else {
                    return loadScript(playerConfig, refPathParser);
                }
            });
        } else {
            return $.Deferred().resolve(playerConfig).promise();
        }
    },
    loadCss: function (cssUrl) {
        //如果定制播放器没有配置缺省样式,使用课件的样式
        var _cssUrl = playerConfig.css || cssUrl;
        //加载完释放内存
        delete playerConfig.css;
        domUtil.addStyle(_cssUrl);
    },
    getCommons: function (commons, createPageFn) {
        for (var key in playerConfig.commons) {
            var pageConfig = playerConfig.commons[key];
            //为定制播放器的通用页设置id，方便状态恢复
            pageConfig.id = pageConfig.id || 'common_' + key;
            pageConfig.moduleGroupType = 'common';
            commons.addItem(key, createPageFn(pageConfig));
        }
        return commons;
    },
    getScripts: function (jsLib) {
        //如果定制播放器配置了脚本库，就使用定制播放器的脚本库版本
        if (playerConfig.mScript) {
            $.each(icCreatePlayer.jsLibConfig.allLib, function (key, commonJsLib) {
                if (jsLib.name == commonJsLib.name) {
                    jsLib.version = commonJsLib.version;
                    jsLib.href = commonJsLib.href;
                }
            });
        } else {
            playerConfig.script.forEach(function (commonJsLib) {
                if (jsLib.name == commonJsLib.name) {
                    jsLib.version = commonJsLib.version;
                    jsLib.href = commonJsLib.href;
                }
            });
        }
        return jsLib;
    },
    getPresenter: function (name) {
        return playerConfig.presenters[name];
    }
};

}, '');
__applicationContext.define('core.common.playerflow', function (exports,module,require,$) {
'use strict';
var functionUtil = require('core.utils.function');

var runModuleMethod = function(name, args) {
    var flowName = this.name;
    var sourcePresenterUnqiueId = this.sourcePresenterUnqiueId;
    var methodName = this[name] || name.replace(/^\w/, function($0) {
        return flowName + $0.toUpperCase();
    });
    var result = [];
    if (sourcePresenterUnqiueId) {
        this.player.eachPresenter(function(module) {
            if (module.presenter.__model && sourcePresenterUnqiueId === module.presenter.__model.$.unqiueId) {
                var _result = module.runInterface(methodName, args);
                if (_result)
                    result.push(_result);
            }
        }, this.scope);
    } else {
        this.player.eachPresenter(function(module) {
            var _result = module.runInterface(methodName, args);
            if (_result)
                result.push(_result);
        }, this.scope);
    }

    return result;
};

module.type = 'class';
module.exports = {
    constructor: function(config, name, player) {
        $.extend(this, config);
        this.name = name;
        this.player = player;
    },
    start: function(flowData, scope, scb, fcb) {
        if (scope) {
            this.scope = scope;
        }
        var self = this,
            runFlag = true;
        flowData = flowData || {};
        this.sourcePresenterUnqiueId = flowData.sourcePresenterUnqiueId;
        functionUtil.runSequence([{
            fn: self.initData,
            args: [flowData],
            scope: self
        }, {
            fn: function(_flowData) {
                //initData为空时
                flowData = _flowData || flowData;
                var result = runModuleMethod.call(this, 'dataParse', flowData);
                return $.when.apply(this, result).then(function() {
                    return flowData;
                });
            },
            scope: self
        }, {
            fn: function() {
                var valid = self.validate(flowData);
                if (!valid) {
                    runFlag = false;
                    runModuleMethod.call(self, 'fail', Array.prototype.slice.call(arguments, 0));
                    if (fcb) fcb();
                } else {
                    return valid;
                }
            },
            scope: self
        }, {
            fn: function(flowData) {
                if (runFlag) {
                    this.done(flowData, function() {
                        runModuleMethod.call(self, 'success', Array.prototype.slice.call(arguments, 0));
                        if (scb) scb();
                    }, function() {
                        runModuleMethod.call(self, 'fail', Array.prototype.slice.call(arguments, 0));
                        if (fcb) fcb();
                    });
                }
            },
            scope: self
        }], 'playerFlowStart');
    }
};
}, 'class');
__applicationContext.define('core.common.pptshellpaint', function (exports,module,require,$) {
'use strict';
var pptshell = require('core.bridge.pptshell');
module.type = 'class';
module.exports = {
    constructor: function() {

    },
    draw: function() {

    },
    /**
     * 重做
     * @return {[void]} [description]
     */
    redo: function() {},
    /**
     * 撤消
     * @return {[void]} [description]
     */
    undo: function() {},
    /**
     * 重置
     * @return {void} [description]
     */
    reset: function() {},
    /**
     * 获取paint颜色与大小
     * @return {Object} {"color" :"#FF0000","width" :2}
     */
    getPaintSetting: function() {
        return pptshell.paint.getPaintSetting();
    },

    /**
     * 画线
     * @param  {Object} start     起始点，格式如下：{"x":12,"y":34.5}
     * @param  {Object} end       结束点，格式如下：{"x":12,"y":34.5}
     * @param  {String} color     16进制的颜色值 如：#ff0000
     * @param  {number} lineWidth 笔尖大小的int值，如：20
     * @return {[void]}           [description]
     */
    drawLine: function(start, end, color, lineWidth) {
        pptshell.paint.drawLine(start, end, color, lineWidth);
    },
    /**
     * 画圆       
     * @param  {Object} centre    圆心
     * @param  {[type]} radius    半径
     * @param  {[type]} sAngle    开始角（弧度）
     * @param  {[type]} eAngle    结束角（弧度）
     * @param  {[type]} color     颜色 不传值，默认是paint的当前setting的值
     * @param  {[type]} lineWidth 大小 不传值，默认是paint的当前setting的值
     * @param  {Boolean} isFill 是否启用填充
     * @return {[type]}           [description]
     */
    drawCircle: function(centre, radius, sAngle, eAngle, counterclockwise, color, lineWidth, isFill) {
        pptshell.paint.drawCircle(centre, radius, sAngle, eAngle, counterclockwise, color, lineWidth, isFill);
    },

    /**
     * 设置颜色
     * @param {string} color [颜色值]
     */
    setColor: function(color) {
        this.color = color;
        //pptshellPaint.setColor(color);
    },
    /**
     * 设置画笔模式
     * @param {string} mode pencil(画笔),eraser（橡皮檫）,filler（填冲）
     */
    setMode: function(mode) {
        this.mode = mode;
    },
    /**
     * 设置画笔大小
     * @param {int} size 画笔大小
     */
    setSize: function(size) {
        this.size = size;
    }
};

}, 'class');
__applicationContext.define('core.common.printscreen', function (exports,module,require,$) {
'use strict';
var run = false,
	timer = null,
	delay = 15000;
var thumbnailSave = function() {
	if (!run) {
		run = true;
		if (typeof(CoursePlayer) !== 'undefined' && CoursePlayer.thumbnailSave) CoursePlayer.thumbnailSave();
	}
};
module.exports = {
	printScreen: function(eventBus) {
		eventBus.addEventListener('PLAYER.PRINTSCREEN', function() {
			//由于pptshell的绘制机，这里给个500 delay
			timer = window.setTimeout(function() {
				thumbnailSave();
				window.clearTimeout(timer);
			}, 500);
		});
		//兼容处理没回调事件，做的timeout 3500
		timer = window.setTimeout(function() {
			thumbnailSave();
			window.clearTimeout(timer);
		}, delay);
	}
};

}, '');
__applicationContext.define('core.common.refpathbuilder', function (exports,module,require,$) {
'use strict';
var urlUtil = require('core.utils.url');
var stringUtils = require("core.utils.string");

var createRefPath = function (refPath, baseUrl) {
    var newRefPath = {};
    for (var key in refPath) {
        newRefPath[key] = urlUtil.resolve(baseUrl, refPath[key]);
    }
    return newRefPath;
};

var createRefPathParser = function (refPath, baseUrl) {
    refPath = createRefPath(refPath, baseUrl);
    return {
        parse: function (text) {
            return stringUtils.applyTemplate(text, refPath);
        },
        getRefPath: function () {
            return refPath;
        }
    };
};

module.exports = {
    'build': function (refPath, coursewareUrl) {
        refPath['ref-path-addon'] = refPath['ref-path-addon'] || refPath['ref-path'];
        //单独播放一页的时候
        var coursewareRefPath = refPath;
        if (!coursewareUrl && refPath["ref-path-online"]) {
            coursewareRefPath = {
                'ref-path': refPath["ref-path-online"],
                'ref-path-addon': refPath['ref-path-addon']
            };
        }
        return {
            //课件的refPath根据课件的main.xml来获取
            'courseware': createRefPathParser(coursewareRefPath, urlUtil.getBase(coursewareUrl)),
            //定制播放器的refPath根据index的地址来获取
            'playerConfig': createRefPathParser(refPath, urlUtil.getBaseLocationUrl())
        };
    },
    'set': function (player, key, url) {
        player.refPathParser[key] = createRefPathParser(player.refPath, urlUtil.getBase(url));
    }
};

}, '');
__applicationContext.define('core.common.runtime', function (exports,module,require,$) {
'use strict';
var request = require('core.utils.request');

var runtime = {
    'TEACHER_MOBILE': 'TeacherMobile',
    'STUDENT_MOBILE': 'StudentMobile',
    'PROJECTION_MOBILE': 'ProjectionMobile',
    'WEB': 'Web',
    'TEACHER_PC': 'TeacherPc',
    'STUDENT_PC': 'StudentPc'
};
var runtimeMapping = {
    'mobile': {
        'teacher': runtime.TEACHER_MOBILE,
        'student': runtime.STUDENT_MOBILE,
        'projection': runtime.PROJECTION_MOBILE,
        '__default__': runtime.TEACHER_MOBILE
    },
    'pc': {
        'teacher': runtime.TEACHER_PC,
        'student': runtime.STUDENT_PC,
        '__default__': runtime.TEACHER_PC
    }
};
module.exports = {
    'RUNTIME': runtime,
    'getRuntime': function () {
        var bridge = window.Bridge;
        var terminal = request('terminal');
        var result;
        if (bridge && $.isFunction(bridge.getRuntime)) {
            result = runtimeMapping[bridge.getRuntime().toLowerCase()];
            if (typeof result === "object") {
                result = result[terminal.toLowerCase()] || result.__default__;
            }
        }
        return result || runtime.WEB;
    }
};

}, '');
__applicationContext.define('core.common.timer', function (exports,module,require,$) {
'use strict';
var timeObject = '.tooldialog_com_header_time';
var miuteObject = '.tooldialog_com_header_time .tooldialog_time_m em';
var secondObject = '.tooldialog_com_header_time .tooldialog_time_s em';
var miute = 0,
	second = 0,
	interval;

function pre(v) {
	return (v + '').length < 2 ? ('0' + v) : v;
}

module.exports = {
	//这是从外面调用的。不能自己启
	'start': function(tool) {
		clearInterval(interval);
		tool.element.find(timeObject).show();
		tool.element.find(miuteObject).html(pre(miute));
		tool.element.find(secondObject).html(pre(second));
		interval = setInterval(function() {
			if (second === 59) {
				miute++;
				second = 0;
			} else {
				second++;
			}
			tool.element.find(miuteObject).html(pre(miute));
			tool.element.find(secondObject).html(pre(second));
		}, 1000);

	},
	'stop': function() {
		window.clearInterval(interval);
	},

	'reset': function(tool) {
		miute = second = 0;
		window.clearInterval(interval);
		tool.element.find(timeObject).hide();
		tool.element.find(miuteObject).html(pre(miute));
		tool.element.find(secondObject).html(pre(second));
	},
};

}, '');
__applicationContext.define('core.exception.playerexception', function (exports,module,require,$) {
'use strict';
var logger = require("core.utils.log");
var stringUtil = require('core.utils.string');
var errorMessageTemplate = '${id}@${className} error:';
module.exports = {
    create: function (message, throwable, type) {
        var e = new Error("player 11.7.3: " + message);
        e.cause = throwable;
        e.errorType = type || "playerException";
        return e;
    },
    execute: function (e, component) {
        logger.error(stringUtil.applyTemplate(errorMessageTemplate, component), e);
        component.fireEvent("error", e);
    }
};
}, '');
__applicationContext.define('core.eventbus.eventbus', function (exports,module,require,$) {
'use strict';
module.type = "class";

var callListener = function (listener, args) {
    listener.callback.apply(listener.scope || window, args.concat(listener.args));
};

module.exports = {
    constructor: function () {
        this.listeners = {};
    },
    /**
     * 注册事件
     * @param {string}  事件类型
     * @param {Function} 事件
     * @param {Object} scope
     */
    addEventListener: function (type, callback, scope) {
        if (callback) {
            var selector, argsLength;
            if ($.isFunction(callback)) {
                argsLength = 3;
            } else if (callback) {
                argsLength = 2;
                scope = callback.scope;
                if (callback.selector) {
                    selector = ($.isArray(callback.selector)) ? callback.selector : [callback.selector];
                }
                callback = callback.fn;
            }
            if ($.isFunction(callback)) {
                var args = arguments.length > argsLength ? Array.prototype.slice.call(arguments, argsLength) : [];
                var listeners = this.listeners[type] || (this.listeners[type] = []);
                listeners.push({
                    scope: scope,
                    callback: callback,
                    selector: selector,
                    args: args
                });
            }
        }
    },
    /**
     * 移除事件
     * @param {string}  事件类型
     * @param {Function} 事件
     * @param {Object} scope
     */
    removeEventListener: function (type, callback, scope) {
        if (typeof this.listeners[type] != "undefined") {
            var numOfCallbacks = this.listeners[type].length;
            var newArray = [];
            for (var i = 0; i < numOfCallbacks; i++) {
                var listener = this.listeners[type][i];
                if (!(listener.scope == scope && listener.callback == callback)) {
                    newArray.push(listener);
                }
            }
            this.listeners[type] = newArray;
        }
    },
    /**
     * 判断事件是否存在
     * @param {string}  事件类型
     * @param {Function} 事件
     * @param {Object} scope
     * @returns {boolean}
     */
    hasEventListener: function (type, callback, scope) {
        if (typeof this.listeners[type] != "undefined") {
            var numOfCallbacks = this.listeners[type].length;
            if (callback === undefined && scope === undefined) {
                return numOfCallbacks > 0;
            }
            for (var i = 0; i < numOfCallbacks; i++) {
                var listener = this.listeners[type][i];
                if ((scope ? listener.scope == scope : true) && listener.callback == callback) {
                    return true;
                }
            }
        }
        return false;
    },
    /**
     * 委派事件
     * @param {string} 事件类型
     * @param {Object} target
     */
    dispatch: function (type) {
        var args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
        //兼容之前gwt颁布的事件调用格式
        args = [type].concat(args);
        var targetEl;
        var isFirefox = navigator.userAgent.indexOf("Firefox") > 0;
        if (isFirefox)
            window.event = arguments[1] || null;
        if (window.event) {
            targetEl = event.srcElement || event.target;
        }
        if (this.listeners && this.listeners[type]) {
            this.listeners[type].forEach(function (listener) {
                //如果有设置selector
                if (listener.selector && targetEl) {
                    targetEl = $(targetEl);
                    listener.selector.forEach(function (value) {
                        if (targetEl.closest(value).length) {
                            callListener(listener, args.concat([value, targetEl]));
                        }
                    });
                } else {
                    callListener(listener, args);
                }
            });
        }
    },
    /**
     * 查看当前所有监听的事件
     * @returns {string}
     */
    getEvents: function () {
        var str = "";
        for (var type in this.listeners) {
            var numOfCallbacks = this.listeners[type].length;
            for (var i = 0; i < numOfCallbacks; i++) {
                var listener = this.listeners[type][i];
                str += listener.scope && listener.scope.className ? listener.scope.className : "anonymous";
                str += " listen for '" + type + "'\n";
            }
        }
        return str;
    }
};
}, 'class');
__applicationContext.define('core.eventbus.eventname', function (exports,module,require,$) {
'use strict';
var eventName = {
    tool: {
        maximize: 'PLAYER.TOOL.MAXIMIZE',
        minimize: 'PLAYER.TOOL.MINIMIZE',
        finish: 'PLAYER.TOOL.FINISH',
        close: 'PLAYER.TOOL.CLOSE',
        push_action: 'PLAYER.TOOL.PUSH_ACTION',
        push_data: "PLAYER.TOOL.PUSH_DATA",
        adjust_layout: "PLAYER.TOOL.ADJUST_LAYOUT",
        layout_resize: "PLAYER.TOOL.LAYOUT_RESIZE",
        forbide_full: "PLAYER.TOOL.FORBIDE_FULL"
    },
    play:{
        push_status:"PLAYER.GLOBAL.PUSH_STATUS"
    }
};
module.exports = eventName;

}, '');
__applicationContext.define('core.layout.layout', function (exports,module,require,$) {
'use strict';
var configAttrName = ['width', 'height', 'top', 'right', 'bottom', 'left'];
module.type = 'class';
module.exports = {
    static: {
        attrName: configAttrName,
        createLayoutConfig: function(config, pushAttrName) {
            var layoutConfig = {};
            var value;
            if (pushAttrName) {
                pushAttrName.forEach(function(name) {
                    if ($.inArray(name, configAttrName) < 0) {
                        configAttrName.push(name);
                    }
                });
            }
            configAttrName.forEach(function(name) {
                value = config[name];
                if (value) {
                    layoutConfig[name] = ($.isNumeric(value)) ? parseInt(value, 10) : value;
                }
            });
            return layoutConfig;
        }
    },
    constructor: function(component) {
        this.component = component;
    },
    zIndex: 300,
    getZIndex: function() {
        return this.zIndex++;
    }
};
}, 'class');
__applicationContext.define('core.layout.pageabsolutelayout', function (exports,module,require,$) {
'use strict';
module.type = 'class';
module.exports = {
    extend: "core.layout.Layout",
    render: function (target) {
        var me = this;
        this.$layoutTarget = target;
        if (me.$layoutTarget.css('position') === 'static') {
            $(me.$layoutTarget).css('position', 'relative');
        }
        var itemPromises = [];
        me.component.items.forEach(function (module) {
            itemPromises.push(me.addModule(module));
        });
        return $.when.apply($, itemPromises);
    },
    addModule: function (module) {
        var zindex = module.getZIndex() || this.getZIndex();
        return module.render(this.$layoutTarget).then(function (module) {
            module.getElement(true).css({'position': 'absolute', 'z-index': zindex});
        }, function () {
            //一个module渲染失败,继续渲染其它
            return $.Deferred().resolve();
        });
    }
};

}, 'class');
__applicationContext.define('core.layout.playerdivlayout', function (exports,module,require,$) {
'use strict';
var stringUtil = require('core.utils.string'),
    Layout = require('core.layout.Layout'),
    When = require('core.utils.when'),
    logger = require('core.utils.log'),
    stringUtil = require('core.utils.string'),
    toolLayout = require('core.common.layout.tool');
var urlUtil = require('core.utils.url');
var commonPageTemplate = '<div class="ic_${name}_panel ic_common_panel" style="z-index: ${zIndex}"></div>';
var pagePanelTemplate = '<div class="ic_page_panel" style="z-index: ${zIndex}"></div>';

//公用页渲染配置
var commonPageRenderConfig = {
    'horizontal': {
        sizeName: 'height',
        group: [{
            name: ['header', 'toolbar'],
            layout: 'top'
        }, {
            name: ['footer'],
            layout: 'bottom'
        }]
    },
    'vertical': {
        sizeName: 'width',
        group: [{
            name: ['left'],
            layout: 'left'
        }, {
            name: ['right'],
            layout: 'right'
        }]
    }
};
//渲染公用页(top,right,bottom,left)
var commonPageRender = function (type) {
    var me = this;
    var commonPages = me.component.commonPages;
    var config = commonPageRenderConfig[type];
    var $parent = config.$target;
    var groupLoads = [];
    //按照分组渲染
    config.group.forEach(function (groupConfig) {
        var pageLoads = [];
        var pages = commonPages.getItems(groupConfig.name);
        if (pages && pages.length) {
            //渲染页面外围结构
            var $commonPagePanel = $(stringUtil.applyTemplate(commonPageTemplate, {
                'name': groupConfig.layout,
                'zIndex': me.getZIndex()
            }));
            var when = new When(pages.length, function (results) {
                var sumSize = 0;
                results.forEach(function (size) {
                    sumSize += size;
                });
                $parent.css('padding-' + groupConfig.layout, sumSize);
                $commonPagePanel.css(config.sizeName, sumSize);
            });
            //渲染页面
            pages.forEach(function (page) {
                page.addEventListener('renderModel', function (_name, model) {
                    var layout = Layout.createLayoutConfig(model.getAttribute('layout'));
                    var size = layout[config.sizeName];
                    $(page.getElement()).css(config.sizeName, size);
                    when.each(size);
                });
                pageLoads.push(page.render($commonPagePanel));
            });
            //渲染完毕再加入dom树
            groupLoads.push($.when.apply($, pageLoads).done(function () {
                $parent.append($commonPagePanel);
            }));
        }
    });
    return groupLoads;
};

var commonPageShow = function (type, isVisible) {
    var me = this;
    var commonPages = me.component.commonPages;
    var config = commonPageRenderConfig[type];
    var classTemplate = ".ic_common_panel.ic_${name}_panel";
    //按照分组隐藏
    config.group.forEach(function (groupConfig) {
        var pages = commonPages.getItems(groupConfig.name);
        if (pages && pages.length) {
            //渲染页面外围结构
            var $classhandler = $(stringUtil.applyTemplate(classTemplate, {
                'name': groupConfig.layout
            }));
            if (isVisible) {
                $classhandler.show();
            } else {
                $classhandler.hide();
            }
        }
    });
};

var mainRender = function ($parent) {
    var me = this;
    var $mainLayout = $(stringUtil.applyTemplate(pagePanelTemplate, {
        'zIndex': me.getZIndex()
    }));
    $parent.append($mainLayout);
    return $mainLayout;
};

var events = require('core.common.layout.events');
var downEvents = events.downEvents,
    moveEvents = events.moveEvents,
    upEvents = events.upEvents,
    clickEvents = events.clickEvents,
    pageLeaveEvents = events.pageLeaveEvents,
    isMouse = false;

var addPageEvent = (function () {
    var isMove = false;
    var downTime, downX, downY;
    return function () {
        var me = this;
        downEvents.forEach(function (eventName) {
            var fn = function (e) {
                var event = $.event.fix(e);
                isMove = true;
                downTime = new Date();
                downX = event.type.indexOf('touch') < 0 ? event.pageX : event.originalEvent.touches[0].pageX;
                downY = event.type.indexOf('touch') < 0 ? event.pageY : event.originalEvent.touches[0].pageY;
                me.component.activePage.fireEvent('mousedown', event);
            };
            if (me.pageTarget[0].addEventListener) {
                me.pageTarget[0].addEventListener(eventName, fn);
            } else {
                me.pageTarget[0].attachEvent(eventName, fn);
            }
        });
        moveEvents.forEach(function (eventName) {
            var fn = function () {
                if (isMove) {
                    me.component.activePage.fireEvent('mousemove', event);
                }
            };
            if (me.pageTarget[0].addEventListener) {
                me.pageTarget[0].addEventListener(eventName, fn);
            } else {
                me.pageTarget[0].attachEvent(eventName, fn);
            }
        });
        upEvents.forEach(function (eventName) {
            var fn = function (e) {
                var event = $.event.fix(e);
                isMove = false;
                me.component.activePage.fireEvent('mouseup', event);
                var t = new Date() - downTime;
                var x = Math.abs((event.pageX === undefined ? event.originalEvent.changedTouches[0].pageX : event.pageX) - downX);
                var y = Math.abs((event.pageY === undefined ? event.originalEvent.changedTouches[0].pageY : event.pageY) - downY);
                if (t < 180 && x < 3 && y < 3) {
                    me.component.activePage.fireEvent('click', event);
                }
            };
            if (me.pageTarget[0].addEventListener) {
                me.pageTarget[0].addEventListener(eventName, fn);
            } else {
                me.pageTarget[0].attachEvent(eventName, fn);
            }
        });
        pageLeaveEvents.forEach(function (eventName) {
            var fn = function () {
                me.component.activePage.fireEvent('pageLeave', event);
            };
            if (me.pageTarget[0].addEventListener) {
                me.pageTarget[0].addEventListener(eventName, fn);
            } else {
                me.pageTarget[0].attachEvent(eventName, fn);
            }
        });
    };
})();
var fontSizeCreater = function () {
    if (this.component.adaptFlag || this.component.adaptFlag == undefined) {
        icCreatePlayer.fontSize = icCreatePlayer.utils.getFontSize();
        if(icCreatePlayer.fontSize > 0){
           this.component.container.css('font-size', icCreatePlayer.fontSize + 'px');
        }
    }
    if(icCreatePlayer.fontSize != 0){
       //只执行一次
       fontSizeCreater = function () {}
    }
};
module.type = 'class';
module.exports = {
    extend: "core.layout.Layout",
    constructor: function (component) {
        require("core.layout.playerDivLayout").prototype.superClass.constructor.call(this, component);
        this.renderAllCommonPage = function () {
            var me = this;
            //第一次真正渲染通用页，第二次直接调用pageChange接口,不重复渲染
            var promises = [];
            for (var key in commonPageRenderConfig) {
                promises = promises.concat(commonPageRender.call(me, key));
            }
            this.renderAllCommonPage = function () {
                me.component.commonPages.forEach(function (page) {
                    logger.log('page.pageChange');
                    page.pageChange();
                });
            };
            return $.when.apply($, promises);
        };
    },
    render: function (target) {
        commonPageRenderConfig.horizontal.$target = target;
        commonPageRenderConfig.vertical.$target = mainRender.call(this, target);
        this.pageTarget = mainRender.call(this, commonPageRenderConfig.vertical.$target);
        addPageEvent.call(this);
        this.pageTarget.addClass('ic_main_page_panel');

        return this.renderPage();
    },
    renderPage: function () {
        var me = this;
        fontSizeCreater.call(me);
        this.component.waitDialog.show();
        this.component.activePage.addEventListener('afterLayout', function () {
            me.component.waitDialog.hide();
        });
        var baseUrl = urlUtil.getBase(this.component.activePage.url);
        icCreatePlayer['ref_base'] = baseUrl.replace(/\/$/, '')
        return this.component.activePage.render(this.pageTarget)
            .then(function () {
                console.log('activePage render finished');
                return me.renderAllCommonPage();
            })
            .done(function () {
                console.log('activePage PageLoaded');
                me.component.fireEvent('PageLoaded');
            });
    },
    activePage: function () {
        if (this.$toolTarget){
            this.$toolTarget.removeClass('ic_paint_active');
            this.$toolTarget.css("display","none");
        }
    },
    renderTool: function () {
        return toolLayout.renderTool.apply(this);
    },
    activeTool: function (tool) {
        toolLayout.activeTool.apply(this,[tool]);
    },
    addTool: function (tool) {
        return toolLayout.addTool.apply(this, [tool]);
    },
    setToolZIndex: function (tool) {
        toolLayout.setToolZIndex.apply(this, [tool]);
    },
    isLargeZIndex: function (tool) {
        return toolLayout.isLargeZIndex.apply(this, [tool]);
    },
    /**
     * 激活某一tool
     * @param  {[type]} tool [description]
     * @return {[type]}      [description]
     */
    fireTool: function (tool) {
        toolLayout.fireTool.apply(this, [tool]);
    },
    /**
     * 最小化TOOL
     * @param  {[type]} tool [description]
     * @return {[type]}      [description]
     */
    minTool: function (event, tool) {
        toolLayout.minTool.apply(this, [event, tool]);
    },
    /**
     * 关闭通用页开关
     * @param name
     * @param isVisible
     */
    switchCommonPage: function (name, isVisible) {
        var me = this;
        for (var key in commonPageRenderConfig) {
            commonPageShow.call(me, key, isVisible);
        }
    }

};

}, 'class');
__applicationContext.define('core.loader.jslibloadercreator', function (exports,module,require,$) {
'use strict';
var Loader = require('core.loader.Loader');
var modelCreator = require('core.model.modelCreator');
var stringUtils = require('core.utils.string');
var packageParser = require('core.model.parser.simpleJsonParser');
var urlUtil = require('core.utils.url');
var domUtil = require('core.utils.dom');
var functionUtil = require('core.utils.function');

var packageUrlTemplate = '${ref-path-addon}/js-library/${name}/${version}/package.json';
module.exports = {
    'create': function () {
        var me = this;
        var getKey = function (item) {
            return item.name;
        };

        var importJs = function (model, baseurl) {
            var loadJsList = [];
            if (model.script && model.script.length > 0)
                model.script.forEach(function (jsUrl) {
                    jsUrl = urlUtil.resolve(baseurl, jsUrl);
                    if (model.releaseNum) {
                        jsUrl += "?releaseNum=" + model.releaseNum
                    }
                    loadJsList.push({
                        fn: domUtil.addScript,
                        args: [jsUrl]
                    });
                });
            return functionUtil.runSequence(loadJsList, 'load js');
        };

        var importCss = function (model, baseurl) {
            model.css.forEach(function (cssUrl) {
                cssUrl = urlUtil.resolve(baseurl, cssUrl);
                if (model.releaseNum) {
                    cssUrl += "?releaseNum=" + model.releaseNum
                }
                domUtil.addStyle(cssUrl);
            });
        };

        //todo:需要考虑循环依赖
        var importDependencies = function (model, refPathParser) {
            return me.create().load(refPathParser, model.dependencies);
        };

        var createLoadPromise = function (item, key, refPathParser) {
            var deferred = $.Deferred();
            item = require('core.common.playerConfig').getScripts(item);
            //兼容是否压缩
            if (!$.isEmptyObject(icCreatePlayer.jsLibConfig)) {
                var result = {}
                var autoData = icCreatePlayer.jsLibConfig.auto
                var notautoData = icCreatePlayer.jsLibConfig.notauto
                if (!$.isEmptyObject(autoData) && autoData.model && autoData.model[key]) {
                    result.model = autoData.model[key]
                    result.baseUrl = autoData.baseUrl
                } else if (!$.isEmptyObject(notautoData) && notautoData.model && notautoData.model[key]) {
                    result.model = notautoData.model[key]
                    result.baseUrl = notautoData.baseUrl
                }
                if (result.model && result.baseUrl) {
                    importCss(result.model, result.baseUrl)
                    importDependencies(result.model, refPathParser)
                        .then(functionUtil.createPromiseThen(deferred, importJs, [result.model, result.baseUrl]))
                        .done(function () {
                            deferred.resolve()
                        })
                } else {
                    deferred.reject()
                }
            }
            else {
                var url = item.href || stringUtils.applyTemplate(packageUrlTemplate, $.extend(item, refPathParser.getRefPath()));
                modelCreator.create({
                    url: url,
                    parser: packageParser
                }).then(function (result) {
                    //加载js库的样式
                    importCss(result.model, result.baseUrl);
                    return result;
                }).then(function (result) {
                    //加载js依赖库,然后再加载自身
                    return importDependencies(result.model, refPathParser)
                        .then(functionUtil.createPromiseThen(deferred, importJs, [result.model, result.baseUrl]));
                }).done(function () {
                    deferred.resolve();
                });
            }

            //避免内存占用
            return deferred.promise();
        };
        var loader = new Loader(getKey, createLoadPromise);
        //惰性函数只创建一次
        this.create = function () {
            return loader;
        };
        return this.create();
    }
};

}, '');
__applicationContext.define('core.loader.loader', function (exports,module,require,$) {
'use strict';
module.type = 'class';
module.exports = {
    constructor: function (getKey, createLoadPromise) {
        //缓存加载过loader
        this.promises = {};
        //获取loader的key
        this.getKey = getKey;
        //创建loader的promise
        this.createLoadPromise = createLoadPromise;
    },
    load: function (loadConfig, loaders) {
        //参数调整，loaders支持数组传入或者多参数传入
        var loaderList = ($.isArray(loaders)) ? loaders : Array.prototype.slice.call(arguments, 1);
        var me = this;
        var _promises = [];
        loaderList.forEach(function (item) {
            //依次载入loader
            var key = me.getKey(item);
            //如果已经加载过loader就不再加载
            var _promise = me.promises[key] || (me.promises[key] = me.createLoadPromise(item, key, loadConfig));
            _promises.push(_promise);
        });
        return $.when.apply($, _promises);
    }
};

}, 'class');
__applicationContext.define('core.loader.packageloadercreator', function (exports,module,require,$) {
'use strict';
var Loader = require('core.loader.Loader');
var modelCreator = require('core.model.modelCreator');
var simpleJsonParser = require('core.model.parser.simpleJsonParser');
var domUtil = require('core.utils.dom');
module.exports = {
    'create': function () {
        var getKey = function (item) {
            return item;
        };

        var createLoadPromise = function (item, key, refPathParser) {
            return modelCreator.create({
                url: item,
                parser: simpleJsonParser,
                textParsers: refPathParser
            }).done(function (result) {
                if (result.model.css) {
                    domUtil.addStyleContent(result.model.css);
                }
            });
        };

        var loader = new Loader(getKey, createLoadPromise);
        this.create = function () {
            return loader;
        };
        return this.create();
    }
};

}, '');
__applicationContext.define('core.loader.presenterloadercreator', function (exports,module,require,$) {
'use strict';
var Loader = require('core.loader.Loader');
var domUtils = require('core.utils.dom');
var stringUtils = require('core.utils.string');
var modelCreator = require('core.model.modelCreator');
var presenterXmlParser = require('core.model.parser.presenterXmlParser');
var jsLibLoaderCreator = require('core.loader.jsLibLoaderCreator');
var functionUtil = require('core.utils.function');
var PresenterModel = require('core.model.PresenterModel');

var scriptReg = /^\s*function(\s+\w+)?\s*\(.*?\)/i;
var cssReg = /url\s*\(\s*(['"]?)(resources[\\/].*?)\1\s*\)/ig;
var scriptTemplate = '//# sourceURL=ndplayer-${type}\r\n${script}';
var createFnTemplate = 'Addon${type}_create';
var defineFnTemplate = 'function ${createFnName}()';
var cssUrlTemplate = 'url("${base}${name}")';

var jsLibLoader = jsLibLoaderCreator.create();
var packageLoader = require('core.loader.packageLoaderCreator').create();
//记录打包合并载入的js
var loadPresenters = {};

var parseScript = function (result, type) {
    var model = result.model;
    var script = model.removeAttribute('script');
    model.createFnName = stringUtils.applyTemplate(createFnTemplate, {'type': type});
    if (script) {
        script = script.replace(scriptReg, stringUtils.applyTemplate(defineFnTemplate, model));
        domUtils.addScriptContent(stringUtils.applyTemplate(scriptTemplate, {'type': type, 'script': script}));
    }
};

var parseJsDependence = function (model, refPath) {
    var jsDependencyList = model.removeAttribute('jsDependency');
    return jsLibLoader.load(refPath, jsDependencyList);
};

var parseCss = function (result, type) {
    var model = result.model;
    var baseUrl = result.baseUrl;
    var css = model.removeAttribute('css');
    if (css) {
        domUtils.addStyleContent(css.replace(cssReg, function ($0, $1, $2) {
            return stringUtils.applyTemplate(cssUrlTemplate, {base: baseUrl, name: $2});
        }));
    }
};

module.exports = {
    'create': function () {
        var getKey = function (item) {
            return item.presenterId;
        };

        var createLoadPromise = function (item, key, refPathParser) {
            var deferred = $.Deferred();
            var loadResult;

            //打包后的结果
            if (item.data) {
                packageLoader.load(refPathParser, item.data).done(function (packageConfig) {
                    var item = packageConfig.model.presenters[key];
                    var url = item.presenter;

                    var model = new PresenterModel();
                    model.setAttributes(item.dependencies);
                    model.setAttribute('view', item.view);
                    model.setAttribute('css', item.css);

                    loadResult = {model: model, baseUrl: item.base};
                    parseJsDependence(model, refPathParser).then(
                        function () {
                            return loadPresenters[url] || (loadPresenters[url] = domUtils.addScript(url));
                        }
                    ).then(function () {
                        parseScript(loadResult, key);
                        parseCss(loadResult, key);
                        deferred.resolve(loadResult);
                    });
                });
            } else {
                modelCreator.create({
                    url: item.url || item.href,
                    textParsers: refPathParser,
                    parser: presenterXmlParser
                }).then(functionUtil.createPromiseThen(deferred, function (result) {
                    loadResult = result;
                    return parseJsDependence(result.model, refPathParser);
                })).then(functionUtil.createPromiseThen(deferred, function () {
                    parseScript(loadResult, key);
                    parseCss(loadResult, key);
                    deferred.resolve(loadResult);
                }));
            }


            //防止闭包内存泄漏
            return deferred.promise();
        };

        var loader = new Loader(getKey, createLoadPromise);
        this.create = function () {
            return loader;
        };
        return this.create();
    }
};
}, '');
__applicationContext.define('core.model.collection', function (exports,module,require,$) {
'use strict';
module.type = 'class';
module.exports = {
    constructor: function (indexNames) {
        this.items = [];
        this.map = {};
        this.length = 0;
        if (indexNames) {
            this.indexNames = ($.isArray(indexNames)) ? indexNames : [indexNames];
        }
        this.indexMap = {};
    },
    indexNames: [],
    add: function (key, item) {
        //参数修正
        if (arguments.length === 1) {
            item = key;
            key = '';
        }
        this.items.push(item);
        this.map[key || this.length] = this.length;
        var me = this;
        this.indexNames.forEach(function (indexKey) {
            var _map = me.indexMap[indexKey] || (me.indexMap[indexKey] = {});
            _map[item[indexKey]] = me.length;
        });
        this.length++;
    },
    'getByIndex': function (index) {
        return this.items[index];
    },
    'getByKey': function (key) {
        return this.items[this.map[key]];
    },
    'find': function (indexName, key) {
        return this.items[this.indexMap[indexName][key]];
    },
    indexOf: function (key, indexName) {
        var _map = (indexName) ? this.indexMap[indexName] : this.map;
        return (key in _map) ? _map[key] : -1;
    },
    'forEach': function (fn) {
        for (var key in this.map) {
            fn(this.getByKey(key), key);
        }
    },
    'getArray': function () {
        return this.items;
    }
};

}, 'class');
__applicationContext.define('core.model.mainmodel', function (exports,module,require,$) {
'use strict';
module.type = "class";
module.exports = {
    extend: "core.model.Model",
    //style 样式内容
    //css 样式url链接
    //page格式{"id":"","name":"","href":"",preview:""}
    attributes: [{"name": "pages", "type": "core.model.PageCollection"}, "css", "style", {
        "name": "commons",
        "type": "core.model.Table"
    }],
    addPage: function (page) {
        this.getAttribute("pages").add(page);
    },
    getPages: function () {
        return this.getAttribute("pages");
    }
};

}, 'class');
__applicationContext.define('core.model.model', function (exports,module,require,$) {
'use strict';
var simpleType = {
    'array': function () {
        return [];
    },
    'object': function () {
        return {};
    }
};
module.type = 'class';
module.exports = {
    constructor: function () {
        this.attributeValues = {};
        var me = this;
        this.attributes.forEach(function (attr) {
            if (typeof  attr === 'string') {
                me.attributeValues[attr] = '';
            } else {
                var type = attr.type.toLowerCase();
                var value;
                if (type in simpleType) {
                    value = simpleType[type]();
                } else {
                    var Type = require(attr.type);
                    value = new Type();
                }
                me.attributeValues[attr.name] = value;
            }
        });
    },
    attributes: [],
    setAttribute: function (name, value) {
        if (name in this.attributeValues) {
            this.attributeValues[name] = value;
        }
    },
    getAttribute: function (name) {
        return this.attributeValues[name];
    },
    removeAttribute: function (name) {
        var value = this.getAttribute(name);
        delete this.attributeValues[name];
        return value;
    },
    setAttributes: function (attrs) {
        for (var key in attrs) {
            this.setAttribute(key, attrs[key]);
        }
    },
    getValue: function () {
        return this.attributeValues;
    }
};

}, 'class');
__applicationContext.define('core.model.modelcreator', function (exports,module,require,$) {
'use strict';
var urlUtil = require('core.utils.url');
var ajaxProxy = require('core.model.proxy.AjaxProxy');
var functionUtil = require('core.utils.function');
var stringUtils = require("core.utils.string");
var defaultParser = {
    'parse': function (text) {
        return text;
    }
};

var parse = function (text, textStatus, jqXHR, textParsers, parser) {
    textParsers.forEach(function (textParser) {
        text = textParser.parse(text);
    });
    return parser.parse(text);
};

exports.create = function (config) {
    var url = config.url;
    var proxy = config.proxy || ajaxProxy;
    var parser = config.parser || defaultParser;
    var textParsers = config.textParsers || [];
    var isCache = config.isCache;
    if (!$.isArray(textParsers)) {
        textParsers = [textParsers];
    }
    var defer = $.Deferred();
    if (url) {
        var baseUrl = urlUtil.getBase(url);
        var refBaseParserConfig = {
            'ref-base': baseUrl.replace(/\/$/, '')
        };
        textParsers.push({
            parse: function (text) {
                return stringUtils.applyTemplate(text, refBaseParserConfig);
            }
        });
        proxy.getData(url, isCache)
            .fail(function () {
                if (config.ignoreError) {
                    var model = JSON.parse('{"presenters":{},"commons":{},"script":[],"icplayerVersion": "11.7.3"}');
                    defer.resolve({'model': model, 'baseUrl': baseUrl});
                } else {
                    defer.reject(new Error("player 11.7.3: " + 'ajax request error'));
                }
            })
            .then(functionUtil.createPromiseThen(defer, parse, [textParsers, parser], true))
            .fail(function (e) {
                defer.reject(e);
            })
            .then(function (model) {
                defer.resolve({'model': model, 'baseUrl': baseUrl});
            }).fail(function (e) {
            defer.reject(e);
        });
    } else {
        defer.resolve({'model': null, 'baseUrl': ''});
    }
    return defer.promise();
};

}, '');
__applicationContext.define('core.model.modulegroupmodel', function (exports,module,require,$) {
'use strict';
module.type = 'class';
module.exports = {
    extend: 'core.model.Model',
    attributes: [
        {'name': 'presenters', 'type': 'object'},
        {'name': 'modules', 'type': 'core.model.Collection'}
    ],
    addModule: function (module) {
        this.getAttribute('modules').add(module.getAttribute("id"), module);
    },
    addPresenter: function (key, url) {
        this.getAttribute('presenters')[key] = {'href': url};
    }
};

}, 'class');
__applicationContext.define('core.model.modulemodel', function (exports,module,require,$) {
'use strict';
module.type = 'class';
module.exports = {
    extend: 'core.model.Model',
    //style格式{'href':'','content':''}
    //propertie的格式{"name":"","type":"",'value':''}
    //handler的格式{'id':'','name':''}
    //layout的格式{'left':'','top':'',width:'',height:''}
    attributes: ['id', 'presenterId', 'layout', 'css', 'style', 'z-index', 'lazy-init', {
        'name': 'properties', 'type': 'array'
    }, {'name': 'events', 'type': 'core.model.Collection'}],
    addProperty: function (property) {
        this.getAttribute('properties').push(property);
    },
    addEvent: function (name, handler) {
        this.getAttribute("events").add(name, handler);
    }
};

}, 'class');
__applicationContext.define('core.model.pagecollection', function (exports,module,require,$) {
'use strict';
module.type = "class";
module.exports = {
    extend: "core.model.Collection",
    indexNames: ["id", "name"],
    getIndexOfById: function (id) {
        return this.indexOf(id, this.indexNames[0]);
    },
    getIndexOfByName: function (name) {
        var index = this.indexOf(name, this.indexNames[1]);
        if (index == -1) {
            throw new Error("The name of Index is not Found");
        }
        return index;
    }
};
}, 'class');
__applicationContext.define('core.model.pagemodel', function (exports,module,require,$) {
'use strict';
module.type = 'class';
module.exports = {
    extend: 'core.model.ModuleGroupModel',
    attributes: [
        'layout'
    ],
    __extendAttribute: ['attributes']
};
}, 'class');
__applicationContext.define('core.model.presentermodel', function (exports,module,require,$) {
'use strict';
module.type = 'class';
module.exports = {
    extend: 'core.model.Model',
    //androidDependency格式{'type':'apk','href':''}
    //jsDependency格式{'name':'','version':''}
    attributes: ['css', 'view', 'script', {
        'name': 'androidDependency',
        'type': 'core.model.Collection'
    }, {'name': 'jsDependency', 'type': 'array'}, {'name': 'moduleDependency', 'type': 'object'}]
};

}, 'class');
__applicationContext.define('core.model.table', function (exports,module,require,$) {
'use strict';
module.type = 'class';
module.exports = {
    constructor: function () {
        this.data = {};
    },
    addItem: function (key, item) {
        var items = this.data[key] || (this.data[key] = []);
        items.push(item);
    },
    getItems: function (key) {
        var keys = ($.isArray(key)) ? key : arguments;
        var len = keys.length;
        var items = [], item;
        for (var i = 0; i < len; i++) {
            item = this.data[keys[i]];
            items = (item) ? items.concat(item) : items;
        }
        return items;
    },
    forEach: function (fn) {
        for (var key in this.data) {
            this.data[key].forEach(fn);
        }
    },
    removeItem: function (key) {
        delete this.data[key];
    }

};
}, 'class');
__applicationContext.define('core.model.toolmodel', function (exports,module,require,$) {
'use strict';
module.type = 'class';
module.exports = {
    extend: 'core.model.ModuleGroupModel',
    attributes: [
        'mainModule',
        'layout',
        {'name': 'properties', 'type': 'array'}
    ],
    addProperty: function (property) {
        this.getAttribute('properties').push(property);
    },
    __extendAttribute: ['attributes']
};
}, 'class');
__applicationContext.define('core.plugin.sync', function (exports,module,require,$) {
'use strict';
var logger = require('core.utils.log');
var toolList, Socket = window.MozWebSocket || window.WebSocket,

    socket;
var timer = null,sendTimer=null,maxCount=10,count=0,interval=500;

var instance = null;
function initws(wsUrl) {
    socket = new Socket(encodeURI(wsUrl));
    socket.addEventListener('open', function () {
        window.clearInterval(timer);
    });

    socket.onerror = function (event) {
        logger.error('ERROR: ' + event.message);

        if(count++>maxCount){
            window.clearInterval(timer);
        }
        else{
        timer = window.setInterval(function () {
            socket = new Socket(encodeURI(wsUrl));
        }, interval);}
    };

    socket.onmessage = function (event) {
        resolve(event.data);
    };

    socket.onclose = function (event) {
        logger.log('CLOSE: ' + event.code + ', ' + event.reason);
    };
}


function getTool(syncId, key) {
    toolList = instance.getToolList();
    for (var i = 0; i < toolList.all.length; i++) {
        if (toolList.all[i].toolKey === key && toolList.all[i].syncId === syncId)
            return toolList.all[i];
    }
    return undefined;
};

function createOption(action, syncId, toolKey) {
    var option = {};
    option.eventData = {};
    option.eventName = action;
    option.eventData.syncId = syncId;
    option.eventData.toolKey = toolKey;
    return option;
};

function resolve(data) {
    if (!player) return;
    var _data = JSON.parse(data);
    var eventName = _data.eventName;
    var eventData = _data.eventData;
    var tool = getTool(eventData.syncId, eventData.toolKey);

    switch (eventName) {
        case 'updateTool':
            if (tool && tool.mainModule.getPresenter().__interface && tool.mainModule.getPresenter().__interface.sync)
                tool.mainModule.getPresenter().__interface.sync(eventData);
            break;
        case 'addTool':
            if (eventData.toolKey)
                instance.addTool(eventData.toolKey, {
                        __sys: {
                            syncId: eventData.syncId,
                            NONEventFlag: true
                        }
                    },
                    eventData.toolState, {
                        toolKey: eventData.toolKey,
                        ref_path_tool: decodeURIComponent(icCreatePlayer.ref_path_tool) || '../tools'
                    });
            break;
        case 'closeTool':
            if (tool)
                instance.removeTool(tool.unqiueId, 'player', true);

    }

};
var sync = {
    start: function (player, wsurl) {
        try {
            //return null;
            var me = this;
            instance = player;
            instance._eventbus.addEventListener('PLAYER.TOOL.FINISH', function () {
                var toolObject = arguments[1];
                var _state = toolObject.mainModule.getPresenter().getState ? toolObject.mainModule.getPresenter().getState() : '';
                me.addTool(toolObject.syncId, toolObject.toolKey, _state);
            });
            instance._eventbus.addEventListener('PLAYER.TOOL.CLOSE', function () {
                var toolObject = arguments[1];
                me.closeTool(toolObject.syncId, toolObject.toolKey);
            });
            initws(wsurl);
            return socket;
        } catch (e) {
            console.error(e);
            // //尝试重连1000
            // timer = window.setInterval(function() {
            // 	if (!wsor)
            // 		wsor = ws.init(wsOption);
            // 	else
            // 		winddow.clearInterval(timer);
            // }, 1000);
        }
    },
    stop: function () {
        socket.close();
    },
    send: function(data,callback) {
        this.waitForConnection(function () {
            console.log( socket.readyState)
            console.log(JSON.stringify(data))
            socket.send(JSON.stringify(data));
            if (typeof callback !== 'undefined') {
                callback();
            }
        }, 1);

    },
    waitForConnection: function (callback, interval) {
        if (socket.readyState === 1) {
            window.clearTimeout(sendTimer);
            callback();
        } else {
            var that = this;
            // optional: implement backoff for interval here
           sendTimer= setTimeout(function () {
                that.waitForConnection(callback, interval);
            }, interval);
        }
    },
    addTool: function (syncId, toolKey, toolState) {
        try {
            var option = createOption('addTool', syncId, toolKey);
            option.eventData.toolState = toolState;
            this.send(option);
        } catch (e) {
            console.error(e);
        }
    },
    /**
     * 更新
     * @param  {[type]} syncId     tool.syncId
     * @param  {[type]} toolKey    tool.Key
     * @param  {[type]} updateInfo [description]
     * @return {[type]}            void
     */
    updateTool: function (syncId, toolKey, updateInfo) {
        try {
            var option = createOption('updateTool', syncId, toolKey);
            var toolState = instance.getPlayerServices().getState().getAllToolState();
            option.eventData.toolState = toolState;
            option.eventData.updateInfo = updateInfo;
            this.send(option);
        } catch (e) {
            console.error(e);
        }
    },
    closeTool: function (syncId, toolKey) {
        try {
            var option = createOption('closeTool', syncId, toolKey);
            this.send(option);
        } catch (e) {
            console.error(e);
        }
    }

};
module.exports = sync;
}, '');
__applicationContext.define('core.player.component', function (exports,module,require,$) {
'use strict';
var modelCreator = require('core.model.modelCreator');
var playerException = require('core.exception.playerException');
var Eventbus = require('core.eventbus.eventbus');
var urlUtil = require('core.utils.url');
var functionUtil = require('core.utils.function');
var uuid = require('core.utils.uuid');
var Layout = require('core.layout.Layout');

var layoutAlias = {
    'iframe': 'core.layout.playerIframeLayout',
    'div': 'core.layout.playerDivLayout'
};
var createLayout = function (layoutType, component) {
    var typeName = layoutAlias[layoutType] || layoutType;
    var LayoutClass = require(typeName);
    return new LayoutClass(component);
};

var getEventName = function (name) {
    return (this._events[name]) ? name : "__custom_" + name;
};

module.type = 'class';
module.exports = {
    constructor: function (config, parent) {
        this.layoutTarget = undefined;
        this.initConfig(config);
        $.extend(this, config);
        this.id = this.id || uuid(6);
        this.unqiueId = uuid(8);
        this.parent = parent || this;
        this.top = this.parent.top || this;
        this.parentBaseUrl = this.parent.baseUrl || urlUtil.getBaseLocationUrl();
        this.url = this.url && urlUtil.resolve(this.parentBaseUrl, this.url);
        if (this.layout) {
            this.layout = createLayout(this.layout, this);
        }
        this._events = {};
        this._eventbus = new Eventbus();
        this.initComponent();
        if ($.isPlainObject(this.listeners)) {
            for (var name in this.listeners) {
                this.addEventListener(name, this.listeners[name], this);
            }
        }
    },
    createController: function () {
        return {};
    },
    //presenter获取的player的能力
    getController: function () {
        //只创建一次
        return this.controller || (this.controller = this.createController());
    },
    initConfig: function (config) {
        //href等同url
        config.url = config.url || config.href;
        delete config.href;
        //layout处理成layoutConfig,防止冲突
        if (config.layout) {
            config.layoutConfig = Layout.createLayoutConfig(config.layout);
            delete config.layout;
        }
    },
    initComponent: function () {
        this.addEvents(
            //渲染自身数据完毕
            'renderModel',
            //渲染完毕
            'render',
            //销毁对象
            'destroy');
    },
    load: function () {
        return modelCreator.create({
            'url': this.url,
            'textParsers': [this.getRefPathParser()],
            'parser': this.parser
        });
    },
    getRefPathParser: function () {
        return this.top.getRefPathParser();
    },
    //主入口，标识组件渲染到何处（dom）
    render: function (renderTo) {
        this.container = $(renderTo || this.renderTo);
        var deferred = $.Deferred();
        try {

            this.fireEvent('beforeRender');
            //记录load的结果
            var loadResult;
            //渲染前准备
            this.onRender();
            var me = this;
            //开始加载数据
            this.load()
                .fail(function (e) {
                    deferred.reject(playerException.create('load error', e));
                })
                .then(functionUtil.createPromiseThen(deferred, function (result) {
                    loadResult = result;
                    me.baseUrl = result.baseUrl;
                    //渲染自身数据
                    return me.renderModel(result.model, result.baseUrl);
                }))
                .fail(function (e) {
                    deferred.reject(e);
                })
                .then(functionUtil.createPromiseThen(deferred, function () {
                    me.fireEvent('renderModel', loadResult.model);
                    //通过布局对象渲染子模块
                    return me.layout && (me.layout.render(me.layoutTarget || me.element));
                }))
                .then(functionUtil.createPromiseThen(deferred, function () {
                    me.fireEvent('afterLayout');
                    return me.afterLayout();
                }))
                .then(function () {
                    loadResult = null;
                    deferred.resolve(me);
                    me.fireEvent('render');
                });
        } catch (e) {
            console.error(e);
            deferred.reject(playerException.create('render error', e));
        }
        return deferred.fail(function (e) {
            playerException.execute(e, me);
        });
    },
    onRender: function () {
        this.element = this.container;
    },
    renderModel: function (model, baseurl) { },
    afterLayout: function () { },
    getElement: function (isJquery) {
        return (isJquery === true) ? this.element : this.element[0];
    },
    addEvents: function (eventConfig) {
        //如果是字符串,表示多个参数,都是字符串
        if (typeof eventConfig === 'string') {
            var events = arguments,
                i = events.length;
            while (i--) {
                this._events[events[i]] = this._events[events[i]] || true;
            }
        }
        //对象一次声明,先放空,回头支持
        //else {
        //
        //}
    },
    fireEvent: function (name) {
        Eventbus.prototype.dispatch.apply(this._eventbus, arguments);
    },
    addEventListener: function (name) {
        Eventbus.prototype.addEventListener.apply(this._eventbus, arguments);
    },
    release: function () {
        this.destroy();
        this.fireEvent('destroy', this);
        //释放dom对象,如果container和element相同只释放子节点，如果不相同完全释放
        if (this.element == this.container) {
            this.element.children().remove();
        } else {
            this.element.remove();
        }
        // if (all) {
        //     if (this.parent && this.parent.container && this.parent.container.find('.ic_paint').length > 0)
        //         this.parent.container.find('.ic_paint').remove()
        // }
    },
    destroy: function () { },
    layout: undefined
};

}, 'class');
__applicationContext.define('core.player.module', function (exports,module,require,$) {
'use strict';
var loaderFactory = require('core.loader.presenterLoaderCreator');
var functionUtil = require('core.utils.function');
var createModel = require('core.common.createModel');
var domUtil = require('core.utils.dom');
var request = require('core.utils.request');
var ModuleModel = require('core.model.ModuleModel');
var logger = require('core.utils.Log');
var stringUtil = require('core.utils.string');
var i18nLoader = require('core.common.i18nLoader');

var ModuleInterface = {
    'Wrap': /^wrap$/,
    'Processer': /^(processBeforeRun|processAfterRun|setCallbackList|setPageExtendConf)$/
};

var createModuleModel = function () {
    var me = this;
    return createModel(this.properties, this.parent.baseUrl, this.getRefPathParser())
        .then(function (model) {
            return $.extend(model, {
                '$': {
                    'presenterId': me.presenterId,
                    'unqiueId': me.id + '@' + me.parent.id,
                    'scope': me.parent.moduleGroupType
                },
                'ID': me.id
            });
        });
};

var createPresenter = function (fnName, baseUrl) {
    var presenter = {};
    try {
        var me = this;
        presenter = window[fnName].apply(window, [me.presenterId]);
        //解析presenter的接口类型
        var _interface = [];
        if (presenter.__interface) {
            for (var name in presenter.__interface) {
                for (var key in ModuleInterface) {
                    if (ModuleInterface[key].test(name)) {
                        _interface.push(key);
                    }
                }
            }
        }
        this._interface = stringUtil.createReg(_interface);
        presenter.__model = this.getModel();

        functionUtil.execute(presenter, {
            'setPlayerController': me.getController(),
            'setUrlParams': request.get(),
            'setBasePath': baseUrl,
            'setPaint': me.top.getPaint()
        });
    } catch (e) {
        logger.error('create presenter[' + fnName + '] error', e);
    }
    return presenter;
};

var lifeCycle = {
    'run': ['run'],
    'show': ['pageShow'],
    'destroy': ['pageLeave', 'destroy'],
    'pageChange': ['pageChange'],
    'afterRender': ['afterRender']
};

module.type = 'class';
module.exports = {
    extend: 'core.player.Component',
    'isRequire': false,
    load: function () {
        var me = this;
        return createModuleModel.call(this)
            .then(function (model) {
                me.presenterModel = model;
                var loader = loaderFactory.create();
                return loader.load(me.refPathParser, me);
            });
    },
    createController: function () {
        var me = this;
        var controller = {
            'addToolItem': function (config, target) {
                if (me.parent.className === 'core.player.tool' && config) {
                    config.renderTo = me.parent.element.find(require('core.player.tool').getItemRender(target));
                    return this.require(config);
                }
            },
            'require': function (config) {
                var presenterId = config.presenterId = (config.presenterId || config.addonId);
                delete config.addonId;
                //定制播放器申明了,用定制播放器的版本,没有的用页面上申明的,防止版本冲突
                var presenter = me.top.getPresenter(presenterId) || me.moduleDependency[presenterId];
                if (presenter) {
                    if (config.isRelative !== false) {
                        ['top', 'left'].forEach(function (name) {
                            config.layout[name] = me.layoutConfig[name] + parseInt(config.layout[name], 10);
                        });
                    }
                    presenter.refPathParser = presenter.refPathParser || me.getRefPathParser();
                    var moduleConfig = new ModuleModel();
                    moduleConfig.setAttributes(config);
                    var module = new me.constructor($.extend(moduleConfig.getValue(), presenter, {
                        isRequire: true
                    }), me.parent);

                    var promise = (config.renderTo) ? module.render(config.renderTo) : me.parent.layout.addModule(module);
                    return promise
                        .then(function () {
                            return me.parent.requireModule(module);
                        })
                        .then(function () {
                            if ($.isFunction(config.callback)) {
                                config.callback(module.getPresenter());
                            }
                            return module.getPresenter();
                        });
                } else {
                    logger.error('require error, do not find addonId[' + presenterId + '] config,please check moduleDependency config');
                }
            },
            'createModule': function (declareModuleId, config) {
                var moduleConfig = me.parent.lazyInitModules[declareModuleId];
                moduleConfig.isRelative = false;
                $.extend(moduleConfig, config);
                return this.require(moduleConfig);
            },
            'getEventBus': function () {
                return {
                    'addEventListener': function (name, listener, options) {
                        var comp = me;
                        options = options || {};
                        while (comp.parent !== comp) {
                            comp.addEventListener(name, {
                                fn: listener.onEventReceived,
                                scope: listener,
                                selector: options.target
                            });
                            comp = comp.parent;
                        }
                    }
                };
            }
        };
        var comp = this,
            parentController;
        while (true) {
            comp = comp.parent;
            parentController = comp.getController();
            for (var key in parentController) {
                if (key in controller) {
                    (function (_value) {
                        controller[key] = function () {
                            return _value;
                        };
                    })($.extend(controller[key](), parentController[key]()));
                } else {
                    controller[key] = parentController[key];
                }
            }
            if (comp.parent == comp) {
                break;
            }
        }
        return controller;
    },
    getPage: function () {
        var page = this.parent;
        //学科工具需要递归判断
        while (page.className != 'core.player.page') {
            page = page.parent;
        }
        return page;
    },
    renderModel: function (model, baseUrl) {
        var deferred = $.Deferred();
        var promise = deferred.resolve();
        try {
            this.moduleDependency = model.getAttribute('moduleDependency');
            this.cssElement = $(domUtil.addStyle(this.css));
            this.presenter = createPresenter.call(this, model.createFnName, baseUrl);
            //如果moduel含有getQuestionInfo方法则将页面设置为题型页面isReportable=true
            if (this.parent.isReportable && this.parent.isReportable() === false && $.isFunction(this.presenter.getQuestionInfo)) {
                this.parent.setReportable(true);
            }
            var me = this;
            if (me.instanceOf('Wrap')) {
                promise = promise.then(function () {
                    return me.runInterface('wrap', me.container[0]);
                }).done(function (target) {
                    me.container = $(target || me.container);
                });
            }
            return promise
                .done(function () {
                    var moduleTemplate;
                    if (!me.top.templateKey) {
                        moduleTemplate = '<div class="addon_${presenterId} ic_module" id="${id}" style="${style}"></div>';
                    } else {
                        moduleTemplate = '<div class="' + me.top.templateKey + '_${presenterId} ic_module" id="${id}" style="${style}"></div>';
                    }
                    me.element = $(stringUtil.applyTemplate(moduleTemplate, me));
                    me.element.css(me.layoutConfig);
                    //comment the blow sentence for complicate IE8,but change appedn to html may cause some error?
                    //me.element.append(modle.getAttribute('view'));
                    me.element.html(model.getAttribute('view'));
                    me.container.append(me.element);
                })
                .then(function () {
                    //如果有语言包导入语言
                    if ($.isFunction(me.presenter.setLocationProperties)) {
                        return i18nLoader.load(baseUrl).done(function (langObject) {
                            me.run('setLocationProperties', langObject);
                        });
                    }
                })
                .done(function () {
                    var initName = 'init' + me.getController().getRuntime();
                    me.run(initName);
                });
        } catch (e) {
            logger.error('init module error', e);
        }
    },
    'getPresenter': function () {
        return this.presenter;
    },
    'getModel': function () {
        return this.presenterModel;
    },
    'getStateId': function () {
        return this.parent.id + this.id;
    },
    'getState': function () {
        return this.run('getState');
    },
    'setState': function (value) {
        //this.run('setState', [value, {isClassroomExam: true}]);
        this.run('setState', value);
    },
    run: function (name, args) {
        try {
            return functionUtil.execute(this.presenter, name, args);
        } catch (e) {
            logger.error('run presenter[' + name + '] error', e);
        }
    },
    runInterface: function (name, args) {
        if (this.presenter && this.presenter.__interface)
            return functionUtil.execute(this.presenter.__interface, name, args);
    },
    instanceOf: function (name) {
        return this._interface.test(name);
    },
    runLifeCycle: function (name) {
        var me = this;
        var args = [me.getElement(), me.getModel()];
        var taskList = [];
        lifeCycle[name].forEach(function (lifeName) {
            taskList.push({
                'fn': me.presenter[lifeName],
                'args': args,
                'scope': me.presenter,
                'name': me.presenterId + ':' + lifeName
            });
        });
        return functionUtil.runSequence(taskList, 'run presenter lifecycle');
    },
    destroy: function () {
        if (this.cssElement) {
            this.cssElement.remove();
        }
        this.runLifeCycle('destroy');
    },
    getZIndex: function () {
        return this['z-index'];
    }
};

}, 'class');
__applicationContext.define('core.player.modulegroup', function (exports,module,require,$) {
'use strict';
var Module = require('core.player.Module');
var Collection = require('core.model.Collection');
var logger = require('core.utils.Log');
var functionUtil = require('core.utils.function');

module.type = 'class';
module.exports = {
  extend: "core.player.Component",
  initComponent: function () {
    require("core.player.ModuleGroup").prototype.superClass.initComponent.call(this);
    this.processPresenters = [];
    this.lazyInitModules = {};
  },
  renderModel: function (model) {
    var me = this;
    this.items = new Collection();
    this.items_state = {};
    this.itemIds = [];
    if (model) {
      //页面上的presenter申明
      var presenters = model.getAttribute('presenters') || {};
      model.getAttribute('modules').forEach(function (moduleConfig) {
        moduleConfig = moduleConfig.getValue();
        //不解析加载延时加载的module，交给createModule方法调用
        if (moduleConfig['lazy-init'] === true) {
          me.lazyInitModules[moduleConfig.id] = moduleConfig;
        } else {
          //定制播放器申明了,用定制播放器的版本,没有的用页面上申明的,防止版本冲突
          var presenter = me.top.getPresenter(moduleConfig.presenterId) || presenters[moduleConfig.presenterId];
          if (presenter) {
            //为空说明不是定制播放器上的,使用课件的refPath
            presenter.refPathParser = presenter.refPathParser || me.getRefPathParser();
            me.items.add(moduleConfig.id, new Module($.extend(moduleConfig, presenter), me));
            me.itemIds.push(moduleConfig.id);
          } else {
            logger.error('do not find [' + moduleConfig.presenterId + ']presenter config');
          }
        }
      });
    }
  },
  getModuleList: function () {
    return this.itemIds;
  },
  getModule: function (key) {
    var presenter;
    if (this.items) {
      var module = this.items.getByKey(key);
      presenter = module && module.getPresenter();
    }
    return presenter;
  },
  getModulesByType: function (type) {
    var list = [];
    this.items.getArray().forEach(function (module) {
      if (module.presenterId == type) {
        list.push(module.getPresenter());
      }
    });
    return list;
  },
  //运行module的周期
  runModuleLifeCycle: function (name) {
    var reg = /^(run|show|afterRender)$/;
    var promises = [];
    var me = this;
    this.items.forEach(function (module) {
      if ((!reg.test(name)) || !module.isRequire) {
        var model = module.getModel();
        var view = module.getElement();
        promises.push(module.runLifeCycle(name, view, model));
      }
    });
    return $.when.apply($, promises);
  },
  _setModuleState: function (module) {
    var stateValue = this.top.getStateValue(module.getStateId());
    if (stateValue) {
      module.setState([stateValue, this.gotoConfig ? (this.gotoConfig.options || {}) : {}]);
    }
  },
  requireModule: function (module) {
    var me = this;
    this.items.add(module.id, module);
    this.items_state[module.id] = false;
    this.itemIds.push(module.id);
    if (module.instanceOf('Processer')) {
      this.processPresenters.push(module);
    }

    //如果是处理器,未运行run周期，就将其他presenter传给自己,同时将回调列表传给对应的presenter
    if (module.instanceOf('Processer')) {
      this.processPresenters.push(module);
      this.items.forEach(function (item) {
        module.runInterface('setCallbackList', item.top.getCallbackList());
        module.runInterface('processBeforeRun', item.getPresenter());
        if(me.gotoConfig && me.gotoConfig.__extendConfig){
           module.runInterface('setPageExtendConf', me.gotoConfig.__extendConfig);
        }
      });
    }
    this.processPresenters.forEach(function (processer) {
      //防止重复跑自己的发现
      if (processer != module) {
        processer.runInterface('setCallbackList', module.top.getCallbackList());
        processer.runInterface('processBeforeRun', module.getPresenter());
        if(me.gotoConfig && me.gotoConfig.__extendConfig){
           processer.runInterface('setPageExtendConf',me.gotoConfig.__extendConfig)
        }
      }
    });
    var taskList = [];
    ['run', this._setModuleState, 'show', 'afterRender'].forEach(function (name) {
      if ($.isFunction(name)) {
        taskList.push({
          fn: name,
          args: [module],
          scope: me,
          name: 'setState'
        });
      } else {
        taskList.push({
          fn: module.runLifeCycle,
          args: [name],
          scope: module,
          name: name
        });
      }
    });
    return functionUtil.runSequence(taskList).done(function () {
      me.items_state[module.id] = true;
      //如果是处理器,如果已运行完自身的run周期，就将其他presenter传给自己
      if (module.instanceOf('Processer')) {
        me.items.forEach(function (item, itemid) {
            if (me.items_state[itemid]) {
                module.runInterface('processAfterRun', item.getPresenter());
            }
        });
      }
      me.processPresenters.forEach(function (processer) {
        //防止重复跑自己的发现，
        if (processer != module) {
          processer.runInterface('processAfterRun', module.getPresenter());
        }
      });
    });
  },
  afterLayout: function () {
    var me = this;
    this.items.forEach(function (module) {
      if (!module.isRequire) {
        //容器扩展接口
        if (module.instanceOf('Processer') === true) {
          me.processPresenters.push(module);
        }
        //添加事件关联,require的module不支持event、handler
        if (module.events.length) {
          module.events.forEach(function (handlers, eventName) {
            handlers.forEach(function (handler) {
              var _handlerModule = me.items.getByKey(handler.id);
              if (_handlerModule && (handler.name in _handlerModule.getPresenter())) {
                _handlerModule.getController().getEventBus().addEventListener(eventName, {
                  'onEventReceived': function (name, data) {
                    _handlerModule.run(handler.name, data);
                  }
                });
              }
            });
          });
        }
        delete module.events;
      }
    });

    this.processPresenters.forEach(function (processModule) {
      me.items.forEach(function (module) {
        processModule.runInterface('setCallbackList', me.top.getCallbackList());
        processModule.runInterface('processBeforeRun', module.getPresenter());
        if(me.gotoConfig && me.gotoConfig.__extendConfig){
           processModule.runInterface('setPageExtendConf',me.gotoConfig.__extendConfig)
        }
      });
    });
    var taskList = [];
    this.modulelifeCycles.forEach(function (name) {
      if ($.isFunction(name)) {
        taskList.push({
          fn: name,
          args: [],
          scope: me,
          name: name
        });
      } else {
        taskList.push({
          fn: me.runModuleLifeCycle,
          args: [name],
          scope: me,
          name: name
        });
      }
    });
    return functionUtil.runSequence(taskList).done(function () {
      me.processPresenters.forEach(function (processModule) {
        me.items.forEach(function (module) {
          if (!module.isRequire) {
            processModule.runInterface('processAfterRun', module.getPresenter());
          }
        });
      });
    });
  },
  destroy: function () {
      if (this.items) {
          this.items.forEach(function (module) {
              module.release();
          });
      }
  },
  'modulelifeCycles': ['run', 'show', 'afterRender'],
  layout: 'core.layout.pageAbsoluteLayout'
};

}, 'class');
__applicationContext.define('core.player.page', function (exports,module,require,$) {
'use strict';
var parser = require("core.model.parser.pageXmlParser");

var setState = function() {
    var me = this;
    this.items.forEach(function(module) {
        if (!module.isRequire) {
            var stateValue = me.top.getStateValue(module.getStateId());
            if (stateValue) {
                module.setState([stateValue, me.gotoConfig.options || {}]);
            }
        }
    });
};
module.type = "class";
module.exports = {
    extend: "core.player.ModuleGroup",
    initComponent: function() {
        require("core.player.Page").prototype.superClass.initComponent.call(this);
        this.reportable = false;
        this.gotoConfig = this.gotoConfig || {};
        this.addEvents(
            //当前主页面加载渲染完毕(包括通用页面也加载渲染完毕)
            'PageLoaded'
        );
    },
    'moduleGroupType': 'page',
    //通用页一次渲染的才调用
    pageChange: function() {
        this.runModuleLifeCycle('pageChange');
    },
    onRender: function() {
        this.element = $('<div class="ic_page"></div>');
        this.container.append(this.element);
    },
    getState: function() {
        var value, stateMap = {};
        if (this.items)
            this.items.forEach(function(module) {
                value = module.getState();
                if (value) {
                    stateMap[module.getStateId()] = value;
                }
            });
        return stateMap;
    },
    setReportable: function(reportable) {
        this.reportable = reportable;
    },
    isReportable: function() {
        return this.reportable;
    },
    'modulelifeCycles': ['run', setState, 'show', 'afterRender'],
    parser: parser
};
}, 'class');
__applicationContext.define('core.player.player', function (exports,module,require,$) {
'use strict';
var mainParser = require("core.model.parser.mainXmlParser");
var Page = require("core.player.page");
var request = require('core.utils.request');
var refPathBuilder = require('core.common.refPathBuilder');
var playerConfig = require('core.common.playerConfig');
var eventname = require('core.eventbus.eventname');
var urlUtil = require('core.utils.url');
var table = require('core.model.table');
var logger = require('core.utils.Log');
var State = require('core.state.SimpleState');
var functionUtil = require('core.utils.function');
var i18nLoader = require('core.common.i18nLoader');
var PlayerFlow = require('core.common.PlayerFlow');
var toolApi = require('core.common.tool.toolapi');
var gotoPageController = require('core.common.player.gotopage');
var createModel = require('core.common.createModel');

//创建Page,需要指定scope
var createPage = function (pageConfig) {
  return new Page(pageConfig, this);
};

var presenterGetter = {
  'page': function () {
    if (this.activePage.items) {
      return this.activePage.items.getArray();
    } else {
      return [];
    }
  },
  'tool': function () {
    var list = [];
    this.toolList.all.forEach(function (tool) {
      if (tool.items) {
        list = list.concat(tool.items.getArray());
      }
    });
    return list;
  },
  'common': function () {
    var list = [];
    this.commonPages.forEach(function (page) {
      if (page.items) {
        list = list.concat(page.items.getArray());
      }
    });
    return list;
  }
};
var allPresenterGetter = [];
for (var key in presenterGetter) {
  allPresenterGetter.push(key);
}

module.type = "class";
module.exports = {
  extend: "core.player.Component",
  initComponent: function () {
    require("core.player.Player").prototype.superClass.initComponent.call(this);
    this.waitDialog = this.waitDialog || require('core.common.defaultWaitDialog');
    this.pages = [];
    this.state = new State(this.stateToken);
    //默认显示第一页
    this.currentPageIndex = 0;
    //设置refPath
    this.refPathParser = refPathBuilder.build(this.refPath, this.url);
    this.oriRefPathParse = this.refPathParser
    //设置全局的refPath,为qti等使用
    var _refPath = this.getRefPathParser().getRefPath();
    icCreatePlayer.ref_path = _refPath['ref-path'];
    icCreatePlayer.ref_path_addon = _refPath['ref-path-addon'];
    icCreatePlayer.ref_path_tool = window.decodeURIComponent(require('core.utils.request')('ref-path-tool')) || this.playerCode;
    var lang = this.location.default_lang;
    lang = (this.location.current === undefined || this.location.current === '') ? lang : this.location.current;
    icCreatePlayer.lang = lang;
    //为了方便清空module添加的事件,将pageLoaded事件设定在各自页上
    this.addEventListener('PageLoaded', function () {
      this.activePage.fireEvent('PageLoaded');
      this.commonPages.forEach(function (page) {
        page.fireEvent('PageLoaded');
      });
    }, this);
    //toolList:存放学科工具
    this.toolList = {
      list: {
        top: [],
        bottom: []
      },
      all: [],
      active: ''
    };
    this.i18nModel = {};
    i18nLoader.setLocation(this.location);
    this.playerFlows = {};
    this.TOOL.TOOLCONTROL = toolApi.create(this);
    require('core.common.printscreen').printScreen(this._eventbus);
    console.log('player version : 11.7.3')
  },
  getI18nModel: function (key) {
    var lang = icCreatePlayer.lang;
    var text;
    if (!text && !this.i18nModel.player) {
      text = require('core.locations.' + lang + '.lang');
      if (!text) {
        text = require('core.locations.' + lang.split('_')[0] + '.lang');
      }
      // 兼容暂不支持的语言，使用英文版
      if (!text) {
        text = require('core.locations.zh_CN.lang');
      }
      this.i18nModel.player = text ? text : key;
    }
    return this.i18nModel;
  },
  getRefPathParser: function (key) {
    //缺省取课件的refPath
    return this.refPathParser[key || 'courseware'];
  },
  getCallbackList: function () {
    return this.callbackList || {}
  },
  render: function (renderTo) {
    this.container = $(renderTo);
    return this.renderPromise = require("core.player.Player").prototype.superClass.render.call(this, renderTo);
  },
  load: function () {
    var me = this;
    //下载定制播放器的配置
    return playerConfig.create(this.playerCode, this.refPathParser.playerConfig)
      .then(function () {
        //在这里已经完成了自动加载lib库添加字体样式引用i18n_css
        me.element.addClass('typefaces_' + me.location.current);
        return require("core.player.Player").prototype.superClass.load.call(me);
      });
  },
  onRender: function () {
    this.element = $('<div class="ic_player"></div>');
    this.container.append(this.element);
  },
  setContainerFontSize: function (fontSize) {
    if (this.adaptFlag || this.adaptFlag == undefined) {
      icCreatePlayer.fontSize = fontSize;
      this.container.css('font-size', fontSize + 'px');
    }
  },
  getCurrentPageIndex: function () {
    return this.currentPageIndex;
  },
  closeActivePage: function () {
    gotoPageController.closeActivePage.apply(this);
  },
  gotoPageIndex: function (index, config) {
    gotoPageController.gotoPageIndex.apply(this, [index, config]);
  },
  //注册流程
  registerFlow: function (key, flowConfig) {
    this.playerFlows[key] = new PlayerFlow(flowConfig, key, this);
  },
  //启动流程
  startFlow: function (key, data, scb, fcb) {
    var flow = this.playerFlows[key];
    if (flow) {
      flow.start(data, data && data.scope, scb, fcb);
    } else {
      logger.log('not exist' + key + ' flow');
      //throw '不存在' + key + '流程';
    }
  },
  destroy: function () {
    this.closeActivePage();
    this.clearTool();
    if (this.commonPages) {
      this.commonPages.forEach(function (page) {
        page.release();
      });
      this.commonPages = null;
    }
  },
  //遍历presenter
  eachPresenter: function (fn, scope) {
    scope = scope || allPresenterGetter;
    if (!$.isArray(scope)) {
      scope = [scope];
    }
    var list = [];
    var self = this;
    scope.forEach(function (key) {
      var fn = presenterGetter[key];
      if (fn) {
        list = list.concat(fn.call(self) || []);
      }
    });
    list.forEach(fn);
  },
  getStateValue: function (key) {
    return this.state.getState(key);
  },
  gotoPage: function (name, config) {
    gotoPageController.gotoPage.apply(this, [name, config]);
  },
  gotoPageId: function (id, config) {
    gotoPageController.gotoPageId.apply(this, [id, config]);
  },
  'firstPage': function () {
    gotoPageController.firstPage.apply(this);
  },
  'lastPage': function () {
    gotoPageController.lastPage.apply(this);
  },
  'nextPage': function () {
    gotoPageController.nextPage.apply(this);
  },
  'prevPage': function () {
    gotoPageController.prevPage.apply(this);
  },
  /**
   * 增加拓展页
   * @param config
   */
  "addExtendPage": function (config) {
    var me = this;
    this.refPathParser = refPathBuilder.build(this.refPath, config["ref-path"]);
    var _refPath = this.getRefPathParser().getRefPath();
    icCreatePlayer.ref_path = _refPath['ref-path'];
    icCreatePlayer.ref_path_addon = _refPath['ref-path-addon'];
    icCreatePlayer.ref_path_tool = window.decodeURIComponent(require('core.utils.request')('ref-path-tool')) || this.playerCode;
    this.top.layout.activePage()
    this.closeActivePage();
    config.url = config.url || config.href || "";
    if (config.hidePage) {
      config.hidePage.split(',').forEach(function (name) {
        me.layout.switchCommonPage(name, false);
      });
    }
    this.activePage = createPage.call(this, $.extend(config,{
      "pageType": "extendPage"
    }));
    this.layout.renderPage();
  },
  /**
   * 获取当前页类型
   * @returns {number}
   */
  'getPageType': function () {
    if (this.activePage) {
      switch (this.activePage.pageType) {
        case 'extendPage':
          return 1;
        default:
          return 0;
      }
    }
    return 0;
  },
  /**
   * 关闭拓展页
   */
  'closeExtendPage': function () {
    this.refPathParser = this.oriRefPathParse
    var _refPath = this.getRefPathParser().getRefPath();
    icCreatePlayer.ref_path = _refPath['ref-path'];
    icCreatePlayer.ref_path_addon = _refPath['ref-path-addon'];
    icCreatePlayer.ref_path_tool = window.decodeURIComponent(require('core.utils.request')('ref-path-tool')) || this.playerCode;
    this.gotoPageIndex(this.currentPageIndex);
  },
  'mediaPause': function () {
    try {
      var mediaTags = ["video", "audio"];
      var docs = [document];
      var iframes = document.getElementsByTagName("iframe");
      for (var i = 0, iframe; iframe = iframes[i]; i++) {
        if (iframe.src) {
          docs.push(iframe.contentWindow.document);
        }
      }
      mediaTags.forEach(function (tagName) {
        docs.forEach(function (doc) {
          var mediaElList = doc.getElementsByTagName(tagName),
            mediaEl;
          for (i = 0; mediaEl = mediaElList[i]; i++) {
            mediaEl.pause && mediaEl.pause();
          }
        });
      });
    } catch (e) {
      console.log(e);
    }

  },
  renderModel: function (model, baseUrl) {
    playerConfig.loadCss(model && model.getAttribute('css'));
    var pageConfig = {
      'url': ''
    };
    this.commonPages = new table();
    if (this.pageUrl) {
      pageConfig = {
        url: this.pageUrl
      };
    } else if (model) {
      var me = this;
      this.pages = model.getPages();
      this.pages.forEach(function (page) {
        page.preview = page.preview && urlUtil.resolve(baseUrl, page.preview);
      });
      //获取开始页码
      if (this.startPageIndex) {
        this.currentPageIndex = parseInt(this.startPageIndex, 10);
      } else if (this.startPageId) {
        this.currentPageIndex = this.pages.getIndexOfById(this.startPageId);
      } else if (this.startPageName) {
        this.currentPageIndex = this.pages.getIndexOfByName(this.startPageName);
      }
      if (this.currentPageIndex >= 0) {
        pageConfig = this.pages.getByIndex(this.currentPageIndex);
      }
      //定制播放器上配置的通用页
      this.commonPages = playerConfig.getCommons(this.commonPages, functionUtil.createDelegate(createPage, null, null, this));
      if (this.hidePage) {
        this.hidePage.split(',').forEach(function (name) {
          me.commonPages.removeItem(name);
        });
      }
    }
    this.activePage = createPage.call(this, pageConfig);
  },
  createController: function () {
    return require('core.common.player.controller').createController.apply(this);
  },
  getPresenter: function (name) {
    var presenter = playerConfig.getPresenter(name);
    if (presenter) {
      presenter.refPathParser = this.getRefPathParser('playerConfig');
    }
    return presenter;
  },
  getPaint: function () {
    return this.toolPaint;
  },

  getEventName: function () {
    return eventname;
  },
  getUtils: function () {
    return icCreatePlayer.utils;
  },
  /**
   * update tool box's display title, push button and so on
   */
  updateToolProperties: function (stoolkey, dtoolkey) {
    this.TOOL.TOOLCONTROL.updateToolProperties.apply(this, [stoolkey, dtoolkey]);
  },
  /**
   * [addTool description]
   * @param {[type]} url           [description]
   * @param {[type]} options       [options.width="100%"; options.__sys={syncId:'',hide:['header','toolbar'],disable:['min','move','close']}]
   * @param {[type]} state         [description]
   * @param {[type]} extendOptions [description]
   */
  addTool: function (url, options, state, extendOptions) {
    return this.TOOL.TOOLCONTROL.addTool.apply(this, [url, options, state, extendOptions]);
  },
  getToolList: function () {
    return this.TOOL.TOOLCONTROL.getToolList.apply(this);
  },
  /**
   * 判断是否已经超过限制
   * @param listType:bottom工具窗，top:上层的工具
   * @returns {boolean}
   */
  isMaxToolCount: function (listType) {
    return this.TOOL.TOOLCONTROL.isMaxToolCount.apply(this, [listType]);
  },
  clearTool: function () {
    this.TOOL.TOOLCONTROL.clearTool.apply(this);
  },

  //兼容处理，由于unqiueId与toolKey不可能 一样 把unqiueId也可能为toolKey
  removeTool: function (unqiueId, scope, NONEventFlag) {
    this.TOOL.TOOLCONTROL.removeTool.apply(this, [unqiueId, scope, NONEventFlag]);
  },
  parser: mainParser,
  layout: 'div',
  //兼容之前的版本
  'getPlayerServices': function () {
    return this.getController();
  },
  'onPageLoaded': function (fn) {
    this.addEventListener('PageLoaded', fn, this);
  },
  /**
   * 以后学科工具相关的API移至TOOL下面
   */
  TOOL: {
    TOOLCONTROL: {},
    DATA: {
      bottom: {
        'MAXLIMIT': request('bottomlimit') || 3
      },
      top: {
        'MAXLIMIT': request('toplimit') || 10000
      },
      PUSHING: false,
      CURRENTPUSHTOOL: null,
      DIALOG: {
        STEPLEFT: 0,
        STEPTOP: 0
      }
    }
  }
};

}, 'class');
__applicationContext.define('core.player.tool', function (exports,module,require,$) {
'use strict';
var parser = require('core.model.parser.toolParser'),
  createModel = require('core.common.createModel'),
  logger = require('core.utils.Log'),
  Layout = require('core.layout.Layout'),
  eventname = require('core.eventbus.eventname'),
  playerException = require('core.exception.playerException'),
  isInPath = require('core.common.ispointinpath'),
  pptshell = require('core.bridge.pptshell'),
  stringUtil = require('core.utils.string'),
  tHelper = require('core.common.tool.tool'),
  toolLayout = require('core.common.layout.tool'),
  tooldialog = require('core.common.tool.tooldialog'),
  toolPush = require('core.common.tool.toolpush'),
  throttle = require('core.utils.throttle'),
  singleTools = {},
  toolLoadState = {}, //有三种状态 none,pending,done
  htmlMapping = {
    'up': '<div class="ic_tool"><div class="com_tooldialog_pop dialog_${id}" style="display:none;z-index:9999;position:fixed"><div class="com_tooldialog_pop_box"><div class="com_tooldialog_pop_main"><p class="com_tooldialog_pop_txt">${tip_for_xp}</p></div></div></div></div>',
    'down': '<div class="tooldialog_control ${id}" style="visibility: hidden"><div class="tooldialog_wrap"><div class="com_tooldialog_pop com_tooldialog_pop_tips hide_dom _icplayer_fullscreen_tip"><div class="com_tooldialog_pop_box"><div class="com_tooldialog_pop_main"><p class="com_tooldialog_pop_txt">${tip_full}</p></div></div></div><div class="tooldialog_head"><p class="tooldialog_title"><span class="tooldialog_title_icon"><img src="${smallIcon}"/></span><em class="title">${toolName}</em></p><div class="tooldialog_com_header_time" style="display:none"><div class="tooldialog_com_time"><div class="tooldialog_time_default "><span class="tooldialog_time_m"><em>00</em></span><i>:</i><span class="tooldialog_time_s"><em>00</em></span></div></div></div><div class="tooldialog_headleft"></div></div><div class="tooldialog_content"></div><div class="sidetool lefttool"><div class="tool_wrap"><a class="_icplayer_push_button btn_tool tool_push ${ispushing}" style="display: ${display}"><div class="tool_push_icon"><div class="tool_push_icon_main"><span class="tool_push_icon_nor"></span><span class="tool_push_icon_end"></span></div></div></a><a class="btn_tool tool_small"></a><div class="tool_ctrol"><a class="btn_tool tool_close"></a><div class="tool_tip tool_tip_small" style="display: none;"><div class="tool_tip_wrap"><p class="tip_text" style="display: none;" id="tip_next_push"><em class="text">${pushed_tip}</em></p><p class="tip_text"><em class="text">${tip}</em></p><a class="btn_tool_tip"><em class="btn_text">${sure}</em></a><a                                class="btn_tool_tip"><em class="btn_text">${cancel}</em></a></div></div></div><a class="btn_tool tool_full"></a><a class="btn_tool to_fullscreen _icplayer_tool_fullscreen"></a></div><div class="tool_wrap_mask hide_dom"></div></div><div class="sidetool righttool"><div class="tool_wrap"><a class="_icplayer_push_button btn_tool tool_push ${ispushing}" style="display: ${display}"><div class="tool_push_icon"><div class="tool_push_icon_main"><span class="tool_push_icon_nor"></span><span class="tool_push_icon_end"></span></div></div></a><a class="btn_tool tool_small"></a><div class="tool_ctrol"><a class="btn_tool tool_close"></a><div class="tool_tip tool_tip_small" style="display: none;"><div class="tool_tip_wrap"><p class="tip_text" id="tip_next_push" style="display: none;"><em class="text">${pushed_tip}</em></p><p class="tip_text"><em class="text">${tip}</em></p><a class="btn_tool_tip"><em class="btn_text">${sure}</em></a><a                                class="btn_tool_tip"><em class="btn_text">${cancel}</em></a></div></div></div><a class="btn_tool tool_full"></a><a class="btn_tool to_fullscreen _icplayer_tool_fullscreen"></a></div><div class="tool_wrap_mask hide_dom"></div></div><div class="com_tooldialog_pop dialog_${id}" style="display:none;z-index:9999"><div class="com_tooldialog_pop_box"><div class="com_tooldialog_pop_main"><p class="com_tooldialog_pop_txt">${tip_for_xp}</p></div><div class="com_tooldialog_pop_foot"><a class="com_tooldialog_pop_btn close_${id}">${close}</a></div></div></div></div></div>'
  },
  defaultToolPosition = {
    top: 0,
    left: 0,
    visibility: 'visible'
  },
  _left = 0,
  _top = 0,
  _position = [],
  _maxCount = 3,
  itemLayout = {
    'right': 'tooldialog_com_header_time',
    'left': 'tooldialog_headleft'
  };

var adjustLeftTop = function () {
  var me = this;
  if (me.top.toolList.list.bottom.length === 0) {
    _left = _top = 0;
  }
  if (me.toolConfig.independent !== true) {
    if (!me.top.TOOL.DATA.PUSHING) {
      me.element.find('.tool_push').removeClass('on');
    }
    //100%模式。只支持一个工具
    if (me.dialogModel.__type !== 'pc') {
      me.element.css({
        'visibility': 'visible'
      });
    } else {
      var left = Math.floor(($('body').width() - icCreatePlayer.fontSize * 60) / 2) + _left;
      var top = Math.floor(($('body').height() - icCreatePlayer.fontSize * 33.75) / 2) + _top;
      me.top.TOOL.DATA.DIALOG.STEPLEFT = icCreatePlayer.fontSize * 4 * 0.75;
      me.top.TOOL.DATA.DIALOG.STEPTOP = icCreatePlayer.fontSize * 2.66667 * 0.75;
      if (_position.length === 0) {
        _position = [{
          used: false,
          unqiueId: undefined,
          left: left,
          top: top
        }, {
          used: false,
          unqiueId: undefined,
          left: left + me.top.TOOL.DATA.DIALOG.STEPLEFT,
          top: top + me.top.TOOL.DATA.DIALOG.STEPTOP
        }, {
          used: false,
          unqiueId: undefined,
          left: left + 2 * me.top.TOOL.DATA.DIALOG.STEPLEFT,
          top: top + 2 * me.top.TOOL.DATA.DIALOG.STEPTOP
        }];
      }
      var index = tHelper.getPositionIndex(_position);
      me.element.css({
        'left': _position[index].left,
        'top': _position[index].top,
        'visibility': 'visible'
      });
      tHelper.updatePositionUsed(_position, index, me.unqiueId);
    }
  }
}
var toolInit = function () {
  var me = this;
  var _options = me.options;
  if (this.toolConfig) {
    //this.options.__sys.toolKey = this.key;
    this.options.__sys.toolKey = this.toolKey;
    var promise = toolExecute.apply(this, arguments);
    return $.when(promise).then(function () { });
  }
};

var hideTip = function (tip) {
	setTimeout(function(){tip.addClass('hide_dom')},2000)
}

var setState = function () {
  var me = this;
  this.items.forEach(function (item) {
    if (!item.isRequire && me.state) {
      me.state = JSON.parse(me.state);
      var stateValue = me.state[me.toolKey + me.syncId];
      if (stateValue) {
        item.setState([stateValue, me.options || {}]);
      }
    }
  });
};
var toolExecute = function (options) {
  var deferred = jQuery.Deferred();
  if (this.toolConfig) {
    var executeName = this.toolConfig.execute;
    if (executeName) {
      this.top.toolList.active = (this.toolConfig.independent === true) ? 'top' : 'bottom';
      var __options = this.options;
      // delete __options.__sys;
      return this.mainModule.runInterface(executeName, options || this.options.executeArgs || __options);
    } else {
      deferred.resolve();
    }
  } else {
    deferred.resolve();
  }

};
module.type = 'class';
module.exports = {
  extend: "core.player.ModuleGroup",
  'static': {
    'getItemRender': function (name) {
      return '.tooldialog_head > .' + itemLayout[name];
    },
    'getTool': function (url, options, toolList) {
      var key = tHelper.getToolKey(url, options);
      if (options && options.toolKey) {
        key = options.toolKey;
      }
      var tool = singleTools[key];
      if (tool) {
        toolExecute.call(tool.instance, options);
        return tool.instance;
      } else {
        tool = toolList.filter(function (item) {
          return (key === tHelper.getToolKey(item.key) && item.syncId === options.__sys.syncId);
        });
        tool = tool[0];
        if (tool) {
          toolExecute.call(tool, options);
          return tool;
        }
      }
    },
    'removeTool': function (url) {
      var key = tHelper.getToolKey(url),
        tool = singleTools[key];
      if (tool) {
        toolLoadState[key] = undefined;
        singleTools[key] = undefined;
      }
    },
    'toolLoadState': toolLoadState,
    'singleTools': singleTools,
    /**
     * 关闭
     * @return {[type]} [description]
     */
    'bridgeClose': function () {
      pptshell.tool.close();
    }
  },
  initComponent: function () {
    require("core.player.Tool").prototype.superClass.initComponent.call(this);
    this.syncId = this.unqiueId;
    this.dialogModel = tHelper.getDialogModel(this.options);
    this.toolKey = tHelper.getToolKey(this.key);
    if (this.options.__sys.syncId) {
      this.syncId = this.options.__sys.syncId;
    } else {
      this.options.__sys.syncId = this.syncId;
    }
    this.addEvents(
      //学科工具上移动鼠标(pad上对应touch)
      'mousemove',
      //学科工具上点下鼠标(pad上对应touch)
      'mousedown',
      //学科工具上放开鼠标(pad上对应touch)
      'mouseup');
  },
  createController: function () {
    var me = this;
    return {
      'getCommands': function () {
        return {
          'closeTool': function (NONEventFlag) {
            me.release(NONEventFlag);
          }
        };
      }
    };
  },
  show: function (cssOption) {
    if (cssOption) {
      this.element.css(cssOption);
    } else {
      this.element.show();
    }
  },
  hide: function (cssOption) {
    if (cssOption) {
      this.element.css(cssOption);
    } else {
      this.element.hide();
    }
  },

  getState: function () {
    var value, stateMap = {};
    this.items.forEach(function (item) {
      value = item.getState();
      if (value) {
        stateMap[item.parent.toolKey + item.parent.syncId] = value;
      }
    });
    return stateMap;
  },
  'moduleGroupType': 'tool',
  renderModel: function (model, baseurl) {
    require("core.player.Tool").prototype.superClass.renderModel.call(this, model);
    model = model.getValue();
    var me = this,
      el;
    return createModel(model.properties, baseurl, this.getRefPathParser())
      .then(function (_model) {
        me.toolConfig = _model;
        if (window.icCreatePlayer.request('hidepush') === 'true') {
          _model.push = false;
        }
        if (_model.toolKey === undefined)
          _model.toolKey = me.toolKey;
        var _listType = _model.independent ? 'top' : 'bottom';
        if (_listType === 'top' && icCreatePlayer.plugin.webglControl) {
          var topExcess = icCreatePlayer.plugin.webglControl.isToolsExcess(me.toolKey);
          if (topExcess) {
            toolLoadState[me.toolKey] = undefined;
            return $.Deferred().reject(playerException.create('top tool exceed max', new Error("player 11.7.3: " + "exceed max")));
          }
        } else {
          if (tHelper.isOverMaxLimit(me.top, _listType)) {
            toolLoadState[me.toolKey] = undefined;
            var limitClass = '._icplayer_limit_tip'
            var _tip = me.top.layout.$toolTarget.find(limitClass).find('.com_tooldialog_pop_txt');
            _tip.find('#maxlimit').html(me.top.TOOL.DATA[_listType].MAXLIMIT);
            _tip.find('#classtool').html(me.top.getI18nModel().player['Tool_' + _listType])
            me.top.layout.$toolTarget.find(limitClass).show();
            window.setTimeout(function () {
              me.top.layout.$toolTarget.find(limitClass).hide();
            }, 3000);
            return $.Deferred().reject(playerException.create('exceed max', new Error("player 11.7.3: " + "exceed max")));
          }
        }
        if (_model.toolType === 'pageTool') {
          el = $(htmlMapping.up);
          me.top.activePage.element.append(el)
          me.element = el;
        } else if (_listType === 'bottom') {
          var modelType = me.dialogModel;
          if (modelType.__type == 'pc' && me.toolConfig.enableFull === true) {
            modelType.disabledFull = false
            modelType.no_full = false
          } else if (modelType.__type == 'pc' && me.toolConfig.enableFull === false) {
            modelType.disabledFull = true
            modelType.no_full = false
          } else {
            modelType.disabledFull = true
            modelType.no_full = true
          }
          el = $(stringUtil.applyTemplate(htmlMapping.down, {
            'toolName': me.options.__sys.toolName || ((_model.toolKey ? tHelper.getToolNameI18n(me.top.getI18nModel().tool, _model.toolKey) : _model.toolName)),
            'display': (_model.push ? 'block' : 'none'),
            'smallIcon': (_model.smallIcon || ''),
            'ispushing': toolPush.pushDomStatus.apply(me) ? 'on' : 'click_disabled',
            'push': (me.top.getI18nModel().player['Tool_Push']),
            'pushed_tip': (me.top.getI18nModel().player['Tool_Pushed_Tip']),
            'tip': (me.top.getI18nModel().player['Tool_Tip']),
            'cancel': (me.top.getI18nModel().player['Tool_Cancel']),
            'sure': (me.top.getI18nModel().player['Tool_Sure']),
            'id': me.unqiueId,
            'tip_full': (me.top.getI18nModel().player['Tool_full']),
            'tip_for_xp': (me.top.getI18nModel().player['Tool_Not_Support']),
            'close': (me.top.getI18nModel().player['Tool_See'])
          }));
          me.element.append(el);
          tooldialog.setDisplayMode.apply(me, [modelType, false, el])
          me.element = el;
          me.layoutTarget = me.element.find('.tooldialog_content');
          tooldialog.initEvent.apply(me, [modelType]);
          if (_model.supportXP === false && icCreatePlayer.utils.getOS() === "xp") {
            me.element.find('.dialog_' + me.unqiueId).css("display", "")
            if (me.dialogModel && (me.dialogModel.disabledClose || me.dialogModel.__type === "pre")) {
              me.element.find('.close_' + me.unqiueId).css("display", "none")
            }
            me.element.find('.close_' + me.unqiueId).click(function () {
              me.container.find('.sideicon.' + me.unqiueId).remove();
              me.release()
            })
          }
        } else {
          el = $(stringUtil.applyTemplate(htmlMapping.up, {
            'id': me.unqiueId,
            'tip_for_xp': (me.top.getI18nModel().player['Tool_Not_Support'])
          }));
          me.element.parent().append(el);
          me.element = el;
          if (_model.supportXP === false && icCreatePlayer.utils.getOS() === "xp") {
            me.element.find('.dialog_' + me.unqiueId).css("display", "")
            hideTip(me.element.find('.dialog_' + me.unqiueId))
            toolLoadState[me.toolKey] = undefined;
            return $.Deferred().reject(playerException.create('top tool exceed max', new Error("player 11.7.3: " + "exceed max")));
          }
        }

        adjustLeftTop.apply(me);
        me.toolConfig.execute = me.toolConfig.execute || 'execute';
        toolLoadState[me.toolKey] = 'done';
        if (me.toolConfig.singleton) {
          singleTools[me.toolKey] = {
            instance: me,
            count: 1
          };
        }
        me.layoutConfig = $.extend({},
          defaultToolPosition,
          Layout.createLayoutConfig(model.layout),
          Layout.createLayoutConfig(me.options, ['visibility', 'display']));
        if (_model.independent === true) {
          me.element.css(me.layoutConfig);
        }
        me.mainModule = me.items.getByKey(model.mainModule);
        toolLayout.setToolZIndex.apply(me.top.layout, [me]);
      });
  },
  getRefPathParser: function () {
    return this.top.getRefPathParser('tool');
  },
  getZIndex: function () {
    return this.element.css('z-index');
  },
  release: function (NONEventFlag) {
    var me = this;
    toolLoadState[me.toolKey] = undefined;
    tHelper.delPositionUnqiueId(_position, me.unqiueId);
    if ($(me.top.layout.$toolTarget.find('._icplayer_limit_tip')).css("visibility") != "hidden") {
      me.top.layout.$toolTarget.find('._icplayer_limit_tip').hide();
    }
    if (!NONEventFlag) {
      me.top.fireEvent(require('core.eventbus.eventname').tool.close, me);
    }
    require("core.player.Tool").prototype.superClass.release.call(this);
  },
  push: function () {
    toolPush.push.apply(this)
  },
  stopPush: function () {
    toolPush.stopPush.apply(this)
  },
  isPointInPath: function (x, y) {
    return isInPath(this, x, y);
  },
  /**
   * 切换工具窗口的背景
   * @param enable
   */
  switchToolContainerBG: function (enable) {
    if (enable) {
      this.container.parent().css('background-color', 'rgba(0,0,0,0.6)');
    } else {
      this.container.parent().css('background-color', '');
    }
  },
  'modulelifeCycles': ['run', setState, 'show', 'afterRender', toolInit],
  parser: parser
};

}, 'class');
__applicationContext.define('core.state.localstoragecontroller', function (exports,module,require,$) {
'use strict';
var key = '$$icplayerState';
module.exports = {
    'write': function (object) {
        try {
            localStorage.setItem(key, JSON.stringify(object));
        } catch (ex) {
            // ios 无痕模式下不支持，但是存在localStorage.setItem  
        }
    },
    'read': function () {
        return JSON.parse(localStorage.getItem(key) || '{}');
    },
    'clear': function () {
        try {
            localStorage.setItem(key, '');
        } catch (ex) {
            // ios 无痕模式下不支持，但是存在localStorage.setItem  
        }
    }
};
}, '');
__applicationContext.define('core.state.simplestate', function (exports,module,require,$) {
'use strict';
var localStorageController = require('core.state.localStorageController');

module.type = 'class';
module.exports = {
    constructor: function (stateToken) {
        this.data = {};
        this.stateToken = stateToken;
        if (this.stateToken) {
            this.read();
        } else {
            localStorageController.clear();
        }
    },
    addStates: function (state) {
        $.extend(this.data, state);
    },
    getState: function (key) {
        return this.data[key];
    },
    loadFromString: function (value) {
        if (value) {
            var state = JSON.parse(value);
            this.addStates(state);
        }
    },
    getAsString: function () {
        return JSON.stringify(this.data);
    },
    readState: function () {
        return localStorageController.read()[this.stateToken] || {};
    },
    writeState: function (state) {
        var lsState = {};
        lsState[this.stateToken] = state;
        localStorageController.write(lsState);
    },
    read: function () {
        if (this.stateToken) {
            //读取stateToken对应的值
            var lsState = this.readState();
            for (var name in lsState) {
                this.loadFromString(lsState[name]);
            }
            //只保留lsStateToken对应的值
            this.writeState(lsState);
        }
    },
    writePageState: function (pageName, state) {
        if (this.stateToken) {
            var lsState = this.readState();
            lsState[pageName] = state;
            this.writeState(lsState);
        }
    }
};
}, 'class');
__applicationContext.define('core.utils.baseundo', function (exports,module,require,$) {
'use strict';

//载取
function truncate(stack, limit) {
    while (stack.length > limit) {
        stack.shift();
    }
}
/**
 * SimpleUndo is a very basic javascript undo/redo stack for managing histories of basically anything.
 * 
 * options are: {
 * 	* `provider` : required. a function to call on `save`, which should provide the current state of the historized object through the given "done" callback
 * 	* `maxLength` : the maximum number of items in history
 * 	* `opUpdate` : a function to call to notify of changes in history. Will be called on `save`, `undo`, `redo` and `clear`
 * }
 * 
 */
module.type = 'class';
module.exports = {
    constructor:function(options){
        var settings = options ? options : {};
        var defaultOptions = {
            provider: function () {
                throw new Error("player 11.7.3: " + "No provider!");
            },
            maxLength: 30,
            onUpdate: function () { }
        };

        this.provider = (typeof settings.provider != 'undefined') ? settings.provider : defaultOptions.provider;
        this.maxLength = (typeof settings.maxLength != 'undefined') ? settings.maxLength : defaultOptions.maxLength;
        this.onUpdate = (typeof settings.onUpdate != 'undefined') ? settings.onUpdate : defaultOptions.onUpdate;

        this.initialItem = null;
        this.clear();
    },
     //初始化
    initialize: function (initialItem) {
        this.stack[0] = initialItem;
        this.initialItem = initialItem;
    },
    //清除
    clear: function () {
        this.stack = [this.initialItem];
        this.position = 0;
        this.onUpdate();
    },
    //保存
    save: function () {
        this.provider(function (current) {
            truncate(this.stack, this.maxLength);
            this.position = Math.min(this.position, this.stack.length - 1);

            this.stack = this.stack.slice(0, this.position + 1);
            this.stack.push(current);
            this.position++;
            this.onUpdate();
        }.bind(this));
    },
    //撤销
    undo: function (callback) {
        if (this.canUndo()) {
            var item = this.stack[--this.position];
            this.onUpdate();

            if (callback) {
                callback(item);
            }
        }
    },
    //重做
    redo: function (callback) {
        if (this.canRedo()) {
            var item = this.stack[++this.position];
            this.onUpdate();

            if (callback) {
                callback(item);
            }
        }
    },
    //是否可撤消
    canUndo: function () {
        return this.position > 0;
    },
    //是否可重做
    canRedo: function () {
        return this.position < this.count();
    },
    //获取个数
    count: function () {
        return this.stack.length - 1; // -1 是由于initialize initialItem
    }
};



}, 'class');
__applicationContext.define('core.utils.class', function (exports,module,require,$) {
'use strict';

var createReg = function (regArray) {
    if ($.isArray(regArray)) {
        var sReg = "^(" + regArray.join("|") + ")$";
        return new RegExp(sReg);
    }
};

var override = function (source, target, extendAttribute) {
    var value;
    for (var key in target) {
        value = target[key];
        if (extendAttribute && (key in source) && extendAttribute.test(key)) {
            var superValue = source[key];
            if ($.isArray(superValue)) {
                value = source[key].concat(value);
            } else {
                value = $.extend(superValue, value);
            }
        }
        source[key] = value;
    }
};
var classHelper = {
    "extend": function (subClass, superClass, overrides) {
        //参数多态修正
        if (arguments.length === 2) {
            //子类直接延用父类的构造函数
            overrides = superClass;
            superClass = subClass;
            subClass = function () {
                superClass.apply(this, arguments);
            };
        } else if (!subClass || subClass === Object) {
            subClass = function () {
                superClass.apply(this, arguments);
            };
        }
        //设定空的构造函数,防止子类继承构造函数
        var F = function () {
        };
        var superClassPrototype = F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
        subClass.prototype.superClass = superClassPrototype;
        overrides = overrides || {};
        //指定继承的属性(数组和对象),不是完全覆盖
        var extendAttribute = createReg(overrides.__extendAttribute);
        delete overrides.__extendAttribute;
        override(subClass.prototype, overrides, extendAttribute);
        //父类如果是普通对象,重新定义构造函数
        if (superClass.prototype.constructor === Object.prototype.constructor) {
            superClass.prototype.constructor = superClass;
        }
        return subClass;
    },
    "create": function (classDef, className) {
        var subClass = classDef.constructor;
        delete classDef.constructor;
        var staticDef = classDef.static;
        delete classDef.static;
        if (classDef.extend) {
            var superClass = require(classDef.extend);
            delete classDef.extend;
            subClass = classHelper.extend(subClass, superClass, classDef);
        } else {
            //use strict模式下不允许更改Object的prototype
            if (subClass === Object) {
                subClass = function () {
                    Object.prototype.constructor.apply(this, arguments);
                };
            }
            subClass.prototype = classDef;
        }
        subClass.prototype.className = className;
        $.extend(subClass, staticDef);
        return subClass;
    }
};
module.exports = classHelper;
}, '');
__applicationContext.define('core.utils.detector', function (exports,module,require,$) {
'use strict';
var rotate = require('core.utils.transform');
var rgba = [0, 0, 0, 0];
var getImageData = function (ctx, x, y) {
	var flag = false;
	var imageData = ctx.getImageData(x, y, 1, 1);
	for (var i = 0; i < rgba.length; i++) {
		if (imageData.data[i] !== rgba[i]) {
			flag = true;
			break;
		}
	}
	return flag;
};
//canvas模式判断是否选中
var canvasMode = function (canvas, event) {
	try {
		var rotateAngle, finalXY;
		var x = event.pageX || (event.changedTouches ? event.changedTouches[0].pageX : 0),
			y = event.pageY || (event.changedTouches ? event.changedTouches[0].pageY : 0);
		var ctx = canvas.getContext('2d');
		rotateAngle = rotate.getRotateDeg(canvas); //这里取返就是为了算相对位置直接取旋转前的X,Y，
		finalXY = rotate.getRotateXY(x, y, rotateAngle, canvas);
		return getImageData(ctx, finalXY.x, finalXY.y);
	} catch (e) {
		console.error(e);
		return false;
	}
};
var detector = {
	/**
	 * 检测是否支持canvas
	 * @type {[type]}
	 */
	canvas: !!window.CanvasRenderingContext2D,
	/**
	 * 检测是否支持webgl
	 * @param  {[type]} ) {		try       {			var canvas [description]
	 * @return {[type]}   [description]
	 */
	webgl: (function () {

		try {

			var canvas = document.createElement('canvas');
			return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));

		} catch (e) {
			console.error(e);
			return false;

		}

	})(),
	/**
	 * 检查是否支持workers
	 * @type {[type]}
	 */
	workers: !!window.Worker,
	/**
	 * 检测是否支持fileapi
	 * @type {[type]}
	 */
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,
	/**
	 * 检查是否支持websocket
	 * @type {[type]}
	 */
	websocket: !!window.WebSocket,
	/**
	 * 检测当前运行环境Env是否已经加载
	 * @return {[boolean]}   [description]
	 */
	isEnvLoaded: function () {
		try {
			if (typeof (isApp) !== 'undefined' && typeof (Bridge) !== 'undefined' && typeof (Bridge.callNative) !== 'undefined') {
				return !!Bridge.callNative('com.nd.pad.icr.ui.IcrJsBridge', 'isEnvLoaded', {}).result;
			} else {
				return false;
			}

		} catch (e) {
			console.error(e);
			return false;

		}

	},
	/**
	 * 判断当前event是否在canvas内
	 * @param  {[type]}  canvas  canvas 的 dom
	 * @param  {[type]}  event  
	 * @return {Boolean}        [description]
	 */
	isPointInPath: function (canvas, event) {
		return canvasMode(canvas, event);
	},
	/**
	 * 判断学生是否有在线
	 * @return {Boolean} true 在线；false 不在线。
	 */
	isOnline: function () {
		var status = Object.create(null);
		if (typeof (CoursePlayer) !== 'undefined' && CoursePlayer.pptInvokeMethod) {
			var nStatus = CoursePlayer.pptInvokeMethod("getOnlineStatus", "{}");
			status = JSON.parse(nStatus);
		}
		return status.online_status ? status.online_status : false
	}

};
module.exports = detector;
}, '');
__applicationContext.define('core.utils.dom', function (exports,module,require,$) {
'use strict';
var logger = require('core.utils.log');
var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
var _touchFlag = ('ontouchstart' in window);
var _eventName = _touchFlag ? {
    down: 'touchstart',
    up: 'touchend',
    move: 'touchmove'
} : {
    down: 'mousedown',
    up: 'mouseup',
    move: 'mousemove'
};

module.exports = {
    /**
     创建Mouse事件
     @param:event,当前的event事件
     @param:type,mouse事件的类型
     */
    createMouseEvent: function (event, type) {
        var evt = document.createEvent('MouseEvents');
        var touches = event.changedTouches,
            first = touches ? touches[0] : null;
        //switch (type) {
        //    case "touchstart": type = "mousedown"; break;
        //    case "touchmove": type = "mousemove"; break;
        //    case "touchend": type = "mouseup"; break;
        //    default: ;
        //}

        if (_touchFlag) {
            evt.initMouseEvent(type || event.type, true, true, window, 0, first.screenX, first.screenY, first.clientX, first.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, event.relatedTarget);
        } else {
            evt.initMouseEvent(type || event.type, true, true, window, 0, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, event.relatedTarget);
        }
        return evt;
    },
    addStyle: function (url) {
        if (url) {
            var css = document.createElement('link');
            css.setAttribute('rel', 'stylesheet');
            css.setAttribute('type', 'text/css');
            css.setAttribute('href', url);
            head.appendChild(css);
            return css;
        }
    },
    addScript: function (url) {
        var deferred = $.Deferred();
        var script = document.createElement('script');
        script.async = true;
        script.src = url;
        script.onerror = function () {
            logger.error('js script load failure:' + url);
            deferred.resolve();
        };
        script.onload = script.onreadystatechange = function (_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                script = null;
                if (!isAbort) {
                    deferred.resolve();
                } else {
                    deferred.resolve();
                    logger.error('js script loading is Abort:' + url);
                }
            }
        };

        head.insertBefore(script, head.firstChild);
        return deferred.promise();
    },
    addStyleContent: function (text) {
        $("<style type='text/css'>" + text + "</style>").appendTo("head");
    },
    addScriptContent: function (code) {
        var elem = document.createElement('script');
        elem.setAttribute('language', 'JavaScript');
        elem.text = code;
        head.appendChild(elem);
    },
    getEventXY: function (e) {
        if (e.type !== 'touchedn') {
            return {
                "x": e.pageX || (e.touches && e.touches.length > 0 && e.touches[0].pageX) || -1,
                "y": e.pageY || (e.touches && e.touches.length > 0 && e.touches[0].pageY) || -1
            };
        } else {
            return {
                "x": e.pageX || (e.changedTouches && e.changedTouches.length > 0 && e.changedTouches[0].pageX) || -1,
                "y": e.pageY || (e.changedTouches && e.changedTouches.length > 0 && e.changedTouches[0].pageY) || -1
            };
        }
    },
    eventName: _eventName
};
}, '');
__applicationContext.define('core.utils.function', function (exports,module,require,$) {
'use strict';
var logger = require('core.utils.log');
var functionHelper = {
    /**
     * 创建函数的回调函数
     * @param fn 需要创建的函数
     * @param params
     */
    'createDelegate': function(fn, args, isAppendArgs, scope, exceptionHandler) {
        return function() {
            //如果创建的时候没有输入参数，使用调用的参数
            var callArgs = args || arguments;
            if (isAppendArgs === true) {
                //arguments数组化
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }
            try {
                return fn.apply(scope || window, callArgs);
            } catch (e) {
                console.error(e);
                if ($.isFunction(exceptionHandler)) {
                    return exceptionHandler(e);
                } else {
                    throw e;
                }
            }
        };
    },
    'defer': function(millis, fn, args, appendArgs, scope) {
        var callFn = functionHelper.createDelegate(fn, args, appendArgs, scope);
        if (millis > 0) {
            return window.setTimeout(callFn, millis);
        }
        //直接调用，返回0的timerId
        callFn();
        return 0;
    },
    'createPromiseThen': function(deferred, fn, args, isAppendArgs, scope) {
        if (!$.isFunction(deferred.reject)) {
            scope = isAppendArgs;
            isAppendArgs = args;
            args = fn;
            fn = deferred;
            deferred = $.Deferred();
        }
        return this.createDelegate(fn, args, isAppendArgs, scope, function(e) {
            deferred.reject(e);
            return deferred.promise();
        });
    },
    'execute': function(instance, injections, args, isCheck) {
        //参数整理
        var singleExecuteName = '';
        var result = {};
        if (typeof injections === 'string') {
            singleExecuteName = injections;
            injections = {};
            injections[singleExecuteName] = args || [];
        }
        if (instance) {
            for (var name in injections) {
                var fn = instance[name];
                if ($.isFunction(fn)) {
                    var params = injections[name];
                    var callMethod = ($.isArray(params)) ? 'apply' : 'call';
                    result[name] = Function.prototype[callMethod].call(fn, instance, params);
                } else if (isCheck === true) {
                    logger.error("not exist [" + name + '] function');
                }
            }
        }
        return (singleExecuteName) ? result[singleExecuteName] : result;
    },
    //顺序执行函数列表
    //[{fn:function(){},args:[],scope:this}]
    'runSequence': function(fnConfigs, name) {
        var $promise = $.Deferred().resolve();
        var runIndex;
        fnConfigs.forEach(function(fnConfig, index) {
            if ($.isFunction(fnConfig.fn)) {
                $promise = $promise.then(function() {
                    try {
                        runIndex = index;
                        //如果创建的时候没有输入参数，使用调用的参数
                        var callArgs = fnConfig.args || arguments;
                        if (fnConfig.isAppendArgs === true) {
                            //arguments数组化
                            callArgs = Array.prototype.slice.call(arguments, 0);
                            callArgs = callArgs.concat(fnConfig.args);
                        }
                        logger.log(fnConfig.name);
                        return fnConfig.fn.apply(fnConfig.scope || window, callArgs);
                    } catch (e) {
                        console.error(e);
                        return $.Deferred(function(deferred) {
                            deferred.reject(e);
                        });
                    }
                }, function(message) {
                    return message;
                });
            }
        });
        return $promise.fail(function(e) {
            logger.error('run %s,the %d is wrong : %o', name || " task ", ++runIndex, e || "");
            logger.error(e);

        });
    }
};
module.exports = functionHelper;
}, '');
__applicationContext.define('core.utils.log', function (exports,module,require,$) {
'use strict';
var errorLog = function (e) {
    if (e.cause) {
        errorLog(e.cause);
    }
    logger.error(e);
};
var level = 'error';


var log = function (message, type) {
    if (type === level) {
        console[type](message);
    }
};

var logger = {
    'log': function (message) {
        log("player 11.7.3: " + message, 'log');
    },
    'error': function (message, e) {
        log(e,'error');
        if (e) {
            errorLog(e);
        }
    }

};

module.exports = logger;
}, '');
__applicationContext.define('core.utils.raf', function (exports,module,require,$) {
var raf = window.requestAnimationFrame;
var caf = window.cancelAnimationFrame;
var vendors = ['webkit', 'moz'];
for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    raf = window[vp + 'RequestAnimationFrame'];
    caf = (window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']);
}
if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    raf = function (callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return window.setTimeout(function () {
            callback(lastTime = nextTime);
        }, nextTime - now);
    };
    caf = window.clearTimeout;
}
module.exports = {
    raf: raf,
    caf: caf
};
}, '');
__applicationContext.define('core.utils.request', function (exports,module,require,$) {
'use strict';
var sSearch = location.search;
var oParam = {};
sSearch = sSearch.substr(1, sSearch.length);
var params = sSearch.split('&');
params.forEach(function (paramExpr) {
    var param = paramExpr.split('=');
    var key = param[0];
    if (key) {
        var value = decodeURIComponent(param[1]);
        oParam[key] = value;
    }
});
var fn = (function (sParamName) {
    return oParam[sParamName] || '';
});
fn.get = function () {
    return oParam;
};
module.exports = fn;
}, '');
__applicationContext.define('core.utils.string', function (exports,module,require,$) {
'use strict';
var templateRegExp = /\$\{(.+?)\}/g;
module.exports = {
    "applyTemplate": function (tpl, attrs) {
        return tpl.replace(templateRegExp, function ($0, $1) {
            return attrs[$1] || $0;
        });
    },
    'createReg': function (array) {
        return (array.length) ? new RegExp('^(' + array.join("|") + ')$') : /^$/;
    }
};

}, '');
__applicationContext.define('core.utils.throttle', function (exports,module,require,$) {
'use strict';
module.exports = {
  /*
   * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
   * @param fn {function}  需要调用的函数
   * @param delay  {number}    延迟时间，单位毫秒
   * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
   * @return {function}实际调用函数
   */
  throttle: function(fn, delay, immediate, debounce) {
    var curr = +new Date(), //当前事件
      last_call = 0,
      last_exec = 0,
      timer = null,
      diff, //时间差
      context, //上下文
      args,
      exec = function() {
        last_exec = curr;
        fn.apply(context, args);
      };
    return function() {
      curr = +new Date();
      context = this,
        args = arguments,
        diff = curr - (debounce ? last_call : last_exec) - delay;
      clearTimeout(timer);
      if (debounce) {
        if (immediate) {
          timer = setTimeout(exec, delay);
        } else if (diff >= 0) {
          exec();
        }
      } else {
        if (diff >= 0) {
          exec();
        } else if (immediate) {
          timer = setTimeout(exec, -diff);
        }
      }
      last_call = curr;
    };
  },
  /*
   * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
   * @param fn {function}  要调用的函数
   * @param delay   {number}    空闲时间
   * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
   * @return {function}实际调用函数
   */
  debounce: function(fn, delay, immediate) {
    return this.throttle(fn, delay, immediate, true);
  }
};
}, '');
__applicationContext.define('core.utils.transform', function (exports,module,require,$) {
'use strict';
var findOffset = function(obj) {
    var curX = 0,
        curY = 0;
    if (obj.offsetParent) {
        do {
            curX += obj.offsetLeft;
            curY += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {
            x: curX,
            y: curY
        };
    } else
        return {
            "x": 0,
            "y": 0
        };
};
module.exports = {
    //获取元素的旋转的角度
    getRotateDeg: function(dom) {
        var me = $(dom), angle;
        var matrix = me.css("-webkit-transform") ||
            me.css("-moz-transform") ||
            me.css("-ms-transform") ||
            me.css("-o-transform") ||
            me.css("transform");
        if (typeof matrix === 'string' && matrix !== 'none'&&matrix!=='') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
              angle = (Math.atan2(b, a) * (180 / Math.PI)).toFixed(3);
        } else {
              angle = 0;
        }
        return angle;
    },
    getRotateOriginXY: function(dom) {
        var str = $(dom).css('transform-origin');
        return str ? {
            x: parseFloat(str.split(' ')[0], 10),
            y: parseFloat(str.split(' ')[1], 10)
        } : {
            x: 0,
            y: 0
        };
    },
    getRotateXY: function(x, y, angle, dom) {
        var p = findOffset(dom);
        var t = this.getRotateOriginXY(dom);

        x = x - parseInt(p.x) - t.x;
        y = y - parseInt(p.y) - t.y;
        if (angle < 0) {
            angle = 360 + angle % 360; //3个限项 0-90 90-180 180-270 270-360
        } else {
            angle = angle % 360; //3个限项 0-90 90-180 180-270 270-360
        }
        var goalX = x * Math.cos(angle * Math.PI / 180) + y * Math.sin(angle * Math.PI / 180);
        var goalY = y * Math.cos(angle * Math.PI / 180) - x * Math.sin(angle * Math.PI / 180);
        return {
            x: goalX + t.x,
            y: goalY + t.y
        };
    }
};

}, '');
__applicationContext.define('core.utils.url', function (exports,module,require,$) {
'use strict';
//获取baseurl，找到第一个?或者结束的
var baseReg = /^.*?(?=[^\/]*(\?|$))/;
var absoluteReg = /^(\w+:\/\/|\/)/;
module.exports = {
    'getBase': function (url) {
        return (url) ? baseReg.exec(url)[0] : '';
    },
    'isAbsolute': function (url) {
        return absoluteReg.test(url);
    },
    'resolve': function (base, url) {
        if (arguments.length === 1) {
            url = base;
            base = this.getBaseLocationUrl();
        }
        return this.isAbsolute(url) ? url : base + url;
    },
    'getBaseLocationUrl': function () {
        var url = this.getBase(location.href);
        this.getBaseLocationUrl = function () {
            return url;
        };
        return this.getBaseLocationUrl();
    }
};
}, '');
__applicationContext.define('core.utils.uuid', function (exports,module,require,$) {
'use strict';
var hexDigits = '0123456789abcdefghijklmnopqrstuvwxyz';
module.exports = function(len) {
	var uuids = [];
	for (var i = 0; i < len; i++) {
		uuids[i] = hexDigits.substr(Math.floor(Math.random() * 36), 1);
	}
	return uuids.join('');
};
}, '');
__applicationContext.define('core.utils.when', function (exports,module,require,$) {
'use strict';
module.type = 'class';
var callDone = function () {
    if (this._count === 0) {
        this._done.call(window, this._results);
    }
};
module.exports = {
    constructor: function (count, fn) {
        this._count = count;
        this._done = fn;
        if (count) {
            this._results = [];
        } else {
            callDone.call(this);
        }
    },
    each: function (result) {
        this._count--;
        this._results.push(result);
        callDone.call(this);
    }
};
}, 'class');
__applicationContext.define('core.utils.xml', function (exports,module,require,$) {
'use strict';
module.exports = {
    'toJsonByAttr': function (obj, node, attrs, eachFn) {
        if (!$.isPlainObject(obj)) {
            eachFn = attrs;
            attrs = node;
            node = obj;
            obj = {};
        }
        if (node) {
            attrs.forEach(function (attr) {
                var mapKey;
                if (typeof attr === "string") {
                    mapKey = attr;
                } else {
                    for (var key in attr) {
                        mapKey = key;
                        attr = attr[key];
                    }
                }
                var value = (($.isFunction(attr)) ? attr(node.getAttribute(mapKey) || "") : node.getAttribute(attr)) || "";
                if ($.isFunction(eachFn)) {
                    value = eachFn(value, mapKey);
                }
                obj[mapKey] = value;
            });
        }
        return obj;
    }
};
}, '');
__applicationContext.define('core.common.layout.events', function (exports,module,require,$) {
module.exports = {
    downEvents: ['mousedown', 'touchstart'],
    moveEvents: ['mousemove', 'touchmove'],
    upEvents: ['mouseup', 'touchend'],
    clickEvents: ['click'],
    pageLeaveEvents: ['mouseleave']
}
}, '');
__applicationContext.define('core.common.layout.tool', function (exports,module,require,$) {
var events = require('core.common.layout.events'),
    request = require('core.utils.request'),
    adjust = require('core.common.ispointinpath'),
    pptshellpaint = require('core.common.pptshellpaint'),
    Paint = require('core.common.Paint'),
    stringUtil = require('core.utils.string');
var toolTargetHtml = '<div class="ic_paint"><div class="ic_tool_container tooldialog_skin_wood"><div class="com_tooldialog"><div class="com_tooldialog_student_mask"></div><div class="sideicon_wrap leftwrap scrollbar_style_gray" ><ul class="sideicon_list"></ul></div><div class="sideicon_wrap rightwrap scrollbar_style_gray" ><ul class="sideicon_list"></ul></div></div><div class="com_tooldialog_pop _icplayer_limit_tip" style="display:none;z-index:9999" onclick="$(this).hide()"><div class="com_tooldialog_pop_box"><div class="com_tooldialog_pop_main" ><p class="com_tooldialog_pop_txt">${Tool_PopLimit}</p></div><div class="com_tooldialog_pop_foot"><a class="com_tooldialog_pop_btn" href="javascript:;">${Tool_See}</a></div></div></div></div></div>';
var toolIconHtml = '<li class="sideicon ${id} min" style="display: none"><img src="${icon}" alt="" /></li>';
var downEvents = events.downEvents,
    moveEvents = events.moveEvents,
    upEvents = events.upEvents,
    clickEvents = events.clickEvents,
    pageLeaveEvents = events.pageLeaveEvents,
    isMouse = false,
    ToolZIndex = {
        'up': 6000,
        'down': 3000
    };
var toolIconDown = function (event, me) {
    var $target = $(event.srcElement || event.target).closest('.sideicon');
    var tool = $target.data('toolRef');
    if (tool) {
        me.fireTool(tool);
        if ($target.length) {
            if (!$target.is(":hidden")) {
                tool.show();
                me.$toolTarget.find('.sideicon.' + tool.unqiueId).hide();
            }
        }
    } else {
        if ((event.srcElement || event.target).className !== 'btn_tool tool_close') {
            me.$toolTarget.find('.tool_tip').hide();
        }
    }
};
var initTool = (function () {
    var downTime, downX, downY;
    var canmove, currentToolIndex;
    return function () {
        var me = this;
        downEvents.forEach(function (item) {
            var fn = function (e) {
                var event = $.event.fix(e);
                isMouse = !(event.type.indexOf('touch') >= 0);
                //图标事件
                toolIconDown(event, me);
                if (me.component.toolList.active !== '') {
                    var oldtool = me.component.toolList.list[me.component.toolList.active][0];
                    var adjustList = adjust.adjust(me.component.toolList, event);
                    me.component.toolList = adjustList.toolList;
                    downX = event.pageX || event.originalEvent.touches[0].pageX;
                    downY = event.pageY || event.originalEvent.touches[0].pageY;
                    if (!adjustList.allFlase) {
                        canmove = true;
                        currentToolIndex = 0;
                        var currentTool = me.component.toolList.list[adjustList.toolList.active][currentToolIndex];
                        me.setToolZIndex(currentTool);
                        downTime = new Date();
                        currentTool.fireEvent('mousedown', event);
                        if (me.component.toolList.active !== '') {
                            currentTool.fireEvent('focus', event);
                            if (oldtool && oldtool.unqiueId !== currentTool.unqiueId) {
                                oldtool.fireEvent('blur', event);
                            }
                        }
                        me.minTool(event, currentTool);
                        var $target = $(event.srcElement || event.target).closest('.tool_small');
                        if ($target && $target.length && !currentTool.dialogModel.disabledMin) {
                            me.$toolTarget.find('.sideicon.' + currentTool.unqiueId).show();
                        }
                    } else {
                        currentToolIndex = 0;
                        if (oldtool)
                            oldtool.fireEvent('blur', event);
                    }
                }
                return true;
            };
            if (me.$toolTarget[0].addEventListener) {
                me.$toolTarget[0].addEventListener(item, fn, true);
            } else {
                me.$toolTarget[0].attachEvent(item, fn);
            }
        });
        moveEvents.forEach(function (item) {
            var fn = function (event) {
                var activeToolList = me.component.toolList.list[me.component.toolList.active];
                if (canmove && activeToolList.length >= (currentToolIndex || 0) + 1) {
                    activeToolList[currentToolIndex].fireEvent('mousemove', event);
                }
                return true;
            };
            if (me.$toolTarget[0].addEventListener) {
                me.$toolTarget[0].addEventListener(item, fn, true);
            } else {
                me.$toolTarget[0].attachEvent(item, fn);
            }
        });
        clickEvents.forEach(function (item) {
            var fn = function (event) {
                var activeToolList = me.component.toolList.list[me.component.toolList.active];
                if (canmove && activeToolList.length >= (currentToolIndex || 0) + 1) {
                    activeToolList[currentToolIndex].fireEvent(item, event);
                }
                return true;
            };
            if (me.$toolTarget[0].addEventListener) {
                me.$toolTarget[0].addEventListener(item, fn, true);
            } else {
                me.$toolTarget[0].attachEvent(item, fn);
            }
        });
        upEvents.forEach(function (item) {
            var fn = function (e) {
                var event = $.event.fix(e);
                canmove = false;
                //click事件发出去后toolList可能发生变化
                if (me.component.toolList.active !== '' && me.component.toolList.list[me.component.toolList.active].length > currentToolIndex) {
                    me.component.toolList.list[me.component.toolList.active][currentToolIndex].fireEvent('mouseup', event);
                }
                var t = new Date() - downTime;
                var x = Math.abs((event.pageX === undefined ? event.originalEvent.changedTouches[0].pageX : event.pageX) - downX);
                var y = Math.abs((event.pageY === undefined ? event.originalEvent.changedTouches[0].pageY : event.pageY) - downY);
                if (me.component.toolList.active !== '') {
                    if (!isMouse && t < 180 && x < 3 && y < 3 && me.component.toolList.list[me.component.toolList.active].length > currentToolIndex) {
                        me.component.toolList.list[me.component.toolList.active][currentToolIndex].fireEvent('click', event);
                    }
                }
                return true;
            };
            if (me.$toolTarget[0].addEventListener) {
                me.$toolTarget[0].addEventListener(item, fn, true);
            } else {
                me.$toolTarget[0].attachEvent(item, fn);
            }
        });
        pageLeaveEvents.forEach(function (item) {
            var fn = function (event) {
                canmove = false;
                //click事件发出去后toolList可能发生变化
                if (me.component.toolList.active !== '' && me.component.toolList.list[me.component.toolList.active].length > currentToolIndex) {
                    me.component.toolList.list[me.component.toolList.active][currentToolIndex].fireEvent('mouseup', event);
                }
                return false;
            };
            if (me.$toolTarget[0].addEventListener) {
                me.$toolTarget[0].addEventListener(item, fn, false);
            } else {
                me.$toolTarget[0].attachEvent('onclick', fn);
            }
        });
        var fn = function (event) {
            if (me.component.toolList.active !== '') {
                if (isMouse && me.component.toolList.list[me.component.toolList.active].length > currentToolIndex) {
                    me.component.toolList.list[me.component.toolList.active][currentToolIndex].fireEvent('click', event);
                }
            }
            return true;
        };
        if (me.$toolTarget[0].addEventListener) {
            me.$toolTarget[0].addEventListener('click', fn);
        } else {
            me.$toolTarget[0].attachEvent('onclick', fn);
        }
    };
})();
module.exports = {
    'renderTool': function () {
        //初始化构建Tool环境
        this.$toolTarget = $(stringUtil.applyTemplate(toolTargetHtml, {
            'Tool_PopLimit': this.component.getI18nModel().player['Tool_PopLimit'],
            'Tool_See': this.component.getI18nModel().player['Tool_See']
        }));
        initTool.call(this);
        this.pageTarget.append(this.$toolTarget);
        this.$toolContainer = this.$toolTarget.find('.com_tooldialog');
        this.$toolIconList = this.$toolContainer.find('.sideicon_list');
        //添加画板
        var paint;
        if (request('sys') === 'pptshell') {
            paint = new pptshellpaint(this.$toolTarget);
        } else {
            paint = new Paint(this.$toolTarget);
        }
        return paint;
    },
    'activeTool': function (tool) {
        if(tool && tool.toolConfig && tool.toolConfig.toolType === 'pageTool' && this.$toolTarget){
            this.$toolTarget.removeClass('ic_paint_active');
        }else if (this.$toolTarget){
            this.$toolTarget.addClass('ic_paint_active');
        }
    },
    'addTool': function (tool) {
        var me = this;
        return tool.render(this.$toolContainer).done(function () {
           // me.setToolZIndex(tool);
            if (tool.toolConfig.independent !== true) {
                //设置icon
                var $iconEl = $(stringUtil.applyTemplate(toolIconHtml, {
                    'icon': tool.toolConfig.icon,
                    'id': tool.unqiueId
                }));
                $iconEl.data('toolRef', tool);
                me.$toolIconList.prepend($iconEl);
            }
        });
    },
    setToolZIndex: function (tool) {
        var me = this;
        var flag = (tool.toolConfig.independent !== true) ? 'down' : 'up';
        var zindex = ToolZIndex[flag] + this.getZIndex();
        if (tool.zIndex === undefined || !me.isLargeZIndex(tool)) {
            tool.zIndex = zindex;
            tool.getElement(true).css('z-index', zindex);
        }
    },
    isLargeZIndex: function (tool) {
        var me = this;
        var currentToolZIndex = tool.zIndex;
        var flag = false;
        if (me.component.toolList.list[me.component.toolList.active] === undefined)
            return flag;
        for (var i = 0; i < me.component.toolList.list[me.component.toolList.active].length; i++) {
            if (currentToolZIndex < me.component.toolList.list[me.component.toolList.active][i].zIndex) {
                flag = false;
                break;
            } else {
                flag = true;
            }
        }
        return flag;
    },
    /**
     * 激活某一tool
     * @param  {[type]} tool [description]
     * @return {[type]}      [description]
     */
    fireTool: function (tool) {
        var me = this;
        var oldtool = me.component.toolList.list[me.component.toolList.active][0];
        var adjustList = adjust.adjust(me.component.toolList, null, tool, 'FIRETOOL');
        me.component.toolList = adjustList.toolList;
        var currentTool = tool;
        me.setToolZIndex(currentTool);
        currentTool.fireEvent('mousedown', event);
        if (me.component.toolList.active !== '') {
            currentTool.fireEvent('focus', event);
            currentTool.fireEvent(require('core.eventbus.eventname').tool.maximize);
            if (oldtool.unqiueId !== currentTool.unqiueId) {
                oldtool.fireEvent('blur', event);
            }
        }
    },
    /**
     * 最小化TOOL
     * @param  {[type]} tool [description]
     * @return {[type]}      [description]
     */
    minTool: function (event, tool) {
        var target = event.srcElement || event.target;
        if (target.className === "btn_tool tool_small") {
            var me = this;
            me.component.toolList = adjust.swapTool(me.component.toolList, me.component.toolList.active, tool);
            tool.fireEvent(require('core.eventbus.eventname').tool.minimize);
        }
    }
}

}, '');
__applicationContext.define('core.common.player.command', function (exports,module,require,$) {
var logger = require('core.utils.Log');
module.exports= {
    'getCommands': function (me) {
        return {
          'gotoPageIndex': function (index, config) {
            me.gotoPageIndex(index, config);
          },
          'gotoPage': function (pageName, config) {
            logger.log('gotoPage:pageName' + pageName + ':config:' + config);
            me.gotoPage(pageName, config);
          },
          'gotoPageId': function (id, config) {
            me.gotoPageId(id, config);
          },
          'gotoPageIndexByNative': function (index) {
            me.gotoPageIndex(index, {
              isCallback: false,
              isFromCache: true
            });
          },
          'firstPage': function () {
            me.firstPage();
          },
          'lastPage': function () {
            me.lastPage();
          },
          'nextPage': function () {
            me.nextPage();
          },
          'prevPage': function () {
            me.prevPage();
          },
          'mediaPause': function () {
            me.mediaPause();
          },
          'closeActivePage': function () {
            me.closeActivePage();
            me.commonPages.forEach(function (page) {
              page.fireEvent('PageLoaded');
            });
          },
          'addExtendPage': function (config) {
            me.addExtendPage(config);
          },
          'closeExtendPage': function () {
            me.closeExtendPage();
            me.commonPages.forEach(function (page) {
              page.fireEvent('PageLoaded');
            });
          }
        };
      }
}
}, '');
__applicationContext.define('core.common.player.controller', function (exports,module,require,$) {
var runtime = require('core.common.runtime');
module.exports = {
    createController: function () {
        var me = this;
        return {
            'getPlayerEvent': function () {
                return me._eventbus;
            },
            'registerFlow': function () {
                me.registerFlow.apply(me, arguments);
            },
            'startFlow': function () {
                me.startFlow.apply(me, arguments);
            },
            'eachPresenter': function () {
                me.eachPresenter.apply(me, arguments);
            },
            'updateTool': function () {
                me.updateToolProperties.apply(me, arguments);
            },
            'getPresentation': function () {
                return require('core.common.player.presentation').getPresentation(me);
            },
            'getCurrentPageIndex': function () {
                return me.getCurrentPageIndex();
            },
            'getRuntime': runtime.getRuntime,
            'getPaint': function () {
                return me.getPaint();
            },
            'clearTool': function () {
                me.clearTool();
            },
            'removeTool': function (unqiueId, scope) {
                me.removeTool(unqiueId, scope);
            },

            'addTool': function (url, options, state) {
                return me.addTool(url, options, state);
            },
            'getPlayerEventBus': function () {
                return this._eventbus;
            },
            'getEventBus': function () {
                return require('core.common.player.eventbus').getEventBus(me);
            },
            'getCommands': function () {
                return require('core.common.player.command').getCommands(me);
            },
            'getState': function () {
                return require('core.common.player.state').getState(me);
            },
            'getModule': function (moduleId) {
                return me.activePage.getModule(moduleId);
            },
            'getModulesByType': function (type) {
                return me.activePage.getModulesByType(type);
            },
            'getCommonsModule': function (name, moduleId) {
                var pages = me.commonPages.getItems(name);
                return (pages.length) ? pages[0].getModule(moduleId) : null;
            },
            'getToolbarModule': function (moduleId) {
                return this.getCommonsModule('toolbar', moduleId);
            },
            'getHeaderModule': function (moduleId) {
                return this.getCommonsModule('header', moduleId);
            },
            'getFooterModule': function (moduleId) {
                return this.getCommonsModule('footer', moduleId);
            },
            'getCurrentPageView': function () {
                return me.activePage.getElement();
            }
        };
    }
}
}, '');
__applicationContext.define('core.common.player.eventbus', function (exports,module,require,$) {
module.exports = {
    'getEventBus': function (me) {
        return {
          'sendEvent': function (name, data) {
            //可能不存在activePage,只渲染通用页
            if (me.activePage) {
              me.activePage.fireEvent(name, data);
            }
            //激活通用页的事件
            me.commonPages.forEach(function (page) {
              page.fireEvent(name, data);
            });
            //激活Tool页的事件
            me.toolList.all.forEach(function (tool) {
              tool.fireEvent(name, data);
            });
          }
        };
      }
}
}, '');
__applicationContext.define('core.common.player.gotopage', function (exports,module,require,$) {
var logger = require('core.utils.Log'),
    playerConfig = require('core.common.playerConfig'),
    Page = require("core.player.page");
module.exports = {
    getCurrentPageIndex: function () {
        return this.currentPageIndex;
    },
    closeActivePage: function () {
        if (this.activePage && this.activePage.isEmpty !== true) {
            var me = this;
            this.mediaPause();
            if (this.activePage.pageType != "extendPage") {
                //保留上一页的状态
                if (this.activePage) {
                    this.state.addStates(this.activePage.getState());
                }
            } else if (this.activePage.hidePage) {
                this.activePage.hidePage.split(',').forEach(function (name) {
                    me.layout.switchCommonPage(name, true);
                });
            }
            //释放上一页
            this.activePage.release();
            this.activePage = {
                isEmpty: true,
                isReportable: function () {
                    return false
                },
                getModuleList: function () {
                    return [];
                },
                getState: function () {
                    return {};
                },
                release: function () {},
                getModule: function () {
                    return {};
                },
                getModules: function () {
                    return [];
                },
                fireEvent: function () {}
            };
        }
    },
    gotoPageIndex: function (index, config) {
        logger.log('gotoPageIndex:' + index + ':config:' + config);
        index = parseInt(index, 10);
        if (!isNaN(index) && index >= 0 && index < this.pages.length) {
            this.closeActivePage();
            var pageConfig = this.pages.getByIndex(index);
            config = config || {};
            //留给native跳页的判断
            if (config.isCallback !== false && $.isFunction(this.beforeSwitchToPage)) {
                //index页面传入
                if (this.beforeSwitchToPage({
                        "index": index,
                        "id": pageConfig.id,
                        "params": {}
                    }) === false) {
                    return false;
                }
            }
            delete config.isCallback;
            //载入教师端的状态
            this.state.loadFromString(config.state);
            delete config.state;

            pageConfig.gotoConfig = config;
            this.activePage = new Page(pageConfig, this);
            this.currentPageIndex = index;
            this.layout.renderPage();
        } else {
            logger.error('invalid code [' + index + ']');
        }
    },
    gotoPage: function (name, config) {
        var index = this.pages.getIndexOfByName(name);
        this.gotoPageIndex(index, config);
    },
    gotoPageId: function (id, config) {
        var index = this.pages.getIndexOfById(id);
        this.gotoPageIndex(index, config);
    },
    firstPage: function () {
        this.gotoPageIndex(0);
    },
    lastPage: function () {
        this.gotoPageIndex(this.pages.length - 1);
    },
    nextPage: function () {
        this.gotoPageIndex(this.currentPageIndex + 1);
    },
    prevPage: function () {
        this.gotoPageIndex(this.currentPageIndex - 1);
    }
}

}, '');
__applicationContext.define('core.common.player.presentation', function (exports,module,require,$) {
module.exports = {
  'getPresentation': function (me) {
    return {
      getPageCount: function () {
        return me.pages.length;
      },
      getPage: function (index) {
        var pageInfo = me.pages.getByIndex(index);
        return {
          'getName': function () {
            return pageInfo.name;
          },
          'getId': function () {
            return pageInfo.id;
          },
          'getBaseURL': function () {
            return pageInfo.href;
          },
          //不建议使用，只能获取当前已渲染页的值
          'getModules': function () {
            return me.activePage.getModuleList() || [];
          },
          'isReportable': function () {
            return me.activePage.isReportable();
          }
        };
      },
      getCurrentPage: function () {
        if (me.activePage) {
          return {
            'getName': function () {
              return me.activePage.name
            },
            'getId': function () {
              return me.activePage.id
            },
            'getBaseURl': function () {
              return me.activePage.href
            },
            'isReportable': function () {
              return me.activePage.isReportable();
            }
          }
        } else {
          return {}
        }
      },
      getTableOfContents: function () {
        return {
          'size': function () {
            return me.pages.length;
          },
          'get': function (index) {
            var pageInfo = me.pages.getByIndex(index);
            return {
              'getName': function () {
                return pageInfo.name;
              },
              'getId': function () {
                return pageInfo.id;
              },
              'getBaseURL': function () {
                return pageInfo.href;
              },
              'getPreview': function () {
                return pageInfo.preview;
              }
            };
          }
        };
      }
    };
  }
}

}, '');
__applicationContext.define('core.common.player.state', function (exports,module,require,$) {
module.exports = {
    'getState': function (me) {
        return {
            'getCurrentPageState': function () {
                return JSON.stringify(me.activePage.getState());
            },
            'getAllToolState': function () {
                var value, stateMap = {};
                me.getToolList().all.forEach(function (tool) {
                    value = tool.getState();
                    if (value) {
                        $.each(value, function (key, value) {
                            stateMap[key] = value;
                        });
                    }
                });
                return JSON.stringify(stateMap);
            },
            'getPlayerState': function () {
                return me.state.getAsString();
            },
            'savePageState': function (name) {
                if (name) {
                    var pages = me.commonPages.getItems(name);
                    if (pages.length) {
                        //目前只先保存第一页
                        me.state.writePageState(name, JSON.stringify(pages[0].getState()));
                    }
                } else {
                    me.state.writePageState('page', this.getCurrentPageState());
                    me.state.writePageState('tool', this.getAllToolState());
                }
            }
        };
    }
}
}, '');
__applicationContext.define('core.common.tool.tool', function (exports,module,require,$) {
'use strict';
var getToolSysModel = function (options) {
  var _sys = options.__sys;
  if (!_sys) {
    return {};
  } else {
    var widthFull = (options.width === "100%"),
      hideHead = (_sys.hide && _sys.hide.indexOf('header') >= 0),
      hideToolBar = (_sys.hide && _sys.hide.indexOf('toolbar') >= 0),
      hideSYSWidth = (_sys.width === '100%'),
      disabledMin = _sys.disabled.indexOf('min') >= 0,
      disabledClose = _sys.disabled.indexOf('close') >= 0,
      disabledMove = _sys.disabled.indexOf('move') >= 0,
      disabledFull = _sys.disabled.indexOf('full') >=0,
      selfBorder = _sys.selfBorder;
    return {
      widthFull: widthFull,
      hideHead: hideHead,
      hideToolBar: hideToolBar,
      hideSYSWidth: hideSYSWidth,
      disabledMin: disabledMin,
      disabledClose: disabledClose,
      disabledMove: disabledMove,
      disabledFull: disabledFull,
      selfBorder: selfBorder
    };
  }
}
module.exports = {
  getToolKey: function (url, options) {
    try {
      if (options && options.toolKey) {
        return options.toolKey;
      }
      var oldXMLKey = url.split('/')[url.split('/').length - 2],
        toolKey = (oldXMLKey.indexOf('.') >= 0) ? url.split('/')[url.split('/').length - 3] : oldXMLKey;
      return toolKey || url;
    } catch (ex) {
      return url;
    }
  },
  getPositionIndex: function (position) {
    for (var i = 0; i < position.length; i++) {
      if (!position[i].used) {
        return i;
      }
    }
    return 0;
  },
  updatePositionUsed: function (position, index, unqiueId) {
    if (index >= 0) {
      position[index].used = true;
      position[index].unqiueId = unqiueId;
    }
  },
  delPositionUnqiueId: function (position, unqiueId) {
    for (var i = 0; i < position.length; i++) {
      if (position[i].unqiueId === unqiueId) {
        position[i].unqiueId === undefined;
        position[i].used = false;
      }
    }
  },
  getToolNameI18n: function (data, key) {
    var toolName = key,
      lang = icCreatePlayer.lang;
    if (lang === 'zh') {
      lang = 'zh_CN';
    }
    var adaptelang = lang.split('_')[0];
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i].toolKey === key) {
        toolName = data[i].i18n[lang] || data[i].i18n[adaptelang] || data[i].i18n['zh_CN'];
        break;
      }
    }
    return toolName;
  },
  getDialogModel: function (options) {
    var sysModel = getToolSysModel(options);
    if ((sysModel.widthFull || sysModel.hideToolBar) && !sysModel.hideHead) {
      sysModel.__type = 'stu';
    } else if (sysModel.hideHead && sysModel.hideToolBar) {
      sysModel.__type = 'pre';
    } else if (sysModel.hideSYSWidth) {
      sysModel.__type = 'mobile'
    } else {
      sysModel.__type = 'pc'
    }
    return sysModel;
  },
  /**
   * 判断是否已经超过限制
   * @param me:player实例
   * @param listType:top bottom
   * @returns {*}
   */
  isOverMaxLimit: function (me, listType) {
    var toolList,

      isOver = false;
    if (!listType) {
      listType = ['top', 'bottom'];
      for (var i = 0; i < listType.length; i++) {
        toolList = me.toolList.list[listType[i]] || [];
        isOver = toolList.length >= me.TOOL.DATA[listType[i]].MAXLIMIT;
        if (isOver) {
          break;
        }
      }
      return isOver;
    } else {
      toolList = me.toolList.list[listType] || [];
      return toolList.length >= me.TOOL.DATA[listType].MAXLIMIT;
    }

    // if (listType === 'bottom') {
    //   return toolList.length >= me.TOOL[listType].MAXLIMIT;
    // } else {
    //   return toolList || toolList.filter(function (item) {
    //       return item.toolConfig.limited
    //     }).length >= me.TOOL[listType].MAXLIMIT;
    // }
  }
};

}, '');
__applicationContext.define('core.common.tool.toolapi', function (exports,module,require,$) {
var Tool = require('core.player.Tool'),
    logger = require('core.utils.log'),
    stringUtils = require("core.utils.string"),
    urlUtil = require('core.utils.url'),
    i18nLoader = require('core.common.i18nLoader'),
    createModel = require('core.common.createModel'),
    refPathBuilder = require('core.common.refPathBuilder'),
    toolPush = require('core.common.tool.toolpush'),
    logger = require('core.utils.log'),
    tHelper = require('core.common.tool.tool');
var apiList = {
    /**
     * update tool box's display title, push button and so on
     */
    updateToolProperties: function (stoolkey, dtoolkey) {
        var me = this;
        if (me.toolList && me.toolList.all && me.i18nModel && me.i18nModel.tool && stoolkey && dtoolkey) {
            var stoolview = null,
                url = "";
            me.toolList.all.forEach(function (item) {
                if (item.toolKey === stoolkey) {
                    stoolview = item.element;
                }
            });
            $.each(me.i18nModel.tool, function (index, item) {
                if (item.toolKey == dtoolkey) {
                    url = icCreatePlayer.ref_path_tool + "/" + item.url;
                }
            });
            url = stringUtils.applyTemplate(url, me.refPath);
            url = urlUtil.resolve(url);
            var tool = new Tool({
                url: url,
                key: dtoolkey,
                options: {
                    __sys: {
                        disabled: [],
                        hide: []
                    }
                }
            }, me);
            tool.load().done(function (data) {
                createModel(data.model.getValue().properties, data.baseUrl, tool.getRefPathParser()).then(function (model) {
                    if (stoolview) {
                        stoolview.find('.tooldialog_head span img').attr('src', model.smallIcon);
                        stoolview.find('.tooldialog_head em.title').text(tHelper.getToolNameI18n(me.i18nModel.tool, dtoolkey));
                        if (model.push) {
                            stoolview.find('._icplayer_push_button').css('display', 'block');
                        } else {
                            stoolview.find('._icplayer_push_button').css('display', 'none');
                        }
                    }
                });
            });
        }
    },
    /**
     * [addTool description]
     * @param {[type]} url           [description]
     * @param {[type]} options       [options.width="100%"; options.__sys={syncId:'',hide:['header','toolbar'],disable:['min','move','close']}]
     * @param {[type]} state         [description]
     * @param {[type]} extendOptions [description]
     */
    addTool: function (url, options, state, extendOptions) {
        var me = this;
        if (me.waitI18nLoadDF && me.waitToolAddDF &&
            me.waitI18nLoadDF.promise().state() === 'pending' && me.waitToolAddDF.promise().state() === 'pending') {
            logger.error('you click too fast');
            return me.waitToolAddDF.promise();
        }
        me.waitToolAddDF = $.Deferred();
        me.waitI18nLoadDF = $.Deferred();
        //第一次添加时候执行渲染Tool布局
        me.renderPromise.then(function () {
            me.toolPaint = me.layout.renderTool();
            //加载工具tool.json配置
            i18nLoader.loadPlayer().done(function (toolconfiglist) {
                me.i18nModel.tool = toolconfiglist;
                me.waitI18nLoadDF.resolve();
            }).fail(function () {
                me.waitI18nLoadDF.resolve();
            });
        });
        me.waitI18nLoadDF.then(function () {
            //后续添加就不再渲染Tool布局
            me.addTool = function (url, options, state, extendOptions) {
                me.layout.activeTool();
                return me.waitI18nLoadDF.promise().then(function () {
                    var toolkey = tHelper.getToolKey(url, options);
                    if (url && me.i18nModel && me.i18nModel.tool &&
                        (url.indexOf("file:") !== 0 && url.indexOf("http:") !== 0 && url.indexOf("https:") !== 0)) {
                        $.each(me.i18nModel.tool, function (index, item) {
                            if (item.toolKey == toolkey) {
                                url = icCreatePlayer.ref_path_tool + "/" + item.url;
                                if (options.__option === undefined) {
                                    options.__option = {}
                                }
                                options.__option = $.extend({}, item.option, options.__option)
                            }
                        });
                    }

                    url = stringUtils.applyTemplate(url, me.refPath);
                    url = urlUtil.resolve(url);
                    refPathBuilder.set(me, 'tool', url);
                    var deferred = $.Deferred();
                    if (Tool.toolLoadState[toolkey] === 'pending') {
                        logger.error('you click too fast');
                        return deferred.promise();
                    }
                    if (Tool.toolLoadState[toolkey] !== 'done') {
                        Tool.toolLoadState[toolkey] = 'pending';
                    }

                    options = $.extend(true, {
                        __sys: {
                            syncId: '',
                            hide: [''],
                            disabled: ['']
                        }
                    }, options);

                    var toolObject = Tool.getTool(url, options, me.toolList.all);
                    var preActive = me.toolList.active;

                    //判断是否单例
                    if (toolObject) {
                        try {
                            me.layout.setToolZIndex(toolObject);
                            if (preActive && toolObject != me.toolList.list[preActive][0]) {
                                me.toolList.list[preActive][0].fireEvent('blur', {});
                            } else {
                                me.layout.activeTool();
                            }
                            var rtype = '';
                            var rindex = -1;
                            $.each(me.toolList.list, function (type, list) {
                                $.each(list, function (index, tool) {
                                    if (tool == toolObject) {
                                        rtype = type;
                                        rindex = index;
                                    }
                                });
                            });
                            if (rtype && rindex != -1) {
                                me.toolList.list[rtype] = require('core.common.ispointinpath').swapItems(me.toolList.list[rtype], rindex, 'first');
                            }
                        } catch (e) {
                            console.error(e);
                        }
                        deferred.resolve(toolObject);
                    } else {
                        var params = {
                            'url': url,
                            'key': url,
                            'listeners': {
                                'destroy': function () {
                                    //me 指向page
                                    //this 指向tool
                                    me.removeTool(this.unqiueId);
                                }
                            },
                            'options': options
                        };
                        if (state) {
                            params['state'] = state;
                        }
                        var group = new Tool(params, me);
                        me.layout.addTool(group, options).done(function (toolObject) {

                            //如果存在学科工具了就激活最后一个学科工具的blur事件,否则激活学科工具层
                            try {
                                if (preActive) {
                                    me.toolList.list[preActive][0].fireEvent('blur', {});
                                } else {
                                    me.layout.activeTool(toolObject);
                                }
                            } catch (e) {
                                console.error(e);
                            }

                            me.toolList.all.push(toolObject);

                            //再根据independent分组存放
                            var flag = (toolObject.toolConfig.independent === true) ? 'top' : 'bottom';
                            me.toolList.active = flag;
                            var list = me.toolList.list[flag];
                            me.toolList.list[flag].unshift(toolObject);
                            if (!toolObject.options.__sys.NONEventFlag) {
                                me.fireEvent(require('core.eventbus.eventname').tool.finish, toolObject);
                            }

                            deferred.resolve(toolObject);
                        }).fail(function () {
                            deferred.reject();
                        });
                    }

                    return deferred.promise();
                });
            };
            me.addTool(url, options, state, extendOptions).then(function (data) {
                me.waitToolAddDF.resolve(data);
            }).fail(function () {
                me.waitToolAddDF.reject();
            });
        });
        return me.waitToolAddDF.promise();
    },
    getToolList: function () {
        return this.toolList;
    },
    /**
     * 判断是否已经超过限制
     * @param listType:bottom工具窗，top:上层的工具
     * @returns {boolean}
     */
    isMaxToolCount: function (listType) {
        return require('core.common.tool').isOverMaxLimit(this, listType)
    },
    clearTool: function () {
        var me = this;
        while (me.toolList.all.length) {
            me.toolList.all[0].release();
        }
        me.toolList.active = '';
        me.toolList.list = {
            top: [],
            bottom: []
        };
        Tool.toolLoadState = {};
    },
    //兼容处理，由于unqiueId与toolKey不可能 一样 把unqiueId也可能为toolKey
    removeTool: function (unqiueId, scope, NONEventFlag) {
        var me = this;
        var key = "";
        var flag = "";
        var curentTool;
        me.toolList.all = me.toolList.all.filter(function (item) {
            //兼容处理，由于unqiueId与toolKey不可能 一样 把unqiueId也可能为toolKey
            if (item.unqiueId === unqiueId || item.toolKey === unqiueId) {
                key = item.toolKey;
                curentTool = item;
                flag = (item.toolConfig.independent === true) ? 'top' : 'bottom';
                return false;
            }
            return true;
        });
        if (flag !== '') {
            me.toolList.list[flag] = me.toolList.list[flag].filter(function (item) {
                return !(item.unqiueId === unqiueId || item.toolKey === unqiueId);
            });
        }

        //计算单例计数
        Tool.removeTool(key);
        if (curentTool && scope === 'player') {
            curentTool.getController().getCommands().closeTool(NONEventFlag);
        }
        //如果不存在学科工具了就清空页面
        if (!this.toolList.all.length) {
            me.toolList.active = '';
            this.layout.activePage();
            Tool.bridgeClose();
        }
    },
    /**
     * 设置推送框的状态，true:可用的状态，false：不可用的状态。
     */
    setPushDomEnable: function (flag) {
        var me = this.player || this;
        me.fireEvent(require('core.eventbus.eventname').play.push_status, { 'status': flag });
        if (flag) {
            toolPush.setEnable();
        } else {
            toolPush.setDisable();
        }
    },
    player: {}
}
module.exports = {
    create: function (player) {
        apiList.player = player
        return apiList;
    }
}

}, '');
__applicationContext.define('core.common.tool.tooldialog', function (exports,module,require,$) {
var left, top,
    range = {},
    isMove = false,
    eventname = require('core.eventbus.eventname'),
    throttle = require('core.utils.throttle'),
    domUtil = require('core.utils.dom');
module.exports = {
    initEvent: function (modelType) {
        var me = this;
        me.addEventListener('mousedown', {
            fn: function () {
                if (modelType.__type !== 'pc' || (modelType.__type == 'pc' && modelType.disabledMove)) {
                    isMove = false;
                } else {
                    isMove = true;
                }
                var m = domUtil.getEventXY(event);
                var p = me.element.position();
                left = p.left - m.x;
                top = p.top - m.y;
                range.minLeft = 0 - me.element.width() + me.top.TOOL.DATA.DIALOG.STEPLEFT;
                range.maxLeft = me.top.getElement(true).width() - me.top.TOOL.DATA.DIALOG.STEPLEFT;
                range.minTop = 0;
                range.maxTop = me.top.getElement(true).height() - me.top.TOOL.DATA.DIALOG.STEPTOP;
            },
            selector: ['.tooldialog_head', '.btn_tool.tool_full']
        });
        me.addEventListener('mousedown', {
            fn: function () {
                var container = me.container.find('.tooldialog_control.' + me.unqiueId)
                if (modelType.__type == 'pc' && !modelType.disabledFull) {
                    var moveTarge = container.find('.btn_tool.tool_full')
                    var target = container.find('._icplayer_tool_fullscreen');
                    var isFull = target.hasClass('exit_fullscreen')
                    var fontsize = icCreatePlayer.utils.getFontSize()
                    if (isFull) {
                        modelType.disabledMove = false
                        moveTarge.removeClass('click_disabled')
                        target.removeClass('exit_fullscreen').addClass('to_fullscreen')
                        container.css('font-size','')
                        container.removeClass('go_to_fullscreen')
                    } else {
                        modelType.disabledMove = true
                        moveTarge.addClass('click_disabled')
                        target.addClass('exit_fullscreen').removeClass('to_fullscreen')
                        container.css('font-size', fontsize+ 'px')
                        container.addClass('go_to_fullscreen')
                    }
                    if (me.mainModule && me.mainModule.presenter && me.mainModule.presenter.__interface) {
                        var resize = me.mainModule.presenter.__interface.resizeScreen
                        if ($.isFunction(resize)) {
                            resize({ ratio: isFull ?icCreatePlayer.fontSize /fontsize * 3 /4 : fontsize / icCreatePlayer.fontSize * 4 / 3 })
                        }
                    }
                } else if (modelType.__type == 'pc' && modelType.no_full) {
                    var tip = container.find('._icplayer_fullscreen_tip')
                    tip.removeClass('hide_dom')
                    me.deTip(tip)
                }
            },
            selector: '._icplayer_tool_fullscreen'
        });
        me.deTip = throttle.debounce(function (tip) {
             tip.addClass('hide_dom')
             console.log('hide')
            }, 2000, true)
        me.addEventListener('mousedown', {
            fn: function () {
                if (!modelType.disabledMin) {
                    me.element.hide();
                    var side = me.container.find('.sideicon.' + me.unqiueId);
                    if (me.top.TOOL.DATA.CURRENTPUSHTOOL === me.unqiueId) {
                        side.addClass('on');
                    } else {
                        side.removeClass('on');
                    }
                }
            },
            selector: '.btn_tool.tool_small'
        });
        me.addEventListener('mousedown', {
            fn: function () {
                if (!modelType.disabledClose) {
                    if (me.top.TOOL.DATA.PUSHING && me.top.TOOL.DATA.CURRENTPUSHTOOL === me.unqiueId) {
                        me.element.find('.tool_tip').removeClass('tool_tip_small');
                        me.element.find('.tool_tip').find('#tip_next_push').show();
                    } else {
                        me.element.find('.tool_tip').addClass('tool_tip_small');
                        me.element.find('.tool_tip').find('#tip_next_push').hide();
                    }
                    me.element.find('.tool_tip').hide();
                    $(event.srcElement || event.target).next('.tool_tip').show();
                }
            },
            selector: '.btn_tool.tool_close'
        });
        me.addEventListener('mousedown', {
            fn: function () {
                event.stopPropagation();
                event.preventDefault();
                me.element.find('.tool_tip').hide();
                var target = $(event.srcElement || event.target);
                if (target.find('.btn_text').text() === me.top.getI18nModel().player['Tool_Sure'] || target.text() === me.top.getI18nModel().player['Tool_Sure']) {
                    me.container.find('.sideicon.' + me.unqiueId).remove();
                    if (me.top.TOOL.DATA.PUSHING && me.top.TOOL.DATA.CURRENTPUSHTOOL === me.unqiueId) {
                        me.stopPush();
                    }
                    me.release();
                }
            },
            selector: '.tool_tip_wrap'
        });
        me.addEventListener('mousedown', {
            fn: function () {
                event.stopPropagation();
                if (event.type == 'mousedown') {
                    var target = $(event.srcElement || event.target);
                    if ((target.hasClass('_icplayer_push_button') || target.parent().parent().parent().hasClass('_icplayer_push_button')) && !me.top.TOOL.DATA.PUSHING) {
                        me.push();
                    } else if ((target.hasClass('on') && target.hasClass('_icplayer_push_button')) || (target.parent().parent().parent().hasClass('on') && target.parent().parent().parent().hasClass('_icplayer_push_button'))) {
                        if (me.top.TOOL.DATA.PUSHING && me.top.TOOL.DATA.CURRENTPUSHTOOL === me.unqiueId) {
                            me.stopPush();
                        }
                    }
                }
            },
            selector: '.btn_tool.tool_push'
        });
        me.addEventListener(eventname.tool.push_action, {
            fn: function (eventName, eventData) {
                if (eventData) {
                    var uniqueId = me.mainModule.getPresenter() ? (me.mainModule.getPresenter().__model ? me.mainModule.getPresenter().__model.$.unqiueId : 0) : 0;
                    if (eventData.action == 'push') {
                        if (!me.top.TOOL.DATA.PUSHING && eventData.toolKey == me.toolKey && eventData.uniqueId == uniqueId) {
                            me.push();
                        }
                    } else if (eventData.action == 'stop_push') {
                        if (me.top.TOOL.DATA.PUSHING && eventData.toolKey == me.toolKey && eventData.uniqueId == uniqueId) {
                            me.stopPush();
                        }
                    }

                }
            }
        });
        me.addEventListener(eventname.tool.forbide_full, {
            fn: function (eventName, eventData) {
                if (modelType.__type == 'pc' && eventData && eventData.id && eventData.id === me.toolKey + "@" + me.id) {
                    var container = me.container.find('.tooldialog_control.' + me.unqiueId)
                    var target = container.find('._icplayer_tool_fullscreen');
                    modelType.disabledFull = eventData.isForbide === true
                    if (eventData.isForbide) {
                        target.addClass('click_disabled')
                    } else {
                        target.removeClass('click_disabled')
                    }
                }
            }
        })
        me.addEventListener('mousedown', {
            fn: function () {
                var target = event.srcElement || event.target;
                if (target.className !== 'btn_tool tool_close') {
                    me.element.find('.tool_tip').hide();
                }
            }
        });
        me.addEventListener('mousemove', {
            fn: function () {
                if (isMove) {
                    var m = domUtil.getEventXY(event);
                    var mLeft = m.x + left;
                    var mTop = m.y + top;
                    if (mLeft > range.minLeft && mLeft < range.maxLeft && mTop > range.minTop && mTop < range.maxTop) {
                        me.element.css({
                            'left': mLeft,
                            'top': mTop
                        });
                    }
                }
            }
        });
        me.addEventListener('mouseup', function () {
            isMove = false;
        });
    },
    setDisplayMode: function (modelType, adjust, el) {
        var me = this;
        var _parent = me.element.parent();
        var sidetool = (el || me.element).find('.sidetool');
        var head = (el || me.element).find('.tooldialog_head');
        me.element.removeClass('com_tooldialog_student');
        me.element.removeClass('com_tooldialog_board');
        _parent.removeClass('tool_to_edit');
        _parent.removeClass('tool_to_phone');
        _parent.removeClass('tool_outline');
        sidetool.find('.tool_small').removeClass('click_disabled');
        sidetool.find('.tool_close').removeClass('click_disabled');
        sidetool.find('.tool_full').removeClass('click_disabled');
        head.css('display', '');
        switch (modelType.__type) {
            case "stu":
                {
                    me.element.addClass('com_tooldialog_student');
                    if (me.toolConfig && me.toolConfig.autoFull) {
                        head.css('display', 'none');
                    }
                    break;
                }
            case "pre":
                {
                    me.element.addClass('com_tooldialog_student');
                    _parent.addClass('tool_to_edit');
                    break;
                }
            case "mobile":
                {
                    me.element.addClass('com_tooldialog_board');
                    _parent.addClass('tool_to_phone');
                    break;
                }
            case "pc":
                {
                    me.top.container.css('font-size', ((window.screen.width < 1280) ? 16 : icCreatePlayer.fontSize) + 'px');
                    if (window.screen.width < 1280) {
                        icCreatePlayer.fontSize = 16;
                    }
                    me.element.addClass('com_tooldialog_board');
                    break;
                }
        }
        if (modelType.selfBorder) {
            _parent.addClass('tool_outline');
        }
        if (modelType.disabledMin) {
            sidetool.find('.tool_small').addClass('click_disabled');
        }
        if (modelType.disabledClose) {
            sidetool.find('.tool_close').addClass('click_disabled');
        }
        if (modelType.disabledMove) {
            sidetool.find('.tool_full').addClass('click_disabled');
        }
        if (modelType.disabledFull) {
            sidetool.find('._icplayer_tool_fullscreen').addClass('click_disabled');
        }

        //adjust position
        if (adjust) {
            if (modelType.__type !== 'pc') {
                me.preLeft = me.element.css('left');
                me.preTop = me.element.css('top');
                me.element.css({
                    'left': 0,
                    'top': 0,
                    'width': '100%',
                    'height': '100%'
                });
            } else {
                if (me.preLeft && me.preTop) {
                    me.element.css({
                        'left': me.preLeft,
                        'top': me.preTop
                    });
                }
                me.element.css({
                    'width': '',
                    'height': ''
                });
            }
        }
    }
}

}, '');
__applicationContext.define('core.common.tool.toolpush', function (exports,module,require,$) {
var eventname = require('core.eventbus.eventname'),
  detector = require('core.utils.detector'),
  tooldialog = require('core.common.tool.tooldialog'),
  logger = require('core.utils.Log');
module.exports = {
  push: function () {
    var me = this;
    var timer = require('core.common.timer');
    var pushClassName = '.btn_tool.tool_push';
    var hideom = ".tool_wrap_mask";
    var uniqueId = me.mainModule.getPresenter() ? (me.mainModule.getPresenter().__model ? me.mainModule.getPresenter().__model.$.unqiueId : 0) : 0;
    //prevent click event when user pushing tool
    me.element.find(hideom).removeClass('hide_dom');
    me.element.find(pushClassName).addClass('tool_push_ing');
    me.top.startFlow('exerciseStart', {
      scope: ['tool', 'common'],
      sourcePresenterUnqiueId: uniqueId
    }, function () {
      me.top.TOOL.DATA.PUSHING = true;
      me.top.TOOL.DATA.CURRENTPUSHTOOL = me.unqiueId;
      me.switchToolContainerBG(true);
      //after pushing tool event finished ,add hide_dom to enable push button;
      $(pushClassName).removeClass('on').removeClass('tool_push_ing').addClass('click_disabled');
      me.element.find(hideom).addClass('hide_dom');
      me.element.find(pushClassName).addClass('on');
      if (detector.isOnline()) {
        me.element.find(pushClassName).removeClass('click_disabled');
      }
      timer.start(me);
      me.fireEvent(eventname.tool.push_data, {
        "toolKey": me.toolKey,
        "uniqueId": uniqueId,
        "action": "push",
        "result": "success"
      });
      if (me.toolConfig && me.toolConfig.autoFull) {
        tooldialog.setDisplayMode.apply(me,[{
          __type: "stu"
        }, true]);
        me.fireEvent(eventname.tool.adjust_layout, {
          "toolKey": me.toolKey,
          "uniqueId": uniqueId
        })
      }
    }, function () {
      logger.error("push fail");
      $(pushClassName).removeClass('on').removeClass('tool_push_ing');
      if (detector.isOnline()) {
        $(pushClassName).removeClass('click_disabled');
      }
      me.element.find(hideom).addClass('hide_dom');
      me.fireEvent(eventname.tool.push_data, {
        "toolKey": me.toolKey,
        "uniqueId": uniqueId,
        "action": "push",
        "result": "fail"
      });
    });
  },
  stopPush: function () {
    var me = this;
    var timer = require('core.common.timer');
    var pushClassName = '.btn_tool.tool_push';
    var hideom = ".tool_wrap_mask";
    //prevent click event when user pushing tool
    me.element.find(hideom).removeClass('hide_dom');

    var uniqueId = me.mainModule.getPresenter() ? (me.mainModule.getPresenter().__model ? me.mainModule.getPresenter().__model.$.unqiueId : 0) : 0;
    me.top.startFlow('exerciseExit', {
      scope: ['tool', 'common'],
      sourcePresenterUnqiueId: uniqueId
    }, function () {
      me.fireEvent(eventname.tool.push_data, {
        "toolKey": me.toolKey,
        "uniqueId": uniqueId,
        "action": "stop_push",
        "result": "success"
      });
      if (me.toolConfig && me.toolConfig.autoFull) {
        tooldialog.setDisplayMode.apply(me,[{
          __type: "pc"
        }, true]);
        me.fireEvent(eventname.tool.adjust_layout, {
          "toolKey": me.toolKey,
          "uniqueId": uniqueId
        });
      }
      setTimeout(function () {
        me.element.find(hideom).addClass('hide_dom');
      }, 1000);
    }, function () {
      me.fireEvent(eventname.tool.push_data, {
        "toolKey": me.toolKey,
        "uniqueId": uniqueId,
        "action": "stop_push",
        "result": "success"
      });
    });
    me.top.TOOL.DATA.PUSHING = false;
    me.top.TOOL.DATA.CURRENTPUSHTOOL = undefined;
    me.switchToolContainerBG(false);
    timer.reset(me);
    setTimeout(function () {
      me.element.find(hideom).addClass('hide_dom');
    }, 1000);

    $(pushClassName).removeClass('on').removeClass('click_disabled');
  },
  setEnable: function () {
    $('.ic_tool_container').find('._icplayer_push_button').removeClass('click_disabled');
  },
  setDisable: function () {
    $('.ic_tool_container').find('._icplayer_push_button').addClass('click_disabled');
  },
  /**
   * 返回pushdom的状态。true:可用的状态，false：不可用的状态
   * @return {boolean}
   */
  pushDomStatus: function(){
    var me = this;
    return !(me.top.TOOL.DATA.PUSHING||!detector.isOnline())
  }
}

}, '');
__applicationContext.define('core.model.parser.mainxmlparser', function (exports,module,require,$) {
'use strict';
var utilsXML = require('core.utils.xml');
var mainModel = require('core.model.mainModel');

module.exports = {
    parse: function (text) {
        var $dom = $($.parseXML(text));
        var model = new mainModel();
        var commonPages = model.getAttribute('commons');
        var index = 0;
        var parentTagName;
        $dom.find("page").each(function (i, page) {
            var pageInfo = utilsXML.toJsonByAttr(page, ['id', 'name', 'href', 'preview']);
            pageInfo.id = pageInfo.id || 'page_' + index;
            parentTagName = page.parentNode.tagName.toLowerCase();
            if (parentTagName === 'folder') {
                if (pageInfo.name) {
                    commonPages.addItem(pageInfo.name, pageInfo);
                }
            } else {
                if (parentTagName === 'coursewareobject') {
                    var rootPath = page.parentNode.getAttribute("rootPath");
                    pageInfo.href = rootPath + pageInfo.href;
                }
                model.addPage(pageInfo);
            }
            index++;
        });

        $dom.find('style').each(function (i, style) {
            model.setAttribute('css', style.getAttribute('href'));
            model.setAttribute('style', $(style).text());
        });
        return model;
    }
};
}, '');
__applicationContext.define('core.model.parser.moduleparse', function (exports,module,require,$) {
'use strict';
var moduleModel = require('core.model.ModuleModel');
var utilsXML = require('core.utils.xml');
var propertiesParse = require('core.model.parser.propertiesParse');
var Layout = require('core.layout.Layout');

var parseModule = {
    'style': function (module, element) {
        module.setAttribute('css', $(element).attr('href'));
        var style = $(element).text();
        if (style) {
            module.setAttribute('style', style);
        }
    },
    'events': function (module, element) {
        $(element).children('event').each(function (i, event) {
            var $event = $(event);
            var eventName = $event.attr('name');
            if (eventName) {
                var handlerList = [];
                $event.children('handler').each(function (j, handler) {
                    handlerList.push(utilsXML.toJsonByAttr(handler, [{'id': 'targetId'}, {'name': 'handlerName'}]));
                });
                if (handlerList.length) {
                    module.addEvent(eventName, handlerList);
                }
            }
        });
    },
    'properties': propertiesParse
};

module.exports = function (parent, modules) {
    //兼容新旧格式module和addonModule都支持
    var index = 0;
    $(modules).children('module,addonModule').each(function (i, module) {
        var _module = new moduleModel();
        var moduleConfig = utilsXML.toJsonByAttr(module, ['addonId', 'moduleId', 'presenterId', 'id', 'isVisible', 'isLocked', 'style', {
            'lazy-init': function (value) {
                return value.toLowerCase() === 'true';
            }
        }]);
        //兼容新旧格式,addonId和presenterId
        if (!moduleConfig.presenterId && moduleConfig.addonId) {
            moduleConfig.presenterId = moduleConfig.addonId;
        }
        moduleConfig.id = moduleConfig.id || 'module_' + index;
        var layout = utilsXML.toJsonByAttr(module, Layout.attrName);
        _module.setAttributes(moduleConfig);
        _module.setAttribute('layout', layout);

        $(module).children().each(function (i, element) {
            var fn = parseModule[element.tagName];
            if ($.isFunction(fn)) {
                fn(_module, element);
            }
        });
        parent.addModule(_module);
        index++;
    });
};
}, '');
__applicationContext.define('core.model.parser.pagexmlparser', function (exports,module,require,$) {
'use strict';
var pageModel = require('core.model.pageModel');
var moduleParse = require('core.model.parser.moduleParse');
var utilsXML = require('core.utils.xml');
var Layout = require('core.layout.Layout');
var presentersParse = require('core.model.parser.presenterDecalareParse');

var parserMapping = {
    modules: moduleParse,
    addons: presentersParse,
    presenters: presentersParse
};

module.exports = {
    parse: function (text) {
        var dom = $.parseXML(text);
        var model = new pageModel();
        var root = dom.documentElement;
        var layout = utilsXML.toJsonByAttr(root, Layout.attrName);
        model.setAttribute('layout', layout);
        var $page = $(dom).find('page');
        $page.children().each(function (i, element) {
            var parser = parserMapping[element.tagName];
            if (parser) {
                parser(model, element);
            }
        });
        return model;
    }
};
}, '');
__applicationContext.define('core.model.parser.presenterdecalareparse', function (exports,module,require,$) {
'use strict';

var idNameMapping = {
    'presenter': 'id',
    'addon-descriptor': 'addonId'
};

module.exports = function (parent, presenters) {
    //兼容旧格式
    $(presenters).children('presenter,addon-descriptor').each(function (i, presenter) {
        var href = presenter.getAttribute('href');
        if (href) {
            parent.addPresenter(presenter.getAttribute(idNameMapping[presenter.tagName]), href);
        }
    });
};
}, '');
__applicationContext.define('core.model.parser.presenterxmlparser', function (exports,module,require,$) {
'use strict';
var PresenterModel = require('core.model.PresenterModel');
var xmlUtils = require('core.utils.xml');
var dependenceParser = {
    'jsDependency': function (element, attr) {
        $(element).children('javascript').each(function (i, js) {
            var jsObject = xmlUtils.toJsonByAttr(js, ['name', 'version']);
            attr.push(jsObject);
        });
    },
    'moduleDependency': function (element, attr) {
        $(element).children('module').each(function (i, module) {
            var moduleObject = xmlUtils.toJsonByAttr(module, ['addonId', 'href']);
            attr[moduleObject.addonId] = moduleObject;
        });
    }
};

var tagMapping = {
    'presenter': 'script'
};

exports.parse = function (text) {
    var model = new PresenterModel();
    var dom = $($.parseXML(text));
    dom.find('dependencies').children().each(function (i, dependence) {
        var fn = dependenceParser[dependence.tagName];
        if ($.isFunction(fn)) {
            fn(dependence, model.getAttribute(dependence.tagName));
        }
    });
    dom.children('presenter,addon').children('css,view,script,presenter').each(function (index, element) {
        var tagName = element.tagName;
        if (tagName in tagMapping) {
            tagName = tagMapping[tagName];
        }
        model.setAttribute(tagName, $.trim($(element).text()));
    });
    return model;
};
}, '');
__applicationContext.define('core.model.parser.propertiesparse', function (exports,module,require,$) {
'use strict';
var utilsXML = require('core.utils.xml');

var buildProp = function (element, fn) {
    $(element).children('property').each(function (i, prop) {
        var oProp;
        if (prop.getAttribute('type') === 'list') {
            oProp = utilsXML.toJsonByAttr(prop, ['name', 'type']);
            oProp.value = [];
            $(prop).find('items>item').each(function (i, item) {
                var itemProps = [];
                buildProp(item, function (oProp) {
                    itemProps.push(oProp);
                });
                oProp.value.push(itemProps);
            });
        } else {
            oProp = utilsXML.toJsonByAttr(prop, ['name', 'type', 'value']);
            var sText = $.trim($(prop).text());
            if (sText) {
                oProp.text = sText;
            }
        }
        fn(oProp);
    });
};


module.exports = function (parent, element) {
    buildProp(element, function (oProp) {
        parent.addProperty(oProp);
    });
};
}, '');
__applicationContext.define('core.model.parser.simplejsonparser', function (exports,module,require,$) {
'use strict';
exports.parse = function (text) {
    return JSON.parse(text);
};
}, '');
__applicationContext.define('core.model.parser.toolparser', function (exports,module,require,$) {
'use strict';
var modulesParse = require('core.model.parser.moduleParse');
var propertiesParse = require('core.model.parser.propertiesParse');
var presentersParse = require('core.model.parser.presenterDecalareParse');
var ToolModel = require('core.model.ToolModel');
var xmlUtil = require('core.utils.xml');
var Layout = require('core.layout.Layout');

var parserMapping = {
    'presenters': presentersParse,
    'properties': propertiesParse,
    'modules': modulesParse
};

module.exports = {
    'parse': function (text) {
        var model = new ToolModel();
        var dom = $.parseXML(text);
        var $tool = $(dom).children('tool');
        var toolLayout = xmlUtil.toJsonByAttr($tool[0], Layout.attrName);
        model.setAttribute('layout', toolLayout);

        $tool.children().each(function (i, element) {
            var key = element.tagName;
            var parser = parserMapping[key];
            if (parser) {
                parser(model, element);
            }
            if (key === 'modules') {
                model.setAttribute('mainModule', element.getAttribute('main') || 'main');
            }
        });
        return model;
    }
};
}, '');
__applicationContext.define('core.model.proxy.ajaxproxy', function (exports,module,require,$) {
'use strict';
exports.getData = function (url, isCache) {
    return $.ajax({
        "url": url,
        "cache": (isCache !== false),
		"dataType": "text"
    });
};

}, '');
__applicationContext.define('core.locations.en.lang', function (exports,module,require,$) {
module.exports = {
	"Tool_ToolName": "Tool Name",
	"Tool_Sure": "Confirm",
	"Tool_Push": "Send",
	"Tool_Pushing": "Sending",
	"Tool_Finish": "End",
	"Tool_Pushed_Tip": "The tool has already been sent to student(s). It will close for student(s) if you close now",
	"Tool_Tip": "Close?",
	"Tool_Cancel": "Cancel",
	"Tool_PopLimit": "You have already opened <span id='maxlimit'></span> <span id='classtool'></span>.<br/>Please close 1 before you open another.",
	"Tool_See": "Got It",
	"Tool_bottom": "class tools",
	"Tool_top": "common tools",
	"Tool_full": "This function is coming soon.",
	"Tool_Not_Support": "Sorry，this tool does not support Windows XP, please experience in Windows 7 and above."
};

}, '');
__applicationContext.define('core.locations.en_us.lang', function (exports,module,require,$) {
module.exports = {
	"Tool_ToolName": "Tool Name",
	"Tool_Sure": "Confirm",
	"Tool_Push": "Send",
	"Tool_Pushing": "Sending",
	"Tool_Finish": "End",
	"Tool_Pushed_Tip": "The tool has already been sent to student(s). It will close for student(s) if you close now",
	"Tool_Tip": "Close?",
	"Tool_Cancel": "Cancel",
	"Tool_PopLimit": "You have already opened <span id='maxlimit'></span> <span id='classtool'></span>.<br/>Please close 1 before you open another.",
	"Tool_See": "Got It",
	"Tool_bottom":"class tools",
	"Tool_top":"common tools",
	"Tool_full":"This function is coming soon.",
	"Tool_Not_Support": "Sorry，this tool does not support Windows XP, please experience in Windows 7 and above."
};

}, '');
__applicationContext.define('core.locations.ja.lang', function (exports,module,require,$) {
module.exports = {
	"Tool_ToolName": "工具名称",
	"Tool_Sure": "OK",
	"Tool_Push": "送信",
	"Tool_Pushing": "送信中",
	"Tool_Finish": "終了",
	"Tool_Pushed_Tip": "ツールは生徒端末に送信されました。今閉じると生徒端末の使用が終了となりますが。",
	"Tool_Tip": "ツールを閉じますか？",
	"Tool_Cancel": "キャンセル",
	"Tool_PopLimit": "既に<span id='maxlimit'></span>つの<span id='classtool'></span>が開かれました，<br/>新たなツールを開く前に、開かれたツールを閉じてください。",
	"Tool_See": "了解です...",
	"Tool_bottom":"教科ツール",
	"Tool_top":"一般ツール",
	"Tool_full":"機能開発中、乞うご期待!"
};

}, '');
__applicationContext.define('core.locations.ja_jp.lang', function (exports,module,require,$) {
module.exports = {
	"Tool_ToolName": "工具名称",
	"Tool_Sure": "OK",
	"Tool_Push": "送信",
	"Tool_Pushing": "送信中",
	"Tool_Finish": "終了",
	"Tool_Pushed_Tip": "ツールは生徒端末に送信されました。今閉じると生徒端末の使用が終了となりますが。",
	"Tool_Tip": "ツールを閉じますか？",
	"Tool_Cancel": "キャンセル",
	"Tool_PopLimit": "既に<span id='maxlimit'></span>つの<span id='classtool'></span>が開かれました，<br/>新たなツールを開く前に、開かれたツールを閉じてください。",
	"Tool_See": "了解です...",
	"Tool_bottom":"教科ツール",
	"Tool_top":"一般ツール",
	"Tool_full":"機能開発中、乞うご期待!"
};

}, '');
__applicationContext.define('core.locations.zh.lang', function (exports,module,require,$) {
module.exports = {
	"Tool_ToolName": "工具名称",
	"Tool_Sure": "确定",
	"Tool_Push": "推送",
	"Tool_Pushing": "推送中",
	"Tool_Finish": "结束",
	"Tool_Pushed_Tip": "工具已推送至学生端，此时关闭将同时结束学生端使用。",
	"Tool_Tip": "确认关闭当前工具吗？",
	"Tool_Cancel": "取消",
	"Tool_PopLimit": "老师，已经打开<span id='maxlimit'></span>个<span id='classtool'></span>，<br/>请先关闭已有的工具，再新开工具。",
	"Tool_See": "知道了...",
	"Tool_bottom":"课时工具",
	"Tool_top":"常用工具",
	"Tool_full":"该功能程序哥哥正在加班加点的开发中哦，<br>敬请期待！",
	"Tool_Not_Support": "抱歉，该工具不支持XP系统，请在win7及以上的操作系统中体验。"
};

}, '');
__applicationContext.define('core.locations.zh_cn.lang', function (exports,module,require,$) {
module.exports = {
	"Tool_ToolName": "工具名称",
	"Tool_Sure": "确定",
	"Tool_Push": "推送",
	"Tool_Pushing": "推送中",
	"Tool_Finish": "结束",
	"Tool_Pushed_Tip": "工具已推送至学生端，此时关闭将同时结束学生端使用。",
	"Tool_Tip": "确认关闭当前工具吗？",
	"Tool_Cancel": "取消",
	"Tool_PopLimit": "老师，已经打开<span id='maxlimit'></span>个<span id='classtool'></span>，<br/>请先关闭已有的工具，再新开工具。",
	"Tool_See": "知道了...",
	"Tool_bottom":"课时工具",
	"Tool_top":"常用工具",
	"Tool_full":"该功能程序哥哥正在加班加点的开发中哦，<br>敬请期待！",
	"Tool_Not_Support": "抱歉，该工具不支持XP系统，请在win7及以上的操作系统中体验。"
};

}, '');
__applicationContext.define('core.locations.zh_hk.lang', function (exports,module,require,$) {
module.exports = {
	"Tool_ToolName": "工具名稱",
	"Tool_Sure": "確定",
	"Tool_Push": "推送",
	"Tool_Pushing": "推送中",
	"Tool_Finish": "結束",
	"Tool_Pushed_Tip": "工具已推送至學生端，此時關閉將同時結束學生端使用。",
	"Tool_Tip": "確認關閉當前工具嗎？",
	"Tool_Cancel": "取消",
	"Tool_PopLimit": "老師，已經打開<span id='maxlimit'></span>個<span id='classtool'></span>，<br/>請先關閉已有的工具，再新開工具。",
	"Tool_See": "知道了...",
	"Tool_bottom":"課時工具",
	"Tool_top":"常用工具",
	"Tool_full":"該功能程序哥哥正在加班加點的開發中哦，<br>敬請期待！",
	"Tool_Not_Support": "抱歉，該工具不支持XP系統，請在win7及以上的操作系統中體驗。"
};

}, '');
__applicationContext.define('core.utils.drawingboard.board', function (exports,module,require,$) {
'use strict';
var DrawingBoardUtil = require('core.utils.drawingboard.utils');
var SimpleUndo = require('core.utils.baseundo');
var DrawingBoardMicroEvent = require('core.utils.drawingboard.microevent');
var uuid = require('core.utils.uuid');
var DrawingBoard = function(el, opts) {
	this.opts = this.mergeOptions(opts);

	this.ev = new DrawingBoardMicroEvent();
    //为存储时key
	$.data(el,'id',uuid(8));
	this.$el = el;
	if (!this.$el.length)
		return false;
	var tpl = '<div class="ic_page_tool_drawing-board-canvas-wrapper"><canvas class="ic_page_tool_drawing-board-canvas"></canvas><div class="ic_page_tool_drawing-board-cursor ic_page_tool_drawing-board-utils-hidden"></div></div>';
	this.$el.addClass('ic_page_tool_drawing-board').append(tpl);
	this.dom = {
	    $canvasWrapper: this.$el.find('.ic_page_tool_drawing-board-canvas-wrapper'),
	    $canvas: this.$el.find('.ic_page_tool_drawing-board-canvas'),
	    $cursor: this.$el.find('.ic_page_tool_drawing-board-cursor'),
	    $controls: this.$el.find('.ic_page_tool_drawing-board-controls')
	};

	$.each(['left', 'right', 'center'], $.proxy(function(n, val) {
		if (this.opts.controlsPosition.indexOf(val) > -1) {
			this.dom.$controls.attr('data-align', val);
			return false;
		}
	}, this));

	this.canvas = this.dom.$canvas.get(0);
	this.ctx = this.canvas && this.canvas.getContext && this.canvas.getContext('2d') ? this.canvas.getContext('2d') : null;
	this.color = this.opts.color;

	if (!this.ctx) {
		if (this.opts.errorMessage)
			this.$el.html(this.opts.errorMessage);
		return false;
	}
	this.storage = this._getStorage();

	this.initHistory();
	//init default board values before controls are added (mostly pencil color and size)
	this.reset({ webStorage: false, history: false, background: false });
	//init controls (they will need the default board values to work like pencil color and size)
    //this.initControls();
	//set board's size after the controls div is added
	this.resize();
	//reset the board to take all resized space
	this.reset({ webStorage: false, history: false, background: true });
	this.restoreWebStorage();
	this.initDropEvents();
	//this.initDrawEvents();
};

DrawingBoard.defaultOpts = {
	controls: ['Color', 'DrawingMode', 'Size', 'Navigation'],
	controlsPosition: "top left",
	color: "#000000",
	size: 1,
	background: false,
	eraserColor: "background",
	fillTolerance: 100,
	fillHack: true, //try to prevent issues with anti-aliasing with a little hack by default
	webStorage: 'session',
	droppable: false,
	enlargeYourContainer: false,
	errorMessage: "<p>Your Broswer version is too older. <a href=\"http://browsehappy.com/\" target=\"_blank\">please update the browser to the latest.</a></p>",
	stretchImg: false //是否拉伸背景图片
};
DrawingBoard.prototype = {

	mergeOptions: function(opts) {
		opts = $.extend({}, DrawingBoard.defaultOpts, opts);
		if (!opts.background && opts.eraserColor === "background")
			opts.eraserColor = "transparent";
		return opts;
	},

	reset: function(opts) {
		opts = $.extend({
			color: this.opts.color,
			size: this.opts.size,
			webStorage: true,
			history: true,
			background: false
		}, opts);

		this.setMode('pencil');

		if (opts.background) {
			this.resetBackground(this.opts.background, $.proxy(function() {
				if (opts.history) this.saveHistory();
			}, this));
		}

		if (opts.color) this.setColor(opts.color);
		if (opts.size) this.ctx.lineWidth = opts.size;

		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";

		if (opts.webStorage) this.saveWebStorage();

		if (opts.history && !opts.background) this.saveHistory();

		this.blankCanvas = this.getImg();

		this.ev.trigger('board:reset', opts);
	},

	resetBackground: function(background, callback) {
		background = background || this.opts.background;

		var bgIsColor = DrawingBoardUtil.isColor(background);
		var prevMode = this.getMode();
		this.setMode('pencil');
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		if (bgIsColor) {
			this.ctx.fillStyle = background;
			this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
			this.history.initialize(this.getImg());
			if (callback) callback();
		} else if (background)
			this.setImg(background, {
				callback: $.proxy(function() {
					this.history.initialize(this.getImg());
					if (callback) callback();
				}, this)
			});
		this.setMode(prevMode);
	},

	resize: function() {
	    this.dom.$controls.toggleClass('ic_page_tool_drawing-board-controls-hidden', (!this.controls || !this.controls.length));

		var canvasWidth, canvasHeight;
		var widths = [
			this.$el.width(),
			DrawingBoardUtil.boxBorderWidth(this.$el),
			DrawingBoardUtil.boxBorderWidth(this.dom.$canvasWrapper, true, true)
		];
		var heights = [
			this.$el.height(),
			DrawingBoardUtil.boxBorderHeight(this.$el),
			this.dom.$controls.height(),
			DrawingBoardUtil.boxBorderHeight(this.dom.$controls, false, true),
			DrawingBoardUtil.boxBorderHeight(this.dom.$canvasWrapper, true, true)
		];
		var sum = function(values, multiplier) { //make the sum of all array values
			multiplier = multiplier || 1;
			var res = values[0];
			for (var i = 1; i < values.length; i++) {
				res = res + (values[i]*multiplier);
			}
			return res;
		};
		var sub = function(values) { return sum(values, -1); }; //substract all array values from the first one

		if (this.opts.enlargeYourContainer) {
			canvasWidth = this.$el.width();
			canvasHeight = this.$el.height();

			this.$el.width( sum(widths) );
			this.$el.height( sum(heights) );
		} else {
			canvasWidth = sub(widths);
			canvasHeight = sub(heights);
		}

		this.dom.$canvasWrapper.css('width', canvasWidth + 'px');
		this.dom.$canvasWrapper.css('height', canvasHeight + 'px');

		this.dom.$canvas.css('width', canvasWidth + 'px');
		this.dom.$canvas.css('height', canvasHeight + 'px');

		this.canvas.width = canvasWidth;
		this.canvas.height = canvasHeight;
	},
	initControls: function() {
		
	},

	
	addControl: function() {

	},

	initHistory: function() {
		this.history = new SimpleUndo({
			maxLength: 30,
			provider: $.proxy(function(done) {
				done(this.getImg());
			}, this),
			onUpdate: $.proxy(function() {
				this.ev.trigger('historyNavigation');
			}, this)
		});
	},

	saveHistory: function() {
		this.history.save();
	},

	restoreHistory: function(image) {
		this.setImg(image, {
			callback: $.proxy(function() {
				this.saveWebStorage();
			}, this)
		});
	},

	goBackInHistory: function() {
		this.history.undo($.proxy(this.restoreHistory, this));
	},

	goForthInHistory: function() {
		this.history.redo($.proxy(this.restoreHistory, this));
	},


	setImg: function(src, opts) {
		opts = $.extend({
			stretch: this.opts.stretchImg,
			callback: null
		}, opts);

		var ctx = this.ctx;
		var img = new Image();
		var oldGCO = ctx.globalCompositeOperation;
		img.onload = function() {
			ctx.globalCompositeOperation = "source-over";
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			if (opts.stretch) {
				ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
			} else {
				ctx.drawImage(img, 0, 0);
			}

			ctx.globalCompositeOperation = oldGCO;

			if (opts.callback) {
				opts.callback();
			}
		};
		img.src = src;
	},

	getImg: function() {
		return this.canvas.toDataURL("image/png");
	},

	downloadImg: function() {
		var img = this.getImg();
		img = img.replace("image/png", "image/octet-stream");
		window.location.href = img;
	},


	saveWebStorage: function() {
		if (window[this.storage]) {
			window[this.storage].setItem('drawing-board-' +$.data(this,'id'), this.getImg());
			this.ev.trigger('board:save' + this.storage.charAt(0).toUpperCase() + this.storage.slice(1), this.getImg());
		}
	},

	restoreWebStorage: function() {
	    if (window[this.storage] && window[this.storage].getItem('drawing-board-' + $.data(this, 'id')) !== null) {
	        this.setImg(window[this.storage].getItem('drawing-board-' + $.data(this, 'id')));
	        this.ev.trigger('board:restore' + this.storage.charAt(0).toUpperCase() + this.storage.slice(1), window[this.storage].getItem('drawing-board-' + $.data(this, 'id')));
		}
	},

	clearWebStorage: function() {
	    if (window[this.storage] && window[this.storage].getItem('drawing-board-' + $.data(this, 'id')) !== null) {
	        window[this.storage].removeItem('drawing-board-' + $.data(this, 'id'));
			this.ev.trigger('board:clear' + this.storage.charAt(0).toUpperCase() + this.storage.slice(1));
		}
	},

	_getStorage: function() {
		if (!this.opts.webStorage || !(this.opts.webStorage === 'session' || this.opts.webStorage === 'local')) return false;
		return this.opts.webStorage + 'Storage';
	},



	

	initDropEvents: function() {
		if (!this.opts.droppable)
			return false;

		this.dom.$canvas.on('dragover dragenter drop', function(e) {
			e.stopPropagation();
			e.preventDefault();
		});

		this.dom.$canvas.on('drop', $.proxy(this._onCanvasDrop, this));
	},

	_onCanvasDrop: function(e) {
		e = e.originalEvent ? e.originalEvent : e;
		var files = e.dataTransfer.files;
		if (!files || !files.length || files[0].type.indexOf('image') == -1 || !window.FileReader)
			return false;
		var fr = new FileReader();
		fr.readAsDataURL(files[0]);
		fr.onload = $.proxy(function(ev) {
			this.setImg(ev.target.result, {
				callback: $.proxy(function() {
					this.saveHistory();
				}, this)
			});
			this.ev.trigger('board:imageDropped', ev.target.result);
			this.ev.trigger('board:userAction');
		}, this);
	},



	

	setMode: function(newMode, silent) {
		silent = silent || false;
		newMode = newMode || 'pencil';

		this.ev.unbind('board:startDrawing', $.proxy(this.fill, this));

		if (this.opts.eraserColor === "transparent")
			this.ctx.globalCompositeOperation = newMode === "eraser" ? "destination-out" : "source-over";
		else {
			if (newMode === "eraser") {
			    if (this.opts.eraserColor === "background" && DrawingBoardUtil.isColor(this.opts.background))
					this.ctx.strokeStyle = this.opts.background;
			    else if (DrawingBoardUtil.isColor(this.opts.eraserColor))
					this.ctx.strokeStyle = this.opts.eraserColor;
			} else if (!this.mode || this.mode === "eraser") {
				this.ctx.strokeStyle = this.color;
			}

			if (newMode === "filler")
				this.ev.bind('board:startDrawing', $.proxy(this.fill, this));
		}
		this.mode = newMode;
		if (!silent)
			this.ev.trigger('board:mode', this.mode);
	},

	getMode: function() {
		return this.mode || "pencil";
	},

	setColor: function(color) {
		var that = this;
		color = color || this.color;
		if (!DrawingBoardUtil.isColor(color))
			return false;
		this.color = color;
		if (this.opts.eraserColor !== "transparent" && this.mode === "eraser") {
			var setStrokeStyle = function(mode) {
				if (mode !== "eraser")
					that.strokeStyle = that.color;
				that.ev.unbind('board:mode', setStrokeStyle);
			};
			this.ev.bind('board:mode', setStrokeStyle);
		} else
			this.ctx.strokeStyle = this.color;
	},

	
	fill: function(e) {
		if (this.getImg() === this.blankCanvas) {
			this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
			this.ctx.fillStyle = this.color;
			this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
			return;
		}

		var img = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

		// constants identifying pixels components
		var INDEX = 0, X = 1, Y = 2, COLOR = 3;

		var stroke = this.ctx.strokeStyle;
		var r = parseInt(stroke.substr(1, 2), 16);
		var g = parseInt(stroke.substr(3, 2), 16);
		var b = parseInt(stroke.substr(5, 2), 16);

		var start = DrawingBoardUtil.pixelAt(img, parseInt(e.coords.x, 10), parseInt(e.coords.y, 10));
		var startColor = start[COLOR];
		var tolerance = this.opts.fillTolerance;
		var useHack = this.opts.fillHack; //see https://github.com/Leimi/drawingboard.js/pull/38

		if (DrawingBoardUtil.compareColors(startColor, DrawingBoardUtil.RGBToInt(r, g, b), tolerance))
			return;

		var queue = [start];

		var pixel;
		var maxX = img.width - 1;
		var maxY = img.height - 1;

		function updatePixelColor(pixel) {
			img.data[pixel[INDEX]] = r;
			img.data[pixel[INDEX] + 1] = g;
			img.data[pixel[INDEX] + 2] = b;
		}

		while ((pixel = queue.pop())) {
			if (useHack)
				updatePixelColor(pixel);

			if (DrawingBoardUtil.compareColors(pixel[COLOR], startColor, tolerance)) {
				if (!useHack)
					updatePixelColor(pixel);
				if (pixel[X] > 0) // west
				    queue.push(DrawingBoardUtil.pixelAt(img, pixel[X] - 1, pixel[Y]));
				if (pixel[X] < maxX) // east
				    queue.push(DrawingBoardUtil.pixelAt(img, pixel[X] + 1, pixel[Y]));
				if (pixel[Y] > 0) // north
				    queue.push(DrawingBoardUtil.pixelAt(img, pixel[X], pixel[Y] - 1));
				if (pixel[Y] < maxY) // south
				    queue.push(DrawingBoardUtil.pixelAt(img, pixel[X], pixel[Y] + 1));
			}
		}

		this.ctx.putImageData(img, 0, 0);
	},




	initDrawEvents: function() {
		
		this.isDrawing = false;
		this.isMouseHovering = false;
		this.coords = {};
		this.coords.old = this.coords.current = this.coords.oldMid = { x: 0, y: 0 };

		this.dom.$canvas.on('mousedown touchstart', $.proxy(function(e) {
			this._onInputStart(e, this._getInputCoords(e) );
		}, this));

		this.dom.$canvas.on('mousemove touchmove', $.proxy(function(e) {
			this._onInputMove(e, this._getInputCoords(e) );
		}, this));

		//this.dom.$canvas.on('mousemove', $.proxy(function(e) {

		//}, this));

		this.dom.$canvas.on('mouseup touchend', $.proxy(function(e) {
			this._onInputStop(e, this._getInputCoords(e) );
		}, this));

		this.dom.$canvas.on('mouseover', $.proxy(function(e) {
			this._onMouseOver(e, this._getInputCoords(e) );
		}, this));

		this.dom.$canvas.on('mouseout', $.proxy(function(e) {
			this._onMouseOut(e, this._getInputCoords(e) );

		}, this));

		$('body').on('mouseup touchend', $.proxy(function() {
			this.isDrawing = false;
		}, this));

		if (window.requestAnimationFrame) requestAnimationFrame( $.proxy(this.draw, this) );
	},

	draw: function() {
		
		if (window.requestAnimationFrame && this.ctx.lineWidth > 10 && this.isMouseHovering) {
			this.dom.$cursor.css({ width: this.ctx.lineWidth + 'px', height: this.ctx.lineWidth + 'px' });
			var transform = DrawingBoardUtil.tpl("translateX({{x}}px) translateY({{y}}px)", { x: this.coords.current.x - (this.ctx.lineWidth / 2), y: this.coords.current.y - (this.ctx.lineWidth / 2) });
			this.dom.$cursor.css({ 'transform': transform, '-webkit-transform': transform, '-ms-transform': transform });
			this.dom.$cursor.removeClass('ic_page_tool_drawing-board-utils-hidden');
		} else {
		    this.dom.$cursor.addClass('ic_page_tool_drawing-board-utils-hidden');
		}

		if (this.isDrawing) {
			var currentMid = this._getMidInputCoords(this.coords.current);
			this.ctx.beginPath();
			this.ctx.moveTo(currentMid.x, currentMid.y);
			this.ctx.quadraticCurveTo(this.coords.old.x, this.coords.old.y, this.coords.oldMid.x, this.coords.oldMid.y);
			this.ctx.stroke();

			this.coords.old = this.coords.current;
			this.coords.oldMid = currentMid;
		}

		if (window.requestAnimationFrame) requestAnimationFrame( $.proxy(function() { this.draw(); }, this) );
	},

	_onInputStart: function(e, coords) {
		this.coords.current = this.coords.old = coords;
		this.coords.oldMid = this._getMidInputCoords(coords);
		this.isDrawing = true;

		if (!window.requestAnimationFrame) this.draw();

		this.ev.trigger('board:startDrawing', {e: e, coords: coords});
		e.stopPropagation();
		e.preventDefault();
	},

	_onInputMove: function(e, coords) {
		this.coords.current = coords;
		this.ev.trigger('board:drawing', {e: e, coords: coords});

		if (!window.requestAnimationFrame) this.draw();

		e.stopPropagation();
		e.preventDefault();
	},

	_onInputStop: function(e, coords) {
		if (this.isDrawing && (!e.touches || e.touches.length === 0)) {
			this.isDrawing = false;

			this.saveWebStorage();
			this.saveHistory();

			this.ev.trigger('board:stopDrawing', {e: e, coords: coords});
			this.ev.trigger('board:userAction');
			e.stopPropagation();
			e.preventDefault();
		}
	},

	_onMouseOver: function(e, coords) {
		this.isMouseHovering = true;
		this.coords.old = this._getInputCoords(e);
		this.coords.oldMid = this._getMidInputCoords(this.coords.old);

		this.ev.trigger('board:mouseOver', {e: e, coords: coords});
	},

	_onMouseOut: function(e, coords) {
		this.isMouseHovering = false;

		this.ev.trigger('board:mouseOut', {e: e, coords: coords});
	},

	_getInputCoords: function(e) {
		e = e.originalEvent ? e.originalEvent : e;
		var
			rect = this.canvas.getBoundingClientRect(),
			width = this.dom.$canvas.width(),
			height = this.dom.$canvas.height()
		;
		var x, y;
		if (e.touches && e.touches.length == 1) {
			x = e.touches[0].pageX;
			y = e.touches[0].pageY;
		} else {
			x = e.pageX;
			y = e.pageY;
		}
		x = x - this.dom.$canvas.offset().left;
		y = y - this.dom.$canvas.offset().top;
		x *= (width / rect.width);
		y *= (height / rect.height);
		return {
			x: x,
			y: y
		};
	},

	_getMidInputCoords: function(coords) {
		return {
			x: this.coords.old.x + coords.x>>1,
			y: this.coords.old.y + coords.y>>1
		};
	}
};
module.exports = DrawingBoard;
}, '');
__applicationContext.define('core.utils.drawingboard.microevent', function (exports,module,require,$) {
'use strict';
/**
 * https://github.com/jeromeetienne/microevent.js
 * MicroEvent - to make any js object an event emitter (server or browser)
 *
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/

var MicroEvent = function () { };

MicroEvent.prototype = {
    bind: function (event, fct) {
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(fct);
    },
    unbind: function (event, fct) {
        this._events = this._events || {};
        if (event in this._events === false) return;
        this._events[event].splice(this._events[event].indexOf(fct), 1);
    },
    trigger: function (event /* , args... */) {
        this._events = this._events || {};
        if (event in this._events === false) return;
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
};
//module.type = 'class';
module.exports = MicroEvent;
}, '');
__applicationContext.define('core.utils.drawingboard.utils', function (exports,module,require,$) {
"use strict";

(function () {
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
}());
function _boxBorderSize($el, withPadding, withMargin, direction) {
    if ($el.length <= 0) return 0;
    withPadding = !!withPadding || true;
    withMargin = !!withMargin || false;
    var width = 0,
        props;
    if (direction == "width") {
        props = ['border-left-width', 'border-right-width'];
        if (withPadding) props.push('padding-left', 'padding-right');
        if (withMargin) props.push('margin-left', 'margin-right');
    } else {
        props = ['border-top-width', 'border-bottom-width'];
        if (withPadding) props.push('padding-top', 'padding-bottom');
        if (withMargin) props.push('margin-top', 'margin-bottom');
    }
    for (var i = props.length - 1; i >= 0; i--)
        width += parseInt($el.css(props[i]).replace('px', ''), 10);
    return width;
}
module.exports = {
    /**
    * Tim (lite)
    *   github.com/premasagar/tim
    *//*
	A tiny, secure JavaScript micro-templating script.
   */
    tpl : (function(){
        var start   = "{{",
            end     = "}}",
            path    = "[a-z0-9_][\\.a-z0-9_]*", // e.g. config.person.name
            pattern = new RegExp(start + "\\s*("+ path +")\\s*" + end, "gi"),
            undef;

        return function(template, data){
            // Merge data into the template string
            return template.replace(pattern, function(tag, token){
                var path = token.split("."),
                    len = path.length,
                    lookup = data,
                    i = 0;

                for (; i < len; i++){
                    lookup = lookup[path[i]];

                    // Property not found
                    if (lookup === undef){
                        throw "tim: '" + path[i] + "' not found in " + tag;
                    }

                    // Return the required value
                    if (i === len - 1){
                        return lookup;
                    }
                }
            });
        };
    }()),
    
    boxBorderWidth : function($el, withPadding, withMargin) {
        return _boxBorderSize($el, withPadding, withMargin, 'width');
    },
    boxBorderHeight : function($el, withPadding, withMargin) {
        return _boxBorderSize($el, withPadding, withMargin, 'height');
    },
    isColor : function(string) {
        if (!string || !string.length) return false;
        return (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i).test(string) || $.inArray(string.substring(0, 3), ['rgb', 'hsl']) !== -1;
    },RGBToInt : function(r, g, b) {
        var c = 0;
        c |= (r & 255) << 16;
        c |= (g & 255) << 8;
        c |= (b & 255);
        return c;
    },pixelAt: function(image, x, y) {
        var i = (y * image.width + x) * 4;
        var c = this.RGBToInt(
            image.data[i],
            image.data[i + 1],
            image.data[i + 2]
        );

        return [
            i, // INDEX
            x, // X
            y, // Y
            c  // COLOR
        ];
    },compareColors: function(a, b, tolerance) {
        if (tolerance === 0) {
            return (a === b);
        }

        var ra = (a >> 16) & 255, rb = (b >> 16) & 255,
            ga = (a >> 8) & 255, gb = (b >> 8) & 255,
            ba = a & 255, bb = b & 255;

        return (Math.abs(ra - rb) <= tolerance)&& (Math.abs(ga - gb) <= tolerance)&& (Math.abs(ba - bb) <= tolerance);
    }
};


}, '');
(function(window,$,require){ 'use strict';
//定义全局icCreatePlayer,兼容之前gwt的版本
var request = require('core.utils.request');
var Player = require('core.player.Player');
var detector = require('core.utils.detector');
var sync = require('core.plugin.sync');
var EventBus = require('core.eventbus.eventbus');
var defaultPlayerConfig = {
  'refPath': {
    'ref-path': request('ref-path'),
    'ref-path-addon': request('ref-path-addon'),
    'ref-path-online': request('ref-path-online'),
    'ref-path-tool': request('ref-path-tool') || '../tools/'
  },
  'url': request('main') || request('main-url'),
  'pageUrl': request('page-url'),
  'playerCode': request('player-code'),
  'hidePage': request('hidePage'),
  'stateToken': request('ls_token'),
  'location': {
    'current': request('_lang_'),
    'default_lang': 'zh'
  },
  'startPageIndex': request(
    'startPageIndex'),
  'startPageId': request('startPageId'),
  'startPageName': request('startPageName'),
  'toolClose': function () { }
};
//将默认配置应用到config上,方便独立页面发布,player自动获取url上的参数,以页面配置为主,为空时才自动获取
var applyConfig = function (config, defaultConfig) {
  var defaultValue, value;
  for (var key in defaultConfig) {
    defaultValue = defaultConfig[key];
    value = config[key];
    if ($.isPlainObject(value)) {
      //深度遍历
      applyConfig(value, defaultValue);
    } else if (!(key in config)) {
      //index上没有配置再套用默认配置
      config[key] = defaultConfig[key];
    }
  }
};

//计算fontSize
var getFontSize = function () {
  var winWidth = 0;
  var winHeight = 0;
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
    winWidth = document.documentElement.clientWidth;
    winHeight = document.documentElement.clientHeight;
  }
  var winSizeValue = {
    'width': winWidth,
    'height': winHeight
  };
  var defaultWidth = 1920;
  var defaultHeight = 1080;
  var defaultFontSize = 24;

  if (winSizeValue.width === 0 && winSizeValue.height === 0) {
    winSizeValue.width = icCreatePlayer.request('docWidth')
    winSizeValue.height = icCreatePlayer.request('docHeight')
  }

  var fontSize = 0;
  if (winSizeValue.width / winSizeValue.height <= defaultWidth / defaultHeight) {
    fontSize = winSizeValue.width / defaultWidth * defaultFontSize;
  } else {
    fontSize = winSizeValue.height / defaultHeight * defaultFontSize;
  }
  return fontSize;
};

var getOS = function () {
  if (window.navigator && window.navigator.userAgent) {
    var ua = window.navigator.userAgent.toLowerCase();
    var re = /windows nt \d+\.+\d+/;
    var result = ua.match(re);
    if (result && result[0]) {
      switch (result[0]) {
        case "windows nt 5.1": {
          return "xp"
        }
      }
    }
  }
  return "UnKnown"
};

window.icCreatePlayer = {
  'create': function (config) {
    config = config || {};
    applyConfig(config, defaultPlayerConfig);
    var player = new Player(config);
    return player;
  },
  'request': request,
  'detector': detector,
  'coursePlayer': require('core.bridge.courseplayer'),
  'utils': {
    throttle: require('core.utils.throttle'),
    raf: require('core.utils.raf'),
    EventBus: EventBus,
    getFontSize: getFontSize,
    getOS: getOS
  },
  'RUNTIME': require('core.common.runtime').RUNTIME,
  'setDefaultPlayerConfig': function (_default) {
    applyConfig(_default, defaultPlayerConfig);
    defaultPlayerConfig = _default;
  },
  /**
   * 页类型
   */
  'PAGETYPE': {
    'PAGE': 0,
    'EXTEND_PAGE': 1
  },
  fontSize: '',
  sync: sync,
  plugin: Object.create(null),
  version: '11.7.3'
};

__applicationContext.initialize(); })(window,jQuery,__applicationContext.require); })(window,jQuery)