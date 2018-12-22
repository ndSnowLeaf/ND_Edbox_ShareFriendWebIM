//version=1.0
(function(window,document,$){
/*!
 *  修复内存泄漏问题，修改为使用普通数组代替$([])  modify by ylf 2015/11/20
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery resize event
//
// *Version: 1.1, Last updated: 3/14/2010*
//
// Project Home - http://benalman.com/projects/jquery-resize-plugin/
// GitHub       - http://github.com/cowboy/jquery-resize/
// Source       - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.js
// (Minified)   - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.min.js (1.0kb)
//
// About: License
//
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
//
// About: Examples
//
// This working example, complete with fully commented code, illustrates a few
// ways in which this plugin can be used.
//
// resize event - http://benalman.com/code/projects/jquery-resize/examples/resize/
//
// About: Support and Testing
//
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
//
// jQuery Versions - 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-resize/unit/
//
// About: Release History
//
// 1.1 - (3/14/2010) Fixed a minor bug that was causing the event to trigger
//       immediately after bind in some circumstances. Also changed $.fn.data
//       to $.data to improve performance.
// 1.0 - (2/10/2010) Initial release

(function ($, window, undefined) {
    '$:nomunge'; // Used by YUI compressor.

    // A jQuery object containing all non-window elements to which the resize
    // event is bound.
    var elems = [],

    // Extend $.resize if it already exists, otherwise create it.
        jq_resize = $.resize = $.extend($.resize, {}),

        timeout_id,
    // Reused strings.
        str_setTimeout = 'setTimeout',
        str_resize = 'resize',
        str_data = str_resize + '-special-event',
        str_delay = 'delay',
        str_resize_key = 'data-resize',
        str_throttle = 'throttleWindow',
        time_count = 0;

    // Property: jQuery.resize.delay
    //
    // The numeric interval (in milliseconds) at which the resize event polling
    // loop executes. Defaults to 250.

    jq_resize[str_delay] = 250;

    // Property: jQuery.resize.throttleWindow
    //
    // Throttle the native window object resize event to fire no more than once
    // every <jQuery.resize.delay> milliseconds. Defaults to true.
    //
    // Because the window object has its own resize event, it doesn't need to be
    // provided by this plugin, and its execution can be left entirely up to the
    // browser. However, since certain browsers fire the resize event continuously
    // while others do not, enabling this will throttle the window resize event,
    // making event behavior consistent across all elements in all browsers.
    //
    // While setting this property to false will disable window object resize
    // event throttling, please note that this property must be changed before any
    // window object resize event callbacks are bound.

    jq_resize[str_throttle] = true;

    // Event: resize event
    //
    // Fired when an element's width or height changes. Because browsers only
    // provide this event for the window element, for other elements a polling
    // loop is initialized, running every <jQuery.resize.delay> milliseconds
    // to see if elements' dimensions have changed. You may bind with either
    // .resize( fn ) or .bind( "resize", fn ), and unbind with .unbind( "resize" ).
    //
    // Usage:
    //
    // > jQuery('selector').bind( 'resize', function(e) {
    // >   // element's width or height has changed!
    // >   ...
    // > });
    //
    // Additional Notes:
    //
    // * The polling loop is not created until at least one callback is actually
    //   bound to the 'resize' event, and this single polling loop is shared
    //   across all elements.
    //
    // Double firing issue in jQuery 1.3.2:
    //
    // While this plugin works in jQuery 1.3.2, if an element's event callbacks
    // are manually triggered via .trigger( 'resize' ) or .resize() those
    // callbacks may double-fire, due to limitations in the jQuery 1.3.2 special
    // events system. This is not an issue when using jQuery 1.4+.
    //
    // > // While this works in jQuery 1.4+
    // > $(elem).css({ width: new_w, height: new_h }).resize();
    // >
    // > // In jQuery 1.3.2, you need to do this:
    // > var elem = $(elem);
    // > elem.css({ width: new_w, height: new_h });
    // > elem.data( 'resize-special-event', { width: elem.width(), height: elem.height() } );
    // > elem.resize();
    var getRandomId = function (name) {
        return name + (Math.random() * 10 + new Date().getMilliseconds()).toString().replace(".", "")
    };

    var removeItem = function (arry, item) {
        for (var i = 0; i < arry.length; i++) {
            var temp = arry[i];
            if (!isNaN(item)) {
                temp = i;
            }
            if (temp[0] == item[0]) {
                for (var j = i; j < arry.length; j++) {
                    arry[j] = arry[j + 1];
                }
                arry.length = arry.length - 1;
            }
        }
    }
    $.event.special[str_resize] = {

        // Called only when the first 'resize' event callback is bound per element.
        setup: function () {
            // Since window has its own native 'resize' event, return false so that
            // jQuery will bind the event using DOM methods. Since only 'window'
            // objects have a .setTimeout method, this should be a sufficient test.
            // Unless, of course, we're throttling the 'resize' event for window.
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var elem = $(this);
            elem.attr(str_resize_key, getRandomId(str_resize_key));
            // Add this element to the list of internal elements to monitor.
            elems.push(elem);

            // Initialize data store on the element.
            elem.data(str_data, {w: elem.width(), h: elem.height()});

            // If this is the first element added, start the polling loop.
            if (elems.length === 1) {
                loopy();
            }
        },

        // Called only when the last 'resize' event callback is unbound per element.
        teardown: function () {
            // Since window has its own native 'resize' event, return false so that
            // jQuery will unbind the event using DOM methods. Since only 'window'
            // objects have a .setTimeout method, this should be a sufficient test.
            // Unless, of course, we're throttling the 'resize' event for window.
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }


            var elem = $(this);

            // Remove this element from the list of internal elements to monitor.
            removeItem(elems, elem);
            // Remove any data stored on the element.
            elem.removeData(str_data);

            // If this is the last element removed, stop the polling loop.
            if (!elems.length) {
                clearTimeout(timeout_id);
            }
        },

        // Called every time a 'resize' event callback is bound per element (new in
        // jQuery 1.4).
        add: function (handleObj) {
            // Since window has its own native 'resize' event, return false so that
            // jQuery doesn't modify the event object. Unless, of course, we're
            // throttling the 'resize' event for window.
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var old_handler;

            // The new_handler function is executed every time the event is triggered.
            // This is used to update the internal element data store with the width
            // and height when the event is triggered manually, to avoid double-firing
            // of the event callback. See the "Double firing issue in jQuery 1.3.2"
            // comments above for more information.

            function new_handler(e, w, h) {
                var elem = $(this),
                    data = elem.data(str_data);

                // If called from the polling loop, w and h will be passed in as
                // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
                // those values will need to be computed.
                if (data) {
                    data.w = w !== undefined ? w : elem.width();
                    data.h = h !== undefined ? h : elem.height();
                    old_handler.apply(this, arguments);
                }
            };

            // This may seem a little complicated, but it normalizes the special event
            // .add method between jQuery 1.4/1.4.1 and 1.4.2+
            if ($.isFunction(handleObj)) {
                // 1.4, 1.4.1
                old_handler = handleObj;
                return new_handler;
            } else {
                // 1.4.2+
                old_handler = handleObj.handler;
                handleObj.handler = new_handler;
            }
        }

    };

    function loopy() {
        // Start the polling loop, asynchronously.
        timeout_id = window[str_setTimeout](function () {
            time_count++;
            // Iterate over all elements to which the 'resize' event is bound.
            elems.forEach(function (elem) {
                var width = elem.width(),
                    height = elem.height(),
                    data = elem.data(str_data);

                // If element size has changed since the last time, update the element
                // data store and trigger the 'resize' event.
                if (width !== data.w || height !== data.h) {
                    elem.trigger(str_resize, [data.w = width, data.h = height]);
                }

                if (time_count % 50 === 0) {
                    if (elem.get(0) !== window && $('[' + str_resize_key + '="' + elem.attr(str_resize_key) + '"]').length === 0) {
                        removeItem(elems, elem);
                        elem.removeData(str_data);
                        elem.unbind(str_resize);
                    }
                }

            });
            if (!elems.length) {
                clearTimeout(timeout_id);
            } else {
                // Loop.
                loopy();
            }

        }, jq_resize[str_delay]);


    };


})(jQuery, this);
/**
 * Created by ylf on 2016/5/20.
 */
(function ($) {

    $.support.touch = 'ontouchend' in document;
    $.support.mobile = navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i) ? true : false;
    var vEventHandler = {};
    if ($.support.touch && $.support.mobile) {
        //拥有触屏事件
        vEventHandler.getEventX = function (event) {
            return event.originalEvent.changedTouches[0].clientX;
        };
        vEventHandler.getEventY = function (event) {
            return event.originalEvent.changedTouches[0].clientY;
        };
    } else {
        //没有触屏幕事件
        vEventHandler.getEventX = function (event) {
            return event.clientX;
        };
        vEventHandler.getEventY = function (event) {
            return event.clientY;
        };
    }
    //点击事件
    $.event.special.mDblclick = {
        setup: function () {
            var $that = $(this);
            if ($.support.touch && $.support.mobile) {
                var _start = 0;
                var _end = 0;
                var _startPos = {};
                var _endPos = {};
                var _clickTrigger = false;
                $that.bind('touchstart', function (event) {
                    if (event.which !== 0 || event.which !== 1) {
                        _start = new Date().getTime();
                        _startPos.x = vEventHandler.getEventX(event);
                        _startPos.y = vEventHandler.getEventY(event);
                        if (_clickTrigger) {
                            var holdTime = Math.abs(_start - _end);
                            var dx = Math.abs(_endPos.x - _startPos.x);
                            var dy = Math.abs(_endPos.y - _startPos.y);
                            //第一次点击和第二次点击可以有30px便宜
                            if (holdTime >= 400 || dx >= 30 || dy >= 30) {
                                _clickTrigger = false;
                            }
                        }
                    }
                });
                $that.bind('touchend touchcancel', function (event) {
                    if (event.which !== 0 || event.which !== 1) {
                        _end = new Date().getTime();
                        _endPos.x = vEventHandler.getEventX(event);
                        _endPos.y = vEventHandler.getEventY(event);
                        var holdTime = _end - _start;
                        var dx = Math.abs(_endPos.x - _startPos.x);
                        var dy = Math.abs(_endPos.y - _startPos.y);
                        if (holdTime <= 500 && dx < 7 && dy < 7) {
                            if (!_clickTrigger) {
                                _clickTrigger = true;
                            } else {
                                //触发tap事件
                                event = $.event.fix(event);
                                event.type = 'mDblclick';
                                event.tapEventSource = 'touchclick';
                                event.tapFireTouch = true;
                                $that.triggerHandler(event);
                            }
                        } else {
                            _clickTrigger = false;
                        }
                    }
                });
            } else {
                $that.bind('dblclick', function (event) {
                    //触发tap事件
                    event = $.event.fix(event);
                    event.type = 'mDblclick';
                    event.tapEventSource = 'mouseclick';
                    event.tapFireTouch = false;
                    $that.triggerHandler(event);
                });
            }
        },
        teardown: function () {
            var $that = $(this);
            $that.unbind('touchend').unbind('touchcancel').unbind('touchstart');
        }
    };

})(jQuery);
/**
 * Created by ylf on 2016/4/8.
 */

(function ($) {


    var utils = {};

    //默认参数
    var PinchIntensity = 0.8;

    utils.getDistance = function (pos1, pos2) {
        var x = pos2.x - pos1.x,
            y = pos2.y - pos1.y;
        return Math.sqrt((x * x) + (y * y));
    };

    utils.getFingers = function (ev) {

        return ev.touches ? ev.touches.length : 1;
    };

    utils.calScale = function (pstart, pmove, intensity) {
        if (pstart.length >= 2 && pmove.length >= 2) {
            var disStart = this.getDistance(pstart[1], pstart[0]);
            var disEnd = this.getDistance(pmove[1], pmove[0]);
            var scale = (disEnd - disStart) * intensity;
            return (disEnd - scale) / disStart;
        }
        return 1;
    };

    utils.isTouchEnd = function (ev) {
        return (ev.type === 'touchend' || ev.type === 'touchcancel');
    };

    utils.isTouchMove = function (ev) {
        return (ev.type === 'touchmove');
    };


    utils.getPosOfEvent = function (ev) {
        var posi = [];
        var src = null;

        for (var t = 0, len = ev.touches.length; t < len; t++) {
            src = ev.touches[t];
            posi.push({
                x: src.pageX,
                y: src.pageY
            });
        }
        return posi;
    };


    $.event.special.mPinch = {
        setup: function () {
            var $that = $(this);

            var _intensity = PinchIntensity;
            //优先去属性里配置的强度
            var intensityAttr = $that.attr('data-pinch-intensity');
            if (intensityAttr) {
                intensityAttr = parseFloat(intensityAttr);
                if (intensityAttr > 0 && intensityAttr <= 1) {
                    _intensity = intensityAttr;
                }
            }
            var _touchStart = false;
            var startPinch = false;

            var pos = {
                start: null,
                move: null,
                end: null
            };

            var reset = function () {
                _touchStart = startPinch = false;
                pos = {};
            };

            var pinch = function (ev) {
                if (!_touchStart) return;
                if (utils.getFingers(ev) < 2) {
                    if (!utils.isTouchEnd(ev)) return;
                }
                var scale = utils.calScale(pos.start, pos.move, _intensity);
                var eventObj = {
                    type: 'mPinch',
                    originEvent: ev,
                    scale: scale,
                    fingersCount: utils.getFingers(ev)
                };

                if (!startPinch) {
                    startPinch = true;
                    eventObj.fingerStatus = "start";
                    $that.triggerHandler(eventObj);
                } else if (utils.isTouchMove(ev)) {
                    eventObj.fingerStatus = "move";
                    $that.triggerHandler(eventObj);
                } else if (utils.isTouchEnd(ev)) {
                    eventObj.fingerStatus = "end";
                    $that.triggerHandler(eventObj);
                    reset();
                }
                return ev;
            };


            $that.bind('touchstart', function (ev) {
                _touchStart = true;
                if (!pos.start || pos.start.length < 2) {
                    pos.start = utils.getPosOfEvent(ev.originalEvent);
                }
            });

            $that.bind('touchmove', function (ev) {
                if (!_touchStart || !pos.start) return;
                pos.move = utils.getPosOfEvent(ev.originalEvent);
                if (utils.getFingers(ev.originalEvent) >= 2) {
                    pinch(ev.originalEvent);
                }
            });

            $that.bind('touchend touchcancel', function (ev) {
                if (!_touchStart) return;
                if (startPinch) {
                    pinch(ev.originalEvent);
                }
                //重置
                reset();
                if (ev.touches && ev.touches.length === 1) {
                    _touchStart = true;
                }

            });

        },
        teardown: function () {
            var $that = $(this);
            $that.unbind('touchstart').unbind('touchmove').unbind('touchend').unbind('touchcancel');
        }
    };
    $.fn.mPinch = function (callback) {
        return this.bind('mPinch', callback);
    };

    $.fn.mPinchSetIntensity = function (intensity) {
        PinchIntensity = intensity;
    }
})(jQuery);
(function ($) {

    $.support.touch = 'ontouchend' in document;
    $.support.mobile = navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i) ? true : false;
    var vEventHandler = {};
    if ($.support.touch && $.support.mobile) {
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
    $.support.fixed = function () {
        var bodys = document.getElementsByTagName("body");
        if (bodys && bodys.length > 0) {
            bodys[0].addEventListener("touchstart", function () {
            });
        }
        $.support.fixed = true;
    };
    $.support.fixed();
    //点击事件
    $.event.special.mTap = {
        setup: function () {
            var $that = $(this);
            if ($.support.touch && $.support.mobile) {
                if ($.support.fixed !== true) {
                    $.support.fixed();
                }
                var vMouseDown = vEventHandler.mouseDown;
                var vMouseUp = vEventHandler.mouseUp;
                var _start = 0;
                var _startX = 0;
                var _startY = 0;
                var _target = null;
                $that.bind(vMouseDown, function (event) {
                    if (event.which !== 0 || event.which !== 1) {
                        _start = new Date().getTime();
                        _startX = vEventHandler.getEventX(event);
                        _startY = vEventHandler.getEventY(event);
                        _target = event.originalEvent.target;
                    }
                });
                $that.bind(vMouseUp, function (event) {

                    if (event.which !== 0 || event.which !== 1) {
                        var end = new Date().getTime();
                        var endX = vEventHandler.getEventX(event);
                        var endY = vEventHandler.getEventY(event);
                        var upTarget = event.originalEvent.target;
                        var holdTime = end - _start;
                        var dx = Math.abs(endX - _startX);
                        var dy = Math.abs(endY - _startY);
                        if (holdTime <= 550 && dx < 8 && dy < 8 && upTarget === _target) {
                            //触发tap事件
                            event = $.event.fix(event);
                            event.type = 'mTap';
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
                    event.type = 'mTap';
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

})(jQuery);
(function ($) {

    var getEventPos = function (e) {
        switch (e.type) {
            case 'touchstart':
            case 'touchend':
            case 'touchmove':
            case 'touchcancel':
                return {
                    x: e.originalEvent.changedTouches[0].clientX,
                    y: e.originalEvent.changedTouches[0].clientY
                };
                break;
        }
        return {
            x: e.clientX,
            y: e.clientY
        }
    };
    //点击事件
    $.event.special.mTouchLong= {
        setup: function () {
            var $that = $(this);
            var _tid = 0;
            var _start = 0;
            var _startX = 0;
            var _startY = 0;
            var _touchTrigger = false;
            $that.bind('touchstart', function (event) {
                if (event.which !== 0 || event.which !== 1) {
                    if (event.type === 'touchstart') {
                        _touchTrigger = true;
                    }
                    if (event.originalEvent.touches.length > 1) {
                        clearTimeout(_tid);
                        return;
                    }
                    _start = new Date().getTime();
                    var pos = getEventPos(event);
                    _startX = pos.x;
                    _startY = pos.y;
                    clearTimeout(_tid);
                    _tid = setTimeout(function () {
                        event.type = 'mTouchLong';
                        $that.triggerHandler(event);
                    }, 1200);
                }
            });
            $that.bind('touchend touchmove touchcancel', function (event) {
                var pos = getEventPos(event);
                var endX = pos.x;
                var endY = pos.y;
                //var holdTime = end - _start;
                var dx = Math.abs(endX - _startX);
                var dy = Math.abs(endY - _startY);
                if (dx > 2 || dy > 2) {
                    clearTimeout(_tid);
                    _touchTrigger = false;
                }
                if (event.type === 'touchend' || event.type === 'touchcancel') {
                    clearTimeout(_tid);
                    _touchTrigger = false;
                }
            });

        },
        teardown: function () {
            var $that = $(this);
            $that.unbind('touchstart  touchend touchmove touchcancel');
        }
    };

})(jQuery);
/*!
 Non-Sucking Autogrow 1.1.1
 license: MIT
 author: Roman Pushkin
 https://github.com/ro31337/jquery.ns-autogrow
 modify by ylf 2016/6/29
 */
(function () {
    var getVerticalScrollbarWidth;

    (function ($, window) {
        return $.fn.autogrow = function (options) {
            if (options == null) {
                options = {};
            }
            if (options.horizontal == null) {
                options.horizontal = true;
            }
            if (options.vertical == null) {
                options.vertical = true;
            }
            if (options.debugx == null) {
                options.debugx = -10000;
            }
            if (options.debugy == null) {
                options.debugy = -10000;
            }
            if (!options.addWidth) {
                options.addWidth = 0;
            }
            if (options.debugcolor == null) {
                options.debugcolor = 'yellow';
            }
            if (options.flickering == null) {
                options.flickering = true;
            }
            if (options.postGrowCallback == null) {
                options.postGrowCallback = function () {
                };
            }
            if (options.verticalScrollbarWidth == null) {
                options.verticalScrollbarWidth = getVerticalScrollbarWidth();
            }
            if (options.horizontal === false && options.vertical === false) {
                return;
            }
            options.class = options.class || 'autogrow-shadow';
            return this.filter('textarea,input').each(function () {
                var $e, $shadow, heightPadding, minHeight, minWidth, update, maxWidth, cssMaxWidth;
                $e = $(this);
                if ($e.data('autogrow-enabled')) {
                    return;
                }
                minHeight = parseInt($e.attr('data-minHeight')) || $e.height();
                minWidth = parseInt($e.attr('data-minWidth')) || $e.width();
                heightPadding = $e.css('lineHeight') * 1 || 0;
                $e.hasVerticalScrollBar = function () {
                    return $e[0].clientHeight < $e[0].scrollHeight;
                };
                cssMaxWidth = maxWidth = parseInt($e.css('max-width'));
                $shadow = $('<div class="' + options.class + '"></div>').css({
                    position: 'absolute',
                    display: 'inline-block',
                    'background-color': options.debugcolor,
                    top: options.debugy,
                    left: options.debugx,
                    'max-width': $e.css('max-width'),
                    'padding': $e.css('padding'),
                    fontSize: $e.css('fontSize'),
                    fontFamily: $e.css('fontFamily'),
                    fontWeight: $e.css('fontWeight'),
                    lineHeight: $e.css('lineHeight'),
                    resize: 'none',
                    'word-wrap': 'break-word',
                    'word-break': 'break-all',
                    'box-sizing': 'content-box'
                }).appendTo(options.body || document.body);
                if (options.horizontal === false) {
                    $shadow.css({
                        'width': $e.width()
                    });
                }
                update = (function (_this) {
                    return function (event) {
                        var height, val, width, scale;
                        val = _this.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n /g, '<br/>&nbsp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\n$/, '<br/>&nbsp;').replace(/\n/g, '<br/>').replace(/ {2,}/g, function (space) {
                            return Array(space.length - 1).join('&nbsp;') + ' ';
                        });

                        $shadow.html(val);
                        maxWidth = parseInt($e.attr('data-maxwidth'))
                        scale = parseFloat($e.attr('data-scale'))
                        $shadow.css('transform', 'scale(' + scale + ')');
                        if (maxWidth) {
                            $shadow.css('maxWidth', maxWidth);
                        } else {
                            $shadow.css('maxWidth', cssMaxWidth);
                        }
                        if (options.vertical === true) {
                            minHeight = parseInt($e.attr('data-minheight')) || $e.height();
                            height = Math.max($shadow.height() + heightPadding, minHeight);
                            $e.height(height);
                        }
                        if (options.horizontal === true) {
                            minWidth = parseInt($e.attr('data-minwidth')) || $e.width();
                            width = Math.max($shadow.outerWidth(), minWidth);
                            width += options.addWidth;
                            if (maxWidth > 0 && maxWidth < width) {
                                $e.width(maxWidth);
                            } else {
                                $e.width(width);
                            }
                        }

                        return options.postGrowCallback($e);
                    };
                })(this);
                $e.on('input', update);
                $(window).resize(update);
                return update();
            });
        };
    })(window.jQuery, window);

    getVerticalScrollbarWidth = function () {
        var inner, outer, w1, w2;
        inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";
        outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);
        document.body.appendChild(outer);
        w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        w2 = inner.offsetWidth;
        if (w1 === w2) {
            w2 = outer.clientWidth;
        }
        document.body.removeChild(outer);
        return w1 - w2;
    };

}).call(this);

var __M = {};

(function (window, $, kity, __M) {
    __M.View = {};


    var DefaultLang = {
        'mdnode_centralname': '中心主题',
        'mdnode_branchname': '分支主题',
        'mdnode_addchildtip': '添加下级主题',
        'mdmenu_edit': '编辑内容',
        'mdmenu_visible': '显示内容',
        'mdmenu_invisible': '隐藏内容',
        'mdmenu_copy': '复制',
        'mdmenu_cut': '剪切',
        'mdmenu_paste': '粘贴',
        'mdmenu_delete': '删除'
    };


    var mindConfig = {};

    //全局颜色配置
    mindConfig.palette = new kity.Palette();
    mindConfig.palette.add('transparent', kity.Color.createRGBA(0, 0, 0, 0));
    mindConfig.palette.add('node_stroke_normal', kity.Color.createRGB(115, 161, 191));
    mindConfig.palette.add('node_stroke_active', kity.Color.createRGB(57, 80, 96));
    mindConfig.palette.add('backgroud_color', kity.Color.parse('#C0D3E2'));
    mindConfig.palette.add('line_color', kity.Color.parse('#666564'));

    //节点样式配置
    mindConfig.nodeStyle = {
        width: 110,//文本宽
        height: 42,//文本高
        y: -11,//文本节点初始y
        paddingX: 15,//文本相对边框padding值
        paddingY: 7,//文本相对边框padding值
        strokeStyle: {'stroke-width': 2, 'stroke': kity.Color.parse('#9CB2C1'), opacity: 1, 'cursor': 'pointer'},//常态
        activeStrokeStyle: {'stroke-width': 2.5, 'stroke': kity.Color.parse('#F61D1B'), opacity: 1, 'cursor': 'pointer'},//激活状态

        moveCoverStyle: {'stroke-width': 5.0, 'stroke': kity.Color.parse('#9CB2C1')},///覆盖高亮显示
        moveStyle: {opacity: 0.5, 'stroke': kity.Color.parse('#9CB2C1')},//移动样式
        placeholderStyle: {'fill': '#74A3BE', 'stroke': kity.Color.parse('#74A3BE')},//占位符样式
        fill: kity.Color.parse('#FFFFFF'),//填充
        requireCompletedFill: kity.Color.parse('#F9EED7'),
        radius: 23,
        //defaultText: '中心主题',
        //level2DefaultText: '分支主题',
        textStyle: {'font-size': 20, 'dominant-baseline': 'text-before-edge', 'cursor': 'pointer'},//文本字体、大小'text-rendering': 'inherit',
        groupColor: 'black',//文本颜色
        groupTransform: 'translate( 0 -2.4 )'//文本初始便宜距离
    };

    mindConfig.lineStyle = {
        strokeStyle: {'stroke-width': 2, 'stroke': mindConfig.palette.get('line_color')}
    };

    mindConfig.triangleStyle = {
        lineWidth: 110,
        lineStyle: mindConfig.lineStyle.strokeStyle,
        circleStrokeStyle: mindConfig.lineStyle.strokeStyle,
        clickCircleStrokeStyle: {'stroke-width': 2, 'stroke': mindConfig.palette.get('transparent')},
        clickCircleFill: mindConfig.palette.get('transparent'),
        circleFill: mindConfig.palette.get('node_stroke_normal'),
        circleWidth: 11,
        triangleWidth: 6.5,
        triangleHeight: 12.5,
        triangleStroke: mindConfig.palette.get('line_color'),
        triangleFill: mindConfig.palette.get('line_color'),
        style: {'cursor': 'pointer'}
    };

    mindConfig.plusStyle = {
        circleFill: kity.Color.parse('#4A5157'),//圆圈填充
        circleStroke: kity.Color.parse('#4A5157'),//圆圈边框
        plusSroke: kity.Color.parse('#FBFBFB'),//加号边框
        circleWidth: 12,//圆圈半径
        plusWidth: 5.5,//加号半径
        plusStokeWidth: 1.5,//加号线条宽度
        clickFill: mindConfig.palette.get('transparent'),
        clickStyle: {'stroke-width': 2, 'stroke': mindConfig.palette.get('transparent')}
    };

    mindConfig.EVENT_KEY = {
        EDITTEXT_CHANGE_NODE: 'edittext_change_node',//文本重新定位
        EDITTEXT_SHOW: 'edittext_show',//显示文本
        NODE_DRAWING: 'node_drawing',  //节点绘制事件
        NODE_TRIANGLE_CLICK: 'node_triangle_click',//左右两侧三角按钮点击事件
        NODE_TEXT_CHANGE: 'node_text_change', //文本框内容变化监听
        NODE_CLICK: 'node_click',
        NODE_DOWN: 'node_down',  //按钮按下触发
        NODE_UP: 'node_up',  //按钮结束触发
        NODE_BEFORE_MOVE: 'node_before_move',
        NODE_MOVE: 'node_move', //节点移动事件
        NODE_AFTER_MOVE: 'node_after_move',
        NODE_COVER: 'node_cover',//节点移动是覆盖事件
        NODE_DBLCLICK: 'node_dblclick', //节点双击事件
        NODE_BLUR: 'node_blur', //全局的失去焦点
        NODE_RIGHT_CLICK: 'node_right_click',//鼠标右键点击事件
        NODE_EXPAND: 'node_expand',//鼠标右键点击事件
        NODE_DELETE: 'node_delete',//节点删除事件
        NODE_SHOW_CONTENT: 'node_show_content',//显示隐藏的文本内容
        MENU_CLICK: 'menu_click',//菜单点击事件
        MENU_SHOW: 'menu_show',//菜单点击事件
        REMARK_SHOW: 'remark_show',//显示备注信息
        DOM_HIDE: 'dom_hide',//dom隐藏事件NODE_SHOW_CONTENT
        NODE_CENTER: 'node_center',////菜单点击事件
        NODE_RESTORE: 'node_restore'//节点移动是覆盖事件
    };

    mindConfig.DOM_EVENT_TYPE = {
        TOUCH: 'touch',
        MOUSE: 'mouse'
    };

    mindConfig.MENU_TYPE_KEY = {
        EDIT: 'edit',
        VISIBLE: 'visible',
        COPY: 'copy',
        CUT: 'cut',
        PASTE: 'paste',
        DELETE: 'delete'
    };

    mindConfig.DRAW_TYPE_KEY = {
        MOVE: 'move',//移动
        ACTIVE: 'active',//获取焦点
        ACTIVE_EDIT_DISABLE: 'active_edit_disable',//获取焦点,不可编辑状态下
        REVERT: 'revert',//失去焦点
        TEXT: 'text',//文本发生变化
        INIT: 'init'//初始化节点控件
    };
    mindConfig.CLASS_NAME = {
        MIND_BODY_CLASS: 'mindMap_body mindMap_guardian',
        MIND_BODY_PPT_SHELL_CLASS: 'mindMap_ppt_shell',
        MIND_PLACEHOLDER_CLASS: 'mindMap_placeholder'
    };

    mindConfig.CHANGE_REASON = {
        MOVE: 'move',//节点移动
        MINDER_MOVE: 'minder_move',//整体移动
        MINDER_SCALE: 'minder_scale',//整体移动
        BRO_RELATION: 'bro_relation',//兄弟节点关系变化
        PARENT_CHANGE: 'parent_change',//父节点关系变化
        DELETE: 'delete',//删除节点
        TEXT_CONTENT: 'text_content',//文本内容变化
        TEXT_VISIBLE: 'text_visible',
        EXPAND: 'expand',//展开收起
        ORIENTATION_CHANGE: 'orientation_change',//节点左右方向变化
        ADD: 'add',//添加节点
        RENDER: 'render',//初始化render
        UNDO_REDO: 'undo_redo',//撤销还原
        CLEAR: 'clear'//清楚内容
    };

    __M.Config = mindConfig;
    __M.Config.DefaultLang = DefaultLang;
    // __M.Config.Lang = {};//在main里初始化

}(window, jQuery, kity, __M));
/**
 * Created by ylf on 2015/12/13.
 */

(function (__M) {
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

    __M.Logger = _logger;
})(__M);
/**
 * Created by ylf on 2016/3/30.
 */
(function (window, $, __M) {
    __M.Class = {};

    var _logger = __M.Logger;

    var include = function (baseCls, cls) {
        for (var key in cls) {
            if (typeof baseCls[key] !== "undefined" && key !== '__base') {
                _logger.error('有重复的成员');
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
                nodeEvent: true,//是否绑定在节点上
                key: '',//key
                fucs: '',//方法名
                params: []//参数说明
            }
     */

    var Base = {
        ___eventDispatch: null,
        ___nodeId: '',
        ___eventsInfo: [{
            nodeEvent: true,//是否绑定在节点上
            key: '',//key
            fucs: '',//方法名
            params: []//参数说明
        }],
        __base: function (eventDispatch, eventsInfo, nodeId) {
            this.___eventsInfo = null;
            this.___eventDispatch = null;

            var args = Array.prototype.slice.apply(arguments, [0]);
            if (args.length > 3) {
                throw  new Error('参数长度有误');
            }
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (arg instanceof Array) {
                    this.___eventsInfo = arg;
                } else if (typeof  arg === 'string') {
                    this.___nodeId = arg;
                } else if (typeof  arg === 'object') {
                    this.___eventDispatch = eventDispatch;
                }
            }

            this.___eventDispatch = this.___eventDispatch || {};
            this.___eventsInfo = this.___eventsInfo || [];
            this.___nodeId = this.___nodeId || '';
            this.__addEvent();
        },
        __include: function (cls) {
            return include(this, cls);
        },
        __proxyAll: function (fucs) {
            for (var i = 0; i < fucs.length; i++) {
                this[fucs[i]] = proxy(this, this[fucs[i]]);
            }
        },
        __addEvent: function () {
            var eventsInfo = this.___eventsInfo;
            var nodeId = this.___nodeId;
            for (var i = 0; i < eventsInfo.length; i++) {
                var event = eventsInfo[i];
                var type = event.nodeEvent ? nodeId + '_' + event.key : event.key;
                this.___eventDispatch.add(type, this[event.fucs], this);
            }
        },
        __triggerEvent: function (type) {
            var arg = Array.prototype.slice.apply(arguments, [0]);
            this.___eventDispatch.trigger.apply(this.___eventDispatch, arg);
        },
        __triggerNodeEvent: function (type) {
            var arg = Array.prototype.slice.apply(arguments, [0]);
            var type = arg.shift();
            arg.unshift(this.___nodeId + '_' + type);
            this.___eventDispatch.trigger.apply(this.___eventDispatch, arg);
        },
        __triggerNodeEventByNodeId: function (type, id) {
            var arg = Array.prototype.slice.apply(arguments, [0]);
            var type = arg.shift();
            var id = arg.shift();
            arg.unshift(id + '_' + type);
            this.___eventDispatch.trigger.apply(this.___eventDispatch, arg);
        },
        __setNodeId: function (nodeId) {
            this.___nodeId = nodeId;
        },
        __getNodeId: function () {
            return this.___nodeId;
        },
        __getEventDispatch: function () {
            return this.___eventDispatch;
        },
        __destroy: function () {
            var eventsInfo = this.___eventsInfo;
            var nodeId = this.___nodeId;
            for (var i = 0; i < eventsInfo.length; i++) {
                var event = eventsInfo[i];
                var type = event.nodeEvent ? nodeId + '_' + event.key : event.key;
                this.___eventDispatch.remove(type, this[event.fucs], this);
            }
        }
    };


    var BaseView = {
        ___viewNode: null,//当前视图节点
        __base: function (eventDispatch, eventsInfo, nodeId, node) {
            var args = Array.prototype.slice.apply(arguments, [0]);
            for (var i = 0; i < args.length; i++) {
                var obj = args[i];
                //将node对象取出
                if (obj && typeof obj.__KityClassName !== 'undefined') {
                    this.___viewNode = obj;
                    args.splice(i, 1);
                    break;
                }
            }
            Base.__base.apply(this, args);
        },
        __getShape: function () {
            return this.___viewNode;
        },
        __addShape: function (shape) {
            this.___viewNode.addShape(shape);
        },
        __getWidth: function () {
            return this.___viewNode.getWidth();
        },
        __getHeight: function () {
            return this.___viewNode.getHeight();
        },
        __show: function () {
            this.___viewNode.setAttr('display', 'block');
        },
        __hide: function () {
            this.___viewNode.setAttr('display', 'none');
        },
        __on: function (key, callback) {
            this.___viewNode.on(key, callback);
        },
        __stopPropagation: function (events) {
            var that = this;
            var stop = function (e) {
                e.stopPropagation();
            };
            events.forEach(function (event) {
                that.__on(event, stop);
            });
        },
        __remove: function () {
            this.___viewNode.remove();
        },
        __animator: function (obj) {
            var target = obj.node || this.___viewNode;
            var startVal = obj.startVal || 0;
            var finishVal = obj.finishVal || 0;
            var drawCallback = obj.draw;
            var finishCallback = obj.finish;
            var duration = obj.duration || 200;


            var a = new kity.Animator(startVal, finishVal, function (target, value, timeLine) {
                drawCallback(target, value);
            });
            var timeLine = a.start(target, duration);

            var __animateFinish = function () {
                finishCallback && finishCallback();
                timeLine.off('finish', __animateFinish);
            };

            timeLine.on('finish', __animateFinish);//console.log('the ' + e.target.getId() + ' has move right');
            return timeLine;
        }

    };


    var BaseForeignObject = {
        ___$view: null,//当前视图节点
        __base: function (eventDispatch, eventsInfo, nodeId, node) {
            var args = Array.prototype.slice.apply(arguments, [0]);
            for (var i = 0; i < args.length; i++) {
                var obj = args[i];
                //将node对象取出
                if (obj && obj instanceof jQuery) {
                    this.___$view = obj;
                    args.splice(i, 1);
                    break;
                }
            }
            Base.__base.apply(this, args);
        },
        __$: function () {
            return this.___$view;
        },
        __setMatrix: function (matrix) {
            this.___$view.attr('transform', 'matrix(' + matrix.m.a + ' ' + matrix.m.b + ' ' + matrix.m.c + ' ' + matrix.m.d + ' ' + matrix.m.e + ' ' + matrix.m.f + ')');
        },
        __getWidth: function () {
            return this.___$view.width();
        },
        __getHeight: function () {
            return this.___$view.height();
        },
        __setWidth: function (width) {
            this.___$view.css('width', width + 'px');
            return this;
        },
        __setHeight: function () {
            this.___$view.css('height', width + 'px');
            return this;
        },
        __setVisible: function (visible) {
            if (visible) {
                this.___$view.show();
            } else {
                this.___$view.hide();
            }
        },
        __isVisible: function () {
            return this.___$view.is(':visible');
        },
        __remove: function () {
            this.___$view.remove();
        }
    };

    //创建基类
    __M.Class.Base = function (cls) {
        return Object.create(Base).__include(cls);
    };

    //svg节点基类
    __M.Class.BaseView = function (cls) {
        return Object.create(Base).__include(Object.create(BaseView)).__include(cls);
    };

    //自建的外部svg节点基类
    __M.Class.BaseForeignObject = function (cls) {
        return Object.create(Base).__include(Object.create(BaseForeignObject)).__include(cls);
    };
}(window, jQuery, __M));
(function (window, $, kity, __M) {


    __M.Utils = {
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
        /**
         * @param arr
         * @param id
         * @param proName
         * @returns {*}
         */
        getItemInArrayById: function (arr, id, proName) {
            if (!proName) {
                proName = 'id';
            }
            for (var i = 0, l = arr.length; i < l; i++) {
                var tempId = ( typeof arr[i][proName] === "function" ) ? (arr[i][proName]()) : arr[i][proName];
                if (tempId === id) {
                    return arr[i];
                }
            }
            return false;
        },
        //判断一个点是否在多边形内
        isPointInsidePoly: function (point, poly) {
            var length = poly.length;
            for (var c = false, i = -1, j = length - 1; ++i < length; j = i) {
                ((poly[i].y <= point.y && point.y < poly[j].y) || (poly[j].y <= point.y && point.y < poly[i].y))
                && (point.x < (poly[j].x - poly[i].x) * (point.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
                && (c = !c);
            }
            return c;
        },
        //检查两个矩形框是否交叉
        checkRectsCross: function (rectA, rectB) {
            /**
             * 矩形A的宽 Wa = Xa2-Xa1 高 Ha = Ya2-Ya1
             * 矩形B的宽 Wb = Xb2-Xb1 高 Hb = Yb2-Yb1
             * 矩形A的中心坐标 (Xa3,Ya3) = （ (Xa2+Xa1)/2 ，(Ya2+Ya1)/2 ）
             * 矩形B的中心坐标 (Xb3,Yb3) = （ (Xb2+Xb1)/2 ，(Yb2+Yb1)/2 ）
             * 所以只要同时满足下面两个式子，就可以说明两个矩形相交。
             *   1) | Xb3-Xa3 | <= Wa/2 + Wb/2
             *   2) | Yb3-Ya3 | <= Ha/2 + Hb/2
             *   即:
             *   1) | Xb2+Xb1-Xa2-Xa1 | <= Xa2-Xa1 + Xb2-Xb1
             *   2) | Yb2+Yb1-Ya2-Ya1 | <= Ya2-Ya1 + Yb2-Yb1
             */
            return Math.abs(rectB.p1.x + rectB.p2.x - rectA.p1.x - rectA.p2.x) <= ( Math.abs(rectA.p1.x - rectA.p2.x) + Math.abs(rectB.p1.x - rectB.p2.x))
                &&
                Math.abs(rectB.p2.y + rectB.p1.y - rectA.p2.y - rectA.p1.y) <= ( Math.abs(rectA.p2.y - rectA.p1.y) + Math.abs(rectB.p2.y - rectB.p1.y));
        },
        isMobile: navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i) ? true : false,
        supportTouch: 'ontouchend' in document,
        getEventPagePos: function (e) {
            var ev = e.originalEvent ? e.originalEvent : e;
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
                    point.x = e.pageX;
                    point.y = e.pageY;
                    return point;
            }
            return point;
        }
    };

}(window, jQuery, kity, __M));
/**
 * Created by ylf on 2016/4/9.
 */
(function (window, $, __M) {

    __M.Utils.String = {
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
        },
        getTextLfToBr: function (text) {
            //统一替换
            text = text.replace(/<br\/>/g, function ($1, $2) {
                return '<br>';
            });
            //div 在行末和行首插入换行
            text = text.replace(/<div>([\s\S]*?)<\/div>/g, function ($1, $2) {
                return '<br/>' + $2 + '<br/>';
            });
            //</div><div>这种情况只处理一个换行
            text = text.replace(/<br\/><br\/>/g, function ($1, $2) {
                return '<br>';
            });
            //统一替换
            text = text.replace(/<br\/>/g, function ($1, $2) {
                return '<br>';
            });
            //统一替换\r\n
            text = text.replace(/\r\n/g, function ($1, $2) {
                return '<br>';
            });
            //统一替换\r\n
            text = text.replace(/(\r|\n)/g, function ($1, $2) {
                return '<br>';
            });

            return text;
        },
        getTextBrToLf: function (text) {
            text = text.replace(/<br([^<>]*?)\/?>/g, function ($1, $2) {
                return '\r\n';
            });
            return text;
        }
    };

}(window, jQuery, __M));
//参考：https://github.com/kticka/jquery-outclick/blob/master/outclick.js


(function (window, $, __M) {
    __M.Utils.OutClick = {
        uuid: '',
        instances: [],//{containerEle:'',listener:[]}
        containerEle: document,
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
        create: function (containerEle) {
            var ins = Object.create(this);
            ins.instances = [];
            ins.uuid = this.getUuid();
            ins.containerEle = containerEle;
            return ins;
        },
        trigger: function (event) {
            var that = this;
            return $.each(this.instances, function (index, instance) {
                if (that.outside(instance.element, event.target)) {
                    var invoke = true;
                    if (instance.ignoreEle && !that.outside($(instance.ignoreEle), event.target)) {
                        invoke = false;
                    }
                    if (invoke && typeof instance.callback === 'function') {
                        return instance.callback.call(instance.element);
                    }
                }
            });
        },
        register: function (element, ignoreEle, callback) {
            return this.instances.push({
                element: element,
                ignoreEle: ignoreEle,
                options: [],
                callback: callback
            });
        },
        enable: function () {
            var that = this;
            return $(this.containerEle).on('mousedown.outclick' + this.uuid, function (e) {
                that.trigger(e);
            });
        },
        disable: function () {
            return $(this.containerEle).off('mousedown.outclick' + this.uuid);
        },
        reset: function () {
            this.disable();
            return this.enable();
        },
        outside: function (element, target) {
            return !element.is(target) && element.has(target).length === 0;
        }
    };

    $.fn.mOutclick = function (callback, ignoreEle, outClickInstance) {
        outClickInstance.reset();
        outClickInstance.register(this, ignoreEle, callback);
        return this;
    };
})(window, $, __M);


/**
 * Created by ylf on 2016/4/9.
 */
(function (window, __M) {

    __M.Utils.Clipboard = {
        _data: null,
        create: function () {
            var instance = Object.create(this);
            return instance;
        },
        setData: function (data, cut) {
            this._data = {
                text: data,
                cut: cut
            };
        },
        getData: function () {
            if (!this._data) {
                return '';
            }
            var text = this._data.text;
            if (this._data.cut) {
                this._data = null;
            }
            return text;
        },
        isEmpty: function () {
            if (this._data && this._data.text.length > 0) {
                return false;
            }
            return true;
        }
    };

}(window, __M));
(function (window, $, __M) {


    var Command = __M.Command = {};

    Command.TYPE = {
        ADD: 1,
        DELETE: 2,
        EXPAND: 3,
        MOVE: 4,
        MODIFY_TEXT: 5
    };

    Command.Queue = {
        _queue: [],
        _currentIndex: 0,
        _maxLength: 10,
        create: function () {
            var instance = Object.create(this);
            instance._queue = [];
            return instance;
        },
        undo: function () {
            if (this._currentIndex < 0) {
                return;
            }
            this._queue[this._currentIndex--].undo();
        },
        redo: function () {
            if (this._currentIndex >= this._queue.length - 1) {
                return;
            }
            this._queue[this._currentIndex++].do();
        },
        push: function (command) {
            //有新命令，移除当前索引之后的命令，这些命令将不能被redo
            this._queue = this._queue.slice(0, this._currentIndex + 1);
            this._queue.push(command);
            //不超过最大限制
            if (this._queue.length > this._maxLength) {
                this._queue.shift();
            }
            //重新指定索引为最后一个
            this._currentIndex = this._queue.length - 1;
        },
        redoAble: function () {
            return (this._queue.length - 1) > this._currentIndex;
        },
        undoAble: function () {
            return this._currentIndex >= 0 && this._queue.length > 0;
        }
    };

}(window, jQuery, __M));
/**
 * Created by ylf on 2015/12/9.
 */
//事件管理对象
(function (window, $, __M) {

    var Logger = __M.Logger;

    __M.Event = {
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
        add: function (type, callback, domain) {
            if (!this._eventHandler[type]) {
                this._eventHandler[type] = [];
            }
            this._eventHandler[type].push({cb: callback, domain: domain});
            return true;
        },
        remove: function (type, callback,domain) {
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
}(window, jQuery, __M));
(function (window, $, __M) {


    __M.Utils.Svg = {
        //添加外部对象
        addForeignObject: function (parentSvg, id, cls, x, y, width, height) {
            var svgdoc = parentSvg.ownerDocument;
            var foreignObject = svgdoc.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            foreignObject.setAttribute("x", x);
            foreignObject.setAttribute("y", y);
            foreignObject.setAttribute("id", id);
            foreignObject.setAttribute("height", height + "px");
            foreignObject.setAttribute("width", width + "px");
            var div = svgdoc.createElement('div');
            if (cls) {
                div.setAttribute("class", cls);
            }
            foreignObject.appendChild(div);
            parentSvg.appendChild(foreignObject);
            return foreignObject;
        },
        //添加title
        addTitle: function (parentSvg, txt) {
            var svgdoc = parentSvg.ownerDocument;
            var title = svgdoc.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.innerHTML = txt;
            parentSvg.appendChild(title);
            return title;
        }
    };

}(window, jQuery, __M));
(function (window, $, __M) {

    var Utils = __M.Utils;

    __M.ID = {
        _nodeId: 'minder_node_${i:number}',
        _textBorderId: 'node_text_border_${i:number}',
        _textGroupId: 'node_text_g_${i:number}',
        _textId: 'node_text_${i:number}',
        _visibleImageId: 'node_image_visible_${i:number}',
        _expandGroupId: 'node_expand_${orientation:string}_${i:number}',
        _expandTriangleId: 'node_expand_triangle_${orientation:string}_${i:number}',
        _createPlusId: 'node_plus_${orientation:string}_${i:number}',
        _delBtnId: 'node_del_${i:number}',
        getNodeId: function (nodeIndex) {
            return Utils.String.template(this._nodeId, {i: nodeIndex});
        },
        getDelBtnId: function (nodeIndex) {
            return Utils.String.template(this._delBtnId, {i: nodeIndex});
        },
        getTextBorderId: function (nodeIndex) {
            return Utils.String.template(this._textBorderId, {i: nodeIndex});
        },
        getTextGroupId: function (nodeIndex) {
            return Utils.String.template(this._textGroupId, {i: nodeIndex});
        },
        getTextId: function (nodeIndex) {
            return Utils.String.template(this._textId, {i: nodeIndex});
        },
        getVisibleImageId: function (nodeIndex) {
            return Utils.String.template(this._visibleImageId, {i: nodeIndex});
        },
        getExpandGroupId: function (nodeIndex, orientation) {
            return Utils.String.template(this._expandGroupId, {i: nodeIndex, orientation: orientation});
        },
        getExpandTriangleId: function (nodeIndex, orientation) {
            return Utils.String.template(this._expandTriangleId, {i: nodeIndex, orientation: orientation});
        },
        getCreatePlusId: function (nodeIndex, orientation) {
            return Utils.String.template(this._createPlusId, {i: nodeIndex, orientation: orientation});
        },
        getTargetValue: function (id) {
            var that = this;
            var value = Utils.String.getTemplateValue(id, that._createPlusId);
            if (value) {
                value.type = 'plus';
                return value;
            }

            value = Utils.String.getTemplateValue(id, that._expandTriangleId);
            if (value) {
                value.type = 'expand';
                return value;
            }

            value = Utils.String.getTemplateValue(id, that._delBtnId);
            if (value) {
                value.type = 'del';
                return value;
            }

            //TODO:这个写法要优化，否则容易遗留bug
            //文本节点或边框时才是节点事件
            value = Utils.String.getTemplateValue(id, that._textGroupId);
            if (value) {
                value.type = 'node';
                return value;
            }
            value = Utils.String.getTemplateValue(id, that._textBorderId);
            if (value) {
                value.type = 'node';
                return value;
            }
            value = Utils.String.getTemplateValue(id, that._visibleImageId);
            if (value) {
                value.type = 'node';
            }
            return value;
        },
        isNode: function (id) {
            return /^minder_node_\d+$/.test(id);
        },
        getTextIdByNodeId: function (id) {
            var val = Utils.String.getTemplateValue(id, this._nodeId);
            if (val && typeof  val.i !== 'undefined' && val.i !== '') {
                return this.getTextId(val.i);
            }
            return null;
        },
        isRoot: function (id) {
            return id === 'minder_node_1';
        }
    };

}(window, jQuery, __M));
/**
 * Created by ylf on 2016/5/24.
 */
(function (window, $, __M) {

    /*!
     * https://github.com/Starcounter-Jack/Fast-JSON-Patch
     * json-patch-duplex.js 0.5.0
     * (c) 2013 Joachim Wester
     * MIT license
     */
    var _objectKeys = function () {
        if (Object.keys) return Object.keys;
        return function (o) {
            var keys = [];
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    keys.push(i);
                }
            }
            return keys;
        };
    }();

    function escapePathComponent(str) {
        if (str.indexOf("/") === -1 && str.indexOf("~") === -1) return str;
        return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }

    function deepClone(obj) {
        if (typeof obj === "object") {
            return JSON.parse(JSON.stringify(obj));
        } else {
            return obj;
        }
    }

    // Dirty check if obj is different from mirror, generate patches and update mirror
    function _generate(mirror, obj, patches, path) {
        var newKeys = _objectKeys(obj);
        var oldKeys = _objectKeys(mirror);
        var changed = false;
        var deleted = false;
        for (var t = oldKeys.length - 1; t >= 0; t--) {
            var key = oldKeys[t];
            var oldVal = mirror[key];
            if (obj.hasOwnProperty(key)) {
                var newVal = obj[key];
                if (typeof oldVal == "object" && oldVal != null && typeof newVal == "object" && newVal != null) {
                    _generate(oldVal, newVal, patches, path + "/" + escapePathComponent(key));
                } else {
                    if (oldVal != newVal) {
                        changed = true;
                        patches.push({
                            op: "replace",
                            path: path + "/" + escapePathComponent(key),
                            value: deepClone(newVal)
                        });
                    }
                }
            } else {
                patches.push({
                    op: "remove",
                    path: path + "/" + escapePathComponent(key)
                });
                deleted = true;
            }
        }
        if (!deleted && newKeys.length == oldKeys.length) {
            return;
        }
        for (var t = 0; t < newKeys.length; t++) {
            var key = newKeys[t];
            if (!mirror.hasOwnProperty(key)) {
                patches.push({
                    op: "add",
                    path: path + "/" + escapePathComponent(key),
                    value: deepClone(obj[key])
                });
            }
        }
    }

    function compare(tree1, tree2) {
        var patches = [];
        _generate(tree1, tree2, patches, "");
        return patches;
    }

    __M.Utils.JsonDiff = {
        compare: compare
    };
}(window, jQuery, __M));
/**
 * Created by Administrator on 2016/3/30.
 */
(function (window, $, __M) {

    var ID = __M.ID;
    var BaseView = __M.Class.BaseView;
    var Svg = __M.Utils.Svg;
    var Utils = __M.Utils;
    var Config = __M.Config;

    var plusStyle = Config.plusStyle;

    __M.View.Plus = BaseView({
        _orientation: null,
        _clickWidth: plusStyle.circleWidth + 20,
        _clickHeight: plusStyle.circleWidth + 28,
        create: function (nodeIndex, eventDispatch, orientation, option) {
            var instance = Object.create(this);
            instance.__base(eventDispatch, ID.getNodeId(nodeIndex), new kity.Group().setId(ID.getCreatePlusId(nodeIndex, orientation)));
            instance._option = option;
            instance._orientation = orientation;
            instance._createNode();

            return instance;
        },
        _createNode: function () {
            var that = this;
            //添加提示
            var lang = this._option.langData;
            Svg.addTitle(this.__getShape().node, lang['mdnode_addchildtip']);
            this.__getShape().setStyle({cursor: 'pointer'});

            var circle = new kity.Circle(plusStyle.circleWidth, 0, 0).fill(plusStyle.circleFill).stroke(plusStyle.circleStroke);
            this.__addShape(circle);
            var plus = new kity.Path().stroke(plusStyle.plusSroke).setAttr('stroke-width', plusStyle.plusStokeWidth);
            var plusDrawer = plus.getDrawer();
            plusDrawer.moveTo(-plusStyle.plusWidth, 0);//左
            plusDrawer.lineTo(plusStyle.plusWidth, 0);//右
            plusDrawer.moveTo(0, -plusStyle.plusWidth);//上
            plusDrawer.lineTo(0, plusStyle.plusWidth);//下
            this.__addShape(plus);

            //新建隐藏的节点，扩大点击作用域
            if (!Utils.isMobile) {
                this._clickWidth = plusStyle.circleWidth + 17;
                this._clickHeight = plusStyle.circleWidth + 20;
            }
            var clickRect = new kity.Rect(this._clickWidth, this._clickHeight, 0, 0).fill(plusStyle.clickFill).setStyle(plusStyle.clickStyle);
            clickRect.translate(-this._clickWidth / 2, -this._clickHeight / 2);
            this.__addShape(clickRect);
        },
        getVisibleWidth: function () {
            return plusStyle.circleWidth * 2;
        },
        destroy: function () {

        }
    });


}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/30.
 */
(function (window, $, __M) {

    var ID = __M.ID;
    var BaseView = __M.Class.BaseView;
    var Utils = __M.Utils;

    //样式
    var _triangleStyle = __M.Config.triangleStyle;
    var Config = __M.Config;

    var plusWidth = Config.plusStyle.circleWidth * 2 + 5;

    __M.View.ExpandTriangle = BaseView({
        _orientation: null,
        _triangleNode: null,//三角按钮
        _circleNode: null,//圆圈
        _circleGroupNode: null,//圆圈父节点
        _leftLineNode: null,//左边线条
        _halfLineNode: null,
        _rightLineNode: null,//右边线条
        _nodeLevel: null,//
        create: function (nodeIdIndex, nodeLevel, eventDispatch, orientation) {
            var instance = Object.create(this);
            instance.__base(eventDispatch, ID.getNodeId(nodeIdIndex), new kity.Group().setId(ID.getExpandGroupId(nodeIdIndex, orientation)));
            instance._orientation = orientation;
            instance._nodeLevel = nodeLevel;
            instance._create(nodeLevel, nodeIdIndex, orientation);
            return instance;
        },
        _create: function (nodeLevel, nodeIdIndex, orientation) {
            if (nodeLevel === 1) {
                var leftHorizontalLine = this._leftLineNode = new kity.Path().setStyle(_triangleStyle.lineStyle);
                var halfLine = this._halfLineNode = new kity.Path().setStyle(_triangleStyle.lineStyle);
                this.__addShape(leftHorizontalLine);
                this.__addShape(halfLine);

                var lineDrawer = leftHorizontalLine.getDrawer();
                var halfLineDrawer = halfLine.getDrawer();
                var lineWidth = (_triangleStyle.lineWidth * 2) / 3;

                if (orientation === 'left') {
                    lineDrawer.moveTo(0, 0);
                    lineDrawer.lineTo(lineWidth - plusWidth, 0);

                    halfLineDrawer.moveTo(plusWidth, 0);
                    halfLineDrawer.lineTo(lineWidth, 0);
                } else {
                    halfLineDrawer.moveTo(0, 0);
                    halfLineDrawer.lineTo(plusWidth + 0.5, 0);

                    lineDrawer.moveTo(plusWidth, 0);
                    lineDrawer.lineTo(lineWidth, 0);
                }


            } else {
                //创建中间的线
                var leftHorizontalLine = this._leftLineNode = new kity.Path().setStyle(_triangleStyle.lineStyle);
                this.__addShape(leftHorizontalLine);
                var rightHorizontalLine = this._rightLineNode = new kity.Path().setStyle(_triangleStyle.lineStyle);
                this.__addShape(rightHorizontalLine);
                //新建两段被加号覆盖隐藏的线段
                var halfLine = this._halfLineNode = new kity.Path().setStyle(_triangleStyle.lineStyle);
                this.__addShape(halfLine);

                this._createTriangleGroup(nodeIdIndex, orientation);

                var leftLineDrawer = leftHorizontalLine.getDrawer();
                var rightLineDrawer = rightHorizontalLine.getDrawer();
                var halfLineDrawer = halfLine.getDrawer();

                var lineHalfWidth = _triangleStyle.lineWidth / 2;
                var circleWidth = _triangleStyle.circleWidth;

                if (orientation === 'left') {

                    leftLineDrawer.moveTo(0, 0);
                    leftLineDrawer.lineTo(lineHalfWidth - circleWidth, 0);

                    //rightLineDrawer.moveTo(0, 0);
                    //rightLineDrawer.lineTo((lineHalfWidth - circleWidth - plusWidth), 0);
                    rightLineDrawer.moveTo(lineHalfWidth + circleWidth, 0);
                    rightLineDrawer.lineTo(lineHalfWidth + circleWidth + (lineHalfWidth - circleWidth - plusWidth), 0);
                    //rightHorizontalLine.translate(lineHalfWidth + circleWidth ,0);

                    halfLineDrawer.moveTo(lineHalfWidth + circleWidth + (lineHalfWidth - circleWidth - plusWidth) + plusWidth, 0);
                    halfLineDrawer.lineTo(lineHalfWidth + circleWidth, 0);

                } else {
                    rightLineDrawer.moveTo(0, 0);
                    rightLineDrawer.lineTo(lineHalfWidth - circleWidth, 0);
                    //移动到右侧
                    rightHorizontalLine.translate(lineHalfWidth + circleWidth, 0);

                    halfLineDrawer.moveTo(0, 0);
                    halfLineDrawer.lineTo(plusWidth + 0.5, 0);

                    leftLineDrawer.moveTo(plusWidth, 0);
                    leftLineDrawer.lineTo(lineHalfWidth - circleWidth, 0);
                }

            }
        },
        _createTriangleGroup: function (nodeIdIndex, orientation) {

            var group = this._circleGroupNode = new kity.Group().setId(ID.getExpandTriangleId(nodeIdIndex, orientation)).setStyle(_triangleStyle.style).fill(_triangleStyle.clickCircleFill);
            //新建圆圈节点
            var circle = this._circleNode = new kity.Circle(_triangleStyle.circleWidth, 0, 0).setStyle(_triangleStyle.circleStrokeStyle);
            group.addShape(circle);


            //新建隐藏的节点，扩大点击作用域
            var clickWidth = 20;
            var clickHeight = 22;
            var clickPaddingLeft = 0;
            if (Utils.isMobile) {
                clickWidth = 30;
                clickHeight =34;
                clickPaddingLeft = 4;
            }

            var clickWidth = _triangleStyle.circleWidth + clickWidth;
            var clickHeight = _triangleStyle.circleWidth + clickHeight;
            var clickRect = new kity.Rect(clickWidth, clickHeight, 0, 0).fill(_triangleStyle.clickCircleFill).setStyle(_triangleStyle.clickCircleStrokeStyle);
            clickRect.translate(-clickWidth / 2, -clickHeight / 2);
            group.addShape(clickRect);


            //新建三角形
            var polyline = this._triangleNode = new kity.Polyline();
            this._createTriangle(polyline, orientation);
            polyline.fill(_triangleStyle.triangleFill).stroke(_triangleStyle.triangleStroke);
            //三角形居中显示
            var matrix = new kity.Matrix(1, 0, 0, 1, -_triangleStyle.triangleWidth / 2, -_triangleStyle.triangleHeight / 2);
            polyline.setMatrix(matrix);
            group.addShape(polyline);

            group.translate(_triangleStyle.lineWidth / 2);

            this.__addShape(group);
        },
        update: function (expand) {
            var that = this;
            if (expand) {
                //展开全部显示
                that._updateTriangle(that._orientation === 'left' ? 'left' : 'right');
                that._leftLineNode.setVisible(true);
                that._rightLineNode.setVisible(true);
            } else {
                if (that._orientation === 'left') {
                    //左侧收起
                    that._updateTriangle('right');
                    that._leftLineNode.setVisible(false);
                    that._rightLineNode.setVisible(true);
                } else {
                    //右侧收起
                    that._updateTriangle('left');
                    that._leftLineNode.setVisible(true);
                    that._rightLineNode.setVisible(false);
                }
            }
        },
        updateHalfLine: function (focus) {
            if (focus) {
                $(this._halfLineNode.node).css('visibility', 'hidden');
            } else {
                $(this._halfLineNode.node).css('visibility', 'visible');
            }
        },
        _createTriangle: function (polyline, orientation) {
            polyline.clear();
            if (orientation === 'left') {
                polyline.addPoint(new kity.ShapePoint(0, 0));//左上
                polyline.addPoint(new kity.ShapePoint(_triangleStyle.triangleWidth, _triangleStyle.triangleHeight / 2));//右中
                polyline.addPoint(new kity.ShapePoint(0, _triangleStyle.triangleHeight));//坐下
                polyline.addPoint(new kity.ShapePoint(0, 0));//闭合
                var matrix = new kity.Matrix(1, 0, 0, 1, -_triangleStyle.triangleWidth / 2 + 2, -_triangleStyle.triangleHeight / 2);
                polyline.setMatrix(matrix);
            } else if (orientation === 'right') {
                polyline.addPoint(new kity.ShapePoint(_triangleStyle.triangleWidth, 0));//右上
                polyline.addPoint(new kity.ShapePoint(_triangleStyle.triangleWidth, _triangleStyle.triangleHeight));//右下
                polyline.addPoint(new kity.ShapePoint(0, _triangleStyle.triangleHeight / 2));//左中
                polyline.addPoint(new kity.ShapePoint(_triangleStyle.triangleWidth, 0));//闭合
                var matrix = new kity.Matrix(1, 0, 0, 1, -_triangleStyle.triangleWidth / 2 - 2, -_triangleStyle.triangleHeight / 2);
                polyline.setMatrix(matrix);
            }
        },
        _updateTriangle: function (orientation) {
            this._createTriangle(this._triangleNode, orientation);
        },
        //获取到完整的宽度
        getFullWidth: function () {
            if (this._nodeLevel === 1) {
                return (_triangleStyle.lineWidth * 2) / 3;
            } else {
                return _triangleStyle.lineWidth;
            }
        },
        destroy: function () {

        }
    });

}(window, jQuery, __M));
/**
 * Created by Administrator on 2016/3/30.
 */
(function (window, $, __M) {

    var _lineStyle = __M.Config.lineStyle;
    var BaseView = __M.Class.BaseView;
    var Utils = __M.Utils;


    __M.View.ConnectLine = BaseView({
        _mindNodeCore: null,
        _type: 'both',
        create: function (mindNodeCore) {
            var instance = Object.create(this);
            instance.__base(new kity.Path());
            instance._mindNodeCore = mindNodeCore;
            instance._type = mindNodeCore.getOption().type;
            instance._init();
            return instance;
        },
        _init: function () {
            this.draw();
        },
        draw: function (type, data) {
            //https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
            //重新根据父节点位置计算线
            var box = this._mindNodeCore.getLayoutBox(), pBox = this._mindNodeCore.getParent().getLayoutBox();
            var childCount = this._mindNodeCore.getParent().getChildrenCount();
            var orientation;
            var type = this._type;
            //非二级节点取父节点方向
            if (type !== 'both') {
                orientation = type;
            } else if (!this._mindNodeCore.getParent().isRoot()) {
                orientation = this._mindNodeCore.getParent().getOrientation();
            } else {
                //二级节点取最新的方向
                orientation = this._mindNodeCore.getOrientation();
            }
            var start, end, vector;

            var abs = Math.abs;
            var pathData = [];
            var side = box.x > pBox.x ? "right" : "left";
            //修正方向
            if (orientation) {
                side = orientation;
            }
            start = new kity.Point(side === 'left' ? pBox.left : pBox.right, pBox.cy);

            end = side == "left" ? new kity.Point(box.right, box.cy) : new kity.Point(box.left, box.cy);


            //解决：x坐标相同时，线条长度计算异常

            if (Math.abs(start.x - end.x) <= 2) {
                start.x = end.x;
            }

            vector = kity.Vector.fromPoints(start, end);
            //保留五位小数点  "1.4489043564935855e-7"  防止出现这种计数法时，svg线条解析e-7时显示异常
            vector.x = Utils.getFixedFloat(vector.x, 5);
            vector.y = Utils.getFixedFloat(vector.y, 5);

            //解决：x，线条长度计算异常
            if (Math.abs(vector.x) <= 2.5) {
                vector.x = 0;
            }

            //if(this._mindNodeCore.getNodeId()==='minder_node_8'){
            //    console.log('line-ok',start,end,vector);
            //}

            pathData.push("M", start);
            //解决：x坐标相同时，线条长度计算异常
            if (type === 'animate'
                && childCount === 1
                && (Math.abs(Math.floor(start.x) - Math.floor(end.x)) <= 2)
                && (Math.abs(start.y - end.y) < 40)
            ) {
                pathData.push("A", 0, 0, 0, 0, 0, start);
            } else {
                pathData.push("A", abs(vector.x), abs(vector.y), 0, 0, vector.x * vector.y > 0 ? 0 : 1, end);
            }
            this.__getShape().setPathData(pathData);
            this.__getShape().setStyle(_lineStyle.strokeStyle);


            //if (strokeWidth % 2 === 0) {
            //    connection.setTranslate(.5, .5);
            //} else {
            //    connection.setTranslate(0, 0);
            //}
        },
        _getLayoutBox: function (node) {
            var contentBox = node.getRenderBox();
            var gloMatrix = new kity.Matrix();
            return gloMatrix.transformBox(contentBox);
        },
        setParentShape: function () {

        },
        destroy: function () {

        }
    });


}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/30.
 */
(function (window, $, __M) {

    var Utils = __M.Utils;
    var Class = __M.Class;
    var ID = __M.ID;

    __M.View.FornVisibleImage = Class.BaseForeignObject({
        _width: 50,
        _height: 28,
        create: function (parentSvgNode, nodeIndex) {
            var instance = Object.create(this);
            instance.__base($(Utils.Svg.addForeignObject(parentSvgNode, ID.getVisibleImageId(nodeIndex), 'mindMap_visible_img', 0, 0, this._width, this._height)));
            instance.__setVisible(false);
            return instance;
        },
        active:function(){
            this.__$().find('.mindMap_visible_img').addClass('mindMap_visible_img_active');
        },
        revert:function(){
            this.__$().find('.mindMap_visible_img').removeClass('mindMap_visible_img_active');
        }
    });

}(window, jQuery, __M));
/**
 * Created by ylf on 2016/4/14.
 */
(function (window, $, __M) {


    var _nodeStyle = __M.Config.nodeStyle;
    var Utils = __M.Utils;

    var BaseView = __M.Class.BaseView;
    var ID = __M.ID;

    var regex = {
        start: /^([\s\S]*?)<div>/,
        middle: /<div>([\s\S]*?)<\/div>/g,
        end: /<\/div>([\s\S]*)/,
        br: /(.*?)<br\/?>(.*)/
    };

    __M.View.MultipleText = BaseView({
        _lineHeight: 22,
        _$$texts: [],
        create: function (nodeIdIndex, text) {
            var instance = Object.create(this);
            instance._$$texts = [];
            instance.__base(new kity.Group().setId(ID.getTextGroupId(nodeIdIndex)).fill(_nodeStyle.groupColor).setAttr('transform', _nodeStyle.groupTransform));
            //创建节点容器
            instance._createNode(nodeIdIndex, text);
            return instance;
        },
        _createNode: function (nodeIdIndex, text) {
            //if (nodeIdIndex == 1) {
            //    text = "&lt;title&gt; - SVG | MDN<div>查看此网页的中文<br>翻译，请点击 翻译此页<\/div>asdfasdf";
            //}
            //添加此节点文本框,设置样式并居中处理
            this.setText(text);
        },
        _createText: function (text, x, y) {
            var $$text = new kity.Text().setStyle(_nodeStyle.textStyle).setContent(text).setAttr('x', 0).setAttr('y', y);
            return $$text;
        },
        getText: function () {
            var that = this;
            var text = '';
            that._$$texts.forEach(function ($$text, i) {
                if (i === that._$$texts.length - 1) {
                    text += $$text.getContent();
                } else {
                    text += $$text.getContent() + '<br>';
                }
            });
            return text;
        },
        setText: function (text) {
            this._$$texts.forEach(function ($$text) {
                $$text.remove();
            });
            this._$$texts = [];
            var lines = this._getTextSpan(text);
            for (var i = 0; i < lines.length; i++) {
                var $$text = this._createText(lines[i], 0, i * this._lineHeight);
                this._$$texts.push($$text);
                this.__addShape($$text);
            }
        },
        _getTextSpan: function (text) {
            //统一替换
            text = text.replace(/<br\/>/g, function ($1, $2) {
                return '<br>';
            });
            //div 在行末和行首插入换行
            text = text.replace(regex.middle, function ($1, $2) {
                return '<br/>' + $2 + '<br/>';
            });
            //</div><div>这种情况只处理一个换行
            text = text.replace(/<br\/><br\/>/g, function ($1, $2) {
                return '<br>';
            });
            //统一替换
            text = text.replace(/<br\/>/g, function ($1, $2) {
                return '<br>';
            });
            //替换掉末尾的换行
            text = text.replace(/(<br>)*$/, function ($1, $2) {
                return '';
            });

            var lines = text.split('<br>');

            return lines;
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
        getHeight: function () {
            return this._lineHeight * this._$$texts.length;
        },
        destroy: function () {
            this.__destroy();
        }
    });


}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/30.
 */
(function (window, $, __M) {

    var KEY = __M.Config.EVENT_KEY;
    var Utils = __M.Utils;
    var Base = __M.Class.Base;
    var ID = __M.ID;

    __M.View.SvgDelBtn = Base({
        _$delBtn: null,
        _eventDispatch: null,
        _width: 40,
        _height: 40,
        create: function (parentSvgNode, nodeIdIndex) {
            var instance = Object.create(this);
            instance._append(parentSvgNode, nodeIdIndex);
            return instance;
        },
        _append: function (parentSvgNode, nodeIdIndex) {
            this._$delBtn = $(Utils.Svg.addForeignObject(parentSvgNode, ID.getDelBtnId(nodeIdIndex), 'mindMap_del', 0, 0, this._width, this._height));
            this._$delBtn.hide();
        },
        setMatrix: function (matrix) {
            this._$delBtn.attr('transform', 'matrix(' + matrix.m.a + ' ' + matrix.m.b + ' ' + matrix.m.c + ' ' + matrix.m.d + ' ' + matrix.m.e + ' ' + matrix.m.f + ')');
        },
        setVisible: function (visible) {
            if (visible) {
                this._$delBtn.show();
            } else {
                this._$delBtn.hide();
            }
        },
        isVisible: function () {
            return this._$delBtn.css('display') !== 'none';
            //return this._$delBtn.is(':visible');
        },
        getWidth: function () {
            return this._width;
        },
        getHeight: function () {
            return this._height;
        },
        destroy: function () {

        }
    });

}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/30.
 */
(function (window, $, __M) {

    var KEY = __M.Config.EVENT_KEY;
    var MENU_TYPE_KEY = __M.Config.MENU_TYPE_KEY;
    var Utils = __M.Utils;
    var Base = __M.Class.Base;


    var menuRegex = /mindMap_menu_btn_([a-z]+)/;

    __M.View.Menu = Base({
        _$menu: null,
        _clipboard: null,
        _nodeText: null,
        _option: null,
        _scale: 1,
        _eventInfos: [
            {nodeEvent: false, key: KEY.MENU_SHOW, fucs: '_showHandler', params: ['触发显示的节点对象']},
            {nodeEvent: false, key: KEY.DOM_HIDE, fucs: '_domHideHandler', params: []}
        ],
        _eventDispatch: null,
        create: function (eventDispatch, $parent, clipboard, option) {
            var instance = Object.create(this);
            instance.__base(eventDispatch, instance._eventInfos);
            instance._clipboard = clipboard;
            instance._option = option;
            instance._append($parent);
            instance._bindEvent();
            return instance;
        },
        _append: function ($target) {
            var lang = this._option.langData;
            var menuHtml = '';
            menuHtml += '<div class="mindMap_rightkey_table mindMap_menu">';
            menuHtml += '<ul> <b class="mindMap_pf_spes"><i></i></b>';
            menuHtml += '<li class="mindMap_rightkey_tab_edit mindMap_menu_btn_edit">';
            menuHtml += '<a href="javascript:;"> <i></i><em>' + lang['mdmenu_edit'] + '</em></a>';
            menuHtml += '</li>';
            menuHtml += '<li class="mindMap_rightkey_tab_hidecon mindMap_menu_btn_visible">';
            menuHtml += '<a href="javascript:;"> <i></i><em>' + lang['mdmenu_invisible'] + '</em></a>';
            menuHtml += '</li>';
            menuHtml += '<li class="mindMap_rightkey_tab_copy mindMap_menu_btn_copy">';
            menuHtml += '<a href="javascript:;"> <i></i><em>' + lang['mdmenu_copy'] + '</em></a>';
            menuHtml += '</li>';
            menuHtml += '<li class="mindMap_rightkey_tab_cut mindMap_menu_btn_cut">';
            menuHtml += '<a href="javascript:;"> <i></i><em>' + lang['mdmenu_cut'] + '</em></a>';
            menuHtml += '</li>';
            menuHtml += '<li class="mindMap_rightkey_tab_paste mindMap_menu_btn_paste">';
            menuHtml += '<a href="javascript:;"> <i></i><em>' + lang['mdmenu_paste'] + '</em></a>';
            menuHtml += '</li>';
            menuHtml += '<li class="mindMap_rightkey_tab_del mindMap_menu_btn_delete">';
            menuHtml += '<a href="javascript:;"> <i></i><em>' + lang['mdmenu_delete'] + '</em></a>';
            menuHtml += '</li>';
            menuHtml += '</ul>';
            menuHtml += '</div>';
            $target.append(menuHtml);
            this._$menu = $target.find('.mindMap_menu');
        },
        _showHandler: function (node) {
            var that = this;
            var lang = this._option.langData;
            //缓存节点文本
            that._nodeText = node.getText();
            //获取节点线框
            var rectPath = node.getRectPath();

            //获取参照物为client的mindBody元素位置信息
            var $mindBody = $('#' + that._option.mindBodyId)
            var mindBodyClientRect = $mindBody[0].getBoundingClientRect();
            var mindWidth = $mindBody.width();
            var bodyScale = mindBodyClientRect.width / mindWidth;
            var curElementClientRect = rectPath.node.getBoundingClientRect();
            var pos = {
                left: (curElementClientRect.left - mindBodyClientRect.left) / bodyScale,
                top: ( curElementClientRect.top - mindBodyClientRect.top) / bodyScale,
                subHeight: (mindBodyClientRect.bottom - curElementClientRect.bottom) / bodyScale
            };

            that.__setNodeId(node.getNodeId());

            that._$menu.find('li').show();

            //根节点不允许删除、隐藏
            if (!node.getParent()) {
                that._$menu.find('.mindMap_menu_btn_delete').hide();
                that._$menu.find('.mindMap_menu_btn_visible').hide();
            } else {
                that._$menu.find('.mindMap_menu_btn_delete').show();
                that._$menu.find('.mindMap_menu_btn_visible').show();
            }


            //不可编辑或者不可视时，不显示编辑按钮
            if (node.getTextVisible()) {
                that._$menu.find('.mindMap_menu_btn_visible em').text(lang['mdmenu_invisible']);
                that._$menu.find('.mindMap_menu_btn_edit').show();

                if (that._clipboard.isEmpty()) {
                    that._$menu.find('.mindMap_menu_btn_paste').addClass('mindMap_click_disabled');
                } else {
                    that._$menu.find('.mindMap_menu_btn_paste').removeClass('mindMap_click_disabled');
                }
                if (that._nodeText === '') {
                    that._$menu.find('.mindMap_menu_btn_copy').addClass('mindMap_click_disabled');
                    that._$menu.find('.mindMap_menu_btn_cut').addClass('mindMap_click_disabled');
                } else {
                    that._$menu.find('.mindMap_menu_btn_copy').removeClass('mindMap_click_disabled');
                    that._$menu.find('.mindMap_menu_btn_cut').removeClass('mindMap_click_disabled');
                }
            } else {
                that._$menu.find('.mindMap_menu_btn_visible em').text(lang['mdmenu_visible']);
                that._$menu.find('.mindMap_menu_btn_edit').hide();
                that._$menu.find('.mindMap_menu_btn_copy').addClass('mindMap_click_disabled');
                that._$menu.find('.mindMap_menu_btn_cut').addClass('mindMap_click_disabled');
                that._$menu.find('.mindMap_menu_btn_paste').addClass('mindMap_click_disabled');
            }
            //内容为空,不可隐藏
            if (that._nodeText === '') {
                that._$menu.find('.mindMap_menu_btn_visible').addClass('mindMap_click_disabled');
            } else {
                that._$menu.find('.mindMap_menu_btn_visible').removeClass('mindMap_click_disabled');
            }

            //不可编辑，则不显示可视切换、编辑、剪切、黏贴按钮
            if (!node.getContentEditAble()) {
                that._$menu.find('.mindMap_menu_btn_edit').hide();
                that._$menu.find('.mindMap_menu_btn_visible').hide();
                that._$menu.find('.mindMap_menu_btn_cut').hide();
                that._$menu.find('.mindMap_menu_btn_paste').hide();
            }

            //不可删除时，删除按钮无效
            if (!node.getDeleteAble()) {
                that._$menu.find('.mindMap_menu_btn_delete').hide();
            }

            //隐藏禁用的按钮
            that._option.hideMenuItem.forEach(function (item) {
                that._$menu.find('.mindMap_menu_btn_' + item).hide();
            });

            //菜单元素最终偏移的坐标（position：absolute)
            var menuWidth = that._$menu.width();
            var menuHeight = that._$menu.height();
            var $spes = that._$menu.find('.mindMap_pf_spes');
            var menuSpesHeight = $spes[0].getBoundingClientRect().height;
            if (menuSpesHeight <= 0) {
                menuSpesHeight = $spes.height();
            }
            var x = pos.left + ( curElementClientRect.width / bodyScale) / 2 - (menuWidth * that._scale) / 2;
            var y = pos.top + (curElementClientRect.height / bodyScale) + Math.abs(menuSpesHeight * that._scale);

            if (menuHeight > pos.subHeight && pos.top > pos.subHeight) {
                $spes.addClass('top')
                y = y - menuHeight * that._scale - curElementClientRect.height / bodyScale - Math.abs(menuSpesHeight * that._scale) * 2;
            } else {
                $spes.removeClass('top')
            }

            //设置居中显示
            that._$menu.css({left: x + 'px', top: y + 'px'});
            that._$menu.css('transform', 'scale(' + (this._scale >= 1 ? this._scale : 1) + ')');
            that._$menu.show();
        },
        _domHideHandler: function () {
            this._$menu.hide();
        },
        _bindEvent: function () {

            var that = this;
            //点击菜单项，发布菜单命令
            this._$menu.on('mTap', function (e) {
                e.preventDefault();
                var srcElement = e.originalEvent.srcElement;
                var $target = $(srcElement).closest('li');
                var targetCls = $target.attr('class');
                //置灰不能操作
                if ($target.hasClass('mindMap_click_disabled')) {
                    return;
                }
                var eventType = Utils.getValue(targetCls, menuRegex);
                that._$menu.hide();
                if (eventType === MENU_TYPE_KEY.DELETE) {
                    that.__triggerEvent(KEY.DOM_HIDE);
                }

                that.triggerMenuClick(eventType, that._nodeText);
            });

            this._$menu.on('touchstart mousedown', function (e) {
                var srcElement = e.originalEvent.srcElement;
                var $target = $(srcElement).closest('li');
                $target.addClass('active');
            });

            this._$menu.on('touchend touchcancel mouseup mouseleave', function () {
                that._$menu.find('li').removeClass('active');
            });

            //阻止默认的弹出右键行为
            this._$menu.on('contextmenu', function (e) {
                e.preventDefault();
            });


        },
        triggerMenuClick: function (eventType, nodeText) {
            var that = this;

            //复制内容到剪贴板
            if (eventType === MENU_TYPE_KEY.COPY) {
                that._clipboard.setData(nodeText, false);
            }
            if (eventType === MENU_TYPE_KEY.CUT) {
                that._clipboard.setData(nodeText, true);
            }

            var text;
            if (eventType === MENU_TYPE_KEY.PASTE) {
                //复制
                text = that._clipboard.getData();
                if (text.length > 0) {
                    that.__triggerNodeEvent(KEY.MENU_CLICK, eventType, text);
                }
            }
            else if (eventType === MENU_TYPE_KEY.CUT) {
                //剪切
                that.__triggerNodeEvent(KEY.MENU_CLICK, eventType, '');
            } else {
                that.__triggerNodeEvent(KEY.MENU_CLICK, eventType);
            }

        },
        setScale: function (scale) {
            this._scale = scale;
            if (this._scale < 1) {
                this._scale = 1;
            }
            this._$menu.css('transform', 'scale(' + (this._scale >= 1 ? this._scale : 1) + ')');
        },
        setVisible: function (visible) {
            if (visible) {
                this._$menu.show();
            } else {
                this._$menu.hide();
            }
        },
        destroy: function () {
            this.__destroy();
        }
    });

}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/30.
 */
(function (window, $, __M) {

    var CLASS_NAME = __M.Config.CLASS_NAME;
    var _nodeStyle = __M.Config.nodeStyle;
    var BaseView = __M.Class.BaseView;

    __M.View.Placeholder = BaseView({
        _$$rect: null,
        _eventDispatch: null,
        create: function ($parent, mindBodyId) {
            var instance = Object.create(this);
            var group = new kity.Group().setId(CLASS_NAME.MIND_PLACEHOLDER_CLASS + mindBodyId);
            instance.__base(group);
            var rect = new kity.Rect().setStyle(_nodeStyle.placeholderStyle);
            instance._$$rect = rect;
            rect.setWidth(100);
            rect.setHeight(100);
            group.addShape(rect);
            instance.__base(group);
            $parent.addShape(group);
            instance.__hide();
            return instance;
        },
        setVisible: function (visible) {
            this.__getShape().setVisible(visible);
        },
        getRectShape: function () {
            return this._$$rect;
        },
        setMatrix:function(matrix){
            this.__getShape().setMatrix(matrix);
        },
        destroy: function () {
            this.__remove();
        }
    });


}(window, jQuery, __M));
/**
 * Created by Administrator on 2016/3/30.
 */
(function (window, $, __M) {

    var Logger = __M.Logger;
    var DRAW_TYPE_KEY = __M.Config.DRAW_TYPE_KEY;

    var _nodeStyle = __M.Config.nodeStyle;
    var DOM_EVENT_TYPE = __M.Config.DOM_EVENT_TYPE;

    var BaseView = __M.Class.BaseView;
    var Plus = __M.View.Plus;
    var ExpandTriangle = __M.View.ExpandTriangle;
    var ID = __M.ID;
    var MultipleText = __M.View.MultipleText;
    var SvgDelBtn = __M.View.SvgDelBtn;
    var FornVisibleImage = __M.View.FornVisibleImage;
    var Utils = __M.Utils;

    var _linePadding = 0;
    var _delBtnPadding = 2.5;
    var _plusPadding = 3;

    __M.View.MindNode = BaseView({
        _nodeStyle: null,
        _rectPathNode: null,
        _leftPlus: null,//左方向键
        _rightPlus: null,//右方向键
        _leftExpandTriangle: null,
        _rightExpandTriangle: null,
        _fornVisibleImage: null,
        _nodeLevel: null,
        _expand: null,//收起展开
        _mindNodeCore: null,//mindnodecore
        _multipleText: null,//多行文本
        _delBtn: null,//删除按钮
        _minWidth: _nodeStyle.width,
        _minHeight: _nodeStyle.height,
        _paddingX: _nodeStyle.paddingX,
        _paddingY: _nodeStyle.paddingY,
        _option: null,
        create: function (nodeId, nodeIdIndex, eventDispatch, mindNodeCore, text) {
            var ins = Object.create(this);
            //创建节点容器
            var g = new kity.Group().setId(nodeId);
            if (!mindNodeCore.isRoot()) {
                g.setAttr('status', 'creating');
            }
            ins.__base(eventDispatch, nodeId, g);
            ins._nodeLevel = mindNodeCore.getLevel();
            ins._mindNodeCore = mindNodeCore;
            ins._option = mindNodeCore.getOption();
            if (mindNodeCore.isRoot()) {
                if (ins._option.rootVertical) {
                    ins._minWidth = ins._option.rootMinWidth;
                    ins._paddingX = ins._option.rootPaddingX;
                    ins._paddingY = ins._option.rootPaddingY;
                }
            }
            ins._createNode(ins._nodeLevel, nodeIdIndex, text);
            return ins;
        },
        bringTop: function () {
            this.__getShape().bringTop();
        },
        _createNode: function (nodeLevel, nodeIdIndex, text) {
            //创建文本框
            this._createTextNode(nodeLevel, nodeIdIndex, text);

            //创建左右两侧扩展
            this._createExpandNode(nodeIdIndex, nodeLevel);

            //创建左右两侧加号
            this._createPlusNode(nodeIdIndex, nodeLevel);

            //创建隐藏图标
            this._createInvisibleImage(nodeIdIndex);

            //创建删除按钮
            this._delBtn = SvgDelBtn.create(this.__getShape().node, nodeIdIndex);

            //创建星号
            if (this._mindNodeCore.getRequireChildren()) {
                this._createRequireStarText();
            }
        },
        getLayoutBox: function () {
            var contentBox = this.__getShape().getRenderBox();
            //修正盒子信息，移除删除按钮的影响
            if (this._delBtn.isVisible()) {
                contentBox.cy = contentBox.cy + this._delBtn.getHeight() / 2 + _delBtnPadding / 2;
                contentBox.height = contentBox.height - this._delBtn.getHeight() - _delBtnPadding;
                contentBox.top = contentBox.top + this._delBtn.getHeight() + _delBtnPadding;
                contentBox.y = contentBox.y + this._delBtn.getHeight() + _delBtnPadding;
                if (this._option.remarkVisible && (this._option.remarkEditAble || this._getMindNode().rtGetRemark() !== '')) {
                    contentBox.width = contentBox.width - this._delBtn.getHeight();
                    contentBox.cx = contentBox.width - this._delBtn.getHeight();
                    contentBox.x = contentBox.x + this._delBtn.getHeight();
                }

            }
            var gloMatrix = new kity.Matrix();
            return gloMatrix.transformBox(contentBox);
        },
        _createRequireStarText: function () {
            this._starText = new kity.Text('*').fill('red').setStyle({fontSize: '20px'});
            this.__addShape(this._starText);
        },
        _createExpandNode: function (nodeIdIndex, nodeLevel) {
            this._leftExpandTriangle = ExpandTriangle.create(nodeIdIndex, nodeLevel, this.__getEventDispatch(), 'left');
            this._rightExpandTriangle = ExpandTriangle.create(nodeIdIndex, nodeLevel, this.__getEventDispatch(), 'right');
            this.__addShape(this._leftExpandTriangle.__getShape());
            this.__addShape(this._rightExpandTriangle.__getShape());
            this._leftExpandTriangle.__hide();
            this._rightExpandTriangle.__hide();
        },
        _createPlusNode: function (nodeIdIndex) {
            this._leftPlus = Plus.create(nodeIdIndex, this.__getEventDispatch(), 'left', this._option);
            this._rightPlus = Plus.create(nodeIdIndex, this.__getEventDispatch(), 'right', this._option);
            this.__addShape(this._leftPlus.__getShape());
            this.__addShape(this._rightPlus.__getShape());
            this._leftPlus.__hide();
            this._rightPlus.__hide();
        },
        _createTextNode: function (nodeLevel, nodeIdIndex, text) {
            //获取该节点的样式
            var nodeStyle = this._nodeStyle = _nodeStyle,
                nodeWidth = this._minWidth,
                lang = this._option.langData,
                nodeHeight = this._minHeight;

            //添加此节点外框
            var rect = this._rectPathNode = new kity.Rect().setId(ID.getTextBorderId(nodeIdIndex));

            rect.setSize(nodeWidth, nodeHeight)
                .setRadius(nodeStyle.radius)
                .fill(nodeStyle.fill)
                .setStyle(nodeStyle.strokeStyle);
            this.__addShape(rect);

            var txt = nodeLevel > 1 ? lang['mdnode_branchname'] : lang['mdnode_centralname'];
            if (typeof text != 'undefined') {
                txt = text;
            }

            this._multipleText = MultipleText.create(nodeIdIndex, txt);
            this.__addShape(this._multipleText.__getShape());

        },
        _createInvisibleImage: function (nodeIdIndex) {
            this._fornVisibleImage = FornVisibleImage.create(this.__getShape().node, nodeIdIndex);
            this._fornVisibleImage.__setVisible(!this._mindNodeCore.getTextVisible());
        },
        setVisibleImageActive: function (active) {
            if (active) {
                this._fornVisibleImage.active();
            } else {
                this._fornVisibleImage.revert();
            }
        },
        getText: function () {
            return this._multipleText.getText();
        },
        setText: function (text) {
            this._multipleText.setText(text);
        },
        getTextNode: function () {
            return this._multipleText.__getShape();
        },
        getRectPathWidth: function () {
            return this._rectPathNode.getWidth();
        },
        getRectPathHeight: function () {
            return this._rectPathNode.getHeight();
        },
        getRectPath: function () {
            return this._rectPathNode;
        },
        updateRectPathFill: function () {
            if (this._mindNodeCore.getRequireChildren() && this._option.showRequireFill) {
                if (this._mindNodeCore.getChildren().length > 0) {
                    this._rectPathNode.fill(this._nodeStyle.requireCompletedFill);
                } else {
                    this._rectPathNode.fill(this._nodeStyle.fill);
                }
            }
        },
        draw: function (type, data) {
            var type = type || '';
            var node = this._getMindNode();
            switch (type) {
                case DRAW_TYPE_KEY.INIT:
                    //重新计算布局左右两侧三角按钮
                    this._expandTriangle(data && data.orientation);
                    break;
                case DRAW_TYPE_KEY.MOVE:
                    this.__getShape().translate(data.x, data.y);
                    this._leftPlus.__hide();
                    this._rightPlus.__hide();
                    if (!node.isRoot()) {
                        this._leftExpandTriangle.__hide();
                        this._rightExpandTriangle.__hide();
                        this._delBtn.setVisible(false);
                    }
                    break;
                case DRAW_TYPE_KEY.ACTIVE_EDIT_DISABLE:
                    //显示激活状态
                    this._rectPathNode.setStyle(this._nodeStyle.activeStrokeStyle);
                    this._leftPlus.__hide();
                    this._rightPlus.__hide();
                    this._leftExpandTriangle.updateHalfLine(false);
                    this._rightExpandTriangle.updateHalfLine(false);
                    this._delBtn.setVisible(false);
                    break;
                case DRAW_TYPE_KEY.ACTIVE:
                    //显示激活状态
                    this._rectPathNode.setStyle(this._nodeStyle.activeStrokeStyle);
                    if (node.isRoot()) {
                        var option = node.getOption();
                        if (option.type === 'both' || option.type === 'left') {
                            this._leftPlus.__show();
                        }
                        if (option.type === 'both' || option.type === 'right') {
                            this._rightPlus.__show();
                        }
                        this._leftExpandTriangle.updateHalfLine(true);
                        this._rightExpandTriangle.updateHalfLine(true);
                    } else {
                        if (data.eventType === DOM_EVENT_TYPE.TOUCH && node.getDeleteAble()) {
                            this._delBtn.setVisible(true);
                        }

                        var orientation = node.getOrientation();
                        if (data && data.orientation) {
                            orientation = data.orientation;
                        }

                        if (orientation === 'left') {
                            this._leftPlus.__show();
                            this._rightPlus.__hide();
                            this._leftExpandTriangle.updateHalfLine(true);
                            this._rightExpandTriangle.updateHalfLine(false);
                        } else {
                            this._leftPlus.__hide();
                            this._rightPlus.__show();
                            this._leftExpandTriangle.updateHalfLine(false);
                            this._rightExpandTriangle.updateHalfLine(true);
                        }
                    }
                    break;
                case DRAW_TYPE_KEY.REVERT:
                    //恢复非激活状态
                    this._rectPathNode.setStyle(this._nodeStyle.strokeStyle);
                    this._leftPlus.__hide();
                    this._rightPlus.__hide();
                    this._leftExpandTriangle.updateHalfLine(false);
                    this._rightExpandTriangle.updateHalfLine(false);
                    this._delBtn.setVisible(false);
                    break;
                case DRAW_TYPE_KEY.TEXT:
                    //文本变化，重新布局
                    if (typeof data.text !== 'undefined') {
                        this.setText(data.text);
                    }
                    if (node.getTextVisible()) {
                        this._fornVisibleImage.__setVisible(false);
                        this._multipleText.__show();
                    } else {
                        this._fornVisibleImage.__setVisible(true);
                        this._multipleText.__hide();
                    }
                    this.reLayout();
                    break;
            }
        },
        isActive: function () {
            return this._rectPathNode.node.style.stroke === this._nodeStyle.activeStrokeStyle.stroke.toRGB();
        },
        _expandTriangle: function (dataOrientation) {
            var node = this._getMindNode();
            var isRoot = node.isRoot();
            var isExpand = node.isExpand();
            var orientation = node.getOrientation();
            var isLeaf = node.isLeaf();


            //优先使用外部传入参数
            if (dataOrientation) {
                orientation = dataOrientation;
            }

            if (node.getLevel() === 2) {
                orientation = node.getOrientation();
            }

            //根节点优先使用自身
            if (isRoot) {
                orientation = node.getChildOrientation();
            }

            //左右两侧三角按钮是否显示
            if (!isLeaf) {

                if (orientation === 'both') {
                    this._leftExpandTriangle.__show();
                    this._rightExpandTriangle.__show();
                } else if (orientation === 'left') {
                    this._leftExpandTriangle.__show();
                    this._rightExpandTriangle.__hide();
                } else if (orientation === 'right') {
                    this._leftExpandTriangle.__hide();
                    this._rightExpandTriangle.__show();
                }
            } else {
                //叶子节点，隐藏两侧
                this._leftExpandTriangle.__hide();
                this._rightExpandTriangle.__hide();
            }

            //非根节点左右两侧内三角按钮朝向
            if (!isRoot) {
                if (orientation === 'left') {
                    this._leftExpandTriangle.update(isExpand);
                } else if (orientation === 'right') {
                    this._rightExpandTriangle.update(isExpand);
                }
                if (node.getTextVisible()) {
                    this._fornVisibleImage.__setVisible(false);
                    this._multipleText.__show();
                } else {
                    this._fornVisibleImage.__setVisible(true);
                    this._multipleText.__hide();
                }
            }

        },
        getTriangleFullWidth: function () {
            return this._leftExpandTriangle.getFullWidth() + _linePadding * 2;
        },
        //根节点，获取单个方向上的宽
        getOrientationFullWidth: function () {
            return this._rightExpandTriangle.getFullWidth() + this._rectPathNode.getWidth() + _linePadding * 2;
        },
        animateToPos: function (x, y, drawing, finish) {
            var that = this;
            var matrix = this.__getShape().getTransform();
            var targetMatrix = new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, x, y);
            return this.__animator({
                startVal: this.__getShape().getTransform(),
                finishVal: targetMatrix,
                draw: function (target, value) {
                    target.setMatrix(value);
                    drawing && drawing();
                },
                finish: function () {
                    that.__getShape().setAttr('status', 'init');
                    finish && finish();
                }
            });
        },
        setMatrix: function (matrix) {
            this.__getShape().setMatrix(matrix);
            this.__getShape().setAttr('status', 'init');
        },
        moveToPos: function (x, y) {
            var matrix = this.__getShape().getTransform();
            var targetMatrix = new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, x, y);
            this.__getShape().setMatrix(targetMatrix);
            this.__getShape().setAttr('status', 'init');
        },
        //文本的居中处理
        reLayout: function () {
            //获取文本实际大小
            var subWidth = 0,//文字不满一个空格时，居中处理
                minWidth = this._minWidth,
                paddingX = this._paddingX,
                paddingY = this._paddingY,
                requireChildren = this._mindNodeCore.getRequireChildren(),
                textStyle = this._multipleText.__getShape().getRenderBox(),
                //重置节点大小
                width = textStyle.width + paddingX * 2,
                height = textStyle.height + paddingY * 2,
                starBox = null,
                node = this._getMindNode(),
                showStar = (requireChildren && this._option.showRequireStar) && !node.isRoot();

            //限制最小宽度为60
            if (width < minWidth) {
                width = minWidth;
                subWidth = (width - textStyle.width - paddingX * 2) / 2
            }

            //限制最小高度
            if (height < _nodeStyle.height) {
                height = _nodeStyle.height;
            }

            if (showStar && !this._starText) {
                this._createRequireStarText();
            }

            if (this._starText) {
                this._starText.setVisible(showStar);
                if (showStar) {
                    starBox = this._starText.getRenderBox();
                }
            }

            //获取最新大小
            var rectBox;
            var matrix;
            if (this._getMindNode().getTextVisible()) {

                this._rectPathNode.setWidth(width);

                this._rectPathNode.setHeight(height);
                rectBox = this._rectPathNode.getRenderBox();
                matrix = this._rectPathNode.getTransform();
            } else {
                //图片处理
                var imageWidth = this._fornVisibleImage.__getWidth(), imageHeight = this._fornVisibleImage.__getHeight();
                //恢复初始宽高
                this._rectPathNode.setWidth(minWidth);
                this._rectPathNode.setHeight(_nodeStyle.height);
                rectBox = this._rectPathNode.getRenderBox();
                matrix = this._rectPathNode.getTransform();
                this._fornVisibleImage.__setMatrix(new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, rectBox.cx - imageWidth / 2, rectBox.cy - imageHeight / 2));
            }
            var textMatrix;
            if (Utils.isMobile) {
                //计算文本框大小 +1.5处理上下居中问题
                textMatrix = new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, matrix.m.e + paddingX + subWidth, matrix.m.f + paddingY + 2.5);
                this._multipleText.__getShape().setMatrix(textMatrix);
            } else {
                //计算文本框大小 +1.5处理上下居中问题
                textMatrix = new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, matrix.m.e + paddingX + subWidth, matrix.m.f + paddingY + 1);
                this._multipleText.__getShape().setMatrix(textMatrix);
            }


            //星号处理
            if (this._starText && showStar) {
                var startMatrix = new kity.Matrix(1, 0, 0, 1, textMatrix.m.e - starBox.width, textMatrix.m.f + starBox.height / 2 + 7);
                this._starText.setMatrix(startMatrix)
            }

            //左右两侧加号位置处理
            var leftPlusMatrix = new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, rectBox.left - this._leftPlus.getVisibleWidth() / 2 - _plusPadding, rectBox.cy);
            this._leftPlus.__getShape().setMatrix(leftPlusMatrix);
            this._rightPlus.__getShape().setMatrix(new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, rectBox.right + this._rightPlus.getVisibleWidth() / 2 + _plusPadding, rectBox.cy));

            //重新定位左右两侧的三角和线
            this._leftExpandTriangle.__getShape().setMatrix(new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, rectBox.left - this._leftExpandTriangle.getFullWidth() - _linePadding, rectBox.cy));
            this._rightExpandTriangle.__getShape().setMatrix(new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, rectBox.right + _linePadding, rectBox.cy));

            //删除按钮位置处理
            if (this._option.remarkVisible && (this._option.remarkEditAble || node.rtGetRemark() !== '')) {
                this._delBtn.setMatrix(new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, rectBox.left - this._delBtn.getWidth(), rectBox.top - this._delBtn.getHeight() - _delBtnPadding));
            } else {
                this._delBtn.setMatrix(new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, rectBox.cx - this._delBtn.getWidth() / 2, rectBox.top - this._delBtn.getHeight() - _delBtnPadding));
            }
        },
        _getMindNode: function () {
            return this._mindNodeCore;
        },
        destroy: function () {
            this.__destroy();
        }
    });


}(window, jQuery, __M));
/**
 * Created by ylf on 2016/6/28.
 */

