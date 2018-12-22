var PresenterEventType = {
    IC_PLAYER_EVENT: "ic_player_event",   //ICPlayer事件总线类型
    NATIVE_EVENT: "native_event",         //APP原生事件类型
    PPT_NATIVE_EVENT: "ppt_native_event"  //应用于101PPT的原生事件类型
};

var PresenterType = {
    PRESENTER_COMPONENT: "presenterComponent",          //功能组件
    PRESENTER_LAYOUT: "presenterLayout",                //布局组件
    PRESENTER_CONTROLLER: "presenterController",        //Presenter的控制器
    PRESENTER_FILTER: "presenterFilter"                 //Presenter事件筛选器
};

var SubPresenterType = {
    INTERACTION_QUESTION: "interactionQuestion",        //互动习题组件
    UTILITY_COMPONENT: "utilityComponent"               //通用组件
};

var PresenterAPPBridge = {
    SmartClass: "com.nd.pad.icr.ui.IcrJsBridge",
    Homework: "com.nd.android.homework.ui.HomeworkJsBridge"
};

var __ConstVariable = {
    PresenterType: {
        PRESENTER_COMPONENT: "presenterComponent",          //功能组件
        PRESENTER_LAYOUT: "presenterLayout",                //布局组件
        PRESENTER_CONTROLLER: "presenterController",        //Presenter的控制器
        PRESENTER_FILTER: "presenterFilter"                 //Presenter事件筛选器
    },
    SubPresenterType: {
        INTERACTION_QUESTION: "interactionQuestion",        //互动习题组件
        UTILITY_COMPONENT: "utilityComponent"               //通用组件
    },
    PresenterAPPBridge: {
        SmartClass: "com.nd.pad.icr.ui.IcrJsBridge",
        Homework: "com.nd.android.homework.ui.HomeworkJsBridge"
    }
};

var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
var __assign = (this && this.__assign) || Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

