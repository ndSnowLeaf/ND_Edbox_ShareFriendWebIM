define(['require','question-module'],function(require,module){
	var itemType='data';
	var createItem=function(){
		return {
			"identifier":null,"type":itemType,"prompt":"","shuffle":false,"min_choices":0,"max_choices":1
		};
	};
	module.directive("lcDataItem", [function(){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'='
			},
			templateUrl:'qti/$directives/lcDataItem.html',
			controller:['$scope',function($scope){
			}],
			link : function(scope, iElement, iAttrs) {
				if(!scope.assessment){
					scope.assessment={type:itemType};
				};
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