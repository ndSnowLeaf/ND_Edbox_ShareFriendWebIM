define(['require','question-module'],function(require,module){
	var itemType='multiplechoice';
	var choiceIdentifiers=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'];
	var createChoice=function(identifier){
		return {"identifier":identifier,"text":"","fixed":false,"group_id":"","match_max":1};
	};
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"multiple","base_type":"identifier","corrects":[choiceIdentifiers[0]]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false,
			"choices":[createChoice(choiceIdentifiers[0]),createChoice(choiceIdentifiers[1]), createChoice(choiceIdentifiers[2]),createChoice(choiceIdentifiers[3])],
			"min_choices":0,"max_choices":0
		};
	};
	var createFeedbackHint=function(responseIdentifier){
		return {"identifier":"showHint","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	var createFeedbackAnswer=function(responseIdentifier){
		return {"identifier":"showAnswer","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	module.directive("lcMultiplechoiceItem", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'='
			},
			templateUrl:'qti/$directives/lcMultiplechoiceItem.html',
			controller:['$scope',function($scope){
				$scope.addChoice=function(){
					var a = $scope.assessment;
					if(a.item.choices.length>=choiceIdentifiers.length){
						$console.alert($i18n('qti.choice.validate.max.choice',choiceIdentifiers.length));
						return;
					}
					if(a.item.choices.length>=choiceIdentifiers.length){
						return;
					}
					a.item.choices.push(createChoice(choiceIdentifiers[a.item.choices.length]));
				};
				$scope.removeChoice=function(c){
					$console.confirm($i18n('common.hint.delete'),function(){
						var a = $scope.assessment, deleted=-1;
						for(var i=0,len=a.item.choices.length;i<len;i++){
							if(deleted!=-1){
								$scope.answer[choiceIdentifiers[i-1]]=$scope.answer[a.item.choices[i].identifier];
								delete $scope.answer[a.item.choices[i].identifier];
								a.item.choices[i].identifier=choiceIdentifiers[i-1];
							}else if(a.item.choices[i]==c){
								delete $scope.answer[c.identifier];
								deleted=i;
							}
						}
						a.item.choices.splice(deleted,1);
					});
				};
				
				var countMediaContent=function(data){
					if(!data) return 0;
					var match = data.match(/(<img)|(<video)|(<audio)/g);
					return match?match.length:0;
				};
				var countMediaData=function(data){
					if(!data) return 0;
					var match = data.match(/<img(.*?)((src=\"http:)|(data-widget=\"image\")|(data-cke-real-element-type=\"video\")|(data-cke-real-element-type=\"audio\"))/g);
					return match?match.length:0;
				};

				$scope.onChoiceDataChange=function(data,attrs){
					if(countMediaContent(data)>0){
						attrs.$set('editorDisable','image,video,audio,background');
					}else{
						attrs.$set('editorDisable','background');
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
				if(!scope.assessment.feedbackHint){
					scope.assessment.feedbackHint=createFeedbackHint(scope.assessment.response.identifier);
				}
				if(!scope.assessment.feedbackAnswer){
					scope.assessment.feedbackAnswer=createFeedbackAnswer(scope.assessment.response.identifier);
				}
				scope.answer={};
				if(scope.assessment.response.corrects){
					for(var i=0,len=scope.assessment.response.corrects.length;i<len;i++){
						scope.answer[scope.assessment.response.corrects[i]]='1';
					}
				}
				scope.$watch('answer',function(newV){
					scope.assessment.response.corrects=[];
					for(var key in newV){
						if(newV[key]==='1'){
							scope.assessment.response.corrects.push(key);
						}
					}
				},true);
				
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
								errors.push({message:$i18n('qti.choice.validate.repeat.choice',[choices[i].identifier,choices[j].identifier])});
								return false;
							}
						}
					}
					var corrects=scope.assessment.response.corrects;
					if(!corrects || !corrects.length || !corrects[0]){
						errors.push({message:$i18n('qti.choice.validate.require.answer')});
					}
				};
			}
		};
	}]);
});