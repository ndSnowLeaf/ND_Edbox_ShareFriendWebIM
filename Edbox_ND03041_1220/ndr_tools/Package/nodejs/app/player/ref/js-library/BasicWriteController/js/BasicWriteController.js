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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var WriteStatus = {};
(function(status){
    status[status.incomplete = 1] = 'incomplete',
        status[status.writing = 2] = 'writing',
        status[status.committed = 3] = 'committed',
        status[status.modifying = 4] = 'modifying',
        status[status.completed = 5] = 'completed'
})(WriteStatus);

module.exports = WriteStatus;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

var fn = (function () {
    var val;
    var valLength;

    var fnMap = [
        [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenElement',
            'fullscreenEnabled',
            'fullscreenchange',
            'fullscreenerror'
        ],
        // new WebKit
        [
            'webkitRequestFullscreen',
            'webkitExitFullscreen',
            'webkitFullscreenElement',
            'webkitFullscreenEnabled',
            'webkitfullscreenchange',
            'webkitfullscreenerror'

        ],
        // old WebKit (Safari 5.1)
        [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitCurrentFullScreenElement',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitfullscreenerror'

        ],
        [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozFullScreenElement',
            'mozFullScreenEnabled',
            'mozfullscreenchange',
            'mozfullscreenerror'
        ],
        [
            'msRequestFullscreen',
            'msExitFullscreen',
            'msFullscreenElement',
            'msFullscreenEnabled',
            'MSFullscreenChange',
            'MSFullscreenError'
        ]
    ];

    var i = 0;
    var l = fnMap.length;
    var ret = {};

    for (; i < l; i++) {
        val = fnMap[i];
        if (val && val[1] in document) {
            for (i = 0, valLength = val.length; i < valLength; i++) {
                ret[fnMap[0][i]] = val[i];
            }
            return ret;
        }
    }

    return false;
})();

var screenfull = {
    request: function (elem) {
        var request = fn.requestFullscreen;
        elem = elem || document.documentElement;

        // Work around Safari 5.1 bug: reports support for
        // keyboard in fullscreen even though it doesn't.
        // Browser sniffing, since the alternative with
        // setTimeout is even worse.
        if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
            elem[request]();
        } else {
            elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
        }
    },
    exit: function () {
        document[fn.exitFullscreen]();
    },
    toggle: function (elem) {
        if (this.isFullscreen) {
            this.exit();
        } else {
            this.request(elem);
        }
    },
    raw: fn
};

Object.defineProperties(screenfull, {
    isFullscreen: {
        get: function () {
            return Boolean(document[fn.fullscreenElement]);
        }
    },
    element: {
        enumerable: true,
        get: function () {
            return document[fn.fullscreenElement];
        }
    },
    enabled: {
        enumerable: true,
        get: function () {
            // Coerce to boolean in case of old WebKit
            return Boolean(document[fn.fullscreenEnabled]);
        }
    }
});

module.exports = screenfull;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var WriteStatus = __webpack_require__(0);

