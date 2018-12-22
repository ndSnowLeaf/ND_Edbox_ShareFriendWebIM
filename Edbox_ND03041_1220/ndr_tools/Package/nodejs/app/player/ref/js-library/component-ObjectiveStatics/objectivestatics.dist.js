/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 50);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(28)('wks')
  , uid        = __webpack_require__(30)
  , Symbol     = __webpack_require__(2).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(15)
  , createDesc = __webpack_require__(26);
module.exports = __webpack_require__(8) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(51), __esModule: true };

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(13)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(52), __esModule: true };

/***/ }),
/* 12 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(7)
  , IE8_DOM_DEFINE = __webpack_require__(59)
  , toPrimitive    = __webpack_require__(73)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(8) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(28)('keys')
  , uid    = __webpack_require__(30);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(60)
  , defined = __webpack_require__(12);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(38),
  /* template */
  __webpack_require__(95),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\PopUpWindow\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-63d08983", Component.options)
  } else {
    hotAPI.reload("data-v-63d08983", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 20 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14)
  , document = __webpack_require__(2).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , core      = __webpack_require__(4)
  , ctx       = __webpack_require__(57)
  , hide      = __webpack_require__(5)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(63)
  , $export        = __webpack_require__(23)
  , redefine       = __webpack_require__(69)
  , hide           = __webpack_require__(5)
  , has            = __webpack_require__(9)
  , Iterators      = __webpack_require__(10)
  , $iterCreate    = __webpack_require__(61)
  , setToStringTag = __webpack_require__(27)
  , getPrototypeOf = __webpack_require__(66)
  , ITERATOR       = __webpack_require__(3)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(67)
  , enumBugKeys = __webpack_require__(22);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(15).f
  , has = __webpack_require__(9)
  , TAG = __webpack_require__(3)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(12);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(36),
  /* template */
  __webpack_require__(96),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\PercentageChar\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6d259b1f", Component.options)
  } else {
    hotAPI.reload("data-v-6d259b1f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(37),
  /* template */
  __webpack_require__(92),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\PieChart\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-358f9f7e", Component.options)
  } else {
    hotAPI.reload("data-v-358f9f7e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(47),
  /* template */
  __webpack_require__(101),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\RankingList\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ff6174ca", Component.options)
  } else {
    hotAPI.reload("data-v-ff6174ca", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(48),
  /* template */
  __webpack_require__(94),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\Timer\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-511bceac", Component.options)
  } else {
    hotAPI.reload("data-v-511bceac", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(49),
  /* template */
  __webpack_require__(89),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\VerticalBarChart\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-126d64f0", Component.options)
  } else {
    hotAPI.reload("data-v-126d64f0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__PopUpWindow_index__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__PopUpWindow_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__PopUpWindow_index__);




/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'home',
  data: function data() {
    return {
      title: 'B 类统计',
      timestamp: new Date().getTime() + '',
      isShowPopUpWindow: false,
      ppWData: {}
    };
  },

  components: { popUpWindow: __WEBPACK_IMPORTED_MODULE_2__PopUpWindow_index___default.a },
  methods: {
    buildAnswerDetailDialogData: function buildAnswerDetailDialogData(key, type) {
      var convertedData = this.data.value.convertedData;
      var itemKeys = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default()(convertedData.item_key);
      var stuAnswerStatKeys = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default()(convertedData.stuAnswerStat);
      var stuList = {
        rightStu: [],
        wrongStu: [],
        unfinishedStu: []
      };
      var itemKey = void 0;
      var stuAnswerStat = void 0;

      if (key === 'unfinished') {
        stuList.rightStu = [];
        stuList.wrongStu = [];
        stuList.unfinishedStu = __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.extend(true, [], convertedData.unfinishedUserIds);
      } else {
        if (type === 'horizontal') {
          itemKey = convertedData.item_key[itemKeys[0]];
          stuAnswerStat = convertedData.stuAnswerStat[stuAnswerStatKeys[0]];
        } else if (type === 'vertical') {
          itemKey = convertedData.item_key[itemKeys[1]];
          stuAnswerStat = convertedData.stuAnswerStat[stuAnswerStatKeys[1]];
        } else {
          itemKey = convertedData.item_key;
          stuAnswerStat = convertedData.stuAnswerStat;
        }
      }

      // 规则校验
      if (key !== 'unfinished' && itemKey && stuAnswerStat && __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.isArray(itemKey) && __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.isArray(stuAnswerStat) && itemKey.length !== stuAnswerStat.length) {
        return;
      }

      if (key === 'unfinished') {
        stuList.unfinishedStu = __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.extend(true, [], convertedData.unfinishedUserIds);
      } else {
        // 处理回答正确，错误
        if (stuAnswerStat) {
          if (__WEBPACK_IMPORTED_MODULE_1_jquery___default.a.isArray(stuAnswerStat)) {
            for (var i = 0; i < stuAnswerStat.length; i++) {
              if (stuAnswerStat[i].ref_key === key) {
                stuList.rightStu = __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.extend(true, [], stuAnswerStat[i].right_userIds);
                stuList.wrongStu = __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.extend(true, [], stuAnswerStat[i].wrong_userIds);
                stuList.unfinishedStu = __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.extend(true, [], stuAnswerStat[i].unfinished_userIds);
                break;
              }
            }
          }
        }
      }

      // 数据校验
      if (key === 'unfinished') {
        if (stuList.unfinishedStu.length === 0) {
          return false;
        }
      } else if (stuList.rightStu.length === 0 && stuList.wrongStu.length === 0 && stuList.unfinishedStu.length === 0) {
        return false;
      }

      var stuMapWithId = {
        rightStu: __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.extend(true, [], stuList.rightStu),
        wrongStu: __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.extend(true, [], stuList.wrongStu),
        unfinishedStu: __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.extend(true, [], stuList.unfinishedStu)

        // 学号和姓名映射
      };if (this.data.value.currentStudents) {
        var currentStudent = this.data.value.currentStudents;
        var tmpStu, stuId, tmpIndex;
        for (var _i = 0; _i < currentStudent.length; _i++) {
          tmpStu = currentStudent[_i];
          stuId = tmpStu['studentId'];
          if ((tmpIndex = __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.inArray(stuId, stuList.rightStu)) >= 0) {
            stuList.rightStu[tmpIndex] = tmpStu['studentName'];
          } else if ((tmpIndex = __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.inArray(stuId, stuList.wrongStu)) >= 0) {
            stuList.wrongStu[tmpIndex] = tmpStu['studentName'];
          } else if ((tmpIndex = __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.inArray(stuId, stuList.unfinishedStu)) >= 0) {
            stuList.unfinishedStu[tmpIndex] = tmpStu['studentName'];
          }
        }
      }

      return {
        statisticsType: 'B',
        stuList: stuList,
        stuListWithId: stuMapWithId
      };
    },
    // 显示弹窗
    showPPW: function showPPW(key, type) {
      var data = this.buildAnswerDetailDialogData(key, type);
      if (data) {
        this.ppWData = data;
        this.timestamp = new Date().getTime() + '';
        this.isShowPopUpWindow = true;
      }
    },
    // 关闭弹窗
    closePPW: function closePPW() {
      this.isShowPopUpWindow = false;
    }
  },
  computed: {
    clickItemData: function clickItemData() {
      return this.clickitemindex;
    },
    hasUnfinishedUser: function hasUnfinishedUser() {
      var convertedData = this.data.value.convertedData;
      if (convertedData['unfinishedNum'] > 0) {
        // 如果未作答人数不为0,在尾部加上未作答项
        return true;
      }
      return false;
    },
    unfinishedData: function unfinishedData() {
      var convertedData = this.data.value.convertedData;
      if (convertedData['unfinishedNum'] > 0) {
        var unfinishedNum = convertedData['unfinishedNum'];
        var unfinishedPercent = convertedData['unfinishedNum'] > 0 ? Math.round(unfinishedNum / convertedData['submit_count'] * 100) : 0;
        return {
          unfinishedNum: unfinishedNum,
          unfinishedPercent: unfinishedPercent
        };
      }
      return {
        unfinishedNum: 0,
        unfinishedPercent: 0
      };
    },
    statistics: function statistics() {
      var convertedData = this.data.value.convertedData;
      var itemKey = void 0;
      var percent = void 0;
      if (this.questionType !== 'wordpuzzles') {
        itemKey = [];
        percent = [];
        if (convertedData.percent && convertedData.item_key && convertedData.percent instanceof Array && convertedData.percent.length === convertedData.item_key.length) {
          itemKey = convertedData['item_key'];
          percent = convertedData['percent'];
        }
        for (var i = 0; i < percent.length; ++i) {
          percent[i] = Math.round(percent[i] * 100);
        }
      } else {
        itemKey = {
          'horizontal': [],
          'vertical': []
        };
        percent = {
          'horizontal': [],
          'vertical': []
        };
        if (convertedData.percent && convertedData.item_key) {
          var itemKeys = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default()(convertedData['item_key']);
          var percentKeys = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default()(convertedData['item_key']);
          itemKey['horizontal'] = convertedData['item_key'][itemKeys[0]];
          itemKey['vertical'] = convertedData['item_key'][itemKeys[1]];
          percent['horizontal'] = convertedData['percent'][percentKeys[0]];
          percent['vertical'] = convertedData['percent'][percentKeys[1]];
          for (var _i2 = 0; _i2 < percent['horizontal'].length; ++_i2) {
            percent['horizontal'][_i2] = Math.round(percent['horizontal'][_i2] * 100);
          }
          for (var _i3 = 0; _i3 < percent['vertical'].length; ++_i3) {
            percent['vertical'][_i3] = Math.round(percent['vertical'][_i3] * 100);
          }
        }
      }
      return {
        itemKey: itemKey,
        percent: percent
      };
    },
    questionType: function questionType() {
      return this.data.value.convertedData.questionType || this.data.value.questionType;
    }
  },
  props: {
    env: {
      type: String,
      default: function _default() {
        return 'ppt';
      }
    },
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    showDetails: {
      type: Boolean,
      default: false
    },
    showCorrectAnswer: {
      type: Boolean,
      default: true
    },
    clickitemindex: {
      type: Object,
      default: {}
    },
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PopUpWindow_index__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PopUpWindow_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__PopUpWindow_index__);





var i18nPerson = '';

// svg扇形绘制过程的填充颜色
var COLORS = {
  RIGHT: '#5BBB84', // 答对
  WRONG: '#E57C5C', // 答错
  NO_ANSWER: '#949494', // 未作答
  LINE_COLOR: '#555',
  BACKGROUND: '#F8EFDE',
  CIRCLE: '#EBE2D0'
};

var createSvg = function createSvg(tag, attrs) {
  if (!document.createElementNS) {
    return;
  }
  var svgObj = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var key in attrs) {
    switch (key) {
      case 'xlink:href':
        // 文本路径添加属性特有
        svgObj.setAttributeNS('http://www.w3.org/1999/xlink', key, attrs[key]);
        break;
      default:
        svgObj.setAttribute(key, attrs[key]);
    }
  }
  return svgObj;
};

// 极坐标（数字角度）转换成直角坐标
var convertCoordinate = function convertCoordinate(r, angle, center) {
  // 数字角度转换成弧度
  var angleRadianMeasure = angle * Math.PI / 180;

  // 极坐标转换成直角坐标系
  var x = Number((Math.cos(angleRadianMeasure) * r).toFixed(2));
  var y = Number(-(Math.sin(angleRadianMeasure) * r).toFixed(2));

  // 以svg的中心为直角坐标系原点
  x = x + Number(center.x);
  y = y + Number(center.y);

  return {
    x: x,
    y: y
  };
};

/**
 * 创建扇形
 * @param sectorR 扇形半径
 * @param fromDegree 扇形起始角度
 * @param toDegree 扇形结束角度
 * @param center 扇形绘制的中心点
 * @param color 扇形绘制的颜色
 * @param value
 * @returns {*}
 */
var createSector = function createSector(sectorR, fromDegree, toDegree, center, color, value, sectorsComments) {
  // 求得扇形弧中点直角坐标
  var arcHalf = convertCoordinate(sectorR, ((Number(fromDegree) + Number(toDegree)) / 2).toFixed(1), center);

  // 计算该扇形批注折线的起点坐标
  var t = 0.3;
  arcHalf.x = t * center.x + (1 - t) * arcHalf.x;
  arcHalf.y = t * center.y + (1 - t) * arcHalf.y;

  // 以该扇形的填充颜色为KEY缓存该扇形的批注信息
  sectorsComments[color] = {
    arcHalf: arcHalf,
    name: value.name,
    num: value.num,
    percent: value.percent

    // 创建扇形svg元素
  };var sector = void 0;
  if (Math.abs(fromDegree - toDegree) >= 360) {
    // 创建svg circle对象
    sector = createSvg('circle', {
      'cx': center.x,
      'cy': center.y,
      'r': sectorR,
      'fill': color
    });
  } else {
    // 创建svg path对象
    sector = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // 计算弧的起始坐标
    var arcFrom = convertCoordinate(sectorR, fromDegree, center);

    // 计算弧的终点坐标
    var arcTo = convertCoordinate(sectorR, toDegree, center);

    // 描述d
    var sweepFlag = Math.abs(fromDegree - toDegree) > 180 ? 1 : 0;
    var descriptions = ['M', center.x, center.y, 'L', arcFrom.x, arcFrom.y, 'A', sectorR, sectorR, 0, sweepFlag, 0, arcTo.x, arcTo.y, 'z'];

    // 给path 设置属性
    sector.setAttribute('d', descriptions.join(' '));
    sector.setAttribute('fill', color);
  }

  // 设置该扇形鼠标滑过的样式为手形
  sector.style.cursor = 'pointer';

  return sector;
};

/**
 * 计算点所在直角坐标系中的象限
 * @param pos
 * @param center
 * @returns {number}
 */
var quadrant = function quadrant(pos, center) {
  // 1象限 和 x轴正方向
  if (pos.x > center.x && pos.y <= center.y) {
    return 1;
  }
  // 2象限 和 y轴正方向
  if (pos.x <= center.x && pos.y < center.y) {
    return 2;
  }
  // 3象限 和 x轴负方向
  if (pos.x < center.x && pos.y >= center.y) {
    return 3;
  }
  // 4象限 和 y轴负方向
  if (pos.x >= center.x && pos.y > center.y) {
    return 4;
  }
  if (pos.x === center.x && pos.y === center.y) {
    return 1;
  }
};

/**
 * 绘制扇形区域对应的批注信息
 * @param container
 * @param comments
 * @param center
 * @param sectorR
 */
var drawComments = function drawComments(container, comments, center, sectorR) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator___default()(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default()(comments)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      // 绘制扇形批注折线的起点
      container.appendChild(createSvg('circle', {
        'cx': comments[key].arcHalf.x,
        'cy': comments[key].arcHalf.y,
        'r': Math.ceil(sectorR / 35),
        'fill': COLORS.LINE_COLOR
      }));

      // 绘制折线
      var descriptions = void 0;
      var textStartPos = void 0;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      switch (quadrant(comments[key].arcHalf, center)) {
        case 1:
          descriptions = ['M', comments[key].arcHalf.x, comments[key].arcHalf.y, 'l', 50, -50, 'h', 360];
          textStartPos = {
            x: comments[key].arcHalf.x + 50 + 110,
            y: comments[key].arcHalf.y - 50 - 10
          };
          break;
        case 2:
          descriptions = ['M', comments[key].arcHalf.x, comments[key].arcHalf.y, 'l', -50, -50, 'h', -360];
          textStartPos = {
            x: comments[key].arcHalf.x - 50 - 360,
            y: comments[key].arcHalf.y - 50 - 10
          };
          break;
        case 3:
          descriptions = ['M', comments[key].arcHalf.x, comments[key].arcHalf.y, 'l', -50, 50, 'h', -360];
          textStartPos = {
            x: comments[key].arcHalf.x - 50 - 360,
            y: comments[key].arcHalf.y + 50 - 10
          };
          break;
        case 4:
          descriptions = ['M', comments[key].arcHalf.x, comments[key].arcHalf.y, 'l', 50, 70, 'h', 360];
          textStartPos = {
            x: comments[key].arcHalf.x + 50 + 110,
            y: comments[key].arcHalf.y + 70 - 10
          };
          break;
      }
      // 给path 设置属性
      line.setAttribute('d', descriptions.join(' '));
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke', COLORS.LINE_COLOR);
      line.setAttribute('fill', 'none');
      container.appendChild(line);

      // 创建文字
      var newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      newText.setAttributeNS(null, 'x', textStartPos.x);
      newText.setAttributeNS(null, 'y', textStartPos.y - 50);
      newText.innerHTML = '<tspan font-size="30" fill="#603300" font-weight="700">·&nbsp;</tspan>' + '<tspan fill="#603300" font-size="30" font-weight="700">' + comments[key].name + '&nbsp;&nbsp;&nbsp;&nbsp;</tspan>';
      container.appendChild(newText);

      // 创建文字
      var newText1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      newText1.setAttributeNS(null, 'x', textStartPos.x);
      newText1.setAttributeNS(null, 'y', textStartPos.y);
      newText1.innerHTML = '<tspan fill="' + key + '" font-size="42">' + comments[key].num + '</tspan>' + '<tspan fill="#867964" font-size="24">' + i18nPerson + '（' + comments[key].percent + '%）</tspan>';
      container.appendChild(newText1);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

/**
 * 计算百分比
 * @param dividend
 * @param divisor
 * @returns {Number}
 */
var calculatePercentage = function calculatePercentage(dividend, divisor) {
  return parseFloat(((dividend / divisor).toFixed(3) * 100).toFixed(1));
};

// 扇形统计组件
/* harmony default export */ __webpack_exports__["default"] = ({
  mounted: function mounted() {
    console.log('C类统计组件mounted');

    var _this = this;

    // 扇形批注的缓冲区空对象
    var sectorsComments = {};

    // 获取i18n资源
    i18nPerson = this.i18n.person;
    var $box = __WEBPACK_IMPORTED_MODULE_2_jquery___default()(this.$el).find('.judge-temporyq-body');
    $box.find('svg').remove();
    var $svg = __WEBPACK_IMPORTED_MODULE_2_jquery___default()('<svg viewBox="0 0 1200 560" style="height:100%;width: 100%;"></svg>');
    $box.prepend($svg);

    // 获取svg DOM节点
    var svg = $svg[0];

    // 设置待绘制扇形的半径
    var sectorR = 170;

    // 获取svg面板的中心位置
    var center = {
      x: 600,
      y: 310

      // 设置svg面板背景色
    };svg.style.backgroundColor = COLORS.BACKGROUND;

    // 绘制扇形图外围灰色轮廓
    svg.appendChild(createSvg('circle', {
      'cx': center.x,
      'cy': center.y,
      'r': 185,
      'fill': COLORS.CIRCLE
    }));

    // 绘制扇形统计区域
    var startAngle = 0;
    var swapAngle = void 0;
    var color = void 0;
    if (this.statisticData.length) {
      var _loop = function _loop(value) {
        if (value.num !== 0) {
          // 设置绘制扇形区域的填充颜色
          switch (value.type) {
            case 'sector_unfinished':
              color = COLORS.NO_ANSWER;
              break;
            case 'sector_wrong':
              color = COLORS.WRONG;
              break;
            case 'sector_correct':
              color = COLORS.RIGHT;
              break;
          }
          // 根据百分比计算扇形扫过的角度
          swapAngle = startAngle + value.percent / 100 * 360;
          // 绘制扇形到svg面板
          var newSector = createSector(sectorR, startAngle, swapAngle, center, color, value, sectorsComments);
          svg.appendChild(newSector);
          // 绑定该扇形区域点击事件
          newSector.onclick = function () {
            _this.showPPW(value.type);
          };
          // 为绘制下一个扇形重置起始角度
          startAngle = swapAngle;
        }
      };

      // sectorsComments = {}
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator___default()(this.statisticData), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var value = _step2.value;

          _loop(value);
        }
        // 绘制每个扇形区域的批注信息
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      drawComments(svg, sectorsComments, center, sectorR);
    }
  },
  data: function data() {
    return {
      title: 'C类统计',
      ppWData: {},
      timestamp: new Date().getTime() + '',
      isShowPopUpWindow: false
    };
  },

  methods: {
    buildAnswerDetailDialogData: function buildAnswerDetailDialogData(key) {
      var convertedData = this.data.value.convertedData;
      // 获取学生数据
      var stuList = {
        rightStu: convertedData.correctUsers || [],
        wrongStu: convertedData.wrongUsers || [],
        unfinishedStu: convertedData.unfinishedUsers || []
      };
      var targetStuList = [];

      // 根据Key检验是否需要显示弹出框
      var currentType = '';
      if (key === 'sector_correct') {
        currentType = 'rightAnswer';
        targetStuList = __WEBPACK_IMPORTED_MODULE_2_jquery___default.a.extend(true, [], stuList.rightStu);
      } else if (key === 'sector_wrong') {
        currentType = 'wrongAnswer';
        targetStuList = __WEBPACK_IMPORTED_MODULE_2_jquery___default.a.extend(true, [], stuList.wrongStu);
      } else if (key === 'sector_unfinished') {
        currentType = 'unfinished';
        targetStuList = __WEBPACK_IMPORTED_MODULE_2_jquery___default.a.extend(true, [], stuList.unfinishedStu);
      }

      // 不显示弹框
      if (targetStuList.length === 0) {
        return false;
      }

      var stuListWithId = __WEBPACK_IMPORTED_MODULE_2_jquery___default.a.extend(true, [], targetStuList);

      // 学号和姓名映射
      if (this.data.value.currentStudents) {
        var currentStudent = this.data.value.currentStudents;
        var tmpStu = void 0,
            stuId = void 0,
            tmpIndex = void 0;
        for (var i = 0; i < currentStudent.length; i++) {
          tmpStu = currentStudent[i];
          stuId = tmpStu['studentId'];
          if ((tmpIndex = __WEBPACK_IMPORTED_MODULE_2_jquery___default.a.inArray(stuId, targetStuList)) >= 0) {
            targetStuList[tmpIndex] = tmpStu['studentName'];
          }
        }
      }

      return {
        statisticsType: 'C',
        currentType: currentType,
        stuList: targetStuList,
        stuListWithId: stuListWithId
      };
    },
    // 显示弹窗
    showPPW: function showPPW(key) {
      var data = this.buildAnswerDetailDialogData(key);
      if (data) {
        this.ppWData = data;
        this.timestamp = new Date().getTime() + '';
        this.isShowPopUpWindow = true;
      }
    },
    // 关闭弹窗
    closePPW: function closePPW() {
      this.isShowPopUpWindow = false;
    }
  },
  components: { popUpWindow: __WEBPACK_IMPORTED_MODULE_3__PopUpWindow_index___default.a },
  computed: {
    statisticData: function statisticData() {
      var convertedData = this.data.value.convertedData;
      return [{
        type: 'sector_unfinished',
        name: this.i18n.noAnswer,
        num: convertedData.unfinishedNum,
        percent: calculatePercentage(convertedData.unfinishedNum, convertedData.totalNum)
      }, {
        type: 'sector_wrong',
        name: this.i18n.answerwrong,
        num: convertedData.wrongNum,
        percent: calculatePercentage(convertedData.wrongNum, convertedData.totalNum)
      }, {
        type: 'sector_correct',
        name: this.i18n.answerright,
        num: convertedData.correctNum,
        percent: calculatePercentage(convertedData.correctNum, convertedData.totalNum)
      }];
    },
    statisticDataNotDetails: function statisticDataNotDetails() {
      var convertedData = this.data.value.convertedData;
      return [{
        type: 'sector_correct',
        name: this.i18n.answerright,
        num: convertedData.correctNum,
        percent: calculatePercentage(convertedData.correctNum, convertedData.totalNum)
      }, {
        type: 'sector_wrong',
        name: this.i18n.answerwrong,
        num: convertedData.wrongNum,
        percent: calculatePercentage(convertedData.wrongNum, convertedData.totalNum)
      }, {
        type: 'sector_unfinished',
        name: this.i18n.noAnswer,
        num: convertedData.unfinishedNum,
        percent: calculatePercentage(convertedData.unfinishedNum, convertedData.totalNum)
      }];
    }
  },
  props: {
    showDetails: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    env: {
      type: String,
      default: function _default() {
        return 'ppt';
      }
    },
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__staticA_index__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__staticA_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__staticA_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__staticB_index__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__staticB_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__staticB_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__staticC_index__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__staticC_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__staticC_index__);




/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    staticA: __WEBPACK_IMPORTED_MODULE_0__staticA_index___default.a,
    staticB: __WEBPACK_IMPORTED_MODULE_1__staticB_index___default.a,
    staticC: __WEBPACK_IMPORTED_MODULE_2__staticC_index___default.a
  },
  computed: {
    statisticsType: function statisticsType() {
      return this.data.statisticsType || '';
    }
  },
  methods: {
    close: function close() {
      this.$emit('closePopUpWindow');
    }
  },
  props: {
    timestamp: {
      type: String,
      default: function _default() {
        return new Date().getTime() + '';
      }
    },
    env: {
      type: String,
      default: function _default() {
        return 'ppt';
      }
    },
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      stuList: [],
      currentPageStuList: [],
      currentPageStuListWithId: [],
      PAGE_MAX_NUM: 30,
      pages: 0,
      currentPage: 1,
      start: 0,
      end: 0
    };
  },

  watch: {
    // 更新视图
    'ppwTimestamp': function ppwTimestamp(n, o) {
      if (this.data.statisticsType === 'A') {
        this.loadOnPPWShow();
      }
    }
  },
  computed: {
    ppwTimestamp: function ppwTimestamp() {
      return this.timestamp;
    }
  },
  methods: {
    sendFlower: function sendFlower() {
      this.$root.$emit('FLOWER', this.currentPageStuListWithId);
    },
    loadOnPPWShow: function loadOnPPWShow() {
      // 变量定义
      var stuList = void 0,
          pages = void 0,
          start = void 0,
          end = void 0,
          currentPage = void 0,
          currentPageStuList = void 0,
          currentPageStuListWithId = void 0;

      // 获取学生列表
      if (this.data && this.data.stuList && this.data.stuList instanceof Array && this.data.stuList.length) {
        stuList = this.data.stuList;
      } else {
        stuList = [];
      }

      // 计算总页数
      pages = Math.ceil(stuList.length / this.PAGE_MAX_NUM);
      currentPage = 1;
      start = 0;
      end = pages > 1 ? this.PAGE_MAX_NUM : stuList.length;
      currentPageStuList = stuList.slice(this.start, this.end);
      currentPageStuListWithId = this.data.stuListWithId.slice(this.start, this.end);

      // 更新scope数据
      this.$set(this, 'stuList', stuList);
      this.$set(this, 'pages', pages);
      this.$set(this, 'currentPage', currentPage);
      this.$set(this, 'start', start);
      this.$set(this, 'end', end);
      this.$set(this, 'currentPageStuList', currentPageStuList);
      this.$set(this, 'currentPageStuListWithId', currentPageStuListWithId);

      this.go2Page(this.currentPage);
    },
    go2Page: function go2Page(idx) {
      this.currentPage = parseInt(idx);
      this.$set(this, 'start', (this.currentPage - 1) * this.PAGE_MAX_NUM);
      this.$set(this, 'end', this.currentPage === this.pages ? this.stuList.length : idx * this.PAGE_MAX_NUM);
      this.$set(this, 'currentPageStuList', this.stuList.slice(this.start, this.end));
      this.$set(this, 'currentPageStuListWithId', this.data.stuListWithId.slice(this.start, this.end));
    },
    prePage: function prePage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.go2Page(this.currentPage);
      }
    },
    nextPage: function nextPage() {
      if (this.currentPage < this.pages) {
        this.currentPage += 1;
        this.go2Page(this.currentPage);
      }
    }
  },
  props: {
    timestamp: {
      type: String,
      default: function _default() {
        return new Date().getTime() + '';
      }
    },
    env: {
      type: String,
      default: function _default() {
        return 'ppt';
      }
    },
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      currentTab: 'right', // 标志当前处于的tab页
      currentTabStuList: [], // 缓存当前tab页的不带ID号的学生列表
      currentTabStuListWithId: [], // 缓存当前tab页的带ID号的学生列表
      currentPageStuList: [], // 缓存当前tab页所处页面的不带ID号的学生列表
      currentPageStuListWithId: [], // 缓存当前tab页所处页面的带ID号的学生列表
      PAGE_MAX_NUM: 30, // 每页最多显示学生端数量
      pages: 0, // 当前tab页的总页数
      currentPage: 1, // 当前tab所处的页码
      start: 0,
      end: 0,
      tabsVisible: { // 标志哪些tab处于可见状态
        right: false,
        wrong: false,
        unfinished: false
      }
    };
  },

  watch: {
    // 更新视图
    'ppwTimestamp': function ppwTimestamp(n, o) {
      if (this.data.statisticsType === 'B') {
        this.loadOnPPWShow();
      }
    }
  },
  computed: {
    ppwTimestamp: function ppwTimestamp() {
      return this.timestamp;
    }
  },
  methods: {
    loadOnPPWShow: function loadOnPPWShow() {
      // 初始化可见的tab标签
      var tabsVisible = {
        right: false,
        wrong: false,
        unfinished: false
      };
      if (this.data.stuList.rightStu.length) {
        tabsVisible.right = true;
      }
      if (this.data.stuList.wrongStu.length) {
        tabsVisible.wrong = true;
      }
      if (this.data.stuList.unfinishedStu.length) {
        tabsVisible.unfinished = true;
      }
      this.$set(this, 'tabsVisible', tabsVisible);

      // 初始化当前该显示的tab页
      if (this.data.stuList.rightStu.length) {
        this.currentTab = 'right';
      } else if (this.data.stuList.wrongStu.length) {
        this.currentTab = 'wrong';
      } else if (this.data.stuList.unfinishedStu.length) {
        this.currentTab = 'unfinished';
      }

      // 显示首次弹框的内容
      this.go2Tab(this.currentTab);
    },
    switchTab: function switchTab(evt) {
      var $target = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(evt.target);
      if ($target.hasClass('tabbox_a')) {
        if ($target.hasClass('_right')) {
          this.currentTab = 'right';
        } else if ($target.hasClass('_wrong')) {
          this.currentTab = 'wrong';
        } else if ($target.hasClass('_unfinished')) {
          this.currentTab = 'unfinished';
        }
        this.go2Tab(this.currentTab);
      }
    },
    sendFlower: function sendFlower() {
      console.log(this.currentPageStuListWithId);
      this.$root.$emit('FLOWER', this.currentPageStuListWithId);
    },
    go2Tab: function go2Tab(tab) {
      // 变量定义
      var pages = void 0,
          currentTabStuList = void 0,
          currentTabStuListWithId = void 0;

      // 重置currentTab
      this.$set(this, 'currentTab', tab);

      // 重置当前tab第一页显示的学生列表
      switch (this.currentTab) {
        case 'right':
          currentTabStuList = this.data.stuList.rightStu;
          currentTabStuListWithId = this.data.stuListWithId.rightStu;
          break;
        case 'wrong':
          currentTabStuList = this.data.stuList.wrongStu;
          currentTabStuListWithId = this.data.stuListWithId.wrongStu;
          break;
        case 'unfinished':
          currentTabStuList = this.data.stuList.unfinishedStu;
          currentTabStuListWithId = this.data.stuListWithId.unfinishedStu;
          break;
        default:
          currentTabStuList = [];
          currentTabStuListWithId = [];
      }

      // 计算总页数
      pages = Math.ceil(currentTabStuList.length / this.PAGE_MAX_NUM);

      // 更新scope数据
      this.$set(this, 'pages', pages);
      this.$set(this, 'currentTabStuList', currentTabStuList);
      this.$set(this, 'currentTabStuListWithId', currentTabStuListWithId);

      // 显示该Tab第一页的学生列表
      this.go2Page(1);
    },
    go2Page: function go2Page(pageIdx) {
      pageIdx = parseInt(pageIdx);
      if (pageIdx > this.pages) {
        return;
      }

      // 局部变量定义
      var start = void 0,
          end = void 0,
          currentPageStuList = void 0,
          currentPageStuListWithId = void 0;

      // 重置当前页
      this.$set(this, 'currentPage', pageIdx);

      start = (this.currentPage - 1) * this.PAGE_MAX_NUM;
      end = this.currentPage === this.pages ? this.currentTabStuList.length : pageIdx * this.PAGE_MAX_NUM;
      currentPageStuList = this.currentTabStuList.slice(start, end);
      currentPageStuListWithId = this.currentTabStuListWithId.slice(start, end);

      // 更新scope数据
      this.$set(this, 'start', start);
      this.$set(this, 'end', end);
      this.$set(this, 'currentPageStuList', currentPageStuList);
      this.$set(this, 'currentPageStuListWithId', currentPageStuListWithId);
    },
    prePage: function prePage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.go2Page(this.currentPage);
      }
    },
    nextPage: function nextPage() {
      if (this.currentPage < this.pages) {
        this.currentPage += 1;
        this.go2Page(this.currentPage);
      }
    }
  },
  props: {
    timestamp: {
      type: String,
      default: function _default() {
        return new Date().getTime() + '';
      }
    },
    env: {
      type: String,
      default: function _default() {
        return 'ppt';
      }
    },
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      stuList: [],
      currentPageStuList: [],
      currentPageStuListWithId: [],
      PAGE_MAX_NUM: 30,
      pages: 0,
      currentPage: 1,
      start: 0,
      end: 0
    };
  },

  watch: {
    // 更新视图
    'ppwTimestamp': function ppwTimestamp(n, o) {
      if (this.data.statisticsType === 'C') {
        this.loadOnPPWShow();
      }
    }
  },
  computed: {
    ppwTimestamp: function ppwTimestamp() {
      return this.timestamp;
    }
  },
  methods: {
    sendFlower: function sendFlower() {
      this.$root.$emit('FLOWER', this.currentPageStuListWithId);
    },
    loadOnPPWShow: function loadOnPPWShow() {
      // 变量定义
      var stuList = void 0,
          pages = void 0,
          start = void 0,
          end = void 0,
          currentPage = void 0,
          currentPageStuList = void 0,
          currentPageStuListWithId = void 0;

      // 获取学生列表
      if (this.data && this.data.stuList && this.data.stuList instanceof Array && this.data.stuList.length) {
        stuList = this.data.stuList;
      } else {
        stuList = [];
      }

      // 计算总页数
      pages = Math.ceil(stuList.length / this.PAGE_MAX_NUM);
      currentPage = 1;
      start = 0;
      end = pages > 1 ? this.PAGE_MAX_NUM : stuList.length;
      currentPageStuList = this.stuList.slice(this.start, this.end);
      currentPageStuListWithId = this.data.stuListWithId.slice(this.start, this.end);

      // 更新scope数据
      this.$set(this, 'stuList', stuList);
      this.$set(this, 'pages', pages);
      this.$set(this, 'currentPage', currentPage);
      this.$set(this, 'start', start);
      this.$set(this, 'end', end);
      this.$set(this, 'currentPageStuList', currentPageStuList);
      this.$set(this, 'currentPageStuListWithId', currentPageStuListWithId);

      this.go2Page(this.currentPage);
    },
    go2Page: function go2Page(idx) {
      this.currentPage = parseInt(idx);
      this.$set(this, 'start', (this.currentPage - 1) * this.PAGE_MAX_NUM);
      this.$set(this, 'end', this.currentPage === this.pages ? this.stuList.length : idx * this.PAGE_MAX_NUM);
      this.$set(this, 'currentPageStuList', this.stuList.slice(this.start, this.end));
      this.$set(this, 'currentPageStuListWithId', this.data.stuListWithId.slice(this.start, this.end));
    },
    prePage: function prePage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.go2Page(this.currentPage);
      }
    },
    nextPage: function nextPage() {
      if (this.currentPage < this.pages) {
        this.currentPage += 1;
        this.go2Page(this.currentPage);
      }
    }
  },
  props: {
    timestamp: {
      type: String,
      default: function _default() {
        return new Date().getTime() + '';
      }
    },
    env: {
      type: String,
      default: function _default() {
        return 'ppt';
      }
    },
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'home',
  data: function data() {
    return {
      title: '这是E类统计(排行榜)'
    };
  },

  computed: {
    questionType: function questionType() {
      return this.data.value.convertedData.questionType;
    },
    correctAnswer: function correctAnswer() {
      var correctAnswer = {};
      var answer = this.data.value.convertedData.correctAnswer.correctAnswer;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(answer), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          var map = item.split(' ');
          correctAnswer[map[0]] = map[1];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return correctAnswer;
    },
    rightAnswers: function rightAnswers() {
      var answer = {};
      var correctAnswer = this.data.value.convertedData.correctAnswer.correctAnswer;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(correctAnswer), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          var map = item.split(' ');
          answer[map[0]] = map[1];
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var answerLeft = [];
      var answerRight = [];
      var num = 0;
      for (var itemId in answer) {
        if (num % 2 === 1) {
          answerRight.push(itemId);
        } else {
          answerLeft.push(itemId);
        }
        num++;
      }
      return {
        answerLeft: answerLeft,
        answerRight: answerRight
      };
    },
    itemMap: function itemMap() {
      if (this.data.value.convertedData.itemMap) {
        return this.data.value.convertedData.itemMap;
      }
      return [];
    }
  },
  props: {
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      topRank: 3, // 默认取前三名显示
      title: '这是E类统计(排行榜)'
    };
  },

  methods: {
    // 格式化学生姓名
    formatStudentName: function formatStudentName(student) {
      var length = student.studentName.length;
      if (length > 6) {
        return student.studentName.substring(0, 6) + '...';
      } else {
        return student.studentName;
      }
    },
    // 格式化时间 type = 1 显示1分12秒，否则显示01:12
    formatElapseTime: function formatElapseTime(student, elapseTime) {
      if (student.answerStatus === 'finished') {
        var time = parseInt(elapseTime);
        if (isNaN(time)) {
          return '';
        } else {
          var min = Math.floor(elapseTime / 60);
          var sec = elapseTime % 60;
          var result = '';
          if (min > 0) {
            if (min < 10) {
              result = '0' + min;
            } else {
              result = min;
            }
          } else {
            result = '00';
          }
          if (sec > 0) {
            if (sec < 10) {
              result = result + ':0' + sec;
            } else {
              result = result + ':' + sec;
            }
          } else {
            result = result + ':00';
          }
          return result;
        }
      } else {
        return '-:-';
      }
    }
  },
  computed: {
    topRankList: function topRankList() {
      var list = [];
      for (var i = 0; i < this.converted.finishList.length; ++i) {
        if (i < this.topRank) {
          list.push(this.converted.finishList[i]);
        }
      }
      return list;
    },
    finished: function finished() {
      return this.statistics.finished;
    },
    finishedPercent: function finishedPercent() {
      return this.statistics.finishedPercent;
    },
    unfinished: function unfinished() {
      return this.statistics.unfinished;
    },
    unfinishedPercent: function unfinishedPercent() {
      return this.statistics.unfinishedPercent;
    },
    total: function total() {
      return this.statistics.total;
    }
  },
  components: {},
  props: {
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    statistics: {
      type: Object,
      default: function _default() {
        return {
          finished: 0,
          unfinished: 0,
          total: 0,
          finishedPercent: 0,
          unfinishedPercent: 0
        };
      }
    },
    converted: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);


