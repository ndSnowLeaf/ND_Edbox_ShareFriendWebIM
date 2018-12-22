/**
 * Created by Administrator on 2017/3/31.
 */
import {GetQueryString} from './utils';

const pptInvokeMethod = Symbol('pptInvokeMethod');
const executeFun = Symbol('executeFun');
const transformParmaters = Symbol('transformParmaters');
const getElement = Symbol('getElement');
const initMouseEvent = Symbol('initMouseEvent');
const initKeyBoardEvent = Symbol('initKeyBoardEvent');
const getTagByGlobalIndex = Symbol('getTagByGlobalIndex');
const initInputEvent = Symbol('initInputEvent');

class Dispatcher{
    constructor(){
        this.eventName = "JSDirectSeeding";
        this.eventData = "{'JSDone':1}";
    }

    //私有方法
    [pptInvokeMethod]() {
        console.info("pptInvokeMethod");
        let eventName = this.eventName;
        if (typeof (CoursePlayer) !== 'undefined' && CoursePlayer.pptInvokeMethod) {
            let eventData = this.eventData;
            let result = CoursePlayer.pptInvokeMethod (eventName, eventData);
        }
    }

    [executeFun](eventInfo) {
        let params = this[transformParmaters](eventInfo.eventParamters);
        eventInfo.eventParamters = params;
        let coordinate = {x: params.clientX, y: params.clientY};
        eventInfo.eventParamters.clientX = Math.round(params.clientX);
        eventInfo.eventParamters.clientY = Math.round(params.clientY);

        if(eventInfo.eventName == "click" || eventInfo.eventName == "dbclick" || eventInfo.eventName == "mousedown"
            || eventInfo.eventName == "mousemove" || eventInfo.eventName == "mouseup" || eventInfo.eventName == "mouseleave"){

            let currentElement = this[getElement](eventInfo.element);
            let evt = this[initMouseEvent](eventInfo.eventParamters);
            evt.coordinate = coordinate; //MouseEvent经过jQuery的dispatchEvent后，clientX、clientY等坐标值强制为整形，所以需要把包含小数点的坐标值额外带过去，在生字卡描红的地方有用
            //nodeType === 1 表示是dom节点，currentElement.nodeType === 9 表示是document对象
            if(currentElement && typeof currentElement === 'object' && (currentElement.nodeType === 1 || currentElement.nodeType === 9)){
                currentElement.dispatchEvent(evt);
            }else{
                let el = this[getTagByGlobalIndex](eventInfo.element);
                if(el && typeof el === "object" && (el.nodeType === 1 || el.nodeType === 9)){
                    el.dispatchEvent(evt);
                }else{
                    console.info('没有找到Dom元素');
                }
            }
        }else if(eventInfo.eventName == "keydown" || eventInfo.eventName == "keyup" || eventInfo.eventName == "keypress"){
            let evt = this[initKeyBoardEvent](eventInfo.eventParamters);
            document.dispatchEvent(evt);
        }else if(eventInfo.eventName == "scroll"){
            let currentElement = this[getElement](eventInfo.element) ? this[getElement](eventInfo.element) : this[getTagByGlobalIndex](eventInfo.element);
            if(currentElement){
                currentElement.scrollTop = eventInfo.eventParamters.target.scrollTop;
                currentElement.scrollLeft = eventInfo.eventParamters.target.scrollLeft;
            }
        }else if(eventInfo.eventName == "play" || eventInfo.eventName == "pause" || eventInfo.eventName == "seeked" || eventInfo.eventName == "volumechange"){
            let currentElement = this[getElement](eventInfo.element) ? this[getElement](eventInfo.element) : this[getTagByGlobalIndex](eventInfo.element);
            switch (eventInfo.eventName){
                case "play":
                    currentElement.play();
                    break;
                case "pause":
                    currentElement.pause();
                    //暂停后进度要定位到暂停的位置，主要是考虑回放的场景
                    currentElement.currentTime = eventInfo.eventParamters.target.currentTime;
                    break;
                case "seeked":
                    currentElement.currentTime = eventInfo.eventParamters.target.currentTime;
                    break;
                case "volumechange":
                    currentElement.volume = eventInfo.eventParamters.target.volume;
                    break;
                default:
                    break;
            }
        }else if(eventInfo.eventName === "input"){
            var currentElement = this[getElement](eventInfo.element) ? this[getElement](eventInfo.element) : this[getTagByGlobalIndex](eventInfo.element);
            var evt = this[initInputEvent](eventInfo.eventParamters);
            currentElement.dispatchEvent(evt);
            $(currentElement).val(eventInfo.eventParamters.target.value);
        }else if(eventInfo.element.localName === "input" && (eventInfo.eventName === "focus" || eventInfo.eventName === "blur")){
            let currentElement = getElement(eventInfo.element) ? getElement(eventInfo.element) : getTagByGlobalIndex(eventInfo.element);
            let evt = this[initInputEvent](eventInfo.eventParamters);
            currentElement.dispatchEvent(evt);
        }
    }