var Service = Class.extend({
    // 初始化
    $init: function (parent) {
        this.parent = parent;
    },
    /**
     * 获取题目的业务信息
     */
    getQuestionInfo: function () {
        return _getQuestionInfo(this.parent.model);
    },
	/**
     * 设置多语言
     */
	setLocationProperties: function(location){
		this.parent.i18nModel = location;
	},
    /**
     * 教师端点击结束练习（sendAnswerStop）
     */
    showAnswer: function () {
        this.parent.currentStatus = WriteStatus.completed;
        this.parent._stopMediaPlay();
        this.parent.services.writerService.edit(false);
    },
    /**
     * 返回手写轨迹
     * @returns {*}
     */
    getResult: function (options) {
        var me = this;
        var $deferred = $.Deferred();
        var strokePromise = this.parent.services.writerService.getStrokeData(options || {});
        strokePromise.done(function(strokeData){
           $deferred.resolve(me._constructUserAnswer(strokeData));
        });
        var state = (this.parent.currentStatus !== WriteStatus.incomplete ? 'COMPLETE' : 'NO_ANSWER');
        var result = {
            answer: {
                answer_result: true,
                correct_response: null,
                user_response: [
                    $deferred.promise()
                ]
            },
            questionId: this.parent.model.id,
            answerState: state
        };
        return result;
    },
    /**如果不需要处理icplayer的状态恢复事件, 请将以下两个方法删除掉**/
    getState: function () {
        return {
            status: this.parent.currentStatus
        }
    },
    setState: function (state) {
        if (state) {
            this.parent.currentStatus = state.status;
        }
    },
    lockQuestion: function () {
		if(this.parent.services.writerService){
			this.parent.services.writerService.edit(false);
			this.parent.services.writerService.closePopWin();
        }
        this.parent.isLock = true;
        this.parent.$dispatchEvent('writeLockQuestion', PresenterEventType.IC_PLAYER_EVENT, {
            lock: true
        });
    },
    unlockQuestion: function () {
		if(this.parent.services.writerService){
			this.parent.services.writerService.edit(true);
		}
        this.parent.currentStatus = WriteStatus.writing;
        this.parent._changeAnswerStatus(WriteStatus[WriteStatus.writing]);

        this.parent.isLock = false;
        this.parent.$dispatchEvent('writeLockQuestion', PresenterEventType.IC_PLAYER_EVENT, {
            lock: false
        });
    },
    finishQuestion: function () {
        //do nothing
    },
    resetQuestion: function () {
		if(this.parent.services.writerService){
			this.parent.services.writerService.clean();
		}
    },
    showResultHint: function () {
        //do nothing
    },
    getInterceptId: function () {
        return this.parent.model.id;
    },
    beforeSendAnswer: function (data) {
        data.questionType = 'newhandwrite';
        this.parent.logger.debug('beforeSendAnswer', JSON.stringify(data.answer.user_response));
        data.answer = data.answer.user_response != null ? data.answer.user_response[0] : null;
        return data;
    },
    afterSendAnswer: function (data) {
        // 提交成功后上报状态
        if (data.result === true) {
            this.currentStatus = WriteStatus.committed;
            this.parent._changeAnswerStatus(WriteStatus[WriteStatus.committed]);
        }
    },
    convertProgressData: function (result) {
        var data = [];
        if (result && result.answer.user_response) {
            for (var i= 0, len = result.answer.user_response[0].data.length; i<len; i++) {
                var item = result.answer.user_response[0].data[i];
                data.push({
                    type: 'write',
                    md5: item.extra.md5 || '',
                    data: item.value,
					extra: JSON.stringify({
						background: item.extra.background
					})
                });
            }
        }
        if (this.parent.startWrite === true) {
            result.isChange = true;
            this.parent.startWrite = false;
            this.parent.services.writerService.resetWritingFlag();
        }
        return data;
    },
    /**
     * 轨迹数据转换
     */
    _constructUserAnswer: function(strokeData){
        if (typeof strokeData !== "object") {
            throw new Error("stroke data must be an object");
        }
        var result = { data: [] };
        var background = strokeData.background;
        if (background) {
            //截图做题的时候，type强制改为2,以便pc端使用
            if (background.type === 3) {
                background.type = 2;
            } else {
                background.bottom = background.writer_height - background.bottom;
                background.right = background.writer_width - background.right;
            }
        }
        for (var key in strokeData.data) {
            var item = {
                type: 'write',
                data_type: 'write',
                value: strokeData.data[key],
                extra: {
                    page: key,
                    md5: strokeData.dataMD5[key]
                }
            };
            if(background){
                item.extra.background = background;
            }
            if (strokeData.extra) {
                $.extend(item.extra, JSON.parse(strokeData.extra));
            }
            result.data.push(item);
        }
        return result;
    }
});

//--------------------------私有方法------------------------------
/**
 * 获取题目的业务信息
 */
var _getQuestionInfo = function (model) {
    var typeCode = 'newhandwrite';
    if (model.questionType != 'Write') {
        typeCode = model.questionType;
    }
    return {
        id: model.id,
        type_code: typeCode,
        type_name: '手写',
        url: '',
        item: typeCode,
        dispatchOnly: true,
        background: model.writer_background,
		subjective: true
    }
};

module.exports = Service;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var WriteStatus = __webpack_require__(0);
var Service = __webpack_require__(2);
var screenfull = __webpack_require__(1);

