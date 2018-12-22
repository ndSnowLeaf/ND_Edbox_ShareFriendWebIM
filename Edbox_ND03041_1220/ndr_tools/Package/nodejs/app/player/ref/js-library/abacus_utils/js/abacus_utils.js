/**
 * 算盘辅助工具
 */
var AbacusUtils = (function() {
    'use strict';
    
	// 常量
	var PRESENTER_ID = "abacus"; // 原生PresenterID
	var INSTANCE_ID = "abacus-student"; // 实体ID
	var EVENT_NAME = "AbacusPitchChangeEvent"; // 监听事件

	// 私有变量
	var bridgeListeners = null; // Native监听器
	var fnCallback = null; // 收到事件时的回调

	// 重力感应变换时的回调
	var onPitchChange = function(data) {
		if ($.isFunction(fnCallback)) {
			fnCallback(data.rotation_type);
		}
	};

	// 事件处理器
	var eventHandler = {};
	eventHandler[EVENT_NAME] = onPitchChange;

	// 暴露的接口对象
	var o = {};

	/**
	 * 初始化算盘重力感应原生Presenter
	 * @param callback Function(rotationType {string:"POSITIVE"||"NEGATIVE"})
	 */
	o.init = function(callback) {
		if (typeof ClassroomUtils === "undefined") {
			console.error("不在互动课堂环境中，无法使用算盘重力感应");
			return false;
		}
		fnCallback = callback;
		var res = ClassroomUtils.createPresenter(PRESENTER_ID, INSTANCE_ID);
		if (res && res.success) {
			console.log("初始化算盘重力感应原生Presenter成功");
			bridgeListeners = ClassroomUtils.addNativeEventListeners(eventHandler);
			return true;
		} else {
			console.error("初始化算盘重力感应原生Presenter失败");
			return false;
		}
	};

	/**
	 * 销毁算盘重力感应原生Presenter
	 */
	o.destroy = function() {
		if (typeof ClassroomUtils === "undefined") {
			console.error("不在互动课堂环境中，无法使用算盘重力感应");
			return false;
		}
		if (bridgeListeners !== null) {
			ClassroomUtils.removeNativeEventListeners(bridgeListeners);
			bridgeListeners = null;
		}
		ClassroomUtils.destroyPresenter(INSTANCE_ID);
		return true;
	};
	
	/**
	 * 启动算盘重力感应
	 */
	o.enablePitchSensor = function() {
		if (typeof ClassroomUtils === "undefined") {
			console.error("不在互动课堂环境中，无法使用算盘重力感应");
			return false;
		}
		ClassroomUtils.sendToPresenter(INSTANCE_ID, "enablePitchSensor");
		return true;
	};

	/**
	 * 结束算盘重力感应
	 */
	o.disablePitchSensor = function() {
		if (typeof ClassroomUtils === "undefined") {
			console.error("不在互动课堂环境中，无法使用算盘重力感应");
			return false;
		}
		ClassroomUtils.sendToPresenter(INSTANCE_ID, "disablePitchSensor");
		return true;
	};

	return o;

})();