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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Created by Administrator on 2016/12/16.
 */
var myWord;
$.get("./json/zhuang.json", function (data) {
    myWord = new ChineseWordTracing({
        mode: 'display',
        word: data,
        renderTo: document.querySelector('#word')
    });

    bindEvent();
});

function bindEvent() {
    if ((typeof myWord === 'undefined' ? 'undefined' : _typeof(myWord)) != "object") return;

    $(".control").on("click", ".btn", function () {
        var index = $(this).index();

        switch (index) {
            case 0:
                myWord.showRadical();
                break;
            case 1:
                myWord.hideRadical();
                break;
            case 2:
                myWord.showStructure();
                break;
            case 3:
                myWord.hideStructure();
                break;
            case 4:
                myWord.startAutoTrace().done(function (info) {
                    console.log("全部描完了：", info);
                });
                break;
            case 5:
                myWord.stopAutoTrace();
                break;
            case 6:
                myWord.setSpeed("fast");
                break;
            case 7:
                myWord.setSpeed("normal");
                break;
            case 8:
                myWord.setSpeed("slow");
                break;
            case 9:
                myWord.reset();
                break;
            case 10:
                myWord.startSingleStepTrace();
                break;
            case 11:
                myWord.nextStep().done(function (info) {
                    console.log("下一笔的info:", info);
                });
                break;
            case 12:
                var info = myWord.preStep();
                console.log("上一笔的info:", info);
                break;

        }
    });
}

/***/ })

/******/ });
//# sourceMappingURL=test.js.map