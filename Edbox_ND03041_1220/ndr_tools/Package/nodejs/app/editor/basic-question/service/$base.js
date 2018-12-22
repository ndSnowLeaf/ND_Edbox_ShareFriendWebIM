define(['require','question-module','css!lib/fancybox/1.3.1/fancybox.css','jquery','fancybox','plupload'],function(require, module){
	module.factory('$context', ['$auth','$requestInfo','$security','$i18n',function($auth,$requestInfo,$security,$i18n){

		var authInfo= $security.getAuthInfo() ? $security.getAuthInfo().userInfo : {};
		var userInfo={};

		userInfo.userId = $requestInfo.params.creator;
		userInfo.userName= $requestInfo.params.creator;
		userInfo.nickName= $requestInfo.params.creator;
		var getLang = function(){
			var lang = $requestInfo.params._lang_;
			if(!lang){
				lang = "zh-CN";
			}
			lang = lang.toLowerCase();
			if(lang == 'zh-tw'||lang == 'zh-hk'||lang == 'zh_tw'||lang == 'zh_hk'){
				lang = "zh-tw";
			}
			else if(lang.indexOf("_")!=-1){
				lang = lang.substring(0,lang.indexOf("_"));
			}
			else if(lang.indexOf("-")!=-1){
				lang = lang.substring(0,lang.indexOf("-"));
			}
			return lang;
		};
		var lang = getLang();
		var plui18n = {zh:'lib/plu/i18n/zh_CN',ja:'lib/plu/i18n/ja',en:'lib/plu/i18n/en',es:'lib/plu/i18n/es_EC'};
		require([plui18n[lang]]);
		return {
			getLang:getLang,
			currentUser:function(){
				return userInfo;
			},
			currentOrg:function(){
				return $requestInfo.params.org;
			},
			//2015 9 11修改创建者全部改成user_id
			currentCreator:function(){
				var userName = userInfo.userId; 
				return userName;
			},
			coverageObject:{
				user:{
					target_type:'User',
					target:userInfo.userId,
					target_title:userInfo.nickName,
					strategy:'OWNER'
				},
				common:{
					target_type:'Org',
					target:'nd',
					target_title:$i18n("resource.nd.title"),
					strategy:'OWNER'
				},
				baidu:{
					target_type:'Baidu',
					target:'bd',
					target_title:$i18n("resource.baidu.title"),
					strategy:'OWNER'
				}
			},
			coverage:{
				user:'User/'+userInfo.userId+'/OWNER',
				common:'Org/nd/',
				baidu:'Baidu/bd/'
			},
			resourceSpace:$requestInfo.params.space
		};
	}]);
	module.factory('$url',['$urlHelper','$config','$i18n','$stateParams',
	        function($urlHelper,$config,$i18n,$stateParams){

		var fn=function(path,v1,v2,v3){
			return $urlHelper.buildUrl($config.contextPath+(path||''),v1,v2,v3);
		};
		fn.getFilePath = function(){
			if(!fn.file_path){
				fn.file_path = $stateParams.file_path;
			}
			return fn.file_path;
		}
		fn.getExtraInfo =function(){
			if(!fn.file_path){
				fn.file_path = $stateParams.file_path;
			}
			if(fn.file_path){
				var result = "?file_path="+encodeURIComponent(fn.file_path);
				return result+"&";
			}
			return "?";

		}
		fn.portal=function(path,v1,v2,v3){
			return fn(path,v1,v2,v3);
		};
		fn.portalURL=function(path,v1,v2,v3){
			return $urlHelper.buildUrl($config.portalServer+(path||''),v1,v2,v3);
		};
		fn.editor=function(path,v1,v2,v3){
			return $urlHelper.buildUrl($config.editorServer+(path||''),v1,v2,v3);
		};
		fn.staticFiles=function(file,id){
			var extra = this.getExtraInfo($stateParams);
			var question_id = $stateParams.id;
			return $urlHelper.buildUrl("/v2.0/assets/get"+extra+"&question_id="+question_id+"&file_name=/resources/"+file);
		};
		fn.editor.qtiPlayer=function(url){
			var lang = $i18n.getLanguage();
			if(lang){
				lang=lang.replace('-','_');
			}	
			var url = url.replace("item.json","main.xml");
			var base = $stateParams.question_base ? "file://"+$stateParams.question_base : '/userdatas';
			url=url.replace("${ref-path}",base); 
			
			return fn.editor('/player/index.html',{'main':url,'_lang_':lang});
		};
		fn.slides=function(path,v1,v2,v3){ 
			return $urlHelper.buildUrl($config.slideServer+(path||''),v1,v2,v3);
		}
		fn.slidesRemote=function(path,v1,v2,v3){
			return $urlHelper.buildUrl($config.slideServer2+(path||''),v1,v2,v3);
		}
		fn.lifecycle=function(path,v1,v2,v3){
			return $urlHelper.buildUrl($config.lifecycleServer+(path||''),v1,v2,v3);
		};
		fn.cs=function(path,v1,v2,v3){
			return $urlHelper.buildUrl($config.csServer+(path||''),v1,v2,v3);
		};
		fn.cscdn=function(path,v1,v2,v3){
        	return $urlHelper.buildUrl($config.csCdn+(path||''),v1,v2,v3);
        };
		fn.uc=function(path,v1,v2,v3){
			return $urlHelper.buildUrl($config.ucServer+(path||''),v1,v2,v3);
		};
		/*
		 * fn.ref=function(path,encodeFileName){
			var refPath = fn.cscdn('');
			var result = !path?'':path.replace(/\$\{ref-path\}/g,function(text){
				var question_base = $stateParams.question_base ? 'question_base='+ $stateParams.question_base : '';
				var question_id = $stateParams.id;
				return '/v1.3/assets/get?'+question_base+'&question_id='+question_id+'&filepath=';			
			});
			if(encodeFileName!==false){
				var indexOf = result.lastIndexOf('/');
				if(indexOf!=-1){
					var fileName = result.substring(indexOf+1);
					var querySplit = fileName.lastIndexOf('?'),queryParam;
					if(querySplit!=-1){
						queryParam=fileName.substring(querySplit);
						fileName=fileName.substring(0,querySplit);
					}
					result=result.substring(0,indexOf+1)+encodeURIComponent(fileName)+(queryParam||'');
				}
			}			
			return result;
		};
		 */
		fn.csref = function(path){
			var refPath =  $urlHelper.buildUrl($config.csServer2);
			var result = !path?'':path.replace(/\$\{ref-path\}/g,function(text){
				return refPath+text.replace("${ref-path}","");
			});
			return result;
		};
		fn.ref=function(path,encodeFileName){
			var refPath = fn.cscdn('');
			var result = !path?'':path.replace(/\$\{ref-base\}/g,function(text){
				var extra = fn.getExtraInfo($stateParams);
				var question_id = $stateParams.id;
				return '/v1.3/assets/get'+extra+'&question_id='+question_id+'&filepath=';
			});
			if(encodeFileName!==false){
				var indexOf = result.lastIndexOf('/');
				if(indexOf!=-1){
					var fileName = result.substring(indexOf+1);
					var querySplit = fileName.lastIndexOf('?'),queryParam;
					if(querySplit!=-1){
						queryParam=fileName.substring(querySplit);
						fileName=fileName.substring(0,querySplit);
					}
					result=result.substring(0,indexOf+1)+encodeURIComponent(fileName)+(queryParam||'');
				}
			}			
			return result;
		};
		fn.build=function(path,v1,v2,v3){
			return $urlHelper.buildUrl(path,v1,v2,v3);
		};
		return fn;
	}]);
	module.filter('userName',[function(){
		return function(value){
			if(!value) return '';
			var indexOf=value.indexOf('(');
			if(indexOf!=-1){
				return value.substring(0,indexOf);
			}else{
				return value;
			}
		};
	}]);
	module.filter('refPath',['$url',function($url){
		return function(value,encodeFileName){
			return $url.ref(value,encodeFileName);
		};
	}]);
	
	
	module.provider('$security',function(){
		var serviceName;
		var $securityProvider={
			$get:['$injector','$q','$cookieStore',function($injector,$q,$cookieStore){
				var defaultService={
					get:function(){
						return null;
					},
					login:function(username,password){
						return reject();
					},
					logout:function(authInfo){
						return when();
					}
				};
				function getAuthService(){
					
					if(serviceName){
						return $injector.get(serviceName);
					}else{
						return defaultService;
					}
				}
				var authInfoStoreKey='slides-security-auth';
				var authInfo=getAuthService().get();
				if(!authInfo){
					authInfo=$cookieStore.get(authInfoStoreKey);
				}
				
				var $security={
					login:function(username,password){
						var deferred=$q.defer();
						getAuthService().login(username,password).then(function(result){
							authInfo=result;
							$cookieStore.put(authInfoStoreKey,authInfo);
							deferred.resolve();
						},function(result){
							deferred.reject(result);
						});
						return deferred.promise;
					},
					logout:function(){
						var deferred=$q.defer();
						getAuthService().logout(authInfo).then(function(){
							$cookieStore.put(authInfoStoreKey,null);
							deferred.resolve();
						},function(){
							deferred.reject();
						});
						return deferred.promise;
					},
					checkLogin:function(){
						return !!authInfo;
					},
					getAuthInfo:function(){
						return authInfo;
					}
				};
				return $security;
			}],
			setServiceName:function(name){
				serviceName=name;
			}
		};
		
		return $securityProvider;
	}); 
	
	var $ = require('jquery');
	module.directive("lcFancybox", [function(){
		return {
			restrict:'A',
			replace:false,
			scope:{
				fancyType : '@',
				fancyWidth : '@',
				fancyHeight: '@',
				fancyAutoScale : '@',
				fancyCyclic : '@'
			},	
			link : function(scope, element, iAttrs) {
				var config = {};   
				config.type=scope.fancyType;
				if(scope.fancyWidth){
					config.width=parseInt(scope.fancyWidth);
				} 
				if(scope.fancyHeight){
					config.height=parseInt(scope.fancyHeight);
				} 
				config.cyclic=scope.fancyCyclic;
				config.autoScale=scope.fancyAutoScale==='true';
				$(element).fancybox(config);
			}
		};
	}]); 
	
	module.config(['$i18nProvider','$securityProvider',function($i18nProvider,$securityProvider){
		$i18nProvider.setDefaultLanguage('zh-CN');
		$i18nProvider.setSupportLanguages(['zh-CN','es-EC',"ja-JP","ja","en-US",'zh-TW','zh-HK','zh_TW','zh_HK','ru-RU','ru_RU']);
		$i18nProvider.addModule('questions');	
		$securityProvider.setServiceName('$auth');
	}]);
});
