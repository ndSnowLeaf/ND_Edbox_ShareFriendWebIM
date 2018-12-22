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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Administrator on 2017/3/31.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _EventListenerWrap = __webpack_require__(3);

var _EventListenerWrap2 = _interopRequireDefault(_EventListenerWrap);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Interceptor = function () {
    function Interceptor() {
        _classCallCheck(this, Interceptor);
    }

    _createClass(Interceptor, [{
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
            if (live_terminal === 'teacher') {
                Interceptor.overrideWindowMethod();

                _EventListenerWrap2.default.addScrollEvent();
            }
        }
    }], [{
        key: 'generateEventListenerWrap',
        value: function generateEventListenerWrap(eventName, callBack) {
            var eventListenerWrap = new _EventListenerWrap2.default(this, { eventName: eventName, callBack: callBack });
            return eventListenerWrap;
        }
    }, {
        key: 'overrideWindowMethod',
        value: function overrideWindowMethod() {
            Interceptor.allowEventList = [].concat(_utils.EVENTS.MouseEvent, _utils.EVENTS.KeyboardEvent, _utils.EVENTS.InputEvent, _utils.EVENTS.CustomEvent);
            Interceptor.dragOptions = [];
            Interceptor.lastEvent = null;
            Interceptor.lastMouseMoveEvent = null;

            /*覆盖EventTarget方法不能在实例方法中操作，因此改为在静态方法中*/
            Interceptor.targetAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = Interceptor.execAddEventListener;
            Interceptor.targetRemoveEventListener = EventTarget.prototype.removeEventListener;
            EventTarget.prototype.removeEventListener = Interceptor.execRemoveEventListener;
        }

        /**
         * 重写EventTarget.addEventListener方法
         */

    }, {
        key: 'execAddEventListener',
        value: function execAddEventListener() {
            var _eventName = arguments[0],
                _callback = arguments[1];
            /* 解决诸如progWrapper.on('mousemove touchmove', '', handler);这样的连续事件绑定的情况下，
             原来如果只是_callback.icrcb = myEventListener这样写法，那icrcb永远都只会是最后一个，
             所以移除的只是最后一个，修改为_callback[_eventName + '_icrcb']之后，这样就会add和remove对应上 */
            //_callback.icrcb = myEventListener;
            var eventListenerWrap = Interceptor.generateEventListenerWrap(_eventName, _callback);
            _callback[_eventName + '_icrcb'] = eventListenerWrap;
            arguments[1] = eventListenerWrap;
            Interceptor.targetAddEventListener.apply(this, arguments);
        }

        /**
         * 重写EventTarget.removeEventListener
         */

    }, {
        key: 'execRemoveEventListener',
        value: function execRemoveEventListener() {
            var _eventName = arguments[0],
                _callback = arguments[1];
            if (_callback) {
                if (_callback[_eventName + '_icrcb']) {
                    Interceptor.targetRemoveEventListener.apply(this, [_eventName, _callback[_eventName + '_icrcb']]);
                } else {
                    Interceptor.targetRemoveEventListener.apply(this, [_eventName, _callback]);
                }
            }
        }
    }]);

    return Interceptor;
}();

var interceptor = new Interceptor();
interceptor.run();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Administrator on 2017/3/31.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _utils = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mediaAddEventListener = Symbol('mediaAddEventListener');
var sendMediaEventInfo = Symbol('sendMediaEventInfo');
var customEvent = Symbol('customEvent');
var getElementInfo = Symbol('getElementInfo');
var getGlobalIndex = Symbol('getGlobalIndex');
var toSended = Symbol('toSended');
var isDragToSended = Symbol('isDragToSended');
var sendEventInfo = Symbol('sendEventInfo');

