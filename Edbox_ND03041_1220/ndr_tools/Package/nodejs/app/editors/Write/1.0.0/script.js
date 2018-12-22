/**
 * Created by chenyoudong on 2015/12/30.
 */
define([
	'jquery',
	'css!./style.css'
], function ($) {
	return function() {
		var module, stage, config;
		this.init = function (m, s, c) {
			module = m;
			stage = s;
			config = c;
		};
		//渲染组件内容
		this.render = function (moduleWrap) {
			$(moduleWrap.element).text('Hello ' + module.getPropertyValue('xxx'));
		};
	}
});