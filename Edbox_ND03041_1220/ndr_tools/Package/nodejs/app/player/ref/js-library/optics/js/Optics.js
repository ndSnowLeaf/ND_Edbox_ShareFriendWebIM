/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://192.168.251.81:8080/build";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Optics = __webpack_require__(1);
	
	var _Optics2 = _interopRequireDefault(_Optics);
	
	var _PublishSubscribe = __webpack_require__(6);
	
	var _PublishSubscribe2 = _interopRequireDefault(_PublishSubscribe);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_Optics2.default.PublishSubscribe = _PublishSubscribe2.default;
	window['Optics'] = _Optics2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 光路相关操作的核心类
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	
	var _IncidentRay = __webpack_require__(2);
	
	var _IncidentRay2 = _interopRequireDefault(_IncidentRay);
	
	var _Normal = __webpack_require__(8);
	
	var _Normal2 = _interopRequireDefault(_Normal);
	
	var _ReflectedRay = __webpack_require__(9);
	
	var _ReflectedRay2 = _interopRequireDefault(_ReflectedRay);
	
	var _RefractedRay = __webpack_require__(10);
	
	var _RefractedRay2 = _interopRequireDefault(_RefractedRay);
	
	var _CriticalAngleRay = __webpack_require__(11);
	
	var _CriticalAngleRay2 = _interopRequireDefault(_CriticalAngleRay);
	
	var _PublishSubscribe = __webpack_require__(6);
	
	var _PublishSubscribe2 = _interopRequireDefault(_PublishSubscribe);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Optics = function () {
	    function Optics(opt) {
	        _classCallCheck(this, Optics);
	
	        //存在SVG的容器
	        this._container = opt.container;
	        this._publishSubscribe = _PublishSubscribe2.default;
	        this._viewboxWidth = opt.viewboxWidth = opt.viewboxWidth ? opt.viewboxWidth : 1500;
	        this._viewboxHeight = opt.viewboxHeight = opt.viewboxHeight ? opt.viewboxHeight : 1000;
	        this._name = opt.name;
	        //snap的svg对象
	        this._svg = undefined;
	        this._normal = undefined;
	        this._incidentRay = undefined;
	        this._reflectedRay = undefined;
	        this._refractedRay = undefined;
	        this._criticalAngleRay = undefined;
	        this.init(opt);
	    }
	
	    _createClass(Optics, [{
	        key: 'init',
	        value: function init(opt) {
	            var _this = this;
	
	            this._svg = Snap().attr({
	                width: this._container.getBoundingClientRect().width,
	                height: this._container.getBoundingClientRect().height,
	                viewBox: '0 0 ' + this._viewboxWidth + ' ' + this._viewboxHeight
	            });
	            $.extend(opt, { svg: this._svg });
	            this._container.appendChild(this._svg.node);
	
	            //法线
	            this._normal = new _Normal2.default(opt);
	            this._normal = this._normal.init();
	
	            //反射线
	            this._reflectedRay = new _ReflectedRay2.default(opt);
	            this._reflectedRay = this._reflectedRay.init();
	
	            //入射线
	            this._incidentRay = new _IncidentRay2.default(opt);
	            this._incidentRay = this._incidentRay.init();
	
	            //折射线
	            this._refractedRay = new _RefractedRay2.default(opt);
	            this._refractedRay = this._refractedRay.init(this._svg);
	
	            //临界角线
	            this._criticalAngleRay = new _CriticalAngleRay2.default(opt);
	            this._criticalAngleRay.init();
	
	            this._svg.node.addEventListener('mouseleave', function (e) {
	                if (!_this._incidentRay.operationButton.rotateButtonDowned) {
	                    return;
	                }
	                _this._incidentRay.operationButton.rotateButtonDowned = false;
	                _PublishSubscribe2.default.publish(_PublishSubscribe2.default.OnIncidentRayRotateButtonUpEvent, {
	                    name: opt.name,
	                    inAngle: _this._incidentRay.angleValue,
	                    rotateAngle: _this._incidentRay.rotateAngle
	                });
	            });
	        }
	    }, {
	        key: 'incidentRay',
	        get: function get() {
	            return this._incidentRay;
	        },
	        set: function set(value) {
	            this._incidentRay = value;
	        }
	    }, {
	        key: 'normal',
	        get: function get() {
	            return this._normal;
	        },
	        set: function set(value) {
	            this._normal = value;
	        }
	    }, {
	        key: 'reflectedRay',
	        get: function get() {
	            return this._reflectedRay;
	        },
	        set: function set(value) {
	            this._reflectedRay = value;
	        }
	    }, {
	        key: 'refractedRay',
	        get: function get() {
	            return this._refractedRay;
	        },
	        set: function set(value) {
	            this._refractedRay = value;
	        }
	    }, {
	        key: 'publishSubscribe',
	        get: function get() {
	            return this._publishSubscribe;
	        }
	    }, {
	        key: 'name',
	        get: function get() {
	            return this._name;
	        },
	        set: function set(value) {
	            this._name = value;
	        }
	    }, {
	        key: 'svg',
	        get: function get() {
	            return this._svg;
	        },
	        set: function set(value) {
	            this._svg = value;
	        }
	    }, {
	        key: 'criticalAngleRay',
	        get: function get() {
	            return this._criticalAngleRay;
	        },
	        set: function set(value) {
	            this._criticalAngleRay = value;
	        }
	    }]);
	
	    return Optics;
	}();
	
	exports.default = Optics;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _BaseView2 = __webpack_require__(3);
	
	var _BaseView3 = _interopRequireDefault(_BaseView2);
	
	var _Arrow = __webpack_require__(4);
	
	var _Arrow2 = _interopRequireDefault(_Arrow);
	
	var _OperationButton = __webpack_require__(5);
	
	var _OperationButton2 = _interopRequireDefault(_OperationButton);
	
	var _Angle = __webpack_require__(7);
	
	var _Angle2 = _interopRequireDefault(_Angle);
	
	var _PublishSubscribe = __webpack_require__(6);
	
	var _PublishSubscribe2 = _interopRequireDefault(_PublishSubscribe);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 入射线类
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	var IncidentRay = function (_BaseView) {
	    _inherits(IncidentRay, _BaseView);
	
	    function IncidentRay(opt) {
	        _classCallCheck(this, IncidentRay);
	
	        //没限制，应该旋转的角度
	        var _this = _possibleConstructorReturn(this, (IncidentRay.__proto__ || Object.getPrototypeOf(IncidentRay)).call(this, opt));
	
	        _this._oldMousePos = undefined;
	        //线条长度
	        _this.lineLength = opt.incidentRayLength || _this.lineLength;
	        //线条宽度
	        _this.lineWidth = opt.incidentRayWidth || _this.lineWidth;
	        //线条颜色
	        _this.lineColor = opt.incidentRayColor || _this.lineColor;
	        //透明度
	        _this.opacity = opt.incidentOpacity || _this.opacity;
	        //是否显示线条
	        _this.visibility = opt.incidentRayVisibility === undefined ? _this.visibility : opt.incidentRayVisibility;
	        //箭头位置
	        _this.arrowPos = opt.incidentRayArrowPos || _this.arrowPos;
	        //限制旋转的范围
	        _this.limitRotate = $.extend({}, _this.limitRotate, opt.incidentRayLimitRotate);
	
	        //入射线组，包括箭头、旋转按钮、入射线
	        _this._incidentRayGroupNode = undefined;
	        //入射线的节点
	        _this._incidentRayNode = undefined;
	        //箭头
	        _this._arrow = new _Arrow2.default($.extend({}, opt, { color: _this.lineColor, opacity: _this.opacity }));
	        //旋转按钮
	        _this._operationButton = new _OperationButton2.default(opt);
	        //入射角填充色
	        _this.angleFillColor = opt.incidentAngleFillColor || _this.angleFillColor;
	        //角度透明度
	        _this.angleFillOpacity = opt.incidentAngleFillOpacity || _this.angleFillOpacity;
	        //入射角描边色
	        _this.angleStrokeColor = opt.incidentAngleStrokeColor || _this.angleStrokeColor;
	        //入射角半径
	        _this.angleRadius = opt.incidentAngleRadius || _this.angleRadius;
	        //入射线角度值
	        _this.angleValue = _this._calcIncidentAngle(_this.rotateAngle);
	        //入射角
	        _this._angle = new _Angle2.default($.extend({}, opt, {
	            angleFillColor: _this.angleFillColor,
	            angleFillOpacity: _this.angleFillOpacity,
	            angleStrokeColor: _this.angleStrokeColor,
	            angleRadius: _this.angleRadius,
	            angleValue: _this.angleValue,
	            rotateAngle: _this._calcIncidentAngleRotateAngle(_this.rotateAngle),
	            rotatePoint: _this.rotatePoint
	        }));
	
	        //入射角度文字的大小
	        _this.angleTextSize = opt.incidentAngleTextSize || _this.angleTextSize;
	        //入射角度文字的颜色
	        _this.angleTextColor = opt.incidentAngleTextColor || _this.angleTextColor;
	        //入射角度文字的与旋转点的间距
	        _this.angleTextInterval = opt.incidentAngleTextInterval || _this.angleTextInterval;
	        return _this;
	    }
	
	    _createClass(IncidentRay, [{
	        key: 'init',
	        value: function init() {
	            var _this2 = this;
	
	            //入射角
	            this._angle.init();
	
	            this._incidentRayGroupNode = this.svg.paper.g({
	                visibility: this.visibility
	            });
	            this._incidentRayNode = this.svg.paper.path().attr({
	                d: 'M 0 0 h ' + this.lineLength + ' v ' + this.lineWidth + ' h ' + -this.lineLength + ' z',
	                fill: this.lineColor
	            });
	
	            this._incidentRayNode.attr({
	                transform: 'translate(0,' + -this._incidentRayNode.getBBox().height / 2 + ')'
	            });
	            this._incidentRayGroupNode.add(this._incidentRayNode);
	            //箭头
	            this._arrow.init();
	            this._arrow.arrowNode.attr({
	                transform: 'translate(' + this.arrowPos + ',' + -this._arrow.arrowNode.getBBox().height / 2 + ')'
	            });
	            this._incidentRayGroupNode.add(this._arrow.arrowNode);
	            //旋转按钮
	            this._operationButton.init();
	            this._incidentRayGroupNode.add(this._operationButton.operationButtonGroupNode);
	
	            var upIncidentRayNode = this._incidentRayNode.clone();
	            this._incidentRayGroupNode.add(upIncidentRayNode);
	
	            //移到默认旋转点位置，旋转默认角度
	            this._incidentRayGroupNode.attr({
	                transform: 'translate(' + (this.rotatePoint.x - this.lineLength) + ',' + (this.rotatePoint.y - this.lineWidth / 2) + ') \n            rotate(' + this.rotateAngle + ',' + this.lineLength + ',0)',
	                opacity: this.opacity
	            });
	
	            //显示度数文字
	            this.angleTextNode = this.svg.paper.text().attr({
	                text: this.angleValue + '\xB0',
	                fill: this.angleTextColor,
	                fontSize: this.angleTextSize,
	                fontWeight: 'bold',
	                transform: 'translate(' + this.rotatePoint.x + ',' + this.rotatePoint.y + ')',
	                visibility: this.angleTextVisibility
	            });
	            this.angleTextPosition = this.calcAngleTextPosition(this.rotateAngle, this.angleTextNode);
	            this.angleTextNode.attr({
	                x: this.angleTextPosition.x,
	                y: this.angleTextPosition.y
	            });
	
	            //监听旋转down事件
	            _PublishSubscribe2.default.subscribe(_PublishSubscribe2.default.OnIncidentRayRotateButtonDownEvent, function (topic, args) {
	                if (args.name !== _this2.name) {
	                    return;
	                }
	                _this2.rotateButtonMouseDowned = true;
	                //入射线高亮
	                _this2._incidentRayNode.attr({
	                    stroke: '#fff',
	                    strokeWidth: 3
	                });
	                //箭头高亮
	                _this2._arrow.arrowNode.attr({
	                    stroke: '#fff',
	                    strokeWidth: 2
	                });
	            });
	            //监听旋转up事件
	            _PublishSubscribe2.default.subscribe(_PublishSubscribe2.default.OnIncidentRayRotateButtonUpEvent, function (topic, args) {
	                if (args.name !== _this2.name) {
	                    return;
	                }
	                _this2.rotateButtonMouseDowned = false;
	                //去掉入射线高亮
	                _this2._incidentRayNode.attr({
	                    stroke: 'none'
	                });
	                //去掉箭头高亮
	                _this2._arrow.arrowNode.attr({
	                    stroke: 'none'
	                });
	            });
	
	            this.svg.mouseup(function (e, x, y) {
	                if (!_this2.operationButton.rotateButtonDowned) {
	                    return;
	                }
	                _this2.operationButton.rotateButtonDowned = false;
	                _PublishSubscribe2.default.publish(_PublishSubscribe2.default.OnIncidentRayRotateButtonUpEvent, {
	                    id: _this2.id,
	                    name: _this2.name,
	                    inAngle: _this2.angleValue,
	                    rotateAngle: _this2.rotateAngle
	                });
	            });
	
	            this.svg.mousemove(function (e, x, y) {
	                _this2.rotateButtonMouseDowned && _this2.rotate(x, y);
	            });
	
	            return this;
	        }
	    }, {
	        key: 'rotate',
	        value: function rotate(x, y) {
	            this._realRotateAngle = this.rotateAngle;
	            x = x - this.svg.node.getBoundingClientRect().left;
	            y = y - this.svg.node.getBoundingClientRect().top;
	            var rx = this.rotatePoint.x / this._ratioX,
	                ry = this.rotatePoint.y / this._ratioY - this.lineWidth / 2;
	            var xdiff = x - rx,
	                ydiff = y - ry;
	            if (xdiff === 0) {
	                this.rotateAngle = y > ry ? 270 : 90;
	            } else {
	                this.rotateAngle = 180 / Math.PI * Math.atan(ydiff / xdiff);
	                if (this.rotateAngle === 0) {
	                    this.rotateAngle = x <= rx ? 0 : 180;
	                } else if (this.rotateAngle < 0) {
	                    this.rotateAngle = y >= ry ? 360 + this.rotateAngle : 180 + this.rotateAngle;
	                } else {
	                    this.rotateAngle = y >= ry ? 180 + this.rotateAngle : this.rotateAngle;
	                }
	            }
	            this.rotateAngle = this.rotateAngle % 360;
	
	            //如果有限制旋转范围要计算出最终的旋转度数
	            this._limitRotateAngle();
	            this.rotateHandler();
	        }
	    }, {
	        key: 'rotateHandler',
	        value: function rotateHandler() {
	            this._incidentRayGroupNode.attr({
	                transform: 'translate(' + (this.rotatePoint.x - this.lineLength) + ',' + (this.rotatePoint.y - this.lineWidth / 2) + ') \n            rotate(' + this.rotateAngle + ',' + this.lineLength + ',0)',
	                visibility: this.visibility
	            });
	            //角度值也要变化
	            this.angleValue = this._calcIncidentAngle(this.rotateAngle);
	            this._angle.angleValue = this.angleValue;
	            this._angle.rotateAngle = this._calcIncidentAngleRotateAngle(this.rotateAngle);
	            this._angle.angleVisibility = this.angleVisibility;
	            this._angle.drawAngleValue();
	            //变换度数文字位置
	            this.angleTextNode.attr({
	                text: this.angleValue + '\xB0'
	            });
	            this.angleTextPosition = this.calcAngleTextPosition(this.rotateAngle, this.angleTextNode);
	            this.angleTextNode.attr({
	                x: this.angleTextPosition.x,
	                y: this.angleTextPosition.y,
	                visibility: this.angleTextVisibility
	            });
	
	            //发布入射角发生变化事件
	            _PublishSubscribe2.default.publish(_PublishSubscribe2.default.OnIncidentAngleChangedEvent, {
	                inAngle: this.angleValue,
	                rotateAngle: this.rotateAngle,
	                id: this.id,
	                name: this.name
	            });
	        }
	    }, {
	        key: 'changeRotateAngle',
	        value: function changeRotateAngle(value) {
	            this.rotateAngle = value % 360;
	            this.rotateHandler();
	        }
	    }, {
	        key: 'showLine',
	        value: function showLine(isShow) {
	            this.visibility = isShow ? 'visible' : 'hidden';
	            this._incidentRayGroupNode.attr({
	                visibility: this.visibility
	            });
	        }
	    }, {
	        key: 'showAngle',
	        value: function showAngle(isShow) {
	            this.angleVisibility = isShow ? 'visible' : 'hidden';
	            this._angle.show(isShow);
	        }
	    }, {
	        key: 'showAngleText',
	        value: function showAngleText(isShow) {
	            this.angleTextVisibility = isShow ? 'visible' : 'hidden';
	            this.angleTextNode.attr({
	                visibility: this.angleTextVisibility
	            });
	        }
	
	        /**
	         * 如果有限制旋转度数的话，限制在旋转度数范围之内
	         * @private
	         */
	
	    }, {
	        key: '_limitRotateAngle',
	        value: function _limitRotateAngle() {
	            if (!this.limitRotate.limit || this.rotateAngle > this.limitRotate.minAngle && this.rotateAngle < this.limitRotate.maxAngle) {
	                return this.rotateAngle;
	            }
	
	            if (Math.abs(this.rotateAngle - this.limitRotate.minAngle % 360) <= Math.abs(this.rotateAngle - this.limitRotate.maxAngle % 360)) {
	                this.rotateAngle = this._realRotateAngle === this.limitRotate.maxAngle ? this.limitRotate.maxAngle : this.limitRotate.minAngle;
	            } else {
	                this.rotateAngle = this._realRotateAngle === this.limitRotate.minAngle ? this.limitRotate.minAngle : this.limitRotate.maxAngle;
	            }
	            return this.rotateAngle;
	        }
	
	        /**
	         * 根据入射线旋转角度，计算入射角
	         * @param rotateAngle 入射线旋转度数
	         * @return {number} 入射角
	         * @private
	         */
	
	    }, {
	        key: '_calcIncidentAngle',
	        value: function _calcIncidentAngle(rotateAngle) {
	            var inAngle = 0;
	            if (rotateAngle >= 0 && rotateAngle <= 90) {
	                inAngle = 90 - rotateAngle;
	            } else if (rotateAngle > 90 && rotateAngle <= 180) {
	                inAngle = rotateAngle - 90;
	            } else if (rotateAngle > 180 && rotateAngle <= 270) {
	                inAngle = 270 - rotateAngle;
	            } else {
	                inAngle = rotateAngle - 270;
	            }
	
	            return Number(inAngle.toFixed(1));
	            // return Number((Math.abs(rotateAngle - 90) % 90).toFixed(1));
	        }
	
	        /**
	         * 根据入射线旋转角度，计算入射角旋转度数
	         * @param ra 入射线旋转度数
	         * @return {number} 入射角旋转度数
	         * @private
	         */
	
	    }, {
	        key: '_calcIncidentAngleRotateAngle',
	        value: function _calcIncidentAngleRotateAngle(ra) {
	            ra = ra % 360;
	            var rotateAngle = 0;
	            if (ra > 0 && ra <= 90) {
	                rotateAngle = ra;
	            } else if (ra > 90 && ra <= 180) {
	                rotateAngle = 90;
	            } else if (ra > 180 && ra <= 270) {
	                rotateAngle = ra;
	            } else {
	                rotateAngle = 270;
	            }
	            return Number(rotateAngle.toFixed(1));
	        }
	    }, {
	        key: 'operationButton',
	        get: function get() {
	            return this._operationButton;
	        },
	        set: function set(value) {
	            this._operationButton = value;
	        }
	    }, {
	        key: 'incidentRayNode',
	        get: function get() {
	            return this._incidentRayNode;
	        },
	        set: function set(value) {
	            this._incidentRayNode = value;
	        }
	    }, {
	        key: 'arrow',
	        get: function get() {
	            return this._arrow;
	        },
	        set: function set(value) {
	            this._arrow = value;
	        }
	    }]);
	
	    return IncidentRay;
	}(_BaseView3.default);
	
	exports.default = IncidentRay;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 基类
	 */
	var BaseView = function () {
	    function BaseView(opt) {
	        _classCallCheck(this, BaseView);
	
	        this._svg = opt.svg;
	        this._id = this.uuid();
	        this._name = opt.name || 'optics';
	        //默认入射线旋转度数
	        this._rotateAngle = opt.incidentRayDefaultRotateAngle || 330;
	        //折射率
	        this._refractiveIndex = opt.refractiveIndex || 1;
	        //当前介质的临界角
	        this._criticalAngle = 180 / Math.PI * Math.asin(1 / this._refractiveIndex);
	
	        //线条颜色
	        this._lineColor = opt.lineColor || '#333';
	        //所有线条长度
	        this._lineLength = opt.lineLength || 200;
	        //所有线条宽度
	        this._lineWidth = opt.lineWidth || 5;
	        //透明度
	        this._opacity = opt.opacity || 1;
	        //箭头位置
	        this._arrowPos = opt.arrowPos || this._lineLength / 2;
	        //是否显示visible和hidden
	        this._visibility = opt.visibility === undefined ? 'hidden' : 'visible';
	        //限制旋转范围
	        this._limitRotate = $.extend({}, {
	            limit: false, //是否限制旋转范围
	            minAngle: 0, //限制旋转范围的最小旋转度数
	            maxAngle: 0 //限制旋转范围的最大旋转度数
	        }, opt.limitRotate);
	
	        //旋转点位置
	        this._ratioX = opt.viewboxWidth / this._svg.node.getBoundingClientRect().width;
	        this._ratioY = opt.viewboxHeight / this._svg.node.getBoundingClientRect().height;
	        this._rotatePoint = opt.rotatePoint || {
	            x: opt.viewboxWidth / 2, //this._svg.node.getBoundingClientRect().width / 2,
	            y: opt.viewboxHeight / 2 //this._svg.node.getBoundingClientRect().height / 2
	        };
	        opt.rotatePoint = this._rotatePoint;
	
	        //角度填充色
	        this._angleFillColor = opt.angleFillColor || '#000000';
	        this._angleFillOpacity = !isNaN(opt.angleFillOpacity) ? opt.angleFillOpacity : 1;
	        //角度描边色
	        this._angleStrokeColor = opt.angleStrokeColor || '#000000';
	        //角度圆弧半径
	        this._angleRadius = !isNaN(opt.angleRadius) ? opt.angleRadius : 50;
	        //角度是否可见
	        this._angleVisibility = opt.angleVisibility === undefined ? 'hidden' : 'visible';
	        //角度值
	        this._angleValue = 0;
	
	        //角度文字的大小
	        this._angleTextSize = opt.angleTextSize || 60;
	        //角度文字的颜色
	        this._angleTextColor = opt.angleTextColor || '#ff0000';
	        //角度文字的与旋转点的间距
	        this._angleTextInterval = opt.angleTextInterval || 100;
	        //角度文本是否可见
	        this._angleTextVisibility = opt.angleTextVisibility === undefined ? 'hidden' : 'visible';
	        //角度文字节点
	        this._angleTextNode = undefined;
	    }
	
	    _createClass(BaseView, [{
	        key: 'init',
	        value: function init() {}
	
	        /**
	         * 根据线条旋转的角度计算角度值文字摆放的位置
	         * @param ra 线条的旋转角度
	         * @return {{x: number, y: number}} 文字摆放的位置
	         * @private
	         */
	
	    }, {
	        key: 'calcAngleTextPosition',
	        value: function calcAngleTextPosition(ra, atn) {
	            var width = atn.node.getBBox().width,
	                height = atn.node.getBBox().height;
	            var pos = { x: 0, y: 0 };
	            if (ra > 0 && ra <= 90) {
	                ra = ra > 60 ? 60 : ra;
	                pos.x = -this._angleTextInterval * Math.sin((90 - ra) / 2 * Math.PI / 180) - width / 2;
	                pos.y = -this._angleTextInterval * Math.cos((90 - ra) / 2 * Math.PI / 180) + height / 2;
	            } else if (ra > 90 && ra <= 180) {
	                ra = ra < 120 ? 120 : ra;
	                pos.x = this._angleTextInterval * Math.sin((ra - 90) / 2 * Math.PI / 180);
	                pos.y = -this._angleTextInterval * Math.cos((ra - 90) / 2 * Math.PI / 180) + height / 2;
	            } else if (ra > 180 && ra <= 270) {
	                // ra = ra > 240 ? 240 : ra;
	                pos.x = 0; //this._angleTextInterval * Math.sin((270 - ra) / 2 * Math.PI / 180);
	                pos.y = this._angleTextInterval * Math.cos((270 - ra) / 2 * Math.PI / 180) + height / 2;
	            } else {
	                //ra = ra < 300 ? 300 : ra;
	                pos.x = -width; //-this._angleTextInterval * Math.sin((ra - 270) / 2 * Math.PI / 180) - width / 2;
	                pos.y = this._angleTextInterval * Math.cos((ra - 270) / 2 * Math.PI / 180) + height / 2;
	            }
	
	            return pos;
	        }
	    }, {
	        key: 'uuid',
	        value: function uuid() {
	            var s = [],
	                hexDigits = "0123456789abcdef";
	            for (var i = 0; i < 10; i++) {
	                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	            }
	            return s.join("");
	        }
	    }, {
	        key: 'id',
	        get: function get() {
	            return this._id;
	        }
	    }, {
	        key: 'svg',
	        get: function get() {
	            return this._svg;
	        },
	        set: function set(value) {
	            this._svg = value;
	        }
	    }, {
	        key: 'name',
	        get: function get() {
	            return this._name;
	        },
	        set: function set(value) {
	            this._name = value;
	        }
	    }, {
	        key: 'rotateAngle',
	        get: function get() {
	            return this._rotateAngle;
	        },
	        set: function set(value) {
	            this._rotateAngle = value;
	        }
	    }, {
	        key: 'refractiveIndex',
	        get: function get() {
	            return this._refractiveIndex;
	        },
	        set: function set(value) {
	            this._refractiveIndex = value;
	        }
	    }, {
	        key: 'criticalAngle',
	        get: function get() {
	            return this._criticalAngle;
	        },
	        set: function set(value) {
	            this._criticalAngle = value;
	        }
	    }, {
	        key: 'lineColor',
	        get: function get() {
	            return this._lineColor;
	        },
	        set: function set(value) {
	            this._lineColor = value;
	        }
	    }, {
	        key: 'lineLength',
	        get: function get() {
	            return this._lineLength;
	        },
	        set: function set(value) {
	            this._lineLength = value;
	        }
	    }, {
	        key: 'lineWidth',
	        get: function get() {
	            return this._lineWidth;
	        },
	        set: function set(value) {
	            this._lineWidth = value;
	        }
	    }, {
	        key: 'opacity',
	        get: function get() {
	            return this._opacity;
	        },
	        set: function set(value) {
	            this._opacity = value;
	        }
	    }, {
	        key: 'arrowPos',
	        get: function get() {
	            return this._arrowPos;
	        },
	        set: function set(value) {
	            this._arrowPos = value;
	        }
	    }, {
	        key: 'visibility',
	        get: function get() {
	            return this._visibility;
	        },
	        set: function set(value) {
	            this._visibility = value;
	        }
	    }, {
	        key: 'limitRotate',
	        get: function get() {
	            return this._limitRotate;
	        },
	        set: function set(value) {
	            this._limitRotate = value;
	        }
	    }, {
	        key: 'rotatePoint',
	        get: function get() {
	            return this._rotatePoint;
	        },
	        set: function set(value) {
	            this._rotatePoint = value;
	        }
	    }, {
	        key: 'ratioX',
	        get: function get() {
	            return this._ratioX;
	        },
	        set: function set(value) {
	            this._ratioX = value;
	        }
	    }, {
	        key: 'ratioY',
	        get: function get() {
	            return this._ratioY;
	        },
	        set: function set(value) {
	            this._ratioY = value;
	        }
	    }, {
	        key: 'angleFillColor',
	        get: function get() {
	            return this._angleFillColor;
	        },
	        set: function set(value) {
	            this._angleFillColor = value;
	        }
	    }, {
	        key: 'angleFillOpacity',
	        get: function get() {
	            return this._angleFillOpacity;
	        },
	        set: function set(value) {
	            this._angleFillOpacity = value;
	        }
	    }, {
	        key: 'angleStrokeColor',
	        get: function get() {
	            return this._angleStrokeColor;
	        },
	        set: function set(value) {
	            this._angleStrokeColor = value;
	        }
	    }, {
	        key: 'angleRadius',
	        get: function get() {
	            return this._angleRadius;
	        },
	        set: function set(value) {
	            this._angleRadius = value;
	        }
	    }, {
	        key: 'angleValue',
	        get: function get() {
	            return this._angleValue;
	        },
	        set: function set(value) {
	            this._angleValue = value;
	        }
	    }, {
	        key: 'angleTextSize',
	        get: function get() {
	            return this._angleTextSize;
	        },
	        set: function set(value) {
	            this._angleTextSize = value;
	        }
	    }, {
	        key: 'angleTextColor',
	        get: function get() {
	            return this._angleTextColor;
	        },
	        set: function set(value) {
	            this._angleTextColor = value;
	        }
	    }, {
	        key: 'angleTextInterval',
	        get: function get() {
	            return this._angleTextInterval;
	        },
	        set: function set(value) {
	            this._angleTextInterval = value;
	        }
	    }, {
	        key: 'angleTextNode',
	        get: function get() {
	            return this._angleTextNode;
	        },
	        set: function set(value) {
	            this._angleTextNode = value;
	        }
	    }, {
	        key: 'angleVisibility',
	        get: function get() {
	            return this._angleVisibility;
	        },
	        set: function set(value) {
	            this._angleVisibility = value;
	        }
	    }, {
	        key: 'angleTextVisibility',
	        get: function get() {
	            return this._angleTextVisibility;
	        },
	        set: function set(value) {
	            this._angleTextVisibility = value;
	        }
	    }]);
	
	    return BaseView;
	}();
	
	exports.default = BaseView;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 箭头类
	 */
	
	var Arrow = function () {
	    function Arrow(opt) {
	        _classCallCheck(this, Arrow);
	
	        this._svg = opt.svg;
	        this._color = opt.color;
	        this._opacity = opt.opacity;
	        this._arrowNode = undefined;
	    }
	
	    _createClass(Arrow, [{
	        key: 'init',
	        value: function init() {
	            this._arrowNode = this._svg.paper.path().attr({
	                fill: this._color,
	                opacity: this._opacity,
	                d: 'M 0.31 0.74 C 7.99 8.52 17.23 14.71 27.25 19.04 C 17.33 23.59 8.45 30.25 0.87 38.08 C 2.42 31.70 5.99 26.09 9.81 20.85 C 9.79 20.14 9.75 18.72 9.73 18.01 C 5.76 12.77 2.09 7.15 0.31 0.74 Z'
	            });
	
	            return this;
	        }
	    }, {
	        key: 'arrowNode',
	        get: function get() {
	            return this._arrowNode;
	        },
	        set: function set(value) {
	            this._arrowNode = value;
	        }
	    }]);
	
	    return Arrow;
	}();
	
	exports.default = Arrow;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 旋转按钮类
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	
	var _PublishSubscribe = __webpack_require__(6);
	
	var _PublishSubscribe2 = _interopRequireDefault(_PublishSubscribe);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var OperationButton = function () {
	    function OperationButton(opt) {
	        _classCallCheck(this, OperationButton);
	
	        this._opt = opt;
	        this._svg = opt.svg;
	        this._operationButtonGroupNode = undefined;
	        this._rotateButtonGroupNode = undefined;
	        this._rotateButtonDowned = false;
	    }
	
	    _createClass(OperationButton, [{
	        key: 'init',
	        value: function init() {
	            var _this = this;
	
	            this._operationButtonGroupNode = this._svg.paper.g();
	
	            this._rotateButtonGroupNode = this._svg.paper.g();
	            this._rotateButtonGroupNode.add(this._svg.paper.path().attr({
	                fill: '#000000',
	                opacity: 0.5,
	                d: ' M 25.00 0.00 L 30.35 0.00 C 43.64 1.08 54.95 12.40 56.00 25.70 L 56.00 30.24 C 55.21 37.72 51.64 44.95 45.70 49.66 C 41.56 53.19 36.31 55.06 31.02 56.00 L 25.23 56.00 C 12.13 54.63 1.05 43.50 0.00 30.33 L 0.00 25.74 C 1.01 12.61 11.98 1.52 25.00 0.00 M 12.65 24.00 C 11.74 24.00 9.92 24.00 9.01 24.00 C 11.01 26.00 12.98 28.03 15.01 30.01 C 17.23 28.24 19.08 25.98 21.16 24.01 C 19.81 24.02 18.45 24.00 17.10 23.96 C 19.54 16.86 29.29 13.95 35.10 18.81 C 41.54 23.40 40.89 34.19 34.05 38.07 C 28.86 41.48 21.33 39.55 18.50 33.99 C 17.54 34.95 16.59 35.93 15.65 36.91 C 15.37 36.85 14.80 36.74 14.51 36.68 C 18.04 41.54 24.03 44.82 30.15 43.85 C 37.89 43.00 44.18 35.75 43.99 27.98 C 44.16 20.20 37.83 12.95 30.08 12.14 C 22.34 10.96 14.52 16.46 12.65 24.00 Z'
	            })).add(this._svg.paper.path().attr({
	                fill: '#ffffff',
	                opacity: 1,
	                d: ' M 12.65 24.00 C 14.52 16.46 22.34 10.96 30.08 12.14 C 37.83 12.95 44.16 20.20 43.99 27.98 C 44.18 35.75 37.89 43.00 30.15 43.85 C 24.03 44.82 18.04 41.54 14.51 36.68 C 14.80 36.74 15.37 36.85 15.65 36.91 C 16.59 35.93 17.54 34.95 18.50 33.99 C 21.33 39.55 28.86 41.48 34.05 38.07 C 40.89 34.19 41.54 23.40 35.10 18.81 C 29.29 13.95 19.54 16.86 17.10 23.96 C 18.45 24.00 19.81 24.02 21.16 24.01 C 19.08 25.98 17.23 28.24 15.01 30.01 C 12.98 28.03 11.01 26.00 9.01 24.00 C 9.92 24.00 11.74 24.00 12.65 24.00 Z'
	            }));
	
	            this._operationButtonGroupNode.add(this._rotateButtonGroupNode);
	
	            this._operationButtonGroupNode.attr({
	                transform: 'translate(' + (-this._operationButtonGroupNode.getBBox().width - 20) + ',' + -this._operationButtonGroupNode.getBBox().height / 2 + ')'
	            });
	            this._rotateButtonGroupNode.mousedown(function (e, x, y) {
	                _this._rotateButtonGroupNode.select('path:nth-child(2)').attr({
	                    fill: '#e06313'
	                });
	                _this._rotateButtonDowned = true;
	                _PublishSubscribe2.default.publish(_PublishSubscribe2.default.OnIncidentRayRotateButtonDownEvent, {
	                    id: _this._opt.id,
	                    name: _this._opt.name
	                });
	            });
	
	            //旋转按钮up事件
	            _PublishSubscribe2.default.subscribe(_PublishSubscribe2.default.OnIncidentRayRotateButtonUpEvent, function (topic, args) {
	                if (args.name !== _this._opt.name) {
	                    return;
	                }
	                _this._rotateButtonGroupNode.select('path:nth-child(2)').attr({
	                    fill: '#ffffff'
	                });
	            });
	
	            return this;
	        }
	    }, {
	        key: 'operationButtonGroupNode',
	        get: function get() {
	            return this._operationButtonGroupNode;
	        },
	        set: function set(value) {
	            this._operationButtonGroupNode = value;
	        }
	    }, {
	        key: 'rotateButtonGroupNode',
	        get: function get() {
	            return this._rotateButtonGroupNode;
	        },
	        set: function set(value) {
	            this._rotateButtonGroupNode = value;
	        }
	    }, {
	        key: 'rotateButtonDowned',
	        get: function get() {
	            return this._rotateButtonDowned;
	        },
	        set: function set(value) {
	            this._rotateButtonDowned = value;
	        }
	    }]);
	
	    return OperationButton;
	}();
	
	exports.default = OperationButton;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PublishSubscribe = function () {
	    function PublishSubscribe() {
	        _classCallCheck(this, PublishSubscribe);
	    }
	
	    //发布消息
	
	
	    _createClass(PublishSubscribe, null, [{
	        key: 'publish',
	        value: function publish(topic, args) {
	            if (!PublishSubscribe.topics[topic]) {
	                return;
	            }
	            var subs = PublishSubscribe.topics[topic];
	            for (var i = 0, iLen = subs.length; i < iLen; i++) {
	                subs[i].func(topic, args);
	            }
	        }
	    }, {
	        key: 'subscribe',
	        value: function subscribe(topic, func) {
	            PublishSubscribe.topics[topic] = PublishSubscribe.topics[topic] ? PublishSubscribe.topics[topic] : [];
	            var token = (++PublishSubscribe.topicIndex).toString();
	            PublishSubscribe.topics[topic].push({
	                token: token,
	                func: func
	            });
	            return token;
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            PublishSubscribe.queues = {};
	            PublishSubscribe.topics = {};
	            PublishSubscribe.topicIndex = -1;
	        }
	    }]);
	
	    return PublishSubscribe;
	}();
	
	exports.default = PublishSubscribe;
	
	
	PublishSubscribe.queues = {};
	PublishSubscribe.topics = {};
	PublishSubscribe.topicIndex = -1;
	
	//发生全反射事件
	PublishSubscribe.OnTotalReflectionEvent = Symbol.for('On Total Reflection Event');
	//旋转按钮被down事件
	PublishSubscribe.OnIncidentRayRotateButtonDownEvent = Symbol.for('On Incident Ray Rotate Button Down Event');
	//旋转按钮被up事件
	PublishSubscribe.OnIncidentRayRotateButtonUpEvent = Symbol.for('On Incident Ray Rotate Button Up Event');
	//入射角发生变化事件
	PublishSubscribe.OnIncidentAngleChangedEvent = Symbol.for('On Incident Angle Changed Event');

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 角度类
	 */
	var Angle = function () {
	    function Angle(opt) {
	        _classCallCheck(this, Angle);
	
	        this._svg = opt.svg;
	        //角度圆弧填充色
	        this._angleFillColor = opt.angleFillColor;
	        this._angleFillOpacity = opt.angleFillOpacity;
	        //角度边框色
	        this._angleStrokeColor = opt.angleStrokeColor;
	        //角度圆弧半径
	        this._angleRadius = opt.angleRadius;
	        //角度值
	        this._angleValue = opt.angleValue;
	        //旋转度数
	        this._rotateAngle = opt.rotateAngle;
	        //角度是否可见
	        this._angleVisibility = opt.angleVisibility === undefined ? 'hidden' : 'visible';
	        //旋转点位置
	        this._rotatePoint = opt.rotatePoint;
	        this._angleNode = undefined;
	    }
	
	    _createClass(Angle, [{
	        key: 'init',
	        value: function init() {
	            this._angleNode = this._svg.paper.path();
	            this.drawAngleValue();
	            return this;
	        }
	    }, {
	        key: 'drawAngleValue',
	        value: function drawAngleValue() {
	            var endX = this._angleRadius - this._angleRadius * Math.cos(this._angleValue * Math.PI / 180);
	            var endY = -this._angleRadius * Math.sin(this._angleValue * Math.PI / 180);
	            this._angleNode.attr({
	                d: 'M ' + this._angleRadius + ' 0 H 0 0 A ' + this._angleRadius + ' ' + this._angleRadius + ' 0 0 1 ' + endX + ' ' + endY + ' z',
	                fill: this._angleFillColor,
	                stroke: this._angleStrokeColor,
	                transform: 'translate(' + (this._rotatePoint.x - this._angleRadius) + ',' + this._rotatePoint.y + ') rotate(' + this._rotateAngle + ',' + this._angleRadius + ',0)',
	                visibility: this._angleVisibility,
	                opacity: this._angleFillOpacity
	            });
	            return this;
	        }
	    }, {
	        key: 'show',
	        value: function show(isShow) {
	            this._angleVisibility = isShow ? 'visible' : 'hidden';
	            this._angleNode.attr({
	                visibility: this._angleVisibility
	            });
	        }
	    }, {
	        key: 'angleNode',
	        get: function get() {
	            return this._angleNode;
	        },
	        set: function set(value) {
	            this._angleNode = value;
	        }
	    }, {
	        key: 'angleValue',
	        get: function get() {
	            return this._angleValue;
	        },
	        set: function set(value) {
	            this._angleValue = value;
	        }
	    }, {
	        key: 'rotateAngle',
	        get: function get() {
	            return this._rotateAngle;
	        },
	        set: function set(value) {
	            this._rotateAngle = value;
	        }
	    }, {
	        key: 'angleVisibility',
	        get: function get() {
	            return this._angleVisibility;
	        },
	        set: function set(value) {
	            this._angleVisibility = value;
	        }
	    }, {
	        key: 'angleFillColor',
	        get: function get() {
	            return this._angleFillColor;
	        },
	        set: function set(value) {
	            this._angleFillColor = value;
	        }
	    }, {
	        key: 'angleFillOpacity',
	        get: function get() {
	            return this._angleFillOpacity;
	        },
	        set: function set(value) {
	            this._angleFillOpacity = value;
	        }
	    }]);
	
	    return Angle;
	}();
	
	exports.default = Angle;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _BaseView2 = __webpack_require__(3);
	
	var _BaseView3 = _interopRequireDefault(_BaseView2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 法线类
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	var Normal = function (_BaseView) {
	    _inherits(Normal, _BaseView);
	
	    function Normal(opt) {
	        _classCallCheck(this, Normal);
	
	        //线条长度
	        var _this = _possibleConstructorReturn(this, (Normal.__proto__ || Object.getPrototypeOf(Normal)).call(this, opt));
	
	        _this.lineLength = opt.normalLength || _this.lineLength;
	        //线条宽度
	        _this.lineWidth = opt.normalWidth || _this.lineWidth;
	        //透明度
	        _this.opacity = opt.normalOpacity || _this.opacity;
	        //是否显示线条
	        _this._visibility = opt.normalVisibility === undefined ? _this._visibility : opt.normalVisibility;
	        //法线的group,包含法线、直线
	        _this._normalGroupNode = undefined;
	        //法线节点
	        _this._normalNode = undefined;
	        //直角
	        _this._rightAngleNode = undefined;
	        return _this;
	    }
	
	    _createClass(Normal, [{
	        key: 'init',
	        value: function init() {
	            this._normalGroupNode = this.svg.paper.g().attr({
	                transform: 'translate(' + this.rotatePoint.x + ',' + this.rotatePoint.y + ')',
	                visibility: this._visibility
	            });
	            this._normalNode = this.svg.paper.line().attr({
	                x1: 0,
	                y1: -this.lineLength / 2,
	                x2: 0,
	                y2: this.lineLength / 2,
	                stroke: this.lineColor,
	                strokeWidth: this.lineWidth,
	                opacity: this.opacity,
	                strokeDasharray: '10,5'
	            });
	            this._rightAngleNode = this.svg.paper.path().attr({
	                d: 'M 0 ' + (-20 - this.lineWidth) + ' h 20 v 20',
	                stroke: this.lineColor,
	                fill: 'none',
	                opacity: this.opacity,
	                strokeWidth: this.lineWidth
	            });
	            this._normalGroupNode.add(this._normalNode);
	            this._normalGroupNode.add(this._rightAngleNode);
	            return this;
	        }
	    }, {
	        key: 'show',
	        value: function show(isShow) {
	            this.visibility = isShow ? 'visible' : 'hidden';
	            this._normalGroupNode.attr({
	                visibility: this.visibility
	            });
	        }
	    }, {
	        key: 'normalGroupNode',
	        get: function get() {
	            return this._normalGroupNode;
	        },
	        set: function set(value) {
	            this._normalGroupNode = value;
	        }
	    }, {
	        key: 'normalNode',
	        get: function get() {
	            return this._normalNode;
	        },
	        set: function set(value) {
	            this._normalNode = value;
	        }
	    }]);
	
	    return Normal;
	}(_BaseView3.default);
	
	exports.default = Normal;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _BaseView2 = __webpack_require__(3);
	
	var _BaseView3 = _interopRequireDefault(_BaseView2);
	
	var _Arrow = __webpack_require__(4);
	
	var _Arrow2 = _interopRequireDefault(_Arrow);
	
	var _Angle = __webpack_require__(7);
	
	var _Angle2 = _interopRequireDefault(_Angle);
	
	var _PublishSubscribe = __webpack_require__(6);
	
	var _PublishSubscribe2 = _interopRequireDefault(_PublishSubscribe);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 反射线类
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	var ReflectedRay = function (_BaseView) {
	    _inherits(ReflectedRay, _BaseView);
	
	    function ReflectedRay(opt) {
	        _classCallCheck(this, ReflectedRay);
	
	        //线条长度
	        var _this = _possibleConstructorReturn(this, (ReflectedRay.__proto__ || Object.getPrototypeOf(ReflectedRay)).call(this, opt));
	
	        _this.lineLength = opt.reflectedRayLength || _this.lineLength;
	        //线条宽度
	        _this.lineWidth = opt.reflectedRayWidth || _this.lineWidth;
	        //透明度
	        _this.opacity = opt.reflectedRayOpacity || _this.opacity;
	        //线的颜色值
	        _this.lineColor = opt.reflectedRayLineColor || _this.lineColor;
	        //是否显示线条
	        _this._visibility = opt.reflectedRayVisibility === undefined ? _this._visibility : opt.reflectedRayVisibility;
	        //箭头位置
	        _this.arrowPos = opt.reflectedRayArrowPos || _this.arrowPos;
	        //反射线组，包括箭头、反射线
	        _this._reflectedRayGroupNode = undefined;
	        //反射线的节点
	        _this._reflectedRayNode = undefined;
	        //箭头
	        _this._arrow = new _Arrow2.default($.extend({}, opt, { color: _this.lineColor }));
	        //反射线旋转角度
	        _this.rotateAngle = _this._calcReflectedRotateAngle(_this.rotateAngle);
	
	        //反射角填充色
	        _this.angleFillColor = opt.reflectedAngleFillColor || _this.angleFillColor;
	        //角度透明度
	        _this.angleFillOpacity = opt.reflectedAngleFillOpacity || _this.angleFillOpacity;
	        //反射角描边色
	        _this.angleStrokeColor = opt.reflectedAngleStrokeColor || _this.angleStrokeColor;
	        //反射角半径
	        _this.angleRadius = opt.reflectedAngleRadius || _this.angleRadius;
	        //反射线角度值
	        _this.angleValue = _this._calcReflectedAngle(_this.rotateAngle);
	        //反射角
	        _this._angle = new _Angle2.default($.extend({}, opt, {
	            angleFillColor: _this.angleFillColor,
	            angleFillOpacity: _this.angleFillOpacity,
	            angleStrokeColor: _this.angleStrokeColor,
	            angleRadius: _this.angleRadius,
	            angleValue: _this.angleValue,
	            rotateAngle: _this._calcReflectedAngleRotateAngle(_this.rotateAngle),
	            rotatePoint: _this.rotatePoint
	        }));
	
	        //反射角度文字的大小
	        _this.angleTextSize = opt.reflectedAngleTextSize || _this.angleTextSize;
	        //反射角度文字的颜色
	        _this.angleTextColor = opt.reflectedAngleTextColor || _this.angleTextColor;
	        //反射角度文字的与旋转点的间距
	        _this.angleTextInterval = opt.reflectedAngleTextInterval || _this.angleTextInterval;
	        return _this;
	    }
	
	    _createClass(ReflectedRay, [{
	        key: 'init',
	        value: function init() {
	            var _this2 = this;
	
	            //入射角
	            this._angle.init();
	
	            this._reflectedRayGroupNode = this.svg.paper.g({
	                visibility: this._visibility
	            });
	            this._reflectedRayNode = this.svg.paper.path().attr({
	                d: 'M 0 0 h ' + this.lineLength + ' v ' + this.lineWidth + ' h ' + -this.lineLength + ' z',
	                fill: this.lineColor,
	                opacity: this.opacity
	            });
	
	            this._reflectedRayNode.attr({
	                transform: 'translate(0,' + -this._reflectedRayNode.getBBox().height / 2 + ')'
	            });
	            this._reflectedRayGroupNode.add(this._reflectedRayNode);
	            //箭头
	            this._arrow.init();
	            this._arrow.arrowNode.attr({
	                transform: 'translate(' + this.arrowPos + ',' + this._arrow.arrowNode.getBBox().height / 2 + ') rotate(180)',
	                opacity: this.opacity
	            });
	            this._reflectedRayGroupNode.add(this._arrow.arrowNode);
	
	            //移到默认旋转点位置，旋转默认角度
	            this._reflectedRayGroupNode.attr({
	                transform: 'translate(' + (this.rotatePoint.x - this.lineLength) + ',' + (this.rotatePoint.y - this.lineWidth / 2) + ') \n            rotate(' + this.rotateAngle + ',' + this.lineLength + ',0)'
	            });
	            //显示度数文字
	            this.angleTextNode = this.svg.paper.text().attr({
	                text: this.angleValue + '\xB0',
	                fill: this.angleTextColor,
	                fontSize: this.angleTextSize,
	                fontWeight: 'bold',
	                transform: 'translate(' + this.rotatePoint.x + ',' + this.rotatePoint.y + ')',
	                visibility: this.angleTextVisibility
	            });
	            this.angleTextPosition = this.calcAngleTextPosition(this.rotateAngle, this.angleTextNode);
	            this.angleTextNode.attr({
	                x: this.angleTextPosition.x,
	                y: this.angleTextPosition.y
	            });
	
	            _PublishSubscribe2.default.subscribe(_PublishSubscribe2.default.OnIncidentAngleChangedEvent, function (topic, args) {
	                if (args.name !== _this2.name) {
	                    return;
	                }
	                _this2.rotate(args.inAngle, args.rotateAngle);
	            });
	
	            return this;
	        }
	
	        /**
	         * 反射线旋转
	         * @param inAngle 入射线
	         * @param angle 入射线的旋转角度
	         */
	
	    }, {
	        key: 'rotate',
	        value: function rotate(inAngle, roAngle) {
	            this.rotateAngle = this._calcReflectedRotateAngle(roAngle);
	            this._reflectedRayGroupNode.attr({
	                transform: 'translate(' + (this.rotatePoint.x - this.lineLength) + ',' + (this.rotatePoint.y - this.lineWidth / 2) + ') \n            rotate(' + this.rotateAngle + ',' + this.lineLength + ',0)'
	            });
	
	            //角度值也要变化
	            this.angleValue = this._calcReflectedAngle(this.rotateAngle);
	            this._angle.angleValue = this.angleValue;
	            this._angle.rotateAngle = this._calcReflectedAngleRotateAngle(this.rotateAngle);
	            this._angle.angleVisibility = this.angleVisibility;
	            this._angle.angleFillColor = this.angleFillColor;
	            this._angle.angleFillOpacity = this.angleFillOpacity;
	            this._angle.drawAngleValue();
	            //变换度数文字位置
	            this.angleTextNode.attr({
	                text: this.angleValue + '\xB0'
	            });
	            this.angleTextPosition = this.calcAngleTextPosition(this.rotateAngle, this.angleTextNode);
	            this.angleTextNode.attr({
	                x: this.angleTextPosition.x,
	                y: this.angleTextPosition.y,
	                visibility: this.angleTextVisibility
	            });
	        }
	    }, {
	        key: 'showLine',
	        value: function showLine(isShow) {
	            this.visibility = isShow ? 'visible' : 'hidden';
	            this._reflectedRayGroupNode.attr({
	                visibility: this.visibility
	            });
	        }
	    }, {
	        key: 'showAngle',
	        value: function showAngle(isShow) {
	            this.angleVisibility = isShow ? 'visible' : 'hidden';
	            this._angle.show(isShow);
	        }
	    }, {
	        key: 'showAngleText',
	        value: function showAngleText(isShow) {
	            this.angleTextVisibility = isShow ? 'visible' : 'hidden';
	            this.angleTextNode.attr({
	                visibility: this.angleTextVisibility
	            });
	        }
	
	        /**
	         * 根据反射线旋转角度，计算反射角
	         * @param rotateAngle 反射线旋转度数
	         * @return {number} 反射角
	         * @private
	         */
	
	    }, {
	        key: '_calcReflectedAngle',
	        value: function _calcReflectedAngle(ra) {
	            var reflectedAngle = 0;
	            if (ra > 0 && ra <= 90) {
	                reflectedAngle = 90 - ra;
	            } else if (ra > 90 && ra <= 180) {
	                reflectedAngle = ra - 90;
	            } else if (ra > 180 && ra <= 270) {
	                reflectedAngle = 270 - ra;
	            } else {
	                reflectedAngle = ra - 270;
	            }
	
	            return Number(reflectedAngle.toFixed(1));
	        }
	
	        /**
	         * 根据入射线旋转的度数计算反射线旋转度数
	         * @param incidentRotateAngle 入射线的旋转度数
	         * @return {number} 反射线的旋转度数
	         */
	
	    }, {
	        key: '_calcReflectedRotateAngle',
	        value: function _calcReflectedRotateAngle(incidentRotateAngle) {
	            incidentRotateAngle = incidentRotateAngle % 360;
	            var rotateAngle = 0;
	            if (incidentRotateAngle >= 0 && incidentRotateAngle <= 180) {
	                rotateAngle = 180 - incidentRotateAngle;
	            } else if (incidentRotateAngle > 180 && incidentRotateAngle < 360) {
	                rotateAngle = 540 - incidentRotateAngle;
	            }
	            return Number(rotateAngle.toFixed(1));
	        }
	
	        /**
	         * 根据反射线旋转角度，计算反射角旋转度数
	         * @param ra 反射线旋转度数
	         * @return {number} 反射角旋转度数
	         * @private
	         */
	
	    }, {
	        key: '_calcReflectedAngleRotateAngle',
	        value: function _calcReflectedAngleRotateAngle(ra) {
	            ra = ra % 360;
	            var rotateAngle = 0;
	            if (ra > 0 && ra <= 90) {
	                rotateAngle = ra;
	            } else if (ra > 90 && ra <= 180) {
	                //XXX 这边写死180会有问题
	                rotateAngle = 180;
	            } else if (ra > 180 && ra <= 270) {
	                rotateAngle = ra;
	            } else {
	                rotateAngle = 270;
	            }
	            return Number(rotateAngle.toFixed(1));
	        }
	    }, {
	        key: 'reflectedRayNode',
	        get: function get() {
	            return this._reflectedRayNode;
	        },
	        set: function set(value) {
	            this._reflectedRayNode = value;
	        }
	    }, {
	        key: 'angle',
	        get: function get() {
	            return this._angle;
	        },
	        set: function set(value) {
	            this._angle = value;
	        }
	    }, {
	        key: 'arrow',
	        get: function get() {
	            return this._arrow;
	        },
	        set: function set(value) {
	            this._arrow = value;
	        }
	    }]);
	
	    return ReflectedRay;
	}(_BaseView3.default);
	
	exports.default = ReflectedRay;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _BaseView2 = __webpack_require__(3);
	
	var _BaseView3 = _interopRequireDefault(_BaseView2);
	
	var _Arrow = __webpack_require__(4);
	
	var _Arrow2 = _interopRequireDefault(_Arrow);
	
	var _Angle = __webpack_require__(7);
	
	var _Angle2 = _interopRequireDefault(_Angle);
	
	var _PublishSubscribe = __webpack_require__(6);
	
	var _PublishSubscribe2 = _interopRequireDefault(_PublishSubscribe);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 折射线类
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	var RefractedRay = function (_BaseView) {
	    _inherits(RefractedRay, _BaseView);
	
	    function RefractedRay(opt) {
	        _classCallCheck(this, RefractedRay);
	
	        //线条长度
	        var _this = _possibleConstructorReturn(this, (RefractedRay.__proto__ || Object.getPrototypeOf(RefractedRay)).call(this, opt));
	
	        _this.lineLength = opt.refractedRayLength || _this.lineLength;
	        //线条宽度
	        _this.lineWidth = opt.refractedRayWidth || _this.lineWidth;
	        //线的颜色值
	        _this.lineColor = opt.refractedRayLineColor || _this.lineColor;
	        //透明度
	        _this.opacity = opt.refractedRayOpacity || _this.opacity;
	        //箭头位置
	        _this.arrowPos = opt.refractedRayArrowPos || _this.arrowPos;
	        //是否显示线条
	        _this._visibility = opt.refractedRayVisibility === undefined ? _this._visibility : opt.refractedRayVisibility;
	
	        //折射线组，包括箭头、反射线
	        _this._refractedRayGroupNode = undefined;
	        //折射线的节点
	        _this._refractedRayNode = undefined;
	        //箭头
	        _this._arrow = new _Arrow2.default($.extend({}, opt, { color: _this.lineColor }));
	        //折射线旋转度数
	        _this.rotateAngle = _this._calcRefractedRotateAngle(_this.rotateAngle);
	
	        //折射角填充色
	        _this.angleFillColor = opt.refractedAngleFillColor || _this.angleFillColor;
	        //角度透明度
	        _this.angleFillOpacity = opt.refractedAngleFillOpacity || _this.angleFillOpacity;
	        //折射角描边色
	        _this.angleStrokeColor = opt.refractedAngleStrokeColor || _this.angleStrokeColor;
	        //折射角半径
	        _this.angleRadius = opt.refractedAngleRadius || _this.angleRadius;
	        //折射角度值
	        _this.angleValue = _this._calcRefractedAngle(_this.rotateAngle);
	        //折射角
	        _this._angle = new _Angle2.default($.extend({}, opt, {
	            angleFillColor: _this.angleFillColor,
	            angleFillOpacity: _this.angleFillOpacity,
	            angleStrokeColor: _this.angleStrokeColor,
	            angleRadius: _this.angleRadius,
	            angleValue: _this.angleValue,
	            rotateAngle: _this._calcRefractedAngleRotateAngle(_this.rotateAngle),
	            rotatePoint: _this.rotatePoint
	        }));
	
	        //反射角度文字的大小
	        _this.angleTextSize = opt.refractedAngleTextSize || _this.angleTextSize;
	        //反射角度文字的颜色
	        _this.angleTextColor = opt.refractedAngleTextColor || _this.angleTextColor;
	        //反射角度文字的与旋转点的间距
	        _this.angleTextInterval = opt.refractedAngleTextInterval || _this.angleTextInterval;
	        return _this;
	    }
	
	    _createClass(RefractedRay, [{
	        key: 'init',
	        value: function init() {
	            var _this2 = this;
	
	            //折射角
	            this._angle.init();
	
	            this._refractedRayGroupNode = this.svg.paper.g({
	                visibility: this._visibility
	            });
	            //移到默认旋转点位置，旋转默认角度
	            this._refractedRayGroupNode.attr({
	                transform: 'translate(' + (this.rotatePoint.x - this.lineLength) + ',' + (this.rotatePoint.y - this.lineWidth / 2) + ') \n            rotate(' + this.rotateAngle + ',' + this.lineLength + ',0)'
	            });
	
	            this._refractedRayNode = this.svg.paper.path().attr({
	                d: 'M 0 0 h ' + this.lineLength + ' v ' + this.lineWidth + ' h ' + -this.lineLength + ' z',
	                fill: this.lineColor,
	                opacity: this.opacity
	            });
	
	            this._refractedRayNode.attr({
	                transform: 'translate(0,' + -this._refractedRayNode.getBBox().height / 2 + ')'
	            });
	            this._refractedRayGroupNode.add(this._refractedRayNode);
	            //箭头
	            this._arrow.init();
	            this._arrow.arrowNode.attr({
	                transform: 'translate(' + this.arrowPos + ',' + this._arrow.arrowNode.getBBox().height / 2 + ') rotate(180)',
	                opacity: this.opacity
	            });
	            this._refractedRayGroupNode.add(this._arrow.arrowNode);
	
	            //显示度数文字
	            this.angleTextNode = this.svg.paper.text().attr({
	                text: this.angleValue + '\xB0',
	                fill: this.angleTextColor,
	                fontSize: this.angleTextSize,
	                fontWeight: 'bold',
	                transform: 'translate(' + this.rotatePoint.x + ',' + this.rotatePoint.y + ')',
	                visibility: this.angleTextVisibility
	            });
	            this.angleTextPosition = this.calcAngleTextPosition(this.rotateAngle, this.angleTextNode);
	            this.angleTextNode.attr({
	                x: this.angleTextPosition.x,
	                y: this.angleTextPosition.y
	            });
	
	            _PublishSubscribe2.default.subscribe(_PublishSubscribe2.default.OnIncidentAngleChangedEvent, function (topic, args) {
	                if (args.name !== _this2.name) {
	                    return;
	                }
	                _this2.rotate(args.inAngle, args.rotateAngle);
	            });
	            return this;
	        }
	    }, {
	        key: 'rotate',
	        value: function rotate(inAngle, roAngle) {
	            this.rotateAngle = this._calcRefractedRotateAngle(roAngle, inAngle);
	
	            this._refractedRayGroupNode.attr({
	                transform: 'translate(' + (this.rotatePoint.x - this.lineLength) + ' , ' + (this.rotatePoint.y - this.lineWidth / 2) + ') \n            rotate(' + this.rotateAngle + ',' + this.lineLength + ',0)',
	                visibility: this._visibility
	            });
	
	            //角度值也要变化
	            this.angleValue = this._calcRefractedAngle(this.rotateAngle);
	            this._angle.angleValue = this.angleValue;
	            this._angle.rotateAngle = this._calcRefractedAngleRotateAngle(this.rotateAngle);
	            this._angle.angleVisibility = this.angleVisibility;
	            this._angle.angleFillColor = this.angleFillColor;
	            this._angle.angleFillOpacity = this.angleFillOpacity;
	
	            this._angle.drawAngleValue();
	            //变换度数文字位置
	            this.angleTextNode.attr({
	                text: this.angleValue + '\xB0'
	            });
	            this.angleTextPosition = this.calcAngleTextPosition(this.rotateAngle, this.angleTextNode);
	            this.angleTextNode.attr({
	                x: this.angleTextPosition.x,
	                y: this.angleTextPosition.y,
	                visibility: this.angleTextVisibility
	            });
	        }
	    }, {
	        key: 'showLine',
	        value: function showLine(isShow) {
	            this.visibility = isShow ? 'visible' : 'hidden';
	            this._refractedRayGroupNode.attr({
	                visibility: this.visibility
	            });
	        }
	    }, {
	        key: 'showAngle',
	        value: function showAngle(isShow) {
	            this.angleVisibility = isShow ? 'visible' : 'hidden';
	            this._angle.show(isShow);
	        }
	    }, {
	        key: 'showAngleText',
	        value: function showAngleText(isShow) {
	            this.angleTextVisibility = isShow ? 'visible' : 'hidden';
	            this.angleTextNode.attr({
	                visibility: this.angleTextVisibility
	            });
	        }
	
	        /**
	         * 根据线条旋转的角度计算角度值文字摆放的位置
	         * @param ra 线条的旋转角度
	         * @return {{x: number, y: number}} 文字摆放的位置
	         * @private
	         */
	
	    }, {
	        key: 'calcAngleTextPosition',
	        value: function calcAngleTextPosition(ra, atn) {
	            var width = atn.node.getBoundingClientRect().width,
	                height = atn.node.getBoundingClientRect().height;
	            var pos = { x: 0, y: 0 };
	            if (ra > 0 && ra <= 90) {
	                ra = ra > 60 ? 60 : ra;
	                pos.x = -this._angleTextInterval * Math.sin((90 - ra) / 2 * Math.PI / 180) - width / 2;
	                pos.y = -this._angleTextInterval * Math.cos((90 - ra) / 2 * Math.PI / 180) + height / 2;
	            } else if (ra > 90 && ra <= 180) {
	                ra = ra < 120 ? 120 : ra;
	                pos.x = this._angleTextInterval * Math.sin((ra - 90) / 2 * Math.PI / 180) - width / 2;
	                pos.y = -this._angleTextInterval * Math.cos((ra - 90) / 2 * Math.PI / 180) + height / 2;
	            } else if (ra > 180 && ra <= 270) {
	                ra = ra > 240 ? 240 : ra;
	                pos.x = this._angleTextInterval * Math.sin((270 - ra) / 2 * Math.PI / 180);
	                pos.y = this._angleTextInterval * Math.cos((270 - ra) / 2 * Math.PI / 180) + height / 2;
	            } else {
	                ra = ra < 300 ? 300 : ra;
	                pos.x = -this._angleTextInterval * Math.sin((ra - 270) / 2 * Math.PI / 180) - width / 2;
	                pos.y = this._angleTextInterval * Math.cos((ra - 270) / 2 * Math.PI / 180) + height / 2;
	            }
	
	            return pos;
	        }
	
	        /**
	         * 根据入射线旋转的度数计算折射线折射的角度
	         * @param incidentRotateAngle 入射线旋转的度数
	         * @param inAngle 入射角度数
	         * @return {number} 折射线旋转的度数
	         * @private
	         */
	
	    }, {
	        key: '_calcRefractedRotateAngle',
	        value: function _calcRefractedRotateAngle(incidentRotateAngle, inAngle) {
	            incidentRotateAngle = incidentRotateAngle % 360;
	            if (!inAngle && inAngle !== 0) {
	                if (incidentRotateAngle > 0 && incidentRotateAngle <= 180) {
	                    inAngle = Math.abs(90 - incidentRotateAngle);
	                } else {
	                    inAngle = Math.abs(270 - incidentRotateAngle);
	                }
	            }
	            var refractedSinVal = this.refractiveIndex * Math.sin(inAngle * Math.PI / 180);
	            if (refractedSinVal > 1) {
	                return 0;
	            }
	            var refractedAngle = Math.asin(refractedSinVal) * 180 / Math.PI;
	            refractedAngle = (refractedAngle + 360) % 360;
	            var rotateAngle = 0;
	            if (incidentRotateAngle > 0 && incidentRotateAngle <= 90) {
	                rotateAngle = 270 - refractedAngle;
	            } else if (incidentRotateAngle > 90 && incidentRotateAngle <= 180) {
	                rotateAngle = 270 + refractedAngle;
	            } else if (incidentRotateAngle > 180 && incidentRotateAngle <= 270) {
	                rotateAngle = 90 - refractedAngle;
	            } else {
	                rotateAngle = 90 + refractedAngle;
	            }
	            return Number(rotateAngle.toFixed(1));
	        }
	
	        /**
	         * 根据折射线的旋转角度，计算折射角
	         * @param ra 折射线旋转角度
	         * @return {number} 折射角
	         * @private
	         */
	
	    }, {
	        key: '_calcRefractedAngle',
	        value: function _calcRefractedAngle(ra) {
	            return Number(Math.abs(90 - ra).toFixed(1));
	        }
	
	        /**
	         * 根据折射线旋转角度，计算折射角旋转度数
	         * @param ra 折射线旋转度数
	         * @return {number} 折射角旋转度数
	         * @private
	         */
	
	    }, {
	        key: '_calcRefractedAngleRotateAngle',
	        value: function _calcRefractedAngleRotateAngle(ra) {
	            ra = ra % 360;
	            var rotateAngle = 0;
	            if (ra > 0 && ra <= 90) {
	                rotateAngle = ra;
	            } else if (ra > 90 && ra <= 180) {
	                rotateAngle = 90;
	            } else if (ra > 180 && ra <= 270) {
	                rotateAngle = ra;
	            } else {
	                rotateAngle = 270;
	            }
	            return Number(rotateAngle.toFixed(1));
	        }
	    }, {
	        key: 'refractedRayNode',
	        get: function get() {
	            return this._refractedRayNode;
	        },
	        set: function set(value) {
	            this._refractedRayNode = value;
	        }
	    }, {
	        key: 'arrow',
	        get: function get() {
	            return this._arrow;
	        },
	        set: function set(value) {
	            this._arrow = value;
	        }
	    }, {
	        key: 'angle',
	        get: function get() {
	            return this._angle;
	        },
	        set: function set(value) {
	            this._angle = value;
	        }
	    }]);
	
	    return RefractedRay;
	}(_BaseView3.default);
	
	exports.default = RefractedRay;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _BaseView2 = __webpack_require__(3);
	
	var _BaseView3 = _interopRequireDefault(_BaseView2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 临界角线
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	var CriticalAngleRay = function (_BaseView) {
	    _inherits(CriticalAngleRay, _BaseView);
	
	    function CriticalAngleRay(opt) {
	        _classCallCheck(this, CriticalAngleRay);
	
	        //线条长度
	        var _this = _possibleConstructorReturn(this, (CriticalAngleRay.__proto__ || Object.getPrototypeOf(CriticalAngleRay)).call(this, opt));
	
	        _this.lineLength = opt.criticalAngleRayLength || _this.lineLength;
	        //线条宽度
	        _this.lineWidth = opt.criticalAngleRayWidth || _this.lineWidth;
	        //线条颜色
	        _this.lineColor = opt.criticalAngleRayColor || _this.lineColor;
	        //透明度
	        _this.opacity = opt.criticalAngleRayOpacity || _this.opacity;
	        //是否显示线条
	        _this.visibility = opt.criticalAngleRayVisibility === undefined ? _this.visibility : opt.criticalAngleRayVisibility;
	        //默认旋转度数
	        _this.rotateAngle = _this._clacRotateAngle(); //this.criticalAngle;
	        //全反射线容器
	        _this._criticalAngleRayGroupNode = undefined;
	        _this._criticalAngleRayNode = undefined;
	        return _this;
	    }
	
	    _createClass(CriticalAngleRay, [{
	        key: 'init',
	        value: function init() {
	            this._criticalAngleRayGroupNode = this.svg.paper.g().attr({
	                transform: 'translate(' + (this.rotatePoint.x - this.lineLength) + ',' + (this.rotatePoint.y - this.lineWidth / 2) + ') \n            rotate(' + this.rotateAngle + ' ' + this.lineLength + ' 0)',
	                visibility: this.visibility
	            });
	            this._criticalAngleRayNode = this.svg.paper.line().attr({
	                x1: 0,
	                y1: 0,
	                x2: this.lineLength,
	                y2: 0,
	                opacity: this.opacity,
	                stroke: this.lineColor,
	                strokeWidth: this.lineWidth,
	                strokeDasharray: '10,5'
	            });
	            this._criticalAngleRayGroupNode.add(this._criticalAngleRayNode);
	
	            return this;
	        }
	    }, {
	        key: 'show',
	        value: function show(isShow) {
	            this.visibility = isShow ? 'visible' : 'hidden';
	            this._criticalAngleRayGroupNode.attr({
	                visibility: this.visibility
	            });
	        }
	    }, {
	        key: '_clacRotateAngle',
	        value: function _clacRotateAngle() {
	            if (this.rotateAngle > 0 && this.rotateAngle <= 90) {
	                this.rotateAngle = 90 - this.criticalAngle;
	            } else if (this.rotateAngle > 90 && this.rotateAngle <= 180) {
	                this.rotateAngle = 90 + this.criticalAngle;
	            } else if (this.rotateAngle > 180 && this.rotateAngle <= 270) {
	                this.rotateAngle = 270 - this.criticalAngle;
	            } else {
	                this.rotateAngle = 270 + this.criticalAngle;
	            }
	            return this.rotateAngle;
	        }
	    }, {
	        key: 'criticalAngleRayGroupNode',
	        get: function get() {
	            return this._criticalAngleRayGroupNode;
	        },
	        set: function set(value) {
	            this._criticalAngleRayGroupNode = value;
	        }
	    }, {
	        key: 'criticalAngleRayNode',
	        get: function get() {
	            return this._criticalAngleRayNode;
	        },
	        set: function set(value) {
	            this._criticalAngleRayNode = value;
	        }
	    }]);
	
	    return CriticalAngleRay;
	}(_BaseView3.default);
	
	exports.default = CriticalAngleRay;

/***/ }
/******/ ]);
//# sourceMappingURL=Optics.js.map