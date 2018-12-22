var AddonIntervalProblem_create =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _appPresenter = __webpack_require__(1);

	var _appPresenter2 = _interopRequireDefault(_appPresenter);

	exports['default'] = function () {
	  return _appPresenter2['default'];
	};

	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenterRun = __webpack_require__(2);

	var _presenterRun2 = _interopRequireDefault(_presenterRun);

	var _presenterSetState = __webpack_require__(34);

	var _presenterSetState2 = _interopRequireDefault(_presenterSetState);

	var _presenterGetState = __webpack_require__(35);

	var _presenterGetState2 = _interopRequireDefault(_presenterGetState);

	var _presenterSetBasePath = __webpack_require__(36);

	var _presenterSetBasePath2 = _interopRequireDefault(_presenterSetBasePath);

	var _presenterDestroy = __webpack_require__(37);

	var _presenterDestroy2 = _interopRequireDefault(_presenterDestroy);

	var _presenterGetQuestionInfo = __webpack_require__(38);

	var _presenterGetQuestionInfo2 = _interopRequireDefault(_presenterGetQuestionInfo);

	var _presenterSetPlayerController = __webpack_require__(39);

	var _presenterSetPlayerController2 = _interopRequireDefault(_presenterSetPlayerController);

	var _presenterOnEventReceived = __webpack_require__(40);

	var _presenterOnEventReceived2 = _interopRequireDefault(_presenterOnEventReceived);

	var _presenterPageShow = __webpack_require__(41);

	var _presenterPageShow2 = _interopRequireDefault(_presenterPageShow);

	var _presenterRuntime = __webpack_require__(6);

	var _presenterPreviewAnswerJs = __webpack_require__(42);

	var _presenterPreviewAnswerJs2 = _interopRequireDefault(_presenterPreviewAnswerJs);

	var _presenterSendEventToCalc = __webpack_require__(18);

	var _presenterSendEventToCalc2 = _interopRequireDefault(_presenterSendEventToCalc);

	var _presenterSendEventToState = __webpack_require__(43);

	var _presenterSendEventToState2 = _interopRequireDefault(_presenterSendEventToState);

	var _presenterSetUrlParams = __webpack_require__(44);

	var _presenterSetUrlParams2 = _interopRequireDefault(_presenterSetUrlParams);

	var _presenterSubmitControl = __webpack_require__(17);

	var _presenterTimer = __webpack_require__(19);

	exports['default'] = {
	  run: _presenterRun2['default'],
	  destroy: _presenterDestroy2['default'],
	  setState: _presenterSetState2['default'],
	  getState: _presenterGetState2['default'],
	  setBasePath: _presenterSetBasePath2['default'],
	  getQuestionInfo: _presenterGetQuestionInfo2['default'],
	  setPlayerController: _presenterSetPlayerController2['default'],
	  onEventReceived: _presenterOnEventReceived2['default'],
	  initTeacherMobile: _presenterRuntime.initTeacherMobile,
	  initStudentMobile: _presenterRuntime.initStudentMobile,
	  initWeb: _presenterRuntime.initWeb,
	  initTeacherPc: _presenterRuntime.initTeacherPc,
	  pageShow: _presenterPageShow2['default'],
	  previewAnswer: _presenterPreviewAnswerJs2['default'],
	  sendEventToCalc: _presenterSendEventToCalc2['default'],
	  sendEventToState: _presenterSendEventToState2['default'],
	  setUrlParams: _presenterSetUrlParams2['default'],
	  getResult: _presenterSubmitControl.getResult,
	  getAnswerContent: _presenterSubmitControl.getAnswerContent,
	  getI18n: _presenterSubmitControl.getI18n,
	  getWrongPopup: _presenterSubmitControl.getWrongPopup,
	  registerTimer: _presenterTimer.registerTimer,
	  syncTime: _presenterTimer.syncTime
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
		* 运行环境下, 初始化Module的方法
		* @param view 运行视图(DOM对象)
		* @param model Module的模型, Key-Value结构
		* @remark 该方法为Module生命周期方法,仅在Module初始化时执行一次
		*/
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenterLogic = __webpack_require__(3);

	var _presenterLogic2 = _interopRequireDefault(_presenterLogic);

	exports['default'] = function (view, model) {
		(0, _presenterLogic2['default'])(view, model, false);
	};

	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* global $ icCreatePlayer */
	/**
	 * Module的逻辑
	 * @param view 视图对象, 根据是否为预览状态传入不同的视图对象
	 * @param model 模型对象
	 * @param isPreview 是否为编辑环境, true=编辑环境, false=运行环境
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _threeManger = __webpack_require__(4);

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	var _moduleControl = __webpack_require__(15);

	var _runtime = __webpack_require__(6);

	var _runtime2 = _interopRequireDefault(_runtime);

	var interval = undefined;
	exports.interval = interval;

	exports['default'] = function (view, model, isPreview) {

	    _presenter2['default'].model = model;
	    _presenter2['default'].view = view;
	    // 使用 basePath 替换 view 中的图片 url
	    var $imgs = $(view).find('img');

	    $imgs.each(function () {
	        $(this).attr('src', _presenter2['default'].path + $(this).attr('data-src'));
	    });

	    if (_presenter2['default'].isTeacherPc || _presenter2['default'].isPPTShell) {
	        $(view).find(".com_layout").addClass("layout_whiteboard");
	    }

	    (0, _moduleControl.moduleStart)();
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.threeStart = threeStart;
	exports.resizeThree = resizeThree;
	exports.destroyThree = destroyThree;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _constants = __webpack_require__(5);

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	//import Matchstick from './shape/Matchstick'

	var _UtilsDestroyThreeObjectJs = __webpack_require__(7);

	var _UtilsDestroyThreeObjectJs2 = _interopRequireDefault(_UtilsDestroyThreeObjectJs);

	var _ShapeNumberAxis = __webpack_require__(8);

	var _ShapeNumberAxis2 = _interopRequireDefault(_ShapeNumberAxis);

	var _UtilsAddCoordScale = __webpack_require__(11);

	var _UtilsAddCoordScale2 = _interopRequireDefault(_UtilsAddCoordScale);

	var _UtilsAutoDetectRenderer = __webpack_require__(14);

	var renderer;
	var scene;
	var camera;
	var raycaster;
	var intersectObjs;
	var mouse;
	//var matchstick;
	var currenAnimate;

	function initThree() {

		resizeThree();

		var container = $(_presenter2['default'].view).find('.interval_show').get(0);
		//创建渲染
		exports.renderer = renderer = (0, _UtilsAutoDetectRenderer.autoDetectRenderer)({
			antialias: true,
			alpha: true
		});
		//   renderer = new THREE.WebGLRenderer({
		//     antialias: true, //抗锯齿
		//     alpha: true // apply transparent attribute
		//   });
		renderer.setClearColor(0xFFFFFF, 0);
		renderer.setSize(_constants.REAL_ESTATE.width, _constants.REAL_ESTATE.height);

		container.appendChild(renderer.domElement);
	}

	function initScene() {
		exports.scene = scene = new THREE.Scene();
	}

	function initCamera() {
		//创建Camera
		var RATIO = 2;
		exports.camera = camera = new THREE.OrthographicCamera(_constants.REAL_ESTATE.width / -RATIO, _constants.REAL_ESTATE.width / RATIO, _constants.REAL_ESTATE.height / RATIO, _constants.REAL_ESTATE.height / -RATIO, -20000, 20000);
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 500;
		camera.lookAt({ x: 0, y: 0, z: 0 });
	}

	function initRaycaster() {
		//添加点击检测
		exports.raycaster = raycaster = new THREE.Raycaster();
		raycaster.linePrecision = 1;

		exports.intersectObjs = intersectObjs = new Array();
		exports.mouse = mouse = new THREE.Vector2();
	}

	function initControllerTool() {
		var planeXY = new THREE.Mesh(new THREE.PlaneBufferGeometry(_constants.REAL_ESTATE.width, _constants.REAL_ESTATE.height, 2, 2), new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0 }));
		planeXY.name = 'boundary';
		scene.add(planeXY);
	}

	function initNumberAXIS() {
		//创建数轴
		var numberAxis = new _ShapeNumberAxis2['default']().creatNumberAxis();
		scene.add(numberAxis);
		(0, _UtilsAddCoordScale2['default'])(scene);
	}

	function animate() {
		currenAnimate = requestAnimationFrame(animate);
		render();
	}

	function render() {
		renderer.render(scene, camera);
	}

	function threeStart() {
		initThree();
		initCamera();
		initScene();
		initRaycaster();
		animate();
		initControllerTool();
		initNumberAXIS();
	}

	function resizeThree() {

		var $show = $(_presenter2['default'].view).find('.interval_show');
		var offset = $show[0].getBoundingClientRect();
		"use strict";

		_constants.REAL_ESTATE.offsetLeft = offset.left;
		_constants.REAL_ESTATE.offsetTop = offset.top;
		_constants.REAL_ESTATE.width = $show.width();
		_constants.REAL_ESTATE.height = $show.height();

		(0, _constants.updataNumberAxisConstData)(_constants.REAL_ESTATE.width - 50);
	}

	function destroyThree() {
		(0, _UtilsDestroyThreeObjectJs2['default'])(camera);
		(0, _UtilsDestroyThreeObjectJs2['default'])(scene);
		(0, _UtilsDestroyThreeObjectJs2['default'])(renderer);
		$(renderer.domElement).remove();
		$(renderer.domElement).splice(0);
		$(renderer.domElement)[0] = null;
		exports.renderer = renderer = null;
		exports.camera = camera = null;
		exports.mouse = mouse = null;
		exports.scene = scene = null;
		exports.raycaster = raycaster = null;
		exports.intersectObjs = intersectObjs = null;
		cancelAnimationFrame(currenAnimate);
	}

	exports.renderer = renderer;
	exports.scene = scene;
	exports.camera = camera;
	exports.raycaster = raycaster;
	exports.intersectObjs = intersectObjs;
	exports.mouse = mouse;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* global $ */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.getDeleteMaterial = getDeleteMaterial;
	exports.updataNumberAxisConstData = updataNumberAxisConstData;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _runtime = __webpack_require__(6);

	var _runtime2 = _interopRequireDefault(_runtime);

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	// 定义 addon 的可活动大小
	var REAL_ESTATE = {
	    width: 1000,
	    height: 200,
	    offsetLeft: 0,
	    offsetTop: 500
	};

	exports.REAL_ESTATE = REAL_ESTATE;
	// 定义所有的操作类型
	var ACTION_TYPE = {
	    add: 'add',
	    changePoint: 'change',
	    changeInter: 'changeInter',
	    intervalRect: 'intervalRect',
	    deleteInterval: 'deleteInterval'
	};

	exports.ACTION_TYPE = ACTION_TYPE;
	//画删除材质
	var deleteMaterial = undefined;

	function getDeleteMaterial() {
	    if (!deleteMaterial) {
	        var loader = new THREE.TextureLoader();
	        loader.setCrossOrigin('anonymous');
	        var texture = loader.load(_presenter2['default'].path + 'resources/delete.png');
	        deleteMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, overdraw: 0.5 });
	    }
	    return deleteMaterial;
	}

	//数轴的长度
	var NumberAxisWidth = 900;
	exports.NumberAxisWidth = NumberAxisWidth;
	var NumberAxisHeight = 4;

	exports.NumberAxisHeight = NumberAxisHeight;
	//数轴标记的刻度数
	var NumberOfScale = 43;

	exports.NumberOfScale = NumberOfScale;
	var NumberAxisConstData = {

	    numberAxisWidth: NumberAxisWidth,
	    scaleCount: NumberOfScale,
	    scaleLineHalfLength: NumberAxisWidth / 2 - 20,
	    scaleMargin: (NumberAxisWidth / 2 - 20) * 2 / NumberOfScale,
	    numberAxisHeight: NumberAxisHeight
	};

	exports.NumberAxisConstData = NumberAxisConstData;

	function updataNumberAxisConstData(NumberAxisWidth) {
	    NumberAxisConstData.numberAxisWidth = NumberAxisWidth;
	    NumberAxisConstData.scaleCount = NumberOfScale;
	    NumberAxisConstData.scaleLineHalfLength = NumberAxisWidth / 2 - 20;
	    NumberAxisConstData.scaleMargin = (NumberAxisWidth / 2 - 20) * 2 / NumberOfScale;
	}

	//刻度的宽度
	var CoordScaleWidth = {
	    small: 2,
	    big: 3
	};

	exports.CoordScaleWidth = CoordScaleWidth;
	//刻度的高度
	var CoordScaleHeight = {
	    small: 6,
	    big: 20
	};

	exports.CoordScaleHeight = CoordScaleHeight;
	//对象的名称
	var IntervalObjNames = {

	    Line: 'Line', //数轴
	    Endpoint1: 'Endpoint1', //区间小（左）端点
	    Endpoint2: 'Endpoint2', //区间大（右）端点
	    SoildCircle: 'SoildCircle', //区间实心圆
	    EmptyCircle: 'EmptyCircle', //区间空心圆
	    LeftTriangle: 'LeftTriangle', //区间左边三角形
	    RightTriangle: 'RightTriangle', //区间右边三角形
	    CoordScaleName: 'CoordScale', //刻度
	    Arrow: 'Arrow',
	    AreaGroup: 'AreaGroup',
	    EndPointShow: 'EndPointShow',
	    IntervalRect: 'IntervalRect',
	    IntervalLine: 'IntervalLine',
	    DeleteBtn: 'DeleteBtn',
	    DotCircle: 'DotCircle'
	};

	exports.IntervalObjNames = IntervalObjNames;
	//区间端点的默认状态索引
	var StatusIndex = {
	    SoildCircle: 0,
	    EmptyCircle: 1,
	    Triangle: 2
	};

	exports.StatusIndex = StatusIndex;
	//选择框的宽高
	var SelectBox = {
	    Height: NumberAxisHeight * 4,
	    Width: NumberAxisHeight * 1.8,
	    IntervaleRectHeight: NumberAxisHeight * 8
	};

	exports.SelectBox = SelectBox;
	//区间端点圆的半径
	var CircleRadius = {
	    soild: NumberAxisHeight * 1.8,
	    empty: NumberAxisHeight * 1.2,
	    triangleSideLength: NumberAxisHeight * 2.5
	};

	exports.CircleRadius = CircleRadius;
	//颜色
	var Color = {
	    normal: 0xCB1F1F,
	    'delete': 0xFBE798,
	    emptyCircle: 0xffffff,
	    numberAxis: 0x573206,
	    numberText: '#573206'
	};

	exports.Color = Color;
	//删除按钮
	var DeleteBtnY = 40;

	exports.DeleteBtnY = DeleteBtnY;
	//层级关系
	var ZOriginIndex = {
	    endpoint: 5,
	    intervalRect: 2,
	    intervalGroup: 1
	};
	exports.ZOriginIndex = ZOriginIndex;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.initTeacherMobile = initTeacherMobile;
	exports.initStudentMobile = initStudentMobile;
	exports.initProjectionMobile = initProjectionMobile;
	exports.initWeb = initWeb;
	exports.initTeacherPc = initTeacherPc;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	function initTeacherMobile() {
	    _presenter2["default"].isTeacherMobile = true;
	}

	;

	function initStudentMobile() {
	    "use strict";
	    _presenter2["default"].isStudentMobile = true;
	}

	;

	function initProjectionMobile() {
	    _presenter2["default"].isProjectionMobile = true;
	}

	;

	function initWeb() {
	    "use strict";
	    _presenter2["default"].isWeb = true;
	}

	;

	function initTeacherPc() {
	    _presenter2["default"].isTeacherPc = true;
	}

	;

	exports["default"] = {
	    initTeacherMobile: initTeacherMobile,
	    initStudentMobile: initStudentMobile,
	    initProjectionMobile: initProjectionMobile,
	    initWeb: initWeb,
	    initTeacherPc: initTeacherPc
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = destroyThreeObject;

	function destroyThreeObject(object) {
	  "use strict";
	  if (!object) return;
	  if (object.children && object.children.length > 0) {
	    for (var i = 0; i < object.children.length; i++) {
	      destroyThreeObject(object.children[i]);
	    }
	  }
	  if (object.geometry) object.geometry.dispose();
	  if (object.material) {
	    object.material.dispose();
	    if (object.material.map && object.material.map.dispose) object.material.map.dispose();
	  }
	  object = null;
	}

	module.exports = exports["default"];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/13.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _UtilsUpdateVertices = __webpack_require__(9);

	var _UtilsUpdateVertices2 = _interopRequireDefault(_UtilsUpdateVertices);

	var _UtilsRotateAngle = __webpack_require__(10);

	var _constants = __webpack_require__(5);

	//添加刻度
	//addCoordScale(numberAxis);

	/**
	 * startPoint 数轴起始点（左端点）
	 * endPoint 数轴终止点（右端点）
	 * lineWidth 数轴线宽
	 */

	var NumberAxis = (function () {
	    function NumberAxis() {
	        var startPoint = arguments.length <= 0 || arguments[0] === undefined ? new THREE.Vector3(-_constants.NumberAxisConstData.numberAxisWidth / 2, 0, 0) : arguments[0];
	        var endPoint = arguments.length <= 1 || arguments[1] === undefined ? new THREE.Vector3(_constants.NumberAxisConstData.numberAxisWidth / 2, 0, 0) : arguments[1];
	        var lineHeight = arguments.length <= 2 || arguments[2] === undefined ? _constants.NumberAxisHeight : arguments[2];

	        _classCallCheck(this, NumberAxis);

	        this.startPoint = startPoint;
	        this.endPoint = endPoint;
	        this.lineHeight = lineHeight;
	    }

	    //线材质

	    _createClass(NumberAxis, [{
	        key: 'getLineMaterial',
	        value: function getLineMaterial() {
	            return new THREE.MeshBasicMaterial({
	                color: _constants.Color.numberAxis,
	                transparent: false,
	                opacity: 1
	            });
	        }

	        // 容器材质
	    }, {
	        key: 'getGroupMaterial',
	        value: function getGroupMaterial() {
	            return new THREE.MeshBasicMaterial({
	                color: 0x333333,
	                transparent: true,
	                opacity: 0
	            });
	        }

	        //绘制线
	    }, {
	        key: 'creatLine',
	        value: function creatLine() {
	            var shape = new THREE.Shape();

	            var halfHeight = this.lineHeight / 2;
	            shape.moveTo(this.startPoint.x, halfHeight);
	            shape.lineTo(this.startPoint.x, -halfHeight);
	            shape.lineTo(this.endPoint.x, -halfHeight);
	            shape.lineTo(this.endPoint.x, halfHeight);
	            shape.lineTo(this.startPoint.x, halfHeight);

	            var geometry = new THREE.ShapeGeometry(shape);
	            var line = new THREE.Mesh(geometry, this.getLineMaterial());
	            line.name = _constants.IntervalObjNames.Line;
	            return line;
	        }

	        //绘制数轴正方向的箭头标示
	    }, {
	        key: 'creatArrow',
	        value: function creatArrow() {

	            var arrow = new THREE.Object3D();
	            var centerPotGeometry = new THREE.CircleGeometry(this.lineHeight / 2, 32);
	            var arrowCenterPot = new THREE.Mesh(centerPotGeometry, this.getLineMaterial());
	            var center = new THREE.Vector3(0, 0, 0);

	            //正方向上长度为20的向量
	            var lengthVector = (0, _UtilsRotateAngle.getLocationPoint)(center, this.startPoint, 20);

	            // 画图形
	            var arrowPointA = (0, _UtilsRotateAngle.rotatePoint)(lengthVector, center, 45);
	            var arrowPointB = (0, _UtilsRotateAngle.rotatePoint)(lengthVector, center, -45);

	            // 绘制箭头上边
	            var sideA = new THREE.Shape();
	            sideA.moveTo(0, -this.lineHeight);
	            sideA.lineTo(arrowPointA.x, -this.lineHeight);
	            sideA.lineTo(arrowPointA.x, this.lineHeight);
	            sideA.lineTo(0, this.lineHeight);
	            sideA.lineTo(0, -this.lineHeight);
	            var sideAGeometry = new THREE.ShapeGeometry(sideA);
	            var arrowUp = new THREE.Mesh(sideAGeometry, this.getLineMaterial());
	            (0, _UtilsUpdateVertices2['default'])(arrowUp, center, arrowPointA, this.lineHeight);

	            // 绘制箭头下边
	            var sideB = new THREE.Shape();

	            sideB.moveTo(0, -this.lineHeight);
	            sideB.lineTo(arrowPointB.x, -this.lineHeight);
	            sideB.lineTo(arrowPointB.x, this.lineHeight);
	            sideB.lineTo(0, this.lineHeight);
	            sideB.lineTo(0, -this.lineHeight);
	            var sideBGeometry = new THREE.ShapeGeometry(sideB);
	            var arrowDown = new THREE.Mesh(sideBGeometry, this.getLineMaterial());
	            (0, _UtilsUpdateVertices2['default'])(arrowDown, center, arrowPointB, this.lineHeight);

	            arrow.add(arrowCenterPot);
	            arrow.add(arrowUp);
	            arrow.add(arrowDown);
	            arrow.position.copy(this.endPoint);
	            arrow.name = _constants.IntervalObjNames.Arrow;
	            return arrow;
	        }

	        //绘制一个框用来扩大数轴的点击区域
	    }, {
	        key: 'creatClickAreaGroup',
	        value: function creatClickAreaGroup() {

	            var areaShape = new THREE.Shape();
	            areaShape.moveTo(this.startPoint.x, this.lineHeight * 2.5);
	            areaShape.lineTo(this.startPoint.x, -this.lineHeight * 2.5);
	            areaShape.lineTo(this.endPoint.x, -this.lineHeight * 2.5);
	            areaShape.lineTo(this.endPoint.x, this.lineHeight * 2.5);
	            areaShape.lineTo(this.startPoint.x, this.lineHeight * 2.5);

	            var areaGeometry = new THREE.ShapeGeometry(areaShape);
	            var areaMesh = new THREE.MeshBasicMaterial({
	                transparent: true,
	                opacity: 0
	            });

	            var areaGroup = new THREE.Mesh(areaGeometry, areaMesh);
	            areaGroup.name = _constants.IntervalObjNames.AreaGroup;
	            return areaGroup;
	        }

	        //创建数轴
	    }, {
	        key: 'creatNumberAxis',
	        value: function creatNumberAxis() {

	            //创建一个组的容器
	            var line = this.creatLine(),
	                //创建数轴线
	            arrow = this.creatArrow(); //创建箭头

	            //将数轴的元素添加到容器中

	            //添加箭头
	            line.add(arrow);
	            //添加刻度

	            return line;
	        }
	    }]);

	    return NumberAxis;
	})();

	exports['default'] = NumberAxis;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _rotateAngle = __webpack_require__(10);

	exports['default'] = function (shape, pointA, pointB, lineWidth) {
	  var length = lineWidth / 2;
	  var vector1 = (0, _rotateAngle.rotationAngleVector)(pointB, pointA, 90, true).vector.setLength(length);
	  var vector2 = (0, _rotateAngle.rotationAngleVector)(pointB, pointA, 90, false).vector.setLength(length);
	  var vertices = [];
	  var orgVertices = shape.geometry.vertices;

	  vertices.push(new THREE.Vector2().addVectors(pointA, vector2));
	  vertices.push(new THREE.Vector2().addVectors(pointB, vector2));
	  vertices.push(new THREE.Vector2().addVectors(pointB, vector1));
	  vertices.push(new THREE.Vector2().addVectors(pointA, vector1));

	  for (var i = 0; i < orgVertices.length; i++) {
	    orgVertices[i].x = vertices[i].x;
	    orgVertices[i].y = vertices[i].y;
	  }
	  shape.geometry.verticesNeedUpdate = true;
	  shape.geometry.computeBoundingSphere();
	};

	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * 跟中心转一定角度后的坐标
	 * @param point 点
	 * @param center 中心
	 * @param angle 角度
	 * @returns {THREE.Vector3} 结果
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.rotatePoint = rotatePoint;
	exports.getLocationPoint = getLocationPoint;
	exports.rotationAngleVector = rotationAngleVector;
	exports.getAngle = getAngle;
	exports.getVectorAngle = getVectorAngle;

	function rotatePoint(point, center, angle) {
	    var l = angle * Math.PI / 180;

	    //sin/cos value
	    var cosv = Math.cos(l);
	    var sinv = Math.sin(l);

	    // calc new point
	    var newX = (point.x - center.x) * cosv - (point.y - center.y) * sinv + center.x;
	    var newY = (point.x - center.x) * sinv + (point.y - center.y) * cosv + center.y;
	    return new THREE.Vector3(newX, newY, 0);
	}

	/**
	 *  从A到B的方向距离length的点
	 * @param pointA
	 * @param pointB
	 * @param length
	 * @returns {THREE.Vector3}
	 */

	function getLocationPoint(pointA, pointB, length) {
	    var vector = new THREE.Vector3(0, 0, 0);
	    vector.subVectors(pointB, pointA);
	    vector = vector.setLength(length);
	    vector.add(pointA);
	    return vector;
	}

	/**
	 * 向量旋转后的向量，返回旋转后的点和向量;
	 * @param movePoint 旋转角度
	 * @param fixedPoint 旋转轴点（固定的点）
	 * @param angle 旋转角度
	 * @param clockwise 旋转方向
	 */

	function rotationAngleVector(movePoint, fixedPoint, angle, clockwise) {

	    var tempVector = new THREE.Vector2(movePoint.x - fixedPoint.x, movePoint.y - fixedPoint.y);
	    var valueX = undefined,
	        valueY = undefined;
	    var radian = angle / 180 * Math.PI;

	    if (clockwise) {
	        valueX = tempVector.x * Math.cos(radian) + tempVector.y * Math.sin(radian) + fixedPoint.x;
	        valueY = tempVector.y * Math.cos(radian) - tempVector.x * Math.sin(radian) + fixedPoint.y;
	    } else {
	        valueX = tempVector.x * Math.cos(radian) - tempVector.y * Math.sin(radian) + fixedPoint.x;
	        valueY = tempVector.y * Math.cos(radian) + tempVector.x * Math.sin(radian) + fixedPoint.y;
	    }

	    var afterRotationPoint = new THREE.Vector2(valueX, valueY);
	    var afterRotationVector = new THREE.Vector2(valueX - fixedPoint.x, valueY - fixedPoint.y);

	    return {
	        point: afterRotationPoint,
	        vector: afterRotationVector
	    };
	}

	/*
	 first_p：起点坐标，center_p：端点坐标，second_p：末点
	 */

	function getAngle(first_p, center_p, second_p) {
	    var v_ao = new THREE.Vector2().subVectors(first_p, center_p);
	    var v_bo = new THREE.Vector2().subVectors(second_p, center_p);
	    return getVectorAngle(v_ao, v_bo);
	}

	function getVectorAngle(vector1, vector2) {
	    "use strict";
	    var dx1 = undefined,
	        dx2 = undefined,
	        dy1 = undefined,
	        dy2 = undefined,
	        angle = undefined,
	        abs = undefined;
	    dx1 = vector1.x;
	    dy1 = vector1.y;
	    dx2 = vector2.x;
	    dy2 = vector2.y;
	    var c = Math.sqrt(dx1 * dx1 + dy1 * dy1) * Math.sqrt(dx2 * dx2 + dy2 * dy2);
	    if (c == 0) return -1;
	    abs = (dx1 * dx2 + dy1 * dy2) / c;
	    if (abs < 0 && Math.abs(abs) > 1) {
	        //当abs>且是负数的时候，向量方向相反重合，为180°
	        return 180;
	    }
	    if (Math.abs(abs) > 1) {
	        //当abs>1且是正数数的时候，向量方向一致且重合，为0°
	        return 0;
	    }
	    angle = Math.acos((dx1 * dx2 + dy1 * dy2) / c) * 180 / Math.PI;

	    var isClockWise = vector1.x * vector2.y - vector1.y * vector2.x < 0;
	    isClockWise ? null : angle = -angle;
	    return {
	        //弧度
	        radian: angle * Math.PI / 180,

	        //second_p相对于first_p顺逆时针，true标示顺时针
	        clockWise: isClockWise,

	        //角度
	        angle: angle
	    };
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/14.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _shapeCoordinateScale = __webpack_require__(12);

	var _shapeCoordinateScale2 = _interopRequireDefault(_shapeCoordinateScale);

	var _constants = __webpack_require__(5);

	var _UtilsAddText = __webpack_require__(13);

	var _UtilsAddText2 = _interopRequireDefault(_UtilsAddText);

	var _threeMangerJs = __webpack_require__(4);

	exports['default'] = function (scene) {
	    var startPosition = 0;
	    var coordWidth = undefined,
	        coordHeight = undefined;

	    for (var i = 0; i <= 21; i++) {

	        coordWidth = i % 5 ? 2 : 3;
	        coordHeight = i % 5 ? _constants.CoordScaleHeight.small : _constants.CoordScaleHeight.big;

	        if (i == 21 || i == -21) {
	            coordHeight = _constants.NumberAxisHeight * 0.5;
	        }
	        var text = undefined;

	        var pozitivaShape = new _shapeCoordinateScale2['default'](coordWidth, coordHeight).creatCoordinateScale();
	        pozitivaShape.position.x = startPosition;

	        if (i == 0) {
	            var dot = pozitivaShape.getObjectByName(_constants.IntervalObjNames.DotCircle);
	            dot.visible = true;
	        }

	        //正方向
	        if (i % 5 == 0) {
	            //添加文字
	            text = (0, _UtilsAddText2['default'])(i.toString(), new THREE.Vector3(startPosition, -30, 0), 32, 32, _constants.Color.numberText);
	            scene.add(text);
	        }

	        pozitivaShape.position.y = i % 5 == 0 ? 0 : coordHeight * 0.5;

	        scene.add(pozitivaShape);

	        //负方向
	        if (i > 0) {

	            var j = -i;
	            if (j % 5 == 0) {
	                text = (0, _UtilsAddText2['default'])(j.toString(), new THREE.Vector3(-startPosition, -30, 0), 32, 32, _constants.Color.numberText);
	                scene.add(text);
	            }

	            var negativaShape = new _shapeCoordinateScale2['default'](coordWidth, coordHeight).creatCoordinateScale();
	            negativaShape.position.x = -startPosition;

	            negativaShape.position.y = i % 5 == 0 ? 0 : coordHeight * 0.5;
	            scene.add(negativaShape);
	            _threeMangerJs.intersectObjs.push(negativaShape);
	        }
	        startPosition += _constants.NumberAxisConstData.scaleMargin;

	        if (i % 21 == 0) {
	            pozitivaShape.position.y = 0;
	        }
	    }
	};

	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/13.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _constants = __webpack_require__(5);

	var _threeMangerJs = __webpack_require__(4);

	/**
	 * 绘制刻度
	 * lineWidth 刻度的宽度
	 * lineHeight 刻度的高度
	 */

	var coordinateScale = (function () {
		function coordinateScale() {
			var lineWidth = arguments.length <= 0 || arguments[0] === undefined ? 6 : arguments[0];
			var lineHeight = arguments.length <= 1 || arguments[1] === undefined ? 20 : arguments[1];

			_classCallCheck(this, coordinateScale);

			this.lineWidth = lineWidth;
			this.lineHeight = lineHeight;
		}

		_createClass(coordinateScale, [{
			key: 'creatCoordGroup',
			value: function creatCoordGroup() {

				//画选择区域框
				var groupHalfHeight = _constants.SelectBox.Height,
				    groupWidth = _constants.SelectBox.Width;

				var groupShape = new THREE.Shape();

				groupShape.moveTo(-groupWidth, groupHalfHeight);
				groupShape.lineTo(-groupWidth, -groupHalfHeight);
				groupShape.lineTo(groupWidth, -groupHalfHeight);
				groupShape.lineTo(groupWidth, groupHalfHeight);
				groupShape.lineTo(-groupWidth, groupHalfHeight);

				var groupGeometry = new THREE.ShapeGeometry(groupShape);
				var groupMesh = new THREE.Mesh(groupGeometry, new THREE.MeshBasicMaterial({ color: 0x006666, transparent: true, opacity: 0 }));
				groupMesh.name = _constants.IntervalObjNames.CoordScaleName;

				return groupMesh;
			}
		}, {
			key: 'creatCoord',
			value: function creatCoord() {
				//画刻度框
				var shape = new THREE.Shape();
				var halfWidth = this.lineWidth / 2,
				    halfHeight = this.lineHeight / 2;

				shape.moveTo(-halfWidth, halfHeight);
				shape.lineTo(-halfWidth, -halfHeight);
				shape.lineTo(halfWidth, -halfHeight);
				shape.lineTo(halfWidth, halfHeight);
				shape.lineTo(-halfWidth, halfHeight);

				var geometry = new THREE.ShapeGeometry(shape);
				var coordScale = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
					color: _constants.Color.numberAxis,
					transparent: false,
					opacity: 1
				}));

				coordScale.name = "coordScale";
				return coordScale;
			}

			//画原点
		}, {
			key: 'creatDot',
			value: function creatDot() {

				var radius = _constants.SelectBox.Width * 0.8;
				var soildCircleGeometry = new THREE.CircleGeometry(radius, 64);
				var dotCircle = new THREE.Mesh(soildCircleGeometry, new THREE.MeshBasicMaterial({ color: _constants.Color.numberAxis, overdraw: 0.5 }));
				dotCircle.visible = false;

				dotCircle.name = _constants.IntervalObjNames.DotCircle;
				return dotCircle;
			}
		}, {
			key: 'creatCoordinateScale',
			value: function creatCoordinateScale() {

				var group = this.creatCoordGroup(),
				    coord = this.creatCoord(),
				    dot = this.creatDot();

				group.add(coord);
				group.add(dot);
				_threeMangerJs.intersectObjs.push(group);
				return group;
			}
		}]);

		return coordinateScale;
	})();

	exports['default'] = coordinateScale;
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports) {

	/*

	@param text 所要绘制的文字
	@param position 存放位置
	@param width 文字的宽高

	*/
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	exports['default'] = function (text, position, width, height) {
		var fontColor = arguments.length <= 4 || arguments[4] === undefined ? 'black' : arguments[4];
		var fontSize = arguments.length <= 5 || arguments[5] === undefined ? '16px' : arguments[5];

		var dynamicTexture = new THREEx.DynamicTexture(width, height);
		dynamicTexture.context.font = 'bolder ' + fontSize + ' Arial';
		var geometry = new THREE.CubeGeometry(width, height, 0);

		var textField = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
			map: dynamicTexture.texture,
			transparent: true
		}));

		textField.position.x = position.x;
		textField.position.y = position.y;
		textField._dynamicTexture = dynamicTexture;
		textField._dynamicTexture.drawText(text, undefined, height / 2, fontColor);
		return textField;
	};

	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	function autoDetectRenderer(options, noWebGL) {
		if (!noWebGL && isWebGLSupported()) {
			return new THREE.WebGLRenderer(options);
		}
		return new THREE.CanvasRenderer(options);
	}

	function isWebGLSupported() {
		var contextOptions = { stencil: true };
		try {
			if (!window.WebGLRenderingContext) {
				return false;
			}
			var canvas = document.createElement('canvas'),
			    gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);
			return !!(gl && gl.getContextAttributes().stencil);
		} catch (e) {
			return false;
		}
	}
	exports.isWebGLSupported = isWebGLSupported;
	exports.autoDetectRenderer = autoDetectRenderer;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by zhoujunzhou on 2016/1/4.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.moduleStart = moduleStart;
	exports.isApp = isApp;
	exports.moduleClose = moduleClose;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _runtime = __webpack_require__(6);

	var _runtime2 = _interopRequireDefault(_runtime);

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	var _constants = __webpack_require__(5);

	var _threeManger = __webpack_require__(4);

	var _event = __webpack_require__(16);

	var _submitControl = __webpack_require__(17);

	var _timer = __webpack_require__(19);

	var _EventDocumentEventJs = __webpack_require__(23);

	function moduleStart() {

	    (0, _threeManger.threeStart)();

	    //显示提交按钮
	    if (_presenter2['default'].isStudentMobile) {

	        //发送显示提交按钮
	        _presenter2['default'].sendEventToCalc('show');
	        //发送可以提交按钮
	        _presenter2['default'].sendEventToCalc('submit');
	    }

	    if (_presenter2['default'].isStudentMobile) {
	        (0, _event.registerNativeListener)('ExamCallback', _submitControl.examCallBack);
	    }

	    if (_presenter2['default'].isWeb || _presenter2['default'].isPPTShell || _presenter2['default'].isTeacherPc) {
	        (0, _submitControl.showWebSubmit)();
	    }
	}

	function isApp() {
	    return _presenter2['default'].isTeacherMobile || _presenter2['default'].isStudentMobile;
	}

	function moduleClose() {
	    (0, _event.unbindNativeListener)('ExamCallback');
	    (0, _event.unbindNativeListener)('ExamInfoCallback');
	    (0, _EventDocumentEventJs.removeEventListerner)();
	    (0, _threeManger.destroyThree)();
	    (0, _timer.destoryTimer)();
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 事件
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.unbindNativeListener = unbindNativeListener;
	exports.registerNativeListener = registerNativeListener;

	var _moduleControl = __webpack_require__(15);

	//事件监听销毁方法
	var callbacks = {};
	exports.callbacks = callbacks;

	function unbindNativeListener(key) {
	    if ((0, _moduleControl.isApp)() && Bridge && Bridge.unRegisterListener) {
	        if (!key) {
	            $.each(callbacks, function (k, v) {
	                Bridge.unRegisterListener(k, callbacks[k]);
	            });
	            exports.callbacks = callbacks = {};
	        } else {
	            Bridge.unRegisterListener(key, callbacks[key]);
	        }
	    }
	}

	;

	//事件监听注册方法

	function registerNativeListener(key, _callback) {
	    if ((0, _moduleControl.isApp)() && Bridge && Bridge.registerListener) {
	        callbacks[key] = Bridge.registerListener(key, _callback);
	    }
	}

	;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by zhoujunzhou on 2016/1/11.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.getI18n = getI18n;
	exports.getAnswerContent = getAnswerContent;
	exports.getWrongPopup = getWrongPopup;
	exports.getResult = getResult;
	exports.showWebSubmit = showWebSubmit;
	exports.showAlert = showAlert;
	exports.showPreViewPop = showPreViewPop;
	exports.recordSubmitAnswer = recordSubmitAnswer;
	exports.recoverSubmitAnswer = recoverSubmitAnswer;
	exports.examCallBack = examCallBack;
	exports.callSubmiterdo = callSubmiterdo;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	var _moduleControl = __webpack_require__(15);

	var _sendEventToCalc = __webpack_require__(18);

	var _sendEventToCalc2 = _interopRequireDefault(_sendEventToCalc);

	var _timerJs = __webpack_require__(19);

	var _UtilsMatchAnswerJs = __webpack_require__(22);

	var _UtilsMatchAnswerJs2 = _interopRequireDefault(_UtilsMatchAnswerJs);

	function getI18n() {
	    return {
	        "answer_correct": "太棒啦, 您答对了!",
	        "answer_error": "这道题没有做对, 下次加油哦!",
	        "next_come_on": "答题结束，下次加油哦！",
	        "time_over": "时间到了，练习结束！",
	        "button_submit": "提交",
	        //'pic_or_text'     : '请将下方属于该分类的图/文拖到这里',
	        'options': '选项',
	        'people': '人'
	    };
	}

	function getAnswerContent(answer) {
	    if (!answer || answer.length == 0) {
	        //获取正确答案
	    } else {
	            //根据选项ID获取内容
	        }
	}

	function getWrongPopup() {}

	/**
	 * 学生端点击提交的时候调用改函数
	 */

	function getResult() {
	    var isCorrect = (0, _UtilsMatchAnswerJs2['default'])();
	    var correct_response = _presenter2['default'].model.question_url.content.answer;
	    var data = {
	        'status': 'complete',
	        'is_correct': isCorrect,
	        'correct_response': correct_response
	    };

	    var res = {
	        "answer": JSON.stringify(data),
	        "questionId": _presenter2['default'].model.question_id
	    };

	    return res;
	}

	function showWebSubmit() {
	    new CommitBtn($(_presenter2['default'].view).find('div.com_lay_toptool'), 'time_id', function () {
	        submitWebTeacher();
	    });
	}

	//显示弹窗内容

	function showAlert(type) {
	    var msg = '';

	    if (type == 'student') {
	        //学生端，根据是否提交进行提示
	        if (_presenter2['default'].submitStatus == 'doing' || _presenter2['default'].submitStatus == 'do') {
	            msg = getI18n['next_come_on'];
	        } else {
	            msg = getI18n['time_over'];
	        }
	    } else if (type == 'teacher') {
	        //教师端，根据正误提示
	        //var res = getAnsResult();
	        var res = {};

	        if (res.is_right) {
	            msg = getI18n['answer_correct'];
	        } else {
	            msg = getI18n['answer_error'];
	        }
	    }
	}

	function showPreViewPop(msg) {
	    var node = $(_presenter2['default'].view).find('.pop_result');
	    node.find('.text').html(msg);
	    node.show();

	    setTimeout(function () {
	        node.find('.text').html('');
	        node.hide();
	    }, 2000);
	}

	//记录已经提交的答案

	function recordSubmitAnswer() {
	    //获取底下的分类
	    var options = [];

	    //将数据保存成json
	    var tmpObj = JSON.parse(JSON.stringify('{test:testResult}'));
	    var value = { 'options': options, 'catesObj': tmpObj };

	    _presenter2['default'].submitAnser = value;
	}

	//恢复已经提交的答案

	function recoverSubmitAnswer() {
	    if (_presenter2['default'].submitAnser) {}
	}

	function examCallBack(data) {
	    var type = data.type;
	    var value = data.value ? data.value : false;

	    /**fix bug **/
	    if (value && type == 'result') {
	        //公布答案
	        //如果是学生端就显示
	        var $resultTip = $(_presenter2['default'].view).find('.resultTip').removeClass('correct error');
	        var isCorrect = (0, _UtilsMatchAnswerJs2['default'])();

	        if (isCorrect) {

	            $resultTip.addClass('correct');
	            $resultTip.text('太棒啦, 您答对了!');
	        } else {
	            $resultTip.addClass('error');
	            $resultTip.text('很遗憾,回答错误!');
	        }

	        //记录答题状态
	        _presenter2['default'].submitStatus = 'result';
	    }
	}

	//自动提交

	function callSubmiterdo(time) {
	    if (_presenter2['default'].isStudentMobile) {
	        //发送结束考试
	        (0, _sendEventToCalc2['default'])('finish');

	        //这边因为不会回调，所以要自己添加
	        showAlert('student');

	        //记录答题状态
	        _presenter2['default'].submitStatus = 'finished';

	        //记录答题时间
	        _presenter2['default'].submitTime = time;

	        (0, _timerJs.destoryTimer)();
	    } else {

	        submitWebTeacher();
	    }
	}

	function submitWebTeacher() {
	    //教师端的预览提示
	    var isCorrect = (0, _UtilsMatchAnswerJs2['default'])();

	    if (isCorrect) {

	        showPreViewPop('太棒啦, 您答对了!');
	    } else {

	        showPreViewPop('很遗憾,回答错误!');
	    }
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by zhoujunzhou on 2016/1/11.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	exports['default'] = function (action) {
	    //是学生才能发送
	    if (!_presenter2['default'].isStudentMobile) {
	        return false;
	    }

	    console.log('sendEventToCalc:', action);

	    action = action || 'submit';
	    var timerId = window.setInterval(function () {
	        var answerSubmitter = player.getPlayerServices().getToolbarModule('AnswerSubmitter') || player.getPlayerServices().getModule('AnswerSubmitter');
	        if (answerSubmitter != null) {
	            window.clearInterval(timerId);
	            _presenter2['default'].eventBus.sendEvent('AnswerSubmitter', {
	                source: _presenter2['default'].model.ID,
	                action: action
	            });
	        }
	    });
	};

	module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by zhoujunzhou on 2016/1/19.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.initTimer = initTimer;
	exports.startTimer = startTimer;
	exports.lastTimer = lastTimer;
	exports.syncTime = syncTime;
	exports.registerTimer = registerTimer;
	exports.timeListem = timeListem;
	exports.destoryTimer = destoryTimer;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	var _callNative = __webpack_require__(20);

	var _callNative2 = _interopRequireDefault(_callNative);

	var _moduleControl = __webpack_require__(15);

	var _sendEventToDispatcher = __webpack_require__(21);

	var _submitControl = __webpack_require__(17);

	var AxisTimer = undefined;

	exports.AxisTimer = AxisTimer;

	function initTimer() {
	    //记录是不是已经同步过时间了
	    _presenter2['default'].isSyncTime = false;
	    //记录提交时间
	    _presenter2['default'].submitTime = 0;

	    if (!_presenter2['default'].model.question_url) {
	        return;
	    }

	    //获取model传递过来的时间
	    var modelTimer = _presenter2['default'].model.question_url.timer;

	    //计时组件
	    //计时器类型: "sequence",正计时
	    // "countdown" 倒计时
	    var mark = modelTimer.timer_type == 'sequence' ? true : false;
	    var time_limit = parseInt(modelTimer.time_minute) * 60 + parseInt(modelTimer.time_second);

	    exports.AxisTimer = AxisTimer = new Timer($(_presenter2['default'].view).find('div.com_u_timebox'), {
	        'sequence': mark,
	        'seconds': parseInt(time_limit)
	    });

	    //如果是倒计时，设置回调函数
	    if (!mark) {
	        AxisTimer.onStop(function (time) {
	            (0, _submitControl.callSubmiterdo)(time);
	        });
	    }

	    if (_presenter2['default'].isWeb || _presenter2['default'].isPPTShell || _presenter2['default'].isTeacherPc) {
	        startTimer();
	    } else if (_presenter2['default'].isStudentMobile) {
	        var data = { item: 'exam', type: 'query' };
	        (0, _sendEventToDispatcher.sendEventToDispatcher)(data);
	    }
	}

	//开始计时

	function startTimer() {
	    AxisTimer.start();
	}

	//显示最后的时间

	function lastTimer(startTime) {
	    startTime = parseInt(startTime);
	    var timestamp = new Date().valueOf();
	    AxisTimer.sync(timestamp - startTime * 1000);
	}

	/**
	 * 请求时间同步
	 */

	function syncTime() {
	    //如果是学生才进行时间同步
	    if (_presenter2['default'].isWeb || _presenter2['default'].isStudentMobile) {
	        var param = { "eventName": "ExamInfo", "eventData": { item: "time" } };
	        (0, _callNative2['default'])('sendEvent', param);
	    }
	}

	/**
	 * 注册时间回调函数
	 */

	function registerTimer() {

	    registerNativeListener('ExamCallback', examCallBack);
	    registerNativeListener('ExamInfoCallback', timeListem);
	}

	function timeListem(data) {
	    var item = data.item || '';
	    var value = data.value || {};

	    //如果已经同步过，就不再同步了
	    if (_presenter2['default'].isSyncTime == true) {
	        return false;
	    }

	    //如果是时间同步事件
	    if (item == 'time') {
	        var elapsedTime = value.data ? parseInt(value.data.elapsedTime) : 0;

	        //状态恢复使用
	        if (_presenter2['default'].submitStatus == 'finished' || _presenter2['default'].submitStatus == 'result') {
	            _presenter2['default'].isSyncTime = true;

	            //换pad的时候，答题时间数据丢失，就将教师端时间显示出来
	            if (_presenter2['default'].submitTime <= 0) {
	                lastTimer(elapsedTime);
	            }

	            //将时间停止
	            destoryTimer();
	        } else {
	            startTimer(elapsedTime);
	            _presenter2['default'].isSyncTime = true;
	        }
	    }
	}

	function destoryTimer() {
	    if (AxisTimer) {
	        AxisTimer.onDestory();
	    }
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* global isApp Bridge */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _constants = __webpack_require__(5);

	exports['default'] = function (eventName, data) {
		if (isApp && Bridge && Bridge.callNative) {
			return Bridge.callNative(_constants.callNativePath, eventName, data);
		}
		return false;
	};

	module.exports = exports['default'];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by zhoujunzhou on 2016/1/20.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.sendEventToDispatcher = sendEventToDispatcher;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	//发送事件给分发器

	function sendEventToDispatcher(data) {
	    //是学生才能发送
	    if (!_presenter2['default'].isStudentMobile) {
	        return false;
	    }

	    var timerId = window.setInterval(function () {
	        var dispatcher = player.getPlayerServices().getToolbarModule('classroomStudentDispatcher') || player.getPlayerServices().getModule('classroomStudentDispatcher');
	        if (dispatcher != null) {
	            window.clearInterval(timerId);
	            _presenter2['default'].eventBus.sendEvent('TaskInfo', data);
	        }
	    });
	}

	;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/22.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	var _threeMangerJs = __webpack_require__(4);

	var _constantsJs = __webpack_require__(5);

	exports['default'] = function () {

	    //获取备课端所有的答案
	    var answer = _presenter2['default'].model.question_url.content.answer;

	    //module端所有的区间数组
	    var endpoint1Group = getAllEndpoint1();

	    if (answer.length != endpoint1Group.length) return false;

	    //如果都为空集为真
	    if (answer.length == 0 && endpoint1Group.length == 0) return true;

	    //用来保存匹配结果
	    var matchResult = false;

	    //逐个匹配答案
	    for (var i = 0; i < answer.length; i++) {

	        //如果answer的区间不在操作区间内就返回
	        if (i > 0) {
	            if (!matchResult) return false;
	            matchResult = false;
	        }

	        var minAnsNum = answer[i].min.num,
	            minAnsContain = answer[i].min.contain;

	        //判断
	        for (var j = 0; j < endpoint1Group.length; j++) {

	            var endpoint1 = endpoint1Group[j];
	            var _status = isAnswerEqule(minAnsNum, minAnsContain, endpoint1);
	            if (_status) {

	                //判断大的端点
	                var maxAnsNum = answer[i].max.num,
	                    maxAnsContain = answer[i].max.contain;

	                var endpoint2 = undefined;
	                if (endpoint1Group[j].userData.isSingle) {
	                    endpoint2 = endpoint1Group[j];
	                } else {
	                    endpoint2 = endpoint1Group[j].parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2);
	                }

	                _status = isAnswerEqule(maxAnsNum, maxAnsContain, endpoint2);
	                matchResult = _status;
	                if (_status) {
	                    //移除已经放入临时数组的集合，减少遍历次数
	                    var index = endpoint1Group.indexOf(endpoint1Group[j]);
	                    endpoint1Group.splice(index, 1);
	                }
	            }
	        }
	        //取出区间的小端点
	    }
	    return matchResult;
	};

	//判断answer的点和present上区间点是否相同
	function isAnswerEqule(answerNum, answerContain, Endpoint) {

	    var endpointNumberMar = Endpoint.userData.numberMark;

	    //无穷大是的判断
	    if (answerNum === "" && Math.abs(endpointNumberMar) > 20) return true;

	    if (answerNum === "") return false;
	    //如果坐标相等
	    if (answerNum * 1 === endpointNumberMar) {

	        //判断状态，如果状态相同返回true
	        if (answerContain == 1 && Endpoint.userData.statusIndex == 0 || answerContain == 0 && Endpoint.userData.statusIndex == 1) return true;
	    }
	    return false;
	}

	//获取区间所有Endpoint1的数组
	function getAllEndpoint1() {

	    //存放所有的endpoint1点的数组
	    var tempEndpoint1Group = [];

	    for (var i = 0; i < _threeMangerJs.intersectObjs.length; i++) {
	        if (_threeMangerJs.intersectObjs[i].name == _constantsJs.IntervalObjNames.Endpoint1) {
	            tempEndpoint1Group.push(_threeMangerJs.intersectObjs[i]);
	        }
	    }

	    return tempEndpoint1Group;
	}
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.setLastSelToDelObj = setLastSelToDelObj;
	exports['default'] = documentInit;
	exports.removeEventListerner = removeEventListerner;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _threeMangerJs = __webpack_require__(4);

	var _constantsJs = __webpack_require__(5);

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	var _shapeIntervalEndpointJs = __webpack_require__(24);

	var _shapeIntervalEndpointJs2 = _interopRequireDefault(_shapeIntervalEndpointJs);

	var _UtilsChangeEndpointStatusJs = __webpack_require__(25);

	var _UtilsAddIntervalJs = __webpack_require__(26);

	var _UtilsAddIntervalJs2 = _interopRequireDefault(_UtilsAddIntervalJs);

	var _shapeCreatIntervalLineJs = __webpack_require__(27);

	var _shapeCreatIntervalLineJs2 = _interopRequireDefault(_shapeCreatIntervalLineJs);

	var _UtilsSeleteIntervalJs = __webpack_require__(28);

	var _shapeCreatIntervalGroupJs = __webpack_require__(31);

	var _shapeCreatIntervalGroupJs2 = _interopRequireDefault(_shapeCreatIntervalGroupJs);

	var _UtilsMatchAnswerJs = __webpack_require__(22);

	var _UtilsMatchAnswerJs2 = _interopRequireDefault(_UtilsMatchAnswerJs);

	var _UtilsSetZPositionJs = __webpack_require__(30);

	var _UtilsPackMethodJs = __webpack_require__(32);

	// 二维平面对象
	var boundary,

	// 存放鼠标对象的data
	mouseData = {},

	//当前选中对象
	selectedObj,
	    intersects;
	var actionType = undefined;

	var lastSelToDelObj = undefined;
	var maxMarkPosition = undefined;

	function setLastSelToDelObj(obj) {
	    lastSelToDelObj = obj;
	}

	function documentInit() {
	    if (_presenter2['default'].isStudentMobile || _presenter2['default'].isTeacherMobile) {
	        _presenter2['default'].view.getElementsByTagName('canvas')[0].addEventListener('touchstart', onDocumentMouseDown, false);
	        _presenter2['default'].view.addEventListener('touchend', onViewUp, false);
	    } else {
	        _presenter2['default'].view.getElementsByTagName('canvas')[0].addEventListener('mousedown', onDocumentMouseDown, false);
	        _presenter2['default'].view.addEventListener('mouseup', onViewUp, false);
	    }
	}

	function intersectObjects(pointer, objects) {
	    var pageY = pointer.clientY + $(_presenter2['default'].view).find('.com_layout').scrollTop() + $('body').scrollTop();
	    var pageX = pointer.clientX + $(_presenter2['default'].view).find('.com_layout').scrollLeft() + $('body').scrollLeft();
	    var pointerVector = new THREE.Vector2((pageX - _constantsJs.REAL_ESTATE.offsetLeft) / _constantsJs.REAL_ESTATE.width * 2 - 1, -((pageY - _constantsJs.REAL_ESTATE.offsetTop) / _constantsJs.REAL_ESTATE.height) * 2 + 1);
	    _threeMangerJs.raycaster.setFromCamera(pointerVector, _threeMangerJs.camera);

	    var intersections = _threeMangerJs.raycaster.intersectObjects(objects, false);
	    return intersections;
	}

	function onDocumentMouseDown(event) {
	    event.stopPropagation();
	    event.preventDefault();

	    maxMarkPosition = (_constantsJs.NumberAxisConstData.scaleCount - 1) * 0.5 * _constantsJs.NumberAxisConstData.scaleMargin;
	    boundary = _threeMangerJs.scene.getObjectByName('boundary');
	    var pointer = event.changedTouches ? event.changedTouches[0] : event;

	    intersects = intersectObjects(pointer, _threeMangerJs.intersectObjs);
	    var startPoint = intersectObjects(pointer, [boundary])[0];
	    mouseData.startPoint = startPoint.point;

	    //如果没有点击到对象则返回,取消之前选中的对象
	    if (!intersects.length) {
	        (0, _UtilsSeleteIntervalJs.cancelSelected)(lastSelToDelObj);
	        return;
	    }

	    selectedObj = intersects[0].object;

	    //取消上一次选中
	    switch (selectedObj.name) {
	        case _constantsJs.IntervalObjNames.CoordScaleName:

	            (0, _UtilsSeleteIntervalJs.cancelSelected)(lastSelToDelObj);
	            actionType = _constantsJs.ACTION_TYPE.add;
	            var intervalGroup = (0, _shapeCreatIntervalGroupJs2['default'])();
	            var endPot = (0, _UtilsAddIntervalJs2['default'])(new THREE.Vector3(startPoint.point.x, 0, 0), selectedObj.position.x, intervalGroup);
	            if (!endPot) return;
	            endPot.name = _constantsJs.IntervalObjNames.Endpoint1;
	            selectedObj = endPot;
	            _threeMangerJs.scene.add(intervalGroup);
	            break;

	        case _constantsJs.IntervalObjNames.Endpoint1:
	        case _constantsJs.IntervalObjNames.Endpoint2:
	            actionType = _constantsJs.ACTION_TYPE.changePoint;
	            (0, _UtilsSetZPositionJs.addZPosition)(selectedObj);
	            break;

	        case _constantsJs.IntervalObjNames.IntervalRect:
	            actionType = _constantsJs.ACTION_TYPE.intervalRect;
	            break;

	        case _constantsJs.IntervalObjNames.DeleteBtn:
	            actionType = _constantsJs.ACTION_TYPE.deleteInterval;
	            break;

	        default:
	            break;
	    }

	    //绑定点击事件
	    bindingMouseDownClickEvent();
	}

	function onDocumentMouseMove(event) {

	    event.stopPropagation();
	    event.preventDefault();

	    var pointer = event.changedTouches ? event.changedTouches[0] : event;
	    var movePointObj = intersectObjects(pointer, [boundary])[0];

	    if (selectedObj.name == _constantsJs.IntervalObjNames.IntervalRect || selectedObj.name == _constantsJs.IntervalObjNames.DeleteBtn) return;

	    if (Math.abs(movePointObj.point.x - mouseData.startPoint.x) > 5) {
	        //移动距离超过5才当做移动

	        if (Math.abs(movePointObj.point.x) >= _constantsJs.NumberAxisConstData.numberAxisWidth * 0.5) {
	            onDocumentMouseUp(event);
	            return;
	        }

	        if (Math.abs(movePointObj.point.x) >= maxMarkPosition) {
	            if (movePointObj.point.x < 0) {
	                movePointObj.point.x = -maxMarkPosition;
	            } else {
	                movePointObj.point.x = maxMarkPosition;
	            }
	        }

	        (0, _UtilsSeleteIntervalJs.cancelSelected)(lastSelToDelObj, selectedObj);

	        if (selectedObj.userData.isSingle) {

	            //添加边和另外一条端点
	            selectedObj = (0, _UtilsPackMethodJs.addLineAndAnotherEndpoint)(selectedObj, movePointObj.point);
	        }

	        //判断当前移动的点的最终位置
	        var movingPoint = (0, _UtilsPackMethodJs.updateMovingpoint)(selectedObj, movePointObj.point);
	        (0, _UtilsPackMethodJs.updateMovingInterval)(selectedObj, movingPoint);

	        actionType = _constantsJs.ACTION_TYPE.changeInter;
	    }
	}

	function onDocumentMouseUp(event) {

	    event.stopPropagation();
	    event.preventDefault();

	    (0, _UtilsSeleteIntervalJs.cancelSelected)(lastSelToDelObj, selectedObj);

	    switch (actionType) {

	        case _constantsJs.ACTION_TYPE.add:
	            break;

	        case _constantsJs.ACTION_TYPE.changePoint:

	            //超过20刻度不切换状态
	            if (Math.abs(selectedObj.userData.numberMark) <= 20) {
	                (0, _UtilsChangeEndpointStatusJs.changeEndpointStatus)(selectedObj);
	            }

	            if (selectedObj.name == _constantsJs.IntervalObjNames.Endpoint1 && selectedObj.userData.isSingle) {
	                //选中端点，且是单个点
	                selectedObj.parent.userData.isDelete = !selectedObj.parent.userData.isDelete;
	                (0, _UtilsSeleteIntervalJs.seleteInterval)(selectedObj);
	            }

	            if (selectedObj.userData.isSingle) break;
	            //两个区间左端点和右端点重合时切换端点在执行合并
	            (0, _UtilsPackMethodJs.movingIntervalCombinInterval)(selectedObj);
	            (0, _UtilsSetZPositionJs.setOriginalPosition)(selectedObj);
	            break;

	        case _constantsJs.ACTION_TYPE.changeInter:
	            (0, _UtilsPackMethodJs.undateIntervalWhenMouthUp)(selectedObj);
	            (0, _UtilsPackMethodJs.movingIntervalCombinInterval)(selectedObj);
	            (0, _UtilsPackMethodJs.twoEndpointCoincide)(selectedObj);
	            (0, _UtilsSetZPositionJs.setOriginalPosition)(selectedObj);
	            break;

	        case _constantsJs.ACTION_TYPE.intervalRect:

	            //取消上次选中
	            selectedObj.parent.userData.isDelete = !selectedObj.parent.userData.isDelete;
	            (0, _UtilsSeleteIntervalJs.seleteInterval)(selectedObj);
	            //cancelSelected(lastSelToDelObj,selectedObj);

	            break;

	        case _constantsJs.ACTION_TYPE.deleteInterval:
	            (0, _UtilsPackMethodJs.removeInterval)(selectedObj);
	            break;

	        default:
	            break;
	    }

	    actionType = null;

	    //绑定鼠标抬起的事件
	    bindingMouseUpClickEvent();
	}

	function removeEventListerner() {
	    if (_presenter2['default'].view.getElementsByTagName('canvas')[0]) {
	        _presenter2['default'].view.getElementsByTagName('canvas')[0].removeEventListener('mousedown', onDocumentMouseDown, false);
	        _presenter2['default'].view.getElementsByTagName('canvas')[0].removeEventListener('touchstart', onDocumentMouseDown, false);
	    }
	    _presenter2['default'].view.removeEventListener('touchend', onViewUp, false);
	    _presenter2['default'].view.removeEventListener('touchup', onViewUp, false);
	}

	//绑定事件
	function bindingMouseDownClickEvent() {

	    _presenter2['default'].view.getElementsByTagName('canvas')[0].addEventListener('mousemove', onDocumentMouseMove, false);
	    _presenter2['default'].view.getElementsByTagName('canvas')[0].addEventListener('mouseup', onDocumentMouseUp, false);

	    _presenter2['default'].view.getElementsByTagName('canvas')[0].addEventListener('touchend', onDocumentMouseUp, false);
	    _presenter2['default'].view.getElementsByTagName('canvas')[0].addEventListener('touchmove', onDocumentMouseMove, false);
	}

	function bindingMouseUpClickEvent() {

	    _presenter2['default'].view.getElementsByTagName('canvas')[0].removeEventListener('mousemove', onDocumentMouseMove, false);
	    _presenter2['default'].view.getElementsByTagName('canvas')[0].removeEventListener('mouseup', onDocumentMouseUp, false);

	    _presenter2['default'].view.getElementsByTagName('canvas')[0].removeEventListener('touchmove', onDocumentMouseMove, false);
	    _presenter2['default'].view.getElementsByTagName('canvas')[0].removeEventListener('touchend', onDocumentMouseUp, false);
	}

	function onViewUp() {
	    (0, _UtilsSeleteIntervalJs.cancelSelected)(lastSelToDelObj);
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/13.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _constants = __webpack_require__(5);

	exports['default'] = function () {

		//let endpoint = new THREE.Object3D();
		//endpoint.name = IntervalObjNames.Endpoint;
		var material = new THREE.MeshBasicMaterial({ color: _constants.Color.normal, overdraw: 0.5 });
		var radius = _constants.CircleRadius.soild,
		    triangleSideLength = _constants.NumberAxisHeight * 2;

		//画选择区域框
		var groupHalfHeight = _constants.SelectBox.Height * 1.2,
		    groupWidth = _constants.SelectBox.Width * 1.1;
		var groupShape = new THREE.Shape();

		groupShape.moveTo(-groupWidth, groupHalfHeight);
		groupShape.lineTo(-groupWidth, -groupHalfHeight);
		groupShape.lineTo(groupWidth, -groupHalfHeight);
		groupShape.lineTo(groupWidth, groupHalfHeight);
		groupShape.lineTo(-groupWidth, groupHalfHeight);

		var groupGeometry = new THREE.ShapeGeometry(groupShape);
		var endpoint = new THREE.Mesh(groupGeometry, new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			transparent: true,
			opacity: 0,
			overdraw: 0.5
		}));

		//绘制实心圆
		var soildCircleGeometry = new THREE.CircleGeometry(radius, 64);
		var soildCircle = new THREE.Mesh(soildCircleGeometry, material);
		soildCircle.name = _constants.IntervalObjNames.SoildCircle;

		//绘制空心圆
		var emptyCircleGeometry = new THREE.CircleGeometry(_constants.CircleRadius.empty, 64);
		var emptyCircle = new THREE.Mesh(emptyCircleGeometry, new THREE.MeshBasicMaterial({ color: _constants.Color.emptyCircle, overdraw: 0.5 }));
		emptyCircle.name = _constants.IntervalObjNames.EmptyCircle;
		emptyCircle.visible = false;

		//绘制左边三角形
		var lefthape = new THREE.Shape();
		length = triangleSideLength * Math.sqrt(3) / 2;

		lefthape.moveTo(radius, triangleSideLength);
		lefthape.lineTo(-length, 0);
		lefthape.lineTo(radius, -triangleSideLength);
		lefthape.lineTo(radius, triangleSideLength);

		var leftTriangelGeometry = new THREE.ShapeGeometry(lefthape);
		var leftTriangleMesh = new THREE.Mesh(leftTriangelGeometry, material);
		leftTriangleMesh.name = _constants.IntervalObjNames.LeftTriangle;
		leftTriangleMesh.visible = false;

		//绘制右边三角形
		var rightShape = new THREE.Shape();
		//length = triangleSideLength * Math.sqrt(3);
		rightShape.moveTo(-radius, triangleSideLength);
		rightShape.lineTo(length, 0);
		rightShape.lineTo(-radius, -triangleSideLength);
		rightShape.lineTo(-radius, triangleSideLength);
		var rightTrianglegeometry = new THREE.ShapeGeometry(rightShape);
		var rightTriangleMesh = new THREE.Mesh(rightTrianglegeometry, material);
		rightTriangleMesh.name = _constants.IntervalObjNames.RightTriangle;
		rightTriangleMesh.visible = false;

		//添加图形
		endpoint.add(soildCircle);
		endpoint.add(emptyCircle);
		endpoint.add(leftTriangleMesh);
		endpoint.add(rightTriangleMesh);
		endpoint.position.z = _constants.ZOriginIndex.endpoint;
		//添加状态标示
		endpoint.userData.statusIndex = 0;
		//保存点的坐标
		endpoint.userData.isSingle = true;
		//判断是否改变状态
		endpoint.userData.isChangeStatus = false;

		return endpoint;
	};

	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/14.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.changeEndpointStatus = changeEndpointStatus;
	exports.updateEndpointStatus = updateEndpointStatus;
	exports.showSoildCircle = showSoildCircle;
	exports.showEmptyCircle = showEmptyCircle;
	exports.showTriangle = showTriangle;

	var _constantsJs = __webpack_require__(5);

	//修改状态

	function changeEndpointStatus(endpoint) {

	    if (endpoint.userData.isSingle) return;

	    endpoint.userData.statusIndex = (endpoint.userData.statusIndex + 1) % 2;
	    if (endpoint.userData.statusIndex == 20 || endpoint.userData.statusIndex == -20) {
	        endpoint.userData.statusIndex == 0;
	    }
	    updateEndpointStatus(endpoint);
	}

	//更新状态

	function updateEndpointStatus(endpoint) {

	    var index = endpoint.userData.statusIndex;
	    if (endpoint.userData.numberMark >= -20 && endpoint.userData.numberMark <= 20) {
	        index = endpoint.userData.statusIndex;
	    } else {
	        index = _constantsJs.StatusIndex.Triangle;
	    }

	    switch (index) {
	        case _constantsJs.StatusIndex.SoildCircle:
	            showSoildCircle(endpoint);
	            break;
	        case _constantsJs.StatusIndex.EmptyCircle:
	            showEmptyCircle(endpoint);
	            break;
	        case _constantsJs.StatusIndex.Triangle:
	            showTriangle(endpoint);
	            break;
	    }
	}

	function showSoildCircle(endpoint) {

	    endpoint.getObjectByName(_constantsJs.IntervalObjNames.SoildCircle).visible = true;
	    endpoint.getObjectByName(_constantsJs.IntervalObjNames.EmptyCircle).visible = false;
	    endpoint.getObjectByName(_constantsJs.IntervalObjNames.LeftTriangle).visible = false;
	    endpoint.getObjectByName(_constantsJs.IntervalObjNames.RightTriangle).visible = false;
	}

	function showEmptyCircle(endpoint) {

	    endpoint.getObjectByName(_constantsJs.IntervalObjNames.SoildCircle).visible = true;
	    endpoint.getObjectByName(_constantsJs.IntervalObjNames.EmptyCircle).visible = true;
	    endpoint.getObjectByName(_constantsJs.IntervalObjNames.LeftTriangle).visible = false;
	    endpoint.getObjectByName(_constantsJs.IntervalObjNames.RightTriangle).visible = false;
	}

	function showTriangle(endpoint) {

	    endpoint.getObjectByName(_constantsJs.IntervalObjNames.SoildCircle).visible = false;
	    endpoint.getObjectByName(_constantsJs.IntervalObjNames.EmptyCircle).visible = false;

	    //大于20显示右边三角形
	    if (endpoint.userData.numberMark > 20) {

	        endpoint.getObjectByName(_constantsJs.IntervalObjNames.LeftTriangle).visible = false;
	        endpoint.getObjectByName(_constantsJs.IntervalObjNames.RightTriangle).visible = true;
	    } else {
	        //小于-20显示左边三角形

	        endpoint.getObjectByName(_constantsJs.IntervalObjNames.LeftTriangle).visible = true;
	        endpoint.getObjectByName(_constantsJs.IntervalObjNames.RightTriangle).visible = false;
	    }
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/18.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _constants = __webpack_require__(5);

	var _threeMangerJs = __webpack_require__(4);

	var _shapeIntervalEndpointJs = __webpack_require__(24);

	var _shapeIntervalEndpointJs2 = _interopRequireDefault(_shapeIntervalEndpointJs);

	exports['default'] = function (startPoint, positionX, intervalGroup) {

	    //超过20不创建区间点
	    var currentPot = Math.round(startPoint.x / _constants.NumberAxisConstData.scaleMargin);
	    if (Math.abs(currentPot) > 20) return;

	    var endPot = new _shapeIntervalEndpointJs2['default']();
	    endPot.position.x = positionX;
	    endPot.userData.numberMark = currentPot;
	    endPot.position.z += 1;
	    _threeMangerJs.intersectObjs.push(endPot);
	    //scene.add(endPot);
	    intervalGroup.add(endPot);

	    return endPot;
	};

	module.exports = exports['default'];

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/18.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _constantsJs = __webpack_require__(5);

	var _shapeIntervalEndpointJs = __webpack_require__(24);

	var _shapeIntervalEndpointJs2 = _interopRequireDefault(_shapeIntervalEndpointJs);

	var _threeMangerJs = __webpack_require__(4);

	exports['default'] = function (fixPoint, movingPoint, intervalGroup) {

		var leftPot = undefined,
		    rightPot = undefined;
		var lineHight = _constantsJs.NumberAxisHeight + 2;
		if (movingPoint.x >= fixPoint.x) {
			leftPot = fixPoint;
			rightPot = movingPoint;
		} else {
			leftPot = movingPoint;
			rightPot = fixPoint;
		}

		//画区间的线的其实坐标位置
		var rectLeftCenterX = leftPot.x + _constantsJs.CircleRadius.soild,
		    rectRightCenterX = rightPot.x - _constantsJs.CircleRadius.soild;

		//画区域框
		var groupHalfHeight = _constantsJs.SelectBox.Height * 1.2;
		var groupShape = new THREE.Shape();

		groupShape.moveTo(rectLeftCenterX, groupHalfHeight);
		groupShape.lineTo(rectLeftCenterX, -groupHalfHeight);
		groupShape.lineTo(rectRightCenterX, -groupHalfHeight);
		groupShape.lineTo(rectRightCenterX, groupHalfHeight);
		groupShape.lineTo(rectLeftCenterX, groupHalfHeight);

		var groupGeometry = new THREE.ShapeGeometry(groupShape);
		var rectGroup = new THREE.Mesh(groupGeometry, new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0 }));
		rectGroup.name = _constantsJs.IntervalObjNames.IntervalRect;

		var halfHeight = lineHight * 0.5;
		var intervalShape = new THREE.Shape();
		intervalShape.moveTo(rectLeftCenterX, halfHeight);
		intervalShape.lineTo(rectLeftCenterX, -halfHeight);
		intervalShape.lineTo(rectRightCenterX, -halfHeight);
		intervalShape.lineTo(rectRightCenterX, halfHeight);
		intervalShape.lineTo(rectLeftCenterX, halfHeight);

		var intervalGeometry = new THREE.ShapeGeometry(intervalShape);
		var intervalRect = new THREE.Mesh(intervalGeometry, new THREE.MeshBasicMaterial({ color: _constantsJs.Color.normal }));
		//intervalRect.visible = true;
		intervalRect.name = _constantsJs.IntervalObjNames.IntervalLine;
		rectGroup.position.z = _constantsJs.ZOriginIndex.intervalRect;

		rectGroup.add(intervalRect);
		_threeMangerJs.intersectObjs.push(rectGroup);
		intervalGroup.add(rectGroup);
	};

	module.exports = exports['default'];

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/20.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.seleteInterval = seleteInterval;
	exports.cancelSelected = cancelSelected;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _constantsJs = __webpack_require__(5);

	var _shapeCreatDeleteBtnJs = __webpack_require__(29);

	var _shapeCreatDeleteBtnJs2 = _interopRequireDefault(_shapeCreatDeleteBtnJs);

	var _EventDocumentEventJs = __webpack_require__(23);

	var _setZPositionJs = __webpack_require__(30);

	function seleteInterval(obj) {
	    if (!obj) return;
	    changeIntervalColor(obj);
	    //如果将选中的当做上一次的
	    if (obj.parent.userData.isDelete) {
	        (0, _EventDocumentEventJs.setLastSelToDelObj)(obj);
	        //obj.parent.position.z += 1;
	        (0, _setZPositionJs.addZPosition)(obj);
	    } else {
	        (0, _EventDocumentEventJs.setLastSelToDelObj)();
	        //obj.parent.position.z = 1;
	        (0, _setZPositionJs.setOriginalPosition)(obj);
	    }

	    changeDeleteBtn(obj);
	}

	function changeDeleteBtn(obj) {

	    var btn = obj.parent.getObjectByName(_constantsJs.IntervalObjNames.DeleteBtn);

	    if (!btn) {
	        btn = (0, _shapeCreatDeleteBtnJs2['default'])(obj.parent);
	    } else {
	        btn.visible = !btn.visible;
	    }

	    btn.position.y = _constantsJs.DeleteBtnY;

	    var x1 = 0;
	    var x2 = 0;
	    var x = 0;

	    //获取两个端点去中点的坐标
	    var endPoint1 = obj.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1);
	    var endPoint2 = obj.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2);
	    if (endPoint1) x1 = endPoint1.position.x;
	    if (endPoint2) x2 = endPoint2.position.x;
	    if (endPoint1 && endPoint2) {
	        x = (x1 + x2) / 2;
	    } else if (endPoint1) {
	        x = x1;
	    } else if (endPoint2) {
	        x = x2;
	    }
	    btn.position.x = x - 2;
	}

	//改变区间的颜色
	function changeIntervalColor(obj) {

	    if (obj.parent.userData.isDelete) {
	        changeToColor(obj, _constantsJs.Color['delete']);
	    } else {
	        changeToColor(obj, _constantsJs.Color.normal);
	    }
	}

	//整个区间要改变的颜色
	function changeToColor(obj, color) {
	    var interval = obj.parent;
	    if (interval) {
	        var intervalRect = interval.getObjectByName(_constantsJs.IntervalObjNames.IntervalLine);
	        if (intervalRect) intervalRect.material.color.setHex(color);

	        var point1 = interval.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1);
	        var point2 = interval.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2);
	        if (point1) changeEndpointColor(point1);
	        if (point2) changeEndpointColor(point2);
	    }
	}

	//改变端点的颜色
	function changeEndpointColor(endpoint) {

	    var visibleShape = undefined;
	    if (endpoint.userData.statusIndex == 0) {
	        // 显示实心圆
	        visibleShape = endpoint.getObjectByName(_constantsJs.IntervalObjNames.SoildCircle);
	    } else if (endpoint.userData.statusIndex == 1) {
	        // 显示空心圆
	        //visibleShape = endpoint.getObjectByName(IntervalObjNames.EmptyCircle);
	        visibleShape = endpoint.getObjectByName(_constantsJs.IntervalObjNames.SoildCircle);
	    } else {
	        if (endpoint.numberMark < 20) {
	            //显示左边三角形
	            visibleShape = endpoint.getObjectByName(_constantsJs.IntervalObjNames.LeftTriangle);
	        } else {
	            //显示右边三角形
	            visibleShape = endpoint.getObjectByName(_constantsJs.IntervalObjNames.LeftTriangle);
	        }
	    }

	    if (endpoint.parent.userData.isDelete) {
	        visibleShape.material.color.setHex(_constantsJs.Color['delete']);
	    } else {
	        visibleShape.material.color.setHex(_constantsJs.Color.normal);
	    }
	}

	//取消选中

	function cancelSelected(lastSelectedObj, curSelectedObj) {

	    if (lastSelectedObj) {

	        //如果当前选中和上一次的是同一个物体，则不执行
	        if (curSelectedObj && lastSelectedObj == curSelectedObj) return;

	        lastSelectedObj.parent.userData.isDelete = false;
	        seleteInterval(lastSelectedObj);
	    }
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/21.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _constantsJs = __webpack_require__(5);

	var _threeMangerJs = __webpack_require__(4);

	exports['default'] = function (interval) {
	    //删除按钮
	    var deleteBtn = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 60), (0, _constantsJs.getDeleteMaterial)());
	    deleteBtn.name = _constantsJs.IntervalObjNames.DeleteBtn;
	    deleteBtn.visible = true;

	    _threeMangerJs.intersectObjs.push(deleteBtn);
	    interval.add(deleteBtn);
	    return deleteBtn;
	};

	module.exports = exports['default'];

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.addZPosition = addZPosition;
	exports.setOriginalPosition = setOriginalPosition;

	var _constantsJs = __webpack_require__(5);

	//let zPosition = 0;

	function addZPosition(selectedObj) {

		var shape = selectedObj.parent;
		if (!shape) return;

		if (selectedObj.name == _constantsJs.IntervalObjNames.Endpoint1 || selectedObj.name == _constantsJs.IntervalObjNames.Endpoint2) {
			selectedObj.position.z += 2;
		}
		//++zPosition;
		//shape.position.z = zPosition;
		shape.position.z += 1;
	}

	//还原回之前坐标

	function setOriginalPosition(selectedObj) {

		var shape = selectedObj.parent;
		if (!shape) return;

		if (selectedObj.name == _constantsJs.IntervalObjNames.Endpoint1 || selectedObj.name == _constantsJs.IntervalObjNames.Endpoint2) {
			var endpoint1 = shape.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1);
			var endpoint2 = shape.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2);
			endpoint1.position.z = _constantsJs.ZOriginIndex.endpoint;
			if (endpoint2) endpoint2.position.z = _constantsJs.ZOriginIndex.endpoint;
		}

		shape.position.z = _constantsJs.ZOriginIndex.intervalGroup;
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/21.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _shapeCreatDeleteBtnJs = __webpack_require__(29);

	var _shapeCreatDeleteBtnJs2 = _interopRequireDefault(_shapeCreatDeleteBtnJs);

	var _constants = __webpack_require__(5);

	exports['default'] = function () {

	    var intervalGroup = new THREE.Object3D();
	    intervalGroup.position.z = _constants.ZOriginIndex.intervalGroup;

	    //判断是否删除
	    intervalGroup.userData.isDelete = false;
	    return intervalGroup;
	};

	module.exports = exports['default'];

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/18.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.addLineAndAnotherEndpoint = addLineAndAnotherEndpoint;
	exports.updateInterval = updateInterval;
	exports.updateMovingInterval = updateMovingInterval;
	exports.undateIntervalWhenMouthUp = undateIntervalWhenMouthUp;
	exports.allIntervals = allIntervals;
	exports.movingIntervalCombinInterval = movingIntervalCombinInterval;
	exports.removeInterval = removeInterval;
	exports.twoEndpointCoincide = twoEndpointCoincide;
	exports.updateMovingpoint = updateMovingpoint;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _shapeCreatIntervalLineJs = __webpack_require__(27);

	var _shapeCreatIntervalLineJs2 = _interopRequireDefault(_shapeCreatIntervalLineJs);

	var _UtilsAddIntervalJs = __webpack_require__(26);

	var _UtilsAddIntervalJs2 = _interopRequireDefault(_UtilsAddIntervalJs);

	var _UtilsUpdateVerticesJs = __webpack_require__(9);

	var _UtilsUpdateVerticesJs2 = _interopRequireDefault(_UtilsUpdateVerticesJs);

	var _constantsJs = __webpack_require__(5);

	var _UtilsChangeEndpointStatusJs = __webpack_require__(25);

	var _threeMangerJs = __webpack_require__(4);

	var _UtilsDrawIntervalJs = __webpack_require__(33);

	var _UtilsDrawIntervalJs2 = _interopRequireDefault(_UtilsDrawIntervalJs);

	var _UtilsDestroyThreeObjectJs = __webpack_require__(7);

	var _UtilsDestroyThreeObjectJs2 = _interopRequireDefault(_UtilsDestroyThreeObjectJs);

	//import seleteInterval from '../Utils/seleteInterval.js'

	//添加线和另外一个点

	function addLineAndAnotherEndpoint(selectedObj, movePoint) {

	    //添加另外一条边和端点
	    selectedObj.userData.isSingle = false;

	    (0, _shapeCreatIntervalLineJs2['default'])(selectedObj.position, movePoint, selectedObj.parent);
	    var otherEndPot = new _UtilsAddIntervalJs2['default'](new THREE.Vector3(selectedObj.position.x, 0, 0), movePoint.x, selectedObj.parent);
	    otherEndPot.name = _constantsJs.IntervalObjNames.Endpoint2;
	    otherEndPot.userData.isSingle = false;

	    //将生产的区间排序，EndPoint1 < EndPoint2
	    if (otherEndPot.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1).position.x > otherEndPot.position.x) {
	        otherEndPot.name = _constantsJs.IntervalObjNames.Endpoint1;
	        otherEndPot.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1).name = _constantsJs.IntervalObjNames.Endpoint2;
	    }

	    return otherEndPot;
	}

	//更新区间

	function updateInterval(selectedObj) {

	    var point1 = selectedObj.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1).position,
	        point2 = selectedObj.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2).position;

	    var smallPot = undefined,
	        bigPot = undefined;

	    if (point1.x < point2.x) {
	        smallPot = new THREE.Vector2(point1.x + _constantsJs.CircleRadius.soild * 0.4, 0);
	        bigPot = new THREE.Vector2(point2.x - _constantsJs.CircleRadius.soild * 0.4, 0);
	    } else {
	        smallPot = new THREE.Vector2(point2.x + _constantsJs.CircleRadius.soild * 0.4, 0);
	        bigPot = new THREE.Vector2(point1.x - _constantsJs.CircleRadius.soild * 0.4, 0);

	        //切换区间两个端点的大小
	        var endpoint1 = selectedObj.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1);
	        var endpoint2 = selectedObj.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2);
	        endpoint1.name = _constantsJs.IntervalObjNames.Endpoint2;
	        endpoint2.name = _constantsJs.IntervalObjNames.Endpoint1;
	    }
	    (0, _UtilsChangeEndpointStatusJs.updateEndpointStatus)(selectedObj);

	    //更新
	    updateIntervalRect(selectedObj, smallPot, bigPot);
	}

	//更新区间中间的矩形
	function updateIntervalRect(selectedObj, point1, point2) {

	    var rectObj = selectedObj.parent.getObjectByName(_constantsJs.IntervalObjNames.IntervalRect);
	    var intervalLine = selectedObj.parent.getObjectByName(_constantsJs.IntervalObjNames.IntervalLine);
	    (0, _UtilsUpdateVerticesJs2['default'])(rectObj, point1, point2, _constantsJs.SelectBox.Height * 2.4);
	    (0, _UtilsUpdateVerticesJs2['default'])(intervalLine, point1, point2, _constantsJs.CircleRadius.soild * 0.6);
	}

	//移动更新区间

	function updateMovingInterval(selectedObj, movePoint) {
	    selectedObj.position.x = movePoint.x;
	    selectedObj.userData.isChangeStatus = false;

	    selectedObj.userData.numberMark = Math.round(selectedObj.position.x / _constantsJs.NumberAxisConstData.scaleMargin);

	    updateInterval(selectedObj);
	}

	//鼠标抬起后更新区间

	function undateIntervalWhenMouthUp(selectedObj) {
	    selectedObj.position.x = selectedObj.userData.numberMark * _constantsJs.NumberAxisConstData.scaleMargin;
	    updateInterval(selectedObj);
	}

	//得出所有的区间的端点

	function allIntervals() {

	    var intervalGroup = [];

	    for (var i = 0; i < _threeMangerJs.intersectObjs.length; i++) {
	        if (_threeMangerJs.intersectObjs[i].name == _constantsJs.IntervalObjNames.Endpoint1 || _threeMangerJs.intersectObjs[i].name == _constantsJs.IntervalObjNames.Endpoint2) {
	            intervalGroup.push(_threeMangerJs.intersectObjs[i]);
	        }
	    }
	    return intervalGroup;
	}

	/**
	 *  方法： 移动后合并区间
	 *  @param selectedObj 选中移动的端点
	 **/

	function movingIntervalCombinInterval(selectedObj) {

	    var smallEndpoint = undefined,
	        bigEndpoint = undefined;
	    if (selectedObj.name == _constantsJs.IntervalObjNames.Endpoint1) {
	        smallEndpoint = selectedObj;
	        //if(smallEndpoint.userData.isSingle == true) smallEndpoint.userData.isSingle = false;
	        bigEndpoint = selectedObj.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2);
	    } else {
	        smallEndpoint = selectedObj.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1);
	        bigEndpoint = selectedObj;
	    }

	    if (smallEndpoint.userData.numberMark == bigEndpoint.userData.numberMark) {
	        smallEndpoint.userData.statusIndex = 0;
	        bigEndpoint.userData.statusIndex = 0;
	        (0, _UtilsChangeEndpointStatusJs.updateEndpointStatus)(smallEndpoint);
	        (0, _UtilsChangeEndpointStatusJs.updateEndpointStatus)(bigEndpoint);
	    }

	    var intervalPoints = allIntervals();
	    //移除自身的端点
	    removeObj(smallEndpoint, intervalPoints);
	    removeObj(bigEndpoint, intervalPoints);

	    var inEndpoints = [];

	    for (var i = 0; i < intervalPoints.length; i++) {

	        var endPointNumMark = intervalPoints[i].userData.numberMark;
	        if (smallEndpoint.userData.numberMark <= endPointNumMark && endPointNumMark <= bigEndpoint.userData.numberMark) {
	            inEndpoints.push(intervalPoints[i]);
	        }
	    }

	    if (selectedObj.name == _constantsJs.IntervalObjNames.Endpoint1) {
	        moveSmallEndpointCombinInterval(smallEndpoint, bigEndpoint, inEndpoints);
	    } else {
	        moveBigEndpointCombinInterval(smallEndpoint, bigEndpoint, inEndpoints);
	    }
	}

	//移动区间较大的端点
	function moveBigEndpointCombinInterval(rangeEndpoint1, rangeEndpoint2, endpointsGroup) {

	    //判断右端点是否是空心
	    if (rangeEndpoint1.userData.statusIndex == _constantsJs.StatusIndex.EmptyCircle || rangeEndpoint2.userData.statusIndex == _constantsJs.StatusIndex.EmptyCircle) {
	        //遍历判断是否存在和右端点重合的点，且为空心
	        for (var _i = 0; _i < endpointsGroup.length; _i++) {
	            if (endpointsGroup[_i].userData.numberMark == rangeEndpoint2.userData.numberMark && endpointsGroup[_i].userData.statusIndex == _constantsJs.StatusIndex.EmptyCircle && rangeEndpoint2.userData.statusIndex == _constantsJs.StatusIndex.EmptyCircle) {
	                removeObj(endpointsGroup[_i], endpointsGroup);
	            }

	            //判断左端点和右点重合时
	            else if (endpointsGroup[_i].userData.numberMark == rangeEndpoint1.userData.numberMark && endpointsGroup[_i].name == _constantsJs.IntervalObjNames.Endpoint2) {
	                    removeObj(endpointsGroup[_i], endpointsGroup);
	                }
	        }
	    }

	    //没有点在内直接返回
	    if (endpointsGroup.length == 0) return;

	    var maxPointGroup = [];
	    //取出所有在移动区间内点所对应的右边点
	    maxPointGroup = inMaxEndpoints(endpointsGroup);
	    if (maxPointGroup.length == 0) return;
	    var tempEndpoint = maxPointGroup[0];

	    maxPointGroup.push(rangeEndpoint2);

	    for (var i = 1; i < maxPointGroup.length; i++) {
	        if (maxPointGroup[i].userData.numberMark == tempEndpoint.userData.numberMark && maxPointGroup[i].userData.statusIndex == _constantsJs.StatusIndex.SoildCircle) {
	            tempEndpoint = maxPointGroup[i];
	        } else if (maxPointGroup[i].userData.numberMark > tempEndpoint.userData.numberMark) {
	            tempEndpoint = maxPointGroup[i];
	        }
	    }

	    var maxEndpoint = tempEndpoint.clone();
	    maxEndpoint.userData.isSingle = false;
	    //if(maxEndpoint.userData.statusIndex != 2) maxEndpoint.userData.statusIndex = 0;

	    var endpoint1 = rangeEndpoint1.clone();

	    //移除包含的区间
	    removeCombinObj(maxPointGroup);

	    //重新绘制区间
	    (0, _UtilsDrawIntervalJs2['default'])(endpoint1, maxEndpoint);
	    undateIntervalWhenMouthUp(maxEndpoint);
	}

	//移动区间小的端点
	function moveSmallEndpointCombinInterval(rangeEndpoint1, rangeEndpoint2, endpointsGroup) {

	    //判断左端点是否是空心
	    if (rangeEndpoint1.userData.statusIndex == _constantsJs.StatusIndex.EmptyCircle || rangeEndpoint2.userData.statusIndex == _constantsJs.StatusIndex.EmptyCircle) {
	        //遍历判断是否存在右端点和移动区间左端点重合的点，且都为空心
	        for (var _i2 = 0; _i2 < endpointsGroup.length; _i2++) {
	            if (endpointsGroup[_i2].userData.numberMark == rangeEndpoint1.userData.numberMark && endpointsGroup[_i2].userData.statusIndex == _constantsJs.StatusIndex.EmptyCircle && rangeEndpoint1.userData.statusIndex == _constantsJs.StatusIndex.EmptyCircle) {
	                removeObj(endpointsGroup[_i2], endpointsGroup);
	            }

	            //判断左端点和右点重合时
	            else if (endpointsGroup[_i2].userData.numberMark == rangeEndpoint2.userData.numberMark && endpointsGroup[_i2].name == _constantsJs.IntervalObjNames.Endpoint1) {
	                    removeObj(endpointsGroup[_i2], endpointsGroup);
	                }
	        }
	    }

	    //没有点在内直接返回
	    if (endpointsGroup.length == 0) return;

	    var minPointGroup = [];
	    //取出所有在移动区间内点所对应的左（小）端点
	    minPointGroup = inMinEndpoints(endpointsGroup);
	    if (minPointGroup.length == 0) return;
	    var tempEndpoint = minPointGroup[0];

	    minPointGroup.push(rangeEndpoint1);

	    for (var i = 0; i < minPointGroup.length; i++) {
	        if (minPointGroup[i].userData.numberMark == tempEndpoint.userData.numberMark && minPointGroup[i].userData.statusIndex == _constantsJs.StatusIndex.SoildCircle) {
	            tempEndpoint = minPointGroup[i];
	        } else if (minPointGroup[i].userData.numberMark < tempEndpoint.userData.numberMark) {
	            tempEndpoint = minPointGroup[i];
	        }
	    }

	    if (!tempEndpoint) return;
	    var minEndpoint = tempEndpoint.clone();
	    minEndpoint.userData.isSingle = false;
	    //if(minEndpoint.userData.statusIndex != 2) minEndpoint.userData.statusIndex = 0;
	    var endpoint2 = rangeEndpoint2.clone();

	    //移除包含的区间
	    removeCombinObj(minPointGroup);

	    //重新绘制区间
	    (0, _UtilsDrawIntervalJs2['default'])(minEndpoint, endpoint2);
	    undateIntervalWhenMouthUp(minEndpoint);
	}

	//寻找区间内所有的大端点
	function inMaxEndpoints(endpointsGroup) {

	    var maxPointGroup = [];
	    for (var i = 0; i < endpointsGroup.length; i++) {
	        if (endpointsGroup[i].name == _constantsJs.IntervalObjNames.Endpoint1) {
	            if (endpointsGroup[i].userData.isSingle) {
	                maxPointGroup.push(endpointsGroup[i]);
	            } else {
	                var endpoint2 = endpointsGroup[i].parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2);
	                maxPointGroup.push(endpoint2);
	            }
	        }
	    }

	    return maxPointGroup;
	}

	//寻找区间内所有的小端点
	function inMinEndpoints(endpointsGroup) {
	    var minPointGroup = [];
	    for (var i = 0; i < endpointsGroup.length; i++) {
	        if (endpointsGroup[i].name == _constantsJs.IntervalObjNames.Endpoint1 && endpointsGroup[i].userData.isSingle) {
	            minPointGroup.push(endpointsGroup[i]);
	        } else if (endpointsGroup[i].name == _constantsJs.IntervalObjNames.Endpoint2) {
	            var endpoint1 = endpointsGroup[i].parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1);
	            minPointGroup.push(endpoint1);
	        }
	    }
	    return minPointGroup;
	}

	/**
	 *  方法： 删除合并的对象
	 *  @param endpointGroup 包含区间所有小端点或所有大端点的数组
	 *
	 **/
	function removeCombinObj(endpointGroup) {

	    for (var i = 0; i < endpointGroup.length; i++) {

	        //intersectObjs上移除合并对象
	        removeFromIntersectObjs(endpointGroup[i]);
	        //scene上移除合并对象
	        _threeMangerJs.scene.remove(endpointGroup[i].parent);
	        (0, _UtilsDestroyThreeObjectJs2['default'])(endpointGroup[i].parent);
	    }
	}

	/**
	 *  方法： 删除传入对象对应的区间
	 *  @param obj 区间内的一个对象，如区间线，或端点
	 *
	 **/

	function removeInterval(obj) {

	    removeFromIntersectObjs(obj);
	    _threeMangerJs.scene.remove(obj.parent);
	    (0, _UtilsDestroyThreeObjectJs2['default'])(obj.parent);
	}

	function removeFromIntersectObjs(obj) {

	    if (obj.userData.isSingle) {
	        removeObj(obj);
	    } else {
	        var intervalGroup = obj.parent;
	        var endpoint1 = intervalGroup.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1),
	            intervalRect = intervalGroup.getObjectByName(_constantsJs.IntervalObjNames.IntervalRect),
	            endpoint2 = intervalGroup.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2),
	            deleteBtn = intervalGroup.getObjectByName(_constantsJs.IntervalObjNames.DeleteBtn);
	        removeObj(endpoint1);
	        removeObj(intervalRect);
	        removeObj(endpoint2);
	        if (deleteBtn) removeObj(deleteBtn);
	    }
	}

	function removeObj(Obj, objsArray) {

	    if (!objsArray) objsArray = _threeMangerJs.intersectObjs;

	    var index = $.inArray(Obj, objsArray);
	    if (index == -1) return;
	    objsArray.splice(index, 1);
	}

	//移动过程中两个点重合

	function twoEndpointCoincide(endpoint) {

	    //获取区间group
	    var intervalGroup = endpoint.parent;
	    var endpoint1 = intervalGroup.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1),
	        intervalRect = intervalGroup.getObjectByName(_constantsJs.IntervalObjNames.IntervalRect);

	    //不是区间
	    if (!intervalRect) return;

	    var endpoint2 = intervalGroup.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2);

	    if (endpoint1.userData.numberMark == endpoint2.userData.numberMark) {

	        intervalGroup.remove(endpoint2);
	        intervalGroup.remove(intervalRect);

	        removeObj(endpoint2);
	        removeObj(intervalRect);
	        (0, _UtilsDestroyThreeObjectJs2['default'])(endpoint2);
	        (0, _UtilsDestroyThreeObjectJs2['default'])(intervalRect);

	        //变为单个实心点
	        endpoint1.userData.isSingle = true;
	        endpoint1.userData.statusIndex = 0;
	        (0, _UtilsChangeEndpointStatusJs.updateEndpointStatus)(endpoint1);
	    }
	}

	function updateMovingpoint(selectedObj, movingPoint) {

	    var otherEndpoint = undefined;
	    if (selectedObj.name == _constantsJs.IntervalObjNames.Endpoint1) {
	        otherEndpoint = selectedObj.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint2);
	    } else {
	        otherEndpoint = selectedObj.parent.getObjectByName(_constantsJs.IntervalObjNames.Endpoint1);
	    }

	    if (Math.abs(otherEndpoint.userData.numberMark) > 20) {
	        //如果数轴对应的另一个端点超过20

	        var instance = (_constantsJs.NumberAxisConstData.scaleCount - 3) * 0.5 * _constantsJs.NumberAxisConstData.scaleMargin;

	        if (otherEndpoint.position.x > 0 && movingPoint.x > instance) {
	            selectedObj.position.x = instance;
	            movingPoint.x = selectedObj.position.x;
	        } else if (otherEndpoint.position.x < 0 && movingPoint.x < -instance) {
	            selectedObj.position.x = -instance;
	            movingPoint.x = selectedObj.position.x;
	        }
	    }

	    return movingPoint;
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2016/1/19.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _shapeIntervalEndpointJs = __webpack_require__(24);

	var _shapeIntervalEndpointJs2 = _interopRequireDefault(_shapeIntervalEndpointJs);

	var _shapeCreatIntervalLineJs = __webpack_require__(27);

	var _shapeCreatIntervalLineJs2 = _interopRequireDefault(_shapeCreatIntervalLineJs);

	var _constantsJs = __webpack_require__(5);

	var _threeMangerJs = __webpack_require__(4);

	var _shapeCreatIntervalGroupJs = __webpack_require__(31);

	var _shapeCreatIntervalGroupJs2 = _interopRequireDefault(_shapeCreatIntervalGroupJs);

	exports['default'] = function (endpoint1, endpoint2) {

	    var intervalGroup = (0, _shapeCreatIntervalGroupJs2['default'])();
	    intervalGroup.add(endpoint1);
	    (0, _shapeCreatIntervalLineJs2['default'])(endpoint1.position, endpoint2.position, intervalGroup);
	    intervalGroup.add(endpoint2);
	    _threeMangerJs.intersectObjs.push(endpoint1);
	    _threeMangerJs.intersectObjs.push(endpoint2);

	    //������������������EndPoint1 < EndPoint2
	    if (endpoint1.position.x <= endpoint2.position.x) {
	        endpoint1.name = _constantsJs.IntervalObjNames.Endpoint1;
	        endpoint2.name = _constantsJs.IntervalObjNames.Endpoint2;
	    } else {
	        endpoint1.name = _constantsJs.IntervalObjNames.Endpoint2;
	        endpoint2.name = _constantsJs.IntervalObjNames.Endpoint1;
	    }
	    _threeMangerJs.scene.add(intervalGroup);
	};

	module.exports = exports['default'];