var drawLine = function drawLine(lines, startx, starty, endx, endy) {
  var length = Math.sqrt((endx - startx) * (endx - startx) + (endy - starty) * (endy - starty));
  var angleInDegrees = Math.atan2(endy - starty, endx - startx) * 180 / Math.PI;
  lines.push({
    'left': startx + 'px',
    'top': starty + 'px',
    'width': length + 'px',
    'transform': 'rotate(' + angleInDegrees + 'deg)',
    'transform-origin': '0% 0%',
    '-ms-transform': 'rotate(' + angleInDegrees + 'deg)',
    '-moz-transform-origin': '0% 0%',
    '-moz-transform': 'rotate(' + angleInDegrees + 'deg)',
    '-webkit-transform-origin': '0% 0%',
    '-webkit-transform': 'rotate(' + angleInDegrees + 'deg)',
    '-o-transform-origin': '0% 0%',
    '-o-transform': 'rotate(' + angleInDegrees + 'deg)'
  });
  return lines;
};

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'home',
  data: function data() {
    return {
      lines: [],
      title: '这是E类统计(排行榜)'
    };
  },

  methods: {},
  mounted: function mounted() {
    var pointSize = {
      width: __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this.$el).find('.point').width(),
      height: __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this.$el).find('.point').height()
    };
    var lines = [];
    var items = this.data.value.convertedData.questionData.items;
    __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.each(items, function (key, value) {
      if (items[key] && items[key + 1]) {
        drawLine(lines, parseInt(items[key].cx.substring(0, items[key].cx.length - 2)) + pointSize.width / 2, parseInt(items[key].cy.substring(0, items[key].cy.length - 2)) + pointSize.height / 2, parseInt(items[key + 1].cx.substring(0, items[key + 1].cx.length - 2)) + pointSize.width / 2, parseInt(items[key + 1].cy.substring(0, items[key + 1].cy.length - 2)) + pointSize.height / 2);
      }
    });
    this.lines = lines;

    var bgImg = new Image();
    var scale = this.data.value.convertedData.questionData.background.scale;
    var scaleWidth = void 0,
        scaleHeight = void 0,
        bgMLeft = void 0,
        bgMTop = void 0;
    bgImg.src = this.data.value.convertedData.questionData.background.url;
    var _this = this;
    bgImg.onload = function () {
      // 加载完成获取宽高
      scaleWidth = bgImg.width * scale;
      scaleHeight = bgImg.height * scale;
      bgMLeft = -scaleWidth / 2 + 'px';
      bgMTop = -scaleHeight / 2 + 'px';
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this.$el).find('.pointsort_imgwrap').width(scaleWidth);
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this.$el).find('.pointsort_imgwrap').height(scaleHeight);
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this.$el).find('.pointsort_imgwrap').css({
        'margin-left': bgMLeft,
        'margin-top': bgMTop
      });
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this.$el).find('.pointsort_imgwrap').css('background-image', 'url(' + _this.data.value.convertedData.questionData.background.url + ')');
      __WEBPACK_IMPORTED_MODULE_0_jquery___default()(_this.$el).find('.pointsort_imgwrap').css('background-size', '100% 100%');
    };
  },

  computed: {
    itemMap: function itemMap() {
      if (this.data.value.convertedData.questionData.items) {
        return this.data.value.convertedData.questionData.items;
      }
      return [];
    }
  },
  props: {
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'home',
  data: function data() {
    return {
      title: '这是E类统计(排行榜)'
    };
  },

  computed: {
    questionType: function questionType() {
      return this.data.value.convertedData.questionType;
    },
    itemMap: function itemMap() {
      if (this.data.value.convertedData.itemMap) {
        return this.data.value.convertedData.itemMap;
      }
      return {
        title: '',
        sentences: [],
        author: ''
      };
    }
  },
  props: {
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'home',
  data: function data() {
    return {
      title: '这是E类统计(排行榜)'
    };
  },

  methods: {
    sendFlower: function sendFlower(evt) {
      var stuId = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(evt.target).attr('studentId');
      if (typeof stuId !== 'undefined') {
        this.$root.$emit('FLOWER', [stuId]);
      }
    },
    // 格式化学生姓名
    formatStudentName: function formatStudentName(student) {
      var length = student.studentName.length;
      if (length > 6) {
        return student.studentName.substring(0, 6) + '...';
      } else {
        return student.studentName;
      }
    },
    // 格式化时间 type = 1 显示1分12秒，否则显示01:12
    formatElapseTime: function formatElapseTime(student, elapseTime) {
      if (student.answerStatus === 'finished') {
        var time = parseInt(elapseTime);
        if (isNaN(time)) {
          return '';
        } else {
          var min = Math.floor(elapseTime / 60);
          var sec = elapseTime % 60;
          var result = '';
          if (min > 0) {
            if (min < 10) {
              result = '0' + min;
            } else {
              result = min;
            }
          } else {
            result = '00';
          }
          if (sec > 0) {
            if (sec < 10) {
              result = result + ':0' + sec;
            } else {
              result = result + ':' + sec;
            }
          } else {
            result = result + ':00';
          }
          return result;
        }
      } else {
        return '-:-';
      }
    },
    initRank: function initRank(student, index) {
      if (student.answerStatus === 'finished') {
        return index + 1;
      } else {
        return '-';
      }
    },
    isMarked: function isMarked(stu) {
      return __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.inArray(stu.studentId, this.markedUsers['tagUsers']) >= 0;
    }
  },
  computed: {
    markedUsers: function markedUsers() {
      var markedUsr = [];
      if (this.data.value['users'] && __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.isArray(this.data.value['users'])) {
        var u;
        for (var i = 0, len = this.data.value['users'].length; i < len; i++) {
          u = this.data.value['users'][i];
          if (u['tag'] === true) {
            markedUsr.push(u['userId']);
          }
        }
      }
      return markedUsr;
    }
  },
  props: {
    env: {
      type: String,
      default: function _default() {
        return 'ppt';
      }
    },
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    students: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Podium_index__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Podium_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Podium_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__StuList_index__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__StuList_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__StuList_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__PointSort_index__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__PointSort_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__PointSort_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Linkup_index__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Linkup_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__Linkup_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__SpellPoem_index__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__SpellPoem_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__SpellPoem_index__);








/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'home',
  data: function data() {
    return {
      statistics: {
        finished: 0,
        unfinished: 0,
        total: 0,
        finishedPercent: 0,
        unfinishedPercent: 0
      },
      title: '这是E类统计(排行榜)',
      isShowTabRank: true
    };
  },

  methods: {
    statisticsESort: function statisticsESort(subList) {
      var sbFinished = [];
      var sbUnfinished = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(subList), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var stu = _step.value;

          stu.answerStatus === 'finished' ? sbFinished.push(stu) : sbUnfinished.push(stu);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.statistics.finished = sbFinished.length;
      this.statistics.unfinished = sbUnfinished.length;
      this.statistics.total = sbFinished.length + sbUnfinished.length;
      this.statistics.finishedPercent = sbFinished.length / (sbUnfinished.length + sbFinished.length) * 100;
      this.statistics.unfinishedPercent = sbUnfinished.length / (sbUnfinished.length + sbFinished.length) * 100;
      // 排序处理
      sbFinished.sort(function (a, b) {
        if (Number(a.submitTime) !== Number(b.submitTime)) {
          // 优先根据提交时间排序
          return Number(a.submitTime) - Number(b.submitTime);
        } else {
          // 提交时间相同的根据学号排序
          if (a.studentNo > b.studentNo) {
            return 1;
          } else if (b.studentNo < b.studentNo) {
            return -1;
          } else {
            return 0;
          }
        }
      });
      sbUnfinished.sort(function (a, b) {
        if (Number(a.submitTime) !== Number(b.submitTime)) {
          // 优先根据提交时间排序
          return Number(a.submitTime) - Number(b.submitTime);
        } else {
          // 提交时间相同的根据学号排序
          if (a.studentNo > b.studentNo) {
            return 1;
          } else if (b.studentNo < b.studentNo) {
            return -1;
          } else {
            return 0;
          }
        }
      });
      return [].concat(sbFinished, sbUnfinished);
    },
    switchTab: function switchTab(event) {
      var $target = __WEBPACK_IMPORTED_MODULE_1_jquery___default()(event.target);
      if ($target.hasClass('_tab_rank') && !$target.hasClass('on')) {
        this.isShowTabRank = true;
      } else if ($target.hasClass('_tab_correct_answer') && !$target.hasClass('on')) {
        this.isShowTabRank = false;
      }
    },
    // 格式化学生姓名
    formatStudentName: function formatStudentName(student) {
      var length = student.studentName.length;
      if (length > 6) {
        return student.studentName.substring(0, 6) + '...';
      } else {
        return student.studentName;
      }
    },
    // 格式化时间 type = 1 显示1分12秒，否则显示01:12
    formatElapseTime: function formatElapseTime(student, elapseTime) {
      if (student.answerStatus === 'finished') {
        var time = parseInt(elapseTime);
        if (isNaN(time)) {
          return '';
        } else {
          var min = Math.floor(elapseTime / 60);
          var sec = elapseTime % 60;
          var result = '';
          if (min > 0) {
            if (min < 10) {
              result = '0' + min;
            } else {
              result = min;
            }
          } else {
            result = '00';
          }
          if (sec > 0) {
            if (sec < 10) {
              result = result + ':0' + sec;
            } else {
              result = result + ':' + sec;
            }
          } else {
            result = result + ':00';
          }
          return result;
        }
      } else {
        return '-:-';
      }
    }
  },
  components: {
    podium: __WEBPACK_IMPORTED_MODULE_2__Podium_index___default.a,
    stuList: __WEBPACK_IMPORTED_MODULE_3__StuList_index___default.a,
    pointSort: __WEBPACK_IMPORTED_MODULE_4__PointSort_index___default.a,
    linkup: __WEBPACK_IMPORTED_MODULE_5__Linkup_index___default.a,
    spellPoem: __WEBPACK_IMPORTED_MODULE_6__SpellPoem_index___default.a
  },
  computed: {
    questionType: function questionType() {
      return this.data.value.convertedData.questionType;
    },
    submitSutList: function submitSutList() {
      // 从value下面解析出提交的学生列表
      var value = this.data.value;
      // 获取原始的学生列表
      var subList = __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.extend(true, [], value.users);
      // userId映射名字和学号
      var currentStudentsWithName = value.currentStudents;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(subList), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var stu = _step2.value;

          stu['studentId'] = stu['userId'];
          stu['studentName'] = '';
          stu['studentNo'] = '';
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(currentStudentsWithName), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var stuWithName = _step4.value;

              var stuWithNameId = stuWithName['studentId'];
              if (stuWithNameId === stu['userId']) {
                stu['studentName'] = stuWithName['studentName'];
                stu['studentNo'] = stuWithName['studentNo'];
                break;
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
        // 生成'answerStatus'字段
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var isSpellPoem = value.questionType.toLowerCase() === 'spellpoem';
      var answers = value.answers;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(subList), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _stu = _step3.value;

          // 设置answerStatus默认值
          _stu['answerStatus'] = false;
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(answers[0]), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var answer = _step5.value;

              if (answer.userIds.indexOf(_stu['userId']) !== -1) {
                if (isSpellPoem) {
                  var originalAnswer = JSON.parse(JSON.parse(JSON.parse(answer['answer']).state));
                  _stu['answerStatus'] = originalAnswer['gameStateData']['isComplete'];
                  _stu['submitTime'] = originalAnswer['gameStateData']['game_use_time'];
                } else {
                  var _originalAnswer = JSON.parse(answer['answer']);
                  _stu['answerStatus'] = _originalAnswer['answer_result'];
                }
                break;
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          if (!_stu['answerStatus']) {
            _stu['submitTime'] = 0;
          }
          _stu['answerStatus'] = _stu['answerStatus'] ? 'finished' : 'unfinished';
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      subList = this.statisticsESort(subList);
      return subList;
    }
  },
  props: {
    env: {
      type: String,
      default: function _default() {
        return 'ppt';
      }
    },
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'home',
  data: function data() {
    return {
      title: '时间'
    };
  },

  computed: {
    spendTime: function spendTime() {
      var value = this.data.value;
      var spendTimeSeconds = value.elapsedTime;
      var minutes = Math.floor(spendTimeSeconds / 60);
      var seconds = spendTimeSeconds % 60;
      return {
        minutes: minutes,
        seconds: seconds
      };
    },
    submitCount: function submitCount() {
      var value = this.data.value;
      return Number(value.finishedNum) + Number(value.unfinishedNum);
    },
    totalNum: function totalNum() {
      var value = this.data.value;
      return Number(value.finishedNum) + Number(value.unfinishedNum);
    }
  },
  props: {
    env: {
      type: String,
      default: function _default() {
        return 'ppt';
      }
    },
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_keys__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PopUpWindow_index__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PopUpWindow_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__PopUpWindow_index__);


/* eslint-disable no-unused-vars */



var calculatePercentage = function calculatePercentage(dividend, divisor) {
  return parseFloat(((dividend / divisor).toFixed(3) * 100).toFixed(1));
};

var getCurPos = function getCurPos(e) {
  var eventType = e.type;
  var pos = {};

  switch (eventType) {
    case 'mousedown':
    case 'mousemove':
      pos.x = e.clientX;
      pos.y = e.clientY;
      break;
    case 'touchstart':
      pos.x = e.originalEvent.touches[0].clientX;
      pos.y = e.originalEvent.touches[0].clientY;
      break;
    case 'touchmove':
      pos.x = e.originalEvent.changedTouches[0].clientX;
      pos.y = e.originalEvent.changedTouches[0].clientY;
      break;
  }
  return pos;
};

// 左右拖动事件
var choiceDragEvent = function choiceDragEvent(element) {
  var x = void 0,
      y = void 0,
      xOld = void 0,
      yOld = void 0,
      xDiff = void 0,
      pos = void 0;
  var isMouseDown = false;
  var startTime = void 0;

  __WEBPACK_IMPORTED_MODULE_2_jquery___default()(element).on('mousedown touchstart', function (e) {
    isMouseDown = true;
    pos = getCurPos(e);
    xOld = pos.x;
    yOld = pos.y;
    startTime = new Date().getTime();
  });

  __WEBPACK_IMPORTED_MODULE_2_jquery___default()(element).on('mousemove touchmove', function (e) {
    if (!isMouseDown) {
      return;
    }
    pos = getCurPos(e);
    x = pos.x;
    y = pos.y;
    xDiff = x - xOld;
    this.scrollLeft -= xDiff;
    xOld = x;
    yOld = y;
  });

  __WEBPACK_IMPORTED_MODULE_2_jquery___default()(element).on('mouseup touchend mouseleave touchcancel', function (e) {
    var dur = new Date().getTime() - startTime;
    if (dur > 300) {
      e.stopPropagation();
    }
    isMouseDown = false;
    xOld = null;
    yOld = null;
  });
};

// 多选题类型列表
var multipleChoiceList = ['multiplechoice', 'multichoice', 'vote'];

// 单选题类型列表
var choiceList = ['choice', 'judge'];

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      title: 'A类统计',
      isShowPopUpWindow: false,
      hasCorrectAnswer: true,
      userAnswerHasContainedCorrectAnswer: true,
      barColumns: {},
      boxStyleClazz: {},
      timestamp: new Date().getTime() + '',
      ppWData: {}
    };
  },

  watch: {
    // 更新视图
    'isShowCorrectAnswer': function isShowCorrectAnswer(n, o) {
      console.log('isShowCorrectAnswer changed from [' + o + '] to [' + n + ']');
      // update model
      this.initModel();
    }
  },
  mounted: function mounted() {
    this.initModel();
    choiceDragEvent(__WEBPACK_IMPORTED_MODULE_2_jquery___default()(this.$el).find('._scroll_region'));
  },

  components: {
    popUpWindow: __WEBPACK_IMPORTED_MODULE_3__PopUpWindow_index___default.a
  },
  computed: {
    isShowCorrectAnswer: function isShowCorrectAnswer() {
      console.log('isShowCorrectAnswer:' + this.correctAnswerDisplayCtrl.showCorrectAnswer);
      return this.correctAnswerDisplayCtrl.showCorrectAnswer;
    },
    isDynamic: function isDynamic() {
      if (this.data.questionInfo && this.data.questionInfo.dynamic) {
        // 是截图发题 or 口头出题
        return true;
      }
      return false;
    },
    isTemporaryQuestion: function isTemporaryQuestion() {
      if (this.data.questionInfo && this.data.questionInfo.dynamic && this.data.questionInfo.questionType === 'TemporaryQuestion') {
        return true;
      }
      return false;
    },
    isJudge: function isJudge() {
      return this.data.value.convertedData.questionType.trim() === 'judge';
    },
    judgeOptions: function judgeOptions() {
      return {
        YES: this.i18n.yes,
        NO: this.i18n.no
      };
    },
    questionTypeCategory: function questionTypeCategory() {
      if (choiceList.indexOf(this.data.value.convertedData.questionType.trim()) !== -1) {
        return 'choice';
      } else if (multipleChoiceList.indexOf(this.data.value.convertedData.questionType.trim()) !== -1) {
        return 'multiplechoice';
      }
    },
    /**
     * 由于切图设计的原因，这里的【未作答】柱形的渲染不能由模型数据接管，所以此处提供一个【未作答】柱形控制器
     * @returns {{showUnfinishedBar: boolean, unfinishedNum: number, unfinishedPercentage}}
     */
    unfinishedCtrl: function unfinishedCtrl() {
      return {
        showUnfinishedBar: parseInt(this.data.value.convertedData.unfinishedNum) > 0,
        unfinishedNum: this.data.value.convertedData.unfinishedNum,
        unfinishedPercentage: calculatePercentage(this.data.value.convertedData.unfinishedNum, this.data.value.convertedData.totalNum)
      };
    }
  },
  methods: {
    buildAnswerDetailDialogData: function buildAnswerDetailDialogData(key) {
      var convertedData = this.data.value.convertedData;
      var stuList = [];
      if (key === 'unfinished') {
        stuList = __WEBPACK_IMPORTED_MODULE_2_jquery___default.a.extend(true, [], convertedData.unfinishedUserIds);
      } else {
        if (convertedData.answers[key] && convertedData.answers[key].userIds) {
          stuList = __WEBPACK_IMPORTED_MODULE_2_jquery___default.a.extend(true, [], convertedData.answers[key].userIds);
        } else {
          return false;
        }
      }

      // 检验是否弹框
      if (stuList.length === 0) {
        return false;
      }

      var stuListWithId = __WEBPACK_IMPORTED_MODULE_2_jquery___default.a.extend(true, [], stuList);

      if (this.data.value.currentStudents) {
        var currentStudent = this.data.value.currentStudents;
        var tmpStu = void 0,
            stuId = void 0,
            tmpIndex = void 0;
        for (var i = 0; i < currentStudent.length; i++) {
          tmpStu = currentStudent[i];
          stuId = tmpStu['studentId'];
          if ((tmpIndex = __WEBPACK_IMPORTED_MODULE_2_jquery___default.a.inArray(stuId, stuList)) >= 0) {
            stuList[tmpIndex] = tmpStu['studentName'];
          }
        }
      }
      return {
        statisticsType: 'A',
        currentType: ['YES', 'NO'].indexOf(key) !== -1 ? this.judgeOptions[key] : key,
        stuList: stuList,
        stuListWithId: stuListWithId
      };
    },
    // 显示弹窗
    showPPW: function showPPW(key) {
      var data = this.buildAnswerDetailDialogData(key);
      if (data) {
        this.ppWData = data;
        this.timestamp = new Date().getTime() + '';
        this.isShowPopUpWindow = true;
      }
    },
    // 关闭弹窗
    closePPW: function closePPW() {
      this.isShowPopUpWindow = false;
    },
    // 计算已经渲染的柱形数目
    calculateRenderedColumnsNum: function calculateRenderedColumnsNum(barColumns) {
      if (this.questionTypeCategory === 'multiplechoice' && !this.correctAnswerDisplayCtrl.showCorrectAnswer) {
        if (!this.userAnswerHasContainedCorrectAnswer) {
          return this.unfinishedCtrl.showUnfinishedBar ? barColumns.length : barColumns.length - 1;
        }
      }
      return this.unfinishedCtrl.showUnfinishedBar ? barColumns.length + 1 : barColumns.length;
    },
    // 初始化数据
    initModel: function initModel() {
      var columns = [];
      var convertData = this.data.value.convertedData;

      // 开始默认设置成学生中存在有人答对
      this.userAnswerHasContainedCorrectAnswer = true;

      // 生成柱形模型数据
      if (this.questionTypeCategory === 'multiplechoice') {
        // 多选题，答案选择人数从多到少排序，如果没有正确答案，则正确答案插在最前面，已经有正确答案则任然显示在排序完后的位置
        var answerKey = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_keys___default()(convertData.answers);
        answerKey.sort(function (a, b) {
          if (convertData.answers[b].count === convertData.answers[a].count) {
            if (a.length === b.length) {
              if (a > b) {
                return 1;
              } else if (a === b) {
                return 0;
              } else {
                return -1;
              }
            }
            return a.length - b.length;
          } else {
            return convertData.answers[b].count - convertData.answers[a].count;
          }
        });

        // 计算多选题需要渲染的柱形数量
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(answerKey), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            columns.push({
              text: key,
              count: convertData.answers[key].count,
              isCorrectAnswer: false,
              percentage: calculatePercentage(convertData.answers[key].count, convertData.totalNum)
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else if (this.questionTypeCategory === 'choice') {
        // 获取单选题的所有选项
        var choices = this.data.QtiAssessmentModel.modelMap['RESPONSE_1-1'].simpleChoice;

        // 计算需要渲染的选项柱形数量
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(choices), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var value = _step2.value;

            var bar = convertData.answers[value.identifier] ? {
              text: value.identifier,
              isCorrectAnswer: false,
              count: convertData.answers[value.identifier].count,
              percentage: calculatePercentage(convertData.answers[value.identifier].count, convertData.totalNum)
            } : {
              text: value.identifier,
              isCorrectAnswer: false,
              count: 0,
              percentage: (0.000 * 100).toFixed(1)
            };
            columns.push(bar);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      // 获取正确答案文本内容
      var correctAnswerTxt = '';
      if (this.isDynamic) {
        // 为【口头出题】or【截图发题】可能没有正确答案
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(this.correctAnswerDisplayCtrl.correctAnswer), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _value = _step3.value;

            correctAnswerTxt += _value;
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } else {
        // 获取正确答案的文本信息（普通题型，一定有正确答案）
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(convertData.correctAnswer), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _value2 = _step4.value;

            correctAnswerTxt += _value2;
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }

      // 如果有获取到正确答案文本信息，则设置正确答案
      if (correctAnswerTxt !== '') {
        if (this.questionTypeCategory === 'multiplechoice') {
          // 多选题可能选项中没有正确答案
          var alreadyExistedCorrectAnswer = false;
          for (var i = 0; i < columns.length; ++i) {
            if (columns[i].text === correctAnswerTxt) {
              // 学生中有人回答正确
              columns[i].isCorrectAnswer = true;
              alreadyExistedCorrectAnswer = true;
              break;
            }
          }
          if (!alreadyExistedCorrectAnswer) {
            // 学生中没有人回答正确
            this.userAnswerHasContainedCorrectAnswer = false;
            // 没有正确答案，则在头部插入一个正确答案
            columns.unshift({
              text: correctAnswerTxt,
              isCorrectAnswer: true,
              count: 0,
              percentage: (0.000 * 100).toFixed(1)
            });
          }
        } else if (this.questionTypeCategory === 'choice') {
          // 设置正确答案
          for (var _i = 0; _i < columns.length; ++_i) {
            if (columns[_i].text === correctAnswerTxt) {
              columns[_i].isCorrectAnswer = true;
              break;
            }
          }
        }
      }

      // 计算样式
      var styleClazz = {
        'state_details': this.showDetails
      };
      if (this.isDynamic && this.isTemporaryQuestion) {
        // 临时出题
        styleClazz['ndui__component--choice-temporyq'] = true;
        if (this.calculateRenderedColumnsNum(columns) <= 7) {
          styleClazz['choice_barColumn_less'] = true;
        }
      } else {
        // 普通的单选、多选、判断题
        styleClazz['ndui__component--choice'] = true;
        if (this.calculateRenderedColumnsNum(columns) <= 9) {
          styleClazz['choice_barColumn_less'] = true;
        }
      }

      // update model
      this.$set(this, 'barColumns', columns);
      this.$set(this, 'boxStyleClazz', styleClazz);
    }
  },
  props: {
    env: {
      type: String,
      default: function _default() {
        return 'ppt';
      }
    },
    i18n: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    showDetails: {
      type: Boolean,
      default: false
    },
    correctAnswerDisplayCtrl: {
      type: Object,
      default: function _default() {
        return {
          showCorrectAnswer: true,
          correctAnswer: []
        };
      }
    },
    data: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_VerticalBarChart_index__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_VerticalBarChart_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_VerticalBarChart_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_PercentageChar_index__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_PercentageChar_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_PercentageChar_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_PieChart_index__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_PieChart_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__components_PieChart_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_RankingList_index__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_RankingList_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__components_RankingList_index__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Timer_index__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Timer_index___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_Timer_index__);






// install components
(function () {
  if (window.Midware && window.Midware.componentDefine) {
    window.Midware.componentDefine('ObjectiveStatics:statisticsA', function () {
      return __WEBPACK_IMPORTED_MODULE_0__components_VerticalBarChart_index___default.a;
    });
    window.Midware.componentDefine('ObjectiveStatics:statisticsB', function () {
      return __WEBPACK_IMPORTED_MODULE_1__components_PercentageChar_index___default.a;
    });
    window.Midware.componentDefine('ObjectiveStatics:statisticsC', function () {
      return __WEBPACK_IMPORTED_MODULE_2__components_PieChart_index___default.a;
    });
    window.Midware.componentDefine('ObjectiveStatics:statisticsE', function () {
      return __WEBPACK_IMPORTED_MODULE_3__components_RankingList_index___default.a;
    });
    window.Midware.componentDefine('ObjectiveStatics:statisticsTimer', function () {
      return __WEBPACK_IMPORTED_MODULE_4__components_Timer_index___default.a;
    });
    console.log('成功安装统计组件至【Midware】');
  } else {
    console.log('请先加载托管组件【Midware】');
  }
})();

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(79);
__webpack_require__(78);
module.exports = __webpack_require__(75);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(77);
module.exports = __webpack_require__(4).Object.keys;

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(18)
  , toLength  = __webpack_require__(72)
  , toIndex   = __webpack_require__(71);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(20)
  , TAG = __webpack_require__(3)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(53);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2).document && document.documentElement;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(8) && !__webpack_require__(13)(function(){
  return Object.defineProperty(__webpack_require__(21)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(20);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(64)
  , descriptor     = __webpack_require__(26)
  , setToStringTag = __webpack_require__(27)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(5)(IteratorPrototype, __webpack_require__(3)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(7)
  , dPs         = __webpack_require__(65)
  , enumBugKeys = __webpack_require__(22)
  , IE_PROTO    = __webpack_require__(16)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(21)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(58).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(15)
  , anObject = __webpack_require__(7)
  , getKeys  = __webpack_require__(25);

module.exports = __webpack_require__(8) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(9)
  , toObject    = __webpack_require__(29)
  , IE_PROTO    = __webpack_require__(16)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(9)
  , toIObject    = __webpack_require__(18)
  , arrayIndexOf = __webpack_require__(55)(false)
  , IE_PROTO     = __webpack_require__(16)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(23)
  , core    = __webpack_require__(4)
  , fails   = __webpack_require__(13);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(17)
  , defined   = __webpack_require__(12);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(17)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(17)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(14);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(56)
  , ITERATOR  = __webpack_require__(3)('iterator')
  , Iterators = __webpack_require__(10);
module.exports = __webpack_require__(4).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(7)
  , get      = __webpack_require__(74);
module.exports = __webpack_require__(4).getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(54)
  , step             = __webpack_require__(62)
  , Iterators        = __webpack_require__(10)
  , toIObject        = __webpack_require__(18);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(24)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(29)
  , $keys    = __webpack_require__(25);

__webpack_require__(68)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(70)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(24)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(76);
var global        = __webpack_require__(2)
  , hide          = __webpack_require__(5)
  , Iterators     = __webpack_require__(10)
  , TO_STRING_TAG = __webpack_require__(3)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(39),
  /* template */
  __webpack_require__(88),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\PopUpWindow\\staticA\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-00300907", Component.options)
  } else {
    hotAPI.reload("data-v-00300907", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(40),
  /* template */
  __webpack_require__(100),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\PopUpWindow\\staticB\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d5d68870", Component.options)
  } else {
    hotAPI.reload("data-v-d5d68870", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(41),
  /* template */
  __webpack_require__(90),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\PopUpWindow\\staticC\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-29f96e89", Component.options)
  } else {
    hotAPI.reload("data-v-29f96e89", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(42),
  /* template */
  __webpack_require__(99),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\RankingList\\Linkup\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b342de82", Component.options)
  } else {
    hotAPI.reload("data-v-b342de82", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(43),
  /* template */
  __webpack_require__(93),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\RankingList\\Podium\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4d26ff74", Component.options)
  } else {
    hotAPI.reload("data-v-4d26ff74", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(44),
  /* template */
  __webpack_require__(98),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\RankingList\\PointSort\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-af89128c", Component.options)
  } else {
    hotAPI.reload("data-v-af89128c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(45),
  /* template */
  __webpack_require__(91),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\RankingList\\SpellPoem\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-35735b4a", Component.options)
  } else {
    hotAPI.reload("data-v-35735b4a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(46),
  /* template */
  __webpack_require__(97),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "F:\\NetDragonWebsoftInc\\jslib_component-objectivestatics\\src\\components\\RankingList\\StuList\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9eefa8c4", Component.options)
  } else {
    hotAPI.reload("data-v-9eefa8c4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "pop_wrap",
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('div', {
    staticClass: "content state_choice"
  }, [_c('div', {
    staticClass: "statistic-item-content"
  }, [_c('div', {
    staticClass: "roster_title"
  }, [_c('p', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.data.currentType !== 'unfinished'),
      expression: "data.currentType !== 'unfinished'"
    }],
    staticClass: "pop_title"
  }, [_c('span', {
    staticClass: "num"
  }, [_vm._v(_vm._s(_vm.stuList.length))]), _vm._v(_vm._s(_vm.i18n.selectTheItem) + "\n          "), _c('span', {
    staticClass: "letter"
  }, [_vm._v(_vm._s(_vm.data.currentType))])]), _vm._v(" "), _c('p', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.data.currentType === 'unfinished'),
      expression: "data.currentType === 'unfinished'"
    }],
    staticClass: "pop_title"
  }, [_c('span', {
    staticClass: "num"
  }, [_vm._v(_vm._s(_vm.stuList.length))]), _vm._v(_vm._s(_vm.i18n.person) + "\n          "), _c('span', {
    staticClass: "letter"
  }, [_vm._v(_vm._s(_vm.i18n.noAnswer))])])])]), _vm._v(" "), _c('div', {
    staticClass: "rostertab"
  }, [_c('ul', {
    staticClass: "comui-list-roster"
  }, _vm._l((_vm.currentPageStuList), function(stu, index) {
    return _c('li', {
      key: index
    }, [_vm._m(0, true), _vm._v(" "), _c('span', {
      staticClass: "name"
    }, [_vm._v(_vm._s(stu))])])
  })), _vm._v(" "), _c('div', {
    staticClass: "ndui-pager"
  }, [_c('a', {
    staticClass: "ndui-pager-a ndui-pager-previous",
    class: {
      'off': _vm.currentPage === 1
    },
    on: {
      "click": _vm.prePage
    }
  }), _vm._v(" "), _vm._l((_vm.pages), function(p) {
    return _c('a', {
      staticClass: "ndui-pager-a",
      class: {
        'on': _vm.currentPage === p
      },
      on: {
        "click": function($event) {
          _vm.go2Page(p)
        }
      }
    }, [_vm._v("\n          " + _vm._s(p) + "\n        ")])
  }), _vm._v(" "), _c('a', {
    staticClass: "ndui-pager-a ndui-pager-next",
    class: {
      'off': _vm.currentPage === _vm.pages
    },
    on: {
      "click": _vm.nextPage
    }
  })], 2), _vm._v(" "), (_vm.env !== 'web') ? _c('div', {
    staticClass: "com_send_flower_wrap"
  }, [_c('p', {
    staticClass: "flow_text"
  }, [_c('em', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.i18n.send_lower))])]), _vm._v(" "), _c('div', {
    staticClass: "com_send_flower",
    on: {
      "click": _vm.sendFlower
    }
  })]) : _vm._e()])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', {
    staticClass: "head"
  }, [_c('span', {
    staticClass: "head-img"
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-00300907", module.exports)
  }
}

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat_wood",
    class: _vm.boxStyleClazz,
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml",
      "xmlns:v-on": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('popUpWindow', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isShowPopUpWindow),
      expression: "isShowPopUpWindow"
    }],
    attrs: {
      "data": _vm.ppWData,
      "timestamp": _vm.timestamp,
      "i18n": _vm.i18n,
      "env": _vm.env
    },
    on: {
      "closePopUpWindow": _vm.closePPW
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "choice-temporyq-body"
  }, [_c('ul', {
    staticClass: "histogram _scroll_region"
  }, [_vm._l((_vm.barColumns), function(value, index) {
    return _c('li', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (!(value.isCorrectAnswer && !_vm.correctAnswerDisplayCtrl.showCorrectAnswer && !_vm.userAnswerHasContainedCorrectAnswer)),
        expression: "!(value.isCorrectAnswer && !correctAnswerDisplayCtrl.showCorrectAnswer && !userAnswerHasContainedCorrectAnswer)"
      }],
      staticClass: "hist_list",
      class: {
        'on': value.isCorrectAnswer && _vm.correctAnswerDisplayCtrl.showCorrectAnswer
      }
    }, [_c('a', {
      staticClass: "hist_a",
      attrs: {
        "href": "javascript:;"
      },
      on: {
        "click": function($event) {
          _vm.showPPW(value.text)
        }
      }
    }, [(_vm.isJudge) ? _c('span', {
      staticClass: "letter"
    }, [_vm._v(_vm._s(_vm.judgeOptions[value.text]))]) : _c('span', {
      staticClass: "letter"
    }, [_vm._v(_vm._s(value.text))]), _vm._v(" "), _c('p', {
      staticClass: "text"
    }, [_c('em', [_vm._v(_vm._s(value.count))]), _vm._v(" "), _c('span', {
      staticClass: "num"
    }, [_vm._v("(" + _vm._s(value.percentage) + "%)")])]), _vm._v(" "), _c('div', {
      staticClass: "box"
    }, [_c('span', {
      staticClass: "percent",
      style: ({
        'height': value.percentage + '%'
      })
    })])])])
  }), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.unfinishedCtrl.showUnfinishedBar),
      expression: "unfinishedCtrl.showUnfinishedBar"
    }],
    staticClass: "hist_list no_li"
  }, [_c('a', {
    staticClass: "hist_a",
    attrs: {
      "href": "javascript:;"
    },
    on: {
      "click": function($event) {
        _vm.showPPW('unfinished')
      }
    }
  }, [_c('span', {
    staticClass: "letter"
  }, [_vm._v(_vm._s(_vm.i18n.noAnswer))]), _vm._v(" "), _c('p', {
    staticClass: "text"
  }, [_c('em', [_vm._v(_vm._s(_vm.unfinishedCtrl.unfinishedNum))]), _c('span', {
    staticClass: "num"
  }, [_vm._v("(" + _vm._s(_vm.unfinishedCtrl.unfinishedPercentage) + "%)")])]), _vm._v(" "), _c('div', {
    staticClass: "box"
  }, [_c('span', {
    staticClass: "percent",
    style: ({
      'height': _vm.unfinishedCtrl.unfinishedPercentage + '%'
    })
  })])])])], 2), _vm._v(" "), _c('ul', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.unfinishedCtrl.showUnfinishedBar),
      expression: "unfinishedCtrl.showUnfinishedBar"
    }],
    staticClass: "histogram no_ul"
  }, [_c('li', {
    staticClass: "hist_list "
  }, [_c('a', {
    staticClass: "hist_a",
    attrs: {
      "href": "javascript:;"
    },
    on: {
      "click": function($event) {
        _vm.showPPW('unfinished')
      }
    }
  }, [_c('span', {
    staticClass: "letter"
  }, [_vm._v(_vm._s(_vm.i18n.noAnswer))]), _vm._v(" "), _c('p', {
    staticClass: "text"
  }, [_c('em', [_vm._v(_vm._s(_vm.unfinishedCtrl.unfinishedNum))]), _c('span', {
    staticClass: "num"
  }, [_vm._v("(" + _vm._s(_vm.unfinishedCtrl.unfinishedPercentage) + "%)")])]), _vm._v(" "), _c('div', {
    staticClass: "box"
  }, [_c('span', {
    staticClass: "percent",
    style: ({
      'height': _vm.unfinishedCtrl.unfinishedPercentage + '%'
    })
  })])])])]), _vm._v(" "), _vm._m(0)])], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "line"
  }, [_c('span', {
    staticClass: "round"
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-126d64f0", module.exports)
  }
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "pop_wrap",
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('div', {
    staticClass: "content state_none"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "rostertab"
  }, [_c('ul', {
    staticClass: "comui-list-roster"
  }, _vm._l((_vm.currentPageStuList), function(stu, index) {
    return _c('li', {
      key: index
    }, [_vm._m(1, true), _vm._v(" "), _c('span', {
      staticClass: "name"
    }, [_vm._v(_vm._s(stu))])])
  })), _vm._v(" "), _c('div', {
    staticClass: "ndui-pager"
  }, [_c('a', {
    staticClass: "ndui-pager-a ndui-pager-previous",
    class: {
      'off': _vm.currentPage === 1
    },
    on: {
      "click": _vm.prePage
    }
  }), _vm._v(" "), _vm._l((_vm.pages), function(p) {
    return _c('a', {
      staticClass: "ndui-pager-a",
      class: {
        'on': _vm.currentPage === p
      },
      on: {
        "click": function($event) {
          _vm.go2Page(p)
        }
      }
    }, [_vm._v("\n          " + _vm._s(p) + "\n        ")])
  }), _vm._v(" "), _c('a', {
    staticClass: "ndui-pager-a ndui-pager-next",
    class: {
      'off': _vm.currentPage === _vm.pages
    },
    on: {
      "click": _vm.nextPage
    }
  })], 2), _vm._v(" "), (_vm.env !== 'web') ? _c('div', {
    staticClass: "com_send_flower_wrap"
  }, [_c('p', {
    staticClass: "flow_text"
  }, [_c('em', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.i18n.send_lower))])]), _vm._v(" "), _c('div', {
    staticClass: "com_send_flower",
    on: {
      "click": _vm.sendFlower
    }
  })]) : _vm._e()])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "statistic-item-content"
  }, [_c('div', {
    staticClass: "roster_title"
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', {
    staticClass: "head"
  }, [_c('span', {
    staticClass: "head-img"
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-29f96e89", module.exports)
  }
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat_wood ndui__component--spellpoem"
  }, [_c('div', {
    staticClass: "spellpoem_main scrollbar_style_gray"
  }, [_c('div', {
    staticClass: "spellpoem_title_main "
  }, [_c('div', {
    staticClass: "spellpoem_title"
  }, [_c('div', {
    staticClass: "spellpoem_left"
  }), _vm._v(" "), _c('div', {
    staticClass: "spellpoem_context"
  }, [_c('span', {
    staticClass: "title-txt"
  }, [_vm._v(_vm._s(_vm.itemMap.title))])]), _vm._v(" "), _c('div', {
    staticClass: "spellpoem_right"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "spellpoem_info_main"
  }, [_c('div', {
    staticClass: "spellpoem_info"
  }, [_c('ul', _vm._l((_vm.itemMap.sentences), function(value, index) {
    return _c('li', {
      staticClass: "spellpoem_text"
    }, [_c('span', {
      staticClass: "text"
    }, [_vm._v(_vm._s(value))])])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "spellpoem_author"
  }, [_c('div', {
    staticClass: "spellpoem_author_text"
  }, [_vm._v(_vm._s(_vm.itemMap.author))])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-35735b4a", module.exports)
  }
}

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat_wood ndui__component--judge",
    class: {
      'state_details': _vm.showDetails
    },
    staticStyle: {
      "height": "100%",
      "width": "100%"
    },
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('popUpWindow', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isShowPopUpWindow),
      expression: "isShowPopUpWindow"
    }],
    attrs: {
      "data": _vm.ppWData,
      "timestamp": _vm.timestamp,
      "env": _vm.env,
      "i18n": _vm.i18n
    },
    on: {
      "closePopUpWindow": _vm.closePPW
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "judge-temporyq-body"
  }, [_c('ul', {
    staticClass: "histogram"
  }, _vm._l((_vm.statisticDataNotDetails), function(item) {
    return _c('li', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (item.num > 0),
        expression: "item.num > 0"
      }],
      staticClass: "hist_list correct",
      staticStyle: {
        "left": "20em",
        "top": "4.3em"
      }
    }, [_c('a', {
      staticClass: "hist_a",
      attrs: {
        "href": "javascript:;"
      },
      on: {
        "click": function($event) {
          _vm.showPPW(item.type)
        }
      }
    }, [_c('em', [_vm._v(_vm._s(item.num))]), _c('span', {
      staticClass: "man"
    }, [_vm._v(_vm._s(_vm.i18n.person))]), _c('span', {
      staticClass: "answer"
    }, [_vm._v(_vm._s(item.name))]), _c('span', {
      staticClass: "num"
    }, [_vm._v("(" + _vm._s(item.percent) + ")")])])])
  }))])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-358f9f7e", module.exports)
  }
}

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat_wood ndui__component--award",
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('div', {
    staticClass: "podium"
  }, [_c('ul', [_c('li', [_c('div', {
    staticClass: "stu_rank second"
  }, [(_vm.topRankList.length > 1) ? _c('span', {
    staticClass: "stu_pic"
  }, [_c('img', {
    attrs: {
      "src": _vm.topRankList[1].headIconOffline
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.topRankList.length > 1) ? _c('p', {
    staticClass: "stu_info"
  }, [_c('span', {
    staticClass: "name"
  }, [_vm._v(_vm._s(_vm.formatStudentName(_vm.topRankList[1])))]), _vm._v(" "), _c('span', {
    staticClass: "time"
  }, [_vm._v(_vm._s(_vm.formatElapseTime(_vm.topRankList[1], _vm.topRankList[1].submitTime)))])]) : _vm._e()])]), _vm._v(" "), _c('li', [_c('div', {
    staticClass: "stu_rank first"
  }, [(_vm.topRankList.length > 0) ? _c('span', {
    staticClass: "stu_pic"
  }, [_c('img', {
    attrs: {
      "src": _vm.topRankList[0].headIconOffline
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.topRankList.length > 0) ? _c('p', {
    staticClass: "stu_info"
  }, [_c('span', {
    staticClass: "name"
  }, [_vm._v(_vm._s(_vm.formatStudentName(_vm.topRankList[0])))]), _vm._v(" "), _c('span', {
    staticClass: "time"
  }, [_vm._v(_vm._s(_vm.formatElapseTime(_vm.topRankList[0], _vm.topRankList[0].submitTime)))])]) : _vm._e()])]), _vm._v(" "), _c('li', [_c('div', {
    staticClass: "stu_rank third"
  }, [(_vm.topRankList.length > 2) ? _c('span', {
    staticClass: "stu_pic"
  }, [_c('img', {
    attrs: {
      "src": _vm.topRankList[2].headIconOffline
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.topRankList.length > 2) ? _c('p', {
    staticClass: "stu_info"
  }, [_c('span', {
    staticClass: "name"
  }, [_vm._v(_vm._s(_vm.formatStudentName(_vm.topRankList[2])))]), _vm._v(" "), _c('span', {
    staticClass: "time"
  }, [_vm._v(_vm._s(_vm.formatElapseTime(_vm.topRankList[2], _vm.topRankList[2].submitTime)))])]) : _vm._e()])])])]), _vm._v(" "), _c('div', {
    staticClass: "chart_title"
  }, [_vm._v(_vm._s(_vm.i18n.answerSummary))]), _vm._v(" "), _c('div', {
    staticClass: "chart_main"
  }, [_c('ul', {
    staticClass: "percentage_tit"
  }, [_c('li', [_c('em', {
    staticClass: "chart_text"
  }, [_vm._v(_vm._s(_vm.i18n.completed))])]), _vm._v(" "), _c('li', [_c('em', {
    staticClass: "chart_text"
  }, [_vm._v(_vm._s(_vm.i18n.unfinished))])])]), _vm._v(" "), _c('ul', {
    staticClass: "percentage_data"
  }, [_c('li', [_c('div', {
    staticClass: "chart_body"
  }, [_c('span', {
    staticClass: "progress",
    style: ({
      'width': _vm.finishedPercent + '%'
    })
  })]), _vm._v(" "), _c('span', {
    staticClass: "percentage"
  }, [_c('em', {
    staticClass: "num"
  }, [_vm._v(_vm._s(_vm.finished))]), _vm._v("/"), _c('em', {
    staticClass: "den"
  }, [_vm._v(_vm._s(_vm.total))])])]), _vm._v(" "), _c('li', [_c('div', {
    staticClass: "chart_body"
  }, [_c('span', {
    staticClass: "progress",
    style: ({
      'width': _vm.unfinishedPercent + '%'
    })
  })]), _vm._v(" "), _c('span', {
    staticClass: "percentage"
  }, [_c('em', {
    staticClass: "num"
  }, [_vm._v(_vm._s(_vm.unfinished))]), _vm._v("/"), _c('em', {
    staticClass: "den"
  }, [_vm._v(_vm._s(_vm.total))])])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4d26ff74", module.exports)
  }
}

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat_wood ndui__component--header"
  }, [_c('div', {
    staticClass: "component_time"
  }, [_c('div', {
    staticClass: "time_default "
  }, [_c('b', {
    staticClass: "time_text"
  }, [_vm._v(_vm._s(_vm.i18n.time) + "：")]), _vm._v(" "), _c('span', {
    staticClass: "time_m"
  }, [_c('em', [_vm._v(_vm._s(_vm.spendTime.minutes))])]), _vm._v(" "), _c('b', {
    staticClass: "time_text"
  }, [_vm._v(_vm._s(_vm.i18n.minute))]), _vm._v(" "), _c('i', [_vm._v(":")]), _vm._v(" "), _c('span', {
    staticClass: "time_s"
  }, [_c('em', [_vm._v(_vm._s(_vm.spendTime.seconds))])]), _vm._v(" "), _c('b', {
    staticClass: "time_text"
  }, [_vm._v(_vm._s(_vm.i18n.second))])])]), _vm._v(" "), _c('div', {
    staticClass: "component_upload"
  }, [_c('b', {
    staticClass: "upload_text"
  }, [_vm._v(_vm._s(_vm.i18n.submit_num) + "：")]), _vm._v(" "), _c('span', {
    staticClass: "num _num"
  }, [_vm._v(_vm._s(_vm.submitCount))]), _vm._v("/"), _c('span', {
    staticClass: "_count"
  }, [_vm._v(_vm._s(_vm.totalNum))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-511bceac", module.exports)
  }
}

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "ndui-pop com_pop stat_wood ndui__component--pop-roster pop_roster"
  }, [_c('div', {
    staticClass: "ndui-pop-mask"
  }), _vm._v(" "), _c('div', {
    staticClass: "ndui-pop-square"
  }, [_c('div', {
    staticClass: "ndui-pop-wrap"
  }, [_c('a', {
    staticClass: "ndui-pop-close right",
    attrs: {
      "href": "javascript:;"
    },
    on: {
      "click": function($event) {
        _vm.close()
      }
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "ndui-pop-close left",
    attrs: {
      "href": "javascript:;"
    },
    on: {
      "click": function($event) {
        _vm.close()
      }
    }
  }), _vm._v(" "), _c('staticA', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.statisticsType === 'A'),
      expression: "statisticsType === 'A'"
    }],
    attrs: {
      "timestamp": _vm.timestamp,
      "data": _vm.data,
      "i18n": _vm.i18n,
      "env": _vm.env
    }
  }), _vm._v(" "), _c('staticB', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.statisticsType === 'B'),
      expression: "statisticsType === 'B'"
    }],
    attrs: {
      "timestamp": _vm.timestamp,
      "data": _vm.data,
      "i18n": _vm.i18n,
      "env": _vm.env
    }
  }), _vm._v(" "), _c('staticC', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.statisticsType === 'C'),
      expression: "statisticsType === 'C'"
    }],
    attrs: {
      "timestamp": _vm.timestamp,
      "data": _vm.data,
      "i18n": _vm.i18n,
      "env": _vm.env
    }
  })], 1)])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-63d08983", module.exports)
  }
}

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat_wood ndui__component--fillblank",
    class: {
      'state_details': _vm.showDetails
    },
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('popUpWindow', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isShowPopUpWindow),
      expression: "isShowPopUpWindow"
    }],
    attrs: {
      "data": _vm.ppWData,
      "timestamp": _vm.timestamp,
      "i18n": _vm.i18n,
      "env": _vm.env
    },
    on: {
      "closePopUpWindow": _vm.closePPW
    }
  }), _vm._v(" "), (_vm.questionType !== 'wordpuzzles') ? _c('div', {
    staticClass: "fillblank-component-body"
  }, [_c('ul', {
    staticClass: "histogram"
  }, [_vm._l((_vm.statistics.itemKey), function(value) {
    return _c('li', {
      staticClass: "hist_list",
      class: {
        'red': _vm.statistics.percent[value - 1] < 30, 'on': _vm.clickItemData.index === value
      }
    }, [_c('a', {
      staticClass: "hist_a",
      attrs: {
        "href": "javascript:;"
      },
      on: {
        "click": function($event) {
          _vm.showPPW(value)
        }
      }
    }, [_c('span', {
      staticClass: "letter"
    }, [_vm._v(_vm._s(value))]), _vm._v(" "), _c('span', {
      staticClass: "text"
    }, [_c('em', [_vm._v(_vm._s(_vm.statistics.percent[value - 1]))]), _vm._v("%")])])])
  }), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.hasUnfinishedUser),
      expression: "hasUnfinishedUser"
    }],
    staticClass: "hist_list noanswer"
  }, [_c('a', {
    staticClass: "hist_a",
    attrs: {
      "href": "javascript:;"
    },
    on: {
      "click": function($event) {
        _vm.showPPW('unfinished')
      }
    }
  }, [_c('span', {
    staticClass: "letter"
  }, [_vm._v(_vm._s(_vm.i18n.no_answer))]), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_c('em', [_vm._v(_vm._s(_vm.unfinishedData.unfinishedPercent))]), _vm._v("%")])])])], 2)]) : _vm._e(), _vm._v(" "), (_vm.questionType === 'wordpuzzles') ? _c('div', {
    staticClass: "fillblank-word-component-body"
  }, [_c('p', {
    staticClass: "histogram-tit"
  }, [_vm._v(_vm._s(_vm.i18n.landscape) + "：")]), _vm._v(" "), _c('ul', {
    staticClass: "histogram"
  }, _vm._l((_vm.statistics.itemKey.horizontal), function(value) {
    return _c('li', {
      staticClass: "hist_list",
      class: {
        'red': _vm.statistics.percent.horizontal[value - 1] < 30, 'on': _vm.clickItemData.type === 'h' && _vm.clickItemData.index === value
      }
    }, [_c('a', {
      staticClass: "hist_a",
      attrs: {
        "href": "javascript:;"
      },
      on: {
        "click": function($event) {
          _vm.showPPW(value, 'horizontal')
        }
      }
    }, [_c('span', {
      staticClass: "letter"
    }, [_vm._v(_vm._s(value))]), _vm._v(" "), _c('span', {
      staticClass: "text"
    }, [_c('em', [_vm._v(_vm._s(_vm.statistics.percent.horizontal[value - 1]))]), _vm._v("%")])])])
  })), _vm._v(" "), _c('p', {
    staticClass: "histogram-tit"
  }, [_vm._v(_vm._s(_vm.i18n.portrait) + "：")]), _vm._v(" "), _c('ul', {
    staticClass: "histogram"
  }, _vm._l((_vm.statistics.itemKey.vertical), function(value) {
    return _c('li', {
      staticClass: "hist_list",
      class: {
        'red': _vm.statistics.percent.vertical[value - 1] < 30, 'on': _vm.clickItemData.type === 'v' && _vm.clickItemData.index === value
      }
    }, [_c('a', {
      staticClass: "hist_a",
      attrs: {
        "href": "javascript:;"
      },
      on: {
        "click": function($event) {
          _vm.showPPW(value, 'vertical')
        }
      }
    }, [_c('span', {
      staticClass: "letter"
    }, [_vm._v(_vm._s(value))]), _vm._v(" "), _c('span', {
      staticClass: "text"
    }, [_c('em', [_vm._v(_vm._s(_vm.statistics.percent.vertical[value - 1]))]), _vm._v("%")])])])
  })), _vm._v(" "), _c('ul', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.hasUnfinishedUser),
      expression: "hasUnfinishedUser"
    }],
    staticClass: "histogram"
  }, [_c('li', {
    staticClass: "hist_list noanswer"
  }, [_c('a', {
    staticClass: "hist_a",
    attrs: {
      "href": "javascript:;"
    },
    on: {
      "click": function($event) {
        _vm.showPPW('unfinished')
      }
    }
  }, [_c('span', {
    staticClass: "letter"
  }, [_vm._v(_vm._s(_vm.i18n.no_answer))]), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_c('em', [_vm._v(_vm._s(_vm.unfinishedData.unfinishedPercent))]), _vm._v("%")])])])])]) : _vm._e()], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6d259b1f", module.exports)
  }
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat_wood ndui__component--stu-chart",
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('div', {
    staticClass: "charts_title",
    class: {
      'minus_scroll': _vm.students.length > 10
    }
  }, [_c('ul', [_c('li', [_c('em', [_vm._v(_vm._s(_vm.i18n.ranking))])]), _vm._v(" "), _c('li', [_c('em', [_vm._v(_vm._s(_vm.i18n.name))])]), _vm._v(" "), _c('li', [_c('em', [_vm._v(_vm._s(_vm.i18n.time))])])])]), _vm._v(" "), _c('div', {
    staticClass: "charts_main rank_flower_ctrol"
  }, [_c('ul', {
    staticClass: "scrollbar_style_light"
  }, _vm._l((_vm.students), function(item, index) {
    return _c('li', {
      class: {
        'overtime': item.answerStatus !== 'finished'
      }
    }, [_c('span', {
      staticClass: "num"
    }, [_c('em', [_vm._v(_vm._s(_vm.initRank(item, index)))])]), _vm._v(" "), _c('span', {
      staticClass: "fullname"
    }, [_c('ins', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (false),
        expression: "false"
      }],
      staticClass: "stat_com_icon_flag"
    }), _vm._v(" "), _c('em', [_vm._v(_vm._s(_vm.formatStudentName(item)))])]), _vm._v(" "), _c('span', {
      staticClass: "taketime"
    }, [_c('em', [_vm._v(_vm._s(_vm.formatElapseTime(item, item.submitTime)))])]), _vm._v(" "), (_vm.env !== 'web') ? _c('div', {
      staticClass: "charts_send_flower",
      attrs: {
        "studentName": item.studentName,
        "studentId": item.studentId
      },
      on: {
        "click": function($event) {
          _vm.sendFlower($event)
        }
      }
    }) : _vm._e()])
  }))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-9eefa8c4", module.exports)
  }
}

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat_wood ndui__component--pointsort",
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('div', {
    staticClass: "com_answer_img_content"
  }, [_c('div', {
    staticClass: "pointsort_board"
  }, [_c('div', {
    staticClass: "pointsort_imgwrap",
    staticStyle: {
      "margin-left": "-200px",
      "margin-top": "-150px",
      "width": "400px",
      "height": "300px"
    }
  }, [_vm._l((_vm.itemMap), function(value, index) {
    return _c('span', {
      class: {
        'point': value.index < 10, 'point-two': value.index > 9 && value.index < 100, 'point-three': value.index > 99
      },
      style: ({
        'left': value.cx,
        'top': value.cy
      })
    }, [_c('em', [_vm._v(_vm._s(value.index))])])
  }), _vm._v(" "), _vm._l((_vm.lines), function(value, index) {
    return _c('span', {
      staticClass: "line",
      style: (value)
    })
  })], 2)])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-af89128c", module.exports)
  }
}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat_wood ndui__component--linkup",
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('div', {
    staticClass: "com_answer_content pos_top box_square"
  }, [_c('div', {
    staticClass: "com_answer_l"
  }, [_c('ul', {
    staticClass: "com_answer_cosspan_l"
  }, [_vm._l((_vm.rightAnswers.answerLeft), function(item, index) {
    return _c('li', [(_vm.itemMap[item].item_type === 'text') ? _c('span', {
      class: {
        'font_mid': _vm.itemMap[item].text.trim().length > 9 &&
          _vm.itemMap[item].text.trim().length <= 12,
          'font_small': _vm.itemMap[item].text.trim().length > 12
      }
    }, [_vm._v("\n            " + _vm._s(_vm.itemMap[item].text.trim()) + "\n          ")]) : _vm._e(), _vm._v(" "), (_vm.itemMap[item].item_type === 'image') ? _c('img', {
      attrs: {
        "src": _vm.itemMap[item].href
      }
    }) : _vm._e()])
  }), _vm._v(" "), _vm._l((_vm.rightAnswers.answerLeft), function(item, index) {
    return _c('a', {
      staticClass: "link_up_line",
      style: ({
        'top': 2.3 + 5 * index + 'em'
      })
    })
  })], 2), _vm._v(" "), _c('ul', {
    staticClass: "com_answer_cosspan_r"
  }, _vm._l((_vm.rightAnswers.answerLeft), function(item, index) {
    return _c('li', [(_vm.itemMap[_vm.correctAnswer[item]].item_type === 'text') ? _c('span', {
      class: {
        'font_mid': _vm.itemMap[_vm.correctAnswer[item]].text.trim().length > 9 &&
          _vm.itemMap[_vm.correctAnswer[item]].text.trim().length <= 12,
          'font_small': _vm.itemMap[_vm.correctAnswer[item]].text.trim().length > 12
      }
    }, [_vm._v("\n            " + _vm._s(_vm.itemMap[_vm.correctAnswer[item]].text.trim()) + "\n          ")]) : _vm._e(), _vm._v(" "), (_vm.itemMap[_vm.correctAnswer[item]].item_type === 'image') ? _c('img', {
      attrs: {
        "src": _vm.itemMap[item].href
      }
    }) : _vm._e()])
  }))]), _vm._v(" "), _c('span', {
    staticClass: "com_answer_m"
  }), _vm._v(" "), _c('div', {
    staticClass: "com_answer_r"
  }, [_c('ul', {
    staticClass: "com_answer_cosspan_l"
  }, [_vm._l((_vm.rightAnswers.answerRight), function(item, index) {
    return _c('li', [(_vm.itemMap[item].item_type === 'text') ? _c('span', [_vm._v("\n            " + _vm._s(_vm.itemMap[item].text.trim()) + "\n          ")]) : _vm._e(), _vm._v(" "), (_vm.itemMap[item].item_type === 'image') ? _c('img', {
      attrs: {
        "src": _vm.itemMap[item].href
      }
    }) : _vm._e()])
  }), _vm._v(" "), _vm._l((_vm.rightAnswers.answerRight), function(item, index) {
    return _c('a', {
      staticClass: "link_up_line",
      style: ({
        'top': 2.3 + 5 * index + 'em'
      })
    })
  })], 2), _vm._v(" "), _c('ul', {
    staticClass: "com_answer_cosspan_r"
  }, _vm._l((_vm.rightAnswers.answerRight), function(item, index) {
    return _c('li', [(_vm.itemMap[_vm.correctAnswer[item]].item_type === 'text') ? _c('span', {
      class: {
        'font_mid': _vm.itemMap[_vm.correctAnswer[item]].text.trim().length > 9 &&
          _vm.itemMap[_vm.correctAnswer[item]].text.trim().length <= 12,
          'font_small': _vm.itemMap[_vm.correctAnswer[item]].text.trim().length > 12
      }
    }, [_vm._v("\n            " + _vm._s(_vm.itemMap[_vm.correctAnswer[item]].text.trim()) + "\n          ")]) : _vm._e(), _vm._v(" "), (_vm.itemMap[_vm.correctAnswer[item]].item_type === 'image') ? _c('img', {
      attrs: {
        "src": _vm.itemMap[item].href
      }
    }) : _vm._e()])
  }))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-b342de82", module.exports)
  }
}

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "pop_wrap",
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('div', {
    staticClass: "content state_tab"
  }, [_c('div', {
    staticClass: "statistic-item-content"
  }, [_c('div', {
    staticClass: "roster_title"
  }), _vm._v(" "), _c('ul', {
    staticClass: "uicom_tabbox",
    on: {
      "click": function($event) {
        _vm.switchTab($event)
      }
    }
  }, [_c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.tabsVisible.right),
      expression: "tabsVisible.right"
    }],
    class: {
      'on': _vm.currentTab === 'right'
    }
  }, [_c('a', {
    staticClass: "tabbox_a _right",
    attrs: {
      "href": "javascript:;"
    }
  }, [_vm._v(_vm._s(_vm.i18n.answerright))])]), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.tabsVisible.wrong),
      expression: "tabsVisible.wrong"
    }],
    class: {
      'on': _vm.currentTab === 'wrong'
    }
  }, [_c('a', {
    staticClass: "tabbox_a _wrong",
    attrs: {
      "href": "javascript:;"
    }
  }, [_vm._v(_vm._s(_vm.i18n.answerwrong))])]), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.tabsVisible.unfinished),
      expression: "tabsVisible.unfinished"
    }],
    class: {
      'on': _vm.currentTab === 'unfinished'
    }
  }, [_c('a', {
    staticClass: "tabbox_a _unfinished",
    attrs: {
      "href": "javascript:;"
    }
  }, [_vm._v(_vm._s(_vm.i18n.noAnswer))])])])]), _vm._v(" "), _c('div', {
    staticClass: "rostertab"
  }, [_c('ul', {
    staticClass: "comui-list-roster"
  }, _vm._l((_vm.currentPageStuList), function(stu, index) {
    return _c('li', {
      key: index
    }, [_vm._m(0, true), _vm._v(" "), _c('span', {
      staticClass: "name"
    }, [_vm._v(_vm._s(stu))])])
  })), _vm._v(" "), _c('div', {
    staticClass: "ndui-pager"
  }, [_c('a', {
    staticClass: "ndui-pager-a ndui-pager-previous",
    class: {
      'off': _vm.currentPage === 1
    },
    on: {
      "click": _vm.prePage
    }
  }), _vm._v(" "), _vm._l((_vm.pages), function(p) {
    return _c('a', {
      staticClass: "ndui-pager-a",
      class: {
        'on': _vm.currentPage === p
      },
      on: {
        "click": function($event) {
          _vm.go2Page(p)
        }
      }
    }, [_vm._v("\n          " + _vm._s(p) + "\n        ")])
  }), _vm._v(" "), _c('a', {
    staticClass: "ndui-pager-a ndui-pager-next",
    class: {
      'off': _vm.currentPage === _vm.pages
    },
    on: {
      "click": _vm.nextPage
    }
  })], 2), _vm._v(" "), (_vm.env !== 'web') ? _c('div', {
    staticClass: "com_send_flower_wrap"
  }, [_c('p', {
    staticClass: "flow_text"
  }, [_c('em', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.i18n.send_lower))])]), _vm._v(" "), _c('div', {
    staticClass: "com_send_flower",
    on: {
      "click": _vm.sendFlower
    }
  })]) : _vm._e()])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', {
    staticClass: "head"
  }, [_c('span', {
    staticClass: "head-img"
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-d5d68870", module.exports)
  }
}

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat_wood ndui__component--ranking",
    attrs: {
      "xmlns:v-bind": "http://www.w3.org/1999/xhtml"
    }
  }, [_c('div', {
    staticClass: "tab_box _tab_box",
    on: {
      "click": function($event) {
        _vm.switchTab($event)
      }
    }
  }, [_c('a', {
    staticClass: "btn_tab _tab_rank",
    class: {
      'on': _vm.isShowTabRank
    },
    attrs: {
      "href": "javascript:;"
    }
  }, [_vm._v(_vm._s(_vm.i18n.rank))]), _vm._v(" "), _c('a', {
    staticClass: "btn_tab _tab_correct_answer",
    class: {
      'on': !_vm.isShowTabRank
    },
    attrs: {
      "href": "javascript:;"
    }
  }, [_vm._v(_vm._s(_vm.i18n.rightAnswer))])]), _vm._v(" "), _c('div', {
    staticClass: "com_rank_layout"
  }, [_c('div', {
    staticClass: "tabmain _rank_main",
    class: {
      'on': _vm.isShowTabRank
    }
  }, [_c('div', {
    staticClass: "ranking_title"
  }, [_c('em'), _vm._v(_vm._s(_vm.i18n.rank) + "\n      ")]), _vm._v(" "), _c('div', {
    staticClass: "gradient_xbg"
  }, [_c('div', {
    staticClass: "overview"
  }, [_c('podium', {
    attrs: {
      "i18n": _vm.i18n,
      "statistics": _vm.statistics,
      "converted": _vm.data.value.convertedData
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "rank_charts"
  }, [_c('stu-list', {
    attrs: {
      "env": _vm.env,
      "i18n": _vm.i18n,
      "students": _vm.submitSutList,
      "data": _vm.data
    }
  })], 1)])]), _vm._v(" "), _c('div', {
    staticClass: "tabmain _answer_main",
    class: {
      'on': !_vm.isShowTabRank
    }
  }, [_c('div', {
    staticClass: "com_answer_title"
  }, [_c('em'), _vm._v(_vm._s(_vm.i18n.rightAnswer) + "\n      ")]), _vm._v(" "), _c('div', {
    staticClass: "com_answer_main"
  }, [_c('div', {
    staticClass: "com_answer_box"
  }, [_c('div', {
    staticClass: "com_answer_wp"
  }, [(_vm.questionType === 'linkup' || _vm.questionType === 'memorycard') ? _c('linkup', {
    attrs: {
      "i18n": _vm.i18n,
      "data": _vm.data
    }
  }) : _vm._e(), _vm._v(" "), (_vm.questionType === 'pointsequencing') ? _c('point-sort', {
    attrs: {
      "i18n": _vm.i18n,
      "data": _vm.data
    }
  }) : _vm._e(), _vm._v(" "), (_vm.questionType === 'SpellPoem') ? _c('spellPoem', {
    attrs: {
      "i18n": _vm.i18n,
      "data": _vm.data
    }
  }) : _vm._e()], 1)])])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ff6174ca", module.exports)
  }
}

/***/ })
/******/ ]);