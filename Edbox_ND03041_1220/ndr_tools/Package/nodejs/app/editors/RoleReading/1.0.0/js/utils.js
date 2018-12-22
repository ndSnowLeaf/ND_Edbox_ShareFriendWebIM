/*获取资源工具类*/
define(['espEnvironment'], function(espEnvironment) {
	var IMG_CONFIG = {
		width: 240,
		height: 240
	};
	var RESOUCE_TYPE = {
		'image': '$RA0101',
		'audio': '$RA0102',
		'video': '$RA0103',
		'flash': '$RA0104'
	};
	var LOCAL_HOST = window.location.origin || (window.location.protocol + '//' + window.location.host),  //本地服务地址
        API_CONFIG = {
            //电子语音合成
            getSpell2AudioBySpeechSynthesis: LOCAL_HOST + '/v3.0/speechSynthesis_en',
            voiceRecordStart: LOCAL_HOST + '/v3.0/voiceRecord/start',
            voiceRecordEnd: LOCAL_HOST + '/v3.0/voiceRecord/stop',
            getVoiceVolumn: LOCAL_HOST + '/v3.0/voiceRecord/volumn'
        };
	var Utils = function($q, stage, $http, config) {
		this.$q = $q;
		this.stage = stage;
		this.$http = $http;
        this.config = config;
	};
	Utils.prototype = {
		/*生成uuid*/
		getUuid: function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },
		/*选取素材*/
		selectImage: function(callback) {
			var that = this;
			that.$q.proxy(that.stage.selectResource({
                crop: true,
				type: RESOUCE_TYPE.image,
			}, {
				check: function(result, success, items) {
					if (!success) return true;

					if (!items || items.length == 0) {
						// that.stage.prompter.message('未选择图片');
						return false;
					}
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						var format = item.format || '';
						var href = item.href;
						if (href.indexOf("?") == -1) {
							href = href + "?size="+IMG_CONFIG.width;
						} else {
							href = href + "&size="+IMG_CONFIG.width;
						}
						item.href = href;
					}
				}
			})).then(function(items) {
				//return items;
				//$scope.portrait = items;
				/*通知设置图像进行裁剪*/
				//$scope.$broadcast('setCropImg', items.href);
				callback && callback(items);

			});
		},

		selectAudio: function(callback) {
			var that = this;
			that.$q.proxy(that.stage.selectResource({
				type: RESOUCE_TYPE.audio
			}, {
				check: function(result, success, items) {
					if (!success) return true;
					if (!items || items.length == 0) {
						//that.stage.prompter.message('未选择视频文件');
						return false;
					}
				}
			})).then(function(items) {
				//return items;
				//$scope.$broadcast('setCurSecVoice', items.href);
				callback && callback(items);

			});
		},
		//,

		// selectVideo: function($event) {
		// 	this.$q.proxy(this.stage.selectResource({
		// 		type: RESOUCE_TYPE.video
		// 	}, {
		// 		check: function(result, success, items) {
		// 			if (!success) return true;
		// 			if (!items || items.length == 0) {
		// 				$scope.question.stage.prompter.message('未选择音频文件');
		// 				return false;
		// 			}
		// 		}
		// 	})).then(function(items) {
		// 		return items;
				
		// 	});
		// }
		/**
         * 语音合成
         * @param text 待合成的文本
         * body：{
         *   	'text': text,
         *   	'lang': lang,
         *  	'tone': tone
         *   }
         */
        getSpell2AudioBySpeechSynthesis: function (body, callback) {
        	var that = this;
            var filePath = encodeURIComponent(espEnvironment.location.params.file_path);
            var content = body;
            var url = API_CONFIG.getSpell2AudioBySpeechSynthesis;
            var dtd = $.Deferred();
            that.__$http(url, 'POST', {file_path: filePath, content: content}).success(function (data) {
				// if(data && data.audioUrl) {
				// 	deferred.resolve($stage.getStage().repository.getResourceUrl(data.audioUrl));
				// } else {
				// 	deferred.resolve('');
				// }
				if(data && data.flag){
                    // data.audioUrl = that.stage.repository.getResourceUrl(data.audioUrl);
                    var audioFile = {};
                    audioFile.href = that.stage.repository.getResourceUrl(data.href);
                    audioFile.title = data.title;
					callback && callback(audioFile);
                    dtd.resolve();
				}else{
					dtd.reject(that.config.i18n.translate('compReqErr'));
				}				
            }).error(function () {
                // that.stage.prompter.message('语音合成请求失败！');
                dtd.reject(that.config.i18n.translate('compReqErr'));
            });
            return dtd.promise();
        },
        /**
         * 音频录制 start
         * @param
         */
        voiceRecordStart: function(callback){
        	var that = this;
        	var url = API_CONFIG.voiceRecordStart;
        	that.__$http(url, 'POST', '').success(function(data){
        		if(data.status === 0){
        			//that.stage.prompter.message('开始录音');
        			callback && callback(data);
        		}else if(data.status === -1){
					that.stage.prompter.message(that.config.i18n.translate('noRecordDevice'));
        		}else if(data.status === -2){
        			//that.stage.prompter.message('正在录音。。。');
                    that.voiceRecordEnd();
                    that.voiceRecordStart(callback);
        		}

        	}).error(function(){
        		that.stage.prompter.message(that.config.i18n.translate('recordErr'));
        	});
        },
        voiceRecordEnd: function(callback){
        	var that = this;
        	var filePath = encodeURIComponent(espEnvironment.location.params.file_path);
        	var url = API_CONFIG.voiceRecordEnd;
        	that.__$http(url, 'POST', {file_path: filePath}).success(function(data){
        		if(data && data.flag){
        			//that.stage.prompter.message("录音完成");
                    var audioFile = {};
                    audioFile.href = that.stage.repository.getResourceUrl(data.href);
                    audioFile.title = data.title;
                    callback && callback(audioFile);
        		}else{
        			that.stage.prompter.message(that.config.i18n.translate('recordErr'));
        		}

        	}).error(function(){
        		that.stage.prompter.message(that.config.i18n.translate('recordErr'));
        	});
 
        },
        /*定时器*/
        timerEvent: function(callback, timer){
            return setTimeout(callback, timer);
        },
        timerGetVoiceVolumn: function(callback){
            var that = this;
            var filePath = encodeURIComponent(espEnvironment.location.params.file_path);
            var url = API_CONFIG.getVoiceVolumn;
            return that.timerEvent(that.__$http(url, 'GET', {file_path: filePath}).success(function(data){
                if(data.flag){
                    callback(data);
                }else{
                    callback(0);
                }
            }).error(function(){
               // that.stage.prompter.message(that.config.i18n.translate('recordErr'));
            }), 300);
            
        },

        /**
         * HTTP GET请求
         * @param url 请求url
         * @returns {*}
         * @private
         */
        __$http: function (url, method, data) {
        	var that = this;
            return that.$http({
            	url: url, 
            	method: method, 
            	data: data
            });
        },
        /*存图片需转base64为blob*/
        // dataURItoBlob: function(dataURI) {
        //     // convert base64/URLEncoded data component to raw binary data held in a string
        //     var binary = atob(dataURI.split(',')[1]);
        //     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        //     var array = [];
        //     for(var i = 0; i < binary.length; i++) {
        //         array.push(binary.charCodeAt(i));
        //     }
        //     return new Blob([new Uint8Array(array)], {type: mimeString});
        // },
        // getSuffix: function(type){
        //     if(type.indexOf("png") !=-1){
        //         return "png";
        //     }
        //     if(type.indexOf("gif")!=-1){
        //         return "gif";
        //     }
        //     if(type.indexOf("bmp")!=-1){
        //         return "bmp";
        //     }
        //     return "jpg";
        // },
        timeformat: function(c){
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
            if(hour === 0){
                str = minuteFormat + '分' + secondFormat + '秒';
            }
            else{
                str = hourFormat + '时' + minuteFormat + '分' + secondFormat + '秒';
            }
            return str;
        }
	};
	return Utils;
});