/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports["default"] = function (state) {
	  var currentState;
	  if (state) {
	    currentState = JSON.parse(state);
	    // ToDo:处理Module的状态恢复
	  }
	};

	module.exports = exports["default"];

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 获得当前Module的状态信息
	 * 可用于Module的状态恢复和保存
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	exports['default'] = function () {

	    var time = new Date().valueOf();
	    var state = {
	        module_id: _presenter2['default'].model.ID,
	        'submitStatus': _presenter2['default'].submitStatus,
	        'time': time,
	        'submitTime': _presenter2['default'].submitTime
	    };

	    return JSON.stringify(state);
	};

	module.exports = exports['default'];

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	exports['default'] = function (path) {
	  _presenter2['default'].path = path;
	};

	module.exports = exports['default'];

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// 销毁 module 占用的内存
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _moduleControlJs = __webpack_require__(15);

	exports["default"] = function () {
	  "use strict";
	  (0, _moduleControlJs.moduleClose)();
	};

	module.exports = exports["default"];

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2015/12/14.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	exports['default'] = function () {
	    var question_id = '',
	        question_url = '';
	    if (_presenter2['default'].model !== undefined) {
	        try {
	            question_id = _presenter2['default'].model.question_id;
	            question_url = JSON.stringify(_presenter2['default'].model.question_url);
	        } catch (e) {}
	    }

	    return {
	        id: question_id,
	        dispatchOnly: true,
	        type_code: 'nd_intervalproblem',
	        type_name: '区间题',
	        url: question_url
	    };
	};

	module.exports = exports['default'];
	//statistics_type: 'no_need', question_url

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator on 2015/12/15.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	exports['default'] = function (controller) {
	    _presenter2['default'].controller = controller;
	    _presenter2['default'].eventBus = controller.getEventBus();
	    _presenter2['default'].eventBus.addEventListener('SyncCallback', _presenter2['default']);
	    _presenter2['default'].eventBus.addEventListener('PageLoaded', _presenter2['default']);

	    //注册监听
	    //监听学生端提交
	    _presenter2['default'].eventBus.addEventListener('AnswerSubmitterEvent', _presenter2['default']);
	    //监听公布结果
	    _presenter2['default'].eventBus.addEventListener('ExamCallback', _presenter2['default']);
	    _presenter2['default'].eventBus.addEventListener('Exam', _presenter2['default']);

	    _presenter2['default'].eventBus.addEventListener('TaskInfoCallback', _presenter2['default']);
	};

	module.exports = exports['default'];

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	var _submitControl = __webpack_require__(17);

	var _timer = __webpack_require__(19);

	exports['default'] = function (eventName, eventData) {
	    //测试将所有接收到的事件都打印出来
	    switch (eventName) {
	        case 'SyncCallback':
	            SyncCallback(eventData);
	            break;
	        case 'PageLoaded':
	            break;
	        // //提交模块发送的事件
	        case 'AnswerSubmitterEvent':

	            if (eventData.event == 'finished' && eventData.source == _presenter2['default'].model.ID) {
	                //停止答题
	                var stopTime = _timer.AxisTimer.stop();

	                //在状态恢复的时候不进行提示，在正确情况下进行提示
	                if (_presenter2['default'].submitStatus != 'finished' && _presenter2['default'].submitStatus != 'result') {
	                    (0, _submitControl.showAlert)('student');
	                }

	                //如果提交了，就显示提交的时间
	                _presenter2['default'].submitTime = stopTime;

	                //如果已经到公布答案了，就不设置为finished状态
	                if (_presenter2['default'].submitStatus != 'result') {
	                    _presenter2['default'].submitStatus = 'finished';
	                }
	            }

	            //提交过后，当前不可操作
	            if (eventData.event == 'undo' && eventData.source == _presenter2['default'].model.ID) {
	                if (_presenter2['default'].submitStatus != 'finished' && _presenter2['default'].submitStatus != 'result') {
	                    _presenter2['default'].submitStatus = 'undo';
	                }
	            }

	            //点击修改，当前可以操作
	            if (eventData.event == 'do' && eventData.source == _presenter2['default'].model.ID) {
	                //记录已经提交过
	                if (_presenter2['default'].submitStatus != 'finished' && _presenter2['default'].submitStatus != 'result') {
	                    _presenter2['default'].submitStatus = 'do';
	                }
	            }

	            //提交成功的时候，保存答题数据
	            if (eventData.event == 'success' && eventData.source == _presenter2['default'].model.ID) {
	                (0, _submitControl.recordSubmitAnswer)();
	            }

	            break;

	        case 'ExamCallback':

	            //显示答案的模拟事件
	            if (eventData.type == 'result' && eventData.source == 'classroomStudentDispatcher') {
	                if (eventData.value && eventData.value.isRecover) {
	                    //显示答题反馈
	                    if (_presenter2['default'].isStudentMobile) {
	                        (0, _submitControl.examCallBack)(eventData);
	                    }
	                    _presenter2['default'].submitStatus = 'result';
	                }
	            }

	            break;
	        case 'TaskInfoCallback':
	            {
	                if (eventData.item == 'exam' && eventData.type == 'query') {

	                    //服务器端开始的时间戳
	                    var startTimestamp = eventData.value.startTimestamp;
	                    startTimestamp = startTimestamp == 0 ? new Date().getTime() : startTimestamp;

	                    (0, _timer.startTimer)(startTimestamp);
	                }
	            }
	            break;
	        default:
	    }
	};

	var SyncCallback = function SyncCallback(eventData) {
	    var type = eventData.type;
	    var value = eventData.value;

	    var $button = $(_presenter2['default'].view).find('.js-stop-sync-button');
	    switch (type) {
	        case 'request':
	            // 发送任务
	            _presenter2['default'].syncId = value.syncId;
	            if (value.result) {
	                // 成功
	                $button.show();
	            } else {
	                window.ClassroomUtils.showTipMessageBox('同步题目失败');
	            }
	            break;
	        case 'cancel':
	            // 结束同步
	            if (value.result) {
	                $button.hide();
	            } else {
	                window.ClassroomUtils.showMessageBox([{
	                    html: '关闭'
	                }, {
	                    html: '重试',
	                    target: 'h5',
	                    callback: {
	                        eventName: 'IntervalProblem',
	                        eventData: {
	                            source: _presenter2['default'].model.ID,
	                            item: 'retry'
	                        }
	                    }
	                }], '结束任务失败！');
	            }
	            break;
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	var _EventDocumentEvent = __webpack_require__(23);

	var _EventDocumentEvent2 = _interopRequireDefault(_EventDocumentEvent);

	var _timer = __webpack_require__(19);

	exports['default'] = function (view, model) {
		showInterval(view, model);
		(0, _EventDocumentEvent2['default'])();
		if (_presenter2['default'].isStudentMobile || _presenter2['default'].isWeb || _presenter2['default'].isPPTShell || _presenter2['default'].isTeacherPc) {
			(0, _timer.initTimer)();
		}
	};

	function showInterval(view, model) {

		var intervals = model.question_url.content.intervals;
		var html = "";
		if (intervals.length > 2) html += "<em>(</em>";
		var index = 0;
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = intervals[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var interval = _step.value;

				if (interval.addType) {
					if (interval.addType === "0") {
						html += "&cup;";
					} else {
						html += "&cap;";
					}
				}
				if (interval.min.contain === "0") {
					html += "(";
				} else {
					html += "[";
				}
				if (interval.min.num === "") {
					html += "-&infin;";
				} else {
					html += interval.min.num;
				}

				html += ",";

				if (interval.max.num === "") {
					html += "+&infin;";
				} else {
					html += interval.max.num;
				}
				if (interval.max.contain == "0") {
					html += ")";
				} else {
					html += "]";
				}

				if (intervals.length > 2 && index == 1) {
					html += "<em>)</em>";
				}
				index++;
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		$(view).find(".text").html(html);

		var title = model.question_url.title;
		$(view).find(".interval_title").find("span").html(title);
	}
	module.exports = exports['default'];

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _shapeIntervalEndpointJs = __webpack_require__(24);

	var _shapeIntervalEndpointJs2 = _interopRequireDefault(_shapeIntervalEndpointJs);

	var _threeMangerJs = __webpack_require__(4);

	var _constantsJs = __webpack_require__(5);

	var _UtilsChangeEndpointStatusJs = __webpack_require__(25);

	var _shapeCreatIntervalLineJs = __webpack_require__(27);

	var _shapeCreatIntervalLineJs2 = _interopRequireDefault(_shapeCreatIntervalLineJs);

	exports['default'] = function (answer) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = answer[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var interval = _step.value;

				if (interval.min.num === interval.max.num && interval.min.num !== "") {
					var endPot = new _shapeIntervalEndpointJs2['default']();
					endPot.position.x = interval.min.num * _constantsJs.NumberAxisConstData.scaleMargin;
					_threeMangerJs.scene.add(endPot);
				} else {
					var minNum = interval.min.num;
					if (minNum === '') {
						minNum = -21;
					}
					var minPot = drawPoint(minNum, interval.min.contain);
					var maxNum = interval.max.num;
					if (maxNum === '') {
						maxNum = 21;
					}
					var maxPot = drawPoint(maxNum, interval.max.contain);
					(0, _shapeCreatIntervalLineJs2['default'])(minPot.position, maxPot.position, _threeMangerJs.scene);
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	};

	function drawPoint(num, contain) {
		var endPot = new _shapeIntervalEndpointJs2['default']();
		endPot.position.x = num * _constantsJs.NumberAxisConstData.scaleMargin;
		endPot.position.z = 1;
		if (Math.abs(num) <= 20) {
			if (contain === "1") {
				(0, _UtilsChangeEndpointStatusJs.showSoildCircle)(endPot);
			} else {
				(0, _UtilsChangeEndpointStatusJs.showEmptyCircle)(endPot);
			}
		} else {
			endPot.userData.numberMark = num;
			(0, _UtilsChangeEndpointStatusJs.showTriangle)(endPot);
		}
		_threeMangerJs.scene.add(endPot);
		return endPot;
	}
	module.exports = exports['default'];

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by zhoujunzhou on 2016/1/11.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	//发送事件给状态恢复

	exports['default'] = function (action) {
	    //是学生才能发送
	    if (!_presenter2['default'].isStudentMobile) {
	        return false;
	    }

	    action = action || 'undo';
	    var timerId = window.setInterval(function () {
	        var answerSubmitter = player.getPlayerServices().getToolbarModule('AnswerSubmitter') || player.getPlayerServices().getModule('AnswerSubmitter');
	        if (answerSubmitter != null) {
	            window.clearInterval(timerId);
	            _presenter2['default'].eventBus.sendEvent('AnswerSubmitterRecoverState', {
	                source: _presenter2['default'].model.ID,
	                action: action
	            });
	        }
	    });
	};

	module.exports = exports['default'];

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by zhoujunzhou on 2016/1/12.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _presenter = __webpack_require__(1);

	var _presenter2 = _interopRequireDefault(_presenter);

	exports['default'] = function (urlParams) {
	    if (urlParams.sys) {
	        isAnySystem(urlParams.sys);
	    }
	};

	function isAnySystem(systemMap) {
	    switch (systemMap) {
	        case 'homework':
	            _presenter2['default'].isHomeWork = true;
	            break;
	        case 'pptshell':
	            _presenter2['default'].isPPTShell = true;
	            break;
	        default:
	            _presenter2['default'].isHomeWork = false;
	    }
	};
	module.exports = exports['default'];

/***/ }
/******/ ]);