var EventListenerWrap = function () {
    function EventListenerWrap(context, opt) {
        _classCallCheck(this, EventListenerWrap);

        this.mContext = context;
        this.eventList = context.allowEventList;

        this.eventName = opt.eventName;
        this.callBack = opt.callBack;
    }

    _createClass(EventListenerWrap, [{
        key: 'handleEvent',
        value: function handleEvent(event) {
            var _eventName = this.eventName;
            var _callback = this.callBack;
            if (this.eventList.indexOf(_eventName) >= 0) {
                //针对生字卡中的多媒体文件特殊处理，添加监听事件
                if (_eventName === "loadstart") {
                    this[mediaAddEventListener](event);
                }
                var isSended = true;
                if (_eventName === "mousedown" || _eventName === "mousemove" || _eventName === "mouseup" || _eventName === "mouseleave") {
                    //判断是否需要发送同步，比如 mouseove这个事件触发的频率太高，如果不是拖拽的mouseove就不发送了
                    isSended = this[toSended](event);
                    if (isSended) {
                        if (_eventName == "mousemove") {
                            //判断拖拽的操作是否要同步
                            //判断依据是X或Y坐标位移大于0的
                            isSended = this[isDragToSended](event);
                        }
                    }
                }
                if (isSended) {
                    //如果存在多次重复是往上冒泡的事件，则过滤掉只发送一次
                    if (event !== this.mContext.lastEvent) {
                        var evt = this[customEvent](event);
                        var elementInfo = this[getElementInfo](event);

                        var eventInfo = {
                            browserType: (0, _utils.GetQueryString)("browserType") && (0, _utils.GetQueryString)("browserType").length > 0 ? parseInt((0, _utils.GetQueryString)("browserType")) : 1,
                            element: elementInfo,
                            eventName: _eventName,
                            eventParamters: evt
                        };
                        console.info(eventInfo);
                        this[sendEventInfo](eventInfo);
                    }
                    this.mContext.lastEvent = event;
                }
            }

            if (_callback) {
                _callback.apply(window, arguments);
            }
        }

        /**
         * 多媒体元素 video和audio 事件处理
         * @param event
         */

    }, {
        key: mediaAddEventListener,
        value: function value(event) {
            var target = event.target;
            var _this = this;
            target.onplay = function (event) {
                _this[sendMediaEventInfo](event, "play");
            };
            target.onpause = function (event) {
                _this[sendMediaEventInfo](event, "pause");
            };
            target.onseeked = function (event) {
                _this[sendMediaEventInfo](event, "seeked");
            };
            target.onvolumechange = function (event) {
                _this[sendMediaEventInfo](event, "volumechange");
            };
        }
    }, {
        key: sendMediaEventInfo,
        value: function value(event, eventName) {
            var evt = this[customEvent](event);
            var _eventName = eventName;
            var elementInfo = this[getElementInfo](event);
            var eventInfo = {
                browserType: (0, _utils.GetQueryString)("browserType") && (0, _utils.GetQueryString)("browserType").length > 0 ? parseInt((0, _utils.GetQueryString)("browserType")) : 1,
                element: elementInfo,
                eventName: _eventName,
                eventParamters: evt
            };
            console.info(eventInfo);
            this[sendEventInfo](eventInfo);
        }

        /**
         * 自定义事件，用于发送至学生端事件分发器
         * @param event
         */

    }, {
        key: customEvent,
        value: function value(event) {
            var evt = {
                type: event.type,
                canBubble: event.canBubble,
                cancelable: event.cancelable,
                sourceWindowHeight: window.innerHeight,
                sourceWindowWidth: window.innerWidth,
                screenX: event.screenX,
                screenY: event.screenY,
                clientX: event.clientX,
                clientY: event.clientY,
                shiftKey: event.shiftKey,
                target: {
                    name: event.target.localName,
                    currentTime: event.target.currentTime ? event.target.currentTime : 0, //音视频的进度
                    volume: event.target.muted ? 0 : event.target.volume, //音视频声音大小，如果静音时取volume值是上一次的并不是0，所以用muted
                    scrollTop: event.target.scrollTop ? event.target.scrollTop : 0,
                    scrollLeft: event.target.scrollLeft ? event.target.scrollLeft : 0,
                    value: event.type === "input" && event.target.localName === "input" ? event.target.value : "" //input文本框value值
                },
                which: event.which ? event.which : null, //keydown等键盘事件需要
                keyCode: event.keyCode ? event.keyCode : null //keydown等键盘事件需要
            };
            return evt;
        }
    }, {
        key: getElementInfo,
        value: function value(event) {
            var id = event.target && event.target.id ? event.target.id : "";
            //如果id是全数字的话，这个id有可能是动态生成随机串，教师端和学生端会不一致，不能以id为查找依据。清空它
            if ($.isNumeric(id)) {
                id = "";
            }
            var localName = event.target && event.target.localName ? event.target.localName : "";
            var class_list = event.target && event.target.classList ? event.target.classList : [];
            if (!class_list || class_list.length == 0) {
                console.info("current dom no class");
            }
            var parent_element = event.target.closest(".ic_module");
            //let parent_id = parent_element ? $(parent_element).attr("id") : "";
            var parent_id = "";
            console.info("parent node id: " + id);
            //如果id是全数字的话，这个id有可能是动态生成随机串，教师端和学生端会不一致，不能以id为查找依据。清空它
            /*if($.isNumeric(parent_id)){
                parent_id = "";
            }*/
            var parent_class_list = parent_element && parent_element.classList ? parent_element.classList : [];
            console.info("parent node class: " + parent_class_list);
            var level_index = -1;
            // if current dom no id, find his parent id and parent class
            if (!id || id.length == 0) {
                var childs = [];
                var selector = localName;
                if (class_list && class_list.length > 0) {
                    for (var i = 0; i < class_list.length; i++) {
                        selector += "." + class_list[i];
                    }
                    /*if (parent_element) {
                     childs = $(parent_element).find(selector);
                     }else*/
                    if (parent_id && parent_id.length > 0) {
                        childs = $("#" + parent_id + " " + selector);
                    } else if (parent_class_list && parent_class_list.length > 0) {
                        var parentSelector = "";
                        for (var j = 0; j < parent_class_list.length; j++) {
                            parentSelector += "." + parent_class_list[j];
                        }
                        childs = $(parentSelector + " " + selector);
                    } else {
                        childs = $(selector);
                    }
                }

                if (childs.length > 0) {
                    for (var index = 0; index < childs.length; index++) {
                        if (childs[index] === event.target) {
                            level_index = index;
                            break;
                        }
                    }
                }
                console.info("current dom leve_index: " + level_index);
            }

            var global_index = this[getGlobalIndex](event.target);

            var element = {
                id: id,
                classList: class_list,
                localName: localName,
                parentContainer: {
                    //parentId: parent_id,
                    parentId: "",
                    parentClassList: parent_class_list
                },
                levelIndex: level_index,
                globalIndex: global_index
            };

            return element;
        }

        /**
         * //查找当前元素的document全局的index
         //主要是针对部分dom节点有鼠标move上去之后做了样式增减的情况
         * @param target
         */

    }, {
        key: getGlobalIndex,
        value: function value(target) {
            var localName = target.localName;
            console.info("localName:" + localName);
            var global_index = 0;
            var tags = $(localName);
            for (var index = 0; index < tags.length; index++) {
                if (tags[index] === target) {
                    global_index = index;
                    break;
                }
            }
            console.info("global_index:" + global_index);
            return global_index;
        }
    }, {
        key: toSended,
        value: function value(event) {
            var sended = true;
            if (event.type === "mousedown") {
                this.mContext.dragOptions.push(event);
                //console.info("mousedown之后数组长度为：" + dragOptions.length);
            }
            if (event.type === "mousemove" || event.type === "mouseleave") {
                if (this.mContext.dragOptions.length > 0) {
                    //console.info("数组中第一个Event对象type为： " + dragOptions[0].type);
                    if (this.mContext.dragOptions[0].type == "mousedown") {
                        this.mContext.dragOptions.push(event);
                    }
                    //console.info("mousemove之后数组长度为：" + dragOptions.length);
                } else {
                    sended = false;
                }
            }
            if (event.type === "mouseup" || event.type === "mouseleave") {
                this.mContext.dragOptions.splice(0, this.mContext.dragOptions.length); //清空数组
                //console.info("mouseup之后数组长度为：" + dragOptions.length);
            }

            return sended;
        }
    }, {
        key: isDragToSended,
        value: function value(event) {
            var flag = false;
            var currentPosition = {
                clientX: event.clientX,
                clientY: event.clientY
                //表示第一个移动，必须同步
            };if (this.mContext.lastMouseMoveEvent && this.mContext.lastMouseMoveEvent !== null) {
                var distX = event.clientX - this.mContext.lastMouseMoveEvent.clientX;
                //console.info("mousemove拖动距离X坐标位移：" + distX);
                var distY = event.clientY - this.mContext.lastMouseMoveEvent.clientY;
                //console.info("mousemove拖动距离X坐标位移：" + distY);
                if (Math.abs(distX) > 0 || Math.abs(distY) > 0) {
                    //console.info("mousemove拖动距离X坐标位移大于0");
                    flag = true;
                }
            } else {
                flag = true;
            }
            this.mContext.lastMouseMoveEvent = event;
            return flag;
        }

        /**
         * 发送数据
         */

    }, {
        key: sendEventInfo,
        value: function value(eventInfo) {
            /*localStorage.clear();
            localStorage.setItem('eventInfo', JSON.stringify(eventInfo));*/
            //console.info("sendEventInfo start:" + new Date().getTime());
            var eventName = "JSDirectSeeding";
            if (typeof CoursePlayer !== 'undefined' && CoursePlayer.pptInvokeMethod) {
                var result = CoursePlayer.pptInvokeMethod(eventName, JSON.stringify(eventInfo));
                //console.info("sendEventInfo end:" + new Date().getTime());
                //console.info(result);
            }
        }
    }], [{
        key: 'addScrollEvent',
        value: function addScrollEvent() {
            var _this = this;
            window.addEventListener("scroll", function (event) {
                var evt = _this[customEvent](event);
                var _eventName = "scroll";
                var elementInfo = _this[getElementInfo](event);
                var eventInfo = {
                    browserType: (0, _utils.GetQueryString)("browserType") && (0, _utils.GetQueryString)("browserType").length > 0 ? parseInt((0, _utils.GetQueryString)("browserType")) : 1,
                    element: elementInfo,
                    eventName: _eventName,
                    eventParamters: evt
                };
                console.info(eventInfo);
                _this[sendEventInfo](eventInfo);
            }, true);
        }
    }]);

    return EventListenerWrap;
}();

exports.default = EventListenerWrap;

/***/ })
/******/ ]);