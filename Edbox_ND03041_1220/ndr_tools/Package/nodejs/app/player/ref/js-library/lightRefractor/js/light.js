//version=1.0
(function(window,document,$){
/**
 * 简易模块化加载器
 * Created by ylf on 2016/7/5.
 */


var require, define;
(function () {
    var defined = {}, defineWaiting = {};

    var callDeps = function (key) {
        if (key) {
            key = key.toLowerCase();
        }
        if (defineWaiting[key]) {
            var df = defineWaiting[key];
            delete defineWaiting[key];
            var args = [];
            for (var i = 0; i < df.deps.length; i++) {
                var depName = df.deps[i];
                args[i] = callDeps(depName);
            }
            var ret = df.callback.apply(df.callback, args);
            defined[key] = ret;
        }

        return defined[key];
    };

    define = function (key, deps, callback) {
        if (key) {
            key = key.toLowerCase();
        }
        if (!(deps instanceof Array)) {
            callback = deps;
            deps = [];
        }
        if (defineWaiting[key]) {
            throw  new Error('the key already has been  used');
        }
        defineWaiting[key] = {
            'deps': deps,
            'callback': callback,
            'module': null
        };
    };

    require = function (key) {
        return callDeps(key);
    };

})();

/**
 * Created by ylf on 2016/7/22.
 */
define('js/base/base', [], function () {
    var Logger = require('js/utils/logger');

    var include = function (baseCls, cls) {
        for (var key in cls) {
            if (typeof baseCls[key] !== "undefined" && key !== '__base') {
                if (!baseCls.__overwrite || baseCls.__overwrite.indexOf(key) < 0) {
                    //Logger.error('有重复的成员', key);
                    Logger.debug('有重复的成员', key);
                }
            }
            baseCls[key] = cls[key];
        }
        return baseCls;
    };

    var proxy = function (thisobj, fn) {
        return function () {
            return fn.apply(thisobj, arguments);
        };
    };

    /**
     * {
                key: '',//key
                fucs: '',//方法名
                params: []//参数说明
            }
     */

    var Base = {
        ___eventBus: null,
        ___eventsInfo: [{
            key: '',//key
            callback: '',//方法名
            params: []//参数说明
        }],
        __base: function (eventBus, eventsInfo) {
            this.___eventsInfo = null;
            this.___eventBus = null;

            var args = Array.prototype.slice.apply(arguments, [0]);
            if (args.length > 2) {
                throw  new Error('参数长度有误');
            }
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (arg instanceof Array) {
                    this.___eventsInfo = arg;
                } else if (typeof  arg === 'object') {
                    this.___eventBus = eventBus;
                }
            }

            this.___eventBus = this.___eventBus || {};
            this.___eventsInfo = this.___eventsInfo || [];

            //__addEvent;
            for (var i = 0; i < this.___eventsInfo.length; i++) {
                var event = this.___eventsInfo[i];
                var type = event.key;
                if (typeof event.callback === 'string') {
                    this.___eventBus.on(type, this[event.callback], this);
                } else {
                    this.___eventBus.on(type, event.callback, this);
                }
            }
        },
        __include: function (cls) {
            return include(this, cls);
        },
        __proxyAll: function (callback) {
            for (var i = 0; i < callback.length; i++) {
                if (typeof callback[i] === 'string') {
                    this[callback[i]] = proxy(this, this[callback[i]]);
                }
            }
        },
        __on: function (key, callback, params) {
            this.___eventsInfo.push({
                key: key,//key
                callback: callback,//方法名
                params: params//参数说明
            });

            if (typeof callback === 'string') {
                this.___eventBus.on(key, this[callback], this);
            } else {
                this.___eventBus.on(key, callback, this);
            }
        },
        __triggerEvent: function (type) {
            var arg = Array.prototype.slice.apply(arguments, [0]);
            this.___eventBus.trigger.apply(this.___eventBus, arg);
        },
        __getEventBus: function () {
            return this.___eventBus;
        },
        __destroy: function () {
            var eventsInfo = this.___eventsInfo;
            for (var i = 0; i < eventsInfo.length; i++) {
                var event = eventsInfo[i];
                var type = event.key;
                if (typeof event.callback === 'string') {
                    this.___eventBus.off(type, this[event.callback], this);
                } else {
                    this.___eventBus.off(type, event.callback, this);
                }
            }
        }
    };


    return function (cls) {
        return Object.create(Base).__include(cls);
    };


});
/**
 * Created by ylf on 2016/7/25.
 * 全局颜色配置
 */
define('js/config/color', [], function () {


    var color = {};
    color['transparent'] = kity.Color.createRGBA(0, 0, 0, 0);
    color['node_stroke_normal'] = kity.Color.createRGB(115, 161, 191);
    color['node_stroke_active'] = kity.Color.createRGB(57, 80, 96);
    color['backgroud_color'] = kity.Color.parse('#C0D3E2');
    color['line_color'] = kity.Color.parse('#666564');

    return color;
})
/**
 * Created by ylf on 2016/7/26.
 * 事件key
 */
define('js/config/eventKey', [], function () {


    var EventKey = {
        Blur: 'Blur',
        DomEvent: 'DomEvent',
        SurfaceAngleVisible: 'SurfaceAngleVisible',
        NormalAngleVisible: 'NormalAngleVisible',
        NameVisible: 'NameVisible',
        ZIndexChange: 'ZIndexChange',
        LightLineVisible: 'LightLineVisible',
        MoveBtn: 'MoveBtn',
        BtnMove: 'BtnMove'
    };

    return EventKey;
})
/**
 * Created by ylf on 2016/7/25.
 * 全局颜色配置
 */
define('js/config/lang', [], function () {

    var lang = {
        'rf_incidence_line_name': '入射光线',
        'rf_incidence_angle': '入射角',
        'rf_incidence_point': '入射点O',
        'rf_normal_name': '法线N',
        'rf_reflection_line_name': '反射光线',
        'rf_reflection_angle': '反射角',
        'rf_reflection_surface': '反射面',
        'rf_equal_angle_name': '反射角=入射角=0°'
    };


    return lang;
})
/**
 * Created by ylf on 2016/7/25.
 * 全局颜色配置
 */
define('js/config/style', ['js/config/color'], function () {

    var fontClass = {
        black: 'svg_text color_black',
        green: 'svg_text color_green',
        blue: 'svg_text color_blue',
        red: 'svg_text color_red',
        orange: 'svg_text color_orange',
        purple: 'svg_text color_purple'
    };

    var style = {};


    style.LineStyle = {
        strokeStyle: {'stroke-width': 2.5, 'stroke': kity.Color.parse('#ffffff')},
        rectHeight: 8,
        btnRotate: {width: 64, height: 64},
        arrow: {width: 34, height: 45},
        on: 'on',
        commonLineFill: kity.Color.parse('#794F78'),
        commonArrowCls: 'arrow_purple',
        IncidenceLine: {
            fill: kity.Color.parse('#005798'),
            fontClass: fontClass.blue,
            arrowClass: 'arrow_blue'
        },
        ReflectionLine: {
            fill: kity.Color.parse('#CB1F1F'),
            fontClass: fontClass.red,
            arrowClass: 'arrow_red'
        },
        RefractionLine: {
            fill: kity.Color.parse('#CB1F1F'),
            fontClass: fontClass.red,
 
            arrowClass: 'arrow_red'
        }
    };

    style.Sector = {
        strokeStyle: {'stroke-width': 1, 'stroke': kity.Color.parse('#7595AC')},
        //surfaceFill: kity.Color.parse('#C2B69C'),
        //normalFill: kity.Color.parse('#8DB8A7'),
        surfaceFill: kity.Color.createRGBA(213, 139, 34, 0.35),
        incidence_normalFill: kity.Color.createRGBA(204, 131, 255, 0.35),
        normalFill: kity.Color.createRGBA(60, 143, 65, 0.35),
        incidence_normalFontClass: fontClass.purple,
        normalFontClass: fontClass.green,
        surfaceFontClass: fontClass.orange
    };

    style.NormalLine = {
        strokeStyle: {'stroke-width': 4, 'stroke': kity.Color.parse('#4D4D4D')},
        fontClass: fontClass.black,
        pointWidth: 5,
        pointFill: kity.Color.parse('#CB1F1F')
    };

    style.InverseRefractionLine = {
        strokeStyle: {'stroke-width': 4, 'stroke': kity.Color.parse('#FF0000')},
        fontClass: fontClass.black,
        pointWidth: 5,
        name: '',
        incidencePointName: '',
        pointFill: kity.Color.parse('#CB1F1F')
    };

    style.IncidencePoint = {
        width: 9,
        fill: kity.Color.parse('#FFE012')
    };

    style.Surface = {
        height: 19,
        surfaceClass: 'wall_tl',
        fontClass: fontClass.black,
        btnRotate: {width: 64, height: 64}
    };

    style.Pedal = {
        strokeStyle: {'stroke-width': 5, 'stroke': kity.Color.parse('#04740b')},
        width: 35
    };

    style.EqualAngleName = {
        fontClass: fontClass.green
    };

    return style;
})
/**
 * 点击事件 create by ylf 2016/7/5
 */
var gloInitJqEvent = function () {
    var supportTouch = 'ontouchend' in document;
    var isMobile = navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i) ? true : false;
    var vEventHandler = {};
    if (supportTouch && isMobile) {
        //拥有触屏事件
        vEventHandler.mouseDown = 'touchstart';
        vEventHandler.mouseUp = 'touchend';
        vEventHandler.mouseWheel = 'touchmove';
        vEventHandler.getEventX = function (event) {
            return event.originalEvent.changedTouches[0].clientX;
        };
        vEventHandler.getEventY = function (event) {
            return event.originalEvent.changedTouches[0].clientY;
        };
    } else {
        //没有触屏幕事件
        vEventHandler.mouseDown = 'mousedown';
        vEventHandler.mouseUp = 'mouseup';
        vEventHandler.mouseWheel = 'mousewheel';
        vEventHandler.getEventX = function (event) {
            return event.clientX;
        };
        vEventHandler.getEventY = function (event) {
            return event.clientY;
        };
    }

    //点击事件
    $.event.special.lrTap = {
        setup: function () {
            var $that = $(this);
            if (supportTouch && isMobile) {
                var vMouseDown = vEventHandler.mouseDown;
                var vMouseUp = vEventHandler.mouseUp;
                var _start = 0;
                var _startX = 0;
                var _startY = 0;
                $that.bind(vMouseDown, function (event) {
                    if (event.which !== 0 || event.which !== 1) {
                        _start = new Date().getTime();
                        _startX = vEventHandler.getEventX(event);
                        _startY = vEventHandler.getEventY(event);
                    }
                });
                $that.bind(vMouseUp, function (event) {

                    if (event.which !== 0 || event.which !== 1) {
                        var end = new Date().getTime();
                        var endX = vEventHandler.getEventX(event);
                        var endY = vEventHandler.getEventY(event);
                        var holdTime = end - _start;
                        var dx = Math.abs(endX - _startX);
                        var dy = Math.abs(endY - _startY);
                        if (holdTime <= 550 && dx < 8 && dy < 8) {
                            //触发tap事件
                            event = $.event.fix(event);
                            event.type = 'lrTap';
                            event.tapEventSource = 'touchclick';
                            event.tapFireTouch = true;
                            $that.triggerHandler(event);
                        }
                    }
                });
            } else {
                $that.bind('click', function (event) {
                    //触发tap事件
                    event = $.event.fix(event);
                    event.type = 'lrTap';
                    event.tapEventSource = 'mouseclick';
                    event.tapFireTouch = false;
                    //白板手写笔点击触发touch事件
                    if (event.originalEvent && event.originalEvent.sourceCapabilities && event.originalEvent.sourceCapabilities.firesTouchEvents) {
                        event.tapFireTouch = true;
                    }
                    $that.triggerHandler(event);
                });
            }
        },
        teardown: function () {
            var vMouseDown = vEventHandler.mouseDown;
            var vMouseUp = vEventHandler.mouseUp;
            var $that = $(this);
            $that.unbind(vMouseUp).unbind(vMouseDown);
        }
    };

};

gloInitJqEvent();
/**
 * Created by ylf on 2016/7/22.
 */
define('js/reflector/baseReflector', ['js/base/base','js/utils/utils'], function (Base,Utils) {

    var BaseReflector = {
        _lightComplexArray: null,//光组件合集
        _uuid:null,
        __overwrite: ['createView', 'drawAll', 'drawNext', 'getData'],
        __base: function (eventbus, eventsInfo) {
            var args = Array.prototype.slice.apply(arguments, [0]);
            Base({}).__base.apply(this, args);
            this._uuid=Utils.getUuid();
        },
        createView: function () {

        },
        drawAll: function () {
            this._lightComplexArray.drawAll();
        },
        drawNext: function () {
            this._lightComplexArray.drawNext();
        },
        hasNext: function () {
            return this._lightComplexArray.hasNext();
        },
        getData: function () {

        },
        getType: function () {
            return this._TYPE;
        },
        getNameVisible: function () {
            return this._option.nameVisible;
        },
        pushEvent: function (eventInfo) {
            this._event.push(eventInfo);
            this.__proxyAll([eventInfo.callback]);
        },
        getUuid:function(){
            return this._uuid;
        }

    };


    return function (cls) {
        return Base(BaseReflector).__include(cls);
    };


});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/reflector/domEvent', ['js/base/Base', 'js/config/EventKey', 'js/utils/eventUtils'], function (Base, EventKey, EventUtils) {

    var Logger = require('js/utils/logger');

    var DomEvent = Base({
        _$$paper: null,
        _$$paperItems: [],
        _option: null,
        _eventInfo: [],
        create: function (paper, eventBus, option) {
            var instance = Object.create(this);
            instance.__base(eventBus, []);
            instance._option = option;
            instance._$$paper = paper;
            return instance;
        },
        bindDomEvent: function () {
            this._domEvents();
            //var refractionOffset = $(this._$$paper.node).closest('div').offset();
            $(this._$$paper.node).on(' lrTap  mousedown  mouseup mousemove mouseleave touchstart touchmove touchend touchcancel', this._domEvents);

            // this.startX = refractionOffset.left;
            // this.startY = refractionOffset.top;
            // this.endX = this.startX + $(this._$$paper.node).closest('div').width();
            // this.endY = this.startY + $(this._$$paper.node).closest('div').height();
           // console.log('startX='+this.startX+', endX='+this.endX+', startY='+this.startY+', endY='+this.endY);

            //$(this._$$paper.node).closest('.refraction_main').on(' lrTap  mousedown  mouseup mousemove mouseleave touchstart touchmove touchend touchcancel', this._domEvents);
        },
        _getEventInfo: function (e) {
            var eventInfo = [];
            e = e.originalEvent || e;
            var $target = $(e.srcElement);
            if (!$target.hasClass('_lr_event')) {
                $target = $target.closest('._lr_event');
            }
            while ($target.length > 0) {
                eventInfo.push({
                    uuid: $target.data('event-identifier'),
                    eventType: $target.data('event-type'),
                    triggerBlur: $target.data('event-triggerblur')
                });
                if ($target.data('event-stoppropagation') === false || $target.data('event-stoppropagation') === 'false') {
                    var parent = $target.parent();
                    if (parent.hasClass('_lr_event')) {
                        $target = parent;
                    } else {
                        $target = parent.closest('._lr_event');
                    }
                } else {
                    break;
                }
            }
            return eventInfo;
        },
        _initEventInfo: function (e) {
            this._eventInfo = this._getEventInfo(e);
        },
        _clearEventInfo: function (e) {
            this._eventInfo = null;
        },
        _events: function (e) {
            var that = this;
            var type = e.mType;
            if (type !== 'move') {
             //   Logger.debug('domevent-self', type);
            }

            //交给各自职责的事件处理
            switch (e.mType) {
                case 'lrTap':
                    this._initEventInfo(e);
                    if (this._eventInfo == null || this._eventInfo.length <= 0) {
                        this.__triggerEvent(EventKey.Blur);
                    } else {
                        //只触发第一个
                        if (this._eventInfo[0].triggerBlur) {
                            this.__triggerEvent(EventKey.Blur, this._eventInfo[0].uuid);
                        }
                    }
                    break;
                case 'down':
                    this._initEventInfo(e);
                    break;
                case 'beforemove':
                    break;
                case 'move':
                    break;
                case 'aftermove':
                    break;
                //case 'up':
                //    this._clearEventInfo(e);
                //    break;
            }

            if (this._eventInfo) {

                this._eventInfo.forEach(function (info) {
                    if (info.eventType.indexOf(type) > -1) {
                        that.__triggerEvent(info.uuid, type, info.uuid, {
                            moveAbs: e.mMoveAbs,
                            currentPos: e.mCurrentPos,
                            lastPos: e.mLastPos
                        });
                    }
                })

            }


            //交给各自职责的事件处理
            switch (e.mType) {
                case 'up':
                    this._clearEventInfo(e);
                    break;
            }
        },
        _domEvents: function () {
            var that = this;
            var _downTrigger = false;
            var _touchTrigger = false;
            var _moveTrigger = false;
            var _startTime = 0;
            var _startPos = {};
            var _moveLastPos = {};

            var __domEvents = function (e) {
                if (that._option.lock) {
                    return;
                }
                var type = e.type || '';
                if (type !== 'mousemove' && type !== 'touchmove') {
                //    Logger.debug('domevent-original', type);
                }

                switch (type) {
                    case 'mousedown':
                    case 'touchstart':
                        _startTime = new Date().getTime();
                        if (type === 'mousedown') {
                            _startPos = EventUtils.getPagePos(e);
                        }

                        _downTrigger = true;
                        _moveTrigger = false;
                        if (type === 'touchstart') {
                            _touchTrigger = true;
                        }
                        e.mType = 'down';
                        var svgBound = $(that._$$paper.node)[0].getBoundingClientRect();
                        that.startX = svgBound.left; 
                        that.endX = svgBound.right; 
                        that.startY = svgBound.top; 
                        that.endY = svgBound.bottom;
                    
                        break;
                    case 'mousemove':
                    case 'touchmove':
                        if (!_downTrigger) {
                            return;
                        }
                        //缩放时不处理move事件
                        e.preventDefault();
                        var p = EventUtils.getPagePos(e);

                        e.mLastPos = _moveLastPos;
                        e.mCurrentPos = p;
                        var x = p.x - _moveLastPos.x;
                        var y = p.y - _moveLastPos.y;
                        e.mMoveAbs = {
                            x: x,
                            y: y
                        };

                        e.mxj = parseFloat(_moveLastPos.x * p.y) - parseFloat(p.x * _moveLastPos.y);//叉积
                        if (x !== 0 || y !== 0) {
                            if (!_moveTrigger) {
                                e.mType = 'beforemove';
                                that._events(e);
                            }
                            e.mType = 'move';
                            _moveTrigger = true;
                        }
                        /**
                         * 判断 当前点是否超过refraction_main区域
                         */
                        // if(type === 'touchmove'){
                        //     console.log("p.x = "+p.x + "; p.y = "+p.y);
                        if(p.x <= that.startX || p.x >= that.endX || p.y <= that.startY || p.y >= that.endY){
                            $(that._$$paper.node).closest('.refraction_main').trigger('mouseup');
                            $(that._$$paper.node).closest('.refraction_main').trigger('touchend');
                            return;
                        }
                        //  }
                        break;
                    case 'touchend':
                    case 'touchcancel':
                    case 'mouseup':
                    case 'mouseleave':
                        if (_moveTrigger) {
                            e.mType = 'aftermove';
                            that._events(e);
                        }
                        e.mMoveTrigger = _moveTrigger;
                        _moveTrigger = false;
                        _downTrigger = false;

                        e.mType = 'up';
                        break;
                    case 'lrTap':
                        e.mType = type;

                        //是否有touch事件触发
                        if (e.tapEventSource === 'touchclick' || (e.tapEventSource === 'mouseclick' && _touchTrigger)) {
                            e.mTouchTrigger = true;
                        } else {
                            e.mTouchTrigger = false;
                        }
                        _touchTrigger = false;
                        //修复点击事件，超过时间和坐标不触发点击事件
                        if (e.tapEventSource === 'mouseclick') {
                            var fixed = EventUtils.fixPcClick(_startPos, EventUtils.getPagePos(e), _startTime, new Date().getTime());
                            if (!fixed) {
                                return;
                            }
                        }
                        break;
                    default:
                        e.mType = type;
                        break;
                }
                that._events(e);

                //保存最后一次移动的位置
                if (EventUtils.isMove(type) || EventUtils.isDown(type)) {
                    _moveLastPos = EventUtils.getPagePos(e);
                }
            };
            that._domEvents = __domEvents;
        }
    });

    /**
     * 添加事件
     * @param dom
     * @param domEvent 要添加的事件名称组数
     * @param identifier dom标识符
     */
    DomEvent.addDomEvent = function (dom, domEvent, identifier, stopPropagation, triggerBlur) {
        if (domEvent && domEvent.length > 0) {
            if (typeof stopPropagation === typeof undefined) {
                stopPropagation = true;
            }
            if (typeof triggerBlur === typeof undefined) {
                triggerBlur = true;
            }
            $(dom).attr('class', '_lr_event');
            $(dom).data('event-type', domEvent);
            $(dom).data('event-identifier', identifier);
            $(dom).data('event-stoppropagation', stopPropagation);
            $(dom).data('event-triggerblur', triggerBlur);
        }
    };

    return DomEvent;

});
/**
 * Created by ylf on 2016/7/22.
 */
