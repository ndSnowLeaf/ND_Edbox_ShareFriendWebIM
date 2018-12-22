define(['../sectionsModule.js', '../../templates/all_template.js'], function(module, tpls) {

	var sectionsModule = angular.module('SectionsModule');
	var MAX_RECORDTIME = 15;
	
	//角色指令
	sectionsModule.directive('record', ['$sce', '$timeout', '$interval', function($sce, $timeout, $interval) {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			//template : '<div><img ng-if="section.role != undefined && role.picture" ng-src="{{role.picture}}"/></div>',
			template: tpls.recordTpl,
			link: function(scope, element, attrs) {
				scope.recordAudio = element.find('audio').get(0);
				var $js_in = element.find('.js_in');
				$js_in.css('width', 0);
				scope.recordState = 'start';
				scope.recordFile = {};
				scope.voiceTime = '00:00';
				
				function timeformat(c){
					var hour, minute, second;
					hour = parseInt(c / 3600);// 小时数  
					minute = parseInt(c / 60);// 分钟数  
				    if(minute >= 60){  
				        minute = minute%60  
				    }  
				    second = parseInt(c % 60);  
				    var hourFormat = hour < 10? '0'+hour: hour;
				    var minuteFormat = minute < 10? '0'+minute: minute;
				    var secondFormat = second < 10? '0'+second: second;
				    var str;
				    if(hour !== 0){
				    	str = hourFormat + ':' + minuteFormat + ':' + secondFormat;
				    }else{
				    	str = minuteFormat + ':' + secondFormat;
				    }
				  	return str;
				  	//console.log(scope.voiceTime);
				};
				function updatePro(c){
					var pro = (c/MAX_RECORDTIME) * 100 + '%';
					$js_in.css('width', pro);
				};
				var stopTime;
				var getVolumnIT;
	            function updateTime($event) {
	            	var start = -1;
	              	var _run = function($event){
	              		if(start < MAX_RECORDTIME){
		              		start++;
		              		scope.voiceTime = timeformat(start);	
		              		updatePro(start);
		              	    stopTime = $timeout(_run, 1000);			       
	              		}else{
	              			// $timeout.cancel(stopTime);
	              			scope.endEvent($event);
	              		}      	
	              	}          	
	              	_run($event);
	            }
	          	function getRandomVolumn(){
					return Math.round(Math.random()*3 + 1);
				}
				scope.startEvent = function($event){	
					scope.pauseRecord();
					$timeout.cancel(stopTime);
					scope.startRecord($event, function(data){
						scope.recordState = 'recording';
						updateTime($event);
						// scope.getVoiceVolumn(function(data){
						// 	console.log(data.volumn);
						// });
						getVolumnIT = $interval(function(){
							scope.randomVolumn = 'volume_'+ getRandomVolumn();
							console.log(scope.randomVolumn)
						}, 300)
					});
				};
				scope.endEvent = function($event){
					$timeout.cancel(stopTime);
					$interval.cancel(getVolumnIT);
					return scope.stopRecord($event, function(data){
						scope.recordState = 'end';
						scope.recordFile = data;
						//scope.stopGetVoiceVolumn();
						scope.playTime = scope.voiceTime;
					});
				};
				scope.save = function(){
					scope.changeRecord('end');
				};
				scope.cancel = function(){
					scope.changeRecord('start');
				};
				/*关闭*/
				scope.changeRecord = function(state){
					scope.pauseRecord();
					if(state === 'recording'){
						// alert('正在录音');
						return;
						// scope.recordState = 'start';
						// scope.recordFile = {};
						// scope.changeSelBox(false);
						// scope.changeRecBox(false);

					}else if(state === 'end'){
						scope.$broadcast('setCurSecVoice', scope.recordFile);
					}
					scope.recordState = 'start';
					scope.recordFile = {};
					scope.changeSelBox(false);
					scope.changeRecBox(false);
					scope.voiceTime = '00:00';
				};
				/*动态绑定音频src*/
				scope.sce = $sce.trustAsResourceUrl;
				scope.playPauseRecord = function(){
					if (scope.recordAudio.paused) {
						scope.recordAudio.play();
					} else {
						scope.recordAudio.pause();
					}
				};
				scope.pauseRecord =function(){
					if (!scope.recordAudio.paused) {
						scope.recordAudio.pause();
					}
				};
                scope.recordAudio.addEventListener('timeupdate', function () {
                	if(scope.recordAudio.paused){
                		scope.recordAudio.currentTime = scope.recordAudio.duration;
                	}
                	scope.playTime = timeformat(scope.recordAudio.currentTime);
                	//console.log(scope.voiceTime);
                	$timeout();
                }, false);
				/*计时器*/
				// var recordTimeFun = function(){
				// 	var start = 0, during = 10;
				// 	var _record = function(){
				// 		start ++;
				// 		if()
				// 	}
				// } 

				

			}
		};

	}]);
});