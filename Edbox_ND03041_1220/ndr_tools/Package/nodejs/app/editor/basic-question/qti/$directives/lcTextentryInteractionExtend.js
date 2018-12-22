define(['require','question-module'],function(require,module){
	var createResponse=function(identifier){
		return {"identifier":identifier,"cardinality":"single","base_type":"multipleString","corrects":[""]};
	};
	module.directive("lcTextentryInteractionExtend", ['$identifier','$console','$i18n',function($identifier,$console,$i18n){
		return {
			restrict:'EA',
			replace:true,
			scope:{
				assessment:'=',
				responses:'='
			},
			templateUrl:'qti/$directives/lcTextentryInteractionExtend.html',
			controller:['$scope',function($scope){
				$scope.insertTextEntryInteraction=function(){
					if($scope.assessment.response.length>=50){
						$console.alert($i18n('qti.textentry.validate.max.interaction',50));
						return;
					}
					var editor=CKEDITOR.instances[$scope.assessment._editorName];
					if(editor){
						try{
				            editor.execCommand('textEntryInteraction');
						}catch(e){
							editor.execCommand('textEntryInteraction');
						}
					}
				};
				$scope.removeAnswer=function(deleteEntry){
					$console.confirm($i18n('common.hint.delete'),function(){
						var el = angular.element('<div>'+$scope.assessment.item.prompt+'</div>');
						var entrys=el.find('textentryinteraction');
						for(var i=0;i<entrys.length;i++){
							var entry=entrys[i];
							if(angular.element(entry).attr('responseidentifier')==deleteEntry.identifier){
								angular.element(entry).remove();
								break;
							};
						}
						$scope.assessment.item.prompt=el.html();
					});
				};
			}],
			link : function(scope, iElement, iAttrs) {
			}
		};
	}]);
});