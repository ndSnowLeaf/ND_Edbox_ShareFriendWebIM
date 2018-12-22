var CORSCustom={};!function(){var OriginalXMLHttpRequest,_base,decodeData;__indexOf=[].indexOf||function(item){for(var i=0,l=this.length;i<l;i++)if(i in this&&this[i]===item)return i;return-1},__slice=[].slice,CORSCustom.isIELower=function(){return window.XDomainRequest&&window.XMLHttpRequest&&void 0==(new window.XMLHttpRequest).withCredentials},CORSCustom.isIELower()&&(OriginalXMLHttpRequest=window.XMLHttpRequest,null==(_base=window.location).origin&&(_base.origin=window.location.protocol+"//"+window.location.host),decodeData=function(strRes){try{strRes=JSON.parse(strRes)}catch(ex){strRes={$statusText:"error",$status:999,$body:strRes}}return strRes},CORSCustom.encodeData=function(method,post,headers){var objData={};return objData.$method=method,objData.$body=post,objData.$headers=headers,JSON.stringify(objData)},CORSCustom.isXDomain=function(requestUrl){var host=window.location.origin.replace("http://","").replace("https://","");return!(requestUrl.indexOf(host)>-1)&&!(requestUrl.indexOf("http://")<0&&requestUrl.indexOf("https://")<0)},window.XMLHttpRequest=function(){function XMLHttpRequest(){}return XMLHttpRequest.prototype.open=function(){var func,method,url,_fn,_fn1,_i,_j,_len,_len1,_ref,_ref1,_this=this;if(method=arguments[0],url=arguments[1],CORSCustom.isXDomain(url)){for(url=url+(url.indexOf("?")==-1?"?":"&")+"$proxy=body",this.implementation=new XDomainRequest,this.implementation.onload=function(){var objData=decodeData(_this.implementation.responseText);if(_this.responseText=objData.$body,_this.readyState=4,_this.statusText=objData.$statusText,_this.status=parseInt(objData.$status),_this.getAllResponseHeaders=function(){return objData.$headers},_this.onreadystatechange)return _this.onreadystatechange()},this.implementation.onerror=function(){if(_this.responseText=_this.implementation.responseText,_this.readyState=4,_this.statusText="error",_this.status=500,_this.onreadystatechange)return _this.onreadystatechange()},this.implementation.onprogress=function(){},this.abort=function(){var _ref1;return(_ref1=this.implementation).abort.apply(_ref1,arguments)},this.send=function(){var _ref1;return(_ref1=_this.implementation).send.apply(_ref1,arguments)},_ref1=["getResponseHeader","getAllResponseHeaders","setRequestHeader","onprogress","ontimeout"],_fn1=function(func){return _this[func]=function(){}},_j=0,_len1=_ref1.length;_j<_len1;_j++)func=_ref1[_j],_fn1(func);return this.implementation.open("POST",url)}for(this.implementation=new OriginalXMLHttpRequest,this.implementation.onreadystatechange=function(){var prop,_i,_len,_ref;if(4===_this.implementation.readyState)for(_ref=["readyState","status","responseText"],_i=0,_len=_ref.length;_i<_len;_i++)prop=_ref[_i],_this[prop]=_this.implementation[prop];if(_this.onreadystatechange)return _this.onreadystatechange()},_ref=["abort","getAllResponseHeaders","getResponseHeader","send","setRequestHeader"],_fn=function(func){return _this[func]=function(){var _ref1;return(_ref1=this.implementation)[func].apply(_ref1,arguments)}},_i=0,_len=_ref.length;_i<_len;_i++)func=_ref[_i],_fn(func);return this.implementation.open(method,url)},XMLHttpRequest}())}(),define("cors-custom",function(){}),function(){String.prototype.format||(String.prototype.format=function(){var args=arguments;return this.replace(/{(\d+)}/g,function(match,number){return"undefined"!=typeof args[number]?args[number]:match})}),String.prototype.getCountryCode=function(){var index=this.indexOf("_");return index>-1?this.substring(0,index):this},window.customHtmlEncode=function(text){return $("<div/>").text(text).html().replace(/"/g,"&quot;").replace(/'/g,"&apos;")},window.customHtmlDecode=function(text){return $("<div/>").html(text).text()},Date.prototype.Format=function(fmt){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(fmt)&&(fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var k in o)new RegExp("("+k+")").test(fmt)&&(fmt=fmt.replace(RegExp.$1,1==RegExp.$1.length?o[k]:("00"+o[k]).substr((""+o[k]).length)));return fmt}}(),define("utils",function(){}),define("common",["angularAMD","angular","angular-ui-router","angular-translate","restangular","cors-custom","http-auth","messenger","utils","customeditor.service","skin.service","userdata.service","diskpath.service","tripledes","ngDialog","site.filter","sortable","ui-bootstrap-tooltip","question-guide"],function(angularAMD){"use strict";return angularAMD}),define(["common","moment"],function(angularAMD,moment){"use strict";function createModule(i18nData){var module=angular.module("editorApp",["restangular","ui.router","ui.sortable","ui.bootstrap.tooltip","pascalprecht.translate"]).constant("LANGUAGES_SUPPORT",{DEFAULT:DEFAULT_LOCALE_CODE}).constant("CONSTANTS_GLOBAL",{FS_DEFAULT_TITLE_CONFIRM_EVENT:"DefaultTitleConfirmNotifyFromSub",FP_DEFAULT_TITLE_CONFIRM_EVENT:"DefaultTitleConfirmNotifyFromParent",FS_CONTINUE_ACTION_EVENT:"ContinueActionNotifyFromSub",FP_CONTINUE_ACTION_EVENT:"ContinueActionNotifyFromParent"}).constant("EnumsRouteQuestionType",{linkup:{name:"连线题",api_route:"linkups",question_type:"linkup"},order:{name:"排序题",api_route:"nd_orders",question_type:"nd_order"},table:{name:"表格题",api_route:"nd_tables",question_type:"nd_table"},wordpuzzle:{name:"字谜游戏",api_route:"nd_wordpuzzles",question_type:"nd_wordpuzzle"},memorycard:{name:"记忆卡片",api_route:"nd_memorycards",question_type:"nd_memorycard"},arithmetic:{name:"竖式计算",api_route:"nd_arithmetics",question_type:"nd_arithmetic"},compare:{name:"比较大小",api_route:"nd_compares",question_type:"nd_compare"},guessword:{name:"猜词游戏",api_route:"nd_guesswords",question_type:"nd_guessword"},magicbox:{name:"魔方盒游戏",api_route:"nd_magicboxes",question_type:"nd_magicbox"},fillblank:{name:"选词填空题",api_route:"nd_fillblanks",question_type:"nd_fillblank"},pointsequencing:{name:"点排序",api_route:"nd_pointsequencings",question_type:"nd_pointsequencing"},classified:{name:"分类题型",api_route:"nd_classifieds",question_type:"nd_classified"},textselect:{name:"文本选择题",api_route:"nd_textselects",question_type:"nd_textselect"},fraction:{name:"分式加减型",api_route:"nd_fractions",question_type:"nd_fraction"},imagemark:{name:"标签题型",api_route:"nd_imagemarks",question_type:"nd_imagemark"},sequencefill:{name:"连环填空",api_route:"nd_sequencefills",question_type:"nd_sequencefill"},highlightmark:{name:"划词标记",api_route:"nd_highlightmarks",question_type:"nd_highlightmark"},speechevaluating:{name:"语音测评",api_route:"nd_speechevaluatings",question_type:"nd_speechevaluating"},sentence_evaluat:{name:"英语句子发音评测",api_route:"nd_sentence_evaluats",question_type:"nd_sentence_evaluat"},section_evaluating:{name:"英语篇章发音评测",api_route:"nd_section_evaluatings",question_type:"nd_section_evaluating"},wordcard_search:{name:"生字词卡",api_route:"nd_wordcard_searchs",question_type:"nd_wordcard_search"},puzzle:{name:"拼图工具",api_route:"nd_puzzles",question_type:"nd_puzzle"},comicdialogue:{name:"四格漫画",api_route:"nd_comicdialogue",question_type:"nd_comicdialogue"},mathaxis:{name:"数轴题",api_route:"nd_mathaxiss",question_type:"nd_mathaxis"},spellpoem:{name:"连字拼诗",api_route:"nd_spellpoem",question_type:"nd_spellpoem"},intervalproblem:{name:"区间题",api_route:"nd_intervalproblems",question_type:"nd_intervalproblem"},makeword:{name:"组词题",api_route:"nd_makewords",question_type:"nd_makeword"},$template:{}}).config(["RestangularProvider","$httpProvider","$sceProvider","$locationProvider","$urlRouterProvider","$stateProvider","$translateProvider","LANGUAGES_SUPPORT",function(RestangularProvider,$httpProvider,$sceProvider,$locationProvider,$urlRouterProvider,$stateProvider,$translateProvider,LANGUAGES_SUPPORT){LANGUAGES_SUPPORT[i18nData.lang]=i18nData.lang,LANGUAGES_SUPPORT[i18nData.lang.substr(0,2)]=i18nData.lang,$translateProvider.translations(i18nData.lang,i18nData),$translateProvider.translations(i18nData.lang.substr(0,2),i18nData),$translateProvider.useSanitizeValueStrategy("escaped"),$sceProvider.enabled(!1),$urlRouterProvider.otherwise("/home"),$stateProvider.state("area",{url:"/:area?template&isPreview&isSample&old_identifier&old_file_path&token_info&id&question_type&_lang_&space&chapter_id&chapter_name&coverage&english_card_type&grade&oper&sys&is_modify&question_base&file_path&creator&hide_toolbar",templateUrl:function($stateParams){return"/interaction/"+$stateParams.area+"/"+$stateParams.area+".html"},controllerProvider:function($stateParams){return $stateParams.area+"_ctrl"},resolve:{__load:["$q","$rootScope","$stateParams","UserDataService","$translate",function($q,$rootScope,$stateParams,UserDataService,$translate){$stateParams.isPreview="true"===$stateParams.isPreview||$stateParams.isPreview===!0,$stateParams.isSample="true"===$stateParams.isSample||$stateParams.isSample===!0,$stateParams.isModify="true"===$stateParams.is_modify||$stateParams.is_modify===!0;var currentLanguage=$stateParams._lang_;currentLanguage=LANGUAGES_SUPPORT.hasOwnProperty(currentLanguage)?LANGUAGES_SUPPORT[currentLanguage]:LANGUAGES_SUPPORT.DEFAULT,LANGUAGES_SUPPORT.CURRENT_LANGUAGE=currentLanguage,$translate.use(currentLanguage);var defer=$q.defer();return require([$stateParams.area+"/"+$stateParams.area],function(){defer.resolve(),$rootScope.$apply()},function(){window.console&&console.log("area的入口js不存在")}),defer.promise}]}});var isIELower=CORSCustom.isIELower();$httpProvider.interceptors.push(["$q","$rootScope","$location","$timeout",function($q,$rootScope,$location,$timeout){return{request:function(config){var isAjax=config.url&&config.url.indexOf("http")!==-1,host=[config.url.split("//")[0],"//",config.url.split("/")[2]].join("");if(isAjax&&$rootScope.token_info){var unAuth=config.params&&config.params.unAuth;unAuth||(config.headers=angular.extend({"Content-Type":"application/json",Authorization:CryptoJS.HmacAuth($rootScope.token_info.access_token,$rootScope.token_info.mac_key,config.method,config.url.replace(host,""),host.replace("http://","").replace("https://",""),moment($rootScope.token_info.server_time),moment($rootScope.token_info.local_time),config.params)},config.headers))}return isAjax&&isIELower&&CORSCustom.isXDomain(config.url)&&(config.data=CORSCustom.encodeData(config.method,config.data,angular.extend({Host:host.replace("http://","").replace("https://","")},config.headers))),config.params&&delete config.params.unAuth,config||$q.when(config)},response:function(response){return response},requestError:function(rejection){return $q.reject(rejection)},responseError:function(rejection){return $q.reject(rejection)}}}])}]).run(["$rootScope","$timeout","$location","$state","skin_service","$document","$http","LANGUAGES_SUPPORT",function($rootScope,$timeout,$location,$state,skin_service,$document,$http,LANGUAGES_SUPPORT){function sys_mydomessage(msg){window.messageIframe.doMessage(msg)}$document.on("keydown",function($event){$event.target==document.body&&8==$event.keyCode&&$event.preventDefault()}),window.messageIframe={doMessage:function(){}},window.messageIframe.messenger=new Messenger("message"),window.messageIframe.messenger.listen(sys_mydomessage),window.messageIframe.messenger.addTarget(window.parent,"parent");var timeout;$rootScope.scaleHtml=function(onCallback){clearTimeout(timeout),timeout=setTimeout(function(){function getWinSize(){winHeight=$(window).height(),winWidth=$(window).width()}function setWapSize(s){$wap.removeClass("com_layout_small com_layout_mid com_layout_large"),$wap.addClass(s)}function wapRePosition(){setWapSize(winWidth/winHeight>ratio?winHeight>=maxHeight?"com_layout_large":winHeight<=minHeight?"com_layout_small":"com_layout_mid":winWidth>=maxWidth?"com_layout_large":winWidth<=minWidth?"com_layout_small":"com_layout_mid")}var scalableLayout=angular.element(".scalable_layout")[0]||angular.element(".llkwrapper")[0];if(scalableLayout){var style=document.createElement("div").style,supportCss3=!1;if(angular.forEach(["transform","MozTransform","webkitTransform","OTransform","msTransform"],function(k,v){if(v in style)return supportCss3=!0,!1}),supportCss3){var $wrap=$(scalableLayout),llkwrapperHeight=$wrap.height(),llkwrapperWidth=$wrap.width(),scale=Math.min(angular.element(window).height()/llkwrapperHeight,angular.element(window).width()/llkwrapperWidth);scale<1?($wrap.parent().removeClass("center_flex_layout"),$wrap.css({transform:"scale("+scale+")",transformOrigin:"left top"}).addClass("transformed_layout"),$wrap.parent().css({margin:"0 auto"}).height(llkwrapperHeight*scale).width(llkwrapperWidth*scale)):($wrap.parent().addClass("center_flex_layout"),$wrap.css({transform:"initial"}).removeClass("transformed_layout"),$wrap.parent().css({margin:"0 auto"}).css("height","100%").css("width","auto"))}else{var $wrap=$(scalableLayout).css({zoom:1}),llkwrapperHeight=$wrap.height(),llkwrapperWidth=$wrap.width(),scale=Math.min(angular.element(window).height()/llkwrapperHeight,angular.element(window).width()/llkwrapperWidth);$wrap.css({zoom:scale}),$wrap.parent().css({margin:"0 auto"}).height(llkwrapperHeight*scale).width(llkwrapperWidth*scale)}}else{var winHeight,winWidth,$wap=$(".com_layout"),ratio=10/7,maxWidth=1300,maxHeight=maxWidth/ratio,minWidth=1159,minHeight=minWidth/ratio;getWinSize(),wapRePosition(),angular.isFunction(onCallback)&&onCallback()}},200)},angular.element(window).resize($rootScope.scaleHtml),$rootScope.$on("$stateChangeStart",function(){skin_service.remove_all_skin()}),$rootScope.$on("$stateChangeSuccess",function(evt,state,stateParams){"home"!=stateParams.area&&skin_service.get_skins(),$rootScope.scaleHtml()}),$rootScope.$on("$viewContentLoaded",function(evt){var parentWrapper=$(".exam_wood");if(parentWrapper[0]){var class_i18n="i18n_"+LANGUAGES_SUPPORT.CURRENT_LANGUAGE;!parentWrapper.hasClass(class_i18n)&&parentWrapper.addClass(class_i18n)}})}]);return module}var DEFAULT_LOCALE_CODE="zh_CN";return function(){var angularLocaleCode,languageFromUrl=location.href.match("_lang_=([^&]*)");angularLocaleCode=languageFromUrl&&languageFromUrl.length>0?languageFromUrl[1].trim():navigator.language||navigator.browserLanguage,angularLocaleCode=(angularLocaleCode||DEFAULT_LOCALE_CODE).replace("-","_"),require(["i18n/angular_locale_"+angularLocaleCode],function(data){angularAMD.bootstrap(createModule(data))},function(){angularLocaleCode!=DEFAULT_LOCALE_CODE&&require(["i18n/angular_locale_"+DEFAULT_LOCALE_CODE],function(data){angularAMD.bootstrap(createModule(data))})})}(),angularAMD});