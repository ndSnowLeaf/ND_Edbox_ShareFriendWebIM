define(['require','question-module'],function(require,module){
	var itemType='inlinechoice';
	var choiceIdentifiers=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'];
	var createChoice=function(identifier){
		return {"identifier":identifier,"text":"","fixed":false,"group_id":"","match_max":1};
	};
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"multiple","base_type":"identifier","corrects":[choiceIdentifiers[0]]};
	};
	var createItem=function(){
		return {
			"identifier":null,"type":itemType,"response_identifier":null,"prompt":"<p><inlinechoiceinteraction responseidentifier=\"1\"></inlinechoiceinteraction><inlinechoiceinteraction responseidentifier=\"2\"></inlinechoiceinteraction></p>","shuffle":false,
			"choices":[],"min_choices":0,"max_choices":0,"children":[]
		};
	};
	var createChildItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false,
			"choices":[createChoice(choiceIdentifiers[0]),createChoice(choiceIdentifiers[1]), createChoice(choiceIdentifiers[2]),createChoice(choiceIdentifiers[3])],
			"min_choices":0,"max_choices":0
		};
	};
	var createFeedbackHint=function(){
		return {"identifier":"showHint","outcomeIdentifier":null,"show_hide":"show","content":""};
	};
	var createFeedbackAnswer=function(){
		return {"identifier":"showAnswer","outcomeIdentifier":null,"show_hide":"show","content":""};
	};
	module.directive("lcInlinechoiceItem", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'=',
				responses:'='
			},
			templateUrl:'qti/$directives/lcInlinechoiceItem.html',
			controller:['$scope',function($scope){
				$scope.insertInteraction=function(){
					if($scope.assessment.response.length>=50){
						$console.alert($i18n('qti.textentry.validate.max.interaction',50));
						return;
					}
					var editor=CKEDITOR.instances[$scope.editorName];
					if(editor){
						try{
				            editor.execCommand('inlinechoiceinteraction');
						}catch(e){
							editor.execCommand('inlinechoiceinteraction');
						}
					}
				};
				$scope.setPromptEditorName=function(name){
					$scope.editorName=name;
				};
				
				$scope.removeInteraction=function(identifier){
					$console.confirm($i18n('common.hint.delete'),function(){
						var el = angular.element('<div>'+$scope.assessment.item.prompt+'</div>');
						var entrys=el.find('inlinechoiceinteraction');
						for(var i=0;i<entrys.length;i++){
							var entry=entrys[i];
							if(angular.element(entry).attr('responseidentifier')==identifier){
								angular.element(entry).remove();
								break;
							};
						}
						$scope.assessment.item.prompt=el.html();
					});
				};
				
				$scope.addChoice=function(item){
					if(item.choices.length>=choiceIdentifiers.length){
						$console.alert($i18n('qti.choice.validate.max.choice',choiceIdentifiers.length));
						return;
					}
					item.choices.push(createChoice(choiceIdentifiers[item.choices.length]));
				};
				$scope.removeChoice=function(item,c){
					$console.confirm($i18n('common.hint.delete'),function(){
						var answer=$scope.answers[item.response_identifier]||{};
						var deleted=-1;
						for(var i=0,len=item.choices.length;i<len;i++){
							if(deleted!=-1){
								answer[choiceIdentifiers[i-1]]=answer[item.choices[i].identifier];
								delete answer[item.choices[i].identifier];
								item.choices[i].identifier=choiceIdentifiers[i-1];
							}else if(item.choices[i]==c){
								delete answer[c.identifier];
								deleted=i;
							}
						}
						item.choices.splice(deleted,1);
					});
				};
			}],
			link : function(scope, iElement, iAttrs) {
				if(!scope.assessment){
					scope.assessment={type:itemType};
				};
				if(!scope.assessment.response){
					scope.assessment.response = scope.responses||[];
				}
				if(!scope.assessment.item){
					scope.assessment.item=createItem();
				}else{
					if(scope.assessment.item.prompt=='<p/>'){
						scope.assessment.item.prompt='';
					}
				}
				if(!scope.assessment.feedbackHint){
					scope.assessment.feedbackHint=createFeedbackHint();
				}
				if(!scope.assessment.feedbackAnswer){
					scope.assessment.feedbackAnswer=createFeedbackAnswer();
				}
				scope.answers={};
				for(var i=0;i<scope.assessment.response.length;i++){
					var r=scope.assessment.response[i];
					var answer = scope.answers[r.identifier]={};
					for(var j=0,len=r.corrects.length;j<len;j++){
						answer[r.corrects[j]]='1';
					}
				}
				scope.$watch('assessment.item.prompt',function(newV){
					var div = angular.element('<div>'+(newV||'')+'</div>');
					var entrys=div.find('inlinechoiceinteraction');
					var tempResponses=scope.assessment.response;
					var tempAnswers=scope.answers;
					var tempItems=scope.assessment.item.children;
					scope.assessment.response=[];
					scope.answers={};
					scope.assessment.item.children=[];
					 
					for(var i=0,len=entrys.length;i<len;i++){
						var id=angular.element(entrys[i]).attr('responseidentifier');
						{
							var f=false;
							for(var j=0;j<tempResponses.length;j++){
								if(tempResponses[j].identifier==id){
									scope.assessment.response.push(tempResponses[j]);
									scope.answers[id]=tempAnswers[id]||{};
									f=true;
									break;
								}
							}
							if(!f){
								scope.assessment.response.push(createResponse(id));
								scope.answers[id]={};
							}
						}
						{
							var f=false;
							for(var j=0;j<tempItems.length;j++){
								if(tempItems[j].response_identifier==id){
									scope.assessment.item.children.push(tempItems[j]);
									f=true;
									break;
								}
							}
							if(!f){
								scope.assessment.item.children.push(createChildItem(id));
							}
						}
					}
				});
				scope.assessment.beforeCommit=function(a,errors){
					var items=scope.assessment.item.children;
					var responses=scope.assessment.response;
					
					if(!items || !items.length){
						errors.push({message:$i18n('qti.textentry.validate.min.interaction',1)});
						return false;
					}
					for(var i=0;i<items.length;i++){
						var choices=items[i].choices;
						if(choices.length<2){
							errors.push({message:$i18n('qti.choice.validate.min.choice',2)});
							return false;
						}
						for(var j=0;j<choices.length;j++){
							for(var k=0;k<choices.length;k++){
								if(j!=k && (choices[j].text||'')==(choices[k].text||'')){
									errors.push({message:$i18n('qti.choice.validate.repeat.choice',[choices[j].identifier,choices[k].identifier])});
									return false;
								}
							}
						}
					}
					for(var i=0;i<responses.length;i++){
						var corrects=responses[i].corrects=[];
						var answer=scope.answers[responses[i].identifier]||{};
						for(var key in answer){
							if(answer[key]==='1'){
								corrects.push(key);
							}
						}
						if(!corrects.length || !corrects[0]){
							errors.push({message:$i18n('qti.choice.validate.require.answer')});
							return;
						}
					}
				};
			}
		};
	}]);
});