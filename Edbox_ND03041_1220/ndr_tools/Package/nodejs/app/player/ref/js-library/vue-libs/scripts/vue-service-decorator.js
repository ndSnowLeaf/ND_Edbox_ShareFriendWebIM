/**
 * VueServiceDecorator v1.0.0
 * (c) 2017 Jorson WHY
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd && false ? define(factory) :
            (global.VueServiceDecorator = factory());
}(this, (function () { 'use strict';

    var vueClassComponent = window.VueClassComponent ? window.VueClassComponent : undefined;
    var vueX = window.Vuex ? window.Vuex : undefined;

    function namespace(namespace, helper) {
        function namespacedHelper(a, b) {
            if (typeof b === 'string') {
                var key = b;
                var proto = a;
                return helper(key, {namespace: namespace})(proto, key);
            }
            var type = a;
            var options = merge(b || {}, {namespace: namespace});
            return helper(type, options);
        }

        return namespacedHelper;
    }

    function createBindingHelper(bindTo, mapFn) {
        function makeDecorator(map, namespace) {
            return vueClassComponent.createDecorator(function (componentOptions, key) {
                if (!componentOptions[bindTo]) {
                    componentOptions[bindTo] = {};
                }
                var mapObject = (_a = {}, _a[key] = map, _a);
                componentOptions[bindTo][key] = namespace !== undefined
                    ? mapFn(namespace, mapObject)[key]
                    : mapFn(mapObject)[key];
                var _a;
            });
        }

        function helper(a, b) {
            if (typeof b === 'string') {
                var key = b;
                var proto = a;
                return makeDecorator(key, undefined)(proto, key);
            }
            var namespace = extractNamespace(b);
            var type = a;
            return makeDecorator(type, namespace);
        }

        return helper;
    }

    function extractNamespace(options) {
        var n = options && options.namespace;
        if (typeof n !== 'string') {
            return undefined;
        }
        if (n[n.length - 1] !== '/') {
            return n + '/';
        }
        return n;
    }

    function merge(a, b) {
        var res = {};
        [a, b].forEach(function (obj) {
            Object.keys(obj).forEach(function (key) {
                res[key] = obj[key];
            });
        });
        return res;
    }

    function autoWired(options) {
        if (options.clazz == undefined && options.filter == undefined) {
            throw Error("clazz and filter are both NULL in options!");
        }
        var namespace = options.namespace;
        var clazz = options.clazz;
        var filter = options.filter;
        return function (target, propertyKey, descriptor) {
            if (target["__ModuleServices"] === undefined) {
                target["__ModuleServices"] = {};
            }
            if (window["__ServiceComponent"] && window["__ServiceComponent"][namespace]) {
                if (target["__ModuleServices"][propertyKey] === undefined) {
                    if (clazz != undefined) {
                        target["__ModuleServices"][propertyKey] = {
                            hasFilter: false,
                            clazz: window["__ServiceComponent"][namespace][clazz]
                        };
                    }
                    else if (filter != undefined) {
                        target["__ModuleServices"][propertyKey] = {
                            hasFilter: true,
                            filter: target[filter],
                            namespace: namespace
                        };
                    }
                }
            }
        };
    }

    function watch(path, options) {
        if (options === void 0) { options = {}; }
        var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
        return VueClassComponent.createDecorator(function (componentOptions, handler) {
            if (typeof componentOptions.watch !== 'object') {
                componentOptions.watch = Object.create(null);
            }
            componentOptions.watch[path] = { handler: handler, deep: deep, immediate: immediate };
        });
    }

    function makePropDecorator(options) {
        if (options === void 0) { options = {}; }
        return function (target, key) {
            if (!Array.isArray(options) && typeof options.type === 'undefined') {
                if (typeof Reflect === "object" && typeof Reflect.metadata === "function") {
                    options.type = Reflect.getMetadata('design:type', target, key);
                }
                else {
                    options.type = null;
                }
            }
            VueClassComponent.createDecorator(function (componentOptions, k) {
                (componentOptions.props || (componentOptions.props = {}))[k] = options;
            })(target, key);
        };
    }

    function prop(options) {
        if (options === void 0) { options = {}; }
        if (options instanceof Vue) {
            return makePropDecorator()(options, key);
        }
        else {
            return makePropDecorator(options);
        }
    }

    function inject(key) {
        return VueClassComponent.createDecorator(function (componentOptions, k) {
            if (typeof componentOptions.inject === 'undefined') {
                componentOptions.inject = {};
            }
            if (!Array.isArray(componentOptions.inject)) {
                componentOptions.inject[k] = key || k;
            }
        });
    }

    function model(event) {
        return VueClassComponent.createDecorator(function (componentOptions, prop) {
            componentOptions.model = { prop: prop, event: event };
        });
    }

    var State = createBindingHelper('computed', vueX.mapState);
    var Getter = createBindingHelper('computed', vueX.mapGetters);
    var Action = createBindingHelper('methods', vueX.mapActions);
    var Mutation = createBindingHelper('methods', vueX.mapMutations);

    return {
        version: '1.0.0',

        namespace: namespace,
        autoWired: autoWired,
        watch: watch,
        prop: prop,
        inject: inject,
        model: model,

        State: State,
        Getter: Getter,
        Action: Action,
        Mutation: Mutation
    };

})));