    /**
     * 坐标转换
     * @param eventParamters
     */
    [transformParmaters](eventParamters) {
        //分辨率一样，无需转换处理
        if(window.innerWidth === eventParamters.sourceWindowWidth && window.innerHeight === eventParamters.sourceWindowHeight){
            return eventParamters;
        }

        let sourceWindowHeight = eventParamters.sourceWindowHeight,
            sourceWindowWidth = eventParamters.sourceWindowWidth;

        let equalScalingHeight = window.innerWidth/(sourceWindowWidth/sourceWindowHeight); //按照老师端等比缩放后应该得到的实际高度

        let ratioHeight = equalScalingHeight/sourceWindowHeight, //等比缩放后的分辨率高度比值
            ratioWidth = window.innerWidth/sourceWindowWidth;
        let sourceClientY = eventParamters.clientY,
            sourceClientX = eventParamters.clientX;

        let diffValueHeight = window.innerHeight - equalScalingHeight; //按照老师端等比缩放后应该得到的高度和实际CEF内容区高度的差值
        let diffY = parseInt(diffValueHeight / 2);
        console.info("diffY: " + diffY);
        let clientY = sourceClientY*ratioHeight + diffY,clientX = sourceClientX*ratioWidth;

        //eventParamters.clientX = Math.round(clientX),eventParamters.clientY = Math.round(clientY);
        eventParamters.clientX = clientX, eventParamters.clientY = clientY;

        return eventParamters;
    }

    [getElement](element) {
        if(element.id && element.id.length > 0){
            let selector = "#" + element.id;
            return $(selector);
        }else{
            let selector = element.localName;
            if(element.classList && element.classList[0]) {
                for (let k in element.classList) {
                    selector += '.' + element.classList[k];
                }
            }
            let childs = [];
            if(element.parentContainer && element.parentContainer.parentId){
                let parent = $('#' + element.parentContainer.parentId);
                childs = parent.find(selector);
            }else if(element.parentContainer && element.parentContainer.parentClassList && element.parentContainer.parentClassList[0]){
                let parentSelector  = "";
                let parentClassList = element.parentContainer.parentClassList;
                for(let i in parentClassList){
                    parentSelector += "." + parentClassList[i];
                }
                childs = $(parentSelector + " " + selector);
            }else{
                //拦截器发送的数据中，dom节点没有id和class，也没有父节点的id和class
                childs = $(selector);
            }

            var result;
            if(childs && childs.length > 0 && element.levelIndex > -1){
                result = childs[element.levelIndex];
            }
            return result;
        }
    }

    /**
     * 初始化鼠标事件
     * @param eventParamters
     * @returns {Event}
     */
    [initMouseEvent](eventParamters) {
        let event = document.createEvent('MouseEvents');
        event.initMouseEvent(eventParamters.type, true, true, null,
            null, eventParamters.screenX, eventParamters.screenY, eventParamters.clientX, eventParamters.clientY,
            null, null, null, null,
            null, null);
        return event;
    }