var BasicWriteController = BaseController.extend({

    /**
     * Presenter的初始化方法
     * @private
     */
    $init: function () {
        this._super();
        // services对象
        this.services = {
            "writerService": null,
            "layoutService": null
        };
        // 多语言
        this.i18nModel = {};
        //手写题状态枚举
        this.WRITE_STATUS = WriteStatus;
        this.screenfull = screenfull;
        // 当前学生状态
        this.currentStatus = WriteStatus.incomplete;
        //加载H5版本的手写板时,需要渲染位置的选择器
        this.containerSelector = '.com_lay_write';
        //是否已经实例化PPT的Presenter
        this.hasCreatePPTPresenter = false;
        //判断是否需要发送提交事件，完全不做任何操作
        this.needSubmit = true;
        //开始手写标志
        this.startWrite = false;
        //用于判断题目是否处于lock状态
        this.isLock = false;
        //发送手写板背景数据给教师端
        this.background = null;

        // 日志记录
        this.logger.appendHandler(function (message) {
            console.log(message);
            ClassroomUtils.log(JSON.stringify(message));
        }, { level: Logger.DEBUG });
    },

    //service中拥有以下方法的presenter会在$beforePresenterRun中传入
    $getInterfaceMethods: function () {
        var filterList = [
            //手写
            {
                interface: 'writerService',
                methods: ['getStrokeData', 'parseStrokeData', 'edit', 'editTitle', 'clean', 'closePopWin']
            },
            //布局
            {
                interface: 'layoutService',
                methods: ['initContainer', 'getContainer', 'adjustLayoutForStartAnswer', 'adjustLayoutForEndAnswer', 'setLocationProperties', 'showMask']
            }
        ]
        return filterList;
    },
    $beforePresenterRun: function (name, metaInfo, service) {
        this.logger.debug('获取到需要的service');
        if (metaInfo.name === 'HandWriter' || metaInfo.name === 'WriteLayout') {
            this.services[name] = service;
        }
    },

    /**
     * 获取Service类，用于重写
     */
    getServiceClass: function () {
        return Service;
    },
    /**
     * Presenter对外暴露的方法
     */
    getService: function () {
        var self = this;
        self._service_ = new Service(self);
        return self._service_;
    },
    /**
     * 重写Service
     * @param s
     */
    setServiceClass: function (s) {
        Service = s;
    },
    /****以下开始为icPlayer的生命周期方法*****/
    run: function (view, model) {
        this.model = model;
        this.$view = $(view);
        if (model.__containerSelector) {
            this.containerSelector = model.__containerSelector;
        }
    },
    pageShow: function () {
        this._bindEvent();
    },
    pageLeave: function () {
        this._stopMediaPlay();
        this._unbindEvent();
        this.services = null;
        this.background = null;
        this.isLock = false;
    },
    destroy: function () {

    },
    _bindEvent: function () {
        this.$addEventListener('HandWriterStartWrite', PresenterEventType.IC_PLAYER_EVENT, this._startWriteHandler);
        this.$addEventListener('exerciseStateChange', PresenterEventType.IC_PLAYER_EVENT, this._exerciseStateChange);
        //多媒体全屏隐藏手写板事件
        this.$addEventListener('HandWriteDisplayChange', PresenterEventType.IC_PLAYER_EVENT, this._setDisplayStatus);
        //视频全屏监听
        if (this.screenfull.enabled) {
            document.addEventListener(this.screenfull.raw.fullscreenchange, this._fullScreenEventHandler.bind(this));
        }
    },
    _unbindEvent: function () {
        this.$removeEventListener();
    },
    /**
     * 全屏播放视频回调处理
     * @private
     */
    _fullScreenEventHandler: function () {

    },
    /**
     * 发送手写板背景数据给教师端
     * @param eventName
     * @param eventData
     * @private
     */
    _sendToTeacherBackground: function () {
        if (this.currentRuntime == icCreatePlayer.RUNTIME.TEACHER_PC) {
            this.$dispatchEvent('sendToPresenter', PresenterEventType.NATIVE_EVENT, {
                type: "examBackground",
                instanceId: this.model.questionType,
                data: this.background
            });
        }
    },
    /**
     * 设置手写板背景
     * @param backgroud
     * @private
     */
    setBackground: function (background) {
        this.background = background;
    },
    /**
     * 上报状态
     * @private
     */
    _changeAnswerStatus: function (status) {
        if (this.currentRuntime === icCreatePlayer.RUNTIME.STUDENT_MOBILE) {
            // H5端的状态上报
            this.$dispatchEvent('ExamStatusReport', PresenterEventType.IC_PLAYER_EVENT, {
                'source': 'Writer',
                'type': 'status',
                'value': {
                    'examId': this.model.examId,
                    'status': status
                }
            });
        }
    },
    /**
     * 关闭遮罩，全屏播放
     * @private
     */
    _stopMediaPlay: function () {
        //暂停全部
        this.playerController.getCommands().mediaPause();
        QtiPlayer.resetMedia();
    },
    /**
     * 开始书写
     * @private
     */
    _startWriteHandler: function () {
        this.currentStatus = WriteStatus.writing;
        // 改变按钮状态
        this.$dispatchEvent('questionStateChange', PresenterEventType.IC_PLAYER_EVENT, {
            canSubmit: true,
            linkQuestionId: this.model.id
        });
        this.startWrite = true;
    },
    /**
     * 随堂练习状态发生改变
     * @param data
     * @private
     */
    _exerciseStateChange: function (data) {
        if (data.value.result) {
            if (data.type === 'exit') {
                console.log('exit');
                if (this.services.writerService) {
                    this.services.writerService.clean();
                    this.services.writerService.edit(true);
                }
            }
            if (data.type === 'start') {
                if (this.background !== null) {
                    this._sendToTeacherBackground();
                }
                //this.services.writerService.edit(false);
            }
        }
    },
    /**
     * 设置手写板显示状态
     * @param eventData
     * @private
     */
    _setDisplayStatus: function (eventData) {
        
    }
});

window.BasicWriteController = BasicWriteController;

/***/ })
/******/ ]);