define(['require','question-module'],function(require,module){
	var itemType='vote';
	var choiceIdentifiers=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var createChoice=function(identifier){
		return {"identifier":identifier,"text":"","fixed":false,"group_id":"","match_max":1};
	};
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"identifier","corrects":[]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false,
			"choices":[createChoice(choiceIdentifiers[0]),createChoice(choiceIdentifiers[1]), createChoice(choiceIdentifiers[2]),createChoice(choiceIdentifiers[3])],
			"min_choices":0,"max_choices":1
		};
	};
	var identifierPrefix='ndvote_';
	module.directive("lcVoteItem", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'='
			},
			templateUrl:'qti/$directives/lcVoteItem.html',
			controller:['$scope',function($scope){
				function resetChoiceIdentifier(){
					var a = $scope.assessment;
					var b=a.item.choices.length>26;
					for(var i=0;i<a.item.choices.length;i++){
						a.item.choices[i].identifier=b?(identifierPrefix+(i+1)):choiceIdentifiers[i];
					}
				}
				
				$scope.filterChoiceIdentifier=function(identifier){
					if(identifier.indexOf(identifierPrefix)==0){
						identifier=identifier.substring(identifierPrefix.length);
					}
					return identifier;
				};
				
				$scope.addChoice=function(){
					var a = $scope.assessment;
					if(a.item.choices.length>=50){
						$console.alert($i18n('qti.choice.validate.max.choice',50));
						return;
					}
					a.item.choices.push(createChoice());
					resetChoiceIdentifier();
				};
				
				function isEmpty(value) {
					if(angular.isUndefined(value) || value === '' || value === null || value !== value){
						return true;
					}
					value=value.replace(/(&nbsp;)|\s|(<div class=\"background_image\"[^>]*>)/g,'');
					return value=='<p></p>'||value=='<p></p></div>'||value=='</div>';
				}
				function doRemoveChoice(c){
					var a = $scope.assessment;
					for(var i=0,len=a.item.choices.length;i<len;i++){
						if(a.item.choices[i]==c){
							a.item.choices.splice(i,1);
							resetChoiceIdentifier();
							break;
						}
					}
				}
				$scope.removeChoice=function(c){
					if($scope.assessment.item.choices.length<=2){
						$console.alert($i18n('qti.choice.validate.min.choice',2));
						return;
					}
					if(isEmpty(c.text)){
						doRemoveChoice(c);
					}else{
						$console.confirm($i18n('common.hint.delete'),function(){
							doRemoveChoice(c);
						});
					}
				};
				
				var countMediaContent=function(data){
					if(!data) return 0;
					var match = data.match(/(<img)|(<video)|(<audio)/g);
					return match?match.length:0;
				};
				var countMediaData=function(data){
					if(!data) return 0;
					var match = data.match(/<img(.*?)((src=\"http:)|(data-widget=\"image\"))/g);
					return match?match.length:0;
				};
				var countVideoAudioData=function(data){
					if(!data) return 0;
					var match = data.match(/<img(.*?)((data-cke-real-element-type=\"video\")|(data-cke-real-element-type=\"audio\"))/g);
					return match?match.length:0;
				};
				$scope.onChoiceDataChange=function(data,attrs){
					if(countMediaContent(data)>0){
						attrs.$set('editorDisable','background,horizontalrule,table,image,video,audio,math');
					}else{
						attrs.$set('editorDisable','background,horizontalrule,table,video,audio,math');
					}
				};
				$scope.onChoiceEditorCreated=function(ckeditor){
					ckeditor.on('paste',function(evt){
						var data=evt.editor.getData();
						var dataValueMediaCount = countMediaData(evt.data.dataValue);
						if(dataValueMediaCount>1 || (dataValueMediaCount>0 && countMediaContent(data)>0)){
							$console.message($i18n('qti.choice.validate.no_allow_multi_media.choice'));
							evt.stop();
						}
						var videoAudioCount = countVideoAudioData(evt.data.dataValue);
						if(videoAudioCount){
							$console.message($i18n('qti.choice.validate.no_allow_multi_media.choice'));
							evt.stop();
						}
					});
				};
			}],
			link : function(scope, iElement, iAttrs) {
				if(!scope.assessment){
					scope.assessment={type:itemType};
				};
				if(!scope.assessment.response){
					scope.assessment.response=createResponse('s-'+$identifier.guid());
				}
				if(!scope.assessment.item){
					scope.assessment.item=createItem(scope.assessment.response.identifier);
				}
				
				var trimText=function(text){
					if(!text) return text;
					return text.replace(/(^<p>((&nbsp;)|\s)*)|(((&nbsp;)|\s)*<\/p>\s*$)/gmi,'');
				};
				scope.assessment.beforeCommit=function(a,errors){
					var choices=scope.assessment.item.choices;
					if(choices.length<2){
						errors.push({message:$i18n('qti.choice.validate.min.choice',2)});
						return false;
					}
					for(var i=0;i<choices.length;i++){
						for(var j=0;j<choices.length;j++){
							if(i!=j && trimText(choices[i].text)==trimText(choices[j].text)){
								errors.push({message:$i18n('qti.choice.validate.repeat.choice',[scope.filterChoiceIdentifier(choices[i].identifier),scope.filterChoiceIdentifier(choices[j].identifier)])});
								return false;
							}
						}
					}
					for(var i=0;i<choices.length;i++){
						var c=choices[i];
						c.text=c.text.replace(/^<p>&nbsp;\s?/,'<p>');
					}
				};
			}
		};
	}]);
});