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
        purple: 'svg_text color_purple',
        roman: ' roman'
    };

    var style = {};


    style.LineStyle = {
        strokeStyle: {'stroke-width': 2.5, 'stroke': kity.Color.parse('#ffffff')},
        rectHeight: 8,
        btnRotate: {width: 60, height: 60},
        arrow: {width: 34, height: 45},
        on: 'on',
        //commonLineFill: kity.Color.parse('#794F78'),
        //commonArrowCls: 'arrow_purple',
        commonLineFill: kity.Color.parse('#CB1F1F'),
        commonArrowCls: 'arrow_red',
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
        Reverse: {
            fill: kity.Color.parse('#09924D'),
            fontClass: fontClass.green,
            arrowClass: 'arrow_red'
        }
    };

    style.Sector = {
        strokeStyle: {'stroke-width': 1, 'stroke': kity.Color.parse('#7595AC')},
        //surfaceFill: kity.Color.parse('#C2B69C'),
        //normalFill: kity.Color.parse('#8DB8A7'),
        surfaceFill: kity.Color.createRGBA(213, 139, 34, 0.35),
        incidenceFill: kity.Color.createRGBA(204, 131, 255, 0.35),
        reflectionFill: kity.Color.createRGBA(60, 143, 65, 0.35),
        incidenceFontClass: fontClass.purple,
        reflectionFontClass: fontClass.green,
        surfaceFontClass: fontClass.orange,
        incidenceLetterClass: fontClass.purple + fontClass.roman + ' svg_letter',
        reflectionLetterClass: fontClass.green + fontClass.roman + ' svg_letter'
    };

    style.NormalLine = {
        strokeStyle: {'stroke-width': 4, 'stroke': kity.Color.parse('#4D4D4D')},
        fontClass: fontClass.black,
        pointWidth: 5,
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
        btnRotate: {width: 60, height: 60}
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
define('js/reflector/baseReflector', ['js/base/base'], function (Base) {

    var BaseReflector = {
        _lightComplexArray: null,//光组件合集
        __overwrite: ['createView', 'drawAll', 'drawNext', 'getData'],
        __base: function (eventbus, eventsInfo) {
            var args = Array.prototype.slice.apply(arguments, [0]);
            Base({}).__base.apply(this, args);
        },
        createView: function () {

        },
        updatePos: function () {
            this._lightComplexArray.updatePos();
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
        }
    };


    return function (cls) {
        return Base(BaseReflector).__include(cls);
    };


});
/**
 * Created by ylf on 2016/7/22.
 */
define('js/reflector/btns', ['js/base/Base', 'js/utils/string', 'js/utils/utils', 'js/config/eventKey', 'js/utils/view'], function (Base, String, Utils, EventKey, View) {

    var ForeignView = require('js/view/foreignview');
    var Svg = require('js/utils/svg');
    var DomEvent = require('js/reflector/domEvent');
    var LineStyle = require('js/config/style').LineStyle;

    var Btns = Base({
        _fwRotateBtns: [],
        _g: null,
        _id: '',
        _lineUuid: '',
        _reflector: null,
        create: function (eventBus, reflector, count) {
            var instance = Object.create(this);
            var eventsInfo = [];
            instance._id = Utils.getUuid();
            instance._fwRotateBtns = {};
            instance._reflector = reflector;
            instance.__base(eventBus, eventsInfo);
            instance.initRotateBtn(count);
            return instance;
        },
        initRotateBtn: function (count) {
            //旋转按钮
            var that = this,
                fwRotate,
                i;

            that._g = new kity.Group();

            for (i = 0; i < count; i++) {
                fwRotate = ForeignView.create('btn_rotate', LineStyle.btnRotate.width, LineStyle.btnRotate.height);
                this._fwRotateBtns[i] = fwRotate;
                // fwRotate.setVisibility(false);
                DomEvent.addDomEvent(fwRotate.getView()[0], ['down', 'beforemove', 'move', 'aftermove', 'up'], fwRotate.getUuid(), false, false);
                //append to reflector

                $(that._g.node).append(fwRotate.getView());
                this.__on(fwRotate.getUuid(), function (eventType, selfId, data) {
                    var fwRotate = getFwRotateBySelfId.apply(that, [selfId]);
                    if (eventType === 'down') {
                        fwRotate.addClass('on');
                    } else if (eventType === 'aftermove' || eventType === 'up') {
                        fwRotate.removeClass('on');
                        fwRotate.getView().blur();
                    }
                    var lineId = fwRotate.__lineUuid;
                    that.__triggerEvent(EventKey.BtnMove + lineId, eventType, lineId, data);
                }, '');
                fwRotate.setVisibility(false)
            }
            // this._reflector.addShape(g);
        },
        getView: function () {
            return this._g;
        },
        appendToView: function ($$container) {
            $$container.addShape(this._g);
        },
        moveBtnEventHandler: function (scale, clientRect, uuid, visible) {
            var fwRotate = getFwRotateByLineId.apply(this, [uuid]);
            var pLeft = clientRect.left + clientRect.width / 2;
            var pTop = clientRect.top + clientRect.height / 2;
            var rect = fwRotate.getView()[0].getBoundingClientRect();
            var rLeft = rect.left + rect.width / 2;
            var rTop = rect.top + rect.height / 2;

            var transforms = Svg.getAttrTranslate(fwRotate.getView().attr('transform'));
            //pos 针对于整个page的位置
            if (transforms && transforms.length == 2) {
                fwRotate.setTranslate(transforms[0] + (pLeft - rLeft) / scale, transforms[1] + (pTop - rTop) / scale);
            } else {
                fwRotate.setTranslate((pLeft - rLeft) / scale, (pTop - rTop) / scale);
            }

            fwRotate.setVisibility(true);
        }
    });

    var getFwRotateBySelfId = function (selfId) {
        var i,
            fwRotateBtns = this._fwRotateBtns,
            key,
            fwRotate;

        for (key in fwRotateBtns) {
            fwRotate = fwRotateBtns[key];
            if (fwRotate.getUuid() === selfId) {
                return fwRotate;
            }
        }
    };

    var getFwRotateByLineId = function (lineId) {
        var i,
            fwRotateBtns = this._fwRotateBtns,
            key

        if (fwRotateBtns[lineId]) {
            fwRotateBtns[lineId].__lineUuid = lineId;
            return fwRotateBtns[lineId];
        }

        for (key in fwRotateBtns) {
            if (/^\d+$/.test(key)) {
                fwRotateBtns[lineId] = fwRotateBtns[key];
                fwRotateBtns[lineId].__lineUuid = lineId;
                delete fwRotateBtns[key];
                return fwRotateBtns[lineId];
            }
        }
    }

    return Btns;

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
            $(this._$$paper.node).on(' lrTap  mousedown  mouseup mousemove mouseleave touchstart touchmove touchend touchcancel', this._domEvents);
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
                    eventType: $target.data('event-type')
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
                Logger.debug('domevent-self', type);
            }

            //交给各自职责的事件处理
            switch (e.mType) {
                case 'lrTap':
                    this._initEventInfo(e);
                    // if (this._eventInfo == null || this._eventInfo.length <= 0) {
                    //     this.__triggerEvent(EventKey.Blur);
                    // } else {
                    //     //只触发第一个
                    //     this.__triggerEvent(EventKey.Blur, this._eventInfo[0].uuid);
                    // }
                    break;
                case 'down':
                    this._initEventInfo(e);
                    if (this._eventInfo == null || this._eventInfo.length <= 0) {
                        this.__triggerEvent(EventKey.Blur);
                    } else {
                        //只触发第一个
                        this.__triggerEvent(EventKey.Blur, this._eventInfo[0].uuid);
                    }
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
                    Logger.debug('domevent-original', type);
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
    DomEvent.addDomEvent = function (dom, domEvent, identifier, stopPropagation) {
        if (domEvent && domEvent.length > 0) {
            if (typeof stopPropagation === typeof undefined) {
                stopPropagation = true;
            }
            $(dom).attr('class', '_lr_event');
            $(dom).data('event-type', domEvent);
            $(dom).data('event-identifier', identifier);
            $(dom).data('event-stoppropagation', stopPropagation);
        }
    };

    return DomEvent;

});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/reflector/LightComplexArray', ['js/base/base', 'js/utils/utils'], function (Base, Utils) {

    //view
    var LightComplex = require('js/reflector/LightComplex/main');
    var LightLine = require('js/view/LightLine');

    var LightComplexArray = Base({
        _lightArray: [],//节点
        _lightEnable: [],//节点是否可用
        _lightDrawBefore: [],//节点是否已经开始绘制
        _chainMode: false,//点之间是否是链式的调用关系
        _currentHighZIndex: 0,//处在高位的索引值
        create: function (eventBus, config, option, onLineMove, chainMode, reflectorType) {
            var instance = Object.create(this);
            instance._uuid = Utils.getUuid();
            //事件绑定
            instance.__base(eventBus, []);
            instance._config = config;
            instance._lightArray = [];
            instance._lightDrawBefore = [];
            instance._lightEnable = [];
            instance._chainMode = chainMode || false;
            instance.createView(onLineMove, option, reflectorType);
            instance.initZIndexEvent();
            return instance;
        },
        createView: function (onLineMove, option, reflectorType) {
            var that = this;
            this._config.forEach(function (config, i) {
                var lightComplex = LightComplex.create(that.__getEventBus(), config, onLineMove, option, reflectorType);
                that._lightArray.push(lightComplex);
                lightComplex.setVisibility(config.Visible);
                that._lightEnable[i] = config.Visible;
                that._lightDrawBefore[i] = config.Visible;
            });
        },
        appendToView: function ($$container) {
            this.each(function () {
                $$container.addShape(this.getView());
            });
        },
        gtIndexAppendToView: function ($$container) {
            this.each(function () {
                this.gtIndexAppendToView($$container);
            });
            this.each(function () {
                this.bringBtnToTop();
            });
        },
        btnStillInBox: function () {
            this.each(function () {
                this.btnStillInBox();
            })
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
                        this.setReflectionLineCommonFill(that.isEnableAndDraw(i + 1));
                    } else {
                        this.setIncidenceLineCommonFill(that.isEnableAndDraw(i - 1));
                        this.setReflectionLineCommonFill(that.isEnableAndDraw(i + 1));
                    }
                } else {
                    //更新入射光线
                    if (i !== 0) {
                        this.setIncidenceLineCommonFill(that.isEnableAndDraw(i));
                    }
                }
            })
        },
        setCommonLineVisible: function (visible) {
            var that = this;
            this.each(function (i) {
                var hasNext = true;
                if ((i + 1) >= that._lightArray.length) {
                    hasNext = false
                }
                if (that.isEnableAndDraw(i)) {
                    if (hasNext) {
                        if (i === 0) {
                            if (that.isEnableAndDraw(i + 1)) {
                                this.setReflectionLineVisible(that._currentHighZIndex === i);
                            }
                        } else if (i === 1) {
                            if (that.isEnableAndDraw(i + 1)) {
                                this.setReflectionLineVisible(that._currentHighZIndex === i);
                            }
                            this.setIncidenceLineVisible(that._currentHighZIndex === i);
                        }
                    } else {
                        //更新入射光线
                        if (i !== 0) {
                            this.setIncidenceLineVisible(true);
                        }
                    }
                }
            })
        },
        drawAll: function (index, cb) {
            var that = this;
            this.each(function (i) {
                if (that.hasNextEnable(i)) {
                    that._lightArray[i + 1].setVisibility(true);
                    that._lightDrawBefore[i + 1] = true;
                }

                this.drawAll(function () {
                    //cb && cb();
                });
            }, index);

            that.changeChainLineCommonFill();
            cb && cb();
        },
        drawNext: function (index, cb) {
            var that = this;
            var hasCall = false;
            this.each(function (i) {
                if (this.hasNext() && !hasCall) {
                    hasCall = true;
                    this.drawNext(function () {
                        cb && cb();
                    });
                }
                if (!hasCall && that.hasNextEnable(i)) {
                    hasCall = true;
                    that._lightArray[i + 1].setVisibility(true);
                    that._lightDrawBefore[i + 1] = true;
                    cb && cb();
                }
            }, index);
            that.changeChainLineCommonFill();
            //if(hasCall){
            //
            //}
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
        setEnable: function (index, enable) {
            this._lightEnable[index] = enable;
            //层级较高的被置为不可用了，需要重新指定第一个层级为最高
            if (index === this._currentHighZIndex && enable === false) {
                this.showFirstIndex();
            }
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
        updatePos: function () {
            this.each(function () {
                this.updatePos();
            });
        },
        adsorptionPedal: function () {
            this.each(function () {
                this.adsorptionPedal();
            });
        },
        adsorption: function () {
            this.each(function () {
                this.adsorptionPedal();
                this.adsorptionStatic();
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
            });
        },
        setLinePedalChangeLock: function (lock) {
            this.each(function (i) {
                this.setLinePedalChangeLock(lock);
            })
        },
        getCount: function () {
            return this._lightArray.length;
        }
    });

    return LightComplexArray;

});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/reflector/reflector1', ['js/reflector/baseReflector', 'js/utils/utils', 'js/utils/graphMath', 'js/utils/svg'], function (BaseReflector, Utils, GraphMath, Svg) {

    //view
    var Surface = require('js/view/surface');
    var LightComplexArray = require('js/reflector/LightComplexArray');
    var EqualAngleName = require('js/view/EqualAngleName');
    var EventKey = require('js/config/eventKey');
    var Btns = require('js/reflector/btns');

    var Reflector = BaseReflector({
        _CONFIG: {
            LightComplex: [
                {
                    IncidenceLine: {
                        width: 370,//整体长度
                        arrowPos: 140,//箭号所在位置
                        defaultAngle: 60, rotateFixed: false, clickAble: true, rotateFixedAfterDraw: true
                    },
                    ReflectionLine: {
                        visible: false, rotateFixed: false, clickAble: false,
                        width: 370,
                        arrowPos: 140
                    },
                    NormalLine: {lineVisible: false, pointNameVisible: false},
                    Sector: {sectorInVisible: true, sectorOutVisible: false, incidenceVisible: false, reflectionVisible: false, letterR: 110, angleR: 180},
                    IncidencePosX: 520 / 2,//入射点位置
                    DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    PedalDrawIndex: [[0, 1, 2], [4, 5, 6], [7, 9, 10]],
                    Visible: true
                }],
            Surface: {
                width: 520,
                defaultAngle: 0,
                rotatePosX: 520 / 2,//旋转位置
                rotatePosY: 4,//旋转位置
                visible: true,
                clickAble: true,
                type: Surface.Type.tl
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
        create: function (eventBus, $$container, option, data) {
            var instance = Object.create(this);
            instance._uuid = Utils.getUuid();
            instance._event = $.extend(true, [], this._Event);
            instance.initEvent();
            //事件绑定
            instance.__base(eventBus, instance._event);

            instance.__proxyAll(['onSurfaceMove', 'onLineMove', 'nameVisibleHandler']);//绑定this指针
            instance._$$container = $$container;
            instance._config = $.extend(true, {}, this._CONFIG, (data && data.configData) || {});
            instance._option = option;
            instance.createView();
            instance.afterCreateView();
            instance.initExtrasDrawCommand();
            return instance;
        },
        initEvent: function () {
            //TODO:交由基类处理
        },
        createView: function () {
            var that = this;
            //反射面
            this._surface = Surface.create(this.__getEventBus(), this._config.Surface, this.onSurfaceMove, this._option.langData);
            if (this._config.Surface.clickAble) {
                this.btns = Btns.create(this.__getEventBus(), this._$$container, 1);
                this._surface.setMoveListener(function (scale, clientRect, uuid, visible) {
                    that.btns.moveBtnEventHandler(scale, clientRect, uuid, visible);
                    that._lightComplexArray.btnStillInBox();
                });
            }
            this._lightComplexArray = LightComplexArray.create(this.__getEventBus(), this._config.LightComplex, this._option, this.onLineMove, false, this._TYPE);
            this._lightComplexArray.appendToView(this._$$container);

            this._equalAngleName = EqualAngleName.create(this._option.langData);

            this._$$container.addShape(this._surface.getView());
            this._$$container.addShape(this._equalAngleName.getView());
            this._lightComplexArray.gtIndexAppendToView(this._$$container);
            if (this.btns) {
                this.btns.appendToView(this._$$container);
            }
            this._surface.setNameVisible(this._option.nameVisible);
            if (this._config.EqualAngleName) {
                that._equalAngleNameHasShowBefore = this._config.EqualAngleName.visible;
                this._equalAngleName.setVisibility(this._config.EqualAngleName.visible);
            } else {
                this._equalAngleName.setVisibility(false);
            }
            this.resetAngle(this._config.Surface.defaultAngle, true);

            //从新初始化坐标位置
            this.toCenter();
            //tocenter位置变化后重新结算值
            that._lightComplexArray.btnStillInBox();
            this.initEqualAngleNamePos();
        },
        initExtrasDrawCommand: function () {
            //交由基类处理
            var that = this;
            var length = this._lightComplexArray.getCommandLength();
            this._lightComplexArray.pushDrawCommand(function (deffer) {
                if (that._lightComplexArray.isPedal()) {
                    that._equalAngleNameHasShowBefore = true;
                    that._equalAngleName.setVisibility(true);
                }
                deffer.resolve();
            }, function () {
                if (!that._lightComplexArray.isPedal()) {
                    return true;
                }
                if (!that._equalAngleName.isVisibilityHidden()) {
                    return true;
                }
                return that._equalAngleNameHasShowBefore;
            });
            var pedalIndex = $.extend(true, [], this._config.LightComplex[0].PedalDrawIndex);
            pedalIndex.splice(2, 0, length);
            this._lightComplexArray.setPedalDrawIndex(pedalIndex);
        },
        afterCreateView: function () {
            //TODO:交由子类覆盖
        },
        initEqualAngleNamePos: function () {
            //布局角度
            var width = this._equalAngleName.getView().getWidth(),
                height = this._equalAngleName.getView().getHeight(),
                svgWidth = this._$$container.container.getWidth(),
                containerCTM = this._$$container.node.getCTM(),
                scale = this._$$container.container.node.getCTM().a;

            var x = svgWidth / scale - containerCTM.e / scale - width - 50;
            var y = containerCTM.f / scale - height;

            this._equalAngleName.setTranslate(x, -y);
        },
        toCenter: function () {
            this._$$container.setTranslate(this._option.viewPortWidth / 2 - this.getWidth() / 2, this._option.viewPortHeight / 2 + 60);
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
                this._lightComplexArray.adsorption();
            }
            this.initEqualAngleVisibility();
        },
        onLineMove: function (uuid, angle) {
            this.initEqualAngleVisibility();
            this.afterLineMove();
        },
        afterLineMove: function () {

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
        }
    });

    Reflector.Extend = function (cls) {
        return Object.create(Reflector).__include(cls);
    };
    return Reflector;

});
/**
 * Created by ylf on 2016/8/15.
 */
