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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 29);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ClassroomUtil = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __context = {
  '_service_': {}
};

/**
 * 处理器基类
 * 
 * @class BaseHandler
 */

var BaseHandler = function () {
  function BaseHandler(context, container, option) {
    _classCallCheck(this, BaseHandler);

    this.name = null;
    this.mContext = context || __context;
    this.mContainer = container;
    this.mOption = option;
    this.$mContainer = $(container);
    this.v = null;
    this.env = "ppt";
    this._init();
  }

  _createClass(BaseHandler, [{
    key: '_init',
    value: function _init() {
      if (this.mOption) {
        if (this.mOption.env) {
          this.env = this.mOption.env;
        }
      }
    }
  }, {
    key: 'setName',
    value: function setName(n) {
      this.name = n;
    }

    /**
     * 送花
     * 
     * @param {any} users
     * 
     * @memberOf BaseHandler
     */

  }, {
    key: 'onSendFlower',
    value: function onSendFlower(users) {
      this.mContext.fireStuffEvent("FLOWER", users);
      if (window.PresenterFlowerTip) {
        window.PresenterFlowerTip((0, _ClassroomUtil.userIdToName)(users));
      }
    }

    /**
     * 关闭查看解析
     * 
     * 
     * @memberOf BaseHandler
     */

  }, {
    key: 'onCloseAnalysis',
    value: function onCloseAnalysis() {}
  }]);

  return BaseHandler;
}();

exports.BaseHandler = BaseHandler;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentStudents = exports.userIdToName = undefined;

var _$ = __webpack_require__(27);

var _$2 = _interopRequireDefault(_$);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = window.ClassroomUtils;
var _ = window._;

/**
 * 用户id转换为学生姓名
 */
function userIdToName(users) {
  var _users = [];
  if (utils && utils.getCurrentStudents && users instanceof Array) {
    _users = _$2.default.extend(true, [], users);
    var students = utils.getCurrentStudents();
    if (students instanceof Array) {
      for (var i = 0, ilen = _users.length; i < ilen; i++) {
        for (var j = 0, jlen = students.length; j < jlen; j++) {
          if (students[j]['studentId'] === _users[i]) {
            _users[i] = students[j]['studentName'];
            break;
          }
        }
      }
    }
  }
  return _users;
}

/**
 * 获取当前所有学生
 * 
 * @returns
 */
function getCurrentStudents() {
  var students = [];
  if (utils && utils.getCurrentStudents) {
    students = utils.getCurrentStudents();
  }
  return students;
}

exports.userIdToName = userIdToName;
exports.getCurrentStudents = getCurrentStudents;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = Vue;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _app = __webpack_require__(4);

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window['_ObjectiveRenderLauncher_'] = _app2.default;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vue = __webpack_require__(2);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(28);

var _vuex2 = _interopRequireDefault(_vuex);

var _HandleRouter = __webpack_require__(15);

var _HandleRouter2 = _interopRequireDefault(_HandleRouter);

var _StatisticsTitleHandler = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 统计组件启动器
 * 
 * @export
 * @class App
 */
var App = function () {
  function App(container, context, option) {
    _classCallCheck(this, App);

    this.titleVue = null; //用于统计顶部，时间和提交人数，渲染在com_layout_header节点上
    this.smallVue = null; //用于A,B,C,E类统计，渲染在statistics-area节点上
    this.bigVue = null; //用于F,G类统计,渲染在statistics-overview节点上 
    this.mContext = context;
    this.mContainer = container;
    this.mTitleHandler = new _StatisticsTitleHandler.StatisticsTitleHandler(context, container, option);
    this.mHandleRouter = new _HandleRouter2.default(this, container, context, option);
  }

  _createClass(App, [{
    key: 'handle',
    value: function handle(data, statisticClass) {
      var _data1 = $.extend(true, {}, data);
      var _data2 = $.extend(true, {}, data);
      this.renderTitle(_data1);
      this.mHandleRouter.router(_data2, statisticClass);
    }
  }, {
    key: 'renderTitle',
    value: function renderTitle(data) {
      this.mTitleHandler.render(this, data);
    }
  }, {
    key: 'gotoIndex',
    value: function gotoIndex() {
      var _handler = this.mHandleRouter.curHandler;
      _handler && _handler['gotoIndex'] && _handler['gotoIndex'].apply(_handler, arguments);
    }

    /**
     * 查看解析
     * 
     * 
     * @memberOf App
     */

  }, {
    key: 'showAnalysis',
    value: function showAnalysis() {
      var _handler = this.mHandleRouter.curHandler;
      _handler && _handler['showAnalysis'] && _handler['showAnalysis'].apply(_handler, arguments);
    }

    /**
     * 公布结果
     * 
     * 
     * @memberOf App
     */

  }, {
    key: 'showAnswer',
    value: function showAnswer() {
      var _handler = this.mHandleRouter.curHandler;
      _handler && _handler['showAnswer'] && _handler['showAnswer'].apply(_handler, arguments);
    }

    /**
     * 公布结果
     * 用于口头出题和截图发题
     * 
     * @memberOf App
     */

  }, {
    key: 'showRightAnswer',
    value: function showRightAnswer(correctAnswerDisplayCtrl) {
      var _handler = this.mHandleRouter.curHandler;
      _handler && _handler['showRightAnswer'] && _handler['showRightAnswer'].call(_handler, correctAnswerDisplayCtrl);
    }

    /**
     * 重置vue
     * 
     * 
     * @memberOf App
     */

  }, {
    key: 'reset',
    value: function reset() {}
  }]);

  return App;
}();

exports.default = App;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompoundHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseHandler2 = __webpack_require__(0);

var _CompoundHelper = __webpack_require__(16);