define('js/refractor/btn', ['js/base/Base', 'js/utils/string', 'js/utils/utils', 'js/config/eventKey', 'js/utils/view'], function (Base, String, Utils, EventKey, View) {

    var ForeignView = require('js/view/foreignview');
    var Svg = require('js/utils/svg');
    var DomEvent = require('js/reflector/domEvent');
    var LineStyle = require('js/config/style').LineStyle;

    var Btn = Base({
        _fwRotate: null,
        _id: '',
        _lineUuid: '',
        _refractorMain: null,
        create: function (eventBus, refractorMain) {
            var instance = Object.create(this);
            var eventsInfo = [];
            instance._id = Utils.getUuid();
            instance._refractorMain = refractorMain;
            eventsInfo.push({key: EventKey.MoveBtn, callback: 'moveBtnEventHandler', params: []});
            instance.__base(eventBus, eventsInfo);
            instance.addRotateBtn();
            return instance;
        },
        addRotateBtn: function () {
            //旋转按钮
            var that = this;
            this._fwRotate = ForeignView.create('btn_rotate', LineStyle.btnRotate.width, LineStyle.btnRotate.height);
            this._fwTranslate = ForeignView.create('btn_translate', LineStyle.btnRotate.width, LineStyle.btnRotate.height);
            this._fwRotate.setVisibility(false);
            this._fwTranslate.setVisibility(false);
            //this._fwRotate.setTranslate(-LineStyle.btnRotate.width - 10, (LineStyle.rectHeight - LineStyle.btnRotate.height) / 2);
            var g = new kity.Group();
            this._refractorMain._paper.addShape(g);
            $(g.node).append(this._fwRotate.getView());
            $(g.node).append(this._fwTranslate.getView());
            DomEvent.addDomEvent(this._fwRotate.getView()[0], ['down', 'beforemove', 'move', 'aftermove', 'up'], this._fwRotate.getUuid(), false, false);
            DomEvent.addDomEvent(this._fwTranslate.getView()[0], ['down', 'beforemove', 'move', 'aftermove', 'up'], this._fwTranslate.getUuid(), false, false);
            this.__on(this._fwRotate.getUuid(), function (eventType, uuid, data) {
                if (eventType === 'down') {
                    this._fwRotate.addClass('on');
                } else if (eventType === 'aftermove' || eventType === 'up') {
                    this._fwRotate.removeClass('on');
                    this._fwRotate.getView().blur();
                }
                that.__triggerEvent(EventKey.BtnMove + that._lineUuid, eventType, this._lineUuid, data);
            }, '');
            this.__on(this._fwTranslate.getUuid(), function (eventType, uuid, data) {
                if (eventType === 'down') {
                    this._fwTranslate.addClass('on');
                } else if (eventType === 'aftermove' || eventType === 'up') {
                    this._fwTranslate.removeClass('on');
                }
                that.__triggerEvent(EventKey.BtnMove + that._tranlineUuid, eventType, this._tranlineUuid, data);
            }, '');
        },
        moveBtnEventHandler: function (scale, clientRect, tranClientRect, uuid, tranUuid, visible) {
            this._lineUuid = uuid;
            this._tranlineUuid = tranUuid;
            var pLeft = clientRect.left + clientRect.width / 2;
            var pTop = clientRect.top + clientRect.height / 2;
            var rect = this._fwRotate.getView()[0].getBoundingClientRect();
            var rLeft = rect.left + rect.width / 2;
            var rTop = rect.top + rect.height / 2;

            var transforms = Svg.getAttrTranslate(this._fwRotate.getView().attr('transform'));
            //pos 针对于整个page的位置
            if (transforms && transforms.length == 2) {
                this._fwRotate.setTranslate(transforms[0] + (pLeft - rLeft) / scale, transforms[1] + (pTop - rTop) / scale);
            } else {
                this._fwRotate.setTranslate((pLeft - rLeft) / scale, (pTop - rTop) / scale);
            }


            var tpLeft = tranClientRect.left + tranClientRect.width / 2;
            var tpTop = tranClientRect.top + tranClientRect.height / 2;
            var rect = this._fwTranslate.getView()[0].getBoundingClientRect();
            var trLeft = rect.left + rect.width / 2;
            var trTop = rect.top + rect.height / 2;

            var transforms = Svg.getAttrTranslate(this._fwTranslate.getView().attr('transform'));
            //pos 针对于整个page的位置
            if (transforms && transforms.length == 2) {
                this._fwTranslate.setTranslate(transforms[0] + (tpLeft - trLeft) / scale, transforms[1] + (tpTop - trTop) / scale);
            } else {
                this._fwTranslate.setTranslate((tpLeft - trLeft) / scale, (tpTop - trTop) / scale);
            }

            if (visible != undefined) {
                this._fwRotate.setVisibility(visible);
                this._fwTranslate.setVisibility(visible);
            }
        }
    });


    return Btn;

});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/refractor/LightComplexArrayRef', ['js/base/base', 'js/utils/utils'], function (Base, Utils) {

    //view
    var LightComplex = require('js/refractor/LightComplexRef/main');
    var LightLine = require('js/view/LightLine');

    var LightComplexArray = Base({
        _lightArray: [],
        _lightEnable: [],
        _lightDrawBefore: [],
        _chainMode: false,//点之间是否是链式的调用
        _currentHighZIndex: 0,//处在高位的索引值
        create: function (eventBus, config, option, onLineMove, onLightTrans,onLightFocusBlur, chainMode) {
            var instance = Object.create(this);
            instance._uuid = Utils.getUuid();
            //事件绑定
            instance.__base(eventBus, []);
            instance._config = config;
            instance._lightArray = [];
            instance._lightDrawBefore = [];
            instance._lightEnable = [];
            instance._chainMode = chainMode || false;
            instance.createView(onLineMove, onLightTrans, onLightFocusBlur, option);
            instance.initZIndexEvent();
            return instance;
        },
        createView: function (onLineMove, onLightTrans, onLightFocusBlur, option) {
            var that = this;
            this._config.forEach(function (config, i) {
                var lightComplex = LightComplex.create(that.__getEventBus(), config, onLineMove, onLightTrans,onLightFocusBlur, option);
                that._lightArray.push(lightComplex);
                lightComplex.setVisibility(config.Visible);
                //that._lightEnable[i] = config.Visible;
                //that._lightDrawBefore[i] = config.Visible;
                that._lightEnable[i] = true;
                that._lightDrawBefore[i] = true;
            });
        },
        appendToView: function ($$container) {
            this.each(function () {
                $$container.addShape(this.getView());
            });
        },
        prependToView: function ($$container) {
            this.each(function () {
                $$container.prependItem(this.getView());
            });
        },
        gtIndexAppendToView: function ($$container) {
            this.each(function () {
                this.gtIndexAppendToView($$container);
            });
        },
        each: function (callBack, index) {
            var that = this;
            this._lightArray.forEach(function (lightComplex, i) {
                var call = true;
                if (that.indexValidate(index)) {
                    call = index === i;
                }
                if (call) {
                    callBack.apply(lightComplex, [i]);
                }
            })
        },
        indexValidate: function (index) {
            return typeof index !== typeof  undefined && index < this._lightArray.length;
        },
        getCommandLength: function (index) {
            return this._lightArray[index || 0].getCommandLength();
        },
        pushDrawCommand: function (command, hasDrawCommand, index) {
            this.each(function (i) {
                this.pushDrawCommand(command, hasDrawCommand);
            }, index);
        },
        setPedalDrawIndex: function (pedalIndex, index) {
            this.each(function (i) {
                this.setPedalDrawIndex(pedalIndex);
            }, index);
        },
        setDrawIndex: function (drawIndex, index) {
            this.each(function (i) {
                this.setDrawIndex(drawIndex);
            }, index);
        },
        resetAngle: function (surfaceAngle, init, index) {
            this.each(function (i) {
                this.resetAngle(surfaceAngle, init);
            }, index);
        },
        changeChainLineCommonFill: function () {
            if (!this._chainMode) {
                return;
            }
            var that = this;
            this.each(function (i) {
                var hasNext = true;
                if ((i + 1) >= that._lightArray.length) {
                    hasNext = false
                }
                if (hasNext) {
                    if (i === 0) {
                        this.setRefractionLineCommonFill(that.isEnableAndDraw(i + 1));
                    } else {
                        this.setIncidenceLineCommonFill(that.isEnableAndDraw(i - 1));
                        this.setRefractionLineCommonFill(that.isEnableAndDraw(i + 1));
                    }
                } else {
                    //更新入射光线
                    if (i !== 0) {
                        this.setIncidenceLineCommonFill(that.isEnableAndDraw(i));
                    }
                }

            })

        },
        drawAll: function (index) {
            var that = this;
            this.each(function (i) {
                if (that.hasNextEnable(i)) {
                    that._lightArray[i + 1].setVisibility(true);
                    that._lightDrawBefore[i + 1] = true;
                }

                this.drawAll();
            }, index);

        //    that.changeChainLineCommonFill();
        },
        drawNext: function (index) {
            var that = this;
            var hasCall = false;
            this.each(function (i) {
                if (this.hasNext() && !hasCall&&that._lightEnable[i]===true) {
                    hasCall = true;
                    this.drawNext();
                }
                if (!hasCall && that.hasNextEnable(i)) {
                    hasCall = true;
                    that._lightArray[i + 1].setVisibility(true);
                    that._lightDrawBefore[i + 1] = true;
                }
            }, index);
      //      that.changeChainLineCommonFill();
        },
        //是否有可用的没有显示
        hasNextEnable: function (i) {
            var that = this;
            if (i + 1 < that._lightArray.length) {
                //可用但是未显示
                if (that._lightEnable[i + 1] === true && that._lightArray[i + 1].isVisibilityHidden()) {
                    return true;
                }
            }
            return false;
        },
        //是否有动画未绘制
        hasDrawNext: function (index) {
            var hasNext = false;
            var that = this;
            this.each(function (i) {
                if (!hasNext) {
                    hasNext = this.hasNext();
                }
            }, index);
            return hasNext;
        },
        hasNext: function (index) {
            var hasNext = false;
            var that = this;
            this.each(function (i) {
                if (!hasNext) {
                    hasNext = this.hasNext();
                }
                if (!hasNext) {
                    hasNext = that.hasNextEnable(i);
                }
            }, index);
            return hasNext;
        },
        setAllEnable: function (enable) {
            var that = this;
            this.each(function (i) {
                that._lightEnable[i] = enable;
                if (!enable) {
                    this.setVisibility(false);
                }
                //之前绘制过，且可用，则直接显示出来
                if (that._lightDrawBefore[i] && that._lightEnable[i]) {
                    this.setVisibility(true);
                }
            })
        },
        //setDrawStatus:function(index, hasDraw){
        //    this._lightDrawBefore[index]=hasDraw;
        //},
        setEnable: function (index, enable) {
            this._lightEnable[index] = enable;
            //之前绘制过，且可用，则直接显示出来
            if (this._lightDrawBefore[index] && this._lightEnable[index]) {
                this._lightArray[index].setVisibility(true);
            }
            //不可用直接隐藏
            if (enable === false) {
                this._lightArray[index].setVisibility(false);
            }
            this.__triggerEvent('insidechange', 'enablechange');
        },
        setSectorEnable: function (enable) {
            this.each(function () {
                this.setSectorEnable(enable);
            })
        },
        //是否可用，且绘制过
        isEnableAndDraw: function (index) {
            return this._lightEnable[index] && this._lightDrawBefore[index];
        },
        getData: function (index) {
            var data = {
                LightComplex: []
            };
            this.each(function () {
                data.LightComplex.push(this.getData());
            }, index);
            return data;
        },
        rotateAble: function (angle, surfaceMove) {
            var that = this;
            var flag = true;
            this.each(function (i) {
                if (flag) {
                    angle = surfaceMove && that._config[i].IncidenceLine.rotateFixed ? -angle : angle;
                    flag = this.complexRotateAble(angle);
                }
            });
            return flag;
        },
        around: function (surfaceAngle, surfaceRotatePosX) {
            var that = this;
            this.each(function (i) {
                this.around(surfaceAngle, surfaceRotatePosX);
            });
        },
        adsorptionPedal: function () {
            this.each(function () {
                this.adsorptionPedal();
            });
        },
        isPedalExcludeDisable: function (index) {
            var isPedal = true;
            this.each(function () {
                if (!this.isVisibilityHidden()) {
                    if (isPedal) {
                        isPedal = this.isPedal();
                    }
                }
            }, index);
            return isPedal;
        },
        isPedal: function (index) {
            var isPedal = true;
            this.each(function () {
                if (isPedal) {
                    isPedal = this.isPedal();
                }
            }, index);
            return isPedal;
        },
        initZIndexEvent: function () {
            var that = this;
            this.each(function (i) {
                var lightComplex = this;
                //i变量做为参数，防止闭包问题
                (function (i) {
                    lightComplex.setViewTapListener(function () {
                        that._currentHighZIndex = i;
                        that.each(function (j) {
                            this.changeTransparent(i === j);
                        })
                    });
                })(i);
            })
        },
        getCurrentHighZIndex: function () {
            return this._currentHighZIndex;
        },
        showFirstIndex: function () {
            var that = this;
            this.each(function (i) {
                this.changeTransparent(i === 0);
            })
        },
        setIncidenceNameEnable: function (nameEnable) {
            this.each(function (i) {
                this.setIncidenceNameEnable(nameEnable);
            })
        },
        setIncidenceNameVisible: function (visible) {
            this.each(function (i) {
                this.setIncidenceNameVisible(visible);
            });
        },
        get: function (index) {
            return this._lightArray[index];
        },
        getDrawBegin: function () {
            return this._lightArray[0].getDrawBegin();
        },
        setNameVisible: function (visible) {
            this.each(function () {
                this.setNameVisible(visible);
            })
        },
        setLinePedalChangeLock: function (lock) {
            this.each(function (i) {
                this.setLinePedalChangeLock(lock);
            })
        },
        getCount: function () {
            return this._lightArray.length;
        },
        /**
         * 场景4,5用
         */
        drawAllNext: function (cb) {
            this.each(function () {
                if (this.hasNext()) {
                    this.drawNext(cb);
                }
            });
        },
        /**
         * 场景4,5用
         */
        drawAllAll: function (cb) {
            var that = this;
            this.each(function (i) {
                if (that.hasNextEnable(i)) {
                    that._lightArray[i + 1].setVisibility(true);
                    that._lightDrawBefore[i + 1] = true;
                }

                this.drawAll(cb);
            });

            //    that.changeChainLineCommonFill();
        },
        getFirRefAngle: function(){
            return this._lightArray[0].getRefAngle();
        },
        getFirIncidenceAngle: function(){
            return this._lightArray[0].getIncidenceLineXAngle();
        },
        /**
         * 获取虚拟成像已经画了木有
         */
        getHasdrawMaterialObjectImagingGroup4: function(){
            return this._lightArray[0].getHasdrawMaterialObjectImagingGroup4();
        },
        getHasdrawMaterialObjectImagingGroup5: function(){
            return this._lightArray[0].getHasdrawMaterialObjectImagingGroup5();
        }
    });

    return LightComplexArray;

});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/refractor/refractor1', ['js/reflector/baseReflector', 'js/utils/utils', 'js/utils/graphMath', 'js/utils/svg'], function (BaseReflector, Utils, GraphMath, Svg) {

    //view
    var Surface = require('js/view/surface');
    var LightComplexArray = require('js/refractor/LightComplexArrayRef');
    var EqualAngleName = require('js/view/EqualAngleName');
    var ForeignView = require('js/view/ForeignView');
    var EventKey = require('js/config/eventKey');

    var Refractor = BaseReflector({
        _CONFIG: {
            LightComplex: [
                {
                    //refractivity1: 3,
                    //refractivity2: 4,
                    IncidenceLine: {
                       // width: 250,//整体长度
                       // arrowPos: 110,//箭号所在位置
                        defaultAngle: 45, rotateFixed: true, clickAble: true, rotateFixedAfterDraw: true
                    },
                    RefractionLine: {
                        visible: false, rotateFixed: true, clickAble: false,
                       // width: 250,
                      //  arrowPos: 110,
                        PedalWidth: 290
                    },
                    NormalLine: {lineVisible: false, pointNameVisible: false},
                    Sector: {sectorInVisible: false, sectorOutVisible: false, incidenceVisible: false, refractionVisible: false},
                    IncidencePosX: 1420 / 2,//入射点位置
                    IncidencePosY: 432,
                    //DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    DrawIndex: [[0, 1, 3], [4, 5, 6], [7, 11], [8]],
                    //PedalDrawIndex: [[0, 1], [5, 6], [10]],
                    PedalDrawIndex: [[1 ,5, 6,8, 10]],
                    NoRefracDrawIndex:[],
                    Visible: true,
                    Lines: [
                        //第一次设置
                        //{aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 120, y: 435},{x: 1300, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true}
                        //修改需求
                        {aPoint: {x: 20, y: 435}, bPoint: {x: 1400, y: 435}, degree: 0, range: [{x: 1420/2, y: 435},{x: 1420/2, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true, pedalLineAngle: 90}
                        //{aPoint: {x: 0, y: 435 - 200}, bPoint: {x: 0, y: 396+435}, degree: 90, range: [{x: 0, y: 435},{x: 0, y: 396+435}], refractivity1: 1, refractivity2: 1.333, transAble: false},
                        //{aPoint: {x: 1422, y: 435 - 200}, bPoint: {x: 1420, y: 435+396}, degree: 90, range: [{x: 1420, y: 435},{x: 1420, y: 435+396}], refractivity1: 1, refractivity2: 1.333, transAble: false}
                    ],
                    _curLineIndex: 0
                }],
            Surface: {
                width: 1420,
                defaultAngle: 0,
                rotatePosX: 1420 / 2,//旋转位置
                rotatePosY: 4,//旋转位置
                visible: false,
                clickAble: true,
                type: Surface.Type.tl
	    },
            ForeignSurf: {
                cls: "bg_water",
                width: 1420,
                height: 396,
                translateX: 0,
                translateY: 435

            }
        },
        _TYPE: 1,
        _Event: [],
        _event: null,
        _$$container: null,
        _incidencePointPos: null,
        _surfacePagePos: null,
        _option: null,
        _equalAngleNameHasShowBefore: false,
        resetState: false,
        create: function (eventBus, $$container, option, data) {
            var instance = Object.create(this);
            instance._uuid = Utils.getUuid();
            instance._event = $.extend(true, [], this._Event);
            instance.initEvent();
            //事件绑定
            instance.__base(eventBus, instance._event);

            instance.__proxyAll(['onSurfaceMove', 'onLineMove', 'onLineTrans','onLightFocusBlur','nameVisibleHandler']);//绑定this指针
            instance._$$container = $$container;
            instance._config = $.extend(true, {}, this._CONFIG, (data && data.configData) || {});
            instance._option = option;
            instance.createView();
            instance.afterCreateView();
            instance.initExtrasDrawCommand();
            instance.resetState = data && data.resetState? data.resetState: this.resetState;//是否可重置
            return instance;
        },
        initEvent: function () {
            //TODO:交由基类处理
        },
        createView: function () {
            var that = this;
            //反射面
            this._surface = Surface.create(this.__getEventBus(), this._config.Surface, this.onSurfaceMove, this._option.langData);

            this._lightComplexArray = LightComplexArray.create(this.__getEventBus(), this._config.LightComplex, this._option, this.onLineMove, this.onLineTrans, this.onLightFocusBlur);
            this._lightComplexArray.appendToView(this._$$container);

            this._equalAngleName = EqualAngleName.create(this._option.langData);

            /**
             * 用于定位介质文字 多语言问题
             */
            var bgLeft = this._config.ForeignSurf.translateX, bgRight = bgLeft + this._config.ForeignSurf.width, bgTop = this._config.ForeignSurf.translateY, bgBottom = bgTop + this._config.ForeignSurf.height;

            var langData = that._option.langData;
            var airTextCon = langData.refraction_air || '空气';
            var textCon = langData.refraction_water || '水';

            //空气
            var airG = new kity.Group();
            //airG.setTranslate(1180,170);

            var airText =  new kity.Text().setContent(airTextCon).setAttr('x', 0).setAttr('y', 40).addClass("svg_text_l").addClass("color_black");

            airG.addShape(airText);
            this._$$container.prependItem(airG);
            var airTextWidth = $(airText.node).width();
            airG.setTranslate(1180 + 170- airTextWidth ,170);
            //水和水面
            this._foreignSurf = new kity.Group();
            var foreignline1 = new kity.Path("M 0 0 L 1420 0");
          //  var foreignline2 = new kity.Path("M 120 0 L 1300 0 ");
            foreignline1.setStyle({"stroke-width": 4, "stroke": "#898989"});
          //  foreignline2.setStyle({"stroke-width": 4, "stroke": "#2383cc"});
            this.lineG = new kity.Group();
            this.lineG.addClass("hide_dom");
            this.lineG.addShape(foreignline1);
            //this.lineG.addShape(foreignline2);
            var foreignBg = ForeignView.create(this._config.ForeignSurf.cls, this._config.ForeignSurf.width, this._config.ForeignSurf.height);
            this._foreignSurf.addShape(this.lineG);
            $(this._foreignSurf.node).prepend(foreignBg.getView());
            //var text = new kity.Text().setContent(text).setAttr('x', 1200).setAttr('y', 146).addClass("svg_text_l").addClass("color_white");
            var text = new kity.Text().setContent(textCon);
            text.addClass("svg_text_l").addClass("color_white");
            this._foreignSurf.addShape(text);
            this._$$container.prependItem(this._foreignSurf);
            var textWidth = $(text.node).width();
            text.setAttr('x', 1200 + 100  - textWidth).setAttr('y', 146);

            this._foreignSurf.setTranslate(this._config.ForeignSurf.translateX, this._config.ForeignSurf.translateY);

            this._$$container.addShape(this._surface.getView());
            this._$$container.addShape(this._equalAngleName.getView());
            this._lightComplexArray.gtIndexAppendToView(this._$$container);

            this._surface.setTranslate(0, this._config.LightComplex[0].IncidencePosY);
            this._surface.setNameVisible(this._option.nameVisible);
            if (this._config.EqualAngleName) {
                that._equalAngleNameHasShowBefore = this._config.EqualAngleName.visible;
                this._equalAngleName.setVisibility(this._config.EqualAngleName.visible);
            } else {
                this._equalAngleName.setVisibility(false);
            }
       //     this.resetAngle(this._config.Surface.defaultAngle, true);
            this.resetAngle(this._config.LightComplex[0].Lines[this._config.LightComplex[0]._curLineIndex].degree, true);

            //从新初始化坐标位置
            //this.toCenter();
            this.initEqualAngleNamePos();
        },
        initExtrasDrawCommand: function () {
            //交由基类处理
            //var that = this;
            //var length = this._lightComplexArray.getCommandLength();
            //this._lightComplexArray.pushDrawCommand(function (deffer) {
            //    if (that._lightComplexArray.isPedal()) {
            //        that._equalAngleNameHasShowBefore = true;
            //        that._equalAngleName.setVisibility(true);
            //    }
            //    deffer.resolve();
            //}, function () {
            //    if (!that._lightComplexArray.isPedal()) {
            //        return true;
            //    }
            //    if (!that._equalAngleName.isVisibilityHidden()) {
            //        return true;
            //    }
            //    return that._equalAngleNameHasShowBefore;
            //});
            //var pedalIndex = $.extend(true, [], this._config.LightComplex[0].PedalDrawIndex);
            //pedalIndex.splice(2, 0, length);
            //this._lightComplexArray.setPedalDrawIndex(pedalIndex);
        },
        afterCreateView: function () {
            //TODO:交由子类覆盖
        },
        initEqualAngleNamePos: function () {
            //布局角度
            var parentTranslate = this._$$container.getTransform().m;
            var width = this._equalAngleName.getView().getWidth();
            var height = this._equalAngleName.getView().getHeight();
            this._equalAngleName.setTranslate(this._option.viewPortWidth - parentTranslate.e - width - 135, -( this._option.viewPortHeight - parentTranslate.f - height ) + 20);
        },
        toCenter: function () {
            this._$$container.setTranslate(this._option.viewPortWidth / 2 - this.getWidth() / 2, this._option.viewPortHeight / 2 + 10);
        },
        resetAngle: function (angle, init) {
            this._surface.rotate(angle);
            var surfaceAngle = this._surface.getRotateAngle() || 0;
            this._lightComplexArray.resetAngle(surfaceAngle, init);
        },
        getData: function () {
            var data = {};
            data.type = this._TYPE;
            data.configData = this._lightComplexArray.getData();
            data.configData.Surface = {
                defaultAngle: this._surface.getRotateAngle(),
                visible: !this._surface.isVisibilityHidden()
            };
            data.configData.EqualAngleName = {
                visible: !this._equalAngleName.isVisibilityHidden()
            };
            data.resetState = this.resetState;
            return data;
        },
        getMoveRotateAngle: function (data) {
            var currentPos = data.currentPos;
            var lastPos = data.lastPos;
            return GraphMath.getRotateAngle(this._surface.getRotateOffsetPos(), lastPos, currentPos);
        },
        onSurfaceMove: function (data, eventType) {
            if (eventType === 'move') {
                var angle = this.getMoveRotateAngle(data);
                if (this._lightComplexArray.rotateAble(angle)) {
                    this.resetAngle(angle);
                    this._lightComplexArray.around(this._surface.getRotateAngle(), this._config.Surface.rotatePosX);
                }
            } else if (eventType === 'aftermove') {
                this._lightComplexArray.adsorptionPedal();
            }
            this.initEqualAngleVisibility();
            this.resetState = true;
        },
        onLineMove: function (uuid, angle, curLineIndex) {
            this.resetState = true;
            this.initEqualAngleVisibility();
            this.afterLineMove(curLineIndex);

        },
        onLineTrans: function (uuid, x, y, curLineIndex){
            this.resetState = true;
            this.afterLineMove(curLineIndex);

        },
        onLightFocusBlur: function(type){
            if(this.lineG){
                if(type == "focus"){
                    this.lineG.removeClass("hide_dom");
                }else{
                    this.lineG.addClass("hide_dom");
                }
            }
        },
        afterLineMove: function (curLineIndex) {
            var lightComplex0 = this._lightComplexArray.get(0);

            var incidTran = Svg.getAttrTranslate($(lightComplex0._$$incidencePoint.node).attr('transform'));
            var refractAPos1 = {x: incidTran[0], y: incidTran[1]};
            var lines = this._config.LightComplex[0].Lines;
            var lineIn = curLineIndex? curLineIndex: 0;
            //重置入射线的长度
            var incidenceAngle1 = lightComplex0.getIncidenceRotateAngle();
            var incidenceLine0 = {degree: incidenceAngle1,  aPoint: refractAPos1};
            if(lineIn >= 0){
                var result0 = GraphMath.pointInLine(incidenceLine0, lines, lineIn);
                var initIncidW = lightComplex0._configData.IncidenceLine.width;
                if(result0){
                    var incidW0 = GraphMath.getTwoPointDistance(result0.acrossPoint, refractAPos1);
                    if(incidW0 < initIncidW){
                        lightComplex0.setIncidenceLineWidth(incidW0);
                    }else{
                        lightComplex0.setIncidenceLineWidth(initIncidW);
                    }
                }else{
                    lightComplex0.setIncidenceLineWidth(initIncidW);
                }
            }

            var refractAngle1 = lightComplex0.getRefractionRotateAngle();
            var refractLine1 = {degree: refractAngle1, aPoint: refractAPos1};
            if (lineIn >= 0) {
                var result = GraphMath.pointInLine(refractLine1, lines, lineIn);
                var initRefracLineW = lightComplex0._configData.RefractionLine.width;
                if (result) {
                    var incidentPoint2 = result.acrossPoint;
                    var lineIn2 = result.index;
                    var refracWidth = GraphMath.getTwoPointDistance(refractAPos1, incidentPoint2);

                    //第一个场景
                    if(refracWidth > initRefracLineW){
                        lightComplex0.setRefractionLineWidth(initRefracLineW);
                    }else {
                        lightComplex0.setRefractionLineWidth(refracWidth);
                    }

                } else {
                    //var curRefracLineW = lightComplex0.getRefractionLineWidth();
                    //if(curRefracLineW > initRefracLineW){
                    //    lightComplex0.setRefractionLineWidth(initRefracLineW);
                    //}
                    lightComplex0.setRefractionLineWidth(initRefracLineW);
                }
            }
        },
        initEqualAngleVisibility: function () {
            //非垂足重置为不可见
            if (this._lightComplexArray.isPedal()) {
                if (this._equalAngleNameHasShowBefore || this._lightComplexArray.get(0).getTwoLineVisible()) {
                    this._equalAngleName.setVisibility(true);
                }
            } else {
                this._equalAngleName.setVisibility(false);
            }
        },
        getWidth: function () {
            return this._config.Surface.width;
        },
        drawAll: function () {
            this.resetState = true;
            this._lightComplexArray.drawAll();
        },
        drawNext: function () {
            this.resetState = true;
            this._lightComplexArray.drawNext();
        },
        setResetState: function(state){
            this.resetState = state;
        }
    });

    Refractor.Extend = function (cls) {
        return Object.create(Refractor).__include(cls);
    };
    return Refractor;

});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/refractor/refractor2', ['js/refractor/refractor1', 'js/utils/utils', 'js/utils/graphMath', 'js/utils/svg'], function (Refractor1, Utils, GraphMath, Svg) {

    //view
    var Surface = require('js/view/surface');
    var LightComplexArray = require('js/refractor/LightComplexArrayRef');
    var EqualAngleName = require('js/view/EqualAngleName');
    var ForeignView = require('js/view/ForeignView');
    var EventKey = require('js/config/eventKey');
    var Sector = require('js/view/sector');//为了隐藏全放射状态的折射线引入的，加入全反射后可以删掉

    var Refractor = Refractor1.Extend({
        _CONFIG: {
            LightComplex: [
                {
                    //refractivity1: 1,
                    //refractivity2: 1.5,
                    IncidenceLine: {defaultAngle: 45, rotateFixed: true, clickAble: true},
                    //ReflectionLine: {
                    //    visible: false,
                    //    rotateFixed: false,
                    //    clickAble: false
                    //},
                    RefractionLine: {visible: false, rotateFixed: true, clickAble: false},
                    NormalLine: {lineVisible: false, pointNameVisible: false},
                    Sector: {sectorInVisible: false, sectorOutVisible: false, incidenceVisible: false, reflectionVisible: false, refractionVisible: false},
                    //第一次
                    //IncidencePosX: 716,//入射点位置
                    //IncidencePosY: 316,
                    //第二次
                    IncidencePosX: 420 + 764/2,//入射点位置
                    IncidencePosY: 313,
                    //IncidencePosX: 420,//入射点位置
                    //IncidencePosY: 316+ 309/2,
                    //DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    DrawIndex: [[0, 1, 3], [4, 5, 6], [7, 11], [8]],
                    PedalDrawIndex: [[1 ,5, 6,8, 10]],
                    NoRefracDrawIndex:[],
                    Visible: true,
                    Lines: [
                        //第一次修改
                        //{aPoint: {x: 420, y: 316}, bPoint: {x: 1184, y: 316}, degree: 0, range: [{x: 32+420, y: 0+316}, {x: 731+420, y: 0+316}], refractivity1: 1, refractivity2: 1.5, transAble: true},
                        //{aPoint: {x: 420, y: 625}, bPoint: {x: 1184, y: 625}, degree: 0, range: [{x: 32+420, y: 625}, {x: 731+420, y: 309+316}], refractivity1: 1.5, refractivity2: 1, transAble: true},
                        //{aPoint: {x: 420, y: 316}, bPoint: {x: 420, y: 625}, degree: 90, range: [{x: 0+420, y: 32+316}, {x: 0+420, y: 281+316}], refractivity1: 1.5, refractivity2: 1, transAble: true},
                        //{aPoint: {x: 1184, y: 316}, bPoint: {x: 1184, y: 625}, degree: 90, range: [{x: 1184, y: 32+316}, {x: 1184, y: 281+316}], refractivity1: 1, refractivity2: 1.5, transAble: true}
                        //第二次修改
                        //{aPoint: {x: 420, y: 316}, bPoint: {x: 1184, y: 316}, degree: 0, range: [{x: 120+420, y: 0+316}, {x: 641+420, y: 0+316}], refractivity1: 1, refractivity2: 1.5, transAble: true},
                        //{aPoint: {x: 420, y: 625}, bPoint: {x: 1184, y: 625}, degree: 0, range: [{x: 120+420, y: 625}, {x: 641+420, y: 625}], refractivity1: 1.5, refractivity2: 1, transAble: true},
                        //{aPoint: {x: 420, y: 316}, bPoint: {x: 420, y: 625}, degree: 90, range: [{x: 0+420, y: 120+316}, {x: 0+420, y: 189+316}], refractivity1: 1.5, refractivity2: 1, transAble: true},
                        //{aPoint: {x: 1184, y: 316}, bPoint: {x: 1184, y: 625}, degree: 90, range: [{x: 1184, y: 120+316}, {x: 1184, y: 189+316}], refractivity1: 1, refractivity2: 1.5, transAble: true}
                        //第三次修改
                        {aPoint: {x: 420, y: 316}, bPoint: {x: 1184, y: 316}, degree: 0, range: [{x: 420 + 764/2, y: 0+316}, {x: 420 + 764/2, y: 0+316}], refractivity1: 1, refractivity2: 1.5, transAble: true, pedalLineAngle: 90},
                        {aPoint: {x: 420, y: 625}, bPoint: {x: 1184, y: 625}, degree: 0, range: [{x: 420 + 764/2, y: 625}, {x: 420 + 764/2, y: 625}], refractivity1: 1.5, refractivity2: 1, transAble: true, pedalLineAngle: 90},
                        {aPoint: {x: 420, y: 316}, bPoint: {x: 420, y: 625}, degree: 90, range: [{x: 0+420, y: 316+ 309/2}, {x: 0+420, y: 316+ 309/2}], refractivity1: 1.5, refractivity2: 1, transAble: true, pedalLineAngle: 90},
                        {aPoint: {x: 1184, y: 316}, bPoint: {x: 1184, y: 625}, degree: 90, range: [{x: 1184, y: 316+ 309/2}, {x: 1184, y: 316+ 309/2}], refractivity1: 1, refractivity2: 1.5, transAble: true, pedalLineAngle: 90}

                    ],
                    _curLineIndex: 0
                },
                {
                    //refractivity1: 1.5,
                    //refractivity2: 1,
                    IncidenceLine: {defaultAngle: 30, rotateFixed: true, clickAble: true, visible: false},
                    //ReflectionLine: {
                    //    visible: false,
                    //    rotateFixed: false,
                    //    clickAble: false
                    //},
                    RefractionLine: {visible: false, rotateFixed: true, clickAble: false,},
                    NormalLine: {lineVisible: false, pointNameVisible: false},
                    Sector: {sectorInVisible: false, sectorOutVisible: false, incidenceVisible: false, reflectionVisible: false, refractionVisible: false},
                    IncidencePosX: 300,//入射点位置
                    IncidencePosY: 200,
                    //DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    DrawIndex: [[0, 1], [4, 5, 6], [7, 11], [8]],
                    PedalDrawIndex: [[1 ,5, 6,8, 10]],
                    NoRefracDrawIndex:[],
		            Visible: true,
                    Lines: [
                        {aPoint: {x: 420, y: 316}, bPoint: {x: 1184, y: 316}, degree: 0, range: [{x: 420 + 764/2, y: 0+316}, {x: 420 + 764/2, y: 0+316}], refractivity1: 1, refractivity2: 1.5, transAble: true, pedalLineAngle: 90},
                        {aPoint: {x: 420, y: 625}, bPoint: {x: 1184, y: 625}, degree: 0, range: [{x: 420 + 764/2, y: 625}, {x: 420 + 764/2, y: 625}], refractivity1: 1.5, refractivity2: 1, transAble: true, pedalLineAngle: 90},
                        {aPoint: {x: 420, y: 316}, bPoint: {x: 420, y: 625}, degree: 90, range: [{x: 0+420, y: 316+ 309/2}, {x: 0+420, y: 316+ 309/2}], refractivity1: 1.5, refractivity2: 1, transAble: true, pedalLineAngle: 90},
                        {aPoint: {x: 1184, y: 316}, bPoint: {x: 1184, y: 625}, degree: 90, range: [{x: 1184, y: 316+ 309/2}, {x: 1184, y: 316+ 309/2}], refractivity1: 1, refractivity2: 1.5, transAble: true, pedalLineAngle: 90}

                    ],
                    _curLineIndex: 0
                }
            ],
            Surface: {width: 764, defaultAngle: 0, rotatePosX: 764/2,rotatePosY: 316, visible: false, clickAble: true, aPoint: {x: 420, y: 316}, bPoint: {x: 1184, y: 316}},

            ForeignSurf: {
                cls: "bg_glassrect",
                width: 905,
                height: 453,
                translateX: 420,
                translateY: 316
            }

        },
        _TYPE: 2,
        resetState: false,
        create: function (eventBus, $$container, option, data) {
            var instance = Object.create(this);
            instance._uuid = Utils.getUuid();
            instance._event = $.extend(true, [], this._Event);
            instance.initEvent();
            //事件绑定
            instance.__base(eventBus, instance._event);

            instance.__proxyAll(['onSurfaceMove', 'onLineMove', 'onLineTrans','onLightFocusBlur','nameVisibleHandler']);//绑定this指针
            instance._$$container = $$container;
            instance._config = $.extend(true, {}, this._CONFIG, (data && data.configData) || {});
            instance._option = option;
            instance.createView();
            instance.afterCreateView();
            instance.initExtrasDrawCommand();
            instance.resetState = data && data.resetState? data.resetState: this.resetState;//是否可重置
            return instance;
        },

        createView: function () {
            var that = this;
            //$('body').on('REFRACTION_HIDE',that.refractionHideHandler.bind(this));
            //$('body').on('REFRACTION_SHOW',that.refractionShowHandler.bind(this));
            //反射面
            this._surface = Surface.create(this.__getEventBus(), this._config.Surface, this.onSurfaceMove, this._option.langData);

            this._lightComplexArray = LightComplexArray.create(this.__getEventBus(), this._config.LightComplex, this._option, this.onLineMove, this.onLineTrans, this.onLightFocusBlur);
            this._lightComplexArray.prependToView(this._$$container);

            this._equalAngleName = EqualAngleName.create(this._option.langData);

            /**
             * 用于定位介质文字 多语言问题
             */
            var bgLeft = this._config.ForeignSurf.translateX, bgRight = bgLeft + this._config.ForeignSurf.width, bgTop = this._config.ForeignSurf.translateY, bgBottom = bgTop + this._config.ForeignSurf.height;

            var langData = that._option.langData;
            var airTextCon = langData.refraction_air || '空气';
            var textCon = langData.refraction_glass || '玻璃';
            //空气
            var airG = new kity.Group();
            //airG.setTranslate(1160,116);
            var airText =  new kity.Text().setContent(airTextCon).setAttr('x', 0).setAttr('y', 40).addClass("svg_text_l").addClass("color_black");
            airG.addShape(airText);
            this._$$container.prependItem(airG);
            var airTextWidth = $(airText.node).width();
            airG.setTranslate(1160+ 170 - airTextWidth ,116);
            //玻璃背景
            this._foreignSurf = new kity.Group();
            var foreignline1 = new kity.Path("M 0 0 L 761 0 L764 309 L0 309Z");
            //var foreignline2 = new kity.Path("M 120 0 L 641 0");
            //var foreignline3 = new kity.Path("M 120 309 L 641 309");
            //var foreignline4 = new kity.Path("M 0 120 L 0 189");
            //var foreignline5 = new kity.Path("M764 120 L 764 189");
            foreignline1.setStyle({"stroke-width": 4, "stroke": "#898989"});
            //foreignline2.setStyle({"stroke-width": 4, "stroke": "#2383cc"});
            //foreignline3.setStyle({"stroke-width": 4, "stroke": "#2383cc"});
            //foreignline4.setStyle({"stroke-width": 4, "stroke": "#2383cc"});
            //foreignline5.setStyle({"stroke-width": 4, "stroke": "#2383cc"});
            var foreignBg = ForeignView.create(this._config.ForeignSurf.cls, this._config.ForeignSurf.width, this._config.ForeignSurf.height);
            foreignBg.setTranslate(-41, -43);
            this.lineG = new kity.Group();
            this.lineG.addClass("hide_dom");
            this.lineG.addShape(foreignline1);
            //this.lineG.addShape(foreignline2);
            //this.lineG.addShape(foreignline3);
            //this.lineG.addShape(foreignline4);
            //this.lineG.addShape(foreignline5);
            this._foreignSurf.addShape(this.lineG);
            $(this._foreignSurf.node).prepend(foreignBg.getView());
            var text = new kity.Text().setContent(textCon).addClass("svg_text_l").addClass("color_glass");
            this._foreignSurf.addShape(text);
            this._foreignSurf.setTranslate(this._config.ForeignSurf.translateX, this._config.ForeignSurf.translateY);
            this._$$container.prependItem(this._foreignSurf);
            var textWidth = $(text.node).width();
            text.setAttr('x', 570 + 170 -textWidth).setAttr('y', 90);



            this._$$container.addShape(this._surface.getView());
            this._$$container.addShape(this._equalAngleName.getView());
            this._lightComplexArray.gtIndexAppendToView(this._$$container);

            this._surface.setTranslate(420, this._config.LightComplex[0].IncidencePosY);
            this._surface.setNameVisible(this._option.nameVisible);
            if (this._config.EqualAngleName) {
                that._equalAngleNameHasShowBefore = this._config.EqualAngleName.visible;
                this._equalAngleName.setVisibility(this._config.EqualAngleName.visible);
            } else {
                this._equalAngleName.setVisibility(false);
            }
            //this.resetAngle(this._config.Surface.defaultAngle, true);
            this.resetAngle(this._config.LightComplex[0].Lines[this._config.LightComplex[0]._curLineIndex].degree, true);
            //从新初始化坐标位置
            this.toCenter();
            this.initEqualAngleNamePos();
        },

        afterCreateView: function () {
            //交由基类处理
          //  this.afterLineMove();
          //  this._lightComplexArray.showFirstIndex();
            this.afterLineMove(this._config.LightComplex[0]._curLineIndex);
        },
      
        toCenter: function () {
         //   this._$$container.setTranslate(-100, 0);
        },
        onLineMove: function (uuid, angle, curLineIndex) {
            this.resetState = true;
            this.initEqualAngleVisibility();
            this.afterLineMove(curLineIndex);
        },
        onLineTrans: function (uuid, x, y, curLineIndex){
            this.resetState = true;
            this.afterLineMove(curLineIndex);
        },

        //resetAngle: function (angle, init) {
        //    this._surface.rotate(angle);
        //    this._surfacebottom.rotate(angle);
        //    var surfaceAngle = this._surface.getRotateAngle() || 0;
        //    //TODO:这个角度应该是有问题的
        //    this._lightComplexArray.resetAngle(surfaceAngle, init);
        //},

        afterLineMove: function (curLineIndex) {
            var lightComplex0 = this._lightComplexArray.get(0);
            var lightComplex1 = this._lightComplexArray.get(1);

            var incidTran = Svg.getAttrTranslate($(lightComplex0._$$incidencePoint.node).attr('transform'));
            var refractAPos1 = {x: incidTran[0], y: incidTran[1]};
            var lines = this._config.LightComplex[0].Lines;
            //var lineIn = GraphMath.inWhichLine(refractAPos1, lines);
            var lineIn = curLineIndex ? curLineIndex: 0;
            //重置入射线的长度
            var incidenceAngle1 = lightComplex0.getIncidenceRotateAngle();
            var incidenceLine0 = {degree: incidenceAngle1,  aPoint: refractAPos1};
            if(lineIn >= 0){
                var result0 = GraphMath.pointInLine(incidenceLine0, lines, lineIn);
                var initIncidW = lightComplex0._configData.IncidenceLine.width;
                if(result0 ){
                    var incidW0 = GraphMath.getTwoPointDistance(result0.acrossPoint, refractAPos1);
                    if(incidW0 < initIncidW){
                        lightComplex0.setIncidenceLineWidth(incidW0);
                    }else{
                        lightComplex0.setIncidenceLineWidth(initIncidW);
                    }
                }else{
                    lightComplex0.setIncidenceLineWidth(initIncidW);
                }
            }

            //if(lightComplex0.getRefractionVisible()) { //判断是否显示第二模块,然后初始化第二模块
                var refractAngle1 = lightComplex0.getRefractionRotateAngle();
                var refractLine1 = {degree: refractAngle1, aPoint: refractAPos1};

                if (lineIn >= 0) {
                    var result = GraphMath.pointInLine(refractLine1, lines, lineIn);
                    this._acrossPoint = result;
                    if (result) {
                        //lightComplex1.setVisibility(true);
                        //this._lightComplexArray._lightArray.push(lightComplex1);
                        var incidentPoint2 = result.acrossPoint;
                        var lineIn2 = result.index;
                        lightComplex1.setCurLineIndex(lineIn2);
                        var refracWidth = GraphMath.getTwoPointDistance(refractAPos1, incidentPoint2);
                        lightComplex0.setRefractionLineWidth(refracWidth);
                        //lightComplex1.setIncidenVisibility(false);
                        lightComplex1.setIncidenceLineVisible(false);
                        lightComplex1.setIncidenceLineWidth(refracWidth);
                        lightComplex1.setGroupTranslate(incidentPoint2.x, incidentPoint2.y);
                        var incidenceAngle2 = GraphMath.getRotateAngle(incidentPoint2, lines[lineIn2].aPoint, refractAPos1);
                     //   console.log("incidenceAngle2 = "+incidenceAngle2);
                        lightComplex1.setIncidenceXAxisAngle(incidenceAngle2 + lines[lineIn2].degree);
                        lightComplex1.resetAngle(lines[lineIn2].degree);
                        if(lightComplex0._curRefAngle == "no_refract" || lightComplex1._curRefAngle == "no_refract" ){
                            this._lightComplexArray.setEnable(1, false);
                        }else{
                            this._lightComplexArray.setEnable(1, true);
                        }

                    } else {
                        //lightComplex1.setVisibility(false);
                        this._lightComplexArray.setEnable(1, false);
                        var initRefracLineW = lightComplex0._configData.RefractionLine.width;
                        lightComplex0.setRefractionLineWidth(initRefracLineW);
                    }
                }
            /**
             * 场景2
             */
            if(lightComplex0.isPedal()){
                if(lightComplex1.isPedal()){
                    this._lightComplexArray.setEnable(1, false);
                    lightComplex0.setRefractionLineWidth(refracWidth + 100);
                }
            }//else if(lightComplex0.isPedal() && lightComplex1)
            //if(result) {
            //    lightComplex1.setVisibility(true);
            //
            // }else{
            //    lightComplex1.setVisibility(false);
            //    var initRefracLineW = lightComplex0._configData.RefractionLine.width;
            //    lightComplex0.setRefractionLineWidth(initRefracLineW);
            //}
        }

    });

    Refractor.Extend = function (cls) {
        return Object.create(Refractor).__include(cls);
    };
    return Refractor;

});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/refractor/refractor3', ['js/refractor/refractor2', 'js/utils/utils', 'js/utils/graphMath', 'js/utils/svg'], function (Refractor2, Utils, GraphMath, Svg) {

    //view
    var Surface = require('js/view/surface');
    var LightComplexArray = require('js/refractor/LightComplexArrayRef');
    var EqualAngleName = require('js/view/EqualAngleName');
    var ForeignView = require('js/view/ForeignView');

    var Sector = require('js/view/sector');//为了隐藏全放射状态的折射线引入的，加入全反射后可以删掉

    var Refractor = Refractor2.Extend({
        _CONFIG: {
            LightComplex: [
                {
                    //refractivity1: 1,
                    //refractivity2: 1.5,
                    IncidenceLine: {defaultAngle: -13, rotateFixed: true, clickAble: true},
                    //ReflectionLine: {
                    //    visible: false,
                    //    rotateFixed: false,
                    //    clickAble: false
                    //},
                    RefractionLine: {visible: false, rotateFixed: true, clickAble: false},
                    NormalLine: {lineVisible: false, pointNameVisible: false},
                    Sector: {sectorInVisible: false, sectorOutVisible: false, incidenceVisible: false, reflectionVisible: false, refractionVisible: false},
                    //第一次
                    //IncidencePosX: 672,//入射点位置
                    //IncidencePosY: 418.74580629534967,
                    //第二次
                    IncidencePosX: 682.8,//入射点位置
                    IncidencePosY: 399.5,
                    //DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    DrawIndex: [[0, 1, 3], [4, 5, 6], [7, 11], [8]],
                    PedalDrawIndex: [[1 ,5, 6,8, 10]],
                    NoRefracDrawIndex:[],
                    Visible: true,
                    Lines: [
                        //最初的区域
                        //{aPoint: {x: 510, y: 515+163}, bPoint: {x: 320+510, y: 163}, degree: 302, range: [{x: 22+510, y: 483+163}, {x: 297+510, y: 37+163}], refractivity1: 1, refractivity2: 1.5, transAble: true},
                        //{aPoint: {x: 320+510, y: 163}, bPoint: {x: 510+600+42, y: 515+163}, degree: 58, range: [{x: 343+510, y: 37+163}, {x: 622+510, y: 480+163}], refractivity1: 1, refractivity2: 1.5, transAble: true},
                        //{aPoint: {x: 510 , y: 515+163}, bPoint: {x: 510+600+42 , y: 515+163}, degree: 0, range: [{x: 32+510, y: 515+163}, {x: 600+510, y: 515+163}], refractivity1: 1.5, refractivity2: 1, transAble: true}
                        //第二次修改的区域
                        //{aPoint: {x: 510, y: 515+163}, bPoint: {x: 320+510, y: 163}, degree: 302, range: [{x: 60+510, y: 420+163}, {x: 260+510, y: 98+163}], refractivity1: 1, refractivity2: 1.5, transAble: true},
                        //{aPoint: {x: 320+510, y: 163}, bPoint: {x: 510+600+42, y: 515+163}, degree: 58, range: [{x: 382+510, y: 98+163}, {x: 584+510, y: 420+163}], refractivity1: 1, refractivity2: 1.5, transAble: true},
                        //{aPoint: {x: 510 , y: 515+163}, bPoint: {x: 510+600+42 , y: 515+163}, degree: 0, range: [{x: 120+510, y: 515+163}, {x: 524+510, y: 515+163}], refractivity1: 1.5, refractivity2: 1, transAble: true}
                        //第三次修改的区域
                        {aPoint: {x: 510, y: 515+163}, bPoint: {x: 320+510, y: 163}, degree: 302, range: [{x: 682.8, y: 402.5},{x: 682.8, y: 402.5}], refractivity1: 1, refractivity2: 1.5, transAble: true, pedalLineAngle: 32},
                        {aPoint: {x: 320+510, y: 163}, bPoint: {x: 510+600+42, y: 515+163}, degree: 58, range: [{x: 980.4, y: 402.5},{x: 980.4, y: 402.5}], refractivity1: 1, refractivity2: 1.5, transAble: true, pedalLineAngle: 58},
                        {aPoint: {x: 510 , y: 515+163}, bPoint: {x: 510+600+42 , y: 515+163}, degree: 0, range: [{x: 510+642/2, y: 515+163}, {x:510+642/2, y: 515+163}], refractivity1: 1.5, refractivity2: 1, transAble: true, pedalLineAngle: 90}
                    ],
                    _curLineIndex: 0
                },
                {
                    //refractivity1:1.5,
                    //refractivity2: 1,
                    IncidenceLine: {defaultAngle: 30, rotateFixed: true, clickAble: true, visible: false},
                    //ReflectionLine: {
                    //    visible: false,
                    //    rotateFixed: false,
                    //    clickAble: false
                    //},
                    RefractionLine: {visible: false, rotateFixed: true, clickAble: false},
                    NormalLine: {lineVisible: false, pointNameVisible: false},
                    Sector: {sectorInVisible: false, sectorOutVisible: false, incidenceVisible: false, reflectionVisible: false, refractionVisible: false},
                    IncidencePosX: 672,//入射点位置
                    IncidencePosY: 418.74580629534967,
                    //DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    DrawIndex: [[0, 1], [4, 5, 6], [7, 11], [8]],
                    PedalDrawIndex: [[1 ,5, 6,8, 10]],
                    NoRefracDrawIndex:[],
                    Visible: true,
                    Lines: [
                        {aPoint: {x: 510, y: 515+163}, bPoint: {x: 320+510, y: 163}, degree: 302, range: [{x: 682.8, y: 402.5},{x: 682.8, y: 402.5}], refractivity1: 1, refractivity2: 1.5, transAble: true, pedalLineAngle: 32},
                        {aPoint: {x: 320+510, y: 163}, bPoint: {x: 510+600+42, y: 515+163}, degree: 58, range: [{x: 980.4, y: 402.5},{x: 980.4, y: 402.5}], refractivity1: 1, refractivity2: 1.5, transAble: true, pedalLineAngle: 58},
                        {aPoint: {x: 510 , y: 515+163}, bPoint: {x: 510+600+42 , y: 515+163}, degree: 0, range: [{x: 510+642/2, y: 515+163}, {x:510+642/2, y: 515+163}], refractivity1: 1.5, refractivity2: 1, transAble: true, pedalLineAngle: 90}
                    ],
                    _curLineIndex: 0
                }
            ],
            Surface: {width: 600, defaultAngle: -58, rotatePosX: 600 / 2,rotatePosY: 0, visible: false, clickAble: true,aPoint: {x: 500, y: 515+163}, bPoint: {x: 320+510, y: 163}},

            ForeignSurf: {
                cls: "bg_glasstria",
                width: 771,
                height: 635,
                translateX: 510,
                translateY: 163
            }
        },
        _TYPE: 3,
        resetState: false,
        create: function (eventBus, $$container, option, data) {
            var instance = Object.create(this);
            instance._uuid = Utils.getUuid();
            instance._event = $.extend(true, [], this._Event);
            instance.initEvent();
            //事件绑定
            instance.__base(eventBus, instance._event);

            instance.__proxyAll(['onSurfaceMove', 'onLineMove', 'onLineTrans','onLightFocusBlur','nameVisibleHandler']);//绑定this指针
            instance._$$container = $$container;
            instance._config = $.extend(true, {}, this._CONFIG, (data && data.configData) || {});
            instance._option = option;
            instance.createView();
            instance.afterCreateView();
            instance.initExtrasDrawCommand();
            instance.resetState = data && data.resetState? data.resetState: this.resetState;//是否可重置
            return instance;
        },
        createView: function () {
            var that = this;
            //反射面
            this._surface = Surface.create(this.__getEventBus(), this._config.Surface, this.onSurfaceMove, this._option.langData);

            this._lightComplexArray = LightComplexArray.create(this.__getEventBus(), this._config.LightComplex, this._option, this.onLineMove, this.onLineTrans, this.onLightFocusBlur);
            this._lightComplexArray.prependToView(this._$$container);

            this._equalAngleName = EqualAngleName.create(this._option.langData);

            /**
             * 用于定位介质文字 多语言问题
             */
            var bgLeft = this._config.ForeignSurf.translateX, bgRight = bgLeft + this._config.ForeignSurf.width, bgTop = this._config.ForeignSurf.translateY, bgBottom = bgTop + this._config.ForeignSurf.height;

            var langData = that._option.langData;
            var airTextCon = langData.refraction_air || '空气';
            var textCon = langData.refraction_prism || '三棱镜';

            //空气
            var airG = new kity.Group();

            var airText =  new kity.Text().setContent(airTextCon).setAttr('x', 0).setAttr('y', 40).addClass("svg_text_l").addClass("color_black");
            airG.addShape(airText);
            this._$$container.prependItem(airG);
            var airTextWidth = $(airText.node).width();
            airG.setTranslate(1160 + 170 - airTextWidth,116);
            //三棱镜背景
            this._foreignSurf = new kity.Group();
            var foreignline1 = new kity.Path("M 320 0 L 644 515 L0 515 Z");
            //var foreignline2 = new kity.Path("M 260 98 L 60 420");
           // var foreignline3 = new kity.Path("M 382 98 L 584 420");
            //var foreignline4 = new kity.Path("M120 515 L524 515");
            foreignline1.setStyle({"stroke-width": 4, "stroke": "#898989"});
            //foreignline2.setStyle({"stroke-width": 4, "stroke": "#2383cc"});
            //foreignline3.setStyle({"stroke-width": 4, "stroke": "#2383cc"});
            //foreignline4.setStyle({"stroke-width": 4, "stroke": "#2383cc"});
            var foreignBg = ForeignView.create(this._config.ForeignSurf.cls, this._config.ForeignSurf.width, this._config.ForeignSurf.height);
            foreignBg.setTranslate(-34, -24);
            this.lineG = new kity.Group();
            this.lineG.addClass("hide_dom");
            this.lineG.addShape(foreignline1);
            //this.lineG.addShape(foreignline2);
            //this.lineG.addShape(foreignline3);
            //this.lineG.addShape(foreignline4);
            this._foreignSurf.addShape(this.lineG);
            $(this._foreignSurf.node).prepend(foreignBg.getView());
            var text = new kity.Text().setContent(textCon).addClass("svg_text_l").addClass("color_glass");
            this._foreignSurf.addShape(text);
            this._$$container.prependItem(this._foreignSurf);
            var textWidth = $(text.node).width();
            text.setAttr('x',200 + 128 - textWidth/2).setAttr('y', 498);

            this._foreignSurf.setTranslate(this._config.ForeignSurf.translateX, this._config.ForeignSurf.translateY);

            this._$$container.addShape(this._surface.getView());
            this._$$container.addShape(this._equalAngleName.getView());
            this._lightComplexArray.gtIndexAppendToView(this._$$container);
            //this._surface.setTranslate(370, this._config.LightComplex[0].IncidencePosY);
            this._surface.setTranslate(370, 412);
            this._surface.setNameVisible(this._option.nameVisible);
            if (this._config.EqualAngleName) {
                that._equalAngleNameHasShowBefore = this._config.EqualAngleName.visible;
                this._equalAngleName.setVisibility(this._config.EqualAngleName.visible);
            } else {
                this._equalAngleName.setVisibility(false);
            }
            //this.resetAngle(this._config.Surface.defaultAngle, true);
            this.resetAngle(this._config.LightComplex[0].Lines[this._config.LightComplex[0]._curLineIndex].degree, true);
	    //从新初始化坐标位置
            this.toCenter();
            this.initEqualAngleNamePos();
        }
    });

    Refractor.Extend = function (cls) {
        return Object.create(Refractor).__include(cls);
    };
    return Refractor;

});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/refractor/refractor4', ['js/reflector/baseReflector', 'js/utils/utils', 'js/utils/graphMath', 'js/utils/svg', 'js/view/sector'], function (BaseReflector, Utils, GraphMath, Svg, Sector) {

    //view
    var Surface = require('js/view/surface');
    var LightComplexArray = require('js/refractor/LightComplexArrayRef');
    var EqualAngleName = require('js/view/EqualAngleName');
    var ForeignView = require('js/view/ForeignView');
    var EventKey = require('js/config/eventKey');

    var Refractor = BaseReflector({
        _CONFIG: {
            LightComplex: [
                {
                    //refractivity1: 3,
                    //refractivity2: 4,
                    IncidenceLine: {
                        width: 425,//整体长度
                        arrowPos: 200,//箭号所在位置
                        defaultAngle: 312, rotateFixed: true, clickAble: false, rotateFixedAfterDraw: true
                    },
                    RefractionLine: {
                        visible: false, rotateFixed: true, clickAble: false,
                        width: 440,
                        arrowPos: 170,
                        PedalWidth: 290
                    },
                    NormalLine: {width: 460, lineVisible: false, pointNameVisible: false},
                    InverseRefractionLine: {
                        width: 200,
                        defaultAngle: 333
                    },
                    Sector: {sectorInVisible: false, sectorOutVisible: false, incidenceVisible: false, refractionVisible: false},
                    IncidencePosX: 370,//入射点位置
                    IncidencePosY: -60,
                    //DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    DrawIndex: [[0, 1, 3], [4, 5, 6], [7, 11, 8], [13], [14]],
                    //PedalDrawIndex: [[0, 1], [5, 6], [10]],
                    PedalDrawIndex: [[1 ,5, 6,8, 10]],
                    NoRefracDrawIndex:[],
                    Visible: true,
                    Lines: [
                        //第一次设置
                        //{aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 120, y: 435},{x: 1300, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true}
                        //修改需求
                        {aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 1420/2, y: 435},{x: 1420/2, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true, pedalLineAngle: 0}
                        //{aPoint: {x: 0, y: 435 - 200}, bPoint: {x: 0, y: 396+435}, degree: 90, range: [{x: 0, y: 435},{x: 0, y: 396+435}], refractivity1: 1, refractivity2: 1.333, transAble: false},
                        //{aPoint: {x: 1422, y: 435 - 200}, bPoint: {x: 1420, y: 435+396}, degree: 90, range: [{x: 1420, y: 435},{x: 1420, y: 435+396}], refractivity1: 1, refractivity2: 1.333, transAble: false}
                    ],
                    _curLineIndex: 0
                },
                {
                    //refractivity1: 3,
                    //refractivity2: 4,
                    IncidenceLine: {
                        width: 370,//整体长度
                        arrowPos: 190,//箭号所在位置
                        defaultAngle: 302, rotateFixed: true, clickAble: false, rotateFixedAfterDraw: true
                    },
                    RefractionLine: {
                        visible: false, rotateFixed: true, clickAble: false,
                        width: 440,
                        arrowPos: 150,
                        PedalWidth: 290
                    },
                    NormalLine: {width: 460, lineVisible: false, pointNameVisible: false},
                    InverseRefractionLine: {
                        width: 125,
                        defaultAngle: 315
                    },
                    Sector: {sectorInVisible: false, sectorOutVisible: false, incidenceVisible: false, refractionVisible: false},
                    IncidencePosX: 280,//入射点位置
                    IncidencePosY: -60,
                    //DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    DrawIndex: [[0, 1, 3], [4, 5, 6], [7, 11, 8], [13], [14]],
                    //PedalDrawIndex: [[0, 1], [5, 6], [10]],
                    PedalDrawIndex: [[1 ,5, 6,8, 10]],
                    NoRefracDrawIndex:[],
                    Visible: true,
                    Lines: [
                        //第一次设置
                        //{aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 120, y: 435},{x: 1300, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true}
                        //修改需求
                        {aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 1420/2, y: 435},{x: 1420/2, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true, pedalLineAngle: 0}
                        //{aPoint: {x: 0, y: 435 - 200}, bPoint: {x: 0, y: 396+435}, degree: 90, range: [{x: 0, y: 435},{x: 0, y: 396+435}], refractivity1: 1, refractivity2: 1.333, transAble: false},
                        //{aPoint: {x: 1422, y: 435 - 200}, bPoint: {x: 1420, y: 435+396}, degree: 90, range: [{x: 1420, y: 435},{x: 1420, y: 435+396}], refractivity1: 1, refractivity2: 1.333, transAble: false}
                    ],
                    _curLineIndex: 0
                }
            ],
            Surface: {
                width: 1420,
                defaultAngle: 0,
                rotatePosX: 1420 / 2,//旋转位置
                rotatePosY: 4,//旋转位置
                visible: false,
                clickAble: true,
                type: Surface.Type.tl
            },
            ForeignSurf: {
                cls: "bg_water",
                width: 1420,
                height: 396,
                translateX: 0,
                translateY: 502
            }
        },
        _TYPE: 4,
        _Event: [],
        _event: null,
        _$$container: null,
        _incidencePointPos: null,
        _surfacePagePos: null,
        _option: null,
        _equalAngleNameHasShowBefore: false,
        resetState: false,
        MaterialObjectVisibility: false,

        create: function (eventBus, $$container, option, data) {
            var instance = Object.create(this);
            instance._uuid = Utils.getUuid();
            instance._event = $.extend(true, [], this._Event);
            instance.initEvent();
            //事件绑定
            instance.__base(eventBus, instance._event);

            instance.__proxyAll(['onSurfaceMove', 'onLineMove', 'onLineTrans','onLightFocusBlur','nameVisibleHandler']);//绑定this指针
            instance._$$container = $$container;
            instance._config = $.extend(true, {}, this._CONFIG, (data && data.configData) || {});
            instance._option = option;
            instance.MaterialObjectVisibility = data && data.MaterialObjectVisibility? data.MaterialObjectVisibility: this.MaterialObjectVisibility;
            instance.createView();
            instance.afterCreateView();
            instance.initExtrasDrawCommand();
            instance.resetState = data && data.resetState? data.resetState: this.resetState;//是否可重置

            return instance;
        },
        initEvent: function () {
            //TODO:交由基类处理
        },
        createView: function () {
            var that = this;
            //反射面
            this._surface = Surface.create(this.__getEventBus(), this._config.Surface, this.onSurfaceMove, this._option.langData);

            this._lightComplexArray = LightComplexArray.create(this.__getEventBus(), this._config.LightComplex, this._option, this.onLineMove, this.onLineTrans, this.onLightFocusBlur);
            this._lightComplexArray.appendToView(this._$$container);

            this._equalAngleName = EqualAngleName.create(this._option.langData);

            /**
             * 用于定位介质文字 多语言问题
             */
            var bgLeft = this._config.ForeignSurf.translateX, bgRight = bgLeft + this._config.ForeignSurf.width, bgTop = this._config.ForeignSurf.translateY, bgBottom = bgTop + this._config.ForeignSurf.height;

            var langData = that._option.langData;
            var airTextCon = langData.refraction_air || '空气';
            var textCon = langData.refraction_water || '水';

            var waterBgGroup = new kity.Group();
            waterBgGroup.setId('waterBgGroup');
            //水文字
            var txtWater = new kity.Text(textCon);
            txtWater.addClass('svg_text_l').addClass('color_white');
            waterBgGroup.appendItem(txtWater);
            //背景
            var waterBg = ForeignView.create('bg_water', 1420, 396);
            waterBg.setTranslate(0, -64);
            $(waterBgGroup.node).prepend(waterBg.getView());
            this._$$container.prependItem(waterBgGroup);
            var textWidth = $(txtWater.node).width();
            txtWater.setX(1254 + 85 - textWidth).setY(80);

            waterBgGroup.setTranslate(-450, 2);

            //空气字
            var airGroup4 = new kity.Group();
            airGroup4.setId('airGroup4');
            var txtAir = new kity.Text(airTextCon);
            txtAir.addClass('svg_text_l').addClass('color_black');
            airGroup4.appendItem(txtAir);
            this._$$container.addItem(airGroup4, 1);
            var airTextWidth = $(txtAir.node).width();
            airGroup4.setTranslate(774 + 170 - airTextWidth, -180);

            //眼睛
            var eyeGroup = new kity.Group();
            eyeGroup.setId('eyeGroup');
            eyeGroup.setTranslate(630, -350);
            var eyeForeign = ForeignView.create('icon_eye', '64', '44');
            $(eyeGroup.node).append(eyeForeign.getView());
            this._$$container.addItem(eyeGroup, 2);
            //实物
            var materialObjectGroup4 = new kity.Group();
            materialObjectGroup4.setId('materialObjectGroup4');
            materialObjectGroup4.setTranslate(-8, 200);
            var realFishGroup = new kity.Group();
            realFishGroup.setId('realFishGroup');
            var realFishForeign = ForeignView.create('real_fish', '90', '78');
            $(realFishGroup.node).append(realFishForeign.getView());
            materialObjectGroup4.addItem(realFishGroup);

            var realGoldCoinGroup = new kity.Group();
            realGoldCoinGroup.setId('realGoldCoinGroup');
            realGoldCoinGroup.setStyle({'display': 'none'});
            var realGoldCoinForeign = ForeignView.create('real_coin', '85', '82');
            $(realGoldCoinGroup.node).append(realGoldCoinForeign.getView());
            materialObjectGroup4.addItem(realGoldCoinGroup);

            var realChopsticksGroup = new kity.Group();
            realChopsticksGroup.setId('realChopsticksGroup');
            realChopsticksGroup.setStyle({'display': 'none'});
            realChopsticksGroup.setRotate(-102, 50, 5);
            realChopsticksGroup.setTranslate(12, 0);
            var realChopsticksForeign = ForeignView.create('real_chopsticks', '558', '27');
            $(realChopsticksGroup.node).append(realChopsticksForeign.getView());
            materialObjectGroup4.addItem(realChopsticksGroup);

            var arrowButtonGroup4 = new kity.Group();
            arrowButtonGroup4.setId('arrowButtonGroup4');
            arrowButtonGroup4.setTranslate(-70, 18);
            arrowButtonGroup4.setRotate(180, 28, 28);
            var arrowButtonForeign = ForeignView.create('btn_openlist', '64', '64');
            $(arrowButtonGroup4.node).append(arrowButtonForeign.getView());
            materialObjectGroup4.addItem(arrowButtonGroup4);
            this._$$container.addItem(materialObjectGroup4, 4);


            //实物成像
            var materialObjectImagingGroup4 = new kity.Group();
            this.MaterialObjectImagingGroup = materialObjectImagingGroup4;

            materialObjectImagingGroup4.setId('materialObjectImagingGroup4');
            //materialObjectImagingGroup4.setStyle({'display': 'none'});
            materialObjectImagingGroup4.setStyle({'display': this.MaterialObjectVisibility? 'inline-block':'none'});
            materialObjectImagingGroup4.setTranslate(100, -20);
            var imagingFishGroup = new kity.Group();
            imagingFishGroup.setId('imagingFishGroup');
            var imagingFishForeign = ForeignView.create('real_fish', '90', '78');
            $(imagingFishGroup.node).append(imagingFishForeign.getView());
            imagingFishGroup.addClass('fake_fish');
            materialObjectImagingGroup4.addItem(imagingFishGroup);

            var imagingGoldCoinGroup = new kity.Group();
            imagingGoldCoinGroup.setId('imagingGoldCoinGroup');
            imagingGoldCoinGroup.setStyle({'display': 'none'});
            var imagingGoldCoinForeign = ForeignView.create('real_coin', '85', '82');
            $(imagingGoldCoinGroup.node).append(imagingGoldCoinForeign.getView());
            imagingGoldCoinGroup.addClass('fake_coin');
            materialObjectImagingGroup4.addItem(imagingGoldCoinGroup);

            var imagingChopsticksGroup = new kity.Group();
            imagingChopsticksGroup.setId('imagingChopsticksGroup');
            imagingChopsticksGroup.setRotate(-154, 30, 23);
            imagingChopsticksGroup.setTranslate(25, 0);
            imagingChopsticksGroup.setStyle({'display': 'none'});
            var imagingChopsticksForeign = ForeignView.create('real_chopsticks', '558', '27');
            $(imagingChopsticksForeign.getView()).css({'width': 190, 'height': 27, 'overflow': 'hidden'});
            imagingChopsticksForeign.setForeignWidth(190);
            $(imagingChopsticksGroup.node).append(imagingChopsticksForeign.getView());
            imagingChopsticksGroup.addClass('fake_chopsticks');
            materialObjectImagingGroup4.addItem(imagingChopsticksGroup);
            this._$$container.addItem(materialObjectImagingGroup4, 3);

            this._$$container.addShape(this._surface.getView());
            this._$$container.addShape(this._equalAngleName.getView());
            this._lightComplexArray.gtIndexAppendToView(this._$$container);

            this._surface.setTranslate(0, this._config.LightComplex[0].IncidencePosY);
            this._surface.setNameVisible(this._option.nameVisible);
            if (this._config.EqualAngleName) {
                that._equalAngleNameHasShowBefore = this._config.EqualAngleName.visible;
                this._equalAngleName.setVisibility(this._config.EqualAngleName.visible);
            } else {
                this._equalAngleName.setVisibility(false);
            }
       //     this.resetAngle(this._config.Surface.defaultAngle, true);
            this.resetAngle(this._config.LightComplex[0].Lines[this._config.LightComplex[0]._curLineIndex].degree, true);

            //从新初始化坐标位置
            this.toCenter();
           // this.initEqualAngleNamePos();
            //对弹出窗口的操作
            var $view = $(arrowButtonGroup4.node).parents('#Refraction');
            $(arrowButtonGroup4.node).off('click');
            $view.find('._refraction_tab_container4 ._tab_content li').removeClass('on');
            $view.find('._refraction_tab_container4 ._tab_content li').first().addClass('on');
            $(arrowButtonGroup4.node).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                $view.find('._refraction_tab_container4').removeClass('hide_dom');
                $view.find('#arrowButtonGroup4').hide();
            });
        },
        initExtrasDrawCommand: function () {
            //交由基类处理
            //var that = this;
            //var length = this._lightComplexArray.getCommandLength();
            //this._lightComplexArray.pushDrawCommand(function (deffer) {
            //    if (that._lightComplexArray.isPedal()) {
            //        that._equalAngleNameHasShowBefore = true;
            //        that._equalAngleName.setVisibility(true);
            //    }
            //    deffer.resolve();
            //}, function () {
            //    if (!that._lightComplexArray.isPedal()) {
            //        return true;
            //    }
            //    if (!that._equalAngleName.isVisibilityHidden()) {
            //        return true;
            //    }
            //    return that._equalAngleNameHasShowBefore;
            //});
            //var pedalIndex = $.extend(true, [], this._config.LightComplex[0].PedalDrawIndex);
            //pedalIndex.splice(2, 0, length);
            //this._lightComplexArray.setPedalDrawIndex(pedalIndex);
        },
        afterCreateView: function () {
            //TODO:交由子类覆盖
        },
        initEqualAngleNamePos: function () {
            //布局角度
            var parentTranslate = this._$$container.getTransform().m;
            var width = this._equalAngleName.getView().getWidth();
            var height = this._equalAngleName.getView().getHeight();
            this._equalAngleName.setTranslate(this._option.viewPortWidth - parentTranslate.e - width - 135, -( this._option.viewPortHeight - parentTranslate.f - height ) + 20);
        },
        toCenter: function () {
            this._$$container.setTranslate(this._option.viewPortWidth / 2 - this.getWidth() / 2, this._option.viewPortHeight / 2 + 10);
        },
        resetAngle: function (angle, init) {
            this._surface.rotate(angle);
            var surfaceAngle = this._surface.getRotateAngle() || 0;
            this._lightComplexArray.resetAngle(surfaceAngle, init);
        },
        getData: function () {
            var data = {};
            data.type = this._TYPE;
            data.configData = this._lightComplexArray.getData();
            data.configData.Surface = {
                defaultAngle: this._surface.getRotateAngle(),
                visible: !this._surface.isVisibilityHidden()
            };
            data.configData.EqualAngleName = {
                visible: !this._equalAngleName.isVisibilityHidden()
            };
            data.resetState = this.resetState;
            data.MaterialObjectVisibility = this._lightComplexArray.getHasdrawMaterialObjectImagingGroup4();
            return data;
        },
        getMoveRotateAngle: function (data) {
            var currentPos = data.currentPos;
            var lastPos = data.lastPos;
            return GraphMath.getRotateAngle(this._surface.getRotateOffsetPos(), lastPos, currentPos);
        },
        onSurfaceMove: function (data, eventType) {
            if (eventType === 'move') {
                var angle = this.getMoveRotateAngle(data);
                if (this._lightComplexArray.rotateAble(angle)) {
                    this.resetAngle(angle);
                    this._lightComplexArray.around(this._surface.getRotateAngle(), this._config.Surface.rotatePosX);
                }
            } else if (eventType === 'aftermove') {
                this._lightComplexArray.adsorptionPedal();
            }
            this.initEqualAngleVisibility();
            this.resetState = true;
        },
        onLineMove: function (uuid, angle, curLineIndex) {
            this.resetState = true;
            this.initEqualAngleVisibility();
            this.afterLineMove(curLineIndex);

        },
        onLineTrans: function (uuid, x, y, curLineIndex){
            this.resetState = true;
            this.afterLineMove(curLineIndex);

        },
        onLightFocusBlur: function(type){
            if(this.lineG){
                if(type == "focus"){
                    this.lineG.removeClass("hide_dom");
                }else{
                    this.lineG.addClass("hide_dom");
                }
            }
        },
        afterLineMove: function (curLineIndex) {
        },
        initEqualAngleVisibility: function () {
            //非垂足重置为不可见
            if (this._lightComplexArray.isPedal()) {
                if (this._equalAngleNameHasShowBefore || this._lightComplexArray.get(0).getTwoLineVisible()) {
                    this._equalAngleName.setVisibility(true);
                }
            } else {
                this._equalAngleName.setVisibility(false);
            }
        },
        getWidth: function () {
            return this._config.Surface.width;
        },
        drawAll: function () {
            var that = this;
            this.resetState = true;
            this._lightComplexArray.drawAllAll(function(){
                that.setNamePos();
            });
        },
        drawNext: function () {
            var that = this;
            this.resetState = true;
            //this._lightComplexArray.drawNext();
            this._lightComplexArray.drawAllNext(function(){
                that.setNamePos();
            });
        },
        toCenter: function () {
            this._$$container.setTranslate(450, 500);
        },
        /**
         * 重置name的位置
         */
        setNamePos: function(){
            var that = this;
            var lightComplex0 = that._lightComplexArray.get(0);
            var lightComplex1 = that._lightComplexArray.get(1);
            lightComplex0.setNamePosByType(Sector.Type.Incidence, -60, 120);
            lightComplex1.setNamePosByType(Sector.Type.Incidence, -55, 120);
            lightComplex0.setNamePosByType(Sector.Type.Refraction, 30, -80);
            lightComplex1.setNamePosByType(Sector.Type.Refraction, 0, -90);
        },
        /**
         * 虚拟像是否显示
         */
        setMaterialObjectVisibility: function(visible){
            this.MaterialObjectImagingGroup.setStyle({'display': visible? 'inline-block':'none'});
        },
        setResetState: function(state){
            this.resetState = state;
        }

    });

    Refractor.Extend = function (cls) {
        return Object.create(Refractor).__include(cls);
    };
    return Refractor;

});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/refractor/refractor5', ['js/refractor/refractor4', 'js/utils/utils', 'js/utils/graphMath', 'js/utils/svg', 'js/view/sector'], function (Refractor6, Utils, GraphMath, Svg, Sector) {

    //view
    var Surface = require('js/view/surface');
    var LightComplexArray = require('js/refractor/LightComplexArrayRef');
    var EqualAngleName = require('js/view/EqualAngleName');
    var ForeignView = require('js/view/ForeignView');
    var EventKey = require('js/config/eventKey');

    var Refractor = Refractor6.Extend({
        _CONFIG: {
            LightComplex: [
                {
                    //refractivity1: 3,
                    //refractivity2: 4,
                    IncidenceLine: {
                        width: 145,//整体长度
                        arrowPos: 50,//箭号所在位置
                        defaultAngle: 135, rotateFixed: true, clickAble: false, rotateFixedAfterDraw: true
                    },
                    RefractionLine: {
                        visible: false, rotateFixed: true, clickAble: false
                    },
                    NormalLine: {width: 300, lineVisible: false, pointNameVisible: false},
                    InverseRefractionLine: {
                        width: 420,
                        defaultAngle: 132
                    },
                    Sector: {sectorInVisible: false, sectorOutVisible: false, incidenceVisible: false, refractionVisible: false},
                    IncidencePosX: 550,//入射点位置
                    IncidencePosY: 0,
                    //DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    DrawIndex: [[0, 1, 3], [4, 5, 6], [7, 11, 8], [13], [15]],
                    //PedalDrawIndex: [[0, 1], [5, 6], [10]],
                    PedalDrawIndex: [[1 ,5, 6,8, 10]],
                    NoRefracDrawIndex:[],
                    Visible: true,
                    Lines: [
                        //第一次设置
                        //{aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 120, y: 435},{x: 1300, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true}
                        //修改需求
                        {aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 1420/2, y: 435},{x: 1420/2, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true, pedalLineAngle: 0}
                        //{aPoint: {x: 0, y: 435 - 200}, bPoint: {x: 0, y: 396+435}, degree: 90, range: [{x: 0, y: 435},{x: 0, y: 396+435}], refractivity1: 1, refractivity2: 1.333, transAble: false},
                        //{aPoint: {x: 1422, y: 435 - 200}, bPoint: {x: 1420, y: 435+396}, degree: 90, range: [{x: 1420, y: 435},{x: 1420, y: 435+396}], refractivity1: 1, refractivity2: 1.333, transAble: false}
                    ],
                    _curLineIndex: 0
                },
                {
                    //refractivity1: 3,
                    //refractivity2: 4,
                    IncidenceLine: {
                        width: 225,//整体长度
                        arrowPos: 100,//箭号所在位置
                        defaultAngle: 153, rotateFixed: true, clickAble: false, rotateFixedAfterDraw: true
                    },
                    RefractionLine: {
                        visible: false, rotateFixed: true, clickAble: false,
                        width: 200
                    },
                    NormalLine: {width: 300, lineVisible: false, pointNameVisible: false},
                    InverseRefractionLine: {
                        width: 480,
                        defaultAngle: 120
                    },
                    Sector: {sectorInVisible: false, sectorOutVisible: false, incidenceVisible: false, refractionVisible: false},
                    IncidencePosX: 450,//入射点位置
                    IncidencePosY: 0,
                    //DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    DrawIndex: [[0, 1, 3], [4, 5, 6], [7, 11, 8], [13], [15]],
                    //PedalDrawIndex: [[0, 1], [5, 6], [10]],
                    PedalDrawIndex: [[1 ,5, 6,8, 10]],
                    NoRefracDrawIndex:[],
                    Visible: true,
                    Lines: [
                        //第一次设置
                        //{aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 120, y: 435},{x: 1300, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true}
                        //修改需求
                        {aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 1420/2, y: 435},{x: 1420/2, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true, pedalLineAngle: 0}
                        //{aPoint: {x: 0, y: 435 - 200}, bPoint: {x: 0, y: 396+435}, degree: 90, range: [{x: 0, y: 435},{x: 0, y: 396+435}], refractivity1: 1, refractivity2: 1.333, transAble: false},
                        //{aPoint: {x: 1422, y: 435 - 200}, bPoint: {x: 1420, y: 435+396}, degree: 90, range: [{x: 1420, y: 435},{x: 1420, y: 435+396}], refractivity1: 1, refractivity2: 1.333, transAble: false}
                    ],
                    _curLineIndex: 0
                }
            ],
            Surface: {
                width: 1420,
                defaultAngle: 0,
                rotatePosX: 1420 / 2,//旋转位置
                rotatePosY: 4,//旋转位置
                visible: false,
                clickAble: true,
                type: Surface.Type.tl
            },
            ForeignSurf: {
                cls: "bg_water",
                width: 1520,
                height: 396,
                translateX: 0,
                translateY: 502
            }
        },
        _TYPE: 5,
        _Event: [],
        _event: null,
        _$$container: null,
        _incidencePointPos: null,
        _surfacePagePos: null,
        _option: null,
        _equalAngleNameHasShowBefore: false,
        resetState: false,
        MaterialObjectVisibility: false,
        create: function (eventBus, $$container, option, data) {
            var instance = Object.create(this);
            instance._uuid = Utils.getUuid();
            instance._event = $.extend(true, [], this._Event);
            instance.initEvent();
            //事件绑定
            instance.__base(eventBus, instance._event);

            instance.__proxyAll(['onSurfaceMove', 'onLineMove', 'onLineTrans','onLightFocusBlur','nameVisibleHandler']);//绑定this指针
            instance._$$container = $$container;
            instance._config = $.extend(true, {}, this._CONFIG, (data && data.configData) || {});
            instance._option = option;
            instance.MaterialObjectVisibility = data && data.MaterialObjectVisibility? data.MaterialObjectVisibility: this.MaterialObjectVisibility;
            instance.createView();
            instance.afterCreateView();
            instance.initExtrasDrawCommand();
            instance.resetState = data && data.resetState? data.resetState: this.resetState;//是否可重置
            return instance;
        },
        initEvent: function () {
            //TODO:交由基类处理
        },
        createView: function () {
            var that = this;
            //反射面
            this._surface = Surface.create(this.__getEventBus(), this._config.Surface, this.onSurfaceMove, this._option.langData);

            this._lightComplexArray = LightComplexArray.create(this.__getEventBus(), this._config.LightComplex, this._option, this.onLineMove, this.onLineTrans, this.onLightFocusBlur);
            this._lightComplexArray.appendToView(this._$$container);

            this._equalAngleName = EqualAngleName.create(this._option.langData);

            /**
             * 用于定位介质文字 多语言问题
             */
            var bgLeft = this._config.ForeignSurf.translateX, bgRight = bgLeft + this._config.ForeignSurf.width, bgTop = this._config.ForeignSurf.translateY, bgBottom = bgTop + this._config.ForeignSurf.height;

            var langData = that._option.langData;
            var airTextCon = langData.refraction_air || '空气';
            var textCon = langData.refraction_water || '水';
            var waterGroup = new kity.Group();
            waterGroup.setId('waterGroup');
            //水文字
            var txtWater = new kity.Text(textCon);
            txtWater.addClass('svg_text_l').addClass('color_white');
            waterGroup.appendItem(txtWater);
            //背景
            var waterBg = ForeignView.create('bg_waterground', 1520, 396);
            waterBg.setTranslate(0, -64);
            $(waterGroup.node).prepend(waterBg.getView());
            this._$$container.prependItem(waterGroup);
            waterGroup.setTranslate(-450, 2);

            var textWidth = $(txtWater.node).width();
            txtWater.setX(120).setY(190);

            //空气字
            var airGroup = new kity.Group();
            airGroup.setId('airGroup');

            var txtAir = new kity.Text(airTextCon);
            txtAir.addClass('svg_text_l').addClass('color_black').setX(0).setY(40);
            airGroup.appendItem(txtAir);
            this._$$container.addItem(airGroup, 1);

            var airTextWidth = $(txtAir.node).width();
            airGroup.setTranslate(880 +170 - airTextWidth, -360);

            //水里的眼睛
            var eyeGroup = new kity.Group();
            eyeGroup.setId('eyeGroup');
            eyeGroup.setTranslate(306, 172);
            var eyeForeign = ForeignView.create('icon_eye', '64', '44');
            $(eyeGroup.node).append(eyeForeign.getView());
            this._$$container.addItem(eyeGroup, 2);
            //实物
            var materialObjectGroup5 = new kity.Group();
            materialObjectGroup5.setId('materialObjectGroup5');
            materialObjectGroup5.setTranslate(378, -250);
            var realTreeGroup = new kity.Group();
            realTreeGroup.setId('realTreeGroup');
            var realTreeForeign = ForeignView.create('real_tree', '383', '252');
            $(realTreeGroup.node).append(realTreeForeign.getView());
            materialObjectGroup5.addItem(realTreeGroup);

            var realLightHouseGroup = new kity.Group();
            realLightHouseGroup.setId('realLightHouseGroup');
            realLightHouseGroup.setStyle({'display': 'none'});
            var realLightHouseForeign = ForeignView.create('real_lighthouse', '383', '252');
            $(realLightHouseGroup.node).append(realLightHouseForeign.getView());
            materialObjectGroup5.addItem(realLightHouseGroup);

            var realHumanGroup = new kity.Group();
            realHumanGroup.setId('realHumanGroup');
            realHumanGroup.setStyle({'display': 'none'});
            var realHumanForeign = ForeignView.create('real_human', '383', '252');
            $(realHumanGroup.node).append(realHumanForeign.getView());
            materialObjectGroup5.addItem(realHumanGroup);

            var arrowButtonGroup5 = new kity.Group();
            arrowButtonGroup5.setId('arrowButtonGroup5');
            arrowButtonGroup5.setTranslate(350, 180);
            var arrowButtonForeign = ForeignView.create('btn_openlist', '64', '64');
            $(arrowButtonGroup5.node).append(arrowButtonForeign.getView());
            materialObjectGroup5.addItem(arrowButtonGroup5);
            this._$$container.addItem(materialObjectGroup5, 3);

            //实物成像
            var materialObjectImagingGroup5 = new kity.Group();
            this.MaterialObjectImagingGroup = materialObjectImagingGroup5;

            materialObjectImagingGroup5.setId('materialObjectImagingGroup5');
            //materialObjectImagingGroup5.setStyle({'display': 'none'});
            materialObjectImagingGroup5.setStyle({'display': this.MaterialObjectVisibility? 'inline-block':'none'});
            materialObjectImagingGroup5.setTranslate(500, -500);
            var imagingTreeGroup = new kity.Group();
            imagingTreeGroup.setId('imagingTreeGroup');
            var imagingTreeForeign = ForeignView.create('real_tree', '383', '252');
            $(imagingTreeGroup.node).append(imagingTreeForeign.getView());
            imagingTreeGroup.addClass('fake_tree');
            materialObjectImagingGroup5.addItem(imagingTreeGroup);

            var imagingLightHouseGroup = new kity.Group();
            imagingLightHouseGroup.setId('imagingLightHouseGroup');
            imagingLightHouseGroup.setStyle({'display': 'none'});
            var imagingLightHouseForeign = ForeignView.create('real_lighthouse', '383', '252');
            $(imagingLightHouseGroup.node).append(imagingLightHouseForeign.getView());
            imagingLightHouseGroup.addClass('fake_lighthouse');
            materialObjectImagingGroup5.addItem(imagingLightHouseGroup);

            var imagingHumanGroup = new kity.Group();
            imagingHumanGroup.setId('imagingHumanGroup');
            imagingHumanGroup.setStyle({'display': 'none'});
            var imagingHumanForeign = ForeignView.create('real_human', '383', '252');
            $(imagingHumanGroup.node).append(imagingHumanForeign.getView());
            imagingHumanGroup.addClass('fake_human');
            materialObjectImagingGroup5.addItem(imagingHumanGroup);
            this._$$container.addShape(materialObjectImagingGroup5);

            this._$$container.addShape(this._surface.getView());
            this._$$container.addShape(this._equalAngleName.getView());
            this._lightComplexArray.gtIndexAppendToView(this._$$container);

            this._surface.setTranslate(0, this._config.LightComplex[0].IncidencePosY);
            this._surface.setNameVisible(this._option.nameVisible);
            if (this._config.EqualAngleName) {
                that._equalAngleNameHasShowBefore = this._config.EqualAngleName.visible;
                this._equalAngleName.setVisibility(this._config.EqualAngleName.visible);
            } else {
                this._equalAngleName.setVisibility(false);
            }
       //     this.resetAngle(this._config.Surface.defaultAngle, true);
            this.resetAngle(this._config.LightComplex[0].Lines[this._config.LightComplex[0]._curLineIndex].degree, true);

            //从新初始化坐标位置
            this.toCenter();
          //  this.initEqualAngleNamePos();
            //对弹出窗口的操作
            var $view = $(arrowButtonGroup5.node).parents('#Refraction');
            $(arrowButtonGroup5.node).off('click');
            $view.find('._refraction_tab_container5 ._tab_content li').removeClass('on');
            $view.find('._refraction_tab_container5 ._tab_content li').first().addClass('on');
            $(arrowButtonGroup5.node).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                $view.find('._refraction_tab_container5').removeClass('hide_dom');
                $view.find('#arrowButtonGroup5').hide();
            });
        },
        toCenter: function () {
            this._$$container.setTranslate(380, 500);
        },
        getData: function () {
            var data = {};
            data.type = this._TYPE;
            data.configData = this._lightComplexArray.getData();
            data.configData.Surface = {
                defaultAngle: this._surface.getRotateAngle(),
                visible: !this._surface.isVisibilityHidden()
            };
            data.configData.EqualAngleName = {
                visible: !this._equalAngleName.isVisibilityHidden()
            };
            data.resetState = this.resetState;
            data.MaterialObjectVisibility = this._lightComplexArray.getHasdrawMaterialObjectImagingGroup5();
            return data;
        },
        /**
         * 重置name的位置
         */
        setNamePos: function(){
            var that = this;
            var lightComplex0 = that._lightComplexArray.get(0);
            var lightComplex1 = that._lightComplexArray.get(1);
            lightComplex0.setNamePosByType(Sector.Type.Incidence, 5, -80);
            lightComplex1.setNamePosByType(Sector.Type.Incidence, 15, -80);
            lightComplex0.setNamePosByType(Sector.Type.Refraction, -55, 130);
            lightComplex1.setNamePosByType(Sector.Type.Refraction, -90, 130);
        }
    });

    Refractor.Extend = function (cls) {
        return Object.create(Refractor).__include(cls);
    };
    return Refractor;

});
/**
 * Created by ylf on 2016/8/5.
 */
