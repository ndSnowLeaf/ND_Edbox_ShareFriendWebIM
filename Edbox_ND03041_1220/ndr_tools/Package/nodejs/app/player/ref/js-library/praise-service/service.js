(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.i=function(value){return value};__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{configurable:false,enumerable:true,get:getter})}};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module["default"]}:function getModuleExports(){return module};__webpack_require__.d(getter,"a",getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="";return __webpack_require__(__webpack_require__.s=2)})([function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var easy_proxy_1=__webpack_require__(1);var ProxyHandler={methods:["$dispatchEvent"],properties:{__model:{ID:"PraiseService"}}};var classroom=function(){function classroom(){}classroom.prototype.setContext=function(context){this.context=new easy_proxy_1.default(context,ProxyHandler)};classroom.prototype.created=function(){};classroom.prototype.destroy=function(){};classroom.prototype.sendFlower=function(id,name,num){if(num===void 0){num=1}var userids=Array.prototype.concat.call([],id);var usernames=Array.prototype.concat.call([],name);if(typeof PresenterFlowerTip==="function"){PresenterFlowerTip(usernames)}this.context.$dispatchEvent("Stuff",PresenterEventType.PPT_NATIVE_EVENT,{source:this.context.__model.ID,item:"FLOWER",value:{num:num,userIds:userids}})};classroom.prototype.praiseStudent=function(users,examId){this.context.$dispatchEvent("Exam",PresenterEventType.PPT_NATIVE_EVENT,{type:"stat",value:{userIds:users,examId:examId}})};return classroom}();exports.classroom=classroom},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var EasyProxy=function(){function EasyProxy(target,handler){if(Array.isArray(handler.methods)){var _loop_1=function(method){this_1[method]=function(){if(typeof target[method]==="function"){return target[method].apply(target,arguments)}else{window.console.info("[praiseService]: proxy."+method+" is invoked")}}};var this_1=this;for(var _i=0,_a=handler.methods;_i<_a.length;_i++){var method=_a[_i];_loop_1(method)}}if(handler.properties){var _loop_2=function(property){Object.defineProperty(this_2,property,{get:function(){if(typeof target[property]!=="undefined"){return target[property]}return handler.properties[property]}})};var this_2=this;for(var property in handler.properties){_loop_2(property)}}}return EasyProxy}();exports.default=EasyProxy},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var classroom_1=__webpack_require__(0);(function(__ServiceComponent){var service;(function(service){service.classroom=classroom_1.classroom})(service=window["__ServiceComponent"]["PraiseService"]||(window["__ServiceComponent"]["PraiseService"]={}))})(window["__ServiceComponent"]||(window["__ServiceComponent"]={}))}]);