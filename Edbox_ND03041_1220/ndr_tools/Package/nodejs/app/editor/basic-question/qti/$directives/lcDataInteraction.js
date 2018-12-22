define(['require','question-module'],function(require,module){
	var itemType='data';
	var createItem=function(){
		return {
			"identifier":null,"type":itemType,"prompt":"","shuffle":false,"min_choices":0,"max_choices":1
		};
	};
	module.directive("lcDataInteraction", [function(){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'='
			},
			controller:['$scope',function($scope){
				$scope.setPromptEditorName=function(name){
					$scope.assessment._defaultEditorName=name;
				};
			}],
			templateUrl:'qti/$directives/lcDataInteraction.html',
			link : function(scope, iElement, iAttrs) {
				if(!scope.assessment){
					scope.assessment={type:itemType};
				};
				scope.assessment._editable=true;
				if(!scope.assessment._width){
					scope.assessment._width=500;
				}
				if(!scope.assessment._height){
					scope.assessment._height=300;
				}
				if(!scope.assessment.item){
					scope.assessment.item=createItem();
				}else{
					if(scope.assessment.item.prompt=='<p/>'){
						scope.assessment.item.prompt='';
					}
				}
			}
		};
	}]);
});