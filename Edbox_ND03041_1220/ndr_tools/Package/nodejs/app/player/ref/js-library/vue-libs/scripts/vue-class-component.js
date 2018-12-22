/**
  * vue-class-component v4.4.0
  * (c) 2015-2016 Evan You
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
    typeof define === 'function' && define.amd && false ? define(['exports', 'vue'], factory) :
    (factory((global.VueClassComponent = global.VueClassComponent || {}),global.Vue));
}(this, (function (exports,Vue) { 'use strict';

function createDecorator(factory) {
    return function (_, key, index) {
        if (typeof index !== 'number') {
            index = undefined;
        }
        $decoratorQueue.push(function (options) { return factory(options, key, index); });
    };
}
function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
}

function collectDataFromConstructor(vm, Component) {
    Component.prototype._init = function () {
        var _this = this;
        Object.getOwnPropertyNames(vm).forEach(function (key) {
            Object.defineProperty(_this, key, {
                get: function () { return vm[key]; },
                set: function (value) { return vm[key] = value; }
            });
        });
    };
    var data = new Component();
    var plainData = {};
    Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined) {
            plainData[key] = data[key];
        }
    });
    {
        if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
            warn('Component class must inherit Vue or its descendant class ' +
                'when class property is used.');
        }
    }
    return plainData;
}

var $internalHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render'
];
var $decoratorQueue = [];
function componentFactory(Component, options) {
    if (options === void 0) { options = {}; }
    options.name = options.name || Component._componentTag;
    var proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (typeof descriptor.value === 'function') {
            (options.methods || (options.methods = {}))[key] = descriptor.value;
        }
        else if (descriptor.get || descriptor.set) {
            (options.computed || (options.computed = {}))[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
    (options.mixins || (options.mixins = [])).push({
        data: function () {
            return collectDataFromConstructor(this, Component);
        }
    });
    $decoratorQueue.forEach(function (fn) { return fn(options); });
    $decoratorQueue = [];
    var superProto = Object.getPrototypeOf(Component.prototype);
    var Super = superProto instanceof Vue
        ? superProto.constructor
        : Vue;
    return Super.extend(options);
}

function Component(options) {
    if (typeof options === 'function') {
        return componentFactory(options);
    }
    return function (Component) {
        return componentFactory(Component, options);
    };
}
(function (Component) {
    function registerHooks(keys) {
        $internalHooks.push.apply($internalHooks, keys);
    }
    Component.registerHooks = registerHooks;
})(Component || (Component = {}));
var Component$1 = Component;

exports['default'] = Component$1;
exports.createDecorator = createDecorator;
exports.MidwareComponent = function MidwareComponent(options) {
    return function (target) {
        var name, depends = [], config;
        if (typeof options.key === 'string') {
            name = options.key;
            delete options.key;
        } else {
            console.error('MidwareComponent: options lacks of key field');
            return;
        }
        if (options.components) {
            for (var key in options.components) {
                var component = options.components[key];
                if (typeof component === 'string') {
                    options.components[key] = depends.length;
                    depends.push(component);
                }
            }
        }
        if (options.public === false) {
            config = { visibility: 'private', depends: depends };
        } else {
            config = depends;
        }
        delete options.public;
        Midware.componentDefine.call(Midware, name, config, function () {
            if (!!arguments.length) {
                for (var key in options.components) {
                    if (typeof options.components[key] === 'number') {
                        options.components[key] = arguments[options.components[key]];
                    }
                }
            }
            var storeTypes = target.StoreTypes;
            var result = Component$1(options)(target);
            if (storeTypes) {
                result.StoreTypes = storeTypes;
            }
            return result;
        });

        // 返回可直接引用的异步组件
        return function () {
            return new Promise(function (resolve) {
                Midware.componentRequire([name]).then(function (components) { resolve(components[name]); });
            });
        };
    };
}

Object.defineProperty(exports, '__esModule', { value: true });

})));