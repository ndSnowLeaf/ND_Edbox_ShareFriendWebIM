//version=1.0
(function(window,document){
/**
 * Created by ylf on 2015/12/9.
 */
var __Q = (function () {
    'use strict';

    var typeUndefined = typeof undefined;

    //兼容代码
    if (typeof String.prototype.trim === typeUndefined) {
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        };
    }
    //兼容代码
    if (typeof Array.prototype.forEach === typeUndefined) {
        Array.prototype.forEach = function (callback) {
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                callback.apply(this, [item, i, this]);
            }
        };
    }


    var addEventListener = function (target, type, handler) {
        if (target.addEventListener) {
            target.addEventListener(type, handler, false);
        } else if (target.attachEvent) {
            type = 'on' + type;
            target.attachEvent(type, handler);
        } else {
            target['on' + type] = handler;
        }
    };
    var removeEventListener = function (target, type, handler, flag) {
        if (target.removeEventListener) {
            target.removeEventListener(type, handler, flag);
        } else if (target.detachEvent) {
            type = 'on' + type;
            target.detachEvent(type, handler);
        } else {

        }
    };

    var getStyle = function (domObj, attribute) {
        var style = domObj.style[attribute];
        if (style) {
            return style;
        }
        return domObj.currentStyle ? domObj.currentStyle[attribute] : document.defaultView.getComputedStyle(domObj, '')[attribute];
    }

    var _q = function (selector, context) {
        if (typeof selector === typeUndefined || selector == null) {
            return;
        }

        if (typeof context === 'string') {
            selector = context + ' ' + selector;
        }

        if (typeof context === typeUndefined || selector === null || context === document.body) {
            context = document;
        }

        this._selector = typeof selector === 'object' ? selector : selector.trim();
        this._dom = [];
        this.length = 0;

        if (typeof selector === 'object') {
            this._dom[0] = selector;
            this.length = 1;
        }
        //#id selector /.class selector
        else if (this._selector.substring(0, 1) === '#' && this._selector.indexOf(' ') <= -1) {
            this._dom[0] = document.getElementById(this._selector.substring(1, this._selector.length));
            if (this._dom[0]) {
                this.length = 1;
            }
        } else {
            this._dom = context.querySelectorAll(this._selector);
            this.length = this._dom.length;
        }
        return this;
    };
    _q.prototype = {
        each: function (fn) {
            if (this.length > 0) {
                for (var i = 0; i < this.length; i++) {
                    var dom = this._dom[i];
                    (function () {
                        fn.apply(dom, [i]);
                    })(i);
                }
            }
        },
        get: function (i) {
            return this._dom[i];
        },
        show: function () {
            this.each(function () {
                this.style.display = 'block';
            });
        },
        hide: function () {
            this.each(function () {
                this.style.display = 'none';
            });
        },
        isShow: function () {
            return this.css('display') === 'block';
        },
        toggle: function () {
            this.each(function () {
                if (getStyle(this, 'display') === 'block') {
                    this.style.display = 'none';
                } else {
                    this.style.display = 'block';
                }
            });
        },
        css: function (name, value) {
            if (typeof value === typeUndefined) {
                return getStyle(this._dom[0], name);
            } else {
                this.each(function () {
                    this.style[name] = value;
                });
            }
        },
        find: function (selector) {
            return __Q(selector, this._dom[0]);
        },
        bind: function (event, fn) {
            this.on(event, '', fn);
        },
        addClass: function (clsName) {
            clsName = clsName.trim();

            this.each(function () {
                var classValue = this.getAttribute('class');
                var cls = classValue != null ? classValue.split(' ') : '';
                var newCls = clsName;
                for (var j = 0; j < cls.length; j++) {
                    var c = cls[j].trim();
                    if (c === clsName || c === '') {
                        continue;
                    }
                    newCls += ' ' + c;
                }
                this.setAttribute('class', newCls);
            });
            return this;
        },
        hasClass: function (clsName) {
            clsName = clsName.trim();
            var hasCls = false;
            this.each(function () {
                var classValue = this.getAttribute('class');
                var cls = classValue != null ? classValue.split(' ') : '';
                for (var j = 0; j < cls.length; j++) {
                    if (cls[j].trim() === clsName) {
                        hasCls = true;
                        break;
                    }
                }
            });
            return hasCls;

        },
        removeClass: function (clsName) {
            clsName = clsName.trim();
            this.each(function () {
                var classValue = this.getAttribute('class');
                var cls = classValue != null ? classValue.split(' ') : '';
                var newCls = '';
                for (var j = 0; j < cls.length; j++) {
                    var c = cls[j].trim();
                    if (c === clsName || c === '') {
                        continue;
                    }
                    newCls += ' ' + c;
                }
                this.setAttribute('class', newCls);
            });
        },
        toggleClass: function (clsName) {
            this.each(function () {
                var cls = this.getAttribute('class').split(' ');
                var newCls = '';
                var hasCls = false;
                for (var j = 0; j < cls.length; j++) {
                    var c = cls[j].trim();
                    if (c === '') {
                        continue;
                    }
                    if (c === clsName) {
                        hasCls = true;
                        continue;
                    }
                    newCls += ' ' + c;
                }

                if (!hasCls) {
                    newCls += ' ' + clsName;
                }
                this.setAttribute('class', newCls);
            });
        },
        attr: function (attr, val) {
            if (typeof val !== 'undefined') {
                this.each(function () {
                    if (typeof val !== 'undefined') {
                        this.setAttribute(attr, val);
                    }
                });
                return this;
            } else {
                return this._dom[0].getAttribute(attr);
            }


        },
        removeAttr: function (attr) {
            this.each(function () {
                if (attr instanceof Array) {
                    for (var i = 0; i < attr.length; i++) {
                        this.removeAttribute(attr[i]);
                    }
                } else {
                    this.removeAttribute(attr);
                }
            });
        },
        text: function (txt) {
            if (typeof txt === typeof undefined) {
                throw new Error('only support set text');
            }
            this.each(function () {
                this.innerText = txt;
            });
        },
        width: function () {
            if (arguments.length > 0) {
                throw new Error('only support get');
            }
            var width = this._dom[0].offsetWidth;
            if (!width) {
                width = parseInt(this.css('width'));
            }
            return width;
        },
        height: function () {
            if (arguments.length > 0) {
                throw new Error('only support get');
            }
            var height = this._dom[0].offsetHeight;
            if (!height) {
                height = parseInt(this.css('height'));
            }
            return height;
        },
        offset: function () {
            var docElem, win,
                box = {
                    top: 0,
                    left: 0
                },
                elem = this._dom[0],
                doc = elem && elem.ownerDocument;

            if (!doc) {
                return;
            }

            docElem = doc.documentElement;
            // If we don't have gBCR, just use 0,0 rather than error
            // BlackBerry 5, iOS 3 (original iPhone)
            if (typeof elem.getBoundingClientRect !== typeof undefined) {
                box = elem.getBoundingClientRect();
            }
            win = doc == doc.window ? doc : (doc.nodeType === 9 ? doc.defaultView || doc.parentWindow : false);
            return {
                top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };
        },
        on: function (events, selector, fn) {
            var that = this;
            if (typeof selector === 'function') {
                fn = selector;
                selector = '';
            }
            events.split(' ').forEach(function (event) {

                if (event.trim() === '') {
                    return;
                }

                var eventName = event.split('.')[0];

                //使用touch替代click
                if ((event.split('.')[0] === 'click' && __Q.support.touch) || eventName === 'qpTap') {
                    __Q.event.qpTap(typeof selector !== typeUndefined && selector !== '' ? that.find(selector) : that, fn);
                    return;
                }

                if (eventName === 'still-click') {
                    eventName = 'click';
                }

                if (typeof selector !== typeUndefined && selector !== '') {
                    that.find(selector).each(function () {
                        addEventListener(this, eventName, fn);
                    });
                } else {
                    that.each(function () {
                        addEventListener(this, eventName, fn);
                    });
                }
            });
        },
        off: function (events, selector, fn) {
            var that = this;
            if (typeof selector === 'function') {
                fn = selector;
                selector = '';
            }
            events.split(' ').forEach(function (event) {

                if (event.trim() === '') {
                    return;
                }

                if (typeof selector !== typeUndefined && selector !== '') {
                    that.find(selector).each(function () {
                        removeEventListener(this, event.split('.')[0], fn, false);
                    });
                } else {
                    that.each(function () {
                        removeEventListener(this, event.split('.')[0], fn, false);
                    });
                }
            });
        },
        before: function (ele) {
            if (typeof ele === 'string') {
                //创建临时dom，存放view
                var $temp = __Q(document.createElement('div'));
                $temp.html(ele);

                this._dom[0].parentNode.appendChild($temp.get(0));
                var children = $temp.get(0).children;
                var len = children.length;
                var i = 0;
                while (children.length > 0) {
                    if (typeof children[0] === 'object') {
                        this.before(children[0]);
                    }
                    i++;
                    if (i >= len) {
                        break;
                    }
                }

                $temp.remove();
            } else {
                this._dom[0].parentNode.insertBefore(ele, this._dom[0]);
            }

        },
        appendChild: function (ele) {
            this.each(function () {
                this.appendChild(ele);
            });

        },
        html: function (html) {
            if (typeof html !== typeUndefined) {
                this._dom[0].innerHTML = html;
            } else {
                return this._dom[0].innerHTML;
            }

        },
        remove: function () {
            if (this._dom[0].parentNode) {
                this._dom[0].parentNode.removeChild(this._dom[0]);
            }
        },
        closest: function (clsSelector) {
            clsSelector = clsSelector.trim();
            if (clsSelector.substring(0, 1) !== '.' || clsSelector.indexOf(' ') > -1) {
                throw new Error('only support simple class selector ');
            }
            var cur;
            for (cur = this._dom[0]; cur && typeof cur !== 'undefined' && cur.nodeName.toLocaleLowerCase() !== "body"; cur = cur.parentNode) {
                // Always skip document fragments
                if (cur.nodeType < 11 &&
                    // Don't pass non-elements to Sizzle
                    cur.nodeType === 1 && new __Q(cur).hasClass(clsSelector.substring(1, clsSelector.length))) {
                    return __Q(cur);
                }
            }
            return;
        },
        contains: function (childNode) {
            var parentNode = this._dom[0];
            if (parentNode.contains) {
                return parentNode !== childNode && parentNode.contains(childNode);
            } else {
                return !!(parentNode.compareDocumentPosition(childNode) & 16);
            }
        },
        data: function (key, val) {
            //自动生成一个随机id Key;
            var id = this.attr('data-id');
            if ((typeof id === typeof undefined || id === null) && typeof val !== 'undefined') {
                id = __Q.utils.getRandomId('media');
                this.attr('data-id', id);
            }

            if (typeof val !== 'undefined') {
                if (val === null) {
                    delete __Q.cache[id + key];
                } else {
                    __Q.cache[id + key] = val;
                }
            } else {
                return typeof __Q.cache[id + key] === 'undefined' ? '' : __Q.cache[id + key];
            }
        }
    };

    var __Q = function (selector, context) {
        return new _q(selector, context);
    };

    __Q.noop = function () {};

    //扩展原型方法
    __Q.fn = function (name, fn) {
        _q.prototype[name] = fn;
    };

    __Q.utils = {};
    __Q.support = {};
    __Q.event = {};

    __Q.support.isMobile = (function () {
        return navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i) ? true : false;
    })();
    __Q.support.isiOS = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;

    __Q.support.touch = (function () {
        if (typeof navigator === typeUndefined) {
            return false;
        }
        if (('ontouchend' in document) && __Q.support.isMobile) {
            return true;
        }
        return false;
    })();



    /**
     * 下面是一些基础函数，解决mouseover与mouserout事件不停切换的问题（问题不是由冒泡产生的）
     */
    __Q.event.checkHover = (function () {
        var getEvent = function (e) {
            return e || window.event;
        };

        var contains = function (parentNode, childNode) {
            if (parentNode.contains) {
                return parentNode !== childNode && parentNode.contains(childNode);
            } else {
                return !!(parentNode.compareDocumentPosition(childNode) & 16);
            }
        };
        return function (e, target) {
            if (getEvent(e).type === "mouseover" || getEvent(e).type === "mousemove") {
                return !contains(target, getEvent(e).relatedTarget || getEvent(e).fromElement) &&
                    ((getEvent(e).relatedTarget || getEvent(e).fromElement) !== target);
            } else {
                return !contains(target, getEvent(e).relatedTarget || getEvent(e).toElement) &&
                    ((getEvent(e).relatedTarget || getEvent(e).toElement) !== target);
            }
        };
    })();

    __Q.event.isWhitePad = function (e) {
        //白板使用笔来点击会触发这个事件
        return !!(e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents);
    };

    __Q.event.stopPropagation = function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.returnValue = false;
        }
    };
    __Q.event.preventDefault = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    };



    __Q.utils.getRandomId = function (name) {
        return name + (Math.random() * 10 + new Date().getMilliseconds()).toString().replace('.', '');
    };

    __Q.utils.resize = function (oWidth, oHeight, maxW, maxH, minW, minH) {
        var w = oWidth,
            h = oHeight,
            scale = 1;

        if (oWidth < minW) {
            scale = (minW / oWidth).toFixed(3);
            h = parseInt(scale * oHeight);
            w = minW;
        }
        if (h < minH) {
            scale = (minH / oHeight).toFixed(3);
            w = parseInt(scale * oWidth);
            h = minH;
        }


        if (maxW > 0 && w > maxW) {
            scale = (maxW / oWidth).toFixed(3);
            h = parseInt(scale * oHeight);
            w = maxW;

        }
        if (maxH > 0 && h > maxH) {
            scale = (maxH / oHeight).toFixed(3);
            w = parseInt(scale * oWidth);
            h = maxH;
        }
        return {
            w: w,
            h: h,
            scale: scale
        };
    };

    __Q.utils.getRequest = (function () {
        var sSearch = location.search;
        var oParam = {};
        sSearch = sSearch.substr(1, sSearch.length);
        var params = sSearch.split('&');
        for (var i = 0; i < params.length; i++) {
            var paramExpr = params[i];
            var param = paramExpr.split('=');
            var key = param[0];
            if (key) {
                var value = decodeURIComponent(param[1]);
                oParam[key] = value;
            }
        }

        var fn = (function (sParamName) {
            return oParam[sParamName] || '';
        });
        fn.get = function () {
            return oParam;
        };
        return fn;
    })();

    //获取给定目录的基本地址
    __Q.utils.getBasePath = function (path) {
        var hashIndex = path.lastIndexOf("#");
        if (hashIndex == -1) {
            hashIndex = path.length;
        }
        var queryIndex = path.indexOf("?");
        if (queryIndex == -1) {
            queryIndex = path.length;
        }
        var slashIndex = path.lastIndexOf("/", Math.min(queryIndex, hashIndex));
        return slashIndex >= 0 ? path.substring(0, slashIndex + 1) : "";
    };

    //jquery的extend方法
    __Q.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    __Q.cache = {}; //TODO:这个暂时这样处理。后续测试通过后修改为闭包

    __Q.browser = {};

    var uaBrowser = function (userAgent) {
        var ua = userAgent.toLowerCase();
        // Useragent RegExp
        var rwebkit = /(webkit)[ \/]([\w.]+)/;
        var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
        var rmsie = /(msie) ([\w.]+)/;
        var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

        var match = rwebkit.exec(ua) ||
            ropera.exec(ua) ||
            rmsie.exec(ua) ||
            ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];
        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };

    if (typeof navigator !== typeUndefined) {
        var browserMatch = uaBrowser(navigator.userAgent);
        if (browserMatch.browser) {
            __Q.browser[browserMatch.browser] = true;
            __Q.browser.version = browserMatch.version;
        }
        __Q.browser.crosswalk = /(crosswalk)/.test(navigator.userAgent.toLowerCase());
    }
    __Q.Native = {}; //pc端或互动课堂native信息
    __Q.Controller = {};
    __Q.View = {};
    __Q.Model = {};

    //if (typeof  exports !== typeUndefined) {
    //    exports.__Q = __Q;
    //}
    if (typeof module === "object" && module && typeof module.exports === "object") {
        // Expose __Q as module.exports in loaders that implement the Node
        // module pattern (including browserify). Do not create the global, since
        // the user will be storing it themselves locally, and globals are frowned
        // upon in the Node module world.
        module.exports = __Q;
    }

    return __Q;
})();
/**
 * Created by ylf on 2015/12/13.
 */