define('js/reflector/reflector2', ['js/reflector/reflector1'], function (Reflector1) {


    var Surface = require('js/view/surface');

    var Reflector2 = Reflector1.Extend({
        _CONFIG: {
            LightComplex: [{
                IncidenceLine: {
                    visible: false,
                    rotateFixed: false,
                    clickAble: false,
                    defaultAngle: 60,
                    arrowPos: 140//箭号所在位置
                },
                ReflectionLine: {
                    visible: true,
                    rotateFixed: false,
                    clickAble: true,
                    rotateFixedAfterDraw: true,
                    arrowPos: 140
                },
                NormalLine: {
                    lineVisible: false,
                    pointNameVisible: false
                },

                Sector: {
                    sectorInVisible: false,
                    sectorOutVisible: true,
                    incidenceVisible: false,
                    reflectionVisible: false,
                    letterR: 110,
                    angleR: 180
                },
                IncidencePosX: 520 / 2,//入射点位置
                DrawIndex: [[0, 1, 9, 8], [5, 6, 7], [4, 11], [2, 3]],
                PedalDrawIndex: [[0, 1, 9], [5, 6, 7], [4, 10, 2]],
                Visible: true
            }],
            Surface: {
                width: 520,
                defaultAngle: 0,
                rotatePosX: 520 / 2,
                visible: true,
                clickAble: true,
                type: Surface.Type.tl
            }
        },
        _TYPE: 2
    });

    return Reflector2;

});
/**
 * Created by ylf on 2016/8/15.
 */
define('js/reflector/reflector3', ['js/reflector/reflector1'], function (Reflector1) {


    var Surface = require('js/view/surface');

    var Reflector3 = Reflector1.Extend({
        _CONFIG: {
            LightComplex: [{
                IncidenceLine: {
                    visible: true, rotateFixed: false, defaultAngle: 60,
                    arrowPos: 140
                },
                ReflectionLine: {
                    visible: true, rotateFixed: false,
                    arrowPos: 140
                },
                NormalLine: {lineVisible: false, pointNameVisible: false},
                Sector: {
                    sectorInVisible: false, sectorOutVisible: false, incidenceVisible: false, reflectionVisible: false,
                    letterR: 110,
                    angleR: 180
                },
                IncidencePosX: 520 / 2,//入射点位置
                DrawIndex: [[0, 1, 8, 3], [4, 7, 11], [5], [2, 6, 9]],
                PedalDrawIndex: [[0, 1, 10], [5, 4, 7], [6, 2, 9]],
                Visible: true,
                view90PedalLineVisible: false
            }],
            Surface: {
                width: 520,
                defaultAngle: 0,
                rotatePosX: 520 / 2,
                visible: false,
                clickAble: false,
                type: Surface.Type.tl
            }
        },
        _TYPE: 3,
        initExtrasDrawCommand: function () {
            var that = this;
            var length = this._lightComplexArray.getCommandLength();

            this._lightComplexArray.pushDrawCommand(function (deffer) {
                that._equalAngleNameHasShowBefore = true;
                that._equalAngleName.setVisibility(true);
                deffer.resolve();
            }, function () {
                return !that._equalAngleName.isVisibilityHidden();
            });

            this._lightComplexArray.pushDrawCommand(function (deffer, animate) {
                that._surface.setVisibility(true);
                deffer.resolve();
            }, function () {
                return !that._surface.isVisibilityHidden();
            });
            var pedalIndex = $.extend(true, [], this._config.LightComplex[0].PedalDrawIndex);
            var defaultIndex = $.extend(true, [], this._config.LightComplex[0].DrawIndex);
            pedalIndex.splice(1, 0, length);//插入入射角=反射角
            pedalIndex[3].push(length + 1);//插件反射面
            defaultIndex[3].push(length + 1);//插入反射面

            this._lightComplexArray.setDrawIndex(defaultIndex);
            this._lightComplexArray.setPedalDrawIndex(pedalIndex);
        }
    });

    return Reflector3;

});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/reflector/reflector4', ['js/reflector/reflector1', 'js/utils/graphMath', 'js/utils/logger', 'js/config/style', 'js/view/LightLine'], function (Reflector1, GraphMath, Logger, Style, LightLine) {

    var LineStyle = Style.LineStyle;
    var View = require('js/utils/view');
    var Sector = require('js/view/sector');
    var EventKey = require('js/config/eventKey');
    var Surface = require('js/view/Surface');


    var Reflector = Reflector1.Extend({
        _CONFIG: {
            LightComplex: [
                {
                    IncidenceLine: {defaultAngle: 60, rotateFixed: false, clickAble: false, visible: false, width: 410, arrowPos: 210, PedalWidth: 350, PedalArrowPos: 150, highLineZIndex: true},
                    ReflectionLine: {visible: true, rotateFixed: false, clickAble: true, width: 410, arrowPos: 150, PedalWidth: 410, PedalArrowPos: 150},
                    NormalLine: {lineVisible: false, pointNameVisible: false, width: 470},
                    Sector: {
                        sectorInVisible: false, sectorOutVisible: true, incidenceVisible: false, reflectionVisible: false,
                        letterR: 90,
                        angleR: 90
                    },
                    IncidencePosX: 916 / 2 - 127,
                    DrawIndex: [[0, 1, 9, 8], [5, 6, 7], [4, 11], [2, 3]],
                    PedalDrawIndex: [[0, 1, 9], [5, 6, 7], [4, 2]],
                    Visible: true
                },
                {
                    IncidenceLine: {defaultAngle: 40, rotateFixed: false, clickAble: false, visible: false, width: 410, arrowPos: 210, PedalWidth: 350, PedalArrowPos: 150, highLineZIndex: true},
                    ReflectionLine: {visible: true, rotateFixed: false, clickAble: true, width: 410, arrowPos: 150, PedalWidth: 410, PedalArrowPos: 150},
                    NormalLine: {lineVisible: false, pointNameVisible: false, width: 470},
                    Sector: {
                        sectorInVisible: false, sectorOutVisible: true, incidenceVisible: false, reflectionVisible: false,
                        letterR: 90,
                        angleR: 90
                    },
                    IncidencePosX: 916 / 2 + 127,
                    DrawIndex: [[0, 1, 9, 8], [5, 6, 7], [4, 11], [2, 3]],
                    PedalDrawIndex: [[0, 1, 9], [5, 6, 7], [4, 2]],
                    Visible: true
                }],
            Surface: {
                width: 916,
                defaultAngle: 0,
                rotatePosX: 916 / 2,//旋转位置
                visible: true,
                clickAble: false,
                type: Surface.Type.tl_Large
            }
        },
        _TYPE: 4,
        _incidenceWidth: [],
        initEvent: function () {
            this.pushEvent({key: EventKey.LightLineVisible, callback: 'lightLineVisibleHandler', params: []});
            this.pushEvent({key: EventKey.NameVisible, callback: 'nameVisibleHandler', params: []});
        },
        afterCreateView: function () {
            this._incidenceWidth = [];
            var name = this._option.langData['rf_incidence_line_name'];
            this._$$incidenceName = new kity.Text();
            this.setCommonNameVisible(false);
            this._$$incidenceName.setContent(name).setAttr('class', LineStyle[LightLine.Type.IncidenceLine].fontClass);
            this._$$container.addShape(this._$$incidenceName);

            this._lightComplexArray.showFirstIndex();
            this.afterLineMove();
        },
        lightLineVisibleHandler: function (type, visible) {
            if (visible) {
                this.setCommonNameVisible(visible);
            }
        },
        nameVisibleHandler: function (visible) {
            this.setCommonNameVisible(visible);
        },
        setCommonNameVisible: function (visible) {
            if (this._$$incidenceName) {
                if (this._incidenceWidth.length > 0 && this._lightComplexArray.get(0).getIncidenceLineVisible() && visible === true) {
                    this._$$incidenceName.setVisible(this.getNameVisible());
                } else {
                    this._$$incidenceName.setVisible(false);
                }
            }
        },
        initExtrasDrawCommand: function () {
            //调用基类方法
            Reflector1.initExtrasDrawCommand.apply(this, []);

            var that = this;
            var length = this._lightComplexArray.getCommandLength();
            var __push = function (index) {
                //显示垂足动画
                that._lightComplexArray.get(index).pushDrawCommand(function (deffer) {
                    that._lightComplexArray.get(index).setIncidenceShortPedalView(that._incidenceWidth[index]);
                    deffer.resolve();
                }, function () {
                    return that._lightComplexArray.get(index).isDrawIncidenceShortPedalView(that._incidenceWidth[index]);
                });
            };
            __push(0);
            __push(1);
            var pedalIndex = $.extend(true, [], this._config.LightComplex[0].PedalDrawIndex);
            pedalIndex[pedalIndex.length - 1].push(length);
            this._lightComplexArray.setPedalDrawIndex(pedalIndex);
        },
        initEqualAngleNamePos: function () {
            var parentTranslate = this._$$container.getTransform().m;
            var width = this._equalAngleName.getView().getWidth();
            var height = this._equalAngleName.getView().getHeight();
            this._equalAngleName.setTranslate(this._option.viewPortWidth - parentTranslate.e - width - 20, -(  parentTranslate.f - height - 20 ));
        },
        initEqualAngleVisibility: function () {

        },
        afterLineMove: function () {
            //反射面角度按-180~180来处理
            var that = this;
            var config = this._config;
            var linesPos = [];
            this._lightComplexArray.each(function (i) {
                var pos = {x: config.LightComplex[i].IncidencePosX, y: 0};
                var degree = that._lightComplexArray.get(i).getIncidenceRotateAngle();
                var kb = GraphMath.getLineKb(180 - degree, pos);
                var linePos = {
                    a: pos,
                    b: {
                        x: ( 5000 - kb.b ) / kb.k, y: 5000
                    }
                };
                linesPos.push(linePos);
            });

            var firstLight = this._lightComplexArray.get(0);
            var secondLight = this._lightComplexArray.get(1);

            var pos = GraphMath.getTwoLineIntersection(linesPos[0].a, linesPos[0].b, linesPos[1].a, linesPos[1].b);
            if (pos) {
                var width = GraphMath.getPythagoreanLineC(pos.y, linesPos[0].a.x - pos.x);
                var width2 = GraphMath.getPythagoreanLineC(pos.y, linesPos[1].a.x - pos.x);
                this._incidenceWidth = [width, width2];
                firstLight.setIncidenceLineWidth(width);
                secondLight.setIncidenceLineWidth(width2 + 2);//加2像素使得两条线头部重合
                this.setCommonNameVisible(this.getNameVisible());
                var incidenceRotateAngle = Math.round(this._lightComplexArray.get(0).getIncidenceRotateAngle());
                var incidenceRotateAngle2 = Math.round(this._lightComplexArray.get(1).getIncidenceRotateAngle());
                //动态计算名称位置
                var width = (this._$$incidenceName.getWidth() || 112) + 10;
                if (incidenceRotateAngle > 90 && incidenceRotateAngle2 <= 90) {
                    //width = width / 2;
                    if (pos.x > this._CONFIG.LightComplex[0].IncidencePosX) {
                        width = ((pos.x - this._CONFIG.LightComplex[0].IncidencePosX)) - 10;
                    }
                } else if (incidenceRotateAngle <= 90) {
                    width = width;
                } else if (incidenceRotateAngle2 > 90) {
                    width = -10;
                }
                Logger.debug('reflector4', this._CONFIG.LightComplex[0].IncidencePosX, pos.x);
                this._$$incidenceName.setTranslate(pos.x - width, -pos.y - 15);
                this._lightComplexArray.setIncidenceNameEnable(false);
                this._lightComplexArray.setLinePedalChangeLock(true);
            } else {
                this._incidenceWidth = [];
                if (Math.round(firstLight.getSectorAngle(Sector.Type.Incidence)) === 0) {
                    firstLight.setIncidenceLineWidth(this._CONFIG.LightComplex[0].IncidenceLine.PedalWidth);
                    firstLight.setIncidenceLineArrowPos(this._CONFIG.LightComplex[0].IncidenceLine.PedalArrowPos);
                } else {
                    firstLight.setIncidenceLineWidth(this._CONFIG.LightComplex[0].IncidenceLine.width);
                    firstLight.setIncidenceLineArrowPos(this._CONFIG.LightComplex[0].IncidenceLine.arrowPos);
                }
                if (Math.round(secondLight.getSectorAngle(Sector.Type.Incidence)) === 0) {
                    secondLight.setIncidenceLineWidth(this._CONFIG.LightComplex[1].IncidenceLine.PedalWidth);
                    secondLight.setIncidenceLineArrowPos(this._CONFIG.LightComplex[1].IncidenceLine.PedalArrowPos);
                } else {
                    secondLight.setIncidenceLineWidth(this._CONFIG.LightComplex[1].IncidenceLine.width);
                    secondLight.setIncidenceLineArrowPos(this._CONFIG.LightComplex[1].IncidenceLine.arrowPos);
                }
                this.setCommonNameVisible(false);
                this._lightComplexArray.setIncidenceNameEnable(true);
                this._lightComplexArray.setIncidenceNameVisible(this.getNameVisible());
                this._lightComplexArray.setLinePedalChangeLock(false);
            }

            Logger.debug('reflector4', pos, linesPos);
        },
        toCenter: function () {
            this._$$container.setTranslate(this._option.viewPortWidth / 2 - this.getWidth() / 2, this._option.viewPortHeight / 2 + 250);
        }
    });

    return Reflector;

});
/**
 * Created by ylf on 2016/7/25.
 */