define('js/refractor/refractorFactory', ['js/base/base', 'js/refractor/refractor1', 'js/refractor/refractor2', 'js/refractor/refractor3', 'js/refractor/refractor4', 'js/refractor/refractor5'], function (Base, Refractor1, Refractor2, Refractor3, Refractor4, Refractor5) {

    var RefractorFactory = {
        getRefractor: function (type, eventBus, $$container, option, data) {
            if (type === 1) {
                return Refractor1.create(eventBus, $$container, option, data);
            }else if (type === 2) {
                return Refractor2.create(eventBus, $$container, option, data);
            }else if (type === 3) {
                return Refractor3.create(eventBus, $$container, option, data);
            }else if (type === 4) {
                return Refractor4.create(eventBus, $$container, option, data);
            }else if (type === 5) {
                return Refractor5.create(eventBus, $$container, option, data);
            }
            //var Refractor = Refractor + type;
            //return Refractor.create(eventBus, $$container, option, data);
        }
    };


    return RefractorFactory;

});
/**
 * Created by ylf on 2016/7/22.
 */
define('js/refractor/refractorMain', ['js/base/Base', 'js/utils/eventBus', 'js/utils/string', 'js/utils/utils', 'js/config/eventKey', 'js/refractor/refractorFactory', 'js/utils/view'], function (Base, EventBus, String, Utils, EventKey, RefractorFactory, View) {

    var DomEvent = require('js/reflector/domEvent');
    var Btn = require('js/refractor/btn');
    var Lang = require('js/config/lang');

    var VERSION = '1.0.0';

    var _templateHtml = '<div class="${cls}" id="${id}"></div>';

    var ViewPort = {
        x: 0,
        y: 0,
        width: 1420,
        height: 900
    };

    var OPTION = {
        create: function (option) {
            var instance = Object.create(this);
            for (var key in option) {
                if (key === 'langData') {
                    instance[key] = $.extend(true, {}, Lang, option.langData);
                } else {
                    instance[key] = option[key];
                }
            }
            return instance;
        },
        viewPortWidth: ViewPort.width,
        viewPortHeight: ViewPort.height,
        refractorType: [1, 2, 3, 4, 5],
        nameVisible: true,
        surfaceAngleVisible: true,
        normalAngleVisible: true,
        reflector5NameEnable: false,//默认不显示预设五的名称
        lock: false,//是否锁定
        langData: Lang//默认中文
    };


    var RefractorMain = Base({
        _$$paper: null,
        _$$paperItems: [],
        _refractors: [],
        _currentIndex: 0,
        _id: null,
        _init: false,
        create: function (option) {
            var eventBus = EventBus.create();
            var instance = Object.create(this);
            //创建配置
            instance._option = OPTION.create(option);
            instance._id = Utils.getUuid();
            instance._$$paper = [];
            instance._$$paperItems = [];
            instance._refractors = [];
            instance.__base(eventBus, []);
            instance.__on('insidechange', function (p) {
                if (instance._init) {
                    instance.__triggerEvent('change', p);
                }
            });
            return instance;
        },
        render: function (obj) {
            this._init = false;
            var type = typeof  obj;
            if (type === 'string') {
                obj = document.getElementById(obj);
            } else if (type === 'object') {
                if (obj instanceof jQuery) {
                    obj = obj[0];
                }
            }
            var $mainHtml = $(String.template(_templateHtml, {cls: 'fm', id: this._id}));
            $(obj).html($mainHtml);
            this._paper = new kity.Paper($mainHtml[0]);
            this._paper.setViewBox(0, 0, this._option.viewPortWidth, this._option.viewPortHeight);
            //绑定事件
            var domEvent = DomEvent.create(this._paper, this.__getEventBus(), this._option);
            domEvent.bindDomEvent();
            this.createRefractor();
            //this.show((this._data && this._data.currentIndex) || this._currentIndex);
            this._init = true;
            this._btn=Btn.create(this.__getEventBus(),this);
            this.__triggerEvent('insidechange', 'init');
        },
        _createRefractor: function (index, type, data) {
            var that = this;
            var $$item = new kity.Group().setId('item_' + index);
            $$item.setAttr('class', '_lr_item');
            that._$$paperItems.push($$item);
            that._paper.addShape($$item);
            //add reflector
            var refractor = RefractorFactory.getRefractor(type, that.__getEventBus(), $$item, that._option, data);
            if (refractor) {
                refractor.afterInit();
            }
            View.setVisibility($$item, index === that._currentIndex);
            that._refractors.push(refractor);
            return refractor;
        },
        createRefractor: function () {
            var that = this;

            this._refractors = [];
            this._$$paperItems = [];

            var __create = function (index, type, data) {
                var $$item = new kity.Group().setId('item_' + index);
                $$item.setAttr('class', '_lr_item');
                that._$$paperItems.push($$item);
                that._paper.addShape($$item);
                //add reflector
                var refractor = RefractorFactory.getRefractor(type, that.__getEventBus(), $$item, that._option, data);
                View.setVisibility($$item, index === that._currentIndex);
                that._refractors.push(refractor);
                return refractor;
            };

            if (this._data && this._data.data && this._data.data.length > 0) {
                var data = this._data.data;
                this._currentIndex = this._data.currentIndex;
                var refractor4, refractor5;
                for (var i = 0; i < data.length; i++) {
                    var refractorData = data[i];
                    var refractor = __create(i, refractorData.type, refractorData);
                    //refractor.renderData(refractorData);
                    /**
                     * 重置name的位置
                     */
                    if(refractorData.type == 4){
                        refractor4 = refractor;
                    }
                    if(refractorData.type == 5){
                        refractor5 = refractor;
                    }
                }
                this.setNormalAngleVisible(this._data.option.normalAngleVisible);
                this.setSurfaceAngleVisible(this._data.option.surfaceAngleVisible);
                this.setNameVisible(this._data.option.nameVisible);
                /**
                 * 重置name的位置
                 */
                refractor4 && refractor4.setNamePos();
                refractor5 && refractor5.setNamePos();

            } else {
                for (var i = 0; i < this._option.refractorType.length; i++) {
                    var type = this._option.refractorType[i];
                    __create(i, type);
                }
            }
        },
        setData: function (data) {
            if (!data.version || !data.data) {
                return;
            }
            this._data = data;
        },
        getData: function () {
            var data = {};
            data.version = VERSION;
            data.data = [];
            data.currentIndex = this._currentIndex;
            this._refractors.forEach(function (refractor) {
                if (refractor) {
                    data.data.push(refractor.getData());
                }
            });
            data.option = {
                nameVisible: this._option.nameVisible,
                surfaceAngleVisible: this._option.surfaceAngleVisible,
                normalAngleVisible: this._option.normalAngleVisible
            };
            return data;
        },
        /**
         * 目前支持 change、
         * @param type
         * @param callback
         * @param domain
         */
        on: function (type, callback, domain) {
            this.__getEventBus().on(type, callback, domain);
        },
        off: function (type, callback, domain) {
            this.__getEventBus().off(type, callback, domain);
        },
        show: function (index) {
             this.__triggerEvent(EventKey.Blur);
            this._currentIndex = index;
            this._$$paperItems.forEach(function ($$item, i) {
                View.setVisibility($$item, index === i);
            });
            this.__triggerEvent('insidechange', 'showChange');
        },
        getCurrentIndex:function(){
            return this._currentIndex;
        },
        //反射面角度
        setSurfaceAngleVisible: function (visible) {
            this._option.surfaceAngleVisible = visible;
            this.__triggerEvent(EventKey.SurfaceAngleVisible, visible);
        },
        getSurfaceAngleVisible: function () {
            return this._option.surfaceAngleVisible;
        },
        //与发现夹角
        setNormalAngleVisible: function (visible) {
            this._option.normalAngleVisible = visible;
            this.__triggerEvent(EventKey.NormalAngleVisible, visible);
            //this._refractors[3].setNormalAngleVisible(visible);
            //this._refractors[4].setNormalAngleVisible(visible);
            this._refractors[3].setNamePos();
            this._refractors[4].setNamePos();
        },
        getNormalAngleVisible: function () {
            return this._option.normalAngleVisible;
        },
        //名称
        setNameVisible: function (visible) {
            this._option.nameVisible = visible;
            this.__triggerEvent(EventKey.NameVisible, visible);
            //this._refractors[3].setNameVisible(false);
            //this._refractors[4].setNameVisible(false);
            this._refractors[3].setNamePos();
            this._refractors[4].setNamePos();
        },
        //名称是否显示
        getNameVisible: function () {
            return this._option.nameVisible;
        },
        getCurrentRefractor: function () {
            return this._refractors[this._currentIndex];
        },
        //一步画
        drawAll: function () {
            this.__triggerEvent(EventKey.Blur);
            this.getCurrentRefractor().drawAll();
        },
        //逐步画
        drawNext: function () {
            this.__triggerEvent(EventKey.Blur);
            this.getCurrentRefractor().drawNext();
        },
        //是否有下一步
        hasNext: function () {
            return this.getCurrentRefractor().hasNext();
        },
        reset: function (option) {
            $.extend(this._option, option);

            this._$$paperItems[this._currentIndex].clear();
            //var $$item = this._$$paperItems[this._currentIndex] = new kity.Group().setId('item_' + this._currentIndex);
            //$$item.setAttr('class', '_lr_item');
            //this._paper.addShape($$item);
            var refractor = RefractorFactory.getRefractor(this._refractors[this._currentIndex].getType(), this.__getEventBus(),  this._$$paperItems[this._currentIndex], this._option, {});
            this._refractors[this._currentIndex] = refractor;
            this.__triggerEvent('insidechange', 'reset');
        },
        getCurRefResetState: function(){
            return this.getCurrentRefractor().resetState;
        },
        /**
         * 设置某个场景的reset值
         */
        setCurRefResetState: function(state){
            this.getCurrentRefractor().setResetState(state);
            this.__triggerEvent('insidechange', 'reset');
        },
        getFirRefAngle: function(){ //获取第一模块的折射角
            return this.getCurrentRefractor()._lightComplexArray.getFirRefAngle();
        },
        getFirIncidenceAngle: function(){ //获取第一模块的入射角角
            return this.getCurrentRefractor()._lightComplexArray.getFirIncidenceAngle();
        },
        destroy: function () {

        }
    });


    return RefractorMain;

});
/**
 * Created by ylf on 2016/8/22.
 */
