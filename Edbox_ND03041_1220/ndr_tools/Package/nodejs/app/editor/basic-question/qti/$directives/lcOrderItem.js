define(['require','question-module'],function(require,module){
	var itemType='order';
	var choiceIdentifiers=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'];
	var createChoice=function(identifier){
		return {"identifier":identifier,"text":"","fixed":false,"group_id":"","match_max":1};
	};
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"ordered","base_type":"identifier","corrects":choiceIdentifiers.slice(0,3)};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":true,
			"choices":[createChoice(choiceIdentifiers[0]),createChoice(choiceIdentifiers[1]), createChoice(choiceIdentifiers[2])],
			"min_choices":0,"max_choices":1
		};
	};
	var createFeedbackHint=function(responseIdentifier){
		return {"identifier":"showHint","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	var createFeedbackAnswer=function(responseIdentifier){
		return {"identifier":"showAnswer","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	module.directive("lcOrderItem", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'=',
				defaultKeyword:'='
			},
			templateUrl:'qti/$directives/lcOrderItem.html',
			controller:['$scope',function($scope){
				$scope.selectImage=function(choice){
					$scope.currentChoice=choice;
					$scope.imageDialog.open().openPromise.then(function(){
						$scope.imageSelector.refresh();
					});
					return;
				};
				$scope.onImageSelect=function(item){
					var href=item.actualHref;
					$scope.currentChoice._image=href;
					$scope.imageDialog.close();
				};
				$scope.deleteImage=function(choice){
					delete choice._image;
				};
				$scope.addChoice=function(){
					var a = $scope.assessment;
					if(a.item.choices.length>=choiceIdentifiers.length){
						$console.message($i18n('qti.order.validate.max.choice',choiceIdentifiers.length));
						return;
					}
					var identifier=choiceIdentifiers[a.item.choices.length];
					a.item.choices.push(createChoice(identifier));
					a.response.corrects.push(identifier);
				};
				$scope.removeChoice=function(c){
					$console.confirm($i18n('common.hint.delete'),function(){
						var a = $scope.assessment, deleted=-1;
						for(var i=0,len=a.item.choices.length;i<len;i++){
							if(deleted!=-1){
								for(var j=0;j<a.response.corrects.length;j++){
									if(a.response.corrects[j] == a.item.choices[i].identifier){
										a.response.corrects[j] = choiceIdentifiers[i-1];
										break;
									}
								}
								a.item.choices[i].identifier=choiceIdentifiers[i-1];
							}else if(a.item.choices[i]==c){
								deleted=i;
								var j=0;
								for(;j<a.response.corrects.length;j++){
									if(a.response.corrects[j] == a.item.choices[i].identifier){
										break;
									}
								}
								a.response.corrects.splice(j,1);
							}
						}
						a.item.choices.splice(deleted,1);
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
				for(var i=0,len=scope.assessment.item.choices.length;i<len;i++){
					var c=scope.assessment.item.choices[i];
					if(c.text){
						var el=angular.element('<div>'+c.text+'</div>');
						c._image=el.find('img').attr('src');
						c._text=el.find('p').prop('outerHTML');
					}
				}
				scope.assessment.beforeCommit=function(a,errors){
					if(scope.assessment.item.choices.length<2){
						errors.push({message:$i18n('qti.order.validate.min.choice',2)});
						return false;
					}
					for(var i=0,len=a.item.choices.length;i<len;i++){
						var c=a.item.choices[i];
						var text='';
						if(c._image){
							text+='<img src="'+c._image+'"/>';
						}
						if(c._text){
							var startP = c._text.trim().indexOf("<p")==0;
							text+=startP ? c._text : "<p>"+c._text+"</p>";
						}
						if(!text){
							errors.push({message:$i18n('qti.order.validate.require.choice')});
							return false;
						}
						c.text=text;
					}
					return a;
				};
			}
		};
	}]);
});