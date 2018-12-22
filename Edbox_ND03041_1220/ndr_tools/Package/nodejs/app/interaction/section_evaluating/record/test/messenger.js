/**
 *     __  ___
 *    /  |/  /___   _____ _____ ___   ____   ____ _ ___   _____
 *   / /|_/ // _ \ / ___// ___// _ \ / __ \ / __ `// _ \ / ___/
 *  / /  / //  __/(__  )(__  )/  __// / / // /_/ //  __// /
 * /_/  /_/ \___//____//____/ \___//_/ /_/ \__, / \___//_/
 *                                        /____/
 *
 * @description MessengerJS, 支持iframe跨域/同域通信；支持window.open的窗口与父窗口的同域通信、跨域仅e10+、firfox26+、chrome.
 * @author biqing kwok
 * @modify tangyanxin 添加object类型数据的支持
 * @version 2.0
 * @license release under MIT license
 */

window.Messenger = (function(){

    // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突,消息前缀 用来区分JSON字符串
    // !注意 消息前缀应使用字符串类型
    // 不支持传Object时，Object转为JSON字符串传递，收到时再转回Object
    var prefix = "[PROJECT_NAME]",
        supportPostMessage = 'postMessage' in window,
        isMockIE7 = (supportPostMessage && document.documentMode === 7),//模拟的ie7 有postMessage属性但是不能用，且navigator不能挂方法 需要特殊处理
        isIE8OrIE9 = document.documentMode === 8||document.documentMode === 9,
        noSupportPostObject = isIE8OrIE9 || isMockIE7,//ie8、ie9只支持传字符串
        prefixForJson = "PS_JSON:";

    // Target 类, 消息对象
    function Target(target, name, type){
        var errMsg = '';
        if(arguments.length < 2){
            errMsg = 'target error - target and name are both requied';
        } else if (typeof target != 'object'){
            errMsg = 'target error - target itself must be window object';
        } else if (typeof name != 'string'){
            errMsg = 'target error - target name must be string type';
        }
        if(errMsg){
            throw new Error(errMsg);
        }
        this.target = target;
        this.name = name;
        this.type = type;
    }

    Target.prototype.send = function (msg) {
        var _this =this, isCrossDomain = (function(){
            try{
                _this.target.document;
                return false;
            } catch(err){
                return true;
            }
        })();

        try{
            //跨窗口只有ie10+、firfox26+、chrome才支持跨域通信(跨窗口的跨域通信要用到MessageChannel)
            if((this.type == "windowOpen")&&!isCrossDomain){
                this.target.Messenger[prefix](msg);
            }else{
                // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀  支持传字符串和Object
                if (supportPostMessage) {
                    // IE8+ 以及现代浏览器支持
                    this.target.postMessage(invokeMsg(msg), '*');
                } else {
                    // 兼容IE 6/7
                    var targetFunc = window.navigator[prefix];
                    if (typeof targetFunc == 'function') {
                        targetFunc(invokeMsg(msg), window);
                    } else {
                        throw new Error("target callback function is not defined");
                    }
                };
            }
        }catch(err){
            window.console && console.log("messener's function send:"+ err);
        }

    }

    function invokeMsg(msg) {
        if (typeof msg == 'object') {
            var data = {
                prefix: prefix,
                data: msg
            };
            try {
                data = noSupportPostObject ? prefixForJson + JSON.stringify(data) : data;
            } catch (err) {
                window.console && console.log("转换成JSON字符串时出错");
            }
            return data;
        }else{
            return prefix+msg;
        }
    }

    // 信使类
    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
    function Messenger(messengerName, projectName){
        this.targets = {};
        this.name = messengerName;
        this.listenFunc = [];
        prefix = (projectName || prefix)+"_:_:";
        if(typeof prefix !== 'string') {
            prefix = prefix.toString();
        }
        this.initListen();
    }

    // 添加一个消息对象
    Messenger.prototype.addTarget = function(target, name, type){
        var targetObj = new Target(target, name, type);
        this.targets[name] = targetObj;
    };

    // 初始化消息监听
    Messenger.prototype.initListen = function(){
        var self = this;
        var generalCallback = function(msg){
            if ( supportPostMessage ){
                msg = msg.data;
            }
            if (noSupportPostObject && msg.indexOf(prefixForJson)===0) {
                try{
                    msg = msg.slice(prefixForJson.length);
                    msg = JSON.parse(msg);
                } catch (err) {
                    window.console && console.log("JSON解析错误");
                }
            }
            if(typeof msg == 'object' && msg.data){
                if(msg.prefix === prefix)
                    msg = msg.data;
                else{
                    return;
                }
            }else{
                // 剥离消息前缀
                if (msg && msg.toString().indexOf(prefix) === 0) {
                    msg = msg.slice(prefix.length);
                } else {
                    return;
                }
            }

            for(var i = 0; i < self.listenFunc.length; i++){
                self.listenFunc[i](msg);
            }
        };

        if ( supportPostMessage ){
            if ( 'addEventListener' in document ) {
                window.addEventListener('message', generalCallback, false);
            } else if ( 'attachEvent' in document ) {
                window.attachEvent('onmessage', generalCallback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator[prefix] = generalCallback;
        }


        window.Messenger[prefix] = function(msg){
            for(var i = 0; i < self.listenFunc.length; i++){
                self.listenFunc[i](msg);
            }
        };
    };

    // 监听消息
    Messenger.prototype.listen = function(callback){
        this.listenFunc.push(callback);
    };
    // 注销监听
    Messenger.prototype.clear = function(){
        this.listenFunc = [];
    };
    // 广播消息
    Messenger.prototype.send = function(msg){
        var targets = this.targets,
            target;
        for(target in targets){
            if(targets.hasOwnProperty(target)){
                targets[target].send(msg);
            }
        }
    };

    return Messenger;
})();