define('js/refractor/lightComplexRef/draw', ['js/view/sector', 'js/utils/utils', 'js/utils/view'], function (Sector, Utils, View) {

    var LightComplexDraw = {
        _hasDrawBegin: false,
        _hasDrawNext: true,
        setDrawBegin: function (hasDrawBegin) {
            this._hasDrawBegin = hasDrawBegin;
            //固定预设线，不可跟随旋转
            if (this._configData.IncidenceLine.rotateFixedAfterDraw) {
                this._configData.IncidenceLine.rotateFixed = true;
            }
            if (this._configData.RefractionLine.rotateFixedAfterDraw) {
                this._configData.RefractionLine.rotateFixed = true;
            }

        },
        getDrawBegin: function () {
            return this._hasDrawBegin;
        },
        drawAll: function (cb) {
            //隐藏状态下不能绘制
            if (this.isVisibilityHidden()) {
                return;
            }
            //设置所有扇面都绘制过

            this.setSectorInsideDrawStatus(true);
            this.setDrawBegin(true);
            var that = this;
            //if (!this._hasDrawNext) {
            //    return;
            //}
            this._drawCommand.stop(function () {
                that._drawCommand.drawAll(null, false);
                //自动吸附90°
                that.adsorptionPedal();
                that.__triggerEvent('insidechange', 'drawAll');
                cb && cb();
            });
            this._hasDrawNext = false;
            //
            //if(that._curRefAngle != "no_refract"){
            //    //this.setRefractVisibility(true);
            //    that.setRefractionPartVisibility(true);
            //    that.setSectorVisibilityByType(Sector.Type.Incidence, true);
            //}else if(that._curRefAngle == "no_refract"){
            //    that.setRefractionPartVisibility(false);
            //    //强制隐藏状态
            //    that.getNameGroup().setHasDrawStatusByType(false,Sector.Type.Refraction);
            //}
        },
        drawNext: function (cb) {
            //隐藏状态下不能绘制
            if (this.isVisibilityHidden()) {
                return;
            }
            this.setDrawBegin(true);
            var that = this;
            //if (!this._hasDrawNext) {
            //    return;
            //}
            this._drawCommand.drawNext(function () {
                //绘制完后隐藏相应视图
                that._hasDrawNext = that._drawCommand.hasNext();
                //自动吸附90°
                that.adsorptionPedal();
                that.__triggerEvent('insidechange', 'drawNext');
                cb && cb();
            }, true);
        },
        hasNext: function () {
            //隐藏状态下不能绘制
            if (this.isVisibilityHidden()) {
                return false;
            }
            //return this._hasDrawNext;
            return this._drawCommand.hasNext();
        },
        hasNextWidthOutVisibilityStatus: function () {
            return this._hasDrawNext;
        },
        initDrawCommand: function () {
            var that = this;
            that._hsdrawIncidencePoint = false;
            that._hsdrawSectorRefraction = false;
            that._hsDrawRefractionLine = false;
            that._hsdrawInverseRefractionLine = false;
            that._hsdrawMaterialObjectImagingGroup4 = false;
            that._hsdrawMaterialObjectImagingGroup5 = false;
            //0.入射点闪烁显示
            this._drawCommand.push(function (deffer, animate) {

                that._hsdrawIncidencePoint = true;
                if (animate) {
                    View.setVisibility(that._$$incidencePoint, true);
                    $(that._$$incidencePoint.node).fadeIn(300).fadeOut(300).fadeIn(300, function () {
                        View.setVisibility(that._$$incidencePoint, false);
                        deffer.resolve();
                    });
                } else {
                    deffer.resolve();
                }
            }, function () {
                return that._hsdrawIncidencePoint;
                //return !View.isVisibilityHidden(that._$$incidencePoint);
            });

            //1.入射点名称
            this._drawCommand.push(function (deffer, animate) {
                that._normalLine.setPointNameVisibility(that._option.nameVisible, true);
                deffer.resolve();
            }, function () {
                return that._normalLine.getPointNameVisible();
            });

            //2.入射于反射面扇面
            this._drawCommand.push(function (deffer, animate) {
                if (that._option.surfaceAngleVisible === true) {
                    that.setSectorVisibilityByType(Sector.Type.SurfaceIn, true);
                }
                that.setSectorInsideDrawStatus(true, Sector.Type.SurfaceIn);
                deffer.resolve();
            }, function () {
                if (that._option.surfaceAngleVisible === true && !that.isPedal()) {
                    return !that._surfaceInSector.isVisibilityHidden();
                }
                return true;
            });

            //3.入射光线
            this._drawCommand.push(function (deffer, animate) {
                that._incidenceLine.setVisibility(true);
                deffer.resolve();
            }, function () {
                return !that._incidenceLine.isVisibilityHidden();
            });

            //4.入射角
            this._drawCommand.push(function (deffer, animate) {
                //扇面显示时才显示角度
                if (that._option.normalAngleVisible === true) {
                    that.setSectorVisibilityByType(Sector.Type.Incidence, true);
                }
                that.setSectorInsideDrawStatus(true, Sector.Type.Incidence);
                deffer.resolve();
            }, function () {
                if (that._option.normalAngleVisible === true && !that.isPedal() && Math.round(that.getSectorAngle(Sector.Type.Incidence)) != 90) {
                    return !that._incidenceSector.isVisibilityHidden();
                }
                return true;
            });

            //5.法线
            this._drawCommand.push(function (deffer) {
                that._normalLine.setLineVisibility(that._option.nameVisible, true);
                deffer.resolve();
            }, function () {
                return that._normalLine.getLineVisible();
            });

            //6.垂足符号
            this._drawCommand.push(function (deffer) {
                that._pedalLine.setVisibility(true);
                deffer.resolve();
            }, function () {
                return !that._pedalLine.isVisibilityHidden();
            });


            //7.折射角
            this._drawCommand.push(function (deffer, animate) {
                //扇面显示时才显示角度
                if (that._option.normalAngleVisible === true) {
                    that.setSectorVisibilityByType(Sector.Type.Refraction, true);
                }
                that._hsdrawSectorRefraction = true;
                if (that._curRefAngle == "no_refract") {

                    that.setSectorVisibilityByType(Sector.Type.Refraction, false);
                    //that.setRefractionPartVisibility(false);
                }
                deffer.resolve();
            }, function () {
                if (that._option.normalAngleVisible === true && !that.isPedal()) {
                    return !that._refractionSector.isVisibilityHidden();
                }
                return true;
            });


            //8.反射线
            this._drawCommand.push(function (deffer) {
                that._refractionLine.setVisibility(true);
                that._hsDrawRefractionLine = true;
               if(that._curRefAngle == "no_refract"){
                  // that.setRefractionPartVisibility(false);
                   that._refractionLine.setVisibility(false);
                }
                deffer.resolve();
            }, function () {
              //  return !that._refractionLine.isVisibilityHidden()
                return that._hsDrawRefractionLine;
            });

            //9.反射线与反射面扇面
            this._drawCommand.push(function (deffer) {
                if (that._option.surfaceAngleVisible === true) {
                    that.setSectorVisibilityByType(Sector.Type.SurfaceOut, true);
                }
                that.setSectorInsideDrawStatus(true, Sector.Type.SurfaceOut);
                deffer.resolve();
            }, function () {
                if (that._option.surfaceAngleVisible === true && !that.isPedal()&& Math.round(that.getSectorAngle(Sector.Type.Incidence)) != 90) {
                    return !that._surfaceOutSector.isVisibilityHidden();
                }
                return true;
            });


            //10.显示垂足的入射光线、反射光线 和法线
            this._drawCommand.push(function (deffer) {
                that._incidenceLine.setVisibility(true);
                if (that._option.normalAngleVisible === true) {
                    that.setSectorVisibilityByType(Sector.Type.Incidence, true);
                }
                that.setSectorInsideDrawStatus(true, Sector.Type.Incidence);

                that._refractionLine.setVisibility(true);
                if (that._option.normalAngleVisible === true) {
                    that.setSectorVisibilityByType(Sector.Type.Refraction, true);
                }

                that.setSectorInsideDrawStatus(true, Sector.Type.Refraction);
                that._hsdrawSectorRefraction = true;
                that._pedalLine.setVisibility(true);
                //that._incidenceLine.setWidth(that._configData.IncidenceLine.PedalWidth);
                //that._incidenceLine.setArrowPos(that._configData.IncidenceLine.PedalArrowPos);
                //that._refractionLine.setWidth(that._configData.RefractionLine.PedalWidth);
                //that.resetLinePos();
                //that._refractionLine.setArrowPos(that._configData.RefractionLine.PedalArrowPos);
                //that.setSectorInsideDrawStatus(true, Sector.Type.Incidence);
                //that.setSectorInsideDrawStatus(true, Sector.Type.Reflection);
                //if (that._curRefAngle != "no_refract") {
                    //this.setRefractVisibility(true);
                    //that.setRefractionPartVisibility(true);
                    //if(this._option.normalAngleVisible){
                    //    that.setSectorVisibilityByType(Sector.Type.Incidence, true);
                    //}
                //} else if (that._curRefAngle == "no_refract") {
                    //that.setRefractionPartVisibility(false);
                    //强制隐藏状态
                    //that.getNameGroup().setHasDrawStatusByType(false, Sector.Type.Refraction);
                //}
                that._hsdrawIncidencePoint=true;
                that._hsDrawRefractionLine = true;
                that._draw11=true;
                deffer.resolve();
            }, function () {
                return !that._refractionLine.isVisibilityHidden() && !that._incidenceLine.isVisibilityHidden();
            });
            that._draw11 = false;
            //11.入射角、反射镜闪烁隐藏
            this._drawCommand.push(function (deffer, animate) {
                that._draw11 = true;
                //扇面显示时才显示角度
                if (that._option.normalAngleVisible === false && animate) {
                    that.sectorAnimateDisappear(function () {
                        deffer.resolve();
                    });
                } else {
                    deffer.resolve();
                }
            }, function () {
                return !!that._draw11;
            });
            //12.入射角=反射角=0°
            this._drawCommand.push(function (deffer) {
                //TODO:
                deffer.resolve();
            }, function () {
                //TODO:
                return true;
            });
            //13.反射折射线InverseRefractionLine
            this._drawCommand.push(function (deffer) {
                that._hsdrawInverseRefractionLine = true;
                that._inverseRefractionLine.setLineVisibility(false, true);
                deffer.resolve();
            }, function () {
                //return that._inverseRefractionLine.getLineVisible();
                return that._hsdrawInverseRefractionLine;
            });
            //14.场景4显示虚拟成像
            this._drawCommand.push(function (deffer) {
                that._hsdrawMaterialObjectImagingGroup4 = true;
                $('#materialObjectImagingGroup4').show();
                deffer.resolve();
            }, function () {
                //return $('#materialObjectImagingGroup4').css('display') != 'none';
                return that._hsdrawMaterialObjectImagingGroup4;
            });
            //15.场景5显示虚拟成像
            this._drawCommand.push(function (deffer) {
                that._hsdrawMaterialObjectImagingGroup5 = true;
                $('#materialObjectImagingGroup5').show();
                deffer.resolve();
            }, function () {
              //  return $('#materialObjectImagingGroup5').css('display') != 'none';
                return that._hsdrawMaterialObjectImagingGroup5;
            });

            //初始化绘制状态
            this.initDrawStatus();
        },
        getCommandLength: function () {
            return this._drawCommand.getCommandLength();
        },
        pushDrawCommand: function (command, hasDrawFuns) {
            this._drawCommand.push(command, hasDrawFuns);
        },
        setDrawIndex: function (drawIndex) {
            this._configData.DrawIndex = drawIndex;
            if (!this.isPedal()) {
                this._drawCommand.setDrawIndex(drawIndex);
            }
        },
        setPedalDrawIndex: function (pedalDrawIndex) {
            this._configData.PedalDrawIndex = pedalDrawIndex;
            if (this.isPedal()) {
                this._drawCommand.setDrawIndex(pedalDrawIndex);
            }
        },
        //显示预设4的垂足入射、反射线
        setIncidenceShortPedalView: function (width) {
            this._incidenceLine.setVisibility(true);
            this._refractionLine.setVisibility(true);

            this._incidenceLine.setWidth(width || this._configData.IncidenceLine.PedalWidth);
            if (width === this._configData.IncidenceLine.PedalWidth) {
                this._incidenceLine.setArrowPos(this._configData.IncidenceLine.PedalArrowPos);
            }
            this._refractionLine.setWidth(this._configData.RefractionLine.PedalWidth);
            this._refractionLine.setArrowPos(this._configData.RefractionLine.PedalArrowPos);
            this.resetLinePos();
        },
        isDrawIncidenceShortPedalView: function (width) {
            return !this._refractionLine.isVisibilityHidden() && !this._incidenceLine.isVisibilityHidden() && (this._incidenceLine.getWidth() === (width || this._configData.IncidenceLine.PedalWidth));
        },
        getHasDrawIncidencePoint: function () {
            return this._hsdrawIncidencePoint;
        },
        getHasDrawSectorAnimateDisappear: function () {
            return this._draw11;
        },
        getHasDrawSectorRefraction: function(){
            return this._hsdrawSectorRefraction;
        },
        getHasDrawRefractionLine: function(){
            return this._hsDrawRefractionLine;
        },
        getHasdrawInverseRefractionLine: function(){
            return this._hsdrawInverseRefractionLine;
        },
        getHasdrawMaterialObjectImagingGroup4: function(){
            return this._hsdrawMaterialObjectImagingGroup4;
        },
        getHasdrawMaterialObjectImagingGroup5: function(){
            return this._hsdrawMaterialObjectImagingGroup5;
        },
        //getHasPedalLineDraw:function(){},
        initDrawStatus: function () {
            var draw = this._configData.Draw;
            if (draw) {
                this._hsdrawIncidencePoint = draw.incidencePoint;
                this._draw11 = draw.sectorAnimateDisappear;
                this._hsdrawSectorRefraction = draw.sectorRefraction;
                this._hsDrawRefractionLine = draw.refractionLine;
                this._hsdrawInverseRefractionLine = draw.inverserefractionline;
                this._hsdrawMaterialObjectImagingGroup4 = draw.materialObjectImagingGroup4;
                this._hsdrawMaterialObjectImagingGroup5 = draw.materialObjectImagingGroup5;
                if (typeof draw.hasNext !== typeof  undefined) {
                    this._hasDrawNext = draw.hasNext;
                }
            }
        }
    };

    return LightComplexDraw;
});
/**
 * Created by ylf on 2016/8/22.
 */
define('js/refractor/lightComplexRef/event', ['js/view/sector'], function (Sector) {

    var LightComplexEvent = {
        surfaceAngleVisibleHandler: function (visible) {
            this.setSectorVisibilityByOutSideLogic(Sector.Type.SurfaceIn, visible);
            this.setSectorVisibilityByOutSideLogic(Sector.Type.SurfaceOut, visible);
        },
        normalAngleVisibleHandler: function (visible) {
            this.setSectorVisibilityByOutSideLogic(Sector.Type.Incidence, visible);
            if(this._curRefAngle != "no_refract"){ //折射角这时候不控制
                this.setSectorVisibilityByOutSideLogic(Sector.Type.Refraction, visible);
            }

        },
        setNameVisible: function (visible) {
            this._incidenceLine.setNameVisible(visible);
            this._refractionLine.setNameVisible(visible);
            this.getNameGroup().setNameVisible(visible);
            this._normalLine.setNameVisible(visible);
        },
        nameVisibleHandler: function (visible) {
            this.setNameVisible(visible);
        }

    };

    return LightComplexEvent;
});
/**
 * Created by ylf on 2016/8/22.
 */
