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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PlayMode;
(function (PlayMode) {
    PlayMode[PlayMode["ONCE"] = 1] = "ONCE";
    PlayMode[PlayMode["TIMES"] = 2] = "TIMES";
    PlayMode[PlayMode["REPEAT"] = 3] = "REPEAT";
})(PlayMode = exports.PlayMode || (exports.PlayMode = {}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PlayMode_1 = __webpack_require__(0);
var PlayOption = (function () {
    function PlayOption() {
        this.src = '';
        this.mode = PlayMode_1.PlayMode.ONCE;
        this.times = 1;
    }
    return PlayOption;
}());
exports.PlayOption = PlayOption;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TimeSlice = (function () {
    function TimeSlice(startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
    return TimeSlice;
}());
exports.TimeSlice = TimeSlice;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PlayOption_1 = __webpack_require__(1);
var TimeSlice_1 = __webpack_require__(2);
var PlayMode_1 = __webpack_require__(0);
var AudioPlayService = (function () {
    function AudioPlayService() {
        this.mPlayingSlice = 0;
        this.mPlayMode = PlayMode_1.PlayMode.ONCE;
        this.mPlayTimes = 1;
        this.mPlayedTimes = 0;
        console.log('This is AudioPlayService');
    }
    AudioPlayService.prototype.setContext = function (context) {
        Object.defineProperty(this, 'mContext', { value: context, configurable: false });
    };
    AudioPlayService.prototype.created = function (option, audio) {
        console.log('AudioPlayService created');
        this.mAudio = audio || new Audio();
        this.mOption = option || new PlayOption_1.PlayOption();
        this.bindEvent();
        if (option.src !== undefined && option.src !== '') {
            this.mAudio.src = option.src;
        }
        this.mPlayMode = option.mode || PlayMode_1.PlayMode.ONCE;
        this.mPlayTimes = option.times || 1;
    };
    AudioPlayService.prototype.destroy = function () {
        console.log('AudioPlayService destroy');
        this.unBindEvent();
    };
    AudioPlayService.prototype.playTimeSlice = function (ts) {
        if (ts.length > 0) {
            this.mPlayingSlice = 0;
            this.mPlayTimeSlices = ts;
            this.mAudio.currentTime = ts[0].startTime;
            this.mAudio.play();
        }
    };
    AudioPlayService.prototype.play = function () {
        this.mAudio.play();
    };
    AudioPlayService.prototype.pause = function () {
        this.mAudio.pause();
    };
    AudioPlayService.prototype.getDuration = function () {
        return this.mAudio.duration;
    };
    AudioPlayService.prototype.getCurrentTime = function () {
        return this.mAudio.currentTime;
    };
    AudioPlayService.prototype.setCurrentTime = function (time) {
        this.mAudio.currentTime = time;
        for (var i = 0, len = this.mPlayTimeSlices.length; i < len; i++) {
            var ts = this.mPlayTimeSlices[i];
            if (time >= ts.startTime && time <= ts.endTime) {
                this.mPlayingSlice = i;
                break;
            }
        }
    };
    AudioPlayService.prototype.getVolume = function () {
        return this.mAudio.volume;
    };
    AudioPlayService.prototype.setVolume = function (v) {
        this.mAudio.volume = v;
    };
    AudioPlayService.prototype.setAudioPath = function (src) {
        this.mAudio.src = src;
        this.mOption.src = src;
    };
    AudioPlayService.prototype.getAudioOption = function () {
        return this.mOption;
    };
    AudioPlayService.prototype.setPlayMode = function (mode, times) {
        this.mPlayMode = mode;
        switch (mode) {
            case PlayMode_1.PlayMode.ONCE:
                this.mPlayTimes = 1;
                break;
            case PlayMode_1.PlayMode.TIMES:
                this.mPlayTimes = times;
                break;
            case PlayMode_1.PlayMode.REPEAT:
                this.mPlayTimes = 99999;
                break;
        }
        this.mPlayedTimes = 0;
    };
    AudioPlayService.prototype.duration2Str = function (duration) {
        var result = ['00', '00', '00'];
        var hour = Math.floor(duration / 3600);
        result[0] = hour > 9 ? hour.toString() : '0' + hour;
        var min = Math.floor((duration % 3600) / 60);
        result[1] = min > 9 ? min.toString() : '0' + min;
        var sen = Math.floor((duration % 3600) % 60);
        result[2] = sen > 9 ? sen.toString() : '0' + sen;
        return result;
    };
    AudioPlayService.prototype.bindEvent = function () {
        this.mAudio.addEventListener('canplay', this.onCanPlay.bind(this));
        this.mAudio.addEventListener('loadedmetadata', this.onLoadedMetaData.bind(this));
    };
    AudioPlayService.prototype.unBindEvent = function () {
        if (this.mAudio != null) {
            this.mAudio.removeEventListener('canplay', this.onCanPlay);
            this.mAudio.removeEventListener('loadedmetadata', this.onLoadedMetaData);
            this.mAudio.removeEventListener('timeupdate', this.onTimeUpdate);
        }
    };
    AudioPlayService.prototype.onLoadedMetaData = function () {
        console.log('onLoadedMetaData');
        this.initPlayer();
    };
    AudioPlayService.prototype.onCanPlay = function () {
        console.log('onCanPlay');
    };
    AudioPlayService.prototype.onTimeUpdate = function () {
        if (this.mAudio.currentTime >= this.mPlayTimeSlices[this.mPlayingSlice].endTime) {
            console.log('play to ' + this.mPlayTimeSlices[this.mPlayingSlice].endTime + ' auto pause');
            while (this.mPlayingSlice < this.mPlayTimeSlices.length) {
                if (this.mAudio.currentTime >= this.mPlayTimeSlices[this.mPlayingSlice].endTime) {
                    this.mPlayingSlice++;
                }
                else {
                    break;
                }
            }
            if (this.mPlayingSlice < this.mPlayTimeSlices.length) {
                console.log('play to next');
                this.mAudio.currentTime = this.mPlayTimeSlices[this.mPlayingSlice].startTime;
            }
            else {
                this.mPlayingSlice = this.mPlayTimeSlices.length - 1;
                this.mAudio.pause();
                this.mPlayedTimes++;
                if (this.mPlayedTimes < this.mPlayTimes) {
                    this.mPlayingSlice = 0;
                    this.mAudio.currentTime = this.mPlayTimeSlices[0].startTime;
                    this.mAudio.play();
                }
                else {
                    console.log('play end');
                    if (this.mOption.onendHandler != undefined) {
                        this.mOption.onendHandler();
                    }
                }
            }
        }
        if (this.mOption.ontimeupdateHandler != undefined) {
            this.mOption.ontimeupdateHandler(this.mAudio.currentTime);
        }
    };
    AudioPlayService.prototype.initPlayer = function () {
        if (this.mPlayTimeSlices == null) {
            this.mPlayTimeSlices = [];
            this.mPlayTimeSlices.push(new TimeSlice_1.TimeSlice(0, this.mAudio.duration));
        }
        if (this.mOption.oncanplayHandler != undefined) {
            this.mOption.oncanplayHandler(this.mAudio.duration);
        }
        this.mAudio.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
    };
    return AudioPlayService;
}());
exports.AudioPlayService = AudioPlayService;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AudioPlayService_1 = __webpack_require__(3);
var PlayMode_1 = __webpack_require__(0);
var PlayOption_1 = __webpack_require__(1);
var TimeSlice_1 = __webpack_require__(2);
(function (__ServiceComponent) {
    var service;
    (function (service) {
        service.AudioPlayService = AudioPlayService_1.AudioPlayService;
        service.PlayMode = PlayMode_1.PlayMode;
        service.PlayOption = PlayOption_1.PlayOption;
        service.TimeSlice = TimeSlice_1.TimeSlice;
    })(service = window["__ServiceComponent"]["AudioPlayService"] || (window["__ServiceComponent"]["AudioPlayService"] = {}));
})(window["__ServiceComponent"] || (window["__ServiceComponent"] = {}));


/***/ })
/******/ ]);