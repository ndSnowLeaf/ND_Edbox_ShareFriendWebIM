/**
 * Created by Administrator on 2016/12/15.
 * 描红对象当前实例currentWord下的属性
 */

import CONST_NAME from "../constant/const-name";
import defaultConfig from "../config/default.config";
import $ from "jQuery";

export default (param) => {
  return {
	word: param.word,//原始word
	transformedWord: {},//转换过坐标的word
	convertedWord: {},//转换过笔画的word
	strokesLength: 0,
	autoTraceSteps: 0,
	config: $.extend({}, defaultConfig, param.config),
	back_canvas: param.back_canvas,
	fore_canvas: param.fore_canvas,
	back_context: param.back_canvas.getContext('2d'),
	fore_context: param.mode === CONST_NAME.MODE.DRAW ? param.fore_canvas.getContext('2d') : null,
	back_imageData: null,
	fore_imageData: null,
	currentStroke: 0,//当前笔画
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
	flickerTimer: null,//错误笔画后闪烁定时器
	flickerInterval: 250,//闪烁间隔，毫秒
	flickerTimes: 6,//闪烁次数
	radicalInfo: {},//部首信息
	structureInfo: [],//结构信息
	loop: 0,//动画loop,
	n: 0,//用于console输出当前绘制的笔画
	speed: CONST_NAME.SPEED.NORMAL,//自动描红速度
	traceType: null,//描红类型，自动 或 分步
	stepTraceSpeed: CONST_NAME.SPEED.NORMAL,//分步描红速度
	strokesMap: {},//笔画strokes和segments的映射，一个stroke里包含多个segments
	showCenterLine: false//是否显示笔画的中线，所有笔画都有的实线
  };
}