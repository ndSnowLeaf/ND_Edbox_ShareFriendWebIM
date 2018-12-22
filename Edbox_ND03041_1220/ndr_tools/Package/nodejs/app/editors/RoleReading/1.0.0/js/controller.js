define(['./sectionsModule.js', './utils.js', 'espEnvironment'], function(SectionsModule, Utils, espEnvironment) {
	var DRAG_CONFIG = {
		'animation': 150, // ms, animation speed moving items when sorting, `0` — without animation
		'handle': "> .listbox > .sortHand",
		'chosenClass': "word_list_active"
	};
	var sectionsModule = angular.module('SectionsModule');
	//控制器
	sectionsModule.controller('SectionsController', Controller);

	Controller.$inejct = ['$scope','$http', '$element', '$q', '$timeout', 'editor', 'module', 'stage', 'config','$filter'];

	var DEFAULT_DATA={
		"maxRoleCoun": 4
	}
	
	function Controller($scope, $http, $element, $q, $timeout, editor, module, stage, config,$filter) {
		var utils = new Utils($q, stage, $http, config);
		/*未分配角色*/
		$scope.i18nData = config._i18n._data;
		$scope.defaultRole = {
			"id": -1,
			"preset": false,
			"picture": module.editorRepository.getResourceUrl('/resources/wood/images/icons_df.png') /*角色图片*/
	    };
	    /*预置角色*/
	    $scope.presetRoles = [
	    	/*'father': */{
	    		'id': '1',
	    		'preset': true,
	    		'picture': module.editorRepository.getResourceUrl('/resources/wood/images/icons_fr.png') 
	    	},
	    	/*'mother': */{
	    		'id': '2',
	    		'preset': true,
	    		'picture': module.editorRepository.getResourceUrl('/resources/wood/images/icons_mr.png') 
	    	},
	    	/*'son': */{
	    		'id': '3',
	    		'preset': true,
	    		'picture': module.editorRepository.getResourceUrl('/resources/wood/images/icons_by.png') 
	    	},
	    	/*'daughter': */{
	    		'id': '4',
	    		'preset': true,
	    		'picture': module.editorRepository.getResourceUrl('/resources/wood/images/icons_gl.png') 
	    	}
		];
		
		/*资源库获取的图片对象*/
		$scope.portrait = null;
		/*裁剪图片后的坐标*/
		$scope.cropContext = {};
		/*添加角色框*/
		$scope.showSelRoleBox = false;
		/*音频选择框*/
		$scope.showSelBox = false;
		/*cropper指令下的img对象。用于canvas裁剪用。后期看能不能不用这个。。。*/
		$scope.cropperImgId = '';
		/*录制音频框*/
		$scope.showRecordBox = false;
		/*清空所有句子框*/
		$scope.showCleAllBox = false;
		/*删除角色框*/
		$scope.showDelRoleBox = false;
		/*总时长*/
		$scope.totalReadTime = '00:00:00';

		// $scope.roles = [{
		// 	"id": 1,
		// 	/*角色ID*/
		// 	"preset": true,
		// 	/*预置角色*/
		// 	"picture": "../resources/wood/images/paixu_voice_pause.png" /*角色图片*/
		// }, {
		// 	"id": 2,
		// 	/*角色ID*/
		// 	"preset": false,
		// 	/*预置角色*/
		// 	"picture": "../resources/wood/images/paixu_voice_play.png" /*角色图片*/
		// }, {
		// 	"id": -1,
		// 	/*角色ID*/
		// 	"preset": false,
		// 	/*预置角色*/
		// 	"picture": "../resources/wood/images/default.png" /*角色图片*/
		// }];
		// $scope.sections = [{
		// 	"sectionId": "UUID1",
		// 	/*句子标识*/
		// 	"content": "Where are you from?",
		// 	/*句子内容*/
		// 	"voice": "http://cs.101.com/v0.1/static/edu_product/esp/assets/ab9e5b79-4cbf-4812-8902-2d1f793d5cdf.pkg/transcode/audios/16f31a50844b4f45b176b9daae136112.mp3",
		// 	/*标准发音路径*/
		// 	"role": 1, /*角色ID, 对应roles节点中的id*/
		// 	"isCompoVoice": false
		// }, {
		// 	"sectionId": "UUID2",
		// 	"content": "I'm from China",
		// 	"voice": "http://cs.101.com/v0.1/static/edu_product/esp/assets/ab9e5b79-4cbf-4812-8902-2d1f793d5cdf.pkg/transcode/audios/16f31a50844b4f45b176b9daae136112.mp3",
		// 	"role": 2,
		// 	"isCompoVoice": false
		// }, {
		// 	"sectionId": "UUID3",
		// 	"content": "What's your name?",
		// 	"voice": "",
		// 	"role": 1,
		// 	"isCompoVoice": true
		// }];
		
		/*修改预置角色的顺序，左新右旧*/
		$scope.sortPresetRoles = function(){
			var presetRoles = $.extend(true, [], $scope.presetRoles);
			var presetRoleArr = [];
			for(var i=$scope.roles.length-1; i>=0; i--){
				var role = $scope.roles[i];
				if(role.preset){
					presetRoleArr.push(role);
				}
			}
			var defRole;
			var oldRole;
			for(var j=0; j<presetRoleArr.length; j++){
				for(var k=0; k<presetRoles.length; k++){
					if(presetRoles[k].id === presetRoleArr[j].id){
						presetRoles.splice(k, 1);
						break;
					}
				}
			}
			for(var m=0; m<presetRoleArr.length; m++){
				presetRoles.push(presetRoleArr[m]);
			}
			
			$scope.presetRoles = presetRoles;
		}
		
		$scope.init = function(){
			/*标题*/
			$scope.panelTitle = module.getPropertyValue("QuesitonTitle");
			var questionContent = module.getPropertyValue("QuestionContent");
            $scope.roles = questionContent && questionContent.roles || [$scope.defaultRole];
            $scope.sections = questionContent && questionContent.sections || [];
			$scope.sortPresetRoles();
		}
		$scope.init();
		
		/*添加角色*/
		$scope.addRole = function(role){
			if($scope.isExistRole(role)){
				stage.prompter.message(config.i18n.translate('existRole'));
				return;
			}else{
				$scope.changeSelRoleBox(false);
				$scope.roles.splice($scope.roles.length, 0, role);
				$scope.sortPresetRoles();
			}
		}

		/*尚未添加任何角色提示*/
		$scope.noRoleTip = function(){
			stage.prompter.message(config.i18n.translate('noRole'));
		};
		/*创建新角色*/
		$scope.createRole = function(src, preset) {
			var uuid = utils.getUuid();
			var role = {
				"id": uuid,
				"preset": preset,
				"picture": src
			};
			return role;
		};
		/*判断是否已存在角色*/
		$scope.isExistRole = function(role){
			for(var i=0; i<$scope.roles.length; i++){
				var roleObj = $scope.roles[i];
				if(roleObj.id === role.id || roleObj.picture === role.picture){
					return true;
				}
			}
			return false;
		};
		/*删除角色*/
		$scope.deleteRole = function(index) {
			var role = $scope.roles[index];
			$scope.roles.splice(index, 1);
			/*把section部分的role值改为默认-1*/
			angular.forEach($scope.sections, function(section, index) {
				if (section.role === role.id) {
					/*通知section调setRole方法*/
					$scope.$broadcast('updateRole', section);
				}
			});
			$scope.sortPresetRoles();
		};
		/*添加句子*/
		$scope.addSection = function() {
			var uuid = utils.getUuid();
			var section = {
				"sectionId": uuid,
				"content": "",
				"voice": "",
				"voiceName": "",
				"role": -1,
				'isCompoVoice': true
			}
			$scope.sections.splice($scope.sections.length, 0, section);
		};
		/*删除句子根据index*/
		$scope.deleteSection = function(secItem) {
			for(var i=0; i<$scope.sections.length; i++){
				if($scope.sections[i].sectionId === secItem.sectionId){
					$scope.sections.splice(i, 1);
					break;
				}
			}

		};
		/*清空页面下的所有句子*/
		$scope.deleteAllSection = function(){
			$scope.sections = [];
		}
		/*拖拽排序后更新sections*/
		$scope.sortSections = function(oldIndex, newIndex) {
			var section = $scope.sections[oldIndex];
			$scope.sections.splice(oldIndex, 1);
			$scope.sections.splice(newIndex, 0, section);
		};
		
		/*选择图片*/
		$scope.selectImage = function(){
			utils.selectImage(function(items){
				//$scope.portrait = items;
				/*通知设置图像进行裁剪*/
				//$scope.$broadcast('setCropImg', items.href);
				$scope.addRole($scope.createRole(items.href, false));
			});
			
		};
		/*选择音频*/
		$scope.selectAudio = function(){
			utils.selectAudio(function(items){
				$scope.$broadcast('setCurSecVoice', items);
			});
		};
		/*是否显示选择角色框*/
		$scope.changeSelRoleBox = function(visibility){
			if($scope.roles.length >=5){
				//stage.prompter.message(config.i18n.translate('maxRole4'));
				return;
			}
			$scope.showSelRoleBox = visibility;
		};
		/*是否显示选择框*/
		$scope.changeSelBox = function(visibility){
			$scope.showSelBox = visibility;
		};
		/*是否显示录制音频框*/
		$scope.changeRecBox = function(visibility){
			$scope.showRecordBox = visibility;
		}
		/*是否显示清空所有句子框*/
		$scope.changeCleAllBox = function(visibility){
			if($scope.sections.length === 0){
				$scope.showCleAllBox = false;
				return;
			}
			$scope.showCleAllBox = visibility;
		};
		/*是否显示删除角色框*/
		$scope.changeDelRoleBox = function(visibility, roleIndex){
			$scope.showDelRoleBox = visibility;
			$scope.delRoleIndex = roleIndex;
			$scope.secWidthRoleCount = 0;
			angular.forEach($scope.sections, function(section, index) {
				if ($scope.roles[roleIndex] && (section.role === $scope.roles[roleIndex].id)) {
					/*通知section调setRole方法*/
					$scope.secWidthRoleCount ++;
				}
			});
			//$scope.deleteMessage = $filter('translate')('curHasSecWidthRole','{count:'+$scope.secWidthRoleCount+'}')
		}
		/*开始录制*/
		$scope.startRecord = function(event, callback){
			utils.voiceRecordStart(function(data){
				callback && callback();
			});
		};
		/*结束录制*/
		$scope.stopRecord = function(event, callback){
			utils.voiceRecordEnd(function(data){
			//	$scope.$broadcast('setCurSecVoice', audioUrl);
				callback && callback(data);
			});
		};
		/*获取录制音量*/
		$scope.getVoiceVolumn = function(event, callback){
			scope.getVVTimer = utils.timerGetVoiceVolumn(function(data){
			//	$scope.$broadcast('setCurSecVoice', audioUrl);
				callback && callback(data);
			});
		};
		$scope.stopGetVoiceVolumn = function(){
			$timeout.cancel(scope.getVVTimer);
		}

		function dataURLtoBlob(dataurl) {
		    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		    while(n--){
		        u8arr[n] = bstr.charCodeAt(n);
		    }
		    return new Blob([u8arr], {type:mime});
		};

		/*裁剪图片*/
		function canvasCrop(imgTarget, imgObj, cropObj, callback){
			if(imgTarget && !$.isEmptyObject(cropObj)){
				var imgDom = $(imgTarget).get(0);
				imgDom.crossOrigin="anonymous"; //关键
				var crop_canvas = document.createElement('canvas');
				crop_canvas.width = cropObj.width;  
    			crop_canvas.height = cropObj.height;  
			    crop_canvas.getContext('2d').drawImage(imgDom, cropObj.left, cropObj.top, cropObj.width, cropObj.height, 0, 0, cropObj.width, cropObj.height);  

			    var blob = crop_canvas.toBlob(function(blob){
			    	var file = new File([blob],'uuid.png');
			    	stage.repository.getFileWriter()(file, "resource").then(function(result){
                    	var item = result;
                    	var url = result.tech_info.href.location;
                    	var full = stage.repository.getResourceUrl(url);
                    	/*获取大小*/
	                    if(item.tech_info&&item.tech_info.href&&item.tech_info.href.requirements){
	                        var requirement = item.tech_info.href.requirements[0];
	                        if(requirement&&requirement.name=='resolution'){
	                            item.resolution = requirement.value;
	                        }
	                    }
	                    item.href = full;
	                    //var options = utils.fixImageOptions(item);
	                    //$scope.$emit('addElement',options);
	                    
	                    callback && callback(full);
	                    $timeout();

	                });
			    }, imgObj.format);

			    // var file = new File([input], "filename."+imgObj.format);
			    // 
			 //   return dataURLtoBlob(crop_canvas.toDataURL(imgObj.format));  
			}else{
				return false;
			}
			
		};
		$scope.confirmCut = function(imgTarget, imgObj, cropObj){
			canvasCrop(imgTarget, imgObj, cropObj, function(full){
				$scope.addRole($scope.createRole(full, false));
				$scope.portrait = null;
				/*通知设置图像进行裁剪*/
				$scope.$broadcast('setCropImg', '');
			});
		};
	

		/*取合成音*/
		// $scope.getCompoVoice = function(section, body){
		// 	var dtd = $.Deferred();
		// 	utils.getSpell2AudioBySpeechSynthesis(body, function(data){
		// 		section.isCompoVoice = true;
		// 		section.voice = data.audioUrl;
		// 		dtd.resolve(); 
		// 	});
		// 	return dtd.promise();
		// };
		 $scope.getCompoVoice = function(section, body){
			return utils.getSpell2AudioBySpeechSynthesis(body, function(data){
				section.isCompoVoice = true;
				section.voice = data.href;
				if(data.title.indexOf('.')!= -1){
					section.voiceName = data.title.split('.')[0];
				}else{
					section.voiceName = data.title;
				}
				
			});
		};	
		/*获取句子里用的角色*/
		$scope.getSectionsRoles = function(){
			var sectionsRoles = [];
			var sectionsRolesId = [];
			for(var i=0; i<$scope.sections.length; i++){
				var section = $scope.sections[i];
				if(sectionsRolesId.indexOf(section.role) === -1){
					sectionsRolesId.push(section.role);
				}
			}
			for(var j=0; j<sectionsRolesId.length; j++){
				for(var k=0; k<$scope.roles.length; k++){
					var role = $scope.roles[k];
					if(role.id === sectionsRolesId[j]){
						sectionsRoles.push(role);
					}
				}
				
			}
			return sectionsRoles;
		}
		/*监听sections的值计算totalReadTime值*/
		//$scope.$watchArray('sections',function(){}
		//$scope.$watch('sections + roles', function(newValue, oldValue){
		$scope.countTotalTime = function(){
			//if (newValue === oldValue) { return; }
			var wordReg = /(\w+[\'\`\-]?\w*)/g;
			var sectionsTime = 0;
			for(var i=0; i<$scope.sections.length; i++){
				var section = $scope.sections[i];
				if(section.voice === '' && section.content){
					var words = section.content.match(wordReg);
					var wordLength = words? words.length: 0;
					//sectionsTime += (1 + wordLength*0.5);
					sectionsTime += (wordLength*0.5);
				}else{
					sectionsTime += (isNaN(section.voiceTime)? 0: section.voiceTime);
				}
			}
			var countRolesLen = $scope.getSectionsRoles().length;
			$scope.totalReadTime = utils.timeformat(sectionsTime * countRolesLen);
			return $scope.totalReadTime;
		}
		/*拖拽排序*/
		$scope.sortableOptions = {
			'ui-floating': true,
		    'handle': DRAG_CONFIG.handle,
		    'dropOnEmpty': false,
		    'start': function(event, ui){
		    	ui.item.addClass(DRAG_CONFIG.chosenClass); 
		    	$scope.$broadcast('stopPlayVoice');
		    },
		    'stop': function(event, ui){		    	 
		    	ui.placeholder.remove();
		    	$('.'+DRAG_CONFIG.chosenClass).removeClass(DRAG_CONFIG.chosenClass);
		    	//$scope.$broadcast('updateAllRoleObj');
		    }
		};
		
		/*范例打开*/
		$scope.openSample = function(){
	        var params = $.extend({},espEnvironment.location.params);
	        params.old_identifier =params.id;
	        params.old_file_path = params.file_path;
	        delete params.file_path;
	        var url = espEnvironment.url.makeRoot('/basic-question/question.html#')('import_sample' , params);
	        stage.prompter.dialog({
	            title: config.i18n.translate('importSample'),
	            //content: '<div><iframe src="'+url+'" style="width:100%;height:100%;border:none;"></iframe></div>',
	            src: url,
	            width: 1200,
	            height: 840
	        });
	    };

		/*外部事件*/
		/*保存数据*/
		editor.save = function(){
			//console.log($scope.sections);
			// console.log($scope.roles);
			//console.log(module.editorId);
			$scope.$broadcast('stopPlayVoice');
			if($scope.sections.length === 0){
				stage.prompter.message(config.i18n.translate('inputAtLeastASec'));
				return false;
			}
			if($.trim($scope.panelTitle) === ''){
				// stage.prompter.message(config.i18n.translate('inputTitle'));
				// return false;
				$scope.panelTitle = config.i18n.translate('rolereading');
				$timeout();
			}
			var dtd = $.Deferred();
			var dtdArr = [];	
			for(var i=0; i<$scope.sections.length; i++){
				var section = $scope.sections[i];
				// if(module.editorId === 'RoleReading' && section.role === -1){
				// 	stage.prompter.message(config.i18n.translate('selectRoleForSec'));
				// 	return false;
				// }
				if(!$.trim(section.content)){
					stage.prompter.message(config.i18n.translate('inputContnet'));
					return false;
				}
				if(section.voice === ''){
					var text = section.content;
					var lang = 'en';
					var tone = '';
					if(section.role === '2'){/*妈妈*/
						tone = 'W1';
					}else if(section.role === '3'){/*儿子*/
						tone = 'M2';
					}else if(section.role === '4'){/*女儿*/
						tone = 'W2';
					}else{/*爸爸和其他*/
						tone = 'M1';
					}
					var body = {
		            	'text': text,
		            	'lang': lang,
		            	'tone': tone
		            };
		            dtdArr.push($scope.getCompoVoice(section, body));
		            
				}
			}
			$.when.apply($, dtdArr).done(function(){
				var questionContent;
				if(module.editorId === "RoleReading"){
					questionContent = {
						'roles': $scope.roles,
						'sections': $scope.sections,
						'sectionsRoles': $scope.getSectionsRoles()
					}
				}else{
					questionContent = {
						'sections': $scope.sections
					}
				}
				
				module.setPropertyValue("QuestionId", stage.coursewareobjectId);
				module.setPropertyValue("QuestionType", 'RoleReading');
	            module.setPropertyValue("QuesitonTitle", $scope.panelTitle);
	            module.setPropertyValue("QuestionContent", questionContent);
	            dtd.resolve(module);
			}).fail(function(res){
				dtd.reject(res);
			});
			return dtd.promise();		
		 	
		};

	}

});