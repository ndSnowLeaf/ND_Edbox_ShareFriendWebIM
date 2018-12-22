window["MiniTablet"]=function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.i=function(value){return value};__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{configurable:false,enumerable:true,get:getter})}};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";return __webpack_require__(__webpack_require__.s=8)}([function(module,exports){Object.defineProperty(exports,"__esModule",{value:true});var TabletMode;(function(TabletMode){TabletMode[TabletMode["Idle"]=0]="Idle";TabletMode[TabletMode["Write"]=1]="Write";TabletMode[TabletMode["Erase"]=2]="Erase"})(TabletMode=exports.TabletMode||(exports.TabletMode={}));var BackgroundFitType;(function(BackgroundFitType){BackgroundFitType[BackgroundFitType["Fill"]=0]="Fill";BackgroundFitType[BackgroundFitType["Fit"]=1]="Fit";BackgroundFitType[BackgroundFitType["Stretch"]=2]="Stretch";BackgroundFitType[BackgroundFitType["Tile"]=3]="Tile";BackgroundFitType[BackgroundFitType["Center"]=4]="Center"})(BackgroundFitType=exports.BackgroundFitType||(exports.BackgroundFitType={}));var RecogizeResult;(function(RecogizeResult){RecogizeResult[RecogizeResult["Pass"]=0]="Pass";RecogizeResult[RecogizeResult["Null"]=1]="Null";RecogizeResult[RecogizeResult["Uneven"]=2]="Uneven"})(RecogizeResult=exports.RecogizeResult||(exports.RecogizeResult={}));exports.ModuleName="mini-tablet";exports.SupportEmitList=["change","clear"];exports.DomEventList=["mousedown","mousemove","mouseup","mouseout","touchstart","touchmove","touchend","touchcancel"];exports.AllowBoundaryDistanceDiff=.2},function(module,exports,__webpack_require__){Object.defineProperty(exports,"__esModule",{value:true});var declare_1=__webpack_require__(0);var logger;if(window["Logger"]){(logger=window["Logger"].get(declare_1.ModuleName)).appendHandler(function(message){return window.console.log(message)},{level:window["Logger"].DEBUG})}else{logger=window.console}exports.default=logger},function(module,exports,__webpack_require__){Object.defineProperty(exports,"__esModule",{value:true});var declare_1=__webpack_require__(0);var Drawer=function(){function Drawer(context){this.config=Object.preventExtensions({fontSize:"12px",fontFamily:"serif",fontColor:"#000"});this.context=context}Drawer.prototype.rect=function(data,x,y,width,height){var _this=this;if(x===void 0){x=0}if(y===void 0){y=0}if(width===void 0){width=this.context.canvas.width}if(height===void 0){height=this.context.canvas.width}if(/^(#\w{3,6}|rgba?|hsla?)/.test(data)){this.context.save();this.context.fillStyle=data;this.context.fillRect(x,y,width,height);this.context.restore()}else{var img_1=new Image;img_1.onload=function(){return _this.context.drawImage(img_1,x,y,width,height)};img_1.src=data}};Drawer.prototype.background=function(data,fitType){if(fitType===void 0){fitType=declare_1.BackgroundFitType.Fill}this.context.save();this.context.globalCompositeOperation="destination-over";this.rect(data);this.context.restore()};Drawer.prototype.text=function(txt,options){this.context.save();this.context.font=this.config.fontSize+" "+this.config.fontFamily;this.context.fillText(txt,options.x,options.y);this.context.restore()};return Drawer}();exports.default=Drawer},function(module,exports,__webpack_require__){Object.defineProperty(exports,"__esModule",{value:true});var declare_1=__webpack_require__(0);var Emitter=function(){function Emitter(){this.listeners={}}Emitter.prototype.on=function(name,handler){if(!!~declare_1.SupportEmitList.indexOf(name)){this.listeners[name]=handler}};Emitter.prototype.emit=function(name){var params=[];for(var _i=1;_i<arguments.length;_i++){params[_i-1]=arguments[_i]}if(typeof this.listeners[name]==="function"){this.listeners[name].apply(null,params)}};return Emitter}();exports.default=Emitter},function(module,exports){Object.defineProperty(exports,"__esModule",{value:true});var Eraser=function(){function Eraser(context){this.isExecuting=false;this.config=Object.preventExtensions({radius:10});this.context=context}Eraser.prototype.start=function(cmd){this.isExecuting=true};Eraser.prototype.doing=function(cmd){if(!this.isExecuting)return;var radius=this.config.radius;this.clear(cmd.layerX-radius,cmd.layerY-radius,radius*2,radius*2)};Eraser.prototype.done=function(cmd){if(!this.isExecuting)return;this.isExecuting=false;cmd.emit("change",{type:"erase"})};Eraser.prototype.undo=function(){};Eraser.prototype.clear=function(x,y,width,height){if(x===void 0){x=0}if(y===void 0){y=0}if(width===void 0){width=this.context.canvas.width}if(height===void 0){height=this.context.canvas.height}this.context.clearRect(x,y,width,height)};Eraser.prototype.configure=function(options){Object.assign(this.config,options)};return Eraser}();exports.default=Eraser},function(module,exports,__webpack_require__){Object.defineProperty(exports,"__esModule",{value:true});var logger_1=__webpack_require__(1);var EventTriggerType={Mouse:"MOUSE",Touch:"TOUCH"};var EventFilter=function(){function EventFilter(){}EventFilter.prototype.mousedown=function(event,handler){this.triggerType=EventTriggerType.Mouse;handler(event)};EventFilter.prototype.mousemove=function(event,handler){if(this.triggerType===EventTriggerType.Mouse)handler(event)};EventFilter.prototype.mouseup=function(event,handler){if(this.triggerType===EventTriggerType.Mouse)handler(event);this.triggerType=""};EventFilter.prototype.mouseout=function(event,handler){return this.mouseup(event,handler)};EventFilter.prototype.touchstart=function(event,handler){event.preventDefault();if(event.targetTouches.length===1){this.triggerType=EventTriggerType.Touch;this.containerPosition=event.currentTarget.getBoundingClientRect();var toucher=event.targetTouches[0]||event.touches[0];if(toucher){handler({layerX:toucher.pageX-this.containerPosition.left,layerY:toucher.pageY-this.containerPosition.top})}else{logger_1.default.error("[mini-tablet] [touchstart] : toucher is null, targetTouches.length = "+event.targetTouches.length+", touches.length = "+event.touches.length)}}};EventFilter.prototype.touchmove=function(event,handler){event.preventDefault();if(this.triggerType===EventTriggerType.Touch){var toucher=event.targetTouches[0]||event.touches[0];if(toucher){handler({layerX:toucher.pageX-this.containerPosition.left,layerY:toucher.pageY-this.containerPosition.top})}else{logger_1.default.error("[mini-tablet] [touchmove] : toucher is null, targetTouches.length = "+event.targetTouches.length+", touches.length = "+event.touches.length)}}};EventFilter.prototype.touchend=function(event,handler){event.preventDefault();if(!event.touches.length&&this.triggerType===EventTriggerType.Touch){var toucher=event.changedTouches[0]||event.touches[0];if(toucher){handler({layerX:toucher.pageX-this.containerPosition.left,layerY:toucher.pageY-this.containerPosition.top})}else{logger_1.default.error("[mini-tablet] [touchend] : toucher is null, changedTouches.length = "+event.changedTouches.length+", touches.length = "+event.touches.length)}this.triggerType=""}};EventFilter.prototype.touchcancel=function(event,handler){return this.touchend(event,handler)};return EventFilter}();exports.default=EventFilter},function(module,exports,__webpack_require__){Object.defineProperty(exports,"__esModule",{value:true});var declare_1=__webpack_require__(0);function isNull(trace){return!trace.length||trace.every(function(stroke){return stroke.length===0})}exports.isNull=isNull;function getTraceBoundary(trace){var firstPoint=trace[0]&&trace[0][0]||{x:0,y:0};var left=firstPoint.x,right=firstPoint.x,top=firstPoint.y,bottom=firstPoint.y;for(var _i=0,trace_1=trace;_i<trace_1.length;_i++){var stroke=trace_1[_i];for(var _a=0,stroke_1=stroke;_a<stroke_1.length;_a++){var point=stroke_1[_a];var x=point.x,y=point.y;if(x<left){left=x}else if(x>right){right=x}if(y<top){top=y}else if(y>bottom){bottom=y}}}return{left:left,right:right,top:top,bottom:bottom}}exports.getTraceBoundary=getTraceBoundary;function isUneven(trace,options){var _a=getTraceBoundary(trace),left=_a.left,right=_a.right,top=_a.top,bottom=_a.bottom;var width=options.width,height=options.height,halfWidth=width/2,halfHeight=height/2;if(Math.abs(left-(width-right))>width*declare_1.AllowBoundaryDistanceDiff||Math.abs(top-(height-right))>height*declare_1.AllowBoundaryDistanceDiff){return true}return false}exports.isUneven=isUneven;function verify(trace,options){var result={type:declare_1.RecogizeResult.Pass};if(isNull(trace)){result.type=declare_1.RecogizeResult.Null}else{if(isUneven(trace,options)){result.type=declare_1.RecogizeResult.Uneven}}return result}exports.verify=verify},function(module,exports,__webpack_require__){Object.defineProperty(exports,"__esModule",{value:true});var logger_1=__webpack_require__(1);var Writer=function(){function Writer(context){this.isExecuting=false;this.traces=[];this.config=Object.preventExtensions({lineWidth:5,lineCap:"round",lineJoin:"round",strokeStyle:"#000",minPointDistance:5,pressTime:.07*1e3});this.lastX=0;this.lastY=0;this.pressedTime=0;this.context=context}Writer.prototype.start=function(_a){var layerX=_a.layerX,layerY=_a.layerY;if(this.isExecuting)return;this.isExecuting=true;this.lastX=layerX;this.lastY=layerY;this.traces.push([{x:layerX,y:layerY}]);this.context.save();for(var k in this.config){if(k in this.context){this.context[k]=this.config[k]}}this.context.beginPath();this.context.moveTo(layerX,layerY)};Writer.prototype.doing=function(_a){var layerX=_a.layerX,layerY=_a.layerY;if(!this.isExecuting)return;if(Math.abs(layerX-this.lastX)<this.config.minPointDistance&&Math.abs(layerY-this.lastY)<this.config.minPointDistance||!this.traces[this.traces.length-1])return;this.lastX=layerX;this.lastY=layerY;this.traces[this.traces.length-1].push({x:layerX,y:layerY});this.context.lineTo(layerX,layerY);this.context.stroke()};Writer.prototype.done=function(_a){var layerX=_a.layerX,layerY=_a.layerY,emit=_a.emit;if(!this.isExecuting)return;var lastIndex=this.traces.length-1;if(this.traces[lastIndex]){if(Math.abs(layerX-this.lastX)>=this.config.minPointDistance&&Math.abs(layerY-this.lastY)>=this.config.minPointDistance){this.traces[lastIndex].push({x:layerX,y:layerY})}if(this.traces[lastIndex].length===1){this.traces.pop()}else{var traces=this.traces;emit("change",{type:"write"});emit("clear");this.setTrace(traces)}}this.context.restore();this.isExecuting=false};Writer.prototype.undo=function(cmd){if(this.traces.length){this.traces.pop();this.setTrace(this.traces);cmd.emit("change",{type:"undo"})}};Writer.prototype.getTrace=function(){return this.traces};Writer.prototype.setTrace=function(trace,options){var _this=this;if(Array.isArray(trace)){this.traces=trace;if(this.traces.length){var scale_1=options&&options.scale||1;this.context.save();Object.assign(this.context,this.config);this.context.beginPath();this.traces.forEach(function(trace){for(var i=0,l=trace.length-1;i<=l;i++){var _a=trace[i],x=_a.x,y=_a.y;if(i===0){_this.context.moveTo(x*scale_1,y*scale_1)}else{_this.context.lineTo(x*scale_1,y*scale_1)}}});this.context.stroke();this.context.closePath();this.context.restore()}}else{logger_1.default.info("writer.setTrace: trace is not array")}};Writer.prototype.configure=function(options){Object.assign(this.config,options)};return Writer}();exports.default=Writer},function(module,exports,__webpack_require__){Object.defineProperty(exports,"__esModule",{value:true});var declare_1=__webpack_require__(0);var writer_1=__webpack_require__(7);var eraser_1=__webpack_require__(4);var drawer_1=__webpack_require__(2);var emitter_1=__webpack_require__(3);var event_filter_1=__webpack_require__(5);var verifier_1=__webpack_require__(6);var logger_1=__webpack_require__(1);var DomEventListeners=[];var Tablet=function(){function Tablet($el,options){this.mode=declare_1.TabletMode.Idle;var canvas=document.createElement("canvas");var context=canvas.getContext("2d");this.canvas=canvas;this.writer=new writer_1.default(context);this.eraser=new eraser_1.default(context);this.drawer=new drawer_1.default(context);this.emitter=new emitter_1.default;this.eventFilter=new event_filter_1.default;this.bind();this.setSize(options&&options.width||$el.offsetWidth,options&&options.height||$el.offsetHeight);$el.appendChild(canvas)}Tablet.prototype.destroy=function(){this.unbind();for(var _i=0,_a=["canvas","writer","eraser","drawer","emitter","eventFilter"];_i<_a.length;_i++){var key=_a[_i];if(this[key]){delete this[key]}}};Tablet.prototype.setMode=function(mode){this.mode=mode};Tablet.prototype.setWriter=function(options){this.writer.configure(options)};Tablet.prototype.setEraser=function(options){this.eraser.configure(options)};Tablet.prototype.setTrace=function(trace,options){if(options&&(options.width||options.height)){options.scale=options.width>options.height?this.canvas.width/options.width:this.canvas.height/options.height}this.writer.setTrace(trace,options)};Tablet.prototype.getTrace=function(){return this.writer.getTrace()};Tablet.prototype.setSize=function(width,height){if(width===void 0){width=0}if(height===void 0){height=0}this.canvas.width=width;this.canvas.height=height};Tablet.prototype.setBackground=function(data,fitType){this.drawer.background(data,fitType)};Tablet.prototype.setText=function(data,options){this.drawer.text(data,options)};Tablet.prototype.getDataURL=function(type,encoderOptions){if(type===void 0){type="png"}if(encoderOptions===void 0){encoderOptions=.92}var mime="image/"+type;return this.canvas.toDataURL(mime,encoderOptions)};Tablet.prototype.setDataURL=function(data){this.eraser.clear();this.drawer.rect(data)};Tablet.prototype.clear=function(){this.eraser.clear(0,0,this.canvas.width,this.canvas.height);this.writer.setTrace([])};Tablet.prototype.undo=function(){this.clear();this.writer.undo({emit:this.emitter.emit.bind(this.emitter)})};Tablet.prototype.on=function(name,handler){this.emitter.on(name,handler)};Tablet.prototype.verify=function(){return verifier_1.verify(this.getTrace(),{width:this.canvas.width,height:this.canvas.height})};Tablet.prototype.getTraceBoundary=function(){return verifier_1.getTraceBoundary(this.getTrace())};Tablet.prototype.bind=function(){var _this=this;var listener=function(event){return _this.execute(event)};DomEventListeners.push({el:this.canvas,listener:listener});declare_1.DomEventList.forEach(function(item){if(typeof _this.eventFilter[item]!=="function"){logger_1.default.warn("eventFilter."+item+" is not function");return}_this.canvas.addEventListener(item,listener,false)});this.emitter.on("clear",function(){return _this.clear()})};Tablet.prototype.unbind=function(){var _this=this;var listener;for(var i=-1,item=void 0;item=DomEventListeners[++i];){if(item.el===this.canvas){listener=item.listener;DomEventListeners.splice(i,1);break}}if(listener){declare_1.DomEventList.forEach(function(item){return _this.canvas.removeEventListener(item,listener,false)})}};Tablet.prototype.execute=function(cmd){var executor;switch(this.mode){case declare_1.TabletMode.Erase:executor=this.eraser;break;case declare_1.TabletMode.Write:executor=this.writer;break;default:return}var type=cmd.type;var emit=this.emitter.emit.bind(this.emitter);switch(type){case"mousedown":case"touchstart":this.eventFilter[type](cmd,function(_a){var layerX=_a.layerX,layerY=_a.layerY;return executor.start({layerX:layerX,layerY:layerY,emit:emit})});break;case"mousemove":case"touchmove":this.eventFilter[type](cmd,function(_a){var layerX=_a.layerX,layerY=_a.layerY;return executor.doing({layerX:layerX,layerY:layerY,emit:emit})});break;case"mouseup":case"mouseout":case"touchend":case"touchcancel":this.eventFilter[type](cmd,function(_a){var layerX=_a.layerX,layerY=_a.layerY;return executor.done({layerX:layerX,layerY:layerY,emit:emit})});break;default:logger_1.default.info("execute: type = "+cmd.type+", not matches any valid type");break}};return Tablet}();Tablet.TabletMode=declare_1.TabletMode;module.exports=Tablet}]);