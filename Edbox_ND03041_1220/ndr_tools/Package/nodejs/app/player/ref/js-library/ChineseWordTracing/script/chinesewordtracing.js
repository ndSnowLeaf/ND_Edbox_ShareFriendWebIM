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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Administrator on 2016/12/15.
 * 在描红中用到的一些const值
 */

exports.default = {
    MODE: {
        DISPLAY: 'display',
        DRAW: 'draw'
    },
    RESET: {
        ALL: 'all',
        BACK: 'back',
        FORE: 'fore'
    },
    REDAW_TYPE: {
        NORMAL: 'normal',
        RADICAL: 'radical',
        STRUCTURE: 'structure'
    },
    SPEED: {
        FAST: 10,
        NORMAL: 2.5,
        SLOW: 1.5
    },
    //auto:自动描红 step:分步描红
    TRACE_TYPE: {
        AUTO: "auto",
        STEP: "step"
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Administrator on 2016/12/15.
 * 描红中用到的点工具类
 */

var Point = function () {
    function Point(x, y) {
        _classCallCheck(this, Point);

        this.x = typeof x == 'string' ? parseInt(x) : x;
        this.y = typeof y == 'string' ? parseInt(y) : y;
    }

    _createClass(Point, [{
        key: 'getDistance',
        value: function getDistance(p) {
            return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
        }
    }]);

    return Point;
}();

exports.default = Point;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Administrator on 2016/12/15.
 * 描红中用到的默认配置
 */
exports.default = {
    showGuide: true, //是否引导
    wordColor: 'rgb(248,205,198)', //背景字颜色
    dashLineColor: 'rgb(248,205,198)', //引导虚线的颜色
    displayColor: 'rgb(136,136,136)', //展示态的背景字颜色
    guideColor: 'rgb(33,166,233)', //引导颜色
    strokeColor: 'rgb(222,73,30)',
    animateColor: 'rgb(247,63,52)',
    lineWidth: 10.9,
    lineCap: 'round',
    lineJoin: 'round',
    isWrongStep: false,
    fillRate: 0.8,
    centerRate1: 0,
    centerRate2: 0,
    //校验值
    validateRange: {
        standardSize: 500, //标准的坐标系大小，生字资源坐标均为在500x500的坐标系下的位置
        hLimit: 29, //允许的起始点范围
        tLimit: 25, //允许的结束点范围
        cLimit: 7,
        minCount: 5 //书写笔画中至少要有5个点
    }
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _chinesewordtracing = __webpack_require__(5);

var _chinesewordtracing2 = _interopRequireDefault(_chinesewordtracing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (global, factory) {

    factory(global);
})(typeof window === 'undefined' ? undefined : window, function (window) {

    window.ChineseWordTracing = _chinesewordtracing2.default;
}); /**
     * Created by Administrator on 2016/12/14.
     */

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _line = __webpack_require__(6);

var _line2 = _interopRequireDefault(_line);

var _point = __webpack_require__(1);

var _point2 = _interopRequireDefault(_point);

var _mathUtil = __webpack_require__(7);

var _mathUtil2 = _interopRequireDefault(_mathUtil);

var _constName = __webpack_require__(0);

var _constName2 = _interopRequireDefault(_constName);

var _default = __webpack_require__(2);

var _default2 = _interopRequireDefault(_default);

var _instancePropety = __webpack_require__(8);

var _instancePropety2 = _interopRequireDefault(_instancePropety);

var _publicMethod = __webpack_require__(9);

var _publicMethod2 = _interopRequireDefault(_publicMethod);

var _jQuery = __webpack_require__(3);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(10);

/**
 * 汉字描写类
 */

var ChineseWordTracing = function () {
    function ChineseWordTracing(param) {
        _classCallCheck(this, ChineseWordTracing);

        //展示态
        this.isDisplayMode = param.mode === _constName2.default.MODE.DISPLAY;
        //作答态
        this.isDrawMode = !this.isDisplayMode;

        this.param = {
            mode: param.mode,
            word: param.word,
            renderTo: param.renderTo,
            height: (0, _jQuery2.default)(param.renderTo).height(),
            width: (0, _jQuery2.default)(param.renderTo).width(),
            back_canvas: null,
            fore_canvas: null,
            config: _typeof(param.config) === 'object' ? param.config : {}
        };

        //生成canvas
        this.createCanvas();

        //初始化
        this.init();

        //返回对外暴露的接口
        return _publicMethod2.default.call(this);
    }

    _createClass(ChineseWordTracing, [{
        key: "init",
        value: function init() {
            //当前实例所需要的一系列数据
            this.currentWord = (0, _instancePropety2.default)(this.param);

            var currentWord = this.currentWord;

            //转换坐标
            currentWord.transformedWord = this.coordinateTransform(currentWord.word, currentWord.width, currentWord.height);
            //转换笔画
            this.convertWord();

            //初始化画板
            this.initCanvasBoards();
        }
    }, {
        key: "createCanvas",
        value: function createCanvas() {
            var param = this.param;

            //创建canvas前先把需要渲染canvas的dom结构清空以及解绑canvas的click事件
            (0, _jQuery2.default)(param.renderTo).find('.canvas_back').off('click');
            (0, _jQuery2.default)(param.renderTo).empty();

            param.back_canvas = document.createElement('canvas');
            param.back_canvas.setAttribute('width', param.width);
            param.back_canvas.setAttribute('height', param.height);
            param.back_canvas.className = 'canvas_normal canvas_back';

            param.renderTo.appendChild(param.back_canvas);
            //如果是作答态
            if (this.isDrawMode) {
                param.fore_canvas = document.createElement('canvas');
                param.fore_canvas.setAttribute('width', param.width);
                param.fore_canvas.setAttribute('height', param.height);
                param.fore_canvas.className = 'canvas_normal canvas_fore';

                param.renderTo.appendChild(param.fore_canvas);
            }
        }

        //初始化canvas画板

    }, {
        key: "initCanvasBoards",
        value: function initCanvasBoards() {

            //先做一次事件解绑
            //初始化背景层
            this.initBackBoard();

            //如果是作答态
            if (this.isDrawMode) {
                //初始化前景层
                this.initForeBoard();
                //事件绑定
                this.eventBind();
            }
        }

        //重置画板

    }, {
        key: "resetCanvasBoards",
        value: function resetCanvasBoards() {
            //初始化背景层
            this.initBackBoard();

            //如果是作答态
            if (this.isDrawMode) {
                this.currentWord.allowDraw = true;
                this.currentWord.validateStep = 0;
                //初始化前景层
                this.initForeBoard();
            }

            this.currentWord.currentStep = 0;
            this.currentWord.currentStroke = 0;
        }

        //初始化背景层

    }, {
        key: "initBackBoard",
        value: function initBackBoard(type) {
            console.debug('初始化背景字：', new Date());
            var currentWord = this.currentWord,
                steps = currentWord.convertedWord.steps,
                context = currentWord.back_context,
                radicalInfo = currentWord.radicalInfo,
                structureInfo = currentWord.structureInfo,
                i,
                j,
                k,
                iLen,
                jLen,
                kLen;

            context.restore();
            currentWord.back_imageData = null;
            context.clearRect(0, 0, currentWord.width, currentWord.height);

            context.lineWidth = 3;
            for (i = 0, iLen = steps.length; i < iLen; i++) {
                context.fillStyle = this.isDrawMode ? currentWord.config.wordColor : currentWord.config.displayColor;
                //根据type来显示特定笔画的颜色
                //显示部首
                if (type && type === _constName2.default.REDAW_TYPE.RADICAL) {
                    if (radicalInfo.stepIndex && radicalInfo.stepIndex.indexOf(i) > -1) {
                        context.fillStyle = radicalInfo.color;
                    }
                }

                //显示结构
                if (type && type === _constName2.default.REDAW_TYPE.STRUCTURE) {
                    for (k = 0, kLen = structureInfo.length; k < kLen; k++) {
                        if (structureInfo[k].stepIndex.indexOf(i) > -1) {
                            context.fillStyle = structureInfo[k].color;
                            break;
                        }
                    }
                }

                var points = steps[i].points;
                context.beginPath();
                for (j = 0, jLen = points.length; j < jLen; j++) {
                    var point = points[j];
                    context.lineTo(point.x, point.y);
                }
                context.closePath();
                context.fill();

                //console.log('绘制背景字：', new Date());
            }

            //绘制中线
            if (this.isDrawMode && this.currentWord.showCenterLine) {
                this.drawCenterLine(context, currentWord.convertedWord.strokes);
            }

            currentWord.back_imageData = context.getImageData(0, 0, currentWord.width, currentWord.height);
        }

        /**
         * 绘制中线 绘制所有笔画的中线（实线）
         * @param context canvas绘图上下文对象
         * @param centers 中线坐标点
         */

    }, {
        key: "drawCenterLine",
        value: function drawCenterLine(context, strokes) {
            context.lineWidth = 5;
            context.strokeStyle = 'rgb(0,0,0)';

            strokes.forEach(function (stroke, strokeIndex, strokeArray) {
                context.beginPath();

                //绘制中线
                stroke.centers.forEach(function (center, centerIndex, centerArray) {
                    if (centerIndex === 0) {
                        context.moveTo(center.x, center.y);
                    }

                    context.lineTo(center.x, center.y);
                });

                context.stroke();
            });
        }

        //绘制起点和终点
        //绘制当前引导笔画的中线（虚线）

    }, {
        key: "drawCurStepCenterLine",
        value: function drawCurStepCenterLine(context, points) {
            var c = context;

            c.save();
            c.beginPath();
            c.strokeStyle = this.currentWord.config.dashLineColor;

            //步长为4，outLen 为需要循环绘制的次数
            var pointsLen = points.length;
            var outerLen = Math.floor(pointsLen / 4);
            //最后的几个点，即少于4个的点
            var lastPoints = pointsLen % 4;

            for (var i = 0; i < outerLen; i++) {
                var startIndex = i * 4;

                c.moveTo(points[startIndex].x, points[startIndex].y);
                c.lineTo(points[startIndex + 1].x, points[startIndex + 1].y);
                c.lineTo(points[startIndex + 2].x, points[startIndex + 2].y);
            }

            if (lastPoints) {
                startIndex = outerLen * 4;
                c.moveTo(points[startIndex].x, points[startIndex].y);
                c.lineTo(points[pointsLen - 1].x, points[pointsLen - 1].y);
            }

            c.closePath();
            c.stroke();

            c.restore();
        }

        //开启或关闭

    }, {
        key: "showCanvasGuide",
        value: function showCanvasGuide(show) {
            if (this.isDisplayMode) return;

            this.currentWord.showGuide = !!show;
            this.nextStep();
        }

        //初始化前景层

    }, {
        key: "initForeBoard",
        value: function initForeBoard() {
            if (this.isDisplayMode) return;

            var currentWord = this.currentWord,
                context = currentWord.fore_context;

            context.restore();
            currentWord.fore_imageData = null;
            context.clearRect(0, 0, currentWord.width, currentWord.height);
            context.save();

            this.nextStep();
        }

        //绘制一条线，board 画板，points 坐标点[{x:10,y:10},{..}]

    }, {
        key: "drawLine",
        value: function drawLine(board, points) {
            var len = points.length;

            board.beginPath();
            board.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < len; i++) {
                board.lineTo(points[i].x, points[i].y);
            }
            board.stroke();
        }

        //事件绑定

    }, {
        key: "eventBind",
        value: function eventBind() {
            if (this.isDisplayMode) return;

            var fore_canvas = this.currentWord.fore_canvas;

            (0, _jQuery2.default)(fore_canvas).on('mousedown touchstart', this.startEvent.bind(this));
            (0, _jQuery2.default)(fore_canvas).on('mousemove touchmove', this.moveEvent.bind(this));
            (0, _jQuery2.default)(fore_canvas).on('mouseup touchend mouseleave touchleave touchcancel', this.endEvent.bind(this));
        }

        //开始描绘

    }, {
        key: "startEvent",
        value: function startEvent(e) {
            if (!this.currentWord.allowDraw) return;

            this.currentWord.hasDrawed = true;

            var currentWord = this.currentWord,
                context = currentWord.fore_context,
                config = currentWord.config,
                p,
                p1;

            p1 = _mathUtil2.default.getPosition(e.originalEvent);

            p = _mathUtil2.default.windowToCanvas(context.canvas, p1.x, p1.y);

            currentWord.isMouseDown = true;

            //设置画笔属性
            context.lineWidth = config.lineWidth;
            context.strokeStyle = config.strokeColor;
            context.lineCap = config.lineCap;
            context.lineJoin = config.lineJoin;

            context.beginPath();
            context.lineTo(p.x, p.y);

            this.pushPoints(p.x, p.y);
        }

        //滑动过程

    }, {
        key: "moveEvent",
        value: function moveEvent(e) {

            if (!this.currentWord.isMouseDown || !this.currentWord.allowDraw) return;

            var currentWord = this.currentWord,
                context = currentWord.fore_context,
                p,
                p1;

            p1 = _mathUtil2.default.getPosition(e.originalEvent);

            p = _mathUtil2.default.windowToCanvas(context.canvas, p1.x, p1.y);

            context.lineTo(p.x, p.y);
            context.stroke();
            this.pushPoints(p.x, p.y);
        }

        //描绘结束

    }, {
        key: "endEvent",
        value: function endEvent(e) {
            if (!this.currentWord.isMouseDown) return;

            this.currentWord.isMouseDown = false;

            if (!this.currentWord.allowDraw) return;

            var currentWord = this.currentWord,
                context = currentWord.fore_context;

            context.closePath();

            if (this.validate()) {
                currentWord.isWrongStep = false;
                currentWord.validateStep++;

                this.initBackBoard();

                if (currentWord.validateStep == 1) {
                    context.clearRect(0, 0, currentWord.width, currentWord.height);
                    //重绘当前笔画
                    this.drawLine(context, currentWord.points);
                } else {
                    //清空画布
                    context.clearRect(0, 0, currentWord.width, currentWord.height);
                    context.putImageData(currentWord.fore_imageData, 0, 0);
                    //重绘当前笔画
                    this.drawLine(context, currentWord.points);
                }

                //重绘后的数据放入fore_imageData
                currentWord.fore_imageData = context.getImageData(0, 0, currentWord.width, currentWord.height);
                //checkImageData(currentWord.fore_imageData);

                if (currentWord.validateStep >= currentWord.convertedWord.strokes.length) {
                    currentWord.allowDraw = false;
                    return;
                }
                this.nextStep();
            } else {
                //c.fillRect(0, 0, currentWord.width, currentWord.height);
                currentWord.isWrongStep = true;
                //c.restore();
                context.clearRect(0, 0, currentWord.width, currentWord.height);
                if (currentWord.fore_imageData) {
                    context.putImageData(currentWord.fore_imageData, 0, 0);
                }

                //如果是关闭引导状态，笔画写错
                if (!currentWord.showGuide) {
                    this.nextStep(currentWord.isWrongStep);
                } else {
                    this.nextStep(!currentWord.isWrongStep);
                }
            }
        }
    }, {
        key: "nextStep",
        value: function nextStep(isWrong) {
            var currentWord = this.currentWord;

            //每次进入都要把闪烁动画的计时器清空
            clearInterval(currentWord.flickerTimer);

            if (currentWord.validateStep >= currentWord.convertedWord.strokes.length) {
                return;
            }

            var c = currentWord.back_context,
                points,
                point,
                validateStep = currentWord.validateStep,
                strokes = currentWord.convertedWord.strokes,
                segments = strokes[validateStep].segments,
                flickerTimes = 0;

            currentWord.lastPoint = null;
            currentWord.points = [];

            c.restore();

            if (currentWord.showGuide || isWrong) {
                c.save();

                c.fillStyle = currentWord.config.guideColor;
                c.strokeStyle = currentWord.config.guideColor;
                c.beginPath();

                for (var i = 0, iLength = segments.length; i < iLength; i++) {
                    points = segments[i].points;
                    for (var j = 0; j < points.length; j++) {
                        point = points[j];
                        if (j == 0) c.moveTo(point.x, point.y);
                        c.lineTo(point.x, point.y);
                    }
                }

                c.closePath();
                c.fill();
                c.clip();

                //绘制引导线
                this.drawCurStepCenterLine(c, strokes[validateStep].centers);
                //如果是关闭引导状态下，书写错误，则闪烁显示正确笔画
                if (!currentWord.showGuide && isWrong) {
                    currentWord.flickerTimer = setInterval(function () {

                        if (flickerTimes++ % 2 === 0) {
                            c.strokeStyle = currentWord.config.dashLineColor;
                        } else {
                            c.strokeStyle = currentWord.config.guideColor;
                        }

                        c.stroke();

                        if (flickerTimes >= currentWord.flickerTimes) {
                            flickerTimes = 0;
                            clearInterval(currentWord.flickerTimer);
                            c.clearRect(0, 0, currentWord.width, currentWord.height);
                            c.putImageData(currentWord.back_imageData, 0, 0);
                        }
                    }, currentWord.flickerInterval);
                }
            } else {
                c.clearRect(0, 0, currentWord.width, currentWord.height);
                c.putImageData(currentWord.back_imageData, 0, 0);
            }
        }

        //校验

    }, {
        key: "validate",
        value: function validate() {
            //当前需要判断的笔划
            var currentWord = this.currentWord,
                config = currentWord.config,
                validateRange = config.validateRange,
                stroke = currentWord.convertedWord.strokes[currentWord.validateStep],

            //笔划边框坐标
            framePoints = stroke.segments,

            //中心线
            centers = stroke.centers,

            //手写的坐标点
            points = currentWord.points,
                pointsLen = currentWord.points.length,
                centersLen = centers.length,

            //相似点的个数
            similarCount1 = 0,
                similarCount2 = 0,

            //在笔划区域内点的个数
            insideCount = 0,

            //点相似度
            centerRate1 = 0,
                centerRate2 = 0,

            //填充率
            fillRate = 0,
                first = 0,
                last = 0,
                //头坐标距离，尾坐标距离
            p2pDis1 = 0,
                p2pDis2 = 0;

            first = _mathUtil2.default.pointToPoint(centers[0], points[0]);
            last = _mathUtil2.default.pointToPoint(centers[centersLen - 1], points[pointsLen - 1]);

            //首尾点的比对
            if (first > validateRange.hLimit || last > validateRange.tLimit) {
                return false;
            }

            for (var i = 0; i < pointsLen; i++) {
                //判断点是否在笔画内
                if (_mathUtil2.default.isPointInPoly(points[i], framePoints)) {
                    insideCount++;
                }
            }

            fillRate = insideCount / pointsLen;

            if (fillRate < config.fillRate || pointsLen < validateRange.minCount) {
                return false;
            }

            return true;
        }

        //将书写的坐标点存入points

    }, {
        key: "pushPoints",
        value: function pushPoints(x, y) {
            var currentWord = this.currentWord,
                lastPoint = currentWord.lastPoint,
                points = currentWord.points;

            if (!lastPoint || lastPoint.getDistance({ "x": x, "y": y }) >= 2) {
                lastPoint = new _point2.default(x, y);
                points.push(lastPoint);
            }
        }

        //笔画转换，转换为可用的笔画

    }, {
        key: "convertWord",
        value: function convertWord() {
            var currentWord = this.currentWord,
                transformedWord = _jQuery2.default.extend({}, currentWord.transformedWord),
                strokes = transformedWord.strokes,
                strokeInfo = transformedWord.strokeInfo,
                radicalStepindex = [],
                structureStepIndex = [],
                color,
                structureInfo,
                info,
                temp,
                i,
                j,
                k,
                m,
                len,
                iLen,
                jLen,
                kLen,
                mLen;

            //部首信息
            currentWord.radicalInfo = {
                stepIndex: [],
                color: ''
            };
            //结构信息
            currentWord.structureInfo = [];

            //转换部首信息
            if (strokeInfo && strokeInfo.radicalInfo && strokeInfo.radicalInfo.oriColor && strokeInfo.radicalInfo.oriColor.length == 3) {

                color = strokeInfo.radicalInfo.oriColor;

                currentWord.radicalInfo.color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
                radicalStepindex = strokeInfo.radicalInfo.strokeIndex.split(',').map(function (value) {
                    return parseInt(value);
                });
            }

            if (strokeInfo && strokeInfo.structureInfos && strokeInfo.structureInfos.length > 0) {
                temp = [];
                for (i = 0, len = strokeInfo.structureInfos.length; i < len; i++) {

                    structureInfo = strokeInfo.structureInfos[i];
                    info = {
                        color: '',
                        stepIndex: []
                    };

                    color = structureInfo.oriColor;

                    info.color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";

                    temp = structureInfo.strokeIndex.split(',').map(function (value) {
                        return parseInt(value);
                    });

                    structureStepIndex[i] = temp;

                    currentWord.structureInfo.push(info);
                }
            }

            //笔画转换
            transformedWord.steps = [];

            for (i = 0, iLen = strokes.length; i < iLen; i++) {
                var centers = strokes[i].centers,
                    segments = strokes[i].segments;

                currentWord.strokesMap[i] = [];

                for (j = 0, jLen = centers.length; j < jLen; j++) {
                    centers[j] = new _point2.default(centers[j].x, centers[j].y);
                }
                for (j = 0, jLen = segments.length; j < jLen; j++) {
                    segments[j].start = new _point2.default(segments[j].start.x, segments[j].start.y);
                    segments[j].end = new _point2.default(segments[j].end.x, segments[j].end.y);
                    var points = segments[j].points;
                    for (k = 0, kLen = points.length; k < kLen; k++) {
                        points[k] = new _point2.default(points[k].x, points[k].y);
                    }

                    //因为转换的笔画与元数据中笔画要多，故这样操作一次保证，部首和结构中有一只的笔画数字
                    if (radicalStepindex.indexOf(i) > -1) {
                        currentWord.radicalInfo.stepIndex.push(transformedWord.steps.length);
                    }

                    for (m = 0, mLen = structureStepIndex.length; m < mLen; m++) {
                        if (structureStepIndex[m].indexOf(i) > -1) {
                            currentWord.structureInfo[m].stepIndex.push(transformedWord.steps.length);
                            break;
                        }
                    }

                    currentWord.strokesMap[i].push(transformedWord.steps.length);

                    transformedWord.steps.push({
                        "line": new _line2.default(segments[j].start, segments[j].end),
                        "points": points
                    });
                }
            }

            currentWord.convertedWord = transformedWord;
            currentWord.strokesLength = transformedWord.strokes.length;
            currentWord.autoTraceSteps = transformedWord.steps.length;
        }

        //动画相关,开始动画

    }, {
        key: "startAnimation",
        value: function startAnimation(type) {
            var currentWord = this.currentWord;

            currentWord.$autoAnimateDeferred = _jQuery2.default.Deferred();

            currentWord.traceType = type;
            this.initBackBoard();
            currentWord.currentStep = 0; //每次开始描红需要将currentStep置为0


            if (type == _constName2.default.TRACE_TYPE.AUTO) {
                //开始自动描红
                this.draw();
            } else {
                //分步描红设置速度为normal
                this.setSpeed();
            }

            return currentWord.$autoAnimateDeferred.promise();
        }

        //停止描红

    }, {
        key: "stopAnimation",
        value: function stopAnimation() {
            cancelAnimationFrame(this.currentWord.loop);
            this.currentWord.loop = 0;
            this.currentWord.$animateDeferred = null;
            //this.currentWord.back_context.restore();
            this.initBackBoard();
        }

        //是否在自动描红

    }, {
        key: "isInAnimation",
        value: function isInAnimation() {
            return this.currentWord.loop === 0 ? false : true;
        }

        //设置速度

    }, {
        key: "setSpeed",
        value: function setSpeed(speed) {
            var animateSpeed;

            switch (speed) {
                case 'fast':
                    animateSpeed = _constName2.default.SPEED.FAST;
                    break;
                case 'slow':
                    animateSpeed = _constName2.default.SPEED.SLOW;
                    break;
                default:
                    animateSpeed = _constName2.default.SPEED.NORMAL;
            }

            this.currentWord.speed = animateSpeed;
        }

        //开始动画

    }, {
        key: "draw",
        value: function draw() {

            var currentWord = this.currentWord,
                currentStroke = currentWord.currentStroke,
                context = currentWord.back_context,
                config = currentWord.config;

            //分步描红的时候，用延迟对象通知描红结束
            this.currentWord.$stepAnimateDeferred = _jQuery2.default.Deferred();

            var $deferred = this.currentWord.$stepAnimateDeferred;

            var returnInfo = {
                currentStep: currentStroke,
                totalStep: currentWord.strokesLength
            };

            if (currentStroke >= currentWord.strokesLength) {
                currentWord.loop = 0;

                $deferred.resolve(returnInfo);
                currentWord.$autoAnimateDeferred.resolve(returnInfo);

                return $deferred.promise();
            }

            //设置动画填充颜色
            context.fillStyle = currentWord.config.animateColor;
            context.lineCap = config.lineCap;
            context.lineJoin = config.lineJoin;

            this.animateByStroke();

            return $deferred.promise();
        }

        //按笔画来描红，steps是stroke的子集

    }, {
        key: "animateByStroke",
        value: function animateByStroke() {
            var currentStroke = this.currentWord.currentStroke;
            var steps = this.currentWord.strokesMap[currentStroke];

            if (!Array.isArray(steps)) {
                throw new Error("stroke does not exist.");
            }

            this.animateBySteps();
        }

        //单个笔画拆分为几个step

    }, {
        key: "animateBySteps",
        value: function animateBySteps() {
            var currentWord = this.currentWord;
            var steps = currentWord.strokesMap[currentWord.currentStroke];
            var currentStep = steps[currentWord.currentStep];
            var len = steps.length;

            if (currentWord.currentStep >= len) {
                //如果当前stroke已经绘制完成
                currentWord.currentStep = 0;
                currentWord.currentStroke++;

                //描绘下一笔
                if (currentWord.traceType == _constName2.default.TRACE_TYPE.AUTO) {

                    this.draw();
                } else {
                    //分步描红，绘制完一笔，resolve 延迟对象
                    currentWord.$stepAnimateDeferred.resolve({
                        currentStep: currentWord.currentStroke,
                        totalStep: currentWord.strokesLength
                    });
                }
            } else {

                var step = currentWord.convertedWord.steps[currentStep];
                //分割出动画区域
                currentWord.back_context.save();
                this.setClipPath(currentWord.back_context, step.points);
                this.animate(currentWord, step);
            }
        }

        //开始动画

    }, {
        key: "animate",
        value: function animate(currentWord, step) {
            var interval = 0,
                maxValue = step.line.getLength();

            function animateInner() {
                interval += currentWord.speed;

                if (interval >= maxValue) interval = maxValue;

                this.drawAnimationFrame(currentWord.back_context, step, interval);

                if (interval == maxValue) {
                    cancelAnimationFrame(currentWord.loop);
                    ++currentWord.currentStep;
                    currentWord.back_context.restore();

                    this.animateBySteps();
                    return;
                }
                currentWord.loop = requestAnimationFrame(animateInner.bind(this));
            }

            currentWord.loop = requestAnimationFrame(animateInner.bind(this));
        }

        //绘制要展示动画的区域,即绘制currentStep

    }, {
        key: "setClipPath",
        value: function setClipPath(context, currentStepPoints) {
            var point;

            context.beginPath();
            for (var i = 0, len = currentStepPoints.length; i < len; i++) {
                point = currentStepPoints[i];
                context.lineTo(point.x, point.y);
            }
            context.closePath();
            context.clip();
        }

        //animation frame

    }, {
        key: "drawAnimationFrame",
        value: function drawAnimationFrame(context, step, interval) {
            var point,
                rectAry = step.line.getRectangle(500, interval);

            context.beginPath();
            for (var i = 0, len = rectAry.length; i < len; i++) {
                point = rectAry[i];
                context.lineTo(point.x, point.y);
            }
            context.closePath();
            context.fill();
        }

        //单步描红时，上一笔操作，实际就是撤销

    }, {
        key: "preStep",
        value: function preStep() {

            var currentWord = this.currentWord;
            var currentStroke = currentWord.currentStroke;

            var stepsInfo = {
                currentStep: currentStroke,
                totalStep: currentWord.strokesLength
            };

            //初始化一遍背景字
            this.initBackBoard();

            var context = currentWord.back_context;
            var currentStroke = --currentWord.currentStroke;

            if (this.currentWord.traceType != _constName2.default.TRACE_TYPE.STEP || currentStroke <= 0) {
                currentWord.currentStroke = 0;
                stepsInfo.currentStep = 0;
                return stepsInfo;
            }

            var mapIndex = this.currentWord.strokesMap[currentStroke - 1];
            var maxStep = mapIndex[mapIndex.length - 1];

            var steps = currentWord.convertedWord.steps;

            context.fillStyle = currentWord.config.animateColor;

            for (var i = 0; i <= maxStep; i++) {

                var points = steps[i].points;

                context.beginPath();

                for (var j = 0, jLen = points.length; j < jLen; j++) {
                    var point = points[j];
                    context.lineTo(point.x, point.y);
                }

                context.closePath();
                context.fill();
            }

            stepsInfo.currentStep = currentStroke;

            return stepsInfo;
        }

        //绘制特定笔画

    }, {
        key: "drawSingleStroke",
        value: function drawSingleStroke(context, step) {
            var points = step.points;
            context.beginPath();
            for (var i = 0, iLen = points.length; i < iLen; i++) {
                var point = points[i];
                context.lineTo(point.x, point.y);
            }
            context.closePath();
            context.fill();
        }

        //坐标等比转换为适合当前canvas的大小

    }, {
        key: "coordinateTransform",
        value: function coordinateTransform(originalWord, canvasWidth, canvasHeight) {
            var newWord = _jQuery2.default.extend({}, originalWord),
                originalSize = newWord.size,
                scaleX = canvasWidth / originalSize,
                scaleY = canvasHeight / originalSize;

            if (originalSize === canvasWidth) {
                return newWord;
            }

            newWord.size = canvasWidth;

            for (var i = 0; i < newWord.strokes.length; i++) {
                for (var j = 0; j < newWord.strokes[i].centers.length; j++) {
                    newWord.strokes[i].centers[j].x = newWord.strokes[i].centers[j].x * scaleX;
                    newWord.strokes[i].centers[j].y = newWord.strokes[i].centers[j].y * scaleY;
                }

                for (var k = 0; k < newWord.strokes[i].segments.length; k++) {
                    newWord.strokes[i].segments[k].start.x = newWord.strokes[i].segments[k].start.x * scaleX;
                    newWord.strokes[i].segments[k].start.y = newWord.strokes[i].segments[k].start.y * scaleY;

                    newWord.strokes[i].segments[k].end.x = newWord.strokes[i].segments[k].end.x * scaleX;
                    newWord.strokes[i].segments[k].end.y = newWord.strokes[i].segments[k].end.y * scaleY;

                    for (var l = 0; l < newWord.strokes[i].segments[k].points.length; l++) {
                        newWord.strokes[i].segments[k].points[l].x = newWord.strokes[i].segments[k].points[l].x * scaleX;
                        newWord.strokes[i].segments[k].points[l].y = newWord.strokes[i].segments[k].points[l].y * scaleY;
                    }
                }
            }

            return newWord;
        }

        //坐标转换之后，对应的起终点判断范围也要等比变化

    }, {
        key: "scaleValidateRange",
        value: function scaleValidateRange() {
            //当前生字使用的坐标系大小 size * size
            var size = this.currentWord.transformedWord.size;
            var validateRange = this.currentWord.config.validateRange;
            //计算当前size对标准size的倍率
            var scale = size / validateRange.standardSize;

            //乘上倍率，得到当前size下适合的检验范围
            validateRange.hLimit *= scale;
            validateRange.tLimit *= scale;
        }

        //输出前景层base64,png

    }, {
        key: "getBase64Image",
        value: function getBase64Image() {
            if (this.isDisplayMode) return;

            var base64Image = this.currentWord.fore_canvas.toDataURL().replace('data:image/png;base64,', '');

            //console.log(base64Image);
            return [{ key: 'traceData', value: base64Image }];
        }
    }]);

    return ChineseWordTracing;
}();

exports.default = ChineseWordTracing;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Administrator on 2016/12/15.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 描红中用到的线工具类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _point = __webpack_require__(1);

var _point2 = _interopRequireDefault(_point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = function () {
    function Line() {
        _classCallCheck(this, Line);

        if (arguments.length == 2) {
            var p1 = arguments[0],
                p2 = arguments[1];
            this.a = p1.y - p2.y;
            this.b = p2.x - p1.x;
            this.c = p1.x * p2.y - p2.x * p1.y;
            this.p1 = p1;
            this.p2 = p2;
        } else if (arguments.length == 3) {
            this.a = arguments[0];
            this.b = arguments[1];
            this.c = arguments[2];
            this.p1 = null;
            this.p2 = null;
        }
    }

    _createClass(Line, [{
        key: "getK",
        value: function getK() {
            return -this.a / this.b;
        }
    }, {
        key: "getX",
        value: function getX(y) {
            return (-this.c - this.b * y) / this.a;
        }
    }, {
        key: "getY",
        value: function getY(x) {
            return (-this.c - this.a * x) / this.b;
        }
    }, {
        key: "getLength",
        value: function getLength() {
            return this.p1.getDistance(this.p2);
        }
    }, {
        key: "getDistance",
        value: function getDistance(p) {
            return Math.abs(this.a * p.x + this.b * p.y + this.c) / Math.sqrt(this.a * this.a + this.b * this.b);
        }
    }, {
        key: "getRectangle",
        value: function getRectangle(width, distance) {
            var startVLine = this.getVertical(this.p1);
            var endFootPoint = this.getPoint(this.p1, this.p2, distance);
            var endVLine = this.getVertical(endFootPoint);
            var startPoints = startVLine.getPoints(this.p1, width / 2);
            var endPoints = endVLine.getPoints(endFootPoint, width / 2);

            return [startPoints[0], startPoints[1], endPoints[1], endPoints[0]];
        }
    }, {
        key: "getVertical",
        value: function getVertical(p) {
            var c = -this.b * p.x + this.a * p.y;
            return new Line(this.b, -this.a, c);
        }
    }, {
        key: "getPoint",
        value: function getPoint(start, director, distance) {
            var ps = this.getPoints(start, distance);
            var d1 = director.getDistance(ps[0]);
            var d2 = director.getDistance(ps[1]);
            if (d1 < d2) return ps[0];
            return ps[1];
        }
    }, {
        key: "getPoints",
        value: function getPoints(p, distance) {
            if (Math.round(this.b) == 0) return [new _point2.default(p.x, p.y - distance), new _point2.default(p.x, p.y + distance)];
            var x = Math.sqrt(distance * distance / (1 + this.getK() * this.getK()));
            return [new _point2.default(p.x + x, this.getY(p.x + x)), new _point2.default(p.x - x, this.getY(p.x - x))];
        }
    }]);

    return Line;
}();

exports.default = Line;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Administrator on 2016/12/15.
 */

exports.default = {
    //点到点的距离
    pointToPoint: function pointToPoint(p1, p2) {
        var d = 0;
        try {
            d = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        } catch (e) {
            console.log(e);
        }

        return d;
    },


    //判断一个点是否在一个多边形内
    isPointInPoly: function isPointInPoly(point, polyArray) {
        for (var p = 0, paLen = polyArray.length; p < paLen; p++) {
            var poly = polyArray[p].points;
            var length = poly.length;
            for (var c = false, i = -1, j = length - 1; ++i < length; j = i) {
                (poly[i].y <= point.y && point.y < poly[j].y || poly[j].y <= point.y && point.y < poly[i].y) && point.x < (poly[j].x - poly[i].x) * (point.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x && (c = !c);
            }
            if (c) return c;
        }

        return c;
    },

    //窗口到canvas坐标转换
    windowToCanvas: function windowToCanvas(canvas, x, y) {
        var bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
    },


    //mouse event和 touch event时的坐标获取
    getPosition: function getPosition(event) {

        var x = 0,
            y = 0;

        switch (event.type) {
            case "mousedown":
            case "mousemove":
            case "mouseup":
                //x = event.pageX;
                //y = event.pageY;
                //兼容生字卡描红坐标值在不同分辨率转换后出现小数点的情况
                x = event.coordinate && event.coordinate.x ? event.coordinate.x : event.pageX;
                y = event.coordinate && event.coordinate.y ? event.coordinate.y : event.pageY;
                break;
            case "touchstart":
            case "touchmove":
            case "touchend":
                x = event.changedTouches[0].pageX;
                y = event.changedTouches[0].pageY;
                break;
        }

        return { x: x, y: y };
    }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _constName = __webpack_require__(0);

var _constName2 = _interopRequireDefault(_constName);

var _default = __webpack_require__(2);

var _default2 = _interopRequireDefault(_default);

var _jQuery = __webpack_require__(3);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (param) {
	return {
		word: param.word, //原始word
		transformedWord: {}, //转换过坐标的word
		convertedWord: {}, //转换过笔画的word
		strokesLength: 0,
		autoTraceSteps: 0,
		config: _jQuery2.default.extend({}, _default2.default, param.config),
		back_canvas: param.back_canvas,
		fore_canvas: param.fore_canvas,
		back_context: param.back_canvas.getContext('2d'),
		fore_context: param.mode === _constName2.default.MODE.DRAW ? param.fore_canvas.getContext('2d') : null,
		back_imageData: null,
		fore_imageData: null,
		currentStroke: 0, //当前笔画
		currentStep: 0,
		lastPoint: null,
		points: [],
		hasDrawed: false,
		startDraw: false,
		width: param.width,
		height: param.height,
		allowDraw: true,
		showGuide: true,
		isMouseDown: false,
		validateStep: 0,
		isWrongStep: false,
		flickerTimer: null, //错误笔画后闪烁定时器
		flickerInterval: 250, //闪烁间隔，毫秒
		flickerTimes: 6, //闪烁次数
		radicalInfo: {}, //部首信息
		structureInfo: [], //结构信息
		loop: 0, //动画loop,
		n: 0, //用于console输出当前绘制的笔画
		speed: _constName2.default.SPEED.NORMAL, //自动描红速度
		traceType: null, //描红类型，自动 或 分步
		stepTraceSpeed: _constName2.default.SPEED.NORMAL, //分步描红速度
		strokesMap: {}, //笔画strokes和segments的映射，一个stroke里包含多个segments
		showCenterLine: false //是否显示笔画的中线，所有笔画都有的实线
	};
}; /**
    * Created by Administrator on 2016/12/15.
    * 描红对象当前实例currentWord下的属性
    */

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    var parent = this;

    //作答态提供的方法
    var drawModeMethod = {

        showGuideState: true,

        //允许绘画
        allowDraw: function allowDraw(allow) {
            parent.currentWord.allowDraw = !!allow;
        },


        //返回是否书写过的状态
        hasDrawed: function hasDrawed() {
            return parent.currentWord.hasDrawed;
        },


        //显示引导
        showGuide: function showGuide(show) {
            parent.showCanvasGuide(show);
        },

        //获取base64 data
        getBase64Image: function getBase64Image() {
            return parent.getBase64Image();
        },

        //获取描绘进度，当前描到第几笔，总共有多少笔
        getTraceProgress: function getTraceProgress() {
            var currentWord = parent.currentWord,
                curStep = parent.isDrawMode ? currentWord.validateStep : currentWord.currentStep,
                totalSteps = parent.isDrawMode ? currentWord.strokesLength : currentWord.autoTraceSteps,
                isInAnimation = currentWord.loop === 0 ? false : true;

            return {
                curStep: curStep,
                totalSteps: totalSteps,
                isInAnimation: isInAnimation
            };
        },

        //重置
        reset: function reset() {
            parent.resetCanvasBoards();
        }
    };

    var displayModeMethod = {
        //展示部首
        showRadical: function showRadical() {

            parent.initBackBoard(_constName2.default.REDAW_TYPE.RADICAL);
        },

        //不展示部首
        hideRadical: function hideRadical() {

            parent.initBackBoard(_constName2.default.REDAW_TYPE.NORMAL);
        },

        //展示结构
        showStructure: function showStructure() {

            parent.initBackBoard(_constName2.default.REDAW_TYPE.STRUCTURE);
        },

        //不展示结构
        hideStructure: function hideStructure() {

            parent.initBackBoard(_constName2.default.REDAW_TYPE.NORMAL);
        },

        //开始自动描红
        startAutoTrace: function startAutoTrace() {

            return parent.startAnimation(_constName2.default.TRACE_TYPE.AUTO);
        },

        //停止自动描红
        stopAutoTrace: function stopAutoTrace() {

            parent.stopAnimation();
        },


        //开始分步描红
        startSingleStepTrace: function startSingleStepTrace() {
            parent.startAnimation(_constName2.default.TRACE_TYPE.STEP);
        },


        //分步描红，下一笔
        nextStep: function nextStep() {
            return parent.draw();
        },


        //分步描红，上一笔，实际是撤销操作
        preStep: function preStep() {
            var stepInfo = parent.preStep();
            return stepInfo;
        },


        //设置自动描红速度
        setSpeed: function setSpeed(speed) {

            parent.setSpeed(speed);
        },

        //获取描绘进度，当前描到第几笔，总共有多少笔
        getTraceProgress: function getTraceProgress() {
            var currentWord = parent.currentWord,
                curStep = parent.isDrawMode ? currentWord.validateStep : currentWord.currentStep,
                totalSteps = parent.isDrawMode ? currentWord.strokesLength : currentWord.autoTraceSteps,
                isInAnimation = currentWord.loop === 0 ? false : true;

            return {
                curStep: curStep,
                totalSteps: totalSteps,
                isInAnimation: isInAnimation
            };
        },
        reset: function reset() {
            parent.resetCanvasBoards();
        }
    };

    return parent.isDrawMode ? drawModeMethod : displayModeMethod;
};

var _constName = __webpack_require__(0);

var _constName2 = _interopRequireDefault(_constName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)();
// imports


// module
exports.push([module.i, "\r\n.canvas_back{\r\n    position:absolute;\r\n    top:0;\r\n    left:0;\r\n    z-index:1000;\r\n}\r\n.canvas_fore{\r\n    position:absolute;\r\n    top:0;\r\n    left:0;\r\n    z-index:1001;\r\n}", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ })
/******/ ]);
//# sourceMappingURL=chinesewordtracing.js.map