__Q.logger = (function (__Q) {
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

    while (length--) {
        method = methods[length];
        // Only stub undefined methods.
        if (!_console[method]) {
            _console[method] = __Q.noop;
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
})(__Q);
/**
 * Created by ylf on 2015/12/13.
 */

__Q.event.qpTap = (function () {
    var vEventHandler = {};
    if (__Q.support.touch) {
        //拥有触屏事件
        vEventHandler.mouseDown = 'touchstart';
        vEventHandler.mouseUp = 'touchend';
        vEventHandler.mouseCancel = 'touchcancel';
        vEventHandler.getEventX = function (event) {
            return event.changedTouches[0].clientX;
        };
        vEventHandler.getEventY = function (event) {
            return event.changedTouches[0].clientY;
            //return event.originalEvent.changedTouches[0].clientY;
        };
    } else {
        //没有触屏幕事件
        vEventHandler.mouseDown = 'mousedown';
        vEventHandler.mouseUp = 'mouseup';
        vEventHandler.mouseCancel = 'mouseleave';
        vEventHandler.getEventX = function (event) {
            return event.clientX;
        };
        vEventHandler.getEventY = function (event) {
            return event.clientY;
        };
    }

    return function (_$that, fn) {
        var $that = _$that;
        var vMouseDown = vEventHandler.mouseDown;
        var vMouseUp = vEventHandler.mouseUp;
        var vMouseCancel = vEventHandler.mouseCancel;
        var _start = 0;
        var _startX = 0;
        var _startY = 0;

        var func = function (downEvent) {
            if (downEvent.which !== 0 || downEvent.which !== 1) {
                _start = new Date().getTime();
                _startX = vEventHandler.getEventX(downEvent);
                _startY = vEventHandler.getEventY(downEvent);
            }
            //downEvent.stopPropagation();

            var handler = function (event) {
                if (event.which !== 0 || event.which !== 1) {
                    var end = new Date().getTime();
                    var endX = vEventHandler.getEventX(event);
                    var endY = vEventHandler.getEventY(event);
                    var holdTime = end - _start;
                    var dx = Math.abs(endX - _startX);
                    var dy = Math.abs(endY - _startY);
                    __Q.logger.debug('tap-holdtime',holdTime);
                    if (holdTime <= 350 && dx < 5 && dy < 5) {
                        //触发tap事件
                        fn(event);
                    }
                }

                $that.off(vMouseUp, '', handler);
                $that.off(vMouseCancel, '', cancelHandler);
                //event.stopPropagation();
            };

            $that.on(vMouseUp, '', handler);

            var cancelHandler = function (event) {
                $that.off(vMouseUp, '', handler);
                $that.off(vMouseCancel, '', cancelHandler);
                //event.stopPropagation();
            };

            $that.on(vMouseCancel, '', cancelHandler);
        };

        $that.on(vMouseDown, '', func);

    };

})();
/**
 * Created by ylf on 2015/12/12.
 */

(function (window, __Q) {
    'user strict';

    __Q.Class = {};

    if (typeof Object.create !== "function"){
        Object.create = function(o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    __Q.Class.Create = function () {
        return Object.create(__Q.Class.ClassUtils);
    };

    __Q.Class.ClassUtils = {
        include: function (obj) {
            for (var key in obj) {
                this[key] = obj[key];
            }
        },
        //类继承
        extend: function (extension) {
            var hasOwnProperty = Object.hasOwnProperty;
            var object = Object.create(this);

            for (var property in extension) {
                if (hasOwnProperty.call(extension, property) || typeof object[property] === "undefined") {
                    object[property] = extension[property];
                }
            }
            return object;
        },
        //闭包绑定this指针
        proxy: function (fn) {
            var thisobj = this;
            return function () {
                return fn.apply(thisobj, arguments);
            };
        },
        proxyAll: function (fucs) {
            for (var i = 0; i < fucs.length; i++) {
                this[fucs[i]] = this.proxy(this[fucs[i]]);
            }
        }
    };
})(window, __Q);
/**
 * Created by ylf on 2015/12/9.
 */
//事件管理对象
var Events = {
    trigger: function () {
        //将参数转换为数组
        var arg = Array.prototype.slice.apply(arguments, [0]);
        //取第一个，并从数组中删除，事件key
        var type = arg.shift();
        if (!this._eventHandler || !this._eventHandler[type]) {
            return false;
        }
        this._eventHandler[type].apply(this, arg);
        return true;
    },
    bind: function (type, callback) {
        if (!this._keys || this._keys.indexOf(type) <= -1) {
            throw  new Error('js/events :can not bind undeclared key ：' + type);
        }

        if (!this._eventHandler) {
            this._eventHandler = {};
        }
        this._eventHandler[type] = callback;
        return true;
    },
    unBind: function (type) {
        delete  this._eventHandler[type];
    },
    //可绑定的keys数组
    canBindKey: function (keys) {
        this._keys = keys;
    }
};
/**
 * Created by ylf on 2015/12/13.
 * 互动课堂第三方API
 */

__Q.Native.InteractAppApi = (function (__Q) {

    var isApp = (typeof AndroidInterface !== "undefined");
    var bridgeCallNative = (typeof Bridge !== 'undefined') && Bridge && Bridge.callNative;
    var isAppNative = isApp && bridgeCallNative;
    //扩展全局标识
    __Q.Native.isInteractApp = isAppNative;

    var STUDENT = 'STUDENT';
    var TEACHER = 'TEACHER';

    var isStudent = false;
    var isTeacher = false;
    var isProjector = false;

    var userInfo = null;

    var callNative = function (method, params) {
        try {
            return Bridge.callNative("com.nd.pad.icr.ui.IcrJsBridge", method, params || {});
        } catch (ex) {
            __Q.logger.error('mediaplayer call native error', ex);
        }
    }

    //获取当前app用户信息
    var getCurrentUserInfo = function () {
        if (isAppNative && !userInfo) {
            var res = callNative("getCurrentUserInfo", {});
            if (res) {
                userInfo = res;
                isStudent = (res.userType === STUDENT);
                isTeacher = (res.userType === TEACHER);
                isProjector = res.isProjector;
            }
        }
    };

    /**
     * 隐藏native组件
     * @param show true/false
     */
    var setNativeModuleVisibility = function (show) {
        if (isAppNative) {
            getCurrentUserInfo();
            if (isTeacher && !isProjector) {
                //教师端且非投影端隐藏以下native控件
                var res = callNative("setNativeModuleVisibility",
                    {
                        items: [
                            {moduleId: 'toolBar', visible: show},//工具栏
                            {moduleId: 'exit', visible: show},//退出课堂
                            {moduleId: 'exam', visible: show},//发送任务
                            {moduleId: 'roster', visible: show}//花名册按钮
                        ]
                    }
                );
                __Q.logger.debug(res);
            } else if (isStudent) {
                //隐藏学生端view
                var res = callNative("setPresenterVisibility", {instanceId: "studentDraft", visible: show});//草稿按钮栏

                __Q.logger.debug(res);
            }
        }
    };

    var setViewerModuleVisibility = function (show) {
        if (isAppNative) {
            getCurrentUserInfo();
            if (isStudent) {
                //隐藏学生端view
                var res = callNative("setPresenterVisibility", {instanceId: "studentDraft", visible: show});//草稿按钮栏

                __Q.logger.debug(res);
            }
        }
    };
    return {
        setNativeModuleVisibility: setNativeModuleVisibility,
        setViewerModuleVisibility: setViewerModuleVisibility
    };
})(__Q);
/**
 * Created by Administrator on 2016/1/19.
 */

__Q.lang = (function () {

    var jp = {
        "media_img_still_loading": "画像読み込み中",
        "media_img_tip": "クリックして画像を見る",
        "media_video_fullscreen": "全画面",
        "media_video_exit_fullscreen": "全画面解除",
        "media_video_not_support_fullscreen": "全画面再生できない"
    };

    var zh = {
        "media_img_still_loading": "图片还在加载中",
        "media_img_tip": "点击查看图片",
        "media_video_fullscreen": "全屏",
        "media_video_exit_fullscreen": "退出全屏",
        "media_video_not_support_fullscreen": "不支持全屏播放"
    };

    var en = {
        "media_img_still_loading": "Still loading image",
        "media_img_tip": "Click to view",
        "media_video_fullscreen": "Full screen",
        "media_video_exit_fullscreen": "Exit",
        "media_video_not_support_fullscreen": "Full screen playback not supported"
    }

    var hk = {
        "media_img_still_loading": "圖片還在加載中",
        "media_img_tip": "點擊查看圖片",
        "media_video_fullscreen": "全屏",
        "media_video_exit_fullscreen": "退出全屏",
        "media_video_not_support_fullscreen": "不支持全屏播放"
    };

    var _lang = {
        'zh': zh,
        'zh_cn': zh,
        'zh_hk': hk,
        'hk': hk,
        'en': en,
        'en_us': en,
        'ja': jp,
        'ja_jp': jp
    };

    return {
        getLangText: function (langType, key, val) {
            langType = langType.toLowerCase();
            var lang = _lang[langType] ? _lang[langType] : _lang['zh'];
            var result = lang[key] || '';
            return result;
        }
    }
})();
/**
 * Created by ylf on 2015/12/9.
 */

__Q.Controller.MediaPlayer = (function (window, __Q) {
    //基础对象
    var MediaPlayer = __Q.Class.Create();
    //扩展事件管理
    MediaPlayer.include(Events);

    MediaPlayer.include({
        //对象构造
        create: function ($container, option, mediaType) {
            var self = Object.create(this);
            //初始化时间
            self.timeFormat = '0:00';
            self.$container = $container;
            self.mouseMoveCount = 0;
            self.options = option;
            //初始化model
            self._mediaModel = __Q.Model.MediaModel.create($container.find(mediaType));
            //闭包绑定this指针
            var funcs = ['playPause', '_progress', '_progressMouseup', '_volumeToggle', '_volumeProgress',
                '_volumeProgressMouseup', '_volumeMutedToggle', '_volumeShow', '_volumeHide'];
            self.proxyAll(funcs);
            //playTrigger：触发播放，ended播放停止
            self.canBindKey(['playTrigger', 'ended', 'pause', 'unBind', 'volumeToggle']);
            return self;
        },
        getMediaModel: function () {
            return this._mediaModel;
        },
        __Q: function (selector) {
            return this.$container.find(selector);
        },
        baseInit: function () {

            var $media = this.getMediaModel().getQMedia();
            //是否开启预加载
            this.getMediaModel().setPreLoad(this.options.mediaPreload ? 'auto' : 'none');
            //移除默认的控制条
            $media.removeAttr("controls");

            if (this._iePreloadNone()) {
                //ie下preload=none无效，不预加载，移除src，

                $media.attr('data-src', $media.attr('src'));
                $media.removeAttr("src");
            }
            this._findElement();
            //初始化media事件对象
            this._eventModel = __Q.Model.MediaEvent.create(this._mediaModel, this.options);
            //注册media事件对象中注册+事件
            this._mediaEventHandler();
            this._toolBarEvent(true);
            //iOS不支持音量调节，直接隐藏掉
            if (__Q.support.isiOS) {
                this._$volumeIconContainer.hide();
                this.__Q('.qp-time-base').css('right', '12px');
            }
        },
        _toolBarEvent: function (on) {
            var _this = this;
            on = on ? 'on' : 'off';
            _this._$play[on]('click', _this.playPause);

            //这里为何要更新这个？
            _this._updateVolumeEntryView(_this.getMediaModel().getVolume(), false);

            //阻止事件冒泡
            _this._$mediaBox[on]('click', function (e) {
                __Q.event.stopPropagation(e);
            });
            _this._$progress[on]('touchstart mousedown', _this._progress);
            _this._$progress[on]('touchend touchcancel mouseup', _this._progressMouseup);
            _this._$volumeControl[on]('mousedown touchstart', _this._volumeProgress);
            _this._$volumeControl[on]('mouseup touchend touchcancel', _this._volumeProgressMouseup);
            _this._$volumeIconContainer[on]('mouseout mouseleave', _this._volumeHide);

            if (__Q.support.touch) {
                _this._$volumeIcon[on]('click', _this._volumeToggle);
            } else {
                //处理白板端同时支持touch和mouse事件
                if ('ontouchend' in document) {
                    _this._$volumeIcon[on]('click', _this._volumeToggle);
                } else {
                    _this._$volumeIcon[on]('click', _this._volumeMutedToggle);
                }
                _this._$volumeIconContainer[on]('mouseover', _this._volumeShow);
            }
        },
        _iePreloadNone: function () {
            //处理ie preload无效的问题
            if (!this.options.mediaPreload && __Q.browser.msie) {
                return true;
            }
            return false;
        },
        iePreloadResetSrc: function () {
            if (this._iePreloadNone() && !this._resetSrc) {
                //只触发一次
                this._resetSrc = true;
                var $video = this.getMediaModel().getQMedia();
                $video.attr('src', $video.attr('data-src'));
            }
        },
        _findElement: function () {
            var that = this;
            var elements = {
                '_$loading': '[data-oper="loading"]',//加载中提示
                '_$play': '.qp-media-toolbar [data-oper="play"]',  //播放按钮
                '_$playInBody': '.qp-media-box>[data-oper="play"]',  //播放按钮
                '_$endTime': '[data-oper="endTime"]', //总时间
                '_$currentTime': '[data-oper="curentTime"]',//当前播放时间
                '_$downedBar': '[data-oper="downed-bar"]',//预加载的进度
                '_$playedBar': '[data-oper="played-bar"]',  //一播放的进度
                '_$progress': '[data-oper="progress"]', //视频进度条
                '_$volumeIconContainer': '[data-oper="volume-icon-container"]', //右侧音量
                '_$volumeIcon': '[data-oper="volume-icon"]',//右侧音量按钮
                '_$volumeControl': '[data-oper="volume-control"]', //音量调节窗口
                '_$volumeBarContainer': '[data-oper="volume-bar-container"]',//音量控制条
                '_$volumeBarR': '[data-oper="volume-bar-r"]',//音量调节点
                '_$volumeBarS': '[data-oper="volume-bar-s"]',//音量当前进度
                '_$toolbar': '[data-oper="toolbar"]',//控制条
                '_$mediaBox': '[data-oper="media-box"]',//容器
                '_$mediaDisable': '[data-oper="media-disable"]'//容器
            };

            for (var sel in elements) {
                that[sel] = that.__Q(elements[sel]);
            }
        },
        clear: function () {
            try {
                this._mediaModel.load();
                this._eventModel.mediaEventListener(false);
                this.trigger('unBind');
            } catch (ex) {
                //console.log(ex);
                __Q.logger.debug('clear', ex)
            }
        },
        unBind: function () {
            try {
                this._eventModel.mediaEventListener(false);
                this.trigger('unBind');
            } catch (ex) {
                //console.log(ex);
                __Q.logger.debug('unbind', ex)
            }
        },
        destroy: function () {
            this.unBind();
        },
        reset: function () {
            this.pause();
        },
        setLock: function (isLock) {
            this.options.lock = isLock;
            if (isLock) {
                this._$mediaDisable.show();
            } else {
                this._$mediaDisable.hide();
            }
        },
        isLock: function () {
            return this.options.lock;
        },
        changeVolume: function (vol, display) {
            this._mediaModel.setVolume(vol);
            if (display) {
                this._$volumeControl.show();
                this.trigger('volumeToggle', true);
            } else {
                this._$volumeControl.hide();
                this.trigger('volumeToggle', false);
            }
        },
        hideVolumeControl: function () {
            if (this._$volumeControl.isShow()) {
                this._$volumeControl.hide();
                this.trigger('volumeToggle', false);
                this._eventModel.volumeChangeEvent(false);
            }
        },
        isPlaying: function () {
            return this._mediaModel.isPlaying();
        },
        playPause: function (e) {
            this.trigger('playTrigger');
            this.iePreloadResetSrc();
            var mediaObj = this._mediaModel.getMedia();
            if (mediaObj.paused) {
                this._$play.addClass("qp-btn-stop");
                this._$playInBody.addClass("qp-btn-stop");
                mediaObj.play();
            } else {
                this._$play.removeClass("qp-btn-stop");
                this._$playInBody.removeClass("qp-btn-stop");
                mediaObj.pause();
            }
        },
        pause: function () {
            var mediaObj = this._mediaModel.getMedia();
            if (this.options.renderUI) {
                this._$play.removeClass("qp-btn-stop");
                this._$playInBody.removeClass("qp-btn-stop");
            }
            if (mediaObj && !mediaObj.paused) {
                mediaObj.pause();
            }
        },
        play: function (outTrigger) {
            this.trigger('playTrigger', outTrigger);
            this.iePreloadResetSrc();
            var mediaObj = this._mediaModel.getMedia();
            if (this.options.renderUI) {
                this._$play.addClass("qp-btn-stop");
                this._$playInBody.addClass("qp-btn-stop");
            }
            if (mediaObj && mediaObj.paused) {
                mediaObj.play();
            }
        },
        _mediaEventHandler: function () {
            var _this = this;
            if (!_this.options.renderUI) {
                return;
            }
            var mediaEvent = {
                playing: function () {
                    _this.trigger('playTrigger');
                    _this.iePreloadResetSrc();
                    _this._$play.addClass("qp-btn-stop");
                    _this._$playInBody.addClass("qp-btn-stop");
                },
                pause: function () {
                    _this.trigger('pause');
                    _this._$play.removeClass('qp-btn-stop');
                    _this._$playInBody.removeClass("qp-btn-stop");

                },
                ended: function () {
                    _this.trigger('ended');
                    _this._$play.removeClass('qp-btn-stop');
                    _this._$playInBody.removeClass("qp-btn-stop");
                    _this._$loading.hide();
                    _this._$currentTime.text(_this.timeFormat);
                    _this._$playedBar.css('width', '0%');
                    _this._$downedBar.css('width', "0%");
                },
                timeupdate: function () {
                    if (_this._mediaModel.getReadyState() < 3) {
                        //_this._$loading.show();
                        return false;
                    }
                    _this._$loading.hide();
                    _this._updateEndTime();
                    _this._updateVideoData();
                    _this._updateCurrentTime();
                },
                volumechange: function () {
                    _this._updateVolumeEntryView(_this._mediaModel.getVolume(), true);
                },
                progress: function () {
                    var currentTime = _this._mediaModel.getCurrentTime();
                    var duration = _this._mediaModel.getDuration();
                    var buffered = _this._mediaModel.getBuffered();
                    var minEnd = 0;
                    for (var i = 0; i < buffered.length; i++) {
                        var end = buffered.end(i);
                        if (end > currentTime) {
                            if (!minEnd) {
                                minEnd = end;
                            } else {
                                if (minEnd > end) {
                                    minEnd = end;
                                }
                            }
                        }
                    }
                    if (!minEnd) {
                        minEnd = currentTime;
                    }
                    var percent = (minEnd / duration) * 100;
                    if (percent > 100) {
                        percent = 0;
                    }

                    _this._$downedBar.css('width', percent + "%");
                    _this._updateEndTime();
                },
                waiting: function () {
                    _this._$loading.show();
                },
                error: function (code) {
                    //console.log("media error code ：" + code);
                },
                loadedmetadata: function () {
                    _this._updateEndTime();
                },
                play: function () {
                    if (_this._mediaModel.getCurrentTime() <= 0) {
                        _this._$loading.show();
                    }
                },
                durationchange: function () {
                    var duration = _this._mediaModel.getDuration();
                    if (duration < 1 && duration > 0) {
                        //_this.timeFormat = '0:00.00';
                        _this._$currentTime.text(_this.timeFormat);
                    }
                    _this._updateEndTime();
                }
            };
            for (var key in mediaEvent) {
                this._eventModel.bind(key, mediaEvent[key]);
            }
        },
        _updateEndTime: function () {
            var duration = this._mediaModel.getDuration();
            if (duration > 0 && (!this.durationInit || this.durationInitDuration !== duration)) {
                if (duration >= 60 * 60 || duration < 1) {
                    this._$toolbar.addClass('qp-progress-long');
                } else {
                    this._$toolbar.removeClass('qp-progress-long');
                }
                this._$endTime.text(this._formatTime(duration));
                this.durationInit = true;
                //第一次获取的总长度可能有错，pad上经常取到100s
                this.durationInitDuration = duration;
            }
        },
        _progress: function (e) {
            var progWrapper = this._$progress;
            var media = this._mediaModel.getMedia();
            if (progWrapper.length > 0) {
                var _this = this;
                if (e && _this._coordinate(e)) {
                    _this._seekTo(_this._coordinate(e).pageX, progWrapper, media, true);
                }
                var handler = function (e) {
                    if (e) {
                        __Q.event.preventDefault(e);
                    }
                    //在seekTo方法里处理进度条
                    _this._seekTo(_this._coordinate(e).pageX, progWrapper, media);
                };
                progWrapper.on('mousemove  touchmove', '', handler);

                var cancelHandler = function (e) {
                    __Q.event.preventDefault(e);
                    __Q.event.stopPropagation(e);
                    progWrapper.off('mousemove touchmove', '', handler);
                    progWrapper.off('mouseup mouseleave touchend touchcancel', '', cancelHandler);
                };

                progWrapper.on('mouseup mouseleave touchend touchcancel', '', cancelHandler);
            }
        },
        _progressMouseup: function (e) {
            var progWrapper = this._$progress;
            var media = this._mediaModel.getMedia();
            var _this = this;
            _this._seekTo(_this._coordinate(e).pageX, progWrapper, media, true);
        },
        _updateVolumeEntryView: function (volume, on) {
            var _this = this;
            var muted = this._mediaModel.getMuted();
            _this._$volumeBarR.css("bottom", parseInt(muted ? 0 : (volume * 100)) + "%");
            _this._$volumeBarS.css("height", (parseInt(muted ? 0 : (volume * 100)) === 0 ? 0.5 : parseInt(muted ? 0 : (volume * 100))) + "%");

            if (volume === 0 || muted) {
                _this._$volumeIcon.addClass('qp-btn-volume-no');
            } else {
                _this._$volumeIcon.removeClass('qp-btn-volume-no');
            }
        },
        _volumeToggle: function (e) {
            var _this = this;
            this._volumeClick = true;
            //防止点击声音按钮时，点击到声音控制条
            setTimeout(function () {
                _this._volumeClick = false;
            }, 100);
            if (e.srcElement) {
                var $volume = __Q(e.srcElement).closest(".qp_video-progress-box");
                if ($volume && $volume.get(0) === this._$volumeControl.get(0)) {
                    return;
                }
            }

            this._$volumeControl.toggle();
            var isShow = this._$volumeControl.isShow();
            this.trigger('volumeToggle', isShow);
            this._eventModel.volumeChangeEvent(isShow);
        },
        _volumeMutedToggle: function (e) {
            this._mediaModel.setMuted(!this._mediaModel.getMuted());
            this._updateVolumeEntryView(this._mediaModel.getVolume());
        },
        _volumeShow: function (e) {
            if (__Q.event.checkHover(e, this._$volumeIconContainer.get(0))) {
                //白板使用笔来点击会触发这个事件
                if (e && e.type === 'mouseover' && e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) {
                    return;
                }
                this._$volumeControl.show();

                this.trigger('volumeToggle', true);
                this._eventModel.volumeChangeEvent(true);
            }
        },
        _volumeHide: function (e) {
            if (__Q.event.checkHover(e, this._$volumeIconContainer.get(0))) {
                this._$volumeControl.hide();
                this.trigger('volumeToggle', false);
                this._eventModel.volumeChangeEvent(false);
            }
        },
        _volumeProgress: function (e) {

            if (this._volumeClick) {
                return;
            }

            var progWrapper = this._$volumeControl;
            var media = this._mediaModel.getMedia();
            if (progWrapper.length > 0) {
                var _this = this;
                _this.volumeUp = false;
                this._mediaModel.setMuted(false);

                if (_this._coordinate(e)) {
                    _this._volumeSeekTo(_this._coordinate(e).pageY, media, true);
                }

                var handler = function (e) {
                    __Q.event.preventDefault(e);
                    if (_this._coordinate(e)) {
                        _this._volumeSeekTo(_this._coordinate(e).pageY, media);
                    }
                };

                progWrapper.on('mousemove  touchmove', '', handler);

                var cancelHandler = function (e) {
                    __Q.event.preventDefault(e);
                    _this.volumeUp = true;
                    progWrapper.off('mousemove touchmove', '', handler);
                    progWrapper.off('mouseup mouseleave touchend touchcancel', '', cancelHandler);
                };

                progWrapper.on('mouseup mouseleave touchend touchcancel', '', cancelHandler);

            }
        },
        _volumeProgressMouseup: function (e) {
            if (this._volumeClick) {
                return;
            }
            var media = this._mediaModel.getMedia();
            this.volumeUp = true;
            this._eventModel.volumeChangeEvent(true, true);
            var _this = this;
            if (_this._coordinate(e)) {
                _this._volumeSeekTo(_this._coordinate(e).pageY, media);
            }
        },
        _updateCurrentTime: function () {
            var currentTime = this._mediaModel.getCurrentTime();
            this._$currentTime.html(this._formatTime(currentTime));
        },
        _updateVideoData: function () {
            // 更新进度
            var current = this._mediaModel.getCurrentTime();
            var duration = this._mediaModel.getDuration();
            var scrubbing = this._$playedBar;

            if (current === 0.01) {//处理移动端bug的特殊进度。
                scrubbing.css('width', '0%');
            } else {
                var scrubbingWidth = current * 100 / duration;
                scrubbing.css('width', scrubbingWidth + '%');
            }
        },
        _seekTo: function (xPos, progWrapper, media, immediately) {
            var duration = this._mediaModel.getDuration();
            if (duration > 0) {
                var progressBar = this._$playedBar;
                var progWidth = Math.max(0, Math.min(1, (xPos - ( progWrapper.offset().left / this.getScale())) / progWrapper.width()));

                var seekTo = progWidth * duration;
                //一旦media.currentTime = seekTo;执行，media的timeupdate就能够监听到，视频的当前播放位置就会立即跳转
                //由于move触发的事件过于频繁所以加了个优化，每10次move触发的事件只进行一次media.currentTime = seekTo，当然进度条的拖动效果是实时的
                this.mouseMoveCount++;
                if (this.mouseMoveCount % 10 === 0 || immediately) {
                    if (seekTo >= 0) {
                        this._mediaModel.setCurrentTime(seekTo);
                    }
                }

                var width = Math.round(progWidth * (progWrapper.width()));
                progressBar.css('width', width + 'px');
                this._updateCurrentTime();
            }
        },
        _volumeSeekTo: function (yPos) {
            var progressBar = this._$volumeBarContainer;
            var progHeight = Math.max(0, Math.min(1, (yPos - (progressBar.offset().top / this.getScale())) / progressBar.height()));
            this._mediaModel.setVolume(1 - progHeight);
        },
        _coordinate: function (event) {
            var point = {};
            var scale = this.getScale();
            switch (event.type) {
                case 'touchstart':
                case 'touchmove':
                case 'touchend':
                case 'touchcancel':
                    point.pageX = (event.changedTouches[0].pageX || event.touches[0].pageX) / scale;
                    point.pageY = (event.changedTouches[0].pageY || event.touches[0].pageY) / scale;
                    return point;
                default:
                    point.pageX = event.pageX / scale;
                    point.pageY = event.pageY / scale;
                    return point;
            }

        },
        _formatTime: function (secs) {
            var hours = Math.floor(secs / (60 * 60));
            var minutes = Math.floor(secs / 60) % 60;
            var seconds = Math.floor(secs - (minutes * 60) - (hours * 60 * 60));

            if (seconds === 60) {
                seconds = 0;
                minutes = minutes + 1;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }


            var duration = this._mediaModel.getDuration();

            //默认显示一秒
            if (duration > 0 && duration < 1) {
                if (secs > 0) {
                    return '0:01';
                } else {
                    return '0:00';
                }
                //return minutes + ':' + seconds + '.' + secs.toFixed(2).split('.')[1];
            } else {
                if (hours > 0) {
                    return hours + ':' + minutes + ':' + seconds;
                } else {
                    return minutes + ':' + seconds;
                }
            }
        },
        getScale: function () {
            //This works because getBoundingClientRect returns the actual dimension while offsetWidth/Height is the unscaled size.
            this.scaleX = (this.$container.get(0).getBoundingClientRect().width / this.$container.get(0).offsetWidth) || 1;
            return this.scaleX;
        },
        mediaPlay: function (o) {
            this.play();
        },
        mediaPause: function (o) {
            this.pause();
        },
        mediaSkip: function (seek) {
            this._mediaModel.setCurrentTime(seek === 0 ? 0.01 : seek);
        },
        mediaVolumeChange: function (volume, display) {
            this.changeVolume(volume, display);
        }
    });

    return MediaPlayer;
})(window, __Q);

/**
 * Created by ylf on 2015/12/9.
 */

(function (window, __Q) {
    var DEFAULTS = {
        onEnd: false,
        onPause: false,
        lang: 'zh',
        onPlay: false,
        onSeek: false,
        onVolumeChange: false,
        onTimeUpdate: false,
        onlyRender: false,
        renderUI: true,
        audio: {
            width: 0,
            height: 0
        }
    };

    var AudioPlayer = __Q.Controller.MediaPlayer.extend({
        create: function ($container, options) {
            var that = __Q.Controller.MediaPlayer.create.apply(this, [$container, __Q.extend({}, DEFAULTS, options), 'audio']);
            that.options = __Q.extend({}, DEFAULTS, options);

            if (that.options.renderUI) {
                var funcs = ['_playTriggerHandler', '_endedHandler'];
                that.proxyAll(funcs);

                that._init();
                if (that.options.onlyRender === false) {
                    that.start();
                }
                that.bind('playTrigger', that._playTriggerHandler);
                that.bind('ended', that._endedHandler);
            }
            return that;
        },
        _resizeMap: {
            'qp-media-box-mini': function (width, height) {
                return width <= 200 || height <= 60;
            },
            'qp-media-box-min-height': function (width, height) {
                return height <= 180 && height > 125;
            },
            'qp-media-box-min-height-audio-s': function (width, height) {
                return height <= 125 && height > 60;
            },
            'qp-media-box-max-hd': function (width, height) {
                return width > 360 && height > 270;
            }
        },
        _playTriggerHandler: function () {
        },
        _endedHandler: function () {
            //移除自动隐藏样式
        },
        start: function () {
            var _this = this;
            if (_this.started) {
                return;
            }
            //防止重复绑定
            _this.started = true;
            //公用基类初始化
            this.baseInit();
            //绑定video私有事件
            this._controlEvent(true);
        },
        _init: function () {
            var $audio = this.getMediaModel().getQMedia();

            try {
                $audio.before(__Q.View.audioHtml);
                this.__Q('[data-oper="loading"] ').before($audio.get(0));
                this._$qpVideoWrap = this.__Q('.qp-video-videowrap');
                this._$qpMediaIcon = this.__Q('.qp-media-icons-right');
                if (this.options.autoAdaptSize) {
                    var width = this.options.audio.width;
                    var height = this.options.audio.height;
                    if (width && height) {
                        this.resizeMedia(width, height);
                    }
                }
            } catch (e) {
                throw new Error('createHtml unknow error:' + e.message);
            }
        },
        resizeMedia: function (width, height) {
            if (!this._$mediaBox) {
                this._$mediaBox = this.__Q('.qp-media-box');
            }

            var reWidth = width, reHeight = height;
            var mini = false;
            for (var key in this._resizeMap) {
                if (this._resizeMap[key](width, height)) {
                    //mini样式匹配则移除其他适配样式
                    if (mini) {
                        this._$mediaBox.removeClass(key);
                    } else {
                        this._$mediaBox.addClass(key);
                    }
                    if (!mini) {
                        if (key === 'qp-media-box-mini') {
                            this._$mediaBox.addClass(key);
                            mini = true;
                            reWidth = 0;
                            reHeight = 0;
                        }
                    }
                    if (key === 'qp-media-box-min-height-audio-s') {
                        reHeight = 40;
                    }
                } else {
                    this._$mediaBox.removeClass(key);
                }
            }
            this._$mediaBox.css('width', reWidth + 'px');
            this._$mediaBox.css('height', reHeight + 'px');
        },
        _controlEvent: function (on) {
            var _this = this;
            on = on ? 'on' : 'off';
            _this._$playInBody[on]('click', _this.playPause);
        }
    });


    function AudioPlayerPlugin(option) {
        option = option || {};
        return this.each(function () {
            var $this = __Q(this);

            var data = $this.data('my.mediaplayer');
            var options = __Q.extend({}, $this.data() || {}, typeof option === 'object' && option);
            //插件缓存
            if (!data) {
                data = AudioPlayer.create($this, options);
                $this.data('my.mediaplayer', data);
            }
        });

    }

    __Q.fn('audioplayer', AudioPlayerPlugin);

})(window, __Q);
/**
 * Created by ylf on 2015/12/9.
 */

(function (window, __Q) {

    var DEFAULT = {
        renderUI: true,
        lang: 'zh',
        img: {
            renderImmediately: false,//不立即加载
            src: '',
            width: 0,
            height: 0
        },
        onlyRender: false
    };

    var ImagePlayer = __Q.Class.Create();

    ImagePlayer.include({
        create: function ($container, options) {
            var that = Object.create(this);
            that.$container = $container;
            var imgData = {
                src: options.img.src ? options.img.src : $container.find('img').attr('src'),
                width: 0,
                height: 0
            };
            that.imgData = imgData;
            that.options = __Q.extend({}, DEFAULT, options);
            //限定最小宽高
            if (that.options.autoAdaptSize && that.options.img.width && that.options.img.height) {
                if (that.options.img.width < that._minRenderWidth) {
                    that.options.img.width = that._minRenderWidth;
                }
                if (that.options.img.height < that._minRenderHeight) {
                    that.options.img.height = that._minRenderHeight;
                }
            }
            that.viewer = null;//图片大图查看
            var funcs = ['_createViewer'];
            that.proxyAll(funcs);
            that._init();
            return that;
        },
        __Q: function (selector) {
            return this.$container.find(selector);
        },
        _defaultRenderHeight: 180,
        _defaultRenderWidth: 260,
        _minRenderHeight: 100,
        _minRenderWidth: 130,
        _loadImg: function (callback) {
            var _this = this;
            var img = new Image();
            img.src = _this.imgData.src;
            if (img.complete) {
                _this.imgData.width = img.width;
                _this.imgData.height = img.height;
                if (callback) {
                    callback()
                }
            } else {
                img.onload = function () {
                    _this.imgData.width = img.width;
                    _this.imgData.height = img.height;
                    if (callback) {
                        callback()
                    }
                    img.onload = null;
                };
            }

        },
        _init: function () {
            var _this = this;
            if (!_this.options.renderUI) {
                _this._loadImg();
                var $image = this.__Q('img');
                //$image.before(__Q.View.viewerHtml);
                $image.on('qpTap', function (e) {
                    if (!_this.imgData.width) {
                        return;
                    }
                    _this._createViewer();
                });
            } else if (_this.options.img.renderImmediately) {
                _this._createHtml();
                _this._loadImg();
                _this._controlEvent();
            } else {
                _this._loadImg(function () {
                    var render = false;
                    //超过指定宽高的图片||自适应UI
                    if ((_this.options.autoAdaptSize && _this.options.img.width && _this.options.img.height
                        && (_this.imgData.width > _this.options.img.width || _this.imgData.height > _this.options.img.height))) {
                        render = true;
                    } else if (_this.imgData.width > _this._defaultRenderWidth || _this.imgData.height > _this._defaultRenderHeight) {
                        render = true;
                    }
                    if (render) {
                        _this._createHtml();
                        _this._controlEvent();
                    }

                });
            }
        },
        start: function () {
            this.options.onlyRender = false;
        },
        _createHtml: function () {
            var _this = this;
            var $image = this.__Q('img');
            //移除显示指定的宽高和样式，进行自适应布局
            $image.removeAttr(['width', 'height', 'style']);
            try {
                $image.before(__Q.View.imageHtml);
                //$image.before(__Q.View.viewerHtml);

                this.__Q('.qp-media-pics-bg').get(0).appendChild($image.get(0));
                this.__Q('.qp-media-toolbar').text(__Q.lang.getLangText(this.options.lang, 'media_img_tip'));
                this.__Q('.qp-meida-tip-message').text(__Q.lang.getLangText(this.options.lang, 'media_img_still_loading'));
                //自适应大小
                if (this.options.autoAdaptSize && this.options.img.width && this.options.img.height) {
                    this.resizeMedia(this.options.img.width, this.options.img.height);
                }
            } catch (e) {
                throw new Error('createHtml unknow error:' + e.message);
            }
        },
        _controlEvent: function () {
            var _this = this;
            this._$tipMessage = this.__Q('.qp-meida-tip-message');
            _this.__Q('.qp-media-box').on('click', function (e) {
                if (e) {
                    __Q.event.stopPropagation(e);
                }
                if (_this.options.onlyRender) {
                    return;
                }
                if (_this.options.lock) {
                    return;
                }
                if (!_this.imgData.width) {
                    clearTimeout(_this._msgTimeoutId);
                    _this._$tipMessage.show();
                    _this._msgTimeoutId = setTimeout(function () {
                        _this._$tipMessage.hide();
                    }, 3000);
                    return;
                }
                _this._createViewer()
            });
        },
        resizeMedia: function (width, height) {

            if (width < this._minRenderWidth) {
                width = this._minRenderWidth;
            }
            if (height < this._minRenderHeight) {
                height = this._minRenderHeight;
            }

            if (!this._$mediaBox) {
                this._$mediaBox = this.__Q('.qp-media-box');
            }
            if (!this._$picsBg) {
                this._$picsBg = this.__Q('.qp-media-pics-bg');
            }
            if (!this._$image) {
                this._$image = this.__Q('.qp-media-pics-bg img');
            }
            this._$mediaBox.css('width', width + 'px');
            this._$mediaBox.css('height', height + 'px');
            this._$picsBg.css('width', width + 'px');
            this._$picsBg.css('height', height + 'px');
            this._$image.css('maxWidth', width + 'px');
            this._$image.css('maxHeight', height + 'px');
        },
        _createViewer: function () {
            var _this = this;
            if (!_this.viewer) {
                var fullChange = _this.options.onFullScreenChange || _this.options.eventHandler.fullScreenChange;
                _this.viewer = __Q.Controller.ImageViewer.create(_this.$container, _this.imgData.width, _this.imgData.height, _this.imgData.src, fullChange);
            }
            _this.viewer.show();
        },
        destroy: function () {
            if (this.viewer) {
                this.viewer.hide();
            }
        },
        reset: function () {
            if (this.viewer) {
                this.viewer.hide();
            }
        },
        setLock: function (lock) {
            this.options.lock = lock;
            //if (lock) {
            //    this.__Q('.qp-media-disable').show();
            //} else {
            //    this.__Q('.qp-media-disable').hide();
            //}
        }
    });


    function ImagePlayerPlugin(option) {
        option = option || {};
        return this.each(function () {
            var $this = __Q(this);

            var data = $this.data('my.mediaplayer');
            var options = __Q.extend({}, $this.data() || {}, typeof option === 'object' && option);
            //插件缓存
            if (!data) {
                data = ImagePlayer.create($this, options);
                $this.data('my.mediaplayer', data);
            }
        });

    }

    // __Q.fn('imgplayer', ImagePlayerPlugin);

})(window, __Q);
/**
 * Created by ylf on 2015/12/9.
 */
(function (window, __Q) {

    var DEFAULTS = {
        onEnd: false,
        onPause: false,
        onPlay: false,
        onSeek: false,
        onVolumeChange: false,
        onTimeUpdate: false,
        onlyRender: false,
        autoAdaptSize: false,//自适应
        renderUI: true,
        lang: 'zh',
        video: {
            render: true,
            width: 0,
            height: 0,
            supportFullscreen: true,//是否支持全屏
            showPlayBtnInVideo: false,//显示中间的播放按钮
            showFullscreenBtn: false//是否显示全屏按钮
        }
    };

    var VideoPlayer = __Q.Controller.MediaPlayer.extend({
        create: function ($container, options) {
            var that = __Q.Controller.MediaPlayer.create.apply(this, [$container, __Q.extend({}, DEFAULTS, options), 'video']);
            that.options = __Q.extend({}, DEFAULTS, options);

            if (that.options.renderUI) {
                var funcs = ['_mediaBoxToggle', '_volumeToggleEventHandler', '_pauseEventHandler', '_unBind', '_toFullScreen', '_touchControlToggle', '_playTriggerHandler', '_endedHandler', '_fullScreenChangeHandler', '_playInVideoHanlder', '_fullScreenClickHandler', '_pcControlToggle'];
                that.proxyAll(funcs);

                that._init();
                if (that.options.onlyRender === false) {
                    that.start();
                }
                that.bind('playTrigger', that._playTriggerHandler);
                that.bind('ended', that._endedHandler);
                that.bind('unBind', that._unBind);
                that.bind('pause', that._pauseEventHandler);
                that.bind('volumeToggle', that._volumeToggleEventHandler);
            }
            return that;
        },
        _pauseEventHandler: function () {
            clearTimeout(this._timeOutId);
            this._$mediaBox.removeClass('qp-media-playing');
            if (!this._supportFullScreen()) {
                this._$playInBody.hide();
                this._$qpIconsVideo.hide();
            }
            this.$container.removeClass('qp-media-auto-hide');//移除掉自动隐藏的样式
        },
        _autoHide: function (immediatily) {
            var that = this;
            clearTimeout(that._timeOutId);
            that._timeOutId = setTimeout(function () {
                if (that.isPlaying() || immediatily) {
                    that.$container.addClass('qp-media-auto-hide');
                }
            }, __Q.support.touch ? 5500 : 2000);
        },
        _volumeToggleEventHandler: function (show) {
            if (show) {
                this._$goFullscreen.addClass('qp-bar-cover-index');
            } else {
                this._$goFullscreen.removeClass('qp-bar-cover-index');
            }
        },
        _unBind: function () {
            this._exitFull();
            this.pause();
            this._fullScreenCallBack(false);
        },
        _resizeMap: {
            'qp-media-box-min-width': function (width, height, surportFull) {
                return surportFull ? width <= 160 && width > 120 : false;
            },
            'qp-media-box-min-width-s': function (width, height, surportFull) {
                return surportFull ? width <= 120 : false;
            },
            'qp-media-box-min-height': function (width, height, surportFull) {
                return surportFull ? height <= 180 && height > 125 : false;
            },
            'qp-media-box-min-height-s': function (width, height, surportFull) {
                return surportFull ? height <= 125 : false;
            },
            'qp-media-box-max-hd': function (width, height, surportFull) {
                return width > 360 && height > 270;
            },
            'qp-media-box-not-surpot-full-min': function (width, height, surportFull) {
                if (!surportFull && width < 240 && width >= 200) {
                    return true;
                }
            },
            'qp-media-box-not-surpot-full-min-s': function (width, height, surportFull) {
                if (!surportFull && width < 200) {
                    return true;
                }
            },
            'qp-media-box-max-fullscreen': function () {
                return false;
            }
        },
        _playTriggerHandler: function () {
            //播放后，自动隐藏控制栏
            this._autoHide();
            this._$mediaBox.addClass('qp-media-playing');
            if (!this._supportFullScreen()) {
                this._$playInBody.hide();
                this._$qpIconsVideo.hide();
            } else {

            }
        },
        _endedHandler: function () {
            //移除自动隐藏样式
            clearTimeout(this._timeOutId);
            this._$mediaBox.removeClass('qp-media-playing');
            this.$container.removeClass('qp-media-auto-hide');
            if (!this._supportFullScreen()) {
                this._$playInBody.hide();
                this._$qpIconsVideo.hide();
                if (this.options.video.showPlayBtnInVideo) {
                    this._$playInBody.show();
                }
                if (!this.options.video.showFullscreenBtn) {
                    this._$qpIconsVideo.show();
                }
            }
        },
        _init: function () {
            this._fullScreen = false;
            this._createVideo();
            this._$goFullscreen = this.__Q('[data-oper="go-fullscreen"]');
            this._$exitFullscreen = this.__Q('[data-oper="exit-fullscreen"]');
            this._$fullScreenMessage = this.__Q('.qp-meida-tip-message');
            this._$qpIconsVideo = this.__Q('.qp-icons-video');
            this._$qpVideoWrap = this.__Q('.qp-video-videowrap');
            this._$toolbarCover = this.__Q('.qp-media-toolbar-cover');
            if (!this._supportFullScreen() && !this.options.video.showPlayBtnInVideo) {
                this.__Q('.qp-media-box>[data-oper="play"]').hide();
            }
            if (__Q.browser.crosswalk) {
                //解决crosswalk内 视频控制条不显示的问题
                this._$qpVideoWrap.css('zIndex', '-1');
            }
        },
        start: function () {
            var _this = this;
            if (_this.started) {
                return;
            }
            //防止重复绑定
            _this.started = true;
            //公用基类初始化
            this.baseInit();
            //绑定video私有事件
            this._controlEvent(true);
            //绑定全屏事件
            this._fullScreenCallBack(true);
        },
        _createVideo: function () {
            var $video = this.getMediaModel().getQMedia();

            try {

                $video.before(__Q.View.videoHtml);

                this.__Q('.qp-btn-exit-fullscreen').text(__Q.lang.getLangText(this.options.lang, 'media_video_exit_fullscreen'));
                this.__Q('.qp-btn-to-fullscreen').text(__Q.lang.getLangText(this.options.lang, 'media_video_fullscreen'));
                this.__Q('.qp-meida-tip-message').text(__Q.lang.getLangText(this.options.lang, 'media_video_not_support_fullscreen'));

                //移动video到新建html内部
                this.__Q('[data-oper="loading"] ').before($video.get(0));
                $video.css("width", "100%");
                $video.css("height", "100%");

                if (!this._supportFullScreen()) {
                    this.__Q('.qp-media-box').addClass('qp-media-not-support-full');
                }
                if (this.options.video.showFullscreenBtn && this._fullScreenEnabled()) {
                    this.__Q('.qp-media-box').addClass('qp-media-show-fullscreen-btn');
                }

                if (this.options.autoAdaptSize) {
                    var width = this.options.video.width;
                    var height = this.options.video.height;
                    if (!width && !height) {
                        width = this.getMediaModel().getWidth();
                        height = this.getMediaModel().getHeight();
                    }
                    this.resizeMedia(width, height);
                }
            } catch (e) {
                throw new Error('createVideo unknow error:' + e.message);
            }
        },
        resizeMedia: function (width, height) {
            if (!this._$mediaBox) {
                this._$mediaBox = this.__Q('.qp-media-box');
            }
            this._$mediaBox.css('width', width + 'px');
            this._$mediaBox.css('height', height + 'px');
            for (var key in this._resizeMap) {
                if (this._resizeMap[key](width, height, this._supportFullScreen())) {
                    this._$mediaBox.addClass(key);
                } else {
                    this._$mediaBox.removeClass(key);
                }
            }
        },
        _pcControlToggle: function (event) {
            var that = this;
            //排除重复的事件
            if (that._lastX === event.pageX && that._lastY === event.pageY) {
                return;
            }
            that._lastX = event.pageX;
            that._lastY = event.pageY;
            //清楚自动隐藏
            clearTimeout(that._timeOutId);
            //支持全屏且非全屏下控制栏不可操作
            if (that._supportFullScreen() && !that._isFullScreen()) {
                return false;
            }
            var toggle = 'show';//默认显示
            switch (event.type) {
                case 'mousemove':
                    toggle = 'show';
                    break;
                case 'mouseout':
                case 'mouseleave':
                    if (__Q.event.checkHover(event, that._$mediaBox.get(0))) {
                        toggle = that.isPlaying() ? 'hide' : 'show';
                    }
                    break;
                default:
            }

            //播放中不显示中间的播放按钮，pc 端不显示中间的按钮
            if (toggle === 'show') {
                that.$container.removeClass('qp-media-auto-hide');
            } else {
                that.$container.addClass('qp-media-auto-hide');
            }

            var autoHide = true;
            //鼠标在控制条上不隐藏
            if (event.type === 'mousemove' || event.type === 'mouseover') {
                if (that._$toolbar.contains(event.srcElement) || event.srcElement === that._$toolbar.get(0)) {
                    autoHide = false;
                }
                //鼠标在全屏按钮上不隐藏
                if (event.srcElement === that._$goFullscreen.get(0)) {
                    autoHide = false;
                }
            }
            //2秒后自动隐藏
            if (autoHide) {
                that._autoHide();
            }
        },
        _touchControlToggle: function (e) {
            if (e && e.srcElement && e.srcElement.className.indexOf('qp-media-toolbar-cover') <= -1) {
                return;
            }
            clearTimeout(this._timeOutId);

            var that = this;
            //支持全屏且非全屏下控制栏不可操作
            if (that._supportFullScreen() && !that._isFullScreen()) {
                return false;
            }
            var playing = that.isPlaying();
            if (playing) {
                that.$container.toggleClass('qp-media-auto-hide');
            } else {
                this.play();
            }
            this._autoHide();
            //播放中不显示中间的播放按钮，pc 端不显示中间的按钮
        },
        _mediaBoxToggle: function (e) {
            var that = this;
            if (e) {
                __Q.event.stopPropagation(e);
                //e.preventDefault();
            }
            var autoHide = true;
            if (that._$toolbar.contains(e.srcElement) || e.srcElement === that._$toolbar.get(0)) {
                autoHide = false;
            }
            if (autoHide) {
                that._autoHide();
            } else {
                clearTimeout(that._timeOutId);
            }
        },
        _controlEvent: function (on) {
            var _this = this;
            on = on ? 'on' : 'off';
            _this._$exitFullscreen[on]('click', _this._toFullScreen);
            _this._$goFullscreen[on]('click', _this._toFullScreen);
            _this._$playInBody[on]('click', _this._playInVideoHanlder);

            if (__Q.support.touch) {
                _this._$toolbarCover[on]('click', _this._touchControlToggle);
                _this._$mediaBox[on]('click', _this._mediaBoxToggle);
            } else {
                _this._$mediaBox[on]('mousemove mouseover mouseout', _this._pcControlToggle);
                //点击播放或暂停
                _this._$toolbarCover[on]('click', _this._fullScreenClickHandler);
            }
        },
        _fullScreenClickHandler: function (e) {
            //白板端touch点击视频进行隐藏
            if (e && e.srcElement && e.srcElement.className.indexOf('qp-media-toolbar-cover') <= -1) {
                return;
            }
            //全屏或者不支持全屏
            if ((this._supportFullScreen() && this._isFullScreen()) || !this._supportFullScreen()) {
                this.playPause(e);
            }
        },
        _playInVideoHanlder: function (e) {
            if (this._supportFullScreen() && !this._isFullScreen()) {
                this._toFullScreen();
            } else {
                this.playPause(e);
            }
        },
        _exitFull: function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }

            //兼容iOS端
            var videos = document.getElementsByTagName('video');
            if (videos && videos.length > 0) {
                for (var i = 0; i < videos.length; i++) {
                    var vd = videos[i];
                    if (vd.webkitExitFullscreen) {
                        vd.webkitExitFullscreen();
                    }
                }
            }
        },
        _toFullScreen: function (e) {
            if (e) {
                __Q.event.preventDefault(e);
            }
            var _this = this;
            if (!_this._fullScreenEnabled()) {
                //提示不支持全屏播放
                clearTimeout(_this._fullMsgTimeoutId);
                _this._$fullScreenMessage.show();
                _this._fullMsgTimeoutId = setTimeout(function () {
                    _this._$fullScreenMessage.hide();
                }, 3000);
                return;
            }
            var container = _this._$mediaBox.get(0);
            if (this._isFullScreen()) {
                this.pause();
                //https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
                this._exitFull();
            }
            else {
                var rfs = container.requestFullscreen || container.webkitRequestFullscreen || container.mozRequestFullScreen || container.msRequestFullscreen;
                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(container);
                } else {
                    __Q.logger.error('Fullscreen API is not supported');
                }
                //播放 Failed to execute 'play' on 'HTMLMediaElement': API can only be initiated by a user gesture.
                this.play();
                //隐藏样式
                this.$container.addClass('qp-media-auto-hide');
                this._$mediaBox.addClass('qp-media-playing');
                clearTimeout(_this._fullTimeOutId);
                _this._fullTimeOutId = setTimeout(function () {
                    if (!_this._fullScreen && !_this._fullScreenChangeEnable) {
                        //_this.options.video.supportFullscreen = false;
                        _this._fullScreenChangeEnable = false;
                        _this._unSurportFullApi();
                    }
                }, __Q.support.isMobile ? 1000 : 250);
            }
        },
        _fullScreenCallBack: function (on) {
            var container = this._$mediaBox.get(0);
            on = on ? 'on' : 'off';
            //__Q(document)[on]('webkitfullscreenerror',function(event){
            //    console.log('change error');
            //});
            if (__Q.browser.webkit) {
                __Q(document)[on]('webkitfullscreenchange', this._fullScreenChangeHandler);
            } else if (__Q.browser.mozilla) {
                __Q(document)[on]('mozfullscreenchange', this._fullScreenChangeHandler);
            } else if (__Q.browser.msie) {
                //https://msdn.microsoft.com/en-us/library/dn265028%28v=vs.85%29.aspx
                if (container.requestFullscreen) {
                    __Q(document)[on]('fullscreenchange', this._fullScreenChangeHandler);
                } else if (container.msRequestFullscreen) {
                    __Q(document)[on]('MSFullscreenChange', this._fullScreenChangeHandler);
                }
            }
        },
        _unSurportFullApi: function () {
            this.__Q('.qp-media-box').addClass('qp-media-not-support-full');
        },
        _fullScreenChangeHandler: function (e) {
            //防止多个视频实例之间互相干扰
            if (__Q.browser.msie) {
                if (e.target.activeElement !== this._$mediaBox.get(0)) {
                    return;
                }
            } else if (e.srcElement !== this._$mediaBox.get(0)) {
                return;
            }

            //this._fullScreen = !this._fullScreen;
            if (this._isFullScreen()) {
                this._fullScreen = true;
                this._fullScreenChangeEnable = true;
                //播放
                //this.play();
                //缓存旧样式
                this._$mediaBox.attr('original-style', this._$mediaBox.attr('style'));
                this._$mediaBox.attr('style', '');
                this._$mediaBox.attr('original-class', this._$mediaBox.attr('class'));
                this._$mediaBox.attr('class', '');
                //添加全屏样式
                this._$mediaBox.addClass('qp-media-box');
                this._$mediaBox.addClass('qp-media-box-max-fullscreen');
                //显示全屏退出按钮，隐藏播放按钮
                this.$container.addClass('qp-media-fullscreen');
                this.$container.addClass('qp-media-fullscreen-bar-show');
                //隐藏native控件
                __Q.Native.InteractAppApi.setNativeModuleVisibility(false);

                //全屏回调事件
                if (this.options.onFullScreenChange) {
                    this.options.onFullScreenChange(true);
                } else if (this.options.eventHandler.fullScreenChange) {
                    this.options.eventHandler.fullScreenChange(true);
                }
            } else {
                this._fullScreen = false;
                //暂停
                this.pause();
                //还原旧样式
                this.$container.removeClass('qp-media-fullscreen');
                if (this._$mediaBox.attr('original-style')) {
                    this._$mediaBox.attr('style', this._$mediaBox.attr('original-style'));
                }
                if (this._$mediaBox.attr('original-class')) {
                    this._$mediaBox.attr('class', this._$mediaBox.attr('original-class'));
                }
                //显示播放按钮，隐藏退出全屏按钮
                this.$container.removeClass('qp-media-fullscreen-bar-show');
                //移除自动隐藏样式
                this.$container.removeClass('qp-media-auto-hide');

                this._$mediaBox.removeClass('qp-media-playing');

                //还原native控件
                __Q.Native.InteractAppApi.setNativeModuleVisibility(true);
                //隐藏音量控制栏
                this.hideVolumeControl();
                //网络加载慢，loading可能还显示着，手动隐藏
                this._$loading.hide();

                //全屏回调事件
                if (this.options.onFullScreenChange) {
                    this.options.onFullScreenChange(false);
                } else if (this.options.eventHandler.fullScreenChange) {
                    this.options.eventHandler.fullScreenChange(false);
                }
            }
        },
        _isFullScreen: function () {
            return document.webkitIsFullScreen;
            //return this._fullScreen;
        },
        _fullScreenEnabled: function () {

            //pptshell不支持全屏
            if (location.search.toLowerCase().indexOf('sys=pptshell') >= 0 && !__Q.support.isMobile) {
                return false;
            }

            if (this._fullScreenChangeEnable === false) {
                return false;
            }

            return document.webkitFullscreenEnabled || document.msFullscreenEnabled || document.mozFullScreenEnabled;
        },
        _supportFullScreen: function () {
            return this.options.video.supportFullscreen && this._fullScreenEnabled();
        },
        reset: function () {
            this._exitFull();
            this.pause();
        }
    });


    function VideoPlayerPlugin(option) {
        option = option || {};
        return this.each(function () {
            var $this = __Q(this);

            var data = $this.data('my.mediaplayer');
            var options = __Q.extend({}, $this.data() || {}, typeof option === 'object' && option);
            //插件缓存
            if (!data) {
                data = VideoPlayer.create($this, options);
                $this.data('my.mediaplayer', data);
            }
        });

    }

    __Q.fn('videoplayer', VideoPlayerPlugin);

})(window, __Q);
/**
 * Created by ylf on 2015/12/23.
 */
__Q.Controller.ImageViewer = (function () {

    var ImageViewer = __Q.Class.Create();

    ImageViewer.include({

        create: function ($container, width, height, src, fullScreenChange) {
            var that = Object.create(this);
            that._imgData = {
                width: width,
                height: height,
                src: src
            };
            that.$container = $container;
            that.proxyAll(['hide', 'stopImgPropagation']);
            that.fullScreenChange = fullScreenChange;
            //that._init();
            return that;
        },
        stopImgPropagation: function (e) {
            __Q.event.preventDefault(e);
            __Q.event.stopPropagation(e);
        },
        show: function () {
            var _this = this;

            //移除旧代码
            var $temp = __Q('.qp-media-viewer-temp');
            if ($temp.length > 0) {
                $temp.remove();
            }

            __Q(document.body).addClass('qp-media-viewer-over-hidden');

            var $body = __Q(document.body);
            var ele = document.createElement('div');
            __Q(ele).attr('class', 'qp-media-viewer-temp');
            $body.appendChild(ele);
            var $temp = __Q('.qp-media-viewer-temp');
            $temp.html(__Q.View.viewerHtml);


            var $mask = __Q('.qp_media_window_mask');
            var $imgContainer = __Q('.qp-media-viewer-img');
            var $close = __Q('.qp-media-viewer-close');
            var $img = __Q('.qp-media-viewer-img img');
            var $center = __Q('.qp-media-viewer-center');

            _this._maxHeight = window.innerHeight * 0.8;
            _this._maxWidth = window.innerWidth * 0.8;
            //最多不超过界面的80%
            var rs = __Q.utils.resize(_this._imgData.width, _this._imgData.height, _this._maxWidth, _this._maxHeight);
            //居中
            $imgContainer.css('marginLeft', '-' + rs.w / 2 + 'px');
            $imgContainer.css('marginTop', '-' + rs.h / 2 + 'px');
            $imgContainer.css('width', rs.w + 'px');
            $imgContainer.css('height', rs.h + 'px');
            $img.attr('src', _this._imgData.src);
            $img.attr('width', rs.w);
            $img.attr('height', rs.h);
            $mask.show();
            $center.show();

            //移除弹出dom
            $close.on('click', _this.hide);
            $mask.on('click', _this.hide);
            $img.on('click', _this.hide);
            //$mask.on('touchstart ', _this.stopImgPropagation);
            //$mask.on(' mousedown', _this.stopImgPropagation);
            //$center.on('touchstart ', _this.stopImgPropagation);
            //$center.on(' mousedown', _this.stopImgPropagation);

            //隐藏native控件
            __Q.Native.InteractAppApi.setViewerModuleVisibility(false);
            if (_this.fullScreenChange) {
                _this.fullScreenChange(true);
            }
        },
        hide: function (e) {
            if (e) {
                __Q.event.preventDefault(e);
                __Q.event.stopPropagation(e);
            }
            //this.$mask.hide();
            //this.$center.hide();
            var $temp = __Q('.qp-media-viewer-temp');
            if ($temp.length > 0) {
                $temp.remove();
            }
            __Q(document.body).removeClass('qp-media-viewer-over-hidden');
            //还原native控件
            __Q.Native.InteractAppApi.setViewerModuleVisibility(true);
            if (this.fullScreenChange) {
                this.fullScreenChange(false);
            }
        }
    });
    return ImageViewer;
})();
/**
 * Created by ylf on 2015/12/13.
 */
__Q.Model.MediaEvent = (function (window, __Q) {
    var MediaEvent = __Q.Class.Create();

    MediaEvent.include(Events);

    MediaEvent.include({
        eventMethod: ['playing', 'pause',  'ended', 'timeupdate', 'seeked', 'volumechange', 'progress', 'waiting',
            'error', 'loadstart', 'loadeddata', 'loadedmetadata', 'stalled', 'suspend', 'play', 'durationchange'],
        create: function (mediaModel, option) {
            var self = Object.create(this);
            self._mediaModel = mediaModel;
            self.options = option;
            self.proxyAll(self.eventMethod);
            self.canBindKey(['playing', 'pause', 'ended', 'timeupdate', 'volumechange', 'progress', 'waiting', 'error', 'loadedmetadata', 'play', 'durationchange']);
            self.mediaEventListener(true);
            return self;
        },
        mediaEventListener: function (on) {
            var _this = this;
            var $media = _this._mediaModel.getQMedia();
            var eventMethod = _this.eventMethod;
            _this.emptied = true;//是否重新load
            for (var i = 0; i < eventMethod.length; i++) {
                $media[on ? 'on' : 'off'](eventMethod[i], '', _this[eventMethod[i]]);
            }
        },
        playing: function () {
            var _this = this;
            _this.trigger('playing');
            _this.emptied = false;
            var mediaTarget = {
                mediaId: _this._mediaModel.getId(),
                index: _this.options.index,
                mediaType: _this._mediaModel.getMediaType()
            };
            if (_this.options._onPlay) {
                _this.options._onPlay(mediaTarget);
            }
            if (_this.options.onPlay) {
                _this.options.onPlay(mediaTarget);
            } else if (_this.options.eventHandler) {
                _this.options.eventHandler.play(mediaTarget);
            }
        },
        pause: function () {
            var _this = this;
            _this.trigger('pause');

            var mediaTarget = {
                mediaId: _this._mediaModel.getId(),
                index: _this.options.index,
                mediaType: _this._mediaModel.getMediaType(),
                ended: !!_this._ended
            };
            if (_this.options.onPause) {
                _this.options.onPause(mediaTarget);
            } else if (_this.options.eventHandler) {
                _this.options.eventHandler.pause(mediaTarget);
            }
            _this._ended = false;
        },
        emptied: function () {
            this.emptied = true;
        },
        ended: function () {
            var _this = this;
            _this._mediaModel.load();
            //解决视频播后，进过隐藏再显示的错作，poster无法渲染出来的bug
            _this._mediaModel.resetPoster();
            _this.trigger('ended');
            //第一次播放完后再次播放黑屏，这边设置初始时间可解决黑屏问题
            //_this.media.currentTime = MediaEndSkipTime;
            var o = {
                mediaId: _this._mediaModel.getId(),
                index: _this.options.index,
                mediaType: _this._mediaModel.getMediaType()
            };
            if (_this.options._onEnd) {
                _this.options._onEnd(o);
            }
            if (_this.options.onEnd) {
                _this.options.onEnd(o);
            } else if (_this.options.eventHandler) {
                _this.options.eventHandler.ended(o);
            }
            //兼容101ppt上结束后不触发0时间回调问题
            var mediaTarget = {
                mediaId: _this._mediaModel.getId(),
                index: _this.options.index,
                mediaType: _this._mediaModel.getMediaType(),
                currentTime:0
            };
            if (_this.options.onTimeUpdate) {
                _this.options.onTimeUpdate(mediaTarget);
            } else if (_this.options.eventHandler) {
                _this.options.eventHandler.timeupdate(mediaTarget);
            }
            _this.playing = false;
        },
        timeupdate: function () {
            var _this = this;
            _this.trigger('timeupdate');
            var currentTime = _this._mediaModel.getCurrentTime();
            var mediaTarget = {
                mediaId: _this._mediaModel.getId(),
                index: _this.options.index,
                mediaType: _this._mediaModel.getMediaType(),
                currentTime:currentTime
            };
            if (_this.options.onTimeUpdate) {
                _this.options.onTimeUpdate(mediaTarget);
            } else if (_this.options.eventHandler) {
                _this.options.eventHandler.timeupdate(mediaTarget);
            }
            //第二次播放完后不会触发ended事件，强制触发
            var duration = _this._mediaModel.getDuration();

            if (duration > 0 && duration <= currentTime && currentTime > 0) {
                _this._ended = true;
            }
        },
        seeked: function () {
            var _this = this;
            var mediaTarget = {
                mediaId: _this._mediaModel.getId(),
                index: _this.options.index,
                mediaType: _this._mediaModel.getMediaType(),
                seeked: _this._mediaModel.getCurrentTime(),
                ended: false
            };
            if (_this.options.onSeek) {
                _this.options.onSeek(mediaTarget);
            } else if (_this.options.eventHandler) {
                _this.options.eventHandler.seeked(mediaTarget);
            }
        },
        volumechange: function () {
            var _this = this;
            _this.trigger('volumechange');
            _this.volumeChangeEvent(true);
        },
        progress: function () {
            this.trigger('progress');
        },
        waiting: function () {
            this.trigger('waiting');
        },
        error: function () {
            var code = (this._mediaModel.getError() ? this._mediaModel.getError().code : '');
            __Q.logger.debug("media error code ：" + code);
            this.trigger('error', code);
            // code == 4 网络不支持或者src地址异常时触发
            //if (code === 3) {//解码失败或者格式不支持
                //暂时注释，出现音频ND2可以播放但是出现error并code=3
                //if (_this.controlEvent) {
                //_this.controlEvent('off');
                //}
            //}
        },
        loadstart: function () {
            __Q.logger.debug('loadstart');
        },
        loadeddata: function () {
            __Q.logger.debug('loadeddata');
        },
        loadedmetadata: function () {
            __Q.logger.debug('loadedmetadata');
            this.trigger('loadedmetadata');
        },
        stalled: function () {
            __Q.logger.debug('stalled');
        },
        suspend: function () {
            __Q.logger.debug('suspend');
        },
        play: function () {
            __Q.logger.debug('play');
            var _this = this;
            _this.trigger('play');
            if (_this.options.mutuallyExclusive) {
                _this.options.eventHandler.mutuallyExclusivePlay({
                    mediaId: _this._mediaModel.getId(),
                    dataId: _this.options.dataId,
                    index: _this.options.index,
                    mediaType: _this._mediaModel.getMediaType()
                });
            }
        },
        durationchange: function () {
            this.trigger('durationchange');
        },
        volumeChangeEvent: function (display, eventTrigger) {
            var muted = this._mediaModel.getMuted();
            var volume = (muted ? 0 : this._mediaModel.getVolume());
            if (typeof  this.lastVolumeDisplay !== 'undefined' && display === this.lastVolumeDisplay && typeof this.lastVolume !== 'undefined' && !eventTrigger) {

                //和上次一样或者改动小于0.01则不发送消息
                if ((volume === this.lastVolume || (volume !== 0 && Math.abs(this.lastVolume - volume) < 0.01) )) {
                    return;
                }

                //控制条移动中，每隔25%发送消息
                if (typeof this.volumeUp !== 'undefined' && !this.volumeUp && Math.abs(this.lastVolume - volume) < 0.25) {
                    return;
                }
            }

            this.volumeUp = false;
            this.lastVolumeDisplay = display;
            this.lastVolume = (muted ? 0 : this._mediaModel.getVolume());

            var mediaTarget = {
                mediaId: this._mediaModel.getId(),
                index: this.options.index,
                mediaType: this._mediaModel.getMediaType(),
                volume: muted ? 0 : this._mediaModel.getVolume(),
                display: display
            };
            if (this.options.onVolumeChange) {
                this.options.onVolumeChange(mediaTarget);
            } else if (this.options.eventHandler) {
                this.options.eventHandler.volumeChange(mediaTarget);
            }
        }
    });

    return MediaEvent;
})(window, __Q);
/**
 * Created by ylf on 2015/12/12.
 */
__Q.Model.MediaModel = (function (window, __Q) {

    var MediaModel = __Q.Class.Create();

    MediaModel.include({
        create: function ($media) {
            var self = Object.create(this);
            self.media = $media.get(0);
            self.$media = $media;
            self.poster = $media.attr('poster');
            self.id = $media.attr('id');
            self.mediaType = self.media.tagName.toLowerCase();
            return self;
        },
        load: function () {
            this.media.load();
        },
        setPreLoad: function (preLoad) {
            this.$media.attr('preload', preLoad);
        },
        getWidth: function () {
            var attrWidth = this.$media.attr('width');
            var cssWidth = this.$media.css('width');
            return parseInt(cssWidth.indexOf('%') > 0 ? attrWidth : (attrWidth || attrWidth )) || 0;
        },
        getHeight: function () {
            var attrHeight = this.$media.attr('height');
            var cssHeight = this.$media.css('height');
            return parseInt(cssHeight.indexOf('%') > 0 ? attrHeight : (attrHeight || attrHeight )) || 0;
        },
        getMediaType: function () {
            return this.mediaType;
        },
        getMedia: function () {
            return this.media;
        },
        getQMedia: function () {
            return this.$media;
        },
        getId: function () {
            return this.id;
        },
        getPoster: function () {
            return this.poster;
        },
        isPlaying: function () {
            return !this.media.paused;
        },
        //重置poster，解决视频播后，进过隐藏再显示的错作，poster无法渲染出来的bug
        resetPoster: function () {
            if (this.poster) {
                this.$media.attr('poster', this.poster);
            }
        },
        getDuration: function () {
            //media.duration=NaN问题修复
            if (isNaN(this.media.duration)) {
                return 0;
            }
            if (this.media.duration < 0) {
                return 0;
            }
            return this.media.duration;
        },
        getCurrentTime: function () {
            return this.media.currentTime;
        },
        setCurrentTime: function (currentTime) {
            this.media.currentTime = currentTime;
        },
        getVolume: function () {
            return this.media.volume;
        },
        setVolume: function (volume) {
            this.media.volume = volume;
        },
        getBuffered: function () {
            return this.media.buffered;
        },
        getMuted: function () {
            return this.media.muted;
        },
        setMuted: function (muted) {
            this.media.muted = muted;
        },
        getReadyState: function () {
            return this.media.readyState;
        },
        getError: function () {
            return this.media.error;
        }
    });

    return MediaModel;
})(window, __Q);
__Q.View.audioHtml = (function (window, __Q) {
var arr = [];
arr.push('<div data-oper="media-box" class="qp-media-box qp-media-box-audio">');
arr.push('    <!-- 播放中下面的qp-btn-icon-play添加类名qp-btn-stop -->');
arr.push('    <span data-oper="play" class="qp-btn-icon-play"></span>');
arr.push('    <span class="qp-media-icons-right qp-icons-sound"></span>');
arr.push('    <!--<div class="qp-media-audio-bg">音频背景</div>-->');
arr.push('    <!--放置loading地方-->');
arr.push('    <div class="qp-video-videowrap qp-media-audio-bg">');
arr.push('        <div data-oper="loading" class="qp-video-loading">loading..</div>');
arr.push('    </div>');
arr.push('    <!--/放置loading地方-->');
arr.push('');
arr.push('    <!--媒体时常超过一小时的qp-media-toolbar添加类名qp-progress-long-->');
arr.push('    <div data-oper="toolbar" class="qp-media-toolbar">');
arr.push('        <!--全屏的视频才显示的播放按钮 暂停添加类名qp-btn-stop-->');
arr.push('        <span data-oper="play" class="qp-btn-icon-play"></span>');
arr.push('        <!--进度条-->');
arr.push('        <div data-oper="progress" class="qp-media-progress-outer">');
arr.push('            <div class="qp-media-progress">');
arr.push('                <div data-oper="downed-bar" class="qp-media-downed" style="width: 0%;"></div>');
arr.push('                <div data-oper="played-bar" class="qp-media-played" style="width: 0%;"></div>');
arr.push('            </div>');
arr.push('        </div>');
arr.push('        <!--/进度条-->');
arr.push('        <!--媒体时间-->                                                                                                           ');
arr.push('        <span class="qp-time-base">');
arr.push('             <em data-oper="curentTime" class="qp-curent-time">0:00</em>/<em data-oper="endTime" class="qp-end-time">0:00</em>');
arr.push('        </span>');
arr.push('        <!--/媒体时间-->');
arr.push('        <!--音量-->');
arr.push('        <div data-oper="volume-icon-container" class="qp-media-volume">');
arr.push('            <!--静音添加类名qp-btn-volume-no-->');
arr.push('            <span data-oper="volume-icon" class="qp-btn-volume"></span>');
arr.push('');
arr.push('            <div data-oper="volume-control" class="qp-media-progress-box" style="display:none">');
arr.push('                <div data-oper="volume-bar-container" class="qp-media-progress">');
arr.push('                    <div data-oper="volume-bar-s" class="qp-media-progress-s" style="height: 0%;"></div>');
arr.push('                    <div data-oper="volume-bar-r" class="qp-media-progress-r" style="bottom: 0%;"></div>');
arr.push('                </div>');
arr.push('            </div>');
arr.push('        </div>');
arr.push('');
arr.push('    </div>');
arr.push('    <div class="qp-media-disable" data-oper="media-disable">');
arr.push('');
arr.push('    </div>');
arr.push('</div>                                                                                                                            ');
arr.push('');
arr.push('');
return arr.join('');
})(window, __Q);
__Q.View.imageHtml = (function (window, __Q) {
var arr = [];
arr.push('<div class="qp-media-box qp-media-box-img ">');
arr.push('    <span class="qp-media-icons-right qp-icons-pic"></span>');
arr.push('    <div class="qp-meida-tip-message" style="display: none">');
arr.push('        图片还在加载中');
arr.push('    </div>');
arr.push('    <div class="qp-media-pics-bg"></div>');
arr.push('    <div class="qp-media-toolbar">');
arr.push('        点击查看图片');
arr.push('    </div>');
arr.push('');
arr.push('</div>');
return arr.join('');
})(window, __Q);
__Q.View.videoHtml = (function (window, __Q) {
var arr = [];
arr.push('<div data-oper="media-box" class="qp-media-box qp-media-box-video">');
arr.push('    <!-- 播放中下面的qp-btn-icon-play添加类名qp-btn-stop -->');
arr.push('    <span data-oper="play" class="qp-btn-icon-play "></span>');
arr.push('    <span data-oper="exit-fullscreen" class="qp-btn-exit-fullscreen">退出全屏</span>');
arr.push('    <span data-oper="go-fullscreen" class="qp-btn-to-fullscreen">全屏</span>');
arr.push('    <span class="qp-media-icons-right qp-icons-video"></span>');
arr.push('');
arr.push('    <!--放置视频的地方-->');
arr.push('    <div class="qp-video-videowrap">');
arr.push('        <div data-oper="loading" class="qp-video-loading">loading..</div>');
arr.push('    </div>');
arr.push('    <!--/放置视频的地方-->');
arr.push('    <div class="qp-meida-tip-message" style="display: none">');
arr.push('        不支持全屏播放');
arr.push('    </div>');
arr.push('');
arr.push('    <!--媒体时常超过一小时的qp-media-toolbar添加类名qp-progress-long-->');
arr.push('    <div data-oper="toolbar-cover" class="qp-media-toolbar-cover">');
arr.push('        <div data-oper="toolbar" class="qp-media-toolbar">');
arr.push('            <!--全屏的视频才显示的播放按钮 暂停添加类名qp-btn-stop-->');
arr.push('            <span data-oper="play" class="qp-btn-icon-play"></span>');
arr.push('            <!--进度条-->');
arr.push('            <div data-oper="progress" class="qp-media-progress-outer">');
arr.push('                <div class="qp-media-progress">');
arr.push('                    <div data-oper="downed-bar" class="qp-media-downed" style="width: 0%;"></div>');
arr.push('                    <div data-oper="played-bar" class="qp-media-played" style="width: 0%;"></div>');
arr.push('                </div>');
arr.push('            </div>');
arr.push('            <!--/进度条-->');
arr.push('            <!--媒体时间-->');
arr.push('        <span class="qp-time-base">');
arr.push('             <em data-oper="curentTime" class="qp-curent-time">0:00</em>/<em data-oper="endTime" class="qp-end-time">0:00</em>');
arr.push('        </span>');
arr.push('            <!--/媒体时间-->');
arr.push('            <!--音量-->');
arr.push('            <div data-oper="volume-icon-container" class="qp-media-volume">');
arr.push('                <!--静音添加类名qp-btn-volume-no-->');
arr.push('                <span data-oper="volume-icon" class="qp-btn-volume "></span>');
arr.push('');
arr.push('                <div data-oper="volume-control" class="qp-media-progress-box" style="display:none">');
arr.push('                    <div data-oper="volume-bar-container" class="qp-media-progress">');
arr.push('                        <div data-oper="volume-bar-s" class="qp-media-progress-s" style="height: 0%;"></div>');
arr.push('                        <div data-oper="volume-bar-r" class="qp-media-progress-r" style="bottom: 0%;"></div>');
arr.push('                    </div>');
arr.push('                </div>');
arr.push('            </div>');
arr.push('');
arr.push('        </div>');
arr.push('    </div>');
arr.push('    <div class="qp-media-disable" data-oper="media-disable">');
arr.push('');
arr.push('    </div>');
arr.push('</div>');
arr.push('');
arr.push('');
return arr.join('');
})(window, __Q);
__Q.View.viewerHtml = (function (window, __Q) {
var arr = [];
arr.push('<div class="qp_media_window_mask" style="display: none"></div>');
arr.push('<div class="qp-media-viewer-center" style="display: none">');
arr.push('    <div class="qp-media-viewer-img">');
arr.push('        <div class="qp-media-viewer-close"></div>');
arr.push('        <img />');
arr.push('    </div>');
arr.push('</div>');
return arr.join('');
})(window, __Q);
var imageviewer = (function () {
'use strict';

var methods = ['assets', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'];

var LEVEL = {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    DEBUG_VALUE: 3,
    INFO_VALUE: 2,
    WARN_VALUE: 1,
    ERROR_VALUE: 0,
    UNKNOWN: -1
};

var console = window.console || {};

var length = methods.length;

while (length--) {
    var method = methods[length];
    if (!console[method]) {
        console[method] = function () {};
    }
}

var Logger = {

    $level: 0,
    setLevel: function setLevel(level) {
        switch (level) {
            case LEVEL.DEBUG:
                this.$level = LEVEL.DEBUG_VALUE;
                break;
            case LEVEL.INFO:
                this.$level = LEVEL.INFO_VALUE;
                break;
            case LEVEL.WARN:
                this.$level = LEVEL.WARN_VALUE;
                break;
            case LEVEL.ERROR:
                this.$level = LEVEL.ERROR_VALUEl;
                break;
            default:
                this.$level = LEVEL.UNKNOWN;
        }
    },
    debug: function debug() {
        if (this.$level >= LEVEL.DEBUG_VALUE) {
            console.log.apply(console, arguments);
        }
    },
    info: function info() {
        if (this.$level >= LEVEL.INFO_VALUE) {
            console.log.apply(console, arguments);
        }
    },
    warn: function warn() {
        if (this.$level >= LEVEL.WARN_VALUE) {
            console.log.apply(console, arguments);
        }
    },
    error: function error() {
        if (this.$level >= LEVEL.ERROR_VALUE) {
            console.log.apply(console, arguments);
        }
    }
};

var DEFAULT = {
    src: '', //地址，支持字符串
    modal: true, //弹窗是否可以模态
    lock: false, // 锁定窗口 
    env: '', //环境 当前只有pc 和mobile 两种 所以暂时没有使用
    minWidth: 50,
    minHeight: 50,
    maxWidth: 256,
    maxHeight: 176,
    lang: 'zh', //语言,
    inline: false, //支持ckeditor使用span来做包装标签
    defaultSrc: '', //加载失败默认图片,
    style: '', //支持容器样式修改，
    eventAll: true //是否支持整 个容器监听事件
};

var Template = {
    view: '<div class="ndui-insert-pictures" style="width: 256px; height: 176px"> ' + '<div class="insert-pictures__wrap">' + '<span class="insert-pictures__zoom"></span>' + '<span class="insert-pictures__loading"></span>' + '<div>' + '</div>',
    view2: '<span class="ndui-insert-pictures" style="width: 256px; height: 176px"> ' + '<span class="insert-pictures__wrap">' + '<span class="insert-pictures__zoom"></span>' + '<span class="insert-pictures__loading"></span>' + '</span>' + '</span>',
    popwindow: '<div class="ndui-pop-insert-pictures">' + '<div class="pop-insert-pictures__head">' + '<span class="head__oper head__close"></span>' + '<span class="head__oper head__full"></span>' + ' </div>' + '<div class="pop-insert-pictures__body">' + ' <img src="" alt="" >' + '<span class="pic__oper oper--left" style="display:none"></span>' + '<span class="pic__oper oper--right" style="display:none"></span>' + '</div>' + '<span class="insert-pictures__loading"></span>' + '</div>',
    mask: '<div class="ndui-pop-insert-pictures-mask"></div>',
    mobilefull: '<div class="ndui-pop-insert-pictures-pad">' + '<div class="pop-insert-pictures__body">' + '<img src="" alt="">' + ' </div>' + '<span class="insert-pictures__loading"></span>' + '</div>'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var REGEXP_SPACES = /\s+/;
var REGEXP_SUFFIX = /^(width|height|left|top|marginLeft|marginTop)$/;
var REGEXP_TRIM = /^\s+(.*)\s+$/;

// Utilities
var objectProto = Object.prototype;
var toString = objectProto.toString;
function typeOf(obj) {
  return toString.call(obj).slice(8, -1).toLowerCase();
}

function isString(str) {
  return typeof str === 'string';
}

function isNumber(num) {
  return typeof num === 'number' && !isNaN(num);
}



function isObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
}



function isFunction(fn) {
  return typeOf(fn) === 'function';
}

function isArray(arr) {
  return Array.isArray ? Array.isArray(arr) : typeOf(arr) === 'array';
}





function trim(str) {
  if (isString(str)) {
    str = str.trim ? str.trim() : str.replace(REGEXP_TRIM, '1');
  }

  return str;
}

function each(obj, callback) {
  if (obj && isFunction(callback)) {
    var i = void 0;

    if (isArray(obj) || isNumber(obj.length) /* array-like */) {
        var length = obj.length;

        for (i = 0; i < length; i++) {
          if (callback.call(obj, obj[i], i, obj) === false) {
            break;
          }
        }
      } else if (isObject(obj)) {
      Object.keys(obj).forEach(function (key) {
        callback.call(obj, obj[key], key, obj);
      });
    }
  }

  return obj;
}

function extend(obj) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isObject(obj) && args.length > 0) {
    if (Object.assign) {
      return Object.assign.apply(Object, [obj].concat(args));
    }

    args.forEach(function (arg) {
      if (isObject(arg)) {
        Object.keys(arg).forEach(function (key) {
          obj[key] = arg[key];
        });
      }
    });
  }

  return obj;
}

function proxy(fn, context) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  return function () {
    for (var _len3 = arguments.length, args2 = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args2[_key3] = arguments[_key3];
    }

    return fn.apply(context, args.concat(args2));
  };
}

function setStyle(element, styles) {
  var style = element.style;

  each(styles, function (value, property) {
    if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
      value += 'px';
    }

    style[property] = value;
  });
}



