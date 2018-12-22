~ function (global) {

	// class extends
	if (global && !global.__extends) {
		global.__extends = function (d, b) {
			for (var p in b)
				if (b.hasOwnProperty(p)) d[p] = b[p];

			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	}

	// decorate
	if (global && !global.__decorate) {
		global.__decorate = function (decorators, target, key, desc) {
			var c = arguments.length,
				r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
				d;
			if (typeof Reflect === "object" && typeof Reflect['decorate'] === "function") r = Reflect['decorate'](decorators, target, key, desc);
			else
				for (var i = decorators.length - 1; i >= 0; i--)
					if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
			return c > 3 && r && Object.defineProperty(target, key, r), r;
		};
	}

	// assign
	if (global && !global.__assign) {
		global.__assign = function (t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s)
					if (Object.prototype.hasOwnProperty.call(s, p))
						t[p] = s[p];
			}
			return t;
		};
	}

	// awaiter
	if (global && !global.__awaiter) {
		global.__awaiter = function (thisArg, _arguments, P, generator) {
			return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
				function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
				function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
		}
	}

	// generator
	if (global && global.__generator) {
		global.__generator = function (thisArg, body) {
			var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
			return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
			function verb(n) { return function (v) { return step([n, v]); }; }
			function step(op) {
				if (f) throw new TypeError("Generator is already executing.");
				while (_) try {
					if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
					if (y = 0, t) op = [0, t.value];
					switch (op[0]) {
						case 0: case 1: t = op; break;
						case 4: _.label++; return { value: op[1], done: false };
						case 5: _.label++; y = op[1]; op = [0]; continue;
						case 7: op = _.ops.pop(); _.trys.pop(); continue;
						default:
							if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
							if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
							if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
							if (t[2]) _.ops.pop();
							_.trys.pop(); continue;
					}
					op = body.call(thisArg, _);
				} catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
				if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
			}
		}
	}

	/**
	 * object.assign
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	 */
	if (typeof Object.assign != 'function') {
		Object.assign = function (target, varArgs) { // .length of function is 2
			if (target == null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}
			var to = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];
				if (nextSource != null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) { // Avoid bugs when hasOwnProperty is shadowed
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		};
	}

	/**
	 * Array.from
	 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
	 */
	if (typeof Array.from != 'function') {
		Array.from = (function () {
			var toStr = Object.prototype.toString;
			var isCallable = function (fn) {
				return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
			};
			var toInteger = function (value) {
				var number = Number(value);
				if (isNaN(number)) {
					return 0;
				}
				if (number === 0 || !isFinite(number)) {
					return number;
				}
				return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
			};
			var maxSafeInteger = Math.pow(2, 53) - 1;
			var toLength = function (value) {
				var len = toInteger(value);
				return Math.min(Math.max(len, 0), maxSafeInteger);
			};
			return function from(arrayLike /*, mapFn, thisArg */ ) {
				var C = this;
				var items = Object(arrayLike);
				if (arrayLike == null) {
					throw new TypeError('Array.from requires an array-like object - not null or undefined');
				}
				var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
				var T;
				if (typeof mapFn !== 'undefined') {
					if (!isCallable(mapFn)) {
						throw new TypeError('Array.from: when provided, the second argument must be a function');
					}
					if (arguments.length > 2) {
						T = arguments[2];
					}
				}
				var len = toLength(items.length);
				var A = isCallable(C) ? Object(new C(len)) : new Array(len);
				var k = 0;
				var kValue;
				while (k < len) {
					kValue = items[k];
					if (mapFn) {
						A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
					} else {
						A[k] = kValue;
					}
					k += 1;
				}
				A.length = len;
				return A;
			};
		}());
	}

	/**
	 * Array.isArray
	 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	 */
	if (typeof Array.isArray !== 'function') {
		Array.isArray = function (arg) {
			return Object.prototype.toString.call(arg) === '[object Array]';
		};
	}

	/**
	 * Array.prototype.includes
	 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
	 */
	if (typeof Array.prototype.includes !== 'function') {
		Object.defineProperty(Array.prototype, 'includes', {
			value: function (searchElement, fromIndex) {
				if (this == null) {
					throw new TypeError('"this" is null or not defined');
				}
				var o = Object(this);
				var len = o.length >>> 0;
				if (len === 0) {
					return false;
				}
				var n = fromIndex | 0;
				var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
				while (k < len) {
					if (o[k] === searchElement) {
						return true;
					}
					k++;
				}
				return false;
			}
		});
	}

	/**
	 * Array.prototype.find
	 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find
	 */
	if (typeof Array.prototype.find !== 'function') {
		Array.prototype.find = function (predicate) {
			'use strict';
			if (this == null) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var list = Object(this);
			var length = list.length >>> 0;
			var thisArg = arguments[1];
			var value;

			for (var i = 0; i < length; i++) {
				value = list[i];
				if (predicate.call(thisArg, value, i, list)) {
					return value;
				}
			}
			return undefined;
		};
	}

	/**
	 * Array.prototype
	 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
	 */
	if (typeof Array.prototype.findIndex !== 'function') {
		Array.prototype.findIndex = function (predicate) {
			if (this === null) {
				throw new TypeError('Array.prototype.findIndex called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var list = Object(this);
			var length = list.length >>> 0;
			var thisArg = arguments[1];
			var value;

			for (var i = 0; i < length; i++) {
				value = list[i];
				if (predicate.call(thisArg, value, i, list)) {
					return i;
				}
			}
			return -1;
		};
	}

}(this);