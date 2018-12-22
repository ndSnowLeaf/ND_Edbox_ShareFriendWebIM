define(["angularAMD","moment"],function(n,t){"use strict";n.service("httpUrlFormat",function(){return function(n,t,r){if(t){var e=[];t=angular.isArray(t)?t.length>0?t[0]:[]:t,angular.forEach(t,function(o,i){-1!=n.indexOf(":"+i,o)?(n=n.replace(":"+i,o),delete t[i]):"GET"!==r.toUpperCase()&&"DELETE"!==r.toUpperCase()||e.push(i+"="+o)}),e.sort(function(n,t){return n.localeCompare(t)}),n+=e.length>0?"?"+e.join("&"):""}return n}}).service("httpAuth",["$window","UserDataService","$http","$location","httpUrlFormat",function(n,r,e,o,i){return function(u,s){s||(s=n.config.lms_host);var c=r.getUserObj();if(!c||!c.token)throw o.url("/"),new Error("请先登录");return u.url=i(u.url,u.data,u.method),u.headers=angular.extend({"Content-Type":"application/json",Authorization:CryptoJS.HmacAuth(c.token.access_token,c.token.mac_key,u.method,u.url,s.replace("http://","").replace("https://",""),t(c.token.server_time),t(c.token.local_time))},u.headers),u.url=s+u.url,e(u).error(function(n){throw new Error(n.message)})}}]).service("httpNonAuth",["$window","$http","httpUrlFormat",function(n,t,r){return function(e,o){return o||(o=n.config.lifecycle_host),e.url=r(e.url,e.data,e.method),e.url=o+e.url,t(e).error(function(n){throw new Error(n.message)})}}]).service("RestAngularCustom",["Restangular",function(n){return function(t,r){return n.withConfig(function(n){n.setBaseUrl([r||window.config.lms_host,"/",t||"v0.3"].join(""))})}}]).service("RestAngularLms",["Restangular",function(n){return function(t){return n.withConfig(function(n){n.setBaseUrl([window.config.lms_host,"/",t||"v0.3"].join(""))})}}]).service("RestAngularLifecycle",["Restangular",function(n){return function(t){return n.withConfig(function(n){n.setBaseUrl([window.config.lifecycle_host,"/",t||"v0.3"].join(""))})}}]).service("RestAngularEditor",["Restangular",function(n){return function(t){return n.withConfig(function(n){n.setBaseUrl([window.config.editor_host,"/",t||"v0.2"].join(""))})}}]).service("RestAngularClassroom",["Restangular",function(n){return function(t){return n.withConfig(function(n){n.setBaseUrl([window.config.classroom_host,"/",t||"v03"].join(""))})}}]).service("RestAngularCustomEditor",["Restangular",function(n){return function(t){return n.withConfig(function(n){n.setBaseUrl([window.config.custom_editor_host,"/",t||"v0.1"].join(""))})}}]).service("RestPinYingEditor",["Restangular",function(n){return function(t){return n.withConfig(function(n){n.setBaseUrl([window.config.cousewareobjects_host,"/",t||"v2.0"].join(""))})}}])});