function hasClass(element, value) {
  return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
}

function addClass(element, value) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    each(element, function (elem) {
      addClass(elem, value);
    });
    return;
  }

  if (element.classList) {
    element.classList.add(value);
    return;
  }

  var className = trim(element.className);

  if (!className) {
    element.className = value;
  } else if (className.indexOf(value) < 0) {
    element.className = className + ' ' + value;
  }
}

function removeClass(element, value) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    each(element, function (elem) {
      removeClass(elem, value);
    });
    return;
  }

  if (element.classList) {
    element.classList.remove(value);
    return;
  }

  if (element.className.indexOf(value) >= 0) {
    element.className = element.className.replace(value, '');
  }
}











function removeListener(element, type, handler) {
  var types = trim(type).split(REGEXP_SPACES);

  if (types.length > 1) {
    each(types, function (t) {
      removeListener(element, t, handler);
    });
    return;
  }

  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, handler);
  }
}

function addListener(element, type, _handler, once) {
  var types = trim(type).split(REGEXP_SPACES);
  var originalHandler = _handler;

  if (types.length > 1) {
    each(types, function (t) {
      addListener(element, t, _handler);
    });
    return;
  }

  if (once) {
    _handler = function handler() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      removeListener(element, type, _handler);

      return originalHandler.apply(element, args);
    };
  }

  if (element.addEventListener) {
    element.addEventListener(type, _handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, _handler);
  }
}



