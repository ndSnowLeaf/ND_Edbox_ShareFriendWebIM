/**
 * Created by Administrator on 2016/9/19.
 */
"use strict";

(function(global, factory){

    if(!global.CanvasWriter){
        factory(global);
    }

})(typeof window === "undefined" ? this : window, function(window){
    //坐标获取
    function getCoordinate(event){
        var pos = {
            "x": 0,
            "y": 0
        };

        switch (event.type){
            case "mousedown":
            case "mousemove":
            case "mouseup":
                pos.x = event.clientX;
                pos.y = event.clientY;
                break;
            case "touchstart":
            case "touchmove":
            case "touchend":
                pos.x = event.touches[0].clientX;
                pos.y = event.touches[0].clientY;
                break;
        }

        return pos;
    }

    //坐标转换
    function windowToCanvas(canvas, event){
        var bbox = canvas.getBoundingClientRect();
        var mousePos = getCoordinate(event);

        return {
            "x": (mousePos.x - bbox.left) * (canvas.width / bbox.width),
            "y": (mousePos.y - bbox.top) * (canvas.height / bbox.height)
        }
    }

    //以下手写板任何关于尺寸的配置，默认都是基于400
    var basicWidth = 400;

    //默认的配置
    var defaultConfig = {
            "pen": {
                "strokeStyle": "#000000",
                "lineWidth": "10",
                "lineCap": "round",
                "globalCompositeOperation":"source-over"
            },
            "eraser":{
                "radius":20,
                "lineWidth" :2,
                "strokeStyle" :"#FF0033",
                "shadowColor" :"#FF9900",
                "shadowBlur" :5,
                "shadowOffsetX" :1,
                "shadowOffsetY" :1
            }
    };


    /**
     * 手写板构造函数
     * @param container 手写板的容器，选择器或者dom元素
     * @returns {{}} 对外暴露的方法
     * @constructor CanvasWriter
     */

    function CanvasWriter(container){
        var self = this;
        //canvas和context对象
        this.canvas = null;
        this.context = null;


        //画笔粗细和颜色等配置
        /**
         * 2017-08-17 chenyz修改，修改原因：PPT加载优化的需求中，因为做了上下切页时不清空数据，
         * 如果没有先转成字符串再转回对象的话，橡皮擦大小的计算会一直在上一次基础上 * scale，不断变大
         */
        //this.config = defaultConfig;
        this.config = JSON.parse(JSON.stringify(defaultConfig));

        //画板容器
        this.container = typeof container === "string" ?
                        document.querySelector(container) : container;

        //轨迹数据，用于撤销和重绘
        this.pathData = [];
        this.tempPath = [];

        //在特定时期执行的函数
        this.specificHandlers = {
            beforeWrite: null, //在开始书写之前
            afterWrite:null //书写之后
        };




        this.isActive = true;           //是否是可用状态
        this.enableWrite = true;        //是否允许书写
        this.isEraser = false;          //橡皮擦
        this.enablePenetrate = false;   //是否允许穿透
        this.isMouseDown = false;
        this.lastPos = null;


        this.init();


        //对外暴露的接口
        return {
            //清空
            clear:self.clearWriter.bind(self),
            //设置手写形式
            setWriteType:function(stateCode){
                self.setWriterState(stateCode);
            },
            //设置是否可用
            setActive:function(state){
                self.isActive = !!state;
            },
            //获取状态
            getState:function(){
                return self.getState();
            },
            //设置状态
            setState:function(state){
                self.setState(state);
            },
            //设置笔迹粗细
            setLineWidth:function(lineWidth){
                self.config.pen.lineWidth = lineWidth;
            },
            //设置笔迹颜色
            setStrokeStyle:function(strokeStyle){
                self.config.pen.strokeStyle = strokeStyle;
            },
            //获取当前画板的一些状态
            getCurrentConfig:function(){
                return self.config;
            },
            //在开始书写之前执行
            setBeforeWrite:function(beforeWriteHandler) {
                self.specificHandlers.beforeWrite = beforeWriteHandler;
            },
            //在书写之后执行
            setAfterWrite:function (afterWriteHandler) {
                self.specificHandlers.afterWrite = afterWriteHandler;
            }
        };
    }

    CanvasWriter.prototype = {
        constructor: CanvasWriter,

        init: function() {
            this.create();

            this.setEraserStyle();

            this.bindEvent();

        },
        //创建canvas
        create: function() {
            var container = this.container;
            var width = container.clientWidth;
            var height = container.clientHeight;

            var canvas = document.createElement("canvas");

            this.canvas = canvas;
            this.context = canvas.getContext("2d");

            canvas.setAttribute("width", width + "px");
            canvas.setAttribute("height", height + "px");
            container.innerHTML = "";
            container.appendChild(canvas);
        },
        //事件绑定
        bindEvent: function() {
            var canvas = this.canvas;

            canvas.addEventListener("mousedown",this.eventHandler.bind(this),false);
            canvas.addEventListener("mousemove",this.eventHandler.bind(this),false);
            canvas.addEventListener("mouseup",this.eventHandler.bind(this),false);
            canvas.addEventListener("touchstart",this.eventHandler.bind(this),false);
            canvas.addEventListener("touchmove",this.eventHandler.bind(this),false);
            canvas.addEventListener("touchend",this.eventHandler.bind(this),false);

            //对document监听mouseup事件，处理从手写板滑动出去放开鼠标的情况
            window.document.addEventListener("mouseup", this.mouseoutHandler.bind(this), false);
            window.document.addEventListener("touchend", this.mouseoutHandler.bind(this), false);
        },
        //解绑事件
        unBindEvent: function() {
            var canvas = this.canvas;

            canvas.removeEventListener("mousedown",this.eventHandler.bind(this),false);
            canvas.removeEventListener("mousemove",this.eventHandler.bind(this),false);
            canvas.removeEventListener("mouseup",this.eventHandler.bind(this),false);
            canvas.removeEventListener("touchstart",this.eventHandler.bind(this),false);
            canvas.removeEventListener("touchmove",this.eventHandler.bind(this),false);
            canvas.removeEventListener("touchend",this.eventHandler.bind(this),false);
        },
        //鼠标移出画布时的处理
        mouseoutHandler: function(event) {
            if(!this.isMouseDown) return;

            var eventType = this.eventMapping(event);
            var pos = this.lastPos;

            this.context.restore();

            this.enableWrite && this.endEvent(eventType, pos);

            this.isEraser && this.eraseEvent(eventType, pos);

            this.isMouseDown = false;
            this.lastPos = null;
        },

        eventHandler: function(event) {
            if(!this.isActive){
                return;
            }

            var pos = windowToCanvas(this.canvas, event);
            var eventType = this.eventMapping(event);

            //穿透
            if(this.enablePenetrate){

                return;
            }else{//手写或擦除

                switch (eventType){
                    case "start":

                        this.beforeWrite();

                        this.context.save();
                        this.isMouseDown = true;
                        //设置画笔颜色等
                        this.setWriterStyle();
                        this.enableWrite && this.startEvent(eventType, pos);
                        this.lastPos = pos;
                        break;
                    case "move":
                        this.isMouseDown && this.enableWrite && this.moveEvent(eventType, pos);

                        //橡皮擦
                        this.isMouseDown && this.isEraser && this.eraseEvent(eventType, pos);

                        this.lastPos = pos;
                        break;
                    case "end":
                        //正常书写
                        if(this.isMouseDown && this.enableWrite){
                            this.endEvent(eventType, pos);
                            this.afterWrite();
                        }

                        this.isMouseDown && this.context.restore();

                        //橡皮擦
                        this.isMouseDown && this.isEraser && (this.eraseEvent(eventType, pos), this.afterWrite());

                        this.isMouseDown = false;
                        this.lastPos = null;
                        break;
                }
            }
        },
        //对事件类型做处理
        eventMapping: function(event) {
            var eventType = event.type;

            var type;

            switch (eventType){
                case "touchstart":
                    //阻止默认事件，不发射mouseEvent
                    event.preventDefault();
                case "mousedown":
                    type = "start";
                    break;
                case "mousemove":
                case "touchmove":
                   type = "move";
                    break;
                case "mouseup":
                case "touchend":
                   type = "end";
                    break;
            }

            return type;
        },
        startEvent: function(eventType, pos) {
            var context = this.context;

            this.tempPath = [];
            //设置画笔相关的属性
            context.beginPath();
            context.moveTo(pos.x, pos.y);

            //将坐标压入临时数组
            this.tempPath.push(pos);
        },
        moveEvent: function(eventType, pos) {
            this.context.lineTo(pos.x, pos.y);
            this.context.stroke();

            this.tempPath.push(pos);

        },
        endEvent: function(eventType, pos) {
            this.context.lineTo(pos.x, pos.y);
            this.context.stroke();
            this.context.closePath();

            this.tempPath.push(pos);

            this.pathData.push(this.tempPath);

        },
        //橡皮擦擦除
        eraseEvent: function(eventType, pos) {

            if(this.lastPos){
                //擦除上一次的橡皮擦
                this.eraseLast(this.lastPos);
            }

            if(eventType === "move"){
                //重绘本次的橡皮擦
                this.drawEraser(pos);
            }

        },
        //清除上一次的橡皮擦
        eraseLast: function(lastPos) {
            var context = this.context;
            var eraser = this.config.eraser;
            var radius = eraser.radius + eraser.lineWidth;

            context.save();

            context.beginPath();

            context.arc(lastPos.x, lastPos.y, radius, 0, 2 * Math.PI);

            context.clip();

            context.clearRect(lastPos.x - radius, lastPos.y - radius, radius * 2, radius * 2);

            context.restore();
        },
        //绘制橡皮擦
        drawEraser: function(pos) {
            var context = this.context;
            var eraserConfig = this.config.eraser;

            context.save();

            context.lineWidth = eraserConfig.lineWidth;
            context.strokeStyle = eraserConfig.strokeStyle;
            context.shadowColor = eraserConfig.shadowColor;
            context.shadowBlur = eraserConfig.shadowBlur;
            context.shadowOffsetX = eraserConfig.shadowOffsetX;
            context.shadowOffsetY = eraserConfig.shadowOffsetY;

            context.beginPath();

            context.arc(pos.x, pos.y, eraserConfig.radius, 0, 2 * Math.PI);

            context.clip();

            context.stroke();

            context.restore();
        },
        //在书写之前
        beforeWrite: function() {
            var beforeWrite = this.specificHandlers.beforeWrite;

            if(typeof beforeWrite === "function"){
                beforeWrite();
            }
        },

        //在书写之前
        afterWrite: function() {
            var afterWrite = this.specificHandlers.afterWrite;

            if(typeof afterWrite === "function"){
                afterWrite();
            }
        },
        //回退
        back: function(eventType, pos) {
            var context = this.context;
            var pathData = this.pathData;

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if(pathData.length < 2){
                this.pathData.length = 0;
                return;
            }

            pathData.pop();

            context.beginPath();

            for(var i = 0, iLen = pathData.length; i < iLen; i++){
                var path = pathData[i];

                context.beginPath();
                context.moveTo(path[0].x, path[0].y);
                for(var j = 1,jLen = path.length;j < jLen; j++){
                    context.lineTo(path[j].x, path[j].y);
                }
                context.stroke();
            }

            context.closePath();
        },
        setWriterStyle: function() {
            var context = this.context;
            var config = this.config.pen;

            for(var prop in config){
                context[prop] = config[prop];
            }
        },
        //根据canvas大小来设置橡皮擦的尺寸等
        setEraserStyle: function() {
            var eraserConfig = this.config.eraser;
            var width = this.canvas.width;
            var height = this.canvas.height;

            width = width > height ? height : width;

            var scale = width / basicWidth;


            eraserConfig.radius *= scale;
            eraserConfig.lineWidth *= scale;
            eraserConfig.shadowBlur *= scale;
            eraserConfig.shadowOffsetX *= scale;
            eraserConfig.shadowOffsetY *= scale;
        },
        //清空画板
        clearWriter: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.pathData.length = 0;
        },
        getState: function() {
            return this.canvas.toDataURL("image/png");
        },
        setState: function(state) {

            var self = this;

            var canvas = self.canvas;
            var context = self.context;
            var image = new Image();

            image.onload = function(){
                self.clearWriter();
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            };

            image.src = state;
        },
        /**
         * 设置手写板状态
         *@ stateCode 0:穿透 1:手写 2：擦除
         */
        setWriterState: function(stateCode) {
            switch (stateCode){
                case 0:
                    this.enableWrite = false;
                    this.isEraser = false;
                    this.enablePenetrate = true;
                    break;
                case 1:
                    this.enableWrite = true;
                    this.isEraser = false;
                    this.enablePenetrate = false;
                    break;
                case 2:
                    this.enableWrite = false;
                    this.isEraser = true;
                    this.enablePenetrate = false;
                    break;
                default:
                    throw new Error("unknown state code：", stateCode);
            }
        }

    };


    window.CanvasWriter = CanvasWriter;
});