    /**
     * 初始化PC键盘的事件
     * @param eventParamters
     * @returns {Event}
     */
    [initKeyBoardEvent](eventParamters) {
        let eventObj = document.createEvent("Events");
        eventObj.initEvent(eventParamters.type, true, true);
        eventObj.which = eventParamters.which;
        eventObj.shiftKey = eventParamters.shiftKey;
        eventObj.keyCode = eventParamters.keyCode;

        return eventObj;
    }

    /**
     初始化input事件
     * @param eventParamters
     * @returns {Event}
    */
    [initInputEvent](eventParamters) {
        var eventObj = document.createEvent("Events");
        eventObj.initEvent(eventParamters.type, true, true);
        eventObj.which = eventParamters.which;
        eventObj.shiftKey = eventParamters.shiftKey;
        eventObj.keyCode = eventParamters.keyCode;

        return eventObj;
    }

    /**
     * 针对鼠标移动的某个元素时给元素添加class的情况做容错处理
     * @param element
     * @returns {*}
     */
    [getTagByGlobalIndex](element) {
        let localName = element.localName;
        let global_index = element.globalIndex;
        let tags = $(localName);
        let resultDom = tags[global_index];

        return resultDom;
    }

    //公共方法
    beginDispatch(eventInfo){
        console.info("beginDispatch函数被调用--" + new Date());
        console.info(eventInfo);
        let canDispatch = true;
        if(eventInfo && !($.isEmptyObject(eventInfo))){
            try{
                this[executeFun](eventInfo);
            }catch (e){
                if(e && e.message){
                    console.info("执行回放executeFun函数异常，异常信息：" + e.message);
                }
            }finally {

            }
        }else{
            console.info("事件 eventInfo 为空");
            canDispatch = false;
        }
        if(canDispatch){
            this[pptInvokeMethod]();
        }
        //else就是递归出口
    }

    run() {
        jQuery.each({
            mouseleave: "mouseleave"
        }, function( orig, fix ) {
            jQuery.event.special[ orig ] = {
                delegateType: fix,
                bindType: fix,

                handle: function( event ) {
                    var ret,
                        target = this,
                        related = event.relatedTarget,
                        handleObj = event.handleObj;

                    // For mousenter/leave call the handler if related is outside the target.
                    // NB: No relatedTarget if the mouse left/entered the browser window
                    if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                        event.type = handleObj.origType;
                        ret = handleObj.handler.apply( this, arguments );
                        event.type = fix;
                    }
                    return ret;
                }
            };
        });

        let live_terminal = GetQueryString('live_terminal');
        if (live_terminal === 'student') {
            window.beginDispatch = this.beginDispatch.bind(this);//对外暴露beginDispatch方法。当PPT端有事件到达时，会调用该方法。

            let _this = this;
            $(document).ready(function(){
                console.info("ready");
                if (live_terminal === 'student') {
                    console.info("player");
                    console.info(player);
                    let instance = player;
                    if(instance){
                        instance.addEventListener("PresenterLoaded", function(){
                            console.info("PresenterLoaded");
                            _this[pptInvokeMethod]();
                        });
                    }
                    //生字卡加载完成之后才有WordCardLoaded事件
                    document.addEventListener("WordCardLoaded", function(){
                        console.info('WordCardLoaded');
                        _this[pptInvokeMethod]();
                    },true);
                    //“对不起，系统只能同时打开最多4张生字卡”的提示弹出之后才有WordCardOutOfRange事件
                    document.addEventListener("WordCardOutOfRange", function(){
                        console.info('WordCardOutOfRange');
                        //因为“对不起，系统只能同时打开最多4张生字卡”的提示3秒之后才消失，所以设置延时3.1秒后再向ppt请求获取事件
                        setTimeout(function(){
                            _this[pptInvokeMethod]();
                        }, 3100);
                    },true);
                }
            });
        }
    }
}

let dispatcher = new Dispatcher(window);
dispatcher.run();