define('js/reflector/reflector5', ['js/reflector/baseReflector', 'js/utils/utils', 'js/utils/graphMath', 'js/utils/svg'], function (BaseReflector, Utils, GraphMath, Svg) {

    //view
    var Surface = require('js/view/surface');
    var Logger = require('js/utils/logger');
    var Sector = require('js/view/Sector');
    var LightComplexArray = require('js/reflector/LightComplexArray');
    var EqualAngleName = require('js/view/EqualAngleName');
    var LightLine = require('js/view/LightLine');
    var Btns = require('js/reflector/btns');

    //针对偏移量
    var SurfaceVerticalPadding = {
        x: 7,//5
        y: 4,//4
        tr: 14,
        verticalX: 6,
        verticalY: 3
    };

    var Reflector = BaseReflector({
        _CONFIG: {
            LightComplex: [
                {
                    IncidenceLine: {defaultAngle: 60, rotateFixed: false, clickAble: true, width: 270, rotateFixedAfterDraw: true, PedalWidth: 270, arrowPos: 100, PedalArrowPos: 100},
                    ReflectionLine: {visible: false, rotateFixed: false, clickAble: false, width: 270, arrowPos: 150, PedalWidth: 210, PedalArrowPos: 105},
                    NormalLine: {width: 280},
                    Sector: {
                        sectorInVisible: true, sectorOutVisible: false, incidenceVisible: false, reflectionVisible: false,
                        letterR: 90,
                        angleR: 90
                    },
                    IncidencePosX: -480 / 2 - 15,//入射点位置
                    DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    PedalDrawIndex: [[0, 1, 2], [4, 5, 6], [7, 9, 10]],
                    Visible: true,
                    nameEventEnable: true,
                    NameAutoPos: true
                },
                {
                    IncidenceLine: {defaultAngle: 50, rotateFixed: false, clickAble: false, visible: true, need: true, width: 68, arrowPos: 0, arrowVisible: false},
                    NormalLine: {width: 210},
                    ReflectionLine: {visible: false, rotateFixed: false, clickAble: false, width: 270, arrowPos: 135},
                    Sector: {
                        sectorInVisible: true, sectorOutVisible: false, incidenceVisible: false, reflectionVisible: false,
                        letterR: 85
                    },
                    IncidencePosX: 0,//入射点位置
                    DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    PedalDrawIndex: [[0, 1, 2], [4, 5, 6], [7, 9, 10]],
                    Visible: false,
                    nameEventEnable: true
                },
                {
                    IncidenceLine: {defaultAngle: 50, rotateFixed: false, clickAble: false, visible: true, need: true, width: 68, arrowPos: 0, arrowVisible: false},
                    NormalLine: {width: 210},
                    ReflectionLine: {visible: false, rotateFixed: false, clickAble: false, width: 270, arrowPos: 135},
                    Sector: {
                        sectorInVisible: true, sectorOutVisible: false, incidenceVisible: false, reflectionVisible: false,
                        letterR: 90,
                        angleR: 90
                    },
                    IncidencePosX: 0,//入射点位置
                    DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                    PedalDrawIndex: [[0, 1, 2], [4, 5, 6], [7, 9, 10]],
                    Visible: false,
                    nameEventEnable: true
                }
            ],
            Surface: {
                width: 630,//630
                defaultAngle: 0,
                rotatePosX: SurfaceVerticalPadding.x,//旋转位置k
                rotatePosY: SurfaceVerticalPadding.y,//旋转位置
                visible: true,
                clickAble: true,
                nameEventEnable: true,
                type: Surface.Type.tl
            },
            SurfaceVertical: {
                width: 480,//480
                defaultAngle: 90,
                rotatePosX: 480 - SurfaceVerticalPadding.x,//旋转位置
                rotatePosY: SurfaceVerticalPadding.y,//旋转位置
                visible: true,
                clickAble: true,
                nameEnable: false,
                nameEventEnable: true,
                type: Surface.Type.tr
            }
        },
        _TYPE: 5,
        _$$container: null,
        _incidencePointPos: null,
        _surfacePagePos: null,
        _option: null,
        _equalAngleNameHasShowBefore: false,
        create: function (eventBus, $$container, option, data) {
            var instance = Object.create(this);
            instance._uuid = Utils.getUuid();
            instance.__base(eventBus, []);
            instance.__proxyAll(['onSurfaceMove', 'onLineMove', 'onVerticalSurfaceMove']);//绑定this指针
            instance._$$container = $$container;
            instance._config = $.extend(true, {}, this._CONFIG, (data && data.configData) || {});

            //不显示
            if (option.reflector5NameEnable === false) {
                instance._config.Surface.nameEventEnable = false;
                instance._config.SurfaceVertical.nameEventEnable = false;
                instance._config.LightComplex.forEach(function (item) {
                    item.nameEventEnable = false;
                })
            }
            instance._option = option;
            instance.createView();
            instance.afterCreateView();
            instance.initExtrasDrawCommand();
            return instance;
        },
        createView: function () {
            var that = this;
            //反射面,3像素旋转偏移
            this._surface = Surface.create(this.__getEventBus(), this._config.Surface, this.onSurfaceMove, this._option.langData);
            //反射面2
            this._surfaceVertical = Surface.create(this.__getEventBus(), this._config.SurfaceVertical, this.onVerticalSurfaceMove, this._option.langData);

            var count = this._config.Surface.clickAble ? 1 : 0;
            if (this._config.SurfaceVertical.clickAble) {
                count++;
            }

            if (count > 0) {
                var btns = this.btns = Btns.create(this.__getEventBus(), this._$$container, count);
                if (this._config.Surface.clickAble) {
                    this._surface.setMoveListener(function (scale, clientRect, uuid, visible) {
                        btns.moveBtnEventHandler(scale, clientRect, uuid, visible);
                        that._lightComplexArray.btnStillInBox();
                    })
                }
                if (this._config.SurfaceVertical.clickAble) {
                    this._surfaceVertical.setMoveListener(function (scale, clientRect, uuid, visible) {
                        btns.moveBtnEventHandler(scale, clientRect, uuid, visible);
                        that._lightComplexArray.btnStillInBox();
                    })
                }
            }

            this._lightComplexArray = LightComplexArray.create(this.__getEventBus(), this._config.LightComplex, this._option, this.onLineMove, true, this._TYPE);
            this._lightComplexArray.appendToView(this._$$container);

            this._equalAngleName = EqualAngleName.create(this._option.langData);

            this._$$container.addShape(this._surface.getView());
            this._$$container.addShape(this._surfaceVertical.getView());
            this._$$container.addShape(this._equalAngleName.getView());
            this._lightComplexArray.gtIndexAppendToView(this._$$container);
            if (this.btns) {
                this.btns.appendToView(this._$$container);
            }
            this._surface.setNameVisible(this._option.nameVisible);

            if (this._config.EqualAngleName) {
                that._equalAngleNameHasShowBefore = this._config.EqualAngleName.visible;
                this._equalAngleName.setVisibility(this._config.EqualAngleName.visible);
            } else {
                this._equalAngleName.setVisibility(false);
            }
            //移动到指定位置
            this._surfaceVertical.setTranslateX(-this._config.SurfaceVertical.width + SurfaceVerticalPadding.tr);
            this.setSurfaceVerticalAngle(this._config.SurfaceVertical.defaultAngle, true);
            this._surface.rotate(this._config.Surface.defaultAngle);
            this._lightComplexArray.get(1).resetAngle(this._config.Surface.defaultAngle, true);
            this._lightComplexArray.get(2).resetAngle(this._config.SurfaceVertical.defaultAngle, true);


            //从新初始化坐标位置
            this.toCenter();
            //布局角度
            this.initEqualAngleNamePos();

        },
        initEqualAngleNamePos: function () {
            //布局角度
            var width = this._equalAngleName.getView().getWidth(),
                height = this._equalAngleName.getView().getHeight(),
                svgWidth = this._$$container.container.getWidth(),
                containerCTM = this._$$container.node.getCTM(),
                scale = this._$$container.container.node.getCTM().a;

            var x = svgWidth / scale - containerCTM.e / scale - width - 50;
            var y = containerCTM.f / scale - height;

            this._equalAngleName.setTranslate(x, -y);
        },
        afterCreateView: function () {
            this._lightComplexArray.showFirstIndex();
            this.mathLine();
            if (this._option.reflector5NameEnable === false) {
                this.setNameVisible(false);
            }
        },
        setNameVisible: function (visible) {
            this._surface.setNameVisible(visible);
            this._surfaceVertical.setNameVisible(visible);
            this._lightComplexArray.setNameVisible(visible);
        },
        setSurfaceVerticalAngle: function (angle, init) {
            this._surfaceVertical.rotate(angle);
            this._lightComplexArray.get(0).resetAngle(angle, init);
            this._lightComplexArray.get(0).around(angle, -SurfaceVerticalPadding.x, SurfaceVerticalPadding.tr);
        },
        getData: function () {
            var data = {};
            data.type = this._TYPE;
            data.configData = this._lightComplexArray.getData();
            data.configData.Surface = {
                defaultAngle: this._surface.getRotateAngle()
            };
            data.configData.SurfaceVertical = {
                defaultAngle: this._surfaceVertical.getRotateAngle()
            };
            data.configData.EqualAngleName = {
                visible: !this._equalAngleName.isVisibilityHidden()
            };
            return data;
        },
        getMoveRotateAngle: function (data) {
            var currentPos = data.currentPos;
            var lastPos = data.lastPos;
            return GraphMath.getRotateAngle(this._surface.getRotateOffsetPos(), lastPos, currentPos);
        },
        onSurfaceMove: function (data, eventType) {
            var enable = true;
            if (eventType === 'move') {
                var angle = this.getMoveRotateAngle(data);
                var subAngle = Math.abs(this._surfaceVertical.getRotateAngle() - this._surface.getRotateAngle() - angle);
                if (subAngle < 180) {
                    this._surface.rotate(angle);
                }
                //if (subAngle >= 177) {
                //    this._lightComplexArray.setAllEnable(false);
                //    enable = false;
                //} else {
                //    this._lightComplexArray.setEnable(0, true);
                //}
            } else if (eventType === 'aftermove') {
                this._lightComplexArray.adsorptionPedal();
            } else if (eventType === 'beforemove') {
                //移动前先隐藏一条公共线
            }
            var subAngle = Math.abs(this._surfaceVertical.getRotateAngle() - this._surface.getRotateAngle());
            if (subAngle >= 177) {
                this._lightComplexArray.setAllEnable(false);
                enable = false;
            } else {
                this._lightComplexArray.setEnable(0, true);
            }
            if (enable) {
                this.mathLine();
                this.initEqualAngleVisibility();
            }
        },
        onVerticalSurfaceMove: function (data, eventType) {
            var enable = true;
            if (eventType === 'move') {
                var angle = this.getMoveRotateAngle(data);
                if (this._lightComplexArray.rotateAble(angle)) {
                    var subAngle = Math.abs(this._surfaceVertical.getRotateAngle() - this._surface.getRotateAngle() + angle);
                    if (subAngle < 180) {
                        this._surfaceVertical.rotate(angle);
                    }
                }
            } else if (eventType === 'aftermove') {
                this._lightComplexArray.adsorptionPedal();

            } else if (eventType === 'beforemove') {

            }
            var subAngle = Math.abs(this._surfaceVertical.getRotateAngle() - this._surface.getRotateAngle());
            if (subAngle >= 177) {
                this._lightComplexArray.setAllEnable(false);
                enable = false;
            } else {
                this._lightComplexArray.setEnable(0, true);
            }
            var surfaceAngle = this._surfaceVertical.getRotateAngle() || 0;
            this._lightComplexArray.get(0).resetAngle(surfaceAngle);
            this._lightComplexArray.get(0).around(this._surfaceVertical.getRotateAngle(), -SurfaceVerticalPadding.x, SurfaceVerticalPadding.tr);
            if (enable) {
                this.mathLine();
                this.initEqualAngleVisibility();
            }
        },
        onLineMove: function (uuid, angle) {
            if (uuid === this._lightComplexArray.get(0).getUuid()) {
                this.mathLine();
            }
            this.initEqualAngleVisibility();
        },
        initEqualAngleVisibility: function () {
            //非垂足重置为不可见
            if (this._lightComplexArray.isPedalExcludeDisable() && this._lightComplexArray.isEnableAndDraw(0)) {
                if (this._equalAngleNameHasShowBefore || this._lightComplexArray.get(0).getTwoLineVisible()) {
                    this._equalAngleName.setVisibility(true);
                }
            } else {
                this._equalAngleName.setVisibility(false);
            }
        },
        //获取针对x轴的夹角
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
        getSurfaceSpherePos: function (sphereDegree, surface, pos) {
            if (this._surface === surface) {
                if (sphereDegree > 0 && sphereDegree <= 90) {
                    pos.y = -pos.y;
                } else if (sphereDegree > 90 && sphereDegree <= 180) {
                    pos.y = -pos.y;
                    pos.x = -pos.x;
                } else if (sphereDegree > 180 && sphereDegree <= 270) {
                    pos.x = -pos.x;
                } else if (sphereDegree > 270 && sphereDegree <= 360) {

                }
            } else {
                if (sphereDegree > 0 && sphereDegree <= 90) {
                    pos.x = -pos.x;
                } else if (sphereDegree > 90 && sphereDegree <= 180) {

                } else if (sphereDegree > 180 && sphereDegree <= 270) {
                    pos.y = -pos.y;
                } else if (sphereDegree > 270 && sphereDegree <= 360) {
                    pos.y = -pos.y;
                    pos.x = -pos.x;
                }
            }
            return pos;
        },
        getSurfacePos: function (surface) {
            var pos = {x: this._config.Surface.rotatePosX, y: 0};
            if (surface === this._surfaceVertical) {
                pos = {x: SurfaceVerticalPadding.tr - SurfaceVerticalPadding.x, y: 0};
            }
            var degree = this.getSurfaceXAxisDegree(surface);
            //var kb = GraphMath.getLineKb(degree, pos);
            var linePos = {
                a: pos,
                b: GraphMath.getLinePosByAngle(degree, surface === this._surface ? (this._config.Surface.width - SurfaceVerticalPadding.x) : (this._config.SurfaceVertical.width - SurfaceVerticalPadding.x))
            };
            var sphereDegree = surface.get0To360RotateAngle();

            linePos.b = this.getSurfaceSpherePos(sphereDegree, surface, linePos.b);
            linePos.b.x += pos.x;
            return linePos;
        },
        getLineSpherePos: function (kb, lineAngle, posA) {
            var posB = {};
            if ((lineAngle > 0 && lineAngle <= 90) || (lineAngle > 270 && lineAngle <= 360)) {
                posB = {
                    x: posA.x - 1000,
                    y: kb.k * (posA.x - 1000) + kb.b
                }
            } else if ((lineAngle > 90 && lineAngle <= 180) || (lineAngle > 180 && lineAngle <= 270)) {
                posB = {
                    x: posA.x + 1000,
                    y: kb.k * (posA.x + 1000) + kb.b
                }
            }
            return posB;
        },
        getFirstLinePos: function (lightType) {
            var lineAngle = this._lightComplexArray.get(0).getLine0To360RotateAngle(lightType);
            //计算与反射面上的点
            var surfaceXDegree = this.getSurfaceXAxisDegree(this._surfaceVertical);
            //计算出线相对于反射面与x轴交点的坐标
            var posA = GraphMath.getLinePosByAngle(surfaceXDegree, Math.abs(this._config.LightComplex[0].IncidencePosX) - (SurfaceVerticalPadding.x));
            var sphereDegree = this._surfaceVertical.get0To360RotateAngle();
            posA = this.getSurfaceSpherePos(sphereDegree, this._surfaceVertical, posA);
            //对X坐标进行平移
            posA.x = posA.x + (SurfaceVerticalPadding.tr - SurfaceVerticalPadding.x);
            var lineXAngle = this._lightComplexArray.get(0).getLineXAngle(lightType);
            var kb = GraphMath.getLineKb(lineXAngle, posA);
            var linePos = {
                a: posA
            };

            linePos.b = this.getLineSpherePos(kb, lineAngle, posA);
            return linePos;
        },
        getReflectionLine: function (index, posA) {
            var lineAngle = this._lightComplexArray.get(index).getLine0To360RotateAngle(LightLine.Type.ReflectionLine);
            var kb = GraphMath.getLineKb(this._lightComplexArray.get(index).getReflectionLineXAngle(), posA);
            var linePos = {
                a: posA
            };
            linePos.b = this.getLineSpherePos(kb, lineAngle, posA);
            return linePos;
        },
        //第二个点反射线
        getSecondLinePos: function (posA) {
            return this.getReflectionLine(1, posA);
        },
        //第三个点反射线
        getThirdLinePos: function (posA) {
            return this.getReflectionLine(2, posA);
        },
        mathLine: function () {
            //坐标针对item的原点
            var surfaceVerticalLine = this.getSurfacePos(this._surfaceVertical);
            var surfaceLine = this.getSurfacePos(this._surface);
            var firstReflectionLinePos = this.getFirstLinePos(LightLine.Type.ReflectionLine);
            var firstIncidenceLinePos = this.getFirstLinePos(LightLine.Type.IncidenceLine);
            Logger.debug('reflector5', surfaceLine, surfaceVerticalLine, firstIncidenceLinePos, firstReflectionLinePos);

            var firstLightComplex = this._lightComplexArray.get(0);
            var secondLightComplex = this._lightComplexArray.get(1);
            var thirdLightComplex = this._lightComplexArray.get(2);

            //初始化
            firstLightComplex.setIncidenceLineWidth(this._CONFIG.LightComplex[0].IncidenceLine.width);
            firstLightComplex.setIncidenceLineArrowPos(this._CONFIG.LightComplex[0].IncidenceLine.arrowPos);

            //计算第一个点反射线和水平方向反射面交点
            var reflectionPos2 = GraphMath.getTwoLineIntersection(surfaceLine.a, surfaceLine.b, firstReflectionLinePos.a, firstReflectionLinePos.b);
            if (reflectionPos2) {
                //点在上方
                var incidenceDegree = firstLightComplex.getReflectionRotateAngle() % 360 - 180;
                //if (reflectionPos2.y > firstReflectionLinePos.a.y) {
                //点在目标点下方
                //incidenceDegree = firstLightComplex.getReflectionRotateAngle() % 360 + 180;
                //incidenceDegree=360-incidenceDegree;
                //}

                //计算出针对反射面与x轴的坐标，加上偏移坐标
                var rotatePosX = GraphMath.getPythagoreanLineC(reflectionPos2.x - SurfaceVerticalPadding.x, reflectionPos2.y) + SurfaceVerticalPadding.x;
                //设置组件位置
                secondLightComplex.setIncidencePos(rotatePosX);
                //设置入射角初始旋转角度
                secondLightComplex.setIncidenceXAxisAngle(incidenceDegree);
                //根据反射面角度，重新计算旋转角度
                secondLightComplex.resetAngle(this._surface.getRotateAngle());
                //同步位置：设置反射面旋转导致的位置偏移
                secondLightComplex.around(this._surface.getRotateAngle(), SurfaceVerticalPadding.x);
                var posWidth = GraphMath.getPythagoreanLineC(reflectionPos2.x - firstReflectionLinePos.a.x, reflectionPos2.y - firstReflectionLinePos.a.y);
                firstLightComplex.setReflectionLineWidth(posWidth);
                if (posWidth <= this._CONFIG.LightComplex[1].IncidenceLine.width) {
                    secondLightComplex.setIncidenceLineWidth(posWidth);
                } else {
                    secondLightComplex.setIncidenceLineWidth(this._CONFIG.LightComplex[1].IncidenceLine.width);
                }

            } else {
                firstLightComplex.setReflectionLineWidth(this._CONFIG.LightComplex[0].ReflectionLine.width);
                firstLightComplex.setReflectionLineArrowPos(this._CONFIG.LightComplex[0].ReflectionLine.arrowPos);
                secondLightComplex.setIncidenceLineWidth(this._CONFIG.LightComplex[1].IncidenceLine.width);
            }
            this._lightComplexArray.setEnable(1, !!reflectionPos2);


            //计算第二次反射交点
            var secondLinePos = this.getSecondLinePos(reflectionPos2);
            var reflectionPos3 = GraphMath.getTwoLineIntersection(surfaceVerticalLine.a, surfaceVerticalLine.b, secondLinePos.a, secondLinePos.b);
            if (reflectionPos3) {
                //计算出针对反射面与x轴的坐标，加上偏移坐标
                var incidencePosX = -(GraphMath.getPythagoreanLineC(reflectionPos3.x - SurfaceVerticalPadding.x, reflectionPos3.y) + SurfaceVerticalPadding.x);
                //计算出针对反射面与x轴的坐标，加上偏移坐标
                var incidenceDegree = 0;
                //通过图解可得一下公式
                if (firstLightComplex.getIncidencePosX() > incidencePosX) {
                    if (firstLightComplex.getIncidenceRotateAngle() <= firstLightComplex.getNormalLineRotateAngle()) {
                        incidenceDegree = secondLightComplex.getSectorAngle(Sector.Type.Incidence) * 2 + firstLightComplex.getSectorAngle(Sector.Type.SurfaceOut) + firstLightComplex.getSectorAngle(Sector.Type.Incidence) * 2;
                    } else {
                        incidenceDegree = secondLightComplex.getSectorAngle(Sector.Type.Incidence) * 2 + firstLightComplex.getSectorAngle(Sector.Type.SurfaceOut);
                    }
                    incidenceDegree = 180 - incidenceDegree;
                    //对调反射线和入射线
                    incidenceDegree = 180 - incidenceDegree;
                } else {
                    incidenceDegree = firstLightComplex.getSectorAngle(Sector.Type.SurfaceOut) + secondLightComplex.getSectorAngle(Sector.Type.Incidence) * 2;
                    incidenceDegree = 180 - incidenceDegree;
                }
                thirdLightComplex.setIncidencePos(incidencePosX);
                //要设置完整的反射角度，否则异常
                thirdLightComplex.setIncidenceXAxisAngle(incidenceDegree + this._surfaceVertical.getRotateAngle());
                thirdLightComplex.resetAngle(this._surfaceVertical.getRotateAngle());
                thirdLightComplex.around(this._surfaceVertical.getRotateAngle(), -SurfaceVerticalPadding.x, SurfaceVerticalPadding.tr);
                var posWidth = GraphMath.getPythagoreanLineC(reflectionPos2.x - reflectionPos3.x, reflectionPos2.y - reflectionPos3.y);
                secondLightComplex.setReflectionLineWidth(posWidth);
                //thirdLightComplex.setIncidenceLineWidth(posWidth);
                if (posWidth <= this._CONFIG.LightComplex[2].IncidenceLine.width) {
                    thirdLightComplex.setIncidenceLineWidth(posWidth);
                } else {
                    thirdLightComplex.setIncidenceLineWidth(this._CONFIG.LightComplex[2].IncidenceLine.width);
                }
            } else {
                thirdLightComplex.setIncidenceLineWidth(this._CONFIG.LightComplex[1].IncidenceLine.width);
            }

            this._lightComplexArray.setEnable(2, !!reflectionPos3);

            //入射光线不能超出
            var incidenceASurfacePos = GraphMath.getTwoLineIntersection(surfaceLine.a, surfaceLine.b, firstIncidenceLinePos.a, firstIncidenceLinePos.b);
            if (incidenceASurfacePos) {
                var width = GraphMath.getPythagoreanLineC(incidenceASurfacePos.x - firstIncidenceLinePos.a.x, incidenceASurfacePos.y - firstIncidenceLinePos.a.y);
                var maxWidth = this._CONFIG.LightComplex[0].IncidenceLine.width;
                firstLightComplex.setIncidenceLineWidth(width < maxWidth ? width : maxWidth);
                if (width >= maxWidth) {
                    firstLightComplex.setIncidenceLineArrowPos(this._CONFIG.LightComplex[0].IncidenceLine.arrowPos);
                }
            }

            //最后一条反射光线不能超出
            if (reflectionPos3) {
                var thirdReflectionLine = this.getThirdLinePos(reflectionPos3);
                var reflectionASurfacePos = GraphMath.getTwoLineIntersection(surfaceLine.a, surfaceLine.b, thirdReflectionLine.a, thirdReflectionLine.b);
                if (reflectionASurfacePos) {
                    var width = GraphMath.getPythagoreanLineC(reflectionPos3.x - reflectionASurfacePos.x, reflectionPos3.y - reflectionASurfacePos.y);
                    var maxWidth = this._CONFIG.LightComplex[0].IncidenceLine.width;
                    thirdLightComplex.setReflectionLineWidth(width < maxWidth ? width : maxWidth);
                }
            }

            //入射角等于90不进行反射处理
            if (Math.round(firstLightComplex.getIncidenceSurfaceAngle()) === 90) {
                this._lightComplexArray.setEnable(1, false);
                this._lightComplexArray.setEnable(2, false);
            }
            //判断是否显示夹角扇面
            this.surfaceIntersect(firstIncidenceLinePos.a, reflectionPos2);

            //更新链式节点公共线样式
            this._lightComplexArray.changeChainLineCommonFill();
        },
        initExtrasDrawCommand: function () {
            //交由基类处理
            var that = this;
            var length = this._lightComplexArray.getCommandLength();
            this._lightComplexArray.pushDrawCommand(function (deffer) {
                if (that._lightComplexArray.isPedalExcludeDisable()) {
                    that._equalAngleNameHasShowBefore = true;
                    that._equalAngleName.setVisibility(true);
                }
                deffer.resolve();
            }, function () {
                if (!that._lightComplexArray.isPedalExcludeDisable()) {
                    return true;
                }
                return !that._equalAngleName.isVisibilityHidden();
            }, 0);


            var pedalIndex = $.extend(true, [], this._config.LightComplex[0].PedalDrawIndex);
            pedalIndex.splice(2, 0, length);
            this._lightComplexArray.setPedalDrawIndex(pedalIndex, 0)
        },
        surfaceIntersect: function (pos1, pos2) {
            var flag = false;
            if (pos1) {
                var surfaceLine = this.getSurfacePos(this._surface);
                var length = GraphMath.getPedalHeight(surfaceLine.a, surfaceLine.b, pos1);
                if (length <= 100) {
                    for (var key in Sector.Type) {
                        if (flag) {
                            break;
                        }
                        flag = this.surfaceEachIntersect(this._lightComplexArray.get(0), pos1, Sector.Type[key], surfaceLine);
                    }
                }
            }
            if (pos2 && !flag && this._lightComplexArray.isEnableAndDraw(1)) {
                var surfaceVerticalLine = this.getSurfacePos(this._surfaceVertical);
                var length = GraphMath.getPedalHeight(surfaceVerticalLine.a, surfaceVerticalLine.b, pos2);
                if (length <= 100) {
                    for (var key in Sector.Type) {
                        if (flag) {
                            break;
                        }
                        flag = this.surfaceEachIntersect(this._lightComplexArray.get(1), pos2, Sector.Type[key], surfaceVerticalLine);
                    }
                }
            }
            this._lightComplexArray.setSectorEnable(!flag);
            return flag;
        },
        surfaceEachIntersect: function (lightComplex, centerPos, sectorType, surfaceLine) {
            var sectorR;
            if (sectorType == Sector.Type.Reflection) {
                sectorR = 75;
            } else if (sectorType == Sector.Type.Incidence) {
                sectorR = 65
            } else {
                sectorR = 55;
            }
            //计算线和圆的交点
            var ps = GraphMath.getLineCircleIntersectionPos(surfaceLine.a, surfaceLine.b, centerPos, sectorR);
            if (!ps) {
                return false;
            }
            var linesPos = lightComplex.getSectorLinesPos(sectorType, centerPos);
            //判断线与圆的交点是否和圆弧两点连接的线有交点
            var sectorLinePos = {a: linesPos[0].b, b: linesPos[1].b};
            var flag = false;
            for (var i = 0; i < ps.length; i++) {
                var psPos = ps[i];
                if (flag) {
                    break;
                }
                flag = GraphMath.getTwoLineIntersection(centerPos, psPos, sectorLinePos.a, sectorLinePos.b);
            }

            if (flag) {
                return true;
            }

            //还要判断反射面是否和圆弧线段相交
            for (var i = 0; i < linesPos.length; i++) {
                var linePos = linesPos[i];
                var p = GraphMath.getTwoLineIntersection(surfaceLine.a, surfaceLine.b, linePos.a, linePos.b);
                if (p) {
                    return true;
                }
            }

            return false;
        },
        toCenter: function () {
            this._$$container.setTranslate(this._option.viewPortWidth / 2 - this.getWidth() / 2 + 50, this._option.viewPortHeight / 2 + 200);
        },
        getWidth: function () {
            return this._config.Surface.width;
        },
        drawAll: function () {
            var that = this;
            this._lightComplexArray.drawAll(undefined, function () {
                that.mathLine();
            });
        },
        drawNext: function () {
            var that = this;
            this._lightComplexArray.drawNext(undefined, function () {
                that.mathLine();
            });
        }
    });

    return Reflector;

});
/**
 * Created by ylf on 2016/8/15.
 */