(function () {
    var initializing = false, fnTest = /xyz/.test(function () {
        xyz;
    }) ? /\b_super\b/ : /.*/;
    // 基類的實現
    this.Class = function () {
    };
    // 創建一個新類,繼承至Class類
    Class.extend = function (prop, className) {
        var _super = this.prototype;
        //構建一個基類(衹是創建實例,但不執行構造函數)
        initializing = true;
        var prototype = new this();
        initializing = false;
        // 將子類的屬性拷貝到新的原型之中
        for (var name in prop) {
            // 檢查是否是覆蓋一個已經存在的方法
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;
                        //創建一個_super對象
                        this._super = _super[name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }
        // 基類的構造函數,通过player传入presenter的名称
        function Class(presenterId) {
            if (!initializing && this.$init) {
                this._clazz = presenterId != undefined ? presenterId : (className != undefined ? className : 'Unknown');
                this._CLASS_ID_ = randomWord(false, 16);  //类的唯一ID
                this._APP_DOMAIN_ = undefined;            //类所属作用域
                this.$init.apply(this, arguments);
            }
        }

        function randomWord(randomFlag, min, max) {
            var str = "",
                range = min,
                arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

            // 随机产生
            if (randomFlag) {
                range = Math.round(Math.random() * (max - min)) + min;
            }
            var pos;
            for (var i = 0; i < range; i++) {
                pos = Math.round(Math.random() * (arr.length - 1));
                str += arr[pos];
            }
            return str;
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;
        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;
        // And make this class extendable
        Class.extend = arguments.callee;
        return Class;
    };
})();

/**
 * 基础Presenter类
 */
var BasicPresenter = Class.extend({
    //初始函数
    $init: function () {
        this.playerController = null;
        this.eventBus = null;
        this.icPlayerEvents = [];
        this.nativeListener = {};
        this.currentRuntime = player.getPlayerServices().getRuntime();
        this.urlParams = {};
        this.basePath = "";
        //是否为PPTShell
        this.isPPTShell = false;
        //是否为作业系统
        this.isHomework = false;
        //是否为Unity嵌入
        this.isEmbedUnity = false;
        this.currentLanguage = 'zh';
        this.isApp = this.currentRuntime == icCreatePlayer.RUNTIME.STUDENT_MOBILE || this.currentRuntime == icCreatePlayer.RUNTIME.TEACHER_MOBILE;
        this.isWeb = this.currentRuntime == icCreatePlayer.RUNTIME.WEB;
        this.isPC = this.currentRuntime == icCreatePlayer.RUNTIME.TEACHER_PC;
        this.isTeacher = this.currentRuntime == icCreatePlayer.RUNTIME.TEACHER_MOBILE;
        this.isStudent = this.currentRuntime == icCreatePlayer.RUNTIME.STUDENT_MOBILE;
        //可以被代理的系统事件
        this._canAttachEvents = ['blur', 'focus', 'mousedown', 'mousemove', 'mouseup', 'click', 'pageLeave'];
        //定义Presenter事件的统一变量
        if (!window.$PresenterEvent) {
            window.$PresenterEvent = {};
        }
        //将CLASS_ID放入metaInfo中
        if (this.metaInfo) {
            $.extend(this.metaInfo, {_CLASS_ID_: this._CLASS_ID_});
        } else {
            this.metaInfo = {_CLASS_ID_: this._CLASS_ID_};
        }
        //添加默认的日志记录器
        this.logger = Logger.get(this._clazz);
        //初始化多语言翻译器
        this._initializeTranslator();
    },
    //对presenter的setUrlParams的统一实现
    setUrlParams: function (urlParams) {
        this.urlParams = urlParams;
        if (urlParams["sys"] != undefined) {
            var sys = urlParams["sys"].toLowerCase();
            this.isPPTShell = (sys === "pptshell");
            this.isHomework = (sys === "homework") || (sys === "exercise");
            this.isEmbedUnity = (sys === "embedunity");
        }
        if (urlParams['_lang_'] != undefined) {
            this.currentLanguage = urlParams["_lang_"].toLowerCase();
        }
        //将颗粒服务的初始化延迟到setUrlParams来进行,避免有些变量没有被设置
        this._initModuleService();
    },
    setBasePath: function (path) {
        this.basePath = path;
    },
    //对icplayer中setPlayerController方法的统一实现;同时将该对象常用的功能对外部Presenter做一次封装
    setPlayerController: function (controller) {
        this.playerController = controller;
        this.eventBus = controller.getEventBus();
    },
    //接管icplayer的事件总线在收到事件后的处理函数
    //使外部Presenter能够以更为清晰的方式进行事件响应
    onEventReceived: function (name, data, target) {
        var self = this;
        //如果是被代理的系统事件
        if ($.inArray(name, this._canAttachEvents) >= 0) {
            var methodName = '$on' + name[0].toUpperCase() + name.substring(1, name.length);
            self[methodName].call(self, target, data);
        }
        //正常的事件
        else {
            if (!this.icPlayerEvents) {
                return;
            }
            $.each(this.icPlayerEvents, function (index, value) {
                if (value.name === name) {
                    $.each(value.callbacks, function (i, v) {
                        //将数据交给响应对象进行处理
                        v.call(self, data, name);
                    });
                    return false;
                }
            });
        }
    },
    /**
     * 默认日志输出函数
     */
    $defaultLoggerHandle: function (message, context) {
        switch (context.level.name) {
            case 'DEBUG':
                console.debug(message);
                break;
            case 'INFO':
                console.info(message);
                break;
            case 'WARN':
                console.warn(message);
                break;
            case 'ERROR':
                console.error(message);
                break;
            default:
                console.log(message);
                break;
        }
    },
    //添加事件监听器,封装icplayer的EventBus和NativeBridge添加监听过程;
    // 使外部Presenter能够以统一的方式添加这两种不同实现方式的事件监听
    $addEventListener: function (name, type, callback) {
        var self = this;
        if (callback == null || typeof callback !== 'function') {
            throw Error('callback is null or not a function');
        }
        if (type === PresenterEventType.IC_PLAYER_EVENT) {
            //如果要附加被系统代理的事件,直接返回
            if ($.inArray(name, this._canAttachEvents) >= 0) {
                throw Error('player use $attachDelegateEvent to attach icplayer delegated event!');
            }
            var hasExists = false;
            for (var i = 0; i < this.icPlayerEvents.length; i++) {
                if (this.icPlayerEvents[i].name === name) {
                    this.icPlayerEvents[i].callbacks.push(callback);
                    hasExists = true;
                    break;
                }
            }
            if (!hasExists) {
                this.icPlayerEvents.push({name: name, callbacks: [callback]});
                this.eventBus.addEventListener(name, self);
            }
        } else if (type === PresenterEventType.NATIVE_EVENT) {
            if (window.Bridge && window.Bridge.registerListener) {
                var eventKey = Bridge.registerListener(name, callback, self);
                this.nativeListener[eventKey] = eventKey;
            }
        }
    },
    /**
     * 附加被icPlayer代理的系统事件
     * @param eventType 事件类型
     * @param selectors 触发事件的选择器(数组)
     * @param callback 附加事件的回调函数
     */
    $attachDelegateEvent: function (eventType, selectors, callback) {
        //参数修正
        if (arguments.length === 2) {
            callback = selectors;
            selectors = [];
        }

        //如果Selectors不是一个Array; 或为空时
        if (!(selectors instanceof Array)) {
            return;
        }
        //只能attach指定的事件
        if ($.inArray(eventType, this._canAttachEvents) < 0) {
            throw Error('argument eventType must one of ' + this._canAttachEvents);
        }
        var self = this;
        //添加到icplayer的事件总线中
        this.eventBus.addEventListener(eventType, {
            onEventReceived: function (name, data, target) {
                if (callback != undefined) {
                    callback.call(self, target, data);
                }
            }
        }, ((selectors.length) ? {target: selectors} : {}));
    },
    //移除事件监听器,包括icplayer的EventBus和NativeBridge
    $removeEventListener: function () {
        if (window.Bridge && window.Bridge.unRegisterListener) {
            var self = this;
            $.each(this.nativeListener, function (k, v) {
                window.Bridge.unRegisterListener(k, self.nativeListener[k]);
            });
            this.nativeListener = null;
        }
        while (this.icPlayerEvents.length > 0) {
            this.icPlayerEvents.pop();
        }
        this.icPlayerEvents = null;
        this._attachedEvents = null;
    },
    //发送事件,包括icplayer的EventBus和NativeBridge
    //使外部Presenter能够以同样的方式进行事件发布
    $dispatchEvent: function (name, type, data) {
        if (type === PresenterEventType.IC_PLAYER_EVENT) {
            this.eventBus.sendEvent(name, data == null ? {} : data);
            return true;
        } else if (type === PresenterEventType.NATIVE_EVENT || type === PresenterEventType.PPT_NATIVE_EVENT) {
            if (window.Bridge && window.Bridge.callNative) {
                var bridgeName = "";
                //如果是作业系统
                if (this.isHomework) {
                    bridgeName = PresenterAPPBridge.Homework;
                } else {
                    bridgeName = PresenterAPPBridge.SmartClass;
                }
                if (type === PresenterEventType.NATIVE_EVENT) {
                    //APP原生事件类型
                    return Bridge.callNative(bridgeName, name, data == undefined ? {} : data);
                } else if (type === PresenterEventType.PPT_NATIVE_EVENT) {
                    //应用于101PPT的原生事件类型,需要做二次包装
                    return Bridge.callNative(bridgeName, 'sendEvent', {
                        eventName: name,
                        eventData: data == undefined ? {} : data
                    })
                }
            }
            return null;
        }
    },
    //国际化资源翻译
    $translate: function (key, params) {
        return this.$translator.translate(key, params);
    },
    //对icplayer提供的require过程进行二次封装, 使调用过程统一且更友好
    //返回Deffer对象,在require确实完成后在执行回调函数
    $requireComponent: function (name, properties, rendTo, layout) {
        if (this.playerController) {
            var deffer = $.Deferred();
            //默认ID的值为name
            var id = name;
            //在Properties中查找是否存在'__Id'的字段
            if (properties != null && properties.length > 0) {
                $.each(properties, function (index, item) {
                    if (item.name == '__Id') {
                        id = item.value;
                    }
                });
            }
            //设置require的配置信息
            var requireSetting = {
                addonId: name,
                id: id,
                layout: {
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%"
                },
                properties: properties == null ? [] : properties,
                callback: function (presenter) {
                    if (presenter._handleOver_) {
                        var pendings = [];
                        $.each(presenter._handleOver_, function (index, item) {
                            pendings.push(item);
                        });
                        $.when.apply($, pendings).done(function () {
                            deffer.resolve(presenter);
                        });
                    } else {
                        deffer.resolve(presenter);
                    }
                }
            };
            if (layout && layout != null) {
                //合并布局配置
                $.extend(requireSetting.layout, layout);
                //
                if (layout.zindex != undefined) {
                    requireSetting["z-index"] = layout.zindex;
                }
            }

            if (rendTo != null) {
                $.extend(requireSetting, {renderTo: rendTo});
            }
            this.playerController.require(requireSetting);
			
			//加入作用域管理，则以作用域ID分域管理 与ComponentLoader 1.0.5的新增特性支持同步
			var _APP_DOMAIN_ = this._APP_DOMAIN_;
			if(!!_APP_DOMAIN_) {
				deffer.done(function(presenter) {
					if(!!presenter) {
						presenter._APP_DOMAIN_ = _APP_DOMAIN_;
					}
				});
			}
            return deffer;
        }
        return null;
    },
    //创建指定方法的代理
    _createDelegate: function (fn, args, isAppendArgs, scope, exceptionHandler) {
        return function () {
            //如果创建的时候没有输入参数，使用调用的参数
            var callArgs = args || arguments;
            if (isAppendArgs === true) {
                //arguments数组化
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }
            try {
                return fn.apply(scope || window, callArgs);
            } catch (e) {
                if ($.isFunction(exceptionHandler)) {
                    return exceptionHandler(e);
                } else {
                    throw e;
                }
            }
        };
    },
    //顺序执行函数列表
    //[{fn:function(){},args:[],scope:this}]
    _runSequence: function (fnConfigs, name) {
        var $promise = $.Deferred().resolve();
        var runIndex;
        fnConfigs.forEach(function (fnConfig, index) {
            if ($.isFunction(fnConfig.fn)) {
                $promise = $promise.then(function () {
                    try {
                        runIndex = index;
                        var callArgs = fnConfig.args || arguments;
                        if (fnConfig.isAppendArgs === true) {
                            //arguments数组化
                            callArgs = Array.prototype.slice.call(arguments, 0);
                            callArgs = callArgs.concat(fnConfig.args);
                        }
                        return fnConfig.fn.apply(fnConfig.scope || window, callArgs);
                    } catch (e) {
                        return $.Deferred(function (deferred) {
                            deferred.reject(e);
                        });
                    }
                }, function (message) {
                    return message;
                });
            }
        });
        return $promise.fail(function (e) {
            console.error('执行%s,第%d个错误 : %o', name || "任务", ++runIndex, e || "");
        });
    },
    //初始化多语言翻译器
    _initializeTranslator: function () {
        var self = this;
        self.$translatorDeferred = $.Deferred();
        self.$translator = {
            /**
             * 设置语言包
             * @param data
             */
            'setData': function (data) {
                this._data = data;

                if (!this._data) this._data = {};

                self.$translatorDeferred.resolve();
            },
            /**
             * 获取键值对应的文本内容
             * @param key 键值
             * @param params 参数数组，对应替换的{d+}占位符
             * @returns {*}
             */
            'translate': function (key, params) {
                if (!!this._data && this._data.hasOwnProperty(key)) {
                    try {
                        var message = this._data[key];
                        if ($.isArray(params) && params.length > 0) {
                            message = message.replace(/\{\d+\}/g, function ($0) {
                                var index = parseInt($0.substring(1, $0.length - 1));
                                if (index < params.length) {
                                    return params[index];
                                }

                                return $0;
                            });
                        } else if (typeof params === 'string') {
                            message = message.replace(/\{0\}/g, params);
                        }

                        return message;
                    } catch (e) {
                        console.error(e);
                    }
                }

                return 'ERROR';
            }
        };
    },

    //初始化颗粒服务
    _initModuleService: function () {
        //对注入到当前对象中的服务类进行统一的实例化
        if (this.__ModuleServices != undefined) {
            var me = this;
            $.each(this.__ModuleServices, function (key, value) {
                if (!me[key]) {
                    if (value.hasFilter) {
                        //如果对象是一个函数
                        var clazz = value.filter.call(me);
                        me[key] = clazz != undefined ?
                            new window["__ServiceComponent"][value.namespace][clazz] :
                            undefined;
                    } else {
                        //如果对象是一个类
                        me[key] = new value.clazz();
                    }
                    if (me[key]["setContext"]) {
                        me[key]["setContext"].call(me[key], me);
                    }
                }
            });
            //删除定义的ModuleService
            //delete this.__proto__.__ModuleServices;
        }
    }
});

/**
 * 基础启动器类
 */
var BasicLauncher = (function () {

    var requireType = ["controller", "layout", "component"];

    var getFnName = function (name, prefix) {
        return name.replace(/^\w/, function ($0) {
            return prefix + $0.toUpperCase();
        });
    };

    var getterFn = function (name) {
        return getFnName(name, 'get');
    };

    var setterFn = function (name) {
        return getFnName(name, 'set');
    };

    var createReg = function (array) {
        return (array.length) ? new RegExp('^(' + array.join("|") + ')$') : /^$/;
    };
    //读取页面上所有module的配置数据，提供dataParse的pageModels属性
    var processBeforeRun = function (presenter) {
        var key = presenter.__model.$.presenterId;
        var list = this.pageModels[key] || (this.pageModels[key] = []);
        list.push(presenter.__model);
    };
    //根据autowired完成属性的自动注入
    var moduleInject = function (module, data) {
        module.value = module.value || {};
        (module.autowired || []).forEach(function (propName) {
            if (!(propName in module.value)) {
                module.value[propName] = data[propName];
            }
        });
    };

    //model属性值整理
    var moduleValueParse = (function () {
        //属性值类型
        var moduleValueType = {
            'json': function (item) {
                var value = item.value;
                return $.isPlainObject(value) || $.isArray(value);
            },
            'boolean': function (item) {
                var value = item.value;
                var result = (typeof value === 'boolean');
                result && (item.value = value.toString());
                return result
            }
        };

        return function (module) {
            var values = [], item, key, type;
            for (key in module.value) {
                item = {name: key, value: module.value[key]};
                for (type in moduleValueType) {
                    if (moduleValueType[type](item)) {
                        //匹配到类型后就不再循环判断
                        item.type = type;
                        break;
                    }
                }
                item.type || (item.type = 'string');
                values.push(item);
            }
            module.value = values;
        };
    })();

    var regConfigAttrName = /^(layout|controller|layout|component|getEnvironment|presenterParserMapping|dataParse)$/;

    //生成require的配置数据
    var buildRequireConfig = function (data) {
        var self = this;
        this.presenterParserMapping || (this.presenterParserMapping = {});
        //获取默认的配置
        var config = $.extend(true, {}, BasicLauncher.config.global[self.defaultConfig]);
        this.getEnvironment = this.getEnvironment || config.getEnvironment;
        $.each(config, function (name, value) {
            if (!regConfigAttrName.test(name)) {
                self[name] = value;
            }
        });
        var env = this.getEnvironment();
        var loadConfig = {};
        //根据类型依次生成配置
        requireType.forEach(function (type) {
            config[type] = config[type] || [];
            loadConfig[type] = [];
            var fn = self[getterFn(type)];
            if ($.isFunction(fn)) {
                //整合默认的配置
                config[type] = config[type].concat(fn.call(self, data) || []);
            }
            if (!$.isArray(config[type])) {
                //修正，允许返回单个
                config[type] = [config[type]];
            }
            config[type].forEach(function (module) {
                if (typeof module === 'string') {
                    //如果是key，从BasicLauncherConfing读取配置,同时调用解析接口进行自定义配置
                    var moduleName = module;
					//Fix BUG 149042 WHY
					var modules = $.extend(true, {}, BasicLauncher.config[type][module]);
                    module = modules;
                    module.name = moduleName;
                }
                if (module.ref) {
                    module = $.extend(module, BasicLauncher.config[type][module.ref]);
                    module.name = module.ref;
                }

                //数据根据名称自动注入
                moduleInject.call(self, module, data);
                //根据name，调用解析接口进行自定义配置
                var moduleParse = self.presenterParserMapping[module.name];
                ($.isFunction(moduleParse)) && (moduleParse(module, data));
                moduleValueParse(module);
                //renderTo解析
                if (module.renderTo) {
                    if ($.isPlainObject(module.renderTo)) {
                        module.renderTo = module.renderTo[env];
                    }
                }
                if ($.isArray(module.applyTo)) {
                    //如果设置了applyTo,判断当前环境是否需要加载
                    var reg = createReg(module.applyTo);
                    if (reg.test(env)) {
                        loadConfig[type].push(module);
                    }
                } else {
                    loadConfig[type].push(module);
                }
            });
        });
        //目前有且只有一个layout
        if (loadConfig.layout.length !== 1) {
            throw  'layout配置错误，layout有且只有一个';
        }
        return loadConfig;
    };

    //根据配置输入require
    var requirePresenter = (function () {
        //批量加载
        //requireConfig {'getRenderTo':fn,'layoutConfig':config,'afterLoad':fn}
        var requireList = function (list, requireConfig) {
            var self = this;
            var loaders = [];
            var nameIndexMapping = {};
            list.forEach(function (presenterConfig, index) {
                if (presenterConfig.name) {
                    nameIndexMapping[presenterConfig.name] = index;
                }

                var renderToEl = requireConfig.getRenderTo && requireConfig.getRenderTo(presenterConfig);
                //显式的声明为false就不再载入渲染
                if (renderToEl !== false) {
                    loaders.push(self.$requireComponent(presenterConfig.presenter, presenterConfig.value, renderToEl, requireConfig.layoutConfig || {})
                        .then(function (presenter) {
                            //计算service,避免对basic造成影响，使用config存储service对象
                            presenterConfig.instance = presenter;
                            var _service = presenter.getService && presenter.getService() || {};
                            return ($.isFunction(_service.then) ? $.Deferred(function (_defer) {
                                _service.then(function () {
                                    _defer.resolve(presenter._service_);
                                })
                            }).promise() : _service);
                        })
                        .then(function (_service) {
                            presenterConfig.service = _service;
                            return presenterConfig.instance;
                        }));
                }
            });
            return $.when.apply(window, loaders).then(function () {
                //整理依赖
                list.forEach(function (config) {
                    if (config.depends) {
                        $.each(config.depends, function (key, value) {
                            var fn = config.service[setterFn(key)];
                            if ($.isFunction(fn)) {
                                fn.call(config.service, list[nameIndexMapping[value]].service);
                            }
                        });
                    }
                });
                //完成afterLoad接口，提供个性化定制
                return requireConfig.afterLoad(list);
            });
        };

        //目前有且只有一个layout，定义全局方便调用
        var layoutService;

        //不同类型的加载控制
        var loader = {
            'controller': {
                getRenderTo: function () {
                },
                layoutConfig: {left: 0, top: 0, width: 0, height: 0},
                afterLoad: function (list) {
                }
            },
            'layout': {
                getRenderTo: function () {
                },
                layoutConfig: {zindex: 200},
                afterLoad: function (list) {
                    //目前有且只有一个layout
                    layoutService = list[0].service;
                    return layoutService.initContainer();
                }
            },
            'component': {
                getRenderTo: function (config) {
                    var container = config.renderTo && layoutService.getContainer(config.renderTo);
                    if (container && container.length) {
                        return container;
                    } else {
                        //组件如果在layout中没有明确的渲染就不加载
                        return false;
                    }
                },
                layoutConfig: {},
                afterLoad: function (list) {
                }
            }
        };

        //根据依赖整理加载顺序
        //var analyzeByDepends = function (presenterConfig, mapping, result) {
        //    //计算该位的基本值
        //    var flag = Math.pow(2, presenterConfig.index);
        //    //判断该配置是否处理过，反正依赖嵌套等问题，一个config只处理一次
        //    if (!(result.bit & flag)) {
        //        //将位设置成已经加载
        //        result.bit = result.bit | flag;
        //        if (presenterConfig.depends) {
        //            for (var key in presenterConfig.depends) {
        //                //递归收集排序
        //                analyzeByDepends(mapping[presenterConfig.depends[key]], mapping, result);
        //            }
        //        }
        //        result.push(presenterConfig);
        //    }
        //};

        return function (config) {
            var requireTasks = [];
            //根据配置的顺序依次加载
            var self = this;
            requireType.forEach(function (type) {
                //根据原先的需求要求串行加载controller，layout，component
                requireTasks.push({
                    fn: function () {
                        return requireList.call(self, config[type], loader[type]);
                    }
                });
            });
            this._runSequence(requireTasks, '启动器加载任务').always(function () {
                //发送全部完成的事件通知("PresenterLoaded");
                self.$dispatchEvent("PresenterLoaded", PresenterEventType.IC_PLAYER_EVENT, {});
                if (self.playerController.getPlayerEvent != undefined) {
                    self.playerController.getPlayerEvent().dispatch("PresenterLoaded");
                    self.playerController.getPlayerEvent().dispatch('PLAYER.PRINTSCREEN');
                }
            });
        };
    })();

    //启动器的基类
    return BasicPresenter.extend({
        /**
         * 构造函数
         * @param config
         *     {
         *       'launcherName':string,
         *       'dataParse':fn,
         *       'getEnvironment':fn,
         *       'getEnvironment':fn,
         *       'getComponent':fn,
         *       'getLayout':fn,
         *       'defaultConfig':'',
         *       'presenterParserMapping':{}
         *     }
         */
        $init: function (config) {
            $.extend(this, config);
            this._super();
            if (config.launcherName) {
                this._clazz = config.launcherName;
            }
            this.pageModels = {};
            var self = this;
            this.__interface = {
                processBeforeRun: self._createDelegate(processBeforeRun, [], true, self),
                'wrap': function () {
                    //防止覆盖,启动器不渲染
                    return document.createElement('div');
                }
            };
        },
        run: function (view, model) {
            var self = this;
            return this._runSequence([
                {fn: self.dataParse, args: [model, self.pageModels], scope: self},
                {
                    fn: function (data) {
                        var config = buildRequireConfig.call(self, data);
                        requirePresenter.call(self, config);
                    }
                }], '启动器任务');
        },
        _start: function (view, model) {
            var self = this;
            return this._runSequence([
                {fn: self.dataParse, args: [model, self.pageModels], scope: self},
                {
                    fn: function (data) {
                        var config = buildRequireConfig.call(self, data);
                        requirePresenter.call(self, config);
                    }
                }], '启动器任务');
        }
    });
})();

/**
 * 基础控制器类
 */
var BaseController = BasicPresenter.extend({
    $init: function () {
        this._super();
        this.serviceList = {};
        this.layoutService = null;
        this._interceptPresenter = [];
        this._interceptOnce = true;
        //这里将icplayer提供的__interface对象做了一次转换,提供更为业务化的接口
        var self = this;
        this.__interface = {
            processBeforeRun: self._createDelegate(self._processBeforeRun, [], true, self),
            processAfterRun: self._createDelegate(self._processAfterRun, [], true, self)
        };
        this._deffers_ = {};
    },
    /**
     * 传入的Service是否需要被当前的控制所使用
     * @param metaInfo 元数据信息
     * @param service 组件的服务对象
     */
    $isUnderControl: function (metaInfo, service) {
        return false;
    },
    /**
     * 在当前Presenter执行icplayer的run方法之前执行
     * @param interfaceName
     * @param metaInfo Presenter的元数据信息
     * @param service Presenter提供的Service对象
     */
    $beforePresenterRun: function (interfaceName, metaInfo, service) {
    },
    /**
     * 在当前Presenter执行icplayer的run方法之后执行
     * @param interfaceName
     * @param metaInfo Presenter的元数据信息
     * @param service Presenter提供的Service对象
     */
    $afterPresenterRun: function (interfaceName, metaInfo, service) {
    },
    /**
     * 设置LayoutService后执行
     * @param service layout组件的服务对象
     */
    $afterSetLayoutService: function (service) {
    },
    /**
     * 获取控制器接口方法列表,这些方法需要实现在Service中,用于接口发现
     * @returns {Array} 方法列表,默认为空
     */
    $getInterfaceMethods: function () {
        return [];
    },
    _processBeforeRun: function (presenter) {
        var self = this;
        //如果Presenter包含getService方法
        if (presenter.getService && presenter.metaInfo) {
            //if(presenter.metaInfo.type == 'presenterComponent') {
            //    console.log('[_processBeforeRun]', self._clazz, presenter.metaInfo, presenter._CLASS_ID_);
            //}
            var metaInfo = presenter.metaInfo;
            var service = presenter.getService();
            //如果是deffer对象
            if (service != undefined && service['then']) {
                var identify = metaInfo.name + '@' + metaInfo._CLASS_ID_;
                if (this._deffers_[identify] == undefined) {
                    this._deffers_[identify] = $.Deferred();
                }
                service.then(function () {
                    self._processService(metaInfo, presenter._service_);
                    if (self._deffers_[identify] && self._deffers_[identify].state() == "pending") {
                        self._deffers_[identify].resolve();
                    }
                });
            } else {
                self._processService(metaInfo, service);
            }
            //如果Presenter是功能组件
            if (metaInfo.type == PresenterType.PRESENTER_COMPONENT) {
                var identify = metaInfo.name + '@' + metaInfo._CLASS_ID_;
                if (presenter._handleOver_ === undefined) {
                    presenter._handleOver_ = {};
                }
                if (presenter._handleOver_[self.metaInfo.name + "-" + identify] === undefined) {
                    presenter._handleOver_[self.metaInfo.name + "-" + identify] = $.Deferred();
                }
            }
        }
    },
    _processService: function (metaInfo, service) {
        //如果是布局组件,做一个特殊处理
        if (metaInfo.type == PresenterType.PRESENTER_LAYOUT) {
			//若加入作用域管理，则以作用域ID分域管理 依赖于ComponentLoader 1.0.5的新增特性支持；这里只对布局组件Service做了这个方面控制，并未彻底实现
			if(!this._APP_DOMAIN_ || (service.presenter && service.presenter._APP_DOMAIN_ === this._APP_DOMAIN_)) {
				this.layoutService = service;
				this.$afterSetLayoutService(service)
			}
        }
        //检查当前的Service是否有实现对应接口
        var interfaces = this.$getInterfaceMethods();
        var self = this;
        //如果接口是一个数组对象,且长度大于0
        if (Array.isArray(interfaces) && interfaces.length > 0) {
            $.each(interfaces, function (k, setting) {
                var identify = setting.interface + '@' + metaInfo._CLASS_ID_;
                if (self.serviceList[identify] == undefined) {
                    self.serviceList[identify] = [];
                }
                self._discoverInterface(setting, metaInfo, service);
            });
        }
        //如果传入的Service还符合自定义判断结果
        if (this.$isUnderControl(metaInfo, service)) {
            if (self.serviceList["__Custom"] == undefined) {
                self.serviceList["__Custom"] = [];
            }
            var exists = false;
            //检查是否已经添加过了
            $.each(this.serviceList["__Custom"], function (k, v) {
                if (v.metaInfo.name == metaInfo.name) {
                    exists = true;
                    return false;
                }
            });
            if (exists == false) {
                this.serviceList["__Custom"].push({metaInfo: metaInfo, service: service});
                //执行$beforePresenterRun
                this.$beforePresenterRun("__Custom", metaInfo, service);
            }
        }
    },
    _discoverInterface: function (setting, metaInfo, service) {
        var isImplement = true;
        var interfaceIdentify = setting.interface + '@' + metaInfo._CLASS_ID_;
        if (setting.methods.length == 0) {
            isImplement = false;
        } else {
            $.each(setting.methods, function (k, v) {
                if (service[v] == undefined) {
                    isImplement = false;
                    return false;
                }
            });
        }
        //如果接口有实现
        if (isImplement) {
            var exists = false;
            //检查是否已经添加过了
            $.each(this.serviceList[interfaceIdentify], function (k, v) {
                if (v.metaInfo.name == metaInfo.name && v.metaInfo._CLASS_ID_ == metaInfo._CLASS_ID_) {
                    exists = true;
                    return false;
                }
            });
            if (exists == false) {
                this.serviceList[interfaceIdentify].push({metaInfo: metaInfo, service: service});
                this.$beforePresenterRun(setting.interface, metaInfo, service);
            }
        }
    },
    _processAfterRun: function (presenter) {
        //如果Presenter包含getService方法
        if (presenter.getService && presenter.metaInfo) {
            var self = this;
            //if (presenter.metaInfo.type == 'presenterComponent') {
            //    console.log('[_processAfterRun]', self._clazz, presenter.metaInfo, presenter._CLASS_ID_);
            //}
            var metaInfo = presenter.metaInfo, classIdentify = metaInfo.name + '@' + metaInfo._CLASS_ID_;
            if (this._deffers_[classIdentify]) {
                this._deffers_[classIdentify]
                    .then(function () {
                        self._processServiceAfterRun(metaInfo, classIdentify);
                        if (metaInfo.type === PresenterType.PRESENTER_COMPONENT && presenter._handleOver_) {
                            presenter._handleOver_[self.metaInfo.name + "-" + classIdentify].resolve();
                        }
                    });
            } else {
                self._processServiceAfterRun(metaInfo, classIdentify);
                if (metaInfo.type === PresenterType.PRESENTER_COMPONENT && presenter._handleOver_) {
                    presenter._handleOver_[self.metaInfo.name + "-" + classIdentify].resolve();
                }
            }
        }
    },
    _processServiceAfterRun: function (metaInfo, classIdentify) {
        var self = this;
        if ($.inArray(classIdentify, self._interceptPresenter) >= 0) {
            if (self._interceptOnce) {
                return;
            }
        } else {
            self._interceptPresenter.push(classIdentify);
        }
        $.each(self.serviceList, function (name, list) {
            //将表示位分割
            var temp = name.split('@'), interfaceName = temp[0], classId = temp[1];
            $.each(list, function (i, s) {
                if ((s.metaInfo.name + '@' + s.metaInfo._CLASS_ID_) == (metaInfo.name + '@' + metaInfo._CLASS_ID_)) {
                    self.$afterPresenterRun(interfaceName, s.metaInfo, s.service);
                }
            });
        });
    }
});