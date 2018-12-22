define(['require','question-module'],function(require,module){
	var itemType='extendedtext';
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"string","corrects":[""]};
	};
	var createItem=function(responseIdentifier){
		return {
			"identifier":null,"type":itemType,"response_identifier":responseIdentifier,"prompt":"","shuffle":false
		};
	};
	var createFeedbackHint=function(responseIdentifier){
		return {"identifier":"showHint","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	var createFeedbackAnswer=function(responseIdentifier){
		return {"identifier":"showAnswer","outcomeIdentifier":responseIdentifier,"show_hide":"show","content":""};
	};
	module.directive("lcExtendedtextItem", ['$identifier',function($identifier){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'='
			},
			templateUrl:'qti/$directives/lcExtendedtextItem.html',
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
			}
		};
	}]);
});