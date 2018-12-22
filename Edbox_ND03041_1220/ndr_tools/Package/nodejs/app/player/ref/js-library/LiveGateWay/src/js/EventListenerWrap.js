/**
 * Created by Administrator on 2017/3/31.
 */

import {GetQueryString} from './utils';

const mediaAddEventListener = Symbol('mediaAddEventListener');
const sendMediaEventInfo = Symbol('sendMediaEventInfo');
const customEvent = Symbol('customEvent');
const getElementInfo = Symbol('getElementInfo');
const getGlobalIndex = Symbol('getGlobalIndex');
const toSended = Symbol('toSended');
const isDragToSended = Symbol('isDragToSended');
const sendEventInfo = Symbol('sendEventInfo');

export default class EventListenerWrap {
    constructor(context,opt){
        this.mContext = context;
        this.eventList = context.allowEventList;

        this.eventName = opt.eventName;
        this.callBack = opt.callBack;
    }



    handleEvent(event){
        let _eventName = this.eventName;
        let _callback = this.callBack;
        if(this.eventList.indexOf(_eventName) >= 0){
            //针对生字卡中的多媒体文件特殊处理，添加监听事件
            if(_eventName === "loadstart"){
                this[mediaAddEventListener](event);
            }
            let isSended = true;
            if(_eventName === "mousedown" || _eventName === "mousemove" || _eventName === "mouseup" || _eventName === "mouseleave"){
                //判断是否需要发送同步，比如 mouseove这个事件触发的频率太高，如果不是拖拽的mouseove就不发送了
                isSended = this[toSended](event);
                if (isSended) {
                    if(_eventName == "mousemove"){
                        //判断拖拽的操作是否要同步
                        //判断依据是X或Y坐标位移大于0的
                        isSended = this[isDragToSended](event);
                    }
                }
            }
            if(isSended){
                //如果存在多次重复是往上冒泡的事件，则过滤掉只发送一次
                if(event !== this.mContext.lastEvent){
                    let evt = this[customEvent](event);
                    let elementInfo = this[getElementInfo](event);

                    let eventInfo = {
                        browserType: GetQueryString("browserType") && GetQueryString("browserType").length > 0 ? parseInt(GetQueryString("browserType")) : 1,
                        element: elementInfo,
                        eventName: _eventName,
                        eventParamters: evt
                    }
                    console.info(eventInfo);
                    this[sendEventInfo](eventInfo);
                }
                this.mContext.lastEvent = event;
            }
        }

        if (_callback) {
            _callback.apply(window, arguments);
        }
    }

    /**
     * 多媒体元素 video和audio 事件处理
     * @param event
     */
    [mediaAddEventListener](event) {
        var target = event.target;
        var _this = this;
        target.onplay = function(event){
            _this[sendMediaEventInfo](event, "play");
        }
        target.onpause = function(event){
            _this[sendMediaEventInfo](event, "pause");
        }
        target.onseeked = function(event){
            _this[sendMediaEventInfo](event, "seeked");
        }
        target.onvolumechange = function(event){
            _this[sendMediaEventInfo](event, "volumechange");
        }
    }

    [sendMediaEventInfo](event, eventName) {
        let evt = this[customEvent](event);
        let _eventName = eventName;
        let elementInfo = this[getElementInfo](event);
        let eventInfo = {
            browserType: GetQueryString("browserType") && GetQueryString("browserType").length > 0 ? parseInt(GetQueryString("browserType")) : 1,
            element: elementInfo,
            eventName: _eventName,
            eventParamters: evt
        }
        console.info(eventInfo);
        this[sendEventInfo](eventInfo);
    }

    /**
     * 自定义事件，用于发送至学生端事件分发器
     * @param event
     */
    [customEvent](event) {
        let evt = {
            type: event.type,
            canBubble: event.canBubble,
            cancelable: event.cancelable,
            sourceWindowHeight:window.innerHeight,
            sourceWindowWidth:window.innerWidth,
            screenX: event.screenX,
            screenY: event.screenY,
            clientX: event.clientX,
            clientY: event.clientY,
            shiftKey: event.shiftKey,
            target: {
                name: event.target.localName,
                currentTime: event.target.currentTime ? event.target.currentTime : 0, //音视频的进度
                volume: event.target.muted ? 0 : event.target.volume, //音视频声音大小，如果静音时取volume值是上一次的并不是0，所以用muted
                scrollTop: event.target.scrollTop ? event.target.scrollTop : 0,
                scrollLeft: event.target.scrollLeft ? event.target.scrollLeft : 0,
                value: event.type === "input" && event.target.localName === "input" ? event.target.value : "" //input文本框value值
            },
            which: event.which ? event.which : null, //keydown等键盘事件需要
            keyCode: event.keyCode ? event.keyCode : null //keydown等键盘事件需要
        }
        return evt;
    }

