/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GetQueryString = GetQueryString;
/**
 * Created by Administrator on 2017/3/31.
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var EVENTS = exports.EVENTS = {
    "MouseEvent": ["click", "dbclick", "mousedown", "mouseup", "mousemove", "mouseleave"],
    "KeyboardEvent": ["keydown", "keyup", "keypress"],
    "InputEvent": ["change", "input", "focus", "blur"],
    "CustomEvent": ["loadstart"]
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Administrator on 2017/3/31.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _utils = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pptInvokeMethod = Symbol('pptInvokeMethod');
var executeFun = Symbol('executeFun');
var transformParmaters = Symbol('transformParmaters');
var getElement = Symbol('getElement');
var initMouseEvent = Symbol('initMouseEvent');
var initKeyBoardEvent = Symbol('initKeyBoardEvent');
var getTagByGlobalIndex = Symbol('getTagByGlobalIndex');
var initInputEvent = Symbol('initInputEvent');

var Dispatcher = function () {
    function Dispatcher() {
        _classCallCheck(this, Dispatcher);

        this.eventName = "JSDirectSeeding";
        this.eventData = "{'JSDone':1}";
    }

    //私有方法


    _createClass(Dispatcher, [{
        key: pptInvokeMethod,
        value: function value() {
            console.info("pptInvokeMethod");
            var eventName = this.eventName;
            if (typeof CoursePlayer !== 'undefined' && CoursePlayer.pptInvokeMethod) {
                var eventData = this.eventData;
                var result = CoursePlayer.pptInvokeMethod(eventName, eventData);
            }
        }
    }, {
        key: executeFun,
        value: function value(eventInfo) {
            var params = this[transformParmaters](eventInfo.eventParamters);
            eventInfo.eventParamters = params;
            var coordinate = { x: params.clientX, y: params.clientY };
            eventInfo.eventParamters.clientX = Math.round(params.clientX);
            eventInfo.eventParamters.clientY = Math.round(params.clientY);

            if (eventInfo.eventName == "click" || eventInfo.eventName == "dbclick" || eventInfo.eventName == "mousedown" || eventInfo.eventName == "mousemove" || eventInfo.eventName == "mouseup" || eventInfo.eventName == "mouseleave") {

                var _currentElement = this[getElement](eventInfo.element);
                var _evt = this[initMouseEvent](eventInfo.eventParamters);
                _evt.coordinate = coordinate; //MouseEvent经过jQuery的dispatchEvent后，clientX、clientY等坐标值强制为整形，所以需要把包含小数点的坐标值额外带过去，在生字卡描红的地方有用
                //nodeType === 1 表示是dom节点，currentElement.nodeType === 9 表示是document对象
                if (_currentElement && (typeof _currentElement === 'undefined' ? 'undefined' : _typeof(_currentElement)) === 'object' && (_currentElement.nodeType === 1 || _currentElement.nodeType === 9)) {
                    _currentElement.dispatchEvent(_evt);
                } else {
                    var el = this[getTagByGlobalIndex](eventInfo.element);
                    if (el && (typeof el === 'undefined' ? 'undefined' : _typeof(el)) === "object" && (el.nodeType === 1 || el.nodeType === 9)) {
                        el.dispatchEvent(_evt);
                    } else {
                        console.info('没有找到Dom元素');
                    }
                }
            } else if (eventInfo.eventName == "keydown" || eventInfo.eventName == "keyup" || eventInfo.eventName == "keypress") {
                var _evt2 = this[initKeyBoardEvent](eventInfo.eventParamters);
                document.dispatchEvent(_evt2);
            } else if (eventInfo.eventName == "scroll") {
                var _currentElement2 = this[getElement](eventInfo.element) ? this[getElement](eventInfo.element) : this[getTagByGlobalIndex](eventInfo.element);
                if (_currentElement2) {
                    _currentElement2.scrollTop = eventInfo.eventParamters.target.scrollTop;
                    _currentElement2.scrollLeft = eventInfo.eventParamters.target.scrollLeft;
                }
            } else if (eventInfo.eventName == "play" || eventInfo.eventName == "pause" || eventInfo.eventName == "seeked" || eventInfo.eventName == "volumechange") {
                var _currentElement3 = this[getElement](eventInfo.element) ? this[getElement](eventInfo.element) : this[getTagByGlobalIndex](eventInfo.element);
                switch (eventInfo.eventName) {
                    case "play":
                        _currentElement3.play();
                        break;
                    case "pause":
                        _currentElement3.pause();
                        //暂停后进度要定位到暂停的位置，主要是考虑回放的场景
                        _currentElement3.currentTime = eventInfo.eventParamters.target.currentTime;
                        break;
                    case "seeked":
                        _currentElement3.currentTime = eventInfo.eventParamters.target.currentTime;
                        break;
                    case "volumechange":
                        _currentElement3.volume = eventInfo.eventParamters.target.volume;
                        break;
                    default:
                        break;
                }
            } else if (eventInfo.eventName === "input") {
                var currentElement = this[getElement](eventInfo.element) ? this[getElement](eventInfo.element) : this[getTagByGlobalIndex](eventInfo.element);
                var evt = this[initInputEvent](eventInfo.eventParamters);
                currentElement.dispatchEvent(evt);
                $(currentElement).val(eventInfo.eventParamters.target.value);
            } else if (eventInfo.element.localName === "input" && (eventInfo.eventName === "focus" || eventInfo.eventName === "blur")) {
                var _currentElement4 = getElement(eventInfo.element) ? getElement(eventInfo.element) : getTagByGlobalIndex(eventInfo.element);
                var _evt3 = this[initInputEvent](eventInfo.eventParamters);
                _currentElement4.dispatchEvent(_evt3);
            }
        }

        /**
         * 坐标转换
         * @param eventParamters
         */

    }, {
        key: transformParmaters,
        value: function value(eventParamters) {
            //分辨率一样，无需转换处理
            if (window.innerWidth === eventParamters.sourceWindowWidth && window.innerHeight === eventParamters.sourceWindowHeight) {
                return eventParamters;
            }

            var sourceWindowHeight = eventParamters.sourceWindowHeight,
                sourceWindowWidth = eventParamters.sourceWindowWidth;

            var equalScalingHeight = window.innerWidth / (sourceWindowWidth / sourceWindowHeight); //按照老师端等比缩放后应该得到的实际高度

            var ratioHeight = equalScalingHeight / sourceWindowHeight,
                //等比缩放后的分辨率高度比值
            ratioWidth = window.innerWidth / sourceWindowWidth;
            var sourceClientY = eventParamters.clientY,
                sourceClientX = eventParamters.clientX;

            var diffValueHeight = window.innerHeight - equalScalingHeight; //按照老师端等比缩放后应该得到的高度和实际CEF内容区高度的差值
            var diffY = parseInt(diffValueHeight / 2);
            console.info("diffY: " + diffY);
            var clientY = sourceClientY * ratioHeight + diffY,
                clientX = sourceClientX * ratioWidth;

            //eventParamters.clientX = Math.round(clientX),eventParamters.clientY = Math.round(clientY);
            eventParamters.clientX = clientX, eventParamters.clientY = clientY;

            return eventParamters;
        }
    }, {
        key: getElement,
        value: function value(element) {
            if (element.id && element.id.length > 0) {
                var selector = "#" + element.id;
                return $(selector);
            } else {
                var _selector = element.localName;
                if (element.classList && element.classList[0]) {
                    for (var k in element.classList) {
                        _selector += '.' + element.classList[k];
                    }
                }
                var childs = [];
                if (element.parentContainer && element.parentContainer.parentId) {
                    var parent = $('#' + element.parentContainer.parentId);
                    childs = parent.find(_selector);
                } else if (element.parentContainer && element.parentContainer.parentClassList && element.parentContainer.parentClassList[0]) {
                    var parentSelector = "";
                    var parentClassList = element.parentContainer.parentClassList;
                    for (var i in parentClassList) {
                        parentSelector += "." + parentClassList[i];
                    }
                    childs = $(parentSelector + " " + _selector);
                } else {
                    //拦截器发送的数据中，dom节点没有id和class，也没有父节点的id和class
                    childs = $(_selector);
                }

                var result;
                if (childs && childs.length > 0 && element.levelIndex > -1) {
                    result = childs[element.levelIndex];
                }
                return result;
            }
        }

        /**
         * 初始化鼠标事件
         * @param eventParamters
         * @returns {Event}
         */

    }, {
        key: initMouseEvent,
        value: function value(eventParamters) {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent(eventParamters.type, true, true, null, null, eventParamters.screenX, eventParamters.screenY, eventParamters.clientX, eventParamters.clientY, null, null, null, null, null, null);
            return event;
        }

        /**
         * 初始化PC键盘的事件
         * @param eventParamters
         * @returns {Event}
         */

    }, {
        key: initKeyBoardEvent,
        value: function value(eventParamters) {
            var eventObj = document.createEvent("Events");
            eventObj.initEvent(eventParamters.type, true, true);
            eventObj.which = eventParamters.which;
            eventObj.shiftKey = eventParamters.shiftKey;
            eventObj.keyCode = eventParamters.keyCode;

            return eventObj;
        }

        /**
         初始化input事件
         * @param eventParamters
         * @returns {Event}
        */

    }, {
        key: initInputEvent,
        value: function value(eventParamters) {
            var eventObj = document.createEvent("Events");
            eventObj.initEvent(eventParamters.type, true, true);
            eventObj.which = eventParamters.which;
            eventObj.shiftKey = eventParamters.shiftKey;
            eventObj.keyCode = eventParamters.keyCode;

            return eventObj;
        }

        /**
         * 针对鼠标移动的某个元素时给元素添加class的情况做容错处理
         * @param element
         * @returns {*}
         */

    }, {
        key: getTagByGlobalIndex,
        value: function value(element) {
            var localName = element.localName;
            var global_index = element.globalIndex;
            var tags = $(localName);
            var resultDom = tags[global_index];

            return resultDom;
        }

        //公共方法

    }, {
        key: 'beginDispatch',
        value: function beginDispatch(eventInfo) {
            console.info("beginDispatch函数被调用--" + new Date());
            console.info(eventInfo);
            var canDispatch = true;
            if (eventInfo && !$.isEmptyObject(eventInfo)) {
                try {
                    this[executeFun](eventInfo);
                } catch (e) {
                    if (e && e.message) {
                        console.info("执行回放executeFun函数异常，异常信息：" + e.message);
                    }
                } finally {}
            } else {
                console.info("事件 eventInfo 为空");
                canDispatch = false;
            }
            if (canDispatch) {
                this[pptInvokeMethod]();
            }
            //else就是递归出口
        }
    }, {
        key: 'run',
        value: function run() {
            jQuery.each({
                mouseleave: "mouseleave"
            }, function (orig, fix) {
                jQuery.event.special[orig] = {
                    delegateType: fix,
                    bindType: fix,

                    handle: function handle(event) {
                        var ret,
                            target = this,
                            related = event.relatedTarget,
                            handleObj = event.handleObj;

                        // For mousenter/leave call the handler if related is outside the target.
                        // NB: No relatedTarget if the mouse left/entered the browser window
                        if (!related || related !== target && !jQuery.contains(target, related)) {
                            event.type = handleObj.origType;
                            ret = handleObj.handler.apply(this, arguments);
                            event.type = fix;
                        }
                        return ret;
                    }
                };
            });

            var live_terminal = (0, _utils.GetQueryString)('live_terminal');
            if (live_terminal === 'student') {
                window.beginDispatch = this.beginDispatch.bind(this); //对外暴露beginDispatch方法。当PPT端有事件到达时，会调用该方法。

                var _this = this;
                $(document).ready(function () {
                    console.info("ready");
                    if (live_terminal === 'student') {
                        console.info("player");
                        console.info(player);
                        var instance = player;
                        if (instance) {
                            instance.addEventListener("PresenterLoaded", function () {
                                console.info("PresenterLoaded");
                                _this[pptInvokeMethod]();
                            });
                        }
                        //生字卡加载完成之后才有WordCardLoaded事件
                        document.addEventListener("WordCardLoaded", function () {
                            console.info('WordCardLoaded');
                            _this[pptInvokeMethod]();
                        }, true);
                        //“对不起，系统只能同时打开最多4张生字卡”的提示弹出之后才有WordCardOutOfRange事件
                        document.addEventListener("WordCardOutOfRange", function () {
                            console.info('WordCardOutOfRange');
                            //因为“对不起，系统只能同时打开最多4张生字卡”的提示3秒之后才消失，所以设置延时3.1秒后再向ppt请求获取事件
                            setTimeout(function () {
                                _this[pptInvokeMethod]();
                            }, 3100);
                        }, true);
                    }
                });
            }
        }
    }]);

    return Dispatcher;
}();

var dispatcher = new Dispatcher(window);
dispatcher.run();

/***/ })
/******/ ]);