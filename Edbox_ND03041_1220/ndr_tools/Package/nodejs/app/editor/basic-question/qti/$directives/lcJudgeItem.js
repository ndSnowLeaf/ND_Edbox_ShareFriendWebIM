define(['require','question-module'],function(require,module){
	var itemType='judge';
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"identifier","corrects":["YES"]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false,"choices":[],"min_choices":0,"max_choices":1
		};
	};
	var createFeedbackHint=function(responseIdentifier){
		return {"identifier":"showHint","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	var createFeedbackAnswer=function(responseIdentifier){
		return {"identifier":"showAnswer","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	module.directive("lcJudgeItem", ['$identifier','$i18n',function($identifier,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'='
			},
			templateUrl:'qti/$directives/lcJudgeItem.html',
			controller:['$scope',function($scope){
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
				console.log(scope.assessment);
				scope.assessment.beforeCommit=function(a,errors){
					if(!scope.assessment.item.choices||scope.assessment.item.choices.length==0){
						scope.assessment.item.choices = [{
							"identifier" : "YES",
							"fixed" : false,
							"text" : $i18n("common.label.yes"),
							"group_id" : "",
							"correct" : false,
							"match_max" : 1
						}, {
							"identifier" : "NO",
							"fixed" : false,
							"text" : $i18n("common.label.no"),
							"group_id" : "",
							"correct" : false,
							"match_max" : 1
						}];
					}
					else{
						for(var i=0;i<scope.assessment.item.choices.length;i++){
							if(scope.assessment.item.choices[i].identifier == 'YES'){
								scope.assessment.item.choices[i].text=$i18n("common.label.yes");
							}
							if(scope.assessment.item.choices[i].identifier == 'NO'){
								scope.assessment.item.choices[i].text=$i18n("common.label.no");
							}
						}
					}
				}
			}
				
		};
	}]);
});