define('js/reflector/reflector6', ['js/reflector/reflector1'], function (Reflector1) {

    var LightLine = require('js/view/LightLine');
    var Surface = require('js/view/surface');

    var Reflector = Reflector1.Extend({
        _CONFIG: {
            LightComplex: [{
                IncidenceLine: {
                    width: 370,//整体长度
                    arrowPos: 140,//箭号所在位置
                    defaultAngle: 120, rotateFixed: false, clickAble: true, rotateFixedAfterDraw: true
                },
                ReflectionLine: {
                    visible: false, rotateFixed: false, clickAble: false,
                    width: 370,
                    arrowPos: 140
                },
                NormalLine: {lineVisible: false, pointNameVisible: false},
                Sector: {sectorInVisible: true, sectorOutVisible: false, incidenceVisible: false, reflectionVisible: false, letterR: 110, angleR: 180},
                IncidencePosX: 520 / 2,//入射点位置
                DrawIndex: [[0, 1, 2, 3], [4, 5, 6], [7, 11], [8, 9]],
                PedalDrawIndex: [[0, 1, 2], [4, 5, 6], [7, 9, 10]],
                Visible: true,
                StaticLine: [{
                    width: 370,//整体长度
                    arrowPos: 170,//箭号所在位置
                    defaultAngle: 60,//默认角度
                    visible: true,//是否显示
                    clickAble: false,//是否允许点击和移动
                    rotateFixed: true,//是否旋转时，固定不动
                    autoAdsorption: true,//是否自动吸附
                    arrowReverse: true,//箭头反转
                    lineType: LightLine.Type.Reverse
                }, {
                    width: 370,//整体长度
                    arrowPos: 170,//箭号所在位置
                    defaultAngle: 120,//默认角度
                    visible: true,//是否显示
                    clickAble: false,//是否允许点击和移动
                    rotateFixed: true,//是否旋转时，固定不动
                    autoAdsorption: true,
                    arrowReverse: false,
                    lineType: LightLine.Type.Reverse
                }]
            }],
            Surface: {
                width: 520,
                defaultAngle: 0,
                rotatePosX: 520 / 2,
                visible: true,
                clickAble: true,
                type: Surface.Type.tl
            }
        },
        _TYPE: 6
    });

    return Reflector;

});
/**
 * Created by ylf on 2016/8/5.
 */
define('js/reflector/reflectorFactory', ['js/base/base', 'js/reflector/reflector1', 'js/reflector/reflector2', 'js/reflector/reflector3', 'js/reflector/reflector4', 'js/reflector/reflector5', 'js/reflector/reflector6'], function (Base, Reflector1, Reflector2, Reflector3, Reflector4, Reflector5, Reflector6) {

    var ReflectorFactory = {
        getReflector: function (type, eventBus, $$container, option, data) {
            if (type === 1) {
                return Reflector1.create(eventBus, $$container, option, data);
            } else if (type === 2) {
                return Reflector2.create(eventBus, $$container, option, data);
            } else if (type === 3) {
                return Reflector3.create(eventBus, $$container, option, data);
            } else if (type === 4) {
                return Reflector4.create(eventBus, $$container, option, data);
            } else if (type === 5) {
                return Reflector5.create(eventBus, $$container, option, data);
            } else if (type === 6) {
                return Reflector6.create(eventBus, $$container, option, data);
            }
        }
    };


    return ReflectorFactory;

});
/**
 * Created by ylf on 2016/7/22.
 */
