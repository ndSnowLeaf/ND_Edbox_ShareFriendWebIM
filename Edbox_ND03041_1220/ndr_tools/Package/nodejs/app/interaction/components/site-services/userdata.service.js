define(["angularAMD"],function(e){"use strict";e.constant("keyTokenInfo","CUSTOM_EDITOR_TOKEN_INFO").constant("keyTokenInfoEncrypt","13465c85caab4dfd8b1cb5093131c6d0").service("UserDataService",["$window","keyTokenInfo","$rootScope","keyTokenInfoEncrypt","$stateParams","CustomEditorService",function(e,o,n,t,c,s){return{setTokenInfo:function(c){c=CryptoJS.TripleDES.decrypt(decodeURIComponent(c),t).toString(CryptoJS.enc.Utf8),e.sessionStorage.setItem(o,c),n.token_info=JSON.parse(c)},remove:function(){e.sessionStorage.removeItem(o),n.token_info=void 0},getTokenInfo:function(){return n.token_info||(n.token_info=e.sessionStorage.getItem(o),n.token_info&&(n.token_info=JSON.parse(n.token_info))),n.token_info},checkUserActivity:function(e){s.readQuestionAccessRecord().then(function(o){var n=c.question_type+"_access_timestamp";if(!o||!o.accessRecord||!o.accessRecord[n]){var t;t=o&&o.accessRecord?o.accessRecord:{},t[n]=(new Date).valueOf(),e.click(),s.saveQuestionAccessRecord({accessRecord:t})}},function(e){console.log("Error to read question_access_record"),console.log(e)})}}}])});