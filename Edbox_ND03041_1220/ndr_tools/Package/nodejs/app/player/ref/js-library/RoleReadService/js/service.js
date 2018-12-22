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
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IcrAndroidVoiceService = (function () {
    function IcrAndroidVoiceService() {
        this.mDefered = null;
        this.mInitDefered = null;
        this.mInitFlag = false;
        console.info("This is IcrAndroidVoiceService");
    }
    IcrAndroidVoiceService.prototype.setContext = function (context) {
        if (context) {
            this.mContext = context;
        }
        else {
            throw new Error('上下文对象不能为空');
        }
    };
    IcrAndroidVoiceService.prototype.destroy = function () {
        console.info("IcrAndroidVoiceService destroy!");
        this.callNative('destroyPresenter', { 'instanceId': this.recorderInstanceId });
        this.callNative('destroyPresenter', { 'instanceId': this.evaluateInstanceId });
    };
    IcrAndroidVoiceService.prototype.created = function (recorderOpts, evaluateOpts) {
        this.mInitFlag = false;
        this.mInitDefered = $.Deferred();
        console.info("IcrAndroidVoiceService created!");
        var eventName = 'createPresenter';
        this.recorderInstanceId = this.getRandomString(16);
        this.evaluateInstanceId = this.getRandomString(16);
        var recorderData = {
            'presenterId': 'voice_recorder',
            'instanceId': this.recorderInstanceId,
            'initData': {
                'initVisible': recorderOpts['initVisible'],
                'position': {
                    'left': recorderOpts['position']['left'],
                    'top': recorderOpts['position']['top']
                },
                'amplitudeStyle': recorderOpts['amplitudeStyle']
            }
        };
        this.callNative(eventName, recorderData);
        var basepath = this.mContext['basePath'] ? this.mContext['basePath'] : this.mContext['BasePath'];
        var provisionPath = basepath.replace('file://', '')
            .match("^[\\s\\S]+/ref/")[0] + 'js-library/RoleReadService/provision/aiengine.provision';
        var evaluateData = {
            'presenterId': 'voice_evaluating',
            'instanceId': this.evaluateInstanceId,
            'initData': {
                "authorize": {
                    "appKey": '144350248200000e',
                    "secretKey": 'b74221979291db4b95876530bf02ad77',
                    "provisionPath": provisionPath,
                    "evaluationType": 'sentence'
                }
            }
        };
        this.callNative(eventName, evaluateData);
        return this.mInitDefered.promise();
    };
    IcrAndroidVoiceService.prototype.callNative = function (eventName, eventData) {
        var context = this.mContext;
        if (context && context.$dispatchEvent) {
            context.$dispatchEvent(eventName, PresenterEventType.NATIVE_EVENT, eventData);
        }
        else if (context.dispatchEvent) {
            context.dispatchEvent(eventName, PresenterEventType.NATIVE_EVENT, eventData);
        }
    };
    IcrAndroidVoiceService.prototype.callH5 = function (eventName, eventData) {
        var context = this.mContext;
        if (context && context.$dispatchEvent) {
            context.$dispatchEvent(eventName, PresenterEventType.IC_PLAYER_EVENT, eventData);
        }
        else if (context.dispatchEvent) {
            context.dispatchEvent(eventName, PresenterEventType.IC_PLAYER_EVENT, eventData);
        }
    };
    IcrAndroidVoiceService.prototype.bindEvent = function () {
        var context = this.mContext;
        if (context.$addEventListener) {
            context.$addEventListener('recordVoiceCallback', PresenterEventType.NATIVE_EVENT, this.recordVoiceCallback.bind(this));
            context.$addEventListener('startRecordVoiceCallback', PresenterEventType.NATIVE_EVENT, this.startRecordVoiceCallback.bind(this));
            context.$addEventListener('voiceVolumeCallback', PresenterEventType.NATIVE_EVENT, this.voiceVolumeCallback.bind(this));
            context.$addEventListener('initEvaluatingCallback', PresenterEventType.NATIVE_EVENT, this.initEvaluatingCallback.bind(this));
            context.$addEventListener('evaluatingVoiceCallback', PresenterEventType.NATIVE_EVENT, this.evaluatingVoiceCallback.bind(this));
            context.$addEventListener('audioBase64Callback', PresenterEventType.NATIVE_EVENT, this.audioBase64Callback.bind(this));
            context.$addEventListener('recordVisibleCallback', PresenterEventType.NATIVE_EVENT, this.recordVisibleCallback.bind(this));
        }
        else if (context.addEventListener) {
            context.addEventListener('recordVoiceCallback', PresenterEventType.NATIVE_EVENT, this.recordVoiceCallback.bind(this));
            context.addEventListener('startRecordVoiceCallback', PresenterEventType.NATIVE_EVENT, this.startRecordVoiceCallback.bind(this));
            context.addEventListener('voiceVolumeCallback', PresenterEventType.NATIVE_EVENT, this.voiceVolumeCallback.bind(this));
            context.addEventListener('initEvaluatingCallback', PresenterEventType.NATIVE_EVENT, this.initEvaluatingCallback.bind(this));
            context.addEventListener('evaluatingVoiceCallback', PresenterEventType.NATIVE_EVENT, this.evaluatingVoiceCallback.bind(this));
            context.addEventListener('audioBase64Callback', PresenterEventType.NATIVE_EVENT, this.audioBase64Callback.bind(this));
            context.addEventListener('recordVisibleCallback', PresenterEventType.NATIVE_EVENT, this.recordVisibleCallback.bind(this));
        }
    };
    IcrAndroidVoiceService.prototype.toggleShow = function (isVisible) {
        this.mDefered = $.Deferred();
        var eventName = 'sendToPresenter';
        var eventData = {
            'instanceId': this.recorderInstanceId,
            'type': 'showAmplitude',
            'data': {
                'isVisible': isVisible
            }
        };
        this.callNative(eventName, eventData);
        return this.mDefered.promise();
    };
    IcrAndroidVoiceService.prototype.setPosition = function (position) {
        var eventName = 'sendToPresenter';
        var eventData = {
            'instanceId': this.recorderInstanceId,
            'type': 'setPosition',
            'data': {
                'left': position.left,
                'top': position.top
            }
        };
        this.callNative(eventName, eventData);
    };
    IcrAndroidVoiceService.prototype.requestEvaluateVoice = function () {
        var eventName = 'sendToPresenter';
        var eventData = {
            'instanceId': this.evaluateInstanceId,
            'type': 'evaluatingVoice',
            'data': {
                "voiceId": '',
                "evaluationType": '',
                "evaluationText": '',
                "voicePath": ''
            }
        };
        this.callNative(eventName, eventData);
    };
    IcrAndroidVoiceService.prototype.requestAudioBase64 = function (url) {
        this.mDefered = $.Deferred();
        var eventName = 'sendToPresenter';
        var eventData = {
            'instanceId': this.recorderInstanceId,
            'type': 'requestAudioBase64',
            'data': {
                "url": url
            }
        };
        this.callNative(eventName, eventData);
        return this.mDefered.promise();
    };
    IcrAndroidVoiceService.prototype.init = function () {
        this.bindEvent();
    };
    IcrAndroidVoiceService.prototype.startRecord = function (options) {
        var eventName = 'sendToPresenter';
        var eventData = {
            'instanceId': this.recorderInstanceId,
            'type': 'recordVoice',
            'data': {
                'voiceId': options['voiceId'],
                'overSecond': options['overSecond'],
                'persistent': true,
                'volumeReport': true,
                'volumeOptions': {
                    'duration': 300
                },
                'evaluateOptions': {
                    'content': options['content'],
                    'evaluationType': options['evaluationType'] ? options['evaluationType'] : '',
                }
            }
        };
        this.callNative(eventName, eventData);
    };
    IcrAndroidVoiceService.prototype.stopRecord = function (options) {
        var eventName = 'sendToPresenter';
        var eventData = {
            'instanceId': this.recorderInstanceId,
            'type': 'stopRecord',
            'data': {
                'voiceId': options['voiceId'],
                'options': {
                    'needEvaluating': true,
                    'isCancel': options['isCancel'] === undefined ? false : options['isCancel']
                }
            }
        };
        this.callNative(eventName, eventData);
    };
    IcrAndroidVoiceService.prototype.setRecordSize = function (options) {
        var eventName = 'sendToPresenter';
        var eventData = {
            'instanceId': this.recorderInstanceId,
            'type': 'setRecordSize',
            'data': {
                'width': options['width'],
                'height': options['height']
            }
        };
        this.callNative(eventName, eventData);
    };
    IcrAndroidVoiceService.prototype.stopRecordForResult = function () {
        return null;
    };
    IcrAndroidVoiceService.prototype.playRecord = function (url) {
    };
    IcrAndroidVoiceService.prototype.getRandomString = function (len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    };
    IcrAndroidVoiceService.prototype.checkNativeInit = function () {
        if (this.mInitFlag && this.mInitDefered) {
            this.mInitDefered.resolve();
            this.mInitDefered = null;
        }
    };
    IcrAndroidVoiceService.prototype.recordVoiceCallback = function (eventData) {
        var eventName = IcrAndroidVoiceService.SERVICEEVENTNAME;
        console.info('======recordVoiceCallback=====', eventData);
        eventData['method'] = 'recordVoiceCallback';
        this.callH5(eventName, eventData);
    };
    IcrAndroidVoiceService.prototype.startRecordVoiceCallback = function (eventData) {
        var eventName = IcrAndroidVoiceService.SERVICEEVENTNAME;
        console.info('======startRecordVoiceCallback=====', eventData);
        eventData['method'] = 'startRecordVoiceCallback';
        this.callH5(eventName, eventData);
    };
    IcrAndroidVoiceService.prototype.voiceVolumeCallback = function (eventData) {
        var eventName = IcrAndroidVoiceService.SERVICEEVENTNAME;
        eventData['method'] = 'voiceVolumeCallback';
        this.callH5(eventName, eventData);
    };
    IcrAndroidVoiceService.prototype.initEvaluatingCallback = function (eventData) {
        if (eventData['code'] == '0') {
            console.info('初始化语音评测组件完成');
            this.mInitFlag = true;
            return this.checkNativeInit();
        }
        else {
            console.error('初始化语音评测组件异常: ', eventData['data']);
            this.mInitDefered.reject();
            this.mInitDefered = null;
        }
    };
    IcrAndroidVoiceService.prototype.evaluatingVoiceCallback = function (eventData) {
        var eventName = IcrAndroidVoiceService.SERVICEEVENTNAME;
        console.info('======evaluatingVoiceCallback=====', eventData);
        eventData['method'] = 'evaluatingVoiceCallback';
        this.callH5(eventName, eventData);
    };
    IcrAndroidVoiceService.prototype.audioBase64Callback = function (eventData) {
        var eventName = this.SERVICEEVENTNAME;
        console.log('========audioBase64Callback==========', eventData);
        eventData['method'] = 'audioBase64Callback';
        this.callH5(eventName, eventData);
        if (this.mDefered && this.mDefered.resolve) {
            this.mDefered.resolve(eventData);
            this.mDefered = null;
        }
    };
    IcrAndroidVoiceService.prototype.recordVisibleCallback = function (eventData) {
        var eventName = this.SERVICEEVENTNAME;
        console.log('========recordVisibleCallback==========', eventData);
        eventData['method'] = 'recordVisibleCallback';
        this.callH5(eventName, eventData);
        if (this.mDefered && this.mDefered.resolve) {
            this.mDefered.resolve(eventData);
            this.mDefered = null;
        }
    };
    return IcrAndroidVoiceService;
}());
IcrAndroidVoiceService.SERVICEEVENTNAME = 'ServiceEvent';
IcrAndroidVoiceService.VERSION = '1.0.0';
exports.IcrAndroidVoiceService = IcrAndroidVoiceService;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IcrPCVoiceService = (function () {
    function IcrPCVoiceService() {
        this.SERVICEEVENTNAME = 'ServiceEvent';
        this.mStopVoiceId = '';
        this.mIsCancel = false;
    }
    IcrPCVoiceService.prototype.setContext = function (context) {
        if (context) {
            this.mContext = context;
        }
        else {
            throw new Error('上下文对象不能为空');
        }
    };
    IcrPCVoiceService.prototype.destroy = function () {
        console.info("IcrPCVoiceService destroy!");
        this.callNative('destoryPresenter', { 'instanceId': 'RoleReading' });
        this.callNative('destoryPresenter', { 'instanceId': 'voice_evaluating' });
    };
    IcrPCVoiceService.prototype.created = function () {
        console.info("IcrPCVoiceService created!");
        var def = $.Deferred();
        def.resolve();
        return def.promise();
    };
    IcrPCVoiceService.prototype.toggleShow = function (isVisible) {
        var def = $.Deferred();
        def.resolve();
        return def.promise();
    };
    IcrPCVoiceService.prototype.callNative = function (eventName, eventData) {
        var context = this.mContext;
        if (context.$dispatchEvent) {
            context.$dispatchEvent(eventName, PresenterEventType.NATIVE_EVENT, eventData);
        }
        else if (context.dispatchEvent) {
            context.dispatchEvent(eventName, PresenterEventType.NATIVE_EVENT, eventData);
        }
    };
    IcrPCVoiceService.prototype.callH5 = function (eventName, eventData) {
        var context = this.mContext;
        if (context.$dispatchEvent) {
            context.$dispatchEvent(eventName, PresenterEventType.IC_PLAYER_EVENT, eventData);
        }
        else if (context.dispatchEvent) {
            context.dispatchEvent(eventName, PresenterEventType.IC_PLAYER_EVENT, eventData);
        }
    };
    IcrPCVoiceService.prototype.bindEvent = function () {
        var context = this.mContext;
        if (context.$addEventListener) {
            context.$addEventListener('recordVoiceCallback', PresenterEventType.NATIVE_EVENT, this.recordVoiceCallback.bind(this));
            context.$addEventListener('voiceVolumeCallback', PresenterEventType.NATIVE_EVENT, this.voiceVolumeCallback.bind(this));
            context.$addEventListener('initEvaluatingCallback', PresenterEventType.NATIVE_EVENT, this.initEvaluatingCallback.bind(this));
            context.$addEventListener('evaluatingVoiceCallback', PresenterEventType.NATIVE_EVENT, this.evaluatingVoiceCallback.bind(this));
        }
        else if (context.addEventListener) {
            context.addEventListener('recordVoiceCallback', PresenterEventType.NATIVE_EVENT, this.recordVoiceCallback.bind(this));
            context.addEventListener('voiceVolumeCallback', PresenterEventType.NATIVE_EVENT, this.voiceVolumeCallback.bind(this));
            context.addEventListener('initEvaluatingCallback', PresenterEventType.NATIVE_EVENT, this.initEvaluatingCallback.bind(this));
            context.addEventListener('evaluatingVoiceCallback', PresenterEventType.NATIVE_EVENT, this.evaluatingVoiceCallback.bind(this));
        }
    };
    IcrPCVoiceService.prototype.requestEvaluateVoice = function () {
        var eventName = 'evaluatingVoice';
        var eventData = {
            "voiceId": '',
            "evaluationType": '',
            "evaluationText": '',
            "voicePath": ''
        };
        this.callNative(eventName, eventData);
    };
    IcrPCVoiceService.prototype.setPosition = function (position) {
    };
    IcrPCVoiceService.prototype.setRecordSize = function (options) {
    };
    IcrPCVoiceService.prototype.init = function () {
        this.bindEvent();
    };
    IcrPCVoiceService.prototype.startRecord = function (options) {
        console.log('======startRecord=====', options);
        var eventName = 'recordVoice';
        var eventData = {
            'voiceId': options['voiceId'],
            'options': {
                'maxDuration': 10000,
                'volumeReport': true,
                'needEvaluation': true,
                'volumeOptions': {
                    'duration': 300
                },
                'evaluateOptions': {
                    'type': options['evaluationType'] ? options['evaluationType'] : "sections",
                    'content': options['content']
                }
            }
        };
        this.callNative(eventName, eventData);
        eventName = this.SERVICEEVENTNAME;
        eventData = {
            'state': true,
            'isError': false
        };
        console.info('======startRecordVoiceCallback=====', eventData);
        eventData['method'] = 'startRecordVoiceCallback';
        this.callH5(eventName, eventData);
    };
    IcrPCVoiceService.prototype.stopRecord = function (options) {
        console.log('======stopRecord=====', options);
        var eventName = 'stopRecord';
        var eventData = {
            'voiceId': options['voiceId'],
            'options': {
                'needEvaluating': options['isCancel'] === true ? false : true,
                'isCancel': options['isCancel'] === undefined ? false : options['isCancel']
            }
        };
        this.mStopVoiceId = options['voiceId'];
        this.mIsCancel = options['isCancel'];
        this.callNative(eventName, eventData);
    };
    IcrPCVoiceService.prototype.playRecord = function (url) {
    };
    IcrPCVoiceService.prototype.recordVoiceCallback = function (eventData) {
        var eventName = this.SERVICEEVENTNAME;
        console.log('========recordVoiceCallback==========', eventData);
        if (this.mIsCancel === true && this.mStopVoiceId === eventData['data']['voiceId']) {
            eventData['code'] = 3, eventData['data']['url'] = '';
        }
        eventData['method'] = 'recordVoiceCallback';
        this.callH5(eventName, eventData);
    };
    IcrPCVoiceService.prototype.voiceVolumeCallback = function (eventData) {
        var eventName = this.SERVICEEVENTNAME;
        console.log('========voiceVolumeCallback==========' + new Date().toLocaleString(), eventData);
        if (typeof eventData['volume'] == 'number') {
            eventData['volume'] = eventData['volume'] * 100 / 300;
        }
        eventData['method'] = 'voiceVolumeCallback';
        this.callH5(eventName, eventData);
    };
    IcrPCVoiceService.prototype.initEvaluatingCallback = function (eventData) {
        if (eventData['code'] == '0') {
            console.log('初始化语音评测组件完成');
        }
        else {
            throw new Error('初始化语音评测组件异常: ' + eventData['data']);
        }
    };
    IcrPCVoiceService.prototype.evaluatingVoiceCallback = function (eventData) {
        var eventName = this.SERVICEEVENTNAME;
        console.log('========evaluatingVoiceCallback==========', eventData);
        eventData['method'] = 'evaluatingVoiceCallback';
        this.callH5(eventName, eventData);
    };
    return IcrPCVoiceService;
}());
exports.IcrPCVoiceService = IcrPCVoiceService;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IcrPreviewVoiceService = (function () {
    function IcrPreviewVoiceService() {
        this.SERVICEEVENTNAME = 'ServiceEvent';
        this.LOCAL_HOST = window.location.origin || (window.location.protocol + '//' + window.location.host);
        this.API_CONFIG = {
            voiceRecordStart: this.LOCAL_HOST + '/v3.0/voiceRecord/start',
            voiceRecordEnd: this.LOCAL_HOST + '/v3.0/voiceRecord/stop'
        };
        this.recording = false;
        this.mDefered = null;
    }
    IcrPreviewVoiceService.prototype.setContext = function (context) {
        if (context) {
            this.mContext = context;
        }
        else {
            throw new Error('上下文对象不能为空');
        }
    };
    IcrPreviewVoiceService.prototype.destroy = function () {
        console.info("IcrPreviewVoiceService destroy!");
    };
    IcrPreviewVoiceService.prototype.created = function () {
        console.info("IcrPreviewVoiceService created!");
        var def = $.Deferred();
        def.resolve();
        return def.promise();
    };
    IcrPreviewVoiceService.prototype.toggleShow = function (isVisible) {
        this.mDefered = $.Deferred();
        this.mDefered.resolve();
        return this.mDefered.promise();
    };
    IcrPreviewVoiceService.prototype.callNative = function (eventName, eventData) {
        var context = this.mContext;
        if (context.$dispatchEvent) {
            context.$dispatchEvent(eventName, PresenterEventType.NATIVE_EVENT, eventData);
        }
        else if (context.dispatchEvent) {
            context.dispatchEvent(eventName, PresenterEventType.NATIVE_EVENT, eventData);
        }
    };
    IcrPreviewVoiceService.prototype.callH5 = function (eventName, eventData) {
        var context = this.mContext;
        if (context.$dispatchEvent) {
            context.$dispatchEvent(eventName, PresenterEventType.IC_PLAYER_EVENT, eventData);
        }
        else if (context.dispatchEvent) {
            context.dispatchEvent(eventName, PresenterEventType.IC_PLAYER_EVENT, eventData);
        }
    };
    IcrPreviewVoiceService.prototype.bindEvent = function () {
        var _this = this;
        var context = this.mContext;
        if (context.$addEventListener) {
            context.$addEventListener('recordVoiceCallback', PresenterEventType.NATIVE_EVENT, this.recordVoiceCallback.bind(this));
            context.$addEventListener('voiceVolumeCallback', PresenterEventType.NATIVE_EVENT, this.voiceVolumeCallback.bind(this));
            context.$addEventListener('initEvaluatingCallback', PresenterEventType.NATIVE_EVENT, this.initEvaluatingCallback.bind(this));
            context.$addEventListener('evaluatingVoiceCallback', PresenterEventType.NATIVE_EVENT, this.evaluatingVoiceCallback.bind(this));
        }
        else if (context.addEventListener) {
            context.addEventListener('recordVoiceCallback', PresenterEventType.NATIVE_EVENT, this.recordVoiceCallback.bind(this));
            context.addEventListener('voiceVolumeCallback', PresenterEventType.NATIVE_EVENT, this.voiceVolumeCallback.bind(this));
            context.addEventListener('initEvaluatingCallback', PresenterEventType.NATIVE_EVENT, this.initEvaluatingCallback.bind(this));
            context.addEventListener('evaluatingVoiceCallback', PresenterEventType.NATIVE_EVENT, this.evaluatingVoiceCallback.bind(this));
        }
        window.onbeforeunload = function () {
            var opt = { 'voiceId': _this.currentVoiceId, 'isCancel': true };
            _this.stopRecord(opt);
        };
    };
    IcrPreviewVoiceService.prototype.requestEvaluateVoice = function () {
    };
    IcrPreviewVoiceService.prototype.setPosition = function (position) {
    };
    IcrPreviewVoiceService.prototype.setRecordSize = function (options) {
    };
    IcrPreviewVoiceService.prototype.init = function () {
        this.bindEvent();
    };
    IcrPreviewVoiceService.prototype.startRecord = function (options) {
        var _this = this;
        this.currentVoiceId = options['voiceId'];
        this.currentContent = options['content'];
        var url = this.API_CONFIG.voiceRecordStart;
        $.ajax({
            type: 'POST',
            url: url,
            success: function (data) {
                if (data.status === 0) {
                    console.log('=====0=====', data, _this);
                    var overtime = options.overSecond != undefined ? options.overSecond * 1000 : (10 * 1000);
                    _this.TimeoutValue = setTimeout(function () {
                        var opt = { 'voiceId': _this.currentVoiceId };
                        _this.stopRecord(opt);
                    }, overtime);
                    _this.IntervalValue = setInterval(_this.fatchRandomVolume.bind(_this), 300);
                    _this.recording = true;
                    var eventName = _this.SERVICEEVENTNAME;
                    var eventData = {
                        'state': true,
                        'isError': false
                    };
                    console.info('======startRecordVoiceCallback=====', eventData);
                    eventData['method'] = 'startRecordVoiceCallback';
                    _this.callH5(eventName, eventData);
                }
                else if (data.status === -1) {
                    console.log('=====-1=====', data);
                }
                else if (data.status === -2) {
                    console.log('=====-2=====', data);
                }
            },
            error: function (msg) {
                console.error('=====error=====', msg);
            }
        });
    };
    IcrPreviewVoiceService.prototype.stopRecord = function (options) {
        var _this = this;
        var filePath = this.getQueryString('file_path');
        var url = this.API_CONFIG.voiceRecordEnd;
        var words = this.currentContent ? this.currentContent.split(" ") : [];
        $.ajax({
            type: 'POST',
            url: url,
            async: false,
            data: { file_path: filePath },
            success: function (data) {
                var eventName = _this.SERVICEEVENTNAME;
                var _filePath = filePath.replace(/\\/g, '/');
                var wordArray = CryptoJS.enc.Utf8.parse(_filePath);
                _filePath = CryptoJS.enc.Base64.stringify(wordArray);
                _filePath = _filePath.replace(/\+/gi, "-");
                _filePath = _filePath.replace(/\//gi, "_");
                var url = '/v2.0/assets/proxy3/' + _filePath + '/' + data['href'];
                var eventData = {
                    'code': data.flag ? 0 : 1,
                    'method': 'recordVoiceCallback',
                    'data': {
                        'persistent': true,
                        'url': url,
                        'voiceId': _this.currentVoiceId
                    }
                };
                if (options['isCancel'] === true) {
                    eventData.code = 3;
                    eventData.data.url = '';
                }
                console.log('========recordVoiceCallback==========', eventData);
                _this.callH5(eventName, eventData);
                clearInterval(_this.IntervalValue);
                clearTimeout(_this.TimeoutValue);
                _this.recording = false;
                if (options['isCancel'] === true) {
                    return;
                }
                console.log('========evaluatingVoiceCallback==========', eventData);
                var evaluationResult = {
                    "result": {
                        "rank": 100,
                        "integrity": 100,
                        "overall": 90,
                        "accuracy": 93,
                        "details": [],
                        "fluency": {
                            "pause": 0,
                            "overall": 95,
                            "speed": 226
                        },
                        "systime": 415
                    }
                };
                if (words.length > 0) {
                    var overall_1 = 0;
                    words.forEach(function (word, wordIndex) {
                        var random = 100 * Math.random();
                        var score = parseInt(random.toFixed(0)) + 35;
                        overall_1 += score;
                        evaluationResult.result.details.push({
                            'char': word,
                            'text': word,
                            'score': score
                        });
                    });
                    evaluationResult.result.overall = overall_1 / words.length;
                    evaluationResult.result.rank = evaluationResult.result.overall;
                    evaluationResult.result.integrity = evaluationResult.result.overall;
                    evaluationResult.result.accuracy = evaluationResult.result.overall;
                }
                var eventData2 = {
                    'code': 0,
                    'method': 'evaluatingVoiceCallback',
                    'data': {
                        'voiceId': _this.currentVoiceId,
                        'evaluationResult': JSON.stringify(evaluationResult)
                    }
                };
                _this.callH5(eventName, eventData2);
            },
            error: function (msg) {
                console.error('=====error=====', msg);
            }
        });
    };
    IcrPreviewVoiceService.prototype.playRecord = function (url) {
    };
    IcrPreviewVoiceService.prototype.recordVoiceCallback = function (eventData) {
        var eventName = this.SERVICEEVENTNAME;
        console.log('========recordVoiceCallback==========', eventData);
        eventData['method'] = 'recordVoiceCallback';
        this.callH5(eventName, eventData);
    };
    IcrPreviewVoiceService.prototype.voiceVolumeCallback = function (eventData) {
        var eventName = this.SERVICEEVENTNAME;
        console.log('========voiceVolumeCallback==========' + new Date().toLocaleString(), eventData);
        eventData['method'] = 'voiceVolumeCallback';
        this.callH5(eventName, eventData);
    };
    IcrPreviewVoiceService.prototype.initEvaluatingCallback = function (eventData) {
        if (eventData['code'] == '0') {
            console.log('初始化语音评测组件完成');
        }
        else {
            throw new Error('初始化语音评测组件异常: ' + eventData['data']);
        }
    };
    IcrPreviewVoiceService.prototype.evaluatingVoiceCallback = function (eventData) {
        var eventName = this.SERVICEEVENTNAME;
        console.log('========evaluatingVoiceCallback==========', eventData);
        eventData['method'] = 'evaluatingVoiceCallback';
        this.callH5(eventName, eventData);
    };
    IcrPreviewVoiceService.prototype.fatchRandomVolume = function () {
        var volume = 100 * Math.random();
        this.voiceVolumeCallback({ 'voiceId': '', 'volume': volume });
    };
    IcrPreviewVoiceService.prototype.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURIComponent(r[2]);
        return null;
    };
    return IcrPreviewVoiceService;
}());
exports.IcrPreviewVoiceService = IcrPreviewVoiceService;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IcrAndroidVoiceService_1 = __webpack_require__(0);
var IcrPCVoiceService_1 = __webpack_require__(1);
var IcrPreviewVoiceService_1 = __webpack_require__(2);
(function (__ServiceComponent) {
    var service;
    (function (service) {
        service.IcrAndroidVoiceService = IcrAndroidVoiceService_1.IcrAndroidVoiceService;
        service.IcrPCVoiceService = IcrPCVoiceService_1.IcrPCVoiceService;
        service.IcrPreviewVoiceService = IcrPreviewVoiceService_1.IcrPreviewVoiceService;
    })(service = window["__ServiceComponent"]["voiceservice"] || (window["__ServiceComponent"]["voiceservice"] = {}));
})(window["__ServiceComponent"] || (window["__ServiceComponent"] = {}));


/***/ })
/******/ ]);