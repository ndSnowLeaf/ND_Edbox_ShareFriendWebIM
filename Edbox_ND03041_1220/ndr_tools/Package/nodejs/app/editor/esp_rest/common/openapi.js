var util=require("./util"),LogicError=require("./errors").LogicError,URL=require("url"),log=require("./log"),nodetypes=require("./nodetypes"),jsonUtil=require("./jsonUtil"),$i18n=require("../support/i18n").i18n;exports.apiResult=function(e,r){return void 0==r?{code:0,message:"",data:e}:{code:r,message:e.toString(),data:null}};var getJsonpCallback=function(e){var r=URL.parse(e.url,!0).query;return r.callback||r.jsoncallback||r.jsonpcallback},handleJsonp=function(e,r,t){var a=getJsonpCallback(e);return a?(r.set("Content-Type","application/x-javascript;charset=utf-8"),a+"("+JSON.stringify(t)+")"):(r.set("Content-Type","application/json;charset=utf-8"),t)},returnOpenApiResult=function(e,r,t){r.send(handleJsonp(e,r,{code:0,message:"",data:t}))};exports.returnOpenApiResult=returnOpenApiResult;var returnOpenApiErrorResult=function(e,r,t){var a=t;t instanceof LogicError?log.info("openapi","[{2}][{0}]{1}".format(e.url,t.message,e.method),null,a.stack):(t={message:$i18n("server.error")+(t.code?t.message:t),code:5e5,data:null},log.error("openapi","[{2}][{0}]{1}".format(e.url,t.message,e.method),null,a.stack)),r.send(handleJsonp(e,r,{code:t.code,message:t.message,data:t.data})),r.end()};exports.returnOpenApiErrorResult=returnOpenApiErrorResult,exports.getAction=function(e,r){return function(t,a,n){try{var i=e(t,a,n);i&&i.fail&&i.then(function(e){r&&(e=Array.isArray(e)?jsonUtil.copyArray(e,r):jsonUtil.copy(e,r)),returnOpenApiResult(t,a,e)}).fail(function(e){returnOpenApiErrorResult(t,a,e)})}catch(e){returnOpenApiErrorResult(t,a,e)}}};var OpenApiParamManager=function(e){this._url=e.url,this._query,this._body=e.body,this._req=e};OpenApiParamManager.prototype.get=function(e){this._query||(this._query=URL.parse(this._url,!0).query);return this._query[e]?this._query[e]:this._body[e]?this._body[e]:this._req.param(e)},OpenApiParamManager.prototype.getBaseTypeValue=function(e,r,t,a,n){var i=r;if(a&&util.isNullOrEmpty(r))throw new LogicError($i18n("server.error.argument.missing").format(e),400024);if(!util.isNullOrEmpty(r)){switch(t){case Number:r=parseInt(r),r=isNaN(r)?void 0:r;break;case nodetypes.Float:r=parseFloat(r),r=isNaN(r)?void 0:r;break;case nodetypes.PositiveInteger:if(r=parseInt(r),void 0!=(r=isNaN(r)?void 0:r)&&r<0||void 0!=r&&parseFloat(i)!=r)throw new LogicError(i18n("server.error.argument.nagetivenumber").format(e),400034);break;case Boolean:r="1"==r.toString()||"true"==r.toString().toLowerCase();break;case String:if(void 0!=n.maxSize&&r.length>n.maxSize)throw new LogicError($i18n("server.error.argument.lessthan").format(e,n.maxSize),400027)}return r}},OpenApiParamManager.prototype.getItemValue=function(e,r,t){var a;if(this.isBaseType(r))a=this.getBaseTypeValue(null,e,r,!1,t);else{a={};for(var n in r){var i=r[n];this.isBaseType(i.type)?a[n]=this.getBaseTypeValue(n,e[n],i.type,i.required,i):i.type==Array&&(a[n]=this.getArray(n,e[n],i.itemType,i.required,i))}}return a},OpenApiParamManager.prototype.getArray=function(e,r,t,a,n){if(a&&!r)throw new LogicError($i18n("server.error.array.missing").format(e),400025);var i=[];if(!util.isNullOrEmpty(r))if(Array.isArray(r))for(var o in r)i.push(this.getItemValue(r[o],t,n));else i.push(r);return i},OpenApiParamManager.prototype.isBaseType=function(e){switch(e){case String:case Number:case nodetypes.Float:case nodetypes.PositiveInteger:case Date:case Boolean:return!0;default:return!1}};var getOpenApiParam=function(e,r){var t=new OpenApiParamManager(e),a={};for(var n in r){var i=r[n];t.isBaseType(i.type)?a[n]=t.getBaseTypeValue(n,t.get(n),i.type,i.required,i):i.type==Array&&(a[n]=t.getArray(n,t.get(n),i.itemType,i.required,i))}return a};exports.getOpenApiParam=getOpenApiParam;