    [getElementInfo](event) {
        let id = event.target && event.target.id ? event.target.id : "";
        //如果id是全数字的话，这个id有可能是动态生成随机串，教师端和学生端会不一致，不能以id为查找依据。清空它
        if($.isNumeric(id)){
            id = "";
        }
        let localName = event.target && event.target.localName ? event.target.localName : "";
        let class_list = event.target && event.target.classList ? event.target.classList : [];
        if (!class_list || class_list.length == 0) {
            console.info("current dom no class");
        }
        let parent_element = event.target.closest(".ic_module");
        //let parent_id = parent_element ? $(parent_element).attr("id") : "";
        let parent_id = "";
        console.info("parent node id: " + id);
        //如果id是全数字的话，这个id有可能是动态生成随机串，教师端和学生端会不一致，不能以id为查找依据。清空它
        /*if($.isNumeric(parent_id)){
            parent_id = "";
        }*/
        let parent_class_list = parent_element && parent_element.classList ? parent_element.classList : [];
        console.info("parent node class: " + parent_class_list);
        let level_index = -1;
        // if current dom no id, find his parent id and parent class
        if (!id || id.length == 0) {
            let childs = [];
            let selector = localName;
            if(class_list && class_list.length > 0){
                for(let i = 0; i < class_list.length; i++){
                    selector += "." + class_list[i];
                }
                /*if (parent_element) {
                 childs = $(parent_element).find(selector);
                 }else*/
                if (parent_id && parent_id.length > 0) {
                    childs = $("#" + parent_id + " " + selector);
                } else if (parent_class_list && parent_class_list.length > 0) {
                    let parentSelector = "";
                    for(let j = 0;j < parent_class_list.length; j++){
                        parentSelector += "." + parent_class_list[j];
                    }
                    childs = $(parentSelector + " " + selector);
                } else {
                    childs = $(selector);
                }
            }

            if (childs.length > 0) {
                for(let index = 0;index < childs.length; index++){
                    if(childs[index] === event.target){
                        level_index = index;
                        break;
                    }
                }
            }
            console.info("current dom leve_index: " + level_index);
        }

        let global_index = this[getGlobalIndex](event.target);

        let element = {
            id: id,
            classList: class_list,
            localName: localName,
            parentContainer: {
                //parentId: parent_id,
                parentId: "",
                parentClassList: parent_class_list,
            },
            levelIndex: level_index,
            globalIndex: global_index
        };

        return element;
    }

    /**
     * //查找当前元素的document全局的index
     //主要是针对部分dom节点有鼠标move上去之后做了样式增减的情况
     * @param target
     */
    [getGlobalIndex](target) {
        let localName = target.localName;
        console.info("localName:" + localName);
        let global_index = 0;
        let tags = $(localName);
        for(let index = 0;index < tags.length; index++){
            if(tags[index] === target){
                global_index = index;
                break;
            }
        }
        console.info("global_index:" + global_index);
        return global_index;
    }

    [toSended](event) {
        var sended = true;
        if(event.type === "mousedown"){
            this.mContext.dragOptions.push(event);
            //console.info("mousedown之后数组长度为：" + dragOptions.length);
        }
        if(event.type === "mousemove" || event.type === "mouseleave"){
            if(this.mContext.dragOptions.length > 0){
                //console.info("数组中第一个Event对象type为： " + dragOptions[0].type);
                if(this.mContext.dragOptions[0].type == "mousedown"){
                    this.mContext.dragOptions.push(event);
                }
                //console.info("mousemove之后数组长度为：" + dragOptions.length);
            }else{
                sended = false;
            }
        }
        if(event.type === "mouseup" || event.type === "mouseleave"){
            this.mContext.dragOptions.splice(0, this.mContext.dragOptions.length);//清空数组
            //console.info("mouseup之后数组长度为：" + dragOptions.length);
        }

        return sended;
    }

    [isDragToSended](event) {
        var flag = false;
        var currentPosition = {
            clientX: event.clientX,
            clientY: event.clientY
        }
        //表示第一个移动，必须同步
        if(this.mContext.lastMouseMoveEvent && this.mContext.lastMouseMoveEvent !== null){
            var distX = event.clientX - this.mContext.lastMouseMoveEvent.clientX;
            //console.info("mousemove拖动距离X坐标位移：" + distX);
            var distY = event.clientY - this.mContext.lastMouseMoveEvent.clientY;
            //console.info("mousemove拖动距离X坐标位移：" + distY);
            if(Math.abs(distX) > 0 || Math.abs(distY) > 0){
                //console.info("mousemove拖动距离X坐标位移大于0");
                flag = true;
            }
        }else{
            flag = true;
        }
        this.mContext.lastMouseMoveEvent = event;
        return flag;
    }

    /**
     * 发送数据
     */
    [sendEventInfo](eventInfo) {
        /*localStorage.clear();
        localStorage.setItem('eventInfo', JSON.stringify(eventInfo));*/
        //console.info("sendEventInfo start:" + new Date().getTime());
        let eventName = "JSDirectSeeding";
        if (typeof (CoursePlayer) !== 'undefined' && CoursePlayer.pptInvokeMethod) {
            let result = CoursePlayer.pptInvokeMethod(eventName, JSON.stringify(eventInfo));
            //console.info("sendEventInfo end:" + new Date().getTime());
            //console.info(result);
        }
    }

    static addScrollEvent () {
        let _this = this;
        window.addEventListener("scroll", function(event) {
            let evt = _this[customEvent](event);
            let _eventName = "scroll";
            let elementInfo = _this[getElementInfo](event);
            let eventInfo = {
                browserType: GetQueryString("browserType") && GetQueryString("browserType").length > 0 ? parseInt(GetQueryString("browserType")) : 1,
                element: elementInfo,
                eventName: _eventName,
                eventParamters: evt
            }
            console.info(eventInfo);
            _this[sendEventInfo](eventInfo);
        }, true);
    }
}