function getEvent(event) {
  var e = event || window.event;

  // Fix target property (IE8)
  if (!e.target) {
    e.target = e.srcElement || document;
  }

  if (!isNumber(e.pageX) && isNumber(e.clientX)) {
    var eventDoc = event.target.ownerDocument || document;
    var doc = eventDoc.documentElement;
    var body = eventDoc.body;

    e.pageX = e.clientX + ((doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0));
    e.pageY = e.clientY + ((doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0));
  }

  return e;
}

function getOffset(element) {
  var doc = document.documentElement;
  var box = element.getBoundingClientRect();

  return {
    left: box.left + ((window.scrollX || doc && doc.scrollLeft || 0) - (doc && doc.clientLeft || 0)),
    top: box.top + ((window.scrollY || doc && doc.scrollTop || 0) - (doc && doc.clientTop || 0))
  };
}



function getByClass(element, className) {
  return element.getElementsByClassName ? element.getElementsByClassName(className) : element.querySelectorAll('.' + className);
}











// Force reflow to enable CSS3 transition


// e.g.: http://domain.com/path/to/picture.jpg?size=1280×960 -> picture.jpg












function createDom(str) {
  if (typeOf(str) === 'string') {
    var dom = document && document.createElement('div');
    dom.innerHTML = str;
    return dom.firstChild;
  }
  return str;
}

