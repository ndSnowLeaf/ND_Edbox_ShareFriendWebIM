define(['../sectionsModule.js', '../../templates/all_template.js'], function(module, tpls) {
	
	var sectionsModule = angular.module('SectionsModule');

	//角色指令
	sectionsModule.directive('role', function() {
		return {
			restrict: 'EA',
			scope: {
				role: '=roleData',
				index: '=',
				deleteRole: '&',
				changeDelRoleBox: '&'
			},
			replace: true,
			transclude: true,
			//template : '<div><img ng-if="section.role != undefined && role.picture" ng-src="{{role.picture}}"/></div>',
			template: tpls.roleTpl,
			link: function(scope, element, attrs) {

				/*删除角色*/
				scope.delete = function() {
					// scope.deleteRole({
					// 	index: scope.index
					// });
					scope.changeDelRoleBox({visibility: true, roleIndex: scope.index});
				}
			}
		};

	});
	//sections指令，包括角色，句子，音频
	sectionsModule.directive('section', ['$sce', '$timeout', function($sce, $timeout) {
		return {
			restrict: 'AE',
			scope: {
				section: '=sectionData',
				index: '=',
				roles: '=rolesData',
				deleteSection: '&',
				changeSelBox: '&',
				defaultRole: '=',
				noRoleTip: '&'
			},
			replace: true,
			transclude: true,
			template: tpls.sectionTpl,
			require: '^?sectionsmain',
			link: function(scope, element, attrs, sectionsmainCtrl) {
				/*是否是编辑态*/
				scope.isEdit = false;
				
				/*加到sectionMain里*/
				sectionsmainCtrl.addSection(scope);
				/*显示隐藏ul*/
				scope.showRolesUl = false;
				/*动态绑定音频src*/
				scope.sce = $sce.trustAsResourceUrl;

				var audio = element.find('audio').get(0);

				scope.toggleUl = function() {
					if(scope.roles.length === 1){
						scope.noRoleTip();
					}
					scope.showRolesUl = !scope.showRolesUl;
					/*其他section隐藏*/
					sectionsmainCtrl.selectToggleUl(scope);
				};
				/*改变编辑态*/
				scope.changeEdit = function(isEdit){
					scope.isEdit = isEdit;	
					if(isEdit){
						sectionsmainCtrl.selectChangeEdit(scope);
					}		
				};
			
				/*设置role值*/
				scope.setRole = function(roleId) {
					if (scope.section.role === roleId) {
						return;
					} else {
						scope.section.role = roleId;
					}
				};
				scope.getRoleImg = function(roleId){
					var roleImg = '';
					for (var i = 0; i < scope.roles.length; i++) {
						var role = scope.roles[i];
						if (scope.section.role == role.id) {
							roleImg = role.picture;
							break;
						}
					}
					return roleImg;
				}
				/*删除section*/
				scope.delete = function() {
					// scope.deleteSection({
					// 	index: scope.index
					// });
					scope.deleteSection({secItem: scope.section});
					//sectionsmainCtrl.deleteSectionScope(scope);
				};

				
				// function timeformat(c){
				// 	var hour, minute, second;
				// 	hour = parseInt(c / 3600);// 小时数  
				// 	minute = parseInt(c / 60);// 分钟数  
				//     if(minute >= 60){  
				//         minute = minute%60
				//     }  
				//     second = parseInt(c % 60);  
				//     var hourFormat = hour < 10? '0'+hour: hour;
				//     var minuteFormat = minute < 10? '0'+minute: minute;
				//     var secondFormat = second < 10? '0'+second: second;
				//   	return minuteFormat + '分' + secondFormat + '秒';
				// };

				/*设置音频
				 *voice: 音频src
				 *isCompoVoice：true是合成音，false不是合成音
				 */
				scope.setVoice = function(voiceFile, isCompoVoice) {
					scope.end();
					if(voiceFile instanceof Object){
						scope.section.voice = voiceFile.href;
						if(voiceFile.title.indexOf('.')!= -1){
							scope.section.voiceName = voiceFile.title.split('.')[0];
						}else{
							scope.section.voiceName = voiceFile.title;
						}
						
						scope.section.isCompoVoice = isCompoVoice;
						//scope.section.voiceTime = audio.duration;
						//scope.section.voiceTime = 0;
					}else{
						scope.section.voice = '';
						scope.section.voiceName = '';
						scope.section.isCompoVoice = isCompoVoice;
						scope.section.voiceTime = 0;
					}
					scope.changeSelBox({
						visibility: false
					});
				};
				/*监听音频时长*/
				audio.addEventListener("canplay", function(){
					scope.section.voiceTime=parseInt(audio.duration);
					$timeout();
				})
				/*播放暂停按钮*/
				scope.playPause = function() {
					//scope.section.voiceTime = utils.timeformat(audio.duration);
					// sectionsmainCtrl.setCurSection(scope);
					if (audio.paused) {
						scope.play();
						/*其他section暂停*/
						sectionsmainCtrl.selectPlay(scope);
					} 
				}

				/*播放*/
				scope.play = function() {
					audio.play();
				};
				/*暂停*/
				scope.pause = function() {
					audio.pause();

				};
				/*停止*/
				scope.end = function() {
					audio.pause();
					audio.currentTime = 0;
					//audio.currentTime = audio.duration;
				};

				/*点击添加标准读音或增加按钮时*/
				scope.selectThis = function() {
					/*弹框选择资源库音频或录制*/
					sectionsmainCtrl.setCurSection(scope);
					scope.changeSelBox({
						visibility: true
					});

				};
			},
			controller: ('sectionCtrl', ['$scope', function(scope) {
				/*接收删除角色时的事件*/
				scope.$on('updateRole', function(event, section) {
					if (scope.section.sectionId === section.sectionId) {
						scope.setRole(-1);
					}
				});
			}])
		};

	}]);
	//sectionsmain指令，包括多个sections
	//用于判断当前选中的section，控制左边ul显示
	//用于删除角色的时候，遍历section
	sectionsModule.directive('sectionsmain', function() {
		return {
			restrict: 'AE',
			replace: true,
			transclude: true,
			controller: ('sectionsmainCtrl', ['$scope', function(scope) {
				scope.sectionArr = [];
				scope.curSection = null;
				this.addSection = function(section) {
					scope.sectionArr.push(section);
					console.log(scope.sectionArr);
				};
				this.deleteSectionScope = function(section){
					for (var i = 0; i < scope.sectionArr.length; i++) {
						if (scope.sectionArr[i] === section) {
							scope.sectionArr.splice(i, 1);
							break;
						}
					}

				}
				this.selectToggleUl = function(selectSection) {
					for (var i = 0; i < scope.sectionArr.length; i++) {
						if (scope.sectionArr[i] !== selectSection) {
							scope.sectionArr[i].showRolesUl = false;
						}
					}
				};
				this.selectPlay = function(selectSection) {
					for (var i = 0; i < scope.sectionArr.length; i++) {
						if (scope.sectionArr[i] !== selectSection) {
							scope.sectionArr[i].end();
						}
					}
				};
				this.setCurSection = function(section) {
					scope.curSection = section;
					/*有音频播放就暂停*/
					for (var i = 0; i < scope.sectionArr.length; i++) {
						scope.sectionArr[i].end();
					}
				};
				this.selectChangeEdit = function(selectSection){
					for (var i = 0; i < scope.sectionArr.length; i++) {
						if (scope.sectionArr[i] !== selectSection) {
							scope.sectionArr[i].changeEdit(false);
						}
					}
				}

				/*controller添加音频成功后，修改curSection的voice*/
				scope.$on('setCurSecVoice', function(event, recordFile) {
					if (scope.curSection) {
						scope.curSection.setVoice(recordFile, false);
						scope.curSection = null;
					}
				});
		
				scope.$on('stopPlayVoice', function(event){
					for (var i = 0; i < scope.sectionArr.length; i++) {
						scope.sectionArr[i].end();
					}
				});
				
			}])
		};
	});

});