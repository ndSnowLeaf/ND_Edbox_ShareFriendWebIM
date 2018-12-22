/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(24), __webpack_require__(28), __webpack_require__(26), __webpack_require__(4), __webpack_require__(6), __webpack_require__(25), __webpack_require__(1), __webpack_require__(18), __webpack_require__(19), __webpack_require__(20), __webpack_require__(22), __webpack_require__(21), __webpack_require__(23), __webpack_require__(17)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('./paper'), require('./utils/event/api'), require('./shape/rect'), require('./animation/animation'), require('./animation/tween'), require('./point'), require('./node/node'), require('./node/attr'), require('./node/cls'), require('./node/elem'), require('./node/style'), require('./node/event'), require('./node/transform'), require('./node/animate'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.paper, global.api, global.rect, global.animation, global.tween, global.point, global.node, global.attr, global.cls, global.elem, global.style, global.event, global.transform, global.animate);
	        global.global = mod.exports;
	    }
	})(this, function (_paper, _api, _rect, _animation, _tween, _point) {
	    'use strict';

	    var _paper2 = _interopRequireDefault(_paper);

	    var _api2 = _interopRequireDefault(_api);

	    var _rect2 = _interopRequireDefault(_rect);

	    var _animation2 = _interopRequireDefault(_animation);

	    var _tween2 = _interopRequireDefault(_tween);

	    var _point2 = _interopRequireDefault(_point);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    /**
	     * Created by ylf on 2017/1/19.
	     */

	    var glob = {
	        win: window,
	        doc: window.document
	    };

	    glob.win.Spry = {};

	    Spry.config = {
	        eventPrefix: 'spry',
	        version: '@@version'
	    };
	    Spry._ = {};
	    Spry._.window = window;
	    Spry._.document = window.document;
	    Spry._.CustomEvent = _api2.default;
	    Spry.Animation = _animation2.default;
	    Spry.Tween = _tween2.default;

	    Spry.Paper = _paper2.default;
	    Spry.Rect = _rect2.default;
	    Spry.Point = _point2.default;
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(8), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('../utils/dom'), require('../utils/utils'), require('../matrix'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.dom, global.utils, global.matrix);
	        global.node = mod.exports;
	    }
	})(this, function (exports, _dom, _utils, _matrix) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _dom2 = _interopRequireDefault(_dom);

	    var _utils2 = _interopRequireDefault(_utils);

	    var _matrix2 = _interopRequireDefault(_matrix);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    var Node = function () {
	        function Node(name) {
	            _classCallCheck(this, Node);

	            if (_utils2.default.is(name, 'string')) {
	                this.node = _dom2.default.createNode(name);
	                this.id = ''; //TODO:自动生成id
	            } else if (_utils2.default.is(name, 'object')) {
	                this.node = name;
	            }
	            //给dom对象添加当前spry对象属性
	            this.node.spry = this;
	            this.matrix = new _matrix2.default();
	            this.tweens = {};
	            this.node.spryzIndex = 0;
	        }

	        _createClass(Node, [{
	            key: 'getId',
	            value: function getId() {
	                return this.id;
	            }
	        }, {
	            key: 'setId',
	            value: function setId(id) {
	                this.id = id;
	                this.node.id = id;
	                return this;
	            }
	        }, {
	            key: 'getNode',
	            value: function getNode() {
	                return this.node;
	            }
	        }, {
	            key: 'getBBox',
	            value: function getBBox() {
	                //TODO:参考kitty 和snap的bbox。两者有什么差异？
	                try {
	                    return this.node.getBBox();
	                } catch (ex) {}
	            }
	        }, {
	            key: 'destroy',
	            value: function destroy() {
	                //TODO:
	            }
	        }]);

	        return Node;
	    }();

	    Node.plugin = function (cb) {
	        cb(Node.prototype);
	    };

	    exports.default = Node;
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.utils = mod.exports;
	    }
	})(this, function (exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	        return typeof obj;
	    } : function (obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };

	    /**
	     * Created by ylf on 2017/1/19.
	     * 常用方法
	     */

	    var utils = {
	        is: function is(obj, type) {

	            type = String.prototype.toLowerCase.call(type);

	            if (type === 'array' && (obj instanceof Array || Array.isArray && Array.isArray(obj))) {
	                return true;
	            }
	            return type === 'null' && obj === null || type === (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) && obj !== null || type === 'object' && obj === Object(obj) || Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
	        },
	        each: function each(obj, iterator, context) {
	            if (this.is(obj, 'null')) {
	                return false;
	            }
	            if (this.is(obj, 'array')) {
	                for (var i = 0; i < obj.length; i++) {
	                    if (iterator.call(context || this, obj[i], i, obj) === false) {
	                        return false;
	                    }
	                }
	            } else {
	                for (var key in obj) {
	                    if (obj.hasOwnProperty(key)) {
	                        if (iterator.call(context || this, obj[key], key, obj) === false) {
	                            return false;
	                        }
	                    }
	                }
	            }
	        }
	    };

	    exports.default = utils;
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(32)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('./utils/extMath'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.extMath);
	        global.matrix = mod.exports;
	    }
	})(this, function (exports, _extMath) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _extMath2 = _interopRequireDefault(_extMath);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    var sin = Math.sin,
	        cos = Math.cos,
	        tan = Math.tan;

	    var TRANSFORM_REGEX = /^(matrix|scale|rotate|translate)\(([^)]+)\)$/i;

	    //https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform

	    var Matrix = function () {
	        function Matrix() {
	            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	            var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	            var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
	            var e = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	            var f = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

	            _classCallCheck(this, Matrix);

	            this.a = a;
	            this.b = b;
	            this.c = c;
	            this.d = d;
	            this.e = e;
	            this.f = f;
	        }

	        _createClass(Matrix, [{
	            key: 'merge',
	            value: function merge(a, b, c, d, e, f) {
	                this.a = this.a * a + this.c * b;
	                this.b = this.b * a + this.d * b;
	                this.c = this.a * c + this.c * d;
	                this.d = this.b * c + this.d * d;
	                this.e = this.a * e + this.c * f + this.e;
	                this.f = this.b * e + this.d * f + this.f;
	            }
	        }, {
	            key: 'mergeMatrix',
	            value: function mergeMatrix(matrix) {
	                this.merge(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
	            }
	        }, {
	            key: 'translate',
	            value: function translate(x) {
	                var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	                this.merge(1, 0, 0, 1, x, y);
	            }
	        }, {
	            key: 'scale',
	            value: function scale(x) {
	                var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
	                var cx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	                var cy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	                var cp = cx || cy;

	                cp && this.translate(cx, cy);
	                this.merge(x, 0, 0, y, 0, 0);
	                cp && this.translate(-cx, -cy);
	            }
	        }, {
	            key: 'rotate',
	            value: function rotate(deg) {
	                var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	                var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	                var rad = _extMath2.default.rad(deg),
	                    cosa = cos(rad),
	                    sina = sin(rad),
	                    cp = x || y;

	                cp && this.translate(x, y);
	                this.merge(cosa, sina, -sina, cosa, 0, 0);
	                cp && this.translate(-x, -y);
	            }
	        }, {
	            key: 'skewX',
	            value: function skewX(deg) {
	                var rad = _extMath2.default.rad(deg),
	                    tana = tan(rad);

	                this.merge(1, 0, tana, 1, 0, 0);
	            }
	        }, {
	            key: 'skewY',
	            value: function skewY(deg) {
	                var rad = _extMath2.default.rad(deg),
	                    tana = tan(rad);

	                this.merge(1, tana, 0, 1, 0, 0);
	            }
	        }, {
	            key: 'x',
	            value: function x(_x, y) {
	                //ax+cy+e
	                return this.a * _x + this.c * y + this.e;
	            }
	        }, {
	            key: 'y',
	            value: function y(x, _y) {
	                //bx+dy+f
	                return this.b * x + this.d * _y + this.f;
	            }
	        }, {
	            key: 'toString',
	            value: function toString() {
	                return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')';
	            }
	        }, {
	            key: 'valueOf',
	            value: function valueOf() {
	                return [this.a, this.b, this.c, this.d, this.e, this.f];
	            }
	        }, {
	            key: 'equal',
	            value: function equal(matrix) {
	                return matrix.a === this.a && matrix.b === this.b && matrix.c === this.c && matrix.d === this.d && matrix.e === this.e && matrix.f === this.f;
	            }
	        }, {
	            key: 'clone',
	            value: function clone() {
	                return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
	            }
	        }], [{
	            key: 'parse',
	            value: function parse(str) {
	                str = str.toLowerCase().trim();
	                var match = str.match(TRANSFORM_REGEX),
	                    val = void 0,
	                    op = void 0,
	                    matrix = new Matrix();

	                if (match) {
	                    op = match[1];
	                    val = match[2].trim().split(/ *, */);
	                    val = val.map(function (i) {
	                        return parseFloat(i);
	                    });

	                    if (op === 'matrix') {
	                        matrix = new Matrix(val[0], val[1], val[2], val[3], val[4], val[5]);
	                    } else if (op === 'translate') {
	                        matrix.translate(val[0], val[1]);
	                    } else if (op === 'scale') {
	                        matrix.scale(val[0], val[1] || 0, val[2] || 0, val[3] || 0);
	                    } else if (op === 'rotate') {
	                        matrix.rotate(val[0], val[1] || 0, val[2] || 0);
	                    }
	                }
	                return matrix;
	            }
	        }]);

	        return Matrix;
	    }();

	    exports.default = Matrix;
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(13)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('./rafTimer'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.rafTimer);
	        global.animation = mod.exports;
	    }
	})(this, function (exports, _rafTimer) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _rafTimer2 = _interopRequireDefault(_rafTimer);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    var global = window;

	    var now = function () {
	        if (global.performance && global.performance.now) {
	            return function () {
	                return global.performance.now();
	            };
	        } else {
	            return function () {
	                new Date().getTime();
	            };
	        }
	    }();

	    var AnimationEngine = {
	        queue: [],
	        running: false,
	        push: function push(animation) {
	            this.queue.push(animation);
	            if (!this.running) {
	                this.excAnimationLoop(animation);
	            }
	        },
	        remove: function remove(animation) {
	            var i = void 0,
	                queue = this.queue,
	                anim = void 0;

	            for (i = 0; i < queue.length; i++) {
	                anim = queue[i];
	                if (anim.id === animation.id) {
	                    this.queue.splice(i, 1);
	                    break;
	                }
	            }
	        },
	        contain: function contain(animation) {
	            var i = void 0,
	                queue = this.queue,
	                anim = void 0;

	            for (i = 0; i < queue.length; i++) {
	                anim = queue[i];
	                if (anim.id === animation.id) {
	                    return true;
	                }
	            }
	            return false;
	        },
	        isRunning: function isRunning() {
	            return this.running;
	        },
	        runFrame: function runFrame() {
	            var i = void 0,
	                queue = this.queue,
	                anim = void 0,
	                time = now();

	            for (i = 0; i < queue.length; i++) {
	                anim = queue[i];
	                anim.rafHandler(time);
	            }
	        },
	        excAnimationLoop: function excAnimationLoop(cb) {
	            var that = this,
	                queue = that.queue,
	                queueLen = queue.length;

	            if (queueLen) {
	                that.running = true;
	                _rafTimer2.default.run(function () {
	                    that.runFrame.apply(that, Array.prototype.slice.call(arguments, 0));
	                    that.excAnimationLoop(cb);
	                });
	            } else {
	                that.running = false;
	            }
	        }
	    };

	    var animationCountId = 0;

	    var Animation = function () {
	        function Animation(cb) {
	            _classCallCheck(this, Animation);

	            this.handler = cb;
	            this.playedTime = -1; //当前播放总时长
	            this.timeDiff = 0; //两帧之间时间差
	            this.lastTime = now(); //上次播放时间
	            this.id = animationCountId++;
	        }

	        _createClass(Animation, [{
	            key: 'getId',
	            value: function getId() {
	                return this.id;
	            }
	        }, {
	            key: 'getPlayedTime',
	            value: function getPlayedTime() {
	                return this.playedTime;
	            }
	        }, {
	            key: 'seek',
	            value: function seek(playedTime) {
	                this.playedTime = playedTime;
	                this.lastTime = now();
	                this.handler({
	                    playedTime: this.playedTime,
	                    timeDiff: playedTime,
	                    lastTime: this.lastTime
	                });
	                return this;
	            }
	        }, {
	            key: 'rafHandler',
	            value: function rafHandler(time) {
	                this.timeDiff = time - this.lastTime;
	                if (this.playedTime === -1) {
	                    this.playedTime = 0;
	                }
	                this.playedTime += this.timeDiff;
	                this.lastTime = time;
	                this.handler({
	                    playedTime: this.playedTime,
	                    timeDiff: this.timeDiff,
	                    lastTime: this.lastTime
	                });
	            }
	        }, {
	            key: 'isRunning',
	            value: function isRunning() {
	                return AnimationEngine.isRunning() && AnimationEngine.contain(this);
	            }
	        }, {
	            key: 'start',
	            value: function start() {
	                this.stop();
	                this.timeDiff = 0;
	                this.lastTime = now();
	                AnimationEngine.push(this);
	                return this;
	            }
	        }, {
	            key: 'stop',
	            value: function stop() {
	                AnimationEngine.remove(this);
	                return this;
	            }
	        }]);

	        return Animation;
	    }();

	    exports.default = Animation;
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3), __webpack_require__(2), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('../../matrix'), require('../../utils/utils'), require('../../color/color'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.matrix, global.utils, global.color);
	        global.val = mod.exports;
	    }
	})(this, function (exports, _matrix, _utils, _color) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    exports.getPropVal = exports.diff = undefined;

	    var _matrix2 = _interopRequireDefault(_matrix);

	    var _utils2 = _interopRequireDefault(_utils);

	    var _color2 = _interopRequireDefault(_color);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    /**
	     * 获取差值
	     * @param startVal
	     * @param endVal
	     * @return {*}
	     */
	    var diff = function diff(startVal, endVal) {
	        var diffVal = void 0,
	            i = void 0,
	            len = void 0;

	        if (_utils2.default.is(startVal, 'array')) {
	            len = startVal.length;
	            diffVal = [];
	            for (i = 0; i < len; i++) {
	                diff.push(this.diff(startVal[i], endVal[i]));
	            }
	        } else if (startVal instanceof _matrix2.default) {
	            diffVal = new _matrix2.default();
	            diffVal.a = endVal.a - startVal.a;
	            diffVal.b = endVal.b - startVal.b;
	            diffVal.c = endVal.c - startVal.c;
	            diffVal.d = endVal.d - startVal.d;
	            diffVal.e = endVal.e - startVal.e;
	            diffVal.f = endVal.f - startVal.f;
	        } else if (startVal instanceof _color2.default) {
	            diffVal = endVal.clone().sub(startVal);
	        } else if (_utils2.default.is(startVal, 'object')) {
	            diffVal = {};
	            for (var key in startVal) {
	                if (startVal.hasOwnProperty(key) && endVal.hasOwnProperty(key)) {
	                    diffVal[key] = diff(startVal[key], endVal[key]);
	                }
	            }
	        } else {
	            //数值
	            diffVal = endVal - startVal;
	        }
	        return diffVal;
	    };

	    /**
	     * 获取当前值
	     * @param i
	     * @param startVal
	     * @param diffVal
	     * @return {*}
	     */
	    /**
	     * Created by ylf on 2017/2/13.
	     * 补间动画
	     * { startVal:,
	     *  endVal:,
	     *  during:,
	     *  easing:,
	     *  onPlay:,
	     *  onUpdate:,
	     *  onFinish:,
	     *  onPause:
	     * }
	     */
	    var getPropVal = function getPropVal(i, startVal, diffVal) {
	        var curVal = void 0,
	            j = void 0,
	            len = void 0;

	        if (_utils2.default.is(startVal, 'array')) {
	            len = startVal.length;
	            curVal = [];
	            for (j = 0; j < len; j++) {
	                curVal.push(getPropVal(diffVal[j]));
	            }
	        } else if (startVal instanceof _matrix2.default) {
	            curVal = new _matrix2.default();
	            curVal.a = startVal.a + diffVal.a * i;
	            curVal.b = startVal.b + diffVal.b * i;
	            curVal.c = startVal.c + diffVal.c * i;
	            curVal.d = startVal.d + diffVal.d * i;
	            curVal.e = startVal.e + diffVal.e * i;
	            curVal.f = startVal.f + diffVal.f * i;
	        } else if (startVal instanceof _color2.default) {
	            curVal = startVal.clone().plus(diffVal.clone().multi(i)).toString();
	        } else if (_utils2.default.is(startVal, 'object')) {
	            curVal = {};
	            for (var key in startVal) {
	                if (startVal.hasOwnProperty(key)) {
	                    if (diffVal.hasOwnProperty(key)) {
	                        curVal[key] = getPropVal(i, startVal[key], diffVal[key]);
	                    } else {
	                        curVal[key] = startVal[key];
	                    }
	                }
	            }
	        } else {
	            //数值
	            curVal = parseFloat(startVal) + parseFloat(diffVal * i);
	        }
	        return curVal;
	    };

	    exports.diff = diff;
	    exports.getPropVal = getPropVal;
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(10), __webpack_require__(4), __webpack_require__(5), __webpack_require__(11)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('./easing'), require('./animation'), require('./keyframe/val'), require('./keyframe/createKeyframes'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.easing, global.animation, global.val, global.createKeyframes);
	        global.tween = mod.exports;
	    }
	})(this, function (exports, _easing, _animation, _val, _createKeyframes) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _easing2 = _interopRequireDefault(_easing);

	    var _animation2 = _interopRequireDefault(_animation);

	    var _createKeyframes2 = _interopRequireDefault(_createKeyframes);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	        return typeof obj;
	    } : function (obj) {
	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    var tweenCountId = 1;

	    var Tween = function () {
	        function Tween(config) {
	            var _this = this;

	            _classCallCheck(this, Tween);

	            var args = arguments,
	                tw = config,
	                that = this,
	                during = tw.duration || 0.001;

	            this.id = tweenCountId++;
	            //上一次执行的两帧
	            this.lastFrames;

	            this.promise = new Promise(function (resolve, reject) {
	                _this.resolve = resolve;
	                _this.reject = reject;
	            });

	            if (args.length === 1 && (typeof tw === 'undefined' ? 'undefined' : _typeof(tw)) === 'object') {
	                if (/^[\.\d]+s$/.test(during)) {
	                    during = parseInt(parseFloat(during.replace('s', '')) * 1000, 10);
	                }

	                this.during = during;
	                if (tw.start !== undefined && tw.end !== undefined) {
	                    tw.keyframe = tw.keyframe || {};
	                    tw.keyframe['0'] = tw.start;
	                    tw.keyframe[during] = tw.end;
	                }
	                this.easing = tw.easing || _easing2.default.Linear;
	                this.keyframes = (0, _createKeyframes2.default)(tw.keyframe, during);

	                var frameLen = this.keyframes.length;
	                if (this.keyframes[0].getTime() !== 0) {
	                    throw new Error('第一帧时间必须为0');
	                }
	                if (this.keyframes[frameLen - 1].getTime() !== during) {
	                    throw new Error('最后一帧时间必须等于duration');
	                }

	                this.onUpdate = tw.onUpdate;
	                this.onFinish = tw.onFinish;
	                this.onPlay = tw.onPlay;
	                this.onPause = tw.onPause;
	            }

	            this.anim = new _animation2.default(function (frame) {
	                runFrame.call(that, frame.playedTime);
	            });
	        }

	        _createClass(Tween, [{
	            key: 'play',
	            value: function play() {
	                this.onPlay && this.onPlay();
	                this.anim.start();
	                return this.promise;
	            }
	        }, {
	            key: 'getPlayedTime',
	            value: function getPlayedTime() {
	                return this.anim.getPlayedTime();
	            }
	        }, {
	            key: 'seek',
	            value: function seek(playedTime) {
	                var _this2 = this;

	                var currentPlayedTime = this.getPlayedTime(),
	                    frames = getSectionFrame.call(this, currentPlayedTime, playedTime);

	                if (playedTime > currentPlayedTime) {
	                    frames.forEach(function (frame) {
	                        _this2.anim.seek(frame.getTime());
	                    });
	                }
	                this.anim.seek(playedTime);
	                return this;
	            }
	        }, {
	            key: 'pause',
	            value: function pause() {
	                var anim = this.anim;

	                if (anim) {
	                    anim.stop();
	                }
	                this.onPause && this.onPause();
	                return this;
	            }
	        }, {
	            key: 'finish',
	            value: function finish() {
	                this.seek(this.during);
	                return this;
	            }
	        }, {
	            key: 'reverse',
	            value: function reverse() {
	                //TODO:
	                return this;
	            }
	        }, {
	            key: 'reset',
	            value: function reset() {
	                this.seek(0);
	                return this;
	            }
	        }]);

	        return Tween;
	    }();

	    var runFrame = function runFrame(playedTime) {
	        var that = this,
	            keyFrames = this.keyframes,
	            frames = getCurrentFrame.call(that, playedTime),
	            currentVal = void 0,
	            isEnd = playedTime >= this.during || !frames.next;

	        if (playedTime === 0) {
	            currentVal = keyFrames[0].getVal();
	        } else if (isEnd) {
	            currentVal = keyFrames[keyFrames.length - 1].getVal();
	        } else {
	            var frameProp = getProportion(this.easing, playedTime - frames.current.getTime(), frames.next.getTime() - frames.current.getTime());
	            currentVal = (0, _val.getPropVal)(frameProp, frames.current.getVal(), frames.next.diff);
	        }

	        that.onUpdate(currentVal);

	        if (!that.lastFrames || frames.current !== that.lastFrames.current) {
	            frames.current.on('start');
	        }
	        that.lastFrames = frames;

	        if (isEnd) {
	            that.anim.stop();
	            this.resolve();
	            this.onFinish && this.onFinish();
	        }
	    };

	    var getProportion = function getProportion(easing, playedTime, during) {
	        var prop = easing(playedTime, 0, 1, during);
	        if (prop >= 1) {
	            return 1;
	        }
	        return parseFloat(prop.toFixed(5));
	    };

	    var getCurrentFrame = function getCurrentFrame(playedTime) {
	        var i = void 0,
	            keyframes = this.keyframes,
	            len = keyframes.length,
	            frame = void 0;

	        if (len === 2) {
	            return { current: keyframes[0], next: keyframes[1] };
	        }

	        for (i = 0; i < len; i++) {
	            frame = keyframes[i];
	            if (frame.getTime() > playedTime) {
	                return {
	                    current: keyframes[i - 1],
	                    next: frame
	                };
	            }
	        }
	        return {
	            current: keyframes[len - 1],
	            next: null
	        };
	    };

	    var getSectionFrame = function getSectionFrame(startTime, endTime) {
	        var keyframes = this.keyframes,
	            i = void 0,
	            frame = void 0,
	            len = keyframes.length,
	            rFrames = [];

	        for (i = 0; i < len; i++) {
	            frame = keyframes[i];
	            if (frame.getTime() > startTime && frame.getTime() < endTime) {
	                rFrames.push(frame);
	            }
	        }
	        return rFrames;
	    };

	    Tween.Easings = _easing2.default;

	    exports.default = Tween;
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(14)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('./colorUtils'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.colorUtils);
	        global.color = mod.exports;
	    }
	})(this, function (exports, _colorUtils) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _colorUtils2 = _interopRequireDefault(_colorUtils);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    var RGBAHSL = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'a'];

	    var MAX_VAL = {
	        r: 255,
	        g: 255,
	        b: 255,
	        a: 1
	    };

	    var MIN_VAL = {
	        r: 0,
	        g: 0,
	        b: 0,
	        a: 0
	    };

	    var Color = function () {
	        function Color() {
	            var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	            var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	            var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	            var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
	            var h = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	            var s = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
	            var l = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

	            _classCallCheck(this, Color);

	            var args = arguments,
	                color = args[0],
	                len = args.length,
	                rgba = void 0;

	            if (len === 1) {
	                rgba = _colorUtils2.default.toRGBA(color);
	            }
	            if (rgba) {
	                this.r = rgba.r;
	                this.g = rgba.g;
	                this.b = rgba.b;
	                this.a = rgba.a;
	            } else {
	                this.r = r;
	                this.g = g;
	                this.b = b;
	                this.a = a;
	            }
	            this.h = h;
	            this.s = s;
	            this.l = l;
	        }

	        _createClass(Color, [{
	            key: 'sub',
	            value: function sub(color) {
	                var that = this;

	                RGBAHSL.forEach(function (c) {
	                    that[c] -= color[c];
	                    if (that[c] < MIN_VAL[c]) {
	                        that[c] = MIN_VAL[c];
	                    }
	                });
	                return this;
	            }
	        }, {
	            key: 'plus',
	            value: function plus(color) {
	                var that = this;

	                RGBAHSL.forEach(function (c) {
	                    that[c] += color[c];
	                    if (that[c] > MAX_VAL[c]) {
	                        that[c] = MAX_VAL[c];
	                    }
	                });
	                return this;
	            }
	        }, {
	            key: 'multi',
	            value: function multi(i) {
	                var that = this;

	                RGBAHSL.forEach(function (c) {
	                    that[c] = parseInt(that[c] * i, 10);
	                    if (that[c] > MAX_VAL[c]) {
	                        that[c] = MAX_VAL[c];
	                    }
	                });
	                return this;
	            }
	        }, {
	            key: 'clone',
	            value: function clone() {
	                return new Color(this.r, this.g, this.b, this.a, this.h, this.s, this.l);
	            }
	        }, {
	            key: 'toString',
	            value: function toString() {
	                return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
	            }
	        }], [{
	            key: 'parse',
	            value: function parse(str) {
	                var color = new Color(),
	                    rgba = _colorUtils2.default.toRGBA(str);
	                if (rgba) {
	                    color = new Color(rgba.r, rgba.g, rgba.b, rgba.a);
	                }
	                return color;
	            }
	        }]);

	        return Color;
	    }();

	    exports.default = Color;
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.dom = mod.exports;
	    }
	})(this, function (exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    /**
	     * Created by ylf on 2017/1/19.
	     */

	    //xlink = 'http://www.w3.org/1999/xlink',
	    var xmlns = 'http://www.w3.org/2000/svg';

	    var doc = document;

	    var dom = {
	        createNode: function createNode(name) {
	            var node = doc.createElementNS(xmlns, name);
	            return node;
	        }
	    };

	    exports.default = dom;
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.engine = mod.exports;
	    }
	})(this, function (exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    /**
	     * 底层事件绑定
	     *
	     **/

	    var Engine = {
	        trigger: function trigger(el, evt, detail) {
	            var e = void 0,
	                opt = {
	                bubbles: true,
	                cancelable: true,
	                detail: detail || {}
	            };

	            if (typeof CustomEvent !== 'undefined') {
	                e = new CustomEvent(evt, opt);
	                el.dispatchEvent(e);
	            } else {
	                e = document.createEvent('CustomEvent');
	                e.initCustomEvent(evt, true, true, detail);
	                el.dispatchEvent(e);
	            }
	        },
	        bind: function bind(el, evt, handler) {
	            //let that = this
	            var proxy = function proxy(e) {
	                //兼容处理，click这些原生事件
	                e.originalEvent = e;

	                for (var key in e.detail) {
	                    if (e.detail.hasOwnProperty(key) && key !== 'type') {
	                        e[key] = e.detail[key];
	                    }
	                }

	                var returnVal = handler.call(e.target, e);

	                if (typeof returnVal !== 'undefined' && !returnVal) {
	                    e.stopPropagation();
	                    e.preventDefault();
	                }
	            };

	            handler.proxy = proxy;
	            var evts = evt.match(/\S+/g);
	            evts.forEach(function (e) {
	                el.addEventListener(e, handler.proxy, false);
	            });
	        },
	        unbind: function unbind(el, evt, handler) {
	            var evts = evt.match(/\S+/g);
	            evts.forEach(function (e) {
	                el.removeEventListener(e, handler.proxy, false);
	            });
	        },
	        on: function on() {
	            var args = Array.prototype.slice.apply(arguments, [0]),
	                elem = typeof args[0] === 'string' ? document.querySelectorAll(args[0]) : args[0],
	                evt = args[1],
	                handler = args[2];

	            this.bind(elem, evt, handler);
	        }
	    };

	    Engine.off = Engine.unbind;

	    exports.default = Engine;
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.easing = mod.exports;
	    }
	})(this, function (exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    /**
	     * These eases were ported from an canvas library 'konva'
	     * Created by ylf on 2017/2/13.
	     * eg: Easing.backEaseIn(playTime,startVal,endVal,during)
	     */

	    var Easing = {
	        'BackEaseIn': function BackEaseIn(t, b, c, d) {
	            var s = 1.70158;
	            return c * (t /= d) * t * ((s + 1) * t - s) + b;
	        },
	        'BackEaseOut': function BackEaseOut(t, b, c, d) {
	            var s = 1.70158;
	            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	        },
	        'BackEaseInOut': function BackEaseInOut(t, b, c, d) {
	            var s = 1.70158;
	            if ((t /= d / 2) < 1) {
	                return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
	            }
	            return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
	        },
	        'ElasticEaseIn': function ElasticEaseIn(t, b, c, d, a, p) {
	            // added s = 0
	            var s = 0;
	            if (t === 0) {
	                return b;
	            }
	            if ((t /= d) === 1) {
	                return b + c;
	            }
	            if (!p) {
	                p = d * 0.3;
	            }
	            if (!a || a < Math.abs(c)) {
	                a = c;
	                s = p / 4;
	            } else {
	                s = p / (2 * Math.PI) * Math.asin(c / a);
	            }
	            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	        },
	        'ElasticEaseOut': function ElasticEaseOut(t, b, c, d, a, p) {
	            // added s = 0
	            var s = 0;
	            if (t === 0) {
	                return b;
	            }
	            if ((t /= d) === 1) {
	                return b + c;
	            }
	            if (!p) {
	                p = d * 0.3;
	            }
	            if (!a || a < Math.abs(c)) {
	                a = c;
	                s = p / 4;
	            } else {
	                s = p / (2 * Math.PI) * Math.asin(c / a);
	            }
	            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	        },
	        'ElasticEaseInOut': function ElasticEaseInOut(t, b, c, d, a, p) {
	            // added s = 0
	            var s = 0;
	            if (t === 0) {
	                return b;
	            }
	            if ((t /= d / 2) === 2) {
	                return b + c;
	            }
	            if (!p) {
	                p = d * (0.3 * 1.5);
	            }
	            if (!a || a < Math.abs(c)) {
	                a = c;
	                s = p / 4;
	            } else {
	                s = p / (2 * Math.PI) * Math.asin(c / a);
	            }
	            if (t < 1) {
	                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	            }
	            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
	        },
	        'BounceEaseOut': function BounceEaseOut(t, b, c, d) {
	            if ((t /= d) < 1 / 2.75) {
	                return c * (7.5625 * t * t) + b;
	            } else if (t < 2 / 2.75) {
	                return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
	            } else if (t < 2.5 / 2.75) {
	                return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
	            } else {
	                return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
	            }
	        },
	        'BounceEaseIn': function BounceEaseIn(t, b, c, d) {
	            return c - this.BounceEaseOut(d - t, 0, c, d) + b;
	        },
	        'BounceEaseInOut': function BounceEaseInOut(t, b, c, d) {
	            if (t < d / 2) {
	                return this.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
	            } else {
	                return this.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
	            }
	        },
	        'EaseIn': function EaseIn(t, b, c, d) {
	            return c * (t /= d) * t + b;
	        },
	        'EaseOut': function EaseOut(t, b, c, d) {
	            return -c * (t /= d) * (t - 2) + b;
	        },
	        'EaseInOut': function EaseInOut(t, b, c, d) {
	            if ((t /= d / 2) < 1) {
	                return c / 2 * t * t + b;
	            }
	            return -c / 2 * (--t * (t - 2) - 1) + b;
	        },
	        'StrongEaseIn': function StrongEaseIn(t, b, c, d) {
	            return c * (t /= d) * t * t * t * t + b;
	        },
	        'StrongEaseOut': function StrongEaseOut(t, b, c, d) {
	            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	        },
	        'StrongEaseInOut': function StrongEaseInOut(t, b, c, d) {
	            if ((t /= d / 2) < 1) {
	                return c / 2 * t * t * t * t * t + b;
	            }
	            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	        },
	        'Linear': function Linear(t, b, c, d) {
	            return c * t / d + b;
	        }
	    };

	    exports.default = Easing;
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(12), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('./keyframe'), require('./val'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.keyframe, global.val);
	        global.createKeyframes = mod.exports;
	    }
	})(this, function (exports, _keyframe, _val) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _keyframe2 = _interopRequireDefault(_keyframe);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    /**
	     * 补全keyframe中间值
	     * @param keyframes
	     */
	    /**
	     * Created by ylf on 2017/2/13.
	     * 补间动画
	     * { startVal:,
	     *  endVal:,
	     *  during:,
	     *  easing:,
	     *  onPlay:,
	     *  onUpdate:,
	     *  onFinish:,
	     *  onPause:
	     * }
	     */
	    var completionFrames = function completionFrames(keyframes) {
	        var frameLen = keyframes.length;

	        var completion = function completion(index) {
	            var startFrame = keyframes[index],
	                endFrame = keyframes[index + 1],
	                startKeys = Object.keys(startFrame.getVal()),
	                endKeys = Object.keys(endFrame.getVal()),
	                missKeys = [],
	                loopFrame = void 0,
	                i = void 0,
	                j = void 0,
	                sub = void 0;

	            startKeys.forEach(function (key) {
	                if (!~endKeys.indexOf(key)) {
	                    missKeys.push(key);
	                }
	            });

	            if (!missKeys.length) {
	                return;
	            }

	            var calculateVal = function calculateVal(key) {
	                //命中
	                if (loopFrame.getVal(key) !== undefined) {
	                    //总差值
	                    sub = (0, _val.diff)(startFrame.getVal(key), loopFrame.getVal(key));
	                    //补充中间值
	                    for (i = index + 1; i < j; i++) {
	                        var f = keyframes[i];
	                        var prop = (f.getTime() - startFrame.getTime()) / (loopFrame.getTime() - startFrame.getTime());
	                        f.setVal((0, _val.getPropVal)(prop, startFrame.getVal(key), sub), key);
	                    }
	                }
	            };

	            for (j = index + 2; j < frameLen; j++) {
	                loopFrame = keyframes[j];
	                missKeys.forEach(calculateVal);
	            }
	        };

	        keyframes.forEach(function (frame, i) {
	            if (i !== frameLen - 1) {
	                completion(i);
	            }
	        });
	    };

	    /**
	     * 计算两帧之间的差异值，并进行升序排序
	     * @param keyframe
	     * @param during
	     * @return {Array}
	     */
	    var createKeyframes = function createKeyframes(keyframe, during) {
	        var frameTime = void 0,
	            val = void 0,
	            frames = [];

	        for (frameTime in keyframe) {
	            if (keyframe.hasOwnProperty(frameTime)) {
	                val = keyframe[frameTime];
	                //处理特殊字符 from\to\50%\0.5s
	                if (frameTime === 'from') {
	                    frameTime = 0;
	                } else if (frameTime === 'to') {
	                    frameTime = during;
	                } else if (/^\d+%$/.test(frameTime)) {
	                    frameTime = parseInt(frameTime, 10) / 100 * during;
	                } else if (/^[\.\d]+s$/.test(frameTime)) {
	                    frameTime = parseInt(parseFloat(frameTime) * 1000, 10);
	                } else if (/^\d+$/.test(frameTime)) {
	                    frameTime = parseInt(frameTime, 10);
	                }
	                frames.push(new _keyframe2.default(frameTime, val, val.onStart));
	                delete val.onStart;
	            }
	        }

	        // sort the array ascending
	        frames.sort(function (a, b) {
	            return a.getTime() - b.getTime();
	        });

	        //competion frames val
	        completionFrames(frames);

	        //math diff
	        // frames.sort(function (a, b) {
	        //     b.diff = diff(a.getVal(), b.getVal())
	        //     return -1
	        // })

	        var len = frames.length,
	            frame,
	            frameNext,
	            i;

	        for (i = 0; i < len; i++) {
	            frame = frames[i];
	            frameNext = frames[i + 1];
	            if (frameNext) {
	                frameNext.diff = (0, _val.diff)(frame.getVal(), frameNext.getVal());
	            }
	        }

	        return frames;
	    };

	    exports.default = createKeyframes;
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.keyframe = mod.exports;
	    }
	})(this, function (exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    var Keyframe = function () {
	        function Keyframe(time, val, onStart) {
	            _classCallCheck(this, Keyframe);

	            this.time = time; //当前帧时间
	            this.val = val; //当前帧时间
	            this.onStart = onStart; //当前帧开始触发播放时的回调
	        }

	        _createClass(Keyframe, [{
	            key: 'getVal',
	            value: function getVal() {
	                var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	                if (key) {
	                    return this.val[key];
	                }
	                return this.val;
	            }
	        }, {
	            key: 'setVal',
	            value: function setVal(val) {
	                var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	                if (key) {
	                    this.val[key] = val;
	                } else {
	                    this.val = val;
	                }
	            }
	        }, {
	            key: 'on',
	            value: function on(evt) {
	                if (evt === 'start') {
	                    this.onStart && this.onStart();
	                }
	            }
	        }, {
	            key: 'getTime',
	            value: function getTime() {
	                return this.time;
	            }
	        }]);

	        return Keyframe;
	    }();

	    exports.default = Keyframe;
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.rafTimer = mod.exports;
	    }
	})(this, function (exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    /**
	     * Created by ylf on 2017/2/13.
	     */

	    var RafTimer = function () {
	        var rAFrame = window.requestAnimationFrame,
	            cAFrame = window.cancelAnimationFrame,
	            vendors = ['ms', 'moz', 'webkit', 'o'],
	            x;

	        for (x = 0; x < vendors.length && !rAFrame; x++) {
	            rAFrame = window[vendors[x] + 'RequestAnimationFrame'];
	            cAFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	        }

	        //向下兼容
	        if (!rAFrame) {
	            rAFrame = function rAFrame(cb) {
	                return setTimeout(cb, 1000 / 60);
	            };
	            cAFrame = clearTimeout;
	        }
	        return {
	            run: function run(callback) {
	                return rAFrame(callback);
	            },
	            cancel: function cancel(id) {
	                cAFrame(id);
	            }
	        };
	    }();

	    exports.default = RafTimer;
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(15)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('./standard'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.standard);
	        global.colorUtils = mod.exports;
	    }
	})(this, function (exports, _standard) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _standard2 = _interopRequireDefault(_standard);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    //parse named css color ,like 'green'
	    var standardToRGBA = function standardToRGBA(str) {
	        var c = _standard2.default[str.toLowerCase()];
	        if (!c) {
	            return null;
	        }
	        return {
	            r: c[0],
	            g: c[1],
	            b: c[2],
	            a: 1
	        };
	    };
	    // Parse rgb(n, n, n)
	    /**
	     * Created by ylf on 2017/1/19.
	    
	     */

	    var rgbToRGBA = function rgbToRGBA(str) {
	        if (str.indexOf('rgb(') === 0) {
	            str = str.match(/rgb\(([^)]+)\)/)[1];
	            var parts = str.split(/ *, */).map(Number);
	            return {
	                r: parts[0],
	                g: parts[1],
	                b: parts[2],
	                a: 1
	            };
	        }
	    };

	    // Parse rgb(n, n, n) rgba(n, n, n,n)
	    var rgbaToRGBA = function rgbaToRGBA(str) {
	        if (str.indexOf('rgba(') === 0) {
	            str = str.match(/rgba\(([^)]+)\)/)[1];
	            var parts = str.split(/ *, */).map(Number);
	            return {
	                r: parts[0],
	                g: parts[1],
	                b: parts[2],
	                a: parts[3]
	            };
	        }
	    };
	    // Parse #nnnnnn
	    var hex6ToRGBA = function hex6ToRGBA(str) {
	        if (str[0] === '#' && str.length === 7) {
	            return {
	                r: parseInt(str.slice(1, 3), 16),
	                g: parseInt(str.slice(3, 5), 16),
	                b: parseInt(str.slice(5, 7), 16),
	                a: 1
	            };
	        }
	    };
	    // Parse #nnn
	    var hex3ColorToRGBA = function hex3ColorToRGBA(str) {
	        if (str[0] === '#' && str.length === 4) {
	            return {
	                r: parseInt(str[1] + str[1], 16),
	                g: parseInt(str[2] + str[2], 16),
	                b: parseInt(str[3] + str[3], 16),
	                a: 1
	            };
	        }
	    };

	    var ColorExpectReg = {
	        RGBA: /^rgb(a*)\(([^)]+)\)$/,
	        HEX: /^#([0-9a-f]{3}|[0-9a-f]{6})$/
	    };

	    var ColorUtils = {
	        // ported from konva
	        toRGBA: function toRGBA() {
	            var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'black';

	            str = str || 'black';
	            str = str.trim().toLowerCase();
	            return standardToRGBA(str) || rgbToRGBA(str) || rgbaToRGBA(str) || hex6ToRGBA(str) || hex3ColorToRGBA(str);
	        },
	        RGBAToString: function RGBAToString(RGBA) {
	            return 'rgba(' + RGBA.r + ',' + RGBA.g + ',' + RGBA.b + ',' + RGBA.a + ')';
	        },
	        isColor: function isColor() {
	            var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	            color = color.trim();
	            return ColorExpectReg.RGBA.test(color) || ColorExpectReg.HEX.test(color);
	        }
	    };

	    exports.default = ColorUtils;
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.standard = mod.exports;
	    }
	})(this, function (exports) {
	    "use strict";

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    /**
	     * Created by ylf on 2017/2/15.
	     * ported from konva
	     */

	    var StandardColor = {
	        aliceblue: [240, 248, 255],
	        antiquewhite: [250, 235, 215],
	        aqua: [0, 255, 255],
	        aquamarine: [127, 255, 212],
	        azure: [240, 255, 255],
	        beige: [245, 245, 220],
	        bisque: [255, 228, 196],
	        black: [0, 0, 0],
	        blanchedalmond: [255, 235, 205],
	        blue: [0, 0, 255],
	        blueviolet: [138, 43, 226],
	        brown: [165, 42, 42],
	        burlywood: [222, 184, 135],
	        cadetblue: [95, 158, 160],
	        chartreuse: [127, 255, 0],
	        chocolate: [210, 105, 30],
	        coral: [255, 127, 80],
	        cornflowerblue: [100, 149, 237],
	        cornsilk: [255, 248, 220],
	        crimson: [220, 20, 60],
	        cyan: [0, 255, 255],
	        darkblue: [0, 0, 139],
	        darkcyan: [0, 139, 139],
	        darkgoldenrod: [184, 132, 11],
	        darkgray: [169, 169, 169],
	        darkgreen: [0, 100, 0],
	        darkgrey: [169, 169, 169],
	        darkkhaki: [189, 183, 107],
	        darkmagenta: [139, 0, 139],
	        darkolivegreen: [85, 107, 47],
	        darkorange: [255, 140, 0],
	        darkorchid: [153, 50, 204],
	        darkred: [139, 0, 0],
	        darksalmon: [233, 150, 122],
	        darkseagreen: [143, 188, 143],
	        darkslateblue: [72, 61, 139],
	        darkslategray: [47, 79, 79],
	        darkslategrey: [47, 79, 79],
	        darkturquoise: [0, 206, 209],
	        darkviolet: [148, 0, 211],
	        deeppink: [255, 20, 147],
	        deepskyblue: [0, 191, 255],
	        dimgray: [105, 105, 105],
	        dimgrey: [105, 105, 105],
	        dodgerblue: [30, 144, 255],
	        firebrick: [178, 34, 34],
	        floralwhite: [255, 255, 240],
	        forestgreen: [34, 139, 34],
	        fuchsia: [255, 0, 255],
	        gainsboro: [220, 220, 220],
	        ghostwhite: [248, 248, 255],
	        gold: [255, 215, 0],
	        goldenrod: [218, 165, 32],
	        gray: [128, 128, 128],
	        green: [0, 128, 0],
	        greenyellow: [173, 255, 47],
	        grey: [128, 128, 128],
	        honeydew: [240, 255, 240],
	        hotpink: [255, 105, 180],
	        indianred: [205, 92, 92],
	        indigo: [75, 0, 130],
	        ivory: [255, 255, 240],
	        khaki: [240, 230, 140],
	        lavender: [230, 230, 250],
	        lavenderblush: [255, 240, 245],
	        lawngreen: [124, 252, 0],
	        lemonchiffon: [255, 250, 205],
	        lightblue: [173, 216, 230],
	        lightcoral: [240, 128, 128],
	        lightcyan: [224, 255, 255],
	        lightgoldenrodyellow: [250, 250, 210],
	        lightgray: [211, 211, 211],
	        lightgreen: [144, 238, 144],
	        lightgrey: [211, 211, 211],
	        lightpink: [255, 182, 193],
	        lightsalmon: [255, 160, 122],
	        lightseagreen: [32, 178, 170],
	        lightskyblue: [135, 206, 250],
	        lightslategray: [119, 136, 153],
	        lightslategrey: [119, 136, 153],
	        lightsteelblue: [176, 196, 222],
	        lightyellow: [255, 255, 224],
	        lime: [0, 255, 0],
	        limegreen: [50, 205, 50],
	        linen: [250, 240, 230],
	        magenta: [255, 0, 255],
	        maroon: [128, 0, 0],
	        mediumaquamarine: [102, 205, 170],
	        mediumblue: [0, 0, 205],
	        mediumorchid: [186, 85, 211],
	        mediumpurple: [147, 112, 219],
	        mediumseagreen: [60, 179, 113],
	        mediumslateblue: [123, 104, 238],
	        mediumspringgreen: [0, 250, 154],
	        mediumturquoise: [72, 209, 204],
	        mediumvioletred: [199, 21, 133],
	        midnightblue: [25, 25, 112],
	        mintcream: [245, 255, 250],
	        mistyrose: [255, 228, 225],
	        moccasin: [255, 228, 181],
	        navajowhite: [255, 222, 173],
	        navy: [0, 0, 128],
	        oldlace: [253, 245, 230],
	        olive: [128, 128, 0],
	        olivedrab: [107, 142, 35],
	        orange: [255, 165, 0],
	        orangered: [255, 69, 0],
	        orchid: [218, 112, 214],
	        palegoldenrod: [238, 232, 170],
	        palegreen: [152, 251, 152],
	        paleturquoise: [175, 238, 238],
	        palevioletred: [219, 112, 147],
	        papayawhip: [255, 239, 213],
	        peachpuff: [255, 218, 185],
	        peru: [205, 133, 63],
	        pink: [255, 192, 203],
	        plum: [221, 160, 203],
	        powderblue: [176, 224, 230],
	        purple: [128, 0, 128],
	        rebeccapurple: [102, 51, 153],
	        red: [255, 0, 0],
	        rosybrown: [188, 143, 143],
	        royalblue: [65, 105, 225],
	        saddlebrown: [139, 69, 19],
	        salmon: [250, 128, 114],
	        sandybrown: [244, 164, 96],
	        seagreen: [46, 139, 87],
	        seashell: [255, 245, 238],
	        sienna: [160, 82, 45],
	        silver: [192, 192, 192],
	        skyblue: [135, 206, 235],
	        slateblue: [106, 90, 205],
	        slategray: [119, 128, 144],
	        slategrey: [119, 128, 144],
	        snow: [255, 255, 250],
	        springgreen: [0, 255, 127],
	        steelblue: [70, 130, 180],
	        tan: [210, 180, 140],
	        teal: [0, 128, 128],
	        thistle: [216, 191, 216],
	        transparent: [255, 255, 255, 0],
	        tomato: [255, 99, 71],
	        turquoise: [64, 224, 208],
	        violet: [238, 130, 238],
	        wheat: [245, 222, 179],
	        white: [255, 255, 255],
	        whitesmoke: [245, 245, 245],
	        yellow: [255, 255, 0],
	        yellowgreen: [154, 205, 5]
	    };

	    exports.default = StandardColor;
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.nodeSet = mod.exports;
	    }
	})(this, function (exports) {
	    "use strict";

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    var NodeSet = function () {
	        function NodeSet() {
	            _classCallCheck(this, NodeSet);

	            var args = [].slice.call(arguments),
	                length = args.length,
	                i = void 0;

	            this.length = length;
	            for (i = 0; i < length; i++) {
	                this[i] = args[i];
	            }
	        }

	        _createClass(NodeSet, [{
	            key: "push",
	            value: function push() {
	                var args = [].slice.call(arguments),
	                    argsLen = args.length,
	                    i = void 0,
	                    setLen = this.length;

	                for (i = 0; i < argsLen; i++) {
	                    this[setLen + i] = args[i];
	                    this.length++;
	                }
	            }
	        }, {
	            key: "pop",
	            value: function pop() {
	                var node = this[this.length--];
	                delete this[this.length];
	                return node;
	            }
	        }, {
	            key: "each",
	            value: function each(func) {
	                var i = void 0,
	                    len = this.length,
	                    node = void 0;

	                for (i = 0; i < len; i++) {
	                    node = this[i];
	                    if (func.apply(node, [i]) === false) {
	                        return false;
	                    }
	                }
	            }
	        }, {
	            key: "toArray",
	            value: function toArray() {
	                var i = void 0,
	                    len = this.length,
	                    arr = [];

	                for (i = 0; i < len; i++) {
	                    arr.push(this[i]);
	                }
	                return arr;
	            }
	        }], [{
	            key: "parse",
	            value: function parse(array) {
	                return new NodeSet(array);
	            }
	        }, {
	            key: "mapMethods",
	            value: function mapMethods(cls) {
	                var proto = cls.prototype,
	                    methodName = void 0;

	                for (methodName in proto) {
	                    if (proto.hasOwnProperty(methodName)) {
	                        NodeSet.prototype[methodName] = function () {
	                            var len = this.length,
	                                i = void 0,
	                                args = [].slice.call(arguments);

	                            for (i = 0; i < len; i++) {
	                                this[i][methodName].apply(this[i], args);
	                            }
	                        };
	                    }
	                }
	            }
	        }]);

	        return NodeSet;
	    }();

	    exports.default = NodeSet;
	});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(6), __webpack_require__(7), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('./node'), require('../animation/tween'), require('../color/color'), require('../matrix'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.node, global.tween, global.color, global.matrix);
	        global.animate = mod.exports;
	    }
	})(this, function (_node, _tween, _color, _matrix) {
	    'use strict';

	    var _node2 = _interopRequireDefault(_node);

	    var _tween2 = _interopRequireDefault(_tween);

	    var _color2 = _interopRequireDefault(_color);

	    var _matrix2 = _interopRequireDefault(_matrix);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    /**
	     * Created by ylf on 2017/1/19.
	     * 扩展Node 属性访问方法
	     */

	    var ConfigBlockList = ['during', 'onFinish', 'easing', 'onDraw'];
	    var ColorAttrList = ['fill', 'stroke', 'stop-color'];

	    var MATRIX_REGEX = /^matrix\(([^)]+)\)$/i;

	    //扩展
	    _node2.default.plugin(function (fn) {
	        fn.tween = function (config) {
	            var that = this,
	                during = config.duration,
	                easing = config.easing || _tween2.default.Easings.Linear,
	                startAttrs = {},
	                endAttrs = {},
	                startVal = void 0,
	                endVal = void 0,
	                tween = void 0;

	            for (var key in config) {
	                if (config.hasOwnProperty(key)) {
	                    if (!~ConfigBlockList.indexOf(key)) {
	                        endVal = config[key];
	                        startVal = this.attr(key);

	                        if (~ColorAttrList.indexOf(key)) {
	                            //颜色
	                            startVal = _color2.default.parse(startVal);
	                            endVal = _color2.default.parse(endVal);
	                        } else if (key === 'transform') {
	                            //矩阵
	                            startVal = _matrix2.default.parse(startVal || '');
	                            if (MATRIX_REGEX.test(endVal)) {
	                                endVal = _matrix2.default.parse(endVal);
	                            }
	                        }
	                        startAttrs[key] = startVal;
	                        endAttrs[key] = endVal;
	                    }
	                }
	            }

	            tween = new _tween2.default({
	                start: startAttrs,
	                end: endAttrs,
	                duration: during,
	                easing: easing,
	                onUpdate: function onUpdate(attrs) {
	                    that.attr(attrs);
	                    config.onUpdate && config.onUpdate();
	                },
	                onFinish: function onFinish() {
	                    delete that.tweens[tween.id];
	                    config.onFinish && config.onFinish();
	                },
	                onPause: function onPause() {
	                    delete that.tweens[tween.id];
	                    config.onPause && config.onPause();
	                },
	                onPlay: function onPlay() {
	                    that.tweens[tween.id] = tween;
	                    config.onPlay && config.onPlay();
	                }
	            });

	            that.tweens[tween.id] = tween;

	            return tween;
	        };

	        fn.stop = function () {
	            var tweens = this.tweens,
	                tw = void 0;

	            for (var key in tweens) {
	                if (tweens.hasOwnProperty(key)) {
	                    tw = tweens[key];
	                    tw.pause();
	                    delete tweens[key];
	                }
	            }

	            return this;
	        };
	    });
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('./node'), require('../utils/utils'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.node, global.utils);
	        global.attr = mod.exports;
	    }
	})(this, function (_node, _utils) {
	    'use strict';

	    var _node2 = _interopRequireDefault(_node);

	    var _utils2 = _interopRequireDefault(_utils);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    //扩展
	    /**
	     * Created by ylf on 2017/1/19.
	     * 扩展Node 属性访问方法
	     */

	    _node2.default.plugin(function (fn) {
	        fn.attr = function () {
	            var args = Array.prototype.slice.apply(arguments, [0]),
	                obj = args[0],
	                elem = this.node,
	                length = args.length;

	            if (length === 1) {
	                if (_utils2.default.is(obj, 'object')) {
	                    _utils2.default.each(obj, function (val, key) {
	                        elem.setAttribute(key, val);
	                    }, this);
	                } else if (_utils2.default.is(obj, 'string')) {
	                    return elem.getAttribute(obj);
	                }
	            } else if (length === 2) {
	                elem.setAttribute(obj, args[1]);
	            }

	            return this;
	        };

	        fn.removeAttr = function (name) {
	            this.node.removeAttribute(name);
	            return this;
	        };

	        fn.getAttr = function (name) {
	            return this.attr(name);
	        };

	        fn.setAttr = function () {
	            var args = Array.prototype.slice.apply(arguments, [0]);
	            this.attr.apply(this, args);
	            return this;
	        };
	    });
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('./node'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.node);
	        global.cls = mod.exports;
	    }
	})(this, function (_node) {
	    'use strict';

	    var _node2 = _interopRequireDefault(_node);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    //扩展
	    _node2.default.plugin(function (fn) {
	        var notSpace = /\S+/g;

	        /**
	         * 添加类名
	         * @param value 类名，多个类名通过空格分隔
	         */
	        fn.addClass = function () {
	            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	            var classes = value.trim().match(notSpace) || [],
	                elem = this.node,
	                className = elem.className.trim(),
	                curClasses = className.match(notSpace) || [],
	                cls = void 0,
	                i = void 0,
	                finalVal = void 0;

	            if (classes.length) {
	                while (cls = classes[i++]) {
	                    if (!curClasses.includes(cls)) {
	                        curClasses.push(cls);
	                    }
	                }

	                finalVal = curClasses.join(' ');
	                if (finalVal !== className) {
	                    elem.className = finalVal;
	                }
	            }

	            return this;
	        };

	        fn.removeClass = function (value) {
	            var elem = this.node,
	                className = elem.className.trim(),
	                curClasses = className.match(notSpace) || [],
	                classes = value.trim().match(notSpace) || [],
	                cls = void 0,
	                i = void 0,
	                finalVal = void 0,
	                pos = void 0;

	            if (classes.length) {
	                while (cls = classes[i++]) {
	                    pos = curClasses.indexOf(cls);
	                    if (~pos) {
	                        curClasses.splice(pos, 1);
	                    }
	                }

	                finalVal = curClasses.join(' ');

	                if (finalVal !== className) {
	                    elem.className = finalVal;
	                }
	            }

	            return this;
	        };

	        fn.hasClass = function (value) {
	            var curClasses = this.node.className.trim().match(notSpace) || [];
	            return curClasses.includes(value);
	        };

	        fn.toggleClass = function (value) {
	            var elem = this.node,
	                className = elem.className.trim(),
	                curClasses = className.match(notSpace) || [],
	                finalVal = void 0,
	                pos = void 0;

	            pos = curClasses.indexOf(value);
	            if (~pos) {
	                curClasses.splice(pos, 1);
	            } else {
	                curClasses.push(value);
	            }

	            finalVal = curClasses.join(' ');
	            if (finalVal !== className) {
	                elem.className = finalVal;
	            }
	            return this;
	        };
	    }); /**
	         * Created by ylf on 2017/1/19.
	         * 扩展Node 属性访问方法
	         */
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2), __webpack_require__(16)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('./node'), require('../utils/utils'), require('../nodeSet'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.node, global.utils, global.nodeSet);
	        global.elem = mod.exports;
	    }
	})(this, function (_node, _utils, _nodeSet) {
	    'use strict';

	    var _node2 = _interopRequireDefault(_node);

	    var _utils2 = _interopRequireDefault(_utils);

	    var _nodeSet2 = _interopRequireDefault(_nodeSet);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    //扩展
	    _node2.default.plugin(function (fn) {

	        fn.remove = function () {
	            this.node.parentNode && this.node.parentNode.removeChild(this.node);
	            return this;
	        };

	        fn.removeChild = function (o) {
	            var el = this.node,
	                childNodes = el.childNodes,
	                childLen = childNodes.length,
	                argsLen = arguments.length,
	                args = arguments[0],
	                i = void 0;

	            if (argsLen === 0) {
	                for (i = 0; i < childLen; i++) {
	                    el.removeChild(childLen[i]);
	                }
	            } else if (_utils2.default.is(args, 'number') && args < childLen) {
	                el.removeChild(childNodes[args]);
	            } else if (args instanceof _node2.default) {
	                el.removeChild(args.node);
	            }
	            return this;
	        };

	        fn.replaceChild = function (newChild, refChild) {
	            this.node.replaceChild(newChild, refChild);
	            this.node.spryzIndex = refChild.node.spryzIndex || 0;
	            return this;
	        };

	        fn.append = function (node) {
	            var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

	            var el = this.node,
	                childNodes = void 0,
	                childLen = void 0,
	                refChildEl = void 0;

	            if (index >= 0) {
	                childNodes = el.childNodes;
	                childLen = childNodes.length;
	                if (index > childLen) {
	                    index = childLen;
	                }
	            }

	            if (index <= 0 || childLen === 0) {
	                refChildEl = el.lastChild;
	                el.appendChild(node.node);
	            } else if (childLen === index) {
	                refChildEl = childNodes[index];
	                el.insertBefore(node.node, refChildEl.nextSibling);
	            } else {
	                refChildEl = childNodes[index];
	                el.insertBefore(node.node, refChildEl);
	            }

	            node.node.spryzIndex = refChildEl ? refChildEl.spryzIndex || 0 : 0;

	            return this;
	        };

	        fn.prepend = function (node) {
	            this.node.insertBefore(node.node, this.node.firstChild);
	            node.node.spryzIndex = 0;
	            return this;
	        };

	        fn.insertAfter = function (node) {
	            if (!node.parent()) {
	                console.error('target node has no parent');
	            }
	            node.node.parentNode && node.node.parentNode.insertBefore(this.node, node.node.nextSibling);
	            node.node.spryzIndex = this.node.spryzIndex || 0;
	            return this;
	        };

	        fn.insertBefore = function (node) {
	            if (!node.parent()) {
	                console.error('target node has no parent');
	            }
	            node.node.parentNode && node.node.parentNode.insertBefore(this.node, node.node);
	            node.node.spryzIndex = this.node.spryzIndex || 0;
	            return this;
	        };

	        fn.parent = function () {
	            var parentNode = this.node.parentNode;
	            if (!parentNode) {
	                return null;
	            }
	            return parentNode.spry || new _node2.default(parentNode);
	        };

	        fn.select = function (selector) {
	            var el = this.node.querySelector(selector);
	            return el.spry || new _node2.default(el);
	        };

	        fn.selectAll = function (selector) {
	            var els = this.node.querySelectorAll(selector),
	                el = void 0,
	                len = els.length,
	                i = void 0,
	                nodeSet = new _nodeSet2.default();

	            for (i = 0; i < len; i++) {
	                el = els[i];
	                nodeSet.push(el.spry || new _node2.default(el));
	            }
	            return nodeSet;
	        };

	        fn.setZIndex = function (zIndex) {
	            var el = this.node,
	                curZIndex = el.spryzIndex,
	                parent = void 0,
	                parentEl = void 0,
	                childNodes = void 0,
	                childLen = void 0,
	                siblingEl = void 0,
	                i = void 0;

	            if (zIndex === curZIndex) {
	                return this;
	            }

	            parent = el.parent();
	            parentEl = parent.node;
	            childNodes = parentEl.childNodes;
	            childLen = childNodes.length;

	            for (i = 0; i < childLen; i++) {
	                siblingEl = childNodes[i];
	                // 找出最后一个层级小于等于现有层级的对象
	                if (siblingEl.spryzIndex > zIndex) {
	                    siblingEl = siblingEl[i--];
	                    break;
	                }
	            }

	            if (siblingEl !== el) {
	                parentEl.insertBefore(el, siblingEl.nextSibling);
	            }

	            el.spryzIndex = zIndex;
	        };

	        //底部
	        fn.floor = function () {
	            this.parent().prepend(this);
	        };

	        //顶部
	        fn.ceil = function () {
	            this.parent().append(this);
	        };

	        //向上一级
	        fn.stairsUp = function () {
	            var nextSibling = this.node.nextSibling;
	            if (nextSibling) {
	                this.insertAfter(nextSibling.spry || new _node2.default(nextSibling));
	            }
	        };

	        //向下一级
	        fn.stairsDown = function () {
	            var preSibling = this.node.previousSibling;
	            if (preSibling) {
	                this.insertBefore(preSibling.spry || new _node2.default(preSibling));
	            }
	        };
	    }); /**
	         * Created by ylf on 2017/1/19.
	         * 扩展Node 属性访问方法
	         */
	});

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('./node'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.node);
	        global.event = mod.exports;
	    }
	})(this, function (_node) {
	    'use strict';

	    var _node2 = _interopRequireDefault(_node);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    //扩展
	    _node2.default.plugin(function (fn) {

	        /**
	         * 绑定事件
	         * @param evt 支持pinch\pinchstart\pinchend\dragstart\drag\dragend\tap\dbltap\focus\blur
	         * @param handler
	         */
	        fn.on = function (evt, handler) {
	            Spry._.CustomEvent.on(this.node, evt, handler);
	        };

	        fn.off = function (evt, handler) {
	            Spry._.CustomEvent.off(this.node, evt, handler);
	        };
	    }); /**
	         * Created by ylf on 2017/1/19.
	         * 扩展Node 属性访问方法
	         */
	});

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('./node'), require('../utils/utils'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.node, global.utils);
	        global.style = mod.exports;
	    }
	})(this, function (_node, _utils) {
	    'use strict';

	    var _node2 = _interopRequireDefault(_node);

	    var _utils2 = _interopRequireDefault(_utils);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    /**
	     * Created by ylf on 2017/1/19.
	     * 扩展Node 属性访问方法
	     */

	    var getStyle = function getStyle(elem, attr) {
	        var style = elem.style[attr];
	        if (style !== '') {
	            return style;
	        }
	        return elem.currentStyle ? elem.currentStyle[attr] : Spry._.document.defaultView.getComputedStyle(elem, '')[attr];
	    };

	    //扩展
	    _node2.default.plugin(function (fn) {
	        fn.show = function () {
	            return this.setVisible(true);
	        };

	        fn.hide = function () {
	            return this.setVisible(false);
	        };

	        fn.setVisibility = function (visibility) {
	            return this.css('visibility', visibility ? 'visible' : 'hidden');
	        };

	        fn.setVisible = function (visible) {
	            return this.css('display', visible ? 'block' : 'none');
	        };

	        fn.css = function () {
	            var args = Array.prototype.slice.apply(arguments, [0]),
	                name = args[0],
	                length = args.length,
	                elem = this.node;

	            if (length === 1) {
	                if (_utils2.default.is(name, 'object')) {
	                    _utils2.default.each(name, function (val, key) {
	                        elem.style[key] = val;
	                    }, this);
	                } else if (_utils2.default.is(name, 'string')) {
	                    return getStyle(elem, name);
	                }
	            } else if (length === 2) {
	                elem.style[name] = args[1];
	            }

	            return this;
	        };
	    });
	});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(require('./node'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(global.node);
	        global.transform = mod.exports;
	    }
	})(this, function (_node) {
	    'use strict';

	    var _node2 = _interopRequireDefault(_node);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    _node2.default.plugin(function (fn) {

	        fn.translate = function (x) {
	            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;

	            this.matrix.translate(x, y);
	            this.applyMatrix();
	            return this;
	        };

	        fn.scale = function (x) {
	            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
	            var cx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	            var cy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	            this.matrix.scale(x, y, cx, cy);
	            this.applyMatrix();
	            return this;
	        };

	        fn.rotate = function (deg) {
	            var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	            var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	            this.matrix.rotate(deg, x, y);
	            this.applyMatrix();
	            return this;
	        };

	        fn.skewX = function (deg) {
	            this.matrix.skewX(deg);
	            this.applyMatrix();
	            return this;
	        };

	        fn.skewY = function (deg) {
	            this.matrix.skewY(deg);
	            this.applyMatrix();
	            return this;
	        };

	        fn.getMatrix = function () {
	            return this.matrix.clone();
	        };

	        fn.setMatrix = function (matrix) {
	            this.matrix = matrix;
	            this.applyMatrix();
	            return this;
	        };

	        fn.transform = function (matrix) {
	            this.setMatrix(matrix);
	        };

	        fn.applyMatrix = function () {
	            this.attr('transform', this.getMatrix().toString());
	            return this;
	        };
	    }); /**
	         * Created by ylf on 2017/2/7.
	         */
	});

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(27), __webpack_require__(8), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('./shape/shapeContainer'), require('./utils/dom'), require('./utils/utils'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.shapeContainer, global.dom, global.utils);
	        global.paper = mod.exports;
	    }
	})(this, function (exports, _shapeContainer, _dom, _utils) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _shapeContainer2 = _interopRequireDefault(_shapeContainer);

	    var _dom2 = _interopRequireDefault(_dom);

	    var _utils2 = _interopRequireDefault(_utils);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    function _possibleConstructorReturn(self, call) {
	        if (!self) {
	            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        }

	        return call && (typeof call === "object" || typeof call === "function") ? call : self;
	    }

	    function _inherits(subClass, superClass) {
	        if (typeof superClass !== "function" && superClass !== null) {
	            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	        }

	        subClass.prototype = Object.create(superClass && superClass.prototype, {
	            constructor: {
	                value: subClass,
	                enumerable: false,
	                writable: true,
	                configurable: true
	            }
	        });
	        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	    }

	    var extendSvgNode = function extendSvgNode(svg) {
	        var desc = void 0,
	            defs = void 0,

	        //res,
	        doc = svg.ownerDocument;

	        desc = doc.getElementsByTagName('desc')[0];
	        defs = doc.getElementsByTagName('defs')[0];
	        if (!defs) {
	            defs = _dom2.default.createNode('defs');
	            svg.appendChild(defs);
	        }
	        if (!desc) {
	            desc = _dom2.default.createNode('desc');
	            desc.appendChild(doc.createTextNode('Created with Spry'));
	            svg.appendChild(desc);
	        }

	        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

	        //svg.defs = defs
	    };

	    var Paper = function (_ShapeContainer) {
	        _inherits(Paper, _ShapeContainer);

	        function Paper(elem) {
	            _classCallCheck(this, Paper);

	            if (elem && elem.tagName === 'svg') {
	                var _this = _possibleConstructorReturn(this, (Paper.__proto__ || Object.getPrototypeOf(Paper)).call(this));

	                _this.node = elem;
	            } else {
	                var _this = _possibleConstructorReturn(this, (Paper.__proto__ || Object.getPrototypeOf(Paper)).call(this, 'svg'));

	                if (_utils2.default.is(elem, 'string')) {
	                    Spry._.document.getElementById(elem).appendChild(_this.node);
	                } else {
	                    elem.appendChild(_this.node);
	                }
	            }

	            _this.customEvent = new Spry._.CustomEvent({ evtElem: _this.node, eventPrefix: Spry.config.eventPrefix });

	            extendSvgNode(_this.node);
	            return _possibleConstructorReturn(_this);
	        }

	        _createClass(Paper, [{
	            key: 'setViewBox',
	            value: function setViewBox(x, y, w, h) {
	                this.attr('viewBox', [x, y, w, h].join(' '));
	                return this;
	            }
	        }, {
	            key: 'getViewBox',
	            value: function getViewBox() {
	                var viewBox = this.attr('viewBox').match(/\S+/g);
	                return viewBox;
	            }
	        }, {
	            key: 'destroy',
	            value: function destroy() {
	                //TODO:
	            }
	        }]);

	        return Paper;
	    }(_shapeContainer2.default);

	    exports.default = Paper;
	});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.point = mod.exports;
	    }
	})(this, function (exports) {
	    "use strict";

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    var Point = function () {
	        function Point() {
	            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	            _classCallCheck(this, Point);

	            this.x = x;
	            this.y = y;
	        }

	        _createClass(Point, [{
	            key: "valueOf",
	            value: function valueOf() {
	                return [this.x, this.y];
	            }
	        }]);

	        return Point;
	    }();

	    exports.default = Point;
	});

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('../node/node'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.node);
	        global.rect = mod.exports;
	    }
	})(this, function (exports, _node) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _node2 = _interopRequireDefault(_node);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    function _possibleConstructorReturn(self, call) {
	        if (!self) {
	            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        }

	        return call && (typeof call === "object" || typeof call === "function") ? call : self;
	    }

	    function _inherits(subClass, superClass) {
	        if (typeof superClass !== "function" && superClass !== null) {
	            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	        }

	        subClass.prototype = Object.create(superClass && superClass.prototype, {
	            constructor: {
	                value: subClass,
	                enumerable: false,
	                writable: true,
	                configurable: true
	            }
	        });
	        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	    }

	    var Rect = function (_Node) {
	        _inherits(Rect, _Node);

	        function Rect(x) {
	            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	            var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	            var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

	            _classCallCheck(this, Rect);

	            var _this = _possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this, 'rect'));

	            _this.attr({
	                x: x,
	                y: y,
	                width: w,
	                height: h
	            });
	            return _this;
	        }

	        return Rect;
	    }(_node2.default);

	    exports.default = Rect;
	});

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('../node/node'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.node);
	        global.shapeContainer = mod.exports;
	    }
	})(this, function (exports, _node) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _node2 = _interopRequireDefault(_node);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    function _possibleConstructorReturn(self, call) {
	        if (!self) {
	            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        }

	        return call && (typeof call === "object" || typeof call === "function") ? call : self;
	    }

	    function _inherits(subClass, superClass) {
	        if (typeof superClass !== "function" && superClass !== null) {
	            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	        }

	        subClass.prototype = Object.create(superClass && superClass.prototype, {
	            constructor: {
	                value: subClass,
	                enumerable: false,
	                writable: true,
	                configurable: true
	            }
	        });
	        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	    }

	    var ShapeContainer = function (_Node) {
	        _inherits(ShapeContainer, _Node);

	        function ShapeContainer(name) {
	            _classCallCheck(this, ShapeContainer);

	            return _possibleConstructorReturn(this, (ShapeContainer.__proto__ || Object.getPrototypeOf(ShapeContainer)).call(this, name));
	        }

	        return ShapeContainer;
	    }(_node2.default);

	    exports.default = ShapeContainer;
	});

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(30), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('./core'), require('./engine'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.core, global.engine);
	        global.api = mod.exports;
	    }
	})(this, function (exports, _core, _engine) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _core2 = _interopRequireDefault(_core);

	    var _engine2 = _interopRequireDefault(_engine);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    var EventApi = function () {
	        function EventApi(config) {
	            _classCallCheck(this, EventApi);

	            this.core = new _core2.default(config);
	        }

	        _createClass(EventApi, null, [{
	            key: 'on',
	            value: function on() {
	                var args = Array.prototype.slice.apply(arguments, [0]);
	                //this.core.engine.on.apply(this.core.engine, args)
	                _engine2.default.on.apply(_engine2.default, args);
	            }
	        }, {
	            key: 'off',
	            value: function off() {
	                var args = Array.prototype.slice.apply(arguments, [0]);
	                _engine2.default.off.apply(_engine2.default, args);
	            }
	        }]);

	        return EventApi;
	    }();

	    exports.default = EventApi;
	});

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.config = mod.exports;
	    }
	})(this, function (exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    var Config = exports.Config = {
	        evtElem: document.body,
	        tap: true,
	        doubleTap: true,
	        drag: true,
	        pinch: true,
	        hold: true,
	        tapMaxDistance: 10,
	        tapTime: 450,
	        holdTime: 650,
	        doubleTapMaxInterval: 300,
	        doubleTapMaxDistance: 16,
	        pinchIntensity: 0.8,
	        eventPrefix: ''
	    };

	    var EVENT = exports.EVENT = {
	        PINCH_START: 'pinchstart',
	        PINCH: 'pinch',
	        PINCH_END: 'pinchend',
	        DRAG_START: 'dragstart',
	        DRAG: 'drag',
	        DRAG_END: 'dragend',
	        HOLD: 'hold',
	        TAP: 'tap',
	        DOUBLE_TAP: 'dbltap',
	        FOCUS: 'focus',
	        BLUR: 'blur'
	    };
	});

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(31), __webpack_require__(29), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports, require('./utils'), require('./config'), require('./engine'));
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports, global.utils, global.config, global.engine);
	        global.core = mod.exports;
	    }
	})(this, function (exports, _utils, _config, _engine) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });

	    var _utils2 = _interopRequireDefault(_utils);

	    var _engine2 = _interopRequireDefault(_engine);

	    function _interopRequireDefault(obj) {
	        return obj && obj.__esModule ? obj : {
	            default: obj
	        };
	    }

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError("Cannot call a class as a function");
	        }
	    }

	    var _createClass = function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];
	                descriptor.enumerable = descriptor.enumerable || false;
	                descriptor.configurable = true;
	                if ("value" in descriptor) descriptor.writable = true;
	                Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }

	        return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);
	            if (staticProps) defineProperties(Constructor, staticProps);
	            return Constructor;
	        };
	    }();

	    var Core = function () {
	        function Core(config) {
	            _classCallCheck(this, Core);

	            this.uuid = _utils2.default.getUuid();
	            this._config = _utils2.default.extend(Object.create(_config.Config), config);
	            this._downStart = false;
	            this._pinchStart = false;
	            this._dragStart = false;
	            this._startTime = 0;
	            this._startPos = null;
	            this._movePos = null;
	            this._endPos = null;
	            this._lastTarget = null;
	            this._dragElem = null;
	            this._holdTimer = 0;

	            this.bindEvent();
	        }

	        _createClass(Core, [{
	            key: 'getConfig',
	            value: function getConfig() {
	                return this._config;
	            }
	        }, {
	            key: 'reset',
	            value: function reset() {
	                this._downStart = false;
	                this._pinchStart = false;
	                this._dragStart = false;
	                this._startTime = 0;
	                this._startPos = null;
	                this._movePos = null;
	                this._endPos = null;
	                this._dragElem = null;
	                clearTimeout(this._holdTimer);
	                this._holdTimer = 0;
	            }
	        }, {
	            key: 'bindEvent',
	            value: function bindEvent() {
	                var that = this,
	                    mouseEvents = ['mouseup', 'mousedown', 'mousemove', 'mouseleave'],
	                    touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
	                    events = mouseEvents,
	                    config = that._config;

	                if (_utils2.default.isMobile) {
	                    events = touchEvents;
	                } else if (_utils2.default.hasTouch) {
	                    events = touchEvents.concat(mouseEvents);
	                }

	                that.handler = _utils2.default.proxy(that.handler, this);
	                events.forEach(function (evt) {
	                    config.evtElem.addEventListener(evt, that.handler, false);
	                });
	            }
	        }, {
	            key: 'downHandler',
	            value: function downHandler(evt, target) {
	                this._downStart = true;
	                if (!this._startPos || this._startPos.length < 2) {
	                    this._startPos = _utils2.default.getPosOfEvent(evt);
	                }
	                this._startTime = new Date().getTime();

	                this.focus(evt);
	                this.hold(evt);

	                this._lastTarget = target;
	            }
	        }, {
	            key: 'moveHandler',
	            value: function moveHandler(evt) {
	                this._movePos = _utils2.default.getPosOfEvent(evt);

	                if (_utils2.default.getFingers(evt).length >= 2) {
	                    this.pinch(evt);
	                } else {
	                    this.drag(evt);
	                }
	            }
	        }, {
	            key: 'upHandler',
	            value: function upHandler(evt) {
	                this._endPos = _utils2.default.getPosOfEvent(evt);

	                if (this._pinchStart) {
	                    this.pinch(evt);
	                } else if (this._dragStart) {
	                    this.drag(evt);
	                } else {
	                    this.tap(evt);
	                }

	                this.reset();
	            }
	        }, {
	            key: 'handler',
	            value: function handler(evt) {
	                var type = evt.type,
	                    target = evt.target;

	                if (_utils2.default.isDown(type)) {
	                    this.downHandler(evt, target);
	                } else if (_utils2.default.isMove(type)) {
	                    if (!this._downStart || !this._startPos) {
	                        return;
	                    }
	                    this.moveHandler(evt);
	                } else if (_utils2.default.isUp(type)) {
	                    if (!this._downStart) {
	                        return;
	                    }
	                    this.upHandler(evt);
	                }
	            }
	        }, {
	            key: 'tap',
	            value: function tap(evt) {

	                var time = new Date().getTime(),
	                    elem = evt.target,
	                    config = this._config,
	                    subTime = time - this._startTime,
	                    distance = _utils2.default.getDistance(this._startPos[0], this._endPos[0]);

	                if (subTime <= config.tapTime && subTime < config.holdTime && distance <= config.tapMaxDistance) {
	                    if (this._startTime - this.__lastTapTime <= config.doubleTapMaxInterval && this.__lastTapPos && _utils2.default.getDistance(this.__lastTapPos, this._endPos[0]) <= config.doubleTapMaxDistance) {
	                        this.trigger(elem, evt, _config.EVENT.DOUBLE_TAP);
	                        this.__lastTapTime = 0;
	                        this.__lastTapPos = null;
	                    } else {
	                        this.trigger(elem, evt, _config.EVENT.TAP);
	                        this.__lastTapTime = time;
	                        this.__lastTapPos = this._endPos[0];
	                    }
	                }
	            }
	        }, {
	            key: 'drag',
	            value: function drag(evt) {
	                if (!this._startPos) {
	                    return;
	                }

	                var elem = evt.target;

	                if (!this._dragStart) {
	                    var startDis = _utils2.default.getDistance(this._startPos[0], this._movePos[0]);
	                    if (startDis > 0) {
	                        this._dragElem = elem;
	                        this.trigger(elem, evt, _config.EVENT.DRAG_START);
	                        this.trigger(elem, evt, _config.EVENT.DRAG);
	                        this._dragStart = true;
	                    }
	                } else {
	                    if (_utils2.default.isMove(evt.type)) {
	                        this.trigger(this._dragElem, evt, _config.EVENT.DRAG);
	                    } else if (_utils2.default.isUp(evt.type)) {
	                        this.trigger(this._dragElem, evt, _config.EVENT.DRAG_END);
	                    }
	                }
	            }
	        }, {
	            key: 'hold',
	            value: function hold(evt) {
	                var that = this;
	                clearTimeout(this._holdTimer);
	                this._holdTimer = setTimeout(function () {
	                    if (!that._startPos) {
	                        return;
	                    }
	                    var distance = _utils2.default.getDistance(that._startPos[0], that._movePos ? that._movePos[0] : that._startPos[0]);
	                    if (that._config.tapMaxDistance < distance) {
	                        return;
	                    }

	                    that.trigger(evt.target, evt, _config.EVENT.HOLD, {
	                        type: _config.EVENT.HOLD,
	                        originEvent: evt,
	                        fingersCount: _utils2.default.getFingers(evt),
	                        position: that._startPos[0]
	                    });
	                }, this._config.holdTime);
	            }
	        }, {
	            key: 'pinch',
	            value: function pinch(evt) {
	                if (!this._downStart) {
	                    return;
	                }
	                if (_utils2.default.getFingers(evt) < 2 && !_utils2.default.isTouchEnd(evt)) {
	                    return;
	                }

	                var config = this._config,
	                    scale = _utils2.default.calScale(this._startPos, this._movePos, config.pinchIntensity),
	                    fingersCount = _utils2.default.getFingers(evt),
	                    eventObj = {
	                    originEvent: evt,
	                    scale: scale,
	                    fingersCount: fingersCount
	                };

	                if (!this._pinchStart) {
	                    this._pinchStart = true;
	                    this.trigger(evt.target, evt, _config.EVENT.PINCH_START, eventObj);
	                } else if (_utils2.default.isTouchMove(evt)) {
	                    this.trigger(evt.target, evt, _config.EVENT.PINCH, eventObj);
	                } else if (_utils2.default.isTouchEnd(evt)) {
	                    this.trigger(evt.target, evt, _config.EVENT.PINCH_END, eventObj);
	                }
	            }
	        }, {
	            key: 'focus',
	            value: function focus(evt) {
	                var elem = evt.target,
	                    lastElem = this._lastTarget;

	                if (lastElem !== elem && lastElem) {
	                    this.trigger(lastElem, evt, _config.EVENT.BLUR);
	                    this.trigger(elem, evt, _config.EVENT.FOCUS);
	                } else if (!lastElem) {
	                    this.trigger(elem, evt, _config.EVENT.FOCUS);
	                }
	            }
	        }, {
	            key: 'trigger',
	            value: function trigger(elem, originalEvt, evt, detail) {
	                detail = detail || { originalEvent: originalEvt };
	                var prefix = this._config.eventPrefix;
	                if (prefix) {
	                    evt = prefix + evt;
	                }
	                _engine2.default.trigger(elem, evt, detail, this._config.eventPrefix);
	            }
	        }]);

	        return Core;
	    }();

	    exports.default = Core;
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.utils = mod.exports;
	    }
	})(this, function (exports) {
	    'use strict';

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    /**
	     * Created by ylf on 2017/2/4.
	     * 常用方法
	     */

	    var utils = {};

	    utils.getDistance = function (pos1, pos2) {
	        var x = pos2.x - pos1.x,
	            y = pos2.y - pos1.y;
	        return Math.sqrt(x * x + y * y);
	    };

	    utils.getFingers = function (ev) {
	        return ev.touches ? ev.touches.length : 1;
	    };

	    utils.calScale = function (pstart, pmove, intensity) {
	        if (pstart.length >= 2 && pmove.length >= 2) {
	            var disStart = this.getDistance(pstart[1], pstart[0]),
	                disEnd = this.getDistance(pmove[1], pmove[0]),
	                scale = (disEnd - disStart) * intensity;
	            return (disEnd - scale) / disStart;
	        }
	        return 1;
	    };

	    utils.getPosOfEvent = function (ev) {
	        if (this.isTouch(ev.type)) {
	            var posi = [];
	            var src = null;

	            for (var t = 0, len = ev.touches.length; t < len; t++) {
	                src = ev.touches[t];
	                posi.push({
	                    x: src.pageX,
	                    y: src.pageY
	                });
	            }
	            return posi;
	        } else {
	            return [{
	                x: ev.pageX,
	                y: ev.pageY
	            }];
	        }
	    };

	    utils.isDown = function (type) {
	        return type === 'touchstart' || type === 'mousedown';
	    };
	    utils.isUp = function (type) {
	        return (/^(touchend|touchcancel|mouseup|mouseleave|mouseout)$/.test(type)
	        );
	    };
	    utils.isMove = function (type) {
	        return type === 'mousemove' || type === 'touchmove';
	    };
	    utils.isTouch = function (type) {
	        return (/^(touchend|touchcancel|touchstart|touchmove)$/.test(type)
	        );
	    };

	    utils.isTouchEnd = function (ev) {
	        return ev.type === 'touchend' || ev.type === 'touchcancel';
	    };

	    utils.isTouchMove = function (ev) {
	        return ev.type === 'touchmove';
	    };

	    utils.proxy = function (fuc, context) {
	        return function () {
	            var args = Array.prototype.slice.call(arguments, 0);
	            fuc.apply(context, args);
	        };
	    };

	    utils.isMobile = window.navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);

	    utils.hasTouch = 'ontouchend' in window;

	    utils.extend = function (obj, obj2) {
	        for (var key in obj2) {
	            if (obj2.hasOwnProperty(key)) {
	                obj[key] = obj2[key];
	            }
	        }
	        return obj;
	    };

	    utils.getUuid = function () {
	        var s = [],
	            hexDigits = '0123456789abcdef',
	            uuid;

	        for (var i = 0; i < 36; i++) {
	            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	        }

	        s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
	        s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	        s[8] = s[13] = s[18] = s[23] = '-';

	        uuid = s.join('');
	        return uuid;
	    };

	    exports.default = utils;
	});

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        factory(exports);
	    } else {
	        var mod = {
	            exports: {}
	        };
	        factory(mod.exports);
	        global.extMath = mod.exports;
	    }
	})(this, function (exports) {
	    "use strict";

	    Object.defineProperty(exports, "__esModule", {
	        value: true
	    });
	    /**
	     * Created by ylf on 2017/1/19.
	     */

	    var PI = Math.PI;

	    var ExtMath = {
	        rad: function rad(deg) {
	            return deg % 360 * PI / 180;
	        },
	        deg: function deg(rad) {
	            return rad * 180 / PI % 360;
	        }
	    };

	    exports.default = ExtMath;
	});

/***/ }
/******/ ]);