function contains(root, el) {
  if (root.compareDocumentPosition) return root === el || !!(root.compareDocumentPosition(el) & 16);
  if (root.contains && el.nodeType === 1) {
    return root.contains(el) && root !== el;
  }
  while (el = el.parentNode) {
    if (el === root) return true;
  }return false;
}

function getPosOfEvent(ev) {
  ev = ev.originalEvent ? ev.originalEvent : ev;
  if (ev.type && isTouch(ev.type)) {
    var posi = [];
    var src = null;
    var eventList = void 0;
    if (ev.touches.length > 0) {
      eventList = ev.touches;
    } else {
      eventList = ev.changedTouches;
    }

    for (var t = 0, len = eventList.length; t < len; t++) {
      src = eventList[t];
      posi.push({
        x: src.pageX,
        y: src.pageY
      });
    }
    return posi;
  } else {
    return [{
      x: ev.pageX,
      y: ev.pageY
    }];
  }
}

function isMobile() {
  return window.navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);
}

function getRandomId(name) {
  return name + (Math.random() * 10 + new Date() * 1).toString().replace('.', '');
}

function isTouch(type) {
  return (/^(touchend|touchcancel|touchstart|touchmove)$/.test(type)
  );
}

var _$1 = {
    IMAGE_MIN_WIDTH: 50,
    IMAGE_MIN_HEIGHT: 50,
    IMAGE_MAX_WIDTH: 256,
    IMAGE_MAX_HEIGHT: 176,
    SPECIAL_WIDTH: 20,
    SPECIAL_HEIGHT: 80,
    VIEWER_MIN_WIDTH: 400,
    VIEWER_MIN_HEIGHT: 300,
    TOP_VIEWER: null,
    IMAGE_INSTANCES: {},
    clear: function clear(key) {
        var imageview = this.IMAGE_INSTANCES[key];
        if (imageview) {
            imageview.destroy();
        }
        this.IMAGE_INSTANCES[key] = null;
        delete this.IMAGE_INSTANCES[key];
    },
    getKeyId: function getKeyId(key) {
        return key.split('|')[1];
    }
};

var DEFAULT$1 = {
    src: '', //传入地址，数组或字符串
    currentIndex: 0, //当前位置的索引
    modal: true, //是否显示模态窗口，背景不可操作
    lock: false, //是否锁定，事件无法执行
    width: 400, //限定宽度，暂时不使用
    height: 300, // 同宽度
    maxRatio: 10, //最大放大限定 暂时没有用
    swip: false, // 是否可以左右切换
    lang: 'zh', //语言,
    defaultSrc: '' //加载失败时候的默认图片
};

/**
 * Created by ylf on 2017/2/4.
 * 常用方法
 */

var utils = {};

utils.getDistance = function (pos1, pos2) {
    var x = pos2.x - pos1.x,
        y = pos2.y - pos1.y;
    return Math.sqrt(x * x + y * y);
};

utils.getFingers = function (ev) {
    return ev.touches ? ev.touches.length : 1;
};

utils.calScale = function (pstart, pmove, intensity) {
    if (pstart.length >= 2 && pmove.length >= 2) {
        var disStart = this.getDistance(pstart[1], pstart[0]),
            disEnd = this.getDistance(pmove[1], pmove[0]),
            scale = (disEnd - disStart) * intensity;
        return (disEnd - scale) / disStart;
    }
    return 1;
};

utils.getPosOfEvent = function (ev) {
    if (this.isTouch(ev.type)) {
        var posi = [];
        var src = null;
        var eventList = void 0;
        if (ev.touches.length > 0) {
            eventList = ev.touches;
        } else {
            eventList = ev.changedTouches;
        }

        for (var t = 0, len = eventList.length; t < len; t++) {
            src = eventList[t];
            posi.push({
                x: src.pageX,
                y: src.pageY
            });
        }
        return posi;
    } else {
        return [{
            x: ev.pageX,
            y: ev.pageY
        }];
    }
};

utils.isDown = function (type) {
    return type === 'touchstart' || type === 'mousedown';
};
utils.isUp = function (type) {
    return (/^(touchend|touchcancel|mouseup|mouseleave|mouseout)$/.test(type)
    );
};
utils.isMove = function (type) {
    return type === 'mousemove' || type === 'touchmove';
};
utils.isTouch = function (type) {
    return (/^(touchend|touchcancel|touchstart|touchmove)$/.test(type)
    );
};

utils.isTouchEnd = function (ev) {
    return ev.type === 'touchend' || ev.type === 'touchcancel';
};

utils.isTouchMove = function (ev) {
    return ev.type === 'touchmove';
};

utils.proxy = function (fuc, context) {
    return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        fuc.apply(context, args);
    };
};

utils.isMobile = window.navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);

utils.hasTouch = 'ontouchend' in window;

utils.extend = function (obj, obj2) {
    for (var key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            obj[key] = obj2[key];
        }
    }
    return obj;
};

utils.getUuid = function () {
    var s = [],
        hexDigits = '0123456789abcdef',
        uuid;

    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }

    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    uuid = s.join('');
    return uuid;
};

var Config = {
    evtElem: document.body,
    tap: true,
    doubleTap: true,
    drag: true,
    pinch: true,
    hold: true,
    tapMaxDistance: 50,
    tapTime: 600,
    holdTime: 1000,
    doubleTapMaxInterval: 300,
    doubleTapMaxDistance: 16,
    pinchIntensity: 0.8,
    eventPrefix: ''
};

var EVENT = {
    PINCH_START: 'pinchstart',
    PINCH: 'pinch',
    PINCH_END: 'pinchend',
    DRAG_START: 'dragstart',
    DRAG: 'drag',
    DRAG_END: 'dragend',
    HOLD: 'hold',
    TAP: 'tap',
    DOUBLE_TAP: 'dbltap',
    FOCUS: 'focus',
    BLUR: 'blur'
};

/**
 * 底层事件绑定
 *
 **/

var Engine = {
    trigger: function trigger(el, evt, detail) {
        var e = void 0,
            opt = {
            bubbles: true,
            cancelable: true,
            detail: detail || {}
        };

        if (typeof CustomEvent !== 'undefined') {
            e = new CustomEvent(evt, opt);
            el.dispatchEvent(e);
        } else {
            e = document.createEvent('CustomEvent');
            e.initCustomEvent(evt, true, true, detail);
            el.dispatchEvent(e);
        }
    },
    bind: function bind(el, evt, handler) {
        //let that = this
        var proxy = function proxy(e) {
            //兼容处理，click这些原生事件
            e.originalEvent = e;

            for (var key in e.detail) {
                if (e.detail.hasOwnProperty(key) && key !== 'type') {
                    e[key] = e.detail[key];
                }
            }

            var returnVal = handler.call(e.target, e);

            if (typeof returnVal !== 'undefined' && !returnVal) {
                e.stopPropagation();
                e.preventDefault();
            }
        };

        handler.proxy = proxy;
        var evts = evt.match(/\S+/g);
        evts.forEach(function (e) {
            el.addEventListener(e, handler.proxy, false);
        });
    },
    unbind: function unbind(el, evt, handler) {
        var evts = evt.match(/\S+/g);
        evts.forEach(function (e) {
            el.removeEventListener(e, handler.proxy, false);
        });
    },
    on: function on() {
        var args = Array.prototype.slice.apply(arguments, [0]),
            elem = typeof args[0] === 'string' ? document.querySelectorAll(args[0]) : args[0],
            evt = args[1],
            handler = args[2];

        this.bind(elem, evt, handler);
    }
};

Engine.off = Engine.unbind;

/**
 * Created by ylf on 2017/2/4.
 */
var Core = function () {
    function Core(config) {
        classCallCheck(this, Core);

        this.uuid = utils.getUuid();
        this._config = utils.extend(Object.create(Config), config);
        this._downStart = false;
        this._pinchStart = false;
        this._dragStart = false;
        this._tap = false;
        this._startTime = 0;
        this._startPos = null;
        this._movePos = null;
        this._endPos = null;
        this._lastTarget = null;
        this._dragElem = null;
        this._holdTimer = 0;

        this.bindEvent();
    }

    createClass(Core, [{
        key: 'getConfig',
        value: function getConfig() {
            return this._config;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._downStart = false;
            this._pinchStart = false;
            this._dragStart = false;
            this._tap = false;
            this._startTime = 0;
            this._startPos = null;
            this._movePos = null;
            this._endPos = null;
            this._dragElem = null;
            clearTimeout(this._holdTimer);
            this._holdTimer = 0;
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var that = this,
                mouseEvents = ['mouseup', 'mousedown', 'mousemove', 'mouseleave'],
                touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
                events = mouseEvents,
                config = that._config;

            if (utils.isMobile) {
                events = touchEvents;
            } else if (utils.hasTouch) {
                events = touchEvents.concat(mouseEvents);
            }

            that.handler = utils.proxy(that.handler, this);
            events.forEach(function (evt) {
                config.evtElem.addEventListener(evt, that.handler, false);
            });
        }
    }, {
        key: 'downHandler',
        value: function downHandler(evt, target) {
            this._downStart = true;
            if (!this._startPos || this._startPos.length < 2) {
                this._startPos = utils.getPosOfEvent(evt);
            }
            this._startTime = new Date().getTime();

            this.focus(evt);
            this.hold(evt);

            this._lastTarget = target;
        }
    }, {
        key: 'moveHandler',
        value: function moveHandler(evt) {
            this._movePos = utils.getPosOfEvent(evt);

            if (utils.getFingers(evt) >= 2) {
                this.pinch(evt);
            } else {
                this.drag(evt);
            }
        }
    }, {
        key: 'upHandler',
        value: function upHandler(evt) {
            Logger.debug('upHandler');
            this._endPos = utils.getPosOfEvent(evt);

            if (this._pinchStart) {
                Logger.debug('deal with upHandler');
                this.pinch(evt);
            } else if (this._dragStart) {
                Logger.debug('deal with drag');
                this.drag(evt);
            } else if (this._tap) {
                Logger.debug('deal with tap');
                this.tap(evt);
            }

            this.reset();
        }
    }, {
        key: 'handler',
        value: function handler(evt) {
            var type = evt.type,
                target = evt.target;

            if (utils.isDown(type)) {
                this.downHandler(evt, target);
            } else if (utils.isMove(type)) {
                if (!this._downStart || !this._startPos) {
                    return;
                }
                this.moveHandler(evt);
            } else if (utils.isUp(type)) {
                if (!this._downStart) {
                    return;
                }
                if (target == this._lastTarget) {
                    this._tap = true;
                    Logger.debug('_tap is true');
                }
                this.upHandler(evt);
            }
        }
    }, {
        key: 'tap',
        value: function tap(evt) {

            var time = new Date().getTime(),
                elem = evt.target,
                config = this._config,
                subTime = time - this._startTime,
                distance = utils.getDistance(this._startPos[0], this._endPos[0]);
            Logger.debug('tap judge'); //
            if (subTime < config.holdTime && distance <= config.tapMaxDistance && subTime <= config.tapTime) {
                Logger.debug(' tap start');
                if (this._startTime - this.__lastTapTime <= config.doubleTapMaxInterval && this.__lastTapPos && utils.getDistance(this.__lastTapPos, this._endPos[0]) <= config.doubleTapMaxDistance && this.__lastTapElem == elem) {
                    Logger.debug('double tap start');
                    this.trigger(elem, evt, EVENT.DOUBLE_TAP);
                    this.__lastTapTime = 0;
                    this.__lastTapPos = null;
                    this.__lastTapElem = null;
                } else {
                    Logger.debug('tap trigger ');
                    this.trigger(elem, evt, EVENT.TAP);
                    this.__lastTapTime = time;
                    this.__lastTapPos = this._endPos[0];
                    this.__lastTapElem = elem;
                }
            } else {
                Logger.debug("tap hold long time");
            }
        }
    }, {
        key: 'drag',
        value: function drag(evt) {
            if (!this._startPos) {
                return;
            }

            var elem = evt.target;

            if (!this._dragStart) {
                var startDis = utils.getDistance(this._startPos[0], this._movePos[0]);
                if (startDis > 1) {
                    this._dragElem = elem;
                    this.trigger(elem, evt, EVENT.DRAG_START);
                    this.trigger(elem, evt, EVENT.DRAG);
                    this._dragStart = true;
                }
            } else {
                if (utils.isMove(evt.type)) {
                    this.trigger(this._dragElem, evt, EVENT.DRAG);
                } else if (utils.isUp(evt.type)) {
                    this.trigger(this._dragElem, evt, EVENT.DRAG_END);
                }
            }
        }
    }, {
        key: 'hold',
        value: function hold(evt) {
            var that = this;
            clearTimeout(this._holdTimer);
            this._holdTimer = setTimeout(function () {
                if (!that._startPos) {
                    return;
                }
                var distance = utils.getDistance(that._startPos[0], that._movePos ? that._movePos[0] : that._startPos[0]);
                if (that._config.tapMaxDistance < distance) {
                    return;
                }

                that.trigger(evt.target, evt, EVENT.HOLD, {
                    type: EVENT.HOLD,
                    originEvent: evt,
                    fingersCount: utils.getFingers(evt),
                    position: that._startPos[0]
                });
            }, this._config.holdTime);
        }
    }, {
        key: 'pinch',
        value: function pinch(evt) {
            if (!this._downStart) {
                return;
            }
            if (utils.getFingers(evt) < 2 && !utils.isTouchEnd(evt)) {
                return;
            }

            var config = this._config,
                scale = utils.calScale(this._startPos, this._movePos, config.pinchIntensity),
                fingersCount = utils.getFingers(evt),
                eventObj = {
                originEvent: evt,
                scale: scale,
                fingersCount: fingersCount
            };

            if (!this._pinchStart) {
                this._pinchStart = true;
                this.trigger(evt.target, evt, EVENT.PINCH_START, eventObj);
            } else if (utils.isTouchMove(evt)) {
                this.trigger(evt.target, evt, EVENT.PINCH, eventObj);
            } else if (utils.isTouchEnd(evt)) {
                this.trigger(evt.target, evt, EVENT.PINCH_END, eventObj);
            }
        }
    }, {
        key: 'focus',
        value: function focus(evt) {
            var elem = evt.target,
                lastElem = this._lastTarget;

            if (lastElem !== elem && lastElem) {
                this.trigger(lastElem, evt, EVENT.BLUR);
                this.trigger(elem, evt, EVENT.FOCUS);
            } else if (!lastElem) {
                this.trigger(elem, evt, EVENT.FOCUS);
            }
        }
    }, {
        key: 'trigger',
        value: function trigger(elem, originalEvt, evt, detail) {
            detail = detail || {
                originalEvent: originalEvt
            };
            var prefix = this._config.eventPrefix;
            if (prefix) {
                evt = prefix + evt;
            }
            Engine.trigger(elem, evt, detail, this._config.eventPrefix);
        }
    }]);
    return Core;
}();

/**
 *  create by ylf 2017/2/6
 */

var EventApi = function () {
    function EventApi(config) {
        classCallCheck(this, EventApi);

        this.core = new Core(config);
    }

    createClass(EventApi, null, [{
        key: 'on',
        value: function on() {
            var args = Array.prototype.slice.apply(arguments, [0]);
            //this.core.engine.on.apply(this.core.engine, args)
            Engine.on.apply(Engine, args);
        }
    }, {
        key: 'off',
        value: function off() {
            var args = Array.prototype.slice.apply(arguments, [0]);
            Engine.off.apply(Engine, args);
        }
    }]);
    return EventApi;
}();

/**
 * this is a event delegate 
 * created by ccr
 */
var registerEvents = void 0;
var self$1 = void 0; //不使用逶拖的方式来注册事件，否则会造成事件无法回收的问题
/**
 * 全局事件订阅
 */
var Events = {
    eventList: {},
    down: false,
    key: '',
    init: function init() {
        self$1 = this;
        if (!registerEvents) {
            registerEvents = new EventApi({
                evtElem: document.body
            });
        }
        return registerEvents;
    },
    bind: function bind() {
        self$1 = this;
        EventApi.on(document.body, 'tap dragstart drag dragend pinchstart pinch pinchend', self$1.handler);
    },

    unbind: function unbind() {
        self$1 = this;
        EventApi.off(document.body, 'tap dragstart drag dragend pinchstart pinch pinchend', self$1.handler);
    },
    registerEvent: function registerEvent(obj, events) {
        if (obj == null || events == null) {
            return;
        }
        events = events.split(' ');
        for (var i = 0, len = events.length; i < len; i++) {
            var eventName = events[i];
            if (self$1.eventList[eventName] && self$1.eventList[eventName].indexOf(obj) < 0) {
                self$1.eventList[eventName].push(obj);
            } else if (self$1.eventList[eventName] == null || self$1.eventList[eventName].length == 0) {
                self$1.eventList[eventName] = [obj];
            }
        }
    },
    unregisterEvent: function unregisterEvent(obj, events) {
        if (obj == null || events == null) {
            return;
        }
        events = events.split(' ');
        for (var i = 0, len = events.length; i < len; i++) {
            var eventName = events[i];
            var index = self$1.eventList[eventName].indexOf(obj);
            if (index > -1) {
                self$1.eventList[eventName].splice(index, 1);
            }
        }
    },
    handler: function handler(event) {
        event = getEvent(event);
        var target = event.target;
        var objs = self$1.eventList[event.type] || [];
        for (var i = 0, len = objs.length; i < len; i++) {
            var obj = objs[i];
            if (obj.container && contains(obj.container, target)) {
                obj.$handle(event);
            }
        }
        return;
    }
};

