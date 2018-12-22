(function (global) {
    "use strict";
    var Logger = {};
    Logger.VERSION = "1.2.0";
    var contextualLoggersByNameMap = {};
    // Super exciting object merger-matron 9000 adding another 100 bytes to your download.
    var merge = function () {
        var args = arguments, target = args[0], key, i;
        for (i = 1; i < args.length; i++) {
            for (key in args[i]) {
                if (!(key in target) && args[i].hasOwnProperty(key)) {
                    target[key] = args[i][key];
                }
            }
        }
        return target;
    };
    // Helper to define a logging level object; helps with optimisation.
    var defineLogLevel = function (value, name) {
        return {value: value, name: name};
    };

    // Predefined logging levels.
    Logger.DEBUG = defineLogLevel(1, 'DEBUG');
    Logger.INFO = defineLogLevel(2, 'INFO');
    Logger.TIME = defineLogLevel(3, 'TIME');
    Logger.WARN = defineLogLevel(4, 'WARN');
    Logger.ERROR = defineLogLevel(8, 'ERROR');
    Logger.OFF = defineLogLevel(99, 'OFF');

    // Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
    // of each other.
    var ContextualLogger = function (defaultContext) {
        this.context = defaultContext;
        this.setLevel(defaultContext.filterLevel);
        this.log = this.info;  // Convenience alias.
        //日志信息处理者
        this.logHandler = [];
    };

    ContextualLogger.prototype = {
        // Changes the current logging level for the logging instance.
        setLevel: function (newLevel) {
            // Ensure the supplied Level object looks valid.
            if (newLevel && "value" in newLevel) {
                this.context.filterLevel = newLevel;
            }
        },
        // Is the logger configured to output messages at the supplied level?
        enabledFor: function (lvl) {
            var filterLevel = this.context.filterLevel;
            return lvl.value >= filterLevel.value;
        },
        debug: function () {
            this.invoke(Logger.DEBUG, arguments);
        },
        info: function () {
            this.invoke(Logger.INFO, arguments);
        },
        warn: function () {
            this.invoke(Logger.WARN, arguments);
        },
        error: function () {
            this.invoke(Logger.ERROR, arguments);
        },
        time: function (label) {
            if (typeof label === 'string' && label.length > 0) {
                this.invoke(Logger.TIME, [label, 'start']);
            }
        },
        timeEnd: function (label) {
            if (typeof label === 'string' && label.length > 0) {
                this.invoke(Logger.TIME, [label, 'end']);
            }
        },
        /**
         * 添加新的Log处理器
         * @param handler Log的处理函数
         * @param options Log的选项; 包括: level和formatter
         */
        appendHandler: function(handler, options) {
            if(options === undefined) {
                options = {};
            }
            //如果没有设置日志等级,使用默认的日志等级
            if(options.level === undefined) {
                options.level = this.context.filterLevel;
            }
            //如果没有设置formatter; 使用默认的formatter
            if(options.formatter === undefined) {
                options.formatter = defaultMessageFormatter;
            }
            //如果Handler和Formatter都存在且都是有效函数
            if(handler != undefined && typeof handler === "function") {
                if(options.formatter && typeof options.formatter === "function") {
                    $.extend(this.context, {level: options.level});
                    this.logHandler.push({handle: handler, level: options.level, formatter: options.formatter});
                }
            }
        },
        // Invokes the logger callback if it's not being filtered.
        invoke: function (level, msgArgs) {
            var self = this;
            $.each(this.logHandler, function(index, item) {
                try {
                    if(level.value >= item.level.value) {
                        var messages = Array.prototype.slice.call(msgArgs);
                        item.formatter(messages, self.context);
                        item.handle(messages, self.context);
                    }
                }catch(e) {
                    //如果有错误,continue
                    console.log("LOGGER ERROR!", e);
                    return true;
                }
            });
        }
    };

    // Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
    // default context and log handler.
    Logger.get = function (name) {
        if(name == "Unknown") {
            return new ContextualLogger(merge({name: name, filterLevel: Logger.OFF }));
        }
        if(contextualLoggersByNameMap[name]) {
            contextualLoggersByNameMap[name].logHandler = [];
            return contextualLoggersByNameMap[name];
        } else {
            contextualLoggersByNameMap[name] = new ContextualLogger(merge({name: name, filterLevel: Logger.OFF }));
            return contextualLoggersByNameMap[name];
        }
    };

    function defaultMessageFormatter(messages, context) {
        // Prepend the logger's name to the log message for easy identification.
        if (context.name) {
            messages.unshift(new Date().toUTCString(), "(" + context.level.name + ")", "[" + context.name + "]");
        }
    }
    // Export to popular environments boilerplate.
    /*if (typeof define === 'function' && define.amd) {
     define(Logger);
     }
     else */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Logger;
    }
    else {
        Logger._prevLogger = global.Logger;

        Logger.noConflict = function () {
            global.Logger = Logger._prevLogger;
            return Logger;
        };

        global.Logger = Logger;
    }
}(this));
