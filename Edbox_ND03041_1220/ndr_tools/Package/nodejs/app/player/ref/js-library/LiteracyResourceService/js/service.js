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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LiteracyResourceService = (function () {
    function LiteracyResourceService() {
    }
    LiteracyResourceService.prototype.setContext = function (context) {
        this.mContext = context;
    };
    LiteracyResourceService.prototype.destroy = function () {
    };
    LiteracyResourceService.prototype.created = function () {
    };
    LiteracyResourceService.prototype.updateGroupLiteracyPresenter = function (questionId, wordList) {
        var url = "http://" + LiteracyResourceService.LOCAL_HOST + ":" + LiteracyResourceService.PORT
            + "/v0.2/subject_tool/GroupLiteracy/" + questionId;
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                type: 'PUT',
                url: url,
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(wordList),
                success: function (result) {
                    resolve(result);
                },
                error: function () {
                    reject();
                }
            });
        });
        return promise;
    };
    LiteracyResourceService.prototype.getWordList = function (chapterId) {
        var url = "http://" + LiteracyResourceService.LOCAL_HOST + ":" + LiteracyResourceService.PORT
            + "/v0.1/ndr/word/list?resultType=GroupLiteracy&chapterId=" + chapterId;
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                type: 'GET',
                url: url,
                success: function (result) {
                    resolve(result);
                },
                error: function () {
                    reject();
                }
            });
        });
        return promise;
    };
    LiteracyResourceService.prototype.getWordInfo = function (char) {
        var url = "http://" + LiteracyResourceService.LOCAL_HOST + ":" + LiteracyResourceService.PORT
            + "/v0.1/ndr/word/get?resultType=GroupLiteracy&char=" + char;
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                type: 'GET',
                url: url,
                success: function (result) {
                    resolve(result);
                },
                error: function () {
                    reject();
                }
            });
        });
        return promise;
    };
    LiteracyResourceService.LOCAL_HOST = "127.0.0.1";
    LiteracyResourceService.PORT = "3001";
    return LiteracyResourceService;
}());
exports.Classroom = LiteracyResourceService;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Classroom_1 = __webpack_require__(0);
(function (__ServiceComponent) {
    var service;
    (function (service) {
        service.Classroom = Classroom_1.Classroom;
    })(service = window["__ServiceComponent"]["LiteracyResourceService"] || (window["__ServiceComponent"]["LiteracyResourceService"] = {}));
})(window["__ServiceComponent"] || (window["__ServiceComponent"] = {}));


/***/ })
/******/ ]);