var MobileViewer = function () {
    function MobileViewer(options) {
        classCallCheck(this, MobileViewer);

        this.options = extend({}, DEFAULT$1, options);
        Events.registerEvent(this, 'tap dragstart drag dragend pinchstart pinch pinchend');
        this.$createHtml();
        this.$render();
        this.fullScreenChange = this.options.onFullScreenChange || this.options.eventHandler && this.options.eventHandler.fullScreenChange;
        var self = this;
        this.$orientationChange = proxy(self.$orientationChange, self);
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", this.$orientationChange, false);
    }

    createClass(MobileViewer, [{
        key: '$render',
        value: function $render() {
            this.viewerData = {
                width: 0,
                height: 0,
                src: ''
            };
            this.viewerData.src = this.options.src;
            this.fullWidth = document.documentElement.clientWidth;
            this.fullHeight = document.documentElement.clientHeight;
            this.cacheLastStatus = {};
            this.$init();
            this.close();
        }
    }, {
        key: '$init',
        value: function $init() {
            var _this = this;

            var self = this;
            self.$loadImage(function (w, h) {
                self.viewerData.width = w;
                self.viewerData.height = h;
                _this.$resize();
                addClass(self.loading, 'hide-dom');
            });
            this.viewerImg.src = this.viewerData.src;
        }
    }, {
        key: '$resize',
        value: function $resize() {
            //横向
            var self = this;
            var _w = self.viewerData.width;
            var _h = self.viewerData.height;
            var w = void 0,
                h = void 0;
            this.fullWidth = document.documentElement.clientWidth;
            this.fullHeight = document.documentElement.clientHeight;

            if (_w / _h > this.fullWidth / this.fullHeight && _w > this.fullWidth) {
                w = this.fullWidth;
                h = _h * w / _w;
            } else if (_h > this.fullHeight) {
                h = this.fullHeight;
                w = _w * h / _h;
            } else {
                h = _h;
                w = _w;
            }
            self.viewerImg.style.width = w + 'px';
            self.viewerData.width = w;
            self.viewerData.height = h;
            var left = void 0,
                top = void 0;
            top = (this.fullHeight - h) / 2;
            left = (this.fullWidth - w) / 2;
            self.viewerImg.style.top = top + 'px';
            self.viewerImg.style.left = left + 'px';
        }
    }, {
        key: '$createHtml',
        value: function $createHtml() {
            var templateDom = Template.mobilefull;
            var templateMask = Template.mask;
            templateDom = createDom(templateDom);
            this.viewerImg = templateDom.querySelector('img');
            this.loading = templateDom.querySelector('.insert-pictures__loading');
            this.container = templateDom;
            templateMask = createDom(templateMask);
            this.mask = templateMask;
            document.body.appendChild(templateMask);
            document.body.appendChild(templateDom);
        }
    }, {
        key: '$loadImage',
        value: function $loadImage(callback) {
            var self = this;
            var img = new Image();
            img.src = self.viewerData.src;
            if (img.complete) {
                if (callback) {
                    callback(img.width, img.height);
                }
            } else {
                img.onload = function () {
                    if (callback) {
                        callback(img.width, img.height);
                    }
                    img.onload = null;
                };
                img.onerror = function () {
                    self.viewerData.src = self.options.defaultSrc;
                    self.viewerImg.src = self.options.defaultSrc;
                    img.src = self.options.defaultSrc;
                    img.onerror = null;
                };
            }
        }
    }, {
        key: '$initOffset',
        value: function $initOffset(p, _w, _h, changeWidth) {
            var x = p && p.x,
                y = p && p.y;
            this.viewerImg.style.width = changeWidth + 'px';
            var w = this.viewerImg.clientWidth,
                h = this.viewerImg.clientHeight;
            var left = this.viewerImg.offsetLeft,
                top = this.viewerImg.offsetTop;
            Logger.debug("mobile full", _w, _h, this.fullHeight, this.fullWidth);
            if (p && w > this.fullWidth && h > this.fullHeight) {
                Logger.debug("mobile viewer finger center scale");
                var imgLeft = p.x - (p.x - left) * w / _w;
                var imgTop = p.y - (p.y - top) * h / _h;
                imgLeft = imgLeft > 0 ? 0 : imgLeft < this.fullWidth - w ? this.fullWidth - w : imgLeft;
                imgTop = imgTop > 0 ? 0 : imgTop < this.fullHeight - h ? this.fullHeight - h : imgTop;
                this.viewerImg.style.left = imgLeft + 'px';
                this.viewerImg.style.top = imgTop + 'px';
            } else {
                Logger.debug("mobile viewer center scale");
                this.viewerImg.style.left = (this.fullWidth - w) / 2 + 'px';
                this.viewerImg.style.top = (this.fullHeight - h) / 2 + 'px';
            }
        }
    }, {
        key: '$handle',
        value: function $handle(event) {
            var _this2 = this;

            event = getEvent(event);
            var target = event.target;
            var self = this;
            event ? event.stopPropagation() : window.event.cancelBubble = true;
            event.preventDefault();

            var originalEvent = event.originalEvent;
            originalEvent && (originalEvent.stopPropagation ? originalEvent.stopPropagation() : originalEvent.cancelBubble && (originalEvent.cancelBubble = true));
            originalEvent.preventDefault && originalEvent.preventDefault();

            var point = getPosOfEvent(event);

            var px = point[0].x;
            var py = point[0].y;
            switch (event.type) {
                case 'tap':
                    Logger.debug('mobile tap');
                    var time = setTimeout(function () {
                        self.close();
                        clearTimeout(time);
                    }, 10);
                    break;
                case 'dragstart':
                    Logger.debug('mobile dragstart');
                    if (target == this.viewerImg) {
                        if (this.viewerImg.clientWidth <= this.fullWidth && this.viewerImg.clientHeight <= this.fullHeight) {
                            return;
                        }
                        this.isDrag = true;
                        this.wheeling = false;
                        this.cacheLastStatus = this.cacheLastStatus || {};
                        this.cacheLastStatus.x = px;
                        this.cacheLastStatus.y = py;
                        this.cacheLastStatus.width = this.viewerImg.clientWidth;
                        this.cacheLastStatus.height = this.viewerImg.clientHeight;
                    }
                    break;
                case 'drag':
                    if (this.isDrag) {
                        //Logger.debug('mobile drag');
                        if (this.wheeling) {
                            return;
                        }
                        this.wheeling = true;
                        var id = setTimeout(function () {
                            _this2.wheeling = false;
                            clearTimeout(id);
                        }, 60);

                        var w = this.cacheLastStatus.width,
                            h = this.cacheLastStatus.height;

                        if (w > this.fullWidth) {
                            var imageLeft = px - this.cacheLastStatus.x + this.viewerImg.offsetLeft;
                            if (imageLeft <= 0 && imageLeft >= this.fullWidth - w) {
                                this.viewerImg.style.left = imageLeft + 'px';
                            }
                            this.$moveFlag = true;
                        }
                        if (h > this.fullHeight) {
                            var imageTop = py - this.cacheLastStatus.y + this.viewerImg.offsetTop;
                            if (imageTop <= 0 && imageTop >= this.fullHeight - h) {
                                this.viewerImg.style.top = imageTop + 'px';
                            }
                            this.$moveFlag = true;
                        }
                        if (this.$moveFlag) {
                            this.cacheLastStatus.x = px;
                            this.cacheLastStatus.y = py;
                        }
                    }

                    break;
                case 'dragend':
                    this.isDrag = false;
                    Logger.debug('mobile dragend');
                    break;
                case 'pinchstart':
                    if (target == this.viewerImg) {
                        this.isPinch = true;
                        this.wheeling = false;
                        this.cacheLastStatus = this.cacheLastStatus || {};
                        this.cacheLastStatus.width = this.viewerImg.clientWidth;
                        this.cacheLastStatus.height = this.viewerImg.clientHeight;
                    }
                    Logger.debug('mobile pinchstart');
                    break;
                case 'pinch':
                    if (this.isPinch) {
                        if (this.wheeling) {
                            return;
                        }
                        this.wheeling = true;
                        var _id = setTimeout(function () {
                            _this2.wheeling = false;
                            clearTimeout(_id);
                        }, 60);

                        //Logger.debug('mobile pinch');
                        var scale = event.scale || 1;
                        scale = parseInt(scale * 100) / 100;
                        var _w2 = void 0,
                            _h2 = void 0,
                            _w = void 0,
                            _h = void 0;

                        _w = this.cacheLastStatus.width;
                        _h = this.cacheLastStatus.height;

                        if (scale > 1) {
                            scale = scale * 1.5;
                        } else {
                            scale = scale * 1 / 1.5;
                        }

                        // Logger.debug('mobile scale' + scale);
                        _w2 = parseInt(_w * scale * 100) / 100;
                        _h2 = parseInt(_h * scale * 100) / 100;

                        // Logger.debug('mobile width' + w);
                        //Logger.debug('mobile height' + h);
                        var touchs = event.originEvent && event.originEvent.changedTouches;
                        var centerPoint = null;
                        if (touchs && touchs.length > 1) {
                            var point1 = getOffset(this.viewerImg);
                            centerPoint = {
                                x: (touchs[0].clientX + touchs[1].clientX) / 2,
                                y: (touchs[0].clientY + touchs[1].clientY) / 2
                            };
                            var flag = false,
                                changeWidth = void 0;
                            if (_w2 >= this.viewerData.width && _h2 >= this.viewerData.height && _w2 <= this.viewerData.width * 20 && _h2 < this.viewerData.height * 20) {
                                //设置 left top 值
                                //Logger.debug('mobile offset');
                                changeWidth = _w2;
                                flag = true;
                            } else if (_w2 < this.viewerData.width && _h2 < this.viewerData.height && _w >= this.viewerData.width && _h >= this.viewerData.height && _w <= this.viewerData.width * 20 && _h < this.viewerData.height * 20) {
                                changeWidth = this.viewerData.width;
                                //如果缩放时候小于最小值的时候取原大小
                                flag = true;
                            } else if (_w2 > _w && _h2 > _h && _w2 > this.viewerData.width * 20 && _h2 > this.viewerData.height * 20) {
                                //如果放大最大值的时候大于20倍时取最大值
                                changeWidth = this.viewerData.width * 20;
                                flag = true;
                            }
                            flag && this.$initOffset(centerPoint, _w, _h, changeWidth);
                        }
                    }
                    break;
                case 'pinchend':
                    this.isPinch = false;
                    Logger.debug('mobile pinchend');
                    break;
                default:
                    break;
            }
            return false;
        }
    }, {
        key: 'updateSrc',
        value: function updateSrc() {
            var arg = arguments;
            if (arg.length == 0) {
                return;
            }
            if (arg.length == 1) {
                var arg1 = arg[0];
                if (isString(arg1)) {
                    this.viewerData.src = this.options.src = arg1;
                    this.$init();
                }
            }
        }
    }, {
        key: 'open',
        value: function open() {
            setStyle(document.body, {
                "overflow": "hidden"
            });
            this.container && (this.container.style.display = '');
            this.mask && removeClass(this.mask, 'hide-dom');
            __Q && __Q.Native.InteractAppApi.setViewerModuleVisibility(false);
            if (this.fullScreenChange) {
                this.fullScreenChange(true);
            }
        }
    }, {
        key: 'close',
        value: function close() {
            setStyle(document.body, {
                "overflow": ""
            });
            this.container.style.display = 'none';
            this.mask && addClass(this.mask, 'hide-dom');
            __Q && __Q.Native.InteractAppApi.setViewerModuleVisibility(true);
            if (this.fullScreenChange) {
                this.fullScreenChange(false);
            }
        }
    }, {
        key: '$orientationChange',
        value: function $orientationChange(event) {
            // 根据event.orientation|screen.orientation.angle等于0|180、90|-90度来判断横竖屏
            event.preventDefault();
            event.stopPropagation();
            Logger.debug('监听到屏幕方向改变');
            if (window.orientation == 180 || window.orientation == 0) {
                this.setVertical();
                Logger.debug('设置为竖屏幕');
            }
            if (window.orientation == 90 || window.orientation == -90) {
                this.setCross();
                Logger.debug('设置为横屏幕');
            }
            if (event.type == 'resize') {
                this.$resize();
            }
        }
    }, {
        key: 'setCross',
        value: function setCross() {
            this.container && addClass(this.container, 'show__cross');
            this.$resize();
        }
    }, {
        key: 'setVertical',
        value: function setVertical() {
            this.container && removeClass(this.container, 'show__cross');
            this.$resize();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            Logger.debug('销毁mobileviewer');
            var self = this;
            //事件解绑
            Events.unregisterEvent(this, 'tap dragstart drag dragend pinchstart pinch pinchend');
            window.removeEventListener("onorientationchange" in window ? "orientationchange" : "resize", this.$orientationChange, false);
            this.mask.ontouchstart = null;
            //dom移除
            this.container && this.container.parentNode.removeChild(this.container);
            this.mask && this.mask.parentNode.removeChild(this.mask);
            //数据清空
            this.mask = null;
            this.viewerImg = null;
            this.loading = null;
            this.container = null;
            this.viewerData = null;
            if (_$1.TOP_VIEWER && _$1.TOP_VIEWER == this) {
                _$1.TOP_VIEWER = null;
            }
        }
    }]);
    return MobileViewer;
}();

var zh = {
    'preview': '预览',
    'max': '最大化',
    'min': '向下还原',
    'close': '关闭'
};
var en = {
    'preview': 'preview',
    'max': 'max',
    'min': 'min',
    'close': 'close'
};

var Lang = {
    'zh': zh,
    'zh_cn': zh,
    'en': en,
    'en_us': en
};

var PcViewer = function () {
    function PcViewer(options) {
        classCallCheck(this, PcViewer);

        this.options = extend({}, DEFAULT$1, options);
        Events.registerEvent(this, 'tap dragstart drag dragend pinchstart pinch pinchend');
        this.$createHtml();
        this.$render();
    }

    createClass(PcViewer, [{
        key: '$render',
        value: function $render() {
            this.viewerData = {
                src: '',
                width: 0,
                height: 0,
                containerWidth: 0,
                containerHeight: 0
            };
            this.bound = 8; //距离外窗8px内可以显示缩放的鼠标型状
            this.padding = 2; //图片的边距
            this.viewerData.src = this.options.src;
            this.currentIndex = this.options.currentIndex;
            this.viewerData.width = this.options.width;
            this.viewerData.height = this.options.height;
            this.isModal = this.options.modal;
            isObject(this.options.lang) ? this.langObject = this.options.lang : this.langObject = Lang[this.options.lang.toLowerCase()] || Lang['zh'];

            this.$initFullSize();
            if (this.options.src && typeOf(this.options.src) == 'array') {
                this.imgLength = this.options.src.length;
                this.currentIndex = this.currentIndex > this.imgLength - 1 ? this.imgLength - 1 : this.currentIndex;
                this.viewerData.src = this.options.src[this.currentIndex];
            } else if (typeOf(this.options.src) == 'string') {
                this.options.src = [this.options.src];
                this.currentIndex = 0;
                this.viewerData.src = this.options.src[this.currentIndex];
                this.imgLength = this.options.src.length;
            } else {
                Logger.error("缺少src参数");
                return;
            }
            this.isModal && this.$createMask();
            this.close();
            this.$init();
        }
    }, {
        key: '$createMask',
        value: function $createMask() {
            var templateDom = Template.mask;
            templateDom = createDom(templateDom);
            addClass(templateDom, 'mask--transparent');
            var hasMask = getByClass(document.body, 'ndui-pop-insert-pictures-mask');
            if (hasMask == null || hasMask.length < 1) {
                document.body.appendChild(templateDom);
                this.mask = templateDom;
            } else {
                this.mask = hasMask[0];
            }
        }
    }, {
        key: '$createHtml',
        value: function $createHtml() {
            var self = this;
            var templateDom = Template.popwindow;
            templateDom = createDom(templateDom);
            this.viewerImg = templateDom.querySelector('img');
            this.viewerClose = templateDom.querySelector('.head__oper.head__close');
            this.viewerFull = templateDom.querySelector('.head__oper.head__full');
            this.viewerHead = templateDom.querySelector('.pop-insert-pictures__head');
            this.viewerBody = templateDom.querySelector('.pop-insert-pictures__body');
            this.swipLeft = templateDom.querySelector('.pic__oper.oper--left');
            this.swipRight = templateDom.querySelector('.pic__oper.oper--right');
            this.loading = templateDom.querySelector('.insert-pictures__loading');
            this.container = templateDom;
            document.body.appendChild(templateDom);
            self.$handleMousemove = proxy(self.$handleMousemove, self);
            self.$handleWheel = proxy(self.$handleWheel, self);
            addListener(this.container, 'mousedown mousemove touchstart touchend', self.$handleMousemove);
            addListener(this.container, 'mousewheel', self.$handleWheel);
            addListener(this.viewerClose, 'mouseover mouseleave touchstart touchend', self.$handleMousemove);
            addListener(this.viewerFull, ' mouseover mouseleave touchstart touchend', self.$handleMousemove);
        }
    }, {
        key: '$init',
        value: function $init(swipWidth) {
            var self = this;
            this.$loadImage(function (width, height) {
                self.viewerData.width = width;
                self.viewerData.height = height;
                var w = void 0,
                    h = void 0,
                    left = void 0,
                    top = void 0,
                    tmpHeight = void 0;
                var _h = self.fullBodyHeight - self.viewerPaddingHeight * 2;
                var _w = self.fullBodyWidth - self.viewerPaddingWidth * 2;

                if (swipWidth) {
                    var _h2 = self.fullBodyHeight - self.viewerPaddingHeight * 2;
                    w = swipWidth;
                    tmpHeight = height / width * w;
                    if (tmpHeight > _h2) {
                        h = _h2;
                    } else if (tmpHeight < _$1.VIEWER_MIN_HEIGHT) {
                        h = _$1.VIEWER_MIN_HEIGHT;
                    } else {
                        h = tmpHeight;
                    }
                } else if (self.viewerData.width < _$1.VIEWER_MIN_WIDTH || self.viewerData.height < _$1.VIEWER_MIN_HEIGHT) {
                    w = width < _$1.VIEWER_MIN_WIDTH ? _$1.VIEWER_MIN_WIDTH : width > _w ? _w : width;
                    h = height < _$1.VIEWER_MIN_HEIGHT ? _$1.VIEWER_MIN_HEIGHT : height > _h ? _h : height;
                } else {
                    if (width > _w || height > _h) {
                        if (width / height > _w / _h) {
                            if (width > _w) {
                                w = _w;
                            } else if (width < _$1.IMAGE_MIN_WIDTH) {
                                w = _$1.IMAGE_MIN_WIDTH;
                            }
                            h = height / width * w;
                            h = h < _$1.IMAGE_MIN_HEIGHT ? _$1.IMAGE_MIN_HEIGHT : h;
                        } else {
                            if (height > _h) {
                                h = _h;
                            } else if (h < _$1.IMAGE_MAX_HEIGHT) {
                                h = _$1.IMAGE_MIN_HEIGHT;
                            }
                            w = width / height * h;
                            w = w < _$1.IMAGE_MIN_WIDTH ? _$1.IMAGE_MIN_WIDTH : w;
                        }
                    } else {
                        w = width;
                        h = height;
                    }
                }
                self.viewerData.containerWidth = w;
                self.viewerData.containerHeight = h;
                if (self.fulled) {
                    self.$resize(self.fullBodyWidth, self.fullBodyHeight);
                } else {
                    swipWidth ? self.$resize(null, null, true) : self.$resize();
                }
                self.loading.setAttribute('class', 'hide-dom');
            });
            this.viewerClose.setAttribute('title', this.langObject['close']);
            this.viewerFull.setAttribute('title', this.langObject['max']);
            this.viewerImg.src = this.viewerData.src;
            this.$initSwip();
            if (!swipWidth) {
                this.fulled = false;
                this.$initFullStatus();
            }
            this.$initSwipVisible();
        }
    }, {
        key: '$initSwipVisible',
        value: function $initSwipVisible() {
            if (this.options.src.length > 1) {
                this.swipLeft.style.display = '';
                this.swipRight.style.display = '';
                this.swipLeft.style.display = '';
                this.swipRight.style.display = '';
            } else {
                this.swipLeft.style.display = 'none';
                this.swipRight.style.display = 'none';
                this.swipLeft.style.display = 'none';
                this.swipRight.style.display = 'none';
            }
        }
    }, {
        key: '$initFullSize',
        value: function $initFullSize() {
            this.fullWidth = document.documentElement.clientWidth;
            this.fullHeight = document.documentElement.clientHeight;
            this.fullBodyWidth = this.fullWidth - this.padding * 2;
            this.fullBodyHeight = this.fullHeight - this.padding * 2 - this.viewerHead.clientHeight;
            this.viewerPaddingWidth = this.fullBodyWidth * 0.1;
            this.viewerPaddingHeight = this.fullBodyHeight * 0.1;
        }
    }, {
        key: '$resize',
        value: function $resize(bodyWidth, bodyHeight, fixed) {
            this.$initFullSize();
            var w = void 0,
                h = void 0,
                left = void 0,
                top = void 0,
                self = this,
                _w = void 0,
                _h = void 0;
            var imgWidth = this.viewerData.width,
                imgHeight = this.viewerData.height;
            w = bodyWidth == null ? this.viewerData.containerWidth : bodyWidth;
            h = bodyHeight == null ? this.viewerData.containerHeight : bodyHeight;

            if (imgWidth > w) {
                _w = w;
                _h = imgHeight / imgWidth * w;
                imgWidth = _w;
                imgHeight = _h;
            } else if (imgHeight > h) {
                _h = h;
                _w = imgWidth / imgHeight * h;
                imgWidth = _w;
                imgHeight = _h;
            }

            left = w / 2 - imgWidth / 2;
            top = h / 2 - imgHeight / 2;
            this.viewerImg.removeAttribute('style');
            this.viewerImg.style.width = imgWidth + 'px';
            this.viewerImg.style.left = left + 'px';
            this.viewerImg.style.top = top + 'px';
            var oldHeight = this.viewerBody.clientHeight;
            this.viewerBody.style.width = w + 'px';
            this.viewerBody.style.height = h + 'px';

            left = this.fullBodyWidth / 2 - w / 2;
            top = this.fullBodyHeight / 2 - h / 2;
            //this.container.style.left = left + 'px';
            //this.container.style.top = top + 'px';

            if (fixed && oldHeight) {
                var containerTop = this.container.offsetTop - (h - oldHeight) / 2;
                this.container.style.top = containerTop + 'px';
            } else {
                this.container.style.left = left + 'px';
                this.container.style.top = top + 'px';
            }
        }
    }, {
        key: '$imageCenter',
        value: function $imageCenter(bodyWidth, bodyHeight) {
            var w = void 0,
                h = void 0,
                left = void 0,
                top = void 0;
            w = bodyWidth;
            h = bodyHeight;
            left = w / 2 - this.viewerImg.clientWidth / 2;
            top = h / 2 - this.viewerImg.clientHeight / 2;

            this.viewerImg.style.left = left + 'px';
            this.viewerImg.style.top = top + 'px';
            this.viewerBody.style.width = w + 'px';
            this.viewerBody.style.height = h + 'px';
        }
    }, {
        key: '$loadImage',
        value: function $loadImage(callback) {
            var self = this;
            var img = new Image();
            img.src = self.viewerData.src;
            if (img.complete) {
                callback && callback(img.width, img.height);
            } else {
                img.onload = function () {
                    callback && callback(img.width, img.height);
                    img.onload = null;
                };
                img.onerror = function () {
                    self.viewerData.src = self.options.defaultSrc;
                    self.viewerImg.src = self.options.defaultSrc;
                    img.src = self.options.defaultSrc;
                    img.onerror = null;
                };
            }
        }
    }, {
        key: '$handleTap',
        value: function $handleTap(event) {
            if (this.options.lock) {
                return;
            }
            event ? event.stopPropagation() : window.event.cancelBubble = true;
            event = getEvent(event);
            var px = void 0,
                py = void 0;

            var point = getPosOfEvent(event);
            px = point[0].x;
            py = point[0].y;

            _$1.TOP_VIEWER && (_$1.TOP_VIEWER.container.style.zIndex = 100000);
            this.container.style.zIndex = 100001;
            _$1.TOP_VIEWER = this;

            switch (event.target) {
                case this.viewerClose:
                    this.close();
                    break;
                case this.viewerFull:
                    this.full();
                    break;
                case this.swipLeft:
                    this.prev();
                    break;
                case this.swipRight:
                    this.next();
                    break;
                default:
                    break;
            }
        }
    }, {
        key: '$handle',
        value: function $handle(event) {
            if (this.options.lock) {
                return;
            }
            event = getEvent(event);
            var originalEvent = event.originalEvent ? event.originalEvent : event;
            var point = getPosOfEvent(event);
            this.$px = point[0].x;
            this.$py = point[0].y;
            switch (event.type) {
                case 'tap':
                    this.$handleTap(event);
                    break;
                case 'dragstart':
                    event.preventDefault();
                    if (_$1.TOP_VIEWER) {
                        _$1.TOP_VIEWER.container.style.zIndex = 100000;
                    }
                    this.container.style.zIndex = 100001;
                    _$1.TOP_VIEWER = this;

                    if (event.target == this.viewerClose || event.target == this.viewerFull) {
                        return;
                    }
                    this.isDown = true;
                    this.cacheLastStatus = this.cacheLastStatus || {};
                    this.cacheLastStatus.px = this.$px;
                    this.cacheLastStatus.py = this.$py;
                    break;
                case 'drag':
                    event.preventDefault();
                    if (!this.isDown) {
                        return;
                    }
                    if (this.isBorder && !hasClass(this.viewerFull, 'head__small')) {
                        Logger.debug(this.container.style.cursor);
                        var bh = void 0,
                            bw = void 0;
                        switch (this.isBorder) {
                            case 'n-resize':
                                bh = this.viewerBody.clientHeight - (this.$py - this.cacheLastStatus.py);
                                if (bh >= _$1.VIEWER_MIN_HEIGHT && bh <= this.fullBodyHeight) {
                                    this.viewerBody.style.height = bh + 'px';
                                    this.container.style.top = this.container.offsetTop + (this.$py - this.cacheLastStatus.py) + 'px';
                                }
                                break;
                            case 's-resize':
                                bh = this.viewerBody.clientHeight + this.$py - this.cacheLastStatus.py;
                                if (bh >= _$1.VIEWER_MIN_HEIGHT && bh <= this.fullBodyHeight) {
                                    this.viewerBody.style.height = bh + 'px';
                                }
                                break;
                            case 'w-resize':
                                bw = this.viewerBody.clientWidth - (this.$px - this.cacheLastStatus.px);
                                if (bw >= _$1.VIEWER_MIN_WIDTH && bw <= this.fullBodyWidth) {
                                    this.viewerBody.style.width = bw + 'px';
                                    this.container.style.left = this.container.offsetLeft + this.$px - this.cacheLastStatus.px + 'px';
                                }

                                break;
                            case 'e-resize':
                                bw = this.viewerBody.clientWidth + this.$px - this.cacheLastStatus.px;
                                if (bw >= _$1.VIEWER_MIN_WIDTH && bw <= this.fullBodyWidth) {
                                    this.viewerBody.style.width = bw + 'px';
                                }

                                break;
                            case 'nw-resize':
                                bh = this.viewerBody.clientHeight - (this.$py - this.cacheLastStatus.py);
                                if (bh >= _$1.VIEWER_MIN_HEIGHT && bh <= this.fullBodyHeight) {
                                    this.viewerBody.style.height = bh + 'px';
                                    this.container.style.top = this.container.offsetTop + (this.$py - this.cacheLastStatus.py) + 'px';
                                }
                                bw = this.viewerBody.clientWidth - (this.$px - this.cacheLastStatus.px);
                                if (bw >= _$1.VIEWER_MIN_WIDTH && bw <= this.fullBodyWidth) {
                                    this.viewerBody.style.width = bw + 'px';
                                    this.container.style.left = this.container.offsetLeft + this.$px - this.cacheLastStatus.px + 'px';
                                }
                                break;
                            case 'ne-resize':
                                bh = this.viewerBody.clientHeight - (this.$py - this.cacheLastStatus.py);
                                if (bh >= _$1.VIEWER_MIN_HEIGHT && bh <= this.fullBodyHeight) {
                                    this.viewerBody.style.height = bh + 'px';
                                    this.container.style.top = this.container.offsetTop + (this.$py - this.cacheLastStatus.py) + 'px';
                                }
                                bw = this.viewerBody.clientWidth + this.$px - this.cacheLastStatus.px;
                                if (bw >= _$1.VIEWER_MIN_WIDTH && bw <= this.fullBodyWidth) {
                                    this.viewerBody.style.width = bw + 'px';
                                }
                                break;
                            case 'sw-resize':
                                bw = this.viewerBody.clientWidth - (this.$px - this.cacheLastStatus.px);
                                if (bw >= _$1.VIEWER_MIN_WIDTH && bw <= this.fullBodyWidth) {
                                    this.viewerBody.style.width = bw + 'px';
                                    this.container.style.left = this.container.offsetLeft + this.$px - this.cacheLastStatus.px + 'px';
                                }
                                bh = this.viewerBody.clientHeight + this.$py - this.cacheLastStatus.py;
                                if (bh >= _$1.VIEWER_MIN_HEIGHT && bh <= this.fullBodyHeight) {
                                    this.viewerBody.style.height = bh + 'px';
                                }
                                break;
                            case 'se-resize':
                                bh = this.viewerBody.clientHeight + this.$py - this.cacheLastStatus.py;
                                if (bh >= _$1.VIEWER_MIN_HEIGHT) {
                                    this.viewerBody.style.height = bh + 'px';
                                }
                                bw = this.viewerBody.clientWidth + this.$px - this.cacheLastStatus.px;
                                if (bw >= _$1.VIEWER_MIN_WIDTH) {
                                    this.viewerBody.style.width = bw + 'px';
                                }
                                break;
                        }
                        this.$imageCenter(this.viewerBody.clientWidth, this.viewerBody.clientHeight);
                        this.cacheLastStatus.px = this.$px;
                        this.cacheLastStatus.py = this.$py;
                    }

                    if (this.isBorder) {
                        return;
                    }

                    if (event.target == this.viewerImg) {
                        var w = void 0,
                            h = void 0,
                            byW = void 0,
                            byH = void 0,
                            moveFlag = false;
                        w = this.viewerImg.clientWidth;
                        h = this.viewerImg.clientHeight;
                        byW = this.viewerBody.clientWidth;
                        byH = this.viewerBody.clientHeight;

                        if (w > byW) {
                            var moveToLeft = this.$px - this.cacheLastStatus.px + this.viewerImg.offsetLeft;
                            if (moveToLeft <= 0 && moveToLeft >= byW - w) {
                                this.viewerImg.style.left = moveToLeft + 'px';
                            }
                            moveFlag = true;
                        }
                        if (h > byH) {
                            var moveToTop = this.$py - this.cacheLastStatus.py + this.viewerImg.offsetTop;
                            if (moveToTop <= 0 && moveToTop >= byH - h) {
                                this.viewerImg.style.top = moveToTop + 'px';
                            }
                            moveFlag = true;
                        }
                        if (moveFlag) {
                            this.cacheLastStatus.px = this.$px;
                            this.cacheLastStatus.py = this.$py;
                            return;
                        }
                    }

                    if (hasClass(this.viewerFull, 'head__small')) {
                        return;
                    }

                    var docCenterX = this.fullBodyWidth / 2;
                    var docCenterY = this.fullBodyHeight / 2;

                    var containerLeft = this.$px - this.cacheLastStatus.px + this.container.offsetLeft;
                    var containerTop = this.$py - this.cacheLastStatus.py + this.container.offsetTop;
                    var centerX = containerLeft + this.container.clientWidth / 2;
                    var centerY = containerTop + this.container.clientHeight / 2;
                    if (centerX >= 0 && centerX <= this.fullBodyWidth) {
                        this.container.style.left = containerLeft + 'px';
                    } else if (Math.abs(this.$px - docCenterX) < Math.abs(this.cacheLastStatus.px - docCenterX)) {
                        this.container.style.left = containerLeft + 'px';
                    }

                    if (centerY >= 0 && centerY <= this.fullHeight) {
                        this.container.style.top = containerTop + 'px';
                    } else if (Math.abs(this.$py - docCenterY) < Math.abs(this.cacheLastStatus.py - docCenterY)) {
                        this.container.style.top = containerTop + 'px';
                    }

                    this.cacheLastStatus.px = this.$px;
                    this.cacheLastStatus.py = this.$py;
                    break;
                case 'dragend':
                    event.preventDefault();
                    this.isDown = false;
                    this.isBorder = '';
                    break;
                default:
                    break;
            }
        }
    }, {
        key: '$handleWheel',
        value: function $handleWheel(event) {
            var _this = this;

            event ? event.stopPropagation() : window.event.cancelBubble = true;
            event = getEvent(event);
            event.preventDefault();

            var target = event.target;
            var px = void 0,
                py = void 0;
            var point = getPosOfEvent(event);
            px = point[0].x;
            py = point[0].y;

            if (target == this.viewerImg || target == this.viewerBody) {
                Logger.debug('wheel');
                // Limit wheel speed to prevent zoom too fast
                if (this.wheeling) {
                    return;
                }

                this.wheeling = true;

                setTimeout(function () {
                    _this.wheeling = false;
                }, 50);

                var ratio = 1;
                var delta = 1;
                var scale = 1;

                if (event.deltaY) {
                    delta = event.deltaY > 0 ? 1 : -1;
                } else if (event.wheelDelta) {
                    delta = -event.wheelDelta / 120;
                } else if (event.detail) {
                    delta = event.detail > 0 ? 1 : -1;
                }
                scale = -delta * ratio;
                scale = Number(scale);

                if (scale < 0) {
                    scale = 1 / (1 - scale);
                } else {
                    scale = 1 + scale;
                }
                var $offset = getOffset(this.viewerImg);
                var left = $offset.left;
                var top = $offset.top;
                $offset = getOffset(this.viewerImg.parentNode);
                var parentLeft = $offset.left;
                var parentTop = $offset.top;
                var tempWidth = this.viewerImg.clientWidth;
                var tempHeight = this.viewerImg.clientHeight;
                var bodyWidth = this.viewerBody.clientWidth;
                var bodyHeight = this.viewerBody.clientHeight;
                var imgHeight = this.viewerData.height;
                var imgWidth = this.viewerData.width;

                tempWidth = tempWidth * scale;
                if (tempWidth > imgWidth * 10) {
                    tempWidth = imgWidth * 10;
                    scale = tempWidth / this.viewerImg.clientWidth; //重新计算放大的倍数
                } else if (imgHeight < _$1.IMAGE_MIN_HEIGHT || imgWidth < _$1.IMAGE_MIN_WIDTH) {
                    if (tempWidth < imgWidth) {
                        tempWidth = imgWidth;
                        scale = tempWidth / this.viewerImg.clientWidth;
                    }
                } else if (tempWidth < _$1.IMAGE_MIN_WIDTH) {
                    tempWidth = _$1.IMAGE_MIN_WIDTH;
                    scale = tempWidth / this.viewerImg.clientWidth;
                }

                this.viewerImg.style.width = tempWidth + 'px';
                tempHeight = this.viewerImg.clientHeight;

                left = (left - px) * scale + px;
                top = (top - py) * scale + py;

                if (bodyHeight >= tempHeight || bodyWidth >= tempWidth) {
                    left = bodyWidth / 2 - tempWidth / 2;
                    top = bodyHeight / 2 - tempHeight / 2;

                    this.viewerImg.style.left = left + 'px';
                    this.viewerImg.style.top = top + 'px';
                } else {
                    left = left - parentLeft;
                    top = top - parentTop;

                    left = left > 0 ? 0 : left;
                    left = left < bodyWidth - tempWidth ? bodyWidth - tempWidth : left;

                    top = top > 0 ? 0 : top;
                    top = top < bodyHeight - tempHeight ? bodyHeight - tempHeight : top;

                    this.viewerImg.style.left = left + 'px';
                    this.viewerImg.style.top = top + 'px';
                }
            }
        }
    }, {
        key: '$handleMousemove',
        value: function $handleMousemove(event) {
            event = getEvent(event);
            event.preventDefault();
            var originalEvent = event.originalEvent ? event.originalEvent : event;
            var point = getPosOfEvent(event);
            this.$px = point[0].x;
            this.$py = point[0].y;

            var isFull = this.fulled;
            var isCtrBtn = false;
            var target = event.target;
            if (target == this.viewerClose || target == this.viewerFull) {
                isCtrBtn = true;
            }

            switch (event.type) {
                case 'touchstart':
                    if (isCtrBtn) {
                        addClass(target, 'head__oper--hover');
                    }
                case 'mousedown':
                    if (isFull || isCtrBtn) {
                        return;
                    }
                    Logger.debug(this.$px, this.$py);
                    this.isBorder = this.$borderCheck({
                        x: this.$px,
                        y: this.$py
                    });
                    break;
                case 'mousemove':
                    if (isFull || isCtrBtn) {
                        return;
                    }
                    this.$borderCheck({
                        x: this.$px,
                        y: this.$py
                    }, function () {
                        Logger.debug('done');
                    });
                    break;
                case 'mouseover':
                    if (isCtrBtn) {
                        addClass(target, 'head__oper--hover');
                    }
                    break;
                case 'mouseleave':
                case 'touchend':
                    if (isCtrBtn) {
                        removeClass(target, 'head__oper--hover');
                    }
                    break;
                default:
                    break;
            }
        }
    }, {
        key: '$borderCheck',
        value: function $borderCheck(pointer, callback) {
            var px = pointer.x;
            var py = pointer.y;
            var parent = this.container;
            parent.style.cursor = '';
            var x = parent.offsetLeft;
            var y = parent.offsetTop;
            var w = parent.clientWidth;
            var h = parent.clientHeight;
            var plt = {
                x: x,
                y: y
            };
            var prt = {
                x: x + w,
                y: y
            };
            var pld = {
                x: x,
                y: y + h
            };
            var prd = {
                x: x + w,
                y: y + h
            };

            var pointers = [plt, prt, pld, prd];
            var dirs = ['nw-resize', 'ne-resize', 'sw-resize', 'se-resize'];
            var flag = true;
            for (var i = 0; i < pointers.length; i++) {
                if (Math.abs(px - pointers[i].x) < this.bound && Math.abs(py - pointers[i].y) < this.bound) {
                    parent.style.cursor = dirs[i];
                    flag = false;
                    callback && callback(px, py);
                    break;
                }
            }
            if (flag) {

                if (px > plt.x + this.bound && px < prd.x - this.bound && py > plt.y && py < plt.y + this.bound) {
                    //top
                    parent.style.cursor = 'n-resize';
                    callback && callback(px, py);
                    flag = false;
                } else if (px > plt.x + this.bound && px < prd.x - this.bound && py > prd.y - this.bound && py < prd.y) {
                    //down
                    parent.style.cursor = 's-resize';
                    callback && callback(px, py);
                    flag = false;
                } else if (px > plt.x && px < plt.x + this.bound && py > plt.y + this.bound && py < prd.y - this.bound) {
                    //left
                    parent.style.cursor = 'w-resize';
                    callback && callback(px, py);
                    flag = false;
                } else if (px > prd.x - this.bound && px < prd.x && py > plt.y + this.bound && py < prd.y - this.bound) {
                    //right
                    parent.style.cursor = 'e-resize';
                    callback && callback(px, py);
                    flag = false;
                }
            }
            return parent.style.cursor;
        }
    }, {
        key: '$initFullStatus',
        value: function $initFullStatus() {
            if (this.fulled) {
                this.viewerFull && removeClass(this.viewerFull, 'head__full');
                this.viewerFull && addClass(this.viewerFull, 'head__small');
            } else {
                this.viewerFull && removeClass(this.viewerFull, 'head__small');
                this.viewerFull && addClass(this.viewerFull, 'head__full');
            }
        }
    }, {
        key: '$initSwip',
        value: function $initSwip() {
            if (this.currentIndex == 0) {
                addClass(this.swipLeft, 'oper--disabled');
            } else {
                removeClass(this.swipLeft, 'oper--disabled');
            }
            if (this.currentIndex == this.imgLength - 1) {
                addClass(this.swipRight, 'oper--disabled');
            } else {
                removeClass(this.swipRight, 'oper--disabled');
            }
        }
    }, {
        key: 'open',
        value: function open() {
            if (this.container) {
                this.fulled = false;
                this.$initFullStatus();
                this.container.style.display = '';
                if (this.options.modal) {
                    this.mask && removeClass(this.mask, 'hide-dom');
                }
                this.$resize();
            }
        }
    }, {
        key: 'close',
        value: function close() {
            this.container.style.display = 'none';
            if (this.options.modal) {
                addClass(this.mask, 'hide-dom');
            }
        }
    }, {
        key: 'full',
        value: function full() {
            if (!this.fulled) {
                this.fulled = true;
                this.cacheLastStatus = this.cacheLastStatus || {};
                this.cacheLastStatus.full = {
                    containerLeft: this.container.offsetLeft,
                    containerTop: this.container.offsetTop,
                    bodyWidth: this.viewerBody.clientWidth,
                    bodyHeight: this.viewerBody.clientHeight,
                    imgWidth: this.viewerImg.clientWidth,
                    imgLeft: this.viewerImg.offsetLeft,
                    imgTop: this.viewerImg.offsetTop
                };
                this.viewerFull.setAttribute('title', this.langObject['min']);
                this.$resize(this.fullBodyWidth, this.fullBodyHeight);
            } else {
                this.fulled = false;
                this.viewerFull.setAttribute('title', this.langObject['max']);
                this.container.style.left = this.cacheLastStatus.full.containerLeft + 'px';
                this.container.style.top = this.cacheLastStatus.full.containerTop + 'px';
                this.viewerBody.style.width = this.cacheLastStatus.full.bodyWidth + 'px';
                this.viewerBody.style.height = this.cacheLastStatus.full.bodyHeight + 'px';
                this.viewerImg.style.width = this.cacheLastStatus.full.imgWidth + 'px';
                this.viewerImg.style.left = this.cacheLastStatus.full.imgLeft + 'px';
                this.viewerImg.style.top = this.cacheLastStatus.full.imgTop + 'px';
            }
            this.$initFullStatus();
        }
    }, {
        key: 'prev',
        value: function prev() {
            this.currentIndex--;
            if (this.currentIndex >= 0) {
                this.viewerData.src = this.options.src[this.currentIndex];
                this.$init(this.viewerBody.clientWidth);
            } else {
                this.currentIndex = 0;
                addClass(this.swipLeft, 'oper--disabled');
            }
        }
    }, {
        key: 'next',
        value: function next() {
            this.currentIndex++;
            if (this.currentIndex < this.imgLength) {
                this.viewerData.src = this.options.src[this.currentIndex];
                this.$init(this.viewerBody.clientWidth);
            } else {
                addClass(this.swipRight, 'oper--disabled');
                this.currentIndex = this.imgLength - 1;
            }
        }

        /**
         * 外部可以直接更新
         */

    }, {
        key: 'updateSrc',
        value: function updateSrc() {
            var arg = arguments;
            if (arg.length == 0) {
                return;
            }
            if (arg.length == 1) {
                var arg1 = arg[0];
                if (isString(arg1)) {
                    // this.isSwip = false;
                    this.options.src[0] = arg1;
                    this.viewerData.src = arg1;
                    this.$init();
                } else if (isNumber(arg1) && arg1 >= 0 && arg1 < this.imgLength) {
                    this.viewerData.src = this.options.src[arg1];
                    this.currentIndex = arg1;
                    this.$init();
                } else if (isArray(arg1) && arg1.length > 0) {
                    // this.isSwip = true;
                    this.options.src = arg1;
                    this.viewerData.src = this.options.src[0];
                    this.currentIndex = 0;
                    this.imgLength = arg1.length;
                    this.$init();
                }
            } else if (arg.length >= 2) {
                var index = arg[0];
                var srcArray = arg[1];
                if (isNumber(index) && isArray(srcArray) && index >= 0 && index < srcArray.length) {
                    // this.isSwip = true;
                    this.options.src = srcArray;
                    this.viewerData.src = this.options.src[index];
                    this.imgLength = srcArray.length;
                    this.currentIndex = index;
                    this.$init();
                }
            }
        }
    }, {
        key: 'setLock',
        value: function setLock(lock) {
            this.options.lock = lock;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var self = this;
            //事件解绑
            Events.unregisterEvent(this, 'tap dragstart drag dragend pinchstart pinch pinchend');
            this.container && removeListener(this.container, 'mousedown mousemove', self.$handleMousemove);
            this.viewerClose && removeListener(this.viewerClose, 'mouseover mouseleave', self.$handleMousemove);
            this.viewerFull && removeListener(this.viewerFull, ' mouseover mouseleave', self.$handleMousemove);
            // dom元素移除
            this.container && this.container.parentNode.removeChild(this.container);
            this.mask && this.mask.parentNode && this.mask.parentNode.removeChild(this.mask);
            // 数据清空
            this.mask = null;
            this.container = null;
            this.viewerImg = null;
            this.viewerClose = null;
            this.viewerFull = null;
            this.viewerHead = null;
            this.viewerBody = null;
            this.swipLeft = null;
            this.swipRight = null;
            this.loading = null;
            this.options = null;
            this.$handle = null;
            this.$handleMousemove = null;
            if (_$1.TOP_VIEWER && _$1.TOP_VIEWER == this) {
                _$1.TOP_VIEWER = null;
            }
            this.viewerData = null;
        }
    }]);
    return PcViewer;
}();

