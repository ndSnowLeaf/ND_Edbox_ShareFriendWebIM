define(['question-module'],function(module){
	module.factory('$config',[function(){
		var $espConfig={ 
			contextPath:'',
			portalServer:'http://esp-portal.web.sdp.101.com',
			editorServer:'',
			lifecycleServer:'http://esp-lifecycle.web.sdp.101.com',
			customEditorServer:'http://ceditor-front-xm.edu.web.sdp.101.com',
			csServer:'/userdatas/',
			moocLmsServer:'http://mooc-lms.web.sdp.101.com',
			csCdn:'/userdatas/',
			csIconFolder:'edu/esp',
			ucServer:'https://aqapi.101.com',
			ucOrg:'org_esp_integration',
			refpathaddon:'http://sdpcs.beta.web.sdp.101.com/v0.1/static/preproduction_content_module_mng/test',
			keyUserInfo:'13465c85caab4dfd8b1cb5093131c6d0',
			slideServer:'',
			slideServer2:'http://esp-slides.edu.web.sdp.101.com/',
            csServer2:"http://cs.101.com/v0.1/static",
			playerCode:'teacher',
			maxfilesize:{
				video:'15728640',
				audio:'15728640',
				image:'15728640'
			},
		};
		$espConfig.checkUrl = $espConfig.slideServer2+"questions/edit.html";
		$espConfig.ignoreUrls = ['/user'];
		window['$config'] = $espConfig;
		return $espConfig;
	}]);
	module.config(['$httpProvider',function($httpProvider){
		$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8'; 
		$httpProvider.interceptors.push(['$injector','$q','$urlHelper',function($injector,$q,$urlHelper){
			return {
                request:function(config){
                	var url = config.url;
                	if(url&&url.indexOf(".html")!=-1){
                		return config;
                	}                 
                    var headers=config.headers;
                    if(!headers){
                        headers=config.headers={};
                    }
                    if(!headers.Authorization){
                        var $auth = $injector.get('$auth');
                        var auth = $auth.generateAuthHeader(config.url,config.method);
                        if(auth){
                            //headers.Authorization=auth;
                        }
                    }
                    return config;
                },
				responseError:function(rejection){			
					var handle = false;
					for(var i=0;i<$config.ignoreUrls.length;i++){
						var url = $config.ignoreUrls[i];
						if(rejection.config.url.indexOf(url)!=-1){
							handle = true;
						}
					}

					if(!handle){
						var $console = $injector.get('$console');
						var $i18n = $injector.get('$i18n');
						var status =rejection.status; 
						if(status=='403'){
							$console.error($i18n('common.hint.http.403'));							
						}else if(status=='401'){
	                        $console.error($i18n('common.hint.http.401'));
	                    }else{
	                    	if(rejection.data&&rejection.data.message){
	                    		$console.error($i18n('common.hint.http.error',rejection.data?rejection.data.message:''));	
	                    	}
	                    	else{
	                    		$console.error($i18n('common.hint.http.defaulterror',rejection.data?rejection.data.message:''));
	                    	}
							
						}	
					}					
					return $q.reject(rejection);
				}
			};
		}]);
		$httpProvider.interceptors.push(["$q", "$rootScope", "$location","$timeout",function ($q, $rootScope, $location,$timeout) {
			var isIELower = CORSCustom.isIELower();
            var setLoadingDataTimer = function(isloading){
                if( $rootScope.loadingDataTimer) $timeout.cancel($rootScope.loadingDataTimer);
                //防止重复出现
                $rootScope.loadingDataTimer = $timeout(function(){
                    $rootScope.loadingData = isloading;
                },300);
            };
            return {
                'request': function(config) {
                    setLoadingDataTimer(true);
                    var isAjax = config.url && config.url.indexOf("http")!==-1;;
                    var host = [config.url.split('//')[0],"//",config.url.split('/')[2]].join('');
                    if (isAjax && angular.isDefined($rootScope.userObj)) {
                        var unAuth = config.params && config.params.unAuth==true;
                        if (!unAuth) {//默认授权
                            config.headers = angular.extend({"Content-Type": 'application/json',
                            	"Accept-Charset":"utf-8"/* ,
                                "Authorization": CryptoJS.HmacAuth($rootScope.userObj.token.access_token,
                                    $rootScope.userObj.token.mac_key,
                                    config.method, config.url.replace(host,""),
                                    host.replace("http://", "").replace("https://", ""),
                                    moment($rootScope.userObj.token.server_time),
                                    moment($rootScope.userObj.token.local_time),config.params)*/},config.headers);
                        }

                    }
                    //跨域封装数据
                    if(isAjax  && isIELower && CORSCustom.isXDomain(config.url)){

                        config.data = CORSCustom.encodeData(config.method,config.data,angular.extend({"Host":host.replace("http://", "").replace("https://", "")},config.headers));
                    }
                    if(config.params){
                        //删除
                        delete config.params.unAuth;
                    }
                    return config || $q.when(config);
                },
                'response': function(response) {
                    setLoadingDataTimer(false);
                    // 响应成功
                    return response; // 或者 $q.when(config);
                },
                'requestError': function(rejection) {
                    setLoadingDataTimer(false);

                    // 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
                    //return response; // 或新的promise
                    // 或者，可以通过返回一个rejection来阻止下一步
                    return $q.reject(rejection);
                },
                'responseError': function(rejection) {
                    setLoadingDataTimer(false);
                    // 请求发生了错误，如果能从错误中恢复，可以返回一个新的响应或promise
                    //return rejection; // 或新的promise
                    // 或者，可以通过返回一个rejection来阻止下一步
                    return $q.reject(rejection);
                }
            };
        }]);
		
	}]);
	
}); 