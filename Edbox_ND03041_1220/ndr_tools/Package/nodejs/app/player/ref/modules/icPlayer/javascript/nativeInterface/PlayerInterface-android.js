var Bridge = function() {
    var runtimeMapping = {
        "AndroidInterface": "mobile",
        "PCInterface": "pc"
    };
    var bridgeInterface, runtime = "";
    for (var name in runtimeMapping) {
        if (name in window) {
            bridgeInterface = window[name];
            runtime = runtimeMapping[name];
            break;
        }
    }

    var o = {
        init: function() {
        },
        destory: function() {
            for (var key in o.listenerMap) {
                o.unRegisterListener(o.listenerMap[key].eventName, key);
            }
            o.listenerMap = {};
        },
        getRuntime: function() {
            return runtime;
        },
        callNative: function() {
            var number_of_params = arguments.length;
            var className = arguments[0];
            var methodName = arguments[1];
            var argLen = number_of_params - 2;
            switch (argLen) {
                case 0:
                    return bridgeInterface.invokeMethod(className + "." + methodName);
                case 1:
                    if (typeof(bridgeInterface) !== 'undefined' && typeof(bridgeInterface.printLog) !== 'undefined') {
                        bridgeInterface.printLog('==IcPlayer Player callNative: ' + className + "." + methodName + " arg=" + JSON.stringify(arguments[2]));

                        result = bridgeInterface.invokeMethod(className + "." + methodName, JSON.stringify(arguments[2]));
                        return JSON.parse(result);
                    }
                default:
                    console.log("too mach arguments");
                    break;
            }
        },
        callNativeAsync: function() {
            var number_of_params = arguments.length;
            var className = arguments[0];
            var methodName = arguments[1];
            var func = arguments[2];
            var callBack;
            if (typeof func == "function") {
                callBack = o.addCallBackFunc(func);
                return bridgeInterface.invokeMethodAsync(className + "." + methodName, callBack);
            } else {
                var param = func;
                func = arguments[3];
                if (typeof func != "function") {
                    o.log("invalid call back func");
                    return;
                }
                callBack = o.addCallBackFunc(func);
                return bridgeInterface.invokeMethodAsync(className + "." + methodName, callBack, JSON.stringify(param));
            }
        },
        registerListener: function(eventName, func, scope) {
            o.log("register event for " + eventName);
            var key = o.addListenerFunc(eventName, func, scope);
            var callBack = "Bridge.listenerInvokeFromNative('" + key + "',==param==)";
            bridgeInterface.registerListener(eventName, callBack);
            return key;
        },
        unRegisterListener: function(eventName, key) {
            o.log("unRegister event for " + eventName);
            var callBack = "Bridge.listenerInvokeFromNative('" + key + "',==param==)";
            o.removeListenerFunc(key);
            bridgeInterface.unRegisterListener(eventName, callBack);
        },
        addListener: function(eventName, func, scope) {
            o.log("register event for " + eventName);
            var key = o.addListenerFunc(eventName, func, scope);
            var callBack = "Bridge.listenerInvokeFromNative('" + key + "',==param==)";
            bridgeInterface.registerListener(eventName, callBack);
            return key;
        },
        removeListener: function(eventName, key) {
            o.log("unRegister event for " + eventName);
            var callBack = "Bridge.listenerInvokeFromNative('" + key + "',==param==)";
            o.removeListenerFunc(key);
            bridgeInterface.unRegisterListener(eventName, callBack);
        },
        log: function(str) {
            bridgeInterface.printLog(str)
        },
        takePhoto: function() {

        },
        goPage: function(index) {
            bridgeInterface.prepareSwitchPage(JSON.stringify(index));
        },
        funcMap: {},
        listenerMap: {},
        listenerMapByEvent: {},
        listenerInvokeFromNative: function(callId, param) {
            o.log("param=" + param);
            var listener = o.listenerMap[callId];
            //var func = o.listenerMap[callId];
            if (listener == undefined || listener.callback == undefined) {
                o.log("call back func not found");
                o.listenerMap[callId] = null;
                return;
            }
            listener.callback.call(listener.scope, param);
        },
        callBackFromNative: function(callId, param) {
            o.log("param=" + param);
            var func = o.funcMap[callId];
            if (func == undefined) {
                o.log("call back func not found");
                o.funcMap[callId] = null;
                return;
            }
            func(param);
            o.funcMap[callId] = null;
        },
        addListenerFunc: function(eventName, func, scope) {
            var key = o.randomkey(10);
            o.listenerMap[key] = {
                eventName: eventName,
                callback: func,
                scope: scope == undefined ? window : scope
            };
            return key;
            //return "Bridge.listenerInvokeFromNative('"+key+"',==param==)";
        },
        removeListenerFunc: function(key) {
            delete o.listenerMap[key];
        },
        addCallBackFunc: function(func) {
            var key = o.randomkey(10);
            o.funcMap[key] = func;
            return "Bridge.callBackFromNative('" + key + "',==param==)";
        },
        onPageLoaded: function() {
            bridgeInterface.onPageLoaded();
        },
        onMainLoaded: function() {
            bridgeInterface.onMainLoaded();
        },
        randomkey: function(l) {
            var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
            var tmp = "";
            var timestamp = new Date().getTime();
            for (var i = 0; i < l; i++) {
                tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
            }
            return timestamp + tmp;
        },
        loadApk: function(apk) {

        }

    }
    return o;
}();
Bridge.init();
Bridge.GetQueryString=function(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
if(Bridge.GetQueryString('iframeBridge')==='true'&& typeof window.top){
    window.top.Bridge=Bridge;
}