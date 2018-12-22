define(['question-module'],function(module){
	module.directive('ndRepeatFinished',['$timeout',function($timeout){
		return {
			restrict:'A',
			scope:{
				eventName:'@ndRepeatFinished'
			},
			link:function(scope,element,attr){
				if(scope.$parent.$last===true){
					$timeout(function(){
						scope.$emit(scope.eventName);
					});
				}
			}
		};
	}]);
});