/**
 * vuex v1.0.0
 * (c) 2017 Jorson WHY
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd && false ? define(factory) :
    (global.VueService = factory());
}(this, (function () { 'use strict';

var applyMixin = function (Vue) {
    var version = Number(Vue.version.split('.')[0]);
    if (version >= 2) {
        var usesInit = Vue.config._lifecycleHooks.indexOf("init") > -1;
        Vue.mixin(usesInit ? {init: vueServiceXInit} : {beforeCreate: vueServiceXInit});
    } else {
        throw Error("Not Support vue 1.x");
    }
};

function vueServiceXInit() {
    var options = this.$options;
    if(options.service) {
        this.$service = options.service;
    } else if(options.parent && options.parent.$service) {
        this.$service = options.parent.$service;
    }
}

function assert (condition, msg) {
    if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Vue;

var ServiceX = function ServiceX(options) {
    if ( options === void 0 ) options = {};

    assert(Vue, "must call Vue.use(ServiceX) before creating a store instance.");
    var services = options.services; if ( services === void 0 ) services = {};
    var strict = options.strict; if ( strict === void 0 ) strict = false;

    this.strict = strict;
    resetServiceVM(this, services);
};

var prototypeAccessors = { services: {} };

prototypeAccessors.services.get = function () {
    return this._vm.$data.services
};

prototypeAccessors.services.set = function (s) {
    assert(false, "Property service is Readonly!");
};

ServiceX.prototype.registerService = function registerService (_key, _service) {
    if(this.services[_key] == undefined) {
        if(_service["setContext"] && _service["created"] && _service["destroy"]) {
            this.services[_key] = _service;
            resetServiceVM(this, this.services);
        }
    }
};

ServiceX.prototype.unregisterService = function unregisterService (_key) {
    console.log("call unregister service:", _key);
};

Object.defineProperties( ServiceX.prototype, prototypeAccessors );

function resetServiceVM(serviceX, services) {
    var oldVm = serviceX._vm;
    var silent = Vue.config.silent;
    Vue.config.silent = true;
    serviceX._vm = new Vue({
        data: {services: services}
    });
    Vue.config.silent = silent;
    if (serviceX.strict) {
        enableStrictMode(serviceX);
    }
    if (oldVm) {
        Vue.nextTick(function () { return oldVm.$destroy(); });
    }
}

function enableStrictMode(serviceX) {
    serviceX._vm.$watch('serviceX', function () {
        assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }, {deep: true, sync: true});
}

function install(_Vue) {
    if (Vue) {
        console.error("[vue-servicex] already installed. Vue.use(vueServicex) should be called only once");
        return;
    }
    Vue = _Vue;
    applyMixin(Vue);
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

var index = {ServiceX: ServiceX, install: install, version: '1.0.0'};

return index;

})));