(function (window, $, __M) {

    var KEY = __M.Config.EVENT_KEY;
    var Base = __M.Class.Base;
    var Logger = __M.Logger;
    var Utils = __M.Utils;


    __M.View.EditTextArea = Base({
        _text: '',
        _minWidth: 8,
        _html: '<textarea  class="mindMap_receiver mindMap_input" data-maxwidth="" data-minwidth="" data-minheight="" Keyboard-Offset-Y="75" style="" maxlength="160"></textarea><div class=" mindMap_receiver_shadow" contenteditable="plaintext-only"></div>',
        _$receiver: null,
        _$shadow: null,
        _clipboard: null,
        _scale: 1,
        _eventsInfo: [
            {nodeEvent: false, key: KEY.EDITTEXT_CHANGE_NODE, fucs: '_changePositionHandler', params: ['触发节点id', '显示x坐标', '显示y坐标', 'node']},
            {nodeEvent: false, key: KEY.EDITTEXT_SHOW, fucs: '_showHandler', params: ['触发节点id', '显示x坐标', '显示y坐标']},
            {nodeEvent: false, key: KEY.DOM_HIDE, fucs: '_domHideHandler', params: [ '是否需要动画绘制、默认true,除非传入false']}
        ],
        create: function (eventDispatch, $parent, clipboard, option) {
            var instance = Object.create(this);
            instance.__base(eventDispatch, instance._eventsInfo);
            instance._option = option;
            //添加到节点
            instance._append($parent);
            //绑定事件监听
            instance._bindEvent();
            instance._clipboard = clipboard;
            return instance;
        },
        _bindEvent: function () {
            var that = this;
            that._$receiver.autogrow({
                vertical: true,
                horizontal: true,
                flickering: true,
                body: $('#' + that._option.mindBodyId)[0]
                // , debugx: 10
                // , debugy: 20
            });
        },
        isVisible: function () {
            return this._$receiver.css('display') !== 'none';
        },
        _changePositionHandler: function (nodeId, x, y) {

            //当前显示并隐藏时，触发更新上一个节点文本事件
            if (this.isVisible()) {
                this.__triggerNodeEvent(KEY.NODE_TEXT_CHANGE, this.getText());
            }
            //设置基类当前新节点id
            this.__setNodeId(nodeId);
            //失去焦点
            this._$receiver.hide();
            this._$receiver.css({left: x + 2 + 'px', top: y + 4 + 'px'});
            this._$receiver.blur();
        },
        _showHandler: function (text, nodeId, x, y) {
            //获取一行的高度
            if (!this._minHeight) {
                this._$shadow.html('shadow');
                this._minHeight = this._$shadow.height();
                this._$receiver.attr('data-minheight', this._minHeight + 'px');
            }


            //获取完整的宽高信息
            var text = Utils.String.getTextLfToBr(text).replace(/&nbsp;/g, ' ');
            this._$shadow.html(text);
            var width = (this._$shadow.width() || 10) + 3.5;
            var height = this._$shadow.height();

            //居中处理
            var top = Utils.isMobile ? (y + 2) : (y + 4);
            this._$receiver.css({left: x + 2 + 'px', top: top + 'px', width: width + 'px', height: height + 'px'});


            var svgScale = (this._scale >= 1 ? this._scale : 1)

            this._$receiver.attr('data-minwidth', width + 'px');
            this._$receiver.css('transform', 'scale(' + svgScale + ')');
            this._$shadow.css('transform', 'scale(' + svgScale + ')');

            this._$receiver.show();
            var offset = this._$receiver.offset();
            var parent = this._$receiver.parent();
            var offsetParent = parent.offset();
            var parentWidth = parent.width();

            var cssMaxWidth = parseInt(this._$receiver.css('maxWidth'));
            var scale = this._$receiver[0].getBoundingClientRect().width / (this._$receiver.outerWidth() * svgScale);
            //计算出原始坐标系的宽度
            var maxWidth = (parentWidth - ( (offset.left - offsetParent.left) / scale ) - 15 * svgScale) / svgScale;
            this._$receiver.attr('data-scale', svgScale);
            if (maxWidth < cssMaxWidth) {
                this._$receiver.attr('data-maxwidth', maxWidth);
            } else {
                this._$receiver.attr('data-maxwidth', '');
            }
            this.setText(text);
            this._$receiver.trigger('input')
            //默认文本时需要全选
            var lang = this._option.langData;
            var needSelectAll = lang['mdnode_centralname'] === text || lang['mdnode_branchname'] === text;

            if (needSelectAll) {
                this._$receiver.select();
            } else {
                this._toLastWord(this._$receiver);
            }
        },
        _toLastWord: function (receiver) {
            receiver.focus();
            var len = receiver.val().length;
            if (document.selection) {
                var sel = receiver[0].createTextRange();
                sel.moveStart('character', len);
                sel.collapse();
                sel.select();
            } else if (typeof receiver[0].selectionStart == 'number' && typeof receiver[0].selectionEnd == 'number') {
                receiver[0].selectionStart = receiver[0].selectionEnd = len;
            }
        },
        setScale: function (scale) {
            this._scale = scale;
            if (this._scale < 1) {
                this._scale = 1;
            }
            this._$receiver.css('transform', 'scale(' + (this._scale >= 1 ? this._scale : 1) + ')');
        },
        _domHideHandler: function (animateLayout) {
            animateLayout = typeof  animateLayout === 'undefined' ? true : animateLayout;
            //触发节点失去焦点事件
            //当前显示并隐藏时，触发更新节点文本事件
            if (this.isVisible()) {
                this.__triggerNodeEvent(KEY.NODE_TEXT_CHANGE, this.getText(), animateLayout);
            }
            this._$receiver.blur();
            this._$receiver.hide();
        },
        _append: function ($target) {
            $target.append(this._html);
            this._$shadow = $target.find('.mindMap_receiver_shadow');
            this._$receiver = $target.find('.mindMap_receiver');
        },
        setText: function (text) {
            text = Utils.String.getTextBrToLf(text);
            text = text.replace(/&nbsp;/g, ' ');
            this._$receiver.val(text);
            return this;
        },
        getText: function () {
            var text = this._$receiver.val();
            text = Utils.String.getTextLfToBr(text);
            //移除空格
            text = text.replace(/&nbsp;/g, ' ');
            return text;
        },
        setVisible: function (visible) {
            if (visible) {
                this._$receiver.show();
            } else {
                this._$receiver.hide();
            }
        },
        destroy: function () {
            this.__destroy();
        }
    });

}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/30.
 */
(function (window, $, __M) {

    var KEY = __M.Config.EVENT_KEY;
    var Base = __M.Class.Base;

    __M.View.Remark = Base({
        _$view: null,
        _$input: null,
        _$parent: null,
        _clipboard: null,
        _nodeText: null,
        _option: null,
        _scale: 1,
        _eventInfos: [
            {nodeEvent: false, key: KEY.REMARK_SHOW, fucs: '_showHandler', params: ['触发显示的节点对象', 'visible']},
            {nodeEvent: false, key: KEY.DOM_HIDE, fucs: '_domHideHandler', params: []}
        ],
        _eventDispatch: null,
        create: function (eventDispatch, $parent, option) {
            var instance = Object.create(this);
            instance.__base(eventDispatch, instance._eventInfos);
            instance._option = option;
            instance._$parent = $parent;
            instance._append($parent);
            instance._bindEvent();
            return instance;
        },
        _append: function ($target) {
            var html = '<div class="mindMap_remark mindmap-tips-edit"><input data-minwidth="80" class="tip-txt" type="text" maxlength="300" value=""></div>';
            $target.append(html);
            this._$view = $target.find('.mindMap_remark');
            this._$input = this._$view.find('input');
        },
        _showHandler: function (node, visible) {
            if (!visible || (node && this._option.remarkEditAble === false && node.rtGetRemark() === '')) {
                this._domHideHandler(undefined, true)
                return;
            }
            if (!node || node.isRoot()) {
                return;
            }
            var that = this,
                $view = this._$view,
                $container = this._$parent,
                containerRect = $container[0].getBoundingClientRect(),
                containerScale = containerRect.width / $container.outerWidth(),
                curElementClientRect = node.getRectPath().node.getBoundingClientRect(),
                x,
                y,
                svgScale = this._scale,
                paddingLeft = parseInt($view.css('paddingLeft')),
                paddingRight = parseInt($view.css('paddingRight'))

            this._node = node;


            //求出容器内坐标距离
            var pos = {
                left: (curElementClientRect.left - containerRect.left) / containerScale,
                top: parseInt(( curElementClientRect.top - containerRect.top) / containerScale)
            };

            var maxWidth = (containerRect.width - (curElementClientRect.left - containerRect.left) - 15  );
            this._$input.attr('data-scale', svgScale);
            this._$input.attr('data-maxwidth', maxWidth / ( svgScale * containerScale) - paddingLeft - paddingRight);
            x = pos.left;
            y = parseInt(pos.top - this._$view.height() * svgScale - 10 * svgScale);
            that.__setNodeId(node.getNodeId());

            //设置居中显示
            that._$view.css({left: x + 'px', top: y + 'px'});
            that._$view.css('transform', 'scale(' + this._scale + ')');
            this._$input.val(node.rtGetRemark());
            this._$input.trigger('input');
            that._$view.show();
        },
        _domHideHandler: function (animateLayout, forceHide) {
            if (!this._node || !this._node.isActive() || forceHide) {
                this._$view.hide();
                this._$view.blur();
            }
        },
        getText: function () {
            return this._$input.val().trim();
        },
        _changePositionHandler: function (nodeId, x, y, node) {
            if (this.isVisible() && this._node) {
                this._node.rtSetRemark(this.getText())
                this._node = null
            }
        },
        _bindEvent: function () {
            var that = this;
            this._$input.autogrow({
                class: 'remark_auto',
                vertical: false,
                horizontal: true,
                flickering: true,
                addWidth: 1,
                body: $('#' + that._option.mindBodyId)[0]
                // , debugx: 10
                // , debugy: 20
            });
            //点击菜单项，发布菜单命令
            this._$view.on('mousedown touchstart', function (e) {
                // e.preventDefault();
                that.__triggerEvent(KEY.EDITTEXT_CHANGE_NODE, that._node.getNodeId(), 0, 0, this);
            });
            this._$input.on('input', function (e) {
                if (that._node) {
                    that._node.rtSetRemark(that.getText());
                }
            })
            if (!that._option.remarkEditAble) {
                that._$input.attr('disabled', 'disabled');
            }
        },
        isVisible: function () {
            return this._$view.css('display') !== 'none';
        },
        setScale: function (scale) {
            this._scale = scale;
            this._$view.css('transform', 'scale(' + this._scale + ')');
        },
        setVisible: function (visible) {
            if (visible) {
                this._$view.show();
            } else {
                this._$view.hide();
            }
        },
        destroy: function () {
            this.__destroy();
        }
    });

}(window, jQuery, __M));
(function (window, $, __M) {
    'use strict';

    var Base = __M.Class.Base;
    var KEY = __M.Config.EVENT_KEY;
    var Utils = __M.Utils;
    var DRAW_TYPE_KEY = __M.Config.DRAW_TYPE_KEY;
    var CHANGE_REASON = __M.Config.CHANGE_REASON;
    var ID = __M.ID;

    //连线
    var ConnectLine = __M.View.ConnectLine;
    var MindNode = __M.View.MindNode;
    var Logger = __M.Logger;
    var _nodeStyle = __M.Config.nodeStyle;

    var NodePosition = {
        create: function (option) {
            var instance = Object.create(this);
            for (var key in option) {
                instance[key] = option[key];
            }
            return instance;
        },
        nodeId: null,//节点Id
        x: null,
        y: null
    };

    var identifierCountId = 1;

    __M.MindNodeCore = Base({
        _nodeId: '',
        _containParentsId: '',
        _level: 1,
        _minder: null,//根节点
        _mindNode: null,//中间编辑框
        _connectGroup: null,//连线容器
        _connectLine: null,//连接到父节点的线
        _parent: null,//父节点
        _children: null,//子节点
        _root: null,//根节点
        _option: null,
        _remove: false,
        _textVisibleState: true,
        _rootRemark: null,
        _lastTextRectPathWidth: 0,//上次的文本框宽度
        _expand: true,//是否展开，默认是展开状态
        _identifier: '',//节点内部唯一标识
        create: function (option, minder, eventDispatch, connectGroup, parent, text, textVisible, paper, requireChildren) {
            option.nodeIndex++;//自动添加索引
            var nodeId = ID.getNodeId(option.nodeIndex);
            var instance = Object.create(this);
            //调用基类方法
            instance.__base(eventDispatch, instance._eventsInfo, nodeId);

            instance._nodeId = nodeId;
            instance._minder = minder;
            instance._rootRemark = {};
            instance._connectGroup = connectGroup;
            instance._parent = parent;
            //根节点与其他节点赋值逻辑分开处理
            if (parent) {
                instance._root = parent.getRoot();
                instance._level = parent.getLevel() + 1;
            } else {
                instance._paper = paper;
                instance._root = instance;
                instance._level = 1;
                //根节点特有的对象属性，记录所有节点的位置信息
                instance.positionRecord = {};
            }
            instance._makeContainParentsId();
            instance._textVisibleState = typeof textVisible !== 'undefined' ? textVisible : true;
            instance.setRequireChildren(!!requireChildren);
            instance._children = [];
            instance._option = option;

            instance._mindNode = MindNode.create(instance._nodeId, option.nodeIndex, eventDispatch, instance, text);

            if (instance.isRoot()) {
                instance.positionRecord[nodeId] = NodePosition.create({
                    x: 0,
                    y: 0,
                    innerRectX: 0,
                    innerRectY: 0,
                    innerRectWidth: instance.getRectPath().getWidth(),
                    innerRectHeight: instance.getRectPath().getHeight(),
                    containParentId: null,
                    visible: true
                });
            }

            return instance;
        },
        getMindNodeShape: function () {
            return this._mindNode.__getShape();
        },
        layoutBox: function () {
            return this._mindNode.reLayout();
        },
        getLayoutBox: function () {
            return this._mindNode.getLayoutBox();
        },
        getRectPath: function () {
            return this._mindNode.getRectPath();
        },
        bringTop: function () {
            return this._mindNode.bringTop();
        },
        getCurNodePosition: function () {
            var that = this;
            var matrix = that.getTransform();
            var curRectPath = that.getRectPath();
            var curRectPathMatrix = curRectPath.getTransform();
            return {
                x: matrix.m.e,
                y: matrix.m.f,
                innerRectX: matrix.m.e - curRectPathMatrix.m.e,
                innerRectY: matrix.m.f - curRectPathMatrix.m.f,
                innerRectWidth: curRectPath.getWidth(),
                innerRectHeight: curRectPath.getHeight(),
                containParentId: that.getContainParentsId(),
                nodeId: that.getNodeId(),
                visible: that.getMindNodeShape().node.getAttribute("display") !== 'none'
            };
        },
        //递归初始化节点宽高、线条显示信息
        trvDrawInit: function (orientation) {
            var that = this;
            if (!orientation || orientation === 'both') {
                var level = that.getLevel();
                //二级节点需要判断渲染方向
                if (level === 2) {
                    orientation = that.getOrientation();
                }
            }
            that.draw(DRAW_TYPE_KEY.INIT, {orientation: orientation});
            this.getChildren().forEach(function (child) {
                child.trvDrawInit(orientation);
            });
        },
        drawBeforeMove: function () {
            this.trvHide(true);
        },
        drawMove: function (x, y) {
            var that = this;
            that.draw(DRAW_TYPE_KEY.MOVE, {x: x, y: y});
        },
        drawAfterMove: function (x, y) {
            this.getChildren().forEach(function (child) {
                child.draw(DRAW_TYPE_KEY.MOVE, {x: x, y: y});
                child.drawAfterMove(x, y);
            });
        },
        //更改兄弟关系
        drawAndChangeBroRelation: function (coverId, coverDirection) {
            var orientation = '';
            //节点方向改变，更新数据结构。确保更改兄弟关系：上下移动时，不改变到结构
            if (this.getLevel() === 2) {
                this.resetRootChildrenSort();
            }
            var flag = this.changeBroRelation(coverId, coverDirection);
            if (this.getOrientation() !== this.getLastOrientation()) {
                orientation = 'both';
            }

            if (flag.flag) {
                //初始化节点
                this.layout({global: true, orientation: orientation, reason: flag.relationChange ? CHANGE_REASON.BRO_RELATION : CHANGE_REASON.MOVE});
            }
            return flag;
        },
        //更改节点父子关系
        drawChildAppend: function (node) {
            var that = this;
            var oldParent = node.getParent();
            that.appendChild(node);
            if (!that.isExpand()) {
                //展开当前节点
                that.setExpand(true);
                //显示节点
                that.trvShow();
            }
            var orientation = '';
            if (node.getOrientation() !== node.getLastOrientation()) {
                orientation = 'both';
            }
            //节点方向改变，更新数据结构。确保更改兄弟关系：上下移动时，不改变到结构
            if (this.isRoot()) {
                this.resetRootChildrenSort();
            }
            //初始化当前节点状态
            that.draw(DRAW_TYPE_KEY.INIT);
            //更新旧父节点样式
            oldParent.draw(DRAW_TYPE_KEY.INIT);
            this.layout({global: true, orientation: orientation, reason: CHANGE_REASON.PARENT_CHANGE});
        },
        //删除重绘新增
        drawDelete: function () {
            var that = this;

            var orientation = that.getOrientation();
            var gloDraw = true;
            if (that.getParent().isRoot()) {
                var children = that.getParent().getChildByOrientation(orientation);
                if (children.length === 1) {
                    gloDraw = false;
                }
            } else {
                if (that.getCenterSub() === 0
                    && that.getChildHeight() <= _nodeStyle.height
                    && that._mindNode.getRectPathHeight() <= _nodeStyle.height
                    && that.getParent().getChildrenCount() <= 1) {
                    gloDraw = false;
                }
            }
            var parent = this.getParent();
            this.destroy();
            if (gloDraw) {
                this.layout({global: true, orientation: orientation, reason: CHANGE_REASON.DELETE});
            } else {
                parent.draw(DRAW_TYPE_KEY.INIT);
                parent.layout({reason: CHANGE_REASON.DELETE});
            }
        },
        //文本显示隐藏、内容变化
        drawTextChange: function (text, animate) {
            var that = this;
            var current = this.getText();
            that.draw(DRAW_TYPE_KEY.TEXT, {text: text});
            var rectPathWidth = that._mindNode.getRectPathWidth();
            var rectPathHeight = that._mindNode.getRectPathHeight();
            //大小发生变化，重绘节点
            var reason = '';
            if (current !== text) {
                reason = CHANGE_REASON.TEXT_CONTENT;
            }
            if (that._lastTextRectPathWidth !== rectPathWidth && that._lastTextRectPathHeight === rectPathHeight) {
                this.layout({reason: reason, includeSelf: true, animate: (animate === false ? animate : that._option.animate)});
            } else if (that._lastTextRectPathHeight !== that._mindNode.getRectPathHeight()) {
                //高度变化重绘所有节点
                //重绘时导致当前节点移除了可视范围，重绘后进行居中处理
                if (Utils.isMobile) {
                    this.__triggerEvent(KEY.NODE_CENTER, this.getNodeId());
                }
                //移动端键盘不需要动画
                if (Utils.isMobile) {
                    animate = false;
                }
                this.layout({global: true, reason: reason, animate: animate});
            } else {
                if (reason) {
                    this.onChange(reason);
                }
            }

        },
        //节点展开、收起
        drawExpandChange: function () {
            var that = this;
            this.setExpand(!this._expand);
            that.trvShow();
            //初始化当前节点
            that.draw(DRAW_TYPE_KEY.INIT);
            //只有一个节点不需要全局绘制
            var children = that.getChildren();
            var global = true;
            if (children.length === 1 && children[0].isLeaf()) {
                global = false;
            }
            this.layout({global: global, reason: CHANGE_REASON.EXPAND});
        },
        //mouseup/touchend触发
        drawUp: function (eventType, hasDraw, hasMove) {
            var that = this;
            var lastOrientation = that._lastOrientation;
            //与上次方向不一致，重新计算并绘制
            if (that.getOrientation() !== lastOrientation && !that.isRoot() && !hasDraw) {
                var type = this._option.type;

                //单侧模式下，不处理绘制
                if (type === 'left' || type === 'right') {
                    this.draw(DRAW_TYPE_KEY.ACTIVE, {eventType: eventType});
                    //触发绘制结束
                    that.__triggerEvent(KEY.NODE_DRAWING, 'end');
                    return;
                }
                if (that.getLevel() === 2) {
                    this.draw(DRAW_TYPE_KEY.ACTIVE, {eventType: eventType});
                    that.getRoot().trvDrawInit();
                    this.layout({global: true, orientation: 'both', reason: CHANGE_REASON.ORIENTATION_CHANGE});
                } else {
                    //非二级节点归回原位
                    this.draw(DRAW_TYPE_KEY.ACTIVE, {eventType: eventType, orientation: lastOrientation});
                    that.trvDrawInit(lastOrientation);
                    this.layout({global: true, orientation: lastOrientation, reason: CHANGE_REASON.MOVE});
                }
            } else {
                this.draw(DRAW_TYPE_KEY.ACTIVE, {eventType: eventType});
                //初始化状态
                that.trvDrawInit();
                var matrix = that.getTransform();
                //位置有变化，重新设置该节点的位置
                that.setToPosition(matrix.m.e, matrix.m.f);
                if (!hasDraw && hasMove) {
                    if (that.isRoot()) {
                        this.onChange(CHANGE_REASON.MINDER_MOVE);
                    } else {
                        this.onChange(CHANGE_REASON.MOVE);
                    }
                }
                if (!hasDraw) {
                    //触发绘制结束
                    that.__triggerEvent(KEY.NODE_DRAWING, 'end');
                }
            }
            //移动结束时，显示所有节点
            that.trvShow();
        },
        //子节点新增
        drawAddChildren: function (orientation) {
            var that = this;
            var node = that.addNode({orientation: orientation});
            if (!that.isExpand()) {
                //展开当前节点
                that.setExpand(true);
                //显示节点
                that.trvShow();
            }
            //初始化当前节点状态
            that.draw(DRAW_TYPE_KEY.INIT);
            //只有一个节点，不需要全局绘制
            if (that.getChildrenCount() === 1) {
                this.layout({reason: CHANGE_REASON.ADD});
            } else {
                //根据新增节点的方向，绘制某一侧即可
                orientation = node.getOrientation();
                this.layout({global: true, orientation: orientation, reason: CHANGE_REASON.ADD});
            }
        },
        drawFocusEditDisable: function () {
            this.draw(DRAW_TYPE_KEY.ACTIVE_EDIT_DISABLE, {});
        },
        draw: function (type, data) {
            var that = this;
            data = data || {};
            type = type || '';
            that._preDraw(type, data);
            that._drawing(type, data);
            that._afterDraw(type, data);
        },
        _preDraw: function (type, data) {
            var that = this;
            switch (type) {
                case DRAW_TYPE_KEY.ACTIVE:
                    //获取上一次的位置
                    this._lastOrientation = that.getOrientation();
                    break;
                case DRAW_TYPE_KEY.TEXT:
                    that._lastTextRectPathWidth = that._mindNode.getRectPathWidth();
                    that._lastTextRectPathHeight = that._mindNode.getRectPathHeight();
                    break;
                case DRAW_TYPE_KEY.INIT:

                    break;
            }
        },
        _drawing: function (type, data) {
            var that = this;
            this._mindNode.draw(type, data);
            //处理子节点绘制
            switch (type) {
                case DRAW_TYPE_KEY.INIT:
                    //维护最新id关系字符串
                    if (that.isRoot() === false) {
                        that._makeContainParentsId();
                    }
                    that.getRoot().rtSetPosRecord(that.getNodeId(), that.getCurNodePosition());
                    //重新计算是否需要显示
                    if (data.orientation) {
                        this._lastOrientation = data.orientation;
                    }
                    break;
            }
        },
        _afterDraw: function (type, data) {
            var that = this;
            if (type === DRAW_TYPE_KEY.MOVE) {
                //移动后重新计算是否显示根节点左右两侧的线条
                if (this.getLevel() === 2) {
                    this.getRoot().draw(DRAW_TYPE_KEY.INIT);
                }
            }
            if (that._connectLine) {
                that._connectLine.draw(type, data);
            }
        },
        onChange: function (type) {
            if (this._option.onChange) {
                this._option.onChange(type);
            }
        },
        getLastOrientation: function () {
            return this._lastOrientation;
        },
        isExpand: function () {
            return this._expand;
        },
        setExpand: function (expand) {
            this._expand = expand;
        },
        appendNode: function (orientation, absOrientation) {
            var that = this;

            absOrientation = typeof absOrientation === typeof undefined ? false : absOrientation;
            that._minder.addShape(that._mindNode.__getShape());
            //添加到节点后重新布局、文本居中显示
            that._mindNode.reLayout();

            var autoRideCount = this._option.autoRideCount;

            //先初始化位置
            if (!that.isRoot()) {
                var matrix = this.getParent().getTransform();
                //加减50来标记左右方向
                var cy = matrix.m.f + this.getParent()._mindNode.getRectPathHeight() / 2 - this._mindNode.getRectPathHeight() / 2;
                var targetMatrix = new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, orientation === 'left' ? matrix.m.e - 50 : matrix.m.e + 50, cy);
                //统一使用matrix来进行位置偏移
                this.getMindNodeShape().setMatrix(targetMatrix);


                //根节点自动排版算法，左右数量平衡
                if (that.getParent().isRoot() && !absOrientation) {
                    var leftCount = that.getRoot().getChildByOrientation('left').length;
                    var rightCount = that.getRoot().getChildByOrientation('right').length;
                    if (orientation === 'left' && leftCount > autoRideCount && (leftCount - 1) > rightCount) {
                        orientation = 'right';
                    } else if (orientation === 'right' && rightCount > autoRideCount && (rightCount - 1) > leftCount) {
                        orientation = 'left';
                    }
                    //再次设置初始位置
                    var matrix = this.getParent().getTransform();
                    //加减50来标记左右方向
                    var cy = matrix.m.f + this.getParent()._mindNode.getRectPathHeight() / 2 - this._mindNode.getRectPathHeight() / 2;
                    var targetMatrix = new kity.Matrix(matrix.m.a, matrix.m.b, matrix.m.c, matrix.m.d, orientation === 'left' ? matrix.m.e - 50 : matrix.m.e + 50, cy);
                    //统一使用matrix来进行位置偏移
                    this.getMindNodeShape().setMatrix(targetMatrix);
                }

                this._connectLine = ConnectLine.create(that);
                this._connectGroup.addShape(this._connectLine.__getShape());
            }

        },
        setIdentifier: function (_identifier) {
            this._identifier = _identifier;
        },
        addNode: function (data, index, absOrientation) {
            var that = this;
            var textVisible = that._option.ignoreAttrTextVisible ? true : data.textVisible;
            absOrientation = absOrientation || false;
            //创建节点O
            var node = __M.MindNodeCore.create(this._option, this._minder, this.___eventDispatch, this._connectGroup, this, data.text, textVisible, null, data.requireChildren);
            node.setExtendProperties(data);
            //防止出现重复id
            if (data.identifier && data.identifier > identifierCountId) {
                identifierCountId = data.identifier + 100;
            }
            node.setIdentifier(data.identifier || identifierCountId++);
            //添加到子节点队列
            that.insertChild(node, index);
            //添加到svg
            node.appendNode(data.orientation, absOrientation);

            return node;
        },
        setMatrix: function (matrix) {
            this._mindNode.setMatrix(matrix);
        },
        setText: function (text) {
            this._mindNode.setText(text);
        },
        getText: function () {
            var text = this._mindNode.getText();
            return text;
        },
        setTextVisible: function (visible) {
            this._textVisibleState = visible;
        },
        toggleTextVisible: function () {
            this.setTextVisible(!this._textVisibleState);
        },
        getTextVisible: function () {
            return this._textVisibleState;
        },
        isActive: function () {
            return this._mindNode.isActive();
        },
        getOption: function () {
            return this._option;
        },
        trvHide: function (excludeSelf) {
            //隐藏当前结点和所有子节点
            if (excludeSelf !== true) {
                this.hide();
            }
            this.getChildren().forEach(function (child) {
                child.trvHide();
            });
        },
        hide: function () {
            this._mindNode.__hide();
            if (this._connectLine) {
                this._connectLine.__hide();
            }
        },
        show: function () {
            //显示当前结点
            this._mindNode.__show();
            if (this._connectLine) {
                this._connectLine.__show();
                //重绘线条
                this._connectLine.draw();
            }
        },
        trvShow: function () {
            //显示当前结点
            this.show();
            //重新计算线条位置
            this.getChildren().forEach(function (child) {
                //展开状态下才显示子节点
                if (child.getParent().isExpand()) {
                    child.trvShow();
                } else {
                    child.trvHide();
                }
            });
        },

        _trvRemoveShape: function () {
            this.getMindNodeShape().remove();
            if (this._connectLine) {
                this._connectLine.__getShape().remove();
            }
            this.getChildren().forEach(function (child) {
                child._trvRemoveShape();
            });
        },
        trvRemove: function () {
            var parent = this.getParent();
            this._trvRemoveShape();
            parent.removeChild(this);
        },
        _destroy: function () {
            //移除节点
            this.getMindNodeShape().remove();
            this._mindNode.destroy();
            if (this._connectLine) {
                this._connectLine.__getShape().remove();
                this._connectLine.destroy();
            }
            //销毁子节点
            this.getChildren().forEach(function (child) {
                child._destroy();
            });
            //移除事件绑定
            this.__destroy();
        },
        destroy: function () {
            //递归销毁
            this._destroy();

            //从父节点移除
            if (!this.isRoot()) {
                this.getParent().removeChild(this);
                this._remove = true;
            }
            // delete this.getRoot()._rootRemark[this._identifier]
        },
        isRemove: function () {
            return this._remove;
        }
    });

}(window, jQuery, __M));
(function (window, $, __M) {
    'use strict';


    var _nodeStyle = __M.Config.nodeStyle;
    var Logger = __M.Logger;
    var KEY = __M.Config.EVENT_KEY;

    //根节点相关方法
    var MindNodeAnimate = {
        _paddingBottom: _nodeStyle.height + 4,
        _lineXToParentX: 70,//线离父节点的x轴距离
        _heightChild: 0,//子节点总高度
        _centerSub: 0,//子节点相对父节点的中心点便宜值，+向上便宜，-向下偏移
        _toX: 0,
        _toY: 0,
        getChildHeight: function () {
            return this._heightChild;
        },
        setChildHeight: function (heightChild) {
            this._heightChild = heightChild;
        },
        getCenterSub: function () {
            return this._centerSub;
        },
        setCenterSub: function (centerSub) {
            this._centerSub = centerSub;
        },
        getToPosition: function () {
            var that = this;
            //指定根节点位置，位置不变
            if (this.isRoot()) {
                var renderBox = this._mindNode.__getShape().getTransform();
                return {
                    cx: renderBox.m.e,
                    cy: renderBox.m.f
                };
            }
            return {
                cx: that._toX,
                cy: that._toY
            };
        },
        setToPosition: function (x, y) {
            this._toX = x;
            this._toY = y;
        },
        _mathChildPos: function (children, orientation) {
            var that = this;
            var isRoot = that.isRoot();


            //获取父节点位置
            var renderBox = that.getRectPathRenderBox();
            var parentPos = that.getToPosition();
            parentPos.cy = parentPos.cy + (renderBox.height / 2);
            //单个方向上的宽度
            var orientationWidth = that._mindNode.getOrientationFullWidth();

            //左侧或右侧
            var isLeft = that.getOrientation() === 'left';
            //优先使用传入的方向
            if (orientation) {
                isLeft = orientation === 'left';
            }
            var positionInfo = [];
            var totalHeight = 0;
            //单个节点
            if (children.length === 1) {
                var cx = parentPos.cx;

                if (isRoot) {
                    isLeft = children[0].getOrientation() === 'left';
                }
                var x;
                var y;
                if (isLeft) {
                    //子节点文本矩形宽
                    var rectPathWidth = children[0]._mindNode.getRectPathWidth();
                    //左侧线宽
                    var triangleLineWidth = that.getTriangleFullWidth();
                    x = cx - rectPathWidth - triangleLineWidth;
                    //y居中
                    y = parentPos.cy - children[0]._mindNode.getRectPathHeight() / 2;
                } else {
                    x = cx + orientationWidth;
                    //y居中
                    y = parentPos.cy - children[0]._mindNode.getRectPathHeight() / 2;
                }
                children[0].setToPosition(x, y);
                children[0].trvMathChildPosition(orientation);
            } else if (children.length > 1) {
                //计算子节点总高度
                children.forEach(function (child, i) {
                    var childPathBox = child.getRectPathRenderBox();
                    var infos = {
                        exSpace: false,
                        height: childPathBox.height,//节点高度
                        space: 0,//距离下面节点的高度
                        x: 0,
                        y: 0
                    };

                    //子节点中心偏移
                    var centerSub = child.getCenterSub();
                    //获取节点高度
                    var childHeight = child.getChildHeight();

                    var halfPadding = that._paddingBottom / 2;

                    //计算上下间距
                    var topSpace, bottomSpace;
                    if (i === 0) {
                        //最上面节点，下间距：（子节点高度-中心点便宜-节点高度）/2
                        topSpace = bottomSpace = (childHeight - centerSub - childPathBox.height) / 2;
                    } else if (i === children.length - 1) {
                        //最下面节点，上间距：（子节点高度-节点高度+中心点便宜）/2
                        topSpace = bottomSpace = (childHeight + centerSub - childPathBox.height) / 2;
                    } else {
                        //居于内部节点
                        //上间距：
                        topSpace = (childHeight - childPathBox.height + centerSub) / 2;
                        //下间距
                        bottomSpace = (childHeight - childPathBox.height - centerSub ) / 2.;
                    }

                    //没有子节点，使用默认间距
                    bottomSpace = bottomSpace < halfPadding ? halfPadding : bottomSpace;
                    topSpace = topSpace < halfPadding ? halfPadding : topSpace;

                    //由子节点计算出的间距，需要加上默认间距
                    if (bottomSpace > halfPadding) {
                        bottomSpace += halfPadding;
                    }
                    if (topSpace > halfPadding) {
                        topSpace += halfPadding;
                    }

                    //重新计算上一个节点的space空间
                    if (i > 0) {
                        //分给上一个节点的空间，重新计算总高度
                        positionInfo[i - 1].space += topSpace;
                        totalHeight += topSpace;
                    }

                    //计算总大小
                    if (i < children.length - 1) {
                        totalHeight += childPathBox.height + bottomSpace;
                    }
                    else {
                        totalHeight += childPathBox.height;
                    }
                    var x;
                    if (isLeft) {
                        //子节点文本矩形宽
                        var rectPathWidth = child._mindNode.getRectPathWidth();
                        //左侧线宽
                        var triangleLineWidth = that.getTriangleFullWidth();
                        x = parentPos.cx - rectPathWidth - triangleLineWidth - that._lineXToParentX;
                    } else {
                        x = parentPos.cx + orientationWidth + that._lineXToParentX;
                    }

                    infos.space = bottomSpace;
                    infos.x = x;
                    positionInfo.push(infos);
                });
                //计算每个节点相对根节点的坐标位置
                var lastTop = parentPos.cy - totalHeight / 2;
                var lastInfo;
                positionInfo.forEach(function (info, index) {
                    if (lastInfo) {
                        info.y = lastInfo.y + lastInfo.space + lastInfo.height;
                        lastInfo = info;
                    } else {
                        info.y = lastTop;
                        lastInfo = info;
                    }
                    //设置子节点位置
                    children[index].setToPosition(info.x, info.y);
                    //触发递归计算
                    children[index].trvMathChildPosition(orientation);
                });
            }
        },
        //计算新建的坐标位置
        trvMathChildPosition: function (orientation) {
            var that = this;
            if (this.isLeaf()) {
                return 0;
            }
            var isRoot = that.isRoot();
            if (isRoot) {
                if (orientation === 'left' || orientation === 'right') {
                    that._mathChildPos(that.getChildByOrientation(orientation), orientation);
                } else {
                    that._mathChildPos(that.getChildByOrientation('left'), 'left');
                    that._mathChildPos(that.getChildByOrientation('right'), 'right');
                }
            } else {
                var children = that.getChildren();
                that._mathChildPos(children, orientation);
            }
        },
        //计算当前节点高度、位置
        trvMathChildHeight: function (orientation) {
            var that = this;
            var height = 0;
            var centerSub = 0;
            var children;
            if (that.isRoot() && (orientation === 'left' || orientation === 'right')) {
                children = this.getChildByOrientation(orientation);
            } else {
                children = that.getChildren();
            }
            //子节点数大于0且展开状态才计算高度
            if (children.length > 0 && that.isExpand()) {
                children.forEach(function (child, i) {
                    var childPos = {
                        height: 0
                    };
                    var childHeight;
                    var childCenterSub;

                    var box = child.getRectPathRenderBox();
                    //叶子节点不计算高度
                    if (child.isLeaf()) {
                        childHeight = box.height;
                        //重置节点高度
                        child.setChildHeight(0);
                        childCenterSub = 0;
                    } else if (!child.isExpand()) {
                        //未展开，当成是叶子节点处理
                        childHeight = box.height;
                        //重置节点高度
                        child.setChildHeight(0);
                        childCenterSub = 0;
                    } else {
                        childPos = child.trvMathChildHeight();

                        childHeight = childPos.height;
                        childCenterSub = childPos.centerSub;
                        ////子节点高度小于节点高度，父节点取该节点高度
                        if (box.height > childPos.height) {
                            childHeight = box.height;
                            //childCenterSub = box.height / 2;
                        }
                    }


                    //计算偏差值,公式：偏移=第一个节点子节点高度/2-最后一个节点子节点高度/2
                    if (children.length > 1) {
                        if (i === 0) {
                            //节点高度大于子节点高度，中心偏移值取第一个子节点偏移
                            if (box.height > childPos.height) {
                                centerSub = childCenterSub;
                            } else {
                                //高度比子节点小：平均偏移值+左右一个子节点偏移值
                                centerSub = childCenterSub + (childHeight - box.height) / 2;
                            }
                        } else if (i === children.length - 1) {
                            if (box.height > childPos.height) {
                                centerSub = centerSub - childCenterSub;
                            } else {
                                centerSub = centerSub - childCenterSub - (childHeight - box.height) / 2;
                            }

                        }
                    }

                    //每个节点间默认间隔
                    if (i > 0) {
                        childHeight += that._paddingBottom;
                    }
                    height += childHeight;

                });
            }
            that.setChildHeight(height);//本节点高度
            that.setCenterSub(centerSub);
            Logger.debug('child-height:', this.getNodeId(), height, centerSub);
            return {
                height: height,
                centerSub: centerSub
            };
        },
        layout: function (param) {
            param = param || {};
            var global = param.global || false;
            //方向
            var orientation = param.orientation || this.getOrientation();
            //优先取外部传入的动画配置
            var animate = ( param.animate === true || param.animate === false) ? param.animate : this._option.animate;
            //默认需要计算
            var mathPos = ( param.mathPos === true || param.mathPos === false) ? param.mathPos : true;
            //是否绘制本节点
            var includeSelf = param.includeSelf || false;
            //是否绘制本节点
            var reason = param.reason || '';
            //触发原因
            var onComplete = param.onComplete || function () {
                };
            if (global === true) {
                this._gloDraw(orientation, animate, mathPos, reason, onComplete);
            } else {
                this._childDraw(includeSelf, reason, onComplete,animate);
            }
        },
        _gloDraw: function (orientation, animate, mathPos, reason, onComplete) {
            var that = this;
            if (mathPos) {
                //计算所有节点的高度
                that.getRoot().trvMathChildHeight(orientation);
                //计算所有节点位置
                that.getRoot().trvMathChildPosition(orientation);
            }
            //重新排版
            that.__triggerEvent(KEY.NODE_DRAWING, 'start');
            if (animate === true) {
                that.getRoot().trvAnimate(function () {
                    //初始化所有节点控件
                    that.getRoot().trvDrawInit();
                    onComplete();
                    that.__triggerEvent(KEY.NODE_DRAWING, 'end');
                    that.onChange(reason);
                }, orientation);
            } else {
                that.getRoot().trvMoveChildrenPos(orientation);
                that.getRoot().trvDrawInit();
                onComplete();
                that.__triggerEvent(KEY.NODE_DRAWING, 'end');
                that.onChange(reason);
            }
        },
        _childDraw: function (includeSelf, reason, onComplete,animate) {
            var that = this;
            var orientation = that.getOrientation();

            //计算所有节点的高度
            that.trvMathChildHeight();
            that.__triggerEvent(KEY.NODE_DRAWING, 'start', reason);
            //重新计算自身位置
            //获取目前的位置
            var matrix = that.getTransform();
            that.setToPosition(matrix.m.e, matrix.m.f);
            //左侧节点，绘制自身。右侧会自动计算坐标，不需要重绘
            if (includeSelf && orientation === 'left') {
                that.mathSelfPosition();
                that.moveNode();
                that._connectLine.draw();
            }

            //计算所有节点位置
            that.trvMathChildPosition(orientation);
            if (animate) {
                //重新排版
                that.trvAnimate(function () {
                    //初始化节点控件
                    that.trvDrawInit(orientation);
                    that.__triggerEvent(KEY.NODE_DRAWING, 'end', reason);
                    onComplete();
                    that.onChange(reason);
                });
            } else {
                that.trvMoveChildrenPos();
                that.trvDrawInit(orientation);
                that.__triggerEvent(KEY.NODE_DRAWING, 'end', reason);
                onComplete();
                that.onChange(reason);
            }
        },
        trvAnimate: function (finish, orientation) {
            var complex = this.getComplex(orientation);

            //所有动画都结束后回调
            function consume() {
                if (!--complex) {
                    if (finish) {
                        finish();
                    }
                }
            }

            this.trvAnimateChildren(function () {
                //处理性能较差的情况
                consume();
            }, orientation);

            if (complex === 0) {
                if (finish) {
                    finish();
                }
            }
        },
        trvAnimateChildren: function (finish, orientation) {
            var that = this;
            var children;
            if (that.isRoot() && (orientation === 'left' || orientation === 'right')) {
                children = that.getChildByOrientation(orientation);
            } else {
                children = that.getChildren();
            }

            //触发父节点进行子节点绘制
            children.forEach(function (child, i) {
                //只需要添加一个回调
                //if (child.getMindNodeShape().node.getAttribute("display") !== 'none') {
                    child.animateNode(finish);
                //} else {
                //    child.moveNode();
                //    if (finish) {
                //        finish();
                //    }
                //}
                child.trvAnimateChildren(finish);
            });
        },
        trvMoveChildrenPos: function (orientation) {
            var that = this;
            //触发父节点进行子节点绘制
            var children;
            if (that.isRoot() && (orientation === 'left' || orientation === 'right')) {
                children = that.getChildByOrientation(orientation);
            } else {
                children = that.getChildren();
            }
            children.forEach(function (child, i) {
                var pos = child.getToPosition();
                //只需要添加一个回调
                child._mindNode.moveToPos(pos.cx, pos.cy);
                child.trvMoveChildrenPos();
            });
        },
        moveNode: function () {
            var pos = this.getToPosition();
            //只需要添加一个回调
            this._mindNode.moveToPos(pos.cx, pos.cy);
        },
        animateNode: function (finish) {
            var that = this;
            var pos = that.getToPosition();
            if (that._layoutTimeline) {
                that._layoutTimeline.stop();
                that._layoutTimeline = null;
            }
            that._layoutTimeline = that._mindNode.animateToPos(pos.cx, pos.cy, function () {
                that._connectLine.draw('animate');
            }, function () {
                that._layoutTimeline = null;
                //兼容性能问题
                setTimeout(function () {
                    that._connectLine.draw();
                    if (finish) {
                        finish();
                    }
                }, 100);
            });
        },
        mathSelfPosition: function () {
            var that = this;
            //子节点文本矩形宽
            var rectPathWidth = that._mindNode.getRectPathWidth();

            //左侧线宽
            var x = that._toX - ( rectPathWidth - that._lastTextRectPathWidth );
            that.setToPosition(x, that._toY);
        }
    };


    //扩展类
    __M.MindNodeCore.__include(MindNodeAnimate);

}(window, jQuery, __M));
(function (window, $, __M) {
    'use strict';

    var KEY = __M.Config.EVENT_KEY;
    var MENU_TYPE_KEY = __M.Config.MENU_TYPE_KEY;
    var DRAW_TYPE_KEY = __M.Config.DRAW_TYPE_KEY;
    var Logger = __M.Logger;


    //事件处理
    var MindNodeEventHandler = {
        _eventsInfo: [
            {nodeEvent: true, key: KEY.NODE_DOWN, fucs: '_downHandler', params: ['触发的事件类型']},
            {nodeEvent: true, key: KEY.NODE_MOVE, fucs: '_moveHandler', params: ['x轴偏移', 'y轴偏移']},
            {nodeEvent: true, key: KEY.NODE_DBLCLICK, fucs: '_dbClickHandler', params: []},
            {nodeEvent: true, key: KEY.NODE_CLICK, fucs: '_clickHandler', params: []},
            {nodeEvent: true, key: KEY.NODE_TEXT_CHANGE, fucs: '_textChangeHandler', params: ['是否需要动画']},
            {nodeEvent: true, key: KEY.NODE_TRIANGLE_CLICK, fucs: '_triangleClickHandler', params: ['创建的方向 left/right']},
            {nodeEvent: true, key: KEY.NODE_RIGHT_CLICK, fucs: '_rightClickHandler', params: []},
            {nodeEvent: true, key: KEY.MENU_CLICK, fucs: '_menuClickHandler', params: ['type 触发的按钮类型', '传入的文本值']},
            {nodeEvent: true, key: KEY.NODE_BLUR, fucs: '_blurHandler', params: ['当前获取到的节点id']},
            {nodeEvent: true, key: KEY.NODE_EXPAND, fucs: '_expandHandler', params: ['是否收起']},
            {nodeEvent: true, key: KEY.NODE_DELETE, fucs: '_deleteHandler', params: []},
            {nodeEvent: true, key: KEY.NODE_UP, fucs: '_upHandler', params: ['触发的事件类型', '是否已经进行过绘制', '是否触发过move事件']},
            {nodeEvent: true, key: KEY.NODE_COVER, fucs: '_nodeCoverHandler', params: ['node']},
            {nodeEvent: true, key: KEY.NODE_RESTORE, fucs: '_nodeRestoreHandler', params: ['']},
            {nodeEvent: true, key: KEY.NODE_SHOW_CONTENT, fucs: '_showContentHandler', params: []},
            {nodeEvent: true, key: KEY.NODE_BEFORE_MOVE, fucs: '_beforeMoveHandler', params: []},
            {nodeEvent: true, key: KEY.NODE_AFTER_MOVE, fucs: '_afterMoveHandler', params: []}
        ],
        _moveSubX: 0,
        _moveSubY: 0,
        _showContentHandler: function () {
            if (!this.getTextVisible()) {
                this.setTextVisible(true);
                this.drawTextChange();
            }
        },
        _nodeCoverHandler: function (node) {
            this.drawChildAppend(node);
        },
        _nodeRestoreHandler: function () {
            var startMatrix = this._startMatrix;
            if (startMatrix) {
                this._mindNode.moveToPos(startMatrix.m.e, startMatrix.m.f);
            }
            this._startMatrix = null
        },
        _deleteHandler: function () {
            this.drawDelete();
            if (this._option.remarkVisible) {
                this.__triggerEvent(KEY.REMARK_SHOW, this, false);
            }
        },
        _clickHandler: function () {
            if (this._option.contentClickViewAble) {
                if (!this.getTextVisible()) {
                    this.toggleTextVisible();
                    this.drawTextChange();
                }
            }
        },
        _expandHandler: function () {
            this.drawExpandChange();
        },
        _rightClickHandler: function () {
            //触发菜单显示
            this.__triggerEvent(KEY.MENU_SHOW, this);
        },
        _menuClickHandler: function (type, text) {
            switch (type) {
                case MENU_TYPE_KEY.EDIT:
                    var rect = this._getEditTextPos();
                    this.__triggerEvent(KEY.EDITTEXT_CHANGE_NODE, this._nodeId, rect.left, rect.top, this);
                    this.__triggerEvent(KEY.EDITTEXT_SHOW, this.getText(), this._nodeId, rect.left, rect.top);
                    break;
                case MENU_TYPE_KEY.VISIBLE:
                    this.toggleTextVisible();
                    this.drawTextChange();
                    break;
                case MENU_TYPE_KEY.COPY:
                    break;
                case MENU_TYPE_KEY.CUT:
                case MENU_TYPE_KEY.PASTE:
                    this.drawTextChange(text);
                    break;
                case MENU_TYPE_KEY.DELETE:
                    this.drawDelete();
                    if (this._option.remarkVisible) {
                        this.__triggerEvent(KEY.REMARK_SHOW, this, false);
                    }
                    break;
            }
        },
        _triangleClickHandler: function (orientation) {
            this.drawAddChildren(orientation);
        },
        _blurHandler: function (id) {
            //恢复非激活样式
            if (this._nodeId !== id) {
                this.draw(DRAW_TYPE_KEY.REVERT);
                if (this._option.remarkVisible) {
                    this.__triggerEvent(KEY.REMARK_SHOW, this, false);
                }
            }
        },
        _downHandler: function (eventType) {
            //添加激活样式
            this.draw(DRAW_TYPE_KEY.ACTIVE, {eventType: eventType});
            //触发文本框跟随最新节点
            var rect = this._getEditTextPos();
            this.__triggerEvent(KEY.EDITTEXT_CHANGE_NODE, this._nodeId, rect.left, rect.top, this);
            this._mindNode.setVisibleImageActive(true);
            if (this._option.remarkVisible) {
                this.__triggerEvent(KEY.REMARK_SHOW, this, true);
            }
        },
        _beforeMoveHandler: function () {
            if (!this.getMoveAble()) {
                return;
            }
            this._mindNode.bringTop();
            this._moveSubX = 0;
            this._moveSubY = 0;
            this._startMatrix = this._mindNode.__getShape().getTransform();
            this._mindNode.setVisibleImageActive(false);
            this.drawBeforeMove();
            if (this._option.remarkVisible) {
                this.__triggerEvent(KEY.REMARK_SHOW, this, false);
            }
        },
        _moveHandler: function (x, y) {
            if (!this.getMoveAble()) {
                return;
            }
            this._moveSubX += x;
            this._moveSubY += y;
            this.drawMove(x, y);
        },
        _afterMoveHandler: function () {
            if (!this.getMoveAble()) {
                return;
            }
            this.drawAfterMove(this._moveSubX, this._moveSubY);
            this._moveSubX = 0;
            this._moveSubY = 0;
        },
        _upHandler: function (eventType, hasDraw, hasMove) {
            this._mindNode.setVisibleImageActive(false);
            this.drawUp(eventType, hasDraw, hasMove);
            if (this._option.remarkVisible && !this._option.animate) {
                this.__triggerEvent(KEY.REMARK_SHOW, this, true);
            }
        },
        _dbClickHandler: function () {
            //可见且可编辑
            if (this.getTextVisible() && this.getContentEditAble()) {
                //触发文本框显示文本
                var rect = this._getEditTextPos();
                this.__triggerEvent(KEY.EDITTEXT_SHOW, this.getText(), this._nodeId, rect.left, rect.top);
            }
        },
        //文本变化监听
        _textChangeHandler: function (text, animate) {
            this.drawTextChange(text, animate);
        },
        _getEditTextPos: function () {
            var that = this;
            //获取参照物为client的mindBody元素位置信息
            var $mindBody = $('#' + that._option.mindBodyId)
            var mindBodyClientRect = $mindBody[0].getBoundingClientRect();
            var mindWidth = $mindBody.width();
            var scale = mindBodyClientRect.width / mindWidth;
            var curElementClientRect = this._mindNode.getTextNode().node.getBoundingClientRect();
            var pos = {
                left: (curElementClientRect.left - mindBodyClientRect.left) / scale,
                top: ( curElementClientRect.top - mindBodyClientRect.top) / scale
            };
            return pos;
        }
    };


    //扩展类
    __M.MindNodeCore.__include(MindNodeEventHandler);

}(window, jQuery, __M));
(function (window, $, __M) {
    'use strict';

    var Utils = __M.Utils;

    //node节点关系处理
    var ExtendProperties = {
        _exContentEditAble: true,//是否可编辑文本内容
        _exDeleteAble: true,//是否可删除
        _exMoveAble: true,//是否可移动
        _exRequireChildren: false,//是否必须要有子节点
        _exRequireContent: false,//节点内容是否必填
        _exChangeParentAble: true,//是否可以变更父节点
        _exChangeBroAble: true,//是否可以变更兄弟关系
        setExtendProperties: function (data) {
            this.setChangeBroAble(data.changeBroAble);
            this.setChangeParentAble(data.changeParentAble);
            this.setContentEditAble(data.contentEditAble);
            this.setDeleteAble(data.deleteAble);
            this.setMoveAble(data.moveAble);
            this.setRequireChildren(data.requireChildren);
            this.setRequireContent(data.requireContent);
            // this.setRemark(data.remark || '');
        },

        getChangeBroAble: function () {
            return this._exChangeBroAble;
        },
        setChangeBroAble: function (val) {
            if (val !== true && val !== false) {
                this._exChangeBroAble = true;
            } else {
                this._exChangeBroAble = val;
            }
        },
        getContentEditAble: function () {
            return this._exContentEditAble;
        },
        setContentEditAble: function (val) {
            if (val !== true && val !== false) {
                this._exContentEditAble = true;
            } else {
                this._exContentEditAble = val;
            }
        },
        getDeleteAble: function () {
            return this._exDeleteAble;
        },
        setDeleteAble: function (val) {
            if (val !== true && val !== false) {
                this._exDeleteAble = true;
            } else {
                this._exDeleteAble = val;
            }
        },
        getMoveAble: function () {
            return this._exMoveAble;
        },
        setMoveAble: function (val) {
            if (val !== true && val !== false) {
                this._exMoveAble = true;
            } else {
                this._exMoveAble = val;
            }
        },
        getRequireChildren: function () {
            return this._exRequireChildren;
        },
        setRequireChildren: function (val) {
            if (val !== true && val !== false) {
                this._exRequireChildren = false;
            } else {
                this._exRequireChildren = val;
            }
        },
        getRequireContent: function () {
            return this._exRequireContent;
        },
        setRequireContent: function (val) {
            if (val !== true && val !== false) {
                this._exRequireContent = false;
            } else {
                this._exRequireContent = val;
            }
        },
        getChangeParentAble: function () {
            return this._exChangeParentAble;
        },
        setChangeParentAble: function (val) {
            if (val !== true && val !== false) {
                this._exChangeParentAble = true;
            } else {
                this._exChangeParentAble = val;
            }
        }
    };


    //扩展类
    __M.MindNodeCore.__include(ExtendProperties);

}(window, jQuery, __M));
(function (window, $, __M) {
    'use strict';

    var Utils = __M.Utils;
    var CHANGE_REASON = __M.Config.CHANGE_REASON;

    //node节点关系处理
    var MindNodeRelation = {
        getTriangleFullWidth: function () {
            return this._mindNode.getTriangleFullWidth();
        },
        getChildByOrientation: function (orientation) {
            var childs = [];
            if (!orientation) {
                return this._children;
            }
            this.getChildren().forEach(function (child) {
                if (child.getOrientation() === orientation) {
                    childs.push(child);
                }
            });
            return childs;
        },
        getNodeId: function () {
            return this._nodeId;
        },
        _makeContainParentsId: function () {
            if (this.getParent()) {
                this._containParentsId = this.getParent().getContainParentsId() + this._nodeId + '|';
            } else {
                this._containParentsId = this._nodeId + '|';
            }
        },
        setContainParentsId: function (id) {
            this._containParentsId = id;
        },
        getContainParentsId: function () {
            return this._containParentsId;
        },
        getRenderBox: function () {
            return this.getMindNodeShape().getRenderBox();
        },
        getRectPathRenderBox: function () {
            return this._mindNode.getRectPath().getRenderBox();
        },
        getTransform: function () {
            return this.getMindNodeShape().getTransform();
        },
        getChildrenCount: function () {
            return this._children.length;
        },
        //遍历当前及、子节点
        traverse: function (fn, includeThis, orientation) {
            if (includeThis) {
                fn(this);
            }
            var children = this.getChildren();
            if (this.isRoot() && (orientation === 'left' || orientation === 'right')) {
                children = this.getChildByOrientation(orientation);
            }

            for (var i = 0; i < children.length; i++) {
                children[i].traverse(fn, true, orientation);
            }
        },
        //当前节点所在位置
        getOrientation: function () {
            if (this.isRoot()) {
                return 'both';
            } else if (this._option.type !== 'both') {
                return this._option.type;
            }
            var box = this.getTransform();
            return box.m.e < 0 ? 'left' : 'right';
        },
        //获取子节点朝向
        getChildOrientation: function () {
            var orientation = 'none';
            var left, right;
            this._children.forEach(function (child) {
                var box = child.getOrientation();
                box === 'left' ? left = true : right = true;
            });
            if (left && right) {
                return 'both';
            }
            if (left) {
                return 'left';
            }
            if (right) {
                return 'right';
            }
            return orientation;
        },
        getChildren: function () {
            return this._children;
        },
        getParent: function () {
            return this._parent;
        },
        getLevel: function () {
            return this._level;
        },
        isLeaf: function () {
            return this._children.length === 0;
        },
        getRoot: function () {
            return this._root || this;
        },
        getMinder: function () {
            return this._minder;
        },

        /**
         * 获取数据(ignore用于内部撤销还原使用)
         * @param ignoreRemark 忽略备注
         * @param remark 备注内容，这个递归时自动添加
         * @param ignoreOffset 忽略位置偏移
         * @returns {{data: {identifier: (string|*), text: (*|String), orientation: *, textVisible: *, matrix: string, isExpand}, children: Array}}
         */
        getData: function (ignoreRemark, remark, ignoreOffset) {
            var that = this;
            if (this.isRoot()) {
                //重新计算所有默认坐标
                if (!ignoreOffset) {
                    this.trvMathChildPosition();
                }
                this.resetRootChildrenSort();
            }

            var matrix = that._mindNode.__getShape().getTransform();
            matrix.m.e = Math.round(matrix.m.e);
            matrix.m.f = Math.round(matrix.m.f);
            var data = {
                data: {
                    identifier: this._identifier,
                    text: that.getText(),
                    orientation: that.getOrientation(),
                    textVisible: that.getTextVisible(),
                    matrix: matrix.m.e + ' ' + matrix.m.f,
                    isExpand: that.isExpand()
                },
                children: []
            };

            if (!ignoreOffset) {
                var x = Math.round((this._toX - matrix.m.e)),
                    y = Math.round((this._toY - matrix.m.f));
                if (x !== y && x !== 0) {
                    data.data.offset = x + ' ' + y;
                }
                delete data.data.matrix;
            }

            if (this.isRoot() && !ignoreRemark) {
                data.remark = remark = {};
            }
            if (remark) {
                var re = this.getRoot()._rootRemark[this._identifier]
                if (re !== undefined && re !== '') {
                    remark[this._identifier] = re;
                }
            }

            //一下几个属性，如果和默认值一致 ，则不写入数据中
            if (that.getRequireChildren() === true) {
                data.data.requireChildren = true;
            }
            if (that.getRequireContent() === true) {
                data.data.requireContent = true;
            }
            if (that.getContentEditAble() === false) {
                data.data.contentEditAble = false;
            }
            if (that.getDeleteAble() === false) {
                data.data.deleteAble = false;
            }
            if (that.getMoveAble() === false) {
                data.data.moveAble = false;
            }
            if (that.getChangeParentAble() === false) {
                data.data.changeParentAble = false;
            }
            if (that.getChangeBroAble() === false) {
                data.data.changeBroAble = false;
            }


            this.getChildren().forEach(function (child) {
                data.children.push(child.getData(ignoreRemark, remark, ignoreOffset));
            });

            return data;
        },
        trvRenderData: function (data) {
            var that = this;
            var nodeData = data.data;
            if (typeof nodeData.isExpand !== 'undefined') {
                that.setExpand(nodeData.isExpand);
            }

            that.setExtendProperties(nodeData);

            if (data.children) {
                data.children.forEach(function (child) {
                    var data = child.data;
                    that.addNode(data, undefined, true);
                });
            }


            that.getChildren().forEach(function (child, i) {
                child.trvRenderData(data.children[i]);
                //设置节点初始化位置
                if (data.children[i].data.matrix) {
                    var matrixAt = data.children[i].data.matrix.split(' ');
                    if (matrixAt.length === 2) {
                        child.setToPosition(parseInt(matrixAt[0]), parseInt(matrixAt[1]));
                    } else if (matrixAt.length === 6) {
                        child.setToPosition(parseInt(matrixAt[4]), parseInt(matrixAt[5]));
                    }
                }
            });
            if (that.isRoot()) {
                //计算所有节点的高度
                this.trvMathChildHeight();
                //重新计算所有默认坐标
                this.trvMathChildPosition();

                this._trvRenderDataOffset(data);

                this._rootRemark = data.remark || {};
                this.layout({global: true, animate: false, mathPos: this._option.renderDataAutoLayout, reason: CHANGE_REASON.RENDER});
                this.resetRootChildrenSort();
                this.trvShow();
            }
        },
        _trvRenderDataOffset: function (data) {
            this.getChildren().forEach(function (child, i) {
                child._trvRenderDataOffset(data.children[i]);
                //设置节点初始化位置
                if (data.children[i].data.offset) {

                    var offsetAt = data.children[i].data.offset.split(' ');
                    if (offsetAt.length === 2) {
                        child.setToPosition(child._toX - parseInt(offsetAt[0]), child._toY - parseInt(offsetAt[1]));
                    }
                }
            });
        },
        rtSetRemark: function (remark) {
            this.getRoot()._rootRemark[this._identifier] = remark;
        },
        rtGetRemark: function () {
            return this.getRoot()._rootRemark[this._identifier] || '';
        },
        removeChild: function (node) {
            var index, removed;
            index = this._children.indexOf(node);
            if (index >= 0) {
                removed = this._children.splice(index, 1)[0];
                removed._parent = null;
                //removed._root = removed;
            }
            this._mindNode.updateRectPathFill();
        },

        insertChild: function (node, index) {
            if (index === undefined) {
                index = this._children.length;
            }
            if (node._parent) {
                node._parent.removeChild(node);
            }
            node._parent = this;
            node._root = this._root;
            node._level = this._level + 1;
            this._children.splice(index, 0, node);
            this._mindNode.updateRectPathFill();
        },
        appendChild: function (node) {
            return this.insertChild(node);
        },
        getIndex: function () {
            return this._parent ? this._parent.getChildren().indexOf(this) : -1;
        },
        getChild: function (index) {
            return this._children[index];
        },
        isRoot: function () {
            return this._root === this;
        },
        getMinderNodeById: function (id) {
            var node = this.getNodeId() === id ? this : null;
            if (!node) {
                var children = this.getChildren();
                for (var i = 0; i < children.length; i++) {
                    node = children[i].getMinderNodeById(id);
                    if (node) {
                        return node;
                    }
                }
            }
            return node;
        },
        //改变兄弟节点顺序 direction:'bottom/top'
        changeBroRelation: function (targetBroId, direction) {
            if (this.isRoot()) {
                return {
                    flag: false
                };
            }
            var bro = this.getParent().getChildren();
            var tempNode = Utils.getItemInArrayById(bro, targetBroId, 'getNodeId');
            if (tempNode) {
                var tempIndex = bro.indexOf(tempNode);
                var curIndex = bro.indexOf(this);
                if (tempIndex > curIndex) {
                    tempIndex--;
                }
                if (direction === 'bottom') {
                    tempIndex++;
                }
                this.getParent().insertChild(this, tempIndex);
                return {
                    flag: true,
                    relationChange: tempIndex !== curIndex
                };
            }
            return {
                flag: false
            };
        },
        rtGetPosRecords: function () {
            return this.getRoot().positionRecord;
        },
        rtSetPosRecord: function (id, pos) {
            this.getRoot().positionRecord[id] = pos;
        },
        getComplex: function (orientation) {
            var complex = 0;
            this.traverse(function () {
                complex++;
            }, false, orientation);
            return complex;
        },
        resetRootChildrenSort: function () {
            var children = this.getRoot().getChildren();
            var sortChildren = [];
            var leftChildren = [];
            children.forEach(function (child) {
                if (child.getOrientation() === 'left') {
                    leftChildren.push(child);
                } else {
                    sortChildren.push(child);
                }
            });
            this.getRoot()._children = sortChildren.concat(leftChildren);
        }
    };


    //扩展类
    __M.MindNodeCore.__include(MindNodeRelation);

}(window, jQuery, __M));
(function (window, $, __M) {
    'use strict';


    var order = {
        //前序遍历
        preOrder: function (fn) {
            var children = this.getChildren();
            fn(this);
            children.forEach(function (child) {
                child.preOrder(fn);
            });
        },
        //后序遍历
        postOrder: function (fn) {
            var children = this.getChildren();
            children.forEach(function (child) {
                child.preOrder(fn);
            });
            fn(this)
        }
    };


    //扩展类
    __M.MindNodeCore.__include(order);

}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/29.
 */

(function (window, $, __M) {
    //1.0.1 根节点增加minder位置信息,路径：/minder/
    //1.0.2  1.节点新增extendProperties里的参数，2.修改matrix属性a b c d e f 为e f 3.移除属性priority
    //1.0.3  1.新增offset属性，记录偏移默认位置。解决bug：字体在不同平台渲染大小不一致导致的布局异常（matrix固定）
    var VERSION = '1.0.3';
    var Logger = __M.Logger;
    var Utils = __M.Utils;
    var KEY = __M.Config.EVENT_KEY;
    var CLASS_NAME = __M.Config.CLASS_NAME;
    var CHANGE_REASON = __M.Config.CHANGE_REASON;
    var plusStyle = __M.Config.plusStyle;
    var EditText = __M.View.EditTextArea;
    var Menu = __M.View.Menu;
    var Remark = __M.View.Remark;
    var Placeholder = __M.View.Placeholder;
    var MindNodeCore = __M.MindNodeCore;
    var Base = __M.Class.Base;
    var Clipboard = __M.Utils.Clipboard;

    var OPTION = {
        create: function (option) {
            var instance = Object.create(this);
            for (var key in option) {
                instance[key] = option[key];
            }
            instance.mindBodyId = Utils.getUuid();
            //计算基于基准缩放的缩放限制
            instance.maxScale = instance.maxScale * instance.baseScale;
            instance.minScale = instance.minScale * instance.baseScale;
            return instance;
        },
        nodeIndex: 0,//节点索引
        connectGroupId: 'minder_connect_group_1',//线组id
        minderIdIndex: 0,//线组id
        mindBodyId: Utils.getUuid(),
        onScale: null,
        onChange: null
    };

    var _templateHtml = '<div class="${cls}" id="${id}"><input id="btn_focus" class="btn-focus" type="button" style="position: absolute"/></div>';

    var matchPadding = {
        x: (plusStyle.circleWidth * 2) + 5,
        y: 20,
        remarkHeight: 30
    }

    __M.MindCore = Base({
        _paper: null,//根页容器节点
        _minder: null,//每个导图视图根节点
        _connectGroup: null,//导图视图线根节点
        _root: null,
        _data: null,
        _editText: null,
        _menu: null,
        _option: null,
        _scale: 1,
        _clipboard: null,
        _$mindBody: null,
        _tempLastId: null,//最后一次操作的id
        create: function (option) {
            var instance = Object.create(this);

            //创建事件分发器
            var eventDispatch = __M.Event.create();
            //初始化基类
            instance.__base(eventDispatch, instance._eventsInfo);
            //创建配置
            instance._option = OPTION.create(option);
            //创建内部剪切板
            instance._clipboard = Clipboard.create();

            return instance;
        },
        getOption: function () {
            return this._option;
        },
        render: function (containerElement) {
            var that = this;
            var data = {cls: CLASS_NAME.MIND_BODY_CLASS + ' ' + CLASS_NAME.MIND_BODY_PPT_SHELL_CLASS, id: that._option.mindBodyId};
            if (Utils.isMobile) {
                data = {cls: CLASS_NAME.MIND_BODY_CLASS, id: that._option.mindBodyId}
            }
            var minBodyHtml = Utils.String.template(_templateHtml, data);
            var $mindBody = this._$mindBody = $(minBodyHtml);
            $mindBody.on('contextmenu', function (e) {
                e.preventDefault();
            });

            $(containerElement).html($mindBody);

            if (!that._editText) {
                //创建文本节点
                that._editText = EditText.create(that.__getEventDispatch(), $mindBody, that._clipboard, that._option);
                if (that._option.showMenu) {
                    //创建菜单
                    that._menu = Menu.create(that.__getEventDispatch(), $mindBody, that._clipboard, that._option);
                    that._menu.setScale(that._option.baseScale);
                }
                if (that._option.remarkVisible) {
                    that._remark = Remark.create(that.__getEventDispatch(), $mindBody, that._option);
                }
                //创建当前页
                that._paper = new kity.Paper($mindBody[0]);
                if (that._option.viewPort && that._option.viewPort.length == 2) {
                    that._paper.setViewBox(0, 0, that._option.viewPort[0], that._option.viewPort[1]);
                }
                //新增容器
                that._addMinder();
                //绑定事件
                that.bindDomEvent();
            }


            //增加第一个文本节点
            that._createRoot();

            //缩放到基准值
            that.scale(1);

            //根节点居中
            that.rootCenter();

            //移动端激活根节点
            if (Utils.isMobile && this._option.editAble && !this._option.lock) {
                this.focusRoot();
            }

            //渲染导入的数据
            if (that._data) {
                //初始节点
                that._root.trvRenderData(that._data.root);
            }

            if (this._option.position.length > 0) {
                that.changePosition(this._option.position);
            }


            $(this._paper.node).on('resize', function () {
                that.onResize();
            })

        },
        onResize: function () {
            this._editText.setVisible(false);
            if (this._menu) {
                this._menu.setVisible(false);
            }
            this.mathTotalScale();
            this._editText.setScale(this.getTotalScale());
        },
        _createRoot: function () {
            //二级节点及其子节点全部移除
            if (this._root) {
                this._root.destroy();
                this._root = null;
            }
            //初始化数据
            var text;
            if (this._data && this._data.root) {
                text = this._data.root.data.text;
            }
            //生成一个节点容器
            var node = this._root = MindNodeCore.create(this._option, this._minder, this.__getEventDispatch(), this._connectGroup, null, text, true, this._paper);
            //往当前思维导图中添加节点
            node.appendNode();
        },
        //允许存在多个思维导图，paper:[minder1,minder2...]
        _addMinder: function () {
            //创建一个导图实例根节点
            var position = this._getCenterPoint();
            this._minder = new kity.Group().setId('minder_' + this._option.minderIdIndex++).translate(position.x, position.y);
            this._paper.addShape(this._minder);
            //创建拖动时的矩形占位符
            this._placeholder = Placeholder.create(this._minder, this._option.mindBodyId);
            //创建线根节点
            this._connectGroup = new kity.Group().setId(this._option.connectGroupId);
            this._minder.addShape(this._connectGroup);
        },
        _getCenterPoint: function () {
            if (this._option.viewPort && this._option.viewPort.length === 2) {
                return {x: this._option.viewPort[0] / 2, y: this._option.viewPort[1] / 2};
            } else {
                return {x: this._paper.getWidth() / 2, y: this._paper.getHeight() / 2};
            }
        },
        getMinderNodeById: function (id) {
            return this.getRoot().getMinderNodeById(id);
        },
        getShapeById: function (id) {
            try {
                return this._paper.getShapeById(id);
            } catch (e) {
                Logger.debug(e);
            }
            return null;
        },
        getRoot: function () {
            return this._root;
        },
        getData: function (ignoreRemark, ignoreOffset) {
            var that = this;
            var data = {
                root: {},
                minder: '',
                version: VERSION
            };
            if (that._minder) {
                //data.minder = that._minder.getTransform().toString();
            }
            if (that._root) {
                data.root = that._root.getData(ignoreRemark, null, ignoreOffset);
            }
            return data;
        },
        setData: function (data) {
            if (data && data.root && data.root.data && data.version) {
                this._data = data;
            } else {
                this._data = null;
                Logger.warn('MinderMap', '传入数据不合法');
            }
        },
        setLock: function (lock) {
            var that = this;
            that._option.lock = lock;
            if (lock) {
                //触发失去焦点事件
                this.blur();
            }
        },
        getLock: function () {
            return this._option.lock;
        },
        getEditAble: function () {
            return this._option.editAble;
        },
        blur: function (notifyChange) {
            notifyChange = typeof notifyChange === typeof undefined ? true : false;
            if (!notifyChange) {
                this._editText.setVisible(false);
                if (this._menu) {
                    this._menu.setVisible(false);
                }
            } else {
                this.__triggerEvent(KEY.DOM_HIDE);
            }
            this.__triggerNodeEvent(KEY.NODE_BLUR);
        },
        getEditTextVisible: function () {
            return this._editText.isVisible();
        },
        setEditAble: function (able) {
            var that = this;
            that._option.editAble = able;
            if (!able) {
                //触发失去焦点事件
                this.blur();
            }
        },
        _nodeToCenter: function (minderNode, leftCenter) {
            if (minderNode) {
                leftCenter === typeof leftCenter === typeof undefined ? false : leftCenter;
                var nodeMatrix = minderNode.getMindNodeShape().getTransform();
                var scale = this.getScale();
                var rectWidth = minderNode.getRectPath().getWidth() * scale;
                var rectHeight = minderNode.getRectPath().getHeight() * scale;
                var position = this._getCenterPoint();
                var matrix = this._minder.getTransform();
                if (leftCenter) {
                    matrix.m.e = position.x - nodeMatrix.m.e * scale;
                } else {
                    matrix.m.e = position.x - nodeMatrix.m.e * scale - rectWidth / 2;
                }
                matrix.m.f = position.y - nodeMatrix.m.f * scale - rectHeight / 2;
                this._minder.setMatrix(matrix);
                //隐藏全局的节点
                this.__triggerEvent(KEY.DOM_HIDE);
                this._option.onChange(CHANGE_REASON.MINDER_MOVE);
            }
        },
        focusCenter: function (leftCenter) {
            var minderNode = this.getCurMinderNode();
            this._nodeToCenter(minderNode, leftCenter);
        },
        rootCenter: function (triggerChange) {
            var that = this;
            var matrix = that._minder.getTransform();
            var position = that._getCenterPoint();
            var minderNode = this.getRoot();
            var scale = this.getScale();
            var rectWidth = minderNode.getRectPath().getWidth() * scale;
            var rectHeight = minderNode.getRectPath().getHeight() * scale;
            matrix.m.e = position.x - rectWidth / 2;
            matrix.m.f = position.y - rectHeight / 2;
            that._minder.setMatrix(matrix);
            //隐藏全局的节点
            that.__triggerEvent(KEY.DOM_HIDE);
            if (triggerChange !== false) {
                this._option.onChange(CHANGE_REASON.MINDER_MOVE);
            }
        },
        focusIn: function (minderNode) {
            if (!minderNode || minderNode.isRemove()) {
                return;
            }
            var pathBbox = minderNode.getRectPath().getRenderBox(),
                nodeBbox = minderNode.getMindNodeShape().getRenderBox(),
                matrix = minderNode.getMindNodeShape().node.getCTM(),
                scale = matrix.a,
                minderBbox = this._minder.getTransform(),
                nodeWidth = pathBbox.width * scale,
                nodeHeight = nodeBbox.height * scale,
                paperWidth = this._paper.getWidth(),
                paperHeight = this._paper.getHeight(),
                marginX = matchPadding.x * scale,
                marginY = matchPadding.y * scale + 2,
                remarkHeight = matchPadding.remarkHeight * scale


            matrix.f = matrix.f - (nodeBbox.height - pathBbox.height) * scale

            //left
            if (matrix.e < marginX) {
                minderBbox.m.e += ( marginX - matrix.e) / matrix.a * this.getScale();
            }
            if (this._option.remarkVisible && this.getCurMinderNode() && this.getCurMinderNode().isActive() && this._remark.isVisible()) {
                //top
                if (matrix.f < (remarkHeight + marginY)) {
                    minderBbox.m.f -= ((matrix.f - marginY) - remarkHeight) / matrix.a * this.getScale();
                }
            } else {
                if (matrix.f < 0) {
                    minderBbox.m.f -= (matrix.f - marginY) / matrix.a * this.getScale();
                }
            }
            //right
            if (matrix.e + nodeWidth + marginX > paperWidth) {
                minderBbox.m.e -= ( (matrix.e + nodeWidth ) - paperWidth + marginX) / matrix.a * this.getScale();
            }
            //bottom
            if (matrix.f + nodeHeight > paperHeight) {
                minderBbox.m.f -= ((matrix.f + nodeHeight ) - paperHeight + marginY) / matrix.a * this.getScale();
            }

            this._minder.setMatrix(minderBbox);

            this._option.onChange(CHANGE_REASON.MINDER_MOVE);


        },
        scale: function (scale) {
            var that = this;
            scale = that._option.baseScale * scale;
            if (scale > that._option.maxScale) {
                scale = that._option.maxScale;
            }
            if (scale < that._option.minScale) {
                scale = that._option.minScale;
            }
            var matrix = that._minder.getTransform();
            matrix.m.a = scale;
            matrix.m.d = scale;
            that._minder.setMatrix(matrix);
            that._scale = scale;
            //触发缩放回调
            that._option.onScale(that.getRelativeScale());
            var minderCTM = this._minder.container.node.getCTM();
            this.mathTotalScale();
            that._editText.setScale(this.getTotalScale());
            if (that._remark) {
                that._remark.setScale(this.getTotalScale());
            }
            //隐藏全局的节点
            this.__triggerEvent(KEY.DOM_HIDE);
            if (this._option.remarkVisible) {
                that.nodeBlur();
            }
            this._option.onChange(CHANGE_REASON.MINDER_SCALE);
        },
        getScale: function () {
            return this._scale;
        },
        getRelativeScale: function () {
            return this._scale / this._option.baseScale;
        },
        mathTotalScale: function () {
            var mindBodyClientRect = this._$mindBody[0].getBoundingClientRect();
            var mindWidth = this._$mindBody.width();
            var scale = mindBodyClientRect.width / mindWidth;
            var minderCTM = this._minder.container.node.getCTM();
            this._totalScale = scale * this.getScale() * minderCTM.a;
        },
        getTotalScale: function () {
            return this._totalScale;
        },
        matchParent: function () {
            var that = this,
                minderBox = that._minder.getRenderBox(),
                minderCTM = this._minder.container.node.getCTM(),
                pageWidth = that._paper.getWidth(),
                pageHeight = that._paper.getHeight(),
                width = minderBox.width * minderCTM.a,
                height = minderBox.height * minderCTM.a,
                scale = 1;


            //先对padding值进行缩放
            if ((width >= pageWidth || height >= pageHeight) && width !== 0 && height !== 0) {
                scale = pageWidth / width < pageHeight / height ? pageWidth / width : pageHeight / height;
                pageWidth -= ( matchPadding.x * 2 * scale);
                pageHeight -= ( matchPadding.y * 2 * scale);
                if (this._remark && this._remark.isVisible() && !this._option.lock) {
                    pageHeight = pageHeight - matchPadding.remarkHeight * scale;
                }
            }

            scale = 1;
            //计算宽高缩放
            if (width > pageWidth) {
                scale = pageWidth / width;
                width = pageWidth;
                height = height * scale;
            }
            if (height > pageHeight) {
                var scaleTemp = pageHeight / height;
                height = pageHeight;
                width = width * scaleTemp;
                scale *= scaleTemp
            }

            var matrix = this._minder.getTransform();
            //先缩放
            that.scale(matrix.m.a / that._option.baseScale * scale);
            //居中处理
            that.rootCenter(false);

            //重新获取坐标
            matrix = this._minder.getTransform();
            minderBox = that._minder.getRenderBox();

            // this.mathTotalScale();
            var scale = this.getScale();
            var minderNode = this.getRoot();
            var rectWidth = minderNode.getRectPath().getWidth() * scale;
            var rectHeight = minderNode.getRectPath().getHeight() * scale;

            //计算pager中心与minder中心的差:minder偏移+(根节点中心离左边界的坐标-minder中心点坐标)
            matrix.m.e = matrix.m.e + (rectWidth / 2 + matrix.m.e - minderBox.cx);
            matrix.m.f = matrix.m.f + (rectHeight / 2 + matrix.m.f - minderBox.cy);

            this._minder.setMatrix(matrix);

            this._option.onChange(CHANGE_REASON.MINDER_MOVE);
        },
        changePosition: function (pos) {
            var matrix = this._minder.getTransform();
            var minderCTM = this._minder.container.node.getCTM();
            var viewboxScale = minderCTM.a;
            var minderBox = this._minder.getRenderBox();
            var scale = this.getScale();
            var matchPaddingX = matchPadding.x * scale;
            var matchPaddingY = matchPadding.y * scale;
            var pageWidth = this._paper.getWidth() - matchPaddingX * 2;
            var pageHeight = this._paper.getHeight() - matchPaddingY * 2;
            pos.forEach(function (p) {
                if (p === 'middle') {

                    var minderNode = this.getRoot();
                    var rectWidth = minderNode.getRectPath().getWidth() * scale * viewboxScale;
                    var rectHeight = minderNode.getRectPath().getHeight() * scale * viewboxScale;
                    matrix.m.e = matrix.m.e + ( rectWidth / 2 + matrix.m.e - minderBox.cx);
                    matrix.m.f = matrix.m.f + (  rectHeight / 2 + matrix.m.f - minderBox.cy);
                } else if (p === 'left') {
                    //minder距离左侧相差值（负），极为left值
                    matrix.m.e = -minderCTM.e / viewboxScale + matchPaddingX;
                } else if (p === 'top') {
                    matrix.m.f = matrix.m.f - minderBox.top + matchPaddingY;
                } else if (p === 'right') {
                    //整个坐标系宽度-内容思维导图宽度-思维导图距离左侧宽度
                    matrix.m.e = pageWidth / viewboxScale - minderBox.width - minderCTM.e / viewboxScale;
                } else if (p === 'bottom') {
                    matrix.m.f = matrix.m.f + pageHeight / viewboxScale - minderBox.bottom;
                }
            });
            this._minder.setMatrix(matrix);
            this._option.onChange(CHANGE_REASON.MINDER_MOVE);
            this.focusIn(this.getCurMinderNode());
            //隐藏全局的节点
            this.__triggerEvent(KEY.DOM_HIDE);
        },
        hasChange: function () {
            var data = this._data;
            if (data === null) {
                return true;
            }
            var diff = Utils.JsonDiff.compare(data, this.getData());
            return diff.length > 0;
        },
        clear: function () {
            //清楚外部传入的数据
            this._data = {};
            //二级节点及其子节点全部移除
            if (this._root) {
                this._root.destroy();
                this._root = null;
            }
            this._option.nodeIndex = 0;
            //取消缩放
            var matrix = this._minder.getTransform();
            matrix.m.a = this._option.baseScale;
            matrix.m.d = this._option.baseScale;
            this._minder.setMatrix(matrix);
            //创建根节点
            this._createRoot();
            //根节点居中
            this.rootCenter();
            //隐藏全局的节点
            this.__triggerEvent(KEY.DOM_HIDE);
            this._option.onChange(CHANGE_REASON.CLEAR);
        },
        destroy: function () {
            this.__destroy();
            //移除全局事件
            this.removeDomEvent();
            //
            if (this._placeholder) {
                this._placeholder = null;
            }
            //清楚外部传入的数据
            this._data = {};
            //二级节点及其子节点全部移除
            if (this._root) {
                this._root.destroy();
                this._root = null;
            }
            if (this._editText) {
                this._editText.destroy();
                this._editText = null;
            }
            if (this._menu) {
                this._menu.destroy();
                this._menu = null;
            }
            if (this._connectGroup) {
                this._connectGroup.remove();
                this._connectGroup = null;
            }

            this._paper = null;
            this._minder = null;

        },
        resizeRemark: function () {
            var node = this.getCurMinderNode(),
                show = node && node.isActive();
            if (this._option.remarkVisible) {
                this.__triggerEvent(KEY.REMARK_SHOW, node, show);
            }
        }
    });


}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/29.
 */

(function (window, $, __M) {
    var Logger = __M.Logger;
    var Utils = __M.Utils;
    var KEY = __M.Config.EVENT_KEY;
    var MENU_TYPE_KEY = __M.Config.MENU_TYPE_KEY;
    var ID = __M.ID;
    var DOM_EVENT_TYPE = __M.Config.DOM_EVENT_TYPE;
    var CHANGE_REASON = __M.Config.CHANGE_REASON;

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
        getClientPos: function (ev) {
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
        }
    };

    var DomEvent = {
        _eventsInfo: [
            {nodeEvent: false, key: KEY.NODE_DRAWING, fucs: '_drawingHandler', params: ['start/end']},
            {nodeEvent: false, key: KEY.NODE_CENTER, fucs: '_nodeCenterHandler', params: ['nodeId']}
        ],
        _nodeData: null,//当前触发的节点信息
        _plusOperate: false,//刚操作过添加
        _editShowTimeOutId: 0,//
        _nodeCenterId: '',
        _dblClickTrigger: false,
        _isDrawing: false,//是否在绘制
        _outClickInstance: null,
        _curMinderNode: null,//当前获取到焦点的节点
        _isRootFocus: false,//当前获取到焦点的节点
        _totalScale: 1,//总缩放比例
        getCurMinderNode: function () {
            return this._curMinderNode;
        },
        setCurMinderNode: function (minderNode) {
            this._curMinderNode = minderNode;
        },
        focusNode: function (nodeId, minderNode) {
            //触发其他节点失去焦点事件
            if (this.getCurMinderNode() || this._isRootFocus) {
                this._isRootFocus = false;
                this.__triggerNodeEvent(KEY.NODE_BLUR);
            }
            //重新设置当前节点id
            this.__setNodeId(nodeId);
            //触发节点获取焦点事件
            this.__triggerNodeEvent(KEY.NODE_DOWN, Utils.isMobile ? DOM_EVENT_TYPE.TOUCH : '');
            //设置获取到的焦点
            this.setCurMinderNode(minderNode);
        },
        focusRoot: function () {
            this.focusNode(this._root.getNodeId(), this._root);
        },
        focusEditDisableRoot: function () {
            this._isRootFocus = true;
            this._root.drawFocusEditDisable();
        },
        nodeBlur: function () {
            this.__triggerNodeEvent(KEY.NODE_BLUR);
            this._nodeData = null;
        },
        _nodeCenterHandler: function (id) {
            this._nodeCenterId = id;
        },
        _drawingHandler: function (status) {
            var that = this;
            if (status === 'start') {
                that._isDrawing = true;
                //触发其他节点失去焦点事件
                if (this._plusOperate) {
                    var id = $('#' + that._option.mindBodyId + ' #minder_0 > g:last').attr('id');
                    var node = that.getMinderNodeById(id);
                    if (this.getCurMinderNode() || this._isRootFocus) {
                        this._isRootFocus = false;
                        this.__triggerNodeEvent(KEY.NODE_BLUR);
                    }
                    //重新设置当前节点id
                    this.__setNodeId(id);
                    //设置获取到的焦点
                    this.setCurMinderNode(node);
                }
                if (this._option.remarkVisible) {
                    this.__triggerEvent(KEY.REMARK_SHOW, this.getCurMinderNode(), false);
                }
            } else if (status === 'end') {

                that._isDrawing = false;
                //pc端直接显示文本框
                if (this._plusOperate && !Utils.isMobile) {

                    if (this.getCurMinderNode() && this.getCurMinderNode().getMindNodeShape) {
                        that.focusIn(this.getCurMinderNode())
                    }
                    //延迟执行，防止性能问题导致的绘制延迟
                    that._editShowTimeOutId = setTimeout(function () {
                        that.__triggerNodeEvent(KEY.NODE_DBLCLICK);
                    }, 100);

                } else if (this._nodeCenterId && Utils.isMobile) {
                    //触发居中显示
                    this._nodeToCenter(this.getMinderNodeById(this._nodeCenterId));
                    this._nodeCenterId = '';
                } else {
                    if (this.getCurMinderNode() && this.getCurMinderNode().getMindNodeShape) {
                        that.focusIn(this.getCurMinderNode())
                    }
                }
                if (this._plusOperate) {
                    //获取添加的节点id
                    //触发节点获取焦点事件
                    this.__triggerNodeEvent(KEY.NODE_DOWN, Utils.isMobile ? DOM_EVENT_TYPE.TOUCH : '');
                }
                if (this.getCurMinderNode() && this.getCurMinderNode().isActive()) {
                    if (this._option.remarkVisible) {
                        this.__triggerEvent(KEY.REMARK_SHOW, this.getCurMinderNode(), true);
                    }
                    //重新计算定位
                    that.focusIn(this.getCurMinderNode());
                }
                this._plusOperate = false;
            }
        },
        _init: function (e) {
            var that = this;
            //再次点击时，移除新建的焦点
            this._plusOperate = false;
            clearTimeout(that._editShowTimeOutId);
            that._nodeData = that._getTargetNode(e);
            that.__setNodeId(that._nodeData.id);
            if (that.getCurMinderNode() && that.getCurMinderNode().getNodeId() !== that._nodeData.id) {
                //触发旧节点失去焦点，样式还原
                that.getCurMinderNode().__triggerNodeEvent(KEY.NODE_BLUR);
                //触发隐藏其他菜单、文本框
                that.__triggerEvent(KEY.DOM_HIDE, true);
            } else {
                if (this._menu) {
                    this._menu.setVisible(false);
                }
            }
            //设置当前获取焦点的节点
            that.setCurMinderNode(that.getMinderNodeById(this._nodeData.id));
        },
        _getTargetNode: function (e) {
            var that = this;
            e = e.originalEvent || e;
            if (e.srcElement) {
                var node = e.srcElement;
                var value;
                while (node) {
                    if (!value) {
                        value = ID.getTargetValue(node.id);
                    }
                    if (ID.isNode(node.id)) {
                        break;
                    }
                    node = node.parentNode;
                }
                if (node) {
                    return {
                        node: that._paper.getShapeById(node.id),
                        id: node.id,
                        value: value
                    };
                }
            }
            return {
                node: that._minder,
                id: that._minder.node.id
            };
        },
        _delBtnEvent: function (e) {
            var that = this;
            var type = e.type || '';
            if (type === 'mTap') {
                that.__triggerEvent(KEY.DOM_HIDE, false);
                //var nodeId = this.getCurMinderNode().getNodeId();
                var minderNode = this.getCurMinderNode();
                this.setCurMinderNode(null);
                minderNode.__triggerNodeEvent(KEY.NODE_DELETE);
            }
        },
        _plusEvent: function (e) {
            var that = this;
            var type = e.type || '';
            if (type === 'mTap') {
                that.__triggerEvent(KEY.DOM_HIDE, false);
                this._plusOperate = true;
                that.__triggerNodeEvent(KEY.NODE_TRIANGLE_CLICK, that._nodeData.value.orientation);
            }

        },
        _expandEvent: function (e) {
            var that = this;
            var type = e.type || '';
            if (type === 'mTap') {
                that.__triggerEvent(KEY.DOM_HIDE, false);
                that.__triggerNodeEvent(KEY.NODE_EXPAND);
                that.__triggerNodeEvent(KEY.NODE_BLUR);
            }
        },
        _nodeEvent: function (e) {
            var that = this;
            var type = e.mType || '';
            var isRoot = ID.isRoot(that._nodeData.id);
            //创建中的节点不允许操作
            if (that._nodeData.node.getAttr('status') === 'creating') {
                return;
            }
            switch (type) {
                case 'mDblclick':
                    //移动端交给mTap处理
                    if (!Utils.isMobile) {
                        that.__triggerNodeEvent(KEY.NODE_DBLCLICK);
                    }
                    break;
                case 'mTap':
                    that.__triggerNodeEvent(KEY.NODE_CLICK);
                    //移动端、白板手写笔触发
                    if (e.mTouchTrigger && that._isActiveBeforeDown) {
                        //该节点文本框隐藏状态下才触发双击事件
                        if (that.getCurMinderNode().isActive()) {
                            //阻止触发双击事件
                            e.preventDefault();
                            if (Utils.isMobile && that.getCurMinderNode().getContentEditAble()) {
                                that._dblClickTrigger = true;
                                that.focusCenter(true);
                            }
                            that.__triggerNodeEvent(KEY.NODE_DBLCLICK);
                            if (Utils.isMobile) {
                                setTimeout(function () {
                                    that._dblClickTrigger = false;
                                }, 500);
                            }
                        }
                    }
                    break;
                case 'mTouchLong':
                case 'contextmenu':
                    //取消默认的菜单
                    that.__triggerNodeEvent(KEY.NODE_RIGHT_CLICK);
                    break;
                case 'down':

                    if (e.type === 'touchstart') {
                        that._isActiveBeforeDown = that.getCurMinderNode().isActive() && that.getCurMinderNode().getTextVisible() && !that._editText.isVisible();
                    }
                    //触发移动覆盖事件
                    that.nodeCoverMoveDown(that._nodeData.id);
                    //触发节点获取焦点事件
                    that.__triggerNodeEvent(KEY.NODE_DOWN, EventUtils.isTouch(e.type) ? DOM_EVENT_TYPE.TOUCH : DOM_EVENT_TYPE.MOUSE);
                    //触发居中显示
                    that.focusIn(that.getCurMinderNode())
                    break;
                case 'beforemove':
                    if (!isRoot) {
                        that.__triggerNodeEvent(KEY.NODE_BEFORE_MOVE);
                    }
                    this.mathTotalScale();
                    break;
                case 'move':
                    if (!isRoot) {
                        that.__triggerNodeEvent(KEY.NODE_MOVE, e.mMoveAbs.x / that.getTotalScale(), e.mMoveAbs.y / that.getTotalScale());
                        //有移动才出发该事件
                        that.nodeCoverMove();
                    }
                    break;
                case 'aftermove':
                    if (!isRoot) {
                        that.__triggerNodeEvent(KEY.NODE_AFTER_MOVE);
                    }
                    break;
                case 'up':
                    var hasDraw = that.nodeCoverMoveUp();
                    that.__triggerNodeEvent(KEY.NODE_UP, EventUtils.isTouch(e.type) ? DOM_EVENT_TYPE.TOUCH : DOM_EVENT_TYPE.MOUSE, hasDraw, e.mMoveTrigger);
                    break;
            }

        },
        _events: function (e) {
            var that = this;
            var type = e.mType;
            if (type !== 'move') {
                Logger.debug('dommevent', type);
            }
            //绘制中，不允许操作
            if (that._isDrawing) {
                //初始化节点，防止up时，节点信息还是旧的
                if (e.mType === 'down') {
                    that._init(e);
                }
                return;
            }

            //初始化
            switch (e.mType) {
                case 'down':
                    //初始化节点
                    that._init(e);
                    break;
                case 'mPinch':
                    if (e.fingerStatus === 'move') {
                        var scale = e.scale * that.getRelativeScale();
                        that.scale(scale);
                    }
                    break;
                case 'beforemove':
                    that._minderCTM = that._minder.container.node.getCTM();
                    that.__triggerEvent(KEY.DOM_HIDE, false);
                    break;
                case 'move':
                    if (!that._option.editAble || ID.isRoot(that._nodeData.id) || that._nodeData.node === that._minder) {
                        var x = e.mMoveAbs.x,
                            y = e.mMoveAbs.y;
                        if (that._minderCTM) {
                            x /= that._minderCTM.a;
                            y /= that._minderCTM.a;
                        }
                        that._minder.translate(x, y);
                    }
                    break;
                case 'aftermove':
                    if (!that._option.editAble || that._nodeData.node === that._minder) {
                        that._option.onChange(CHANGE_REASON.MINDER_MOVE);
                    }
                    break;
                case 'mDblclick':
                    //移动端交给mTap处理
                    if (that._nodeData.node === that._minder) {
                        if (that._option.disableKeyMap.indexOf('mpdblclick') < 0) {
                            that.matchParent();
                            if (that._option.position.length > 0) {
                                that.changePosition(that._option.position);
                            }
                        }
                    }
                    break;
            }

            //交给各自职责的事件处理
            if (that._nodeData && that._nodeData.value) {
                var value = that._nodeData.value;
                if (that._option.editAble) {
                    if (value.type === 'expand') {
                        that._expandEvent(e);
                    } else if (value.type === 'plus') {
                        that._plusEvent(e);
                    } else if (value.type === 'node') {
                        that._nodeEvent(e);
                    } else if (value.type === 'del') {
                        that._delBtnEvent(e);
                    }
                } else {
                    //不可操作，但是可查看隐藏视图内容时触发
                    if (value.type === 'node' && type === 'mTap' && that._option.contentClickViewAble) {
                        that.__triggerNodeEvent(KEY.NODE_SHOW_CONTENT);
                    } else if (value.type === 'expand') {
                        that._expandEvent(e);
                    }
                }
            }
        },
        bindDomEvent: function () {
            var that = this;
            that.__proxyAll(['_events', '_docKeyListener']);
            //mTap一定要放在touch事件之后、切记（否则会调用两次）！！！ mPinch 放在touch之前！！！ 切记。先触发，先屏蔽移动move事件(jquery 1.7.1的问题)
            //设置初始双指缩放强度
            $(that._paper.node).attr('data-pinch-intensity', this._option.pinchIntensity);
            //初始化
            that._domEvents();
            that._docKeyListener();
            if (Utils.isMobile) {
                $(that._paper.node).on(' mTap mDblclick contextmenu  touchstart touchmove touchend touchcancel  mPinch  mTouchLong', that._domEvents);
            } else {
                $(that._paper.node).on(' mTap mDblclick mousedown  mouseup mousemove contextmenu  mouseleave touchstart touchmove touchend touchcancel  mPinch mTouchLong ', that._domEvents);
                //监听快捷键
                $(document.body).on('keydown keyup mousewheel', that._docKeyListener);
                //$(that._paper.node).on('keydown keyup mousewheel', that._docKeyListener);
            }
            var container = that._option.triggerBlurContainer || document.body;
            that._outClickInstance = __M.Utils.OutClick.create(container);
            $(that._paper.node).mOutclick(function () {
                //触发旧节点失去焦点，样式还原
                //that.__triggerNodeEvent(KEY.NODE_BLUR);
                //触发隐藏其他菜单、文本框
                that.__triggerEvent(KEY.DOM_HIDE, true);
            }, $('#' + that._option.mindBodyId)[0], that._outClickInstance);
        },
        //处理内部事件调用逻辑
        _domEvents: function () {
            var that = this;

            //修复pc端点击事件移动后还触发的问题
            var __fixClick = function (_startPos, _endPos, _startTime, _endTime) {
                var _holdTime = _endTime - _startTime;
                var dx = Math.abs(_endPos.x - _startPos.x);
                var dy = Math.abs(_endPos.y - _startPos.y);
                if (_holdTime > 800 || dx >= 4 || dy >= 4) {
                    return false;
                }
                return true;
            }

            var _downTrigger = false;
            var _touchTrigger = false;
            var _moveTrigger = false;
            var _pinchTrigger = false;
            var _startTime = 0;
            var _holdTime = 0;
            var _startPos = {};
            var _moveLastPos = {};
            var __domEvents = function (e) {
                if (that._option.lock) {
                    return;
                }
                var type = e.type || '';

                //双击事件触发事件,移动端键盘弹出的过程不处理其他事件，否则键盘会收起
                if (Utils.isMobile && that._dblClickTrigger) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                if (type !== 'mousemove' && type !== 'touchmove') {
                    Logger.debug('domevent', type);
                }

                switch (type) {
                    case 'contextmenu':
                        //取消默认的菜单
                        e.preventDefault();
                        e.mType = type;
                        break;
                    case 'mousedown':
                    case 'touchstart':
                        _startTime = new Date().getTime();
                        if (type === 'mousedown') {
                            _startPos = EventUtils.getClientPos(e);
                        }
                        //多指触动时，不在触发该down事件。
                        if (_downTrigger && e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 1) {
                            break;
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
                        if (_pinchTrigger) {
                            return;
                        }
                        var p = Utils.getEventPagePos(e);
                        var x = p.x - _moveLastPos.x;
                        var y = p.y - _moveLastPos.y;
                        e.mMoveAbs = {
                            x: x,
                            y: y
                        };
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
                    case 'mTap':
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
                            var fixed = __fixClick(_startPos, EventUtils.getClientPos(e), _startTime, new Date().getTime());
                            if (!fixed) {
                                return;
                            }
                        }
                        break;
                    case 'mDblclick':
                        if (e.tapEventSource === 'mouseclick') {
                            var fixed = __fixClick(_startPos, EventUtils.getClientPos(e), _startTime, new Date().getTime());
                            if (!fixed) {
                                return;
                            }
                        }
                        e.mType = 'mDblclick';
                        break;
                    case 'mPinch':
                        e.mType = type;

                        if (e.fingerStatus === 'start') {
                            _pinchTrigger = true;
                        } else if (e.fingerStatus === 'move') {

                        } else if (e.fingerStatus === 'end') {
                            _pinchTrigger = false;
                        }
                        break;
                    default:
                        e.mType = type;
                        break;
                }
                that._events(e);

                if (EventUtils.isMove(type) || EventUtils.isDown(type)) {
                    _moveLastPos = Utils.getEventPagePos(e);
                }
            };
            that._domEvents = __domEvents;
        },
        removeDomEvent: function () {
            $(document.body).off('keydown', this._docKeyListener);
            $(document.body).off('keyup', this._docKeyListener);
            $(document.body).off('mousewheel', this._docKeyListener);
            if (this._outClickInstance) {
                this._outClickInstance.disable();
            }
        },
        _docKeyListener: function (e) {

            var that = this;
            var _keyDown = false;
            var _keyCode = 0;
            var _ctrlKey = false;

            var __event = function (e) {
                if (that._option.lock) {
                    return;
                }
                switch (e.type) {
                    case 'keydown':
                        _keyDown = true;
                        _keyCode = e.keyCode;
                        _ctrlKey = e.ctrlKey;
                        if (_ctrlKey) {
                            if (that._option.disableKeyMap.indexOf('ctrl++/') < 0) {
                                if (_keyCode === 187 || _keyCode === 107) {
                                    e.preventDefault();
                                    that.scale(that.getRelativeScale() + that.getRelativeScale() * 0.15);
                                } else if (_keyCode === 189 || _keyCode === 109) {
                                    e.preventDefault();
                                    that.scale(that.getRelativeScale() - that.getRelativeScale() * 0.15);
                                }
                            }
                        }
                        break;
                    case 'keyup':
                        _keyDown = false;
                        _ctrlKey = false;
                        _keyCode = 0;
                        break;
                    case 'mousewheel':
                        //滚轮缩放
                        if (that._option.disableKeyMap.indexOf('space+wheel') < 0) {
                            if (_keyDown && _keyCode === 32) {
                                e.preventDefault();
                                //获取焦点，防止空格点击触发其他按钮点击事件
                                $('#' + that._option.mindBodyId).find('#btn_focus').focus();
                                that.scale(that.getRelativeScale() + (e.originalEvent.deltaY < 0 ? 1 : -1) * that.getRelativeScale() * 0.15);
                            }
                        }
                        break;
                }
            };

            that._docKeyListener = __event;

            return;//二期处理快捷键 


            Logger.debug('keycode', e.ctrlKey, e.keyCode);
            if (that._paper) {
                //刷新
                if (!e.ctrlKey) {
                    return;
                }
                var $$text;
                try {
                    $$text = that._paper.getShapeById(ID.getTextIdByNodeId(that._tempLastId));
                } catch (e) {
                }
                if (!$$text) {
                    return;
                }
                var text = $$text.getContent();
                if (that._option.showMenu) {
                    that._menu.__setNodeId(that._tempLastId);
                    //复制
                    if (e.ctrlKey && e.keyCode === 67) {
                        that._menu.triggerMenuClick(MENU_TYPE_KEY.COPY, text);
                    }
                    //黏贴
                    if (e.ctrlKey && e.keyCode === 86) {
                        if (!that._clipboard.isEmpty()) {
                            that._menu.triggerMenuClick(MENU_TYPE_KEY.PASTE, text);
                        }
                    }
                    //剪切
                    if (e.ctrlKey && e.keyCode === 88) {
                        that._menu.triggerMenuClick(MENU_TYPE_KEY.CUT, text);
                    }
                }
            }
        }
    };

    __M.MindCore.__include(DomEvent);
}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/29.
 */

(function (window, $, __M) {
    var Logger = __M.Logger;
    var Utils = __M.Utils;
    var KEY = __M.Config.EVENT_KEY;
    var MENU_TYPE_KEY = __M.Config.MENU_TYPE_KEY;


    var HotKeys = {
        _hotKeys: [],
        _register: function (name, key, callback, ctrl, shift) {
            this._hotKeys.push({
                name: name,
                key: key,
                callback: callback,
                ctrl: ctrl,
                shift: shift
            });
        },
        _initHotKey: function () {
            this._register('enter', [13, 108], this._enter);//增加统计节点
            this._register('space+wheel', [32], this._spaceWheel);//缩放
            this._register('ctrl+plus', [187, 107], this._ctrlPlus, true);//放大
            this._register('ctrl+subtract', [109, 189], this._ctrlSubtract, true);//缩小
            this._register('ctrl+a', [65], this._ctrlA, true);//全选
            this._register('ctrl+c', [67], this._ctrlC, true);//复制
            this._register('ctrl+v', [86], this._ctrlV, true);//黏贴
            this._register('ctrl+x', [88], this._ctrlX, true);//剪切
            this._register('ctrl+click', [88], this._ctrlClick, true);//多选 TODO:
            this._register('ctrl+move', [88], this._ctrlMove, true);//框选 TODO:
            this._register('tab', [9], this._tab);//增加子节点
            this._register('delete', [46], this._delete);//删除节点
            this._register('arrows', [37, 38, 39, 40], this._arrows);//上下左右移动选中的节点
          },
        _ctrlSubtract: function () {

        },
        _ctrlPlus: function () {

        },
        _ctrlMove: function () {

        },
        _ctrlClick: function () {

        },
        _arrows: function () {

        },
        _delete: function () {

        },
        _enter: function () {

        },
        _spaceWheel: function () {

        },
        _ctrlA: function () {

        },
        _ctrlC: function () {

        },
        _ctrlV: function () {

        },
        _ctrlX: function () {

        },
        _tab: function () {

        },
        removeDomEvent: function () {
            $(document.body).off('keydown', this._docKeyListener);
            $(document.body).off('keyup', this._docKeyListener);
            $(document.body).off('mousewheel', this._docKeyListener);
        },
        _docKeyListener: function (e) {
        }
    };

    __M.MindCore.__include({});
}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/29.
 */

(function (window, $, __M) {
    var Logger = __M.Logger;
    var Utils = __M.Utils;
    var KEY = __M.Config.EVENT_KEY;
    var ID = __M.ID;
    var _nodeStyle = __M.Config.nodeStyle;

    //当前作用域变量
    var MoveCover = {
        _coverType: '',//覆盖类型
        _coverTargetRectPath: null,//父子节点：覆盖的节点
        _coverPlaceholderRectPath: null,//兄弟节点：覆盖节点
        _mouseRateNum: 0,//移动计算频率
        _curMoveMinderNode: null,
        _getCurMoveMinderNode: function () {
            return this._curMoveMinderNode;
        },
        //还原覆盖的节点样式
        _recoveryRectPathStyle: function () {
            if (this._coverTargetRectPath.nodeId) {
                var $rectPath = $('#' + this._option.mindBodyId + ' #' + this._coverTargetRectPath.nodeId + '>path');
                $rectPath.css(_nodeStyle.strokeStyle);
            }
        },
        //是否覆盖其他非子节点
        _isCoverOtherRect: function (curNodePos) {
            var rectA = {};
            rectA.p1 = {
                x: curNodePos.innerRectX,
                y: curNodePos.innerRectY
            };
            rectA.p2 = {
                x: curNodePos.innerRectX + curNodePos.innerRectWidth,
                y: curNodePos.innerRectY + curNodePos.innerRectHeight
            };
            var nodesPos = this.getRoot().rtGetPosRecords();
            var paddingSpaceX = _nodeStyle.width / 10;
            var paddingSpaceY = _nodeStyle.height / 8;
            for (var key in nodesPos) {
                var nPos = nodesPos[key];
                if (!nPos.visible) {
                    continue;
                }
                if (nPos.containParentId.indexOf(curNodePos.containParentId) >= 0) {
                    continue;
                }
                var rectB = {};
                //取目标矩形的三分之一中心位置去比较是否覆盖
                rectB.p1 = {
                    x: nPos.innerRectX + paddingSpaceX,
                    y: nPos.innerRectY + paddingSpaceY
                };
                rectB.p2 = {
                    x: nPos.innerRectX + nPos.innerRectWidth - paddingSpaceX,
                    y: nPos.innerRectY + nPos.innerRectHeight - paddingSpaceY
                };
                //根据两矩形坐标判断是否相交
                if (Utils.checkRectsCross(rectA, rectB)) {
                    return {
                        success: true,
                        coverNodeId: key
                    };
                }
            }
            return {success: false};
        },
        //是否覆盖同级节点顺序变化区域
        _isCoverPlaceholderRect: function (curNodePos) {
            var rectA = {};
            rectA.p1 = {
                x: curNodePos.innerRectX,
                y: curNodePos.innerRectY
            };
            rectA.p2 = {
                x: curNodePos.innerRectX + curNodePos.innerRectWidth,
                y: curNodePos.innerRectY + curNodePos.innerRectHeight
            };
            var nodesPos = this.getRoot().rtGetPosRecords();
            var paddingSpaceX = _nodeStyle.width / 10;
            var paddingSpaceY = _nodeStyle.height / 8;
            for (var key in nodesPos) {

                var nPos = nodesPos[key];
                if (!nPos.visible) {
                    continue;
                }
                //如果是当前移动节点子节点则无需要判断
                if (nPos.containParentId.indexOf(curNodePos.containParentId) >= 0) {
                    continue;
                }

                var curParentId = curNodePos.containParentId.substring(0, curNodePos.containParentId.length - curNodePos.nodeId.length);
                var tempParentId = nPos.containParentId.substring(0, nPos.containParentId.length - key.length);

                //父节点相同的同级节点才做顺序改变
                if (curParentId !== tempParentId) {
                    continue;
                }

                var rectB = {};
                //取目标矩形的三分之一中心位置去比较是否覆盖
                rectB.p1 = {
                    x: nPos.innerRectX + paddingSpaceX,
                    y: nPos.innerRectY + paddingSpaceY
                };
                rectB.p2 = {
                    x: nPos.innerRectX + nPos.innerRectWidth - paddingSpaceX,
                    y: nPos.innerRectY + _nodeStyle.height - paddingSpaceY
                };
                //取目标矩形上方同等矩形的三分之一中心位置去比较是否覆盖
                var topRect = {
                    p1: {
                        x: rectB.p1.x,
                        y: rectB.p1.y - _nodeStyle.height
                    },
                    p2: {
                        x: rectB.p2.x,
                        y: rectB.p2.y - _nodeStyle.height
                    }
                };
                //取目标矩形下方同等矩形的三分之一中心位置去比较是否覆盖
                var bottomRect = {
                    p1: {
                        x: rectB.p1.x,
                        y: rectB.p1.y + nPos.innerRectHeight
                    },
                    p2: {
                        x: rectB.p2.x,
                        y: rectB.p2.y + nPos.innerRectHeight
                    }
                };
                //根据两矩形坐标判断是否相交
                if (Utils.checkRectsCross(rectA, topRect)) {
                    return {
                        success: true,
                        nodeId: key,
                        direction: 'top'
                    };
                } else if (Utils.checkRectsCross(rectA, bottomRect)) {
                    return {
                        success: true,
                        nodeId: key,
                        direction: 'bottom'
                    };
                }
            }
            return {success: false};
        },
        _coverReset: function () {
            this._curMoveMinderNode = null;
            this._mouseRateNum = 0;
            this._coverTargetRectPath = {};
            this._coverPlaceholderRectPath = {};
            this._coverType = '';
        },
        nodeCoverMoveUp: function () {
            if (!this._getCurMoveMinderNode()) {
                return;
            }
            //恢复当前节点样式
            var coverType = this._coverType,
                coverId = this._coverTargetRectPath.nodeId,
                curMinderNode = this._getCurMoveMinderNode(),
                curNodeId = curMinderNode.getNodeId(),
                hasDraw = false;

            //隐藏占位符
            this._placeholder.setVisible(false);
            //恢复样式
            this._recoveryRectPathStyle();

            if (curMinderNode) {
                if (coverType === 'cover') {
                    //父子节点关系变化
                    if (coverId !== null
                        && coverId !== curNodeId) {
                        //不能修改父节点，直接还原
                        if (!this._curMoveMinderNode.getChangeParentAble()) {
                            //&& curMinderNode.getParent().getNodeId() !== coverId) {
                            this.__triggerNodeEventByNodeId(KEY.NODE_RESTORE, curNodeId);
                        } else {
                            this.__triggerNodeEventByNodeId(KEY.NODE_COVER, coverId, curMinderNode);
                        }
                        hasDraw = true;
                    }
                } else if (coverType === 'coverPlaceholder') {
                    //兄弟节点关系变化
                    var coverDirection = this._coverPlaceholderRectPath.direction;
                    coverId = this._coverPlaceholderRectPath.nodeId;
                    if (!this._curMoveMinderNode.getChangeBroAble()) {
                        //this.__triggerNodeEventByNodeId(KEY.NODE_RESTORE, curNodeId);
                        hasDraw = true;
                    } else {
                        hasDraw = curMinderNode.drawAndChangeBroRelation(coverId, coverDirection);
                    }
                }
            }

            this._coverReset();
            return hasDraw;
        },
        nodeCoverMove: function () {
            var that = this;
            if (!this._getCurMoveMinderNode()) {
                return;
            }
            that._mouseRateNum++;
            //设置移动时节点样式
            this._getCurMoveMinderNode().getRectPath().setStyle(_nodeStyle.moveStyle);

            //拖动执行平率为0.25
            if (that._mouseRateNum % 2 !== 0) {
                return;
            }
            var curNodPos = that._getCurMoveMinderNode().getCurNodePosition();

            //是否覆盖其他节点
            var coverResult = that._isCoverOtherRect(curNodPos);
            //第一个分支：当前节点是否与其它节点覆盖
            if (coverResult.success === true) {
                if (!this._coverTargetRectPath.nodeId || this._coverTargetRectPath.nodeId !== coverResult.coverNodeId) {

                    //还原被覆盖的旧节点样式
                    that._recoveryRectPathStyle();

                    //设置被覆盖的节点样式
                    this._coverTargetRectPath = {
                        nodeId: coverResult.coverNodeId
                    };

                    this._coverType = 'cover';
                    Logger.info(' TargetRect is cover at moving! ');

                    //不能修改父节点
                    if (!this._curMoveMinderNode.getChangeParentAble()) {
                        //&& this._getCurMoveMinderNode().getParent().getNodeId() !== coverResult.coverNodeId) {
                        return
                    }

                    var $rectPath = $('#' + that._option.mindBodyId + ' #' + coverResult.coverNodeId + '>path');
                    $rectPath.css(_nodeStyle.moveCoverStyle);
                }
                this._placeholder.setVisible(false);
            } else {
                //是否移动到同级节点占位符
                coverResult = this._isCoverPlaceholderRect(curNodPos);

                if (coverResult.success === true) {
                    this._coverPlaceholderRectPath = coverResult;

                    var $$phRect = this._placeholder.getRectShape();
                    var $$coverRectPath = this.getShapeById(coverResult.nodeId);
                    var tempIndex = Utils.String.getTemplateValue(coverResult.nodeId, ID._nodeId).i;
                    var $$innerRect = this.getShapeById(ID.getTextBorderId(tempIndex));
                    var heightRate = 0.7;
                    //设置占位宽高
                    $$phRect.setWidth($$innerRect.getWidth());
                    $$phRect.setHeight(_nodeStyle.height * heightRate);
                    //获取覆盖的节点位置信息
                    var matrix = $$coverRectPath.getTransform();
                    var innerMatrix = $$innerRect.getTransform();
                    matrix.m.e += innerMatrix.m.e;
                    matrix.m.f += innerMatrix.m.f;

                    if (coverResult.direction === 'top') {
                        matrix.m.f -= (_nodeStyle.height * heightRate + 5);
                    } else {
                        matrix.m.f += $$innerRect.getHeight() + 5;
                    }
                    this._placeholder.setMatrix(matrix);
                    if (this._curMoveMinderNode.getChangeBroAble()) {
                        this._placeholder.setVisible(true);
                    }
                    this._coverType = 'coverPlaceholder';
                } else {
                    this._placeholder.setVisible(false);
                    this._coverType = '';
                }
                //还原之前被覆盖的节点样式
                this._recoveryRectPathStyle();
                this._coverTargetRectPath = {};
            }
        },
        nodeCoverMoveDown: function (nodeId) {
            //获取当前移动的节点
            this._curMoveMinderNode = this.getMinderNodeById(nodeId);
            if (this._curMoveMinderNode.isRoot() || !this._curMoveMinderNode.getMoveAble()) {
                this._curMoveMinderNode = null;
                return;
            }

            //初始化数据
            this._mouseRateNum = 0;
            this._coverTargetRectPath = {};
            this._coverPlaceholderRectPath = {};
            this._coverType = '';
            //清除不存在的节点
            var positionRecord = this.getRoot().rtGetPosRecords();
            for (var key in positionRecord) {
                var shape = this.getShapeById(key);
                if (!shape) {
                    delete positionRecord[key];
                } else {
                    positionRecord[key].visible = shape.node.getAttribute("display") !== 'none';
                }
            }
        }
    };


    __M.MindCore.__include(MoveCover);
}(window, jQuery, __M));
/**
 * Created by ylf on 2016/5/24.
 */

(function (window, $, __M) {
    var Logger = __M.Logger;
    var CHANGE_REASON = __M.Config.CHANGE_REASON;

    var setExtentProperties = function (dataPath, node, value) {
        if (dataPath === 'requireChildren') {
            node.setRequireChildren(value);
        }
        if (dataPath === 'requireContent') {
            node.setRequireContent(value);
        }
        if (dataPath === 'contentEditAble') {
            node.setContentEditAble(value);
        }
        if (dataPath === 'deleteAble') {
            node.setDeleteAble(value);
        }
        if (dataPath === 'moveAble') {
            node.setMoveAble(value);
        }
        if (dataPath === 'changeParentAble') {
            node.setChangeParentAble(value);
        }
        if (dataPath === 'changeBroAble') {
            node.setChangeBroAble(value);
        }
    }

    // patch.op - 操作，包括 remove, add, replace
    // patch.path - 路径，如 '/root/children/1/data'
    // patch.value - 数据，如 { text: "思路" }
    var Patch = {
        _createNode: function (patchData, parentNode, index) {
            var node = parentNode.addNode(patchData, index, true);
            node.setExpand(patchData.isExpand);
            if (patchData.matrix) {
                var matrixAr = patchData.matrix.split(' '),
                    targetMatrix;
                if (matrixAr.length === 6) {
                    targetMatrix = new kity.Matrix(matrixAr[0], matrixAr[1], matrixAr[2], scale, matrixAr[4], matrixAr[5]);
                } else {
                    targetMatrix = new kity.Matrix(1, 0, 0, 1, matrixAr[0], matrixAr[1]);
                }
                node.setMatrix(targetMatrix);
            }

            return node;
        },
        insertNode: function (info, parent, index) {
            var that = this;
            parent = this._createNode(info.data, parent, index);
            info.children.forEach(function (childInfo, index) {
                that.insertNode(childInfo, parent, index);
            });
            return parent;
        },
        patches: function (patches) {
            var reason = '';
            for (var i = 0; i < patches.length; i++) {
                this.patch(patches[i]);
                var path = patches[i].path.split('/');
                var content = path.pop();
                var op = patches[i].op;
                if (op === 'add') {
                    reason = CHANGE_REASON.ADD;
                } else if (op === 'remove') {
                    reason = CHANGE_REASON.DELETE;
                } else if (op === 'replace') {
                    if (content === 'text') {
                        reason = CHANGE_REASON.TEXT_CONTENT;
                    }
                    if (content === 'orientation') {
                        reason = CHANGE_REASON.ORIENTATION_CHANGE;
                    }
                }
            }

            this.getRoot().trvShow();
            this.getRoot().trvDrawInit();
            if (reason) {
                this._option.onChange(reason);
            }
            return this;
        },
        patch: function (patch) {
            var path = patch.path.split('/');
            path.shift();
            var changed = path.shift();
            var node;
            if (changed == 'root') {
                var dataIndex = path.indexOf('data');
                if (dataIndex > -1) {
                    changed = 'data';
                    var dataPath = path.splice(dataIndex + 1);
                    patch.dataPath = dataPath;
                } else {
                    changed = 'node';
                }
                node = this.getRoot();
                var segment, index;
                while (segment = path.shift()) {
                    if (segment == 'children') continue;
                    if (typeof index != 'undefined') node = node.getChild(index);
                    index = +segment;
                }
                patch.index = index;
                patch.node = node;

            }

            var express = patch.express = [changed, patch.op].join(".");
            Logger.debug('diff-patch', patch);
            //if (express !== 'minder.replace' && !patch.node) {
            //    return;
            //}
            switch (express) {
                case "minder.replace":
                    var matrixAr = patch.value.split(' '),
                        scale = this._minder.getTransform().m.a,
                        targetMatrix;
                    //不改变缩放值
                    if (matrixAr.length === 6) {
                        targetMatrix = new kity.Matrix(scale, matrixAr[1], matrixAr[2], scale, matrixAr[4], matrixAr[5]);
                    } else {
                        targetMatrix = new kity.Matrix(scale, 0, 0, scale, matrixAr[0], matrixAr[1]);
                    }
                    this._minder.setMatrix(targetMatrix);
                    break;
                case "node.add":
                    this.insertNode(patch.value, patch.node, patch.index);
                    break;
                case "node.remove":
                    //if (patch.node && patch.node.getChild(patch.index)) {
                    patch.node.getChild(patch.index).destroy();
                    //} else {
                    //    Logger.debug('diff-patch-node.remove-null', patch);
                    //}
                    break;
                case "data.replace":
                    var dataPath = patch.dataPath.shift();
                    if (dataPath === 'text') {
                        patch.node.setText(patch.value);
                        patch.node.layoutBox();
                    }
                    if (dataPath === 'matrix') {
                        var matrixAr = patch.value.split(' '),
                            targetMatrix;

                        if (matrixAr.length === 6) {
                            targetMatrix = new kity.Matrix(matrixAr[0], matrixAr[1], matrixAr[2], scale, matrixAr[4], matrixAr[5]);
                        } else {
                            targetMatrix = new kity.Matrix(1, 0, 0, 1, matrixAr[0], matrixAr[1]);
                        }
                        patch.node.setMatrix(targetMatrix);
                    }
                    if (dataPath === 'textVisible') {
                        patch.node.setTextVisible(patch.value);
                        patch.node.layoutBox();
                    }
                    if (dataPath === 'isExpand') {
                        patch.node.setExpand(patch.value);
                        patch.node.trvShow();
                    }
                    if (dataPath === 'identifier') {
                        patch.node.setIdentifier(patch.value);
                    }
                    setExtentProperties(dataPath, patch.node, patch.value);
                    if (dataPath === 'requireChildren') {
                        patch.node.layoutBox();
                    }
                    break;
                case 'data.remove':
                    var dataPath = patch.dataPath.shift();
                    setExtentProperties(dataPath, patch.node, undefined);
                    if (dataPath === 'requireChildren') {
                        patch.node.layoutBox();
                    }
                    break;
                case 'data.add':
                    var dataPath = patch.dataPath.shift();
                    setExtentProperties(dataPath, patch.node, patch.value);
                    if (dataPath === 'requireChildren') {
                        patch.node.layoutBox();
                    }
                    break;
            }

        }
    };


    __M.MindCore.__include(Patch);
}(window, jQuery, __M));
(function (window, $, __M) {

    var Utils = __M.Utils;
    var Logger = __M.Logger;
    var CHANGE_REASON = __M.Config.CHANGE_REASON;

    var MAX_HISTORY = 20;


    __M.History = {
        _undoDiffs: null,
        _redoDiffs: null,
        _minder: null,
        _lastSnap: null,
        _patchLock: null,
        create: function (minder) {
            var instance = Object.create(this);
            instance._undoDiffs = [];
            instance._redoDiffs = [];
            instance._minder = minder;
            instance._lastSnap = instance.getData();

            instance._minder.on("change", instance.changed, instance);
            instance._minder.on("rendered", instance.reset, instance);
            return instance;
        },
        reset: function () {
            this._undoDiffs = [];
            this._redoDiffs = [];
            this._lastSnap = this.getData();
        },
        getData: function () {
            return this._minder.getData(true, true);
        },
        makeUndoDiff: function () {
            var headSnap = this.getData();
            var diff = Utils.JsonDiff.compare(headSnap, this._lastSnap);
            Logger.debug('diff-undo', JSON.stringify(diff));
            Logger.debug('diff-undo', JSON.stringify(diff), this._undoDiffs, headSnap, this._lastSnap);
            if (diff.length) {
                this._undoDiffs.push(diff);
                while (this._undoDiffs.length > MAX_HISTORY) {
                    this._undoDiffs.shift();
                }
                this._lastSnap = headSnap;
                return true;
            }
        },
        makeRedoDiff: function () {
            var revertSnap = this.getData();
            var diff = Utils.JsonDiff.compare(revertSnap, this._lastSnap);
            this._redoDiffs.push(diff);
            Logger.debug('diff-redo', JSON.stringify(diff));
            Logger.debug('diff-redo', diff, this._redoDiffs);
            this._lastSnap = revertSnap;
        },
        undo: function () {
            this._patchLock = true;
            var undoDiff = this._undoDiffs.pop();
            if (undoDiff) {
                this._minder._mindCore.patches(undoDiff);
                this.makeRedoDiff();
            }
            this._minder._eventBus.trigger('change', CHANGE_REASON.UNDO_REDO);
            this._patchLock = false;
        },
        redo: function () {
            this._patchLock = true;
            var redoDiff = this._redoDiffs.pop();
            if (redoDiff) {
                this._minder._mindCore.patches(redoDiff);
                this.makeUndoDiff();
            }
            this._minder._eventBus.trigger('change', CHANGE_REASON.UNDO_REDO);
            this._patchLock = false;
        },
        changed: function (type) {
            if (type === CHANGE_REASON.RENDER) {
                this.reset();
                return;
            }
            if (this._patchLock) return;
            if (this.makeUndoDiff()) this._redoDiffs = [];
        },
        hasUndo: function () {
            return !!this._undoDiffs.length;
        },
        hasRedo: function () {
            return !!this._redoDiffs.length;
        }
    }

}(window, jQuery, __M));
/**
 * Created by ylf on 2016/3/31.
 */

(function (window, $, __M) {
    var MindCore = __M.MindCore;
    var Event = __M.Event;
    var Logger = __M.Logger;
    var Utils = __M.Utils;
    var Lang = __M.Config.DefaultLang;
    var KEY = __M.Config.EVENT_KEY;
    var CHANGE_REASON = __M.Config.CHANGE_REASON;

    //对外抛出的参数
    var OPTION = {
        create: function (option) {
            var instance = Object.create(this);
            if (option) {
                for (var key in option) {
                    instance[key] = option[key];
                    if (key === 'langData') {
                        instance[key] = $.extend(true, {}, Lang, option.langData);
                    } else {
                        if (option[key] !== null) {
                            instance[key] = option[key];
                        }
                    }
                }
            }

            //TODO:先强制移除移动端的动画效果，后续如果性能跟的上再打开
            if (Utils.isMobile) {
                instance.animate = false;
                //instance.baseScale=1.4
            } else {
                //instance.baseScale=1.5
            }

            if (instance.rootVertical) {
                instance.rootPaddingX = 10;
                instance.rootPaddingY = 15;
                instance.rootMinWidth = 43;
            }
            if (instance.type !== 'both') {
                instance.autoRideCount = 10000;
            }

            return instance;
        },
        lock: false,//是否锁定
        maxScale: 2.5,
        minScale: 0.1,
        editAble: true,//是否可编辑，设置为false,则只能整体移动、展开收起
        animate: true,//是否显示动画
        showMenu: true,//是否显示菜单
        ignoreAttrTextVisible: false,//使数据中textVisible无效
        contentClickViewAble: false,//是否可点击查看隐藏内容
        renderDataAutoLayout: true,//初始化数据时是否进行自动布局，默认自动布局
        pinchIntensity: 0.8,//缩放灵敏度，值越大越快,
        baseScale: 1.0,//默认缩放尺寸，对外部透明，所有的缩放值都是以这个为基准
        disableKeyMap: [],//已经使用的keymap: 缩放： ctrl++/  space+wheel  、 自动缩放布局(matchparent)：mpdblclick
        hideMenuItem: [],//copy edit visible cut paste delete
        langData: Lang,
        triggerBlurContainer: null,//触发失去节点
        autoRideCount: 4,//左右自动排版的触发值
        type: 'both',//思维导图类型： left  right both
        rootVertical: false,//根节点垂直样式
        showRequireStar: false,//显示星号
        showRequireFill: true,//是否显示必填项，填写之后的颜色
        remarkVisible: false,//显示备注
        remarkEditAble: false,//备注可编辑
        viewPort: [],
        position: []// left top bottom right
    };

    window.MinderMap = {
        _mindCore: null,
        _eventBus: null,
        _commandQueue: null,
        _history: null,
        _lang: null,
        create: function (option) {
            var instance = Object.create(this);
            option = OPTION.create(option);

            //instance._lang = option.langData;
            //初始化语言包
            // __M.Config.Lang = option.langData;
            //绑定缩放事件
            option.onScale = function (scale) {
                instance._eventBus.trigger('scale', scale);
            };

            option.onChange = function (type) {
                if (type === CHANGE_REASON.MINDER_MOVE || type === CHANGE_REASON.MINDER_SCALE) {
                    instance._mindCore.resizeRemark();
                    return;
                }
                instance._eventBus.trigger('change', type);
                //内容有变化才触发
                if (type === CHANGE_REASON.BRO_RELATION
                    || type === CHANGE_REASON.PARENT_CHANGE
                    || type === CHANGE_REASON.DELETE
                    || type === CHANGE_REASON.TEXT_CONTENT
                    || type === CHANGE_REASON.ORIENTATION_CHANGE
                    || type === CHANGE_REASON.ADD
                    || type === CHANGE_REASON.CLEAR
                ) {
                    instance._eventBus.trigger('contentChange', type);
                }
            };
            instance._eventBus = Event.create();
            instance._mindCore = MindCore.create(option);

            //创建命令队列
            instance._history = __M.History.create(instance);
            return instance;
        },
        render: function (obj) {
            var type = typeof  obj;
            if (type === 'string') {
                obj = document.getElementById(obj);
            } else if (type === 'object') {
                if (obj instanceof jQuery) {
                    obj = obj[0];
                }
            }
            this._mindCore.render(obj);
            this._eventBus.trigger('rendered', '');
            //发送change事件，更新undo/redo
            this._eventBus.trigger('change', CHANGE_REASON.RENDER);
        },
        setData: function (data) {
            this._mindCore.setData(data);
        },
        getData: function (ignoreRemark, ignoreOffset) {
            return this._mindCore.getData(ignoreRemark, ignoreOffset);
        },
        rootCenter: function () {
            this._mindCore.rootCenter();
            if (!this._mindCore.getEditAble()) {
                this._mindCore.focusEditDisableRoot();
            } else if (!this._mindCore.getLock()) {
                this._mindCore.focusRoot();
            }
        },
        focusRoot: function () {
            this._mindCore.focusRoot();
        },
        focusCenter: function () {
            this._mindCore.focusCenter();
        },
        blur: function () {
            this._mindCore.blur();
        },
        matchParent: function () {
            this._mindCore.matchParent();
        },
        changePosition: function (val) {
            this._mindCore.changePosition(val);
        },
        hasChange: function () {
            return this._mindCore.hasChange();
        },
        setLock: function (lock) {
            this._mindCore.setLock(lock);
        },
        setEditAble: function (able) {
            this._mindCore.setEditAble(able);
        },
        clear: function () {
            this._mindCore.clear();
        },
        scale: function (scale) {
            this._mindCore.scale(scale);
        },
        onResize: function () {
            this._mindCore.onResize();
        },
        undo: function () {
            if (this._mindCore.getEditTextVisible()) {
                this._mindCore.blur(false);
            } else {
                this.blur();
                this._history.undo();
            }
        },
        redo: function () {
            if (this._mindCore.getEditTextVisible()) {
                this._mindCore.blur(false);
            } else {
                this.blur();
                this._history.redo();
            }
        },
        hasUndo: function () {
            //return this._mindCore.hasChange();
            return this._history.hasUndo();
        },
        hasRedo: function () {
            return this._history.hasRedo();
        },
        on: function (type, callback, domain) {
            this._eventBus.add(type, callback, domain || this);
        },
        off: function (type, callback) {
            this._eventBus.remove(type, callback);
        },
        setLogLevel: function (level) {
            Logger.setLevel(level);
        },
        getLang: function (key) {
            return this._lang[key];
        },
        isValid: function () {
            var data = this.getData(true, true);
            var valid = function (nodeData) {
                var flag = true;
                var data = nodeData.data;
                var children = nodeData.children;
                if (data.requireChildren && children.length <= 0) {
                    return false;
                }
                if (data.requireContent && data.text.trim() === '') {
                    return false;
                }

                for (var i = 0; i < children.length; i++) {
                    if (!valid(children[i])) {
                        flag = false;
                        return flag;
                    }
                }

                return flag;
            }
            return valid(data.root);
        },
        destroy: function () {
            if (this._mindCore) {
                this._mindCore.destroy();
            }
            this._eventBus = null;
            this._mindCore = null;
        }
    };
}(window, jQuery, __M));
})(window,document,jQuery)