define('js/reflector/reflectorMain', ['js/base/Base', 'js/utils/eventBus', 'js/utils/string', 'js/utils/utils', 'js/config/eventKey', 'js/reflector/reflectorFactory', 'js/utils/view'], function (Base, EventBus, String, Utils, EventKey, ReflectorFactory, View) {

    var DomEvent = require('js/reflector/domEvent');
    var Lang = require('js/config/lang');
    var VERSION = '1.0.0';

    var _templateHtml = '<div class="${cls}" id="${id}"></div>';

    var ViewPort = {
        x: 0,
        y: 0,
        width: 1520,
        height: 896
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
        reflectorType: [1, 2, 3, 4, 5],
        nameVisible: true,
        surfaceAngleVisible: true,
        normalAngleVisible: true,
        reflector5NameEnable: false,//默认不显示预设五的名称
        lock: false,//是否锁定
        langData: Lang,//默认中文
        showDefaultRotateBtn: false
    };


    var ReflectorMain = Base({
        _$$paper: null,
        _$$paperItems: [],
        _reflectors: [],
        _currentIndex: 0,
        _id: null,
        _lock: false,
        _init: false,
        create: function (option) {
            var eventBus = EventBus.create();
            var instance = Object.create(this);
            //创建配置
            instance._option = OPTION.create(option);
            instance._id = Utils.getUuid();
            instance._$$paper = [];
            instance._$$paperItems = [];
            instance._reflectors = [];
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
            this.createReflector();
            this._init = true;
            this.__triggerEvent('insidechange', 'init');
        },
        createReflector: function () {
            var that = this;

            this._reflectors = [];
            this._$$paperItems = [];

            var __create = function (index, type, data) {
                var $$item = new kity.Group().setId('item_' + index);
                $$item.setAttr('class', '_lr_item');
                that._$$paperItems.push($$item);
                that._paper.addShape($$item);
                //add reflector
                var reflector = ReflectorFactory.getReflector(type, that.__getEventBus(), $$item, that._option, data);
                View.setVisibility($$item, index === that._currentIndex);
                that._reflectors.push(reflector);
                return reflector;
            };

            if (this._data && this._data.data && this._data.data.length > 0) {
                var data = this._data.data;
                for (var i = 0; i < data.length; i++) {
                    var reflectorData = data[i];
                    var reflector = __create(i, reflectorData.type, reflectorData);
                    //reflector.renderData(reflectorData);
                }
            } else {
                for (var i = 0; i < this._option.reflectorType.length; i++) {
                    var type = this._option.reflectorType[i];
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
            this._reflectors.forEach(function (reflector) {
                if (reflector) {
                    data.data.push(reflector.getData());
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
        getCurrentIndex: function () {
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
        },
        getNormalAngleVisible: function () {
            return this._option.normalAngleVisible;
        },
        //名称
        setNameVisible: function (visible) {
            this._option.nameVisible = visible;
            this.__triggerEvent(EventKey.NameVisible, visible);
        },
        //名称是否显示
        getNameVisible: function () {
            return this._option.nameVisible;
        },
        getCurrentReflector: function () {
            return this._reflectors[this._currentIndex];
        },
        //一步画
        drawAll: function () {
            this.__triggerEvent(EventKey.Blur);
            this.getCurrentReflector().drawAll();
        },
        //逐步画
        drawNext: function () {
            this.__triggerEvent(EventKey.Blur);
            this.getCurrentReflector().drawNext();
        },
        //是否有下一步
        hasNext: function () {
            return this.getCurrentReflector().hasNext();
        },
        updatePos: function () {
            this._reflectors.forEach(function (reflector) {
                if (reflector) {
                    reflector.updatePos();
                }
            });
        },
        reset: function (option) {
            $.extend(this._option, option);

            this._$$paperItems[this._currentIndex].clear();
            //var $$item = this._$$paperItems[this._currentIndex] = new kity.Group().setId('item_' + this._currentIndex);
            //$$item.setAttr('class', '_lr_item');
            //this._paper.addShape($$item);
            var reflector = ReflectorFactory.getReflector(this._reflectors[this._currentIndex].getType(), this.__getEventBus(), this._$$paperItems[this._currentIndex], this._option, {});
            this._reflectors[this._currentIndex] = reflector;
            this.__triggerEvent('insidechange', 'reset');
        },
        setLock: function (lock) {
            this._option.lock = lock;
        },
        destroy: function () {

        }
    });


    return ReflectorMain;

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
                    $.when(tasks[0](animate)).done(doneCallBack);
                } else if (tasks.length === 2) {
                    $.when(tasks[0](animate), tasks[1](animate)).done(doneCallBack);
                } else if (tasks.length === 3) {
                    $.when(tasks[0](animate), tasks[1](animate), tasks[2](animate)).done(doneCallBack);
                } else if (tasks.length === 4) {
                    $.when(tasks[0](animate), tasks[1](animate), tasks[2](animate), tasks[3](animate)).done(doneCallBack);
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
            //if (this._drawIndex.length > 0) {
            //    return this._currentIndex <= this._drawIndex.length - 1;
            //}
            //return this._currentIndex <= this._queue.length - 1;
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
        getLineKb: function (degree, pos) {
            var kb = {};
            if (degree > 90) {
                kb.k = Math.tan(this.getRadian(180 - degree));
                kb.k = -kb.k;
            } else {
                kb.k = Math.tan(this.getRadian(degree));
            }
            //pos.y = k * pos.x + b;
            kb.b = pos.y - kb.k * pos.x;
            return kb;
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
            var acosA = Math.acos(cosA);
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
            //通过三点计算旋转角度
            var angle = this.getCosineAngleByPos(posa, posb, posc);
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
            '0': 'bg_blue',
            '1': 'bg_red',
            '2': 'bg_purple',
            '3': 'bg_yellow',
            '4': 'bg_green'
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
        Purple: '2',
        Yellow: '3',
        Green:'4'
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
            this._uuid = Utils.getUuid();
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
        nameEnable: true,//是否需要名称支持
        arrowVisible: true,
        arrowReverse: false
    };

    var halfY = (LineStyle.rectHeight / 2 );

    var LightLine = BaseView({
        _$$lineGroup: null,
        _lineGroupUuid: '',
        _$$lintWhite: null,
        _arrow: null,
        _fwBtn: null,
        _config: null,
        _lightType: null,
        _$$name: null,
        _onLightMove: null,
        _lang: null,
        _showRotate: false,
        create: function (eventbus, lightType, config, onLightMove, lang, showRotate) {
            var instance = Object.create(this);
            var eventInfos = [];
            eventInfos.push({key: EventKey.Blur, callback: instance.blur, params: []});
            instance.__base(eventbus, eventInfos);
            instance._lightType = lightType;
            instance._config = $.extend(true, {}, CONFIG, config);
            instance._onLightMove = onLightMove;
            instance._lineGroupUuid = Utils.getUuid();
            instance._lang = lang;
            instance._showRotate = showRotate;
            instance.createView();
            instance.__on(EventKey.BtnMove + instance._fwBtn.getUuid(), instance.domEventHandler, []);
            return instance;
        },
        createView: function () {

            //添加一个标记，用于获取缩放值
            this._$$offsetPoint = new kity.Circle(10).fill(kity.Color.createRGBA(0, 0, 0, 0));
            this.addShape(this._$$offsetPoint);

            //添加名称
            this._$$name = new kity.Text();
            if (this._lang) {
                var name = this._lightType === LightLine.Type.IncidenceLine ? this._lang['rf_incidence_line_name'] : this._lang['rf_reflection_line_name'];
                this._$$name.setContent(name)
            }
            if (LineStyle[this._lightType]) {
                this._$$name.setAttr('class', LineStyle[this._lightType].fontClass);
            }

            this.addShape(this._$$name);

            this._$$lineGroup = new kity.Group();


            //添加白边
            this._$$lintWhite = new kity.Rect().setStyle(LineStyle.strokeStyle);
            this._$$lintWhite.setSize(this.getWidth() + strokeWidth, LineStyle.rectHeight + strokeWidth);
            this._$$lintWhite.translate(-strokeWidth / 2, -strokeWidth / 2);
            this._$$lineGroup.addShape(this._$$lintWhite);

            var arrowType;
            if (this._lightType == LightLine.Type.IncidenceLine) {
                arrowType = Arrow.Type.Blue;
            } else if (this._lightType == LightLine.Type.ReflectionLine) {
                arrowType = Arrow.Type.Red;
            } else if (this._lightType == LightLine.Type.Reverse) {
                arrowType = Arrow.Type.Green;
            }

            //添加箭头
            this._arrow = Arrow.create(arrowType, this._lightType === LightLine.Type.ReflectionLine || this._config.arrowReverse);
            this._arrow.setVisibility(this._config.arrowVisible);
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
            this._fwBtn.setTranslate(-LineStyle.btnRotate.width - 10, (LineStyle.rectHeight - LineStyle.btnRotate.height) / 2);
            this._fwBtnInvisible = ForeignView.create('btn_rotate', LineStyle.btnRotate.width, LineStyle.btnRotate.height);
            this._fwBtnInvisible.setTranslate(-LineStyle.btnRotate.width - 10, (LineStyle.rectHeight - LineStyle.btnRotate.height) / 2);
            this._fwBtnInvisible.setVisibility(false);
            $(this._$$lineGroup.node).append(this._fwBtn.getView());
            // rotate(-60 30 30)
            this._fwBtn.setVisibility(this._showRotate || false);
            if (this._showRotate) {
                this._fwBtn.setRotate(-60, 30, 30);
            }

            $(this._$$lineGroup.node).append(this._fwBtnInvisible.getView());


            this.addShape(this._$$lineGroup);

            //绑定事件
            this.bindDomEvent(this._fwBtn.getView(), ['down', 'beforemove', 'move', 'aftermove'], this._fwBtn.getUuid(), this.domEventHandler, false);
            this.bindDomEvent(this._$$lineGroup.node, ['lrTap'], this._lineGroupUuid, this.domEventHandler, false);

            this.initView();
        },
        setMoveListener: function (listner) {
            this._moveListener = listner;
        },
        getWidth: function () {
            return this._config.width;
        },
        setWidth: function (width) {
            this._config.width = width;
            this._config.arrowPos = (width - this._arrow.getWidth()) / 2;
            //线没有箭号长时，隐藏入射箭号
            if (this._config.width <= this._arrow.getWidth() + 10) {
                this._arrow.setVisibility(false);
            } else {
                this._arrow.setVisibility(this._config.arrowVisible);
            }
            this._$$lintWhite.setSize(this.getWidth() + strokeWidth, LineStyle.rectHeight + strokeWidth);
            var clickWidth = LineStyle.arrow.height / 3;
            this._$$lintClick.setSize(this.getWidth() + strokeWidth, clickWidth);
            this._$$whiteRect.setSize(this.getWidth(), LineStyle.rectHeight);

            this.initArrowPos();
            this.setTranslate(-this.getWidth(), -3);
            var rotate = Svg.getAttrRotate(this._$$lineGroup.getAttr('transform'));
            if (rotate && rotate.length > 0) {
                this._$$lineGroup.setRotate((rotate[0] ) + ' ' + this.getWidth() + ' ' + rotate[2]);
            }
            this.initNamePos();
        },
        setArrowPos: function (arrowPos) {
            this._config.arrowPos = arrowPos;
            this.initArrowPos();
        },
        initArrowPos: function () {
            //这里加上两个偏差
            if (this._lightType === LightLine.Type.ReflectionLine || this._config.arrowReverse) {
                this._arrow.setTranslate(this.getArrowPos(), (LineStyle.rectHeight + this._arrow.getHeight()) / 2 + 3.5);
            } else {
                this._arrow.setTranslate(this.getArrowPos(), ( -this._arrow.getHeight() ) / 2);
            }
        },
        getArrowPos: function () {
            return this._config.arrowPos;
        },
        blur: function (uuid) {
            if (uuid !== this._lineGroupUuid) {
                this.setFwBtnVisible(false);
                this._$$lintWhite.setVisible(false);
                this._arrow.active(false);
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
                if (eventType === 'down') {
                    this._$$lintWhite.setVisible(true);
                    this._arrow.active(true);
                } else if (eventType === 'beforemove') {

                } else if (eventType === 'move') {

                } else if (eventType === 'aftermove') {
                    this.__triggerEvent('insidechange', this._lightType + '-move');
                }
            } else if (uuid === this._lineGroupUuid) {
                if (eventType === 'lrTap') {
                    if (this._arrow.isActive()) {
                        this.blur();
                        return;
                    }
                    this.setFwBtnVisible(true);
                    this._$$lintWhite.setVisible(true);
                    this._arrow.active(true);
                }
            }
            this.btnStillInBox();
        },
        initView: function () {
            this.setFwBtnVisible(false);
            this._$$lintWhite.setVisible(false);
            this._arrow.active(false);
            if (this._config.nameEnable === false) {
                View.setVisibility(this._$$name, false)
            }
            this.setVisibility(this._config.visible);

        },
        setRotate: function (angle, x, y) {

            x = typeof x === typeof undefined ? this.getWidth() : x;
            y = typeof y === typeof undefined ? halfY : y;

            this._$$lineGroup.setRotate(angle + ' ' + x + ' ' + y);
            this.initNamePos(x, y);
            this.fwBtnMove();
        },
        rotate: function (angle, x, y) {
            x = typeof x === typeof undefined ? this.getWidth() : x;
            y = typeof y === typeof undefined ? halfY : y;
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
            y = typeof y === typeof undefined ? halfY : y;
            this.makeViewAround(this._$$name, this._$$lineGroup, this.getWidth(), this.getWidth() + 15, x, y, 0, 10, false);
        },
        getRotatePos: function () {
            return {x: this.getWidth(), y: halfY};
        },
        setNameVisible: function (visible) {
            if (this._config.nameEnable) {
                View.setVisibility(this._$$name, visible);
            }
        },
        //设置公共线样式
        setCommonFill: function () {
            this._$$whiteRect.fill(LineStyle.commonLineFill);
            this._arrow.changeType(Arrow.Type.Red);
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
        setVisibility: function (visible) {
            BaseView({}).setVisibility.apply(this, [visible]);
            this.__triggerEvent(EventKey.LightLineVisible, this._lightType, visible);
        },
        setLineEnable: function (enable) {

        },
        makeNameViewAround: function (aroundLineAngle, x, y) {
            x = typeof x === typeof undefined ? this.getWidth() : x;
            y = typeof y === typeof undefined ? halfY : y;
            aroundLineAngle = typeof aroundLineAngle === typeof undefined ? this._$$lineGroup : aroundLineAngle;
            this.makeViewAround(this._$$name, aroundLineAngle, this.getWidth(), this.getWidth() + 10, x, y, 0, 0, false);
        },
        getLightType: function () {
            return this._lightType;
        },
        fwBtnMove: function () {
            //不可点击时，不需要处理旋转按钮
            if (!this._config.clickAble) {
                return
            }
            this.triggerMoveBtn();

        },
        setFwBtnVisible: function (visible) {
            this.triggerMoveBtn(visible);
        },
        triggerMoveBtn: function (visible) {
            //不可点击时，不需要处理旋转按钮
            if (!this._config.clickAble) {
                return
            }
            if (this._showRotate) {
                return;
            }
            if (this._moveListener)
                this._moveListener(this.getScale(), this._fwBtn.getView()[0].getBoundingClientRect(), this._fwBtn.getUuid());
        },
        fwBtnTranslate: function (x, y) {
            //不可点击时，不需要处理旋转按钮
            if (!this._config.clickAble) {
                return
            }
            this._fwBtn.setTranslate(x, y);
            this.fwBtnMove();
        },
        btnStillInBox: function () {
            if (!this._config.clickAble) {
                return
            }
            var originalRect = this._fwBtnInvisible.getView()[0].getBoundingClientRect();
            var svgElem = this._fwBtn.getView().closest('svg')[0];
            if (!svgElem) {
                return;
            }
            var svgRect = svgElem.getBoundingClientRect();
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
            if (originalRect.bottom <= svgRect.bottom && originalRect.left >= svgRect.left && originalRect.right <= svgRect.right && originalRect.top >= svgRect.top || angle === 90) {
                this.fwBtnTranslate(-LineStyle.btnRotate.width - 10, translate[1]);
            } else {
                var translateX = 0;
                var scale = this.getScale();
                var max = this._config.width + translate[0] + LineStyle.btnRotate.width + 10;
                if (originalRect.left <= svgRect.left) {
                    //超出左侧
                    var subY = svgRect.left - originalRect.left;
                    var x = (subY / Math.cos(GraphMath.getRadian(angle))) / scale;

                    translateX = translate[0] - ( -x);
                    if (translateX > max) {
                        translateX = max;
                    }
                    this.fwBtnTranslate(translateX, translate[1]);
                }

                if (originalRect.bottom >= svgRect.bottom) {
                    // 超出下方
                    var subY = originalRect.bottom - svgRect.bottom;
                    var x = (subY / Math.sin(GraphMath.getRadian(angle))) / scale;
                    if (translateX == 0 || translateX < translate[0] + x) {
                        translateX = translate[0] + x
                    }
                    if (translateX > max) {
                        translateX = max;
                    }
                    this.fwBtnTranslate(translateX, translate[1]);
                }

                //超出上方
                if (originalRect.top <= svgRect.top) {
                    var subY = svgRect.top - originalRect.top;
                    var x = (subY / Math.sin(GraphMath.getRadian(angle))) / scale;
                    if (translateX == 0 || translateX < translate[0] + x) {
                        translateX = translate[0] + x
                    }
                    this.fwBtnTranslate(translateX, translate[1]);
                }

                //超出右側
                if (originalRect.right >= svgRect.right) {
                    var subY = originalRect.right - svgRect.right;
                    var x = (subY / Math.cos(GraphMath.getRadian(angle))) / scale;
                    translateX = translate[0] - ( -x);
                    this.fwBtnTranslate(translateX, translate[1]);
                }
            }
        },
        getScale: function () {
            var scale = (this._$$offsetPoint.node.getBoundingClientRect().width / 20) || 1;
            return scale;
        }
    });

    //静态方法
    LightLine.Type = {
        IncidenceLine: 'IncidenceLine',
        ReflectionLine: 'ReflectionLine',
        NormalLine: 'NormalLine',
        SurfaceIn: 'SurfaceIn',
        SurfaceOut: 'SurfaceOut',
        Reverse: 'Reverse'
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
            var $$text = new kity.Text().setContent(text).setAttr('x', 0).setAttr('y', y >= 0 ? y : 0);
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
            r: 0,
            letterR: 0,
            angleR:0,
            angleLetter: ''
        }
    };

    var anglePaddingLeft = 10;


    var NameGroup = BaseView({
        _data: '',
        _nameVisible: true,
        _$$incidencePoint: null,
        _lang: null,
        _lightHeight: 48,
        _option: null,
        _reflectorType: 0,
        _nameAutoPos: false,
        _status: null,
        create: function (data, lang, option, reflectorType, nameAutoPos) {
            var instance = Object.create(this);
            instance.__base([]);
            instance._data = data;
            instance._reflectorType = reflectorType;
            instance._lang = lang;
            instance._option = option;
            instance._status = {};
            instance._nameAutoPos = nameAutoPos;
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
                    data.mtAngle.getView().setAttr('class', SectorStyle.incidenceFontClass);
                    //隐藏的角度，用来确认位置
                    data.mtInvisibleAngle = MultipleText.create(that._lightHeight);
                    data.mtInvisibleAngle.getView().setAttr('class', SectorStyle.incidenceFontClass);
                    //名称
                    data.mtName = MultipleText.create(that._lightHeight);
                    data.mtName.getView().setAttr('class', SectorStyle.incidenceFontClass);
                    that.addShape(data.mtInvisibleAngle.getView());
                    View.setVisibility(data.mtInvisibleAngle.getView(), false);
                    data.angleLetter = 'i';
                    data.mtAngleLetter = new kity.Text('i').setAttr('class', SectorStyle.incidenceLetterClass);
                    that.addShape(data.mtAngleLetter);
                } else if (key == Sector.Type.Reflection) {
                    //反射线与法线夹角
                    data.name = this._lang['rf_reflection_angle'];
                    data.mtAngle.getView().setAttr('class', SectorStyle.reflectionFontClass);
                    data.mtInvisibleAngle = MultipleText.create(that._lightHeight);
                    data.mtInvisibleAngle.getView().setAttr('class', SectorStyle.reflectionFontClass);
                    //名称
                    data.mtName = MultipleText.create(that._lightHeight);
                    data.mtName.getView().setAttr('class', SectorStyle.reflectionFontClass);
                    that.addShape(data.mtInvisibleAngle.getView());
                    View.setVisibility(data.mtInvisibleAngle.getView(), false);
                    data.angleLetter = 'r';
                    data.mtAngleLetter = new kity.Text('r').setAttr('class', SectorStyle.reflectionLetterClass);
                    that.addShape(data.mtAngleLetter);
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
        setNormalAngle: function (normalAngle) {
            this._normalAngle = normalAngle;
        },
        rotate: function (angle, nagative) {
            var __getIndex = function (index, nagative, sub) {
                return nagative ? sub - index : index;
            };
            this._rotate(Sector.Type.SurfaceIn, angle[__getIndex(0, nagative, 3)], angle[__getIndex(1, nagative, 5)]);
            this._rotate(Sector.Type.Incidence, angle[__getIndex(1, nagative, 3)], angle[__getIndex(2, nagative, 5)]);
            this._rotate(Sector.Type.Reflection, angle[__getIndex(2, nagative, 3)], angle[__getIndex(3, nagative, 5)]);
            this._rotate(Sector.Type.SurfaceOut, angle[__getIndex(3, nagative, 3)], angle[__getIndex(4, nagative, 5)]);
        },
        _rotate: function (type, startAngle, endAngle) {
            var data = this._data[type];
            var angle = Math.abs(Math.round(startAngle - endAngle));
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
        updatePos:function () {
            for (var key in this._data) {
                this.updatePosByType(key);
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
                    data.mtAngleLetter.setContent('');
                }
            } else {
                var isNameVertical = this.isNameVertical();
                if (nameVisible) {
                    data.mtName.setContent(isNameVertical ? data.name.split('') : data.name);
                } else {
                    data.mtName.setContent('');
                }
                data.mtAngle.setContent(data.angleStr);
                if (data.mtAngleLetter) {
                    data.mtAngleLetter.setContent(data.angleLetter);
                }
                var r = data.angleR + this._lightHeight;

                //显示名称，且名称水平显示
                if (!isNameVertical && nameVisible && !this.isSurfaceAngle(type)) {
                    r += data.mtAngle.getWidth() / 2 + data.mtName.getWidth() / 2;
                }
                //入射角、反射角
                if (!this.isSurfaceAngle(type)) {
                    if (this._reflectorType === 1 || this._reflectorType === 2 || this._reflectorType === 3) {
                        r += 20;
                    } else {
                        r += 13;
                    }
                }
                if (this.isSurfaceAngle(type) || !nameVisible) {
                    var marginX = 0, marginY = 0;
                    if (this.isSurfaceAngle(type)) {
                        if (this._reflectorType === 4) {
                            r = r - 16;//进行偏移更靠近扇面
                            marginX = 9;
                        } else if (this._reflectorType === 5) {
                            r = r - 10;//进行偏移更靠近扇面
                            marginX = 6;
                        } else {
                            marginX = 3;
                        }
                    } else {
                        if (this._reflectorType === 5) {
                            // if (this._nameAutoPos) {
                            //     var percent = 0;
                            //     if (data.angle > 30 && data.angle <= 49) {
                            //         percent = (data.angle - 30) % 20 / 20;
                            //     } else if (data.angle >= 50) {
                            //         percent = 1;
                            //     }
                            //     r = r - 25 * percent;
                            // } else {
                            //     r = r - 27;
                            // }

                        }
                    }

                    //this.makeViewAround(data.mtAngle, data.sphereAngle,1000,  r,data.cx, data.cy, 0, 0, false);
                    this.makeAbsViewHorizontal(data.mtAngle, data.sphereAngle, r, data.cx, data.cy, marginX, marginY, false);
                    if (data.mtAngleLetter) {
                        var letterR;
                        if (!data.letterR) {
                            letterR = 110;
                        } else {
                            letterR = data.letterR;
                        }
                        this.makeAbsViewHorizontal(data.mtAngleLetter, data.sphereAngle, letterR, data.cx, data.cy, marginX, marginY, false);
                    }
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
            if (data.mtAngleLetter) {
                View.setVisibility(data.mtAngleLetter, visible);
            }
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
                //同步显示名称
                if (this._status[type] === true) {
                    var data = this._data[type];
                    if (data.mtName) {
                        View.setVisibility(data.mtName.getView(), this._nameVisible);
                        this.updatePosByType(type);
                    }
                }
            } else {
                for (var key in   this._status) {
                    this._status[key] = status;
                    //同步显示名称
                    var data = this._data[key];
                    if (data.mtName) {
                        View.setVisibility(data.mtName.getView(), this._nameVisible);
                        this.updatePosByType(key);
                    }
                }
            }
        },
        getHasDrawStatusByType: function (type) {
            return this._status[type];
        },
        getAngleVisibilityByType: function (type) {
            var data = this._data[type];
            return !View.isVisibilityHidden(data.mtAngle.getView());
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
        initNamePos: function (centerX, centerY) {
            centerX = typeof centerX === typeof undefined ? this._width : centerX;
            centerY = typeof centerY === typeof undefined ? 0 : centerY;
            var downWidth = this._$$nameDown.getWidth();
            var nameWidth = this._$$name.getWidth();
            this.makeViewAround(this._$$name, this._$$line, this._width, this._width + 25, centerX, centerY, -nameWidth / 2 + 17, 0, false);
            this.makeViewAround(this._$$nameDown, this._$$line, 250, 25, centerX, centerY, -downWidth / 2 + 15, 0, true);
        },
        setNameVisible: function (visible) {
            //this._$$nameDown.setContent(visible === true ? this._lang['rf_incidence_point'] : 'O');
            //this._$$name.setContent(visible === true ? this._lang['rf_normal_name'] : 'N');
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
define('js/view/PedalLine', ['js/view/BaseView', 'js/config/style', 'js/utils/view'], function (BaseView, Style) {


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
            this._$$sector.setStyle(SectorStyle.strokeStyle);
            this._$$sectorBorder = new kity.Path('');
            this._$$sectorBorder.setStyle(SectorStyle.strokeStyle);

            //名称和度数
            if (this._type === Sector.Type.SurfaceIn || this._type === Sector.Type.SurfaceOut) {
                //与反射面夹角
                this._$$sector.fill(SectorStyle.surfaceFill);
            } else if (this._type === Sector.Type.Incidence) {
                //入射线与法线夹角
                this._$$sector.fill(SectorStyle.incidenceFill);
            } else if (this._type === Sector.Type.Reflection) {
                //反射线与法线夹角
                this._$$sector.fill(SectorStyle.reflectionFill);
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
            this._$$sector.setStyle({opacity:0.6});
            this._$$sectorBorder.setAttr('d', str);
        }

    });

    Sector.Type = {
        Incidence: 1,
        Reflection: 2,
        SurfaceIn: 3,
        SurfaceOut: 4
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
            instance.__on(EventKey.BtnMove + instance._fwBtn.getUuid(), instance.domEventHandler, []);
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
            this._$$name.setContent(this._lang['rf_reflection_surface']).setAttr('class', SurfaceStyle.fontClass);
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
            this.bindDomEvent(this._fwBtn.getView(), ['down', 'beforemove', 'move', 'aftermove'], this._fwBtn.getUuid(), this.domEventHandler);

            this._fwBtn.setVisibility(false);

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
                this.setFwBtnVisible(false);
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
                    this.setFwBtnVisible(true);
                    this._fwSurface.addClass('on');
                }
            } else if (uuid === this._fwBtn.getUuid()) {
                this._onSurfaceMove(data, eventType);
                if (eventType === 'down') {
                    this._fwSurface.addClass('on')
                } else if (eventType === 'beforemove') {

                } else if (eventType === 'aftermove') {
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
        setMoveListener: function (listner) {
            this._moveListener = listner;
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
                    this.fwBtnTranslate(this._config.width + 10, translate[1]);
                } else {
                    this.fwBtnTranslate(-SurfaceStyle.btnRotate.width - 10, translate[1]);
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
                    this.fwBtnTranslate(translateX, translate[1]);
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

                    this.fwBtnTranslate(translateX, translate[1]);
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
                    this.fwBtnTranslate(translateX, translate[1]);
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
            this.fwBtnMove();
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
            this.makeViewAround(this._$$name, this._$$surface, r, distance, this._config.rotatePosX, y, 0, 0, false);
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
        },
        fwBtnMove: function () {
            if (!this._config.clickAble) {
                return
            }
            if (!this.isVisibilityHidden() && this._moveListener) {
                this._moveListener(this.getScale(), this._fwBtn.getView()[0].getBoundingClientRect(), this._fwBtn.getUuid());
            }
        },
        setFwBtnVisible: function (visible) {
            if (!this._config.clickAble) {
                return
            }
            if (this._moveListener) {
                this._moveListener(this.getScale(), this._fwBtn.getView()[0].getBoundingClientRect(), this._fwBtn.getUuid(), visible);
            }
        },
        fwBtnTranslate: function (x, y) {
            this._fwBtn.setTranslate(x, y);
            this.fwBtnMove();
        }
    });
    Surface.Type = {
        tl: 'tl',
        tr: 'tr',
        tl_Large: 'wall_tl_large'
    }
    return Surface;
});
/**
 * Created by ylf on 2016/8/22.
 */
define('js/reflector/lightComplex/config', [], function () {

    var LightLine = require('js/view/LightLine');
    /**
     * StaticLine{
            width: 370,//整体长度
            arrowPos: 180,//箭号所在位置
            defaultAngle: 60,//默认角度
            visible: true,//是否显示
            clickAble: true,//是否允许点击和移动
            rotateFixed: true,//是否旋转时，固定不动
            highLineZIndex: false,//反射和入射线中是否层级更高
            autoAdsorption: true,//是否自动吸附
            arrowReverse: false,//箭头反转
            lineType: LightLine.Type.Reverse
        }
     */
    var Config = {
        IncidenceLine: {
            width: 370,//整体长度
            arrowPos: 150,//箭号所在位置
            defaultAngle: 50,//默认角度
            visible: true,//是否显示
            clickAble: true,//是否允许点击和移动
            rotateFixed: true,//是否旋转时，固定不动
            PedalWidth: 370,//垂足显示时的长度
            PedalArrowPos: 140,//垂足显示时箭头位置
            rotateFixedAfterDraw: false,//一步完成、或逐步画开始后，不跟随反射面移动而移动
            highLineZIndex: false,//反射和入射线中是否层级更高
            nameEnable: true,//是否需要名称支持
            arrowVisible: true//是否显示箭头
        },
        ReflectionLine: {
            width: 370,
            arrowPos: 240,
            visible: true,
            clickAble: true,
            rotateFixed: false,
            PedalWidth: 280,//垂足显示时的长度
            PedalArrowPos: 155,//垂足显示时箭头位置
            rotateFixedAfterDraw: false,
            nameEnable: true,
            arrowVisible: true
        },
        NormalLine: {
            width: 400,
            lineVisible: false,
            pointNameVisible: false,
            visible: true
        },
        StaticLine: [],
        Sector: {
            sectorInVisible: true,
            sectorOutVisible: true,
            incidenceVisible: true,
            reflectionVisible: true,
            incidenceR: 65,
            reflectionR: 76,
            surfaceR: 55,
            letterR: 76,
            angleR: 76
        },
        IncidencePointVisible: false,
        PedalLineVisible: false,
        IncidencePosX: 0,//入射点位置
        DrawIndex: [0, 1, 2, 3],//绘制动画内容和顺序
        PedalDrawIndex: [[0, 1], [5, 6], [10]],//TODO:反射镜=入射角的还未处理//绘制动画内容和顺序
        Visible: true,
        view90PedalLineVisible: true,//处理垂足时候显示垂足符号
        nameEventEnable: true,//名称显示事件支持
        NameAutoPos: false
    };


    return Config;

});
/**
 * Created by ylf on 2016/8/22.
 */
define('js/reflector/lightComplex/draw', ['js/view/sector', 'js/utils/utils', 'js/utils/view'], function (Sector, Utils, View) {

    var LightComplexDraw = {
        _hasDrawBegin: false,
        _hasDrawNext: true,
        setDrawBegin: function (hasDrawBegin) {
            this._hasDrawBegin = hasDrawBegin;
            //固定预设线，不可跟随旋转
            if (this._configData.IncidenceLine.rotateFixedAfterDraw) {
                this._configData.IncidenceLine.rotateFixed = true;
            }
            if (this._configData.ReflectionLine.rotateFixedAfterDraw) {
                this._configData.ReflectionLine.rotateFixed = true;
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
            this._drawCommand.stop(function () {
                that._drawCommand.drawAll(null, false);
                //自动吸附90°
                that.adsorptionPedal();
                that.__triggerEvent('insidechange', 'drawAll');
                cb && cb();
            });
        },
        drawNext: function (cb) {
            //隐藏状态下不能绘制
            if (this.isVisibilityHidden()) {
                return;
            }
            this.setDrawBegin(true);
            var that = this;
            if(!this._drawCommand.hasNext()){
                cb && cb();
            }else{
                this._drawCommand.drawNext(function () {
                    //绘制完后隐藏相应视图
                    //that._hasDrawNext = that._drawCommand.hasNext();
                    //自动吸附90°
                    that.adsorptionPedal();
                    that.__triggerEvent('insidechange', 'drawNext');
                    cb && cb();
                }, true);
            }

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
            //return this._hasDrawNext;
            return this._drawCommand.hasNext();
        },
        initDrawCommand: function () {
            var that = this;
            that._hsdrawIncidencePoint = false;
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
                //扇面不可用
                if (!that.getSectorEnable()) {
                    return true;
                }
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
                if (!that.getSectorEnable()) {
                    return true;
                }
                if (that._option.normalAngleVisible === true && !that.isPedal()) {
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


            //7.反射角
            this._drawCommand.push(function (deffer, animate) {
                //扇面显示时才显示角度
                if (that._option.normalAngleVisible === true) {
                    that.setSectorVisibilityByType(Sector.Type.Reflection, true);
                }
                that.setSectorInsideDrawStatus(true, Sector.Type.Reflection);
                deffer.resolve();
            }, function () {
                if (!that.getSectorEnable()) {
                    return true;
                }
                if (that._option.normalAngleVisible === true && !that.isPedal()) {
                    return !that._reflectionSector.isVisibilityHidden();
                }
                return true;
            });


            //8.反射线
            this._drawCommand.push(function (deffer) {
                that._reflectionLine.setVisibility(true);
                deffer.resolve();
            }, function () {
                return !that._reflectionLine.isVisibilityHidden()
            });

            //9.反射线与反射面扇面
            this._drawCommand.push(function (deffer) {
                if (that._option.surfaceAngleVisible === true) {
                    that.setSectorVisibilityByType(Sector.Type.SurfaceOut, true);
                }
                that.setSectorInsideDrawStatus(true, Sector.Type.SurfaceOut);
                deffer.resolve();
            }, function () {
                if (!that.getSectorEnable()) {
                    return true;
                }
                if (that._option.surfaceAngleVisible === true && !that.isPedal()) {
                    return !that._surfaceOutSector.isVisibilityHidden();
                }
                return true;
            });


            //10.显示垂足的入射光线、反射光线
            this._drawCommand.push(function (deffer) {
                that._incidenceLine.setVisibility(true);
                that._reflectionLine.setVisibility(true);
                that._incidenceLine.setWidth(that._configData.IncidenceLine.PedalWidth);
                that._incidenceLine.setArrowPos(that._configData.IncidenceLine.PedalArrowPos);
                that._reflectionLine.setWidth(that._configData.ReflectionLine.PedalWidth);
                that.resetLinePos();
                that._reflectionLine.setArrowPos(that._configData.ReflectionLine.PedalArrowPos);
                deffer.resolve();

            }, function () {
                return !that._reflectionLine.isVisibilityHidden() && !that._incidenceLine.isVisibilityHidden() && (that._reflectionLine.getWidth() === that._configData.ReflectionLine.PedalWidth);
            });
            //11.入射角、反射镜闪烁隐藏
            this._drawCommand.push(function (deffer, animate) {
                //that._draw11 = true;
                //扇面显示时才显示角度
                if (that._option.normalAngleVisible === false && animate) {
                    that.sectorAnimateDisappear(function () {
                        deffer.resolve();
                    });
                } else {
                    deffer.resolve();
                }
            }, function () {
                return that.getSectorHasDraw(Sector.Type.Incidence) && that.getSectorHasDraw(Sector.Type.Reflection);
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
            this._reflectionLine.setVisibility(true);

            this._incidenceLine.setWidth(width || this._configData.IncidenceLine.PedalWidth);
            if (width === this._configData.IncidenceLine.PedalWidth) {
                this._incidenceLine.setArrowPos(this._configData.IncidenceLine.PedalArrowPos);
            }
            this._reflectionLine.setWidth(this._configData.ReflectionLine.PedalWidth);
            this._reflectionLine.setArrowPos(this._configData.ReflectionLine.PedalArrowPos);
            this.resetLinePos();
        },
        isDrawIncidenceShortPedalView: function (width) {
            return !this._reflectionLine.isVisibilityHidden() && !this._incidenceLine.isVisibilityHidden() && (this._incidenceLine.getWidth() === (width || this._configData.IncidenceLine.PedalWidth));
        },
        getHasDrawIncidencePoint: function () {
            return this._hsdrawIncidencePoint;
        },
        initDrawStatus: function () {
            var draw = this._configData.Draw;
            if (draw) {
                this._hsdrawIncidencePoint = draw.incidencePoint;
            }
        }
    };

    return LightComplexDraw;
});
/**
 * Created by ylf on 2016/8/22.
 */
define('js/reflector/lightComplex/event', ['js/view/sector'], function (Sector) {

    var LightComplexEvent = {
        surfaceAngleVisibleHandler: function (visible) {
            this.setSectorVisibilityByOutSideLogic(Sector.Type.SurfaceIn, visible);
            this.setSectorVisibilityByOutSideLogic(Sector.Type.SurfaceOut, visible);
        },
        normalAngleVisibleHandler: function (visible) {
            this.setSectorVisibilityByOutSideLogic(Sector.Type.Incidence, visible);
            this.setSectorVisibilityByOutSideLogic(Sector.Type.Reflection, visible);
        },
        setNameVisible: function (visible) {
            this._incidenceLine.setNameVisible(visible);
            this._reflectionLine.setNameVisible(visible);
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
define('js/reflector/lightComplex/main', ['js/reflector/baseReflector', 'js/utils/utils', 'js/utils/graphMath', 'js/config/style', 'js/config/eventKey', 'js/utils/view'], function (BaseReflector, Utils, GraphMath, Style, EventKey, View) {

    //view
    var BaseView = require('js/view/BaseView');
    var Sector = require('js/view/sector');
    var LightLine = require('js/view/LightLine');
    var NormalLine = require('js/view/NormalLine');
    var NameGroup = require('js/view/NameGroup');
    var PedalLine = require('js/view/PedalLine');
    var DrawCommand = require('js/utils/DrawCommand');
    var Config = require('js/reflector/lightComplex/config');

    var Btns = require('js/reflector/btns');
    var MinAngle = 5;
    var IncidencePointStyle = Style.IncidencePoint;

    var LightComplex = BaseView({
            _data: null,
            _configData: null,
            _onLightMove: null,
            _option: null,
            _reflectorType: 0,
            _staticLines: [],//静态线
            _linePedalChangeLock: false,
            _lineMoveListener: null,
            _hasDrawNext: true,//是否还有下一步
            create: function (eventBus, configData, onLightMove, option, reflectorType) {
                var instance = Object.create(this);
                instance._uuid = Utils.getUuid();
                instance._reflectorType = reflectorType;
                instance._configData = $.extend(true, {}, Config, configData);
                instance._configData.DrawIndex = $.extend(true, [], configData.DrawIndex || Config.DrawIndex);
                instance._configData.PedalDrawIndex = $.extend(true, [], configData.PedalDrawIndex || Config.PedalDrawIndex);
                //事件绑定
                var eventsInfo = [];
                instance._staticLines = [];
                eventsInfo.push({key: EventKey.SurfaceAngleVisible, callback: 'surfaceAngleVisibleHandler', params: []});
                eventsInfo.push({key: EventKey.NormalAngleVisible, callback: 'normalAngleVisibleHandler', params: []});
                if (instance._configData.nameEventEnable) {
                    eventsInfo.push({key: EventKey.NameVisible, callback: 'nameVisibleHandler', params: []});
                }
                eventsInfo.push({key: EventKey.ZIndexChange, callback: 'zIndexChangeHandler', params: []});
                instance.__base(eventBus, eventsInfo);
                instance.__proxyAll(['onLightMove']);//绑定this指针
                instance._option = option;
                instance._onLightMove = onLightMove;
                instance._drawCommand = DrawCommand.create();
                instance._drawCommand.setDrawIndex(instance._configData.DrawIndex);
                instance.initBtns();
                instance.createView();
                instance.initVisibleState();
                instance.initDrawCommand();
                instance.initDomEvent();
                return instance;
            },
            createView: function () {
                var that = this;
                var configData = this._configData;
                var appendPosX = 0;//内部偏移坐标
                //夹角扇面和名称
                this.createSector(appendPosX);
                //静态线
                for (var i = 0; i < configData.StaticLine.length; i++) {
                    var line = LightLine.create(this.__getEventBus(), configData.StaticLine[i].lineType, configData.StaticLine[i]);
                    this.addShape(line.getView());
                    this._staticLines.push(line);
                }


                //反射、入射线
                this._reflectionLine = LightLine.create(this.__getEventBus(), LightLine.Type.ReflectionLine, configData.ReflectionLine, this.onLightMove, this._option.langData);
                this._incidenceLine = LightLine.create(this.__getEventBus(), LightLine.Type.IncidenceLine, configData.IncidenceLine, this.onLightMove, this._option.langData, this._option.showDefaultRotateBtn);
                if (configData.IncidenceLine.clickAble) {
                    this._incidenceLine.setMoveListener(function (scale, clientRect, uuid, visible) {
                        that.btns.moveBtnEventHandler(scale, clientRect, uuid, visible);
                        // that._reflectionLine.fwBtnMove();
                        // that._staticLines.forEach(function (line, i) {
                        //     line.fwBtnMove();
                        // });
                        if (that._lineMoveListener) {
                            that._lineMoveListener();
                        }
                    })
                }
                if (configData.ReflectionLine.clickAble) {
                    this._reflectionLine.setMoveListener(function (scale, clientRect, uuid, visible) {
                        that.btns.moveBtnEventHandler(scale, clientRect, uuid, visible);
                        // that._incidenceLine.fwBtnMove();
                        // that._staticLines.forEach(function (line, i) {
                        //     line.fwBtnMove();
                        // });
                        if (that._lineMoveListener) {
                            that._lineMoveListener();
                        }
                    })
                }
                //法线
                this._normalLine = NormalLine.create(configData.NormalLine.width, this._option.langData);
                //垂足符号
                this._pedalLine = PedalLine.create();

                this.appendSector();

                this.addShape(this._normalLine.getView());
                if (configData.IncidenceLine.highLineZIndex) {
                    this.addShape(this._reflectionLine.getView());
                    this.addShape(this._incidenceLine.getView());
                } else {
                    this.addShape(this._incidenceLine.getView());
                    this.addShape(this._reflectionLine.getView());
                }

                this.addShape(this._pedalLine.getView());

                var translateX = -(Math.abs(appendPosX - configData.IncidenceLine.width));
                var reflectionTranslateX = -(Math.abs(appendPosX - configData.ReflectionLine.width));
                var translateY = -3;//向上偏移一个像素，防止底部突出
                var normalTranslateX = -(Math.abs(appendPosX - configData.NormalLine.width));

                this._incidenceLine.setTranslate(translateX, translateY);
                this._incidenceLine.setRotate(configData.IncidenceLine.defaultAngle);

                this._reflectionLine.setTranslate(reflectionTranslateX, translateY);
                this._reflectionLine.setRotate(180 - configData.IncidenceLine.defaultAngle);
                this._normalLine.setTranslate(normalTranslateX, 1);//向下偏移1像素，反正水平面垂直时无法和光线重合

                this._staticLines.forEach(function (line, i) {
                    var lineConfig = configData.StaticLine[i];
                    var translateX = -(Math.abs(appendPosX - lineConfig.width));
                    line.setTranslate(translateX, translateY);
                    line.setRotate(lineConfig.defaultAngle);
                });

                //定位到入射点
                this.setTranslate(this._configData.IncidencePosX, 0);

                //入射点
                this._$$incidencePoint = new kity.Circle(IncidencePointStyle.width).fill(IncidencePointStyle.fill);
                this._$$incidencePoint.setTranslate(this._configData.IncidencePosX, 0);


            },
            setLineMoveListener: function (lineMoveListener) {
                this._lineMoveListener = lineMoveListener
            },
            btnStillInBox: function () {
                this._reflectionLine.btnStillInBox();
                this._incidenceLine.btnStillInBox();
                this._staticLines.forEach(function (line, i) {
                    line.btnStillInBox();
                });
            },
            initBtns: function () {
                var count = this._configData.IncidenceLine.clickAble ? 1 : 0;
                if (this._configData.ReflectionLine.clickAble) {
                    count++;
                }
                this.btns = Btns.create(this.__getEventBus(), this._$$container, count);
            }
            ,
            initVisibleState: function () {

                var configData = this._configData;
                this.initSectorVisibleState();
                this.surfaceAngleVisibleHandler(this._option.surfaceAngleVisible);
                this.normalAngleVisibleHandler(this._option.normalAngleVisible);
                this.nameVisibleHandler(this._option.nameVisible);

                this._normalLine.setVisibility(configData.NormalLine.visible);
                this._pedalLine.setVisibility(configData.PedalLineVisible);

                View.setVisibility(this._$$incidencePoint, configData.IncidencePointVisible);

                this._normalLine.setPointNameVisibility(this._option.nameVisible, configData.NormalLine.pointNameVisible);
                this._normalLine.setLineVisibility(this._option.nameVisible, configData.NormalLine.lineVisible);
            }
            ,
            gtIndexAppendToView: function ($$container) {
                $$container.addShape(this._$$incidencePoint);
                this.gtIndexSectorAppendToView($$container);
                this.btns.appendToView($$container);
            }
            ,
            bringBtnToTop: function () {
                this.btns.getView().bringTop();
            }
            ,
            resetAngle: function (surfaceAngle, init) {
                var that = this;
                var subAngle = typeof this._surfaceAngle == typeof undefined ? surfaceAngle : (surfaceAngle - this._surfaceAngle);
                this._surfaceAngle = surfaceAngle;
                var incidenceAngle = this._incidenceLine.getRotateAngle();
                //反射线相对固定
                if (init) {//第一次初始化，忽略固定角度，否则无法完成初始化工作
                    incidenceAngle = incidenceAngle + subAngle;
                } else if (this._configData.ReflectionLine.rotateFixed) {
                    var reflectionAngle = this._reflectionLine.getRotateAngle();
                    // 算出相对180的夹角+ 整体旋转角度+反射线的旋转角度
                    incidenceAngle = 180 - reflectionAngle + 2 * surfaceAngle;
                } else if (this._configData.IncidenceLine.rotateFixed) {
                    incidenceAngle = this._incidenceLine.getRotateAngle();
                } else {
                    incidenceAngle = incidenceAngle + subAngle;
                }
                var incidenceAngleAbs = incidenceAngle - surfaceAngle;
                var startAngle = surfaceAngle;
                var halfAngle = 90 + surfaceAngle;
                var holdAngle = 180 + surfaceAngle;

                this._staticLines.forEach(function (line, i) {
                    var config = that._configData.StaticLine[i];
                    line.setRotate(holdAngle - config.defaultAngle);
                });

                //围绕线底部，中心轴旋转
                if (!this._configData.ReflectionLine.rotateFixed || init) {
                    this._reflectionLine.setRotate(holdAngle - (incidenceAngle - surfaceAngle));
                } else {
                    //为了初始化内部视图位置
                    this._reflectionLine.setRotate(this._reflectionLine.getRotateAngle());
                }
                this._incidenceLine.setRotate(incidenceAngle);
                this._normalLine.setRotate(halfAngle);
                this._pedalLine.setRotate(halfAngle);

                var angle = [];
                var negative = false;
                //超过角度
                if (incidenceAngle > halfAngle) {
                    angle = [startAngle, holdAngle - incidenceAngleAbs, halfAngle, incidenceAngle, holdAngle];
                    negative = true;
                } else {
                    angle = [startAngle, incidenceAngle, halfAngle, holdAngle - incidenceAngleAbs, holdAngle];
                }

                //重置扇面角度相关
                this.resetSectorAngle(this._normalLine.getRotateAngle(), negative, angle);

                //设置动画内容
                this._drawCommand.setDrawIndex(this.isPedal() ? this._configData.PedalDrawIndex : this._configData.DrawIndex);

                this.setIncidence0180View();
                this.resetLinePos();
            }
            ,
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
            }
            ,
            onLightMove: function (lightType, data, eventType) {
                if (eventType === 'beforemove') {
                    //this._isPedal = this.isPedal();
                } else if (eventType === 'aftermove') {
                    //让角度自动吸附90°
                    this.adsorptionPedal();
                    this.adsorptionStatic();
                } else if (eventType === 'move') {
                    var angle = this.getMoveRotateAngle(data);
                    //反射线角度是相反的
                    if (lightType === LightLine.Type.ReflectionLine) {
                        angle = -angle;
                    }
                    if (this.lineRotateAble(angle)) {
                        if (this._configData.IncidenceLine.rotateFixed) {
                            this._incidenceLine.rotate(angle);
                        } else if (this._configData.ReflectionLine.rotateFixed) {
                            this._reflectionLine.rotate(-angle);
                        } else {
                            this._incidenceLine.rotate(angle);
                        }

                        this.resetAngle(this._surfaceAngle);
                        this._onLightMove(this.getUuid(), angle);
                    }
                }
            },
            //90°时自动吸附
            adsorptionStatic: function () {
                if (this._staticLines.length === 0) {
                    return;
                }

                var config,
                    that = this,
                    autoAngle,
                    subReflectionAngle,
                    subIncidenceAngle;
                var angle = Math.round(this.getSectorAngle(Sector.Type.SurfaceIn));
                var incidenceAngle = that._incidenceLine.getRotateAngle();
                var reflectionAngle = that._reflectionLine.getRotateAngle();

                this._staticLines.forEach(function (line, i) {
                    config = that._configData.StaticLine[i];
                    if (config.autoAdsorption) {
                        if (angle === config.defaultAngle) {
                            autoAngle = line.getRotateAngle();
                            subIncidenceAngle = Math.abs(incidenceAngle - autoAngle);
                            subReflectionAngle = Math.abs(reflectionAngle - autoAngle);
                            if (subIncidenceAngle < subReflectionAngle) {
                                that._incidenceLine.setRotate(autoAngle);
                                that._reflectionLine.setRotate(reflectionAngle + incidenceAngle - autoAngle);
                            } else {
                                that._reflectionLine.setRotate(autoAngle);
                                that._incidenceLine.setRotate(incidenceAngle + reflectionAngle - autoAngle);
                            }
                        }
                    }
                });
            },
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
                    if (!this._incidenceLine.isVisibilityHidden() && !this._reflectionLine.isVisibilityHidden() && !this._linePedalChangeLock) {
                        this._incidenceLine.setWidth(this._configData.IncidenceLine.PedalWidth);
                        this._incidenceLine.setArrowPos(this._configData.IncidenceLine.PedalArrowPos);
                        this._reflectionLine.setWidth(this._configData.ReflectionLine.PedalWidth);
                        this._reflectionLine.setArrowPos(this._configData.ReflectionLine.PedalArrowPos);
                    }
                } else {
                    //和名称同步
                    this.syncSectorVisibilityByName();
                    if (this._configData.view90PedalLineVisible) {
                        this._pedalLine.setVisibility(this._normalLine.getLineVisible());
                    }
                    if (!this._incidenceLine.isVisibilityHidden() && !this._reflectionLine.isVisibilityHidden() && !this._linePedalChangeLock) {
                        this._incidenceLine.setWidth(this._configData.IncidenceLine.width);
                        this._incidenceLine.setArrowPos(this._configData.IncidenceLine.arrowPos);
                        this._reflectionLine.setWidth(this._configData.ReflectionLine.width);
                        this._reflectionLine.setArrowPos(this._configData.ReflectionLine.arrowPos);
                    }
                }
            },
            setIncidencePos: function (x, y) {
                //定位到入射点
                this._configData.IncidencePosX = x;
                this.setTranslate(this._configData.IncidencePosX, 0);
                this._$$incidencePoint.setTranslate(this._configData.IncidencePosX, 0);
                this.getNameGroup().setTranslate(this._configData.IncidencePosX, 0);
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
                if (surfaceInSectorAngle + angle < MinAngle) {
                    return false;
                }
                return true;
            },
            //整个光组件是否可移动
            complexRotateAble: function (angle) {
                if (!this._configData.IncidenceLine.rotateFixed && !this._configData.ReflectionLine.rotateFixed) {
                    return true;
                }
                //根据相对固定的光线来进行判断
                if (this._incidenceLine.getRotateAngle() > this._normalLine.getRotateAngle()) {
                    if (this._configData.IncidenceLine.rotateFixed) {
                        angle = angle;
                    } else if (this._configData.ReflectionLine.rotateFixed) {
                        angle = -angle;
                    }
                } else {
                    if (this._configData.IncidenceLine.rotateFixed) {
                        angle = -angle;
                    } else if (this._configData.ReflectionLine.rotateFixed) {
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

                //更新旋转图标位置
                this._incidenceLine.fwBtnMove();
                this._reflectionLine.fwBtnMove();
                // this.getNameGroup().updatePos()
            },
            updatePos: function () {
                this._incidenceLine.fwBtnMove();
                this._reflectionLine.fwBtnMove();
                this.getNameGroup().updatePos()
            },
            getData: function () {
                var that = this;
                var defaultAngle = that.getSectorAngle(Sector.Type.SurfaceIn);
                if (this._normalLine.getRotateAngle() < this._incidenceLine.getRotateAngle()) {
                    defaultAngle = 180 - defaultAngle;
                }
                var data = {
                    IncidenceLine: {
                        defaultAngle: defaultAngle,//默认角度
                        visible: !that._incidenceLine.isVisibilityHidden(),//是否显示
                        rotateFixed: that._configData.IncidenceLine.rotateFixed,
                        nameEnable: that._incidenceLine.getNameEnable()
                    },
                    ReflectionLine: {
                        visible: !that._reflectionLine.isVisibilityHidden(),
                        rotateFixed: that._configData.ReflectionLine.rotateFixed,
                        nameEnable: that._reflectionLine.getNameEnable()
                    },
                    NormalLine: {
                        pointNameVisible: that._normalLine.getPointNameVisible(),
                        lineVisible: that._normalLine.getLineVisible()
                    },
                    Sector: {
                        sectorInVisible: that.getSectorOutSideVisibilityByType(Sector.Type.SurfaceIn),
                        sectorOutVisible: that.getSectorOutSideVisibilityByType(Sector.Type.SurfaceOut),
                        incidenceVisible: that.getSectorOutSideVisibilityByType(Sector.Type.Incidence),
                        reflectionVisible: that.getSectorOutSideVisibilityByType(Sector.Type.Reflection),
                        hasDraw: that.getSectorHasDraw()
                    },
                    Draw: {
                        //hasNext: that.hasNextWidthOutVisibilityStatus(),
                        incidencePoint: that.getHasDrawIncidencePoint()
                        //sectorAnimateDisappear: that.getHasDrawSectorAnimateDisappear()
                    },
                    PedalLineVisible: !that._pedalLine.isVisibilityHidden(),
                    IncidencePosX: that._configData.IncidencePosX,//入射点位置
                    Visible: !that.isVisibilityHidden()
                };
                return data;
            }
            ,
            //90°时自动吸附
            adsorptionPedal: function () {
                if (this.isPedal()) {
                    var normalLineAngle = this._normalLine.getRotateAngle();
                    //垂足
                    this._incidenceLine.setRotate(normalLineAngle);
                    this._reflectionLine.setRotate(normalLineAngle);
                    this.resetAngle(normalLineAngle - 90);
                }
            }
            ,
            //是否垂足
            isPedal: function () {
                //var normalLineAngle = this._normalLine.getRotateAngle();
                //var incidenceAngle = this._incidenceLine.getRotateAngle();
                return Math.round(this.getSectorAngle(Sector.Type.Incidence)) === 0;
                //return Math.round(normalLineAngle) === Math.round(incidenceAngle);
            }
            ,
            initDomEvent: function () {
                this.bindDomEvent(this.getView().node, ['lrTap'], this.getUuid(), this.domEventHandler);
            }
            ,
            setViewTapListener: function (callback) {
                this._onViewClickListener = callback;
            }
            ,
            domEventHandler: function (uuid) {
                this._onViewClickListener && this._onViewClickListener(uuid);
            }
            ,
            changeTransparent: function (show) {
                return;
                var opacity = show ? 1 : 0.4;
                this._normalLine.setOpacity(opacity);
                this._pedalLine.setOpacity(opacity);
                this.setSectorOpacity(opacity);

                if (show) {
                    var $$item = $(this.getView().node).closest('._lr_item');
                    var $surface = $$item.children('._lr_surface');
                    $surface.last().after(this.getNameGroup().getView().node);
                    //添加到反射面最近的一层
                    $surface.first().before(this.getView().node);
                    //名称放到最后
                    $$item.children().last().after(this.getNameGroup().getView().node);
                } else {
                    var $first = $(this.getView().node).closest('._lr_item').children().first();
                    $first.before(this.getNameGroup().getView().node);
                }
            }
            ,
            setVisibility: function (visible) {
                View.setVisibility(this.getView(), visible);
                this.getNameGroup().setVisibility(visible);
            }
            ,
            //锁定移动垂直时，长度状态变化
            setLinePedalChangeLock: function (lock) {
                this._linePedalChangeLock = lock;
            }
            ,
            getTwoLineVisible: function () {
                return !this._incidenceLine.isVisibilityHidden() && !this._reflectionLine.isVisibilityHidden();
            }
        })
        ;

    //include part api
    var draw = require('js/reflector/lightComplex/draw');
    var event = require('js/reflector/lightComplex/event');
    var proxyApi = require('js/reflector/lightComplex/proxyApi');
    var sector = require('js/reflector/lightComplex/sector');
    var namePos = require('js/reflector/lightComplex/namePos');
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
define('js/reflector/lightComplex/namePos', ['js/view/sector', 'js/utils/utils', 'js/utils/view', 'js/utils/graphmath', 'js/utils/svg', 'js/view/lightLine'], function (Sector, Utils, View, GraphMath, Svg, LightLine) {


    var NamePos = {
        _lastMinLine: null,
        resetLinePos: function () {
            this.initLineNamePos(this._incidenceLine);
            this.initLineNamePos(this._reflectionLine);
        },
        initLineNamePos: function (line) {
            //保留5位小数点，防止垂直时角度旋转过程中造成一点误差。使得反射角和法线角度不一致
            var normalAngle = parseFloat(this._normalLine.getRotateAngle().toFixed(5));
            var lineAngle = parseFloat(line.getRotateAngle().toFixed(5));
            var width = line.getWidth();
            var sectorAngle = this.getSectorAngle(Sector.Type.Incidence);
            var normalAbsAngle = Math.abs((normalAngle % 180));
            var linePercent =0;
            //这个地方先写死，适配220~410
            if (width <= 290) {
                linePercent = (290 - width) / 50;
            } else {
                linePercent = (290 - width) / 85;
            }

            var anglePercent = 1;
            if (normalAbsAngle > 90) {
                anglePercent = 1 - (normalAbsAngle - 90) / 90;
            } else {
                anglePercent = normalAbsAngle / 90;
            }

            //超过8°开始不进行移动
            var subAngle = 15 + 7 * anglePercent + linePercent * 4;
            if (sectorAngle <= subAngle) {
                if (lineAngle > normalAngle) {
                    lineAngle = normalAngle + subAngle;
                } else if (normalAngle === lineAngle) {
                    //this._lastMinLine ===
                    if (line.getLightType() == LightLine.Type.IncidenceLine) {
                        lineAngle = normalAngle - subAngle;
                    } else {
                        lineAngle = normalAngle + subAngle;
                    }
                }
                else {
                    //this._lastMinLine = line.getLightType();
                    lineAngle = normalAngle - subAngle;
                }
            }
            if (lineAngle) {
                line.makeNameViewAround(lineAngle);
            }
            //console.log('namePos', normalAbsAngle, subAngle);
        }
    };

    return NamePos;
});

/**
 * Created by ylf on 2016/8/22.
 */
define('js/reflector/lightComplex/proxyApi', ['js/view/sector', 'js/utils/utils', 'js/utils/view', 'js/view/LightLine'], function (Sector, Utils, View, LightLine) {

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
        getReflectionRotateAngle: function () {
            return this._reflectionLine.getRotateAngle();
        },
        setIncidenceLineWidth: function (width) {
            this._incidenceLine.setWidth(width);
        },
        setReflectionLineWidth: function (width) {
            this._reflectionLine.setWidth(width);
        },
        setIncidenceLineArrowPos: function (arrowPos) {
            this._incidenceLine.setArrowPos(arrowPos);
        },
        setReflectionLineArrowPos: function (arrowPos) {
            this._reflectionLine.setArrowPos(arrowPos);
        },
        setIncidenceLineCommonFill: function (common) {
            if (common) {
                this._incidenceLine.setCommonFill();
            } else {
                this._incidenceLine.restoreFill();
            }
        },
        setReflectionLineCommonFill: function (common) {
            if (common) {
                this._reflectionLine.setCommonFill();
            } else {
                this._reflectionLine.restoreFill();
            }
        },
        setIncidenceLineVisible: function (visible) {
            this._incidenceLine.setVisibility(visible);
        },
        setReflectionLineVisible: function (visible) {
            this._reflectionLine.setVisibility(visible);
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
        getReflectionLineXAngle: function () {
            return (360 - this._reflectionLine.getRotateAngle() % 360) % 180;
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
            var lineRotate = this._reflectionLine.getRotateAngle();
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
        getReflectionLineSphereAngle: function () {
            return getSphereAngle(this._reflectionLine.getRotateAngle());
        },
        getNormalLineSphereAngle: function () {
            return getSphereAngle(this._normalLine.getRotateAngle());
        },
        getLineXAngle: function (lineType) {
            if (lineType === LightLine.Type.IncidenceLine) {
                return this.getIncidenceLineXAngle();
            } else if (lineType === LightLine.Type.ReflectionLine) {
                return this.getReflectionLineXAngle();
            }
        },
        getLine0To360RotateAngle: function (lineType) {
            var line;
            if (lineType === LightLine.Type.IncidenceLine) {
                line = this._incidenceLine;
            } else if (lineType === LightLine.Type.ReflectionLine) {
                line = this._reflectionLine;
            }
            return get0T360Angle(line.getRotateAngle());
        },
        //获取线旋转的象限位置
        getLineQuad: function (lineType) {
            var line, angle;
            if (lineType === LightLine.Type.IncidenceLine) {
                line = this._incidenceLine;
            } else if (lineType === LightLine.Type.ReflectionLine) {
                line = this._reflectionLine;
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
                var reflectionRotate = this.getReflectionRotateAngle();
                if (reflectionRotate < normalRotate) {
                    angle = get0T360Angle(reflectionRotate) - this.getSectorAngle(Sector.Type.SurfaceOut);
                    if (angle < 0) {
                        angle = 360 + angle;
                    }
                } else {
                    angle = get0T360Angle(reflectionRotate) + this.getSectorAngle(Sector.Type.SurfaceOut);
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
            } else if (lineType === LightLine.Type.ReflectionLine) {
                this._reflectionLine.setVisibility(visible);
            }
        },
        setLineEnable: function (lineType, enable) {
            if (lineType === LightLine.Type.IncidenceLine) {
                this._incidenceLine.setLineEnable(enable);
            } else if (lineType === LightLine.Type.ReflectionLine) {
                this._reflectionLine.setLineEnable(enable);
            }
        }

    };

    return LightComplexProxyApi;
});
/**
 * Created by ylf on 2016/8/24.
 */
define('js/reflector/lightComplex/sector', ['js/view/sector', 'js/utils/utils', 'js/utils/view', 'js/view/NameGroup', 'js/view/LightLine'], function (Sector, Utils, View, NameGroup, LightLine) {

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
            this._sector[Sector.Type.Reflection] = this._reflectionSector = Sector.create(Sector.Type.Reflection, appendPosX, 0, configData.Sector.reflectionR, this._option.langData);
            this._sector[Sector.Type.SurfaceIn] = this._surfaceInSector = Sector.create(Sector.Type.SurfaceIn, appendPosX, 0, configData.Sector.surfaceR, this._option.langData);
            this._sector[Sector.Type.SurfaceOut] = this._surfaceOutSector = Sector.create(Sector.Type.SurfaceOut, appendPosX, 0, configData.Sector.surfaceR, this._option.langData);


            var sectorNameData = {};
            sectorNameData[Sector.Type.Incidence] = {cx: appendPosX, cy: 0, r: configData.Sector.reflectionR, letterR: configData.Sector.letterR, angleR: configData.Sector.angleR};
            sectorNameData[Sector.Type.Reflection] = {cx: appendPosX, cy: 0, r: configData.Sector.reflectionR, letterR: configData.Sector.letterR, angleR: configData.Sector.angleR};
            sectorNameData[Sector.Type.SurfaceIn] = {cx: appendPosX, cy: 0, r: configData.Sector.surfaceR, angleR: configData.Sector.surfaceR};
            sectorNameData[Sector.Type.SurfaceOut] = {cx: appendPosX, cy: 0, r: configData.Sector.surfaceR, angleR: configData.Sector.surfaceR};
            this._nameGroup = NameGroup.create(sectorNameData, this._option.langData, this._option, this._reflectorType, this._configData.NameAutoPos);
            this._nameGroup.setTranslate(this._configData.IncidencePosX, 0);
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
            this._surfaceInSector.rotate(angle[__getIndex(0, negative, 3)], angle[__getIndex(1, negative, 5)]);
            this._incidenceSector.rotate(angle[__getIndex(1, negative, 3)], angle[__getIndex(2, negative, 5)]);
            this._reflectionSector.rotate(angle[__getIndex(2, negative, 3)], angle[__getIndex(3, negative, 5)]);
            this._surfaceOutSector.rotate(angle[__getIndex(3, negative, 3)], angle[__getIndex(4, negative, 5)]);
            this._nameGroup.setNormalAngle(normalAngle);
            this._nameGroup.rotate(angle, negative);
        },
        initSectorVisibleState: function () {
            var configData = this._configData;
            this.setAngleVisibleByType(Sector.Type.SurfaceIn, configData.Sector.sectorInVisible);
            this.setAngleVisibleByType(Sector.Type.SurfaceOut, configData.Sector.sectorOutVisible);
            this.setAngleVisibleByType(Sector.Type.Incidence, configData.Sector.incidenceVisible);
            this.setAngleVisibleByType(Sector.Type.Reflection, configData.Sector.reflectionVisible);

            if (this._configData.Sector.hasDraw) {
                this._nameGroup.setHasDrawStatus(this._configData.Sector.hasDraw)
            }
            this.syncSectorVisibilityByName();
        },
        getSectorHasDraw: function (type) {
            if (typeof type !== typeof  undefined) {
                return this._nameGroup.getHasDrawStatusByType(type);
            }
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
            that.setAngleVisibleByType(Sector.Type.Reflection, true);
            that.syncSectorVisibilityByName();
            that.setAngleVisibleByType(Sector.Type.Incidence, false);
            that.setAngleVisibleByType(Sector.Type.Reflection, false);
            that.setSectorInsideDrawStatus(true, Sector.Type.Incidence);
            that.setSectorInsideDrawStatus(true, Sector.Type.Reflection);
            $(that._reflectionSector.getView().node).fadeIn(300).fadeOut(300).fadeIn(300, function () {
                that.syncSectorVisibilityByName();
                $(that._reflectionSector.getView().node).css('display', '');
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
            } else if (sectorType == Sector.Type.Reflection) {
                startXAngle = this.getNormalLineXAngle();
                endXAngle = this.getReflectionLineXAngle();
                startLineType = LightLine.Type.NormalLine;
                endLineType = LightLine.Type.ReflectionLine;
            } else if (sectorType == Sector.Type.SurfaceIn) {
                startXAngle = this.getIncidenceLineXAngle();
                endXAngle = this.getSectorInLineXAngle();
                startLineType = LightLine.Type.IncidenceLine;
                endLineType = LightLine.Type.SurfaceIn;
            } else if (sectorType == Sector.Type.SurfaceOut) {
                startXAngle = this.getReflectionLineXAngle();
                endXAngle = this.getSectorOutLineXAngle();
                startLineType = LightLine.Type.ReflectionLine;
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
                } else if (sectorType == Sector.Type.Reflection) {
                    sectorR = that._configData.Sector.reflectionR;
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
        getSectorEnable: function () {
            return this._sectorEnable;
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
define('js/main', ['js/reflector/reflectorMain', 'js/utils/logger'], function (ReflectorMain, Logger) {

    window.LightReflector = {
        create: function (option) {
            return ReflectorMain.create(option);
        },
        setLogLevel: function (level) {
            Logger.setLevel(level);
        }
    }


});
//主入口初始化
require('js/main');
})(window,document,jQuery)