define('js/refractor/lightComplexRef/main', ['js/reflector/baseReflector', 'js/utils/utils', 'js/utils/graphMath', 'js/config/style', 'js/config/eventKey', 'js/utils/view', 'js/utils/svg'], function (BaseReflector, Utils, GraphMath, Style, EventKey, View, Svg) {

    //view
    var BaseView = require('js/view/BaseView');
    var Sector = require('js/view/sector');
    var LightLine = require('js/view/LightLine');
    var NormalLine = require('js/view/NormalLine');
    var InverseRefractionLine = require('js/view/InverseRefractionLine');
    var NameGroup = require('js/view/NameGroup');
    var PedalLine = require('js/view/PedalLine');
    var DrawCommand = require('js/utils/DrawCommand');

    //var MinAngle = 5;

    var IncidencePointStyle = Style.IncidencePoint;


    var Config = {
        onLightMove: null,
        onLightTrans: null,
        IncidenceLine: {
            width: 250,//整体长度
            arrowPos: 145,//箭号所在位置
            defaultAngle: 50,//默认角度
            visible: true,//是否显示
            clickAble: true,//是否允许点击和移动
            rotateFixed: true,//是否旋转时，固定不动
            PedalWidth: 250,//垂足显示时的长度
            PedalArrowPos: 150,//垂足显示时箭头位置
            rotateFixedAfterDraw: false,//一步完成、或逐步画开始后，不跟随反射面移动而移动
            highLineZIndex: false,//反射和入射线中是否层级更高
            nameEnable: true,//是否需要名称支持
            arrowVisible: true//是否显示箭头
        },
        RefractionLine: {
            width: 250,
            arrowPos: 73,
            visible: true,
            clickAble: true,
            rotateFixed: false,
            PedalWidth: 250,//垂足显示时的长度
            PedalArrowPos: 150,//垂足显示时箭头位置
            rotateFixedAfterDraw: false,
            nameEnable: true,
            arrowVisible: true
        },
        NormalLine: {
            width: 470,
            lineVisible: false,
            pointNameVisible: false,
            visible: true
        },
        InverseRefractionLine: {
            width: 310,
            lineVisible: false,
            pointNameVisible: false,
            visible: true
        },
        Sector: {
            sectorInVisible: false,
            sectorOutVisible: false,
            incidenceVisible: true,
            refractionVisible: true,
            incidenceR: 70,
            refractionR: 70,
            surfaceR: 60
        },
        IncidencePointVisible: false,
        PedalLineVisible: false,
        IncidencePosX: 0,//入射点位置
        IncidencePosY: 0,//入射点位置
        DrawIndex: [0, 1, 2, 3],//绘制动画内容和顺序
        PedalDrawIndex: [[0, 1], [5, 6], [10]],//TODO:反射镜=入射角的还未处理//绘制动画内容和顺序
        NoRefracDrawIndex: [[0, 1, 3], [4, 5, 6]],
        Visible: true,
        view90PedalLineVisible: true,//处理垂足时候显示垂足符号
        nameEventEnable: true,//名称显示事件支持
        Lines: [
            //第一次设置
            //{aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 120, y: 435},{x: 1300, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true}
            //修改需求
            {aPoint: {x: 0, y: 435}, bPoint: {x: 1420, y: 435}, degree: 0, range: [{x: 1420/2, y: 435},{x: 1420/2, y: 435}], refractivity1: 1, refractivity2: 1.333, transAble: true, pedalLineAngle: 90}
            //{aPoint: {x: 0, y: 435 - 200}, bPoint: {x: 0, y: 396+435}, degree: 90, range: [{x: 0, y: 435},{x: 0, y: 396+435}], refractivity1: 1, refractivity2: 1.333, transAble: false},
            //{aPoint: {x: 1422, y: 435 - 200}, bPoint: {x: 1420, y: 435+396}, degree: 90, range: [{x: 1420, y: 435},{x: 1420, y: 435+396}], refractivity1: 1, refractivity2: 1.333, transAble: false}
        ],
        //_TYPE: 1,
        _curLineIndex: 0
    };

    var LightComplex = BaseView({
        _data: null,
        _configData: null,
        _onLightMove: null,
        _onLightTrans: null,
        _onLightFocusBlur: null,
        _option: null,
        _linePedalChangeLock: false,
        _hasDrawNext: true,//是否还有下一步
        _surfaceLines: [],
        _surfacelinesKb: [],
        _curLineIndex: 0,
        create: function (eventBus, configData, onLightMove, onLightTrans, onLightFocusBlur, option) {
            var instance = Object.create(this);
            instance._uuid = Utils.getUuid();
            instance._configData = $.extend(true, {}, Config, configData);
            instance._configData.DrawIndex = $.extend(true, [], configData.DrawIndex || Config.DrawIndex);
            instance._configData.PedalDrawIndex = $.extend(true, [], configData.PedalDrawIndex || Config.PedalDrawIndex);
            instance._configData.NoRefracDrawIndex = $.extend(true, [], configData.NoRefracDrawIndex || Config.NoRefracDrawIndex);
            //事件绑定
            var eventsInfo = [];
            eventsInfo.push({key: EventKey.SurfaceAngleVisible, callback: 'surfaceAngleVisibleHandler', params: []});
            eventsInfo.push({key: EventKey.NormalAngleVisible, callback: 'normalAngleVisibleHandler', params: []});
            if (instance._configData.nameEventEnable) {
                eventsInfo.push({key: EventKey.NameVisible, callback: 'nameVisibleHandler', params: []});
            }
            eventsInfo.push({key: EventKey.ZIndexChange, callback: 'zIndexChangeHandler', params: []});
            instance.__base(eventBus, eventsInfo);
            instance.__proxyAll(['onLightMove', 'onLightTrans', 'onLightFocusBlur']);//绑定this指针

            instance._surfacelinesKb = [];
            instance._surfaceLines = [];
            instance._sectorState = {
                incidenceSector: false,
                refractionSector: false
            };
            instance._option = option;
            instance._onLightMove = onLightMove;
            instance._onLightTrans = onLightTrans;
            instance._onLightFocusBlur = onLightFocusBlur;
            instance._drawCommand = DrawCommand.create();
            instance._drawCommand.setDrawIndex(instance._configData.DrawIndex);
            instance.createView();
            instance.initVisibleState();
            instance.initDrawCommand();
            instance.initDomEvent();
            instance._surfaceLines = instance._configData.Lines;
            instance._curLineIndex = instance._configData._curLineIndex;
            return instance;
        },
        createView: function () {
            var configData = this._configData;
            var appendPosX = 0;//内部偏移坐标
            //夹角扇面和名称
            this.createSector(appendPosX);
            //反射、入射线
            this._refractionLine = LightLine.create(this.__getEventBus(), LightLine.Type.RefractionLine, configData.RefractionLine, this.onLightMove, this.onLightTrans, this.onLightFocusBlur, this._option.langData);
            this._incidenceLine = LightLine.create(this.__getEventBus(), LightLine.Type.IncidenceLine, configData.IncidenceLine, this.onLightMove, this.onLightTrans, this.onLightFocusBlur, this._option.langData);

            //法线
            this._normalLine = NormalLine.create(configData.NormalLine.width, this._option.langData);

            //反向折射线
            this._inverseRefractionLine = InverseRefractionLine.create(configData.InverseRefractionLine.width);

            //垂足符号
            this._pedalLine = PedalLine.create();

            this.appendSector();

            this.addShape(this._normalLine.getView());
            this.addShape(this._inverseRefractionLine.getView());
            if (configData.IncidenceLine.highLineZIndex) {
                this.addShape(this._refractionLine.getView());
                this.addShape(this._incidenceLine.getView());
            } else {
                this.addShape(this._incidenceLine.getView());

                this.addShape(this._refractionLine.getView());
            }

            this.addShape(this._pedalLine.getView());

            var translateX = -(Math.abs(appendPosX - configData.IncidenceLine.width));
            var refractionTranslateX = -(Math.abs(appendPosX - configData.RefractionLine.width));
            var translateY = -1;//向上偏移一个像素，防止底部突出
            var normalTranslateX = -(Math.abs(appendPosX - configData.NormalLine.width));
            var inverseRefractionTranslateX = -(Math.abs(appendPosX - configData.InverseRefractionLine.width));

            this._incidenceLine.setTranslate(translateX, translateY);
            this._incidenceLine.setRotate(configData.IncidenceLine.defaultAngle);
            this._normalLine.setTranslate(normalTranslateX / 2, 1);
            //this._inverseRefractionLine.setRotate(configData.InverseRefractionLine.defaultAngle);

            this._refractionLine.setTranslate(refractionTranslateX, translateY);
            this._inverseRefractionLine.setTranslate(inverseRefractionTranslateX, 0);

            //定位到入射点
            this.setTranslate(this._configData.IncidencePosX, this._configData.IncidencePosY);

            //入射点
            this._$$incidencePoint = new kity.Circle(IncidencePointStyle.width).fill(IncidencePointStyle.fill);
            this._$$incidencePoint.setTranslate(this._configData.IncidencePosX, this._configData.IncidencePosY);

            /*移动的线*/
            this._surfaceLines = this._configData.Lines;
            for (var i = 0; i < this._surfaceLines.length; i++) {
                this._surfaceLines[i].degree = (this._surfaceLines[i].degree + 360) % 360;
                this._surfacelinesKb[i] = GraphMath.getLineKb(this._surfaceLines[i].degree, this._surfaceLines[i].aPoint);
            }
            this._curLineIndex = this._configData._curLineIndex;
        },
        initVisibleState: function () {

            var configData = this._configData;
            this.initSectorVisibleState();
            this.surfaceAngleVisibleHandler(this._option.surfaceAngleVisible);
            this.normalAngleVisibleHandler(this._option.normalAngleVisible);
            this.nameVisibleHandler(this._option.nameVisible);

            this._normalLine.setVisibility(configData.NormalLine.visible);
            this._pedalLine.setVisibility(configData.PedalLineVisible);
            this._inverseRefractionLine.setLineVisibility(false, configData.InverseRefractionLine.lineVisible);

            View.setVisibility(this._$$incidencePoint, configData.IncidencePointVisible);

            this._normalLine.setPointNameVisibility(this._option.nameVisible, configData.NormalLine.pointNameVisible);
            this._normalLine.setLineVisibility(this._option.nameVisible, configData.NormalLine.lineVisible);
        },



        gtIndexAppendToView: function ($$container) {
            $$container.addShape(this._$$incidencePoint);
            this.gtIndexSectorAppendToView($$container);
            //this._incidenceLine.gtIndexBtnAppendToView($$container);
        },
        resetAngle: function (surfaceAngle, init) {
            surfaceAngle = surfaceAngle < 0 ? (surfaceAngle + 360) % 360 : surfaceAngle % 360;
            this._surfaceAngle = surfaceAngle;
            this._surfaceAngle %= 360;

            //var incidenceAngle = this._incidenceLine.getRotateAngle();
            var incidenceAngleBac = this._incidenceLine.getRotateAngle() ? this._incidenceLine.getRotateAngle(): 0 ;
            //console.log("incidenceAngleBac = "+incidenceAngleBac);
            var incidenceAngle = (incidenceAngleBac - surfaceAngle) > 360 ? (incidenceAngleBac % 360) : (incidenceAngleBac - surfaceAngle) < 0 ? incidenceAngleBac + 360 : incidenceAngleBac;
            if (incidenceAngle <= (180 + this._surfaceLines[this._curLineIndex].degree)) {
                this.refractivity = parseFloat(this._surfaceLines[this._curLineIndex].refractivity2 / this._surfaceLines[this._curLineIndex].refractivity1);
            } else {
                this.refractivity = parseFloat(this._surfaceLines[this._curLineIndex].refractivity1 / this._surfaceLines[this._curLineIndex].refractivity2);
            }

            var angle = [];
            var negative = false;

            var incidenceAngleAbs = incidenceAngle - surfaceAngle;
            var startAngle = surfaceAngle;
            var angle90 = 90 + surfaceAngle;
            var angle180 = 180 + surfaceAngle;
            var angle270 = 270 + surfaceAngle;
            var angle540 = 540 + surfaceAngle;

            this._incidenceLine.setRotate(incidenceAngle);
            this._normalLine.setRotate(angle90, this._configData.NormalLine.width / 2, 0);
            // this._normalLine.setTranslate(-this._configData.NormalLine.width/2, 0);

            this._pedalLine.setRotate(this._surfaceLines[this._curLineIndex].pedalLineAngle);

            //if(incidenceAngleAbs > 180){


            //    this._pedalLine.setRotate(180+surfaceAngle);
            //}

            //以下为折射角大于90度是变成全反射的解决
            var curRefAngle = GraphMath.getRefractAngle(incidenceAngleAbs, this.refractivity);
            var normalAngle = this._normalLine.getRotateAngle();
            //0°不显示折射
            //精确到小数点后一位
            if (Math.abs(Math.round(incidenceAngleBac - normalAngle)) === 90 || Math.abs(Math.round(incidenceAngleBac - normalAngle)) === 270) {
                curRefAngle = 'no_refract';
                incidenceAngle = Math.round(incidenceAngle);
            }
            //if (this.isPedal()){
            //    incidenceAngle = Math.round(incidenceAngle);
            //    curRefAngle = 0;
            //}

            var refractRotate;
            if (curRefAngle !== "no_refract") {//折射角存在
                //this._refractionLine.setVisibility(true);
                //this._refractionSector.setVisibility(true);
                //this._nameGroup.setNameAngleVisibleByType(Sector.Type.Refraction, true);
                if (incidenceAngleAbs <= 90) {
                    angle = [startAngle, incidenceAngle, angle90, angle270 - curRefAngle, angle270];
                    refractRotate = angle[3];
                } else if (incidenceAngleAbs > 90 && incidenceAngleAbs <= 180) {
                    angle = [startAngle, angle90, incidenceAngle, angle270, angle270 + curRefAngle];
                    refractRotate = angle[4];
                } else if (incidenceAngleAbs > 180 && incidenceAngleAbs <= 270) {
                    angle = [startAngle, incidenceAngle, angle270, angle90 - curRefAngle, angle90];
                    refractRotate = angle[3];
                } else if (incidenceAngleAbs > 270 && incidenceAngleAbs <= 360) {
                    angle = [startAngle, angle270, incidenceAngle, angle90, angle90 + curRefAngle];
                    refractRotate = angle[4];
                }

            } else { //折射角不存在
                //this._refractionLine.setVisibility(false);
                //this._refractionSector.setVisibility(false);
                //this._nameGroup.setNameAngleVisibleByType(Sector.Type.Refraction, false);

                if (incidenceAngleAbs <= 90) {
                    angle = [startAngle, incidenceAngle, angle90, angle90, angle180 - incidenceAngleAbs];
                    refractRotate = angle[4];
                } else if (incidenceAngleAbs > 90 && incidenceAngleAbs <= 180) {
                    angle = [startAngle, angle90, incidenceAngle, angle180 - incidenceAngleAbs, angle90];
                    refractRotate = angle[3];
                } else if (incidenceAngleAbs > 180 && incidenceAngleAbs <= 270) {
                    angle = [startAngle, incidenceAngle, angle270, angle270, angle540 - incidenceAngleAbs];
                    refractRotate = angle[4];
                } else if (incidenceAngleAbs > 270 && incidenceAngleAbs <= 360) {
                    angle = [startAngle, angle270, incidenceAngle, angle540 - incidenceAngleAbs, angle270];
                    refractRotate = angle[3];
                }
            }

            this._inverseRefractionLine.setRotate((refractRotate + 180) % 360);
            this._curRefAngle = curRefAngle;

            //围绕线底部，中心轴旋转
            if (this._configData.IncidenceLine.rotateFixed) {
                // this._reflectionLine.setRotate(holdAngle - (incidenceAngle - surfaceAngle));
                this._refractionLine.setRotate(refractRotate);
            }

            //重置扇面角度相关
            this.resetSectorAngle(this._normalLine.getRotateAngle(), negative, angle);

            //设置动画内容
            //this._drawCommand.setDrawIndex(this.isPedal() ? this._configData.PedalDrawIndex : this._configData.DrawIndex);
            if (this.isPedal() && !this._incidenceLine.isVisibilityHidden()) {  //是垂直模式，并且入射线显示（判断第二模块也是垂直的情况，即场景2，不显示第二模块的垂足）
                this._drawCommand.setDrawIndex(this._configData.PedalDrawIndex);
                if (incidenceAngleAbs > 180) {
                    this._pedalLine.setRotate(180 + surfaceAngle);
                }
                //90度时显示垂足符号
                if (this._configData.view90PedalLineVisible) {
                    this._pedalLine.setVisibility(true);
                }
            } else {
                if (this._curRefAngle == "no_refract") {
                    this._drawCommand.setDrawIndex(this._configData.NoRefracDrawIndex); //无折射
                } else {
                    this._drawCommand.setDrawIndex(this._configData.DrawIndex);  //正常折射
                }
                //法线和垂足符号是一起显示的
                this._pedalLine.setVisibility(this._normalLine.getLineVisible());
            }

            if (this._curRefAngle != "no_refract") {
                //this.setRefractVisibility(true);
                //this.setRefractionLineVisible(true);
                if (this._option.normalAngleVisible && this._hsdrawSectorRefraction) {//外部控制显示了
                    //this.setRefractionPartVisibility(true);
                    this.setSectorVisibilityByType(Sector.Type.Refraction, true);
                    this.syncSectorVisibilityByName();
                }
                if (this._hsDrawRefractionLine) {
                    this._refractionLine.setVisibility(true);
                }
                // this.setSectorVisibilityByType(Sector.Type.Incidence, true);

            } else if (this._curRefAngle == "no_refract") {
                this.setRefractionPartVisibility(false);
                //强制隐藏状态
                //this.getNameGroup().setHasDrawStatusByType(false, Sector.Type.Refraction);
            }

            //this.setIncidence0180View();
            //是否显示垂足

            this.resetLinePos();
            this.resetPedalRotateAngle();
        },
        //设置垂足角度
        resetPedalRotateAngle: function(){
            var that = this;
            var originalPosSvg = Svg.getAttrTranslate($(that._$$incidencePoint.node).attr("transform"));
            if (originalPosSvg.length == 0) {
                originalPosSvg = [0, 0];
            }
            var point = {x: originalPosSvg[0], y: originalPosSvg[1]};
            var leftDis = GraphMath.getTwoPointDistance(point, that._surfaceLines[that._curLineIndex].aPoint);
            var rightDis = GraphMath.getTwoPointDistance(point, that._surfaceLines[that._curLineIndex].bPoint);
            var _pedalLineAngle = (this._pedalLine.getRotateAngle()[0] - this._surfaceAngle) < 0 ?(this._pedalLine.getRotateAngle()[0] - this._surfaceAngle+360): (this._pedalLine.getRotateAngle()[0] - this._surfaceAngle);
            if(leftDis <= 40){
                if(_pedalLineAngle == 0){
                    this._pedalLine.setRotate(90+ this._surfaceAngle);
                }else if(_pedalLineAngle == 270){
                    this._pedalLine.setRotate(180 + this._surfaceAngle);
                }
            }else if(rightDis <= 40){
                if(_pedalLineAngle == 90){
                    this._pedalLine.setRotate(0+ this._surfaceAngle);
                }else if(_pedalLineAngle == 180){
                    this._pedalLine.setRotate(270 + this._surfaceAngle);
                }
            }
        },
        getMoveRotateAngle: function (data) {
            var currentPos = data.currentPos;
            var lastPos = data.lastPos;
            var originalPos;
            var offset = $(this._$$incidencePoint.node).offset();
            originalPos = {
                x: offset.left,
                y: offset.top
            };
            return GraphMath.getRotateAngle(originalPos, lastPos, currentPos);
        },
        onLightMove: function (lightType, data, eventType) {
            if (eventType === 'beforemove') {
                //this._isPedal = this.isPedal();
            } else if (eventType === 'aftermove') {
                //让角度自动吸附90° 和0°
                this.adsorptionPedal();
            } else if (eventType === 'move') {
                var angle = this.getMoveRotateAngle(data);
                //反射线角度是相反的
                //if (lightType === LightLine.Type.ReflectionLine) {
                //    angle = -angle;
                //}
                if (this.lineRotateAble(angle)) {
                    if (this._configData.IncidenceLine.rotateFixed) {
                        this._incidenceLine.rotate(angle);
                    } //else if (this._configData.ReflectionLine.rotateFixed) {
                    //    this._reflectionLine.rotate(-angle);
                    //}
                    else {
                        this._incidenceLine.rotate(angle);
                    }

                    this.resetAngle(this._surfaceAngle);
                    this._onLightMove(this.getUuid(), angle, this._curLineIndex);
                }
            }
        },
        /**
         * 根据某条先算出该线的偏移值
         * curLineIndex: 哪条线
         * xDis, yDis, 偏移值
         */
        countLineXY: function (curLineIndex, xDis, yDis) {
            var that = this;
            if (that._surfacelinesKb[curLineIndex].degree <= 45 || that._surfacelinesKb[curLineIndex].degree >= 315) {
                yDis = xDis * that._surfacelinesKb[curLineIndex].k;
            } else {
                if (that._surfacelinesKb[curLineIndex].k != "no_exist") {
                    xDis = yDis / that._surfacelinesKb[curLineIndex].k;
                } else {
                    //xDis = that._surfacelinesKb[curLineIndex].x;
                    xDis = 0;
                }
            }
            return {
                xDis: xDis,
                yDis: yDis
            }

        },
        /**
         * 平移
         * lightComplex 在某条线段上移动
         * tranBtnTran: 移动按钮偏移值
         */
        onLightTrans: function (lightType, data, eventType) {
            var that = this;
            var scale = this._incidenceLine.getScale();
            if (eventType === 'beforemove') {
                //this._isPedal = this.isPedal();
            } else if (eventType === 'aftermove') {
                //让角度自动吸附90°
                // this.setAngleToPedal();
                var originalPosSvg = Svg.getAttrTranslate($(that._$$incidencePoint.node).attr("transform"));
                if (originalPosSvg.length == 0) {
                    originalPosSvg = [0, 0];
                }
                var point = {x: originalPosSvg[0], y: originalPosSvg[1]};
                //alert(originalPosSvg[0]+" ,"+originalPosSvg[1]);
                if (GraphMath.isInSegment(point, that._surfaceLines[that._curLineIndex].range[0], that._surfaceLines[that._curLineIndex].range[1])) {
                } else {
                    var leftDis = GraphMath.getTwoPointDistance(point, that._surfaceLines[that._curLineIndex].range[0]), rightDis = GraphMath.getTwoPointDistance(point, that._surfaceLines[that._curLineIndex].range[1]);
                    if (leftDis <= rightDis) {
                        //xRel = that._surfaceLines[that._curLineIndex].range[0].x;
                        //yRel = that._surfaceLines[that._curLineIndex].range[0].y;
                        point = that._surfaceLines[that._curLineIndex].range[0];
                    } else {
                        //xRel = that._surfaceLines[that._curLineIndex].range[1].x;
                        //yRel = that._surfaceLines[that._curLineIndex].range[1].y;
                        point = that._surfaceLines[that._curLineIndex].range[1];
                    }
                    that.setGroupTranslate(point.x, point.y);
                    that.resetAngle(that._surfaceLines[that._curLineIndex].degree);
                    that._onLightTrans(that.getUuid(), xRel, yRel, that._curLineIndex);
                }

            } else if (eventType === 'move') {
                var originalPosSvg = Svg.getAttrTranslate($(that._$$incidencePoint.node).attr("transform"));
                if (originalPosSvg.length == 0) {
                    originalPosSvg = [0, 0];
                }
                var lastPos = data.lastPos;

                var currentPos = data.currentPos;
                var xDis = currentPos.x - lastPos.x, yDis = currentPos.y - lastPos.y;

                xDis = xDis / scale;
                yDis = yDis / scale;
                var lineXY, xRel, yRel;
                lineXY = that.countLineXY(that._curLineIndex, xDis, yDis);
                xRel = originalPosSvg[0] + lineXY.xDis * 1420 / 1600;
                yRel = originalPosSvg[1] + lineXY.yDis * 9 / 10;
                var point = {x: xRel, y: yRel};
                var leftDis, rightDis;
                leftDis = GraphMath.getTwoPointDistance(point, that._surfaceLines[that._curLineIndex].aPoint);
                rightDis = GraphMath.getTwoPointDistance(point, that._surfaceLines[that._curLineIndex].bPoint);
                if (GraphMath.isInSegment(point, that._surfaceLines[that._curLineIndex].aPoint, that._surfaceLines[that._curLineIndex].bPoint)) {
                    that.setGroupTranslate(xRel, yRel);
                    that.resetAngle(that._surfaceLines[that._curLineIndex].degree);
                    that._onLightTrans(that.getUuid(), xRel, yRel, that._curLineIndex);
                } else {
                    var lineNext;
                    if (leftDis <= rightDis) {
                        lineNext = GraphMath.inWhichLine(that._surfaceLines[that._curLineIndex].aPoint, that._surfaceLines, that._curLineIndex);
                    } else {
                        lineNext = GraphMath.inWhichLine(that._surfaceLines[that._curLineIndex].bPoint, that._surfaceLines, that._curLineIndex);
                    }
                    if(lineNext != -1) {
                        that._curLineIndex = lineNext;
                        var leftDisNew = GraphMath.getTwoPointDistance(point, that._surfaceLines[lineNext].range[0]);
                        var rightDisNew = GraphMath.getTwoPointDistance(point, that._surfaceLines[lineNext].range[1]);
                        if (leftDisNew <= rightDisNew) {
                            xRel = that._surfaceLines[lineNext].range[0].x;
                            yRel = that._surfaceLines[lineNext].range[0].y;
                        } else {
                            xRel = that._surfaceLines[lineNext].range[1].x;
                            yRel = that._surfaceLines[lineNext].range[1].y;
                        }
                        that.setGroupTranslate(xRel, yRel);
                        that.resetAngle(that._surfaceLines[that._curLineIndex].degree);
                        that._onLightTrans(that.getUuid(), xRel, yRel, that._curLineIndex);
                    }else{
                        xRel = that._surfaceLines[that._curLineIndex].range[0].x;
                        yRel = that._surfaceLines[that._curLineIndex].range[0].y;

                        //$(this.getView().node).closest('._refraction').trigger('mouseup');
                        //$(this.getView().node).closest('._refraction').trigger('touchend');
                    }
                }

            }
        },
        /**
         * 点击线的时候，控制外面的背景
         */
        onLightFocusBlur: function (type) {
            this._onLightFocusBlur(type);
        },

        /**
         * 度数精确到小数点后一位，不用吸附0度
         */
        setIncidence0180View: function () {
            var angle = Math.round(this.getSectorAngle(Sector.Type.Incidence));
            if (angle === 0 || angle === 90) {
                this.setSectorVisibility(false);
                //90度时显示垂足符号
                if (this._configData.view90PedalLineVisible) {
                    if (angle === 0) {
                        this._pedalLine.setVisibility(true);
                    } else {
                        //法线和垂足符号是一起显示的
                        this._pedalLine.setVisibility(this._normalLine.getLineVisible());
                    }
                }
                if (!this._incidenceLine.isVisibilityHidden() && !this._refractionLine.isVisibilityHidden() && !this._linePedalChangeLock) {
                    this._incidenceLine.setWidth(this._configData.IncidenceLine.PedalWidth);
                    this._incidenceLine.setArrowPos(this._configData.IncidenceLine.PedalArrowPos);
                    this._refractionLine.setWidth(this._configData.RefractionLine.PedalWidth);
                    this._refractionLine.setArrowPos(this._configData.RefractionLine.PedalArrowPos);
                }
            } else {
                //和名称同步
                this.syncSectorVisibilityByName();
                if (this._configData.view90PedalLineVisible) {
                    this._pedalLine.setVisibility(this._normalLine.getLineVisible());
                }
                if (!this._incidenceLine.isVisibilityHidden() && !this._refractionLine.isVisibilityHidden() && !this._linePedalChangeLock) {
                    this._incidenceLine.setWidth(this._configData.IncidenceLine.width);
                    this._incidenceLine.setArrowPos(this._configData.IncidenceLine.arrowPos);
                    this._refractionLine.setWidth(this._configData.RefractionLine.width);
                    this._refractionLine.setArrowPos(this._configData.RefractionLine.arrowPos);
                }
            }
        },
        setIncidencePos: function (x, y) {
            //定位到入射点
            this._configData.IncidencePosX = x;
            this.setTranslate(this._configData.IncidencePosX, this._configData.IncidencePosY);
            this._$$incidencePoint.setTranslate(this._configData.IncidencePosX, this._configData.IncidencePosY);
            this.getNameGroup().setTranslate(this._configData.IncidencePosX, this._configData.IncidencePosY);
        },
        getIncidencePosX: function () {
            return this._configData.IncidencePosX;
        },
        //内部线条是否可移动
        lineRotateAble: function (angle) {
            if (this._incidenceLine.getRotateAngle() > this._normalLine.getRotateAngle()) {
                angle = -angle;
            }
            var surfaceInSectorAngle = this.getSectorAngle(Sector.Type.SurfaceIn);
            //if (surfaceInSectorAngle + angle < MinAngle) {
            //    return false;
            //}
            return true;
        },
        //整个光组件是否可移动
        complexRotateAble: function (angle) {
            if (!this._configData.IncidenceLine.rotateFixed && !this._configData.RefractionLine.rotateFixed) {
                return true;
            }
            //根据相对固定的光线来进行判断
            if (this._incidenceLine.getRotateAngle() > this._normalLine.getRotateAngle()) {
                if (this._configData.IncidenceLine.rotateFixed) {
                    angle = angle;
                } else if (this._configData.RefractionLine.rotateFixed) {
                    angle = -angle;
                }
            } else {
                if (this._configData.IncidenceLine.rotateFixed) {
                    angle = -angle;
                } else if (this._configData.RefractionLine.rotateFixed) {
                    angle = angle;
                }
            }
            var surfaceInSectorAngle = this.getSectorAngle(Sector.Type.SurfaceIn);
            if (surfaceInSectorAngle + angle < MinAngle) {
                return false;
            }
            return true;
        },
        /**
         * 旋转到指定角度和位置
         * @param surfaceAngle
         * @param surfaceRotateX 旋转点
         * @param marginX 便宜量
         */
        around: function (surfaceAngle, surfaceRotateX, marginX) {
            marginX = marginX || 0;
            //这边可通过画图来求解坐标关系，最终求的是离圆心的坐标位置

            //计算围绕旋转的半径
            var r = Math.abs(surfaceRotateX - this._configData.IncidencePosX);

            //求出该圆点所在坐标
            var pos = GraphMath.getSpherePos(surfaceAngle || 0, r);
            //计算离坐标原点的距离
            var x, y;
            if (surfaceRotateX > this._configData.IncidencePosX) {
                //点在旋转中小左侧
                x = surfaceRotateX + (-pos.x);//因为角度变成了负数，计算的时目标位置与x轴对称的值
                y = pos.y;
            } else {
                //点在旋转中小右侧
                x = pos.x + surfaceRotateX;
                y = -pos.y;
            }

            //设置偏移量，svgtranslate,y坐标和坐标系相反
            this.setTranslate(x + marginX, -y);
            this._$$incidencePoint.setTranslate(x + marginX, -y);
            this.getNameGroup().setTranslate(x + marginX, -y);
        },
        getData: function () {
            var that = this;
            var originalPosSvg = Svg.getAttrTranslate($(that._$$incidencePoint.node).attr("transform"));
            var defaultAngle = that.getSectorAngle(Sector.Type.SurfaceIn);
            if (this._normalLine.getRotateAngle() < this._incidenceLine.getRotateAngle()) {
                defaultAngle = 180 - defaultAngle;
            }
            var data = {
                IncidenceLine: {
                //    width: that._incidenceLine.getWidth(),//整体长度
                    defaultAngle: that._incidenceLine.getRotateAngle(),//默认角度
                    visible: !that._incidenceLine.isVisibilityHidden()//是否显示
                },
                RefractionLine: {
             //       width: that._refractionLine.getWidth(),
                    visible: !that._refractionLine.isVisibilityHidden()
                },
                NormalLine: {
                    pointNameVisible: that._normalLine.getPointNameVisible(),
                    lineVisible: that._normalLine.getLineVisible()
                },
                InverseRefractionLine: {
                    pointNameVisible: that._inverseRefractionLine.getPointNameVisible(),
                  //  lineVisible: that._inverseRefractionLine.getLineVisible()
                    lineVisible: !that._inverseRefractionLine.isVisibilityHidden() && that.getHasdrawInverseRefractionLine()
                },
                Sector: {
                    sectorInVisible: that.getSectorOutSideVisibilityByType(Sector.Type.SurfaceIn),
                    sectorOutVisible: that.getSectorOutSideVisibilityByType(Sector.Type.SurfaceOut),
                    incidenceVisible: that.getSectorOutSideVisibilityByType(Sector.Type.Incidence),
                    refractionVisible: that.getSectorOutSideVisibilityByType(Sector.Type.Refraction),
                    hasDraw: that.getSectorHasDraw()
                },
                //IncidencePointVisible: !View.isVisibilityHidden(that._$$incidencePoint),

                Draw: {
                    hasNext: that.hasNextWidthOutVisibilityStatus(),
                    incidencePoint: that.getHasDrawIncidencePoint(),
                    sectorAnimateDisappear: that.getHasDrawSectorAnimateDisappear(),
                    sectorRefraction: that.getHasDrawSectorRefraction(),
                    refractionLine: that.getHasDrawRefractionLine(),
                    inverserefractionline: that.getHasdrawInverseRefractionLine(),
                    materialObjectImagingGroup4: that.getHasdrawMaterialObjectImagingGroup4(),
                    materialObjectImagingGroup5: that.getHasdrawMaterialObjectImagingGroup5()
                },
                PedalLineVisible: !that._pedalLine.isVisibilityHidden(),
                IncidencePosX: originalPosSvg[0], //入射点位置TODO:这个需要动态计算，暂时写死
                IncidencePosY: originalPosSvg[1],
                Visible: !that.isVisibilityHidden(),
                _curLineIndex: that._curLineIndex

            };
            return data;
        },
        //90°时自动吸附
        //角度用小数点显示，去掉吸附
        adsorptionPedal: function () {
            if (this.isPedal()) {
                var normalLineAngle = this._normalLine.getRotateAngle();
                //垂足
                var incidenceAngle = this._incidenceLine.getRotateAngle();

                if (Math.abs(normalLineAngle % 360 - incidenceAngle % 360) > 90) {
                    this._refractionLine.setRotate(normalLineAngle);
                    this._incidenceLine.setRotate(normalLineAngle + 180);
                } else {
                    this._incidenceLine.setRotate(normalLineAngle);
                    this._refractionLine.setRotate(normalLineAngle + 180);
                }

                this.resetAngle(normalLineAngle - 90);
            } else if (Math.round(this.getSectorAngle(Sector.Type.Incidence)) === 90) {
                var incidenceAngle = this._incidenceLine.getRotateAngle() % 360;
                var normalLineAngle = this._normalLine.getRotateAngle() % 360;
                //右侧
                if (Math.abs(incidenceAngle - normalLineAngle - 90) <= 2) {
                    this._incidenceLine.setRotate(normalLineAngle + 90);
                } else {
                    this._incidenceLine.setRotate(normalLineAngle - 90);
                }
            }
        },
        //是否垂足
        isPedal: function () {
            return Math.round(this.getSectorAngle(Sector.Type.Incidence)) === 0;
            //var normalLineAngle = this._normalLine.getRotateAngle();
            //var inverseRefractionLineAngle = this._inverseRefractionLine.getRotateAngle();
            //var incidenceAngle = this._incidenceLine.getRotateAngle();
            //return Math.round(normalLineAngle % 180) === Math.round(incidenceAngle % 180);
        },
        initDomEvent: function () {
            this.bindDomEvent(this.getView().node, ['lrTap'], this.getUuid(), this.domEventHandler);
        },
        setViewTapListener: function (callback) {
            this._onViewClickListener = callback;
        },
        domEventHandler: function (uuid) {
            this._onViewClickListener && this._onViewClickListener(uuid);
        },
        changeTransparent: function (show) {
            //option = option || {};
            //option.incidenceName = typeof option.incidenceName === typeof  undefined ? true : option.incidenceName;//入射角名称忽略
            // var opacity = show ? 1.0 : 0.3;
            //  this._normalLine.setOpacity(opacity);
            //this._pedalLine.setOpacity(opacity);
             //this.setSectorOpacity(opacity);

            //if (show) {
            //    var $$item = $(this.getView().node).closest('._lr_item');
            //    var $surface = $$item.children('._lr_surface');
            //    $surface.last().after(this.getNameGroup().getView().node);
            //    //添加到反射面最近的一层
            //    $surface.first().before(this.getView().node);
            //    //名称放到最后
            //    $$item.children().last().after(this.getNameGroup().getView().node);
            //} else {
            //    var $first = $(this.getView().node).closest('._lr_item').children().first();
            //    $first.before(this.getNameGroup().getView().node);
            //}
        },
        setVisibility: function (visible) {
            View.setVisibility(this.getView(), visible);
            this.getNameGroup().setVisibility(visible);
        },
        setLinePedalChangeLock: function (lock) {
            this._linePedalChangeLock = lock;
        },
        getTwoLineVisible: function () {
            return !this._incidenceLine.isVisibilityHidden() && !this._refractionLine.isVisibilityHidden();
        },
        setRefractionPartVisibility: function (visible) {
            this.setRefractionLineVisible(visible);
            this.setSectorVisibilityByType(Sector.Type.Refraction, visible);
            this.syncSectorVisibilityByName();
        }

    });

    //include part api
    var draw = require('js/refractor/lightComplexRef/draw');
    var event = require('js/refractor/lightComplexRef/event');
    var proxyApi = require('js/refractor/lightComplexRef/proxyApi');
    var sector = require('js/refractor/lightComplexRef/sector');
    var namePos = require('js/refractor/lightComplexRef/namePos');
    LightComplex.__include(draw);
    LightComplex.__include(event);
    LightComplex.__include(proxyApi);
    LightComplex.__include(sector);
    LightComplex.__include(namePos);

    return LightComplex;

});
/**
 * Created by ylf on 2016/8/22.
 */
define('js/refractor/lightComplexRef/namePos', ['js/view/sector', 'js/utils/utils', 'js/utils/view', 'js/utils/graphmath', 'js/utils/svg', 'js/view/lightLine'], function (Sector, Utils, View, GraphMath, Svg, LightLine) {


    var NamePos = {
        _lastMinLine: null,
        resetLinePos: function () {
            this.initLineNamePos(this._incidenceLine);
            this.initLineNamePos(this._refractionLine);
        },
        initLineNamePos: function (line) {
          //  line.makeNameViewAround(line.getRotateAngle().toFixed(5));
            var lineAngle = new Number(line.getRotateAngle());
            line.makeNameViewAround(lineAngle.toFixed(5));

        }
    };

    return NamePos;
});

/**
 * Created by ylf on 2016/8/22.
 */
define('js/refractor/lightComplexRef/proxyApi', ['js/view/sector', 'js/utils/utils', 'js/utils/view', 'js/view/LightLine'], function (Sector, Utils, View, LightLine) {

    //将选择角度装换为0~360度
    var get0T360Angle = function (angle) {
        angle = angle % 360;
        if (angle < 0) {
            return 360 + angle;
        }
        return angle;
    };

    /**
     * 获取线针对圆的旋转角度，圆从右侧开始为0°
     * @param lineRotateAngle
     * @returns {number}
     */
    var getSphereAngle = function (lineRotateAngle) {
        var sphereAngle = (180 - lineRotateAngle % 360) % 360;
        if (sphereAngle < 0) {
            sphereAngle = 360 + sphereAngle;
        }
        return sphereAngle;
    };


    var LightComplexProxyApi = {
        setIncidenceXAxisAngle: function (angle) {
            this._incidenceLine.setRotate(angle);
        },
        getIncidenceRotateAngle: function () {
            return this._incidenceLine.getRotateAngle();
        },
        getRefractionRotateAngle: function () {
            return this._refractionLine.getRotateAngle();
        },
        setIncidenceLineWidth: function (width) {
            this._incidenceLine.setWidth(width);
        },
        setRefractionLineWidth: function (width) {
            this._refractionLine.setWidth(width);
        },
        setIncidenceLineArrowPos: function (arrowPos) {
            this._incidenceLine.setArrowPos(arrowPos);
        },
        setRefractionLineArrowPos: function (arrowPos) {
            this._refractionLine.setArrowPos(arrowPos);
        },
        setIncidenceLineCommonFill: function (common) {
            if (common) {
                this._incidenceLine.setCommonFill();
            } else {
                this._incidenceLine.restoreFill();
            }
        },
        setRefractionLineCommonFill: function (common) {
            if (common) {
                this._refractionLine.setCommonFill();
            } else {
                this._refractionLine.restoreFill();
            }
        },
        setIncidenceLineVisible: function (visible) {
            this._incidenceLine.setVisibility(visible);
        },
        setRefractionLineVisible: function (visible) {
            this._refractionLine.setVisibility(visible);
        },
        getIncidenceLineVisible: function () {
            return !this._incidenceLine.isVisibilityHidden();
        },
        getReflectionLineVisible: function () {
            return !this._reflectionLine.isVisibilityHidden();
        },
        getIncidenceSurfaceAngle: function () {
            return this.getSectorAngle(Sector.Type.Incidence);
        },
        setIncidenceNameEnable: function (nameEnable) {
            this._incidenceLine.setNameEnable(nameEnable);
        },
        setIncidenceNameVisible: function (visible) {
            this._incidenceLine.setNameVisible(visible);
            //更新名称位置
            this.resetLinePos();
        },

        getNormalLineRotateAngle: function () {
            return this._normalLine.getRotateAngle();
        },
        //获取与X轴的斜率夹角
        getIncidenceLineXAngle: function () {
            return (360 - this._incidenceLine.getRotateAngle() % 360) % 180;
        },
        //获取与X轴的斜率夹角
        getRefractionLineXAngle: function () {
            return (360 - this._refractionLine.getRotateAngle() % 360) % 180;
        },
        getNormalLineXAngle: function () {
            return (360 - this._normalLine.getRotateAngle() % 360) % 180;
        },
        getSectorInLineXAngle: function () {
            var rotate = 0;
            var lineRotate = this._incidenceLine.getRotateAngle();
            var normalRotate = this._normalLine.getRotateAngle();
            if (lineRotate > normalRotate) {
                rotate = lineRotate + this.getSectorAngle(Sector.Type.SurfaceIn);
            } else {
                rotate = lineRotate - this.getSectorAngle(Sector.Type.SurfaceIn);
            }
            return (360 - rotate % 360) % 180;
        },
        getSectorOutLineXAngle: function () {
            var rotate = 0;
            var lineRotate = this._refractionLine.getRotateAngle();
            var normalRotate = this._normalLine.getRotateAngle();
            if (lineRotate > normalRotate) {
                rotate = lineRotate + this.getSectorAngle(Sector.Type.SurfaceOut);
            } else {
                rotate = lineRotate - this.getSectorAngle(Sector.Type.SurfaceOut);
            }
            return (360 - rotate % 360) % 180;
        },
        //获取相对圆的角度
        getIncidenceLineSphereAngle: function () {
            return getSphereAngle(this._incidenceLine.getRotateAngle());
        },
        //获取与X轴的斜率夹角
        getRefractionLineSphereAngle: function () {
            return getSphereAngle(this._refractionLine.getRotateAngle());
        },
        getNormalLineSphereAngle: function () {
            return getSphereAngle(this._normalLine.getRotateAngle());
        },
        getLineXAngle: function (lineType) {
            if (lineType === LightLine.Type.IncidenceLine) {
                return this.getIncidenceLineXAngle();
            } else if (lineType === LightLine.Type.RefractionLine) {
                return this.getRefractionLineXAngle();
            }
        },
        getLine0To360RotateAngle: function (lineType) {
            var line;
            if (lineType === LightLine.Type.IncidenceLine) {
                line = this._incidenceLine;
            } else if (lineType === LightLine.Type.RefractionLine) {
                line = this._refractionLine;
            }
            return get0T360Angle(line.getRotateAngle());
        },
        //获取线旋转的象限位置
        getLineQuad: function (lineType) {
            var line, angle;
            if (lineType === LightLine.Type.IncidenceLine) {
                line = this._incidenceLine;
            } else if (lineType === LightLine.Type.RefractionLine) {
                line = this._refractionLine;
            } else if (lineType === LightLine.Type.NormalLine) {
                line = this._normalLine;
            } else if (lineType === LightLine.Type.SurfaceIn) {
                var normalRotate = this.getNormalLineRotateAngle();
                var incidenceRotate = this.getIncidenceRotateAngle();
                if (incidenceRotate < normalRotate) {
                    angle = get0T360Angle(incidenceRotate) - this.getSectorAngle(Sector.Type.SurfaceIn);
                    if (angle < 0) {
                        angle = 360 + angle;
                    }
                } else {
                    angle = get0T360Angle(incidenceRotate) + this.getSectorAngle(Sector.Type.SurfaceIn);
                    if (angle < 0) {
                        angle = 360 + angle;
                    }
                }
            } else if (lineType === LightLine.Type.SurfaceOut) {
                var normalRotate = this.getNormalLineRotateAngle();
                var refractionRotate = this.getRefractionRotateAngle();
                if (refractionRotate < normalRotate) {
                    angle = get0T360Angle(refractionRotate) - this.getSectorAngle(Sector.Type.SurfaceOut);
                    if (angle < 0) {
                        angle = 360 + angle;
                    }
                } else {
                    angle = get0T360Angle(refractionRotate) + this.getSectorAngle(Sector.Type.SurfaceOut);
                    if (angle < 0) {
                        angle = 360 + angle;
                    }
                }
            }
            //线的旋转角度都是从左侧0度开始旋转，和象限值不服，需要装换
            if (line) {
                angle = get0T360Angle(line.getRotateAngle());
            }

            if (angle >= 0 && angle <= 90) {
                return 2;
            } else if (angle >= 90 && angle <= 180) {
                return 1;
            } else if (angle >= 180 && angle <= 270) {
                return 4
            } else if (angle >= 270 && angle <= 360) {
                return 3;
            }
            return 0;
        },
        setLineVisibility: function (lineType, visible) {
            if (lineType === LightLine.Type.IncidenceLine) {
                this._incidenceLine.setVisibility(visible);
            } else if (lineType === LightLine.Type.RefractionLine) {
                this._refractionLine.setVisibility(visible);
            }
        },
        setLineEnable: function (lineType, enable) {
            if (lineType === LightLine.Type.IncidenceLine) {
                this._incidenceLine.setLineEnable(enable);
            } else if (lineType === LightLine.Type.RefractionLine) {
                this._refractionLine.setLineEnable(enable);
            }
        },
	 /**
	 第二模块是动态计算的，所以_curLineIndex的值需要动态计算
	  */
        setCurLineIndex: function(index){
            this._curLineIndex = index;
        },
        setGroupTranslate: function(transx, transy){
            this.setTranslate(transx, transy);
            this._nameGroup.setTranslate(transx, transy);
            this._$$incidencePoint.setTranslate(transx, transy);
        },
        /**
         * 返回折射角
         */

        getRefAngle: function(){
            return this._curRefAngle;
        },
        /**
         * 获取某文字
         */
        getNameByType: function(type){
            return this._nameGroup.getNameByType(type);
        },
        /**
         * 重置name的位置
         */
        setNamePosByType: function(type, x, y){
            this.getNameByType(type).setTranslate(x, y);
        }

    };

    return LightComplexProxyApi;
});
/**
 * Created by ylf on 2016/8/24.
 */