var CompoundHelper = _interopRequireWildcard(_CompoundHelper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CompoundOverView = 'ComplexStatistics:CompoundOverView'; //复合题统计答题详情组件
var CompoundAnswerDetail = 'ComplexStatistics:CompoundAnswerDetail'; //复合题统计总览
var CompoundUserList = 'ComplexStatistics:CompoundUserList'; //复合题统计学生列表
var deps = [CompoundOverView, CompoundAnswerDetail, CompoundUserList];

var template = __webpack_require__(23);

/**
 * 
 * mixmodule_content
 * @class CompoundHandler
 * @extends {BaseHandler}
 */

var CompoundHandler = function (_BaseHandler) {
  _inherits(CompoundHandler, _BaseHandler);

  function CompoundHandler(context, container, option) {
    _classCallCheck(this, CompoundHandler);

    var _this = _possibleConstructorReturn(this, (CompoundHandler.__proto__ || Object.getPrototypeOf(CompoundHandler)).call(this, context, container, option));

    _this.setName("CompoundHandler");
    return _this;
  }

  _createClass(CompoundHandler, [{
    key: 'preHandle',
    value: function preHandle(data) {
      this.$mContainer.closest(".com_layout").addClass("mixmodule_content");
      if (CompoundHelper.supportChart(data)) {
        var $chart_content = this.$mContainer.find(".statistics-overview.chart_content");
        $chart_content.removeClass("hide_dom");
        $chart_content.siblings(".statistics-overview:not(.chart_content)").addClass("hide_dom");
        $chart_content.empty();
        return true;
      } else {
        this.myContainer = this.mContainer.querySelector(".statistics-overview:not(.chart_content)");
        if (this.myContainer) {
          this.myContainer.classList.remove("hide_dom");
          $(this.myContainer).siblings(".statistics-overview.chart_content").addClass("hide_dom");
          this.myContainer.innerHTML = template;
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'handle',
    value: function handle(app, data, statisticClass) {
      var allowRender = this.preHandle(data);
      if (allowRender) {
        if (CompoundHelper.supportChart(data)) {
          //如果有动态图表的话
          var $chart_content = this.$mContainer.find(".statistics-overview.chart_content");
          var dynamicChartLauncher = window['__DynamicChartLauncher'];
          dynamicChartLauncher.init(this.mContext._service_);
          var statObj = {
            convertedData: data.value.convertedData,
            answers: data.value.answers[0]
          };
          dynamicChartLauncher.launch($chart_content[0], statObj);
        } else {
          this._startRender(app, data);
        }
      }
    }
  }, {
    key: '_startRender',
    value: function _startRender(app, data) {
      var _this2 = this;

      var i18n = $.extend(true, {}, this.mContext.langProperties);
      if (Midware && Midware.componentRequire) {
        app.bigVue && app.bigVue.$destroy();

        var questionTypeMap = CompoundHelper.getQuestionTypeMap(i18n);

        var convertedData = data.value.convertedData;

        var overviewdata = {
          accuracy: convertedData.accuracy + "%",
          correctNum: convertedData.correctStudents.length,
          errorNum: convertedData.errorStudents.length,
          undoNum: convertedData.undoStudents.length
        };

        this.mContext.statObj = {
          convertedData: data.value.convertedData,
          answers: data.value.answers[0]
        };

        var questions = [];
        var answer = convertedData.answer;
        var index = 1;
        convertedData.isAllSubjective = true; //是否全是主观题
        for (var i = 0, len = answer.length; i < len; i++) {
          var item = answer[i];
          var question = {
            style: CompoundHelper.getHistogramStyle(item.accuracy),
            index: index++,
            name: questionTypeMap[item.subquestionType]["name"],
            type: questionTypeMap[item.subquestionType]["type"],
            subquestionType: item.subquestionType,
            accuracy: item.accuracy < 20 ? "<20" : item.accuracy,
            height: item.accuracy < 20 ? 20 : item.accuracy,
            subquestionId: item.subquestionId
          };
          if (!!convertedData.subquestionTitles) {
            question.subquestion = convertedData.subquestionTitles[item.subquestionId] || '';
          } else {
            question.subquestion = '';
          }

          questions.push(question);
          if (item.type === 'objective') {
            //客观题
            convertedData.isAllSubjective = false;
          }
        }

        var correctStudents = convertedData.correctStudents;
        var errorStudents = convertedData.errorStudents;
        var undoStudents = convertedData.undoStudents;

        var finishedFilter = function finishedFilter(item) {
          item.time = ~~(item.submitTime / 60) + i18n.minute + ' ' + item.submitTime % 60 + i18n.second;
          item.style = CompoundHelper.getUserItemStyle(item.accuracy);
          item.accuracy = item.accuracy + '%';
        };
        var unfinishedFilter = function unfinishedFilter(item) {
          item.style = 'noanswer';
          item.accuracy = '--%';
          item.time = '-:-';
        };

        //按优秀率从大到小排序
        var comparator = CompoundHelper.compareStudent()[convertedData.isAllSubjective ? 'subjective' : 'objective'];
        correctStudents.sort(comparator).map(function (item) {
          finishedFilter(item);
          item.style = item.style + " correct";
        });
        errorStudents.sort(comparator).map(function (item) {
          finishedFilter(item);
          item.style = item.style + " error";
        });
        undoStudents.sort(comparator).map(function (item) {
          unfinishedFilter(item);
          item.style = item.style + " undo";
        });

        var students = correctStudents.concat(errorStudents, undoStudents);

        Midware.componentRequire(deps).then(function (comps) {
          var context = _this2.mContext;
          app.bigVue = new Vue({
            el: _this2.myContainer,
            data: {
              questions: questions,
              converteddata: convertedData,
              overviewdata: overviewdata,
              lang: i18n,
              students: students,
              showingFilter: 'all', //all:全部，correct：答对，error：答错，undo：未作答
              showuserlist: false
            },
            components: {
              'DataOverView': comps[CompoundOverView],
              'CompoundAnswerDetail': comps[CompoundAnswerDetail],
              'CompoundUserList': comps[CompoundUserList]
            },
            methods: {
              seeDetail: function seeDetail(userid) {
                CompoundHelper.seeStudentAnswer(context, userid, $(this.$el));
              },
              clickItem: function clickItem(question) {
                CompoundHelper.goQuestionStat(context, question.subquestionId, question.type, question.subquestionType);
              },
              toggleUserList: function toggleUserList() {
                this.showuserlist = !this.showuserlist;
              },
              onTab: function onTab(type) {
                this.showingFilter = type;
              }
            }
          });
        });
      }
    }
  }]);

  return CompoundHandler;
}(_BaseHandler2.BaseHandler);

exports.CompoundHandler = CompoundHandler;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoleReadingHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseHandler2 = __webpack_require__(0);

var _RoleReadingHelper = __webpack_require__(17);

var RoleReadingHelper = _interopRequireWildcard(_RoleReadingHelper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoleReadOverView = 'ComplexStatistics:RoleReadOverView'; //复合题统计答题详情组件
var RoleReadAnswerDetail = 'ComplexStatistics:RoleReadAnswerDetail'; //复合题统计总览
var RoleReadUserList = 'ComplexStatistics:RoleReadUserList'; //复合题统计学生列表
var RoleReadReport = 'ComplexStatistics:RoleReadReport'; //角色朗读统计弹出框
var deps = [RoleReadOverView, RoleReadAnswerDetail, RoleReadUserList, RoleReadReport];

var template = __webpack_require__(24);

/**
 * 
 * mixmodule_content
 * @class RoleReadingHandler
 * @extends {BaseHandler}
 */

var RoleReadingHandler = function (_BaseHandler) {
  _inherits(RoleReadingHandler, _BaseHandler);

  function RoleReadingHandler(context, container, option) {
    _classCallCheck(this, RoleReadingHandler);

    var _this = _possibleConstructorReturn(this, (RoleReadingHandler.__proto__ || Object.getPrototypeOf(RoleReadingHandler)).call(this, context, container, option));

    _this.setName("RoleReadingHandler");
    return _this;
  }

  _createClass(RoleReadingHandler, [{
    key: 'preHandle',
    value: function preHandle() {
      this.$mContainer.closest(".com_layout").addClass("mixmodule_content");
      this.myContainer = this.mContainer.querySelector(".statistics-overview:not(.chart_content)");
      if (this.myContainer) {
        this.myContainer.classList.remove("hide_dom");
        $(this.myContainer).siblings(".statistics-overview.chart_content").addClass("hide_dom");
        this.myContainer.innerHTML = template;
        return true;
      }
      return false;
    }
  }, {
    key: 'handle',
    value: function handle(app, data, statisticClass) {
      var allowRender = this.preHandle();
      allowRender && this._startRender(app, data);
    }
  }, {
    key: '_startRender',
    value: function _startRender(app, data) {
      var _this2 = this;

      var i18n = $.extend(true, {}, this.mContext.langProperties);
      if (Midware && Midware.componentRequire) {
        app.bigVue && app.bigVue.$destroy();

        var convertedData = data.value.convertedData;
        var overviewdata = {
          accuracy: convertedData.avgExcellPercent + "%",
          excellentNum: convertedData.excellentStudents.length,
          improveNum: convertedData.improveStudents.length,
          noanswerNum: convertedData.undoStudents.length
        };
        var excellentStudents = convertedData.excellentStudents;
        var improveStudents = convertedData.improveStudents;
        var undoStudents = convertedData.undoStudents;

        this.mContext.statObj = {
          convertedData: data.value.convertedData,
          answers: data.value.answers[0]
        };

        var finishedFilter = function finishedFilter(item) {
          item.time = ~~(item.submitTime / 60) + i18n.minute + ' ' + item.submitTime % 60 + i18n.second;
          item.style = RoleReadingHelper.getUserItemStyle(item.excellPercent);
          item.excellPercent = item.excellPercent + '%';
        };
        var unfinishedFilter = function unfinishedFilter(item) {
          item.style = 'noanswer';
          item.excellPercent = '--%';
          item.time = '-:-';
        };
        //按优秀率从大到小排序
        var comparator = RoleReadingHelper.compareStudent();
        excellentStudents.sort(comparator).map(function (item) {
          finishedFilter(item);
          item.style = item.style + " excellent";
        });
        improveStudents.sort(comparator).map(function (item) {
          finishedFilter(item);
          item.style = item.style + " improve";
        });
        undoStudents.sort(comparator).map(function (item) {
          unfinishedFilter(item);
          item.style = item.style + " undo";
        });

        var students = excellentStudents.concat(improveStudents, undoStudents);

        Midware.componentRequire(deps).then(function (comps) {
          var context = _this2.mContext;
          app.bigVue = new Vue({
            el: _this2.myContainer,
            data: {
              converteddata: convertedData,
              overviewdata: overviewdata,
              answer: convertedData['answer'],
              lang: i18n,
              students: students,
              showuserlist: false,
              showingReport: false,
              env: _this2.env,
              showingFilter: 'all', //all:全部，excellent：优秀，improve：需提升，undo：未作答
              reportinfo: {
                count: students.length,
                index: 0,
                preindex: -1,
                nextindex: -1,
                student: students.length > 0 ? students[0] : null
              }
            },
            components: {
              'DataOverView': comps[RoleReadOverView],
              'RoleReadAnswerDetail': comps[RoleReadAnswerDetail],
              'RoleReadUserList': comps[RoleReadUserList],
              'RoleReadReport': comps[RoleReadReport]
            },
            mounted: function mounted() {
              if (context && context.$addEventListener && window["PresenterEventType"]) {
                context.$addEventListener("showAnswerCompoundCallback", PresenterEventType.NATIVE_EVENT, this._onExamCallback); //接收单个学生答题数据
              }
            },
            methods: {
              /**
               * 二次还收题回调
               * @param eventData
               * @private
               */
              _onExamCallback: function _onExamCallback(eventData) {
                console.log('======_onExamCallback======', eventData);
                var rolereadreport = this.$refs['rolereadreport'];
                if (rolereadreport && rolereadreport.onPlayAudio) {
                  //调用组件接口，播放音频
                  if (eventData['answerData'] && eventData['answerData']['data'] && eventData['answerData']['data'].length > 0) {
                    rolereadreport.onPlayAudio(eventData['answerData']['data'][0]['value']);
                  }
                }
              },
              closereportdialog: function closereportdialog() {
                this.showingReport = false;
              },
              requestanswercallback: function requestanswercallback(userid, record) {
                //请求二次收题，收音频
                var eventData = {
                  'type': 'subExamAnswer',
                  'source': context._clazz,
                  'isShowAnswer': true,
                  'users': [userid],
                  'value': {
                    'subExamId': record,
                    'subExamType': 'rolereadingitem',
                    'handinMethod': 'student'
                  }
                };
                if (context && context.$dispatchEvent && window[PresenterEventType]) {
                  context.$dispatchEvent("Exam", PresenterEventType.PPT_NATIVE_EVENT, eventData);
                }
              },
              /**
               * 查看详情
               * @param index
               * @param userid
               */
              seeDetail: function seeDetail(index, userid) {
                this.showingReport = true;
                this.reportinfo.index = index;
                this.reportinfo.student = students[this.reportinfo.index];
                //重新计算上一个和下一个索引
                this.updateIndex();
              },
              /**
               * 切换上一个学生/下一个学生
               * @param add
               */
              changestudentreport: function changestudentreport(add) {
                this.reportinfo.index += add;
                this.reportinfo.student = students[this.reportinfo.index];
                //重新计算上一个和下一个索引
                this.updateIndex();
              },
              updateIndex: function updateIndex() {
                var index = this.reportinfo.index;
                this.reportinfo.preindex = -1;
                var i;
                for (i = index - 1; i >= 0; i--) {
                  //往上搜索上一个索引
                  if (students[i] && students[i]['style'].search('undo') < 0) {
                    //学生有作答
                    if (this.showingFilter != 'all' && students[i] && students[i]['style'].search(this.showingFilter) < 0) {
                      break;
                    }
                    this.reportinfo.preindex = i;
                    break;
                  }
                }
                this.reportinfo.nextindex = -1;
                for (i = index + 1; i < this.reportinfo.count; i++) {
                  if (students[i] && students[i]['style'].search('undo') < 0) {
                    //学生有作答
                    if (this.showingFilter != 'all' && students[i] && students[i]['style'].search(this.showingFilter) < 0) {
                      break;
                    }
                    this.reportinfo.nextindex = i;
                    break;
                  }
                }
              },
              toggleUserList: function toggleUserList() {
                this.showuserlist = !this.showuserlist;
              },
              onTab: function onTab(type) {
                this.showingFilter = type;
              }
            }
          });
        });
      }
    }
  }]);

  return RoleReadingHandler;
}(_BaseHandler2.BaseHandler);

exports.RoleReadingHandler = RoleReadingHandler;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SectionsHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseHandler2 = __webpack_require__(0);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChapterPronumciation = 'ComplexStatistics:ChapterPronunciation'; //复合题统计答题详情组件
var UserDetailStat = 'ComplexStatistics:ChapterPronunciationDetail'; //复合题统计总览
var deps = [ChapterPronumciation, UserDetailStat];

var template = __webpack_require__(25);

/**
 * 
 * 英语篇章评测
 * @class SectionsHandler
 * @extends {BaseHandler}
 */

var SectionsHandler = function (_BaseHandler) {
  _inherits(SectionsHandler, _BaseHandler);

  function SectionsHandler(context, container, option) {
    _classCallCheck(this, SectionsHandler);

    var _this = _possibleConstructorReturn(this, (SectionsHandler.__proto__ || Object.getPrototypeOf(SectionsHandler)).call(this, context, container, option));

    _this.setName("SectionsHandler");
    return _this;
  }

  _createClass(SectionsHandler, [{
    key: 'preHandle',
    value: function preHandle() {
      this.myContainer = this.mContainer.querySelector(".statistics-area");
      if (this.myContainer) {
        this.myContainer.innerHTML = template;
        return true;
      }
      return false;
    }
  }, {
    key: 'handle',
    value: function handle(app, data, statisticClass) {
      var allowRender = this.preHandle();
      allowRender && this._startRender(app, data);
    }
  }, {
    key: 'getStore',
    value: function getStore(convertedData, lang) {
      var _mutations;

      return {
        state: {
          userDetailPage: {
            show: false,
            userData: null
          },
          env: this.env,
          lang: lang
        },
        getters: {
          userDetailPage: function userDetailPage(state) {
            return state.userDetailPage;
          }
        },
        actions: {},
        mutations: (_mutations = {}, _defineProperty(_mutations, 'CHAPTER_CURRENT_USER_DETAIL_PAGE', function CHAPTER_CURRENT_USER_DETAIL_PAGE(state, userDetailPage) {
          state.userDetailPage = userDetailPage;
        }), _defineProperty(_mutations, 'PATCH_AUDIO_RESOURCE', function PATCH_AUDIO_RESOURCE(state, opts) {
          if (state.userDetailPage.userData.answer.user_response[opts.index] && state.userDetailPage.userData.answer.user_response[opts.index]['sectionId'] === opts.subExamId) {
            state.userDetailPage.userData.answer.user_response[opts.index]['audioPath'] = opts.audioPath;
          }
        }), _mutations)
      };
    }
  }, {
    key: '_startRender',
    value: function _startRender(app, data) {
      var _this2 = this;

      var i18n = $.extend(true, {}, this.mContext.langProperties);
      if (Midware && Midware.componentRequire) {
        app.bigVue && app.bigVue.$destroy();

        var convertedData = data.value.convertedData;
        var store = new Vuex.Store(this.getStore(convertedData, i18n));

        Midware.componentRequire(deps).then(function (comps) {
          var context = _this2.mContext;
          app.bigVue = new Vue({
            el: _this2.myContainer,
            store: store,
            data: {
              result: convertedData.result
            },
            components: {
              'ChapterPronumciation': comps[ChapterPronumciation],
              'UserDetailStat': comps[UserDetailStat]
            },
            mounted: function mounted() {
              context && context.$addEventListener && window["PresenterEventType"] && context.$addEventListener("showAnswerCompoundCallback", PresenterEventType.NATIVE_EVENT, this._onExamCallback); //接收单个学生答题数据
            },
            methods: {
              /**
               * 二次还收题回调
               * @param eventData
               * @private
               */
              _onExamCallback: function _onExamCallback(eventData) {
                if (eventData['answerData'] && eventData['answerData']['data'] && eventData['answerData']['data'].length > 0) {
                  var audioPath = eventData['answerData']['data'][0]['value'];
                  var user_response = this.$store.state.userDetailPage.userData.answer.user_response;
                  var subExamId, index;
                  for (var i = 0, len = user_response.length; i < len; i++) {
                    if (eventData.subExamId.indexOf(user_response[i]['sectionId']) > -1) {
                      index = i;
                      subExamId = user_response[index]['sectionId'];
                      break;
                    }
                  }
                  this.$store.commit('PATCH_AUDIO_RESOURCE', {
                    'index': index,
                    'subExamId': subExamId,
                    'audioPath': audioPath
                  });
                }
              },
              requestanswercallback: function requestanswercallback(userid, record) {
                //请求二次收题，收音频
                var eventData = {
                  'type': 'subExamAnswer',
                  'source': context._clazz,
                  'isShowAnswer': true,
                  'users': [userid],
                  'value': {
                    'subExamId': record,
                    'subExamType': 'ReadingEvaluatingItem',
                    'handinMethod': 'student'
                  }
                };
                if (context && context.$dispatchEvent && window["PresenterEventType"]) {
                  context.$dispatchEvent("Exam", PresenterEventType.PPT_NATIVE_EVENT, eventData);
                }
              }
            }
          });

          app.bigVue.$on('CHAPTER_THUMBS_UP', function (users, names) {
            context.fireStuffEvent("FLOWER", users);
            if (window.PresenterFlowerTip) {
              window.PresenterFlowerTip(names);
            }
          });
          app.bigVue.$on('requestanswercallback', function (userid, record) {
            var eventData = {
              'type': 'subExamAnswer',
              'source': context._clazz,
              'isShowAnswer': true,
              'users': [userid],
              'value': {
                'subExamId': record,
                'subExamType': 'ReadingEvaluatingItem',
                'handinMethod': 'student'
              }
            };
            if (context && context.$dispatchEvent && window["PresenterEventType"]) {
              context.$dispatchEvent("Exam", PresenterEventType.PPT_NATIVE_EVENT, eventData);
            }
          });
        });
      }
    }
  }]);

  return SectionsHandler;
}(_BaseHandler2.BaseHandler);

exports.SectionsHandler = SectionsHandler;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SentenceHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseHandler2 = __webpack_require__(0);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SentencePronunciationList = 'ComplexStatistics:SentencePronunciationList'; //复合题统计答题详情组件
var UserDetailStat = 'ComplexStatistics:SentencePronunciationDetail'; //复合题统计总览
var deps = [SentencePronunciationList, UserDetailStat];

var template = __webpack_require__(26);

/**
 * 
 * 英语句子评测
 * @class SentenceHandler
 * @extends {BaseHandler}
 */

var SentenceHandler = function (_BaseHandler) {
  _inherits(SentenceHandler, _BaseHandler);

  function SentenceHandler(context, container, option) {
    _classCallCheck(this, SentenceHandler);

    var _this = _possibleConstructorReturn(this, (SentenceHandler.__proto__ || Object.getPrototypeOf(SentenceHandler)).call(this, context, container, option));

    _this.setName("SentenceHandler");
    return _this;
  }

  _createClass(SentenceHandler, [{
    key: 'preHandle',
    value: function preHandle() {
      this.myContainer = this.mContainer.querySelector(".statistics-area");
      if (this.myContainer) {
        this.myContainer.innerHTML = template;
        return true;
      }
      return false;
    }
  }, {
    key: 'handle',
    value: function handle(app, data, statisticClass) {
      var allowRender = this.preHandle();
      allowRender && this._startRender(app, data);
    }
  }, {
    key: 'getStore',
    value: function getStore(convertedData, lang) {
      var _mutations;

      return {
        state: {
          userDetailPage: {
            show: false,
            playingAudio: -1,
            userData: null
          },
          env: this.env,
          correctAnswerTeacher: convertedData.correctAnswerTeacher,
          lang: lang
        },
        getters: {
          userDetailPage: function userDetailPage(state) {
            return state.userDetailPage;
          }
        },
        actions: {},
        mutations: (_mutations = {}, _defineProperty(_mutations, 'SENTENCE_CURRENT_USER_DETAIL_PAGE', function SENTENCE_CURRENT_USER_DETAIL_PAGE(state, userDetailPage) {
          state.userDetailPage = userDetailPage;
        }), _defineProperty(_mutations, 'PATCH_AUDIO_RESOURCE', function PATCH_AUDIO_RESOURCE(state, opts) {
          if (state.userDetailPage.userData.answer.user_response[opts.index] && state.userDetailPage.userData.answer.user_response[opts.index]['sectionId'] === opts.subExamId) {
            state.userDetailPage.userData.answer.user_response[opts.index]['audioPath'] = opts.audioPath;
            state.userDetailPage.userData.answer.user_response[opts.index]['existAudioPath'] = true;
          }
        }), _mutations)
      };
    }
  }, {
    key: '_startRender',
    value: function _startRender(app, data) {
      var _this2 = this;

      var i18n = $.extend(true, {}, this.mContext.langProperties);
      if (Midware && Midware.componentRequire) {
        app.bigVue && app.bigVue.$destroy();

        var convertedData = data.value.convertedData;
        var store = new Vuex.Store(this.getStore(convertedData, i18n));

        Midware.componentRequire(deps).then(function (comps) {
          var context = _this2.mContext;
          app.bigVue = new Vue({
            el: _this2.myContainer,
            store: store,
            data: {
              result: convertedData.result
            },
            components: {
              'SentencePronunciationList': comps[SentencePronunciationList],
              'UserDetailStat': comps[UserDetailStat]
            },
            mounted: function mounted() {
              context && context.$addEventListener && window["PresenterEventType"] && context.$addEventListener("showAnswerCompoundCallback", PresenterEventType.NATIVE_EVENT, this._onExamCallback); //接收单个学生答题数据
            },
            methods: {
              /**
               * 二次还收题回调
               * @param eventData
               * @private
               */
              _onExamCallback: function _onExamCallback(eventData) {
                if (eventData['answerData'] && eventData['answerData']['data'] && eventData['answerData']['data'].length > 0) {
                  var audioPath = eventData['answerData']['data'][0]['value'];
                  var user_response = this.$store.state.userDetailPage.userData.answer.user_response;
                  var subExamId, index;
                  for (var i = 0, len = user_response.length; i < len; i++) {
                    if (eventData.subExamId.indexOf(user_response[i]['sectionId']) > -1) {
                      index = i;
                      subExamId = user_response[index]['sectionId'];
                      break;
                    }
                  }
                  this.$store.commit('PATCH_AUDIO_RESOURCE', {
                    'index': index,
                    'subExamId': subExamId,
                    'audioPath': audioPath
                  });
                }
              },
              requestanswercallback: function requestanswercallback(userid, record) {
                //请求二次收题，收音频
                var eventData = {
                  'type': 'subExamAnswer',
                  'source': context._clazz,
                  'isShowAnswer': true,
                  'users': [userid],
                  'value': {
                    'subExamId': record,
                    'subExamType': 'ReadingEvaluatingItem',
                    'handinMethod': 'student'
                  }
                };
                if (context && context.$dispatchEvent && window["PresenterEventType"]) {
                  context.$dispatchEvent("Exam", PresenterEventType.PPT_NATIVE_EVENT, eventData);
                }
              }
            }
          });

          app.bigVue.$on('CHAPTER_THUMBS_UP', function (users, names) {
            context.fireStuffEvent("FLOWER", users);
            if (window.PresenterFlowerTip) {
              window.PresenterFlowerTip(names);
            }
          });
          app.bigVue.$on('requestanswercallback', function (userid, record) {
            var eventData = {
              'type': 'subExamAnswer',
              'source': context._clazz,
              'isShowAnswer': true,
              'users': [userid],
              'value': {
                'subExamId': record,
                'subExamType': 'ReadingEvaluatingItem',
                'handinMethod': 'student'
              }
            };
            if (context && context.$dispatchEvent && window["PresenterEventType"]) {
              context.$dispatchEvent("Exam", PresenterEventType.PPT_NATIVE_EVENT, eventData);
            }
          });
        });
      }
    }
  }]);

  return SentenceHandler;
}(_BaseHandler2.BaseHandler);

exports.SentenceHandler = SentenceHandler;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatisticsAHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseHandler2 = __webpack_require__(0);

var _ClassroomUtil = __webpack_require__(1);

var _vue = __webpack_require__(2);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var statisticsA = 'ObjectiveStatics:statisticsA'; //A类统计组件
var deps = [statisticsA];

/**
 * 
 * 
 * @class StatisticsAHandler
 * @extends {BaseHandler}
 */

var StatisticsAHandler = function (_BaseHandler) {
  _inherits(StatisticsAHandler, _BaseHandler);

  function StatisticsAHandler(context, container, option) {
    _classCallCheck(this, StatisticsAHandler);

    var _this = _possibleConstructorReturn(this, (StatisticsAHandler.__proto__ || Object.getPrototypeOf(StatisticsAHandler)).call(this, context, container, option));

    _this.setName("StatisticsAHandler");
    _this.analysisContent = "";
    _this.isShowAnalysis = false;
    return _this;
  }

  _createClass(StatisticsAHandler, [{
    key: 'preHandle',
    value: function preHandle() {
      //如果app.smallVue存在，要先destroy掉
      this.myContainer = this.mContainer.querySelector(".statistics-area");
      if (this.myContainer) {
        this.myContainer.innerHTML = __webpack_require__(19);
        this.mContainer.parentNode.classList.add("pull_down");
        return true;
      }
      return false;
    }

    /**
     * 查看解析
     * 
     * @param {any} content
     * 
     * @memberOf StatisticsAHandler
     */

  }, {
    key: 'showAnalysis',
    value: function showAnalysis(content) {
      this.analysisContent = content;
      this.isShowAnalysis = true;
      //暂不实现
    }
  }, {
    key: 'showAnswer',
    value: function showAnswer() {
      this.showCorrectAnswer = true;
      this.v.$data.showCorrectAnswer = this.showCorrectAnswer;
    }
  }, {
    key: 'showRightAnswer',
    value: function showRightAnswer(correctAnswerDisplayCtrl) {
      this.correctAnswerDisplayCtrl = correctAnswerDisplayCtrl;
      this.v.$data.correctAnswerDisplayCtrl = this.correctAnswerDisplayCtrl;
    }
  }, {
    key: 'handle',
    value: function handle(app, data) {
      var allowRender = this.preHandle();
      allowRender && this._startRender(app, data);
    }
  }, {
    key: '_startRender',
    value: function _startRender(app, data) {
      var _this2 = this;

      this.correctAnswerDisplayCtrl = {
        showCorrectAnswer: false,
        correctAnswer: []
      };
      var i18n = $.extend(true, {}, this.mContext.langProperties);
      if (Midware && Midware.componentRequire) {
        app.smallVue && app.smallVue.$destroy();

        data.value.currentStudents = data.value.currentStudents ? data.value.currentStudents : (0, _ClassroomUtil.getCurrentStudents)();

        Midware.componentRequire(deps).then(function (comps) {
          console.log(_this2);
          app.smallVue = new _vue2.default({
            el: _this2.myContainer,
            data: {
              i18n: i18n,
              data: data,
              env: _this2.env,
              correctAnswerDisplayCtrl: _this2.correctAnswerDisplayCtrl
            },
            components: {
              'statisticsA': comps[statisticsA]
            }
          });
          app.smallVue.$on("FLOWER", _this2.onSendFlower.bind(_this2));
          app.smallVue.$on("CLOSE_ANALYSIS", _this2.onCloseAnalysis.bind(_this2));
          _this2.v = app.smallVue;
        });
      }
    }
  }]);

  return StatisticsAHandler;
}(_BaseHandler2.BaseHandler);

exports.StatisticsAHandler = StatisticsAHandler;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatisticsBHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseHandler2 = __webpack_require__(0);

var _ClassroomUtil = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var statisticsB = 'ObjectiveStatics:statisticsB'; //B类统计组件
var deps = [statisticsB];

/**
 * 
 * @class StatisticsBHandler
 * @extends {BaseHandler}
 */

var StatisticsBHandler = function (_BaseHandler) {
  _inherits(StatisticsBHandler, _BaseHandler);

  function StatisticsBHandler(context, container, option) {
    _classCallCheck(this, StatisticsBHandler);

    var _this = _possibleConstructorReturn(this, (StatisticsBHandler.__proto__ || Object.getPrototypeOf(StatisticsBHandler)).call(this, context, container, option));

    _this.setName("StatisticsBHandler");
    return _this;
  }

  _createClass(StatisticsBHandler, [{
    key: 'preHandle',
    value: function preHandle() {
      this.clickItemIndex = {};
      this.myContainer = this.mContainer.querySelector(".statistics-area");
      if (this.myContainer) {
        this.myContainer.innerHTML = __webpack_require__(20);
        this.mContainer.parentNode.classList.add("pull_down");
        return true;
      }
      return false;
    }
  }, {
    key: 'gotoIndex',
    value: function gotoIndex(index, direction) {
      var temp = { "index": index + 1 };
      if (direction) {
        temp["type"] = direction;
      }
      this.v.$data.clickitemindex = temp;
    }
  }, {
    key: 'handle',
    value: function handle(app, data) {
      var allowRender = this.preHandle();
      allowRender && this._startRender(app, data);
    }
  }, {
    key: '_startRender',
    value: function _startRender(app, data) {
      var _this2 = this;

      var i18n = $.extend(true, {}, this.mContext.langProperties);
      if (Midware && Midware.componentRequire) {
        app.smallVue && app.smallVue.$destroy();

        data.value.currentStudents = data.value.currentStudents ? data.value.currentStudents : (0, _ClassroomUtil.getCurrentStudents)();

        Midware.componentRequire(deps).then(function (comps) {
          app.smallVue = new Vue({
            el: _this2.myContainer,
            data: {
              i18n: i18n,
              data: data,
              clickitemindex: _this2.clickItemIndex,
              env: _this2.env
            },
            components: {
              'statisticsB': comps[statisticsB]
            }
          });
          app.smallVue.$on("FLOWER", _this2.onSendFlower.bind(_this2));
          _this2.v = app.smallVue;
        });
      }
    }
  }]);

  return StatisticsBHandler;
}(_BaseHandler2.BaseHandler);

exports.StatisticsBHandler = StatisticsBHandler;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatisticsCHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseHandler2 = __webpack_require__(0);

var _ClassroomUtil = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var statisticsC = 'ObjectiveStatics:statisticsC'; //C类统计组件
var deps = [statisticsC];

/**
 * 
 * 
 * @class StatisticsCHandler
 * @extends {BaseHandler}
 */

var StatisticsCHandler = function (_BaseHandler) {
  _inherits(StatisticsCHandler, _BaseHandler);

  function StatisticsCHandler(context, container, option) {
    _classCallCheck(this, StatisticsCHandler);

    var _this = _possibleConstructorReturn(this, (StatisticsCHandler.__proto__ || Object.getPrototypeOf(StatisticsCHandler)).call(this, context, container, option));

    _this.setName("StatisticsCHandler");
    return _this;
  }

  _createClass(StatisticsCHandler, [{
    key: 'preHandle',
    value: function preHandle() {
      //如果app.smallVue存在，要先destroy掉
      this.myContainer = this.mContainer.querySelector(".statistics-area");
      if (this.myContainer) {
        this.myContainer.innerHTML = __webpack_require__(21);
        this.mContainer.parentNode.classList.add("pull_down");
        return true;
      }
      return false;
    }
  }, {
    key: 'handle',
    value: function handle(app, data) {
      var allowRender = this.preHandle();
      allowRender && this._startRender(app, data);
    }
  }, {
    key: '_startRender',
    value: function _startRender(app, data) {
      var _this2 = this;

      var i18n = $.extend(true, {}, this.mContext.langProperties);
      if (Midware && Midware.componentRequire) {
        app.smallVue && app.smallVue.$destroy();
        app.smallVue = null;

        data.value.currentStudents = data.value.currentStudents ? data.value.currentStudents : (0, _ClassroomUtil.getCurrentStudents)();

        Midware.componentRequire(deps).then(function (comps) {

          app.smallVue = new Vue({
            el: _this2.myContainer,
            data: {
              i18n: i18n,
              data: data,
              env: _this2.env
            },
            components: {
              'statisticsC': comps[statisticsC]
            }
          });
          app.smallVue.$on("FLOWER", _this2.onSendFlower.bind(_this2));
        });
      }
    }
  }]);

  return StatisticsCHandler;
}(_BaseHandler2.BaseHandler);

exports.StatisticsCHandler = StatisticsCHandler;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatisticsEHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseHandler2 = __webpack_require__(0);

var _ClassroomUtil = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var statisticsE = 'ObjectiveStatics:statisticsE'; //B类统计组件
var deps = [statisticsE];

/**
 * 
 * 
 * @class StatisticsEHandler
 * @extends {BaseHandler}
 */

var StatisticsEHandler = function (_BaseHandler) {
  _inherits(StatisticsEHandler, _BaseHandler);

  function StatisticsEHandler(context, container, option) {
    _classCallCheck(this, StatisticsEHandler);

    var _this = _possibleConstructorReturn(this, (StatisticsEHandler.__proto__ || Object.getPrototypeOf(StatisticsEHandler)).call(this, context, container, option));

    _this.setName("StatisticsEHandler");
    return _this;
  }

  _createClass(StatisticsEHandler, [{
    key: 'preHandle',
    value: function preHandle() {
      //如果app.smallVue存在，要先destroy掉
      this.myContainer = this.mContainer.querySelector(".statistics-area");
      if (this.myContainer) {
        this.myContainer.innerHTML = __webpack_require__(22);
        return true;
      }
      return false;
    }
  }, {
    key: 'handle',
    value: function handle(app, data) {
      var allowRender = this.preHandle();
      allowRender && this._startRender(app, data);
    }
  }, {
    key: '_startRender',
    value: function _startRender(app, data) {
      var _this2 = this;

      var i18n = $.extend(true, {}, this.mContext.langProperties);
      if (Midware && Midware.componentRequire) {
        app.smallVue && app.smallVue.$destroy();

        data.value.currentStudents = data.value.currentStudents ? data.value.currentStudents : (0, _ClassroomUtil.getCurrentStudents)();

        Midware.componentRequire(deps).then(function (comps) {
          app.smallVue = new Vue({
            el: _this2.myContainer,
            data: {
              i18n: i18n,
              data: data,
              env: _this2.env
            },
            components: {
              'statisticsE': comps[statisticsE]
            }
          });
          app.smallVue.$on("FLOWER", _this2.onSendFlower.bind(_this2));
        });
      }
    }
  }]);

  return StatisticsEHandler;
}(_BaseHandler2.BaseHandler);

exports.StatisticsEHandler = StatisticsEHandler;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatisticsTitleHandler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseHandler2 = __webpack_require__(0);

var _vue = __webpack_require__(2);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var statisticsTimer = 'ObjectiveStatics:statisticsTimer'; //顶部时间提交人数组件
var deps = [statisticsTimer];

/**
 * 
 * 
 * @class StatisticsTitleHandler
 * @extends {BaseHandler}
 */

var StatisticsTitleHandler = function (_BaseHandler) {
  _inherits(StatisticsTitleHandler, _BaseHandler);

  function StatisticsTitleHandler(context, container, option) {
    _classCallCheck(this, StatisticsTitleHandler);

    var _this = _possibleConstructorReturn(this, (StatisticsTitleHandler.__proto__ || Object.getPrototypeOf(StatisticsTitleHandler)).call(this, context, container, option));

    _this.setName("StatisticsTitleHandler");
    return _this;
  }

  _createClass(StatisticsTitleHandler, [{
    key: 'preRender',
    value: function preRender() {
      //如果app.smallVue存在，要先destroy掉
      this.myContainer = this.mContainer.querySelector(".com_layout_header");
      if (this.myContainer) {
        this.myContainer.innerHTML = '<timer :data="data" :i18n="i18n"></timer>';
        return true;
      }
      return false;
    }
  }, {
    key: 'render',
    value: function render(app, data) {
      var allowRender = this.preRender();
      allowRender && this._startRender(app, data);
    }
  }, {
    key: '_startRender',
    value: function _startRender(app, data) {
      var _this2 = this;

      var i18n = $.extend(true, {}, this.mContext.langProperties);
      if (Midware && Midware.componentRequire) {
        app.titleVue && app.titleVue.$destroy();
        Midware.componentRequire(deps).then(function (comps) {
          app.titleVue = new _vue2.default({
            el: _this2.myContainer,
            data: {
              i18n: i18n,
              data: data
            },
            components: {
              'timer': comps[statisticsTimer]
            }
          });
        });
      }
    }
  }]);

  return StatisticsTitleHandler;
}(_BaseHandler2.BaseHandler);

exports.StatisticsTitleHandler = StatisticsTitleHandler;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (context, container, option) {
  return {
    "special": {
      "Compound": new _CompoundHandler.CompoundHandler(context, container, option),
      "ReadingComprehension": new _CompoundHandler.CompoundHandler(context, container, option),
      "ChineseCharacterDictation": new _CompoundHandler.CompoundHandler(context, container, option),
      "EnglishDictation": new _CompoundHandler.CompoundHandler(context, container, option),
      "rolereading": new _RoleReadingHandler.RoleReadingHandler(context, container, option),
      "sentence": new _SentenceHandler.SentenceHandler(context, container, option),
      "sections": new _SectionsHandler.SectionsHandler(context, container, option)
    },
    "clazz": {
      "A": new _StatisticsAHandler.StatisticsAHandler(context, container, option),
      "B": new _StatisticsBHandler.StatisticsBHandler(context, container, option),
      "C": new _StatisticsCHandler.StatisticsCHandler(context, container, option),
      "E": new _StatisticsEHandler.StatisticsEHandler(context, container, option)
    }
  };
};

var _CompoundHandler = __webpack_require__(5);

var _RoleReadingHandler = __webpack_require__(6);

var _SentenceHandler = __webpack_require__(8);

var _SectionsHandler = __webpack_require__(7);

var _StatisticsAHandler = __webpack_require__(9);

var _StatisticsBHandler = __webpack_require__(10);

var _StatisticsCHandler = __webpack_require__(11);

var _StatisticsEHandler = __webpack_require__(12);

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = __webpack_require__(14);

var _Config2 = _interopRequireDefault(_Config);

var _util = __webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 统计处理路由器
 * 
 * @class Router
 */
var Router = function () {
  function Router(app, container, context, option) {
    _classCallCheck(this, Router);

    this.mApp = app;
    this.mContext = context;
    this.mContainer = container;
    this.mConfig = (0, _Config2.default)(context, container, option);
    this.handlers = {};
    this.curHandler = null;
  }

  _createClass(Router, [{
    key: 'router',
    value: function router(data, statisticClass) {
      if (statisticClass === "D") {
        return;
      }
      var _questionType = (0, _util.getQuestionType)(data, statisticClass);
      var handler = this.findHandler(_questionType, statisticClass);
      if (handler) {
        this.curHandler = handler;
        if (!this.handlers.hasOwnProperty(handler.name)) {
          this.handlers[handler.name] = handler;
        }
        handler.handle(this.mApp, data, statisticClass);
      }
    }

    /**
     * 寻找合适的处理器
     * 
     * @param {any} qt
     * @param {any} clazz
     * @returns
     * 
     * @memberOf Router
     */

  }, {
    key: 'findHandler',
    value: function findHandler(qt, clazz) {
      var _config = this.mConfig;
      var _special = _config['special'];
      var _clazz = _config['clazz'];
      if (_special.hasOwnProperty(qt)) {
        return _special[qt];
      } else if (_clazz.hasOwnProperty(clazz)) {
        return _clazz[clazz];
      }
      return null;
    }
  }]);

  return Router;
}();

exports.default = Router;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function getQuestionTypeMap(i18n) {
  return {
    choice: {
      name: i18n.choice ? i18n.choice : "单选题",
      type: "A"
    },
    order: {
      name: i18n.order ? i18n.order : "排序题",
      type: "C"
    },
    textentry: {
      name: i18n.textentry ? i18n.textentry : "填空题",
      type: "B"
    },
    textentrymultiple: {
      name: i18n.textentry ? i18n.textentry : "填空题",
      type: "B"
    },
    newhandwrite: {
      name: i18n.handwrite ? i18n.handwrite : "手写题",
      type: "D"
    },
    handwrite: {
      name: i18n.handwrite ? i18n.handwrite : "手写题",
      type: "D"
    },
    match: {
      name: i18n.match ? i18n.match : "连线题",
      type: "B"
    },
    judge: {
      name: i18n.judge ? i18n.judge : "判断题",
      type: "A"
    },
    multiplechoice: {
      name: i18n.multiplechoice ? i18n.multiplechoice : "多选题",
      type: "A"
    },
    vote: {
      name: i18n.vote ? i18n.vote : "投票题",
      type: "A"
    },
    graphicgapmatch: {
      name: i18n.graphicgapmatch ? i18n.graphicgapmatch : "拼图题",
      type: "D"
    },
    ChineseCharacterDictation: {
      name: i18n.ChineseCharacterDictation ? i18n.ChineseCharacterDictation : "汉字拼写题",
      type: "C"
    },
    EnglishDictation: {
      name: i18n.EnglishDictation ? i18n.EnglishDictation : "单词听写题",
      type: "C"
    }
  };
}

function getPopWindow() {
  return ['        <div class="ndui-pop com_pop com_pop_big exam-skin-wood _js_detail_viewer_popup" style="display: none; position: fixed;">', '           <div class="ndui-pop-mask"></div>', '           <div class="ndui-pop-square">', '           <div class="ndui-pop-wrap">', '            <a href="javascript:void(0);" class="stati_com_btn_close ndui-pop-close right stati_com_btn_rb">', '                <em></em>', '                <span class="preload_btn_close_pic1"></span>', '                <span class="preload_btn_close_pic2"></span>', '            </a>', '            <a href="javascript:void(0);" class="stati_com_btn_close ndui-pop-close left stati_com_btn_lb">', '                <em></em>', '                <span class="preload_btn_close_pic1"></span>', '                <span class="preload_btn_close_pic2"></span>', '            </a>', '            <div class="pop_wrap slidebottom">', '                <div style="width: 100%;height: 100%;" class="chineseCharacter-module-answer-stat _js_detail_viewer"></div>', '            </div>', '            </div>', '            </div>', '        </div>'].join("");
}
;

/**
 * 柱状图对应css样式
 * 
 * @param {any} accuracy
 * @returns
 */
function getHistogramStyle(accuracy) {
  if (accuracy >= 85) {
    return 'column_green';
  } else if (accuracy >= 60) {
    return 'column_orange';
  } else {
    return 'column_red';
  }
}

/**
   * 学生列表对应css样式
   */
function getUserItemStyle(accuracy) {
  if (accuracy >= 80) {
    return 'list_font_green';
  } else if (accuracy >= 60) {
    return 'list_font_orange';
  } else {
    return 'list_font_red';
  }
}

/**
 * 学生列表排序规则1
 */
function compareStudent() {
  var compare = function compare(a, b) {
    if (a.submitTime === b.submitTime) {
      //如果耗时相同
      return ~~a.studentNo - ~~b.studentNo; //学号 asc
    }
    return ~~a.submitTime - ~~b.submitTime; //耗时 asc
  };
  return {
    objective: function objective(a, b) {
      if (a.accuracy === b.accuracy) {
        //如果正确率相同，仅客观题比较正确率
        return compare(a, b);
      }
      return ~~b.accuracy - ~~a.accuracy; //正确率 desc
    },
    subjective: compare
  };
}

/**查看详情**/
function seeStudentAnswer(context, userId, $view) {
  var user_response,
      answers = context.statObj.answers,
      a;
  for (var i = 0, len = answers.length; i < len; i++) {
    a = answers[i];
    if ($.inArray(userId, a.userIds) >= 0) {
      var ans = JSON.parse(a.answer);
      user_response = $.extend(true, [], ans["user_response"]);
      break;
    }
  }
  if (!!user_response) {
    var eventData = {
      studentAnswer: user_response,
      userId: userId
    };

    if (isChineseCharacterDictation(user_response)) {
      //汉字听写题
      showChineseCharacterDictationDetail(context, userId, $view, user_response);
      return;
    } else {
      if (context && context.$dispatchEvent && window["PresenterEventType"]) {
        context.$dispatchEvent("Event_SeeStudentAnswer", PresenterEventType.IC_PLAYER_EVENT, eventData);
      }
    }
  }
  var eventData = {
    service: "layout",
    method: "seeStudentAnswer"
  };
  if (context && context.$dispatchEvent && window["PresenterEventType"]) {
    context.$dispatchEvent("statistics_call", PresenterEventType.IC_PLAYER_EVENT, eventData);
  }
}

/************************ 汉字听写题 begin ************************/
var isChineseCharacterDictation = function isChineseCharacterDictation(user_response) {
  if ($.isArray(user_response) && user_response.length > 0) {
    var item = user_response[0];
    if ($.isPlainObject(item) && (item.subquestionType === 'ChineseCharacterDictation' || item.subquestionType === 'EnglishDictation')) {
      return true;
    }
  }

  return false;
};

var answerDetailViewer = null;
var showChineseCharacterDictationDetail = function showChineseCharacterDictationDetail(context, userId, $view, user_response) {
  var submitTime = 0,
      answerData = [],
      userAnswerDetail,
      students = context.statObj.convertedData.students,
      answer = context.statObj.convertedData.answer;

  if ($.isArray(students)) {
    $.each(students, function (index, item) {
      if (item.userId === userId) {
        submitTime = item.submitTime;
        return false;
      }
    });
  }
  $.each(user_response, function (index, item) {
    var itemData = answer[index].data;
    answerData.push({
      id: item.subquestionId,
      index: index,
      word: itemData.word,
      pinyin: itemData.pinyin,
      result: item.result
    });
  });
  userAnswerDetail = { from: 'statis',
    studentId: userId,
    submitTime: submitTime,
    answerData: answerData
  };

  var $popup = $view.siblings('._js_detail_viewer_popup');
  if ($popup.length == 0) {
    $popup = $(getPopWindow());
    $view.parent().append($popup);
  }
  var $btnClose = $popup.find('a.stati_com_btn_rb, a.stati_com_btn_lb');

  //var popup = $view.find('._js_detail_viewer_popup'), btnClose = popup.find('a.stati_com_btn_rb, a.stati_com_btn_lb');
  if (answerDetailViewer === null) {
    var promise = context._service_.parent.$requireComponent('AnswerDetailViewer', [], $popup.find('._js_detail_viewer'));
    promise.then(function (presenter) {
      var presentService = presenter.getService();
      if (presentService) {
        if ($.isFunction(presentService.then)) {
          presentService.then(function (service) {
            answerDetailViewer = service;
            answerDetailViewer.showAnswerDetail(userAnswerDetail);
          });
        } else {
          answerDetailViewer = presentService;
          answerDetailViewer.showAnswerDetail(userAnswerDetail);
        }
      }
    });
  } else {
    answerDetailViewer.showAnswerDetail(userAnswerDetail);
  }
  $btnClose.on('click', function () {
    $popup.hide();
    $btnClose.off('click');
  });
  $popup.show();
};
/************************ 汉字听写题 end. ************************/

/**
 * 跳转到单题统计
 * 
 * @param {any} context
 * @param {any} subquestionId
 * @param {any} statType
 * @param {any} subquestionType
 */
function goQuestionStat(context, subquestionId, statType, subquestionType) {
  if (context && context.$dispatchEvent && window["PresenterEventType"]) {
    context.$dispatchEvent("Event_SwitchToQuestion", PresenterEventType.IC_PLAYER_EVENT, {
      questionId: subquestionId,
      questionType: subquestionType
    });
  }
}

function supportChart(data) {
  var result = false;
  if (!window['__DynamicChartLauncher']) {
    return false;
  }
  if (data) {
    var questions = ['Compound', 'ReadingComprehension'];
    if (data.questionInfo && data.questionInfo.type_code) {
      var code = data.questionInfo.type_code;
      for (var i = 0, len = questions.length; i < len; i++) {
        if (code == questions[i]) {
          return true;
        }
      }
    }
  }
  return false;
}

exports.getQuestionTypeMap = getQuestionTypeMap;
exports.getHistogramStyle = getHistogramStyle;
exports.getUserItemStyle = getUserItemStyle;
exports.compareStudent = compareStudent;
exports.seeStudentAnswer = seeStudentAnswer;
exports.goQuestionStat = goQuestionStat;
exports.supportChart = supportChart;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
   * 学生列表对应css样式
   */
function getUserItemStyle(accuracy) {
  if (accuracy >= 80) {
    return 'list_font_green';
  } else if (accuracy >= 60) {
    return 'list_font_orange';
  } else {
    return 'list_font_red';
  }
}

/**
     * 学生列表排序规则
     */
function compareStudent() {
  var timeCompare = function timeCompare(a, b) {
    if (a.submitTime === b.submitTime) {
      //如果耗时相同
      return ~~a.studentNo - ~~b.studentNo; //学号 asc
    }
    return ~~a.submitTime - ~~b.submitTime; //耗时 asc
  };
  return function (a, b) {
    if (a.excellPercent === b.excellPercent) {
      //如果正确率相同，仅客观题比较正确率
      return timeCompare(a, b);
    }
    return ~~b.excellPercent - ~~a.excellPercent; //正确率 desc
  };
};

exports.getUserItemStyle = getUserItemStyle;
exports.compareStudent = compareStudent;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
function getQuestionType(data, statisticClass) {
    var _questionType = "";
    if (statisticClass === "G") {
        _questionType = data.value.convertedData.questionType;
    } else {
        if (data.questionInfo && data.questionInfo.type_code) {
            _questionType = data.questionInfo.type_code;
        } else {
            _questionType = data.value.convertedData.questionType;
        }
    }
    return _questionType;
}

exports.getQuestionType = getQuestionType;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "<statistics-a :i18n=i18n :data=data :correct-answer-display-ctrl=correctAnswerDisplayCtrl :showdetails=true :env=env></statistics-a>"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "<statistics-b :i18n=i18n :data=data :showdetails=true :clickitemindex=clickitemindex :env=env></statistics-b>"

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "<statistics-c :i18n=i18n :data=data :env=env></statistics-c>"

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "<statistics-e :i18n=i18n :data=data :env=env></statistics-e>"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<div class=mixmodule_content_left><data-over-view :showuserlist=showuserlist :lang=lang :converteddata=converteddata :overviewdata=overviewdata v-on:toggleuserlist=toggleUserList></data-over-view></div><div class=mixmodule_right_column v-show=!showuserlist><compound-answer-detail :lang=lang :questions=questions v-on:clickitem=clickItem></compound-answer-detail></div><div class=mixmodule_right_list v-show=showuserlist><compound-user-list :lang=lang :showingfilter=showingFilter :students=students v-on:clicktab=onTab v-on:detail=seeDetail v-on:toggleuserlist=toggleUserList></compound-user-list></div>"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "<div class=mixmodule_content_left><data-over-view :showuserlist=showuserlist :lang=lang :converteddata=converteddata :overviewdata=overviewdata v-on:toggleuserlist=toggleUserList></data-over-view></div><div class=mixmodule_right_column v-show=!showuserlist><role-read-answer-detail :answer=answer :lang=lang></role-read-answer-detail></div><div class=mixmodule_right_list v-show=showuserlist><role-read-user-list :lang=lang :showingfilter=showingFilter :students=students v-on:clicktab=onTab v-on:detail=seeDetail v-on:toggleuserlist=toggleUserList></role-read-user-list></div><role-read-report ref=rolereadreport :env=env :lang=lang :showingreport=showingReport :reportinfo=reportinfo :class={hide_dom:!showingReport} v-on:requestanswercallback=requestanswercallback v-on:changestudentreport=changestudentreport v-on:closedialog=closereportdialog></role-read-report>"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<div class=whole-level__container><chapter-pronumciation :result=result></chapter-pronumciation><user-detail-stat></user-detail-stat></div>"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "<div class=single-level__container><sentence-pronunciation-list :result=result></sentence-pronunciation-list><user-detail-stat></user-detail-stat></div>"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = $;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = Vuex;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map