var VIEWER_TYPE = {
    MOBILE: 'mobile',
    PC: 'pc'
    /**
     * viewer  弹窗构造工厂
     */
};var Factory = {
    createViewer: function createViewer(options) {
        var env = options.env;
        switch (env) {
            case VIEWER_TYPE.MOBILE:
                return new MobileViewer(options);
                break;
            case VIEWER_TYPE.PC:
                return new PcViewer(options);;
                break;
            default:
                break;
        }
        return _.VIEWER;
    }
};

var ImageView = function () {
    function ImageView(container, options) {
        classCallCheck(this, ImageView);

        //兼容只传入options的方式
        if (!container && !options) {
            throw new Error("至少需要一个参数");
            return;
        } else if (!options && container) {
            options = container;
            container = null;
        } else if (options && container) {
            var reg = container.nodeName && 'IMGimg'.match(container.nodeName);
            if (!(reg && reg.length > 0)) {
                throw new Error("图片参数有误");
                return;
            }
        }
        this.container = container;
        this.options = extend({}, DEFAULT, options);

        if (isMobile()) {
            this.env = 'mobile';
        } else {
            this.env = 'pc';
        }
        this.env = this.options.env || this.env;
        this.options.env = this.env;
        var src = '';

        if (this.options.src && typeOf(this.options.src) == 'string') {
            src = this.options.src;
        } else if (this.container) {
            src = this.container && this.container.getAttribute('src');
            this.options.src = src;
        }

        !this.options.src && Logger.debug('没有图片地址');
        this.imgData = {
            src: src,
            width: 0,
            height: 0
        };
        this.viewer = null;
    }

    createClass(ImageView, [{
        key: 'render',
        value: function render() {
            var reg = this.container && this.container.nodeName && 'IMGimg'.match(this.container.nodeName);
            if (reg && reg.length > 0) {
                this.container.removeAttribute('style');
                this.container.removeAttribute('class');
                this.container.removeAttribute('width');
                this.container.removeAttribute('height');
                this.container.style.display = 'none';
            }
            this.$init();
        }
    }, {
        key: '$init',
        value: function $init() {
            var _this = this;

            var self = this;
            self.$createHtml();
            this.$loadImage(function () {

                //如果图片太小
                if (self.imgData.width < _$1.IMAGE_MIN_WIDTH && self.imgData.height < _$1.IMAGE_MIN_HEIGHT) {
                    self.container && (self.container.style.display = '');
                    setStyle(self.container, { 'border': '0' });
                    setStyle(self.container, { 'width': self.imgData.width, 'height': self.imgData.height });
                    _this.img.removeAttribute('style');
                    addClass(self.scale, 'hide-dom');
                    addClass(self.loading, 'hide-dom');
                    self.$removeLister();
                    return;
                }

                self.$renderHtml();
                addClass(_this.loading, 'hide-dom');
                Logger.debug('loaded img');
            });
        }
    }, {
        key: '$loadImage',
        value: function $loadImage(callback) {
            var self = this;
            var img = new Image();
            img.src = self.imgData.src;
            if (img.complete) {
                self.imgData.width = img.width;
                self.imgData.height = img.height;
                if (callback) {
                    callback();
                }
            } else {
                img.onload = function () {
                    self.imgData.width = img.width;
                    self.imgData.height = img.height;
                    if (callback) {
                        callback();
                    }
                    img.onload = null;
                };
                img.onerror = function () {
                    self.img.src = self.options.defaultSrc;
                    self.options.defaultSrc && (img.src = self.options.defaultSrc);
                    self.imgData.src = self.options.defaultSrc;
                    img.onerror = null;
                };
            }
        }
    }, {
        key: '$createHtml',
        value: function $createHtml() {
            var templateView = void 0,
                wrapView = void 0;
            templateView = this.options.inline ? Template.view2 : Template.view;
            templateView = createDom(templateView);
            wrapView = templateView.firstElementChild;
            if (this.env == 'mobile') {
                addClass(templateView.querySelector('.insert-pictures__zoom'), 'hide-dom');
            }

            if (this.container) {
                this.img = this.container;
                // wrapView && wrapView.insertBefore(this.container, wrapView.firstElementChild);
            } else {
                var img = createDom('<img/>');
                img.src = this.imgData.src;
                this.img = img;
                //wrapView.insertBefore(img, wrapView.firstElementChild);
            }
            this.container = templateView;

            if (this.img && this.img.parentElement) {
                this.img.parentElement.insertBefore(this.container, this.img);
            }

            wrapView && wrapView.insertBefore(this.img, wrapView.firstElementChild);

            this.loading = this.container.querySelector('.insert-pictures__loading');
            this.scale = this.container.querySelector('.insert-pictures__zoom');
            var self = this;
            self.$handle = proxy(self.$handle, self);
            if (this.env == 'pc' && !this.options.eventAll) {
                this.scale && addListener(this.scale, 'click', self.$handle);
            } else {
                this.container && addListener(this.container, 'click', self.$handle);
            }
            this.options.style && setStyle(this.container, this.options.style);
        }
    }, {
        key: '$renderHtml',
        value: function $renderHtml() {
            this.$resize();
        }
    }, {
        key: '$resize',
        value: function $resize() {
            var w = void 0,
                h = void 0,
                _w = void 0,
                _h = void 0;
            _w = this.imgData.width;
            _h = this.imgData.height;

            if (_w < _$1.IMAGE_MIN_HEIGHT) {
                w = _$1.IMAGE_MIN_WIDTH;
                h = _h <= _$1.IMAGE_MAX_HEIGHT ? _h : _$1.IMAGE_MAX_HEIGHT;
            } else if (_h < _$1.IMAGE_MIN_WIDTH) {
                h = _$1.IMAGE_MIN_HEIGHT;
                w = _w <= _$1.IMAGE_MAX_WIDTH ? _w : _$1.IMAGE_MAX_WIDTH;
            } else if (_w > _$1.IMAGE_MAX_WIDTH || _h > _$1.IMAGE_MAX_HEIGHT) {
                w = _$1.IMAGE_MAX_WIDTH;
                h = _$1.IMAGE_MAX_HEIGHT;
            } else {
                w = _w;
                h = _h;
            }
            this.container.style.width = w + 'px';
            this.container.style.height = h + 'px';

            this.img.removeAttribute('style');
        }
    }, {
        key: '$handle',
        value: function $handle(event) {
            event ? event.stopPropagation() : window.event.cancelBubble = true;
            Logger.debug('click');
            if (this.options.lock) {
                return;
            }

            if (this.viewer == null) {
                var viewrOptions = extend({}, this.options, this.imgData);
                this.viewer = Factory.createViewer(viewrOptions);
                this.viewer.container.style.zIndex = 100001;
            } else if (this.env == 'mobile') {
                this.viewer.updateSrc(this.imgData.src);
            }
            this.viewer.open();
            if (_$1.TOP_VIEWER) {
                _$1.TOP_VIEWER.container && (_$1.TOP_VIEWER.container.style.zIndex = 100000);
            }
            this.viewer.container && (this.viewer.container.style.zIndex = 100001);
            _$1.TOP_VIEWER = this.viewer;
        }
    }, {
        key: 'setLock',
        value: function setLock(lock) {
            this.options.lock = lock;
            if (this.options.lock) {
                this.container && setStyle(this.container, { 'pointer-events': 'none' });
            } else {
                this.container && setStyle(this.container, { 'pointer-events': '' });
            }
        }
    }, {
        key: 'getView',
        value: function getView() {
            return this.container;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.off();
        }
    }, {
        key: 'on',
        value: function on() {
            this.viewer && this.viewer.open();
        }
    }, {
        key: 'off',
        value: function off() {
            this.viewer && this.viewer.close();
        }
    }, {
        key: '$removeLister',
        value: function $removeLister() {
            if (this.env == 'pc' && !this.options.eventAll) {
                this.scale && removeListener(this.scale, 'click', this.$handle);
            } else {
                this.container && removeListener(this.container, 'click', this.$handle);
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            Logger.debug('销毁imageveiewer');
            this.$removeLister();
            this.viewer && this.viewer.destroy();
            this.container = null;
            this.viewer = null;
            this.loading = null;
            this.scale = null;
            this.options = null;
            this.imgData = null;
        }
    }]);
    return ImageView;
}();

var ImagePlayer = {
    setLoggerLevel: function setLoggerLevel(level) {
        Logger.setLevel(level);
    },
    render: function render(container, options) {

        container = container.length > 0 ? container[0] : container; //添加对jq的适配

        for (var key in _$1.IMAGE_INSTANCES) {
            if (!document.querySelector('[data-id="' + _$1.getKeyId(key) + '"]')) {
                _$1.clear(key);
            }
        }
        _$1.TOP_VIEWER = null; //清空当前顶层数据
        _$1.VIEWER = null; //清空工厂

        options = options || {};
        Events.init();
        Events.unbind();
        Events.bind();
        if (container) {
            var imageItems = container.nodeName.toLowerCase() == 'img' ? [container] : container.getElementsByTagName('img');

            each(imageItems, function (item, index) {

                if (item.parentNode && hasClass(item.parentNode, 'ndui-insert-pictures') || item.parentNode && hasClass(item.parentNode, 'pop-insert-pictures__body')) {
                    return;
                }

                var dataId = getRandomId('media');

                var mediaId = 'image';
                var containerId = options.containerId || '';
                mediaId = mediaId + '-' + containerId + '-' + index;

                var key = mediaId + '|' + dataId;
                var newOptions = extend({}, options, {
                    dataId: dataId,
                    mediaId: mediaId,
                    key: key
                });

                var image = new ImageView(item, newOptions);
                image.render();
                _$1.IMAGE_INSTANCES[key] = image;
            });
        } else {
            Logger.debug('no container');
        }
        return _$1.IMAGE_INSTANCES;
    },

    destroy: function destroy() {
        Events.unbind();
        var instances = _$1.IMAGE_INSTANCES;
        for (var i = 0, len = instances.length; i < len; i++) {
            instances.destroy();
        }
        _$1.IMAGE_INSTANCES = {};
        _$1.TOP_VIEWER = null;
        _$1.VIEWER = null; //清空工厂
    },
    reset: function reset() {
        var instances = _$1.IMAGE_INSTANCES;
        for (var i = 0, len = instances.length; i < len; i++) {
            instances.off();
        }
    },
    setLock: function setLock(lock, view) {
        var instances = _$1.IMAGE_INSTANCES;
        for (var key in instances) {
            instances[key].setLock(lock);
        }
    },
    getMedia: function getMedia() {
        return _$1.IMAGE_INSTANCES;
    },
    mediaOnFullScreenChange: function mediaOnFullScreenChange() {
        //no use
    },
    Image: {
        create: function create(img, options) {
            Events.init();
            Events.unbind();
            Events.bind();
            return new ImageView(img, options);
        }
    },
    Viewer: {
        create: function create(options) {
            var env = '';
            if (isMobile()) {
                env = 'mobile';
            } else {
                env = 'pc';
            }
            options.env = options.env || env;
            Events.init();
            Events.unbind();
            Events.bind();
            var instance = Factory.createViewer(options);
            if (_$1.TOP_VIEWER) {
                _$1.TOP_VIEWER.container && (_$1.TOP_VIEWER.container.style.zIndex = 100000);
            }
            instance.container && (instance.container.style.zIndex = 100001);
            _$1.TOP_VIEWER = instance;
            return instance;
        }
    }
};

return ImagePlayer;

}());