define('js/refractor/lightComplexRef/sector', ['js/view/sector', 'js/utils/utils', 'js/utils/view', 'js/view/NameGroup', 'js/view/LightLine'], function (Sector, Utils, View, NameGroup, LightLine) {

    var GraphMath = require('js/utils/graphMath');

    var LightComplexSector = {
        _sector: null,
        _sectorEnable: true,
        _currentVisibleStatus: null,
        _sectorHasDraw: null,
        createSector: function (appendPosX) {
            var configData = this._configData;
            this._sector = {};
            this._currentVisibleStatus = {};
            //夹角扇面
            this._sector[Sector.Type.Incidence] = this._incidenceSector = Sector.create(Sector.Type.Incidence, appendPosX, 0, configData.Sector.incidenceR, this._option.langData);
            this._sector[Sector.Type.Refraction] = this._refractionSector = Sector.create(Sector.Type.Refraction, appendPosX, 0, configData.Sector.refractionR, this._option.langData);
            this._sector[Sector.Type.SurfaceIn] = this._surfaceInSector = Sector.create(Sector.Type.SurfaceIn, appendPosX, 0, configData.Sector.surfaceR, this._option.langData);
            this._sector[Sector.Type.SurfaceOut] = this._surfaceOutSector = Sector.create(Sector.Type.SurfaceOut, appendPosX, 0, configData.Sector.surfaceR, this._option.langData);


            var sectorNameData = {};
            sectorNameData[Sector.Type.Incidence] = {cx: appendPosX, cy: 0, r: configData.Sector.refractionR};
            sectorNameData[Sector.Type.Refraction] = {cx: appendPosX, cy: 0, r: configData.Sector.refractionR};
            sectorNameData[Sector.Type.SurfaceIn] = {cx: appendPosX, cy: 0, r: configData.Sector.surfaceR};
            sectorNameData[Sector.Type.SurfaceOut] = {cx: appendPosX, cy: 0, r: configData.Sector.surfaceR};
            this._nameGroup = NameGroup.create(sectorNameData, this._option.langData, this._option);
            this._nameGroup.setTranslate(this._configData.IncidencePosX, this._configData.IncidencePosY);
        },
        sectorEach: function (callback) {
            for (var key in this._sector) {
                callback.apply(this._sector[key], [key]);
            }
        },
        appendSector: function () {
            var that = this;
            this.sectorEach(function (type) {
                that.addShape(this.getView());
            })
        },
        gtIndexSectorAppendToView: function ($$container) {
            $$container.addShape(this._nameGroup.getView());
        },
        setAngleVisibleByType: function (type, visible) {
            this._currentVisibleStatus[type] = visible;

            //不可用则不能更改状态
            if (!this._sectorEnable) {
                if (visible === true) {
                    this._nameGroup.setHasDrawStatusByType(type, visible);
                }
                return;
            }
            this._nameGroup.setAngleVisibleByType(type, visible);
        },
        resetSectorAngle: function (normalAngle, negative, angle) {
            var __getIndex = function (index, nagative, sub) {
                return nagative ? sub - index : index;
            };
            this._surfaceInSector.rotate(angle[0], angle[1]);
            this._incidenceSector.rotate(angle[1], angle[2]);
            this._refractionSector.rotate(angle[3], angle[4]);
            this._surfaceOutSector.rotate(angle[2], angle[3]);
            this._nameGroup.setNormalAngle(normalAngle);
            this._nameGroup.rotate(angle, negative);
        },
        initSectorVisibleState: function () {
            var configData = this._configData;
            this.setAngleVisibleByType(Sector.Type.SurfaceIn, configData.Sector.sectorInVisible);
            this.setAngleVisibleByType(Sector.Type.SurfaceOut, configData.Sector.sectorOutVisible);
            this.setAngleVisibleByType(Sector.Type.Incidence, configData.Sector.incidenceVisible);
            this.setAngleVisibleByType(Sector.Type.Refraction, configData.Sector.refractionVisible);

            if (this._configData.Sector.hasDraw) {
                this._nameGroup.setHasDrawStatus(this._configData.Sector.hasDraw)
            }
            this.syncSectorVisibilityByName();
        },
        getSectorHasDraw: function () {
            return this._nameGroup.getHasDrawStatus();
        },
        //设置是否由程序内部逻辑导致的绘制
        setSectorInsideDrawStatus: function (status, type) {
            this._nameGroup.setHasDrawStatusByType(status, type);
        },
        setSectorVisibilityByType: function (type, visible) {
            this.setAngleVisibleByType(type, visible);
            this._sector[type].setVisibility(this._nameGroup.getAngleIsValidByType(type));
        },
        //被外部接口改变显示，这个时候不记录状态
        setSectorVisibilityByOutSideLogic: function (type, visible) {
            if (this._nameGroup.getHasDrawStatusByType(type)) {
                this.setAngleVisibleByType(type, visible);
            }
            this._sector[type].setVisibility(this._nameGroup.getAngleIsValidByType(type));
        },
        //直接隐藏扇面，不记录状态
        setSectorVisibility: function (visible) {
            this.sectorEach(function () {
                this.setVisibility(visible);
            })
        },
        syncSectorVisibilityByName: function () {
            var that = this;
            this.sectorEach(function (type) {
                this.setVisibility(that._nameGroup.getAngleIsValidByType(type))
            });
        },
        sectorAnimateDisappear: function (callback) {
            var that = this;
            that.setAngleVisibleByType(Sector.Type.Incidence, true);
            that.setAngleVisibleByType(Sector.Type.Refraction, true);
            that.syncSectorVisibilityByName();
            that.setAngleVisibleByType(Sector.Type.Incidence, false);
            that.setAngleVisibleByType(Sector.Type.Refraction, false);
            that.setSectorInsideDrawStatus(true, Sector.Type.Incidence);
            that.setSectorInsideDrawStatus(true, Sector.Type.Reflection);
            $(that._refractionSector.getView().node).fadeIn(300).fadeOut(300).fadeIn(300, function () {
                that.syncSectorVisibilityByName();
                $(that._refractionSector.getView().node).css('display', '');
                callback && callback();
            });
            $(that._incidenceSector.getView().node).fadeIn(300).fadeOut(300).fadeIn(300, function () {
                that.syncSectorVisibilityByName();
                $(that._incidenceSector.getView().node).css('display', '');
                callback && callback();
            });
        },
        getSectorOutSideVisibilityByType: function (type) {
            return this._nameGroup.getAngleVisibilityByType(type);
        },
        getNameGroup: function () {
            return this._nameGroup;
        },
        getSectorAngle: function (type) {
            return this._nameGroup.getAngle(type);
        },
        getSectorRoundAngle: function (type) {
            return this._nameGroup.getRoundAngle(type);
        },
        //获取扇面线段坐标
        getSectorLinesPos: function (sectorType, centerPos) {
            var that = this;
            var startXAngle, endXAngle;
            var startLineType, endLineType;
            if (sectorType == Sector.Type.Incidence) {
                startXAngle = this.getIncidenceLineXAngle();
                endXAngle = this.getNormalLineXAngle();
                startLineType = LightLine.Type.IncidenceLine;
                endLineType = LightLine.Type.NormalLine;
            } else if (sectorType == Sector.Type.Refraction) {
                startXAngle = this.getNormalLineXAngle();
                endXAngle = this.getRefractionLineXAngle();
                startLineType = LightLine.Type.NormalLine;
                endLineType = LightLine.Type.RefractionLine;
            } else if (sectorType == Sector.Type.SurfaceIn) {
                startXAngle = this.getIncidenceLineXAngle();
                endXAngle = this.getSectorInLineXAngle();
                startLineType = LightLine.Type.IncidenceLine;
                endLineType = LightLine.Type.SurfaceIn;
            } else if (sectorType == Sector.Type.SurfaceOut) {
                startXAngle = this.getRefractionLineXAngle();
                endXAngle = this.getSectorOutLineXAngle();
                startLineType = LightLine.Type.RefractionLine;
                endLineType = LightLine.Type.SurfaceOut;
            }


            var _getPos = function (xAngle, lineType) {
                //统一装换为锐角
                if (xAngle > 90) {
                    xAngle = 180 - xAngle;
                }
                var quad = that.getLineQuad(lineType);

                var sectorR = that._configData.Sector.surfaceR;
                if (sectorType == Sector.Type.Incidence) {
                    sectorR = that._configData.Sector.incidenceR;
                } else if (sectorType == Sector.Type.Refraction) {
                    sectorR = that._configData.Sector.refractionR;
                }

                var pos = {
                    y: Math.sin(GraphMath.getRadian(xAngle)) * sectorR,
                    x: Math.cos(GraphMath.getRadian(xAngle)) * sectorR
                };

                var posB = {};
                if (quad === 1) {
                    posB.x = centerPos.x + pos.x;
                    posB.y = centerPos.y + pos.y;
                } else if (quad === 2) {
                    posB.x = centerPos.x - pos.x;
                    posB.y = centerPos.y + pos.y;
                } else if (quad === 3) {
                    posB.x = centerPos.x - pos.x;
                    posB.y = centerPos.y - pos.y;
                } else {
                    posB.x = centerPos.x + pos.x;
                    posB.y = centerPos.y - pos.y;
                }
                return {
                    a: centerPos,
                    b: posB
                }
            };

            var line = [_getPos(startXAngle, startLineType), _getPos(endXAngle, endLineType)];
            return line;
        },
        setSectorEnable: function (enable) {
            var that = this;
            this._sectorEnable = enable;
            if (enable) {
                //还原显示
                this.sectorEach(function (type) {
                    that._nameGroup.setAngleVisibleByType(type, that._currentVisibleStatus[type]);
                });
                //进行同步
                this.syncSectorVisibilityByName();
            } else {
                this.sectorEach(function (type) {
                    this.setVisibility(false);
                    that._nameGroup.setAngleVisibleByType(type, false);
                })
            }
        },
        setSectorOpacity: function (opacity) {
            this.getNameGroup().setOpacity(opacity);
            this.sectorEach(function () {
                this.setOpacity(opacity);
            });
        }
    };

    return LightComplexSector;
});
/**
 * 动画命令执行队列
 * Created by ylf on 2016/8/5.
 */


define('js/utils/drawCommand', ['js/utils/logger'], function (Logger) {

    var Command = {
        _queue: [],
        _hasDrawQueue: [],
        _drawIndex: [],
        _currentIndex: 0,
        _maxLength: 100,
        _stopCallback: null,
        _stopFlag: false,
        _drawing: false,
        create: function () {
            var instance = Object.create(this);
            instance._queue = [];
            instance._drawIndex = [];
            instance._hasDrawQueue = [];
            return instance;
        },
        push: function (draw, hasDraw) {
            this._queue.push(this.makeAsPromise(draw));
            this._hasDrawQueue.push(hasDraw);
        },
        setCurrentIndex: function (index) {
            this._currentIndex = index;
        },
        drawNext: function (callback, animate, force) {
            var that = this;
            if (this._drawing && force !== true) {
                Logger.debug('draw', '正在绘制中，不能提交新的绘制命令');
                callback && callback(that._currentIndex);
                return;
            }
            if (this.hasNext()) {
                this._drawing = true;
                var hasDraw = this.hasDraw(this._currentIndex);
                if (hasDraw) {
                    this._currentIndex++;
                    this.drawNext(callback, animate, true);
                    this._drawing = false;
                    return;
                }
                var tasks = this.getTask(this._currentIndex);
                this._currentIndex++;
                var doneCallBack = function () {
                    that._drawing = false;
                    that._stopCallback && that._stopCallback();
                    callback && callback(that._currentIndex);
                };
                //TODO:这个地方先写死四个,待优化
                if (tasks.length === 1) {
                    $.when([tasks[0](animate)]).done(doneCallBack);
                } else if (tasks.length === 2) {
                    $.when([tasks[0](animate), tasks[1](animate)]).done(doneCallBack);
                } else if (tasks.length === 3) {
                    $.when([tasks[0](animate), tasks[1](animate), tasks[2](animate)]).done(doneCallBack);
                } else if (tasks.length === 4) {
                    $.when([tasks[0](animate), tasks[1](animate), tasks[2](animate), tasks[3](animate)]).done(doneCallBack);
                } else if (tasks.length === 5) {
                    $.when([tasks[0](animate), tasks[1](animate), tasks[2](animate), tasks[3](animate), tasks[4](animate)]).done(doneCallBack);
                }
                return true;
            } else {
                Logger.debug('draw', '已经没有更多命令需要绘制');
                callback && callback(that._currentIndex);
                return false;
            }
        },
        getTask: function (index) {
            var that = this;
            var actualIndex = this._drawIndex[index];
            var task = [];
            if (actualIndex instanceof Array) {
                actualIndex.forEach(function (i) {
                    task.push(that._queue[i]);
                })
            } else {
                task.push(that._queue[actualIndex]);
            }
            return task;
        },
        hasNext: function () {
            var hasNext = false;
            for (var i = 0; i < this._drawIndex.length; i++) {
                var hasDraw = this.hasDraw(i);
                if (!hasDraw) {
                    hasNext = true;
                }
            }
            return hasNext;
        },
        hasNotDrawNext: function () {
            if (this._drawIndex.length > 0) {
                return this._currentIndex <= this._drawIndex.length - 1;
            }
            return this._currentIndex <= this._queue.length - 1;
        },
        drawAll: function (callback, animate) {
            for (var i = 0; i < this._drawIndex.length; i++) {
                var tasks = this.getTask(i);
                tasks.forEach(function (task) {
                    task(animate);
                })
            }
            callback && callback();
        },
        setDrawIndex: function (drawIndex) {
            if (!this._drawing) {
                this._drawIndex = drawIndex;
                this._currentIndex = 0;
            }
        },
        stop: function (stopCallBack) {
            if (!this._drawing) {
                this._stopFlag = true;
                stopCallBack && stopCallBack();
                return;
            }
            this._stopFlag = true;
            this._stopCallback = stopCallBack;
        },
        hasDraw: function (index) {
            var that = this;
            var actualIndex = this._drawIndex[index];
            var hasDraw = true;
            if (actualIndex instanceof Array) {
                actualIndex.forEach(function (i) {
                    if (hasDraw) {
                        hasDraw = that._hasDrawQueue[i]();
                    }
                })
            } else {
                hasDraw = that._hasDrawQueue[actualIndex]();
            }
            return hasDraw;
        },
        makeAsPromise: function (callBack) {
            return function () {
                var deffer = $.Deferred();
                var arg = Array.prototype.slice.apply(arguments, [0]);
                arg.unshift(deffer);
                callBack.apply(this, arg);
                return deffer.promise();
            }
        },
        getCommandLength: function () {
            return this._queue.length;
        }
    };

    return Command;
});
/**
 * Created by ylf on 2016/7/22.
 * 事件管理对象
 */
define('js/utils/eventBus', ['js/utils/logger'], function (Logger) {

    var EventBus = {
        _eventHandler: null,
        create: function () {
            var instance = Object.create(this);
            instance._eventHandler = {};
            return instance;
        },
        trigger: function () {
            //将参数转换为数组
            var arg = Array.prototype.slice.apply(arguments, [0]);
            //取第一个，并从数组中删除，事件key
            var type = arg.shift();
            if (!this._eventHandler || !this._eventHandler[type]) {
                return false;
            }
            var handlers = this._eventHandler[type];
            handlers.forEach(function (handler) {
                handler.cb.apply(handler.domain || this, arg);
                Logger.debug('event-trigger', type, arg.toString());
            });
            return true;
        },
        on: function (type, callback, domain) {
            if (!this._eventHandler[type]) {
                this._eventHandler[type] = [];
            }
            this._eventHandler[type].push({cb: callback, domain: domain});
            return true;
        },
        off: function (type, callback, domain) {
            var handlers = this._eventHandler[type];
            if (handlers && handlers.length > 0) {
                var len = handlers.length;
                var handler;
                for (var i = 0; i < len; i++) {
                    handler = handlers[i];
                    if (handler && callback === handler.cb) {
                        if (domain && domain !== handler.domain) {
                            continue;
                        }
                        handlers.splice(i, 1);
                        i--;
                        len--;
                    }
                }
            }
            if (handlers && handlers.length === 0) {
                delete  this._eventHandler[type];
            }
        }
    };
    return EventBus;
});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/utils/eventUtils', function () {

    var EventUtils = {
        isDown: function (type) {
            return type === 'touchstart' || type === 'mousedown';
        },
        isUp: function (type) {
            return /^(touchend|touchcancel|mouseup|mouseleave)$/.test(type);
        },
        isMove: function (type) {
            return type === 'mousemove' || type === 'touchmove';
        },
        isTouch: function (type) {
            return /^(touchend|touchcancel|touchstart|touchmove)$/.test(type);
        },
        getPagePos: function (ev) {
            var ev = ev.originalEvent ? ev.originalEvent : ev;
            var point = {};
            switch (ev.type) {
                case 'touchstart':
                case 'touchmove':
                case 'touchend':
                case 'touchcancel':
                    point.x = ev.changedTouches[0].pageX;
                    point.y = ev.changedTouches[0].pageY;
                    return point;
                default:
                    point.x = ev.pageX;
                    point.y = ev.pageY;
                    return point;
            }
            return point;
        },
        /**
         * 修复pc上移动后还可以触发点击事件的bug
         */
        fixPcClick: function (startPos, endPos, startTime, endTime) {
            var _holdTime = endTime - startTime;
            var dx = Math.abs(endPos.x - startPos.x);
            var dy = Math.abs(endPos.y - startPos.y);
            if (_holdTime > 800 || dx >= 4 || dy >= 4) {
                return false;
            }
            return true;
        }
    };
    return EventUtils;
});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/utils/graphMath', function () {

    var GraphMath = {
        /**
         * 获取两条线的交点位置和坐标
         * @param line1 {k:0.5,b:2}
         * @param line2 kb
         * @returns {*}
         */
        getTwoLineIntersection: function (a, b, c, d) {

            /** 1 解线性方程组, 求线段交点. **/
            // 如果分母为0 则平行或共线, 不相交
            var denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
            if (denominator == 0) {
                return false;
            }

            // 线段所在直线的交点坐标 (x , y)
            var x = ( (b.x - a.x) * (d.x - c.x) * (c.y - a.y)
                + (b.y - a.y) * (d.x - c.x) * a.x
                - (d.y - c.y) * (b.x - a.x) * c.x ) / denominator;
            var y = -( (b.y - a.y) * (d.y - c.y) * (c.x - a.x)
                + (b.x - a.x) * (d.y - c.y) * a.y
                - (d.x - c.x) * (b.y - a.y) * c.y ) / denominator;

            /** 2 判断交点是否在两条线段上 **/
            if (
                // 交点在线段1上
            Math.round((x - a.x) * (x - b.x)) <= 0 && Math.round((y - a.y) * (y - b.y)) <= 0
                // 且交点也在线段2上
            && Math.round((x - c.x) * (x - d.x)) <= 0 && Math.round((y - c.y) * (y - d.y)) <= 0
            ) {

                // 返回交点p
                return {
                    x: x,
                    y: y
                }
            }
            //否则不相交
            return false
        },
        /**
         * 获取弧度
         * @param degree 角度
         * @returns {number}
         */
        getRadian: function (degree) {
            return (2 * Math.PI) / 360 * degree;
        },
        /**
         * 获取角度
         * @param degree 弧度
         * @returns {number}
         */
        getDegree: function (radian) {
            return (radian * 360) / (2 * Math.PI);
        },
        /**
         * 获取直接kb值
         * @param degree 与x轴角度
         * @param pos 线上的一点
         */
        //getLineKb: function (degree, pos) {
        //    var kb = {};
        //    if (degree > 90) {
        //        kb.k = Math.tan(this.getRadian(180 - degree));
        //        kb.k = -kb.k;
        //    } else {
        //        kb.k = Math.tan(this.getRadian(degree));
        //    }
        //    //pos.y = k * pos.x + b;
        //    kb.b = pos.y - kb.k * pos.x;
        //    return kb;
        //}
        getLineKb: function (degree, pos) {
            var kb = {};
            degree = degree < 0? (degree+ 360) % 360: degree % 360;
            kb.degree = degree;
            //kb.k = Math.cos(this.getRadian(degree));
            if(degree != 90 && degree != 270 && degree !=0 && degree != 180) {
                kb.k = Math.tan(this.getRadian(degree));
                //pos.y = k * pos.x + b;
                kb.b = pos.y - kb.k * pos.x;
                return kb;
            }else if(degree == 90 || degree == 270){
                kb.k = "no_exist";
                kb.x = pos.x;
                return kb;
            }else if(degree == 0 || degree == 180) {
                kb.k = 0;
                kb.b = pos.y;
                return kb;
            }
        }
        ,
        /**
         * 获取弧长
         * @param degree 角度
         * @param r 半径
         * @returns {number}
         */
        getArc: function (degree, r) {
            return (2 * Math.PI * r * degree) / 360;
        },
        /**
         * 获取差积
         * @param originPos 焦点、原始坐标
         * @param startPos  相对开始坐标
         * @param endPos 结束坐标
         * @returns {number}
         */
        getDifferent: function (originPos, startPos, endPos) {
            var startVector = {
                x: startPos.x - originPos.x,
                y: startPos.y - originPos.y
            };
            var endVector = {
                x: endPos.x - originPos.x,
                y: endPos.y - originPos.y
            };
            return parseFloat(startVector.x * endVector.y) - parseFloat(endVector.x * startVector.y);//叉积
        },
        /**
         * 余弦定理，已知三边，求角度
         * @param a
         * @param b
         * @param c
         * @returns {Number}
         */
        getCosineAngle: function (a, b, c) {
            //余弦定理
            //由余弦定理得a²=b²+c²-2bc*CosA
            //∴CosA=(b²+c²-a²)/(2bc)=7/8
            var cosA = (Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c);
            // 得到弧度
            if(cosA >= -1 && cosA <= 1)
            {
                var acosA = Math.acos(cosA);
            }else{
                acosA = 0;
            }
            // 弧度转角度
            //1弧度=180/π度
            //1度=π/180弧度
            return parseFloat(acosA * (180 / Math.PI));
        },
        getCosineAngleByPos: function (aPos, bPos, cPos) {
            var a, b, c;
            a = parseFloat(Math.sqrt(Math.pow(bPos.x - cPos.x, 2) + Math.pow(bPos.y - cPos.y, 2)));
            b = parseFloat(Math.sqrt(Math.pow(bPos.x - aPos.x, 2) + Math.pow(bPos.y - aPos.y, 2)));
            c = parseFloat(Math.sqrt(Math.pow(cPos.x - aPos.x, 2) + Math.pow(cPos.y - aPos.y, 2)));
            return this.getCosineAngle(a, b, c);
        },
        /**
         * 勾股定理，求C边的值
         * @param a a边长
         * @param b b边长
         * @returns {number}
         */
        getPythagoreanLineC: function (a, b) {
            return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        },
        /**
         * 已知角度和斜边长，求斜边坐标
         * @param a a边长
         * @param b b边长
         * @returns {number}
         */
        getLinePosByAngle: function (angle, width) {
            //TODO:确认一下角度超过90度时候的值是否是对称的
            if (angle > 90) {
                angle = 180 - angle;
            }
            var x = Math.cos(this.getRadian(angle)) * width;
            var y = Math.sin(this.getRadian(angle)) * width;
            return {x: x, y: y};
        },
        /**
         * 获取svg扇形路径信息
         * @param cx 旋转中心点 x坐标
         * @param cy 旋转中心点 y坐标
         * @param r 旋转半径
         * @param startAngle 开始角度
         * @param endAngle 结束角度
         * @returns {string}
         */
        getSvgSectorPoint: function (cx, cy, r, startAngle, endAngle) {
            var rad = Math.PI / 180;
            var x1 = cx + r * Math.cos(-startAngle * rad),        //起始X点
                y1 = cy + r * Math.sin(-startAngle * rad),        //起始Y点
                x2 = cx + r * Math.cos(-endAngle * rad),        //结束X点
                y2 = cy + r * Math.sin(-endAngle * rad);        //结束Y点
            var ar = [];
            ar.push('M');
            ar.push(cx);
            ar.push(cy);
            ar.push("L");
            ar.push(x1);
            ar.push(y1);
            ar.push("A");
            ar.push(r);
            ar.push(r);
            ar.push(0);
            ar.push(+(endAngle - startAngle > 180));
            ar.push(0);
            ar.push(x2);
            ar.push(y2);
            ar.push('z');
            return ar.join(' ');
        }
        ,
        /**
         * 获取两点距离
         * @param pos1 {x:100,y:100}
         * @param pos2
         * @returns {number}
         */
        getTwoPointDistance: function (pos1, pos2) {
            var x = pos2.x - pos1.x,
                y = pos2.y - pos1.y;
            return Math.sqrt((x * x) + (y * y));
        }
        ,
        /**
         * 求点在圆上的坐标
         * @param degree 角度
         * @param r 半径
         * @returns {{x: number, y: number}}
         */
        getSpherePos: function (degree, r) {

            var x1 = 0 + r * Math.cos(degree * Math.PI / 180);
            var y1 = 0 + r * Math.sin(degree * Math.PI / 180);

            return {
                x: x1,
                y: y1
            };
        }
        ,
        /**
         * 计算点a到线段bc的最短距离
         * @param posa
         * @param posb
         * @param posc
         */
        getShortestDistanceAndPoint: function (posa, posb, posc) {
            var ab = this.getTwoPointDistance(posa, posb);
            var ac = this.getTwoPointDistance(posa, posc);
            var bc = this.getTwoPointDistance(posb, posc);
            var halfPerimeter = (ab + ac + bc) / 2;//半周长
            //求面积：海伦公式
            var S = Math.sqrt(halfPerimeter * (halfPerimeter - ab) * (halfPerimeter - ac) * (halfPerimeter - bc));
            //另外一个面积公式： 底*高/2
            var height = (2 * S) / bc;
            //判断高是否在三角形内
            var thirdLong = Math.max(ab, ac);
            var hc = Math.sqrt((thirdLong * thirdLong) - (height * height));//计算高垂足点到c的位置
            //计算出来的长度大于底边，在外部
            var shortestDistance = 0;
            var shortestPos = {};
            if (hc > bc) {
                shortestDistance = Math.min(ac, ab);
                if (ac > ab) {
                    shortestDistance = ab;
                    shortestPos = posb;
                } else {
                    shortestDistance = ac;
                    shortestPos = posc;
                }
            } else {
                //返回最短距离
                shortestDistance = height;
                shortestPos = this.getRectVerticalPos(posa, posb, posc, height);//
            }
            return {
                d: shortestDistance,//最短距离
                pos: shortestPos,//高在a边上的坐标
                h: height,//高
                minSide: Math.min(ab, ac)
            }
        }
        ,
        /**
         * 特例（矩形上的）已知直角对应的两点和两侧线长，求直接坐标
         * @param pos1
         * @param pos2
         */
        getRectVerticalPos: function (posa, posb, posc, height) {
            var x = 0, y = 0;
            if (posb.x === posc.x) {
                x = posb.x;
                y = posa.y;
            } else if (posb.y = posc.y) {
                y = posb.y;
                x = posa.x;
            }
            return {
                x: x,
                y: y
            }
        }
        ,
        /**
         * 计算点离矩形最短距离
         * @param posa 点
         * @param rect 矩形 {left:,top,right,bottom}
         * @returns {number}
         */
        getRectShortestDistance: function (posa, rect) {
            //上
            var s = this.getShortestDistanceAndPoint(posa, {x: rect.left, y: rect.top}, {x: rect.right, y: rect.top});
            //右
            var y = this.getShortestDistanceAndPoint(posa, {x: rect.right, y: rect.top}, {x: rect.right, y: rect.bottom});
            //下
            var x = this.getShortestDistanceAndPoint(posa, {x: rect.left, y: rect.bottom}, {x: rect.right, y: rect.bottom});
            //左
            var z = this.getShortestDistanceAndPoint(posa, {x: rect.left, y: rect.top}, {x: rect.left, y: rect.bottom});

            var target = s;

            var d = Math.min(s.d, y.d, x.d, z.d);
            if (d === s.d) {
                target = s;
                target.vertical = true;
                target.direction = 'top';
            }
            if (d === y.d) {
                target = y;
                target.vertical = false;
                target.direction = 'right';
            }
            if (d === x.d) {
                target = x;
                target.vertical = true;
                target.direction = 'bottom';
            }
            if (d === z.d) {
                target = z;
                target.vertical = false;
                target.direction = 'left';
            }
            return target;
        }
        ,
        /**
         * 定比点公式，获取线段上的第三点坐标
         * @param posa 点a
         * @param posb 点b
         * @param ca 点c到a的距离
         * @returns {{x: (number|*), y: (number|*)}}
         */
        getLightPos: function (posa, posb, ca) {
            //http://www.zybang.com/question/0f4a343e136e33929290d3d599fc1d7c.html
            var m, n;
            var s = ca;
            var a = posa.x;
            var b = posa.y;
            var c = posb.x;
            var d = posb.y;

            var M = this.getTwoPointDistance(posa, posb);
            var la = s / (Math.sqrt(Math.pow((a - c), 2) + Math.pow((b - d), 2)) - s);
            m = (a + la * c) / (1 + la);
            n = (b + la * d) / (1 + la);
            return {
                x: m,
                y: n
            }
        }
        ,
        /**
         * 根据三点获取旋转角度
         * @param posa 中心点
         * @param posb 上一个点
         * @param posc 当前点
         * @returns {*}
         */
        getRotateAngle: function (posa, posb, posc) {
            var angle;
            //0度的时候
            if((posa.x == posb.x && posb.x == posc.x) ||(posa.y == posb.y && posb.y == posc.y)){
                angle = 0;
            }else{
                //通过三点计算旋转角度
                angle = this.getCosineAngleByPos(posa, posb, posc);
            }

            //计算三点的差积，判断旋转方向
            var different = this.getDifferent(posa, posb, posc);
            if (different < 0) {
                angle = -angle;
            }
            return angle;
        },
        /**
         * http://blog.csdn.net/fly542/article/details/6638299
         * 已知三点，求第三点到另外两点组成的垂线长度
         * @param pos1
         * @param pos2
         * @param pos3
         * @returns {number}
         */
        getPedalHeight: function (pos1, pos2, pos3) {
            var A = (pos1.y - pos2.y) / (pos1.x - pos2.x);
            var B = (pos1.y - A * pos1.y);
            /// > 0 = ax +b -y;
            return Math.abs(A * pos3.x + B - pos3.y) / Math.sqrt(A * A + 1);
        },
        /**
         * 获取圆和线段的交点
         * http://blog.csdn.net/luols/article/details/7476512
         * @param ptStart 线起点
         * @param ptEnd 线终点
         * @param ptCenter 原心
         * @param Radius 半径
         * @returns {boolean}
         * @constructor
         */
        getLineCircleIntersectionPos: function (ptStart, ptEnd, ptCenter, Radius) {
            var EPS = 0.00001;
            var ptInter1 = {};
            var ptInter2 = {};
            var fDis = Math.sqrt((ptEnd.x - ptStart.x) * (ptEnd.x - ptStart.x) + (ptEnd.y - ptStart.y) * (ptEnd.y - ptStart.y));
            var d = {};
            d.x = (ptEnd.x - ptStart.x) / fDis;
            d.y = (ptEnd.y - ptStart.y) / fDis;
            var E = {};
            E.x = ptCenter.x - ptStart.x;
            E.y = ptCenter.y - ptStart.y;
            var a = E.x * d.x + E.y * d.y;
            var a2 = a * a;
            var e2 = E.x * E.x + E.y * E.y;
            var Radius2 = Radius * Radius;
            if ((Radius2 - e2 + a2) < 0) {
                return false;
            }
            else {
                var f = Math.sqrt(Radius2 - e2 + a2);
                var t = a - f;
                if (((t - 0.0) > -EPS) && (t - fDis) < EPS) {
                    ptInter1.x = ptStart.x + t * d.x;
                    ptInter1.y = ptStart.y + t * d.y;
                }
                t = a + f;
                if (((t - 0.0) > -EPS) && (t - fDis) < EPS) {
                    ptInter2.x = ptStart.x + t * d.x;
                    ptInter2.y = ptStart.y + t * d.y;
                }
                return [ptInter1, ptInter2];
            }
        },
        /**
         * 根据折射率计算折射角
         * @param incidentAngle 入射角
         * @param refractivity 折射率
         */
        getRefractAngle: function(incidentAngle, refractivity){
            incidentAngle =  incidentAngle < 0? incidentAngle + 360: incidentAngle;
            var incidentAng;
            if(incidentAngle <= 90){
                incidentAng = 90 - incidentAngle ;
            }else if(incidentAngle > 90 && incidentAngle <= 180){
                incidentAng = incidentAngle - 90;
            }else if(incidentAngle > 180 && incidentAngle <= 270){
                incidentAng = 270 - incidentAngle;
            }else{
                incidentAng = incidentAngle - 270;
            }
            var incidentAngelRel = this.getRadian(incidentAng);
            var asin = Math.sin(incidentAngelRel) / refractivity;
            if(asin >= -1 && asin <= 1){
                asin = Math.asin(asin);
                var angle = this.getDegree(asin);
                return angle;
            }else{
                return "no_refract";
            }
        },
        /**
         *一个线段数组，一个点
         *判断折射点在哪条线段上,返回线段下标
         *aPoint:{x:x, y:y}
         *lineArr:[{degree:0, aPoint:{x:x, y:y}, bPoint:{x:x, y:y}},{},...]
         */
        inWhichLine: function(aPoint, linesArr, curLineIndex) {
            var index = -1;
            for (var i = 0; i < linesArr.length; i++) {
                if(curLineIndex != undefined){
                    if(i == curLineIndex){
                        continue;
                    }
                }
                var inline = false;
                var linesArrKb = GraphMath.getLineKb(linesArr[i].degree, linesArr[i].aPoint);
                if(linesArrKb.k != "no_exist"){
                    if(linesArrKb.k * aPoint.x + linesArrKb.b - 5 <= aPoint.y && linesArrKb.k * aPoint.x + linesArrKb.b + 5 >= aPoint.y){ //误差的情况
                        inline = true;
                    }
                }else{
                    if(linesArrKb.x == aPoint.x){
                        inline = true;
                    }
                }
                if(inline == true){
                    if (GraphMath.isInSegment(aPoint, linesArr[i].aPoint, linesArr[i].bPoint)) {
                        index = i;
                        break;
                    } else {
                        index = -1;
                    }
                }else{
                    index = -1;
                }
            }
            return index;
        },
        /**
         *判断折射线线与哪条线段相交
         *line:{degree:0, aPoint:{x: x, y: y}}
         *lineArr:[{degree:0, aPoint:{x:x, y:y}, bPoint:{x:x, y:y}},{},...]
         */
        pointInLine: function(line, lineArr, index) {
            //     var index = GraphMath.inWhichLine(line.aPoint, lineArr);
            var lineKb = GraphMath.getLineKb(line.degree, line.aPoint);
            var anotherPoint;
            if(lineKb.k !="no_exist" && lineKb.k != 0) {
                if (lineKb.degree > 0 && lineKb.degree < 180) {
                    anotherPoint = {x: (-10000 - lineKb.b) / lineKb.k, y: -10000};
                } else {
                    anotherPoint = {x: (10000 - lineKb.b) / lineKb.k, y: 10000};
                }
            }else if(lineKb.k =="no_exist"){
                if(lineKb.degree == 90){
                    anotherPoint = {x: lineKb.x , y: -1000};
                }else{
                    anotherPoint = {x: lineKb.x , y: 1000};
                }

            }else if(lineKb.k ==0){
                if(lineKb.degree == 0){
                    anotherPoint = {x: -10000 , y: lineKb.b};
                }else{
                    anotherPoint = {x: 10000 , y: lineKb.b};
                }
            }
            var acrossPoint, result = false;
            var lineArrKb;
            if (index >= 0 && typeof index == "number") {
                for (var i = 0; i < lineArr.length; i++) {
                    if (i != index) {

                        lineArrKb = GraphMath.getLineKb(lineArr[i].degree, lineArr[i].aPoint);
                        acrossPoint = GraphMath.getApointBytwoLine(lineKb, lineArrKb);
                        var acrossPoint2 = GraphMath.getTwoLineIntersection(line.aPoint, anotherPoint, lineArr[i].aPoint, lineArr[i].bPoint);
                        if (acrossPoint || acrossPoint2) {
                            acrossPoint = GraphMath.isInSegment(acrossPoint, lineArr[i].aPoint, lineArr[i].bPoint) && GraphMath.isInSegment(acrossPoint, line.aPoint, anotherPoint);
                            if (acrossPoint || acrossPoint2) {
                                result = acrossPoint || acrossPoint2;
                                index = i;
                                break;
                            }
                        }

                    }
                }
                if(result){
                    return {
                        acrossPoint: result,
                        index: index
                    }
                }else{
                    //alert("折射点不在所有的线段上");
                    return false;
                }
            }else{
                //alert("折射点不在所有的线段上");


                return false;
            }
        },
        /**
         *已知两条直线的k 和b，求两条直线交点
         *求有木有交点
         * line{
         *  k:
         *  b:
         * }
         */
        getApointBytwoLine: function(line1, line2){
            var result = {};
            if(line1.k == line2.k){ //平行
                return false;
            }else if(line1.k == "no_exist" || line2.k == "no_exist") {
                if(line1.k == "no_exist"){
                    result = {
                        x: line1.x,
                        y: line2.k * line1.x + line2.b
                    }
                }else{
         //           console.log("line2.x = "+line2.x);
                    result = {
                        x: line2.x,
                        y: line1.k * line2.x + line1.b
                    }
                }
            }else{
                var x = parseFloat((line2.b - line1.b) / (line1.k - line2.k));
                var y = line1.k * x + line1.b;
                result = {
                    x: x,
                    y: y
                }
            }
            return result;
        },
        /**
         * 判断交点在线段上
         * insPoint： 交点（已经是直线上的点）
         * aPoint、bPoint: 线段的两个点
         */
        isInSegment: function(insPoint, a, b){
            var x = insPoint.x, y = insPoint.y;
            /** 2 判断交点是否在两条线段上 **/
            if (
                // 交点在线段1上
            (x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0
            // 且交点也在线段2上
            // && (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0
            ) {

                // 返回交点p
                return {
                    x: x,
                    y: y
                }
            }
            //否则不在线段上
            return false;
        }

    };
    return GraphMath;
})
;
/**
 * Created by ylf on 2015/12/13.
 */

define('js/utils/logger', function () {
    'use strict';

    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var _console = (window.console = window.console || {});
    var method = null;

    var emptyFuc = function () {
    };

    while (length--) {
        method = methods[length];
        // Only stub undefined methods.
        if (!_console[method]) {
            _console[method] = emptyFuc;
        }
    }

    //logger level值(debug:3, info:2, warn:1, error: 0, close: -1)
    var _logger = {
        _level: 0,
        _console: _console,
        setLevel: function (level) {
            switch (level) {
                case 'debug':
                    this._level = 3;
                    break;
                case 'info':
                    this._level = 2;
                    break;
                case 'warn':
                    this._level = 1;
                    break;
                case 'error':
                    this._level = 0;
                    break;
                default:
                    this._level = -1;
            }
        },
        debug: function () {
            if (this._level >= 3) {
                this._console.log.apply(this._console, arguments);
            }
        },
        info: function (msg) {
            if (this._level >= 2) {
                this._console.info.apply(this._console, arguments);
            }
        },
        warn: function (msg) {
            if (this._level >= 1) {
                this._console.warn.apply(this._console, arguments);
            }
        },
        error: function (msg) {
            if (this._level >= 0) {
                this._console.error.apply(this._console, arguments);
            }
        }
    };

    return _logger;

});
/**
 * Created by ylf on 2016/4/9.
 */
define('js/utils/string', function () {

    var String = {
        _templateRegExp: /\$\{(.+?)(?:\:(.+?))?\}/g,
        //替换字符串
        template: function (tpl, attrs) {
            return tpl.replace(this._templateRegExp, function ($0, $1, $2) {
                return attrs[$1] || $0;
            });
        },
        /**
         * 获取膜拜对应值
         * @param text  minder_node_121_dasdfs
         * @param tpl  minder_node_${id:number}_${name:string}
         * @return {id:121,name:'dasdfs'}
         */
        getTemplateValue: function (text, tpl) {
            //获取到数据类型
            var tempRegExp = this.templateRegex(tpl);
            var result = tempRegExp.regExp.exec(text);
            if (!result) {
                return null;
            }

            //获取所有key
            var keys = Object.keys(tempRegExp.attrs);
            var values = null;

            //从1开始，略过匹配的全局字符串
            for (var i = 1; i < result.length; i++) {
                if (!values) {
                    values = {};
                }
                if (keys.length > i - 1) {
                    var key = keys[i - 1];
                    if (tempRegExp.attrs[key] === 'number') {
                        values[key] = parseInt(result[i]);
                    } else {
                        values[key] = result[i];
                    }
                }
            }
            return values;
        },
        //生成正则表达式
        templateRegex: function (tpl) {
            var attrs = {};
            var regexStr = tpl.replace(this._templateRegExp, function ($0, $1, $2) {
                attrs[$1] = $2;
                if ($2) {
                    if ($2 === 'number') {
                        return '(\\d+?)';
                    } else if ($2 === 'string') {
                        return '(.+?)';
                    }
                }
                else {
                    return '(.+?)';
                }
            });
            regexStr = '^' + regexStr + '$';
            return {
                regExp: new RegExp(regexStr),
                attrs: attrs
            };
        }
    };
    return String;
});
/**
 * create by ylf 7/25
 * svg 操作相关
 */
