define(['require','angular','angular-gettext','question-module','/editor/basic-question/$i18n/zh-CN.js','/editor/basic-question/$i18n/es-EC.js',
	'/editor/basic-question/$i18n/ja-JP.js','/editor/basic-question/$i18n/en-US.js','/editor/basic-question/$i18n/zh-TW-HK.js','/editor/basic-question/$i18n/ru-RU.js',],
		function(require,angular,gettext,module,zhCn,esEc,jaJp,enUS,zhTwHK, ruRU){
	
	module.factory('$session',['$http','$q',function($http,$q){
		var sessionObject=_requestInfo.session||{};
		var session=sessionObject.value?angular.fromJson(sessionObject.value):{};
		var saveUrl=sessionObject.saveUrl||'';
		var saveSession=function(){
			return $http({
				method:'POST',
				url:saveUrl,
				data:angular.toJson(session)
			});
		};
		return {
			set:function(key,value){
				var deferred=$q.defer();
				session[key]=value;
				saveSession().success(function(data){
					deferred.resolve(value);
				}).error(function(data){
					deferred.reject(data);
				});
				return deferred.promise;
			},
			get:function(key){
				return session[key];
			}
		};
	}]);
	var _requestInfo = window._request_info_ || {}; 
	module.factory('$requestInfo',['$stateParams','$location',function($stateParams,$location) {
		var requestInfo={};		
		if(!_requestInfo||_requestInfo.params===undefined){
			requestInfo={
				params:$location.search()
			}
		}
		else{
			requestInfo={
				params:_requestInfo.params||{},
				variables:_requestInfo.variables||{},
				headers:_requestInfo.headers||{}
			};
		}		
		return requestInfo;
	}]);

	module.factory('$module',['$url',function($url){
		var Module=function(moduleName){
			this.name=moduleName;
			this.path=moduleName.replace(/\./g, '/');
			this.template=function(name){
				return $url.module('/'+this.path+'/'+(name||'index')+'.html');
			};
			this.file=function(name){
				return $url.module('/'+this.path+'/'+(name||''));
			};
			this.messageFile=function(lang){
				return this.file('$i18n/'+lang+'.json');
			}
			this.controller=function(name){
				return this.name+'.'+(name||'')+'Ctrl';
			};
		};
		return function(moduleName){
			return new Module(moduleName);
		};
	}]);

	module.provider('$i18n',function(){
		var moduleNames=[],defaultLanguage='zh-CN',supportLanguages;
		return {
			addModule:function(name){
				moduleNames.push(name);
			},
			setDefaultLanguage:function(lang){
				defaultLanguage=lang;
			},
			setSupportLanguages:function(langs){
				supportLanguages=langs;
			},
			$get:['gettextCatalog',function(gettextCatalog){
				var $i18n=function(string, scope, tScope){
					if(angular.isString(scope)){
						if(tScope===true){
							scope={'$':gettextCatalog.getString(scope)};
						}else{
							scope={'$':scope};
						}
					}else if(angular.isNumber(scope)){
						scope={'$':scope};
					}else if(angular.isArray(scope)){
						var temp={};
						for(var i=0;i<scope.length;i++){
							temp['$'+i]=scope[i];
						}
						scope=temp;
					}
					return gettextCatalog.getString(string, scope);
				};
				$i18n.plural=function(n, string, stringPlural, context){
					return gettextCatalog.getPlural(n, string, stringPlural, context);
				};
				
				$i18n.$$moduleNames=moduleNames;
				$i18n.$$defaultLanguage=defaultLanguage;
				$i18n.$$supportLanguages=supportLanguages;
				
				$i18n.setMessages=function(lang,messages){
					gettextCatalog.setStrings(lang,messages);
				};
				$i18n.setLanguage=function(lang){
					gettextCatalog.setCurrentLanguage(lang);
				};
				$i18n.getLanguage=function(){
					return gettextCatalog.getCurrentLanguage();
				};
				$i18n.getSupportLanguages=function(){
					return supportLanguages;
				};
				return $i18n;
			}]
		};
	});
	module.run(['gettextCatalog','$i18n','$locale','$module','$requestInfo','$window','$urlHelper','$document', 
	            function (gettextCatalog,$i18n,$locale,$module,$requestInfo,$window,$urlHelper,$document) {
		window.$i18n = $i18n;//ckeditor 使用
		var LANGUAGE_PARAM_NAME='_lang_';
		var createXhr=function(){
			if (!window.XMLHttpRequest) {
				return new window.ActiveXObject("Microsoft.XMLHTTP");
		    } else if (window.XMLHttpRequest) {
		    	return new window.XMLHttpRequest();
		    }
		};
		
		var loadMessage=function(moduleName,lang){
			if(lang == 'es-EC'||lang == 'es'){
				return esEc;
			}
			else if(lang == 'ja-JP'||lang == 'ja'){
				return jaJp;
			}
			if(lang == 'en-US'||lang.indexOf("en")!=-1){
				return enUS;
			}
			if(lang == 'zh-TW'||lang == 'zh_TW'||lang == 'zh-HK'||lang == 'zh_HK'){
				return zhTwHK;
			}
			if(lang == 'ru-RU'||lang == 'ru_RU'){
				return ruRU;
			}
			return zhCn;
		};
		
		var lang;
		var supportLanguages=$i18n.$$supportLanguages||[];
		if(supportLanguages.length>1){
			var navigatorLanguages=navigator.languages || [navigator.language];
			var urlLang=$requestInfo.params[LANGUAGE_PARAM_NAME];
			if(angular.isString(urlLang)){
				urlLang=urlLang.replace('_','-');
				$document[0].cookie='language='+urlLang+';path=/';
			}else{
				var cookie = $document[0].cookie;
				if(cookie){
					cookieArray = cookie.split('; ');
					for (i = 0; i < cookieArray.length; i++) {
						cookie = cookieArray[i];
						if(cookie.indexOf('language=')==0){
							urlLang=cookie.substring('language='.length);
						}
					}
				}
			}
			var exceptLanguages=[urlLang,angular.isString(urlLang)?urlLang.replace(/-.+/,''):''].concat(navigatorLanguages);
			for(var i=0;i<navigatorLanguages.length;i++){
				var nl=navigatorLanguages[i];
				if(nl && nl.indexOf('-')!=-1){
					exceptLanguages.push(nl.substring(0,nl.indexOf('-')));
				}
			}
			outer:for(var i=0;i<exceptLanguages.length;i++){
				for(var j=0;j<supportLanguages.length;j++){
					if(exceptLanguages[i]==supportLanguages[j]){
						lang=supportLanguages[j];
						break outer;
					}
				}
			}
		}else if(supportLanguages.length==1){
			lang=supportLanguages[0];
		}
		if(!lang){
			lang=$i18n.$$defaultLanguage;
		}		
		var moduleNames=$i18n.$$moduleNames;		
		for(var i=0;i<moduleNames.length;i++){
			try{				
				var messages = loadMessage(moduleNames[i],lang);				
				$i18n.setMessages(lang,messages);
			}catch(e){
			}
		}
		$i18n.setLanguage(lang);
		
		var langParamReg=new RegExp("([\\?&])("+LANGUAGE_PARAM_NAME+"=[^&]+(&?))","g");
		$i18n.changeLanguage=function(lang){
			var href=$window.location.href;
			if(langParamReg.test(href)){
				href=href.replace(new RegExp("([\\?&])("+LANGUAGE_PARAM_NAME+"=[^&]+(&?))","g"),'$1'+(LANGUAGE_PARAM_NAME+'='+lang)+'$3');
			}else{
				var params={};
				params[LANGUAGE_PARAM_NAME]=lang;
				href=$urlHelper.buildUrl(href,params);
			}
			$window.location.href=href;
		};
	}]); 
	return angular;
});