/**
 * Created by ylf on 2015/12/9.
 */

(function (window, __Q, ImagePlayer) {


    function ImagePlayerPlugin(option) {
        option = option || {};
        return this.each(function () {
            var $this = __Q(this);

            var data = $this.data('my.mediaplayer');
            var options = __Q.extend({}, typeof option === 'object' && option);
            //插件缓存
            if (!data) {
                data = ImagePlayer.Image.create($this.get(0), options);
                $this.data('my.mediaplayer', data);
            }
        });

    }

    __Q.fn('imgplayer', ImagePlayerPlugin);

})(window, __Q, imageviewer);
/**
 * Created by ylf on 2015/12/9.
 */

(function (window, __Q, ImagePlayer) {

    //空方法
    var _emptyFunc = function () {

    };


    //播放互相排斥
    var mutuallyExclusivePlay = function (mediaObj) {
        var that = window.NDMediaPlayer;
        var mediaId = mediaObj.mediaType + '-' + mediaObj.index + '|' + mediaObj.dataId;
        for (var key in that._$medias) {
            if (mediaId !== key && that._$medias[key]) {
                if (that._$medias[key].data('my.mediaplayer').pause) {
                    that._$medias[key].data('my.mediaplayer').pause();
                }
            }
        }
    };

    var DefaultOption = {
        onlyRender: false, //这个参数要抛弃了
        lock: false, //是否锁定
        autoAdaptSize: false,
        lang: 'zh',
        mutuallyExclusive: true,
        //mediaMargin: '10px 0px',//旧版参数，需要兼容
        containerId: '', //渲染外层id，用于标识多媒体，投影端同步使用
        returnInstances: false, //是否作为实例返回，而不保存在全局变量中
        mediaPreload: true, //多媒体是否预加载
        index: null, //外部传入的索引值
        style: '', //容器样式
        _onEnd: null, //私有的事件结束监听，不影响全局的事件监听，外部不得调用
        _onPlay: null,
        img: {
            render: false,
            renderUI: true,
            renderImmediately: false, //不立即加载
            width: 0,
            height: 0,
            src: ''
        },
        video: {
            render: true,
            width: 0,
            height: 0,
            renderUI: true,
            supportFullscreen: true,
            showPlayBtnInVideo: false,
            showPlayBtnInVideo: false,
            showFullscreenBtn: false
        },
        audio: {
            render: true,
            width: 0,
            height: 0,
            renderUI: true
        },
        onPlay: null,
        onPause: null,
        onEnd: null,
        onSeek: null,
        onVolumeChange: null,
        onTimeUpdate: null,
        onFullScreenChange: null
    };
    var mediaArry = ['audio', 'video', 'img'];

    var extendOption = function (option, eventHanlder) {
        //渲染的多媒体资源
        option = option || {};
        var imgOption = __Q.extend({}, DefaultOption.img, option.img || {});
        var videoOption = __Q.extend({}, DefaultOption.video, option.video || {});
        var audioOption = __Q.extend({}, DefaultOption.audio, option.audio || {});

        var option = __Q.extend({}, DefaultOption, option || {}, eventHanlder);
        option.img = imgOption;
        option.video = videoOption;
        option.audio = audioOption;
        //合并样式
        if (option.mediaMargin) {
            option.style += ';margin:' + option.mediaMargin;
        }
        return option;
    };

    var renderAudioVideo = function ($media, type, option) {
        var $div = __Q(document.createElement("div"));
        $div.attr('style', option.style);
        $div.addClass('qp_media');
        $div.attr('id', 'qp-media');

        $media.before($div.get(0));
        $div.appendChild($media.get(0));

        option.renderUI = option[type].renderUI;

        $div.attr('data-id', option.dataId);
        $div[type + 'player'](option);
        $div.attr('data-media', option.mediaId);

        return {
            dom: $div,
            instance: $div.data('my.mediaplayer')
        };
    }

    window.NDMediaPlayer = {
        _$medias: {}, //{data-media|data-id:{data}}
        _eventHandler: {
            play: _emptyFunc,
            mutuallyExclusivePlay: mutuallyExclusivePlay,
            pause: _emptyFunc,
            ended: _emptyFunc,
            timeupdate: _emptyFunc,
            seeked: _emptyFunc,
            volumeChange: _emptyFunc,
            fullScreenChange: _emptyFunc
        },
        _getMedia: function (mediaType, index) {
            var that = this;
            var mediaId = mediaType + '-' + index;
            for (var key in this._$medias) {
                if (that._getKeyMedia(key) === mediaId) {
                    var $media = this._$medias[key];
                    return $media;
                }
            }
            return null;

        },
        _getKey: function ($renderBody) {
            return $renderBody.attr('data-media') + '|' + $renderBody.attr('data-id');
        },
        _getKeyId: function (key) {
            return key.split('|')[1];
        },
        _getKeyMedia: function (key) {
            return key.split('|')[0];
        },
        _getKeyType: function (key) {
            return key.split('-')[0];
        },
        renderToTarget: function (mediaEle, targetEle, option) {
            var containerEle = document.createElement('div');
            containerEle.appendChild(mediaEle);

            NDMediaPlayer.render(containerEle, option);
            targetEle.appendChild(containerEle.childNodes[0]);
        },
        renderMediaEle: function (mediaEle, option) {
            var containerEle = document.createElement('div');
            var $containerEle = __Q(containerEle);
            __Q(mediaEle).before(containerEle);
            $containerEle.appendChild(mediaEle);
            NDMediaPlayer.render(containerEle, option);
            $containerEle.before(containerEle.childNodes[0]);
            $containerEle.remove();
        },
        _clear: function (rkey) {
            var that = this;
            if (that._$medias[rkey]) {
                var mediaPlayer = that._$medias[rkey].data('my.mediaplayer');
                if (mediaPlayer) {
                    mediaPlayer.destroy();
                }
                that._$medias[rkey].data('my.mediaplayer', null);
                delete that._$medias[rkey];
            }
        },
        setLoggerLevel: function (level) {
            __Q.logger.setLevel(level);
            imageviewer.setLoggerLevel(level);
        },
        /**
         * 销毁内存对象,并解绑事件
         * @param obj id或view对象。不传直接销毁dom不存在的内存对象
         */
        destroy: function (obj) {
            var that = this;

            //解绑事件
            for (var key in that._eventHandler) {
                if (key !== 'mutuallyExclusivePlay') {
                    that._eventHandler[key] = _emptyFunc;
                }
            }

            //清除指定容器内的对象
            if (arguments.length > 0) {
                var type = typeof obj;
                var $view = null;
                if (type === 'string') {
                    $view = __Q('#' + obj);
                } else if (type === 'object') {
                    if ((typeof jQuery !== typeof undefined) && (obj instanceof jQuery)) {
                        $view = __Q(obj[0]);
                    } else {
                        $view = __Q(obj);
                    }
                }
                if ($view.length === 0) {
                    return;
                }
                var $renderBodys = $view.find('.qp_media');
                for (var i = 0; i < $renderBodys.length; i++) {
                    var rkey = that._getKey(__Q($renderBodys.get(i)));
                    that._clear(rkey);
                }
            } else {
                //删除不存在dom内的缓存对象
                for (var mediakey in that._$medias) {
                    if (!document.querySelector('[data-id="' + that._getKeyId(mediakey) + '"]')) {
                        that._clear(mediakey);
                    }
                }
            }
        },
        reset: function () {
            for (var mediakey in this._$medias) {
                if (this._$medias[mediakey]) {
                    var mediaPlayer = this._$medias[mediakey].data('my.mediaplayer');
                    if (mediaPlayer && mediaPlayer.reset) {
                        mediaPlayer.reset();
                    }
                }
            }
        },
        setLock: function (lock, view) {
            if (view) {
                var type = typeof view;
                var $view = null;
                if (type === 'string') {
                    $view = __Q('#' + view);
                } else if (type === 'object') {
                    if ((typeof jQuery !== typeof undefined) && (view instanceof jQuery)) {
                        $view = __Q(view[0]);
                    } else {
                        $view = __Q(view);
                    }
                }
                if ($view.length === 0) {
                    return;
                }
                var $renderBodys = $view.find('.qp_media');
                for (var i = 0; i < $renderBodys.length; i++) {
                    var rkey = this._getKey(__Q($renderBodys.get(i)));
                    if (this._$medias[rkey]) {
                        var mediaPlayer = this._$medias[rkey].data('my.mediaplayer');
                        if (mediaPlayer && mediaPlayer.setLock) {
                            mediaPlayer.setLock(lock);
                        }
                    }
                }
            } else {
                for (var mediakey in this._$medias) {
                    if (this._$medias[mediakey]) {
                        var mediaPlayer = this._$medias[mediakey].data('my.mediaplayer');
                        if (mediaPlayer && mediaPlayer.setLock) {
                            mediaPlayer.setLock(lock);
                        }
                    }
                }
            }
        },
        render: function ($view, option) {


            var that = this;

            //删除缓存
            for (var key in that._$medias) {
                var mediaObj = that._$medias[key].data('my.mediaplayer');
                if (mediaObj && mediaObj.getView && mediaObj.getView()) {
                    if (!mediaObj.getView().parentNode) {
                        that._clear(key);
                    }
                } else if (!document.querySelector('[data-id="' + that._getKeyId(key) + '"]')) {
                    that._clear(key);
                }
            }

            var option = extendOption(option, {
                eventHandler: that._eventHandler
            });

            //渲染的多媒体资源
            var instances = {};


            var $medias = {};
            var container = $view.length > 0 ? $view[0] : $view;
            var mediaReg = /^img|video|audio$/i;
            if (container.nodeName && mediaReg.test(container.nodeName)) {
                $medias[container.nodeName.toLocaleLowerCase()] = [__Q(container)];
            } else {
                for (var i = 0, l = mediaArry.length; i < l; i++) {
                    $medias[mediaArry[i]] = __Q(container).find(mediaArry[i]);
                }
            }

            for (var type in $medias) {
                if (!$medias.hasOwnProperty(type)) {
                    continue;
                }
                $medias[type].each(function (index) {
                    if (!option[type].render) {
                        return;
                    }

                    var isImg = type === 'img',
                        $media = __Q(this),
                        $renderBody = $media.closest('.qp_media');

                    //已经渲染过，不进行二次渲染
                    if ($renderBody && $renderBody.length > 0 && $renderBody.get(0)) {
                        return;
                    }



                    var newOption = {};
                    //外部有传入index时，使用外部的索引
                    if (typeof option.index == 'undefined' || option.index == null) {
                        newOption = __Q.extend({}, option, {
                            index: option.containerId + '-' + index
                        });
                    } else {
                        newOption = __Q.extend({}, option);
                        newOption.index = newOption.containerId + '-' + newOption.index;
                    }

                    newOption.dataId = __Q.utils.getRandomId('media');
                    newOption.mediaId = type + '-' + newOption.index;

                    var instance = null,
                        key = newOption.mediaId + '|' + newOption.dataId

                    if (isImg) {
                        var imgOption = __Q.extend({}, option.img, {
                            lang: option.lang,
                            eventHandler: option.eventHandler,
                            onFullScreenChange: option.onFullScreenChange
                        });

                        $media[type + 'player'](imgOption);
                        instance = $media.data('my.mediaplayer');
                        if (instance) {
                            instance.render();
                        }
                        var $insView = __Q(instance.getView())
                        $insView.addClass('qp_media')

                        $insView.attr('data-id', newOption.dataId);
                        $insView.attr('data-media', type + '-' + newOption.index);

                        that._$medias[key] = $media;
                    } else {
                        var renderResult = renderAudioVideo($media, type, newOption);
                        instance = renderResult.instance;
                        //存储到全局
                        that._$medias[key] = renderResult.dom;
                    }

                    if (instance) {
                        instance.setLock(option.lock);
                    }

                    //返回实例
                    if (option.returnInstances) {
                        instances[key] = instance;
                    }


                });
            }

            if (option.returnInstances) {
                return instances;
            }
        },
        mediaOnStart: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.play = callback;
            }
        },
        mediaOnPause: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.pause = callback;
            }
        },
        mediaOnEnded: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.ended = callback;
            }
        },
        mediaOnTimeupdate: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.timeupdate = callback;
            }
        },
        mediaOnSeeked: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.seeked = callback;
            }
        },
        mediaOnVolumeChange: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.volumeChange = callback;
            }
        },
        getMedia: function (key) {
            if (key) {
                var $media = this._$medias[key];
                return $media;
            } else {
                return this._$medias;
            }
        },
        mediaPlay: function (mediaType, index) {
            var $media = this._getMedia(mediaType, index);
            if ($media && $media.get(0)) {
                $media.data('my.mediaplayer').play();
            }
        },
        mediaPause: function (mediaType, index) {
            var $media = this._getMedia(mediaType, index);
            if ($media && $media.get(0)) {
                $media.data('my.mediaplayer').pause();
            }
        },
        mediaSkip: function (mediaType, index, seeked) {
            var $media = this._getMedia(mediaType, index).find(mediaType);
            if ($media && $media.get(0)) {
                $media.get(0).currentTime = seeked == 0 ? 0.01 : seeked;
            }
        },
        mediaVolumeChange: function (mediaType, index, volume, diaplay) {
            var $media = this._getMedia(mediaType, index);
            if ($media && $media.get(0)) {
                $media.data('my.mediaplayer').changeVolume(volume, diaplay);
            }
        },
        mediaPauseAll: function (obj) {
            var that = this;
            if (typeof obj !== typeof undefined) {
                var type = typeof obj;
                var $view = null;
                if (type === 'string') {
                    $view = __Q('#' + obj);
                } else if (type === 'object') {
                    if ((typeof jQuery !== typeof undefined) && (obj instanceof jQuery)) {
                        $view = __Q(obj[0]);
                    } else {
                        $view = __Q(obj);
                    }
                }
                if ($view.length === 0) {
                    return;
                }
                var $renderBodys = $view.find('.qp_media');
                for (var i = 0; i < $renderBodys.length; i++) {
                    var rkey = that._getKey(__Q($renderBodys.get(i)));
                    if (that._$medias[rkey]) {
                        var mediaPlayer = that._$medias[rkey].data('my.mediaplayer');
                        if (mediaPlayer && mediaPlayer.pause) {
                            mediaPlayer.pause();
                        }
                    }
                }
            } else {
                for (var key in that._$medias) {
                    var $media = that._$medias[key];
                    if ($media && $media.get(0) && $media.data('my.mediaplayer') && $media.data('my.mediaplayer').pause) {
                        $media.data('my.mediaplayer').pause();
                    }
                }
            }
        },
        mediaOnFullScreenChange: function (callback) {
            if (typeof callback === 'function') {
                this._eventHandler.fullScreenChange = callback;
            }
        },
        Image: {
            create: function (img, options) {
                return ImagePlayer.Image.create(img, options);
            }
        },
        ImageViewer: {
            create: function (options) {
                return ImagePlayer.Viewer.create(options);
            }
        }
    }
})(window, __Q, imageviewer);
/**
 * Created by Administrator on 2015/12/17.
 */

(function (window, __Q) {

    //PPT渲染相关API
    window.NDMediaPlayer.PPTMediaRender = {
        videoZIndex: 2,
        mutuallyExclusive: false,
        renderVideoImg: function (ele) {
            var imgSrc = '';
            var imgEle = ele.previousElementSibling;
            if (imgEle) {
                imgEle.style.display = "none";
                imgSrc = imgEle.getAttribute('src');
            }
            if (ele.parentNode && ele.parentNode.parentNode) {
                ele.parentNode.parentNode.setAttribute("onclick", '');
                ele.parentNode.parentNode.setAttribute("onmouseout", '');
                ele.parentNode.parentNode.setAttribute("onmouseover", '');
            }
            return imgSrc;
        },
        mediaRenderComplete: function () {
            __Q(document).bind("click", function (e) {
                var $closest = __Q(e.target).closest(".qp-media-box");
                if (!$closest || $closest.length === 0) {
                    //隐藏音量控制条
                    var $medias = window.NDMediaPlayer.getMedia();
                    for (var key in $medias) {
                        if ($medias[key].data('my.mediaplayer')) {
                            $medias[key].data('my.mediaplayer').hideVolumeControl();
                        }
                    }
                }
            });
            if (window.parent && window.parent.PPTMediaPlayer && window.parent.PPTMediaPlayer.renderMediaComplete) {
                window.parent.PPTMediaPlayer.renderMediaComplete(window.NDMediaPlayer);
            }
        },
        renderVideo: function (videoEle, containerEle, index, poster) {
            videoEle.setAttribute('poster', poster);
            window.NDMediaPlayer.renderToTarget(videoEle, containerEle, {
                onlyRender: false,
                autoAdaptSize: true,
                mutuallyExclusive: NDMediaPlayer.PPTMediaRender.mutuallyExclusive,
                mediaMargin: '0px',
                audio:{
                    render:false
                },
                video: {
                    showPlayBtnInVideo: false,
                    supportFullscreen:false
                },
                index: index,
                _onPlay: function () {
                    if (NDMediaPlayer.PPTMediaRender.mutuallyExclusive) {
                        var $medias = window.NDMediaPlayer.getMedia();
                        for (var key in $medias) {
                            if (window.NDMediaPlayer._getKeyType(key) === 'audio') {
                                $medias[key].hide();
                            }
                        }
                    }
                }
            });


        },
        renderAudio: function (audioEle, containerEle, index) {
            var zIndexCls = 'qp_media_ppt_zindex';
            window.NDMediaPlayer.renderToTarget(audioEle, containerEle, {
                    onlyRender: false,
                    autoAdaptSize: true,
                    mutuallyExclusive: NDMediaPlayer.PPTMediaRender.mutuallyExclusive,
                    index: index,
                    style: 'display:none;z-index:' + NDMediaPlayer.PPTMediaRender.videoZIndex,
                    mediaMargin: '0px',
                    video: {
                        render: false
                    },
                    audio: {
                        width: 220,
                        height: 80
                    },
                    _onEnd: function (o) {
                        var $media = window.NDMediaPlayer._getMedia(o.mediaType, o.index);
                        if ($media) {
                            $media.hide();
                            if ($media.get(0).parentNode) {
                                __Q($media.get(0).parentNode).css('zIndex','');
                            }
                        }
                    },
                    _onPlay: function (o) {
                        if (NDMediaPlayer.PPTMediaRender.mutuallyExclusive) {
                            var $medias = NDMediaPlayer.getMedia();
                            for (var key in $medias) {
                                if (NDMediaPlayer._getKeyMedia(key) !== (o.mediaType + '-' + o.index) && NDMediaPlayer._getKeyType(key) === 'audio') {
                                    $medias[key].hide();
                                    if ($medias[key].parentNode) {
                                        __Q($medias[key].parentNode).css('zIndex','');
                                    }
                                }
                            }
                        }
                    }
                }
            );

            var $img = __Q(containerEle).find('img');
            if ($img && $img.length > 0 && $img.get(0).parentNode) {
                (function ($img) {
                    var $pNode = __Q($img.get(0).parentNode);

                    $pNode.attr('onclick', '');
                    $pNode.attr("onmouseout", '');
                    $pNode.attr("onmouseover", '');
                    $pNode.addClass($pNode.attr('id'));
                    var on = 'on';
                    var currentKey = '';
                    if ($img.get(0).nextElementSibling) {
                        currentKey = NDMediaPlayer._getKey(__Q($img.get(0).nextElementSibling));
                    }
                    if (!currentKey) {
                        return;
                    }
                    var $m = window.NDMediaPlayer.getMedia(currentKey);
                    var mOper = $m.data('my.mediaplayer');
                    var $contentHolder = __Q('#contentHolder');
                    var $audioView = $m.find('.qp-media-box');

                    var located = false;
                    var locat = function () {
                        if (located) {
                            return;
                        }
                        located = true;
                        var pNodeOffset = $pNode.offset(), holderOffset = $contentHolder.offset(),
                            scale = mOper.getScale(),
                            audioWidth = $audioView.width(), audioHeight = $audioView.height(),
                            pNodeWidth = $pNode.width(), pNodeHeight = $pNode.height();

                        var left = pNodeOffset.left - (scale * audioWidth / 2 - scale * pNodeWidth / 2) - holderOffset.left;
                        var right = pNodeOffset.left + scale * audioWidth / 2 + scale * pNodeWidth / 2 - (holderOffset.left + $contentHolder.width());
                        var bottom = pNodeOffset.top + pNodeHeight * scale + mOper.getScale() * audioHeight - (holderOffset.top + $contentHolder.height());
                        //scale内部按原大小处理，不需要缩放

                        if (left < 0) {
                            $m.css('left', -parseInt(audioWidth / 2 - pNodeWidth / 2 + left / scale) + "px");
                        } else if (right > 0) {
                            $m.css('left', -parseInt(audioWidth / 2 - pNodeWidth / 2 + right / scale) + "px");
                        } else {
                            $m.css('left', -parseInt(audioWidth / 2 - pNodeWidth / 2) + "px");
                        }
                        if (bottom > 0) {
                            $m.css('bottom', pNodeHeight / (__Q.support.touch ? 1 : 1.5) + "px");
                        } else {
                            $m.css('top', pNodeHeight / (__Q.support.touch ? 1 : 1.5) + "px");
                        }
                    };

                    $img[on]('click', '', function () {
                        if (mOper.isPlaying()) {
                            mOper.pause();
                            $m.hide();
                            $pNode.css('zIndex','');
                        } else {
                            mOper.play();
                            $m.show();
                            //修复transform引起的zIndex层级覆盖问题
                            $pNode.css('zIndex', NDMediaPlayer.PPTMediaRender.videoZIndex++);
                            locat();
                            if (NDMediaPlayer.PPTMediaRender.mutuallyExclusive) {
                                var $medias = window.NDMediaPlayer.getMedia();
                                for (var key in $medias) {
                                    if (key !== currentKey && NDMediaPlayer._getKeyType(key) === 'audio') {
                                        $medias[key].hide();
                                        $pNode.css('zIndex','');
                                        $medias[key].data('my.mediaplayer').pause();
                                    }
                                }
                            }
                        }
                    });
                    if (!__Q.support.touch) {
                        $img[on]('mouseover', '', function (e) {
                            if (__Q.event.checkHover(e, this)) {
                                $m.show();
                                $pNode.css('zIndex', NDMediaPlayer.PPTMediaRender.videoZIndex++);
                                $m.css('zIndex', NDMediaPlayer.PPTMediaRender.videoZIndex++);
                                locat();
                            }
                        });
                    }
                    $pNode[on]('mouseout', '', function (e) {
                        if (__Q.event.checkHover(e, this)) {
                            if (!mOper.isPlaying()) {
                                $m.hide();
                                //$pNode.removeClass(zIndexCls);
                                $pNode.css('zIndex','');
                            }
                        }
                    });

                    __Q(document).bind("click", function (e) {
                        var $closest = __Q(e.target).closest("." + $pNode.attr('id'));
                        if (!$closest || $closest.length === 0) {
                            if (!mOper.isPlaying()) {
                                $m.hide();
                                //$pNode.removeClass(zIndexCls);
                                $pNode.css('zIndex','');
                            }
                        }
                    });
                })
                ($img);
            }
        }
    };

})(window, __Q);
})(window,document)