define('js/utils/svg', function () {

    var transformRegex = {
        translate: /translate\(\s*?([\-0-9.]*)\s*?([\-0-9.]*)\s*?\)/,
        rotate: /rotate\(\s*?([\-0-9.]*)\s*?([\-0-9.]*)?\s*?([\-0-9.]*)?\s*?\)/
    }

    var svg = {
        getRotateMatrix: function (angle, x, y) {
            var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('transform', 'rotate(' + angle + ' ' + x + ' ' + y + ')');
            var matrix = rect.getCTM();
            return matrix;
        },
        getRotateKityMatrix: function (angle, x, y) {
            var svgMatrix = this.getRotateMatrix(angle, x, y);
            var matrix = new kity.Matrix(svgMatrix.a, svgMatrix.b, svgMatrix.c, svgMatrix.d, svgMatrix.e, svgMatrix.f);
            return matrix;
        },
        rotate: function (node, angle, x, y) {
            x = typeof x === typeof undefined ? 0 : x;
            y = typeof y === typeof undefined ? 0 : y;
            $(node).attr('transform', 'rotate(' + angle + ',' + x + ',' + y + ')');
        },
        setTranslate: function (node, x, y) {
            x = typeof x === typeof undefined ? 0 : x;
            y = typeof y === typeof undefined ? 0 : y;
            $(node).attr('transform', 'translate(' + x + ',' + y + ')');
        },
        getAttrRotate: function (transform) {
            var result = transformRegex.rotate.exec(transform);
            if (result) {
                result.shift();
                result.forEach(function (item, i) {
                    if (typeof item !== typeof undefined) {
                        result[i] = parseFloat(item);
                    } else {
                        result[i] = 0;
                    }
                });
                return result;
            }
            return [];
        },
        getAttrTranslate: function (transform) {
            var result = transformRegex.translate.exec(transform);
            if (result) {
                result.shift();
                result.forEach(function (item, i) {
                    result[i] = parseFloat(item);
                });
                return result;
            }
            return [];
        },
        createJqForeignObject: function (cls) {
            var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            var $div = $('<div class="' + cls + '"></div>');
            $(foreignObject).html($div);
            return $(foreignObject);
        }
    };

    return svg;

});
define('js/utils/utils', function () {
    var Utils = {
        getFixedFloat: function (floatNum, digitalCount) {
            var num = floatNum.toString();
            var numAry = num.split('.');
            if (numAry.length !== 2) {
                return floatNum;
            }
            if (numAry[0] === '') {
                numAry[0] = '0';
            }
            var len = numAry[1].length;
            if (len === 0 || digitalCount === 0) {
                return parseInt(numAry[0]);
            }
            var result = numAry[0] + '.' + numAry[1].substring(0, (digitalCount >= len ? len : digitalCount));
            return parseFloat(result);
        },
        getValue: function (str, regex, index) {
            var result = '';
            var arr = str.match(regex);
            if (typeof  index === 'number' && arr && arr.length > index) {
                result = arr[index];
            } else if (arr && arr.length === 2) {
                result = arr[1];
            }
            return result;
        },
        getUuid: function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },
        isMobile: navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i) ? true : false,
        supportTouch: 'ontouchend' in document
    };

    return Utils;

});
/**
 * create by ylf 2016/8/5
 * view相关 操作相关
 */
define('js/utils/View', ['js/utils/GraphMath', 'js/utils/svg', 'js/utils/logger'], function (GraphMath, Svg, Logger) {
    var ViewUtils = {
        setVisibility: function ($$view, visible) {
            $$view.setStyle({'visibility': visible ? '' : 'hidden'});
        },
        isVisibilityHidden: function ($$view) {
            var style = $($$view.node).attr('style');
            var hidden = /visibility:[\s]*?hidden/.test(style || '');
            return hidden;
            //return $($$view.node).css('visibility') === 'hidden';
        },
        /**
         * 让视图始终水平显示
         * @param $$view 当前水平视图
         * @param referenceView 参照视图，基于该视图旋转角度而变化
         * @param r
         * @param paddingX X轴偏移
         * @param paddingY Y轴偏移
         */
        makeAbsViewHorizontal: function ($$view, angle, r, centerX, centerY, marginX, marginY, nagitive) {
            marginX = marginX ? marginX : 0;
            marginY = marginY ? marginY : 0;

            //计算离原点的位置
            var pos = GraphMath.getSpherePos(angle || 0, r);
            var x, y;
            if (nagitive) {
                x = centerX + pos.x, y = centerY + pos.y;
            } else {
                x = centerX - pos.x, y = centerY - pos.y;
            }
            //定位到指定位置
            $$view.setTranslate(x + ' ' + y);
            //纠正位置，定位到文本节点正中间
            var box = $$view.getRenderBox();
            x = x + (x - box.cx) + marginX;
            y = y + (y - box.cy) + marginY;
            $$view.setTranslate(x + ' ' + y);
        },
        /**
         * 视图已指定距离围绕旋转
         * @param $$view
         * @param $$referenceView
         * @param r 旋转时候的过度快门，越大越快
         * @param distance 围绕半径
         * @param centerX 围绕中心点
         * @param centerY
         * @param marginX 视图偏移量
         * @param marginY
         * @param nagitive 正向还是方向旋转
         */
        makeViewAround: function ($$view, $$referenceView, r, distance, centerX, centerY, marginX, marginY, nagitive) {
            //取一个大的值即可，保证不会和referenceview发生碰撞
            var angle;
            if (typeof $$referenceView === 'object') {
                angle = Svg.getAttrRotate($$referenceView.getAttr('transform'))[0];
            } else {
                angle = $$referenceView;
            }
            var r = r;
            //将点进行平移，并改变象限
            this.makeAbsViewHorizontal($$view, angle, r, centerX, centerY, marginX, marginY, nagitive);

            //矩形框的位置信息
            var pointBox = $$view.getRenderBox();
            //获取点到矩形的最短距离、坐标
            var shortDistance = GraphMath.getRectShortestDistance({x: centerX, y: centerY}, pointBox);


            //求原点离该距离的坐标
            var asbPos = GraphMath.getLightPos({x: centerX, y: centerY}, shortDistance.pos, distance);
            var subx = asbPos.x - shortDistance.pos.x;
            var suby = asbPos.y - shortDistance.pos.y;
            //求直线坐标
            var translate = Svg.getAttrTranslate($$view.getAttr('transform'));
            if (!isNaN(translate[0] + subx)) {
                $$view.setTranslate(translate[0] + subx, translate[1] + suby);
            } else {
                Logger.warn($$view, 'makeViewAround error  isNAN');
            }

        }
    };


    return ViewUtils;

});
/**
 * Created by ylf on 2016/9/1.
 * 箭号
 */
define('js/view/arrow', ['js/view/BaseView', 'js/config/style', 'js/utils/view'], function (BaseView, Style, View) {


    var ArrowStyle = {
        activeFill: kity.Color.parse('#fff'),
        //这边类型和Arrow.Type一致
        bgCls: {
            '0': 'bg_blue ',
            '1': 'bg_red',
            '2': 'bg_purple'
        }
    };


    var Arrow = BaseView({
        _$$path: null,
        _$$activePath: null,
        _type: null,
        _width: 42,
        _contraryDirection: false,//是否反向
        create: function (type, contraryDirection) {
            var instance = Object.create(this);
            instance.__base([]);
            instance._type = type;
            instance._contraryDirection = contraryDirection;
            instance.createView();
            return instance;
        },
        createView: function () {
            this._$$activePath = new kity.Path('M6.913,46c-0.136,0-0.273-0.011-0.41-0.034c-1.06-0.176-1.889-1.01-2.059-2.071    c-1.172-7.314,4.579-15.533,7.306-18.948C3.348,13.541,4.311,6.795,4.456,6.033C4.632,5.102,5.32,4.352,6.232,4.094    C6.456,4.031,6.685,4,6.912,4C7.605,4,8.279,4.288,8.76,4.816c12.288,13.49,24.683,17.681,24.806,17.722    c0.993,0.327,1.677,1.236,1.716,2.281c0.04,1.044-0.575,2.002-1.54,2.403C14.267,35.3,9.17,44.578,9.12,44.671    C8.682,45.498,7.826,46,6.913,46z');
            this._$$path = new kity.Path('M6.912,43.5c0,0,5.342-10.071,25.873-18.588c0,0-13-4.281-25.873-18.412    c0,0-1.268,6.674,8.038,18.526C14.95,25.026,5.593,35.268,6.912,43.5z');
            this._$$activePath.fill(ArrowStyle.activeFill);
            this._$$path.fill(ArrowStyle.activeFill);
            this._$$path.setAttr('class', ArrowStyle.bgCls[this._type]);
            this._$$clickArea = new kity.Rect().fill(kity.Color.createRGBA(0, 0, 0, 0));
            //点击区域大小
            this._$$clickArea.setSize(36, 60);
            this._$$clickArea.setTranslate(0, -5);
            if (this._contraryDirection) {
                //
                this.getView().setRotate(180,16,0);
            }

            this.addShape(this._$$activePath);
            this.addShape(this._$$path);
            this.addShape(this._$$clickArea);
        },
        getHeight: function () {
            return 42;
            //return this._$$activePath.getHeight();
        },
        getWidth: function () {
            return 32;
        },
        active: function (active) {
            View.setVisibility(this._$$activePath, active);
        },
        isActive: function () {
            return !View.isVisibilityHidden(this._$$activePath);
        },
        changeType: function (type) {
            this._$$path.setAttr('class', ArrowStyle.bgCls[type]);
        },
        restoreType: function () {
            this._$$path.setAttr('class', ArrowStyle.bgCls[this._type]);
        }

    });

    Arrow.Type = {
        Blue: '0',
        Red: '1',
        Purple: '2'
    };

    return Arrow;
})
;
/**
 * Created by ylf on 2016/7/22.
 */
define('js/view/baseView', ['js/base/base', 'js/utils/utils', 'js/reflector/domevent', 'js/utils/svg', 'js/utils/graphMath', 'js/utils/view'], function (Base, Utils, DomEvent, Svg, GraphMath, View) {

    var BaseView = {
        __overwrite: ['domEventHandler', 'setVisibility'],
        _uuid: null,
        _$$view: null,
        __base: function (eventbus, eventInfos) {
            Base({}).__base.apply(this, [eventbus, eventInfos]);
            if (!this._uuid) {
                this._uuid = Utils.getUuid();
            }
            this._$$view = new kity.Group();
        },
        bindDomEvent: function (dom, domEvent, identifier, callback, stopPropagation) {
            if (dom instanceof jQuery) {
                dom = dom[0];
            }
            DomEvent.addDomEvent(dom, domEvent, identifier, stopPropagation);
            this.__on(identifier, callback, '');
        },
        domEventHandler: function (uuid, eventType, dom) {
            //各自实现来处理事件
        },
        getUuid: function () {
            return this._uuid;
        },
        getView: function () {
            return this._$$view;
        },
        addShape: function ($$shape) {
            this._$$view.addShape($$shape);
        },
        setTranslate: function (x, y) {
            if (arguments.length === 1 && typeof x === 'string') {
                this._$$view.setTranslate(x);
            } else {
                this._$$view.setTranslate(x + ' ' + y);
            }
        },
        setTranslateX: function (x) {
            var translate = Svg.getAttrTranslate($(this._$$view.node).attr('transform'));
            if (translate.length > 0) {
                this.setTranslate(x, translate[1]);
            }
        },
        setOpacity: function (opacity) {
            this._$$view.setStyle({opacity: opacity});
        },
        translate: function (x, y) {
            this._$$view.translate(x, y);
        },
        setVisible: function (visible) {
            this._$$view.setVisible(visible);
        },
        isVisible: function () {
            return (!this.isVisibilityHidden()) && this.getVisible();
        },
        setVisibility: function (visible) {
            View.setVisibility(this._$$view, visible);
        },
        isVisibilityHidden: function () {
            return View.isVisibilityHidden(this._$$view);// $(this._$$view.node).css('visibility') === 'hidden';
        },
        makeAbsViewHorizontal: function ($$view, angle, r, centerX, centerY, marginX, marginY, nagitive) {
            View.makeAbsViewHorizontal($$view, angle, r, centerX, centerY, marginX, marginY, nagitive);
        },
        makeViewAround: function ($$view, $$referenceView, r, distance, centerX, centerY, marginX, marginY, nagitive) {
            View.makeViewAround($$view, $$referenceView, r, distance, centerX, centerY, marginX, marginY, nagitive);
        }
    };


    return function (cls) {
        return Base(BaseView).__include(cls);
    };


});
/**
 * Created by ylf on 2016/8/4.
 * 扇面名称和角度
 */
define('js/view/EqualAngleName', ['js/view/BaseView', 'js/config/style'], function (BaseView, Style) {


    var EqualAngleNameStyle = Style.EqualAngleName;


    var EqualAngleName = BaseView({
        create: function (lang) {
            var instance = Object.create(this);
            instance.__base([]);
            instance._lang = lang;
            instance.createView();
            return instance;
        },
        createView: function () {
            this._$$name = new kity.Text();
            this._$$name.setContent(this._lang['rf_equal_angle_name']).setAttr('class', EqualAngleNameStyle.fontClass);
            this.addShape(this._$$name);
        }
    });


    return EqualAngleName;
});
/**
 * Created by ylf on 2016/7/29.
 */
define('js/view/ForeignView', ['js/base/base', 'js/utils/utils', 'js/utils/svg'], function (Base, Utils, Svg) {

    var ForeignView = Base({
        _uuid: null,
        _$view: null,
        _$insideView: null,
        _width: 0,
        _height: 0,
        _cls: '',
        create: function (cls, width, height) {
            var instance = Object.create(this);
            instance.__base(null, []);
            instance._cls = cls;
            instance._uuid = Utils.getUuid();
            instance._$view = Svg.createJqForeignObject(cls);
            instance._$insideView = instance._$view.find('div');
            instance.setWidth(width);
            instance.setHeight(height);

            return instance;
        },
        setDomEvent: function (domEvent) {
            if (domEvent && domEvent.length > 0) {
                this._$view.attr('class', '_lr_event');
                this._$view.data('event-type', domEvent);
                this._$view.data('event-identifier', this._uuid);
            }
        },
        getUuid: function () {
            return this._uuid;
        },
        setWidth: function (width) {
            this._width = width;
            this._$view.css({width: width});
            this._$view.attr("width", width);
            this._$insideView.css({width: width});
            return this;
        },
        setHeight: function (height) {
            this._height = height;
            this._$view.css({height: height});
            this._$view.attr("height", height);
            this._$insideView.css({height: height});
            return this;
        },
        setForeignWidth:function (width) {
            this._$view.attr('width', width);
        },
        setForeignHeight:function (height) {
            this._$view.attr('height', height);
        },
        setInsideWidth:function (width) {
            this._$insideView.css({width: width});
        },
        setInsideHeight:function (height) {
            this._$insideView.css({height: height});
        },
        getView: function () {
            return this._$view;
        },
        appendHtml: function (html) {
            this._$insideView.append(html);
        },
        setTranslate: function (x, y) {
            var rotate = Svg.getAttrRotate(this._$view.attr('transform'));
            var translate = [x, y];
            this.applyTransform(translate, rotate);
        },
        setRotate: function (degre, cx, cy) {
            var translate = Svg.getAttrTranslate(this._$view.attr('transform'));
            var rotate = [degre];
            if (typeof cx !== typeof  undefined && typeof cy !== typeof  undefined) {
                rotate.push(cx);
                rotate.push(cy);
            }
            this.applyTransform(translate, rotate);
        },
        applyTransform: function (translate, rotate) {
            var transform = '';
            if (translate.length > 1) {
                transform = 'translate(' + translate[0] + ' ' + translate[1] + ')';
            }
            if (rotate.length === 1) {
                transform += ' rotate(' + rotate[0] + ')';
            } else if (rotate.length === 3) {
                transform += ' rotate(' + rotate[0] + ' ' + rotate[1] + ' ' + rotate[2] + ')';
            }
            this._$view.attr('transform', transform);
        },
        setVisible: function (visible) {
            if (visible) {
                this._$view.show();
            } else {
                this._$view.hide();
            }
        },
        setVisibility: function (visible) {
            this._$view.css({'visibility': visible ? '' : 'hidden'});
        },
        setOpacity: function (opacity) {
            this._$view.css({opacity: opacity});
        },
        setAttr: function (key, val) {
            this._$view.attr(key, val);
        },
        addClass: function (cls) {
            this._$insideView.addClass(cls);
        },
        removeClass: function (cls) {
            this._$insideView.removeClass(cls);
        },
        hasClass: function (cls) {
            return this._$insideView.hasClass(cls);
        }
    });


    return ForeignView;


});
/**
 * Created by ylf on 2016/8/15.
 * 垂足符号
 */
define('js/view/IncidencePoint', ['js/view/BaseView', 'js/config/style', 'js/utils/view'], function (BaseView, Style) {

    var IncidencePointStyle = Style.IncidencePoint;

    var IncidencePoint = BaseView({
        _$$line: null,
        create: function (data) {
            var instance = Object.create(this);
            instance.__base([]);
            instance._data = data;
            instance.createView();
            return instance;
        },
        createView: function () {
            this._$$incidencePoint = new kity.Circle(IncidencePointStyle.width).fill(IncidencePointStyle.fill);
            this._$$incidencePoint = new kity.Circle(IncidencePointStyle.width).fill(IncidencePointStyle.fill);
            this.addShape(this._$$incidencePoint);
        },
        setRotate: function (angle, x, y) {
            x = typeof x === typeof undefined ? 0 : x;
            y = typeof y === typeof undefined ? 0 : y;
            this._$$line.setRotate(angle + ' ' + x + ' ' + y);
        }
    });


    return IncidencePoint;
});
/**
 * Created by hsm on 2016/8/24.
 * 入射线
 */
define('js/view/Inverserefractionline', ['js/view/BaseView', 'js/config/style', 'js/utils/view', 'js/utils/svg'], function (BaseView, Style, View, Svg) {


    var InverseRefractionLineStyle = Style.InverseRefractionLine;

    var InverseRefractionLine = BaseView({
        _$$line: null,
        _domEvent: null,
        _width: 200,
        _$$name: null,
        _pointVisible: false,
        _lineVisible: false,
        create: function (width) {
            var instance = Object.create(this);
            instance.__base([]);
            instance._width = width;
            instance.createView();
            return instance;
        },
        createView: function () {
            //1.反向折射线
            this._$$line = new kity.Path('').setStyle(InverseRefractionLineStyle.strokeStyle);
            this._$$line.setAttr('d', 'M0 0 ' + this._width + ' 0');
            this._$$line.setAttr('stroke-dasharray', '15,12');
            this.addShape(this._$$line);

            //2.名称
            this._$$name = new kity.Text();
            this._$$name.setContent(InverseRefractionLineStyle.name).setAttr('class', InverseRefractionLineStyle.fontClass);
            this.addShape(this._$$name);

            //3.入射点名称
            this._$$nameDown = new kity.Text();
            this._$$nameDown.setContent(InverseRefractionLineStyle.incidencePointName).setAttr('class', InverseRefractionLineStyle.fontClass);
            this.addShape(this._$$nameDown);
        },
        setRotate: function (angle, x, y) {
            x = typeof x === typeof undefined ? this._width : x;
            y = typeof y === typeof undefined ? 0 : y;
            this._$$line.setRotate(angle + ' ' + x + ' ' + y);
            this.initNamePos(x, y);
        },
        getRotateAngle: function () {
            var rotate = Svg.getAttrRotate(this._$$line.getAttr('transform'));
            return rotate[0];
        },
        initNamePos: function (centerX, centerY) {
            centerX = typeof centerX === typeof undefined ? this._width : centerX;
            centerY = typeof centerY === typeof undefined ? 0 : centerY;
            var downWidth = this._$$nameDown.getWidth();
            var nameWidth = this._$$name.getWidth();
            this.makeViewAround(this._$$name, this._$$line, this._width, this._width + 25, centerX, centerY, -nameWidth / 2 + 5, 0, false);
            this.makeViewAround(this._$$nameDown, this._$$line, 150, 25, centerX, centerY, -downWidth / 2 + 5, 0, true);
        },
        setNameVisible: function (visible) {
            this._$$nameDown.setContent(visible === true ? InverseRefractionLineStyle.incidencePointName : '');
            this._$$name.setContent(visible === true ? InverseRefractionLineStyle.name : '');
            this.initNamePos();
        },
        setPointNameVisibility: function (nameVisible, visible) {
            this._pointVisible = visible;
            this._$$nameDown.setContent(nameVisible === true ? InverseRefractionLineStyle.incidencePointName : '');
            View.setVisibility(this._$$nameDown, visible);
            View.setVisibility(this._$$name, this._lineVisible);
            View.setVisibility(this._$$line, this._lineVisible);
            this.setVisibility(true);
            this.initNamePos();
        },
        setLineVisibility: function (nameVisible, visible) {
            this._lineVisible = visible;
            this._$$name.setContent(nameVisible === true ? InverseRefractionLineStyle.name : '');
            View.setVisibility(this._$$name, visible);
            View.setVisibility(this._$$nameDown, this._pointVisible);
            View.setVisibility(this._$$line, visible);
            this.setVisibility(true);
            this.initNamePos();
        },
        showAll: function () {
            this.setVisibility(true);
            View.setVisibility(this._$$name, true);
            View.setVisibility(this._$$nameDown, true);
            View.setVisibility(this._$$line, true);
            this.initNamePos();
        },
        getLineVisible: function () {
            return this._lineVisible;
        },
        getPointNameVisible: function () {
            return this._pointVisible;
        }
    });

    return InverseRefractionLine;
});
/**
 * Created by ylf on 2016/7/25.
 * 入射线
 */
define('js/view/LightLine', ['js/view/BaseView', 'js/config/style', 'js/utils/utils', 'js/utils/graphmath', 'js/utils/svg', 'js/view/ForeignView', 'js/config/eventKey', 'js/utils/view'], function (BaseView, Style, Utils, GraphMath, Svg, ForeignView, EventKey, View) {


    var LineStyle = Style.LineStyle;
    var strokeWidth = LineStyle.strokeStyle['stroke-width'];
    var Arrow = require('js/view/arrow');

    var CONFIG = {
        width: 290,//整体长度
        arrowPos: 145,//箭号所在位置
        visible: true,//是否显示
        clickAble: true,//是否允许点击和移动
        nameEnable: true//是否需要名称支持
    };

    var LightLine = BaseView({
        _$$lineGroup: null,
        _lineGroupUuid: '',
        _$$lintWhite: null,
        _arrow: null,
        _fwBtn: null,
        _fwTranBtn: null,
        _config: null,
        _lightType: null,
        _$$name: null,
        _onLightMove: null,
        _onLightTrans: null,
        _onLightFocusBlur: null,//点击光线需要改变场景的背景
        _lang: null,
        create: function (eventbus, lightType, config, onLightMove, onLightTrans, onLightFocusBlur, lang) {
            var instance = Object.create(this);
            var eventInfos = [];
            eventInfos.push({key: EventKey.Blur, callback: instance.blur, params: []});
            //instance._uuid = Utils.getUuid();
            //eventInfos.push({key: EventKey.BtnMove + instance._uuid, callback: instance.domEventHandler, params: []});
            instance.__base(eventbus, eventInfos);
            instance._lightType = lightType;
            instance._config = $.extend(true, {}, CONFIG, config);
            instance._onLightMove = onLightMove;
            instance._onLightTrans = onLightTrans;
            instance._onLightFocusBlur = onLightFocusBlur;
            instance._lineGroupUuid = Utils.getUuid();
            instance._lang = lang;
            instance.createView();
            instance.__on(EventKey.BtnMove + instance._fwBtn.getUuid(), instance.domEventHandler, []);
            instance.__on(EventKey.BtnMove + instance._fwTranBtn.getUuid(), instance.domEventHandler, []);
            return instance;
        },
        createView: function () {

            //添加一个标记，用于获取缩放值
            this._$$offsetPoint = new kity.Circle(10).fill(kity.Color.createRGBA(0, 0, 0, 0));
            this.addShape(this._$$offsetPoint);

            //添加名称
            this._$$name = new kity.Text();
            var name = this._lightType === LightLine.Type.IncidenceLine ? this._lang['rf_incidence_line_name'] : this._lang['rf_refraction_line_name'];
            this._$$name.setContent(name).setAttr('class', LineStyle[this._lightType].fontClass);
            this.addShape(this._$$name);

            this._$$lineGroup = new kity.Group();


            //添加白边
            this._$$lintWhite = new kity.Rect().setStyle(LineStyle.strokeStyle);
            this._$$lintWhite.setSize(this.getWidth() + strokeWidth, LineStyle.rectHeight + strokeWidth);
            this._$$lintWhite.translate(-strokeWidth / 2, -strokeWidth / 2);
            this._$$lineGroup.addShape(this._$$lintWhite);

            //添加箭头
            this._arrow = Arrow.create(this._lightType === LightLine.Type.IncidenceLine ? Arrow.Type.Blue : Arrow.Type.Red, this._lightType === LightLine.Type.RefractionLine);
            this._$$lineGroup.addShape(this._arrow.getView());

            this.initArrowPos();

            //增加透明区域，放大点击区域
            this._$$lintClick = new kity.Rect().fill(kity.Color.createRGBA(0, 0, 0, 0));
            var clickWidth = LineStyle.arrow.height / 5;
            this._$$lintClick.setSize(this.getWidth() + strokeWidth, clickWidth);
            this._$$lintClick.translate(0, -(clickWidth - LineStyle.rectHeight) / 2);
            this._$$lineGroup.addShape(this._$$lintClick);


            //添加白边内实心矩形
            this._$$whiteRect = new kity.Rect();
            this._$$whiteRect.setSize(this.getWidth(), LineStyle.rectHeight);
            this._$$whiteRect.fill(LineStyle[this._lightType].fill);
            this._$$lineGroup.addShape(this._$$whiteRect);

            //旋转按钮
            this._fwBtn = ForeignView.create('btn_rotate', LineStyle.btnRotate.width, LineStyle.btnRotate.height);
            //this._fwBtn.setTranslate(-LineStyle.btnRotate.width - 10, (LineStyle.rectHeight - LineStyle.btnRotate.height) / 2);
            this._fwBtn.setTranslate(0, -LineStyle.btnRotate.height - 10);
            this._fwBtnInvisible = ForeignView.create('btn_rotate', LineStyle.btnRotate.width, LineStyle.btnRotate.height);
            //this._fwBtnInvisible.setTranslate(-LineStyle.btnRotate.width - 10, (LineStyle.rectHeight - LineStyle.btnRotate.height) / 2);
            this._fwBtnInvisible.setTranslate(0, -LineStyle.btnRotate.height - 10);
            this._fwBtnInvisible.setVisibility(false);
            this._fwBtn.setVisibility(false);
            $(this._$$lineGroup.node).append(this._fwBtn.getView());
            $(this._$$lineGroup.node).append(this._fwBtnInvisible.getView());

            //平移按钮
            this._fwTranBtn = ForeignView.create('btn_translate', LineStyle.btnRotate.width, LineStyle.btnRotate.height);
            this._fwTranBtn.setTranslate(0, LineStyle.btnRotate.height -45);
            /*记录初始位置用*/
            this._fwTranBtnInvisible = ForeignView.create('btn_translate', LineStyle.btnRotate.width, LineStyle.btnRotate.height);
            this._fwTranBtnInvisible.setTranslate(0, LineStyle.btnRotate.height -45);
            this._fwTranBtnInvisible.setVisibility(false);
            this._fwTranBtn.setVisibility(false);
            $(this._$$lineGroup.node).append(this._fwTranBtn.getView());
            $(this._$$lineGroup.node).append(this._fwTranBtnInvisible.getView());

            this.addShape(this._$$lineGroup);

            //绑定事件
            //this.bindDomEvent(this._fwBtn.getView(), ['beforemove', 'move', 'aftermove'], this._fwBtn.getUuid(), this.domEventHandler, false);
            //this.bindDomEvent(this._fwTranBtn.getView(), ['beforemove', 'move', 'aftermove'], this._fwTranBtn.getUuid(), this.domEventHandler, false);
            this.bindDomEvent(this._$$lineGroup.node, ['lrTap'], this._lineGroupUuid, this.domEventHandler, false);

            this.initView();
        },
        getWidth: function () {
            return this._config.width;
        },
        setWidth: function (width) {
            this._config.width =  width=isNaN(width)? this._config.width: width;

            //this._config.arrowPos = (width - this._arrow.getWidth()) / 2;
            if (this._lightType === LightLine.Type.RefractionLine) {
                this._config.arrowPos = (width - this._arrow.getWidth()) / 3;
            }else{
                this._config.arrowPos = (width - this._arrow.getWidth()) - (width - this._arrow.getWidth()) / 3;
            }

            //线没有箭号长时，隐藏入射箭号
            if (this._config.width <= this._arrow.getWidth() + 10) {
                this._arrow.setVisibility(false);
            } else {
                this._arrow.setVisibility(true);
            }
            this._$$lintWhite.setSize(this.getWidth() + strokeWidth, LineStyle.rectHeight + strokeWidth);
            var clickWidth = LineStyle.arrow.height / 3;
            this._$$lintClick.setSize(this.getWidth() + strokeWidth, clickWidth);
            this._$$whiteRect.setSize(this.getWidth(), LineStyle.rectHeight);

            this.initArrowPos();
            this.setTranslate(-this.getWidth(), -1);
            var rotate = Svg.getAttrRotate(this._$$lineGroup.getAttr('transform'));
            if (rotate && rotate.length > 0) {
                this._$$lineGroup.setRotate((rotate[0] ) + ' ' + this.getWidth() + ' ' + rotate[2]);
            }
            //移动按钮不超过线末端

            this._tranBtnTranslate();
            this.initNamePos();
        },
        setArrowPos: function (arrowPos) {
            this._config.arrowPos = isNaN(arrowPos)? this._config.arrowPos: arrowPos;
            this.initArrowPos();
        },
        initArrowPos: function () {
            //这里加上两个偏差
            if (this._lightType === LightLine.Type.RefractionLine) {
                this._arrow.setTranslate(this.getArrowPos(), (LineStyle.rectHeight + this._arrow.getHeight()) / 2 + 3.5);
            } else {
                this._arrow.setTranslate(this.getArrowPos(), ( -this._arrow.getHeight() - LineStyle.rectHeight) / 2 + 1+3);
            }
        },
        getArrowPos: function () {
            return this._config.arrowPos;
        },
        blur: function (uuid) {
            if (uuid !== this._lineGroupUuid) {
                //this._fwBtn.setVisible(false);

                this.setFwBtnVisible(false);
                this._$$lintWhite.setVisible(false);
                this._arrow.active(false);

                this._fwTranBtn.setVisible(false);
                this._onLightFocusBlur("blur");
            }
        },
        setClickAble: function (clickable) {
            this._config.clickAble = clickable;
        },
        domEventHandler: function (eventType, uuid, data) {
            if (!this._config.clickAble) {
                return;
            }
            if (uuid === this._fwBtn.getUuid()) {
                this._onLightMove(this._lightType, data, eventType);
                if (eventType === 'aftermove') {
                    this.__triggerEvent('insidechange', this._lightType + '-move');
                }
            } else if (uuid === this._fwTranBtn.getUuid()) {
                this._onLightTrans(this._lightType, data, eventType);

                if (eventType === 'aftermove') {
                    this.__triggerEvent('insidechange', this._lightType + '-move');
                }
            } else if (uuid === this._lineGroupUuid) {
                if (eventType === 'lrTap') {
                    if (this._arrow.isActive()) {
                        this.blur();
                        return;
                    }
                    //this._fwBtn.setVisible(true);

                    this.setFwBtnVisible(true);
                    this._$$lintWhite.setVisible(true);
                    this._arrow.active(true);
                    this._fwTranBtn.setVisible(true);
                    this._onLightFocusBlur("focus");
                }
            }
            this.btnStillInBox();
            this._tranBtnTranslate();
        },
        initView: function () {
            //this._fwBtn.setVisible(false);
            this.setFwBtnVisible(false);
            this._fwTranBtn.setVisible(false);
            this._$$lintWhite.setVisible(false);
            this._arrow.active(false);
            if (this._config.nameEnable === false) {
                View.setVisibility(this._$$name, false)
            }
            this.setVisibility(this._config.visible);
        },
        setRotate: function (angle, x, y) {

            x = typeof x === typeof undefined ? this.getWidth() : x;
            y = typeof y === typeof undefined ? LineStyle.rectHeight / 2 : y;

            this._$$lineGroup.setRotate(angle + ' ' + x + ' ' + y);
            this.initNamePos(x, y);
            this.fwBtnMove();
        },
        rotate: function (angle, x, y) {
            x = typeof x === typeof undefined ? this.getWidth() : x;
            y = typeof y === typeof undefined ? LineStyle.rectHeight / 2 : y;
            var rotate = Svg.getAttrRotate(this._$$lineGroup.getAttr('transform'));
            if (rotate && rotate.length > 0) {
                this._$$lineGroup.setRotate((rotate[0] + angle) + ' ' + x + ' ' + y);
            } else {
                this._$$lineGroup.setRotate(angle + ' ' + x + ' ' + y);
            }
            this.initNamePos(x, y);
            this.fwBtnMove();
        },
        getRotateAngle: function () {
            var rotate = Svg.getAttrRotate(this._$$lineGroup.getAttr('transform'));
            return rotate[0];
        },
        initNamePos: function (x, y) {
            return false;
            x = typeof x === typeof undefined ? this.getWidth() : x;
            y = typeof y === typeof undefined ? LineStyle.rectHeight / 2 : y;
            //this.makeViewHorizontal(this._$$name, this._$$lineGroup, this._width, 60, 0);
            this.makeViewAround(this._$$name, this._$$lineGroup, this.getWidth(), this.getWidth() + 15, x, y, 0, 10, false);
        },
        getRotatePos: function () {
            return {x: this.getWidth(), y: LineStyle.rectHeight / 2};
        },
        setNameVisible: function (visible) {
            if (this._config.nameEnable) {
                View.setVisibility(this._$$name, visible);
            }
        },
        //设置公共线样式
        setCommonFill: function () {
            this._$$whiteRect.fill(LineStyle.commonLineFill);
            this._arrow.changeType(Arrow.Type.Purple);
        },
        //从公共线还原
        restoreFill: function () {
            this._$$whiteRect.fill(LineStyle[this._lightType].fill);
            this._arrow.restoreType();
        },
        setNameEnable: function (nameEnable) {
            this._config.nameEnable = nameEnable;
            View.setVisibility(this._$$name, nameEnable);
        },
        getNameEnable: function () {
            return this._config.nameEnable;
        },
        setOpacityIgnoreName: function (opacity) {
            $(this._$$lineGroup.node).css({opacity: opacity});
            $(this._arrow.getView()).css({opacity: opacity});
            $(this._$$lineGroup.node).css({opacity: opacity});
        },
        setVisibility: function (visible) {
            BaseView({}).setVisibility.apply(this, [visible]);
            this.__triggerEvent(EventKey.LightLineVisible, this._lightType, visible);
        },

        makeNameViewAround: function (aroundLineAngle, x, y) {
            x = typeof x === typeof undefined ? this.getWidth() : x;
            y = typeof y === typeof undefined ? LineStyle.rectHeight / 2 : y;
            aroundLineAngle = typeof aroundLineAngle === typeof undefined ? this._$$lineGroup : aroundLineAngle;
            this.makeViewAround(this._$$name, aroundLineAngle, this.getWidth(), this.getWidth() + 10, x, y, 0, 0, false);
        },
        getLightType: function () {
            return this._lightType;
        },
        _tranBtnTranslate: function () {
            var rotateTranslate = Svg.getAttrTranslate(this._fwBtn.getView().attr('transform'));
            var tranBtnTranslate = Svg.getAttrTranslate(this._fwTranBtn.getView().attr('transform'));
            var translateX = rotateTranslate[0];
            this._fwTranBtn.setTranslate(translateX, tranBtnTranslate[1]);
            this.fwBtnMove();
        },
        btnStillInBox: function () {
            var svg = this._fwBtn.getView().closest('svg');
            var originalRect = this._fwBtnInvisible.getView()[0].getBoundingClientRect();
            var svgRect = this._fwBtn.getView().closest('svg')[0].getBoundingClientRect();
            var originalRectTran =  this._fwTranBtnInvisible.getView()[0].getBoundingClientRect();/*平移按钮默认位置*/
            this.originalRect = originalRect;
            this.svgRect = svgRect;
            var angle = Math.abs(this.getRotateAngle() % 180);
            //统一计算与X轴锐角
            if (angle <= 0) {
                angle = -angle;
            }
            if (angle > 90) {
                angle = 180 - angle;
            }

            var translate = Svg.getAttrTranslate(this._fwBtnInvisible.getView().attr('transform'));
            if (translate.length <= 0) {
                return;
            }

            //inside svg
            if (originalRect.bottom <= svgRect.bottom && originalRect.left >= svgRect.left && originalRect.right <= svgRect.right && originalRect.top >= svgRect.top && originalRectTran.bottom <= svgRect.bottom && originalRectTran.left >= svgRect.left && originalRectTran.right <= svgRect.right && originalRectTran.top >= svgRect.top) {
                //this._fwBtn.setTranslate(-LineStyle.btnRotate.width - 10, translate[1]);
                //this._fwBtn.setTranslate(-LineStyle.btnRotate.width - 10, translate[1]);
                this.fwBtnTranslate(0, translate[1]);

            } else {
                var translateX = 0;
                var scale = this.getScale();
                if (originalRect.left <= svgRect.left || originalRectTran.left <= svgRect.left) {
                    //超出左侧
                   // var subY = svgRect.left - originalRect.left;
                    //var x = (subY / Math.cos(GraphMath.getRadian(angle))) / scale;

                    var x = 0;
                    //if(angle != 90){
                    //    x = (subY / Math.cos(GraphMath.getRadian(angle))) / scale;
                    //}

                    translateX = translate[0] - ( -x);
                    //this._fwBtn.setTranslate(translateX, translate[1]);
                    this.fwBtnTranslate(translateX, translate[1]);
                    //svg.trigger('mouseleave');
                    //svg.trigger('mouseup');
                }

                //超出右側
                if (originalRect.right >= svgRect.right || originalRectTran.right >= svgRect.right) {
                  //  var subY =  originalRect.right -svgRect.right;
                    //var x = (subY / Math.cos(GraphMath.getRadian(angle))) / scale;
                    var x = 0;

                    //if(angle != 90){
                    //    x = (subY / Math.cos(GraphMath.getRadian(angle))) / scale;
                    //}
                    translateX = translate[0] - ( -x);


                    //this._fwBtn.setTranslate(translateX, translate[1]);
                    this.fwBtnTranslate(translateX, translate[1]);
                    //svg.trigger('mouseleave');
                    //svg.trigger('mouseup');
                }

                if (originalRect.bottom >= svgRect.bottom) {
                    // 超出下方
                    var subY = originalRect.bottom - svgRect.bottom;
                    //var x = (subY / Math.sin(GraphMath.getRadian(angle))) / scale;
                    var x = 0;
                    if(angle != 0){
                        x = (subY / Math.sin(GraphMath.getRadian(angle))) / scale;
                    }
                    if (translateX == 0 || translateX < translate[0] + x) {
                        translateX = translate[0] + x
                    }

                    //this._fwBtn.setTranslate(translateX, translate[1]);
                    this.fwBtnTranslate(translateX, translate[1]);
                }
                /*平移按钮超出下方*/
                if (originalRectTran.bottom >= svgRect.bottom) {
                    // 超出下方
                    var subY = originalRectTran.bottom - svgRect.bottom;
                    //var x = (subY / Math.sin(GraphMath.getRadian(angle))) / scale;
                    var x = 0;
                    if(angle != 0){
                        x = (subY / Math.sin(GraphMath.getRadian(angle))) / scale;
                    }
                    if (translateX == 0 || translateX < translate[0] + x) {
                        translateX = translate[0] + x
                    }

                    //this._fwBtn.setTranslate(translateX, translate[1]);
                    this.fwBtnTranslate(translateX, translate[1]);
                }

                //超出上方
                if (originalRect.top <= svgRect.top) {
                    var subY = svgRect.top - originalRect.top;
                    //var x = (subY / Math.sin(GraphMath.getRadian(angle))) / scale;
                    var x = 0;
                    if(angle != 0){
                        x = (subY / Math.sin(GraphMath.getRadian(angle))) / scale;
                    }
                    if (translateX == 0 || translateX < translate[0] + x) {
                        translateX = translate[0] + x
                    }
                    //this._fwBtn.setTranslate(translateX, translate[1]);

                    this.fwBtnTranslate(translateX, translate[1]);
                }

                ////超出右侧
                //if (originalRect.right >= svgRect.right) {
                //    //超出左侧
                //    var subY = originalRect.right-svgRect.right;
                //    var x = (subY / Math.cos(GraphMath.getRadian(angle))) / scale;
                //    translateX = translate[0] - ( -x);
                //    //this._fwBtn.setTranslate(translateX, translate[1]);
                //    this.fwBtnTranslate(translateX, translate[1]);
                //}

            }
        },
        fwBtnTranslate: function (x, y) {
            //不能超过线长度
            if (x > this.getWidth() - LineStyle.btnRotate.width) {
                x = this.getWidth() - LineStyle.btnRotate.width;
            }
            this._fwBtn.setTranslate(x, y);
            //this._tranBtnTranslate();
        //    this.fwBtnMove();
        },
        fwBtnMove: function () {
            if (!this.isVisibilityHidden()) {
                this.__triggerEvent(EventKey.MoveBtn, this.getScale(), this._fwBtn.getView()[0].getBoundingClientRect(), this._fwTranBtn.getView()[0].getBoundingClientRect(), this._fwBtn.getUuid(), this._fwTranBtn.getUuid());
            }
        },
        setFwBtnVisible: function (visible) {
            //this._fwBtn.setVisible(visible);


            this.__triggerEvent(EventKey.MoveBtn, this.getScale(), this._fwBtn.getView()[0].getBoundingClientRect(), this._fwTranBtn.getView()[0].getBoundingClientRect(), this._fwBtn.getUuid(), this._fwTranBtn.getUuid(), visible);
            //this.__triggerEvent(EventKey.MoveBtn, this.getScale(), this._fwBtn.getView()[0].getBoundingClientRect(), this._fwBtn.getUuid(), this._fwTranBtn.getUuid(), visible);
        },
        getScale: function () {
            var scale = (this._$$offsetPoint.node.getBoundingClientRect().width / 20) || 1;
            return scale;
        },
        /**
         * 场景4,5用
         */
        setNameDisplay: function (str) {
            $(this._$$name.node).css("display", str);
        },
        /**
         * 把按钮移到上面
         */
        //gtIndexBtnAppendToView: function($$container){
        //    $($$container.node).append(this._fwBtn);
        //    $($$container.node).append(this._fwBtn);
        //}
    });

    //静态方法
    LightLine.Type = {
        IncidenceLine: 'IncidenceLine',
        ReflectionLine: 'ReflectionLine',
        RefractionLine: 'RefractionLine',
        NormalLine: 'NormalLine',
        SurfaceIn: 'SurfaceIn',
        SurfaceOut: 'SurfaceOut'
    };

    return LightLine;
});
/**
 * Created by ylf on 2016/7/26.
 */
