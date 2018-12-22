define(['question-module'],function(module){
	module.factory('$auth',['$espUserCenter','$q','$injector','$location',function($espUserCenter,$q,$injector,$location){
		$auth={
			get:function(){
				var tokenEncrypt=$location.search().token_info;				
				if(tokenEncrypt){
					try{
						var key="13465c85caab4dfd8b1cb5093131c6d0";						
						var tokenDecrypt = CryptoJS.TripleDES.decrypt(decodeURIComponent(tokenEncrypt), key).toString(CryptoJS.enc.Utf8);						
						var tokenInfo = angular.fromJson(tokenDecrypt);
						tokenInfo.adjust_time=new Date(tokenInfo.server_time).getTime()-new Date(tokenInfo.local_time).getTime();
						var authInfo={
							loginInfo:tokenInfo,
							userInfo:{
								user_id:tokenInfo.user_id,
								user_name:tokenInfo.user_id,
								nick_name:tokenInfo.user_id,
							},
							roleInfo:{}
						};
						return authInfo;
					}catch(e){
						if(console) console.log(e);
						return null;
					}
				}
			},
			login:function(username,password){
				var loginResp,userResp,roleResp,permissionResp;
				return $espUserCenter.login(username,password).then(function(response){
					loginResp=response.data;
					return $espUserCenter.loadUser(loginResp);
				},function(response){
					return $q.reject(response);
				}).then(function(response){
					userResp=response.data;
					return $espUserCenter.loadRoles(loginResp);
				},function(response){
					return $q.reject(response);
				}).then(function(response){
					roleResp=response.data;
					return $espUserCenter.loadPermissions(loginResp);
				},function(response){
					return $q.reject(response.data);
				}).then(function(response){
					permissionResp=response.data;
					var authInfo={
						loginInfo:loginResp,
						userInfo:userResp,
						roleInfo:roleResp,
						permissionInfo:permissionResp
					};
					return $q.when(authInfo);
				},function(response){
					return $q.reject(response);
				});
			},
			logout:function(){
				return $q.when();
			},
			generateAuthHeader:function(url, method){
				var authInfo = $injector.get('$security').getAuthInfo();
				if(!authInfo || !authInfo.loginInfo){
					return false;
				}
				return $espUserCenter.generateAuthHeader(url, method, authInfo.loginInfo.adjust_time, authInfo.loginInfo.access_token, authInfo.loginInfo.mac_key);
			}
		};
		return $auth;
	}]);
});