(function (PIXI,$,TWEEN,Midware) {
'use strict';

$ = 'default' in $ ? $['default'] : $;
TWEEN = 'default' in TWEEN ? TWEEN['default'] : TWEEN;
Midware = 'default' in Midware ? Midware['default'] : Midware;

var Constant = function (lang) {

  var questionTypeMap = {
    choice: {
      name: lang.choice ? lang.choice : "单选题",
      type: "A"
    },
    order: {
      name: lang.order ? lang.order : "排序题",
      type: "C"
    },
    textentry: {
      name: lang.textentry ? lang.textentry : "填空题",
      type: "B"
    },
    textentrymultiple: {
      name: lang.textentry ? lang.textentry : "填空题",
      type: "B"
    },
    newhandwrite: {
      name: lang.handwrite ? lang.handwrite : "手写题",
      type: "D"
    },
    handwrite: {
      name: lang.handwrite ? lang.handwrite : "手写题",
      type: "D"
    },
    match: {
      name: lang.match ? lang.match : "连线题",
      type: "B"
    },
    judge: {
      name: lang.judge ? lang.judge : "判断题",
      type: "A"
    },
    multiplechoice: {
      name: lang.multiplechoice ? lang.multiplechoice : "多选题",
      type: "A"
    },
    vote: {
      name: lang.vote ? lang.vote : "投票题",
      type: "A"
    },
    graphicgapmatch: {
      name: lang.graphicgapmatch ? lang.graphicgapmatch : "拼图题",
      type: "D"
    },
    ChineseCharacterDictation: {
      name: lang.ChineseCharacterDictation ? lang.ChineseCharacterDictation : "汉字拼写题",
      type: "C"
    }
  };

  return { 'questionTypeMap': questionTypeMap };
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
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







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
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
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * 数学工具类
 * 
 * @class MathUtil
 */
var Interpolator = function () {
  function Interpolator() {
    classCallCheck(this, Interpolator);

    this.data = {};
    this.time = 0;
    this.isFinish = false;
    this.updateCallback = null;
    this.finishCallback = null;
  }

  createClass(Interpolator, [{
    key: 'execute',
    value: function execute() {
      this.time = 0;
      this.isFinish = false;
      this.time = 0;
      this.update();
    }
  }, {
    key: 'update',
    value: function update(finish) {
      if (!this.updateCallback) {
        return;
      }
      if (typeof this.updateCallback != 'function') {
        throw 'you must call onUpdate';
      }
      !this.isFinish && this.updateCallback(this.currentValue, this.time);
      this.isFinish = finish;
      if (this.isFinish) {
        this.finish();
      }
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(callback) {
      if (typeof callback == 'function') {
        this.updateCallback = callback;
      }
    }
  }, {
    key: 'finish',
    value: function finish() {
      if (!this.finishCallback) {
        return;
      }
      if (typeof this.finishCallback != 'function') {
        throw 'you must call onFinish';
      }
      !this.isFinish && this.finishCallback(this.currentValue, this.time);
    }
  }, {
    key: 'onFinish',
    value: function onFinish(callback) {
      if (typeof callback == 'function') {
        this.finishCallback = callback;
      }
    }
  }]);
  return Interpolator;
}();

/**
 * 回弹效果插值器
 * 算法：y = ax*x + b (0 < x < x1)
 *      y = Asin(wx+f) + c (x1 < x < x2)
 * 
 * @class ReductionInterpolator
 * @extends {Interpolator}
 */


var ReductionInterpolator = function (_Interpolator) {
  inherits(ReductionInterpolator, _Interpolator);

  function ReductionInterpolator(from, to, frames) {
    classCallCheck(this, ReductionInterpolator);

    var _this = possibleConstructorReturn(this, (ReductionInterpolator.__proto__ || Object.getPrototypeOf(ReductionInterpolator)).call(this));

    _this.currentValue = null;
    _this.data['from'] = from;
    _this.data['to'] = to;
    _this.data['frames'] = frames;
    _this.reset();
    return _this;
  }

  createClass(ReductionInterpolator, [{
    key: 'reset',
    value: function reset() {
      this.isUping = this.data['to'] - this.data['from'] > 0;
      this.a = null, this.A = null, this.w = null;
      this.stepOneFinish = false;
      this.breakPointValue = 0;
      this.breakPointX = 0; //拐点的x坐标值
      this.breakPointPercent = 0.8; //拐点
      this.stepTwoRange = 0.1; //第二阶段函数幅度
    }
  }, {
    key: 'execute',
    value: function execute() {
      this.breakPointX = Math.floor(this.data['frames'] * this.breakPointPercent); //算出拐点的x坐标值
      this.a = (this.data['to'] - this.data['from']) / (this.breakPointX * this.breakPointX); //算出a的值
      this.A = this.A || this.stepTwoRange * Math.abs(this.data['to'] - this.data['from']); //算出第二阶段函数幅度
      this.w = Math.PI / ((1 - this.breakPointPercent) * this.data['frames']); //算出w值

      get(ReductionInterpolator.prototype.__proto__ || Object.getPrototypeOf(ReductionInterpolator.prototype), 'execute', this).call(this);
    }

    /**
     * 设置拐点在整个执行过程时间的百分比
     * 
     * @param {any} percent
     * 
     * @memberOf ReductionInterpolator
     */

  }, {
    key: 'setBreakPointPercent',
    value: function setBreakPointPercent(percent) {
      this.breakPointPercent = percent;
    }

    /**
     * 设置溢出值
     * 
     * @param {any} range
     * 
     * @memberOf ReductionInterpolator
     */

  }, {
    key: 'setOverRange',
    value: function setOverRange(range) {
      this.A = range;
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.isFinish) {
        return;
      }
      ++this.time;
      if (this.currentValue == null) {
        this.currentValue = this.data['from'];
      } else {
        if (this.time <= this.breakPointX) {
          //第一阶段
          var b = this.data['from'];
          this.currentValue = this.a * this.time * this.time + b;
          this.stepOneFinish = false;
        } else {
          //第二阶段，摆动阶段
          if (this.isUping) {
            this.currentValue = this.A * Math.sin(this.w * this.time - this.breakPointX * this.w) + this.data['to'];
          } else {
            this.currentValue = -this.A * Math.sin(this.w * this.time - this.breakPointX * this.w) + this.data['to'];
          }
          this.stepOneFinish = true;
          if (this.time > this.data['frames']) {
            this.currentValue = this.data['to'];
            get(ReductionInterpolator.prototype.__proto__ || Object.getPrototypeOf(ReductionInterpolator.prototype), 'update', this).call(this, true);
            return;
          }
        }
      }
      get(ReductionInterpolator.prototype.__proto__ || Object.getPrototypeOf(ReductionInterpolator.prototype), 'update', this).call(this, false);
    }
  }]);
  return ReductionInterpolator;
}(Interpolator);

/**
 * 加速插值器
 * 算法：y = ax*x + b
 * 
 * @class AccelerateInterpolator
 * @extends {Interpolator}
 */


var AccelerateInterpolator = function (_Interpolator2) {
  inherits(AccelerateInterpolator, _Interpolator2);

  function AccelerateInterpolator(from, to, frames) {
    classCallCheck(this, AccelerateInterpolator);

    var _this2 = possibleConstructorReturn(this, (AccelerateInterpolator.__proto__ || Object.getPrototypeOf(AccelerateInterpolator)).call(this));

    _this2.currentValue = null;
    _this2.data['from'] = from;
    _this2.data['to'] = to;
    _this2.data['frames'] = frames;
    _this2.reset();
    return _this2;
  }

  createClass(AccelerateInterpolator, [{
    key: 'reset',
    value: function reset() {
      this.isUping = this.data['to'] - this.data['from'] > 0;
      this.a = 0;
    }
  }, {
    key: 'execute',
    value: function execute() {
      this.a = (this.data['to'] - this.data['from']) / (this.data['frames'] * this.data['frames']);
      get(AccelerateInterpolator.prototype.__proto__ || Object.getPrototypeOf(AccelerateInterpolator.prototype), 'execute', this).call(this);
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.isFinish) {
        return;
      }
      ++this.time;
      if (this.currentValue == null) {
        this.currentValue = this.data['from'];
      } else {
        var b = this.data['from'];
        this.currentValue = this.a * this.time * this.time + b;
        if (this.isUping && this.currentValue >= this.data['to'] || !this.isUping && this.currentValue <= this.data['to']) {
          this.currentValue = this.data['to'];
          get(AccelerateInterpolator.prototype.__proto__ || Object.getPrototypeOf(AccelerateInterpolator.prototype), 'update', this).call(this, true);
          return;
        }
      }
      get(AccelerateInterpolator.prototype.__proto__ || Object.getPrototypeOf(AccelerateInterpolator.prototype), 'update', this).call(this, false);
    }
  }]);
  return AccelerateInterpolator;
}(Interpolator);

/**
 * 重力衰减插值器
 * 算法：y = at*t + b
 * 
 * @class BallInterpolator
 * @extends {Interpolator}
 */


var BallInterpolator = function (_Interpolator3) {
  inherits(BallInterpolator, _Interpolator3);

  function BallInterpolator(from, to, lamda) {
    classCallCheck(this, BallInterpolator);

    var _this3 = possibleConstructorReturn(this, (BallInterpolator.__proto__ || Object.getPrototypeOf(BallInterpolator)).call(this));

    _this3.currentValue = null;
    _this3.data['from'] = from;
    _this3.data['to'] = to;
    _this3.data['lamda'] = lamda;
    _this3.data['t0'] = 0;
    _this3.data['a'] = 1;
    _this3.data['b'] = from;
    _this3.data['iteration'] = 0;
    _this3.reset();
    return _this3;
  }

  createClass(BallInterpolator, [{
    key: 'reset',
    value: function reset() {
      var dis = this.data['to'] - this.data['from'];
      this.isUping = dis > 0;
      this.data['a'] = 0;
    }
  }, {
    key: 'execute',
    value: function execute() {
      this.data['iteration']++;
      get(BallInterpolator.prototype.__proto__ || Object.getPrototypeOf(BallInterpolator.prototype), 'execute', this).call(this);
    }

    /**
     * 核心计算公式
     * 
     * @param {any} t0
     * @param {any} time
     * 
     * @memberOf BallInterpolator
     */

  }, {
    key: 'calc',
    value: function calc(t0, time) {
      var a = this.isUping ? 1 : -1;
      var y = a * this.data['iteration'] * this.data['lamda'] * (time - t0) * (time - t0) + this.data['b'];
      return y;
    }
  }, {
    key: 'updateB',
    value: function updateB(from, to) {
      var dis = Math.abs(to - from);
      if (this.isUping) {
        return this.data['to'] - dis;
      } else {
        return this.data['to'] + dis;
      }
    }
  }, {
    key: 'updateT0',
    value: function updateT0(from, to) {
      var dis = Math.abs(to - from);
      var lamda = this.data['iteration'] * this.data['lamda'];
      var t0 = Math.sqrt(dis / lamda);
      return t0;
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.isFinish) {
        return;
      }
      ++this.time;
      if (this.currentValue == null) {
        this.currentValue = this.data['from'];
      } else {
        this.currentValue = this.calc(this.data['t0'], this.time);
        if (this.isUping && this.currentValue >= this.data['to'] || !this.isUping && this.currentValue <= this.data['to']) {
          this.currentValue = this.data['to'];

          if (Math.abs(this.data['to'] - this.data['from']) * this.data['lamda'] < 0.1) {
            //终止条件
            get(BallInterpolator.prototype.__proto__ || Object.getPrototypeOf(BallInterpolator.prototype), 'update', this).call(this, true);
            return;
          }

          if (this.isUping && this.data['from'] < this.data['to']) {
            this.data['iteration']++;
            this.data['from'] = this.data['to'] - (this.data['to'] - this.data['from']) * this.data['lamda'];
            this.data['t0'] = this.time + this.updateT0(this.data['from'], this.data['to']);
            this.data['b'] = this.updateB(this.data['from'], this.data['to']);
          } else if (!this.isUping && this.data['from'] > this.data['to']) {
            this.data['iteration']++;
            this.data['from'] = this.data['to'] + (this.data['from'] - this.data['to']) * this.data['lamda'];
            this.data['t0'] = this.time + this.updateT0(this.data['from'], this.data['to']);
            this.data['b'] = this.updateB(this.data['from'], this.data['to']);
          }
        }
      }
      get(BallInterpolator.prototype.__proto__ || Object.getPrototypeOf(BallInterpolator.prototype), 'update', this).call(this, false);
    }
  }]);
  return BallInterpolator;
}(Interpolator);

/**
 * 正弦摆动函数
 * 
 * @class SinSwing
 */


var SinSwing = function () {
  function SinSwing(radians) {
    classCallCheck(this, SinSwing);

    this.w = Math.PI / 180;
    this.maxRadians = radians;
    this._rotate = 0;
    this.time = 0;
  }

  createClass(SinSwing, [{
    key: 'update',
    value: function update() {
      this._rotate = this.maxRadians * Math.sin(this.w * this.time);
      this.time++;
    }
  }, {
    key: 'rotate',
    get: function get$$1() {
      return this._rotate;
    },
    set: function set$$1(r) {
      this._rotate = r;
    }
  }]);
  return SinSwing;
}();

var MAIN_WIDTH = 1920;
var MAIN_HEIGHT = 1080;
var SUB_WIDTH = 800;
var SUB_HEIGHT = 600;
var Options = {
  running: false, //当前是否正在运行
  classWrap: '',
  name: '', //挂载的css在link标签上的skin属性值
  config: null,
  rootElement: null, //容器
  chartWrap: null, //chart_wrap元素
  answerData: null,
  pieData: null,
  textData: null,
  chartInfo: null,
  initMainWidth: MAIN_WIDTH,
  initMainHeight: MAIN_HEIGHT,
  initSubWidth: SUB_WIDTH,
  initSubHeight: SUB_HEIGHT,
  chartSideWidth: 0, //左侧宽度
  chartSideHeight: 0, //左侧高度
  chartContainerWidth: 0, //右侧宽度
  chartContainerHeight: 0, //右侧高度
  leftAnimConfig: '', //左侧帧动画配置文件
  rightAnimConfig: '', //右侧帧动画配置文件
  lang: null //国际化json
};

var diagramHasInit = false;

/**
 * 统计图表基类,内含（2个canvas，一个负责主舞台，一个负责右边副舞台）
 * 主舞台负责渲染左侧饼图区，和右侧背景动画
 * 副舞台负责右侧柱状图渲染
 * 
 * @class DiagramBase
 */

var DiagramBase = function () {
  function DiagramBase(classWrap) {
    classCallCheck(this, DiagramBase);

    this.classWrap = classWrap;
    this.mainApp = null;
    this.subApp = null;
    this.outerCallback = null;
    this.tickers = []; //一些不断重复执行的定时器
    this.timeoutIds = [];
    this.defers = {};
    TWEEN.removeAll();
  }

  ////////////////////////外部调用 start////////////////////////////////
  /**
   * 安装皮肤
   * 
   * @param {{mainStage:HTMLElement,subStage:HTMLElement}} opt
   * @returns
   * 
   * @memberOf DiagramBase
   */


  createClass(DiagramBase, [{
    key: 'install',
    value: function install(opt) {
      if (diagramHasInit) {
        return;
      }
      this.options = Options;
      this.options.classWrap = this.classWrap;
      this.options.rootElement = opt.chartContainer;
      this.options.chartWrap = opt.chartContainer.querySelector('.chart_wrap');
      this.options.answerData = opt.data;
      this.options.chartInfo = opt.chartInfo;
      this.options.lang = opt.lang;

      //容器添加ClassWrap类
      this._addClassWrap();

      this.options.config = opt.config;
      this._build();
    }
  }, {
    key: 'uninstall',


    /**
     * 卸载皮肤
     * 
     * 
     * @memberOf DiagramBase
     */
    value: function uninstall() {
      console.log("==uninstall==", this.options.classWrap);
      diagramHasInit = false;

      this.$destroy();
      //停止定时器
      this._stopTickers();
      this._clearTimeout();
      this._rejectPromise();

      TWEEN.removeAll();
      this.mainApp.renderer.clear();
      this.subApp.renderer.clear();
      this.mainApp.destroy(true); //释放资源，很重要
      this.subApp.destroy(true); //释放资源，很重要

      this.options.running = false;
      //PIXI.loader.reset();

      //去除容器的类
      this._removeClassWrap();
    }

    /**
     * 
     * 注册外部回调
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: 'registerEvent',
    value: function registerEvent(fn) {
      this.outerCallback = fn;
    }

    /**
     * 启动动画
     * 
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: 'startAnimation',
    value: function startAnimation() {
      console.time('startAnimation');

      var $chart_side = $(this.options.rootElement.querySelector(".chart_side"));
      var $chart_container = $(this.options.rootElement.querySelector(".chart_container"));
      this.options.chartSideWidth = $chart_side.width();
      this.options.chartSideHeight = $chart_side.height();
      this.options.chartContainerWidth = $chart_container.width();
      this.options.chartContainerHeight = $chart_container.height();

      var mainStage = this.options.rootElement.querySelector(".chart_canvas");
      var mainCanvas = document.createElement('canvas');
      mainStage.appendChild(mainCanvas);
      var subStage = this.options.rootElement.querySelector(".container_canvas");
      var subCanvas = document.createElement('canvas');
      subStage.appendChild(subCanvas);

      this.mainApp = new PIXI.Application({
        width: mainStage.clientWidth || this.options.initMainWidth,
        height: mainStage.clientHeight || this.options.initMainHeight,
        view: mainCanvas,
        antialias: true,
        transparent: true
      });
      this.subApp = new PIXI.Application({
        width: subStage.clientWidth || this.options.initSubWidth,
        height: subStage.clientHeight || this.options.initSubHeight,
        view: subCanvas,
        antialias: true,
        transparent: true
      });
      this._loadAssest();
    }

    ////////////////////////外部调用 end//////////////////////////////////

    ////////////////////////私有方法 start////////////////////////////////

    /**
     * 添加外部包装类
     * 
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: '_addClassWrap',
    value: function _addClassWrap() {
      var c = $(this.options.rootElement);
      c.addClass(this.options.classWrap);
      c.removeClass("chart_wrap_loading");
    }

    /**
     * 删除外部包装类
     * 
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: '_removeClassWrap',
    value: function _removeClassWrap() {
      var c = $(this.options.rootElement);
      c.removeClass(this.options.classWrap);
    }
  }, {
    key: '_getOpenAnimationContainer',
    value: function _getOpenAnimationContainer() {
      var container = new PIXI.Container();
      container.x = 0;
      container.y = 0;
      container.width = this.options.chartSideWidth;
      container.height = this.options.chartSideHeight;

      var mask = new PIXI.Graphics();
      mask.beginFill(0x8bc5ff, 0);
      mask.drawRect(0, 0, this.options.chartSideWidth, this.options.chartSideHeight);
      mask.endFill();

      container.mask = mask;

      this.mainApp.stage.addChild(container, mask);
      return container;
    }

    /**
     * 开始执行动画
     * 
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: '_onStartAnimation',
    value: function _onStartAnimation() {
      var _this = this;

      console.timeEnd('startAnimation');
      if (this.mainApp.stage) {
        this.$startOpenAnimation(this._getOpenAnimationContainer()).done(function () {
          if (!_this.options.running) {
            console.log("==$startOpenAnimation 停止==", _this.options.classWrap, _this.options.running);
            return;
          }
          console.log("==$startOpenAnimation done==", _this.options.classWrap, _this.options.running);
          _this.$startPieAnimation().done(function () {
            if (!_this.options.running) {
              return;
            }
            _this.$startHistogramAnimation(); //执行完左边动画后再执行右边柱状图动画
            var id = setTimeout(function () {
              _this.outerCallback("FinishAnim", true);
            }, 1200);
            _this.timeoutIds.push(id);
          });
        });

        this.$startRightBackgroundAnimation(this.mainApp.stage);
      }
    }
  }, {
    key: '_build',
    value: function _build() {
      this.options.running = true;
      this._initPromise();
      this._changeHistogramData();

      var ticker$$1 = new PIXI.ticker.Ticker();
      this.tickers.push(ticker$$1);
      ticker$$1.add(function () {
        TWEEN.update();
      });
      ticker$$1.start();
    }
  }, {
    key: '_initPromise',
    value: function _initPromise() {
      this.defers.pieDefer = $.Deferred();
    }
  }, {
    key: '_changeHistogramData',
    value: function _changeHistogramData() {
      var answer = this.options.answerData.answer;
      var questions = [];
      var index = 1;
      this.options.answerData.isAllSubjective = true; //是否全是主观题
      for (var i = 0, len = answer.length; i < len; i++) {
        var item = answer[i];
        var question = {
          style: this.$getHistogramStyle(item.accuracy),
          index: index++,
          name: this.questionTypeMap[item.subquestionType]["name"],
          type: answer[i].type,
          subquestionType: item.subquestionType,
          accuracy: item.accuracy < 20 ? "<20" : item.accuracy,
          height: item.accuracy < 20 ? 20 : item.accuracy,
          subquestionId: item.subquestionId
        };
        if (!!this.options.answerData.subquestionTitles) {
          question.subquestion = this.options.answerData.subquestionTitles[item.subquestionId] || '';
        } else {
          question.subquestion = '';
        }

        questions.push(question);
        if (item.type === 'objective') {
          //客观题
          this.options.answerData.isAllSubjective = false;
        }
      }
      this.questions = questions;
    }

    /**
     * 资源加载
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: '_loadAssest',
    value: function _loadAssest() {
      //PIXI.loader.reset();
      var baseUrl = this.options.chartInfo.baseUrl;
      var animtionConfig = this.options.config.animtionConfig;
      var image = this.options.config.image;
      var dbspine = this.options.config.dbspine;
      var key = void 0,
          path = void 0,
          hasNewAdd = false;
      if (animtionConfig) {
        for (key in animtionConfig) {
          path = baseUrl + animtionConfig[key];
          if (!(path in PIXI.loader.resources)) {
            PIXI.loader.add(path);
            hasNewAdd = true;
          }
        }
      }

      if (image) {
        for (key in image) {
          path = baseUrl + image[key];
          if (!(path in PIXI.loader.resources)) {
            PIXI.loader.add(path);
            hasNewAdd = true;
          }
        }
      }

      if (dbspine) {
        for (key in dbspine) {
          path = baseUrl + dbspine[key];
          if (!(path in PIXI.loader.resources)) {
            PIXI.loader.add(path);
            hasNewAdd = true;
          }
        }
      }
      if (hasNewAdd) {
        PIXI.loader.load(this._onLoadedAsset.bind(this)); //资源加载完成
      } else {
        this._onLoadedAsset();
      }
    }
  }, {
    key: '_onLoadedAsset',
    value: function _onLoadedAsset() {
      this.$afterLoadedAssets();
      this._onStartAnimation(); //资源加载完成
    }
  }, {
    key: '_clearTimeout',
    value: function _clearTimeout() {
      var i = void 0,
          len = void 0,
          t = void 0;
      for (i = 0, len = this.timeoutIds.length; i < len; i++) {
        t = this.timeoutIds[i];
        clearTimeout(t);
      }
    }
  }, {
    key: '_stopTickers',
    value: function _stopTickers() {
      var tickers = this.tickers;
      var i = void 0,
          len = void 0,
          t = void 0;
      for (i = 0, len = tickers.length; i < len; i++) {
        t = tickers[i];
        if (t instanceof PIXI.ticker.Ticker && t.started) {
          t.stop();
          t.destroy();
        }
      }
    }
  }, {
    key: '_rejectPromise',
    value: function _rejectPromise() {
      for (var key in this.defers) {
        if (this.defers[key] && this.defers[key].state && this.defers[key].state() === "pending") {
          this.defers[key].reject();
          this.defers[key] = null;
        }
      }
    }
  }, {
    key: '_getPieData',
    value: function _getPieData() {
      var COLOR = this.getPieColor();
      var answerData = this.options.answerData;
      var rightData = {
        'type': 'right',
        'per': answerData.correctStudents.length / answerData.totalNum,
        'color': COLOR.right
      };
      var wrongData = {
        'type': 'wrong',
        'per': answerData.errorStudents.length / answerData.totalNum,
        'color': COLOR.wrong
      };
      var undoData = {
        'type': 'undo',
        'per': answerData.undoStudents.length / answerData.totalNum,
        'color': COLOR.undo
      };

      var pieData = [rightData, wrongData, undoData];
      pieData.sort(function (a, b) {
        return a['per'] - b['per'];
      });
      return pieData;
    }
  }, {
    key: '_getTextData',
    value: function _getTextData() {
      var answerData = this.options.answerData;
      var textData = {
        'right': {
          'num': answerData.correctStudents.length
        },
        'wrong': {
          'num': answerData.errorStudents.length
        },
        'undo': {
          'num': answerData.undoStudents.length
        }
      };
      return textData;
    }

    ////////////////////////私有方法 end////////////////////////////////


    ////////////////////////子类实现 start////////////////////////////////

  }, {
    key: '$destroy',
    value: function $destroy() {}
  }, {
    key: '$afterLoadedAssets',
    value: function $afterLoadedAssets() {}
  }, {
    key: '$getHistogramStyle',
    value: function $getHistogramStyle(accuracy) {}

    /**
     * 开场动画
     * 必须返回promise
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: '$startOpenAnimation',
    value: function $startOpenAnimation() {
      console.log("==$startOpenAnimation==");
    }

    /**
     * 饼图动画
     * 必须返回promise
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: '$startPieAnimation',
    value: function $startPieAnimation() {
      return this.drawPieAndText(this.options.answerData.accuracy, this._getPieData(), this._getTextData());
    }

    /**
     * 柱状图动画 
     * 
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: '$startHistogramAnimation',
    value: function $startHistogramAnimation() {
      console.log("==$startHistogramAnimation==");
    }

    /**
     * 右边背景
     * 
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: '$startRightBackgroundAnimation',
    value: function $startRightBackgroundAnimation() {
      console.log("==$startRightBackgroundAnimation==");
    }

    /**
     * 画柱状图区域
     * 
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: '$drawHistogramArea',
    value: function $drawHistogramArea() {}
  }, {
    key: 'getAccuracyColor',
    value: function getAccuracyColor() {}
  }, {
    key: 'getPieColor',
    value: function getPieColor() {}
  }, {
    key: 'getTextColor',
    value: function getTextColor() {}

    ////////////////////////子类实现 end////////////////////////////////


    /**
     * 画平均正确率
     * 
     * @param {any} accuracy
     * @param {any} color
     * @returns
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: 'drawAccuracy',
    value: function drawAccuracy(accuracy) {
      var per = 0,
          fontSize = 80 * this.options.chartSideWidth / 483;
      var perTextObj = new PIXI.Text(accuracy + "%", {
        'fontFamily': 'Arial',
        'fontWeight': '300',
        'letterSpacing': 5,
        'fontSize': fontSize,
        'fill': this.getAccuracyColor(),
        'align': 'center'
      });

      perTextObj.y = this.options.chartSideWidth / 5;
      perTextObj.x = (this.options.chartSideWidth - perTextObj.width) / 2;
      perTextObj.alpha = 1;
      perTextObj.text = per + "%";
      this.mainApp.stage && this.mainApp.stage.addChild(perTextObj);

      var ticker$$1 = new PIXI.ticker.Ticker();
      ticker$$1.add(function () {
        if (per >= accuracy) {
          per = accuracy;
          perTextObj.text = per + "%";
          ticker$$1.stop();
          ticker$$1.destroy();
          return;
        }
        per++;
        perTextObj.text = per + "%";
      });
      ticker$$1.start();

      return perTextObj.y + perTextObj.height;
    }

    /**
     * 饼图
     * 
     * @param {any} start_y
     * @param {any} data
     * @returns
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: 'drawPie',
    value: function drawPie(start_y, data, defer) {
      var _this2 = this;

      var frameNum = 45,
          //总共45帧
      unitRadian = Math.PI / 180,
          //1度所对应的弧度值
      w = Math.PI / frameNum,
          rStep = this.options.chartSideWidth / (frameNum * 5),
          pieRadius = this.options.chartSideWidth / 3.18;

      var startAngle = 0,
          endAngle = void 0,
          dis = 0,
          r = pieRadius - frameNum * rStep,
          rotate = 0;

      var pieGraphics = new PIXI.Graphics();
      pieGraphics.alpha = 1;
      pieGraphics.x = this.options.chartSideWidth / 2;
      pieGraphics.y = start_y + pieRadius * 1.25;
      this.mainApp.stage && this.mainApp.stage.addChild(pieGraphics);

      var i = void 0,
          len = void 0,
          offset = 0,
          renderData = [];
      for (i = 0, len = data.length; i < len - 1; i++) {
        if (data[i]['per'] == 0) {
          dis += unitRadian; //如果百分比为0，则用1度表示
          offset = unitRadian;
        } else {
          dis += data[i]['per'] * 360 * unitRadian;
          offset = data[i]['per'] * 360 * unitRadian;
        }
        endAngle = startAngle + offset;

        renderData.push({
          "startAngle": startAngle,
          "endAngle": endAngle,
          "color": data[i]['color']
        });
        startAngle = endAngle;
      }

      endAngle = 2 * Math.PI;

      renderData.push({
        "startAngle": startAngle,
        "endAngle": endAngle,
        "color": data[len - 1]['color']
      });

      var tween1 = new TWEEN.Tween({
        radius: r
      });
      var tween2 = new TWEEN.Tween({
        deg: renderData[renderData.length - 1].startAngle
      });
      tween1.to({
        radius: pieRadius
      }, 1800);
      tween2.to({
        deg: renderData[renderData.length - 1].endAngle
      }, 1000);
      tween1.easing(TWEEN.Easing.Elastic.Out);
      tween2.easing(TWEEN.Easing.Circular.InOut);
      tween1.onUpdate(function () {
        r = this.radius;
      });
      tween2.onUpdate(function () {
        pieGraphics.clear();
        for (var _i = 0, _len = renderData.length; _i < _len - 1; _i++) {
          pieGraphics.beginFill(renderData[_i]['color']);
          pieGraphics.moveTo(0, 0);
          pieGraphics.arc(0, 0, r, renderData[_i].startAngle, renderData[_i].endAngle, false);
          pieGraphics.endFill();
        }
        pieGraphics.beginFill(renderData[renderData.length - 1]['color']);
        pieGraphics.moveTo(0, 0);
        pieGraphics.arc(0, 0, r, renderData[renderData.length - 1].startAngle, this.deg, false);
        pieGraphics.endFill();
        pieGraphics.rotation = rotate;
        rotate += unitRadian * 2;
      });
      tween1.onComplete(function () {
        _this2.options.running && defer.resolve();
      });
      tween2.onComplete(function () {
        _this2.options.running && defer.resolve();
      });

      tween1.start();
      tween2.start();

      return pieGraphics.y + pieRadius;
    }

    /**
     * 画左边底部统计人数文本
     * 
     * @param {any} start_y
     * @param {any} textData
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: 'drawText',
    value: function drawText(start_y, textData) {
      var COLOR = this.getTextColor();
      var rightTitle = this.options.lang['right'] + ':   ';
      var wrongTitle = this.options.lang['wrong'] + ':   ';
      var noanswerTitle = this.options.lang['noAnswer'] + ':   ';

      var rightNum = textData['right']['num'] + ' ';
      var wrongNum = textData['wrong']['num'] + ' ';
      var undoNum = textData['undo']['num'] + ' ';

      var person = this.options.lang['person'];

      var p_rightTitle = new PIXI.Text(rightTitle, {
        'fontFamily': 'Microsoft YaHei',
        'fontSize': 25 * this.options.chartSideWidth / 483,
        'fontWeight': 'bold',
        'fill': COLOR['right']['text']
      });
      var p_wrongTitle = new PIXI.Text(wrongTitle, {
        'fontFamily': 'Microsoft YaHei',
        'fontSize': 25 * this.options.chartSideWidth / 483,
        'fontWeight': 'bold',
        'fill': COLOR['wrong']['text']
      });
      var p_undoTitle = new PIXI.Text(noanswerTitle, {
        'fontFamily': 'Microsoft YaHei',
        'fontSize': 25 * this.options.chartSideWidth / 483,
        'fontWeight': 'bold',
        'fill': COLOR['undo']['text']
      });

      var p_rightNum = new PIXI.Text(rightNum, {
        'fontFamily': 'Microsoft YaHei',
        'fontSize': 25 * this.options.chartSideWidth / 483,
        'fontWeight': 'bold',
        'fill': COLOR['right']['text']
      });
      var p_wrongNum = new PIXI.Text(wrongNum, {
        'fontFamily': 'Microsoft YaHei',
        'fontSize': 25 * this.options.chartSideWidth / 483,
        'fontWeight': 'bold',
        'fill': COLOR['wrong']['text']
      });
      var p_undoNum = new PIXI.Text(undoNum, {
        'fontFamily': 'Microsoft YaHei',
        'fontSize': 25 * this.options.chartSideWidth / 483,
        'fontWeight': 'bold',
        'fill': COLOR['undo']['text']
      });

      var p_person1 = new PIXI.Text(person, {
        'fontFamily': 'Microsoft YaHei',
        'fontSize': 25 * this.options.chartSideWidth / 483,
        'fill': COLOR['right']['person']
      });
      var p_person2 = new PIXI.Text(person, {
        'fontFamily': 'Microsoft YaHei',
        'fontSize': 25 * this.options.chartSideWidth / 483,
        'fill': COLOR['wrong']['person']
      });
      var p_person3 = new PIXI.Text(person, {
        'fontFamily': 'Microsoft YaHei',
        'fontSize': 25 * this.options.chartSideWidth / 483,
        'fill': COLOR['undo']['person']
      });

      var line1Width = p_rightTitle.width + p_rightNum.width + p_person1.width;
      var line2Width = p_wrongTitle.width + p_wrongNum.width + p_person2.width;
      var line3Width = p_undoTitle.width + p_undoNum.width + p_person3.width;

      var titleWidth = Math.max(p_rightTitle.width, p_wrongTitle.width, p_undoTitle.width);
      var numWidth = Math.max(p_rightNum.width, p_wrongNum.width, p_undoNum.width);
      var personWidth = p_person1.width;

      var lineWidth = titleWidth + numWidth + personWidth;

      var line1Container = new PIXI.Container();
      line1Container.width = lineWidth;
      p_rightTitle.x = titleWidth - p_rightTitle.width;
      p_rightNum.x = titleWidth;
      p_person1.x = p_rightNum.x + numWidth + personWidth / 2;
      line1Container.addChild(p_rightTitle, p_rightNum, p_person1);
      line1Container.alpha = 0;
      line1Container.targetX = this.options.chartSideWidth / 2 - lineWidth / 2;
      line1Container.x = -line1Container.width;
      line1Container.y = start_y + line1Container.height * 2;

      var line2Container = new PIXI.Container();
      line2Container.width = lineWidth;
      p_wrongTitle.x = titleWidth - p_wrongTitle.width;
      p_wrongNum.x = titleWidth;
      p_person2.x = p_wrongNum.x + numWidth + personWidth / 2;
      line2Container.addChild(p_wrongTitle, p_wrongNum, p_person2);
      line2Container.alpha = 0;
      line2Container.targetX = this.options.chartSideWidth / 2 - lineWidth / 2;
      line2Container.x = -line2Container.width;
      line2Container.y = line1Container.y + line2Container.height * 1.5;

      var line3Container = new PIXI.Container();
      line3Container.width = lineWidth;
      p_undoTitle.x = titleWidth - p_undoTitle.width;
      p_undoNum.x = titleWidth;
      p_person3.x = p_undoNum.x + numWidth + personWidth / 2;
      line3Container.addChild(p_undoTitle, p_undoNum, p_person3);
      line3Container.alpha = 0;
      line3Container.targetX = this.options.chartSideWidth / 2 - lineWidth / 2;
      line3Container.x = -line3Container.width;
      line3Container.y = line2Container.y + line3Container.height * 1.5;

      var frameNum = 40,
          keyFrame = Math.floor(frameNum / 4),
          alphaSpeed = 1 / frameNum;
      var accelerateInterpolator1 = new AccelerateInterpolator(line1Container.x, line1Container.targetX, frameNum);
      var accelerateInterpolator2 = new AccelerateInterpolator(line2Container.x, line2Container.targetX, frameNum);
      var accelerateInterpolator3 = new AccelerateInterpolator(line3Container.x, line3Container.targetX, frameNum);

      accelerateInterpolator1.onUpdate(function (val, time) {
        line1Container.x = val;
        line1Container.alpha += alphaSpeed;
        if (time == keyFrame) {
          accelerateInterpolator2.execute();
        }
      });
      accelerateInterpolator2.onUpdate(function (val, time) {
        line2Container.x = val;
        line2Container.alpha += alphaSpeed;
        if (time == keyFrame) {
          accelerateInterpolator3.execute();
        }
      });
      accelerateInterpolator3.onUpdate(function (val, time) {
        line3Container.x = val;
        line3Container.alpha += alphaSpeed;
      });

      var ticker$$1 = new PIXI.ticker.Ticker();
      ticker$$1.add(function () {
        if (accelerateInterpolator3.isFinish) {
          ticker$$1.stop();
          ticker$$1.destroy();
          return;
        } else {
          accelerateInterpolator1.update();
          accelerateInterpolator2.update();
          accelerateInterpolator3.update();
        }
      });
      accelerateInterpolator1.execute();
      ticker$$1.start();

      if (this.mainApp.stage) {
        this.mainApp.stage.addChild(line1Container);
        this.mainApp.stage.addChild(line2Container);
        this.mainApp.stage.addChild(line3Container);
      }
    }

    /**
     * 绘制饼图
     * 
     * @param {any} accuracy
     * @param {any} data
     * @param {any} textData
     * @returns
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: 'drawPieAndText',
    value: function drawPieAndText(accuracy, data, textData) {
      var defer = this.defers.pieDefer;
      var i = void 0,
          len = void 0,
          frameNum = 23,
          //总帧数
      constDis = Math.PI / 180,
          finishPieAnim = false,
          finishTextAnim = false,
          startAngle = -constDis * frameNum,
          endAngle = void 0,
          animStartAngle = startAngle,
          willComplete = 5,
          dis = 0,
          scaleOver = 1,
          rotation = 45 - frameNum,
          rStep = this.options.chartSideWidth / (frameNum * 5),
          pieRadius = this.options.chartSideWidth / 2.5,
          r = pieRadius - frameNum * rStep;

      var start_y = this.drawAccuracy(accuracy);
      start_y = this.drawPie(start_y, data, defer);
      this.drawText(start_y, textData);

      return defer.promise();
    }

    /**
     * 
     * 获取图片地址
     * @memberOf DiagramBase
     */

  }, {
    key: 'getImagePath',
    value: function getImagePath(key) {
      var baseUrl = this.options.chartInfo.baseUrl;
      var images = this.options.config.image;
      return baseUrl + images[key];
    }

    /**
     * 获取帧动画配置文件
     * 
     * @param {any} key
     * @returns
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: 'getAnimtionConfig',
    value: function getAnimtionConfig(key) {
      var baseUrl = this.options.chartInfo.baseUrl;
      var config = this.options.config.animtionConfig;
      return baseUrl + config[key];
    }

    /**
     * 获取骨骼动画配置文件
     * 
     * @param {any} key
     * @returns
     * 
     * @memberOf DiagramBase
     */

  }, {
    key: 'getDbSpine',
    value: function getDbSpine(key) {
      var baseUrl = this.options.chartInfo.baseUrl;
      var dbspine = this.options.config.dbspine;
      return baseUrl + dbspine[key];
    }
  }, {
    key: 'running',
    get: function get$$1() {
      return this.options.running;
    }
  }, {
    key: 'questionTypeMap',
    get: function get$$1() {
      var questionTypeMap = Constant(this.options.lang)['questionTypeMap'];
      return questionTypeMap;
    }
  }]);
  return DiagramBase;
}();

var HistogramItemBase = function () {
  function HistogramItemBase(context, parent, data, opt) {
    classCallCheck(this, HistogramItemBase);

    this.context = context;
    this.data = data;
    this.opt = opt;
    this.parent = parent;
    this.container = null;
    this.stick = null;
    this.wrap = null;
    this.percent = null;
    this.title = null;
    this.targetY = opt.height - opt.height * data['height'] / 100; //目标位置

    this.init();
    this._dress();
  }

  createClass(HistogramItemBase, [{
    key: 'init',
    value: function init() {
      var data = this.data;
      var opt = this.opt;
      var parent = this.parent;

      this.wrap = new PIXI.Container();
      this.wrap.x = opt.x;
      this.wrap.y = 0;
      this.wrap.width = opt.width;
      this.wrap.height = opt.height;
      parent.addChild(this.wrap);

      var mask = new PIXI.Graphics();
      this.setMaskStyle(mask);
      this.wrap.addChild(mask);

      /*用一个container把柱状图精灵和百分比文本包裹起来*/
      this.container = new PIXI.Container();
      this.container.x = 0;
      this.container.y = opt.y;
      this.container.width = opt.width;
      this.container.height = opt.height;
      this.wrap.addChild(this.container);

      //柱状图
      this.stick = this.getHistorgamItem(this.data);
      this.stick.mask = mask;
      this.container.addChild(this.stick);

      //百分比
      var text = data['accuracy'] + "%";
      var percentStyle = this.setPercentStyle();
      this.percent = new PIXI.Text(text, percentStyle);
      this.percent['accuracy'] = data['accuracy'];
      this.percent.x = percentStyle.x != undefined ? percentStyle.x : (opt.width - this.percent.width) / 2;
      this.percent.y = percentStyle.y;
      this.container.addChild(this.percent);

      //题号
      text = data['index'];
      var titleStyle = this.setTitle();
      this.title = new PIXI.Text(text, titleStyle);
      this.title.x = titleStyle.x !== undefined ? titleStyle.x : (opt.width - this.title.width) / 2;
      this.title.y = titleStyle.y == undefined ? opt.height + this.title.height / 2 : opt.height + this.title.height / 2 + titleStyle.y;
      this.wrap.addChild(this.title);

      this.bindEvent();
    }
  }, {
    key: 'setMask',


    /**
     * 设置遮罩层
     * 
     * 
     * @memberOf HistogramItemBase
     */
    value: function setMask() {}

    /**
     * 设置柱状图顶部的百分比
     * 
     * 
     * @memberOf HistogramItemBase
     */

  }, {
    key: 'setPercent',
    value: function setPercent() {}

    /**
     * 设置柱状图底部标题
     * 
     * 
     * @memberOf HistogramItemBase
     */

  }, {
    key: 'setTitle',
    value: function setTitle() {}

    /**
     * 开始执行动画
     * 子类实现
     * 
     * @memberOf HistogramItemBase
     */

  }, {
    key: 'startAnim',
    value: function startAnim() {}

    /**
     * 装饰
     * 
     * 
     * @memberOf HistogramItemBase
     */

  }, {
    key: 'dress',
    value: function dress(parent) {}
  }, {
    key: '_dress',
    value: function _dress() {
      this.dress(this.wrap);
    }

    /**
     * 绑定事件
     * 
     * 
     * @memberOf HistogramItemBase
     */

  }, {
    key: 'bindEvent',
    value: function bindEvent() {
      this.stick.interactive = true;
      this.stick.buttonMode = true;
      this.title.interactive = true;
      this.title.buttonMode = true;
      this.stick.on('pointerup', this.clickMe.bind(this));
      this.title.on('pointerup', this.clickMe.bind(this));
    }

    /**
     * 点击事件
     * 
     * @param {any} event
     * 
     * @memberOf Histogram
     */

  }, {
    key: 'clickMe',
    value: function clickMe(event) {
      //判断是否需要处理事件
      if (event.target.parent.parent.parent.dragOpt && event.target.parent.parent.parent.dragOpt.moveCount > 3) {
        return;
      }

      this.context.outerCallback('ClickHistogram', this.data); //统一封装对外发送事件
      console.log('==ClickHistogram==', this.data, event.target);
      if ('callback' in this) {
        this['callback'](this.data);
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(fn) {
      this.callback = fn;
    }

    /**
     * 子类实现
     * 
     * 
     * @memberOf HistogramItemBase
     */

  }, {
    key: 'getHistorgamItem',
    value: function getHistorgamItem() {}
  }, {
    key: 'height',
    get: function get$$1() {
      return this.stick.height;
    }
  }]);
  return HistogramItemBase;
}();

var HistogramItem = function (_HistogramItemBase) {
  inherits(HistogramItem, _HistogramItemBase);

  function HistogramItem(context, container, data, opt) {
    classCallCheck(this, HistogramItem);
    return possibleConstructorReturn(this, (HistogramItem.__proto__ || Object.getPrototypeOf(HistogramItem)).call(this, context, container, data, opt));
  }

  createClass(HistogramItem, [{
    key: 'init',
    value: function init() {
      this.fontSize = this.opt.width / 2.8;
      get(HistogramItem.prototype.__proto__ || Object.getPrototypeOf(HistogramItem.prototype), 'init', this).call(this);
    }
  }, {
    key: 'dress',
    value: function dress(container) {
      if (this.data['type'] === "subjective") {
        var sprite = this.getHistorgamItem(this.data);
        sprite.alpha = 1;
        var mask = new PIXI.Graphics();
        mask.beginFill(0xffffff, 0);
        mask.drawRect(0, this.opt.height - this.opt.height / 20, this.opt.width, this.opt.height / 20);
        mask.endFill();
        sprite.mask = mask;
        container.addChildAt(sprite, 0);
        container.addChild(mask);
      }
    }
  }, {
    key: 'setMaskStyle',
    value: function setMaskStyle(mask) {
      var opt = this.opt;
      var curve = opt.width / 3.3;
      var cp1x = opt.width * 8 / 9;
      var cp1y = opt.height;
      var cp2x = opt.width / 9;
      var cp2y = opt.height;
      mask.beginFill(0x8bc5ff, 0.4);
      mask.moveTo(0, opt.height - curve);
      mask.lineTo(0, -this.fontSize * 2);
      mask.lineTo(opt.width, -this.fontSize * 2);
      mask.lineTo(opt.width, opt.height - curve);
      mask.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, 0, opt.height - curve);
      mask.endFill();
    }
  }, {
    key: 'setPercentStyle',
    value: function setPercentStyle() {
      var style = {
        'fontFamily': 'Microsoft YaHei',
        'fontSize': this.fontSize,
        'fontWeight': 'bold',
        'fill': this.getTextColor(),
        'align': 'center',
        'y': -this.fontSize * 1.5
      };
      return style;
    }
  }, {
    key: 'setTitle',
    value: function setTitle() {
      var style = {
        'fontFamily': 'Arial',
        'fontSize': this.fontSize,
        'fill': 0x8e6a2c,
        'align': 'center',
        'y': window.outerWidth > 1366 ? -8 : 0
      };
      return style;
    }
  }, {
    key: 'startAnim',
    value: function startAnim() {
      var _this2 = this;

      var percent = this.percent;
      var current = 0;
      var speed1 = 5,
          speed2 = Math.floor(this.data.height / (Math.abs(this.container.y - this.targetY) / speed1));
      var ticker$$1 = new PIXI.ticker.Ticker(); //计时器
      ticker$$1.add(function () {
        var s = _this2.container;
        if (s.y > _this2.targetY) {
          s.y -= speed1;
          current += speed2;
          percent.text = current + "%";
        } else {
          s.y = _this2.targetY;
          percent.text = _this2.data.height === 20 ? '<20%' : _this2.data.height + "%";
          ticker$$1.stop();
          ticker$$1.destroy();
          return;
        }
      });
      ticker$$1.start();
    }
  }, {
    key: 'getTextColor',
    value: function getTextColor() {
      var color = {
        'low': 0x682b1a,
        'mid': 0x6c5a3d,
        'good': 0x8f7035
      };
      var accuracy = this.data['accuracy'];
      if (accuracy >= 85) {
        return color.good;
      } else if (accuracy >= 60) {
        return color.mid;
      } else {
        return color.low;
      }
    }
  }, {
    key: 'getHistorgamItem',
    value: function getHistorgamItem(item) {
      var sprite = void 0;
      var baseUrl = this.opt.baseUrl;

      var image_wood_good = baseUrl + this.opt.config.image.wood_good;
      var image_wood_mid = baseUrl + this.opt.config.image.wood_mid;
      var image_wood_low = baseUrl + this.opt.config.image.wood_low;
      var image_wood_empty = baseUrl + this.opt.config.image.wood_empty;

      if (item['type'] === 'subjective') {
        sprite = new PIXI.Sprite.fromImage(image_wood_empty);
      } else if (item['style'] === 'wood_good') {
        sprite = new PIXI.Sprite.fromImage(image_wood_good);
      } else if (item['style'] === 'wood_mid') {
        sprite = new PIXI.Sprite.fromImage(image_wood_mid);
      } else if (item['style'] === 'wood_low') {
        sprite = new PIXI.Sprite.fromImage(image_wood_low);
      } else {
        sprite = new PIXI.Sprite.fromImage(image_wood_empty);
      }

      sprite.x = 0, sprite.y = 0;
      sprite.width = this.opt.width - 4;
      sprite.height = this.opt.height;

      return sprite;
    }
  }]);
  return HistogramItem;
}(HistogramItemBase);

var ScaleShape = function () {
    function ScaleShape(sprite) {
        classCallCheck(this, ScaleShape);

        this.sprite = sprite;
        this._width = sprite.width;
        this._height = sprite.height;
        this.whRatio = this._width / this._height;
        this.width = this._width;
        this.height = this._height;
        this._set();
    }

    createClass(ScaleShape, [{
        key: "fixedWidth",
        value: function fixedWidth(w) {
            this.width = w;
            this.height = w / this.whRatio;
            this._set();
        }
    }, {
        key: "fixedHeight",
        value: function fixedHeight(h) {
            this.width = h * this.whRatio;
            this.height = h;
            this._set();
        }
    }, {
        key: "_set",
        value: function _set() {
            this.sprite.width = this.width;
            this.sprite.height = this.height;
        }
    }]);
    return ScaleShape;
}();

/**
 * 获取拖动初始化参数
 * 
 * @returns
 */
function getDragInitOption() {
  return {
    action_down: true,
    action_move: false,
    action_up: false,
    startX: 0,
    startOffsetX: 0, //容器起始偏移量
    scrollbarStartOffsetX: 0, //滚动条起始偏移量
    moveCount: 0
  };
}

var DragUtils = {
  down: function down(event) {
    var currentTaret = event.currentTarget;
    currentTaret.dragOpt = getDragInitOption();
    var point = event.data.getLocalPosition(currentTaret.parent);
    currentTaret.dragOpt.startX = point.x;
    currentTaret.dragOpt.startOffsetX = currentTaret.x;
    currentTaret.dragOpt.scrollbarStartOffsetX = this.scrollbar ? this.scrollbar.x : 0;
  },
  up: function up(event) {
    var currentTaret = event.currentTarget;
    if (currentTaret.dragOpt) {
      delete currentTaret.dragOpt;
    }
  }
};

/**
 * 柱状图组件
 * 
 * @export
 * @class ColumnarComponent
 */

var ColumnarComponent = function () {
  function ColumnarComponent(context, stage) {
    classCallCheck(this, ColumnarComponent);

    this.context = context;
    this.stage = stage;
    this.histogramContainer = new PIXI.Container(); //右侧背景容器;
    this.leftBtn = new PIXI.Sprite();
    this.rightBtn = new PIXI.Sprite();
    this.scroll = new PIXI.Container();
    this.scrollbar = null;
    this.leftBtnCallback = null;
    this.rightBtnCallback = null;
    this.scrollCallback = null;
    this.dragCallback = null;
    this.allowDefaultDrag = true; //允许默认的拖动行为
    this.actionMoveCallback = null;
    this.pageWidth = 0;
    this.maskX = 0;
    this.histogramHeight = 0;
    this.histograms = [];
    this.init();
  }

  createClass(ColumnarComponent, [{
    key: 'init',
    value: function init() {
      this.leftBtn.interactive = true;
      this.leftBtn.buttonMode = true;
      this.rightBtn.interactive = true;
      this.rightBtn.buttonMode = true;
    }

    /**
     * 设置柱状图容器的位置和宽高
     * 
     * @param {any} x
     * @param {any} y
     * @param {any} width
     * @param {any} height
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'sethistogramContainer',
    value: function sethistogramContainer(x, y, width, height) {
      this.histogramContainer.width = width;
      this.histogramContainer.height = height; //高度
      this.histogramContainer.x = x;
      this.histogramContainer.y = y;

      this.stage && this.stage.addChild(this.histogramContainer);
    }

    /**
     * 设置mask位置和宽高
     * 
     * @param {any} x
     * @param {any} y
     * @param {any} width
     * @param {any} height
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'sethistogramContainerMask',
    value: function sethistogramContainerMask(x, y, width, height) {
      this.maskX = x;
      this.pageWidth = width;
      var mask = new PIXI.Graphics();
      mask.beginFill(0xffffff, 0);
      mask.drawRect(x, y, width, height); //遮罩，限制左右两边超出隐藏
      mask.endFill();
      this.histogramContainer.mask = mask;
      this.stage && this.stage.addChild(mask);
    }
  }, {
    key: 'addHistogram',
    value: function addHistogram(histogram) {
      if (histogram instanceof HistogramItemBase) {
        this.histogramHeight = histogram.height;
        this.histograms.push(histogram);
      }
    }
  }, {
    key: 'startHistogramAnim',
    value: function startHistogramAnim() {
      var _this = this;

      setTimeout(function () {
        _this.setDragEvent();
      }, 500);

      var i = 0,
          len = this.histograms.length;
      var histogram = void 0;
      for (; i < len; i++) {
        histogram = this.histograms[i];
        histogram.startAnim();
      }
    }

    /**
     * 设置拖动事件
     * 
     *  
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'setDragEvent',
    value: function setDragEvent() {
      //加一个遮罩层，填充容器，使容器中任何位置都可以接受事件
      var dragPanel = new PIXI.Graphics();
      dragPanel.beginFill(0xffffff, 0);
      dragPanel.drawRect(this.maskX, 0, this.histogramContainer.width, this.histogramContainer.height);
      dragPanel.endFill();
      this.histogramContainer.addChildAt(dragPanel, 0);
      this.histogramContainer.interactive = true;
      this.histogramContainer.on("pointerdown", DragUtils.down.bind(this));
      this.histogramContainer.on("pointerup", DragUtils.up.bind(this));
      this.histogramContainer.on("pointerupoutside", DragUtils.up.bind(this));
      if (typeof this.actionMoveCallback === 'function') {
        this.histogramContainer.on("pointermove", this.actionMoveCallback);
      } else {
        this.histogramContainer.on("pointermove", this.onDragMoveDefault.bind(this));
      }
    }
  }, {
    key: 'onDragMoveDefault',
    value: function onDragMoveDefault(event) {
      var currentTaret = event.currentTarget;
      if (!currentTaret.dragOpt) {
        return;
      } else if (currentTaret.dragOpt && !currentTaret.dragOpt.action_down) {
        return;
      }
      if (this.histogramContainer.width < this.pageWidth) {
        return;
      }
      currentTaret.dragOpt.moveCount++;
      var point = event.data.getLocalPosition(currentTaret.parent);
      var offsetX = point.x - currentTaret.dragOpt.startX;
      var targetX = currentTaret.dragOpt.startOffsetX + offsetX;
      if (targetX > 0) {
        targetX = 0;
        this.enableLeftBtn(false);
        this.enableRightBtn(true);
      } else if (this.histogramContainer.width + targetX <= this.pageWidth) {
        targetX = -(this.histogramContainer.width - this.pageWidth);
        this.enableLeftBtn(true);
        this.enableRightBtn(false);
      } else {
        this.enableLeftBtn(true);
        this.enableRightBtn(true);
      }
      if (this.allowDefaultDrag) {
        currentTaret.x = targetX;
        this.scrollbar.x = this.getScrollbarPosition();
      }
      if (typeof this.dragCallback === 'function') {
        this.dragCallback(targetX);
      }
    }

    /**
     * 设置允许默认的拖动行为
     * 
     * @param {any} allow
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'setAllowDefaultDrag',
    value: function setAllowDefaultDrag(allow, _actionMoveCallback) {
      this.allowDefaultDrag = allow;
      this.actionMoveCallback = _actionMoveCallback;
    }

    /**
     * 设置柱状图移动回调
     * 
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'setDragCallback',
    value: function setDragCallback(callback) {
      this.dragCallback = callback;
    }
  }, {
    key: 'setHistograms',
    value: function setHistograms(fn) {
      if (typeof fn == 'function') {
        fn(this.histogramContainer);
      }
    }
  }, {
    key: 'enableLeftBtn',
    value: function enableLeftBtn(enable) {
      this.leftBtn.interactive = enable;
      this.leftBtn.buttonMode = enable;
      this.leftBtn.texture = enable ? this.leftBtn.normalTexture : this.leftBtn.activeTexture;
    }
  }, {
    key: 'enableRightBtn',
    value: function enableRightBtn(enable) {
      this.rightBtn.interactive = enable;
      this.rightBtn.buttonMode = enable;
      this.rightBtn.texture = enable ? this.rightBtn.normalTexture : this.rightBtn.activeTexture;
    }

    /**
     * 
     * 
     * @param {any} x
     * @param {any} y
     * @param {any} normalTexture
     * @param {any} activeTexture
     * @param {any} [isActive=callback]
     * @param {any} anim
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'setLeftBtn',
    value: function setLeftBtn(x, y, normalTexture, activeTexture, isActive, callback, anim) {
      var _this2 = this;

      var _callback = arguments[5];
      var _anim = arguments[6];

      this.leftBtn.alpha = 0;
      this.leftBtn.x = x;
      this.leftBtn.y = y;
      this.leftBtn.normalTexture = normalTexture;
      this.leftBtn.activeTexture = activeTexture;
      this.leftBtnCallback = _callback || this.onPageChangeDefault.bind(this);
      this.stage && this.stage.addChild(this.leftBtn);

      this.enableLeftBtn(isActive);

      if (typeof _anim == 'function') {
        setTimeout(function () {
          _this2.leftBtn.alpha = 1;
          _anim(_this2.leftBtn);
        }, 500);
      }

      this.leftBtn.on('pointerdown', function (event) {
        this.leftBtn.texture = this.leftBtn.activeTexture;
      }.bind(this));

      this.leftBtn.on('pointerup', function (event) {
        this.leftBtn.texture = this.leftBtn.normalTexture;
        this.leftBtnCallback(this, false);
      }.bind(this));
    }

    /**
     * 
     * 
     * @param {any} x
     * @param {any} y
     * @param {any} normalTexture
     * @param {any} activeTexture
     * @param {any} isActive
     * @param {any} callback
     * @param {any} anim
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'setRightBtn',
    value: function setRightBtn(x, y, normalTexture, activeTexture, isActive, callback, anim) {
      var _this3 = this;

      var _callback = arguments[5];
      var _anim = arguments[6];

      this.rightBtn.alpha = 0;
      this.rightBtn.x = x;
      this.rightBtn.y = y;
      this.rightBtn.normalTexture = normalTexture;
      this.rightBtn.activeTexture = activeTexture;
      this.rightBtnCallback = _callback || this.onPageChangeDefault.bind(this);
      this.stage && this.stage.addChild(this.rightBtn);

      this.enableRightBtn(isActive);

      if (typeof _anim == 'function') {
        setTimeout(function () {
          _this3.rightBtn.alpha = 1;
          _anim(_this3.rightBtn);
        }, 500);
      }

      this.rightBtn.on('pointerdown', function (event) {
        this.rightBtn.texture = activeTexture;
      }.bind(this));

      this.rightBtn.on('pointerup', function (event) {
        this.rightBtn.texture = normalTexture;
        this.rightBtnCallback(this, true);
      }.bind(this));
    }

    /**
     * 设置滚动条
     * 
     * @param {any} bar
     * @param {any} background
     * @param {any} opt (可选)
     * @param {any} fn (可选)
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'setScroll',
    value: function setScroll(bar, background) {
      var _this4 = this;

      var _opt = null;
      var _fn = null;

      this.scrollbar = bar;
      this.scrollbg = background;
      this.scroll.addChild(background, bar);
      this.stage && this.stage.addChild(this.scroll);

      if (arguments.length == 3) {
        if (arguments[2] && typeof arguments[2] == 'function') {
          _fn = arguments[2];
        } else if (arguments[2] && _typeof(arguments[2]) == 'object') {
          _opt = arguments[2];
        }
      } else if (arguments.length == 4) {
        _opt = arguments[2];
        _fn = arguments[3];
      }

      this.setScrollDefault();

      if (_opt) {
        this.scroll.x = _opt.x || this.scroll.x;
        this.scroll.y = _opt.y || this.scroll.y;
      }

      this.scroll.alpha = 0;
      setTimeout(function () {
        _this4.scroll.alpha = 1;
        if (_fn) {
          _fn(_this4.scroll);
        } else {
          _this4.startScrollAnimDefault(_this4.scroll);
        }
      }, 800);
    }

    /**
     * callback不要用箭头函数
     * 
     * @param {any} callback
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'onScrolling',
    value: function onScrolling(callback) {
      this.scrollbar.interactive = true;
      this.scrollbar.buttonMode = true;

      var _self = this;

      _self.scrollCallback = callback.bind(_self.scrollbar);
      this.scrollbar.on('pointermove', function (event) {
        _self.scrollCallback(event, _self);
      }.bind(this.scrollbar));
    }

    /**
     * 滚动图默认动效
     * 
     * @param {any} scroll
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'startScrollAnimDefault',
    value: function startScrollAnimDefault(scroll) {
      var speedY = 10,
          frameNum = 12,
          unitDeg = Math.PI / 180,
          speedRotation = unitDeg;
      var targetX = scroll.x;
      var targetY = scroll.y;
      var startY = targetY + speedY * frameNum;
      var startRotation = speedRotation * frameNum;
      var ticker$$1 = new PIXI.ticker.Ticker();
      scroll.y = startY;
      scroll.rotation = startRotation;
      ticker$$1.add(function () {
        if (scroll.y <= targetY) {
          scroll.y = targetY;
          scroll.rotation = 0;
          ticker$$1.stop();
          ticker$$1.destroy();
          return;
        }
        scroll.y -= speedY;
        scroll.rotation -= speedRotation;
      });
      ticker$$1.start();
    }

    /**
     * 设置默认的滚动条
     * 
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'setScrollDefault',
    value: function setScrollDefault() {
      var _self = this;
      var histogramContainer = this.histogramContainer;
      var scrollbar = this.scrollbar;
      var scrollbg = this.scrollbg;
      var scroll = this.scroll;
      var maskWidth = histogramContainer.mask.width;
      var maskX = this.maskX;
      var histogramHeight = this.histogramHeight;

      //设置滚动条可交互
      scrollbar.interactive = true;
      scrollbar.buttonMode = true;

      scrollbg.scaleShape = new ScaleShape(scrollbg);
      scrollbg.scaleShape.fixedWidth(maskWidth);

      scrollbar.scaleShape = new ScaleShape(scrollbar);
      scrollbar.scaleShape.fixedWidth(scrollbg.width * (maskWidth / histogramContainer.width));
      scrollbar.height = scrollbg.height;
      scrollbar.startOffsetX = 0;

      //设置滚动条大小和位置
      //scrollbg.width = maskWidth;
      //scrollbar.width = scrollbg.width * (maskWidth / histogramContainer.width);
      scrollbg.x = 0, scrollbar.x = 0;
      scroll.width = maskWidth;
      scroll.x = maskX;
      scroll.y = histogramContainer.y + histogramHeight + 3 * scrollbg.height;

      //设置滚动条事件
      _self.scrollCallback = _self.onScrollingDefault.bind(scrollbar);
      scrollbar.on('pointerdown', function (event) {
        this.draging = true;
        this.startPosition = event.data.getLocalPosition(this.parent);
        this.startOffsetX = this.x;
        histogramContainer.startOffsetX = histogramContainer.x; //保存柱状图容器开始时的位置
      }.bind(scrollbar));
      scrollbar.on('pointerup', function (event) {
        this.draging = false;
        this.data = null;
      }.bind(scrollbar));
      scrollbar.on('pointerupoutside', function (event) {
        this.draging = false;
        this.data = null;
      }.bind(scrollbar));
      scrollbar.on('pointermove', function (event) {
        _self.scrollCallback(event, _self);
      }.bind(scrollbar));
    }

    /**
     * 默认的滚动条事件
     * 
     * @param {any} event
     * @param {any} component
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'onScrollingDefault',
    value: function onScrollingDefault(event, component) {
      if (this.draging) {
        this.draging = true;
        var maxWidth = this.parent.width;
        var newPosition = event.data.getLocalPosition(this.parent);
        var startPosition = this.startPosition;
        var offsetX = newPosition.x - startPosition.x;
        this.x = this.startOffsetX + offsetX;
        if (this.x < 0) {
          this.x = 0;
          component.histogramContainer.x = 0;
          component.enableLeftBtn(false);
          component.enableRightBtn(true);
        } else if (this.x + this.width > maxWidth) {
          this.x = maxWidth - this.width;
          component.histogramContainer.x = component.histogramContainer.mask.width - component.histogramContainer.width;
          component.enableLeftBtn(true);
          component.enableRightBtn(false);
        } else {
          component.histogramContainer.x = component.histogramContainer.startOffsetX - component.histogramContainer.width * (offsetX / maxWidth);
          component.enableLeftBtn(true);
          component.enableRightBtn(true);
        }
      }
    }

    /**
     * 默认的左右按钮点击事件处理
     * 
     * @param {any} component
     * @param {any} toRight
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'onPageChangeDefault',
    value: function onPageChangeDefault(component, toRight) {
      var ticker$$1 = void 0,
          dis = void 0,
          speed = 20;
      var container = component.histogramContainer;
      var pageWidth = component.pageWidth;
      if (toRight) {
        //向右
        if (container.x - pageWidth < -container.width) {
          return;
        }
        ticker$$1 = new PIXI.ticker.Ticker();
        var minX = pageWidth - container.width;
        container.targetX = container.x - pageWidth < minX ? minX : container.x - pageWidth;
        container.moving = true;
        ticker$$1.add(function () {
          container.x -= speed;
          if (container.x <= container.targetX) {
            container.x = container.targetX;
            container.moving = false;
            if (container.x - pageWidth <= -container.width) {
              component.enableRightBtn(false);
              component.enableLeftBtn(true);
            } else {
              component.enableRightBtn(true);
              if (container.x < 0) {
                component.enableLeftBtn(true);
              }
            }
            ticker$$1.stop();
            ticker$$1.destroy();
          }
          component.scrollbar.x = component.getScrollbarPosition();
        });
        ticker$$1.start();
      } else {
        //向左
        if (container.x >= 0) {
          container.x = 0;
          return;
        }
        ticker$$1 = new PIXI.ticker.Ticker();
        container.targetX = container.x + pageWidth < 0 ? container.x + pageWidth : 0;
        container.moving = true;
        ticker$$1.add(function () {
          container.x += speed;
          if (container.x >= container.targetX) {
            container.x = container.targetX;
            container.moving = false;
            if (container.x >= 0) {
              component.enableLeftBtn(false);
              component.enableRightBtn(true);
            } else {
              component.enableLeftBtn(true);
              component.enableRightBtn(true);
            }
            ticker$$1.stop();
            ticker$$1.destroy();
          }
          component.scrollbar.x = component.getScrollbarPosition();
        });
        ticker$$1.start();
      }
    }

    /**
     * 根据当前柱状图容器的状态，算出滚动条的位置
     * 
     * @returns
     * 
     * @memberOf ColumnarComponent
     */

  }, {
    key: 'getScrollbarPosition',
    value: function getScrollbarPosition() {
      var cX = -this.histogramContainer.x;
      var mW = this.histogramContainer.mask.width;
      var barW = this.scrollbar.width;
      var barX = cX * barW / mW;
      return barX;
    }
  }, {
    key: 'getHistogramContainer',
    value: function getHistogramContainer() {
      return this.histogramContainer;
    }
  }]);
  return ColumnarComponent;
}();

var OpenAnimComounent = function () {
  function OpenAnimComounent(container, config) {
    classCallCheck(this, OpenAnimComounent);

    this.config = config;
    this.frames = [];
    this.frameCount = 0;
    this.anim = null;
    this.normalWidth = 0;
    this.normalHeight = 0;
    this.normalScale = 1;
    this.container = container;
    this.finishCallback = null;
    this.frameChangeCallback = null;
    this.init();
  }

  createClass(OpenAnimComounent, [{
    key: "init",
    value: function init() {
      var config = PIXI.loader.resources[this.config];
      if (!config) {
        throw new Error("no config json");
      }
      var frames = config.data.frames;
      var frame = void 0;
      for (var f in frames) {
        frame = PIXI.Texture.fromFrame(f);
        this.frames.push(frame);
      }
      this.frameCount = this.frames.length;
      this.anim = new PIXI.extras.AnimatedSprite(this.frames);
      this.container.addChild(this.anim);
    }

    /**
     * 设置是否循环
     * 
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "setSize",


    /**
     * 设置大小
     * 
     * @param {any} w
     * @param {any} h
     * @returns
     * 
     * @memberOf OpenAnimComounent
     */
    value: function setSize(w, h) {
      if (this.anim) {
        this.anim.width = w;
        this.anim.height = h;
        this.normalWidth = this.anim.width;
        this.normalHeight = this.anim.height;
        this.normalScale = scale;
      }
      return this;
    }

    /**
     * 固定宽度缩放
     * 
     * @param {any} limitWidth
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "fixedWidth",
    value: function fixedWidth(limitWidth) {
      var animWidth = this.anim.width;
      var animHeight = this.anim.height;
      var scale = limitWidth / animWidth;
      this.anim.width = limitWidth;
      this.anim.height = scale * animHeight;
      this.normalWidth = this.anim.width;
      this.normalHeight = this.anim.height;
      this.normalScale = scale;
    }

    /**
     * 固定高度缩放
     * 
     * @param {any} limitHeight
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "fixedHeight",
    value: function fixedHeight(limitHeight) {
      var animWidth = this.anim.width;
      var animHeight = this.anim.height;
      var scale = limitHeight / animHeight;
      this.anim.height = limitHeight;
      this.anim.width = scale * animWidth;
      this.normalWidth = this.anim.width;
      this.normalHeight = this.anim.height;
      this.normalScale = scale;
    }

    /**
     * 设置位置
     * 
     * @param {any} x
     * @param {any} y
     * @returns
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "setPosition",
    value: function setPosition(x, y) {
      if (this.anim) {
        this.anim.x = x;
        this.anim.y = y;
      }
      return this;
    }

    /**
     * 设置锚点
     * 
     * @param {any} x
     * @param {any} y
     * @returns
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "setAnchor",
    value: function setAnchor(x, y) {
      this.anim && this.anim.anchor.set(x, y);
      return this;
    }

    /**
     * 动画结束回调
     * 
     * @param {any} callback
     * @returns
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "onFinish",
    value: function onFinish(callback) {
      this.finishCallback = callback;
      return this;
    }

    /**
     * 帧动画执行过程回调
     * 
     * @param {any} callback
     * @returns
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "onFrameChange",
    value: function onFrameChange(callback) {
      this.frameChangeCallback = callback;
      return this;
    }

    /**
     * 缩放
     * 
     * @param {any} scale
     * @returns
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "setScale",
    value: function setScale(x, y) {
      if (this.anim) {
        this.anim.scale.x = this.normalScale * x;
        this.anim.scale.y = this.normalScale * y;
      }
      return this;
    }
  }, {
    key: "gotoAndStop",
    value: function gotoAndStop(frameNumber) {
      this.anim && this.anim.gotoAndStop(frameNumber);
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "start",
    value: function start() {
      if (this.anim) {
        this.anim.onComplete = this._onComplete.bind(this);
        this.anim.onFrameChange = this._onFrameChange.bind(this);
        this.anim.play();
      }
      return this;
    }

    /**
     * 销毁实例
     * 
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.anim && this.anim.destroy();
      this.frames = null;
      this.finishCallback = null;
      this.anim = null;
    }
  }, {
    key: "_onComplete",
    value: function _onComplete() {
      this.finishCallback && this.finishCallback();
    }
  }, {
    key: "_onFrameChange",
    value: function _onFrameChange(index) {
      this.frameChangeCallback && this.frameChangeCallback(this, index, this.frameCount);
    }
  }, {
    key: "loop",
    set: function set$$1(loop) {
      this.anim.loop = loop;
    }
  }, {
    key: "animationSpeed",
    set: function set$$1(speed) {
      if (this.anim) {
        this.anim.animationSpeed = speed;
      }
    }

    /**
     * 设置透明度
     * 
     * 
     * @memberOf OpenAnimComounent
     */

  }, {
    key: "alpha",
    set: function set$$1(alpha) {
      if (this.anim) {
        this.anim.alpha = alpha;
      }
    },
    get: function get$$1() {
      return this.anim.alpha;
    }
  }]);
  return OpenAnimComounent;
}();

var ForestDiagram = function (_DiagramBase) {
  inherits(ForestDiagram, _DiagramBase);

  function ForestDiagram(classWrap) {
    classCallCheck(this, ForestDiagram);
    return possibleConstructorReturn(this, (ForestDiagram.__proto__ || Object.getPrototypeOf(ForestDiagram)).call(this, classWrap));
  }

  /**
   * 子类需要实现
   * 
   * @param {any} accuracy
   * @returns
   * 
   * @memberOf ForestDiagram
   */


  createClass(ForestDiagram, [{
    key: '$getHistogramStyle',
    value: function $getHistogramStyle(accuracy) {
      get(ForestDiagram.prototype.__proto__ || Object.getPrototypeOf(ForestDiagram.prototype), '$getHistogramStyle', this).call(this, accuracy);
      if (accuracy >= 85) {
        return 'wood_good';
      } else if (accuracy >= 60) {
        return 'wood_mid';
      } else {
        return 'wood_low';
      }
    }

    /**
     * 执行开场动画（松鼠）
     * 
     * 
     * @memberOf ForestDiagram
     */

  }, {
    key: '$startOpenAnimation',
    value: function $startOpenAnimation(stage) {
      this.defers.openAnimDefer = $.Deferred();
      var defer = this.defers.openAnimDefer;

      var config = this.getAnimtionConfig("squirrel");
      var openanim = new OpenAnimComounent(stage, config);
      var x = this.options.chartSideWidth / 2;
      var y = this.options.chartSideHeight / 2 - this.options.chartSideHeight / 6;
      var scale = 1;
      openanim.loop = false;
      openanim.animationSpeed = 0.5;
      openanim.setPosition(x, y);
      openanim.fixedWidth(this.options.chartSideWidth * 1.2);
      openanim.setAnchor(0.7, 0.5);
      openanim.onFinish(function () {
        openanim.destroy();
        defer.resolve();
      });
      openanim.onFrameChange(function (sprite, index, len) {
        if (index <= 37) {
          scale = 1;
        } else if (index < 45) {
          scale -= 0.023;
        } else if (index < 50) {
          scale += 0.032;
        } else if (index > 58) {
          scale -= 0.035;
          sprite.alpha -= 0.032;
        }
        sprite.setScale(scale, scale);
      });
      openanim.start();

      return defer.promise();
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf ForestDiagram
     */

  }, {
    key: '$startPieAnimation',
    value: function $startPieAnimation() {
      return get(ForestDiagram.prototype.__proto__ || Object.getPrototypeOf(ForestDiagram.prototype), '$startPieAnimation', this).call(this);
    }
  }, {
    key: 'getAccuracyColor',
    value: function getAccuracyColor() {
      return 0xd56c24;
    }
  }, {
    key: 'getPieColor',
    value: function getPieColor() {
      var COLOR = {
        right: 0xD56C24,
        wrong: 0x7A2113,
        undo: 0xC4C4C4
      };
      return COLOR;
    }
  }, {
    key: 'getTextColor',
    value: function getTextColor() {
      var COLOR = {
        right: {
          text: 0xD56C24,
          person: 0x907e69
        },
        wrong: {
          text: 0x7A2113,
          person: 0x907e69
        },
        undo: {
          text: 0x5F5E5C,
          person: 0x907e69
        }
      };
      return COLOR;
    }

    /**
     * 执行右侧背景动画
     * 
     * 
     * @memberOf ForestDiagram
    * */

  }, {
    key: '$startRightBackgroundAnimation',
    value: function $startRightBackgroundAnimation(stage) {

      var container = new PIXI.Container(); //右侧背景容器
      container.x = this.options.chartSideWidth;
      container.width = this.options.chartContainerWidth;
      container.height = this.options.chartContainerHeight;
      stage.addChild(container);

      this.drawMonkey(container);
      this.drawTopGrass(container);
      this.drawButterfly(container);
    }

    /**
     * 画猴子
     * 
     * @param {any} container
     * 
     * @memberOf ForestDiagram
     */

  }, {
    key: 'drawMonkey',
    value: function drawMonkey(container) {
      var baseUrl = this.options.chartInfo.baseUrl;
      var image_monkey = this.getImagePath('monkey');
      var sprite = new PIXI.Sprite.fromImage(image_monkey);
      sprite.scaleShape = new ScaleShape(sprite);
      sprite.scaleShape.fixedWidth(this.options.chartContainerWidth * 0.15);

      var curRotation = 0,
          time = 0;
      var step = Math.PI / 180; //1度对应的弧度
      var maxRadians = Math.PI / 12; //最大摆动角度
      var skew = Math.PI / 90; //偏移角度
      sprite.x = container._width / 8;
      sprite.y = -sprite.height / 10;
      //sprite.scale.x = 0.9, sprite.scale.y = 1;
      sprite.rotation = curRotation;

      var ticker$$1 = new PIXI.ticker.Ticker();
      this.tickers.push(ticker$$1); //加入定时器数组管理
      ticker$$1.speed = 0.75;
      ticker$$1.add(function () {
        curRotation = maxRadians * Math.sin(time * step) + skew;
        time++;
        sprite.rotation = curRotation;
      });
      ticker$$1.start();

      container.addChild(sprite);
    }

    /**
     * 画顶部的草
     * 
     * 
     * @memberOf ForestDiagram
     */

  }, {
    key: 'drawTopGrass',
    value: function drawTopGrass(container) {
      var baseUrl = this.options.chartInfo.baseUrl;
      var image_grass = this.getImagePath('grass');
      var sprite = new PIXI.Sprite.fromImage(image_grass);
      sprite.scaleShape = new ScaleShape(sprite);
      sprite.scaleShape.fixedWidth(this.options.chartContainerWidth * 0.25);

      sprite.x = container._width / 10;
      sprite.y = -25;

      container.addChild(sprite);
    }

    /**
     * 画蝴蝶
     * 
     * @param {any} container
     * 
     * @memberOf ForestDiagram
     */

  }, {
    key: 'drawButterfly',
    value: function drawButterfly(container) {
      var baseUrl = this.options.chartInfo.baseUrl;

      var image_butterfly1 = this.getImagePath('butterfly1');
      var sprite1 = new PIXI.Sprite.fromImage(image_butterfly1);
      var orix1 = container._width / 20,
          oriy1 = sprite1.height / 8;
      sprite1.x = orix1;
      sprite1.y = oriy1;
      sprite1.scale.x = 1, sprite1.scale.y = 1;

      var image_butterfly2 = this.getImagePath('butterfly2');
      var sprite2 = new PIXI.Sprite.fromImage(image_butterfly2);
      var orix2 = container._width - sprite2.width,
          oriy2 = (container._height - sprite2.height) / 2;
      sprite2.x = orix2;
      sprite2.y = oriy2;
      sprite1.scale.x = 1, sprite2.scale.y = 1;

      var time = 0;
      var step = Math.PI / 180; //1度对应的弧度
      var maxDisX = 10,
          maxDisY = 5; //幅值
      var c = 5; //偏移量

      var ticker$$1 = new PIXI.ticker.Ticker();
      this.tickers.push(ticker$$1); //加入定时器数组管理
      ticker$$1.speed = 0.3;
      ticker$$1.add(function () {
        var sin = Math.sin(time * step),
            cos = Math.cos(time * step);
        var disx = maxDisX * sin + c;
        var disy = maxDisY * cos - c;
        sprite1.x = orix1 + disx, sprite1.y = oriy1 - disy;
        sprite2.x = orix2 + disx, sprite2.y = oriy2 - disy;
        if (time % 7 == 0) {
          sprite1.scale.x = Math.abs(sin) / 10 + 0.8, sprite1.scale.y = Math.abs(cos) / 10 + 0.9;
          sprite2.scale.x = Math.abs(cos) / 10 + 0.7, sprite2.scale.y = Math.abs(sin) / 10 + 0.9;
        }
        time++;
      });
      ticker$$1.start();

      container.addChild(sprite1);
      container.addChild(sprite2);
    }

    /**
     * 执行柱状图动画(包括顶部标题，柱状图，滚动条，以及翻页按钮)
     * 
     * 
     * @memberOf ForestDiagram
     */

  }, {
    key: '$startHistogramAnimation',
    value: function $startHistogramAnimation() {
      if (!this.mainApp.stage || !this.subApp.stage) {
        return;
      }
      this.drawTitle(this.mainApp.stage);
      this.$drawHistogramArea(this.subApp.stage);
    }

    /**
     * 画标题
     * 
     * 
     * @memberOf ForestDiagram
     */

  }, {
    key: 'drawTitle',
    value: function drawTitle(stage) {

      var image_title = this.getImagePath('title');
      var sprite = new PIXI.Sprite.fromImage(image_title);
      sprite.scaleShape = new ScaleShape(sprite);
      sprite.scaleShape.fixedWidth(this.options.chartContainerWidth * 0.35);

      var c = -sprite.height,
          curY = c;
      var endY = 0;
      var time = 0,
          a = Math.PI / 20,
          A = 15,
          c2 = 0,
          stopTime = 40;
      var isStep1 = true; //第一阶段

      sprite.x = this.options.chartSideWidth + (this.options.chartContainerWidth - sprite.width) / 2;
      sprite.y = curY;

      var tween = new TWEEN.Tween(sprite);
      tween.to({
        y: endY
      }, 1500);
      tween.easing(TWEEN.Easing.Elastic.Out);
      tween.start();

      stage.addChild(sprite);
    }

    /**
     * 画柱状图区域(包括柱状图，翻页按钮和滚动条)
     * 
     * 
     * @memberOf ForestDiagram
     */

  }, {
    key: '$drawHistogramArea',
    value: function $drawHistogramArea(stage) {

      get(ForestDiagram.prototype.__proto__ || Object.getPrototypeOf(ForestDiagram.prototype), '$drawHistogramArea', this).call(this);

      var image_wood_good = this.getImagePath('wood_good');
      var image_wood_mid = this.getImagePath('wood_mid');
      var image_wood_low = this.getImagePath('wood_low');
      var image_wood_empty = this.getImagePath('wood_empty');
      var image_btn_left = this.getImagePath('btn_left');
      var image_btn_left_active = this.getImagePath('btn_left_active');
      var image_btn_right = this.getImagePath('btn_right');
      var image_btn_right_active = this.getImagePath('btn_right_active');
      var image_bg_scroll = this.getImagePath('bg_scroll');
      var image_bg_scroll_on = this.getImagePath('bg_scroll_on');

      var maskWidth = this.options.chartContainerWidth * 3 / 5; //mask为真实可视区域
      var maskX = this.options.chartContainerWidth / 5;
      var histogramHeight = this.options.chartContainerHeight * 2 / 5; //柱子的高度

      var columnarComponent = new ColumnarComponent(this, stage);

      columnarComponent.sethistogramContainerMask(maskX, 0, maskWidth, this.options.chartContainerHeight);
      columnarComponent.sethistogramContainer(0, this.options.chartContainerHeight / 3, this.options.chartContainerWidth, histogramHeight * 2);

      var unitWidth = maskWidth / 23; //单位宽度为宽度的23（8跟柱子，每根柱子间隙为柱子宽度的1/3）分之一
      var startX = maskX;
      var questions = this.questions;
      var i = void 0,
          len = questions.length,
          item = void 0,
          histogram = void 0;

      for (i = 0; i < len; i++) {
        item = questions[i];
        var opt = {
          'x': startX,
          'y': histogramHeight,
          'width': unitWidth * 2,
          'height': histogramHeight,
          'baseUrl': this.options.chartInfo.baseUrl,
          'config': this.options.config
        };
        histogram = new HistogramItem(this, columnarComponent.getHistogramContainer(), item, opt);
        columnarComponent.addHistogram(histogram);
        startX += unitWidth * 3 - 1;
      }
      columnarComponent.startHistogramAnim();

      if (len > 8) {
        //超过8个柱子，需要左右翻页按钮和滚动条

        var offsetUnit = 8,
            buttonFrames = 25,
            alphaSpeed = 0.035;

        var leftTexture = new PIXI.Texture.fromImage(image_btn_left);
        var leftActiveTexture = new PIXI.Texture.fromImage(image_btn_left_active);
        var leftBtnX = this.options.chartContainerWidth / 8 - leftTexture.width / 2;
        var leftBtnY = this.options.chartContainerHeight / 2;

        columnarComponent.setLeftBtn(leftBtnX, leftBtnY, leftTexture, leftActiveTexture, false, null, function (btn) {
          var ticker$$1 = new PIXI.ticker.Ticker();
          var startX = leftBtnX + offsetUnit * buttonFrames;
          var startAlpha = 1 - buttonFrames * alphaSpeed;
          btn.alpha = startAlpha;
          btn.x = startX;

          var leftInterpolator = new ReductionInterpolator(startX, leftBtnX, buttonFrames);
          leftInterpolator.onUpdate(function (val, time) {
            btn.x = val;
            btn.alpha = time / buttonFrames;
          });
          leftInterpolator.execute();
          ticker$$1.add(function () {
            if (leftInterpolator.isFinish) {
              ticker$$1.stop();
              ticker$$1.destroy();
              return;
            } else {
              leftInterpolator.update();
            }
          });
          ticker$$1.start();
        });
        columnarComponent.leftBtn.scaleShape = new ScaleShape(columnarComponent.leftBtn);
        columnarComponent.leftBtn.scaleShape.fixedWidth(this.options.chartContainerWidth * 0.065);

        var rightTexture = new PIXI.Texture.fromImage(image_btn_right);
        var rightTextureActive = new PIXI.Texture.fromImage(image_btn_right_active);
        var rightBtnX = this.options.chartContainerWidth * 7 / 8 - rightTexture.width / 2;
        var rightBtnY = this.options.chartContainerHeight / 2;
        columnarComponent.setRightBtn(rightBtnX, rightBtnY, rightTexture, rightTextureActive, true, null, function (btn) {
          var ticker$$1 = new PIXI.ticker.Ticker();
          var startX = rightBtnX - offsetUnit * buttonFrames;
          var startAlpha = 1 - buttonFrames * alphaSpeed;
          btn.alpha = startAlpha;
          btn.x = startX;

          var rightInterpolator = new ReductionInterpolator(startX, rightBtnX, buttonFrames);
          rightInterpolator.onUpdate(function (val, time) {
            btn.x = val;
            btn.alpha = time / buttonFrames;
          });
          rightInterpolator.execute();
          ticker$$1.add(function () {
            if (rightInterpolator.isFinish) {
              ticker$$1.stop();
              ticker$$1.destroy();
              return;
            } else {
              rightInterpolator.update();
            }
          });
          ticker$$1.start();
        });
        columnarComponent.rightBtn.scaleShape = new ScaleShape(columnarComponent.rightBtn);
        columnarComponent.rightBtn.scaleShape.fixedWidth(this.options.chartContainerWidth * 0.065);

        var scrollbar = new PIXI.Sprite.fromImage(image_bg_scroll_on);
        var scrollbg = new PIXI.Sprite.fromImage(image_bg_scroll);
        columnarComponent.setScroll(scrollbar, scrollbg, { 'y': this.options.chartContainerHeight * 0.8 });
      }
    }
  }, {
    key: '$destroy',
    value: function $destroy() {}
  }]);
  return ForestDiagram;
}(DiagramBase);

Midware.extendModuleDefine('forest', function () {
  return ForestDiagram;
});

}(PIXI,$,TWEEN,Midware));