define('js/view/multipleText', ['js/view/BaseView', 'js/utils/view'], function (BaseView, View) {


    var MultipleText = BaseView({
        _lineHeight: 18,
        _$$texts: [],
        create: function (lineHeight) {
            var instance = Object.create(this);
            instance._$$texts = [];
            instance._lineHeight = lineHeight;
            instance.__base([]);
            instance.createView();
            //创建节点容器
            return instance;
        },
        createView: function () {
        },
        setContent: function (lines) {
            this.clear();
            var that = this;
            if (typeof lines === 'string') {
                that.appendLine(lines);
            } else {
                lines.forEach(function (line) {
                    that.appendLine(line);
                });
            }

            this.center();
        },
        center: function () {
            var maxWidth = 0;

            if (this._$$texts.length > 1) {
                var lastIsAngle = false;
                this._$$texts.forEach(function ($$text) {
                    var width = $$text.getWidth();
                    if (width > maxWidth) {
                        maxWidth = width;
                        var content = $$text.getContent();
                        lastIsAngle = content.substring(content.length - 1, content.length) === '°';
                    }
                });
                this._$$texts.forEach(function ($$text) {
                    var width = $$text.getWidth();
                    if (width < maxWidth) {
                        $$text.setAttr('x', Math.abs((maxWidth - width) / 2));
                    }
                });

            }
        },
        getRenderBox: function () {
            return this._$$view.getRenderBox();
        },
        getAttr: function (name) {
            return this._$$view.getAttr(name);
        },
        appendLine: function (text) {
            var y = (this._$$texts.length ) * this._lineHeight;
            var $$text = new kity.Text().setContent(text).setAttr('x', 0).setAttr('y', y >= 0 ? y : 0).setAttr('class', 'nd_NewRoman');
            this._$$texts.push($$text);
            this._$$view.addShape($$text);

        },
        getWidth: function () {
            var width = 0;
            this._$$texts.forEach(function ($$text) {
                if ($$text.getWidth() > width) {
                    width = $$text.getWidth();
                }
            });
            return width;
        },
        getContent: function () {
            //TODO:
        },
        getHeight: function () {
            return this._lineHeight * this._$$texts.length;
        },
        clear: function () {
            this._$$texts.forEach(function ($$text) {
                $$text.remove();
            });
            this._$$texts = [];
        }
    });

    return MultipleText;
});
/**
 * Created by ylf on 2016/8/4.
 * 扇面名称和角度
 */
define('js/view/NameGroup', ['js/view/BaseView', 'js/config/style', 'js/utils/graphmath', 'js/utils/svg', 'js/view/MultipleText', 'js/view/sector', 'js/utils/view'], function (BaseView, Style, GraphMath, Svg, MultipleText, Sector, View) {


    var SectorStyle = Style.Sector;

    var data = {
        "type": {
            name: '',
            angle: 0,
            vertical: true,
            cx: 0,
            cy: 0,
            r: 0
        }
    };

    var anglePaddingLeft = 5;


    var NameGroup = BaseView({
        _data: '',
        _nameVisible: true,
        _$$incidencePoint: null,
        _lang: null,
        _lightHeight: 50,
        _option: null,
        _status: null,
        create: function (data, lang, option) {
            var instance = Object.create(this);
            instance.__base([]);
            instance._data = data;
            instance._lang = lang;
            instance._option = option;
            instance._status = {};
            for (var type in Sector.Type) {
                instance._status[Sector.Type[type]] = false;
            }
            instance.createView();
            return instance;
        },
        createView: function () {
            var that = this;
            for (var key in this._data) {
                var data = this._data[key];
                //名称和度数
                data.mtAngle = MultipleText.create(that._lightHeight);
                data.mtName = MultipleText.create(that._lightHeight);

                if (key == Sector.Type.SurfaceIn || key == Sector.Type.SurfaceOut) {
                    //与反射面夹角
                    data.name = '';
                    data.mtAngle.getView().setAttr('class', SectorStyle.surfaceFontClass);
                } else if (key == Sector.Type.Incidence) {
                    //入射线与法线夹角
                    data.name = this._lang['rf_incidence_angle'];
                    //角度
                    data.mtAngle.getView().setAttr('class', SectorStyle.incidence_normalFontClass);
                    //隐藏的角度，用来确认位置
                    data.mtInvisibleAngle = MultipleText.create(that._lightHeight);
                    data.mtInvisibleAngle.getView().setAttr('class', SectorStyle.normalFontClass);
                    //名称
                    data.mtName = MultipleText.create(that._lightHeight);
                    data.mtName.getView().setAttr('class', SectorStyle.normalFontClass);
                    that.addShape(data.mtInvisibleAngle.getView());
                    View.setVisibility(data.mtInvisibleAngle.getView(), false);
                } else if (key == Sector.Type.Refraction) {
                    //反射线与法线夹角
                    data.name = this._lang['rf_refraction_angle'];
                    data.mtAngle.getView().setAttr('class', SectorStyle.normalFontClass);
                    data.mtInvisibleAngle = MultipleText.create(that._lightHeight);
                    data.mtInvisibleAngle.getView().setAttr('class', SectorStyle.normalFontClass);
                    //名称
                    data.mtName = MultipleText.create(that._lightHeight);
                    data.mtName.getView().setAttr('class', SectorStyle.normalFontClass);
                    that.addShape(data.mtInvisibleAngle.getView());
                    View.setVisibility(data.mtInvisibleAngle.getView(), false);
                }
                data.angleStr = '';
                data.angle = 0;
                that.addShape(data.mtAngle.getView());
                that.addShape(data.mtName.getView());
                data.mtName.setVisibility(false);
            }
        },
        getAngle: function (type) {
            return this._data[type].actualAngle;
        },
        getRoundAngle: function (type) {
            return this._data[type].angle;
        },
        setNormalAngle: function (normalAngle) {
            this._normalAngle = normalAngle;
        },
        rotate: function (angle, nagative) {
            var __getIndex = function (index, nagative, sub) {
                return nagative ? sub - index : index;
            };
            this._rotate(Sector.Type.SurfaceIn, angle[__getIndex(0, nagative, 3)], angle[__getIndex(1, nagative, 5)]);
            this._rotate(Sector.Type.Incidence, angle[__getIndex(1, nagative, 3)], angle[__getIndex(2, nagative, 5)]);
            //this._rotate(Sector.Type.Refraction, angle[__getIndex(2, nagative, 3)], angle[__getIndex(3, nagative, 5)]);
  	
            this._rotate(Sector.Type.Refraction, angle[__getIndex(3, nagative, 3)], angle[__getIndex(4, nagative, 5)]);
            this._rotate(Sector.Type.SurfaceOut, angle[__getIndex(3, nagative, 3)], angle[__getIndex(4, nagative, 5)]);
        },
        _rotate: function (type, startAngle, endAngle) {
           // console.log("startAngle = "+ startAngle +" ,endAngle="+endAngle);
            var data = this._data[type];
            //var angle = Math.abs(Math.round(startAngle - endAngle));
            var angle = Math.abs((startAngle - endAngle).toFixed(1));
            data.angle = angle;
            data.actualAngle = Math.abs(startAngle - endAngle);
            data.angleStr = angle + '°';
            var sphereAngle = startAngle + (endAngle - startAngle) / 2;
            data.sphereAngle = sphereAngle;
            //不设置隐藏是否，只进行旋转定位
            this.updatePosByType(type);
        },
        isNameVertical: function () {
            var angle = this._normalAngle % 360;
            if (angle > -40 && angle <= 0) {
                return false;
            } else if (angle <= 360 && angle >= 310) {
                return false;
            } else if (angle >= 0 && angle <= 40) {
                return false;
            } else if (angle >= 130 && angle <= 230) {
                return false
            }
            return true;
        },
        setNameVisible: function (visible) {
            this._nameVisible = visible;
            for (var type in this._data) {
                if (this._status[type] === true) {
                    if (this._data[type].mtName) {
                        View.setVisibility(this._data[type].mtName.getView(), visible);
                    }
                    this.updatePosByType(type);
                }
            }
        },
        setNameStatusAndVisible: function (type, visible) {
            if (this._data[type].mtName) {
                if (this._data[type].mtName) {
                    View.setVisibility(this._data[type].mtName.getView(), visible);
                }
                //已经绘制过
                this._status[type] = true;
                this.updatePosByType(type);
            }
        },
        updatePosByType: function (type) {

            var data = this._data[type];
            var nameVisible = !data.mtName.isVisibilityHidden();
            if (data.angle === 0 || data.angle === 90) {
                //角度为0/90时，不显示文本内容
                data.mtName.setContent('');
                data.mtAngle.setContent('');
                if (type == Sector.Type.Incidence || type == Sector.Type.Reflection) {
                    data.mtInvisibleAngle.setContent('');
                }
            } else {
                var isNameVertical = this.isNameVertical();
                if (nameVisible) {
                    data.mtName.setContent(isNameVertical ? data.name.split('') : data.name);
                } else {
                    data.mtName.setContent('');
                }
                data.mtAngle.setContent(data.angleStr);

                var r = data.r + this._lightHeight;

                //显示名称，且名称水平显示
                if (!isNameVertical && nameVisible && !this.isSurfaceAngle(type)) {
                    r += data.mtAngle.getWidth() / 2 + data.mtName.getWidth() / 2;
                }
                //入射角、反射角
                if (!this.isSurfaceAngle(type)) {
                    r += 5;
                }
                if (this.isSurfaceAngle(type) || !nameVisible) {
                    this.makeAbsViewHorizontal(data.mtAngle, data.sphereAngle, r, data.cx, data.cy, 0, 0, false);
                } else if (nameVisible) {
                    //获取到角度的位置，并同步名称位置
                    if (isNameVertical) {
                        data.mtInvisibleAngle.setContent(data.angleStr);
                    } else {
                        data.mtInvisibleAngle.setContent(data.name + data.angleStr);
                    }
                    this.makeAbsViewHorizontal(data.mtInvisibleAngle, data.sphereAngle, r, data.cx, data.cy, 0, 0, false);
                    var translate = Svg.getAttrTranslate(data.mtInvisibleAngle.getAttr('transform'));
                    if (isNameVertical) {
                        //在原点上方
                        if (translate[1] < 0) {
                            data.mtAngle.setTranslate(translate[0], translate[1] - data.mtAngle.getHeight() + this._lightHeight);
                            data.mtName.setTranslate(translate[0] + anglePaddingLeft, translate[1] - data.mtAngle.getHeight() - data.mtName.getHeight() + this._lightHeight);
                        } else {
                            //原点下方
                            data.mtName.setTranslate(translate[0] + anglePaddingLeft, translate[1]);
                            data.mtAngle.setTranslate(translate[0], translate[1] - data.mtAngle.getHeight() + data.mtName.getHeight() + this._lightHeight);
                        }
                    } else {
                        //横向排列，名称在前，角度在后
                        data.mtAngle.setTranslate(translate[0] + data.mtName.getWidth(), translate[1]);
                        data.mtName.setTranslate(translate[0], translate[1]);
                    }
                }
            }
        },
        isSurfaceAngle: function (type) {
            return type == Sector.Type.SurfaceIn || type == Sector.Type.SurfaceOut;
        },
        setAngleVisibleByType: function (type, visible) {
            //设置内置状态，说明已经绘制过。
            if (visible) {
                this._status[type] = true;
            }
            var data = this._data[type];
            View.setVisibility(data.mtAngle.getView(), visible);
            if (this._status[type] === true) {
                View.setVisibility(data.mtName.getView(), this._nameVisible);
            }
            this.updatePosByType(type);
        },
        //加入角度判断
        getAngleIsValidByType: function (type) {
            var data = this._data[type];
            if (data.angle === 0 || data.angle === 90) {
                return false;
            }
            return !View.isVisibilityHidden(data.mtAngle.getView());
        },
        getHasDrawStatus: function () {
            return this._status;
        },
        setHasDrawStatus: function (status, type) {
            this._status = status;
        },
        setHasDrawStatusByType: function (status, type) {
            if (typeof type !== typeof  undefined) {
                this._status[type] = status;
            } else {
                for (var key in   this._status) {
                    this._status[key] = status;
                }
            }
        },
        getHasDrawStatusByType: function (type) {
            return this._status[type];
        },
        getAngleVisibilityByType: function (type) {
            var data = this._data[type];
            return !View.isVisibilityHidden(data.mtAngle.getView());
        },
        setEnable: function (enable) {
            for (var type in this._data) {
                if (this._status[type] === true) {
                    if (this._data[type].mtName) {
                        View.setVisibility(this._data[type].mtName.getView(), visible);
                    }
                    this.updatePosByType(type);
                }
            }
        },
        /**
         * 场景4,5用
         */
        setNameDisplay: function(display){
            for(var key in this._data){
                //$(this._data[key].$$name._$$view.node).css("display", display);
                // this._data[key].mtName.setVisible(false);
                // this._data[key].mtAngle.setVisible(false);
                $(this._data[key].mtName._$$view.node).css("display", display);
                $(this._data[key].mtAngle._$$view.node).css("display", display);
            }
        },
        /**
         * 获取某文字
         */
        getNameByType: function(type){
            var data = this._data[type];

               return data.mtAngle.getView();

        }
    });


    return NameGroup;
});
/**
 * Created by ylf on 2016/7/28.
 * 入射线
 */
define('js/view/normalLine', ['js/view/BaseView', 'js/config/style', 'js/utils/view', 'js/utils/svg'], function (BaseView, Style, View, Svg) {


    var NormalLineStyle = Style.NormalLine;

    var NormalLine = BaseView({
        _$$line: null,
        _domEvent: null,
        _width: 200,
        _$$name: null,
        _pointVisible: false,
        _lineVisible: false,
        _lang: false,
        create: function (width, lang) {
            var instance = Object.create(this);
            instance.__base([]);
            instance._width = width;
            instance._lang = lang;
            instance.createView();
            return instance;
        },
        createView: function () {
            //1.法线
            this._$$line = new kity.Path('').setStyle(NormalLineStyle.strokeStyle);
            this._$$line.setAttr('d', 'M0 0 ' + this._width + ' 0');
            this._$$line.setAttr('stroke-dasharray', '15,12');
            this.addShape(this._$$line);

            //2.名称
            this._$$name = new kity.Text();
            this._$$name.setContent(this._lang['rf_normal_name']).setAttr('class', NormalLineStyle.fontClass);
            this.addShape(this._$$name);

            //3.入射点名称
            this._$$nameDown = new kity.Text();
            this._$$nameDown.setContent(this._lang['rf_incidence_point']).setAttr('class', NormalLineStyle.fontClass);
            this.addShape(this._$$nameDown);
        },
        setRotate: function (angle, x, y) {
            x = typeof x === typeof undefined ? this._width : x;
            y = typeof y === typeof undefined ? 0 : y;
            this._$$line.setRotate(angle + ' ' + x + ' ' + y);
            this.initNamePos(x, y);
        },
        getRotateAngle: function () {
            var rotate = Svg.getAttrRotate(this._$$line.getAttr('transform'));
            return rotate[0];
        },
        //setTranslate:function(x,y){
        //    BaseView({}).setTranslate.apply(this,[x,y]);
        //    this.initNamePos(Math.abs(x) - this._width/2,y);
        //},
        initNamePos: function (centerX, centerY) {
            centerX = typeof centerX === typeof undefined ? this._width/2 : centerX;
            centerY = typeof centerY === typeof undefined ? 0 : centerY;
            var downWidth = this._$$nameDown.getWidth();
            var nameWidth = this._$$name.getWidth();
            this.makeViewAround(this._$$name, this._$$line, this._width, this._width/2 + 25, centerX, centerY, -nameWidth / 2 + 5, 0, false);
            this.makeViewAround(this._$$nameDown, this._$$line, 150, 25, centerX, centerY, -downWidth / 2 -10, 0, true);
        },
        setNameVisible: function (visible) {
            this._$$nameDown.setContent(visible === true ? this._lang['rf_incidence_point'] : '');
            this._$$name.setContent(visible === true ? this._lang['rf_normal_name'] : '');
            this.initNamePos();
        },
        setPointNameVisibility: function (nameVisible, visible) {
            this._pointVisible = visible;
            //this._$$nameDown.setContent(nameVisible === true ? this._lang['rf_incidence_point'] : 'O');
            View.setVisibility(this._$$nameDown, visible);
            View.setVisibility(this._$$name, this._lineVisible);
            View.setVisibility(this._$$line, this._lineVisible);
            this.setVisibility(true);
            this.initNamePos();
        },
        setLineVisibility: function (nameVisible, visible) {
            this._lineVisible = visible;
            //this._$$name.setContent(nameVisible === true ? this._lang['rf_normal_name'] : 'N');
            View.setVisibility(this._$$name, visible);
            View.setVisibility(this._$$nameDown, this._pointVisible);
            View.setVisibility(this._$$line, visible);
            this.setVisibility(true);
            this.initNamePos();
        },
        showAll: function () {
            this.setVisibility(true);
            View.setVisibility(this._$$name, true);
            View.setVisibility(this._$$nameDown, true);
            View.setVisibility(this._$$line, true);
            this.initNamePos();
        },
        getLineVisible: function () {
            return this._lineVisible;
        },
        getPointNameVisible: function () {
            return this._pointVisible;
        }
    });

    return NormalLine;
});
/**
 * Created by ylf on 2016/8/15.
 * 垂足符号
 */
define('js/view/PedalLine', ['js/view/BaseView', 'js/config/style', 'js/utils/svg', 'js/utils/view'], function (BaseView, Style,Svg) {


    var PedalStyle = Style.Pedal;


    var PedalLine = BaseView({
        _$$line: null,
        create: function (data) {
            var instance = Object.create(this);
            instance.__base([]);
            instance._data = data;
            instance.createView();
            return instance;
        },
        createView: function () {
            var $$line = this._$$line = new kity.Path().setId('dd').setStyle(PedalStyle.strokeStyle);
            var plusDrawer = $$line.getDrawer();
            //为了和线角度统一，这边垂足符号进行了向左90°旋转
            plusDrawer.moveTo(-PedalStyle.width, 0);
            plusDrawer.lineTo(-PedalStyle.width, -PedalStyle.width);//左
            plusDrawer.lineTo(0, -PedalStyle.width);//右
            this.addShape($$line);
        },
        setRotate: function (angle, x, y) {
            x = typeof x === typeof undefined ? 0 : x;
            y = typeof y === typeof undefined ? 0 : y;
            this._$$line.setRotate(angle + ' ' + x + ' ' + y);
        },
        getRotateAngle: function(){
            var rotate = Svg.getAttrRotate(this._$$line.getAttr('transform'));
            return rotate;
        }
    });


    return PedalLine;
});
/**
 * Created by ylf on 2016/7/25.
 * 夹角扇面
 */
define('js/view/sector', ['js/view/BaseView', 'js/config/style', 'js/utils/graphmath', 'js/utils/svg', 'js/view/MultipleText'], function (BaseView, Style, GraphMath, Svg, MultipleText) {


    var SectorStyle = Style.Sector;

    var Sector = BaseView({
        _$$sector: null,
        _$$sectorBorder: null,
        _type: 1,
        _startAngle: 0,
        _endAngle: 0,
        _cx: 0,
        _cy: 0,
        _lang: 0,
        _$$incidencePoint: null,
        create: function (type, cx, cy, r, lang) {
            var instance = Object.create(this);
            instance.__base([]);
            instance._type = type;
            instance._cx = cx;
            instance._cy = cy;
            instance._r = r;
            instance._lang = lang;
            instance.createView();
            return instance;
        },
        createView: function () {
            this._$$sector = new kity.Path('');
            //this._$$sector.setStyle(SectorStyle.strokeStyle);
            this._$$sectorBorder = new kity.Path('');
            this._$$sectorBorder.setStyle(SectorStyle.strokeStyle);

            //名称和度数
            if (this._type === Sector.Type.SurfaceIn || this._type === Sector.Type.SurfaceOut) {
                //与反射面夹角
                this._$$sector.fill(SectorStyle.surfaceFill);
            } else if (this._type === Sector.Type.Incidence) {
                //入射线与法线夹角
               // this._$$sector.fill(SectorStyle.normalFill);
                this._$$sector.fill(SectorStyle.incidence_normalFill);
            } else if (this._type === Sector.Type.Reflection || this._type === Sector.Type.Refraction) {
                //反射线与法线夹角
                this._$$sector.fill(SectorStyle.normalFill);
            }
            this.addShape(this._$$sector);
            this.addShape(this._$$sectorBorder);
        },
        rotate: function (startAngle, endAngle) {
            //装换为扇面内部角度，扇面角度从右侧到左侧0~180
            this._startAngle = startAngle;
            this._endAngle = endAngle;
            var absEndAngle = 180 - startAngle;
            var absStartAngle = 180 - endAngle;
            var str = GraphMath.getSvgSectorPoint(this._cx, this._cy, this._r, absStartAngle, absEndAngle);

            this._$$sector.setAttr('d', str);
            //this._$$sector.setStyle({opacity:0.6});
            this._$$sectorBorder.setAttr('d', str);
        }

    });

    Sector.Type = {
        Incidence: 1,
        Reflection: 2,
        SurfaceIn: 3,
        SurfaceOut: 4,
        Refraction: 5
    };

    return Sector;
});
/**
 * Created by ylf on 2016/7/25.
 * 平面
 */
define('js/view/surface', ['js/view/BaseView', 'js/config/style', 'js/utils/utils', 'js/utils/svg', 'js/view/ForeignView', 'js/config/eventKey', 'js/utils/view'], function (BaseView, Style, Utils, Svg, ForeignView, EventKey, View) {

    var GraphMath = require('js/utils/graphmath');
    var SurfaceStyle = Style.Surface;

    var CONFIG = {
        width: 520,
        defaultAngle: 0,
        rotatePosX: 5,//旋转位置 ，远点扣除左侧的空白
        rotatePosY: 4,//y旋转位置，计算了样式空白造成的偏移量
        visible: true,
        clickAble: true,
        nameEnable: true,
        nameEventEnable: true,
        type: ''//类型
    };

    var Surface = BaseView({
        _config: null,
        _$$surface: null,
        _$$name: null,
        _onSurfaceMove: null,
        _lang: null,
        _$$incidencePoint: null,
        create: function (eventbus, config, onSurfaceMove, lang) {
            var instance = Object.create(this);
            instance._config = $.extend(true, {}, CONFIG, config);
            //监听失去焦点
            var eventInfos = [];
            if (instance._config.nameEventEnable) {
                eventInfos.push({key: EventKey.NameVisible, callback: 'nameVisibleHandler', params: []});
            }
            eventInfos.push({key: EventKey.Blur, callback: instance.blur, params: []});

            instance.__base(eventbus, eventInfos);

            instance._type = config.type;
            instance._onSurfaceMove = onSurfaceMove;
            instance._lang = lang;
            instance.createView();
            return instance;
        },
        createView: function () {

            this._$$surface = new kity.Group();

            var cls = 'wall_tl';
            if (Surface.Type.tl === this._type) {
                cls = 'wall_tl';
            } else if (Surface.Type.tr === this._type) {
                cls = 'wall_tr';
            } else if (Surface.Type.tl_Large === this._type) {
                cls = 'wall_tl_large';
            }
            //1.反射面
            this._fwSurface = ForeignView.create(cls, this._config.width, SurfaceStyle.height);
            $(this._$$surface.node).append(this._fwSurface.getView());
            this.addShape(this._$$surface);

            //添加一个标记，用于获取旋转点的offset坐标
            this._$$offsetPoint = new kity.Circle(10).fill(kity.Color.createRGBA(0, 0, 0, 0));
            //View.setVisibility(this._$$offsetPoint, false);
            this._$$offsetPoint.setTranslate(this._config.rotatePosX, this._config.rotatePosY);
            this.addShape(this._$$offsetPoint);


            //名称
            this._$$name = new kity.Text();
            this._$$name.setContent(this._lang['rf_refraction_surface']).setAttr('class', SurfaceStyle.fontClass);
            if (!this._config.nameEnable) {
                View.setVisibility(this._$$name, false);
            }
            this.addShape(this._$$name);

            //旋转按钮
            this._fwBtn = ForeignView.create('btn_rotate', SurfaceStyle.btnRotate.width, SurfaceStyle.btnRotate.height);
            this._fwBtnInvisible = ForeignView.create('btn_rotate', SurfaceStyle.btnRotate.width, SurfaceStyle.btnRotate.height);
            this._fwBtnInvisible.setVisibility(false);
            $(this._$$surface.node).append(this._fwBtn.getView());
            $(this._$$surface.node).append(this._fwBtnInvisible.getView());
            this.intOriginalFwBtnPos();

            //处理样式中3像素的图片偏移量
            this.setTranslate(0, -3);

            //绑定事件
            this.bindDomEvent(this._$$surface.node, ['lrTap'], this.getUuid(), this.domEventHandler);
            this.bindDomEvent(this._fwBtn.getView(), ['move', 'aftermove'], this._fwBtn.getUuid(), this.domEventHandler);

            this._fwBtn.setVisible(false);

            $(this.getView().node).attr('class', '_lr_surface');

            this.setVisibility(this._config.visible);
        },
        intOriginalFwBtnPos: function () {
            if (this._type === Surface.Type.tl) {
                this._fwBtn.setTranslate(this._config.width + 10, (SurfaceStyle.height - SurfaceStyle.btnRotate.height) / 2);
                this._fwBtnInvisible.setTranslate(this._config.width + 10, (SurfaceStyle.height - SurfaceStyle.btnRotate.height) / 2);
            } else {
                this._fwBtn.setTranslate(-SurfaceStyle.btnRotate.width - 10, (SurfaceStyle.height - SurfaceStyle.btnRotate.height) / 2);
                this._fwBtnInvisible.setTranslate(-SurfaceStyle.btnRotate.width - 10, (SurfaceStyle.height - SurfaceStyle.btnRotate.height) / 2);
            }
        },
        blur: function (uuid) {
            if (uuid !== this.getUuid()) {
                this._fwBtn.setVisible(false);
                this._fwSurface.removeClass('on');
            }
        },
        domEventHandler: function (eventType, uuid, data) {
            if (!this._config.clickAble) {
                return;
            }
            if (uuid === this.getUuid()) {
                if (eventType === 'lrTap') {
                    if (this._fwSurface.hasClass('on')) {
                        this.blur();
                        return;
                    }
                    this._fwBtn.setVisible(true);
                    this._fwSurface.addClass('on');
                }
            } else if (uuid === this._fwBtn.getUuid()) {
                //if (eventType === 'move') {
                this._onSurfaceMove(data, eventType);
                //}
                if (eventType === 'aftermove') {
                    this.__triggerEvent('insidechange', 'surface-move');
                }
            }
            this.btnStillInBox();
        },
        getSurfaceXAxisDegree: function (surface) {
            var degree = surface.getRotateAngle() % 180;
            //角度换算
            if (degree <= 0) {
                degree = -degree;
            } else {
                degree = 180 - degree;
            }
            return degree;
        },
        btnStillInBox: function () {
            var originalRect = this._fwBtnInvisible.getView()[0].getBoundingClientRect();
            var svgRect = this._fwBtn.getView().closest('svg')[0].getBoundingClientRect();
            var angle = Math.abs(this.getRotateAngle() % 180);
            //统一计算与X轴锐角
            if (angle <= 0) {
                angle = -angle;
            }
            if (angle > 90) {
                angle = 180 - angle;
            }

            var translate = Svg.getAttrTranslate(this._fwBtnInvisible.getView().attr('transform'));
            if (translate.length <= 0) {
                return;
            }
            var flag = false;

            //inside svg
            if (originalRect.bottom <= svgRect.bottom && originalRect.left >= svgRect.left && originalRect.right <= svgRect.right && originalRect.top >= svgRect.top) {
                if (this._type === Surface.Type.tl) {
                    this._fwBtn.setTranslate(this._config.width + 10, translate[1]);
                } else {
                    this._fwBtn.setTranslate(-SurfaceStyle.btnRotate.width - 10, translate[1]);
                }
            } else {
                var translateX = 0;
                var scale = this.getScale();
                var isRight = this._type === Surface.Type.tl;
                if (originalRect.left <= svgRect.left) {
                    //超出左侧
                    var subY = svgRect.left - originalRect.left;
                    var x = (subY / Math.cos(GraphMath.getRadian(angle))) / scale;
                    translateX = translate[0] - (isRight ? x : -x);
                    this._fwBtn.setTranslate(translateX, translate[1]);
                }

                if (originalRect.bottom >= svgRect.bottom) {
                    // 超出下方
                    var subY = originalRect.bottom - svgRect.bottom;
                    var x = (subY / Math.sin(GraphMath.getRadian(angle))) / scale;
                    if (isRight) {
                        if (translateX == 0 || translateX > translate[0] - x) {
                            translateX = translate[0] - x
                        }
                    } else {
                        if (translateX == 0 || translateX < translate[0] + x) {
                            translateX = translate[0] + x
                        }
                    }

                    this._fwBtn.setTranslate(translateX, translate[1]);
                }

                //超出上方
                if (originalRect.top <= svgRect.top) {
                    var subY = svgRect.top - originalRect.top;
                    var x = (subY / Math.sin(GraphMath.getRadian(angle))) / scale;
                    if (isRight) {
                        if (translateX == 0 || translateX > translate[0] - x) {
                            translateX = translate[0] - x
                        }
                    } else {
                        if (translateX == 0 || translateX < translate[0] + x) {
                            translateX = translate[0] + x
                        }
                    }
                    this._fwBtn.setTranslate(translateX, translate[1]);
                }
            }
        },
        rotate: function (angle, x, y) {
            x = typeof x === typeof undefined ? this._config.rotatePosX : x;
            y = typeof y === typeof undefined ? this._config.rotatePosY : y;
            var rotate = Svg.getAttrRotate(this._$$surface.getAttr('transform'));
            if (rotate && rotate.length > 0) {
                this._$$surface.setRotate((rotate[0] + angle) + ' ' + x + ' ' + y);
            } else {
                this._$$surface.setRotate(angle + ' ' + x + ' ' + y);
            }
            this.initNamePos(x, y);
        },
        getRotateOffsetPos: function () {
            var offset = $(this._$$offsetPoint.node).offset();
            return {
                x: offset.left,
                y: offset.top
            };
        },
        getRotateAngle: function () {
            var rotate = Svg.getAttrRotate(this._$$surface.getAttr('transform'));
            return rotate[0] || 0;
        },
        initNamePos: function (x, y) {
            var r = this._config.rotatePosX + 100;
            var distance = this._config.rotatePosX + 20;
            this.makeViewAround(this._$$name, this._$$surface, r, distance, this._config.rotatePosX, y, 0, -(SurfaceStyle.height - this._$$name.getHeight()) / 2, false);
        },
        setNameVisible: function (visible) {
            if (this._config.nameEnable) {
                View.setVisibility(this._$$name, visible);
            }
        },
        nameVisibleHandler: function (visible) {
            this.setNameVisible(visible);
        },
        setClickAble: function (clickable) {
            this._config.clickAble = clickable;
        },
        getScale: function () {
            var scale = (this._$$offsetPoint.node.getBoundingClientRect().width / 20) || 1;
            return scale;
        },
        get0To360RotateAngle: function () {
            var angle = this.getRotateAngle() % 360;
            if (angle < 0) {
                angle = 360 + angle;
            }
            return angle;
        }
    });
    Surface.Type = {
        tl: 'tl',
        tr: 'tr',
        tl_Large: 'wall_tl_large'
    }
    return Surface;
});
define('js/mainRefraction', ['js/refractor/refractorMain', 'js/utils/logger'], function (RefractorMain, Logger) {

    window.LightRefractor = {
        create: function (option) {
            return RefractorMain.create(option);
        },
        setLogLevel: function (level) {
            Logger.setLevel(level);
        },
        setLang: function(i18n){

        },
        getLang: function(){

        }
    }


});
//主入口初始化
require('js/mainRefraction');
})(window,document,jQuery)